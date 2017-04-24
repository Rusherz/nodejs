var promise = new Promise(function(resolve, reject){
	resolve();
});
promise.then(function(){
	console.log('then');
});