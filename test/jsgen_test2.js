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

var Test02 = Test02_module()

QUnit.test("nonCanonicalSc", function(assert) {
    testScenario(assert, 1500, Test02.nonCanonicalSc(undefined, 20, 10))
    testScenario(assert, 300, Test02.nonCanonicalSc(undefined, 20, 50))
    testScenario(assert, 500, Test02.nonCanonicalSc(undefined, 5, 20))
})

QUnit.test("simpleUpSc", function(assert) {
    testScenario(assert, 100, Test02.simpleUpSc(undefined))
})


QUnit.test("foreachArraySc", function(assert) {
    testScenario(assert, 60, Test02.foreachArraySc())
});

QUnit.test("foreachMapSc", function(assert) {
    testScenario(assert, 100, Test02.foreachMapSc())
});

QUnit.test("inputTest", function(assert) {
    var parent = makeFakeParent(assert, 158)
    var machine = Test02.inputTest(parent)
    machine.run()
    machine.onHop(50)
    machine.onHop2(100)
});

QUnit.test("inputTest2", function(assert) {
    var parent = makeFakeParent(assert, 159)
    var machine = Test02.inputTest2(parent)
    machine.run()
    machine.onHop(50)
    machine.onHop2(100)
    machine.onHop3()
});

QUnit.test("insertionTest", function(assert) {
    testScenario(assert, 35, Test02.insertionTest(undefined))
})

QUnit.test("pauseTest", function(assert) {
    testScenario(assert, 222, Test02.pauseSc(undefined))
})

QUnit.test("Receive", function(assert) {    
    var parent = makeFakeParent(assert, 25217)
    var machine = Test02.Receive(parent)    
    machine.run()
    machine.funOne()
    machine.funTwo(4000)
    machine.funOne()
    machine.funThree(7)
})

QUnit.test("lambda", function(assert) {
    testScenario(assert, 58, Test02.lambda(undefined, 8))
});

QUnit.test("forLoopSc", function(assert) {
    testScenario(assert, "Oslo Gjøvik Hamar ", Test02.forLoopSc(undefined))
});


QUnit.module( "JavaScript - Lambas" );

QUnit.test("lambdaTest", function(assert) {
    assert.equal(Test02.lambdaTest(), 15)
});
