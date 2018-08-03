let func = require('./function/function');
let db = require('./function/dbFunctions');
let express = require('express');
let path = require('path')
let app = express();

app.use(express.static(path.join(__dirname, 'public')));

/* app.get('/', (req, res) => {
    func.getMatches(function () {
        func.getAllMatchInfo(function () {
            db.fineOneTeamMatches('Stone Cold Killers', function(result){
                res.json(result);
            });
        });
    });
});

app.get('/allmatches', (req, res) => {
    db.findAllMatches(function(result) {
        res.json(result);
    });
}); 





        let data = {
            "teamName": 'Stone Cold Killers',
            "map": 'bazaar',
            "roundsWon": 4,
            "roundsLoss": 1
        }
*/

/* app.get('/setWinLoss', (req, res) => {
    db.MatchFunctions.findAllMatches(function (matches) {
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
                db.TeamFunctions.updateOneMap(homeTeamMap, function(){
                    db.TeamFunctions.updateOneMap(awayTeamMap, function(){
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



app.get('/getwinloss', (req, res) => {
	db.TeamFunctions.findOneTeam('Stone Cold Killers', function (result) {
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
	db.TeamFunctions.findOneTeam('Stone Cold Killers', function (data) {
		/* let maps = ['bazaar', 'cargo', 'downfall', 'quarantine', 'suburbia', 'subway', 'tanker'];
		let dataPoints = []; */
		/* for(let m in maps){
			let wins = {
				label: maps[m],
				x: (m * 10),
				y: data[maps[m]]['rounds']['win']
			}

			let losses = {
				label: maps[m],
				x: (m * 10),
				y: data[maps[m]]['rounds']['loss']
			}

			dataPoints.push({
				type: 'column',
				dataPoints: wins
			})
			dataPoints.push({
				type:'column',
				dataPoints: losses
			})
		}*/
		let dataPointsWins = [{
			label: 'Bazaar',
			x: 0,
			y: data['bazaar']['rounds']['win']
		},{
			label: 'Cargo',
			x: 1,
			y: data['cargo']['rounds']['win']
		},{
			label: 'Downfall',
			x: 2,
			y: data['downfall']['rounds']['win']
		},{
			label: 'Quarantine',
			x: 3,
			y: data['quarantine']['rounds']['win']
		},{
			label: 'Suburbia',
			x: 4,
			y: data['suburbia']['rounds']['win']
		},{
			label: 'Subway',
			x: 5,
			y: data['subway']['rounds']['win']
		},{
			label: 'Tanker',
			x: 6,
			y: data['tanker']['rounds']['win']
		}];

		let dataPointsLosses = [{
			label: 'Bazaar',
			x: 0,
			y: data['bazaar']['rounds']['loss']
		},{
			label: 'Cargo',
			x: 1,
			y: data['cargo']['rounds']['loss']
		},{
			label: 'Downfall',
			x: 2,
			y: data['downfall']['rounds']['loss']
		},{
			label: 'Quarantine',
			x: 3,
			y: data['quarantine']['rounds']['loss']
		},{
			label: 'Suburbia',
			x: 4,
			y: data['suburbia']['rounds']['loss']
		},{
			label: 'Subway',
			x: 5,
			y: data['subway']['rounds']['loss']
		},{
			label: 'Tanker',
			x: 6,
			y: data['tanker']['rounds']['loss']
		}];

		let dataPoint = [{
			type: 'column',
			dataPoints: dataPointsWins
		}, {
			type: 'column',
			dataPoints: dataPointsLosses
		}];
		res.json(dataPoint);
	});
});

app.get('/insertTeam', (req, res) => {
	db.TeamFunctions.insertOneTeam('Stone Cold Killers', function (data) {
		res.json(data);
	})
})

app.get('/updateOneMap', (req, res) => {
	db.TeamFunctions.updateOneMap(function (data) {
		res.json(data)
	});
})

app.get('/createTeams', (req, res) => {
	db.MatchFunctions.getTeamNames(function (data) {
		let count = 0;
		let teamNames = [];
		for (let match of data) {
			if (teamNames.indexOf(match['homeTeam']) == -1) teamNames.push(match['homeTeam']);
			if (teamNames.indexOf(match['awayTeam']) == -1) teamNames.push(match['awayTeam']);
			count++
			if (count == data.length - 1) {
				count = 0;
				for (let teamName of teamNames) {
					db.TeamFunctions.insertOneTeam(teamName, function () {
						count++;
						if (count == teamNames.length - 1) res.send('done');
					})
				}
			}
		}
	});
});

app.get('/allTeamNames', (req, res) => {
	db.MatchFunctions.getTeamNames(function (data) {
		res.json(data);
	})
});

app.listen(4000, (err) => {
	if (err) console.error(err)
	console.log("server started on port 4000");
})

/* func.getMatches(function () {
    func.getAllMatchInfo(function () {
        db.findAllTeamMatches('Stone Cold Killers', function(result){
            console.log(result);
        });
    });
}); */