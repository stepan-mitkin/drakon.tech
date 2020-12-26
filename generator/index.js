const fse = require('fs-extra')
const axios = require("axios");
var express = require('express');
var bodyParser = require('body-parser')
const _ = require("lodash")
const genserver = require("./genserver")
const winston = require("winston")


var app = express();

app.use(bodyParser.json())


const globals = {
    builds: {}
}



const config = {
    port: 7650,
    dtPort: 8090,
    user: "internal_generator",
    password: "123456",
    genPath: "/dkt/gen"
}

var logOptions = {
    file: {
        level: 'info',
        filename: "/dkt/logs/generator.log",
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

var wlogger = winston.createLogger({
    transports: [
        new winston.transports.File(logOptions.file),
        new winston.transports.Console(logOptions.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

function buildLogPayload(obj, src) {
    var payload
    if (obj instanceof Error) {
        payload = {
            message: obj.toString(),
            src: src
        }
    } else if (typeof obj === "string") {
        payload = {
            message: obj
        }
    } else {
        payload = obj
    }
    payload.time = new Date().toISOString()
    return payload
}

var logger = {
    error: function(obj, src) {
        var payload = buildLogPayload(obj, src)
        wlogger.error(payload)
    },
    info: function(obj) {
        var payload = buildLogPayload(obj)
        wlogger.info(payload)  
    }
}

wlogger.stream = {
    write: function(message, encoding){
        wlogger.info(message);
    }
};

app.post('/private/:space/:folder', async function (req, res) {
    try {
        var result = await createBuild(req)
        if (result.ok) {
            var url = "/api/build/" + result.id
            res.json({url})
        } else {
            res.status(400)
            res.json({message: result.message})
        }
    } catch (e) {
        logger.error(e)
        res.status(500)
        res.json({error:"ERR_SERVER"})
    }
})

app.get('/build/:id', function (req, res) {
    try {
        var record = globals.builds[req.params.id]
        if (!record || record.state == "stopped") {
            return res.json({
                state: "error",
                errors: [{message: "ERR_BUILD_NOT_FOUND"}]
            })
        }
        var result = {
            state: record.state,
            url: record.resultUrl,
            errors: record.errors
        }

        if (record.state != "working") {
            delete globals.builds[req.params.id]
        }

        res.json(result)
    } catch (e) {
        logger.error(e)
        res.status(500)
        res.send("ERR_SERVER")
    }    
})

app.delete('/build/:id', function (req, res) {
    try {
        var record = globals.builds[req.params.id]
        if (record) {
            record.state = "stopped"
        }   
        res.send()
    } catch (e) {
        logger.error(e)
        res.status(500)
        res.send("ERR_SERVER")
    }    
})


var server = app.listen(config.port, function () {
    var host = server.address().address
    var port = server.address().port

    logger.info("Code generator listening at port " + port)
})

async function createBuild(req) {
    var spaceId = req.params.space 
    var folderId = req.params.folder
    var props
    try {
        props = await getProperties(spaceId, folderId)
    } catch (e) {
        return {
            ok: false,
            message: "Could not get properties for module"
        }
    }

    if (props.language == "LANG_JS") {
        var userLanguage = req.body.language || "en"
        var buildId = createBuildRecord(spaceId, folderId, props, userLanguage)
        var buildFun = () => {
            jsBuild(buildId)
        }
        setImmediate(buildFun)
        return {
            ok: true,
            id: buildId
        }
    } else if (!props.language) {
        var message = `Language not set for module ${spaceId}-${folderId}`
        logger.error(message)
        return {
            ok: false,
            message
        }        
    } else {
        var message = `Language not supported for module ${spaceId}-${folderId}: ${props.language}`
        logger.error(message)
        return {
            ok: false,
            message
        }
    }
}

function shouldStop(record) {
    return (record.state == "error" || record.state == "stopped")
}

async function jsBuild(buildId) {
    var fid
    try {
        var record = globals.builds[buildId]
        fid = record.fid
        var folder = await getModule(record.spaceId, record.folderId)   
        record.name = folder.name.trim()
        record.diagrams = folder.diagrams
        record.gentoken = await getGenToken(record.spaceId)
        record.filename = record.name + ".js"
        record.htmlName = record.name + ".html"
        record.jsUrl = "/gen/" + record.gentoken + "/" + record.filename
        record.resultUrl = "/gen/" + record.gentoken + "/" + record.htmlName
        record.path = config.genPath + "/" + record.gentoken + "/" + record.filename
        record.htmlPath = config.genPath + "/" + record.gentoken + "/" + record.htmlName
        record.lines = []

        genserver.beginBuild(record)

        if (shouldStop(record)) {
            return
        }

        record.diagrams = _.sortBy(record.diagrams, "name")

        for (var i = 0; i < record.diagrams.length; i++) {
            var diagram = record.diagrams[i]
            diagram.input = await getFolder(diagram.space_id, diagram.id)
            genserver.processDiagram(record, diagram)

            if (shouldStop(record)) {
                return
            }     
        }

        genserver.completeBuild(record)

        await writeAllText(record.path, record.lines.join("\n"))
        await writeAllText(record.htmlPath, record.props.html) 

        record.state = "success"
    } catch (e) {
        var payload = {error:e.toString() + " " + e.stack, fid:fid, src:"jsBuild"}
        logger.error(payload)
        record.state = "error"
        var message = e.message || e
        pushGenericError(record, message)
    }
}

async function writeAllText(path, text) {
    await fse.outputFile(path, text)
}

function pushGenericError(record, message) {
    record.errors.push({message})
}

function randomString() {
    // https://gist.github.com/6174/6062387
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function createBuildRecord(spaceId, folderId, props, userLanguage) {
    while (true) {
        var id = randomString()
        if (!(id in globals.builds)) {
            var item = {
                id,
                spaceId,
                folderId,
                fid: spaceId + " " + folderId,
                props,
                state: "working",
                userLanguage,
                errors: []
            }
            globals.builds[id] = item
            return id
        }
    }
}

async function getGenToken(spaceId) {
    var url = `http://localhost:${config.dtPort}/api/gentoken/${spaceId}`
    var result = await getFromDt(url, 1)
    return result.gentoken
}

async function getProperties(spaceId, folderId) {
    var url = `http://localhost:${config.dtPort}/api/folder_props/${spaceId}/${folderId}`
    return await getFromDt(url, 1)
}

async function getFolder(spaceId, folderId) {
    var url = `http://localhost:${config.dtPort}/api/folder/${spaceId}/${folderId}`
    return await getFromDt(url, 1)
}

async function getModule(spaceId, folderId) {
    var url = `http://localhost:${config.dtPort}/api/module/${spaceId}/${folderId}`
    return await getFromDt(url, 1)
}

async function getFromDt(url, retries) {
    if (retries == 0) {
        logger.error("getFromDt: will not try again")
        process.exit(2)
    }

    var options = {
        url,
        method: 'get',
        headers: {
            authorization: await getAuthorization()
        }
    }    

    try {
        var resp = await axios(options)
        return resp.data
    } catch (e) {
        if (e.response.state == 403) {
            logger.error("getFromDt: access denied")
            globals.auth = undefined
            return getFromDt(url, retries - 1)
        } else {
            logger.error(e)
            throw new Error(e.message)
        }
    }
}

async function getAuthorization() {
    if (!globals.auth) {
        var url = `http://localhost:${config.dtPort}/api/logon`

        var options = {
            url,
            method: 'post',
            data: {
                user: config.user,
                password: config.password
            }
        }

        try {
            var resp = await axios(options)
            globals.auth = resp.data.authorization
        } catch (e) {
            logger.error("Could not logon to DT", e)
            process.exit(1)
        }
    }

    return globals.auth
}