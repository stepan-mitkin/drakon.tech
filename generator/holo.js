const fse = require('fs-extra')
const apModule = require("./AlgopropCompiler")
const commonModule = require("./common_1_0")
const smModule = require("./sm_1_0")

function buildHolo(record, getFromDt) {
    return new Promise(function (resolve) {
        console.log(record)
        var ap = apModule()
        var common = commonModule()
        var sm = smModule()
        var http = {
            getFromServer: function (parent, options) {
                return sendRequest(getFromDt, parent, options)
            }
        }
        ap.sm = sm
        ap.common = common
        ap.http = http

        var parent = {
            onChildCompleted: function (code) {
                console.log(code)
                completeGeneration(resolve, record, code)
            }
        }
        var url = record.spaceId + "/" + record.folderId
        ap.mainCore(parent, url).run()
    })

}

function completeGeneration(resolve, record, code) {
    if (code.errors.length === 0) {
        writeAllText(record.path, code.src).then(function () {
            resolve(true)
        })
        return
    }

    record.errors = code.errors.map(convertError)

    resolve(false)
}

async function writeAllText(path, text) {
    await fse.outputFile(path, text)
}




function sendRequest(getFromDt, parent, options) {
    return {
        run: function () {
            getFromDt(options).then(function (result) {
                parent.onChildCompleted(result)
            })
        }
    }
}

function convertError(error) {
    var id = error.spaceId + " " + error.id
    if (error.itemId) {
        return {
            type : "item",
            name : error.name,
            target : {id: id, itemId: error.itemId},
            message : error.message
        }
    } else {
        return {
            type : "folder",
            name : error.name,
            target : id,
            message : error.message
        }
    }
}

exports.buildHolo = buildHolo
