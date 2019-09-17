#!/usr/bin/env node

jmespath = require('./jmespath');

process.stdin.setEncoding('utf-8');

if (process.argv.length < 3) {
    console.log("Must provide a jmespath expression.");
    process.exit(1);
}

var inputJSON = process.argv[3];
console.log("Attempting to parse JSON: " + inputJSON);

var parsedInput = JSON.parse(inputJSON);
console.log("JSON parse result: " + parsedInput);

console.log(JSON.stringify(jmespath.search(parsedInput, process.argv[2])));

/*
var inputJSON = "";

process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    if (chunk !== null) {
        inputJSON += chunk;
    }
});

process.stdin.on('end', function() {
    var parsedInput = JSON.parse(inputJSON);
    console.log(JSON.stringify(jmespath.search(parsedInput, process.argv[2])));
});
*/