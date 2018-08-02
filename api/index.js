let func = require('./function/function');
let db = require('./function/dbFunctions');
let express = require('express');
let app = express();

app.get('/', (req, res) => {
    func.getMatches(function () {
        func.getAllMatchInfo(function () {
            db.findAllTeamMatches('Stone Cold Killers', function(result){
                res.json(result);
            });
        });
    });
});

app.listen(4000, (err) => {
    if(err) console.error(err)
    console.log("server started on port 3000");
})

/* func.getMatches(function () {
    func.getAllMatchInfo(function () {
        db.findAllTeamMatches('Stone Cold Killers', function(result){
            console.log(result);
        });
    });
}); */