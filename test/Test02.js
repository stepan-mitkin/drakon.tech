// Created with Drakon Tech https://drakon.tech/

function Receive_funOne(self, data) {
    switch (self.state) {
        case "7_wait":
            self.state = "18";
            break;
        case "12_wait":
            self.state = "21";
            break;
        default:
            return;
    }
    Receive_run(self);
}

function Receive_funTwo(self, data) {
    switch (self.state) {
        case "7_wait":
            self._foo = data;
            self.state = "19";
            break;
        default:
            return;
    }
    Receive_run(self);
}

function Receive_funThree(self, data) {
    switch (self.state) {
        case "12_wait":
            self._foo = data;
            self.state = "22";
            break;
        default:
            return;
    }
    Receive_run(self);
}

function Receive_run(self) {
    var work = true;
    while (work) {
        switch (self.state) {
            case "27":
                self._result = 0;
                
                self.state = "10";
                break;
            case "10":
                self._result += 10000;
                
                self.state = "7_wait";
                work = false;
                break;
            case "18":
                self._result += 1000;
                
                self.state = "10";
                break;
            case "19":
                self._result += self._foo;
                
                self.state = "20";
                break;
            case "20":
                self._result += 100;
                
                self.state = "12_wait";
                work = false;
                break;
            case "21":
                self._result += 10;
                
                self.state = "20";
                break;
            case "22":
                self._result += self._foo;
                
                self.state = "25";
                break;
            case "25":
                self.state = undefined;
                sm.sendMessage(self.parent, "onChildCompleted", self._result);
                work = false;
                break;
            default:
                return;
        }
    }
}

function Receive(parent) {
    var self = sm.createMachine("Receive");
    sm.addMethod(self, "funOne", Receive_funOne);
    sm.addMethod(self, "funTwo", Receive_funTwo);
    sm.addMethod(self, "funThree", Receive_funThree);
    sm.addChild(parent, self);
    sm.addMethod(self, "run", Receive_run);
    self.state = "27";
    return self;
}

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

function forLoopSc_run(self) {
    var work = true;
    while (work) {
        switch (self.state) {
            case "3":
                self._names = [
                    'Oslo',
                    'Gjøvik',
                    'Hamar'
                ];
                self._result = '';
                
                self._i = 0;
                
                self.state = "_5_loop";
                break;
            case "_5_loop":
                if (self._i < self._names.length) {
                    self._name = self._names[self._i];
                    self._result += self._name + ' ';
                    
                    self._i++;
                    
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

function forLoopSc(parent) {
    var self = sm.createMachine("forLoopSc");
    sm.addChild(parent, self);
    sm.addMethod(self, "run", forLoopSc_run);
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
            self._value = data;
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
                sm.sendMessage(self.parent, "onChildCompleted", self._value + self._foo + self.foo);
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

function lambda_run(self) {
    var work = true;
    while (work) {
        switch (self.state) {
            case "3":
                self._y = 20;
                
                self._m = function () {
                    var u = 30;
                    return u + self._y + self._x;
                };
                
                self.state = undefined;
                sm.sendMessage(self.parent, "onChildCompleted", self._m());
                work = false;
                break;
            default:
                return;
        }
    }
}

function lambda(parent, x) {
    var self = sm.createMachine("lambda");
    self._x = x;
    sm.addChild(parent, self);
    sm.addMethod(self, "run", lambda_run);
    self.state = "3";
    return self;
}

function nonCanonicalSc_run(self) {
    var work = true;
    while (work) {
        switch (self.state) {
            case "18":
                self._result = 0;
                
                if (self._a > self._b) {
                    self._result += 1000;
                    
                    self.state = "9";
                } else {
                    if (self._a > 10) {
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
                
                if (self._i < 5) {
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
