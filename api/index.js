let func = require('./function/function');
let db = require('./function/dbFunctions');

func.getMatches(function () {
    func.getAllMatchInfo(function () {
        db.findOneTeam('Stone Cold Killers', function(result){
            console.log(result);
        });
    });
});