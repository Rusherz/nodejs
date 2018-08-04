const db = require('../config/db');/* 
const mongoose = require('mongoose');
const Match = require('../models/Match'); */
const date_id = "5b64ba4fe0e7bdff24546a46";

let MatchFunctions = {
    'insertOneMatch': (match, callback) => {
        db.find({
            database: 'matches',
            collection: 'matches',
            query: {
                'date': match['date'],
                'homeTeam': match['homeTeam'],
                'awayTeam': match['awayTeam']
            },
            filters: {}
        }, function (data) {
            if (data.length == 0) {
                db.insertOne({
                    database: 'matches',
                    collection: 'matches',
                    query: {},
                    filters: {}
                }, match, function () {
                    callback(true);
                })
            } else {
                callback(false);
            }
        });
    },
    'updateLastDate': (callback) => {
        db.updateOne({
            database: 'matches',
            collection: 'matches',
            query: {
                type: "date"
            },
            filters: {
                _id: 0,
                __v: 0
            }
        }, {
                $set: {
                    DATE: new Date().toUTCString()
                }
            }, function (data) {
                callback(data);
            })
    },
    'getLastUpdated': (callback) => {
        db.findOne({
            database: 'matches',
            collection: 'matches',
            query: {
                type: "date"
            },
            filters: {
                _id: 0,
                __v: 0
            }
        }, function (data) {
            callback(data);
        })
    },
    'findAllMatches': (callback) => {
        db.find({
            database: 'matches',
            collection: 'matches',
            query: {},
            filters: {
                _id: 0,
                __v: 0
            }
        }, function (data) {
            callback(data);
        })
    },
    'fineOneTeamMatches': (teamName, callback) => {
        db.find('matches', 'matches', {
            $or: [{
                'homeTeam': teamName
            }, {
                'awayTeam': teamName
            }]
        }, {}, function (data) {
            callback(data);
        });
    },
    'findOneMatch': (teamA, teamB, callback) => {
        db.find('matches', 'matches', {
            $or: [{
                'homeTeam': teamA,
                'awayTeam': teamB
            },
            {
                'homeTeam': teamB,
                'awayTeam': teamA
            }
            ]
        }, {
                _id: 0,
                __v: 0
            }, function (data) {
                callback(data);
            });
    }
}

module.exports = MatchFunctions;