function loader_load(suffix) {
    suffix = suffix || ""
    var scripts = [
        {name:"Config", direct: false},
        {name:"CallTrace", direct: false},
        {name:"HtmlUtils", direct: false},
        {name:"Utils", direct: false},
        {name:"Logon", direct: false},
        {name:"DTools", direct: false},
        {name:"Theme", direct: false},
        {name:"Multitouch", direct: false},
        {name:"ViewWidget", direct: false},
        {name:"Behaviour", direct: false},
        {name:"Canvas", direct: false},
        {name:"Lomma2", direct: false},
        {name:"EditorCtrl2", direct: false},
        {name:"https://app.drakon.tech/gen/8ujt6myc2EBP9BfMWqydgYt6CrOGbdaD/html.js", direct: true},
        {name:"https://app.drakon.tech/gen/8ujt6myc2EBP9BfMWqydgYt6CrOGbdaD/smachine.js", direct: true},
        {name:"https://app.drakon.tech/gen/8ujt6myc2EBP9BfMWqydgYt6CrOGbdaD/common.js", direct: true},
        {name:"https://app.drakon.tech/gen/8GPPG9CSQ4tTvTPV75YqIyubHF184QvK/PlayerUi.js", direct: true},
        {name:"https://app.drakon.tech/gen/8GPPG9CSQ4tTvTPV75YqIyubHF184QvK/PlayerCore.js", direct: true},
        {name:"https://app.drakon.tech/gen/8GPPG9CSQ4tTvTPV75YqIyubHF184QvK/widgetLib.js", direct: true},
        {name:"https://app.drakon.tech/gen/8GPPG9CSQ4tTvTPV75YqIyubHF184QvK/expertWb.js", direct: true}
    ]
    loader_loadOne(scripts, suffix, 0)
}

function loader_loadOne(scripts, suffix, index) {
    if (index === scripts.length) {
        return
    }

    var script = scripts[index]
    var scriptName
    if (script.direct) {
        scriptName = script.name
    } else {
        scriptName = "/static/" + script.name + suffix + ".js"
    }

    var onload = function() {
        console.log("Loaded script", scriptName)
        loader_loadOne(scripts, suffix, index + 1)
    }

    loader_loadScript(scriptName, suffix, onload)
}

function loader_loadScript(scriptName, suffix, onload) {
    var script = document.createElement("script")
    script.onload = onload
    script.src = scriptName
    document.body.appendChild(script)
}

loader_load()
