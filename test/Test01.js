// Roof

// Created with Drakon Tech https://drakon.tech/

// Header

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
            self.foo = data;
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
            self.foo = data;
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
                self.result = 0
                self.state = "10";
                break;
            case "10":
                self.result += 10000
                self.state = "7_wait";
                work = false;
                break;
            case "18":
                self.result += 1000
                self.state = "10";
                break;
            case "19":
                self.result += self.foo
                self.state = "20";
                break;
            case "20":
                self.result += 100
                self.state = "12_wait";
                work = false;
                break;
            case "21":
                self.result += 10
                self.state = "20";
                break;
            case "22":
                self.result += self.foo
                self.state = "25";
                break;
            case "25":
                self.state = undefined;
                sm.sendMessage(self.parent, "onChildCompleted", self.result);
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

function and(a, b) {
    if ((a) && (!(b))) {
        return "yes"
    } else {
        return "no"
    }
}

function andUp() {
    var c1, c2;
    c1 = 2
    c2 = 3
    while (true) {
        if (c1 < 0) {
            c1++
        } else {
            c1 += 2
            c2 += 2
            if (c2 > 4) {
                break;
            } else {
                c1++
            }
        }
    }
    return c1+c2
}

function ascComparer(left, right) {
    if (left < right) {
        return 1
    } else {
        if (left === right) {
            return 0
        } else {
            return -1
        }
    }
}

