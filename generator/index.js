const util = require('util')
var esprima = require('esprima')
const { exec } = require("child_process");
const fse = require('fs-extra')
const axios = require("axios");
var express = require('express');
var bodyParser = require('body-parser')
const _ = require("lodash")
const genserver = require("./genserver")
const winston = require("winston")
const config = require("./config")

var app = express();

app.use(bodyParser.json())

var allowedChars;

var gVersions = {}

const globals = {
    builds: {}
}


// // Config example
// const config = {
//     port: 7650,
//     dtPort: 8090,
//     user: "internal_generator",
//     password: "123456",
//     genPath: "/dkt/gen"
// }

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
    error: function (obj, src) {
        var payload = buildLogPayload(obj, src)
        wlogger.error(payload)
    },
    info: function (obj) {
        var payload = buildLogPayload(obj)
        wlogger.info(payload)
    }
}

wlogger.stream = {
    write: function (message, encoding) {
        wlogger.info(message);
    }
};

function buildAllowedChars() {
    var ok = "abcdefghijklmnopqrstuvwxyz_-.0123456789"
    var result = {}
    for (let i = 0; i < ok.length; i++) {
        var c = ok[i]
        result[c] = true
    }
    return result
}

function isStringSafe(text) {
    text = text.toLowerCase()
    for (let i = 0; i < text.length; i++) {
        var c = text[i]
        if (!allowedChars[c]) {
            return false;
        }
    }
    return true
}

allowedChars = buildAllowedChars()

app.post('/private/:space/:folder', async function (req, res) {
    try {
        var result = await createBuild(req)
        if (result.ok) {
            var url = "/api/build/" + result.id
            res.json({ url })
        } else {
            res.status(400)
            res.json({ message: result.message })
        }
    } catch (e) {
        logger.error(e)
        res.status(500)
        res.json({ error: "ERR_SERVER" })
    }
})

