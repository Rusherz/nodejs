var fs = require('fs');
var Promise = require('bluebird');

Promise.promisifyAll(fs);

fs.readFile('./data1.json', 'utf-8', function(err, data){
	if(err){
		console.error('unable to read file.');
	}
	else{
		try{
			console.log(JSON.parse(data));
		}
		catch(e){
			console.error("invalid json in file.");
		}
	}
});

fs.readFileAsync('data1.json')
	.then(JSON.parse)
	.then(function (val){
		console.log(val);
	})
	.catch(SyntaxError, function(e){
			console.error("invalid json in file.");
	})
	.catch(function(e){
		console.error('unable to read file.');
	});