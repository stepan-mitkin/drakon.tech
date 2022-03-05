function appedit() {
    var unit = {};
    unit.onError = function (error) {
        console.error(error);
    };
    var tr;
    function buildDefaultHtml(name) {
        return '<!DOCTYPE html>\n' + '<html lang="en">\n' + '<head>\n' + '    <meta charset="utf-8"/>\n' + '    <meta name="viewport" content="width=device-width,initial-scale=1"/>\n' + '    <link rel="shortcut icon" href="https://app.drakon.tech/static/favicon.ico" />\n' + '    <link rel="icon" type="image/png" href="https://app.drakon.tech/static/favicon.png" />\n' + '    <link rel="stylesheet" href="https://app.drakon.tech/gen/common/css/reset.css" />\n' + '    <style>\n' + '    *, *:before, *:after {\n' + '      -webkit-box-sizing: border-box;\n' + '      -moz-box-sizing: border-box;\n' + '      box-sizing: border-box;\n' + '    }\n' + '    </style>\n' + '    <title>' + name + '</title>\n' + '</head>\n' + '<body>\n' + '    <div id="main"></div>\n' + '    %SCRIPT%\n' + '</body>\n' + '</html>\n';
    }
    function actionWrapper(action, arg, evt) {
        try {
            action(arg, evt);
        } catch (ex) {
            console.error(ex);
            return;
        }
        return;
    }
    function invalidate(self) {
        self._dirty = true;
        return;
    }
    function startDownload(url, filename) {
        var downloadLink;
        console.log('startDownload', url, filename);
        downloadLink = createElement('a', {
            href: url,
            download: filename
        });
        downloadLink.click();
        return;
    }
    function clone(src) {
        var copy;
        copy = {};
        Object.assign(copy, src);
        return copy;
    }
    function cloneDeep(src) {
        var copy, value, _var5, _var6, item, _var3, _var2, _var4, key, _var7;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (src) {
                    if (typeof src === 'object') {
                        if (src instanceof Date) {
                            __state = '7';
                        } else {
                            _var7 = Array.isArray(src);
                            if (_var7) {
                                copy = [];
                                _var5 = src;
                                _var6 = 0;
                                __state = '12';
                            } else {
                                copy = {};
                                _var3 = src;
                                _var2 = Object.keys(_var3);
                                _var4 = 0;
                                __state = '16';
                            }
                        }
                    } else {
                        __state = '7';
                    }
                } else {
                    __state = '7';
                }
                break;
            case '5':
                return copy;
            case '7':
                return src;
            case '12':
                if (_var6 < _var5.length) {
                    item = _var5[_var6];
                    value = cloneDeep(item);
                    copy.push(value);
                    _var6++;
                    __state = '12';
                } else {
                    __state = '5';
                }
                break;
            case '16':
                if (_var4 < _var2.length) {
                    key = _var2[_var4];
                    value = _var3[key];
                    value = cloneDeep(value);
                    copy[key] = value;
                    _var4++;
                    __state = '16';
                } else {
                    __state = '5';
                }
                break;
            default:
                return;
            }
        }
    }
    function parseId(id) {
        var parts;
        parts = id.split(' ');
        return {
            spaceId: parts[0],
            folderId: parts[1]
        };
    }
    function registerUiAction(element, eventName, action, arg) {
        var callback;
        callback = function (evt) {
            actionWrapper(action, arg, evt);
            redrawAll();
        };
        element.addEventListener(eventName, callback);
        return;
    }
    function sortBy(array, prop) {
        var sorter, _var2;
        sorter = function (left, right) {
            _var2 = compareByProp(left, right, prop);
            return _var2;
        };
        array.sort(sorter);
        return;
    }
    function compareByProp(leftObj, rightObj, prop) {
        var left, right;
        left = leftObj[prop];
        right = rightObj[prop];
        if (left < right) {
            return -1;
        } else {
            if (left > right) {
                return 1;
            } else {
                return 0;
            }
        }
    }
    function findByProperty(array, property, value) {
        var _var2, _var3, item;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                _var2 = array;
                _var3 = 0;
                __state = '7';
                break;
            case '7':
                if (_var3 < _var2.length) {
                    item = _var2[_var3];
                    if (item[property] === value) {
                        return item;
                    } else {
                        _var3++;
                        __state = '7';
                    }
                } else {
                    return undefined;
                }
                break;
            default:
                return;
            }
        }
    }
    function makeId(spaceId, folderId) {
        return spaceId + ' ' + folderId;
    }
    function redrawAll() {
        unit.app.render();
        return;
    }
    function sendRequest_create(method, url, body, headers) {
        var request, _var3, _var2, _var4, header, value, result;
        var me = {
            state: '2',
            type: 'sendRequest'
        };
        function _main_sendRequest(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        request = new XMLHttpRequest();
                        request.onreadystatechange = function () {
                            onDataWhenReady(me, request);
                        };
                        request.open(method, url, true);
                        me.state = '17';
                        break;
                    case '16':
                        me.state = '25';
                        return;
                    case '17':
                        if (headers) {
                            _var3 = headers;
                            _var2 = Object.keys(_var3);
                            _var4 = 0;
                            me.state = '20';
                        } else {
                            me.state = '18';
                        }
                        break;
                    case '18':
                        request.send(body);
                        me.state = '16';
                        break;
                    case '20':
                        if (_var4 < _var2.length) {
                            header = _var2[_var4];
                            value = _var3[header];
                            request.setRequestHeader(header, value);
                            _var4++;
                            me.state = '20';
                        } else {
                            me.state = '18';
                        }
                        break;
                    case '26':
                        me.state = undefined;
                        __resolve(result);
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                unit.onError(ex);
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                me.onDataReady = function (_result_) {
                    result = _result_;
                    switch (me.state) {
                    case '25':
                        me.state = '26';
                        _main_sendRequest(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                _main_sendRequest(__resolve, __reject);
            });
        };
        return me;
    }
    function sendRequest(method, url, body, headers) {
        var __obj = sendRequest_create(method, url, body, headers);
        return __obj.run();
    }
    function onDataWhenReady(self, request) {
        var result;
        var __state = '25';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '25':
                if (request.readyState === 4) {
                    result = {
                        responseText: request.responseText,
                        status: request.status
                    };
                    self.onDataReady(result);
                    __state = '1';
                } else {
                    __state = '1';
                }
                break;
            default:
                return;
            }
        }
    }
    function createDataTree(rootContainer, model) {
        var self;
        self = DataTree();
        importNode(undefined, model);
        self.root = model;
        self.root._dirty = true;
        self.root.container = rootContainer;
        return self;
    }
    function DataTree_render(self) {
        renderNode(self.root, self);
        return;
    }
    function DataTree_renderChild(self, parentElement, node) {
        node.container = parentElement;
        node.render(node, self);
        node._dirty = false;
        return node.container;
    }
    function DataTree_setValue(self, item, name, value) {
        var old;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                old = item[name];
                disconnectNode(old);
                __state = '13';
                break;
            case '12':
                item[name] = value;
                item._dirty = true;
                return;
            case '13':
                importValue(item, value);
                __state = '12';
                break;
            default:
                return;
            }
        }
    }
    function importValue(parent, value) {
        var _var2;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (value) {
                    if (typeof value === 'object') {
                        _var2 = Array.isArray(value);
                        if (_var2) {
                            value.forEach(function (item) {
                                importNode(parent, item);
                            });
                            __state = '1';
                        } else {
                            importNode(parent, value);
                            __state = '1';
                        }
                    } else {
                        __state = '1';
                    }
                } else {
                    __state = '1';
                }
                break;
            default:
                return;
            }
        }
    }
    function importNode(parent, node) {
        var _var3, _var2, _var4, key, value;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (node) {
                    if (node.render) {
                        _var3 = node;
                        _var2 = Object.keys(_var3);
                        _var4 = 0;
                        __state = '16';
                    } else {
                        __state = '1';
                    }
                } else {
                    __state = '1';
                }
                break;
            case '15':
                _var4++;
                __state = '16';
                break;
            case '16':
                if (_var4 < _var2.length) {
                    key = _var2[_var4];
                    value = _var3[key];
                    if (key === '_parent') {
                        __state = '15';
                    } else {
                        importValue(node, value);
                        __state = '15';
                    }
                } else {
                    node._parent = parent;
                    if (node.willMount) {
                        node.willMount(node);
                        __state = '1';
                    } else {
                        __state = '1';
                    }
                }
                break;
            default:
                return;
            }
        }
    }
    function disconnectNode(node) {
        var _var3, _var2, _var4, key, child, _var5;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (node) {
                    if (typeof node === 'object') {
                        if (node._parent) {
                            if (node.willUnmount) {
                                node.willUnmount(node);
                                __state = '_item2';
                            } else {
                                __state = '_item2';
                            }
                        } else {
                            __state = '1';
                        }
                    } else {
                        __state = '1';
                    }
                } else {
                    __state = '1';
                }
                break;
            case '7':
                _var4++;
                __state = '8';
                break;
            case '8':
                if (_var4 < _var2.length) {
                    key = _var2[_var4];
                    child = _var3[key];
                    if (key === '_parent') {
                        __state = '7';
                    } else {
                        _var5 = Array.isArray(child);
                        if (_var5) {
                            child.forEach(disconnectNode);
                            __state = '7';
                        } else {
                            disconnectNode(child);
                            __state = '7';
                        }
                    }
                } else {
                    node._parent = undefined;
                    __state = '1';
                }
                break;
            case '_item2':
                _var3 = node;
                _var2 = Object.keys(_var3);
                _var4 = 0;
                __state = '8';
                break;
            default:
                return;
            }
        }
    }
    function renderNode(node, model) {
        var _var3, _var2, _var4, key, child, _var5, _var6, item, _var7;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (node._dirty) {
                    if (node.container) {
                        node._dirty = false;
                        node.container.innerHTML = '';
                        node.render(node, model);
                        __state = '1';
                    } else {
                        __state = '1';
                    }
                } else {
                    _var3 = node;
                    _var2 = Object.keys(_var3);
                    _var4 = 0;
                    __state = '7';
                }
                break;
            case '6':
                _var4++;
                __state = '7';
                break;
            case '7':
                if (_var4 < _var2.length) {
                    key = _var2[_var4];
                    child = _var3[key];
                    if (key === '_parent') {
                        __state = '6';
                    } else {
                        if (child) {
                            if (child.render) {
                                renderNode(child, model);
                                __state = '6';
                            } else {
                                _var7 = Array.isArray(child);
                                if (_var7) {
                                    _var5 = child;
                                    _var6 = 0;
                                    __state = '15';
                                } else {
                                    __state = '6';
                                }
                            }
                        } else {
                            __state = '6';
                        }
                    }
                } else {
                    __state = '1';
                }
                break;
            case '15':
                if (_var6 < _var5.length) {
                    item = _var5[_var6];
                    renderNode(item, model);
                    _var6++;
                    __state = '15';
                } else {
                    __state = '6';
                }
                break;
            default:
                return;
            }
        }
    }
    function createStyles() {
        createCommonStyles();
        createTabStyles();
        createModulesStyles();
        return;
    }
    function createCommonStyles() {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                addClass('.appeditor-title', 'font: bold 16px Arial', 'margin-top: 10px');
                addClass('.shadow', 'box-shadow: 0px 0px 7px 2px rgba(0,0,0,0.27)');
                addClass('.full-screen', 'display: inline-block', 'position: fixed', 'left: 0px', 'top: 0px', 'width: 100vw', 'height: 100vh');
                addClass('input.appeditor, textarea.appeditor', 'font: 14px Arial', 'width: 100%', 'padding: 5px');
                addClass('.appeditor-middle', 'display: inline-block', 'position: absolute', 'left: 50%', 'top: 50%', 'transform: translate(-50%, -50%)');
                addClass('.appeditor-middle-v', 'display: inline-block', 'position: absolute', 'left: 0px', 'top: 50%', 'transform: translateY(-50%)');
                addClass('.appeditor-middle-h', 'display: inline-block', 'position: absolute', 'left: 50%', 'top: 0px', 'transform: translateX(-50%)');
                addClass('.appeditor-context-menu', 'display: inline-block', 'position: absolute', 'background: white', 'max-width: 100vw', 'min-width: 200px', 'border: solid 1px #a0a0a0', 'padding: 10px');
                addClass('.appeditor-context-menu-separator', 'background: #a0a0a0', 'height: 1px');
                __state = '16';
                break;
            case '15':
                return;
            case '16':
                addClass('.appeditor-generic-button', 'display:inline-block', 'vertical-align: top', 'padding-left: 10px', 'padding-right: 10px', 'cursor: pointer', 'border-radius: 3px', 'margin-right: 5px', 'line-height:34px', 'user-select: none');
                addClass('.appeditor-disabled-button', 'display:inline-block', 'vertical-align: top', 'padding-left: 10px', 'padding-right: 10px', 'cursor: default', 'border-radius: 3px', 'margin-right: 5px', 'line-height:34px', 'user-select: none', 'border: solid 1px #a0a0a0', 'background: #a0a0a0', 'color: white');
                addClass('.appeditor-generic-button:active', 'transform: translateY(2px)');
                addClass('.appeditor-simple-button', 'background: white', 'border: solid 1px #a0a0a0');
                addClass('.appeditor-simple-button:hover', 'background: #c2eaff');
                addClass('.appeditor-default-button', 'border: solid 1px #038009', 'background: #038009', 'color: white');
                addClass('.appeditor-default-button:hover', 'border: solid 1px #004a04', 'background: #004a04');
                addClass('.appeditor-icon-button', 'height: 34px', 'width: 34px');
                addClass('img.appeditor-icon-button', 'display: inline-block', 'vertical-align: top', 'padding:0px', 'margin:0px');
                __state = '52';
                break;
            case '52':
                addClass('.appeditor-window, .appeditor-window *', '-webkit-box-sizing: border-box', '-moz-box-sizing: border-box', 'box-sizing: border-box');
                addClass('.appeditor-window textarea', 'resize: none');
                addClass('.appeditor-window', 'background: white', 'font: 14px Arial', 'padding: 10px', 'width: 100%', 'height: 100%');
                addClass('.appeditor-section', 'padding-bottom: 10px', 'min-height: 46px');
                addClass('.appeditor-error', 'display: inline-block', 'padding: 10px', 'color:darkred');
                addClass('.appeditor-lower', 'height: calc(100% - 45px)');
                __state = '15';
                break;
            default:
                return;
            }
        }
    }
    function fetchProjects_create() {
        var response, body;
        var me = {
            state: '2',
            type: 'fetchProjects'
        };
        function _main_fetchProjects(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '4';
                        sendRequest('GET', '/api/account').then(function (__returnee) {
                            response = __returnee;
                            _main_fetchProjects(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '4':
                        if (response.status === 200) {
                            body = JSON.parse(response.responseText);
                            me.state = undefined;
                            __resolve(body.spaces);
                            return;
                        } else {
                            me.state = undefined;
                            __resolve(undefined);
                            return;
                        }
                    default:
                        return;
                    }
                }
            } catch (ex) {
                unit.onError(ex);
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_fetchProjects(__resolve, __reject);
            });
        };
        return me;
    }
    function fetchProjects() {
        var __obj = fetchProjects_create();
        return __obj.run();
    }
    function fetchModules_create(spaceId) {
        var url, response, body;
        var me = {
            state: '2',
            type: 'fetchModules'
        };
        function _main_fetchModules(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        url = '/api/modules/' + spaceId + '/LANG_S42';
                        me.state = '5';
                        sendRequest('GET', url).then(function (__returnee) {
                            response = __returnee;
                            _main_fetchModules(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '5':
                        if (response.status === 200) {
                            body = JSON.parse(response.responseText);
                            me.state = undefined;
                            __resolve(body.modules);
                            return;
                        } else {
                            me.state = undefined;
                            __resolve([]);
                            return;
                        }
                    default:
                        return;
                    }
                }
            } catch (ex) {
                unit.onError(ex);
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_fetchModules(__resolve, __reject);
            });
        };
        return me;
    }
    function fetchModules(spaceId) {
        var __obj = fetchModules_create(spaceId);
        return __obj.run();
    }
    function fetchToken_create(spaceId) {
        var response, body;
        var me = {
            state: '2',
            type: 'fetchToken'
        };
        function _main_fetchToken(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '5';
                        sendRequest('GET', '/api/gentoken/' + spaceId).then(function (__returnee) {
                            response = __returnee;
                            _main_fetchToken(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '5':
                        if (response.status === 200) {
                            body = JSON.parse(response.responseText);
                            me.state = undefined;
                            __resolve(body.gentoken);
                            return;
                        } else {
                            me.state = undefined;
                            __resolve(undefined);
                            return;
                        }
                    default:
                        return;
                    }
                }
            } catch (ex) {
                unit.onError(ex);
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_fetchToken(__resolve, __reject);
            });
        };
        return me;
    }
    function fetchToken(spaceId) {
        var __obj = fetchToken_create(spaceId);
        return __obj.run();
    }
    function requestDownload_create(spaceId, folderId, onError) {
        var url, _var2;
        var me = {
            state: '2',
            type: 'requestDownload'
        };
        function _main_requestDownload(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        url = '/api/downloadapp/' + spaceId + '/' + folderId;
                        me.state = '15';
                        requestOrFail(url, undefined, onError).then(function (__returnee) {
                            _var2 = __returnee;
                            _main_requestDownload(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '15':
                        me.state = undefined;
                        __resolve(_var2);
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                unit.onError(ex);
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_requestDownload(__resolve, __reject);
            });
        };
        return me;
    }
    function requestDownload(spaceId, folderId, onError) {
        var __obj = requestDownload_create(spaceId, folderId, onError);
        return __obj.run();
    }
    function requestBuildAll_create(spaceId, folderId, onError) {
        var url, _var2;
        var me = {
            state: '2',
            type: 'requestBuildAll'
        };
        function _main_requestBuildAll(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        url = '/api/buildall/' + spaceId + '/' + folderId;
                        me.state = '15';
                        requestOrFail(url, undefined, onError).then(function (__returnee) {
                            _var2 = __returnee;
                            _main_requestBuildAll(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '15':
                        me.state = undefined;
                        __resolve(_var2);
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                unit.onError(ex);
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_requestBuildAll(__resolve, __reject);
            });
        };
        return me;
    }
    function requestBuildAll(spaceId, folderId, onError) {
        var __obj = requestBuildAll_create(spaceId, folderId, onError);
        return __obj.run();
    }
    function requestOrFail_create(url, body, onError) {
        var response, _var2;
        var me = {
            state: '2',
            type: 'requestOrFail'
        };
        function _main_requestOrFail(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '6';
                        sendRequest('POST', url, body).then(function (__returnee) {
                            response = __returnee;
                            _main_requestOrFail(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '6':
                        if (response.status === 200) {
                            body = JSON.parse(response.responseText);
                            me.state = undefined;
                            __resolve(body);
                            return;
                        } else {
                            console.error(response.status, response.responseText);
                            if (response.responseText) {
                                body = JSON.parse(response.responseText);
                                if (body.error) {
                                    _var2 = tr(body.error);
                                    onError(_var2);
                                    me.state = '7';
                                } else {
                                    me.state = '7';
                                }
                            } else {
                                me.state = '7';
                            }
                        }
                        break;
                    case '7':
                        me.state = undefined;
                        __resolve(undefined);
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                unit.onError(ex);
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_requestOrFail(__resolve, __reject);
            });
        };
        return me;
    }
    function requestOrFail(url, body, onError) {
        var __obj = requestOrFail_create(url, body, onError);
        return __obj.run();
    }
    function createStyle() {
        var styleSheet;
        styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        document.head.appendChild(styleSheet);
        return styleSheet;
    }
    function resetStyle() {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (unit.styleElement) {
                    removeElement(unit.styleElement);
                    __state = '5';
                } else {
                    __state = '5';
                }
                break;
            case '5':
                unit.styleElement = createStyle();
                return unit.styleElement;
            default:
                return;
            }
        }
    }
    function addSemi(line) {
        var _var2;
        _var2 = line.trim();
        return '    ' + _var2 + ';';
    }
    function addClass() {
        var style, name, body, content, lines, i, _var2;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (unit.styleElement) {
                    __state = '3';
                } else {
                    unit.styleElement = createStyle();
                    __state = '3';
                }
                break;
            case '3':
                style = unit.styleElement;
                name = arguments[0];
                lines = [];
                i = 1;
                __state = '5';
                break;
            case '5':
                if (i < arguments.length) {
                    lines.push(arguments[i]);
                    i++;
                    __state = '5';
                } else {
                    _var2 = lines.map(addSemi);
                    body = _var2.join('\n');
                    content = '\n' + name + ' {\n' + body + '\n}\n';
                    style.innerHTML += content;
                    return;
                }
                break;
            default:
                return;
            }
        }
    }
    function add(parent, child) {
        parent.appendChild(child);
        return;
    }
    function clear(element) {
        element.innerHTML = '';
        return;
    }
    function createElement(tagName, properties, args) {
        var element, className, style, _var5, _var6, arg, _var3, _var2, _var4, key, value, _var8, _var7, _var9;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                args = args || [];
                element = document.createElement(tagName);
                if (properties) {
                    _var3 = properties;
                    _var2 = Object.keys(_var3);
                    _var4 = 0;
                    __state = '42';
                } else {
                    __state = '22';
                }
                break;
            case '13':
                return element;
            case '22':
                className = '';
                style = {};
                _var5 = args;
                _var6 = 0;
                __state = '32';
                break;
            case '31':
                _var6++;
                __state = '32';
                break;
            case '32':
                if (_var6 < _var5.length) {
                    arg = _var5[_var6];
                    if (typeof arg === 'string') {
                        className = arg;
                        __state = '31';
                    } else {
                        if (arg.tagName) {
                            add(element, arg);
                            __state = '31';
                        } else {
                            style = arg;
                            __state = '31';
                        }
                    }
                } else {
                    __state = '48';
                }
                break;
            case '42':
                if (_var4 < _var2.length) {
                    key = _var2[_var4];
                    value = _var3[key];
                    element.setAttribute(key, value);
                    _var4++;
                    __state = '42';
                } else {
                    __state = '22';
                }
                break;
            case '48':
                _var8 = style;
                _var7 = Object.keys(_var8);
                _var9 = 0;
                __state = '50';
                break;
            case '49':
                _var9++;
                __state = '50';
                break;
            case '50':
                if (_var9 < _var7.length) {
                    key = _var7[_var9];
                    value = _var8[key];
                    if (key === 'text') {
                        addText(element, value);
                        __state = '49';
                    } else {
                        if (key === 'tid') {
                            __state = '49';
                        } else {
                            element.style.setProperty(key, value);
                            __state = '49';
                        }
                    }
                } else {
                    __state = '52';
                }
                break;
            case '52':
                if (className) {
                    element.className = className;
                    __state = '13';
                } else {
                    __state = '13';
                }
                break;
            default:
                return;
            }
        }
    }
    function createDiv(parent, className) {
        var element;
        className = className || '';
        element = div(className);
        add(parent, element);
        return element;
    }
    function addText(element, text) {
        var newNode;
        newNode = document.createTextNode(text);
        add(element, newNode);
        return;
    }
    function div() {
        var args, properties, _var2;
        args = Array.prototype.slice.call(arguments);
        properties = {};
        _var2 = createElement('div', properties, args);
        return _var2;
    }
    function main(container, reloadMe, onError, showWorking, hideWorking, startBuild) {
        var app, editor;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (unit.widget) {
                    __state = '1';
                } else {
                    createStyles();
                    editor = createAppEditor(reloadMe, onError, showWorking, hideWorking, startBuild);
                    app = createDataTree(container, editor);
                    unit.app = app;
                    unit.widget = {
                        render: function () {
                            app.render();
                        },
                        setData: function (data) {
                            editor.setData(data);
                            app.render();
                        }
                    };
                    __state = '1';
                }
                break;
            default:
                return;
            }
        }
    }
    function createTabStyles() {
        addClass('.tabs-top', 'white-space: nowrap', 'height:50px', 'padding: 5px', 'user-select: none');
        addClass('.tabs-bottom', 'white-space: nowrap', 'position: relative', 'height:calc(100% - 50px)');
        addClass('.tabs-container-selected', 'display: inline-block', 'vertical-align: bottom', 'padding-top:5px', 'height:40px', 'margin-right:10px', 'border-bottom: solid 3px darkgreen');
        addClass('.tabs-container', 'display: inline-block', 'vertical-align: bottom', 'padding-top:5px', 'height:40px', 'margin-right:10px', 'border-bottom: solid 3px white', 'cursor: pointer');
        addClass('.tabs-container:hover', 'background: #9fd694', 'border-bottom: #9fd694');
        addClass('.tabs-icon', 'display: inline-block', 'width: 30px', 'heigh: 30px', 'vertical-align: top');
        return;
    }
    function createTab(self, container, tab) {
        var tabDiv;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (tab.id === self.currentTab) {
                    tabDiv = div('tabs-container-selected', { text: tab.name });
                    __state = '7';
                } else {
                    tabDiv = div('tabs-container', { text: tab.name });
                    registerUiAction(tabDiv, 'click', function () {
                        onTabClick(self, tab.id);
                    });
                    __state = '7';
                }
                break;
            case '7':
                add(container, tabDiv);
                return;
            default:
                return;
            }
        }
    }
    function renderTabsNode(self, model) {
        var top, bottom, current, _var2, _var3, tab;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                top = createDiv(self.container, 'tabs-top');
                bottom = createDiv(self.container, 'tabs-bottom');
                __state = '5';
                break;
            case '4':
                return;
            case '5':
                _var2 = self.tabs;
                _var3 = 0;
                __state = '8';
                break;
            case '6':
                current = findByProperty(self.tabs, 'id', self.currentTab);
                model.renderChild(bottom, current.widget);
                __state = '4';
                break;
            case '8':
                if (_var3 < _var2.length) {
                    tab = _var2[_var3];
                    createTab(self, top, tab);
                    _var3++;
                    __state = '8';
                } else {
                    __state = '6';
                }
                break;
            default:
                return;
            }
        }
    }
    function onTabClick(self, tabId) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                self.currentTab = tabId;
                if (self.onTabChanged) {
                    self.onTabChanged(tabId);
                    __state = '3';
                } else {
                    __state = '3';
                }
                break;
            case '3':
                invalidate(self);
                return;
            default:
                return;
            }
        }
    }
    function createTabsNode(options) {
        var self;
        self = {
            render: renderTabsNode,
            currentTab: options.currentTab,
            tabs: options.tabs,
            onTabChanged: options.onTabChanged
        };
        return self;
    }
    function createDefaultButton(text, action, arg) {
        var button;
        button = div('appeditor-generic-button appeditor-default-button', { text: text });
        registerUiAction(button, 'click', action, arg);
        return button;
    }
    function createIconButton(icon, action, arg) {
        var button, className, style, _var2;
        className = 'appeditor-generic-button ' + 'appeditor-simple-button appeditor-icon-button';
        style = { 'margin-right': '5px' };
        _var2 = imgSrc(icon);
        button = html.createElement('img', {
            draggable: false,
            src: _var2
        }, [
            className,
            style
        ]);
        registerUiAction(button, 'click', action, arg);
        return button;
    }
    function createDisabledButton(text) {
        var button;
        button = div('appeditor-disabled-button', { text: text });
        return button;
    }
    function createSimpleButton(text, action, arg) {
        var button;
        button = div('appeditor-generic-button appeditor-simple-button', { text: text });
        registerUiAction(button, 'click', action, arg);
        return button;
    }
    function AppTab_render(self) {
        var nameEdit, name, nameLabel, nameBar, container, spacer, runBar, link, build, download, topBar, _var2, _var3, _var4, _var5, _var6, _var7, _var8;
        var __state = '16';
        while (true) {
            switch (__state) {
            case '15':
                return;
            case '16':
                container = self.container;
                spacer = createDiv(container, '');
                spacer.style.height = '10px';
                nameBar = createDiv(container, 'appeditor-section');
                nameLabel = createDiv(container, 'appeditor-label');
                _var3 = tr('MES_NAME');
                addText(nameLabel, _var3);
                nameEdit = createElement('input', { type: 'text' }, ['appeditor']);
                nameEdit.value = self.name;
                if (self.isReadOnly) {
                    nameEdit.readOnly = true;
                    __state = '30';
                } else {
                    __state = '30';
                }
                break;
            case '30':
                nameEdit.style.maxWidth = '400px';
                registerUiAction(nameEdit, 'input', function () {
                    _var2 = nameEdit.value.trim();
                    name = _var2.toLowerCase();
                    self.name = name;
                    self.onNameChanged(name);
                });
                add(nameBar, nameLabel);
                add(nameBar, nameEdit);
                __state = '32';
                break;
            case '32':
                if (self.runUrl) {
                    runBar = createDiv(container, 'appeditor-section');
                    runBar.style.paddingTop = '20px';
                    _var4 = tr('MES_RUN_IN_BROWSER');
                    link = createElement('a', {
                        href: self.runUrl,
                        target: '_blank'
                    }, [{
                            text: _var4,
                            'font-size': '18px',
                            'font-weight': 'bold'
                        }]);
                    add(runBar, link);
                    __state = '41';
                } else {
                    __state = '41';
                }
                break;
            case '41':
                if (self.runUrl) {
                    topBar = createDiv(container, 'appeditor-section');
                    topBar.style.paddingTop = '50px';
                    _var7 = tr('MES_DOWNLOAD');
                    download = createSimpleButton(_var7, function () {
                        _var8 = self.onDownload();
                        return _var8;
                    });
                    add(topBar, download);
                    if (self.isReadOnly) {
                        __state = '15';
                    } else {
                        _var5 = tr('MES_BUILD_ALL_MODULES');
                        build = createSimpleButton(_var5, function () {
                            _var6 = self.onBuildAll();
                            return _var6;
                        });
                        add(topBar, build);
                        __state = '15';
                    }
                } else {
                    __state = '15';
                }
                break;
            default:
                return;
            }
        }
    }
    function onBuildAll_create(self) {
        var parsed, response;
        var me = {
            state: '2',
            type: 'onBuildAll'
        };
        function _main_onBuildAll(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '1':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '2':
                        parsed = parseId(self.folderId);
                        me.state = '7';
                        requestBuildAll(parsed.spaceId, parsed.folderId, self.onError).then(function (__returnee) {
                            response = __returnee;
                            _main_onBuildAll(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '7':
                        if (response) {
                            self.startBuild(response);
                            me.state = '1';
                        } else {
                            me.state = '1';
                        }
                        break;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                unit.onError(ex);
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_onBuildAll(__resolve, __reject);
            });
        };
        return me;
    }
    function onBuildAll(self) {
        var __obj = onBuildAll_create(self);
        return __obj.run();
    }
    function onCancel(self) {
        setNewData(self);
        return;
    }
    function onDownload_create(self) {
        var parsed, download;
        var me = {
            state: '2',
            type: 'onDownload'
        };
        function _main_onDownload(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '1':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '2':
                        parsed = parseId(self.folderId);
                        me.state = '6';
                        requestDownload(parsed.spaceId, parsed.folderId, self.onError).then(function (__returnee) {
                            download = __returnee;
                            _main_onDownload(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '6':
                        if (download) {
                            startDownload(download.url, download.filename);
                            me.state = '1';
                        } else {
                            me.state = '1';
                        }
                        break;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                unit.onError(ex);
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_onDownload(__resolve, __reject);
            });
        };
        return me;
    }
    function onDownload(self) {
        var __obj = onDownload_create(self);
        return __obj.run();
    }
    function onSave_create(self) {
        var url, payload, response, parsed, genResponse, genUrl, _var2;
        var me = {
            state: '2',
            type: 'onSave'
        };
        function _main_onSave(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '1':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '2':
                        self.errorMessage = '';
                        invalidate(self);
                        redrawAll();
                        self.showWorking();
                        parsed = parseId(self.folderId);
                        url = '/api/edit/' + parsed.spaceId + '/' + parsed.folderId;
                        payload = produceEditPayload(self);
                        if (payload) {
                            me.state = '8';
                            sendRequest('POST', url, payload).then(function (__returnee) {
                                response = __returnee;
                                _main_onSave(__resolve, __reject);
                            }, function (error) {
                                me.state = undefined;
                                __reject(error);
                            });
                            return;
                        } else {
                            me.state = '11';
                        }
                        break;
                    case '8':
                        if (response.status === 204) {
                            genUrl = '/api/genapp/' + parsed.spaceId + '/' + parsed.folderId;
                            me.state = '22';
                            sendRequest('POST', genUrl).then(function (__returnee) {
                                genResponse = __returnee;
                                _main_onSave(__resolve, __reject);
                            }, function (error) {
                                me.state = undefined;
                                __reject(error);
                            });
                            return;
                        } else {
                            me.state = '_item2';
                        }
                        break;
                    case '11':
                        self.hideWorking();
                        invalidate(self);
                        redrawAll();
                        me.state = '1';
                        break;
                    case '22':
                        if (genResponse.status === 204) {
                            self.reloadMe(self.folderId);
                            me.state = '1';
                        } else {
                            me.state = '_item2';
                        }
                        break;
                    case '_item2':
                        _var2 = tr('MES_COULD_NOT_SAVE_CHANGES');
                        self.onError(_var2);
                        self.errorMessage = tr('MES_COULD_NOT_SAVE_CHANGES');
                        me.state = '11';
                        break;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                unit.onError(ex);
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_onSave(__resolve, __reject);
            });
        };
        return me;
    }
    function onSave(self) {
        var __obj = onSave_create(self);
        return __obj.run();
    }
    function AppEditor_render(self, data, model) {
        var container, tabDiv;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (self.newData) {
                    container = createDiv(self.container, 'appeditor-window');
                    self.topBar = createDiv(container, 'appeditor-section');
                    updateTopBar(self);
                    __state = '16';
                } else {
                    __state = '15';
                }
                break;
            case '15':
                return;
            case '16':
                if (self.tabs) {
                    tabDiv = createDiv(container, 'appeditor-lower');
                    model.renderChild(tabDiv, self.tabs);
                    __state = '15';
                } else {
                    __state = '15';
                }
                break;
            default:
                return;
            }
        }
    }
    function checkModules(self) {
        var unresolved, startup, _var2, _var3, module, _var4, _var5;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (self.newData.modules.length === 0) {
                    return 'ERR_ADD_AT_LEAST_ONE_MODULE';
                } else {
                    __state = '7';
                }
                break;
            case '7':
                startup = undefined;
                _var2 = self.newData.modules;
                _var3 = 0;
                __state = '9';
                break;
            case '8':
                _var3++;
                __state = '9';
                break;
            case '9':
                if (_var3 < _var2.length) {
                    module = _var2[_var3];
                    if (module.startup) {
                        startup = true;
                        __state = '11';
                    } else {
                        __state = '11';
                    }
                } else {
                    if (startup) {
                        return undefined;
                    } else {
                        _var5 = tr('ERR_NO_STARTUP_MODULE');
                        return _var5;
                    }
                }
                break;
            case '11':
                if (module.deps.length === 0) {
                    __state = '8';
                } else {
                    unresolved = module.deps.filter(function (dep) {
                        return !dep.module;
                    });
                    if (unresolved.length === 0) {
                        __state = '8';
                    } else {
                        _var4 = tr('ERR_UNRESOLVED_DEPENDENCIES');
                        return _var4 + ': ' + module.name;
                    }
                }
                break;
            default:
                return;
            }
        }
    }
    function canCancel(self) {
        var _var2, _var3;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                _var2 = self.newData.name.trim();
                if (_var2) {
                    if (self.oldData.html) {
                        _var3 = self.oldData.html.trim();
                        if (_var3) {
                            if (self.oldData.modules.length === 0) {
                                __state = '6';
                            } else {
                                return true;
                            }
                        } else {
                            __state = '6';
                        }
                    } else {
                        __state = '6';
                    }
                } else {
                    __state = '6';
                }
                break;
            case '6':
                return false;
            default:
                return;
            }
        }
    }
    function produceEditPayload(self) {
        var error, edit, htmlChange, oldMods, newMods, modsChange, htmlItem, modsItem, modError, html, _var2, _var3;
        var __state = '21';
        while (true) {
            switch (__state) {
            case '2':
                if (self.newData.name === self.oldData.name) {
                    __state = '23';
                } else {
                    error = getNameError(self.newData.name);
                    if (error) {
                        self.errorMessage = tr(error);
                        return undefined;
                    } else {
                        edit.name = self.newData.name;
                        __state = '23';
                    }
                }
                break;
            case '18':
                _var2 = JSON.stringify(edit);
                return _var2;
            case '21':
                edit = {
                    type: 'editType',
                    added: [],
                    remove: [],
                    updated: [],
                    tag: 'notag',
                    oldTag: self.tag
                };
                self.errorMessage = undefined;
                __state = '2';
                break;
            case '23':
                html = self.newData.html.trim();
                if (html) {
                    _var3 = html.indexOf('%SCRIPT%');
                    if (_var3 === -1) {
                        self.errorMessage = tr('ERR_SCRIPT_MISSING');
                        __state = '49';
                    } else {
                        if (self.newData.html === self.oldData.html) {
                            __state = '40';
                        } else {
                            htmlChange = {
                                id: 'html',
                                type: 'html',
                                text: self.newData.html
                            };
                            htmlItem = findByProperty(self.items, 'id', 'html');
                            if (htmlItem) {
                                edit.updated.push(htmlChange);
                                __state = '40';
                            } else {
                                edit.added.push(htmlChange);
                                __state = '40';
                            }
                        }
                    }
                } else {
                    self.errorMessage = tr('ERR_PLEASE_PROVIDE_HTML');
                    __state = '49';
                }
                break;
            case '30':
                oldMods = JSON.stringify(self.oldData.modules);
                newMods = JSON.stringify(self.newData.modules);
                if (oldMods === newMods) {
                    __state = '18';
                } else {
                    modsChange = {
                        id: 'modules',
                        type: 'modules',
                        text: newMods
                    };
                    modsItem = findByProperty(self.items, 'id', 'modules');
                    if (modsItem) {
                        edit.updated.push(modsChange);
                        __state = '18';
                    } else {
                        edit.added.push(modsChange);
                        __state = '18';
                    }
                }
                break;
            case '40':
                modError = checkModules(self);
                if (modError) {
                    self.errorMessage = tr(modError);
                    return undefined;
                } else {
                    __state = '30';
                }
                break;
            case '49':
                return undefined;
            default:
                return;
            }
        }
    }
    function updateTopBar(self) {
        var save, topBar, message, cancel, _var2, _var3, _var4, _var5, _var6, _var7;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                topBar = self.topBar;
                clear(topBar);
                _var2 = isChanged(self);
                if (_var2) {
                    if (self.isReadOnly) {
                        __state = '15';
                    } else {
                        _var3 = tr('MES_SAVE');
                        save = createDefaultButton(_var3, function () {
                            _var4 = onSave(self);
                            return _var4;
                        });
                        add(topBar, save);
                        _var5 = canCancel(self);
                        if (_var5) {
                            _var6 = tr('MES_CANCEL');
                            cancel = createSimpleButton(_var6, function () {
                                _var7 = onCancel(self);
                                return _var7;
                            });
                            add(topBar, cancel);
                            __state = '15';
                        } else {
                            __state = '15';
                        }
                    }
                } else {
                    __state = '15';
                }
                break;
            case '14':
                return;
            case '15':
                if (self.errorMessage) {
                    message = div('appeditor-error', { text: self.errorMessage });
                    add(topBar, message);
                    __state = '14';
                } else {
                    __state = '14';
                }
                break;
            default:
                return;
            }
        }
    }
    function canRun(self) {
        return !!self.runUrl;
    }
    function isChanged(self) {
        var oldData, newData;
        oldData = JSON.stringify(self.oldData);
        newData = JSON.stringify(self.newData);
        return oldData !== newData;
    }
    function setNewData(self) {
        var tabs, tabOptions, changeName, appTab, htmlTab, changeHtml, changeModules, modulesTab, payload, _var2, _var3, _var4, _var5;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                self.newData = cloneDeep(self.oldData);
                if (self.newData.html) {
                    __state = '29';
                } else {
                    self.newData.html = buildDefaultHtml(self.newData.name);
                    __state = '29';
                }
                break;
            case '16':
                invalidate(self);
                return;
            case '17':
                _var2 = tr('MES_APPLICATION');
                _var3 = tr('MES_MODULES');
                _var4 = tr('MES_HTML');
                tabs = [
                    {
                        id: 'app',
                        widget: appTab,
                        name: _var2
                    },
                    {
                        id: 'modules',
                        widget: modulesTab,
                        name: _var3
                    },
                    {
                        id: 'html',
                        widget: htmlTab,
                        name: _var4
                    }
                ];
                tabOptions = {
                    currentTab: self.currentTab || 'app',
                    tabs: tabs,
                    onTabChanged: function (tab) {
                        self.currentTab = tab;
                    }
                };
                self.tabs = createTabsNode(tabOptions);
                __state = '16';
                break;
            case '18':
                changeName = function (name) {
                    self.newData.name = name;
                    updateTopBar(self);
                };
                appTab = createAppTab(self.newData.name, self.runUrl, changeName, self.isReadOnly, function () {
                    onDownload(self);
                }, function () {
                    onBuildAll(self);
                });
                changeHtml = function (html) {
                    self.newData.html = html;
                    updateTopBar(self);
                };
                htmlTab = createHtmlEditor(self.newData.html, changeHtml, self.isReadOnly);
                changeModules = function (modules) {
                    self.newData.modules = modules;
                    self.errorMessage = undefined;
                    updateTopBar(self);
                    invalidate(self);
                };
                _var5 = cloneDeep(self.newData.modules);
                modulesTab = createModulesTab(_var5, changeModules, self.onError, self.isReadOnly);
                __state = '17';
                break;
            case '29':
                payload = produceEditPayload(self);
                if (payload) {
                    if (self.token) {
                        self.runUrl = '/gen/' + self.token + '/' + self.oldData.name + '/';
                        __state = '18';
                    } else {
                        __state = '32';
                    }
                } else {
                    __state = '32';
                }
                break;
            case '32':
                self.runUrl = undefined;
                __state = '18';
                break;
            default:
                return;
            }
        }
    }
    function getNameError(name) {
        var a, z, under, dash, dot, zero, nine, code, first, _var2, i;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (name) {
                    if (name.length > 50) {
                        return 'ERR_NAME_IS_TOO_LONG';
                    } else {
                        a = 'a'.charCodeAt(0);
                        z = 'z'.charCodeAt(0);
                        under = '_'.charCodeAt(0);
                        dash = '-'.charCodeAt(0);
                        dot = '.'.charCodeAt(0);
                        zero = '0'.charCodeAt(0);
                        nine = '9'.charCodeAt(0);
                        __state = '19';
                    }
                } else {
                    return 'ERR_NAME_CANNOT_BE_EMPTY';
                }
                break;
            case '19':
                i = 0;
                __state = '21';
                break;
            case '20':
                i++;
                __state = '21';
                break;
            case '21':
                if (i < name.length) {
                    code = name.charCodeAt(i);
                    _var2 = code;
                    if (_var2 === dot) {
                        __state = '20';
                    } else {
                        if (_var2 === under) {
                            __state = '20';
                        } else {
                            if (_var2 === dash) {
                                __state = '20';
                            } else {
                                if (code >= a) {
                                    if (code <= z) {
                                        __state = '20';
                                    } else {
                                        __state = '40';
                                    }
                                } else {
                                    __state = '40';
                                }
                            }
                        }
                    }
                } else {
                    __state = '36';
                }
                break;
            case '36':
                first = name.charCodeAt(0);
                if (first >= a) {
                    if (first <= z) {
                        return undefined;
                    } else {
                        __state = '47';
                    }
                } else {
                    __state = '47';
                }
                break;
            case '37':
                return 'ERR_NAME_CONTAINS_ILLEGAL_CHARACTERS';
            case '40':
                if (code >= zero) {
                    if (code <= nine) {
                        __state = '20';
                    } else {
                        __state = '37';
                    }
                } else {
                    __state = '37';
                }
                break;
            case '47':
                return 'ERR_NAME_SHOULD_START_WITH_ALPHA';
            default:
                return;
            }
        }
    }
    function convertData(data) {
        var html, modules, htmlItem, modulesItem;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                html = undefined;
                modules = [];
                if (data.items) {
                    htmlItem = findByProperty(data.items, 'id', 'html');
                    if (htmlItem) {
                        html = htmlItem.text;
                        __state = '10';
                    } else {
                        __state = '10';
                    }
                } else {
                    __state = '9';
                }
                break;
            case '9':
                return {
                    name: data.name,
                    html: html,
                    modules: modules
                };
            case '10':
                modulesItem = findByProperty(data.items, 'id', 'modules');
                if (modulesItem) {
                    modules = JSON.parse(modulesItem.text);
                    __state = '9';
                } else {
                    __state = '9';
                }
                break;
            default:
                return;
            }
        }
    }
    function AppEditor_setData_create(self, data) {
        var me = {
            state: '2',
            type: 'AppEditor_setData'
        };
        function _main_AppEditor_setData(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        self.items = data.items || [];
                        self.oldData = convertData(data);
                        self.tag = data.tag;
                        self.access = data.access;
                        self.folderId = makeId(data.space_id, data.id);
                        self.isReadOnly = self.access === 'read';
                        me.state = '17';
                        fetchToken(data.space_id).then(function (__returnee) {
                            self.token = __returnee;
                            _main_AppEditor_setData(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '17':
                        setNewData(self);
                        invalidate(self);
                        redrawAll();
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                unit.onError(ex);
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_AppEditor_setData(__resolve, __reject);
            });
        };
        return me;
    }
    function AppEditor_setData(self, data) {
        var __obj = AppEditor_setData_create(self, data);
        return __obj.run();
    }
    function createModulesTab(modules, onChanged, showNotification, isReadOnly) {
        var self;
        self = ModulesTab();
        self.modules = modules;
        self.onChanged = onChanged;
        self.showNotification = showNotification;
        self.isReadOnly = isReadOnly;
        return self;
    }
    function createModulesStyles() {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                addClass('.appeditor-mods-list', 'display: table', 'min-width: 400px');
                addClass('.appeditor-module', 'display: table-raw', 'border-bottom: solid 1px #9fd694');
                addClass('.appeditor-module-inactive', 'display: table-cell', 'position: relative', 'width: 100px', 'cursor: pointer');
                addClass('.appeditor-module-none', 'display: table-cell', 'position: relative', 'width: 100px');
                addClass('.appeditor-module-inactive:hover', 'background: #9fd694');
                addClass('.appeditor-module-active', 'display: table-cell', 'position: relative', 'width: 100px', 'color: white', 'background: darkgreen');
                addClass('.appeditor-module-visible', 'display: table-cell', 'position: relative', 'width: 400px');
                addClass('.appeditor-module-header', 'display: block', 'position: relative', 'height: 65px');
                addClass('.appeditor-startup', 'max-width: 80px', 'text-align: center', 'white-space: normal');
                addClass('.appeditor-module-name', 'display: inline-block', 'position: absolute', 'left:0px', 'top:0px', 'font-size: 18px', 'font-weight: bold', 'padding: 10px');
                __state = '12';
                break;
            case '11':
                return;
            case '12':
                addClass('.appeditor-module-close', 'display: inline-block', 'vertical-align: top', 'width: 30px', 'height: 30px', 'top: 5px', 'right: 5px', 'position: absolute', 'cursor: pointer');
                addClass('.appeditor-modules-dialog', 'display: inline-block', 'width: 400px', 'max-width: 100vw', 'border: solid 1px #a0a0a0', 'background: white', 'padding: 10px', 'box-shadow: 0px 0px 7px 2px rgba(0,0,0,0.27)');
                addClass('.appeditor-modules-dialog select', 'width: 100%', 'padding: 5px');
                addClass('.appeditor-label', 'margin-top: 10px');
                addClass('.appeditor-module-link', 'padding: 10px', 'position: absolute', 'display: inline-block', 'left: 0px', 'bottom: 0px');
                __state = '25';
                break;
            case '25':
                addClass('.appeditor-deps', 'display: table', 'width: 100%');
                addClass('.appeditor-dep', 'display: table-row');
                addClass('.appeditor-dep-name', 'display: table-cell', 'padding: 5px', 'text-align: right');
                addClass('.appeditor-dep-mod', 'display: table-cell', 'padding: 5px');
                addClass('.appeditor-dep-mod select', 'width: 100%', 'padding: 5px');
                __state = '11';
                break;
            default:
                return;
            }
        }
    }
    function HtmlEditor_render(self) {
        var textarea, cm;
        textarea = createElement('textarea');
        textarea.style.display = 'inline-block';
        textarea.style.width = '100%';
        textarea.style.height = '100%';
        textarea.style.margin = '0px';
        textarea.style.padding = '10px';
        add(self.container, textarea);
        cm = CodeMirror.fromTextArea(textarea, {
            indentUnit: 4,
            lineWrapping: true,
            mode: 'htmlmixed',
            theme: 'dark1',
            readOnly: self.isReadOnly
        });
        cm.setSize('100%', '100%');
        cm.setValue(self.source);
        cm.on('change', function () {
            self.source = cm.getValue();
            self.onChanged(self.source);
        });
        return;
    }
    function createAppTab(name, runUrl, onNameChanged, isReadOnly, onDownload, onBuildAll) {
        var self;
        self = AppTab();
        self.onNameChanged = onNameChanged;
        self.runUrl = runUrl;
        self.name = name;
        self.isReadOnly = isReadOnly;
        self.onDownload = onDownload;
        self.onBuildAll = onBuildAll;
        return self;
    }
    function createAppEditor(reloadMe, onError, showWorking, hideWorking, startBuild) {
        var editor;
        editor = AppEditor();
        editor.access = 'read';
        editor.changed = false;
        editor.reloadMe = reloadMe;
        editor.onError = onError;
        editor.showWorking = showWorking;
        editor.hideWorking = hideWorking;
        editor.startBuild = startBuild;
        return editor;
    }
    function createHtmlEditor(source, onChanged, isReadOnly) {
        var self;
        self = HtmlEditor();
        self.source = source;
        self.onChanged = onChanged;
        self.isReadOnly = isReadOnly;
        return self;
    }
    function ModulesTab_render(self) {
        var container, bar, addButton, i, modContainer, _var2, _var3, module, _var4, _var5;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                container = self.container;
                container.style.overflow = 'auto';
                if (self.isReadOnly) {
                    __state = '13';
                } else {
                    bar = createDiv(container, 'appeditor-section');
                    bar.style.paddingTop = '10px';
                    _var4 = tr('MES_ADD_MODULE');
                    addButton = createDefaultButton(_var4, function (foo, evt) {
                        _var5 = showAddModule(self, evt);
                        return _var5;
                    });
                    add(bar, addButton);
                    __state = '13';
                }
                break;
            case '5':
                if (_var3 < _var2.length) {
                    module = _var2[_var3];
                    renderModule(self, modContainer, module, i);
                    i++;
                    _var3++;
                    __state = '5';
                } else {
                    return;
                }
                break;
            case '13':
                modContainer = createDiv(container, 'appeditor-mods-list');
                i = 0;
                _var2 = self.modules;
                _var3 = 0;
                __state = '5';
                break;
            default:
                return;
            }
        }
    }
    function addOption(select, value, name) {
        var option;
        option = createElement('option', { value: value }, [{ text: name }]);
        add(select, option);
        return;
    }
    function fillDepModule(self, container, ordinal, dep) {
        var select, module, roValue, _var2, _var3, otherMod;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                module = self.modules[ordinal];
                if (self.isReadOnly) {
                    if (dep.module) {
                        roValue = div({
                            text: dep.module,
                            padding: '5px',
                            'font-weight': 'bold'
                        });
                        add(container, roValue);
                        __state = '11';
                    } else {
                        __state = '11';
                    }
                } else {
                    select = createElement('select');
                    add(container, select);
                    _var2 = self.modules;
                    _var3 = 0;
                    __state = '5';
                }
                break;
            case '4':
                _var3++;
                __state = '5';
                break;
            case '5':
                if (_var3 < _var2.length) {
                    otherMod = _var2[_var3];
                    if (module.name === otherMod.name) {
                        __state = '4';
                    } else {
                        addOption(select, otherMod.name, otherMod.name);
                        __state = '4';
                    }
                } else {
                    if (dep.module) {
                        select.value = dep.module;
                        __state = '12';
                    } else {
                        select.value = undefined;
                        __state = '12';
                    }
                }
                break;
            case '11':
                return;
            case '12':
                select.addEventListener('change', function () {
                    dep.module = select.value;
                    self.onChanged(self.modules);
                });
                __state = '11';
                break;
            default:
                return;
            }
        }
    }
    function renderModule(self, container, module, ordinal) {
        var line, active, inactive, link, visible, close, url, urlText, nameDiv, closeUrl, header, midText, depDiv, depName, depMod, depsTitle, deps, _var2, _var3, dep, _var4, _var5, _var6;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                line = createDiv(container, 'appeditor-module');
                if (module.startup) {
                    active = createDiv(line, 'appeditor-module-active');
                    midText = createDiv(active, 'appeditor-middle appeditor-startup');
                    _var4 = tr('MES_STARTUP');
                    addText(midText, '\u2714 ' + _var4);
                    __state = '17';
                } else {
                    if (self.isReadOnly) {
                        inactive = createDiv(line, 'appeditor-module-none');
                        __state = '17';
                    } else {
                        inactive = createDiv(line, 'appeditor-module-inactive');
                        midText = createDiv(inactive, 'appeditor-middle appeditor-startup');
                        _var5 = tr('MES_SET_STARTUP');
                        addText(midText, _var5);
                        registerUiAction(inactive, 'click', function () {
                            selectActiveModule(self, ordinal);
                        });
                        __state = '17';
                    }
                }
                break;
            case '15':
                return;
            case '16':
                if (self.isReadOnly) {
                    __state = '27';
                } else {
                    closeUrl = '/static/images/delete.png';
                    close = createElement('img', {
                        src: closeUrl,
                        draggable: false
                    }, ['appeditor-module-close']);
                    registerUiAction(close, 'click', function () {
                        removeModule(self, ordinal);
                    });
                    add(header, close);
                    __state = '27';
                }
                break;
            case '17':
                url = '/ide/doc/' + module.spaceId + '/' + module.id;
                urlText = module.spaceId + ' / ' + module.id;
                visible = createDiv(line, 'appeditor-module-visible');
                header = createDiv(visible, 'appeditor-module-header');
                link = createElement('a', {
                    href: url,
                    target: '_blank'
                }, [
                    'appeditor-module-link',
                    { text: urlText }
                ]);
                add(header, link);
                __state = '16';
                break;
            case '27':
                nameDiv = div('appeditor-module-name', { text: module.name });
                add(header, nameDiv);
                __state = '35';
                break;
            case '35':
                if (module.deps.length === 0) {
                    __state = '36';
                } else {
                    _var6 = tr('MES_DEPENDENCIES');
                    depsTitle = div({
                        text: _var6,
                        'text-align': 'center'
                    });
                    add(visible, depsTitle);
                    deps = createDiv(visible, 'appeditor-deps');
                    _var2 = module.deps;
                    _var3 = 0;
                    __state = '40';
                }
                break;
            case '36':
                __state = '15';
                break;
            case '40':
                if (_var3 < _var2.length) {
                    dep = _var2[_var3];
                    depDiv = createDiv(deps, 'appeditor-dep');
                    depName = createDiv(depDiv, 'appeditor-dep-name');
                    addText(depName, dep.name);
                    depMod = createDiv(depDiv, 'appeditor-dep-mod');
                    fillDepModule(self, depMod, ordinal, dep);
                    _var3++;
                    __state = '40';
                } else {
                    __state = '36';
                }
                break;
            default:
                return;
            }
        }
    }
    function getLines(text) {
        var lines, trimmed, filtered, _var2;
        if (text) {
            lines = text.split('\n');
            trimmed = lines.map(function (item) {
                _var2 = item.trim();
                return _var2;
            });
            filtered = trimmed.filter(function (item) {
                return !!item;
            });
            filtered.sort();
            return filtered;
        } else {
            return [];
        }
    }
    function convertModule(module) {
        var depLines, deps, _var2;
        depLines = getLines(module.props.dependencies);
        deps = depLines.map(function (dep) {
            return {
                name: dep,
                module: undefined
            };
        });
        _var2 = makeId(module.space_id, module.id);
        return {
            spaceId: module.space_id,
            id: module.id,
            folderId: _var2,
            name: module.name,
            deps: deps
        };
    }
    function selectActiveModule(self, ordinal) {
        var i;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                i = 0;
                __state = '5';
                break;
            case '5':
                if (i < self.modules.length) {
                    self.modules[i].startup = i === ordinal;
                    i++;
                    __state = '5';
                } else {
                    self.onChanged(self.modules);
                    return;
                }
                break;
            default:
                return;
            }
        }
    }
    function onProjectChanged_create(self, project) {
        var modules, moduleNames, _var2, _var3, module;
        var me = {
            state: '2',
            type: 'onProjectChanged'
        };
        function _main_onProjectChanged(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        self.project = project;
                        self.parent.prevProject = project;
                        self.module = undefined;
                        self.modules = {};
                        clear(self.moduleSelect);
                        updateAddModuleButtons(self);
                        me.state = '10';
                        break;
                    case '9':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '10':
                        me.state = '_item4';
                        fetchModules(project).then(function (__returnee) {
                            modules = __returnee;
                            _main_onProjectChanged(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '14':
                        if (_var3 < _var2.length) {
                            module = _var2[_var3];
                            moduleNames.push(module.name);
                            self.modules[module.name] = module;
                            _var3++;
                            me.state = '14';
                        } else {
                            moduleNames.sort();
                            moduleNames.forEach(function (name) {
                                addOption(self.moduleSelect, name, name);
                            });
                            self.moduleSelect.value = undefined;
                            me.state = '9';
                        }
                        break;
                    case '_item4':
                        moduleNames = [];
                        _var2 = modules;
                        _var3 = 0;
                        me.state = '14';
                        break;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                unit.onError(ex);
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_onProjectChanged(__resolve, __reject);
            });
        };
        return me;
    }
    function onProjectChanged(self, project) {
        var __obj = onProjectChanged_create(self, project);
        return __obj.run();
    }
    function updateAddModuleButtons(self) {
        var ok, cancel, _var2, _var3, _var4, _var5;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (self.project) {
                    if (self.module) {
                        _var2 = tr('MES_ADD_MODULE');
                        _var3 = tr('MES_CANCEL');
                        ok = createDefaultButton(_var2, function () {
                            addModule(self.parent, self.modules[self.module]);
                        });
                        cancel = createSimpleButton(_var3, function () {
                            closeDialog(self);
                        });
                        __state = '9';
                    } else {
                        __state = '_item3';
                    }
                } else {
                    __state = '_item3';
                }
                break;
            case '9':
                ok.style.display = 'block';
                ok.style.marginTop = '10px';
                ok.style.marginRight = '0px';
                ok.style.textAlign = 'center';
                cancel.style.display = 'block';
                cancel.style.marginTop = '10px';
                cancel.style.marginRight = '0px';
                cancel.style.textAlign = 'center';
                clear(self.buttons);
                add(self.buttons, ok);
                add(self.buttons, cancel);
                return;
            case '_item3':
                _var4 = tr('MES_ADD_MODULE');
                _var5 = tr('MES_CANCEL');
                ok = createDisabledButton(_var4);
                cancel = createSimpleButton(_var5, function () {
                    closeDialog(self);
                });
                __state = '9';
                break;
            default:
                return;
            }
        }
    }
    function onModuleChanged(self, moduleName) {
        self.module = moduleName;
        updateAddModuleButtons(self);
        return;
    }
    function addModule(self, moduleRaw) {
        var module, _var2, _var3;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                module = convertModule(moduleRaw);
                if (self.modules.length === 0) {
                    module.startup = true;
                    __state = '_item2';
                } else {
                    __state = '_item2';
                }
                break;
            case '_item2':
                _var2 = findByProperty(self.modules, 'name', module.name);
                if (_var2) {
                    _var3 = tr('ERR_MODULE_WITH_THIS_NAME_ALREADY_ADDED');
                    self.showNotification(_var3);
                    __state = '1';
                } else {
                    self.modules.push(module);
                    sortBy(self.modules, 'name');
                    closeDialog();
                    self.onChanged(self.modules);
                    __state = '1';
                }
                break;
            default:
                return;
            }
        }
    }
    function closeDialog() {
        HtmlUtils.hidePopup();
        return;
    }
    function removeFromDeps(module, depModule) {
        var _var2, _var3, dep;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                _var2 = module.deps;
                _var3 = 0;
                __state = '5';
                break;
            case '4':
                _var3++;
                __state = '5';
                break;
            case '5':
                if (_var3 < _var2.length) {
                    dep = _var2[_var3];
                    if (dep.module === depModule) {
                        dep.module = undefined;
                        __state = '4';
                    } else {
                        __state = '4';
                    }
                } else {
                    return;
                }
                break;
            default:
                return;
            }
        }
    }
    function removeModule(self, ordinal) {
        var module;
        module = self.modules[ordinal];
        self.modules.forEach(function (mod) {
            removeFromDeps(mod, module.name);
        });
        self.modules.splice(ordinal, 1);
        self.onChanged(self.modules);
        return;
    }
    function showAddModule_create(self, evt) {
        var projectSelect, projectLabel, moduleSelect, moduleLabel, title, buttons, dialogObj, projects, dialog, _var2, _var3, project, _var4, _var5, _var6;
        var me = {
            state: '2',
            type: 'showAddModule'
        };
        function _main_showAddModule(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        dialog = HtmlUtils.createPopup(undefined, false);
                        dialog.className = 'appeditor-modules-dialog';
                        _var6 = tr('MES_ADD_MODULE');
                        title = createDiv(dialog, 'appeditor-title');
                        addText(title, _var6);
                        _var4 = tr('MES_PROJECT');
                        projectLabel = createDiv(dialog, 'appeditor-label');
                        addText(projectLabel, _var4);
                        projectSelect = createElement('select');
                        add(dialog, projectSelect);
                        _var5 = tr('MES_MODULE');
                        moduleLabel = createDiv(dialog, 'appeditor-label');
                        addText(moduleLabel, _var5);
                        moduleSelect = createElement('select');
                        add(dialog, moduleSelect);
                        buttons = createDiv(dialog, '');
                        buttons.style.marginTop = '30px';
                        dialogObj = {
                            parent: self,
                            buttons: buttons,
                            moduleSelect: moduleSelect
                        };
                        me.state = '11';
                        break;
                    case '10':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '11':
                        updateAddModuleButtons(dialogObj);
                        projectSelect.addEventListener('change', function () {
                            onProjectChanged(dialogObj, projectSelect.value);
                        });
                        moduleSelect.addEventListener('change', function () {
                            onModuleChanged(dialogObj, moduleSelect.value);
                        });
                        HtmlUtils.setPosCorrected(evt.clientX, evt.clientY, dialog);
                        dialog.style.height = '';
                        me.state = '18';
                        break;
                    case '18':
                        me.state = '20';
                        fetchProjects().then(function (__returnee) {
                            projects = __returnee;
                            _main_showAddModule(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '20':
                        projects.sort();
                        _var2 = projects;
                        _var3 = 0;
                        me.state = '22';
                        break;
                    case '22':
                        if (_var3 < _var2.length) {
                            project = _var2[_var3];
                            addOption(projectSelect, project, project);
                            _var3++;
                            me.state = '22';
                        } else {
                            projectSelect.value = self.prevProject;
                            if (self.prevProject) {
                                me.state = '10';
                                onProjectChanged(dialogObj, self.prevProject).then(function () {
                                    _main_showAddModule(__resolve, __reject);
                                }, function (error) {
                                    me.state = undefined;
                                    __reject(error);
                                });
                                return;
                            } else {
                                me.state = '10';
                            }
                        }
                        break;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                unit.onError(ex);
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_showAddModule(__resolve, __reject);
            });
        };
        return me;
    }
    function showAddModule(self, evt) {
        var __obj = showAddModule_create(self, evt);
        return __obj.run();
    }
    function DataTree() {
        var self = {};
        self.render = function () {
            return DataTree_render(self);
        };
        self.renderChild = function (parentElement, node) {
            return DataTree_renderChild(self, parentElement, node);
        };
        self.setValue = function (item, name, value) {
            return DataTree_setValue(self, item, name, value);
        };
        return self;
    }
    function AppTab() {
        var self = {};
        self.render = function () {
            return AppTab_render(self);
        };
        return self;
    }
    function AppEditor() {
        var self = {};
        self.render = function (data, model) {
            return AppEditor_render(self, data, model);
        };
        self.setData = function (data) {
            return AppEditor_setData(self, data);
        };
        self.setData_create = function (data) {
            return AppEditor_setData_create(self, data);
        };
        return self;
    }
    function HtmlEditor() {
        var self = {};
        self.render = function () {
            return HtmlEditor_render(self);
        };
        return self;
    }
    function ModulesTab() {
        var self = {};
        self.render = function () {
            return ModulesTab_render(self);
        };
        return self;
    }
    unit.main = main;
    unit.DataTree = DataTree;
    unit.AppTab = AppTab;
    unit.AppEditor = AppEditor;
    unit.HtmlEditor = HtmlEditor;
    unit.ModulesTab = ModulesTab;
    Object.defineProperty(unit, 'tr', {
        get: function () {
            return tr;
        },
        set: function (newValue) {
            tr = newValue;
        },
        enumerable: true,
        configurable: true
    });
    return unit;
}
if (typeof module != 'undefined') {
    module.exports = appedit;
}