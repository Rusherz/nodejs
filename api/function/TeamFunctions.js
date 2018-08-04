let db = require('../config/db');
/* const mongoose = require('mongoose');
const Team = require('../models/Team'); */

let TeamFunctions = {
    'getTeamNames': (callback) => {
        db.find({
            database: 'matches',
            collection: 'teams',
            query: {},
            filters: {
                team: 1
            }
        }, function(data){
            callback(data);
        })
    },
    'insertOneTeam': (teamName, callback) => {
        db.find({
            database: 'matches',
            collection: 'teams',
            query: {
                "team": teamName
            },
            filters: {}
        }, function (data) {
            if (data.length == 0) {
                Team['team'] = teamName;
                db.insertOne({
                    database: 'matches',
                    collection: 'teams',
                    query: {},
                    filters: {}
                }, Team, function(result){
                    callback();
                })
            }
        });
    },
    'findAllTeams': (callback) => {
        db.find({
            database: 'matches',
            collection: 'teams',
            query: {},
            filters: {
                _id: 0,
                __v: 0
            }
        }, function (data) {
            callback(data);
        });
    },
    'findOneTeam': (teamName, callback) => {
        db.findOne({
            database: 'matches',
            collection: 'teams',
            query: {
                "team": teamName
            },
            filters: {}
        }, function (data) {
            callback(data);
        });
    },
    'findTwoTeams': (teamNames, callback) => {
        db.find({
            database: 'matches',
            collection: 'teams',
            query: {
                $or: [{
                    'team': teamNames[0]
                },
                {
                    'team': teamNames[1]
                }
                ]
            },
            filters: {
                _id: 0,
                __v: 0
            }
        }, function (data) {
            callback(data);
        });
    },
    'updateOneMap': (mapData, callback) => {
        if (mapData['map'] != 'other') {
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
            db.updateOne({
                database: 'matches',
                collection: 'teams',
                query: {
                    'date': match['date'],
                    'homeTeam': match['homeTeam'],
                    'awayTeam': match['awayTeam']
                },
                filters: {}
            }, {
                    $inc: update
                }, function (data) {
                    callback();
                })
        } else {
            callback();
        }
    }
}

let Team = {
    team: '',
    bazaar: {
        maps: {
            win: 0,
            loss: 0
        },
        rounds: {
            win: 0,
            loss: 0
        }
    },
    cargo: {
        maps: {
            win: 0,
            loss: 0
        },
        rounds: {
            win: 0,
            loss: 0
        }
    },
    downfall: {
        maps: {
            win: 0,
            loss: 0
        },
        rounds: {
            win: 0,
            loss: 0
        }
    },
    quarantine: {
        maps: {
            win: 0,
            loss: 0
        },
        rounds: {
            win: 0,
            loss: 0
        }
    },
    suburbia: {
        maps: {
            win: 0,
            loss: 0
        },
        rounds: {
            win: 0,
            loss: 0
        }
    },
    subway: {
        maps: {
            win: 0,
            loss: 0
        },
        rounds: {
            win: 0,
            loss: 0
        }
    },
    tanker: {
        maps: {
            win: 0,
            loss:  0
        },
        rounds: {
            win: 0,
            loss:  0
        }
    }

}








module.exports = TeamFunctions;