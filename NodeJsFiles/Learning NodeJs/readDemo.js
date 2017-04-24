var fs = require('fs');

fs.readFile('./data1.json', 'utf-8', function(err, data){
	console.log(data);
});