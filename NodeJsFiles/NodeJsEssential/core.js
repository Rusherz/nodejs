var path = require("path");
var util = require("util");
var v8 = require("v8");

// Getting file name
console.log(path.basename(__filename));

// Creating path string
var dirUploads = path.join(__dirname, 'www', 'files', 'uploads');
console.log(dirUploads);

util.log(dirUploads);

util.log(v8.getHeapStatistics());