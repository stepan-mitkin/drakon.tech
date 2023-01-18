const esprima = require("esprima")
const escodegen = require("escodegen")




function AlgopropCompiler02_module() {
    var unit = {};
    
    var sm;
    var common;
    var http;
    function addActionContent(project, diagram, item) {
        var body, text, wrapped;
        text = item.text || ""
        try {
            wrapped = "async function foo(){" + text
            + "}"
            body = esprima.parse(wrapped).body[0]
            .body
        } catch (ex) {
            addError(
                project,
                diagram,
                ex.message,
                item
            )
            return undefined
        }
        item.body = body
        return true
    }
    
    function addApVar(project, diagram, name) {
        addVar(project, diagram, name, "ap")
    }
    
    function addArgVar(project, diagram, name) {
        addVar(project, diagram, name, "arg")
    }
    
    function addAssignFromCall(body, variable, fun, args) {
        var newStatement;
        newStatement = {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "operator": "=",
                "left": {
                    "type": "Identifier",
                    "name": variable
                },
                "right": {
                    "type": "CallExpression",
                    "callee": {
                        "type": "Identifier",
                        "name": fun
                    },
                    "arguments": args
                }
            }
        }
        body.push(newStatement)
    }
    
    function addAssignToVar(body, variable, node) {
        var newStatement;
        newStatement = {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "operator": "=",
                "left": {
                    "type": "Identifier",
                    "name": variable
                },
                "right": node
            }
        }
        body.push(newStatement)
    }
    
    function addBreak(chunk, body) {
        var last;
        if (chunk.body.length === 0) {
            body.push(
                {
                    "type": "BreakStatement",
                    "label": null
                }
            )
        } else {
            last = chunk.body[chunk.body.length - 1]
            if (last.type === "BreakStatement") {
            } else {
                if (last.mustBreak) {
                    body.push(
                        {
                            "type": "ReturnStatement",
                            "label": null
                        }
                    )
                } else {
                    body.push(
                        {
                            "type": "BreakStatement",
                            "label": null
                        }
                    )
                }
            }
        }
    }
    
    function addCase(sw, value) {
        var cs;
        cs = {
            "type": "SwitchCase",
            "test": {
                "type": "Literal",
                "value": value,
                "raw": JSON.stringify(value)
            },
            "consequent": []
        }
        sw.push(cs)
        return cs.consequent
    }
    
    function addDefaultReturn(body) {
        body.push(
            {
                "type": "SwitchCase",
                "test": null,
                "consequent": [
                    {
                        "type": "ReturnStatement",
                        "argument": null
                    }
                ]
            }
        )
    }
    
    function addDepProps(project, outputBody) {
        var _7_col, _7_it, _7_length, call, dep, getter, setter;
        _7_it = 0;
        _7_col = project.deps;
        _7_length = _7_col.length;
        while (true) {
            if (_7_it < _7_length) {
                dep = _7_col[_7_it];
                getter = {
                    "type": "FunctionExpression",
                    "id": null,
                    "params": [],
                    "body": {
                        "type": "BlockStatement",
                        "body": [
                            {
                                "type": "ReturnStatement",
                                "argument": {
                                    "type": "Identifier",
                                    "name": dep
                                }
                            }
                        ]
                    },
                    "generator": false,
                    "expression": false,
                    "async": false
                }
                setter = {
                    "type": "FunctionExpression",
                    "id": null,
                    "params": [
                        {
                            "type": "Identifier",
                            "name": "newValue"
                        }
                    ],
                    "body": {
                        "type": "BlockStatement",
                        "body": [
                            {
                                "type": "ExpressionStatement",
                                "expression": {
                                    "type": "AssignmentExpression",
                                    "operator": "=",
                                    "left": {
                                        "type": "Identifier",
                                        "name": dep
                                    },
                                    "right": {
                                        "type": "Identifier",
                                        "name": "newValue"
                                    }
                                }
                            }
                        ]
                    }
                }
                call = {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "CallExpression",
                        "callee": {
                            "type": "MemberExpression",
                            "computed": false,
                            "object": {
                                "type": "Identifier",
                                "name": "Object"
                            },
                            "property": {
                                "type": "Identifier",
                                "name": "defineProperty"
                            }
                        },
                        "arguments": [
                            {
                                "type": "Identifier",
                                "name": "unit"
                            },
                            {
                                "type": "Literal",
                                "value": dep,
                                "raw": JSON.stringify(
                                    dep
                                )
                            },
                            {
                                "type": "ObjectExpression",
                                "properties": [
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "get"
                                        },
                                        "computed": false,
                                        "value": getter,
                                        "kind": "init",
                                        "method": false,
                                        "shorthand": false
                                    },
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "set"
                                        },
                                        "computed": false,
                                        "value": setter,
                                        "kind": "init",
                                        "method": false,
                                        "shorthand": false
                                    },
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "enumerable"
                                        },
                                        "computed": false,
                                        "value": {
                                            "type": "Literal",
                                            "value": true,
                                            "raw": "true"
                                        },
                                        "kind": "init",
                                        "method": false,
                                        "shorthand": false
                                    },
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "configurable"
                                        },
                                        "computed": false,
                                        "value": {
                                            "type": "Literal",
                                            "value": true,
                                            "raw": "true"
                                        },
                                        "kind": "init",
                                        "method": false,
                                        "shorthand": false
                                    }
                                ]
                            }
                        ]
                    }
                }
                outputBody.push(call)
                _7_it++;
            } else {
                break;
            }
        }
    }
    
    function addDepVars(project, outputBody) {
        var declarations;
        declarations = project.deps.map(
            function (dep) {
                return {
                    "type": "VariableDeclarator",
                    "id": {
                        "type": "Identifier",
                        "name": dep
                    },
                    "init": null
                }
            }
        )
        if (declarations.length === 0) {
        } else {
            outputBody.push(
                {
                    "type": "VariableDeclaration",
                    "declarations": declarations,
                    "kind": "var"
                }
            )
        }
    }
    
    function addEarlyExit(name, body) {
        body.push(
            {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "AssignmentExpression",
                    "operator": "=",
                    "left": {
                        "type": "Identifier",
                        "name": "__result"
                    },
                    "right": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": {
                            "type": "Identifier",
                            "name": "__obj"
                        },
                        "property": {
                            "type": "Identifier",
                            "name": name
                        }
                    }
                }
            }
        )
        body.push(
            {
                "type": "IfStatement",
                "test": {
                    "type": "BinaryExpression",
                    "operator": "!=",
                    "left": {
                        "type": "Identifier",
                        "name": "__result"
                    },
                    "right": {
                        "type": "Identifier",
                        "name": "undefined"
                    }
                },
                "consequent": {
                    "type": "BlockStatement",
                    "body": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Identifier",
                                "name": "__result"
                            }
                        }
                    ]
                },
                "alternate": null
            }
        )
    }
    
    function addEarlyExitAsync(name, body) {
        var resolveReturn, retObj, returnObj, returnPromise;
        function branch1() {
            body.push(
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "operator": "=",
                        "left": {
                            "type": "Identifier",
                            "name": "__result"
                        },
                        "right": {
                            "type": "MemberExpression",
                            "computed": false,
                            "object": {
                                "type": "Identifier",
                                "name": "__obj"
                            },
                            "property": {
                                "type": "Identifier",
                                "name": name
                            }
                        }
                    }
                }
            )
            return branch2();
        }
    
        function branch2() {
            retObj = {
                "type": "ObjectExpression",
                "properties": [
                    {
                        "type": "Property",
                        "key": {
                            "type": "Identifier",
                            "name": "ok"
                        },
                        "computed": false,
                        "value": {
                            "type": "Literal",
                            "value": true,
                            "raw": "true"
                        },
                        "kind": "init",
                        "method": false,
                        "shorthand": false
                    },
                    {
                        "type": "Property",
                        "key": {
                            "type": "Identifier",
                            "name": "result"
                        },
                        "computed": false,
                        "value": {
                            "type": "Identifier",
                            "name": "__result"
                        },
                        "kind": "init",
                        "method": false,
                        "shorthand": false
                    }
                ]
            }
            return branch3();
        }
    
        function branch3() {
            resolveReturn = {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "CallExpression",
                    "callee": {
                        "type": "Identifier",
                        "name": "__resolve"
                    },
                    "arguments": [retObj]
                }
            }
            returnPromise = {
                "type": "ReturnStatement",
                "argument": {
                    "type": "NewExpression",
                    "callee": {
                        "type": "Identifier",
                        "name": "Promise"
                    },
                    "arguments": [
                        {
                            "type": "FunctionExpression",
                            "id": null,
                            "params": [
                                {
                                    "type": "Identifier",
                                    "name": "__resolve"
                                },
                                {
                                    "type": "Identifier",
                                    "name": "__reject"
                                }
                            ],
                            "body": {
                                "type": "BlockStatement",
                                "body": [
                                    resolveReturn
                                ]
                            },
                            "generator": false,
                            "expression": false,
                            "async": false
                        }
                    ]
                }
            }
            return branch4();
        }
    
        function branch4() {
            returnObj = {
                "type": "ReturnStatement",
                "argument": {
                    "type": "ObjectExpression",
                    "properties": [
                        {
                            "type": "Property",
                            "key": {
                                "type": "Identifier",
                                "name": "run"
                            },
                            "computed": false,
                            "value": {
                                "type": "FunctionExpression",
                                "id": null,
                                "params": [],
                                "body": {
                                    "type": "BlockStatement",
                                    "body": [
                                        returnPromise
                                    ]
                                },
                                "generator": false,
                                "expression": false,
                                "async": false
                            },
                            "kind": "init",
                            "method": false,
                            "shorthand": false
                        }
                    ]
                }
            }
            return branch5();
        }
    
        function branch5() {
            body.push(
                {
                    "type": "IfStatement",
                    "test": {
                        "type": "BinaryExpression",
                        "operator": "!=",
                        "left": {
                            "type": "Identifier",
                            "name": "__result"
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "undefined"
                        }
                    },
                    "consequent": {
                        "type": "BlockStatement",
                        "body": [returnObj]
                    },
                    "alternate": null
                }
            )
            return branch6();
        }
    
        function branch6() {
        }
    
        return branch1();
    }
    
    function addError(project, diagram, message, item) {
        var error, itemId, text;
        if (item) {
            itemId = item.id
            text = item.text
        } else {
            itemId = undefined
            text = undefined
        }
        error = {
            spaceId: project.spaceId,
            id: diagram.id,
            name: diagram.name,
            message: tr(message),
            url: project.spaceId + "/" + diagram.id,
            itemId: itemId,
            text: text
        }
        project.errors.push(error)
    }
    
    function addErrorCase(diagram, swVar, citem, prev) {
        var below, belowId, complain, newItem;
        belowId = citem.next[0]
        below = diagram.items[belowId]
        complain = "throw new Error(\"Unexpected case value: \" + "
        + swVar + ")"
        newItem = {
            type: "action",
            text: complain,
            id: generateItemId(diagram),
            refs: [prev.id],
            next: [belowId]
        }
        diagram.items[newItem.id] = newItem
        prev.next.push(newItem.id)
    }
    
    function addEventArgsToVars(project, diagram, eventInfo) {
        var _5_col, _5_it, _5_length, arg;
        _5_it = 0;
        _5_col = eventInfo.args;
        _5_length = _5_col.length;
        while (true) {
            if (_5_it < _5_length) {
                arg = _5_col[_5_it];
                addNormalVar(project, diagram, arg)
                _5_it++;
            } else {
                break;
            }
        }
    }
    
    function addGotoHandler(project, diagram, parts) {
        var branch, handlerType;
        handlerType = parts[1]
        if ((parts[2]) && (parts[3])) {
            branch = parts.slice(3).join(" ")
            diagram.handlers[handlerType] = {
                type: "goto",
                branch: branch
            }
        } else {
            addError(
                project,
                diagram,
                "ERR_BAD_HANDLER_FORMAT"
            )
        }
    }
    
    function addHandlerVars(body) {
        body.push(
            {
                "type": "VariableDeclaration",
                "declarations": [
                    {
                        "type": "VariableDeclarator",
                        "id": {
                            "type": "Identifier",
                            "name": "__handlerData"
                        },
                        "init": {
                            "type": "Identifier",
                            "name": "undefined"
                        }
                    },
                    {
                        "type": "VariableDeclarator",
                        "id": {
                            "type": "Identifier",
                            "name": "__inHandler"
                        },
                        "init": {
                            "type": "Literal",
                            "value": false,
                            "raw": "false"
                        }
                    }
                ],
                "kind": "var"
            }
        )
    }
    
    function addIfStatement(body, test) {
        var statement;
        statement = {
            "type": "IfStatement",
            "test": test,
            "consequent": {
                "type": "BlockStatement",
                "body": []
            },
            "alternate": {
                "type": "BlockStatement",
                "body": []
            }
        }
        body.push(statement)
        return statement
    }
    
    function addItemReferences(diagram, item) {
        var _8_col, _8_it, _8_length, nextId, target;
        _8_it = 0;
        _8_col = item.next;
        _8_length = _8_col.length;
        while (true) {
            if (_8_it < _8_length) {
                nextId = _8_col[_8_it];
                target = diagram.items[nextId]
                target.refs.push(item.id)
                _8_it++;
            } else {
                break;
            }
        }
    }
    
    function addLiteralAssignment(body, variable, value) {
        body.push(
            {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "AssignmentExpression",
                    "operator": "=",
                    "left": {
                        "type": "Identifier",
                        "name": variable
                    },
                    "right": {
                        "type": "Literal",
                        "value": value,
                        "raw": JSON.stringify(
                            value
                        )
                    }
                }
            }
        )
    }
    
    function addLiteralAssignmentDec(body, variable, value) {
        body.push(
            {
                "type": "VariableDeclaration",
                "declarations": [
                    {
                        "type": "VariableDeclarator",
                        "id": {
                            "type": "Identifier",
                            "name": variable
                        },
                        "init": {
                            "type": "Literal",
                            "value": value,
                            "raw": JSON.stringify(
                                value
                            )
                        }
                    }
                ],
                "kind": "var"
            }
        )
    }
    
    function addNormalVar(project, diagram, name) {
        addVar(project, diagram, name, "var")
    }
    
    function addReject(body, argument) {
        var res;
        body.push(
            {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "AssignmentExpression",
                    "operator": "=",
                    "left": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": {
                            "type": "Identifier",
                            "name": "me"
                        },
                        "property": {
                            "type": "Identifier",
                            "name": "state"
                        }
                    },
                    "right": {
                        "type": "Identifier",
                        "name": "undefined"
                    }
                }
            }
        )
        res = {
            "type": "ExpressionStatement",
            "expression": {
                "type": "CallExpression",
                "callee": {
                    "type": "Identifier",
                    "name": "__reject"
                },
                "arguments": [argument]
            }
        }
        body.push(res)
        return res
    }
    
    function addResolve(body, argument) {
        var args, res;
        if (argument) {
            args = [argument]
        } else {
            args = []
        }
        body.push(
            {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "AssignmentExpression",
                    "operator": "=",
                    "left": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": {
                            "type": "Identifier",
                            "name": "me"
                        },
                        "property": {
                            "type": "Identifier",
                            "name": "state"
                        }
                    },
                    "right": {
                        "type": "Identifier",
                        "name": "undefined"
                    }
                }
            }
        )
        res = {
            "type": "ExpressionStatement",
            "expression": {
                "type": "CallExpression",
                "callee": {
                    "type": "Identifier",
                    "name": "__resolve"
                },
                "arguments": args
            }
        }
        body.push(res)
        return res
    }
    
    function addSetMeState(body, state) {
        body.push(
            {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "AssignmentExpression",
                    "operator": "=",
                    "left": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": {
                            "type": "Identifier",
                            "name": "me"
                        },
                        "property": {
                            "type": "Identifier",
                            "name": "state"
                        }
                    },
                    "right": {
                        "type": "Literal",
                        "value": state,
                        "raw": JSON.stringify(
                            state
                        )
                    }
                }
            }
        )
    }
    
    function addSpecialVar(diagram, name) {
        diagram.vars[name] = {type: "var"}
    }
    
    function addValueThen(project, body, diagram, item, expr, oldNext) {
        var bad, good, node;
        function branch1() {
            node = {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "CallExpression",
                    "callee": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": expr.right.argument,
                        "property": {
                            "type": "Identifier",
                            "name": "then"
                        }
                    },
                    "arguments": []
                }
            }
            good = {
                "type": "FunctionExpression",
                "id": null,
                "params": [
                    {
                        "type": "Identifier",
                        "name": "__returnee"
                    }
                ],
                "body": {
                    "type": "BlockStatement",
                    "body": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": expr.left,
                                "right": {
                                    "type": "Identifier",
                                    "name": "__returnee"
                                }
                            }
                        }
                    ]
                },
                "generator": false,
                "expression": false,
                "async": false
            }
            callMain(diagram, good.body.body)
            return branch2();
        }
    
        function branch2() {
            bad = createErrorCallback(
                diagram,
                item,
                oldNext
            )
            return branch3();
        }
    
        function branch3() {
            node.expression.arguments .push(good)
            node.expression.arguments .push(bad)
            body.push(node)
            body.push(
                {
                    mustBreak: true,
                    "type": "ReturnStatement",
                    "argument": null
                }
            )
        }
    
        return branch1();
    }
    
    function addVar(project, diagram, name, type) {
        if (isForbidden(name)) {
            addError(
                project,
                diagram,
                tr("ERR_BAD_VARIABLE_NAME") + ": " +
                name
            )
        } else {
            diagram.vars[name] = {type: type}
        }
    }
    
    function addVarsToBody(project, diagram, body) {
        var _6_col, _6_it, _6_keys, _6_length, info, name, vars;
        function branch1() {
            if (diagram.algoprop) {
                addSpecialVar(diagram, "__result")
            }
            return branch2();
        }
    
        function branch2() {
            vars = []
            _6_it = 0;
            _6_col = diagram.vars;
            _6_keys = Object.keys(_6_col);
            _6_length = _6_keys.length;
            while (true) {
                if (_6_it < _6_length) {
                    name = _6_keys[_6_it];
                    info = _6_col[name];
                    if ((info.type === "var") || (info.type === "ap")) {
                        vars.push(
                            {
                                type: "VariableDeclarator",
                                id: {
                                    type: "Identifier",
                                    name: name
                                },
                                init: null
                            }
                        )
                    }
                    _6_it++;
                } else {
                    break;
                }
            }
            if (vars.length === 0) {
            } else {
                body.push(
                    {
                        "type": "VariableDeclaration",
                        "declarations": vars,
                        "kind": "var"
                    }
                )
            }
            return branch3();
        }
    
        function branch3() {
        }
    
        return branch1();
    }
    
    function addVoidThen(project, body, diagram, item, expr, oldNext) {
        var bad, good, node;
        function branch1() {
            node = {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "CallExpression",
                    "callee": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": expr.argument,
                        "property": {
                            "type": "Identifier",
                            "name": "then"
                        }
                    },
                    "arguments": []
                }
            }
            good = {
                "type": "FunctionExpression",
                "id": null,
                "params": [],
                "body": {
                    "type": "BlockStatement",
                    "body": []
                },
                "generator": false,
                "expression": false,
                "async": false
            }
            callMain(diagram, good.body.body)
            return branch2();
        }
    
        function branch2() {
            bad = createErrorCallback(
                diagram,
                item,
                oldNext
            )
            return branch3();
        }
    
        function branch3() {
            node.expression.arguments .push(good)
            node.expression.arguments .push(bad)
            body.push(node)
            body.push(
                {
                    mustBreak: true,
                    "type": "ReturnStatement",
                    "argument": null
                }
            )
        }
    
        return branch1();
    }
    
    function allPathsReturn(body) {
        var _sw_8, last;
        if (body.length === 0) {
            return false
        } else {
            last = body[body.length - 1]
            _sw_8 = last.type;
            if (_sw_8 === "ReturnStatement") {
                return true
            } else {
                if (_sw_8 === "ThrowStatement") {
                    return true
                } else {
                    if (_sw_8 === "IfStatement") {
                        if ((allPathsReturn(last.consequent.body)) && (allPathsReturn(last.alternate.body))) {
                            return true
                        } else {
                            return false
                        }
                    } else {
                        return false
                    }
                }
            }
        }
    }
    
    function analyzeHandler(project, diagram, parts) {
        var _sw_4;
        _sw_4 = parts[1];
        if (_sw_4 === "error") {
            addGotoHandler(
                project,
                diagram,
                parts,
                "error"
            )
        } else {
            addError(
                project,
                diagram,
                "ERR_BAD_HANDLER_FORMAT"
            )
        }
    }
    
    function arraysAreEqual(arr1, arr2) {
        var i;
        if (arr1.length === arr2.length) {
            i = 0;
            while (true) {
                if (i < arr1.length) {
                    if (arr1[i] === arr2[i]) {
                        i++;
                    } else {
                        return false
                    }
                } else {
                    return true
                }
            }
        } else {
            return false
        }
    }
    
    function assignIdProp(body, obj, prop, src) {
        body.push(
            {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "AssignmentExpression",
                    "operator": "=",
                    "left": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": {
                            "type": "Identifier",
                            "name": obj
                        },
                        "property": {
                            "type": "Identifier",
                            "name": prop
                        }
                    },
                    "right": {
                        "type": "Identifier",
                        "name": src
                    }
                }
            }
        )
    }
    
    function buildDiagramBody(project, diagram) {
        if ((diagram.algoprop) && (!(diagram.items))) {
            return undefined
        } else {
            return {
                "type": "FunctionDeclaration",
                "id": {
                    "type": "Identifier",
                    "name": getFunctionName(diagram)
                },
                "params": getFunctionParams(diagram),
                "body": {
                    "type": "BlockStatement",
                    "body": getFunctionBody(
                        project,
                        diagram
                    )
                },
                "generator": false,
                "expression": false,
                "async": false
            }
        }
    }
    
    function buildDiagramBodyCreate(project, diagram) {
        return {
            "type": "FunctionDeclaration",
            "id": {
                "type": "Identifier",
                "name": diagram.name
            },
            "params": getFunctionParams(diagram),
            "body": {
                "type": "BlockStatement",
                "body": getRunnerBody(
                    project,
                    diagram
                )
            },
            "generator": false,
            "expression": false,
            "async": false
        }
    }
    
    function buildFunctionStructure(project, diagram, first, body) {
        var _65_col, _65_it, _65_keys, _65_length, callMain, callback, eventFun, eventHandler, eventInfo, eventName, main, mainFun, mainTry, returnee, run, runBody;
        function branch1() {
            addVarsToBody(project, diagram, body)
            if (diagram.complex) {
                if (diagram.algoprop) {
                    addEarlyExitAsync(diagram.name, body)
                }
                return branch2();
            } else {
                if (diagram.algoprop) {
                    addEarlyExit(diagram.name, body)
                }
                if (Object.keys(diagram.chunks).length > 1) {
                    addLiteralAssignmentDec(
                        body,
                        "__state",
                        first
                    )
                }
                return body
            }
        }
    
        function branch2() {
            if (Object.keys(diagram.handlers).length > 0) {
                addHandlerVars(body)
            }
            body.push(
                {
                    "type": "VariableDeclaration",
                    "kind": "var",
                    "declarations": [
                        {
                            "type": "VariableDeclarator",
                            "id": {
                                "type": "Identifier",
                                "name": "me"
                            },
                            "init": {
                                "type": "ObjectExpression",
                                "properties": [
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "state"
                                        },
                                        "computed": false,
                                        "value": {
                                            "type": "Literal",
                                            "value":
                                            first,
                                            "raw": JSON
                                            .stringify(
                                                first
                                            )
                                        },
                                        "kind": "init",
                                        "method": false,
                                        "shorthand":
                                        false
                                    },
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "type"
                                        },
                                        "computed": false,
                                        "value": {
                                            "type": "Literal",
                                            "value":
                                            diagram.name,
                                            "raw": JSON
                                            .stringify(
                                                diagram
                                                .name
                                            )
                                        },
                                        "kind": "init",
                                        "method": false,
                                        "shorthand":
                                        false
                                    }
                                ]
                            }
                        }
                    ]
                }
            )
            main = procMain(diagram)
            mainFun = {
                "type": "FunctionDeclaration",
                "id": {
                    "type": "Identifier",
                    "name": main
                },
                "params": [
                    {
                        "type": "Identifier",
                        "name": "__resolve"
                    },
                    {
                        "type": "Identifier",
                        "name": "__reject"
                    }
                ],
                "body": {
                    "type": "BlockStatement",
                    "body": []
                },
                "generator": false,
                "expression": false,
                "async": false
            }
            body.push(mainFun)
            return branch3();
        }
    
        function branch3() {
            mainTry = {
                "type": "TryStatement",
                "block": {
                    "type": "BlockStatement",
                    "body": []
                },
                "handlers": [
                    {
                        "type": "CatchClause",
                        "param": {
                            "type": "Identifier",
                            "name": "ex"
                        },
                        "body": {
                            "type": "BlockStatement",
                            "body": []
                        }
                    }
                ],
                "finalizer": null
            }
            fillCatch(diagram, mainTry)
            mainFun.body.body.push(mainTry)
            return branch4();
        }
    
        function branch4() {
            callMain = {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "CallExpression",
                    "callee": {
                        "type": "Identifier",
                        "name": main
                    },
                    "arguments": [
                        {
                            "type": "Identifier",
                            "name": "__resolve"
                        },
                        {
                            "type": "Identifier",
                            "name": "__reject"
                        }
                    ]
                }
            }
            callback = {
                "type": "FunctionExpression",
                "id": null,
                "params": [
                    {
                        "type": "Identifier",
                        "name": "__resolve"
                    },
                    {
                        "type": "Identifier",
                        "name": "__reject"
                    }
                ],
                "body": {
                    "type": "BlockStatement",
                    "body": []
                }
            }
            _65_it = 0;
            _65_col = diagram.events;
            _65_keys = Object.keys(_65_col);
            _65_length = _65_keys.length;
            while (true) {
                if (_65_it < _65_length) {
                    eventName = _65_keys[_65_it];
                    eventInfo = _65_col[eventName];
                    eventFun = createEventFun(
                        diagram,
                        eventInfo
                    )
                    eventHandler = {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "AssignmentExpression",
                            "operator": "=",
                            "left": {
                                "type": "MemberExpression",
                                "computed": false,
                                "object": {
                                    "type": "Identifier",
                                    "name": "me"
                                },
                                "property": {
                                    "type": "Identifier",
                                    "name": eventName
                                }
                            },
                            "right": eventFun
                        }
                    }
                    callback.body.body.push(eventHandler)
                    _65_it++;
                } else {
                    break;
                }
            }
            callback.body.body.push(callMain)
            returnee = {
                "type": "ReturnStatement",
                "argument": {
                    "type": "NewExpression",
                    "callee": {
                        "type": "Identifier",
                        "name": "Promise"
                    },
                    "arguments": [callback]
                }
            }
            return branch5();
        }
    
        function branch5() {
            run = {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "AssignmentExpression",
                    "operator": "=",
                    "left": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": {
                            "type": "Identifier",
                            "name": "me"
                        },
                        "property": {
                            "type": "Identifier",
                            "name": "run"
                        }
                    },
                    "right": {
                        "type": "FunctionExpression",
                        "id": null,
                        "params": [],
                        "body": {
                            "type": "BlockStatement",
                            "body": []
                        },
                        "generator": false,
                        "expression": false,
                        "async": false
                    }
                }
            }
            runBody = run.expression.right.body.body
            runBody.push(
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "operator": "=",
                        "left": {
                            "type": "MemberExpression",
                            "computed": false,
                            "object": {
                                "type": "Identifier",
                                "name": "me"
                            },
                            "property": {
                                "type": "Identifier",
                                "name": "run"
                            }
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "undefined"
                        }
                    }
                }
            )
            runBody.push(returnee)
            body.push(run)
            body.push(
                {
                    "type": "ReturnStatement",
                    "argument": {
                        "type": "Identifier",
                        "name": "me"
                    }
                }
            )
            return mainTry.block.body
        }
    
        function branch6() {
        }
    
        return branch1();
    }
    
    function calcName(name) {
        return "calc" + firstCap(name)
    }
    
    function callHandler(diagram, arg, gotoId, body) {
        if (arg) {
            body.push(
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "operator": "=",
                        "left": {
                            "type": "Identifier",
                            "name": "__handlerData"
                        },
                        "right": arg
                    }
                }
            )
        }
        addLiteralAssignment(
            body,
            getSwitchVar(diagram),
            gotoId
        )
        callMain(diagram, body)
    }
    
    function callMain(diagram, outputBody) {
        var main;
        main = procMain(diagram)
        outputBody.push(
            {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "CallExpression",
                    "callee": {
                        "type": "Identifier",
                        "name": main
                    },
                    "arguments": [
                        {
                            "type": "Identifier",
                            "name": "__resolve"
                        },
                        {
                            "type": "Identifier",
                            "name": "__reject"
                        }
                    ]
                }
            }
        )
    }
    
    function checkBranchesAreReferenced(project, diagram) {
        var _18_col, _18_it, _18_keys, _18_length, handler, i, info, item, itemId, key, message;
        function branch1() {
            i = 1;
            while (true) {
                if (i < diagram.branches.length) {
                    itemId = diagram.branches[i]
                    item = diagram.items[itemId]
                    handler = getHandler(diagram, item.text)
                    if (handler) {
                        handler.itemId = itemId
                    } else {
                        if (item.refs.length === 0) {
                            addError(
                                project,
                                diagram,
                                "ERR_BRANCH_NOT_REFERENCED",
                                item
                            )
                        }
                    }
                    i++;
                } else {
                    break;
                }
            }
            return branch2();
        }
    
        function branch2() {
            _18_it = 0;
            _18_col = diagram.handlers;
            _18_keys = Object.keys(_18_col);
            _18_length = _18_keys.length;
            while (true) {
                if (_18_it < _18_length) {
                    key = _18_keys[_18_it];
                    info = _18_col[key];
                    if ((!(info.type === "goto")) || (info.itemId)) {
                    } else {
                        message = tr("ERR_BRANCH_NOT_FOUND") + ": "
                        + info.branch
                        addError(project, diagram, message)
                    }
                    _18_it++;
                } else {
                    break;
                }
            }
            return branch3();
        }
    
        function branch3() {
        }
    
        return branch1();
    }
    
    function checkCaseBody(project, diagram, caseItem, program, selectId) {
        var _11_col, _11_it, _11_length, arg, args, body, caseInfo, existing, expr, name;
        function branch1() {
            if ((program.type === "Program") && (program.body.length === 1)) {
                body = program.body[0]
                if (body.type === "ExpressionStatement") {
                    expr = body.expression
                    if ((expr.type === "CallExpression") && (expr.callee.type === "Identifier")) {
                        name = expr.callee.name,
                        args = []
                        _11_it = 0;
                        _11_col = expr.arguments;
                        _11_length = _11_col.length;
                        while (true) {
                            if (_11_it < _11_length) {
                                arg = _11_col[_11_it];
                                if (arg.type === "Identifier") {
                                    args.push(arg.name)
                                    _11_it++;
                                } else {
                                    addError(
                                        project,
                                        diagram,
                                        "ERR_CALL_EXPRESSION_EXPECTED",
                                        caseItem
                                    )
                                    name = undefined
                                    return branch3();
                                }
                            } else {
                                return branch2();
                            }
                        }
                    } else {
                        addError(
                            project,
                            diagram,
                            "ERR_CALL_EXPRESSION_EXPECTED",
                            caseItem
                        )
                        name = undefined
                        return branch3();
                    }
                } else {
                    addError(
                        project,
                        diagram,
                        "ERR_CALL_EXPRESSION_EXPECTED",
                        caseItem
                    )
                    name = undefined
                    return branch3();
                }
            } else {
                addError(
                    project,
                    diagram,
                    "ERR_CALL_EXPRESSION_EXPECTED",
                    caseItem
                )
                name = undefined
                return branch3();
            }
        }
    
        function branch2() {
            existing = diagram.events[name]
            if (existing) {
                if (arraysAreEqual(existing.args, args)) {
                    existing.items.push(selectId)
                } else {
                    addError(
                        project,
                        diagram,
                        "ERR_INCONSISTENT_EVENT_SIGNATURE",
                        caseItem
                    )
                }
            } else {
                caseInfo = {
                    name: name,
                    args: args,
                    items: [selectId]
                }
                diagram.events[name] = caseInfo
            }
            return branch3();
        }
    
        function branch3() {
            return name
        }
    
        return branch1();
    }
    
    function checkForEnd(project, diagram) {
        var _6_col, _6_it, _6_keys, _6_length, id, item;
        _6_it = 0;
        _6_col = diagram.items;
        _6_keys = Object.keys(_6_col);
        _6_length = _6_keys.length;
        while (true) {
            if (_6_it < _6_length) {
                id = _6_keys[_6_it];
                item = _6_col[id];
                if (item.type === "end") {
                    diagram.hasExit = true
                    break;
                } else {
                    _6_it++;
                }
            } else {
                diagram.hasExit = false
                if ((!(diagram.complex)) && ((diagram.algoprop) && (!(diagram.branches.length === 0)))) {
                    addError(project, diagram, "ERR_NO_EXIT")
                }
                break;
            }
        }
    }
    
    function connectDefaultCase(diagram, citem, prev) {
        var below, belowId;
        belowId = citem.next[0]
        below = diagram.items[belowId]
        prev.next.push(belowId)
        relinkRefs(below, citem.id, prev.id)
    }
    
    function convertCaseToQuestion(diagram, swVar, citem, prev) {
        var below, belowId, comp, newItem;
        belowId = citem.next[0]
        below = diagram.items[belowId]
        comp = swVar + " === " + citem.text
        newItem = {
            type: "question",
            text: comp,
            id: generateItemId(diagram),
            flag1: 1,
            refs: [prev.id],
            next: [belowId]
        }
        diagram.items[newItem.id] = newItem
        prev.next.push(newItem.id)
        relinkRefs(below, citem.id, newItem.id)
        return newItem
    }
    
    function convertItem(item) {
        item.refs = []
        item.next = []
        if (item.one) {
            item.next.push(item.one)
            delete item.one
        }
        if (item.two) {
            item.next.push(item.two)
            delete item.two
        }
        if (item.type === "arrow-loop") {
            item.type = "action"
        }
    }
    
    function createChunks(project, diagram) {
        var _11_col, _11_it, _11_keys, _11_length, _20_col, _20_it, _20_keys, _20_length, _23_col, _23_it, _23_length, context, handler, id, info, item, nextId;
        function branch1() {
            context = {
                visited: {},
                diagram: diagram,
                project: project
            }
            nextChunk(context, diagram.start)
            if (diagram.complex) {
                return branch2();
            } else {
                return branch4();
            }
        }
    
        function branch2() {
            _11_it = 0;
            _11_col = diagram.handlers;
            _11_keys = Object.keys(_11_col);
            _11_length = _11_keys.length;
            while (true) {
                if (_11_it < _11_length) {
                    handler = _11_keys[_11_it];
                    info = _11_col[handler];
                    if (info.itemId) {
                        info.startChunk = nextChunk(
                            context,
                            info.itemId
                        )
                    }
                    _11_it++;
                } else {
                    break;
                }
            }
            return branch3();
        }
    
        function branch3() {
            _20_it = 0;
            _20_col = diagram.items;
            _20_keys = Object.keys(_20_col);
            _20_length = _20_keys.length;
            while (true) {
                if (_20_it < _20_length) {
                    id = _20_keys[_20_it];
                    item = _20_col[id];
                    if (((item.type === "select") && (item.text === "receive")) || (item.type === "sinput")) {
                        _23_it = 0;
                        _23_col = item.next;
                        _23_length = _23_col.length;
                        while (true) {
                            if (_23_it < _23_length) {
                                nextId = _23_col[_23_it];
                                nextChunk(context, nextId)
                                _23_it++;
                            } else {
                                break;
                            }
                        }
                    }
                    _20_it++;
                } else {
                    break;
                }
            }
            return branch4();
        }
    
        function branch4() {
        }
    
        return branch1();
    }
    
    function createClass(rawProject, project, classFolder, name) {
        var _6_col, _6_it, _6_length, child, classObj, folder, methodName;
        classObj = {name: name, methods: {}}
        if (name in project.classes) {
            addError(
                project,
                classFolder,
                "ERR_CLASS_NAME_NOT_UNIQUE"
            )
        } else {
            project.classes[name] = classObj
            _6_it = 0;
            _6_col = classFolder.children;
            _6_length = _6_col.length;
            while (true) {
                if (_6_it < _6_length) {
                    child = _6_col[_6_it];
                    folder = rawProject.folders[child.id]
                    if (folder.type === "drakon") {
                        methodName = name + "_" + folder.name
                        classObj.methods[folder.name] = methodName
                        folder.method = true
                        folder.name = methodName
                    }
                    _6_it++;
                } else {
                    break;
                }
            }
        }
    }
    
    function createEnd(context, srcItem, outputBody) {
        var obj;
        if (context.project.algoprops[
        context.diagram.name
    ] === "algo") {
            addError(
                context.project,
                context.diagram,
                "ERR_NOT_ALL_PATHS_RETURN_A_VALUE",
                srcItem
            )
        } else {
            if (context.diagram.complex) {
                obj = {
                    "type": "ObjectExpression",
                    "properties": [
                        {
                            "type": "Property",
                            "key": {
                                "type": "Identifier",
                                "name": "ok"
                            },
                            "computed": false,
                            "value": {
                                "type": "Literal",
                                "value": true,
                                "raw": "true"
                            },
                            "kind": "init",
                            "method": false,
                            "shorthand": false
                        }
                    ]
                }
                addResolve(outputBody, obj)
            }
            outputBody.push(
                {
                    "type": "ReturnStatement",
                    "argument": null
                }
            )
        }
    }
    
    function createErrorCallback(diagram, item, oldNext) {
        var arg, bad, error, gotoId;
        function branch1() {
            bad = {
                "type": "FunctionExpression",
                "id": null,
                "params": [
                    {
                        "type": "Identifier",
                        "name": "error"
                    }
                ],
                "body": {
                    "type": "BlockStatement",
                    "body": []
                },
                "generator": false,
                "expression": false,
                "async": false
            }
            if (item.isHandler) {
                return branch2();
            } else {
                gotoId = findGotoBranch(diagram, "error")
                if (gotoId) {
                    return branch3();
                } else {
                    if (diagram.resumeNext === "error") {
                        return branch4();
                    } else {
                        return branch2();
                    }
                }
            }
        }
    
        function branch2() {
            error = {
                "type": "Identifier",
                "name": "error"
            }
            addReject(bad.body.body, error)
            return branch5();
        }
    
        function branch3() {
            arg = {
                "type": "Identifier",
                "name": "error"
            }
            callHandler(
                diagram,
                arg,
                gotoId,
                bad.body.body
            )
            return branch5();
        }
    
        function branch4() {
            callHandler(
                diagram,
                undefined,
                oldNext[0],
                bad.body.body
            )
            return branch5();
        }
    
        function branch5() {
            return bad
        }
    
        return branch1();
    }
    
    function createEvent(context, itemId, outputBody) {
        addLiteralAssignment(
            outputBody,
            getSwitchVar(context.diagram),
            itemId
        )
        outputBody.push(
            {
                "type": "ReturnStatement",
                "argument": null
            }
        )
    }
    
    function createEventCase(diagram, name, itemId) {
        var caseIndex, cs, selectItem, state;
        cs = {
            "type": "SwitchCase",
            "test": {
                "type": "Literal",
                "value": itemId,
                "raw": JSON.stringify(itemId)
            },
            "consequent": []
        }
        selectItem = diagram.items[itemId]
        caseIndex = selectItem.cases.indexOf(
            name
        )
        state = selectItem.next[caseIndex]
        cs.consequent.push(
            {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "AssignmentExpression",
                    "operator": "=",
                    "left": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": {
                            "type": "Identifier",
                            "name": "me"
                        },
                        "property": {
                            "type": "Identifier",
                            "name": "state"
                        }
                    },
                    "right": {
                        "type": "Literal",
                        "value": state,
                        "raw": JSON.stringify(
                            state
                        )
                    }
                }
            }
        )
        callMain(diagram, cs.consequent)
        cs.consequent.push(
            {
                "type": "BreakStatement",
                "label": null
            }
        )
        return cs
    }
    
    function createEventFun(diagram, eventInfo) {
        var _13_col, _13_it, _13_length, _21_col, _21_it, _21_length, arg, args, body, cs, fun, itemId, sw;
        function branch1() {
            args = eventInfo.args.map(
                function (arg) {
                    return {
                        type: "Identifier",
                        name: decorateArg(arg)
                    }
                }
            )
            fun = {
                "type": "FunctionExpression",
                "id": null,
                "params": args,
                "body": {
                    "type": "BlockStatement",
                    "body": []
                },
                "generator": false,
                "expression": false,
                "async": false
            }
            body = fun.body.body
            return branch2();
        }
    
        function branch2() {
            _13_it = 0;
            _13_col = eventInfo.args;
            _13_length = _13_col.length;
            while (true) {
                if (_13_it < _13_length) {
                    arg = _13_col[_13_it];
                    body.push(
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": arg
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": decorateArg(arg)
                                }
                            }
                        }
                    )
                    _13_it++;
                } else {
                    break;
                }
            }
            return branch3();
        }
    
        function branch3() {
            sw = {
                "type": "SwitchStatement",
                "discriminant": {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": {
                        "type": "Identifier",
                        "name": "me"
                    },
                    "property": {
                        "type": "Identifier",
                        "name": "state"
                    }
                },
                "cases": []
            }
            body.push(sw)
            return branch4();
        }
    
        function branch4() {
            _21_it = 0;
            _21_col = eventInfo.items;
            _21_length = _21_col.length;
            while (true) {
                if (_21_it < _21_length) {
                    itemId = _21_col[_21_it];
                    cs = createEventCase(
                        diagram,
                        eventInfo.name,
                        itemId
                    )
                    sw.cases.push(cs)
                    _21_it++;
                } else {
                    break;
                }
            }
            return branch5();
        }
    
        function branch5() {
            addDefaultReturn(sw.cases)
            return fun
        }
    
        return branch1();
    }
    
    function createIfIn(type) {
        return {
            "type": "IfStatement",
            "test": {
                "type": "BinaryExpression",
                "operator": "in",
                "left": {
                    "type": "Literal",
                    "value": type,
                    "raw": JSON.stringify(type)
                },
                "right": {
                    "type": "Identifier",
                    "name": "__returnee"
                }
            },
            "consequent": {
                "type": "BlockStatement",
                "body": []
            },
            "alternate": null
        }
    }
    
    function createLoopSwitch(diagram, body) {
        var loop, variable;
        variable = getSwitchVar(diagram)
        loop = {
            "type": "WhileStatement",
            "test": {
                "type": "Literal",
                "value": true,
                "raw": "true"
            },
            "body": {
                "type": "BlockStatement",
                "body": [
                    {
                        "type": "SwitchStatement",
                        "discriminant": {
                            "type": "Identifier",
                            "name": variable
                        },
                        "cases": []
                    }
                ]
            }
        }
        body.push(loop)
        return loop.body.body[0].cases
    }
    
    function createModule(name, moduleFun) {
        var mod;
        mod = {"type": "Program", "body": []}
        mod.body.push(moduleFun)
        mod.body.push(
            {
                "type": "IfStatement",
                "test": {
                    "type": "BinaryExpression",
                    "operator": "!=",
                    "left": {
                        "type": "UnaryExpression",
                        "operator": "typeof",
                        "argument": {
                            "type": "Identifier",
                            "name": "module"
                        },
                        "prefix": true
                    },
                    "right": {
                        "type": "Literal",
                        "value": "undefined",
                        "raw": "\"undefined\""
                    }
                },
                "consequent": {
                    "type": "BlockStatement",
                    "body": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "MemberExpression",
                                    "computed": false,
                                    "object": {
                                        "type": "Identifier",
                                        "name": "module"
                                    },
                                    "property": {
                                        "type": "Identifier",
                                        "name": "exports"
                                    }
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": name
                                }
                            }
                        }
                    ]
                },
                "alternate": null
            }
        )
        return mod
    }
    
    function createModuleFun(name) {
        var moduleFun;
        moduleFun = {
            "type": "FunctionDeclaration",
            "id": {
                "type": "Identifier",
                "name": name
            },
            "params": [],
            "body": {
                "type": "BlockStatement",
                "body": []
            },
            "generator": false,
            "expression": false,
            "async": false
        }
        moduleFun.body.body.push(
            {
                "type": "VariableDeclaration",
                "declarations": [
                    {
                        "type": "VariableDeclarator",
                        "id": {
                            "type": "Identifier",
                            "name": "unit"
                        },
                        "init": {
                            "type": "ObjectExpression",
                            "properties": []
                        }
                    }
                ],
                "kind": "var"
            }
        )
        return moduleFun
    }
    
    function createNewChunk(context, itemId) {
        var chunk;
        chunk = {
            body: [],
            itemId: itemId,
            apVars: {}
        }
        context.diagram.chunks[itemId] = chunk
        return chunk
    }
    
    function createNonReturnElse(diagram, item, ifthen, oldNext) {
        var block;
        function branch1() {
            if (item.isHandler) {
                return branch5();
            } else {
                return branch2();
            }
        }
    
        function branch2() {
            ifthen = tryAddHandlerClause(
                ifthen,
                diagram,
                "error",
                oldNext
            )
            return branch3();
        }
    
        function branch3() {
            ifthen = tryAddHandlerClause(
                ifthen,
                diagram,
                "cancel",
                oldNext
            )
            return branch4();
        }
    
        function branch4() {
            ifthen = tryAddHandlerClause(
                ifthen,
                diagram,
                "goal",
                oldNext
            )
            return branch5();
        }
    
        function branch5() {
            block = {
                "type": "BlockStatement",
                "body": []
            }
            addResolve(
                block.body,
                {
                    type: "Identifier",
                    name: "__returnee"
                }
            )
            ifthen.alternate = block
            return branch6();
        }
    
        function branch6() {
        }
    
        return branch1();
    }
    
    function decorateArg(arg) {
        return "_" + arg + "_"
    }
    
    function expandAsyncs(project, diagram, item, body, start) {
        var body2;
        item.body = {
            "type": "BlockStatement",
            "body": []
        }
        body2 = item.body.body
        expandAsyncsCore(
            project,
            diagram,
            item,
            body,
            start,
            body2
        )
    }
    
    function expandAsyncsCore(project, diagram, item, body, start, body2) {
        var _sw_13, _sw_34, expr, i, node;
        i = start;
        while (true) {
            if (i < body.length) {
                node = body[i]
                _sw_34 = node.type;
                if (_sw_34 === "ExpressionStatement") {
                    expr = node.expression
                    _sw_13 = expr.type;
                    if (_sw_13 === "AssignmentExpression") {
                        if (expr.right.type === "AwaitExpression") {
                            expandAwait(
                                project,
                                diagram,
                                item,
                                body,
                                i + 1,
                                expr,
                                addValueThen
                            )
                            return 
                        } else {
                            body2.push(node)
                        }
                    } else {
                        if (_sw_13 === "AwaitExpression") {
                            expandAwait(
                                project,
                                diagram,
                                item,
                                body,
                                i + 1,
                                expr,
                                addVoidThen
                            )
                            return 
                        } else {
                            body2.push(node)
                        }
                    }
                } else {
                    if (_sw_34 === "ThrowStatement") {
                        if (diagram.complex) {
                            resolveError(
                                project,
                                diagram,
                                item,
                                body2,
                                node
                            )
                        } else {
                            body2.push(node)
                        }
                    } else {
                        if (_sw_34 === "ReturnStatement") {
                            if (diagram.complex) {
                                resolveReturn(body2, node)
                            } else {
                                body2.push(node)
                            }
                        } else {
                            body2.push(node)
                        }
                    }
                }
                i++;
            } else {
                break;
            }
        }
    }
    
    function expandAwait(project, diagram, item, body, nextNodeId, expr, adder) {
        var newItem, nextId, oldNext;
        function branch1() {
            if (diagram.complex) {
                oldNext = item.next
                if (nextNodeId >= body.length) {
                    nextId = item.next[0]
                } else {
                    newItem = {
                        type: item.type,
                        id: generateItemId(diagram),
                        refs: [item.id],
                        next: item.next,
                        flag1: item.flag1
                    }
                    diagram.items[newItem.id] = newItem
                    item.next = [newItem.id]
                    item.type = "action"
                    nextId = newItem.id
                }
                return branch2();
            } else {
                addError(
                    project,
                    diagram,
                    "ERR_AWAIT_REQUIRES_ASYNC_FUNCTION",
                    item
                )
                return branch4();
            }
        }
    
        function branch2() {
            addSetMeState(item.body.body, nextId)
            adder(
                project,
                item.body.body,
                diagram,
                item,
                expr,
                oldNext
            )
            return branch3();
        }
    
        function branch3() {
            if (nextNodeId >= body.length) {
            } else {
                expandAsyncs(
                    project,
                    diagram,
                    newItem,
                    body,
                    nextNodeId
                )
            }
            return branch4();
        }
    
        function branch4() {
        }
    
        return branch1();
    }
    
    function expandCalls(project, diagram) {
        var _5_col, _5_it, _5_length, context, ids, item, itemId, newItem;
        ids = Object.keys(diagram.items)
        _5_it = 0;
        _5_col = ids;
        _5_length = _5_col.length;
        while (true) {
            if (_5_it < _5_length) {
                itemId = _5_col[_5_it];
                item = diagram.items[itemId]
                if (item.body) {
                    context = {
                        project: project,
                        diagram: diagram,
                        item: item,
                        root: true,
                        before: [],
                        depth: 0,
                        rewrite: expandCallsIdle
                    }
                    item.body = traverseAstCore2(
                        context,
                        undefined,
                        undefined,
                        item.body
                    )
                    if (context.before.length === 0) {
                    } else {
                        newItem = insertItemBefore(
                            diagram,
                            item,
                            "action",
                            undefined
                        )
                        newItem.body = {
                            "type": "BlockStatement",
                            "body": context.before
                        }
                    }
                }
                _5_it++;
            } else {
                break;
            }
        }
    }
    
    function expandCallsFromBlock(context, node) {
        var _6_col, _6_it, _6_length, child, context2, newChild;
        context2 = {
            project: context.project,
            diagram: context.diagram,
            item: context.item,
            body: [],
            rewrite: expandCallsIdle,
            depth: context.depth + 1
        }
        if (context.root) {
            context2.before = context.before
        } else {
            context2.before = context2.body
        }
        _6_it = 0;
        _6_col = node.body;
        _6_length = _6_col.length;
        while (true) {
            if (_6_it < _6_length) {
                child = _6_col[_6_it];
                newChild = traverseAstCore2(
                    context2,
                    node.type,
                    "body",
                    child
                )
                context2.body.push(newChild)
                _6_it++;
            } else {
                break;
            }
        }
        return {
            type: "BlockStatement",
            body: context2.body
        }
    }
    
    function expandCallsIdle(context, type, name, node) {
        var _sw_9;
        _sw_9 = node.type;
        if (_sw_9 === "BlockStatement") {
            return expandCallsFromBlock(
                context,
                node
            )
        } else {
            if (_sw_9 === "Program") {
                return expandCallsFromBlock(
                    context,
                    node
                )
            } else {
                if (_sw_9 === "CallExpression") {
                    return extractCall(context, type, node)
                } else {
                    if (_sw_9 === "AwaitExpression") {
                        if (context.depth == 1) {
                            return extractAwait(context, type, node)
                        } else {
                            addError(
                                context.project,
                                context.diagram,
                                "ERR_AWAIT_MUST_BE_TOP_LEVEL",
                                context.item
                            )
                            return undefined
                        }
                    } else {
                        if (_sw_9 === "MemberExpression") {
                            if (node.computed) {
                                return undefined
                            } else {
                                return extractApCall(
                                    context,
                                    type,
                                    name,
                                    node
                                )
                            }
                        } else {
                            return undefined
                        }
                    }
                }
            }
        }
    }
    
    function expandCreateObject(project, diagram, item, node, outputBody) {
        var args, args2, fun;
        args = node.right.arguments 
        if (args.length === 0) {
            addError(
                project,
                diagram,
                "ERR_FUNCTION_NAME_AND_ARGUMENTS_EXPECTED",
                item
            )
        } else {
            fun = nameCreate(args[0].name)
            args2 = args.slice(1)
            outputBody.push(
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "operator": "=",
                        "left": node.left,
                        "right": {
                            "type": "CallExpression",
                            "callee": {
                                type: "Identifier",
                                name: fun
                            },
                            "arguments": args2
                        }
                    }
                }
            )
            outputBody.push(
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "CallExpression",
                        "callee": {
                            "type": "MemberExpression",
                            "computed": false,
                            "object": node.left,
                            "property": {
                                "type": "Identifier",
                                "name": "run"
                            }
                        },
                        "arguments": []
                    }
                }
            )
        }
    }
    
    function expandPause(project, diagram, item) {
        var body, expr, fun, oldBody;
        if (diagram.complex) {
            if (item.body) {
                oldBody = item.body.body[0]
                if ((oldBody) && (oldBody.type === "ExpressionStatement")) {
                    expr = oldBody.expression
                    if ((expr.type === "Identifier") || (expr.type === "Literal")) {
                        item.body = {
                            "type": "BlockStatement",
                            "body": []
                        }
                        body = item.body.body
                        addLiteralAssignment(
                            body,
                            getSwitchVar(diagram),
                            item.next[0]
                        )
                        fun = {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "CallExpression",
                                "callee": {
                                    "type": "Identifier",
                                    "name": "setTimeout"
                                },
                                "arguments": [
                                    {
                                        "type": "FunctionExpression",
                                        "id": null,
                                        "params": [],
                                        "body": {
                                            "type": "BlockStatement",
                                            "body": []
                                        },
                                        "generator": false,
                                        "expression": false,
                                        "async": false
                                    },
                                    expr
                                ]
                            }
                        }
                        callMain(
                            diagram,
                            fun.expression.arguments [0].body.body
                        )
                        body.push(fun)
                        body.push(
                            {
                                mustBreak: true,
                                "type": "ReturnStatement",
                                "argument": null
                            }
                        )
                        item.type = "action"
                    } else {
                        addError(
                            project,
                            diagram,
                            "ERR_VALUE_EXPECTED",
                            item
                        )
                    }
                } else {
                    addError(
                        project,
                        diagram,
                        "ERR_VALUE_EXPECTED",
                        item
                    )
                }
            } else {
                addError(
                    project,
                    diagram,
                    "ERR_VALUE_EXPECTED",
                    item
                )
            }
        } else {
            addError(
                project,
                diagram,
                "ERR_PAUSE_IS_NOT_ALLOWED_IN_NORMAL_FUNCTIONS",
                item
            )
        }
    }
    
    function expandSOutput(project, diagram, item) {
        var expr, inputBody, line, timeoutCall;
        inputBody = item.body.body
        item.body = {
            "type": "BlockStatement",
            "body": []
        }
        line = inputBody[0]
        if (line.type === "ExpressionStatement") {
            expr = line.expression
            if (expr.type === "CallExpression") {
                timeoutCall = {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "CallExpression",
                        "callee": {
                            "type": "Identifier",
                            "name": "setTimeout"
                        },
                        "arguments": [
                            {
                                "type": "FunctionExpression",
                                "id": null,
                                "params": [],
                                "body": {
                                    "type": "BlockStatement",
                                    "body": [line]
                                },
                                "generator": false,
                                "expression": false,
                                "async": false
                            },
                            {
                                "type": "Literal",
                                "value": 0,
                                "raw": "0"
                            }
                        ]
                    }
                }
                item.body.body.push(timeoutCall)
                item.type = "action"
            } else {
                addError(
                    project,
                    diagram,
                    "ERR_ONE_FUNCTION_CALL_EXPECTED",
                    item
                )
            }
        } else {
            addError(
                project,
                diagram,
                "ERR_ONE_FUNCTION_CALL_EXPECTED",
                item
            )
        }
    }
    
    function extractApCall(context, type, name, node) {
        var algoPropFun, algoprop, newNode, prop, start, variable;
        function branch1() {
            if ((type === "AssignmentExpression") && (name === "left")) {
                return undefined
            } else {
                prop = node.property.name
                algoprop = context.project.algoprops[
                    prop
                ]
                if (algoprop === "algo") {
                    return branch2();
                } else {
                    return undefined
                }
            }
        }
    
        function branch2() {
            newNode = traverseAstCore2(
                context,
                node.type,
                "object",
                node.object
            )
            if (newNode.type === "Identifier") {
                start = newNode.name
            } else {
                start = generateVariableName(
                    context.diagram
                )
            }
            variable = start + "__" + prop
            addApVar(
                context.project,
                context.diagram,
                variable
            )
            algoPropFun = calcName(prop)
            addAssignFromCall(
                context.before,
                variable,
                algoPropFun,
                [newNode]
            )
            return {
                type: "Identifier",
                name: variable
            }
        }
    
        function branch3() {
        }
    
        return branch1();
    }
    
    function extractAwait(context, type, node) {
        var newNode, variable;
        if ((!(type === "AssignmentExpression")) && ((!(type === "ExpressionStatement")) || (context.item.type === "question"))) {
            variable = generateVariableName(
                context.diagram
            )
            addNormalVar(
                context.project,
                context.diagram,
                variable
            )
            newNode = traverseAstDefault2(
                context,
                node
            )
            addAssignToVar(
                context.before,
                variable,
                newNode
            )
            return {
                type: "Identifier",
                name: variable
            }
        } else {
            return undefined
        }
    }
    
    function extractCall(context, type, node) {
        var newNode, variable;
        if ((!((type === "AssignmentExpression") || (type === "AwaitExpression"))) && ((!(type === "ExpressionStatement")) || (context.item.type === "question"))) {
            variable = generateVariableName(
                context.diagram
            )
            addNormalVar(
                context.project,
                context.diagram,
                variable
            )
            newNode = traverseAstDefault2(
                context,
                node
            )
            addAssignToVar(
                context.before,
                variable,
                newNode
            )
            return {
                type: "Identifier",
                name: variable
            }
        } else {
            return undefined
        }
    }
    
    function extractFolderId(url) {
        var parts;
        parts = common.split(url, "/")
        return {
            spaceId: parts[0],
            folderId: parts[1]
        }
    }
    
    function extractNodeVars(context, type, name, computed, node) {
        function branch1() {
            if (node.type === "ThisExpression") {
                addError(
                    context.project,
                    context.diagram,
                    "ERR_THIS_KEYWORD_IS_NOT_ALLOWED",
                    context.item
                )
                return branch5();
            } else {
                if (node.type === "VariableDeclaration") {
                    addError(
                        context.project,
                        context.diagram,
                        "ERR_VARIABLE_DECLARATIONS_ARE_NOT_ALLOWED",
                        context.item
                    )
                    return branch5();
                } else {
                    if (context.diagram.algoprop) {
                        if (isAssignmentToProperty(
        context,
        type,
        name,
        node
    )) {
                            if (isAlgopropName(context, node.property)) {
                                addError(
                                    context.project,
                                    context.diagram,
                                    "ERR_CANNOT_ASSIGN_TO_ALGOPROP",
                                    context.item
                                )
                                return branch5();
                            } else {
                                return branch2();
                            }
                        } else {
                            return branch2();
                        }
                    } else {
                        return branch4();
                    }
                }
            }
        }
    
        function branch2() {
            if (node.type === "Identifier") {
                if (node.name in context.project.algoprops) {
                    return branch3();
                } else {
                    return branch4();
                }
            } else {
                return branch5();
            }
        }
    
        function branch3() {
            if ((type === "AssignmentExpression") && (name === "left")) {
                addError(
                    context.project,
                    context.diagram,
                    "ERR_CANNOT_ASSIGN_TO_ALGOPROP",
                    context.item
                )
                return branch5();
            } else {
                if ((name === "param") || (name === "params")) {
                    addError(
                        context.project,
                        context.diagram,
                        "ERR_ALGOPROP_CANNOT_BE_ARGUMENT",
                        context.item
                    )
                    return branch5();
                } else {
                    return branch4();
                }
            }
        }
    
        function branch4() {
            if (type === "AssignmentExpression") {
                if (name === "left") {
                    if (node.type === "Identifier") {
                        if (node.name in context.diagram.vars) {
                        } else {
                            addNormalVar(
                                context.project,
                                context.diagram,
                                node.name
                            )
                        }
                    }
                }
            }
            return branch5();
        }
    
        function branch5() {
            return undefined
        }
    
        return branch1();
    }
    
    function extractReturnFromIns(project, diagram, item) {
        var arg, line, newItem, variable;
        line = item.body.body[0]
        if (line.type === "ReturnStatement") {
            arg = line.argument
            newItem = insertItemAfter(
                diagram,
                item,
                "action",
                undefined
            )
            newItem.body = {
                type: "BlockStatement",
                body: []
            }
            variable = generateVariableName(diagram)
            addNormalVar(project, diagram, variable)
            item.body.body = [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "operator": "=",
                        "left": {
                            "type": "Identifier",
                            "name": variable
                        },
                        "right": arg
                    }
                }
            ]
            newItem.body.body.push(
                {
                    type: "ReturnStatement",
                    argument: {
                        type: "Identifier",
                        name: variable
                    }
                }
            )
        }
    }
    
    function extractVariables(project, diagram) {
        var _12_col, _12_it, _12_length, _16_col, _16_it, _16_keys, _16_length, _24_col, _24_it, _24_keys, _24_length, arg, eventInfo, eventName, item, itemId;
        function branch1() {
            if (diagram.algoprop) {
                if (diagram.args.length > 0) {
                    addError(
                        project,
                        diagram,
                        "ERR_ARGUMENTS_NOT_ALLOWED_IN_ALGOPROPS"
                    )
                    return branch5();
                } else {
                    diagram.args = ["__obj"]
                    return branch2();
                }
            } else {
                return branch2();
            }
        }
    
        function branch2() {
            _12_it = 0;
            _12_col = diagram.args;
            _12_length = _12_col.length;
            while (true) {
                if (_12_it < _12_length) {
                    arg = _12_col[_12_it];
                    addArgVar(project, diagram, arg)
                    _12_it++;
                } else {
                    break;
                }
            }
            return branch3();
        }
    
        function branch3() {
            _16_it = 0;
            _16_col = diagram.items;
            _16_keys = Object.keys(_16_col);
            _16_length = _16_keys.length;
            while (true) {
                if (_16_it < _16_length) {
                    itemId = _16_keys[_16_it];
                    item = _16_col[itemId];
                    traverseAst(
                        project,
                        diagram,
                        item,
                        extractNodeVars
                    )
                    _16_it++;
                } else {
                    break;
                }
            }
            return branch4();
        }
    
        function branch4() {
            _24_it = 0;
            _24_col = diagram.events;
            _24_keys = Object.keys(_24_col);
            _24_length = _24_keys.length;
            while (true) {
                if (_24_it < _24_length) {
                    eventName = _24_keys[_24_it];
                    eventInfo = _24_col[eventName];
                    addEventArgsToVars(
                        project,
                        diagram,
                        eventInfo
                    )
                    _24_it++;
                } else {
                    break;
                }
            }
            return branch5();
        }
    
        function branch5() {
        }
    
        return branch1();
    }
    
    function fetchFolder_onChildCompleted(self, data) {
        switch (self.state) {
            case "6_wait":
                self._folder = data;
                self.state = "9";
                break;
            default:
                return;
        }
        fetchFolder_run(self);
    }
    
    function fetchFolder_run(self) {
        var work = true;
        while (work) {
            switch (self.state) {
                case "3":
                    self._urlBase = '/api/folder/';
                    
                    self._url = self._urlBase + self._spaceId + '/' + self._folderId;
                    
                    self.state = "6_wait";
                    work = false;
                    var machine = http.getFromServer(self, self._url);
                    machine.run();
                    break;
                case "9":
                    if (self._folder.children) {
                        self.state = "8";
                    } else {
                        self._folder.children = [];
                        
                        self.state = "8";
                    }
                    break;
                case "8":
                    self.state = undefined;
                    sm.sendMessage(self.parent, "onChildCompleted", self._folder);
                    work = false;
                    break;
                default:
                    return;
            }
        }
    }
    
    function fetchFolder(parent, spaceId, folderId) {
        var self = sm.createMachine("fetchFolder");
        self._spaceId = spaceId;
        self._folderId = folderId;
        sm.addMethod(self, "onChildCompleted", fetchFolder_onChildCompleted);
        sm.addChild(parent, self);
        sm.addMethod(self, "run", fetchFolder_run);
        self.state = "3";
        return self;
    }
    
    function fetchFolderProps_onChildCompleted(self, data) {
        switch (self.state) {
            case "9_wait":
                self._folder = data;
                self.state = "8";
                break;
            default:
                return;
        }
        fetchFolderProps_run(self);
    }
    
    function fetchFolderProps_run(self) {
        var work = true;
        while (work) {
            switch (self.state) {
                case "3":
                    self._urlBase = '/api/folder_props/';
                    
                    self._url = self._urlBase + self._spaceId + '/' + self._folderId;
                    
                    self.state = "9_wait";
                    work = false;
                    var machine = http.getFromServer(self, self._url);
                    machine.run();
                    break;
                case "8":
                    self.state = undefined;
                    sm.sendMessage(self.parent, "onChildCompleted", self._folder);
                    work = false;
                    break;
                default:
                    return;
            }
        }
    }
    
    function fetchFolderProps(parent, spaceId, folderId) {
        var self = sm.createMachine("fetchFolderProps");
        self._spaceId = spaceId;
        self._folderId = folderId;
        sm.addMethod(self, "onChildCompleted", fetchFolderProps_onChildCompleted);
        sm.addChild(parent, self);
        sm.addMethod(self, "run", fetchFolderProps_run);
        self.state = "3";
        return self;
    }
    
    function fetchFolderRec_onChildCompleted(self, data) {
        switch (self.state) {
            case "6_wait":
                self._folder = data;
                self.state = "13";
                break;
            case "12_wait":
                self.state = "8";
                break;
            default:
                return;
        }
        fetchFolderRec_run(self);
    }
    
    function fetchFolderRec_run(self) {
        var work = true;
        while (work) {
            switch (self.state) {
                case "6":
                    self.state = "6_wait";
                    work = false;
                    var machine = fetchFolder(self, self._context.spaceId, self._folderId);
                    machine.run();
                    break;
                case "13":
                    self._context.folders[self._folderId] = self._folder;
                    
                    self.__9_it = 0;
                    self.__9_col = self._folder.children;
                    self.__9_length = self.__9_col.length;
                    
                    self.state = "_9_loop";
                    break;
                case "_9_loop":
                    if (self.__9_it < self.__9_length) {
                        self._child = self.__9_col[self.__9_it];
                        
                        self.state = "12_wait";
                        work = false;
                        var machine = fetchFolderRec(self, self._context, self._child.id);
                        machine.run();
                    } else {
                        self.state = undefined;
                        sm.sendMessage(self.parent, "onChildCompleted", undefined);
                        work = false;
                    }
                    break;
                case "8":
                    self.__9_it++;
                    
                    self.state = "_9_loop";
                    break;
                default:
                    return;
            }
        }
    }
    
    function fetchFolderRec(parent, context, folderId) {
        var self = sm.createMachine("fetchFolderRec");
        self._context = context;
        self._folderId = folderId;
        sm.addMethod(self, "onChildCompleted", fetchFolderRec_onChildCompleted);
        sm.addChild(parent, self);
        sm.addMethod(self, "run", fetchFolderRec_run);
        self.state = "6";
        return self;
    }
    
    function fetchProject_onChildCompleted(self, data) {
        switch (self.state) {
            case "7_wait":
                self.state = "21";
                break;
            case "21_wait":
                self._props = data;
                self.state = "22";
                break;
            default:
                return;
        }
        fetchProject_run(self);
    }
    
    function fetchProject_run(self) {
        var work = true;
        while (work) {
            switch (self.state) {
                case "4":
                    self._root = extractFolderId(self._url);
                    
                    self._result = {
                        spaceId: self._root.spaceId,
                        rootId: self._root.folderId,
                        folders: {},
                        name: ''
                    };
                    
                    self.state = "7_wait";
                    work = false;
                    var machine = fetchFolderRec(self, self._result, self._root.folderId);
                    machine.run();
                    break;
                case "21":
                    self.state = "21_wait";
                    work = false;
                    var machine = fetchFolderProps(self, self._root.spaceId, self._root.folderId);
                    machine.run();
                    break;
                case "22":
                    self._result.dependencies = self._props.dependencies;
                    
                    self._result.name = self._result.folders[self._root.folderId].name;
                    
                    self.state = undefined;
                    sm.sendMessage(self.parent, "onChildCompleted", self._result);
                    work = false;
                    break;
                default:
                    return;
            }
        }
    }
    
    function fetchProject(parent, url) {
        var self = sm.createMachine("fetchProject");
        self._url = url;
        sm.addMethod(self, "onChildCompleted", fetchProject_onChildCompleted);
        sm.addChild(parent, self);
        sm.addMethod(self, "run", fetchProject_run);
        self.state = "4";
        return self;
    }
    
    function fillCatch(diagram, mainTry) {
        var errorHandler, errorStructure, ifst, output, state, tryHandler;
        function branch1() {
            tryHandler = mainTry.handlers[0].body.body
            errorHandler = diagram.handlers.error
            if ((errorHandler) && (errorHandler.itemId)) {
                ifst = {
                    "type": "IfStatement",
                    "test": {
                        "type": "Identifier",
                        "name": "__inHandler"
                    },
                    "consequent": {
                        "type": "BlockStatement",
                        "body": []
                    },
                    "alternate": {
                        "type": "BlockStatement",
                        "body": []
                    }
                }
                tryHandler.push(ifst)
                return branch2();
            } else {
                output = tryHandler
                return branch3();
            }
        }
    
        function branch2() {
            state = {
                "type": "Literal",
                "value": errorHandler.itemId,
                "raw": JSON.stringify(
                    errorHandler.itemId
                )
            }
            ifst.alternate.body.push(
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "operator": "=",
                        "left": {
                            "type": "MemberExpression",
                            "computed": false,
                            "object": {
                                "type": "Identifier",
                                "name": "me"
                            },
                            "property": {
                                "type": "Identifier",
                                "name": "state"
                            }
                        },
                        "right": state
                    }
                },
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "operator": "=",
                        "left": {
                            "type": "Identifier",
                            "name": "__handlerData"
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "ex"
                        }
                    }
                }
            )
            callMain(diagram, ifst.alternate.body)
            output = ifst.consequent.body
            return branch3();
        }
    
        function branch3() {
            errorStructure = {
                "type": "Identifier",
                "name": "ex"
            }
            addReject(output, errorStructure)
            return branch4();
        }
    
        function branch4() {
        }
    
        return branch1();
    }
    
    function findGotoBranch(diagram, handlerType) {
        var handler;
        handler = diagram.handlers[handlerType]
        if ((handler) && (handler.type === "goto")) {
            return handler.itemId
        } else {
            return undefined
        }
    }
    
    function firstCap(text) {
        if (text) {
            return text[0].toUpperCase() + text.slice(
                1
            )
        } else {
            return ""
        }
    }
    
    function forAllDiagrams(project, callback) {
        var _5_col, _5_it, _5_keys, _5_length, diagram, name;
        _5_it = 0;
        _5_col = project.diagrams;
        _5_keys = Object.keys(_5_col);
        _5_length = _5_keys.length;
        while (true) {
            if (_5_it < _5_length) {
                name = _5_keys[_5_it];
                diagram = _5_col[name];
                callback(project, diagram)
                _5_it++;
            } else {
                break;
            }
        }
    }
    
    function forAllItems(project, diagram, callback) {
        var _5_col, _5_it, _5_keys, _5_length, id, item;
        _5_it = 0;
        _5_col = diagram.items;
        _5_keys = Object.keys(_5_col);
        _5_length = _5_keys.length;
        while (true) {
            if (_5_it < _5_length) {
                id = _5_keys[_5_it];
                item = _5_col[id];
                callback(project, diagram, item)
                _5_it++;
            } else {
                break;
            }
        }
    }
    
    function generateBodies(project, diagram) {
        if (diagram.input) {
        } else {
            diagram.body = buildDiagramBody(
                project,
                diagram
            )
            if (diagram.complex) {
                diagram.bodyCreate = buildDiagramBodyCreate(
                    project,
                    diagram
                )
            }
        }
    }
    
    function generateClassBody(project, classObj, outputBody) {
        var _14_col, _14_it, _14_keys, _14_length, fun, methodName, name;
        function branch1() {
            fun = {
                "type": "FunctionDeclaration",
                "id": {
                    "type": "Identifier",
                    "name": classObj.name
                },
                "params": [],
                "body": {
                    "type": "BlockStatement",
                    "body": []
                },
                "generator": false,
                "expression": false,
                "async": false
            }
            return branch2();
        }
    
        function branch2() {
            fun.body.body.push(
                {
                    "type": "VariableDeclaration",
                    "declarations": [
                        {
                            "type": "VariableDeclarator",
                            "id": {
                                "type": "Identifier",
                                "name": "self"
                            },
                            "init": {
                                "type": "ObjectExpression",
                                "properties": []
                            }
                        }
                    ],
                    "kind": "var"
                }
            )
            return branch3();
        }
    
        function branch3() {
            _14_it = 0;
            _14_col = classObj.methods;
            _14_keys = Object.keys(_14_col);
            _14_length = _14_keys.length;
            while (true) {
                if (_14_it < _14_length) {
                    name = _14_keys[_14_it];
                    methodName = _14_col[name];
                    generateClassMethod(
                        project,
                        name,
                        methodName,
                        fun.body.body
                    )
                    _14_it++;
                } else {
                    break;
                }
            }
            return branch4();
        }
    
        function branch4() {
            fun.body.body.push(
                {
                    "type": "ReturnStatement",
                    "argument": {
                        "type": "Identifier",
                        "name": "self"
                    }
                }
            )
            return branch5();
        }
    
        function branch5() {
            outputBody.push(fun)
        }
    
        return branch1();
    }
    
    function generateClassMethod(project, name, methodName, outputBody) {
        var args, argsInternal, diagram;
        diagram = project.diagrams[methodName]
        args = getFunctionParams(diagram)
        argsInternal = args.slice()
        args.shift()
        outputBody.push(
            {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "AssignmentExpression",
                    "operator": "=",
                    "left": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": {
                            "type": "Identifier",
                            "name": "self"
                        },
                        "property": {
                            "type": "Identifier",
                            "name": name
                        }
                    },
                    "right": {
                        "type": "FunctionExpression",
                        "id": null,
                        "params": args,
                        "body": {
                            "type": "BlockStatement",
                            "body": [
                                {
                                    "type": "ReturnStatement",
                                    "argument": {
                                        "type": "CallExpression",
                                        "callee":
                                        {
                                            "type":
                                            "Identifier",
                                            "name":
                                            methodName
                                        },
                                        "arguments":
                                        argsInternal
                                    }
                                }
                            ]
                        },
                        "generator": false,
                        "expression": false,
                        "async": false
                    }
                }
            }
        )
        if (diagram.complex) {
            outputBody.push(
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "operator": "=",
                        "left": {
                            "type": "MemberExpression",
                            "computed": false,
                            "object": {
                                "type": "Identifier",
                                "name": "self"
                            },
                            "property": {
                                "type": "Identifier",
                                "name": nameCreate(
                                    name
                                )
                            }
                        },
                        "right": {
                            "type": "FunctionExpression",
                            "id": null,
                            "params": args,
                            "body": {
                                "type": "BlockStatement",
                                "body": [
                                    {
                                        "type": "ReturnStatement",
                                        "argument": {
                                            "type": "CallExpression",
                                            "callee":
                                            {
                                                "type":
                                                "Identifier",
                                                "name":
                                                nameCreate(
                                                    methodName
                                                )
                                            },
                                            "arguments":
                                            argsInternal
                                        }
                                    }
                                ]
                            },
                            "generator": false,
                            "expression": false,
                            "async": false
                        }
                    }
                }
            )
        }
    }
    
    function generateCode(rawProject) {
        var _110_col, _110_it, _110_keys, _110_length, _113_col, _113_it, _113_keys, _113_length, _32_col, _32_it, _32_keys, _32_length, _97_col, _97_it, _97_length, classObj, dia, diagram, funName, mod, moduleFun, name, project;
        function branch1() {
            project = prepareProject(rawProject)
            if (project.errors.length === 0) {
                forAllDiagrams(project, rewireSwitch)
                if (project.errors.length === 0) {
                    forAllDiagrams(project, matchForeach)
                    if (project.errors.length === 0) {
                        forAllDiagrams(project, rewireForeach)
                        if (project.errors.length === 0) {
                            return branch2();
                        } else {
                            return branch4();
                        }
                    } else {
                        return branch4();
                    }
                } else {
                    return branch4();
                }
            } else {
                return branch4();
            }
        }
    
        function branch2() {
            forAllDiagrams(project, parseSource)
            if (project.errors.length === 0) {
                forAllDiagrams(project, extractVariables)
                if (project.errors.length === 0) {
                    forAllDiagrams(project, prepareAlgoprops)
                    if (project.errors.length === 0) {
                        forAllDiagrams(project, expandCalls)
                        if (project.errors.length === 0) {
                            forAllDiagrams(project, rewireApReturn)
                            if (project.errors.length === 0) {
                                forAllDiagrams(project, markHandlers)
                                return branch3();
                            } else {
                                return branch4();
                            }
                        } else {
                            return branch4();
                        }
                    } else {
                        return branch4();
                    }
                } else {
                    return branch4();
                }
            } else {
                return branch4();
            }
        }
    
        function branch3() {
            forAllDiagrams(project, generateComplex)
            if (project.errors.length === 0) {
                return branch5();
            } else {
                return branch4();
            }
        }
    
        function branch4() {
            return {
                errors: project.errors
            }
        }
    
        function branch5() {
            forAllDiagrams(project, generateBodies)
            moduleFun = createModuleFun(project.name)
            addDepVars(project, moduleFun.body.body)
            _32_it = 0;
            _32_col = project.diagrams;
            _32_keys = Object.keys(_32_col);
            _32_length = _32_keys.length;
            while (true) {
                if (_32_it < _32_length) {
                    name = _32_keys[_32_it];
                    diagram = _32_col[name];
                    if (diagram.body) {
                        moduleFun.body.body.push(diagram.body)
                    }
                    if (diagram.bodyCreate) {
                        moduleFun.body.body.push(
                            diagram.bodyCreate
                        )
                    }
                    _32_it++;
                } else {
                    break;
                }
            }
            return branch6();
        }
    
        function branch6() {
            _113_it = 0;
            _113_col = project.classes;
            _113_keys = Object.keys(_113_col);
            _113_length = _113_keys.length;
            while (true) {
                if (_113_it < _113_length) {
                    name = _113_keys[_113_it];
                    classObj = _113_col[name];
                    generateClassBody(
                        project,
                        classObj,
                        moduleFun.body.body
                    )
                    _113_it++;
                } else {
                    break;
                }
            }
            return branch7();
        }
    
        function branch7() {
            _97_it = 0;
            _97_col = project.exported;
            _97_length = _97_col.length;
            while (true) {
                if (_97_it < _97_length) {
                    name = _97_col[_97_it];
                    dia = project.diagrams[name]
                    if (dia.method) {
                    } else {
                        if (dia.algoprop) {
                            funName = calcName(name)
                        } else {
                            if (dia.complex) {
                                assignIdProp(
                                    moduleFun.body.body,
                                    "unit",
                                    nameCreate(name),
                                    nameCreate(name)
                                )
                            }
                            funName = name
                        }
                        assignIdProp(
                            moduleFun.body.body,
                            "unit",
                            funName,
                            funName
                        )
                    }
                    _97_it++;
                } else {
                    break;
                }
            }
            return branch8();
        }
    
        function branch8() {
            _110_it = 0;
            _110_col = project.classes;
            _110_keys = Object.keys(_110_col);
            _110_length = _110_keys.length;
            while (true) {
                if (_110_it < _110_length) {
                    name = _110_keys[_110_it];
                    classObj = _110_col[name];
                    assignIdProp(
                        moduleFun.body.body,
                        "unit",
                        name,
                        name
                    )
                    _110_it++;
                } else {
                    break;
                }
            }
            return branch9();
        }
    
        function branch9() {
            addDepProps(project, moduleFun.body.body)
            moduleFun.body.body.push(
                {
                    "type": "ReturnStatement",
                    "argument": {
                        "type": "Identifier",
                        "name": "unit"
                    }
                }
            )
            mod = createModule(
                project.name,
                moduleFun
            )
            return {
                src: escodegen.generate(mod),
                errors: []
            }
        }
    
        function branch10() {
        }
    
        return branch1();
    }
    
    function generateComplex(project, diagram) {
        var _5_col, _5_it, _5_keys, _5_length, _sw_20, item, itemId;
        _5_it = 0;
        _5_col = diagram.items;
        _5_keys = Object.keys(_5_col);
        _5_length = _5_keys.length;
        while (true) {
            if (_5_it < _5_length) {
                itemId = _5_keys[_5_it];
                item = _5_col[itemId];
                _sw_20 = item.type;
                if (_sw_20 === "pause") {
                    expandPause(project, diagram, item)
                } else {
                    if (_sw_20 === "soutput") {
                        expandSOutput(project, diagram, item)
                    } else {
                        if (item.body) {
                            expandAsyncs(
                                project,
                                diagram,
                                item,
                                item.body.body,
                                0
                            )
                            traverseAst(
                                project,
                                diagram,
                                item,
                                replaceGetHandlerData
                            )
                        }
                    }
                }
                _5_it++;
            } else {
                break;
            }
        }
    }
    
    function generateFor(diagram, item, expressions) {
        var condition;
        condition = expressions[1]
        condition = stripLast(expressions[1])
        item.loopType = "for"
        item.loopInit = expressions[0]
        item.loopCondition = condition
        item.loopBefore = undefined
        item.loopAfter = expressions[2]
    }
    
    function generateForeachArray(diagram, item, variable, collection) {
        var collectionVar, counterVar;
        collection = stripLast(collection)
        collectionVar = generateVariableName(
            diagram
        )
        counterVar = generateVariableName(
            diagram
        )
        item.loopType = "array"
        item.loopInit = collectionVar + " = " + collection
        + ";\n" + counterVar + " = 0;"
        item.loopCondition = counterVar + " < " +
        collectionVar + ".length"
        item.loopBefore = variable + " = " + collectionVar
        + "[" + counterVar + "];"
        item.loopAfter = counterVar + "++;"
    }
    
    function generateForeachMap(diagram, item, var1, var2, collection) {
        var collectionVar, counterVar, keysVar;
        collection = stripLast(collection)
        keysVar = generateVariableName(diagram)
        collectionVar = generateVariableName(
            diagram
        )
        counterVar = generateVariableName(
            diagram
        )
        item.loopType = "array"
        item.loopCondition = counterVar + " < " +
        keysVar + ".length"
        item.loopBefore = var1 + " = " + keysVar
        + "[" + counterVar + "];\n" + var2 + " = "
        + collectionVar + "[" + var1 + "];"
        item.loopAfter = counterVar + "++;"
        item.loopInit = collectionVar + " = " + collection
        + ";\n" + keysVar + " = Object.keys(" + collectionVar
        + ");\n" + counterVar + " = 0;"
    }
    
    function generateItemId(diagram) {
        diagram.nextId++
        return "_item" + diagram.nextId
    }
    
    function generateVariableName(diagram) {
        diagram.nextVar++
        return "_var" + diagram.nextVar
    }
    
    function getFunctionBody(project, diagram) {
        var _23_col, _23_it, _23_keys, _23_length, body, chunk, chunkId, chunkIds, cs, firstChunk, mainBody, sw;
        function branch1() {
            body = []
            if (diagram.start) {
                createChunks(project, diagram)
                mainBody = buildFunctionStructure(
                    project,
                    diagram,
                    diagram.start,
                    body
                )
                return branch2();
            } else {
                return branch3();
            }
        }
    
        function branch2() {
            chunkIds = Object.keys(diagram.chunks)
            if (chunkIds.length === 0) {
            } else {
                if (chunkIds.length === 1) {
                    firstChunk = diagram.chunks[chunkIds[0]]
                    common.addRange(firstChunk.body, mainBody)
                } else {
                    sw = createLoopSwitch(diagram, mainBody)
                    _23_it = 0;
                    _23_col = diagram.chunks;
                    _23_keys = Object.keys(_23_col);
                    _23_length = _23_keys.length;
                    while (true) {
                        if (_23_it < _23_length) {
                            chunkId = _23_keys[_23_it];
                            chunk = _23_col[chunkId];
                            cs = addCase(sw, chunkId)
                            common.addRange(chunk.body, cs)
                            if (allPathsReturn(chunk.body)) {
                            } else {
                                addBreak(chunk, cs)
                            }
                            _23_it++;
                        } else {
                            break;
                        }
                    }
                    addDefaultReturn(sw)
                }
            }
            return branch3();
        }
    
        function branch3() {
            return body
        }
    
        return branch1();
    }
    
    function getFunctionName(diagram) {
        if (diagram.algoprop) {
            return calcName(diagram.name)
        } else {
            if (diagram.complex) {
                return nameCreate(diagram.name)
            } else {
                return diagram.name
            }
        }
    }
    
    function getFunctionParams(diagram) {
        return diagram.args.map(
            function (arg) {
                return {
                    type: "Identifier",
                    name: arg
                }
            }
        )
    }
    
    function getHandler(diagram, text) {
        var _8_col, _8_it, _8_keys, _8_length, handler, info, name, text2, text3, text4;
        if (text) {
            text2 = text.trim().toLowerCase()
            text3 = replace(text2, "\n", " ")
            text4 = replace(text3, "\t", " ")
            name = split(text4, " ").join(" ")
            _8_it = 0;
            _8_col = diagram.handlers;
            _8_keys = Object.keys(_8_col);
            _8_length = _8_keys.length;
            while (true) {
                if (_8_it < _8_length) {
                    handler = _8_keys[_8_it];
                    info = _8_col[handler];
                    if (info.branch === name) {
                        return info
                    } else {
                        _8_it++;
                    }
                } else {
                    return undefined
                }
            }
        } else {
            return undefined
        }
    }
    
    function getNext(diagram, item, index) {
        var id;
        id = item.next[index]
        return diagram.items[id]
    }
    
    function getRunnerBody(project, diagram) {
        var args, body;
        body = []
        args = getFunctionParams(diagram)
        body.push(
            {
                "type": "VariableDeclaration",
                "declarations": [
                    {
                        "type": "VariableDeclarator",
                        "id": {
                            "type": "Identifier",
                            "name": "__obj"
                        },
                        "init": {
                            "type": "CallExpression",
                            "callee": {
                                "type": "Identifier",
                                "name": nameCreate(
                                    diagram.name
                                )
                            },
                            "arguments": args
                        }
                    }
                ],
                "kind": "var"
            }
        )
        body.push(
            {
                "type": "ReturnStatement",
                "argument": {
                    "type": "CallExpression",
                    "callee": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": {
                            "type": "Identifier",
                            "name": "__obj"
                        },
                        "property": {
                            "type": "Identifier",
                            "name": "run"
                        }
                    },
                    "arguments": []
                }
            }
        )
        return body
    }
    
    function getSwitchVar(diagram) {
        var variable;
        if (diagram.complex) {
            variable = "me.state"
        } else {
            variable = "__state"
        }
        return variable
    }
    
    function injectObj(project, diagram, item) {
        traverseAst(
            project,
            diagram,
            item,
            rewriteNode
        )
    }
    
    function injectObjInArray(context, type, name, computed, prop) {
        var element, i, rewritten;
        i = 0;
        while (true) {
            if (i < prop.length) {
                element = prop[i]
                if (element) {
                    rewritten = context.rewrite(
                        context,
                        type,
                        name,
                        computed,
                        element
                    )
                    if (rewritten) {
                        prop[i] = rewritten
                    } else {
                        injectObjInNode(context, element)
                    }
                }
                i++;
            } else {
                break;
            }
        }
    }
    
    function injectObjInNode(context, node) {
        var _22_col, _22_it, _22_length, name, names, prop, rewritten;
        names = Object.keys(node)
        _22_it = 0;
        _22_col = names;
        _22_length = _22_col.length;
        while (true) {
            if (_22_it < _22_length) {
                name = _22_col[_22_it];
                prop = node[name]
                if (Array.isArray(prop)) {
                    injectObjInArray(
                        context,
                        node.type,
                        name,
                        prop.computed,
                        prop
                    )
                } else {
                    if ((prop) && (( typeof prop === "object") && (prop.type))) {
                        rewritten = context.rewrite(
                            context,
                            node.type,
                            name,
                            prop.computed,
                            prop
                        )
                        if (rewritten) {
                            node[name] = rewritten
                        } else {
                            injectObjInNode(context, prop)
                        }
                    }
                }
                _22_it++;
            } else {
                break;
            }
        }
    }
    
    function insertItemAfter(diagram, item, type, text) {
        var _8_col, _8_it, _8_length, newItem, next, nextId;
        next = item.next
        newItem = {
            type: type,
            text: text,
            id: generateItemId(diagram),
            next: next,
            refs: [item.id]
        }
        diagram.items[newItem.id] = newItem
        item.next = [newItem.id]
        _8_it = 0;
        _8_col = next;
        _8_length = _8_col.length;
        while (true) {
            if (_8_it < _8_length) {
                nextId = _8_col[_8_it];
                relinkRefs(
                    diagram.items[nextId],
                    item.id,
                    newItem.id
                )
                _8_it++;
            } else {
                break;
            }
        }
        return newItem
    }
    
    function insertItemBefore(diagram, item, type, text) {
        var _8_col, _8_it, _8_length, newItem, refId, refs;
        refs = item.refs
        newItem = {
            type: type,
            text: text,
            id: generateItemId(diagram),
            refs: refs,
            next: [item.id]
        }
        diagram.items[newItem.id] = newItem
        item.refs = [newItem.id]
        _8_it = 0;
        _8_col = refs;
        _8_length = _8_col.length;
        while (true) {
            if (_8_it < _8_length) {
                refId = _8_col[_8_it];
                relinkNext(
                    diagram.items[refId],
                    item.id,
                    newItem.id
                )
                _8_it++;
            } else {
                break;
            }
        }
        return newItem
    }
    
    function isAlgopropName(context, node) {
        if ((node.type === "Identifier") && (node.name in context.project.algoprops)) {
            return true
        } else {
            return false
        }
    }
    
    function isApVar(diagram, variable) {
        var info;
        info = diagram.vars[variable]
        if (info) {
            return info.type === "ap"
        } else {
            return false
        }
    }
    
    function isAssignmentToProperty(context, type, name, node) {
        if ((((type === "AssignmentExpression") && (name === "left")) && (node.type === "MemberExpression")) && (!(node.computed))) {
            return true
        } else {
            return false
        }
    }
    
    function isExit(node) {
        var _sw_7;
        _sw_7 = node.type;
        if (_sw_7 === "ReturnStatement") {
            return true
        } else {
            if (_sw_7 === "ThrowStatement") {
                return true
            } else {
                if (_sw_7 === "BreakStatement") {
                    return true
                } else {
                    return false
                }
            }
        }
    }
    
    function isForbidden(variable) {
        if (((variable === "me") || (variable === "__resolve")) || (variable === "__result")) {
            return true
        } else {
            return false
        }
    }
    
    function isInput(folder) {
        var _7_col, _7_it, _7_keys, _7_length, id, item, t2;
        _7_it = 0;
        _7_col = folder.items;
        _7_keys = Object.keys(_7_col);
        _7_length = _7_keys.length;
        while (true) {
            if (_7_it < _7_length) {
                id = _7_keys[_7_it];
                item = _7_col[id];
                if (((((((item.type === "action") || (item.type === "question")) || (item.type === "insertion")) || (item.type === "soutput")) || (item.type === "sinput")) || (item.type === "pause")) || (item.type === "case")) {
                    t2 = item.text || ""
                    if (t2.trim() === "") {
                        _7_it++;
                    } else {
                        return false
                    }
                } else {
                    _7_it++;
                }
            } else {
                return true
            }
        }
    }
    
    function mainCore_onChildCompleted(self, data) {
        switch (self.state) {
            case "6_wait":
                self._project = data;
                self.state = "4";
                break;
            default:
                return;
        }
        mainCore_run(self);
    }
    
    function mainCore_run(self) {
        var work = true;
        while (work) {
            switch (self.state) {
                case "6":
                    self.state = "6_wait";
                    work = false;
                    var machine = fetchProject(self, self._url);
                    machine.run();
                    break;
                case "4":
                    self._code = generateCode(self._project);
                    
                    self.state = undefined;
                    sm.sendMessage(self.parent, "onChildCompleted", self._code);
                    work = false;
                    break;
                default:
                    return;
            }
        }
    }
    
    function mainCore(parent, url) {
        var self = sm.createMachine("mainCore");
        self._url = url;
        sm.addMethod(self, "onChildCompleted", mainCore_onChildCompleted);
        sm.addChild(parent, self);
        sm.addMethod(self, "run", mainCore_run);
        self.state = "6";
        return self;
    }
    
    function markHandlerItem(diagram, visited, item) {
        var _10_col, _10_it, _10_length, itemId, nextId, nextItem;
        itemId = item.id
        if (itemId in visited) {
        } else {
            visited[itemId] = true
            item.isHandler = true
            _10_it = 0;
            _10_col = item.next;
            _10_length = _10_col.length;
            while (true) {
                if (_10_it < _10_length) {
                    nextId = _10_col[_10_it];
                    nextItem = diagram.items[nextId]
                    if (nextItem.type === "branch") {
                    } else {
                        markHandlerItem(
                            diagram,
                            visited,
                            nextItem
                        )
                    }
                    _10_it++;
                } else {
                    break;
                }
            }
        }
    }
    
    function markHandlers(project, diagram) {
        var _5_col, _5_it, _5_keys, _5_length, handler, info, item, visited;
        visited = {}
        _5_it = 0;
        _5_col = diagram.handlers;
        _5_keys = Object.keys(_5_col);
        _5_length = _5_keys.length;
        while (true) {
            if (_5_it < _5_length) {
                handler = _5_keys[_5_it];
                info = _5_col[handler];
                if (info.itemId) {
                    item = diagram.items[info.itemId]
                    markHandlerItem(diagram, visited, item)
                }
                _5_it++;
            } else {
                break;
            }
        }
    }
    
    function matchForeach(project, diagram) {
        var stack;
        stack = []
        traverseItems(
            project,
            diagram,
            matchForeachItem,
            stack
        )
    }
    
    function matchForeachItem(project, diagram, item, stack) {
        var _sw_7, begin, beginId;
        _sw_7 = item.type;
        if (_sw_7 === "loopbegin") {
            stack.push(item.id)
        } else {
            if (_sw_7 === "loopend") {
                beginId = stack.pop()
                begin = diagram.items[beginId]
                begin.end = item.id
                item.begin = beginId
                parseForeach(project, diagram, begin)
            } else {
            }
        }
    }
    
    function nameCreate(name) {
        return name + "_create"
    }
    
    function nextChunk(context, itemId) {
        var chunk, item;
        if (itemId in context.visited) {
        } else {
            context.visited[itemId] = itemId
            item = context.diagram.items[itemId]
            chunk = createNewChunk(context, itemId)
            streamExpressionsFromItem(
                context,
                item,
                [],
                chunk.body
            )
        }
    }
    
    function parseArguments(project, diagram) {
        var _20_col, _20_it, _20_length, line, line2, line3, lines, parts;
        diagram.handlers = {}
        diagram.args = []
        lines = split(diagram.params, "\n")
        _20_it = 0;
        _20_col = lines;
        _20_length = _20_col.length;
        while (true) {
            if (_20_it < _20_length) {
                line = _20_col[_20_it];
                line2 = replace(line, "\t", " ")
                line3 = line2.toLowerCase()
                parts = split(line3, " ")
                if (parts.length === 1) {
                    diagram.args.push(line)
                } else {
                    if (parts[0] === "on") {
                        if (diagram.complex) {
                            analyzeHandler(project, diagram, parts)
                        } else {
                            addError(
                                project,
                                diagram,
                                "ERR_ONLY_ASYNC_FUNCTIONS_CAN_HAVE_ON_ERROR"
                            )
                        }
                    } else {
                        addError(
                            project,
                            diagram,
                            "ERR_BAD_HANDLER_FORMAT"
                        )
                    }
                }
                _20_it++;
            } else {
                break;
            }
        }
        if (diagram.method) {
            diagram.args.unshift("self")
        }
    }
    
    function parseDependencies(dependencies) {
        var _20_col, _20_it, _20_length, deps, line, line2, lines, parts;
        deps = []
        lines = split(dependencies, "\n")
        _20_it = 0;
        _20_col = lines;
        _20_length = _20_col.length;
        while (true) {
            if (_20_it < _20_length) {
                line = _20_col[_20_it];
                line2 = replace(line, "\t", " ")
                parts = split(line2, " ")
                deps.push(parts[0])
                _20_it++;
            } else {
                break;
            }
        }
        return deps
    }
    
    function parseForeach(project, diagram, item) {
        var message;
        message = parseForeachCore(diagram, item)
        if (message) {
            addError(project, diagram, message, item)
        }
    }
    
    function parseForeachCore(diagram, item) {
        var _sw_18, _sw_42, ast, collection, expr, expressions, left, message, right, text, variable, variable1, variable2;
        function branch1() {
            message = undefined
            text = item.text
            if (text) {
                try {
                    ast = esprima.parse(text)
                } catch (ex) {
                    return ex.message
                }
                if (ast.type === "Program") {
                    if (ast.body) {
                        _sw_18 = ast.body.length;
                        if (_sw_18 === 2) {
                            return branch3();
                        } else {
                            if (_sw_18 === 3) {
                                return branch2();
                            } else {
                                return branch4();
                            }
                        }
                    } else {
                        return branch4();
                    }
                } else {
                    return branch4();
                }
            } else {
                message = "ERR_NO_TEXT_IN_FOREACH"
                return branch5();
            }
        }
    
        function branch2() {
            expressions = ast.body.map(
                function (node) {
                    return escodegen.generate(node)
                }
            )
            generateFor(diagram, item, expressions)
            return branch5();
        }
    
        function branch3() {
            left = ast.body[0]
            right = ast.body[1]
            if (left.type === "ExpressionStatement") {
                if (right.type === "ExpressionStatement") {
                    expr = left.expression
                    collection = escodegen.generate(right)
                    _sw_42 = expr.type;
                    if (_sw_42 === "Identifier") {
                        variable = expr.name
                        generateForeachArray(
                            diagram,
                            item,
                            variable,
                            collection
                        )
                        return branch5();
                    } else {
                        if (_sw_42 === "SequenceExpression") {
                            if (expr.expressions.length === 2) {
                                variable1 = expr.expressions[0].name
                                variable2 = expr.expressions[1].name
                                if (variable1) {
                                    if (variable2) {
                                        generateForeachMap(
                                            diagram,
                                            item,
                                            variable1,
                                            variable2,
                                            collection
                                        )
                                        return branch5();
                                    } else {
                                        return branch4();
                                    }
                                } else {
                                    return branch4();
                                }
                            } else {
                                return branch4();
                            }
                        } else {
                            return branch4();
                        }
                    }
                } else {
                    return branch4();
                }
            } else {
                return branch4();
            }
        }
    
        function branch4() {
            message = "ERR_BAD_FOREACH"
            return branch5();
        }
    
        function branch5() {
            return message
        }
    
        return branch1();
    }
    
    function parseItem(project, diagram, item) {
        var _sw_7, body;
        _sw_7 = item.type;
        if (_sw_7 === "action") {
            addActionContent(project, diagram, item)
        } else {
            if (_sw_7 === "question") {
                if (item.text) {
                    try {
                        body = esprima.parse(item.text)
                    } catch (ex) {
                        addError(
                            project,
                            diagram,
                            ex.message,
                            item
                        )
                        return 
                    }
                    item.body = body
                } else {
                    addError(
                        project,
                        diagram,
                        "ERR_EXPRESSION_EXPECTED",
                        item
                    )
                }
            } else {
                if (_sw_7 === "pause") {
                    if (item.text) {
                        try {
                            body = esprima.parse(item.text)
                        } catch (ex) {
                            addError(
                                project,
                                diagram,
                                ex.message,
                                item
                            )
                            return 
                        }
                        item.body = body
                    } else {
                        addError(
                            project,
                            diagram,
                            "ERR_EXPRESSION_EXPECTED",
                            item
                        )
                    }
                } else {
                    if (_sw_7 === "insertion") {
                        if (item.text) {
                            addActionContent(project, diagram, item)
                            if (item.body) {
                                if (item.body.body.length === 1) {
                                    extractReturnFromIns(
                                        project,
                                        diagram,
                                        item
                                    )
                                } else {
                                    addError(
                                        project,
                                        diagram,
                                        "ERR_ONE_FUNCTION_CALL_EXPECTED",
                                        item
                                    )
                                }
                            } else {
                                addError(
                                    project,
                                    diagram,
                                    "ERR_EXPRESSION_EXPECTED",
                                    item
                                )
                            }
                        } else {
                            addError(
                                project,
                                diagram,
                                "ERR_EXPRESSION_EXPECTED",
                                item
                            )
                        }
                    } else {
                        if (_sw_7 === "soutput") {
                            if (item.text) {
                                addActionContent(project, diagram, item)
                                if (item.body) {
                                    if (item.body.body.length === 1) {
                                        extractReturnFromIns(
                                            project,
                                            diagram,
                                            item
                                        )
                                    } else {
                                        addError(
                                            project,
                                            diagram,
                                            "ERR_ONE_FUNCTION_CALL_EXPECTED",
                                            item
                                        )
                                    }
                                } else {
                                    addError(
                                        project,
                                        diagram,
                                        "ERR_EXPRESSION_EXPECTED",
                                        item
                                    )
                                }
                            } else {
                                addError(
                                    project,
                                    diagram,
                                    "ERR_EXPRESSION_EXPECTED",
                                    item
                                )
                            }
                        } else {
                        }
                    }
                }
            }
        }
    }
    
    function parseSource(project, diagram) {
        forAllItems(project, diagram, parseItem)
    }
    
    function prepareAlgoprops(project, diagram) {
        var _5_col, _5_it, _5_keys, _5_length, item, itemId;
        if (diagram.algoprop) {
            _5_it = 0;
            _5_col = diagram.items;
            _5_keys = Object.keys(_5_col);
            _5_length = _5_keys.length;
            while (true) {
                if (_5_it < _5_length) {
                    itemId = _5_keys[_5_it];
                    item = _5_col[itemId];
                    injectObj(project, diagram, item)
                    _5_it++;
                } else {
                    break;
                }
            }
        }
    }
    
    function prepareDiagram(project, folder) {
        var _24_col, _24_it, _24_keys, _24_length, _8_col, _8_it, _8_length, apType, branches, diagram, getter, id, item, keywords;
        function branch1() {
            keywords = folder.keywords || {}
            diagram = {
                name: folder.name,
                id: folder.id,
                params: folder.params || "",
                args: [],
                vars: {},
                exported: !!keywords["export"],
                algoprop: !!keywords["algoprop"],
                items: {},
                branches: [],
                chunks: {},
                deps: [],
                events: {},
                complex: !!keywords["async"],
                start: undefined,
                nextId: 1,
                nextVar: 1,
                method: !!folder.method
            }
            if ((diagram.algoprop) && (diagram.method)) {
                addError(
                    project,
                    diagram,
                    "ERR_ALGOPROP_CANNOT_BE_IN_CLASS"
                )
                return branch6();
            } else {
                parseArguments(project, diagram)
                return branch2();
            }
        }
    
        function branch2() {
            _8_it = 0;
            _8_col = folder.items;
            _8_length = _8_col.length;
            while (true) {
                if (_8_it < _8_length) {
                    item = _8_col[_8_it];
                    convertItem(item)
                    diagram.items[item.id] = item
                    _8_it++;
                } else {
                    break;
                }
            }
            return branch3();
        }
    
        function branch3() {
            branches = common.filterBy(
                folder.items,
                "type",
                "branch"
            )
            common.sortBy(branches, "branchId")
            diagram.branches = branches.map(
                function (item) {
                    return item.id
                }
            )
            if (diagram.branches.length === 0) {
            } else {
                diagram.start = branches[0].id
            }
            return branch4();
        }
    
        function branch4() {
            if (diagram.algoprop) {
                if (isInput(diagram)) {
                    diagram.input = true
                    apType = "input"
                } else {
                    getter = calcName(diagram.name)
                    project.internals[getter] = diagram.name
                    apType = "algo"
                }
                project.algoprops[diagram.name] = apType
            } else {
                project.internals[diagram.name] = diagram
                .name
            }
            _24_it = 0;
            _24_col = diagram.items;
            _24_keys = Object.keys(_24_col);
            _24_length = _24_keys.length;
            while (true) {
                if (_24_it < _24_length) {
                    id = _24_keys[_24_it];
                    item = _24_col[id];
                    addItemReferences(diagram, item)
                    _24_it++;
                } else {
                    break;
                }
            }
            return branch5();
        }
    
        function branch5() {
            checkForEnd(project, diagram)
            checkBranchesAreReferenced(
                project,
                diagram
            )
            return branch6();
        }
    
        function branch6() {
            return diagram
        }
    
        return branch1();
    }
    
    function prepareProject(project) {
        var _15_col, _15_it, _15_keys, _15_length, _30_col, _30_it, _30_keys, _30_length, diagram, folder, id, name, result;
        function branch1() {
            result = {
                spaceId: project.spaceId,
                rootId: project.rootId,
                name: project.name,
                diagrams: {},
                exported: [],
                errors: [],
                algoprops: {},
                internals: {},
                classes: {}
            }
            if (project.folders) {
                return branch2();
            } else {
                return branch5();
            }
        }
    
        function branch2() {
            _30_it = 0;
            _30_col = project.folders;
            _30_keys = Object.keys(_30_col);
            _30_length = _30_keys.length;
            while (true) {
                if (_30_it < _30_length) {
                    id = _30_keys[_30_it];
                    folder = _30_col[id];
                    if (folder.type === "folder") {
                        name = tryGetClassName(folder.name)
                        if (name) {
                            createClass(
                                project,
                                result,
                                folder,
                                name
                            )
                        }
                    }
                    _30_it++;
                } else {
                    break;
                }
            }
            return branch3();
        }
    
        function branch3() {
            _15_it = 0;
            _15_col = project.folders;
            _15_keys = Object.keys(_15_col);
            _15_length = _15_keys.length;
            while (true) {
                if (_15_it < _15_length) {
                    id = _15_keys[_15_it];
                    folder = _15_col[id];
                    if (folder.type === "drakon") {
                        diagram = prepareDiagram(result, folder)
                        if ((diagram.name in result.diagrams) || (diagram.name in result.classes)) {
                            addError(
                                result,
                                diagram,
                                "ERR_DUPLICATE_DIAGRAM_NAME"
                            )
                        } else {
                            result.diagrams[diagram.name] = diagram
                            if ((diagram.exported) && (!(diagram.input))) {
                                result.exported.push(diagram.name)
                            }
                        }
                    }
                    _15_it++;
                } else {
                    break;
                }
            }
            return branch4();
        }
    
        function branch4() {
            result.deps = parseDependencies(
                project.dependencies
            )
            return branch5();
        }
    
        function branch5() {
            return result
        }
    
        return branch1();
    }
    
    function procMain(diagram) {
        return "_main_" + diagram.name
    }
    
    function relinkNext(item, oldId, newId) {
        var i, refId;
        i = 0;
        while (true) {
            if (i < item.next.length) {
                refId = item.next[i]
                if (refId === oldId) {
                    item.next[i] = newId
                }
                i++;
            } else {
                break;
            }
        }
    }
    
    function relinkRefs(item, oldId, newId) {
        var i, refId;
        i = 0;
        while (true) {
            if (i < item.refs.length) {
                refId = item.refs[i]
                if (refId === oldId) {
                    item.refs[i] = newId
                }
                i++;
            } else {
                break;
            }
        }
    }
    
    function replace(text, from, to) {
        if (text) {
            return text.split(from).join(to)
        } else {
            return ""
        }
    }
    
    function replaceGetHandlerData(context, type, name, computed, node) {
        if (((node.type === "CallExpression") && (node.callee.type === "Identifier")) && (node.callee.name === "getHandlerData")) {
            if (context.item.isHandler) {
                return {
                    type: "Identifier",
                    name: "__handlerData"
                }
            } else {
                addError(
                    context.project,
                    context.diagram,
                    "ERR_CANNOT_USE_GETHANDLER_OUTSIDE_HANDLER",
                    context.item
                )
                return undefined
            }
        } else {
            return undefined
        }
    }
    
    function resolveError(project, diagram, item, body, expr) {
        var gotoId, value, variable;
        variable = generateVariableName(diagram)
        addNormalVar(project, diagram, variable)
        value = {
            type: "Identifier",
            name: variable
        }
        body.push(
            {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "AssignmentExpression",
                    "operator": "=",
                    "left": value,
                    "right": expr.argument
                }
            }
        )
        if (item.isHandler) {
            addReject(body, value)
            body.push(
                {
                    "type": "ReturnStatement",
                    "argument": null
                }
            )
        } else {
            gotoId = findGotoBranch(diagram, "error")
            if (gotoId) {
                body.push(
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "AssignmentExpression",
                            "operator": "=",
                            "left": {
                                "type": "Identifier",
                                "name": "__handlerData"
                            },
                            "right": value
                        }
                    }
                )
                addLiteralAssignment(
                    body,
                    getSwitchVar(diagram),
                    gotoId
                )
                body.push(
                    {
                        "type": "BreakStatement",
                        "label": null
                    }
                )
            } else {
                addReject(body, value)
                body.push(
                    {
                        "type": "ReturnStatement",
                        "argument": null
                    }
                )
            }
        }
    }
    
    function resolveReturn(body, expr) {
        addResolve(body, expr.argument)
        body.push(
            {
                "type": "ReturnStatement",
                "argument": null
            }
        )
    }
    
    function rewireApReturn(project, diagram) {
        var _5_col, _5_it, _5_keys, _5_length, context, item, itemId;
        if (diagram.algoprop) {
            _5_it = 0;
            _5_col = diagram.items;
            _5_keys = Object.keys(_5_col);
            _5_length = _5_keys.length;
            while (true) {
                if (_5_it < _5_length) {
                    itemId = _5_keys[_5_it];
                    item = _5_col[itemId];
                    if (item.body) {
                        context = {
                            project: project,
                            diagram: diagram,
                            item: item,
                            rewrite: rewireApiReturnCore
                        }
                        item.body = traverseAstCore2(
                            context,
                            undefined,
                            undefined,
                            item.body
                        )
                    }
                    _5_it++;
                } else {
                    break;
                }
            }
        }
    }
    
    function rewireApiReturnCore(context, type, name, node) {
        var _8_col, _8_it, _8_length, body2, child;
        if (node.type === "BlockStatement") {
            body2 = []
            _8_it = 0;
            _8_col = node.body;
            _8_length = _8_col.length;
            while (true) {
                if (_8_it < _8_length) {
                    child = _8_col[_8_it];
                    if (child.type === "ReturnStatement") {
                        if ((child.argument.type === "Identifier") || (child.argument.type === "Literal")) {
                            body2.push(
                                {
                                    "type": "ExpressionStatement",
                                    "expression": {
                                        "type": "AssignmentExpression",
                                        "operator": "=",
                                        "left": {
                                            "type": "MemberExpression",
                                            "computed": false,
                                            "object": {
                                                "type": "Identifier",
                                                "name": "__obj"
                                            },
                                            "property": {
                                                "type": "Identifier",
                                                "name": context.diagram
                                                .name
                                            }
                                        },
                                        "right": child.argument
                                    }
                                }
                            )
                            body2.push(child)
                        } else {
                            addSpecialVar(
                                context.diagram,
                                "__result"
                            )
                            body2.push(
                                {
                                    "type": "ExpressionStatement",
                                    "expression": {
                                        "type": "AssignmentExpression",
                                        "operator": "=",
                                        "left": {
                                            "type": "Identifier",
                                            name: "__result"
                                        },
                                        "right": child.argument
                                    }
                                }
                            )
                            body2.push(
                                {
                                    "type": "ExpressionStatement",
                                    "expression": {
                                        "type": "AssignmentExpression",
                                        "operator": "=",
                                        "left": {
                                            "type": "MemberExpression",
                                            "computed": false,
                                            "object": {
                                                "type": "Identifier",
                                                "name": "__obj"
                                            },
                                            "property": {
                                                "type": "Identifier",
                                                "name": context.diagram
                                                .name
                                            }
                                        },
                                        "right": {
                                            type: "Identifier",
                                            name: "__result"
                                        }
                                    }
                                }
                            )
                            body2.push(
                                {
                                    "type": "ReturnStatement",
                                    "argument": {
                                        "type": "Identifier",
                                        "name": "__result"
                                    }
                                }
                            )
                        }
                    } else {
                        body2.push(child)
                    }
                    _8_it++;
                } else {
                    break;
                }
            }
            return {
                type: "BlockStatement",
                body: body2
            }
        } else {
            return undefined
        }
    }
    
    function rewireForeach(project, diagram) {
        var _5_col, _5_it, _5_keys, _5_length, item, itemId;
        _5_it = 0;
        _5_col = diagram.items;
        _5_keys = Object.keys(_5_col);
        _5_length = _5_keys.length;
        while (true) {
            if (_5_it < _5_length) {
                itemId = _5_keys[_5_it];
                item = _5_col[itemId];
                rewireForeachItem(diagram, item)
                _5_it++;
            } else {
                break;
            }
        }
    }
    
    function rewireForeachItem(diagram, item) {
        var after, end;
        if (item.type === "loopbegin") {
            insertItemBefore(
                diagram,
                item,
                "action",
                item.loopInit
            )
            if (item.loopBefore) {
                insertItemBefore(
                    diagram,
                    getNext(diagram, item, 0),
                    "action",
                    item.loopBefore
                )
            }
            end = diagram.items[item.end]
            after = getNext(diagram, end, 0)
            end.type = "action"
            end.text = item.loopAfter
            end.next[0] = item.id
            item.refs.push(end.id)
            relinkRefs(after, end.id, item.id)
            item.next.push(after.id)
            item.type = "question"
            item.text = item.loopCondition
            item.flag1 = 1
            delete item.loopInit
            delete item.loopCondition
            delete item.loopBefore
            delete item.loopAfter
        }
    }
    
    function rewireReceive(project, diagram, item) {
        var body, caseId, caseInfo, caseItem, next, nextItem;
        if (diagram.complex) {
            item.cases = []
            item.body = undefined
            next = []
            caseId = item.next[0]
            while (true) {
                caseItem = diagram.items[caseId]
                if (caseItem.text) {
                    try {
                        body = esprima.parse(caseItem.text)
                    } catch (ex) {
                        addError(
                            project,
                            diagram,
                            ex.message,
                            caseItem
                        )
                        return 
                    }
                    caseInfo = checkCaseBody(
                        project,
                        diagram,
                        caseItem,
                        body,
                        item.id
                    )
                    item.cases.push(caseInfo)
                } else {
                    addError(
                        project,
                        diagram,
                        "ERR_EXPRESSION_EXPECTED",
                        caseItem
                    )
                }
                nextItem = diagram.items[
                    caseItem.next[0]
                ]
                relinkRefs(nextItem, caseId, item.id)
                next.push(nextItem.id)
                if (caseItem.next.length === 1) {
                    break;
                } else {
                    caseId = caseItem.next[1]
                }
            }
            item.next = next
        } else {
            addError(
                project,
                diagram,
                "ERR_RECEIVE_IS_NOT_ALLOWED_IN_NORMAL_FUNCTIONS",
                item
            )
        }
    }
    
    function rewireSInput(project, diagram, item) {
        var body, eventName;
        if (diagram.complex) {
            item.cases = []
            item.body = undefined
            if (item.text) {
                try {
                    body = esprima.parse(item.text)
                } catch (ex) {
                    addError(
                        project,
                        diagram,
                        ex.message,
                        item
                    )
                    return 
                }
                eventName = checkCaseBody(
                    project,
                    diagram,
                    item,
                    body,
                    item.id
                )
                item.cases = [eventName]
            } else {
                addError(
                    project,
                    diagram,
                    "ERR_EXPRESSION_EXPECTED",
                    item
                )
            }
        } else {
            addError(
                project,
                diagram,
                "ERR_INPUT_IS_NOT_ALLOWED_IN_NORMAL_FUNCTIONS",
                item
            )
        }
    }
    
    function rewireSwitch(project, diagram) {
        var _5_col, _5_it, _5_keys, _5_length, item, itemId;
        _5_it = 0;
        _5_col = diagram.items;
        _5_keys = Object.keys(_5_col);
        _5_length = _5_keys.length;
        while (true) {
            if (_5_it < _5_length) {
                itemId = _5_keys[_5_it];
                item = _5_col[itemId];
                if (item.type === "sinput") {
                    rewireSInput(project, diagram, item)
                } else {
                    if (item.type === "select") {
                        if (item.text) {
                            if (item.text === "receive") {
                                rewireReceive(project, diagram, item)
                            } else {
                                rewireSwitchCore(project, diagram, item)
                            }
                        } else {
                            addError(
                                project,
                                diagram,
                                "ERR_EXPRESSION_EXPECTED",
                                item
                            )
                        }
                    }
                }
                _5_it++;
            } else {
                break;
            }
        }
    }
    
    function rewireSwitchCore(project, diagram, item) {
        var citem, prev, swInit, swVar;
        function branch1() {
            swVar = generateVariableName(diagram)
            swInit = swVar + " = " + item.text
            prev = insertItemBefore(
                diagram,
                item,
                "action",
                swInit
            )
            citem = diagram.items[item.next[0]]
            prev.next = []
            return branch2();
        }
    
        function branch2() {
            while (true) {
                if (citem.text) {
                    prev = convertCaseToQuestion(
                        diagram,
                        swVar,
                        citem,
                        prev
                    )
                    if (citem.next.length === 1) {
                        addErrorCase(diagram, swVar, citem, prev)
                        return branch3();
                    } else {
                        citem = diagram.items[citem.next[1]]
                    }
                } else {
                    if (citem.next.length === 1) {
                        connectDefaultCase(diagram, citem, prev)
                    } else {
                        addError(
                            project,
                            diagram,
                            "ERR_ONLY_LAST_CASE_CAN_BE_EMPTY"
                        )
                    }
                    return branch3();
                }
            }
        }
    
        function branch3() {
        }
    
        return branch1();
    }
    
    function rewriteNode(context, type, name, computed, node) {
        if ((node.type === "Identifier") && ((!(name === "key")) && (((!(name === "property")) || (computed)) && (node.name in context.project.algoprops)))) {
            return {
                "type": "MemberExpression",
                "computed": false,
                "object": {
                    "type": "Identifier",
                    "name": "__obj"
                },
                "property": {
                    "type": "Identifier",
                    "name": node.name
                }
            }
        } else {
            return undefined
        }
    }
    
    function split(text, separator) {
        var parts, trimmed;
        if (text) {
            parts = text.split(separator)
            trimmed = parts.map(
                function (part) {
                    return part.trim()
                }
            )
            return trimmed.filter(
                function (part) {
                    return part.length > 0
                }
            )
        } else {
            return []
        }
    }
    
    function streamExpressionsFromItem(context, srcItem, apVars, outputBody) {
        var _28_col, _28_it, _28_length, _sw_9, alternate, consequent, expr, i, ifst, last, nextId, srcBody;
        function branch1() {
            _sw_9 = srcItem.type;
            if (_sw_9 === "action") {
                if (srcItem.body) {
                    srcBody = srcItem.body.body
                } else {
                    srcBody = []
                }
                return branch3();
            } else {
                if (_sw_9 === "branch") {
                    return branch2();
                } else {
                    if (_sw_9 === "question") {
                        srcBody = srcItem.body.body
                        return branch4();
                    } else {
                        if (_sw_9 === "select") {
                            createEvent(
                                context,
                                srcItem.id,
                                outputBody
                            )
                            return branch6();
                        } else {
                            if (_sw_9 === "sinput") {
                                createEvent(
                                    context,
                                    srcItem.id,
                                    outputBody
                                )
                                return branch6();
                            } else {
                                if (_sw_9 === "end") {
                                    createEnd(context, srcItem, outputBody)
                                    return branch6();
                                } else {
                                    throw new Error(
                                        "Unsupported item type: " + srcItem.type
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    
        function branch2() {
            nextId = srcItem.next[0]
            if (srcItem.isHandler) {
                outputBody.push(
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "AssignmentExpression",
                            "operator": "=",
                            "left": {
                                "type": "Identifier",
                                "name": "__inHandler"
                            },
                            "right": {
                                "type": "Literal",
                                "value": true,
                                "raw": "true"
                            }
                        }
                    }
                )
            }
            tryContinueItem(
                srcItem,
                context,
                apVars,
                outputBody,
                nextId
            )
            return branch6();
        }
    
        function branch3() {
            nextId = srcItem.next[0]
            _28_it = 0;
            _28_col = srcBody;
            _28_length = _28_col.length;
            while (true) {
                if (_28_it < _28_length) {
                    expr = _28_col[_28_it];
                    tryAddStatement(
                        context,
                        apVars,
                        outputBody,
                        expr
                    )
                    if (isExit(expr)) {
                        if (expr.mustBreak) {
                            nextChunk(context, nextId)
                        }
                        return branch6();
                    } else {
                        _28_it++;
                    }
                } else {
                    tryContinueItem(
                        srcItem,
                        context,
                        apVars,
                        outputBody,
                        nextId
                    )
                    return branch6();
                }
            }
        }
    
        function branch4() {
            last = srcBody.length - 1
            i = 0;
            while (true) {
                if (i < last) {
                    tryAddStatement(
                        context,
                        apVars,
                        outputBody,
                        srcBody[i]
                    )
                    i++;
                } else {
                    break;
                }
            }
            ifst = addIfStatement(
                outputBody,
                srcBody[last].expression
            )
            if (srcItem.flag1) {
                consequent = srcItem.next[0]
                alternate = srcItem.next[1]
            } else {
                consequent = srcItem.next[1]
                alternate = srcItem.next[0]
            }
            return branch5();
        }
    
        function branch5() {
            tryContinueItem(
                srcItem,
                context,
                apVars.slice(),
                ifst.consequent.body,
                consequent
            )
            tryContinueItem(
                srcItem,
                context,
                apVars.slice(),
                ifst.alternate.body,
                alternate
            )
            return branch6();
        }
    
        function branch6() {
        }
    
        return branch1();
    }
    
    function stripLast(text) {
        return text.substring(0, text.length - 1)
    }
    
    function toConsole(longString) {
        var lines;
        if (longString) {
            lines = longString.split("\n")
            lines.forEach(
                function (line) {
                    console.log(line)
                }
            )
        }
    }
    
    function tr(text) {
        if (unit.translate) {
            return unit.translate(text)
        } else {
            return text
        }
    }
    
    function traverseAst(project, diagram, item, rewrite) {
        var context;
        context = {
            project: project,
            diagram: diagram,
            item: item,
            rewrite: rewrite
        }
        if (item.body) {
            injectObjInNode(context, item.body)
        }
    }
    
    function traverseAstCore2(context, type, propName, node) {
        var newNode;
        newNode = context.rewrite(
            context,
            type,
            propName,
            node
        )
        if (newNode) {
            return newNode
        } else {
            return traverseAstDefault2(context, node)
        }
    }
    
    function traverseAstDefault2(context, node) {
        var _5_col, _5_it, _5_keys, _5_length, child, name, newNode, prop;
        newNode = {}
        _5_it = 0;
        _5_col = node;
        _5_keys = Object.keys(_5_col);
        _5_length = _5_keys.length;
        while (true) {
            if (_5_it < _5_length) {
                name = _5_keys[_5_it];
                prop = _5_col[name];
                if (Array.isArray(prop)) {
                    child = prop.map(
                        function (element) {
                            return traverseAstCore2(
                                context,
                                node.type,
                                name,
                                element
                            )
                        }
                    )
                } else {
                    if ((prop) && (( typeof prop === "object") && (prop.type))) {
                        child = traverseAstCore2(
                            context,
                            node.type,
                            name,
                            prop
                        )
                    } else {
                        child = prop
                    }
                }
                newNode[name] = child
                _5_it++;
            } else {
                break;
            }
        }
        return newNode
    }
    
    function traverseItems(project, diagram, callback, context) {
        var visited;
        visited = {}
        traverseItemsCore(
            project,
            diagram,
            callback,
            visited,
            diagram.start,
            context
        )
    }
    
    function traverseItemsCore(project, diagram, callback, visited, itemId, context) {
        var _11_col, _11_it, _11_length, item, nextId;
        function branch1() {
            if (itemId) {
                if (itemId in visited) {
                    return branch4();
                } else {
                    visited[itemId] = true
                    return branch2();
                }
            } else {
                return branch4();
            }
        }
    
        function branch2() {
            item = diagram.items[itemId]
            callback(project, diagram, item, context)
            return branch3();
        }
    
        function branch3() {
            _11_it = 0;
            _11_col = item.next;
            _11_length = _11_col.length;
            while (true) {
                if (_11_it < _11_length) {
                    nextId = _11_col[_11_it];
                    traverseItemsCore(
                        project,
                        diagram,
                        callback,
                        visited,
                        nextId,
                        context
                    )
                    _11_it++;
                } else {
                    break;
                }
            }
            return branch4();
        }
    
        function branch4() {
        }
    
        return branch1();
    }
    
    function tryAddHandlerClause(ifthen, diagram, handlerType, oldNext) {
        var arg, elseIf, handler;
        handler = diagram.handlers[handlerType]
        if (handler) {
            elseIf = createIfIn(handlerType)
            ifthen.alternate = elseIf
            if (handler.type === "goto") {
                arg = {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": {
                        "type": "Identifier",
                        "name": "__returnee"
                    },
                    "property": {
                        "type": "Identifier",
                        "name": handlerType
                    }
                }
                callHandler(
                    diagram,
                    arg,
                    handler.itemId,
                    elseIf.consequent.body
                )
            } else {
                callHandler(
                    diagram,
                    undefined,
                    oldNext[0],
                    elseIf.consequent.body
                )
            }
            return elseIf
        } else {
            return ifthen
        }
    }
    
    function tryAddStatement(context, apVars, outputBody, statement) {
        var expr, name;
        if (statement.type === "ExpressionStatement") {
            expr = statement.expression
            if ((expr.type === "AssignmentExpression") && (expr.left.type === "Identifier")) {
                name = expr.left.name
                if (isApVar(context.diagram, name)) {
                    if (apVars.indexOf(name) === -1) {
                        apVars.push(name)
                        outputBody.push(statement)
                    }
                } else {
                    outputBody.push(statement)
                }
            } else {
                outputBody.push(statement)
            }
        } else {
            outputBody.push(statement)
        }
    }
    
    function tryContinueItem(srcItem, context, apVars, outputBody, nextId) {
        var nextItem;
        if (context.diagram.resumeNext) {
            addLiteralAssignment(
                outputBody,
                getSwitchVar(context.diagram),
                nextId
            )
            nextChunk(context, nextId)
        } else {
            nextItem = context.diagram.items[nextId]
            if (nextItem.type === "branch") {
                if (srcItem.isHandler) {
                    addLiteralAssignment(
                        outputBody,
                        "__inHandler",
                        false
                    )
                }
                addLiteralAssignment(
                    outputBody,
                    getSwitchVar(context.diagram),
                    nextId
                )
                nextChunk(context, nextId)
            } else {
                if (nextItem.refs.length === 1) {
                    streamExpressionsFromItem(
                        context,
                        nextItem,
                        apVars,
                        outputBody
                    )
                } else {
                    addLiteralAssignment(
                        outputBody,
                        getSwitchVar(context.diagram),
                        nextId
                    )
                    nextChunk(context, nextId)
                }
            }
        }
    }
    
    function tryGetClassName(name) {
        var parts;
        parts = split(name, " ")
        if ((parts.length === 2) && (parts[0] === "class")) {
            return parts[1]
        } else {
            return undefined
        }
    }
    
    Object.defineProperty(unit, "sm", {
        get: function() { return sm; },
        set: function(newValue) { sm = newValue; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(unit, "common", {
        get: function() { return common; },
        set: function(newValue) { common = newValue; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(unit, "http", {
        get: function() { return http; },
        set: function(newValue) { http = newValue; },
        enumerable: true,
        configurable: true
    });
    
    unit.generateCode = generateCode;
    unit.mainCore = mainCore;
    return unit;
}    

module.exports = AlgopropCompiler02_module
