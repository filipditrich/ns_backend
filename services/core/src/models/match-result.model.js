const mongoose = require('mongoose');
const msgs = require('../assets/messages.asset');
const codes = require('../assets/codes.asset');
const enumHelper = require('northernstars-shared').enumHelper;
const enums = require('../assets/enums.asset');

const playerResultSchema = mongoose.Schema({
    player: { type: mongoose.Schema.ObjectId, ref: 'User', required: codes.RESULTS.PLAYERS.PLAYER.REQUIRED },
    jersey: { type: mongoose.Schema.ObjectId, ref: 'Jersey', required: codes.RESULTS.PLAYERS.JERSEY.REQUIRED },
    status: { type: String, enum: enumHelper.toArray(enums.MATCH.RESULT), required: codes.RESULTS.PLAYERS.STATUS.REQUIRED },
    goals: { type: Number, default: 0 }
});

const matchResultSchema = mongoose.Schema({
    match: { type: mongoose.Schema.ObjectId, ref: 'Match', required: codes.RESULTS.MATCH.REQUIRED },
    players: [ playerResultSchema ]
}, { timestamps: true });

/**
 * @description Exports Match Result Model
 * @author filipditrich
 * @type {Model}
 */
module.exports = mongoose.model('MatchResult', matchResultSchema);