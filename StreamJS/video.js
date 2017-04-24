var http = require('http');
var fs = require('fs');

console.log("server starting on port 3000");
http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type':'video/mp4'});
    var rs = fs.createReadStream('cat.mp4');
    rs.pipe(res);
}).listen(3000);