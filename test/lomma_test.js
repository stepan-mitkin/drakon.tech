QUnit.module( "Formatter" );

QUnit.test("Empty", function(assert) {
    var tokens = lexSource("")
    var p = prettify(tokens)
    console.log(p)
	assert.equal(10, 10)

});

QUnit.test("Simple statements", function(assert) {
    var source = "a = b+ c-d in x\n" +
        "x=-c-m*u\n" + 
        "var u=10"
    var tokens = lexSource(source)
    var p = prettify(tokens)
    console.log(printTokens(p))
	assert.equal(10, 10)
});

QUnit.test("Function call", function(assert) {
    var source = "foo()\n" +
        "bar(one)\n" + 
        "bar(one, two, three)"
    var tokens = lexSource(source)
    var p = prettify(tokens)
    console.log(printTokens(p))
	assert.equal(10, 10)
});

QUnit.test("Nested", function(assert) {
    var source = "some.property = {\n" +
        "line1: bar(one),\n" + 
        "line2: -bar(one, two, three) + 20\n" +
        "}"
    var tokens = lexSource(source)
    var p = prettify(tokens)
    console.log(printTokens(p))
	assert.equal(10, 10)
});

QUnit.test("Keywords", function(assert) {
    var source = "await foo()\n" +
        "w = undefined\n" + 
        "x = async m => m.x\n" + 
        "y = await foo.bar()\n" +
        ""
    var tokens = lexSource(source)
    var p = prettify(tokens)
    console.log(printTokens(p))
	assert.equal(10, 10)
});

QUnit.test("Seq", function(assert) {
    var source = "try {\n" +
        "foo(10)\n" + 
        "} catch (c) {\n" + 
        "console.log('ow')\n" +
        "}"
    var tokens = lexSource(source)
    var p = prettify(tokens)
    console.log(printTokens(p))
	assert.equal(10, 10)
});