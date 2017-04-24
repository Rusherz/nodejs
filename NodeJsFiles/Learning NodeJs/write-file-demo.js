var fs = require('fs');

var tomeString = { name:'Tom' };

fs.writeFile('tom.json', JSON.stringify(tomString));