var Person = require('./Person.js');
var tim = new Person('Tim');
tim.on('speak', function(said){
	console.log(`${this.name}: ${said}`)
});

tim.emit('speak', 'Hello World!');