function blueScenario_run(self) {
    var work = true;
    while (work) {
        switch (self.state) {
            case "3":
                self.result = self.left + self.right
                self.state = undefined;
                sm.sendMessage(self.parent, "onChildCompleted", self.result);
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

function cat() {
    var x, y;
    try {
        x = 150
    } catch (e) {
        y = 250
    }
    return 150
}

function choiceUp(i) {
    var _sw_7;
    while (true) {
        i++
        _sw_7 = i;
        if ((_sw_7 === 3) || (_sw_7 === 2)) {
            break;
        } else {
            if (_sw_7 === 1) {
            } else {
                throw new Error("Unexpected Choice value: " + _sw_7);
            }
        }
    }
    return i
}

function choiceUp2(i) {
    var _sw_7;
    while (true) {
        i++
        _sw_7 = i;
        if ((_sw_7 === 3) || (_sw_7 === 2)) {
            break;
        } else {
        }
    }
    return i
}

function compare(comparer, array, leftIndex, rightIndex) {
    var left, right;
    left = array[leftIndex]
    right = array[rightIndex]
    return comparer(left, right)
}

function directionToInt(direction) {
    var _sw_8;
    _sw_8 = direction;
    if (_sw_8 === "left") {
        return 1
    } else {
        if (_sw_8 === "right") {
        } else {
            throw new Error("Unexpected Choice value: " + _sw_8);
        }
        return 2
    }
}

function empty() {
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

function emptyUp() {
    var counter, move;
    counter = 0
    move = function () {
        counter ++;
    	 return counter < 3
    }
    while (true) {
        if (move()) {
        } else {
            break;
        }
    }
    return counter
}

function exitFromNested(left, right) {
    var _24_col, _24_it, _24_length, _26_col, _26_it, _26_length, found, le, ri;
    found = undefined
    _24_it = 0;
    _24_col = left;
    _24_length = _24_col.length;
    while (true) {
        if (_24_it < _24_length) {
            le = _24_col[_24_it];
            _26_it = 0;
            _26_col = right;
            _26_length = _26_col.length;
            while (true) {
                if (_26_it < _26_length) {
                    ri = _26_col[_26_it];
                    if (le === ri) {
                        found = le
                        return found
                    }
                    _26_it++;
                } else {
                    break;
                }
            }
            _24_it++;
        } else {
            break;
        }
    }
    return found
}

function exitFromNestedQuick(result) {
    var _24_col, _24_it, _24_length, _26_col, _26_it, _26_length, x, y;
    result.value = 11
    _24_it = 0;
    _24_col = [1, 2, 3];
    _24_length = _24_col.length;
    while (true) {
        if (_24_it < _24_length) {
            x = _24_col[_24_it];
            _26_it = 0;
            _26_col = [10, 20];
            _26_length = _26_col.length;
            while (true) {
                if (_26_it < _26_length) {
                    y = _26_col[_26_it];
                    if ((x === 2) && (y === 20)) {
                        return 
                    }
                    _26_it++;
                } else {
                    break;
                }
            }
            _24_it++;
        } else {
            break;
        }
    }
    result.value = 80
}

function forLoop() {
    var i, name, names, result;
    names = ["Oslo", "Gjøvik", "Hamar"]
    result = ""
    i = 0;
    while (true) {
        if (i < names.length) {
            name = names[i]
            result += (name + " ")
            i++;
        } else {
            break;
        }
    }
    return result
}

function forLoopEarlyExit() {
    var i, name, names, result;
    names = ["Oslo", "Gjøvik", "Hamar"]
    result = ""
    i = 0;
    while (true) {
        if (i < names.length) {
            if (result.length > 4) {
                break;
            } else {
                name = names[i]
                result += (name + " ")
                i++;
            }
        } else {
            break;
        }
    }
    return result
}

function forOnArrow(left, right) {
    var _16_col, _16_it, _16_length, name, names, result;
    names = ["Oslo", "Gjøvik", "Hamar"]
    result = ""
    while (true) {
        if (result.length < 30) {
            _16_it = 0;
            _16_col = names;
            _16_length = _16_col.length;
            while (true) {
                if (_16_it < _16_length) {
                    name = _16_col[_16_it];
                    result += (" " + name)
                    _16_it++;
                } else {
                    break;
                }
            }
        } else {
            break;
        }
    }
    return result
}

function foreachArray() {
    var _5_col, _5_it, _5_length, array, item, result;
    array = [10, 20, 30]
    result = 0
    _5_it = 0;
    _5_col = array;
    _5_length = _5_col.length;
    while (true) {
        if (_5_it < _5_length) {
            item = _5_col[_5_it];
            result += item
            _5_it++;
        } else {
            break;
        }
    }
    return result
}

function foreachArraySc_run(self) {
    var work = true;
    while (work) {
        switch (self.state) {
            case "3":
                self.array = [10, 20, 30]
                self.result = 0
                self._5_it = 0;
                self._5_col = self.array;
                self._5_length = self._5_col.length;
                self.state = "_5_loop";
                break;
            case "_5_loop":
                if (self._5_it < self._5_length) {
                    self.item = self._5_col[self._5_it];
                    self.result += self.item
                    self._5_it++;
                    self.state = "_5_loop";
                } else {
                    self.state = undefined;
                    sm.sendMessage(self.parent, "onChildCompleted", self.result);
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

function foreachMap() {
    var _5_col, _5_it, _5_keys, _5_length, key, map, sum, value;
    sum = 0
    map = {ten:10, twenty:20, thirty:30, forty:40}
    _5_it = 0;
    _5_col = map;
    _5_keys = Object.keys(_5_col);
    _5_length = _5_keys.length;
    while (true) {
        if (_5_it < _5_length) {
            key = _5_keys[_5_it];
            value = _5_col[key];
            sum += value
            _5_it++;
        } else {
            break;
        }
    }
    return sum
}

function foreachMapSc_run(self) {
    var work = true;
    while (work) {
        switch (self.state) {
            case "8":
                self.sum = 0
                self.map = {
                    ten: 10,
                    twenty: 20,
                    thirty: 30,
                    forty: 40
                }
                self._5_it = 0;
                self._5_col = self.map;
                self._5_keys = Object.keys(self._5_col);
                self._5_length = self._5_keys.length;
                self.state = "_5_loop";
                break;
            case "_5_loop":
                if (self._5_it < self._5_length) {
                    self.key = self._5_keys[self._5_it];
                    self.value = self._5_col[self.key];
                    self.sum += self.value
                    self._5_it++;
                    self.state = "_5_loop";
                } else {
                    self.state = undefined;
                    sm.sendMessage(self.parent, "onChildCompleted", self.sum);
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

function hello(who) {
    console.log("hello", who)
}

function indexOf(haystack, needle) {
    var i;
    i = 0;
    while (true) {
        if (i < haystack.length) {
            if (haystack[i] === needle) {
                return i
            } else {
                i ++;
            }
        } else {
            return  - 1
        }
    }
}

function inputTest_onHop(self, data) {
    switch (self.state) {
        case "4_wait":
            self.value = data;
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
                self.foo = 8
                self.state = "4_wait";
                work = false;
                break;
            case "5":
                self.state = undefined;
                sm.sendMessage(self.parent, "onChildCompleted", self.value + self.foo);
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
    sm.addChild(parent, self);
    sm.addMethod(self, "run", inputTest_run);
    self.state = "3";
    return self;
}

function insertionTest_onChildCompleted(self, data) {
    switch (self.state) {
        case "4_wait":
            self.moo = data;
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
                self.left = 10
                self.right = 20
                self.state = "4_wait";
                work = false;
                var machine = blueScenario(self, self.left, self.right);
                machine.run();
                break;
            case "5":
                self.state = undefined;
                sm.sendMessage(self.parent, "onChildCompleted", self.moo + 5);
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

function intersection(left, right) {
    var _6_col, _6_it, _6_length, _8_col, _8_it, _8_length, leftItem, result, rightItem;
    result = []
    _6_it = 0;
    _6_col = left;
    _6_length = _6_col.length;
    while (true) {
        if (_6_it < _6_length) {
            leftItem = _6_col[_6_it];
            _8_it = 0;
            _8_col = right;
            _8_length = _8_col.length;
            while (true) {
                if (_8_it < _8_length) {
                    rightItem = _8_col[_8_it];
                    if (rightItem === leftItem) {
                        result.push(leftItem)
                        break;
                    } else {
                        _8_it++;
                    }
                } else {
                    break;
                }
            }
            _6_it++;
        } else {
            break;
        }
    }
    return result
}

function lambdaTest() {
    var lam, x;
    x = 10
    lam = function () {
        var y = x + 5
        return y
    }
    return lam()
}

function nestedInQuestion() {
    var bar, foo, mmm;
    foo = 0
    bar = 0
    mmm = function () {
        foo ++; bar += 2
        return bar < 4
    }
    while (true) {
        if (bar > foo) {
        } else {
            while (true) {
                if (mmm()) {
                } else {
                    break;
                }
            }
        }
        foo++
        if (foo > 10) {
            break;
        } else {
        }
    }
    return foo + bar
}

function nestedQuestions(a, b) {
    var x;
    x = 0
    if (a > b) {
        x = 2000
        if (b > 10) {
            x += 800
        } else {
            x += 500
        }
    } else {
        x = 1000
        if (a > 10) {
            x += 28
        } else {
            x += 37
        }
    }
    return x
}

function nestedUp() {
    var counter, foo, move, moveFoo;
    counter = 0
    foo = 1
    move = function () {
        counter ++;
    	 return counter < 3
    }
    moveFoo = function () {
        foo *= 2;
        return foo < 16
    }
    while (true) {
        while (true) {
            if (moveFoo()) {
            } else {
                break;
            }
        }
        if (move()) {
        } else {
            break;
        }
    }
    return counter * 1000 + foo
}

function nonCanonical(a, b) {
    var result;
    result = 0
    if (a > b) {
        result += 1000
        return result + 500
    } else {
        if (a > 10) {
            return result + 300
        } else {
            return result + 500
        }
    }
}

function nonCanonicalSc_run(self) {
    var work = true;
    while (work) {
        switch (self.state) {
            case "18":
                self.result = 0
                if (self.a > self.b) {
                    self.result += 1000
                    self.state = "9";
                } else {
                    if (self.a > 10) {
                        self.state = undefined;
                        sm.sendMessage(self.parent, "onChildCompleted", self.result + 300);
                        work = false;
                    } else {
                        self.state = "9";
                    }
                }
                break;
            case "9":
                self.state = undefined;
                sm.sendMessage(self.parent, "onChildCompleted", self.result + 500);
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

function numberToString(number) {
    var _sw_9, many, one, zero;
    if (number < 0) {
        return "negative"
    } else {
        _sw_9 = number;
        if (_sw_9 === 0) {
            zero = "zero"
            return zero
        } else {
            if (_sw_9 === 1) {
                one = "one"
                return "one"
            } else {
                many = "many"
                return many
            }
        }
    }
}

function oneQuestion(value) {
    if (value >= 0) {
        return true
    } else {
        return false
    }
}

function or(a, b) {
    if ((a) || (!(b))) {
        a = b
        return "result: " + a
    } else {
        return "no"
    }
}

function parallelLoops(x) {
    var bar, foo, result;
    result = 0
    foo = function() {
    	result += 10;
    	return result < 100
    }
    bar = function() {
    	result += 3
    	return result < 100
    }
    if (x) {
        while (true) {
            if (bar()) {
            } else {
                break;
            }
        }
    } else {
        while (true) {
            if (foo()) {
            } else {
                break;
            }
        }
    }
    return result
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
                self.x = 222
                self.state = "12_wait";
                work = false;
                sm.sendMessage(self, "onTimeout", undefined, 500);
                break;
            case "4":
                self.state = undefined;
                sm.sendMessage(self.parent, "onChildCompleted", self.x);
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

function quicksort(comparer, collection, begin, end) {
    var _sw_11, i, last, length, pivotIndex, storeIndex;
    function branch1() {
        length = end - begin
        last = end - 1
        _sw_11 = length;
        if (_sw_11 === 0) {
            return branch5();
        } else {
            if (_sw_11 === 1) {
                return branch5();
            } else {
                if (_sw_11 === 2) {
                    return branch2();
                } else {
                    return branch3();
                }
            }
        }
    }

    function branch2() {
        if (compare(comparer, collection, begin, last) <= 0) {
        } else {
            swap(collection, begin, last)
        }
        return branch5();
    }

    function branch3() {
        pivotIndex = begin + Math.floor(length / 2)
        swap(collection, pivotIndex, last)
        storeIndex = begin
        i = begin;
        while (true) {
            if (i < last) {
                if (compare(comparer, collection, i, last) < 0) {
                    swap(collection, i, storeIndex)
                    storeIndex++
                }
                i++;
            } else {
                break;
            }
        }
        swap(collection, storeIndex, last)
        return branch4();
    }

    function branch4() {
        quicksort(comparer, collection, begin, storeIndex)
        quicksort(comparer, collection, storeIndex + 1, end)
        return branch5();
    }

    function branch5() {
    }

    return branch1();
}

function returnBeforeLast(value) {
    function branch1() {
        if (value > 10) {
            return value
        } else {
            value *= 2
            return branch2();
        }
    }

    function branch2() {
        value -= 3
        return value + 10
    }

    function branch3() {
    }

    return branch1();
}

function seq() {
    var result;
    result = 10
    result *= 2
    return result
}

function simpleSil() {
    var foo;
    function branch1() {
        foo = 10
        return branch2();
    }

    function branch2() {
        foo += 20
        return branch3();
    }

    function branch3() {
        return foo
    }

    return branch1();
}

async function simpleSil2() {
    var foo;
    async function branch1() {
        foo = 10
        return branch2();
    }

    async function branch2() {
        foo += 20
        return branch3();
    }

    async function branch3() {
        return foo
    }

    return branch1();
}

function simpleUp() {
    var i, result;
    i = 0
    result = 0
    while (true) {
        result += (i * 10)
        i ++
        if (i < 5) {
        } else {
            break;
        }
    }
    return result
}

function simpleUpSc_run(self) {
    var work = true;
    while (work) {
        switch (self.state) {
            case "3":
                self.i = 0
                self.result = 0
                self.state = "7";
                break;
            case "7":
                self.result += (self.i * 10)
                self.i++
                if (self.i < 5) {
                    self.state = "7";
                } else {
                    self.state = undefined;
                    sm.sendMessage(self.parent, "onChildCompleted", self.result);
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

function swap(array, leftIndex, rightIndex) {
    var left, right;
    left = array[leftIndex]
    right = array[rightIndex]
    array[leftIndex] = right
    array[rightIndex ] = left
}

function twoExits() {
    var bar, foo;
    foo = 0
    bar = 0
    while (true) {
        if (foo > 10) {
            break;
        } else {
            foo++
            if (bar > 20) {
                break;
            } else {
                bar += 2
            }
        }
    }
    return foo + bar
}

function twoExitsEx() {
    var bar, foo;
    foo = 0
    bar = 0
    while (true) {
        if (foo < bar) {
            foo++
        } else {
            bar++
        }
        if (foo > 10) {
            foo += 2000
            break;
        } else {
            foo++
            if (bar > 20) {
                foo += 1000
                break;
            } else {
                bar += 3
            }
        }
    }
    return foo + bar
}

function twoSimpleUps() {
    var i, ii, result;
    i = 0
    ii = 0
    result = 0
    while (true) {
        result += (i * 10)
        i ++
        if (i < 5) {
        } else {
            break;
        }
    }
    while (true) {
        result += (ii * 1000)
        ii ++
        if (ii > 5) {
            break;
        } else {
        }
    }
    return result
}

function whileIf() {
    var counter, result;
    counter = 0
    result = 0
    while (true) {
        if (counter < 5) {
            counter++
            if (counter % 2 == 0) {
                result += 2
            } else {
                result++
            }
        } else {
            break;
        }
    }
    return result
}

function whileUp() {
    var result;
    result = 0
    while (true) {
        if (result > 8) {
            break;
        } else {
            result += 2
        }
    }
    return result
}

// Footer

// Basement
