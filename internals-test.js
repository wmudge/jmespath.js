#!/usr/bin/env node

jmespath = require('./jmespath');

import FOO from "./graphpath";

//var graph = new GraphQuery(null, null);
//graph.query("abs(foo)");

var inputJson = {"foo": -1, "bar": 2}

var expression = "abs(foo)";
var expressionFoo = "foo(foo)";
var expressionBar = "bar(foo)";

console.log("Input JSON: " + JSON.stringify(inputJson, null, '  '));
console.log("Expression: " + expression);

console.log("Search:\n" + JSON.stringify(jmespath.search(inputJson, expression), null, '  '));

var counter = 0;

function Child() {
    jmespath.Runtime.call(this);
    this.super = Object.getPrototypeOf(Object.getPrototypeOf(this));

    function bar(resolvedArgs) {
        console.log("bar() has been called by: " + this);
        console.log("Counter: " + counter + "; Args: " + resolvedArgs[0]);
        return this.super._functionAbs.call(this, resolvedArgs) ^ ++counter;
    }

    this.functionTable.bar = {
        _func: bar,
        _signature: [{ types: [jmespath.FunctionTypes.NUMBER] }]
    }
}

Child.prototype = Object.create(jmespath.Runtime.prototype);
Child.prototype.constructor = Child;
Child.prototype.foo = function(resolvedArgs) {
    console.log("foo() has been called by: " + this);
    console.log("Counter: " + counter + "; Args: " + resolvedArgs[0]);
    return this.super._functionAbs.call(this, resolvedArgs) ^ ++counter;
}

function query(data, expression) {
    var ast = jmespath.compile(expression);

    var childInstance = new Child();

    childInstance.functionTable.foo = {
        _func: childInstance.foo,
        _signature: [{ types: [jmespath.FunctionTypes.NUMBER] }]
    }

    //var results = childInstance.foo([-3]);
    //console.log("Called foo() directly: " + results);

    var interpreter = new jmespath.Interpreter(childInstance);
    childInstance._interpreter = interpreter;

    return interpreter.search(ast, data);
}

console.log("Query:\n" + JSON.stringify(query(inputJson, expression), null, '  '));

for (var i = 0; i < 5; i++) {
    console.log("Query w/ foo():\n" + JSON.stringify(query(inputJson, expressionFoo), null, '  '));
}

for (var i = 0; i < 5; i++) {
    console.log("Query w/ bar():\n" + JSON.stringify(query(inputJson, expressionBar), null, '  '));
}

console.log("Done");

