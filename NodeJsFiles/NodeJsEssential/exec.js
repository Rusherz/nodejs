var exec = require('child_process').exec;

exec("dir", function(err, data){
	if(err){
		throw err;
	}
	console.log("Listing finished.");
	console.log(data);
});