app.get('/build/:id', function (req, res) {
    try {
        var record = globals.builds[req.params.id]
        if (!record || record.state == "stopped") {
            return res.json({
                state: "error",
                errors: [{ message: "ERR_BUILD_NOT_FOUND" }]
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

    if (props.language == "LANG_JS" || props.language == "LANG_JS2" || props.language == "LANG_S4") {
        var userLanguage = req.body.language || "en"
        var buildId = createBuildRecord(spaceId, folderId, props, userLanguage, req.body.userId)
        var buildFun = () => {
            jsBuild(buildId)
        }
        setImmediate(buildFun)
        return {
            ok: true,
            id: buildId
        }
    } else if (!props.language) {
        var message = `Language not set for module ${spaceId}/${folderId}`
        logger.error(message)
        return {
            ok: false,
            message
        }
    } else {
        var message = `Language not supported for module ${spaceId}/${folderId}: ${props.language}`
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

        if (record.props.language === "LANG_JS") {
            await buildV1(record)
        } else {
            var success = await buildV2(record)
            if (!success) {
                record.state = "error"
                return
            }
        }

        record.state = "success"
    } catch (e) {
        var payload = { error: e.toString() + " " + e.stack, fid: fid, src: "jsBuild" }
        logger.error(payload)
        record.state = "error"
        var message = e.message || e
        pushGenericError(record, message)
    }
}

async function buildV2(record) {
    var folder = await getModule(record.spaceId, record.folderId)
    await initStartRecord(record, folder)

    if (record.props.mformat === "MES_PROGRAM") {
        return await generateProgram(record)
    } else {
        return await generateNormal(record)
    }
}

async function expandDepependencyTree(record) {
    record.modules = {}
    record.allDeps = {}    
    var root = {
        name: record.name,
        props: record.props,
        deps: []
    }

    await expandDepependencyNode(record, root)
    
    for (var dname in record.allDeps) {
        var dep = record.allDeps[dname]
        
        if (dep.modules.length === 0) {
            throw new Error("No details specified for dependency: " + dname)
        }

        if (dep.modules.length > 1) {
            throw new Error("Dependency " + dname + " has more than one target. You can override dependencies in the program module")
        }
    }
}

async function expandDepependencyNode(record, module, isRoot) {
    if (module.name in record.modules) {
        return
    }

    record.modules[module.name] = module
    if (!parseDependencies(module)) {
        record.state = "error"
        return
    }

    for (var dep of module.deps) {
        if (dep.type === "project-module") {
            var depModule = await findModule(record, dep.project, dep.module)
            await expandModule(record, dep, depModule, isRoot)
        } else if (dep.type === "module") {
            var depModule = await findModule(record, record.spaceId, dep.module)
            await expandModule(record, dep, depModule, isRoot)
        } else if (dep.type === "anon") {
            getCreateSimpleDep(record, dep)
        } else if (dep.type === "npm" || dep.type === "node") {
            getCreateModuleDep(record, dep, dep, isRoot)            
        }
    }
}

function getStatus(exception) {
    if (exception.response) {
        return exception.response.status
    }

    return undefined
}

async function findModule(record, spaceId, moduleName) {
    var payload = {
        user_id: record.userId,
        space_id: spaceId,
        module_name: moduleName
    }

    var url = `http://localhost:${config.dtPort}/api/find_module`
    try {
        var response = await postToDt(url, payload)
        response.fid = spaceId + " " + response.id
        response.lines = record.lines
        response.errors = record.errors
        return response
    } catch (e) {

        if (getStatus(e) == 404) {
            throw new Error("Module not found. Project: " + spaceId + ", module: " + moduleName)
        } else if (getStatus(e) == 403) {
            throw new Error("Access denied to module. Project: " + spaceId + ", module: " + moduleName)
        } else {
            throw new Error(e.message)
        }
    }
}

async function expandModule(record, dep, module, isRoot) {
    var format = module.props.mformat || "MES_MODULE"
    if (format != "MES_MODULE") {
        var error = {
            type: "folder",
            target: module.fid,
            name: module.name,
            message: "Programs cannot be included in dependencies"
        }
        record.errors.push(error)
        throw new Error("Dependency error")
    }

    await expandDepependencyNode(record, module, false)
    getCreateModuleDep(record, dep, module, isRoot)
}

function getCreateModuleDep(record, dep, module, isRoot) {
    var depRecord = getCreateSimpleDep(record, dep)

    if (isRoot) {
        depRecord.modules = [module]
    } else {
        mergeDependency(depRecord.modules, module)
    }
}

function mergeDependency(modules, module) {
    for (var existing of modules) {
        if (existing.fid === module.fid) {
            return
        }
    }

    modules.push(module)
}

function getCreateSimpleDep(record, dep) {
    var depRecord = record.allDeps[dep.name]
    if (!depRecord) {
        depRecord = {
            name: dep.name,
            modules: []
        }
        record.allDeps[dep.name] = depRecord
    }
    return depRecord
}

function getModuleNames(record, depNames) {
    var names = {}
    for (var depName of depNames) {
        var dep = record.allDeps[depName]
        var target = dep.modules[0]
        if (target.type == "module") {
            names[depName] = true
        }
    }
    var result = Object.keys(names)
    result.sort()
    return result
}

function findProgramModule(record) {
    for (var moduleName in record.modules) {
        if (moduleName == record.name) {
            return record.modules[moduleName]
        }
    }
}

function getDepNames(record) {
    var programModule = findProgramModule(record)
    var names = {}
    getDepNamesCore(record, programModule, names)    
    var result = Object.keys(names)
    result.sort()
    return result
}

function getDepNamesCore(record, module, names) {
    for (var mdep of module.deps) {
        if (mdep.name in names) {
            continue
        }
        names[mdep.name] = true
        var dep = record.allDeps[mdep.name]
        var target = dep.modules[0]
        if (target.type === "module") {
            getDepNamesCore(record, target, names)
        }
    }    
}

function getModuleByDepName(record, depName) {
    var dep = record.allDeps[depName]
    var target = dep.modules[0]
    return record.modules[target.name]
}

async function generateProgram(record) {
    var module = makeModuleRecord(record.name, record.props, record.diagrams, record)
    
    await expandDepependencyTree(record)
    
    if (shouldStop(record)) {
        return false
    }

    var depNames = getDepNames(record)
    var modNames = getModuleNames(record, depNames)

    for (var depName of modNames) {
        var mod = getModuleByDepName(record, depName)
        var bodyOk = await generateNormalBody(mod)
        if (!bodyOk) {
            return false
        }        
    }

    
    await generateFunctions(module)

    if (record.errors.length > 0) {
        return false
    }

    injectDependencies(record, modNames)

    if (!addInit(module)) {
        return false
    }
    var commonPart = record.lines.join("\n")

    var browserLines = []    
    appendTradeMark(browserLines)
    appendIffeStart(browserLines)
    browserLines.push(commonPart)
    appendIffeEnd(browserLines)

    var nodeLines = []
    appendTradeMark(nodeLines)
    appendRequires(record, nodeLines)

    nodeLines.push(commonPart)
    genserver.completeCommon(module, nodeLines)

    var outputDir = config.genPath + "/" + record.gentoken + "/" + record.name + "/"
    var nodePath = outputDir + "index.js"
    var browserPath = outputDir + record.filename
    record.htmlPath = outputDir + "/index.html"
    record.resultUrl = "/gen/" + record.gentoken + "/" + record.name + "/"

    await fse.mkdir(outputDir, { recursive: true })

    await writeAllText(browserPath, browserLines.join("\n"))
    await writeAllText(nodePath, nodeLines.join("\n"))
    await writeAllText(record.htmlPath, record.props.html)

    await writePackageJson(record, outputDir)
    return true
}

async function writePackageJson(record, outputDir) {
    var names = {}
    for (var depName in record.allDeps) {
        var dep = record.allDeps[depName]
        var target = dep.modules[0]
        if (target.type === "npm") {
            names[target.package] = true
        }
    }  

    var packages = Object.keys(names)
    packages.sort()
    
    for (var package of packages) {
        names[package] = await getNpmVersion(package)
    }

    var packageJson = {
        name: record.name,
        version: "1.0.0",
        dependencies: {}
    }

    for (var package of packages) {
        packageJson.dependencies[package] = "^" + names[package]
    }

    var content = JSON.stringify(packageJson, null, 4)

    await writeAllText(outputDir + "package.json", content)
}

async function getNpmVersion(package) {
    var version = gVersions[package]
    if (!version) {
        if (!isStringSafe(package)) {
            throw new Error("Package name contains unsafe characters: " + package)
        }
        var command = "npm show " + package + " version"
        var execp = util.promisify(exec)
        var response = await execp(command);
        version = response.stdout.trim()
        gVersions[package] = version
    }
    return version
}

function appendRequires(record, lines) {   
    var requires = {}
    for (var depName in record.allDeps) {
        var dep = record.allDeps[depName]
        var target = dep.modules[0]
        if (target.type != "module") {
            requires[depName] = target
        }
    }    
    var names = Object.keys(requires)
    names.sort()

    for (var depName of names) {
        var dep = requires[depName]
        if (dep.obj) {
            lines.push("const " + depName + " = require(\"" + dep.package + "\")." + dep.obj + ";")
        } else {
            lines.push("const " + depName + " = require(\"" + dep.package + "\");")
        }
    }
}

function appendTradeMark(lines) {
    lines.push("// Generated with Drakon.Tech https://drakon.tech/")
}

function appendIffeStart(lines) {
    lines.push("")
    lines.push("(function() {")
}
function appendIffeEnd(lines) {
    lines.push("})();")
    lines.push("")
}

function injectDependencies(record, modNames) {

    for (var depName of modNames) {
        var module = getModuleByDepName(record, depName)
        record.lines.push("var " + depName + " = " + module.name + "_module();")
    }

    for (var depName of modNames) {
        var module = getModuleByDepName(record, depName)
        for (var dep of module.deps) {
            record.lines.push(depName + "." + dep.name +" = " + dep.name + ";")
        }
    }
}


async function generateNormal(record) {
    var module = makeModuleRecord(record.name, record.props, record.diagrams, record)
    if (!parseDependencies(module)) {
        return false
    }

    var bodyOk = await generateNormalBody(module)
    if (!bodyOk) {
        return false
    }

    await writeAllText(record.path, record.lines.join("\n"))
    await writeAllText(record.htmlPath, record.props.html)
    return true
}

async function generateNormalBody(module) {
    addFunctionHeader(module)
    addDependencyVars(module)    
    await generateFunctions(module)

    if (module.errors.length > 0) {
        return false
    }
    addExported(module)
    addDependencySetters(module)
    if (!addInit(module)) {
        return false
    }

    genserver.completeFactory2(module)

    return true
}

function split(text, delimiter) {
    if (!text) {
        return []
    }

    var parts = text.split(delimiter)
    var result = []
    for (let part of parts) {
        var trimmed = part.trim()
        if (trimmed) {
            result.push(trimmed)
        }
    }
    return result
}

function parseDependencies(module) {
    var lines = split(module.props.dependencies, "\n")
    module.deps = []
    for (let line of lines) {
        var parts = split(line, /\s/)
        var name = parts[0]
        if (parts.length === 1) {
            module.deps.push({
                name: name,
                type: "anon"
            })
        } else if (parts.length === 2) {
            var p2 = split(parts[1], "/")
            if (p2.length === 1) {
                module.deps.push({
                    name: name,
                    module: parts[1],
                    type: "module"
                })
            } else {
                var p20 = p2[0]
                if (p20 === "npm" || p20 === "node") {
                    if (p2.length === 3) {
                        module.deps.push({
                            name: name,
                            package: p2[1],
                            type: p20,
                            obj: p2[2]
                        })                  
                    } else {    
                        module.deps.push({
                            name: name,
                            package: p2[1],
                            type: p20
                        })
                    }
                } else {
                    module.deps.push({
                        name: name,
                        project: p2[0],
                        module: p2[1],
                        type: "project-module"
                    })
                }

            }
        }
    }
    var visited = {}
    for (let dep of module.deps) {
        if (dep.name in visited) {
            addModuleError(module, "Dependency is not unique: " + dep.name)
            return false
        }
        visited[dep.name] = true
    }
    return true
}

function addModuleError(module, message) {
    var error = {
        type: "folder",
        target: module.fid,
        name: module.name,
        message: message
    }

    module.errors.push(error)
}

function addFunctionHeader(module) {
    module.lines.push("")
    module.lines.push("function " + module.name + "_module() {")
    module.lines.push("var unit = {};")
    module.lines.push("")
}

function addTextChunk(module, text) {
    if (text) {
        var lines = split(text, "\n")
        lines.push("")
        for (var line of lines) {
            module.lines.push(line)
        }
    }
}

function addDependencyVars(module) {
    for (var dep of module.deps) {
        module.lines.push("var " + dep.name + ";")
    }
}

async function generateFunctions(module) {

    module.algoprops = {}
    var diagrams = []
    for (var i = 0; i < module.diagrams.length; i++) {
        var diagram = module.diagrams[i]
        if (diagram.keywords.algoprop) {
            if (module.props.language != "LANG_S4") {
                addModuleError(module, "Algo properties are not supported for this language: " + diagram.name)
                return
            }
            module.algoprops[diagram.name] = diagram
        } else {
            diagrams.push(diagram)
        }
    }
    module.diagrams = diagrams
    for (var i = 0; i < module.diagrams.length; i++) {
        var diagram = module.diagrams[i]
        diagram.input = await getFolder(diagram.space_id, diagram.id)
        genserver.processDiagram(module, diagram)

        if (shouldStop(module)) {
            return
        }
    }
}

function addExported(module) {

}

function addDependencySetters(module) {
    for (var dep of module.deps) {

        module.lines.push()

        module.lines.push("Object.defineProperty(unit, \"" + dep.name + "\", {")
        module.lines.push("    get: function() { return " + dep.name + "; },")
        module.lines.push("    set: function(newValue) { " + dep.name + " = newValue; },")
        module.lines.push("    enumerable: true,")
        module.lines.push("    configurable: true")
        module.lines.push("});")
    }
}



function addInit(module) {
    var code = genserver.parseInit(module)
    if (module.errors.length != 0) {
        return false
    }

    if (code) {
        addTextChunk(module, code)
    }
    return true
}


function makeModuleRecord(name, props, diagrams, record) {
    var module = {
        name: name,
        props: props,
        state: "working",
        errors: record.errors,
        lines: record.lines,
        diagrams: _.sortBy(diagrams, "name"),
        mformat: props.mformat,
        deps: []
    }

    return module
}

async function initStartRecord(record, folder) {
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
}

async function buildV1(record) {
    var folder = await getModule(record.spaceId, record.folderId)
    await initStartRecord(record, folder)
    
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
}

async function writeAllText(path, text) {
    await fse.outputFile(path, text)
}

function pushGenericError(record, message) {
    record.errors.push({ message })
}

function randomString() {
    // https://gist.github.com/6174/6062387
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function createBuildRecord(spaceId, folderId, props, userLanguage, userId) {
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
                userId,
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

async function postToDt(url, payload) {
    var options = {
        url,
        method: 'post',
        headers: {
            authorization: await getAuthorization()
        },
        data: payload
    }

    var resp = await axios(options)
    return resp.data
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