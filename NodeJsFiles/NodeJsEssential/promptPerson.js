var readLine = require("readline");

var rl = readLine.createInterface(process.stdin, process.stdout);

var realPerson = {
	name: '',
	sayings: []
};

rl.question("what is the name of a real person? ", function(answer){
	realPerson.name = answer;
	rl.setPrompt(`What would ${realPerson.name} say? `);
	rl.prompt();
	rl.on('line', function(answer){
		if(answer.toLowerCase().trim() == 'exit'){
			rl.close();
		}else{
			rl.setPrompt(`what else would ${realPerson.name} say? (exit to leave) `)
			realPerson.sayings.push(answer);
			rl.prompt();
		}
	});
});

rl.on('close', function(){
	console.log("%s is a real person that says %j", realPerson.name, realPerson.sayings);
	process.exit();
});