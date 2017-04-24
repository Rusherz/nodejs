var path = require("path");

console.log(`Rock on world from ${path.basename(__filename)}`);

var hello = "Hello world from var hello!";

var justNode = hello.slice(17);

console.log(`Rock on world from ${justNode} var justNode`);

console.log(__dirname);
console.log(__filename);