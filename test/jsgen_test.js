QUnit.module( "JavaScript - Questions" );

QUnit.test("cat", function(assert) {
    assert.equal(150, cat())
});

QUnit.test("and", function(assert) {
    assert.equal("no", and(true, true))
    assert.equal("yes", and(true, false))
    assert.equal("no", and(false, true))
    assert.equal("no", and(false, false))
});


QUnit.test("directionToInt", function(assert) {
    assert.equal(1, directionToInt("left"))
    assert.equal(2, directionToInt("right"))
    assert.throws(function() { directionToInt("up")})
});

QUnit.test("nestedQuestions", function(assert) {
    assert.equal(1037, nestedQuestions(5, 20))
    assert.equal(1028, nestedQuestions(15, 20))
    assert.equal(2800, nestedQuestions(100, 20))
    assert.equal(2500, nestedQuestions(100, 5))
});


QUnit.test("nonCanonical", function(assert) {
    assert.equal(1500, nonCanonical(20, 10))
    assert.equal(300, nonCanonical(20, 50))
    assert.equal(500, nonCanonical(5, 20))
});

QUnit.test("numberToString", function(assert) {
    assert.equal("negative", numberToString(-1))
    assert.equal("zero", numberToString(0))
    assert.equal("one", numberToString(1))
    assert.equal("many", numberToString(2))
});

QUnit.test("oneQuestion", function(assert) {
    assert.equal(false, oneQuestion(-1))
    assert.equal(true, oneQuestion(0))
});

QUnit.test("or", function(assert) {
    assert.equal("result: false", or(false, false))
    assert.equal("no", or(false, true))
    assert.equal("result: false", or(true, false))
    assert.equal("result: true", or(true, true))
});

QUnit.test("seq", function(assert) {
    assert.equal(20, seq())
});

QUnit.module( "JavaScript - Arrows" );

QUnit.test("choiceUp", function(assert) {
    assert.equal(choiceUp(1), 2)
    assert.equal(choiceUp(2), 3)
    assert.equal(choiceUp(0), 2)
    assert.throws(function() { choiceUp(300) })
});

QUnit.test("choiceUp2", function(assert) {
    assert.equal(choiceUp2(1), 2)
    assert.equal(choiceUp2(2), 3)
    assert.equal(choiceUp2(0), 2)
})

QUnit.test("andUp", function(assert) {
    assert.equal(andUp(), 9)
});

QUnit.test("emptyUp", function(assert) {
    assert.equal(emptyUp(), 3)
});

QUnit.test("nestedInQuestion", function(assert) {
    assert.equal(nestedInQuestion(), 24)
});

QUnit.test("nestedUp", function(assert) {
    assert.equal(nestedUp(), 3064)
});

QUnit.test("simpleUp", function(assert) {
    assert.equal(simpleUp(), 100)
});

QUnit.test("twoExits", function(assert) {
    assert.equal(twoExits(), 33)
});

QUnit.test("twoExitsEx", function(assert) {
    assert.equal(twoExitsEx(), 2031)
});


QUnit.test("twoSimpleUps", function(assert) {
    assert.equal(twoSimpleUps(), 15100)
});

QUnit.test("whileIf", function(assert) {
    assert.equal(whileIf(), 7)
});

QUnit.test("whileUp", function(assert) {
    assert.equal(whileUp(), 10)
});




QUnit.module( "JavaScript - Loops" );

QUnit.test("foreachArray", function(assert) {
    assert.equal(foreachArray(), 60)
});

QUnit.test("foreachMap", function(assert) {
    assert.equal(foreachMap(), 100)
});


QUnit.test("forLoop", function(assert) {
    assert.equal(forLoop(), "Oslo Gjøvik Hamar ")
});

QUnit.test("forLoopEarlyExit", function(assert) {
    assert.equal(forLoopEarlyExit(), "Oslo ")
});

QUnit.test("forOnArrow", function(assert) {
    assert.equal(forOnArrow(), " Oslo Gjøvik Hamar Oslo Gjøvik Hamar")
});

QUnit.test("intersection", function(assert) {
    assert.deepEqual(intersection([10, 20, 30], [20, 30, 40]), [20, 30])
});

QUnit.test("parallelLoops", function(assert) {
    assert.equal(parallelLoops(true), 102)
    assert.equal(parallelLoops(false), 100)
});

