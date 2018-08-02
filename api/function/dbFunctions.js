require('../config/db');
const mongoose = require('mongoose');
const Match = require('../models/Match');

module.exports = {
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
    'findOneTeam': (teamName, callback) => {
        Match.find({
            $or: [{
                'homeTeam': teamName
            }, {
                'awayTeam': teamName
            }],
        }).select('-_id -__v').then(data => {
            callback(data);
        })
    }
}