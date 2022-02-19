const fse = require('fs-extra')
const apModule = require("./AlgopropCompiler")
const apModule02 = require("./AlgopropCompiler02")
const commonModule = require("./common_1_0")
const smModule = require("./sm_1_0")


const strings = {
    "ERR_ALGOPROP_CANNOT_BE_ARGUMENT": "HL1000: Cannot use the name of an algoprop as a function argument or exception handler argument",
    "ERR_ALGOPROP_CANNOT_BE_IN_CLASS": "HL1001: Algoprops are not allowed as class members",
    "ERR_ARGUMENTS_NOT_ALLOWED_IN_ALGOPROPS": "HL1002: Function arguments are not allowed in algoprops",
    "ERR_AWAIT_REQUIRES_ASYNC_FUNCTION": "HL1003: await expressions are only allowed in async functions",
    "ERR_BAD_FOREACH": "HL1004: Bad format inside the FOREACH icon",
    "ERR_BAD_HANDLER_FORMAT": "HL1005: Bad handler format",
    "ERR_BAD_VARIABLE_NAME": "HL1006: Forbidden variable name",
    "ERR_BRANCH_NOT_FOUND": "HL1007: Branch not found",
    "ERR_BRANCH_NOT_REFERENCED": "HL1008: Branch not referenced",
    "ERR_CALL_EXPRESSION_EXPECTED": "HL1009: Call expression expected",
    "ERR_CANNOT_ASSIGN_TO_ALGOPROP": "HL1010: Cannot assign to an algoprop",
    "ERR_CANNOT_USE_GETHANDLER_OUTSIDE_HANDLER": "HL1011: Cannot use getHandlerData() outside of a handler",
    "ERR_CLASS_NAME_NOT_UNIQUE": "HL1012: Class name is not unique",
    "ERR_DUPLICATE_DIAGRAM_NAME": "HL1013: Diagram name is not unique",
    "ERR_EXPRESSION_EXPECTED": "HL1014: Expression expected",
    "ERR_FUNCTION_NAME_AND_ARGUMENTS_EXPECTED": "HL1015: Function name and arguments expected",
    "ERR_INCONSISTENT_EVENT_SIGNATURE": "HL1016: Inconsistent event signature",
    "ERR_INPUT_IS_NOT_ALLOWED_IN_NORMAL_FUNCTIONS": "HL1017: Input icons are only allowed in async functions",
    "ERR_NO_EXIT": "HL1018: The diagram has no end",
    "ERR_NO_TEXT_IN_FOREACH": "HL1019: A FOREACH icon cannot be empty",
    "ERR_NOT_ALL_PATHS_RETURN_A_VALUE": "HL1020: Not all paths return a value",
    "ERR_ONE_FUNCTION_CALL_EXPECTED": "HL1021: One function call expected",
    "ERR_ONLY_ASYNC_FUNCTIONS_CAN_HAVE_ON_ERROR": "HL1022: Only async functions can have \"on error\" handler",
    "ERR_ONLY_LAST_CASE_CAN_BE_EMPTY": "HL1023: Only the last Case icon can be empty",
    "ERR_PAUSE_IS_NOT_ALLOWED_IN_NORMAL_FUNCTIONS": "HL1024: Pause icons are only allowed in async functions",
    "ERR_RECEIVE_IS_NOT_ALLOWED_IN_NORMAL_FUNCTIONS": "HL1025: receive construct is only allowed in async functions",
    "ERR_THIS_KEYWORD_IS_NOT_ALLOWED": "HL1026: This keyword is not allowed",
    "ERR_VALUE_EXPECTED": "HL1027: Value expected",
    "ERR_VARIABLE_DECLARATIONS_ARE_NOT_ALLOWED": "HL1028: Variable declarations are not allowed",
}

function translate(text) {
    var translated = strings[text]
    if (translated) {
        return translated
    }
    return text
}

function buildHolo(record, getFromDt) {
    return buildHoloCore(record, getFromDt, apModule)
}

function buildHolo02(record, getFromDt) {
    return buildHoloCore(record, getFromDt, apModule02)
}

function buildHoloCore(record, getFromDt, apMod) {
    return new Promise(function (resolve) {
        var ap = apMod()
        ap.translate = translate
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
exports.buildHolo02 = buildHolo02
