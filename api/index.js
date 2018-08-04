let func = require('./function/function');
let MatchFunctions = require('./function/MatchFunctions');
let TeamFunctions = require('./function/TeamFunctions');
let express = require('express');
let path = require('path')
let app = express();
let bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    func.getMatches(function () {
        func.getAllMatchInfo(function () {
            MatchFunctions.updateLastDate(function () {
                MatchFunctions.getLastUpdated(function (data) {
                    res.json(data);
                });
            });
        });
    });
});

app.get('/getLastUpdated', (req, res) => {
    MatchFunctions.getLastUpdated(function (data) {
        res.json(data);
    });
})

app.get('/findTeam', (req, res) => {
    MatchFunctions.fineOneTeamMatches('Stone Cold Killers', function (data) {
        res.json(data);
    })
});

app.get('/getwinloss', (req, res) => {
    TeamFunctions.findOneTeam('Stone Cold Killers', function (result) {
        let chartWinArray = [{
            type: 'column',
            label: '',
            dataPoints: []
        }];
        let chartLossArray = []

        res.json(result);
    });
});

app.get('/chartwinloss', (req, res) => {
    MatchFunctions.findOneWinLoss('Stone Cold Killers', function (data) {
        res.json(data);
    });
});

app.post('/chartwinloss', (req, res) => {
    let body = req.body;
    if (body['teamNames'] && body['teamNames'].length == 1) {
        TeamFunctions.findOneTeam(body['teamNames'][0], function (team) {
            let dataPoints = [];
            dataPoints.push({
                label: team['team'] + ' wins',
                backgroundColor: '#0000FF',
                fill: true,
                data: [team['bazaar'][body['roundsMaps']]['win'], team['cargo'][body['roundsMaps']]['win'], team['downfall'][body['roundsMaps']]['win'], team['quarantine'][body['roundsMaps']]['win'], team['suburbia'][body['roundsMaps']]['win'], team['subway'][body['roundsMaps']]['win'], team['tanker'][body['roundsMaps']]['win']]
            });
            dataPoints.push({
                label: team['team'] + ' losses',
                backgroundColor: '#FF0000',
                fill: true,
                data: [team['bazaar'][body['roundsMaps']]['loss'], team['cargo'][body['roundsMaps']]['loss'], team['downfall'][body['roundsMaps']]['loss'], team['quarantine'][body['roundsMaps']]['loss'], team['suburbia'][body['roundsMaps']]['loss'], team['subway'][body['roundsMaps']]['loss'], team['tanker'][body['roundsMaps']]['loss']]
            })
            res.json(dataPoints);
        });
    } else if (body['teamNames'] && body['teamNames'].length == 2) {
        TeamFunctions.findTwoTeams(body['teamNames'], function (teams) {
            let dataPoints = []
            let count = 0;
            for (let index in teams) {
                let winColor = '#0000FF';
                let lossColor = '#FF0000';
                if (index == 1) {
                    winColor = '#6C71FC';
                    lossColor = '#FC6C6C';
                }
                dataPoints.push({
                    label: teams[index]['team'] + ' wins',
                    backgroundColor: winColor,
                    fill: true,
                    data: [teams[index]['bazaar'][body['roundsMaps']]['win'], teams[index]['cargo'][body['roundsMaps']]['win'], teams[index]['downfall'][body['roundsMaps']]['win'], teams[index]['quarantine'][body['roundsMaps']]['win'], teams[index]['suburbia'][body['roundsMaps']]['win'], teams[index]['subway'][body['roundsMaps']]['win'], teams[index]['tanker'][body['roundsMaps']]['win']]
                });
                dataPoints.push({
                    label: teams[index]['team'] + ' losses',
                    backgroundColor: lossColor,
                    fill: true,
                    data: [teams[index]['bazaar'][body['roundsMaps']]['loss'], teams[index]['cargo'][body['roundsMaps']]['loss'], teams[index]['downfall'][body['roundsMaps']]['loss'], teams[index]['quarantine'][body['roundsMaps']]['loss'], teams[index]['suburbia'][body['roundsMaps']]['loss'], teams[index]['subway'][body['roundsMaps']]['loss'], teams[index]['tanker'][body['roundsMaps']]['loss']]
                })
                if (count == teams.length - 1) {
                    res.json(dataPoints);
                } else {
                    count++;
                }
            }
        });
    } else {
        TeamFunctions.findAllTeams(function (teams) {
            let dataPoints = []
            let count = 0;
            for (let team of teams) {
                dataPoints.push({
                    label: team['team'] + ' wins',
                    backgroundColor: '#0000FF',
                    fill: true,
                    data: [team['bazaar'][body['roundsMaps']]['win'], team['cargo'][body['roundsMaps']]['win'], team['downfall'][body['roundsMaps']]['win'], team['quarantine'][body['roundsMaps']]['win'], team['suburbia'][body['roundsMaps']]['win'], team['subway'][body['roundsMaps']]['win'], team['tanker'][body['roundsMaps']]['win']]
                });
                dataPoints.push({
                    label: team['team'] + ' losses',
                    backgroundColor: '#FF0000',
                    fill: true,
                    data: [team['bazaar'][body['roundsMaps']]['loss'], team['cargo'][body['roundsMaps']]['loss'], team['downfall'][body['roundsMaps']]['loss'], team['quarantine'][body['roundsMaps']]['loss'], team['suburbia'][body['roundsMaps']]['loss'], team['subway'][body['roundsMaps']]['loss'], team['tanker'][body['roundsMaps']]['loss']]
                })
                if (count == teams.length - 1) {
                    res.json(dataPoints);
                } else {
                    count++;
                }
            }
        });
    }
})

