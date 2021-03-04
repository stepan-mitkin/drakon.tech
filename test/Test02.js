// Created with Drakon Tech https://drakon.tech/

function blueScenario_run(self) {
    var work = true;
    while (work) {
        switch (self.state) {
            case "3":
                result = left + right
                self.state = undefined;
                sm.sendMessage(self.parent, "onChildCompleted", result);
                work = false;
                break;
            default:
                return;
        }
    }
}

function blueScenario(parent, left, right) {
    var self = sm.createMachine("blueScenario");
    self.left = left;
    self.right = right;
    sm.addChild(parent, self);
    sm.addMethod(self, "run", blueScenario_run);
    self.state = "3";
    return self;
}

function emptySc_run(self) {
    var work = true;
    while (work) {
        switch (self.state) {
            case "3":
                self.state = undefined;
                sm.sendMessage(self.parent, "onChildCompleted", undefined);
                work = false;
                break;
            default:
                return;
        }
    }
}

function emptySc(parent) {
    var self = sm.createMachine("emptySc");
    sm.addChild(parent, self);
    sm.addMethod(self, "run", emptySc_run);
    self.state = "3";
    return self;
}

function foreachArraySc_run(self) {
    var work = true;
    while (work) {
        switch (self.state) {
            case "3":
                array = [10, 20, 30]
                result = 0
                _5_it = 0;
                _5_col = array;
                _5_length = _5_col.length;
                self.state = "_5_loop";
                break;
            case "_5_loop":
                if (_5_it < _5_length) {
                    item = _5_col[_5_it];
                    result += item
                    _5_it++;
                    self.state = "_5_loop";
                } else {
                    self.state = undefined;
                    sm.sendMessage(self.parent, "onChildCompleted", result);
                    work = false;
                }
                break;
            default:
                return;
        }
    }
}

function foreachArraySc(parent) {
    var self = sm.createMachine("foreachArraySc");
    sm.addChild(parent, self);
    sm.addMethod(self, "run", foreachArraySc_run);
    self.state = "3";
    return self;
}

function foreachMapSc_run(self) {
    var work = true;
    while (work) {
        switch (self.state) {
            case "8":
                sum = 0
                map = {
                    ten: 10,
                    twenty: 20,
                    thirty: 30,
                    forty: 40
                }
                _5_it = 0;
                _5_col = map;
                _5_keys = Object.keys(_5_col);
                _5_length = _5_keys.length;
                self.state = "_5_loop";
                break;
            case "_5_loop":
                if (_5_it < _5_length) {
                    key = _5_keys[_5_it];
                    value = _5_col[key];
                    sum += value
                    _5_it++;
                    self.state = "_5_loop";
                } else {
                    self.state = undefined;
                    sm.sendMessage(self.parent, "onChildCompleted", sum);
                    work = false;
                }
                break;
            default:
                return;
        }
    }
}

function foreachMapSc(parent) {
    var self = sm.createMachine("foreachMapSc");
    sm.addChild(parent, self);
    sm.addMethod(self, "run", foreachMapSc_run);
    self.state = "8";
    return self;
}

function inputTest_onHop(self, data) {
    switch (self.state) {
        case "4_wait":
            value = data;
            self.state = "6";
            break;
        default:
            return;
    }
    inputTest_run(self);
}

function inputTest_onHop2(self, data) {
    switch (self.state) {
        case "6_wait":
            self.foo = data;
            self.state = "5";
            break;
        default:
            return;
    }
    inputTest_run(self);
}

function inputTest_run(self) {
    var work = true;
    while (work) {
        switch (self.state) {
            case "3":
                foo = 8
                self.state = "4_wait";
                work = false;
                break;
            case "6":
                self.state = "6_wait";
                work = false;
                break;
            case "5":
                self.state = undefined;
                sm.sendMessage(self.parent, "onChildCompleted", value + foo + self.foo);
                work = false;
                break;
            default:
                return;
        }
    }
}

