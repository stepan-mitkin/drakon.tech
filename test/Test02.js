// Created with Drakon Tech https://drakon.tech/

function blueScenario_run(self) {
    var work = true;
    while (work) {
        switch (self.state) {
            case "3":
                self._result = self._left + self._right;
                
                self.state = undefined;
                sm.sendMessage(self.parent, "onChildCompleted", self._result);
                work = false;
                break;
            default:
                return;
        }
    }
}

function blueScenario(parent, left, right) {
    var self = sm.createMachine("blueScenario");
    self._left = left;
    self._right = right;
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
                self._array = [
                    10,
                    20,
                    30
                ];
                self._result = 0;
                
                self.__5_it = 0;
                self.__5_col = self._array;
                self.__5_length = self.__5_col.length;
                
                self.state = "_5_loop";
                break;
            case "_5_loop":
                if (self.__5_it < self.__5_length) {
                    self._item = self.__5_col[self.__5_it];
                    
                    self._result += self._item;
                    
                    self.__5_it++;
                    
                    self.state = "_5_loop";
                } else {
                    self.state = undefined;
                    sm.sendMessage(self.parent, "onChildCompleted", self._result);
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
                self._sum = 0;
                
                self._map = {
                    ten: 10,
                    twenty: 20,
                    thirty: 30,
                    forty: 40
                };
                
                self.__5_it = 0;
                self.__5_col = self._map;
                self.__5_keys = Object.keys(self.__5_col);
                self.__5_length = self.__5_keys.length;
                
                self.state = "_5_loop";
                break;
            case "_5_loop":
                if (self.__5_it < self.__5_length) {
                    self._key = self.__5_keys[self.__5_it];
                    self._value = self.__5_col[self._key];
                    
                    self._sum += self._value;
                    
                    self.__5_it++;
                    
                    self.state = "_5_loop";
                } else {
                    self.state = undefined;
                    sm.sendMessage(self.parent, "onChildCompleted", self._sum);
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
                self._foo = 8;
                
                self.state = "4_wait";
                work = false;
                break;
            case "6":
                self.state = "6_wait";
                work = false;
                break;
            case "5":
                self.state = undefined;
                sm.sendMessage(self.parent, "onChildCompleted", value + self._foo + self.foo);
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
            self._moo = data;
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
                self._left = 10;
                self._right = 20;
                
                self.state = "4_wait";
                work = false;
                var machine = blueScenario(self, self._left, self._right);
                machine.run();
                break;
            case "5":
                self.state = undefined;
                sm.sendMessage(self.parent, "onChildCompleted", self._moo + 5);
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
                self._result = 0;
                
                if (a > b) {
                    self._result += 1000;
                    
                    self.state = "9";
                } else {
                    if (a > 10) {
                        self.state = undefined;
                        sm.sendMessage(self.parent, "onChildCompleted", self._result + 300);
                        work = false;
                    } else {
                        self.state = "9";
                    }
                }
                break;
            case "9":
                self.state = undefined;
                sm.sendMessage(self.parent, "onChildCompleted", self._result + 500);
                work = false;
                break;
            default:
                return;
        }
    }
}

function nonCanonicalSc(parent, a, b) {
    var self = sm.createMachine("nonCanonicalSc");
    self._a = a;
    self._b = b;
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
                self._x = 222;
                
                self.state = "12_wait";
                work = false;
                sm.sendMessage(self, "onTimeout", undefined, 500);
                break;
            case "4":
                self.state = undefined;
                sm.sendMessage(self.parent, "onChildCompleted", self._x);
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
                self._i = 0;
                self._result = { m: 0 };
                
                self.state = "7";
                break;
            case "7":
                self._result.m += self._i * 10;
                
                self._i++;
                
                if (i < 5) {
                    self.state = "7";
                } else {
                    self.state = undefined;
                    sm.sendMessage(self.parent, "onChildCompleted", self._result.m);
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
