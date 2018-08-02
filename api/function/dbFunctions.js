require('../config/db');
const mongoose = require('mongoose');
const Match = require('../models/Match');
const Team = require('../models/Team');

let MatchFunctions = {
    'getTeamNames': (callback) => {
        Match.find().select('-_id -__v -date -map1 -map2 -map3').then(data => {
            callback(data);
        })
    },
    'insertOneMatch': (match, callback) => {
        Match.find({
            'date': match['date'],
            'homeTeam': match['homeTeam'],
            'awayTeam': match['awayTeam']
        }).then(data => {
            if (data.length == 0) {
                new Match(match).save().then(matchData => {

                });
            }
            callback();
        });
    },
    'findAllMatches': (callback) => {
        Match.find().select('-_id -__v').then(data => {
            callback(data);
        })
    },
    'fineOneTeamMatches': (teamName, callback) => {
        Match.find({
            $or: [{
                'homeTeam': teamName
            }, {
                'awayTeam': teamName
            }],
        }).select('-_id -__v').then(data => {
            callback(data);
        })
    },
    'findOneMatch': (teamA, teamB, callback) => {
        Match.find({
            $or: [{
                    'homeTeam': teamA,
                    'awayTeam': teamB
                },
                {
                    'homeTeam': teamB,
                    'awayTeam': teamA
                }
            ]
        }).select(-_id - __v).then(data => {
            callback(data);
        })
    },
    'findOneWinLoss': (teamName, callback) => {
        Match.find({
            $or: [{
                'homeTeam': teamName
            }, {
                'awayTeam': teamName
            }],
        }).select('-_id -__v').then(data => {
            callback(data);
        });
    }
}

let TeamFunctions = {
    'getTeamNames': (callback) => {
        Team.find().select('-_id -__v -bazaar -cargo -downfall -quarantine -suburbia -subway -tanker').then(data => {
            callback(data);
        })
    },
    'insertOneTeam': (teamName, callback) => {
        Team.find({
            "team": teamName
        }).select('-_id -__v').then(data => {
            console.log(data);
            if (data.length == 0) {
                new Team({
                    'team': teamName
                }).save().then(teamData => {

                });
            }
            callback();
        });
    },
    'findOneTeam': (teamName, callback) => {
        Team.find({
            "team": teamName
        }).select('-_id -__v').then(data => {
            callback(data);
        });
    },
    'updateOneMap': (mapData, callback) => {
        if(mapData['map'] != 'other'){
            let update = {}
            update[mapData['map'] + '.rounds.win'] = mapData['roundsWon'];
            update[mapData['map'] + '.rounds.loss'] = mapData['roundsLoss'];
            if (parseInt(mapData['roundsWon']) > parseInt(mapData['roundsLoss'])) {
                update[mapData['map'] + '.maps.win'] = 1;
                update[mapData['map'] + '.maps.loss'] = 0;
            } else {
                update[mapData['map'] + '.maps.win'] = 0;
                update[mapData['map'] + '.maps.loss'] = 1;
            }
            Team.update({
                'team': mapData['teamName']
            }, {
                $inc: update
            }).then(data => {
                if(!data['ok']) console.log(mapData)
                callback();
            })
        }else{
            callback();
        }
    }
}

module.exports = {
    MatchFunctions: MatchFunctions,
    TeamFunctions: TeamFunctions
}