function inputTest(parent) {
    var self = sm.createMachine("inputTest");
    sm.addMethod(self, "onHop", inputTest_onHop);
    sm.addMethod(self, "onHop2", inputTest_onHop2);
    sm.addChild(parent, self);
    sm.addMethod(self, "run", inputTest_run);
    self.state = "3";
    return self;
}

function insertionTest_onChildCompleted(self, data) {
    switch (self.state) {
        case "4_wait":
            moo = data;
            self.state = "5";
            break;
        default:
            return;
    }
    insertionTest_run(self);
}

function insertionTest_run(self) {
    var work = true;
    while (work) {
        switch (self.state) {
            case "3":
                left = 10
                right = 20
                self.state = "4_wait";
                work = false;
                var machine = blueScenario(self, left, right);
                machine.run();
                break;
            case "5":
                self.state = undefined;
                sm.sendMessage(self.parent, "onChildCompleted", moo + 5);
                work = false;
                break;
            default:
                return;
        }
    }
}

function insertionTest(parent) {
    var self = sm.createMachine("insertionTest");
    sm.addMethod(self, "onChildCompleted", insertionTest_onChildCompleted);
    sm.addChild(parent, self);
    sm.addMethod(self, "run", insertionTest_run);
    self.state = "3";
    return self;
}

function nonCanonicalSc_run(self) {
    var work = true;
    while (work) {
        switch (self.state) {
            case "18":
                result = 0
                if (a > b) {
                    result += 1000
                    self.state = "9";
                } else {
                    if (a > 10) {
                        self.state = undefined;
                        sm.sendMessage(self.parent, "onChildCompleted", result + 300);
                        work = false;
                    } else {
                        self.state = "9";
                    }
                }
                break;
            case "9":
                self.state = undefined;
                sm.sendMessage(self.parent, "onChildCompleted", result + 500);
                work = false;
                break;
            default:
                return;
        }
    }
}

function nonCanonicalSc(parent, a, b) {
    var self = sm.createMachine("nonCanonicalSc");
    self.a = a;
    self.b = b;
    sm.addChild(parent, self);
    sm.addMethod(self, "run", nonCanonicalSc_run);
    self.state = "18";
    return self;
}

function pauseSc_onTimeout(self, data) {
    switch (self.state) {
        case "12_wait":
            self.state = "4";
            break;
        default:
            return;
    }
    pauseSc_run(self);
}

function pauseSc_run(self) {
    var work = true;
    while (work) {
        switch (self.state) {
            case "3":
                x = 222
                self.state = "12_wait";
                work = false;
                sm.sendMessage(self, "onTimeout", undefined, 500);
                break;
            case "4":
                self.state = undefined;
                sm.sendMessage(self.parent, "onChildCompleted", x);
                work = false;
                break;
            default:
                return;
        }
    }
}

function pauseSc(parent) {
    var self = sm.createMachine("pauseSc");
    sm.addMethod(self, "onTimeout", pauseSc_onTimeout);
    sm.addChild(parent, self);
    sm.addMethod(self, "run", pauseSc_run);
    self.state = "3";
    return self;
}

function simpleUpSc_run(self) {
    var work = true;
    while (work) {
        switch (self.state) {
            case "3":
                i = 0
                result = {m: 0}
                self.state = "7";
                break;
            case "7":
                result.m += (i * 10)
                i++
                if (i < 5) {
                    self.state = "7";
                } else {
                    self.state = undefined;
                    sm.sendMessage(self.parent, "onChildCompleted", result.m);
                    work = false;
                }
                break;
            default:
                return;
        }
    }
}

function simpleUpSc(parent) {
    var self = sm.createMachine("simpleUpSc");
    sm.addChild(parent, self);
    sm.addMethod(self, "run", simpleUpSc_run);
    self.state = "3";
    return self;
}
