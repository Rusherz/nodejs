var koa = require('koa');
var app = new koa();

app.use(function*(){
	this.body = 'hello';
});

app.listen(3000);