QUnit.test("exitFromNested", function(assert) {
    assert.equal(exitFromNested(["one", "two", "three"], ["five", "two", "six"]), "two")
    assert.equal(exitFromNested(["one", "two", "three"], ["five", "seven", "six"]), undefined)
});


QUnit.test("exitFromNestedQuick", function(assert) {
    var r1 = {}
    exitFromNestedQuick(r1)
    assert.equal(r1.value, 11)
});

QUnit.module( "JavaScript - Silhouette" );


QUnit.test("simpleSil", function(assert) {
    assert.equal(simpleSil(), 30)
});

QUnit.test("returnBeforeLast", function(assert) {
    assert.equal(returnBeforeLast(100), 100)
    assert.equal(returnBeforeLast(8), 23)
});


QUnit.test("quicksort", function(assert) {
    var unsorted = [ "the", "sooner", "we", "start", "this", "the", "better" ];
    var sorted   = [ "aa", "bb", "cc", "dd", "ee", "ff" ];
    var reverse  = [ "ff", "ee", "dd", "cc", "bb", "aa" ];
    var empty    = [];
    var flat     = [ "flat", "flat", "flat", "flat", "flat" ];

    var comparer = ascComparer;
    quicksort(comparer, unsorted, 0, unsorted.length);
    quicksort(comparer, sorted, 0, sorted.length);
    quicksort(comparer, reverse, 0, reverse.length);
    quicksort(comparer, empty, 0, empty.length);
    quicksort(comparer, flat, 0, flat.length);

    assert.deepEqual(unsorted, ["we","this","the","the","start","sooner","better"])
    assert.deepEqual(sorted, [ "ff", "ee", "dd", "cc", "bb", "aa" ])
    assert.deepEqual(reverse, [ "ff", "ee", "dd", "cc", "bb", "aa" ])
    assert.deepEqual(empty, [])
    assert.deepEqual(flat, [ "flat", "flat", "flat", "flat", "flat" ])
});

var sm = {
    sendMessage: function(target, method, data, delay) {
        delay = delay || 0
        if (target) {
            var fun = target[method]
            if (fun) {
                setTimeout(function() {
                    fun.call(target, data)
                }, delay)
            }
        }
    },

    addMethod: function(target, name, fun) {
        target[name] = function(a, b, c) {
            fun(target, a, b, c)
        }
    },

    addChild: function(parent, child) {
        if (parent && child && !child.parent) {
            child.parent = parent
            parent.kids.push(child)
        }
    },

    createMachine: function(type) {
        return {
            type: type,
            state: "created",
            kids: []
        }
    }
}

function makeFakeParent(assert, expected) {
    var self = {
        done: assert.async(),
        assert: assert,
        expected: expected,
        kids: []
    }

    self.onChildCompleted = function(data) {
        self.result = data
        self.assert.equal(self.result, self.expected)
        self.done()
    }

    return self
}

function testScenario(assert, expected, machine) {
    var parent = makeFakeParent(assert, expected)
    machine.parent = parent
    machine.run()
}

QUnit.module( "JavaScript - Scenario" );

QUnit.test("nonCanonicalSc", function(assert) {
    testScenario(assert, 1500, nonCanonicalSc(undefined, 20, 10))
    testScenario(assert, 300, nonCanonicalSc(undefined, 20, 50))
    testScenario(assert, 500, nonCanonicalSc(undefined, 5, 20))
})

QUnit.test("simpleUpSc", function(assert) {
    testScenario(assert, 100, simpleUpSc(undefined))
})


QUnit.test("foreachArraySc", function(assert) {
    testScenario(assert, 60, foreachArraySc())
});

QUnit.test("foreachMapSc", function(assert) {
    testScenario(assert, 100, foreachMapSc())
});

QUnit.test("inputTest", function(assert) {
    var parent = makeFakeParent(assert, 58)
    var machine = inputTest(parent)
    machine.run()
    machine.onHop(50)
});

QUnit.test("insertionTest", function(assert) {
    testScenario(assert, 35, insertionTest(undefined))
})

QUnit.test("pauseTest", function(assert) {
    testScenario(assert, 222, pauseSc(undefined))
})

QUnit.test("Receive", function(assert) {    
    var parent = makeFakeParent(assert, 25217)
    var machine = Receive(parent)    
    machine.run()
    machine.funOne()
    machine.funTwo(4000)
    machine.funOne()
    machine.funThree(7)
})

QUnit.module( "JavaScript - Lambas" );

QUnit.test("lambdaTest", function(assert) {
    assert.equal(lambdaTest(), 15)
});