app.get('/insertTeam', (req, res) => {
    TeamFunctions.insertOneTeam('Stone Cold Killers', function (data) {
        res.json(data);
    })
})

app.get('/updateOneMap', (req, res) => {
    TeamFunctions.updateOneMap(function (data) {
        res.json(data)
    });
})

app.get('/createTeams', (req, res) => {
    MatchFunctions.getTeamNames(function (data) {
        let count = 0;
        let teamNames = [];
        for (let match of data) {
            if (teamNames.indexOf(match['homeTeam']) == -1) teamNames.push(match['homeTeam']);
            if (teamNames.indexOf(match['awayTeam']) == -1) teamNames.push(match['awayTeam']);
            count++
            if (count == data.length - 1) {
                count = 0;
                for (let teamName of teamNames) {
                    TeamFunctions.insertOneTeam(teamName, function () {
                        count++;
                        if (count == teamNames.length - 1) res.send('done');
                    })
                }
            }
        }
    });
});

app.get('/allTeamNames', (req, res) => {
    TeamFunctions.getTeamNames(function (data) {
        res.json(data);
    })
});

app.listen(4000, (err) => {
    if (err) console.error(err)
    console.info("server started on port 4000");
})












































/*
app.get('/allmatches', (req, res) => {
    findAllMatches(function(result) {
        res.json(result);
    });
}); 

/* app.get('/setWinLoss', (req, res) => {
    MatchFunctions.findAllMatches(function (matches) {
        let count = 0;
        for (let match of matches) {
            for (let i = 1; i < 4; i++) {
                let homeTeamMap = {
                    teamName: match['homeTeam'],
                    map: match['map' + i]['mapName'].toLowerCase().split(" ")[0],
                    roundsWon: match['map' + i]['scoreHome'],
                    roundsLoss: match['map' + i]['scoreAway']
                }
                let awayTeamMap = {
                    teamName: match['awayTeam'],
                    map: match['map' + i]['mapName'].toLowerCase().split(" ")[0],
                    roundsWon: match['map' + i]['scoreAway'],
                    roundsLoss: match['map' + i]['scoreHome']
                }
                TeamFunctions.updateOneMap(homeTeamMap, function(){
                    TeamFunctions.updateOneMap(awayTeamMap, function(){
                        if( i == 3){
                            count++;
                            if(count == matches.length - 1){
                                res.send('done');
                            }
                        }
                    })
                })
            }
        }
    })
}); */