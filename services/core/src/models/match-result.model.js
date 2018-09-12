const mongoose = require('mongoose');
const msgs = require('../assets/messages.asset');
const codes = require('../assets/codes.asset');
const enumHelper = require('northernstars-shared').enumHelper;
const enums = require('../assets/enums.asset');

const matchResultSchema = mongoose.Schema({
    match: { type: mongoose.Schema.ObjectId, ref: 'Match', required: codes.MATCH_RESULT.MATCH.REQUIRED.message },
    team: { type: mongoose.Schema.ObjectId, ref: 'Team', required: codes.MATCH_RESULT.TEAM.REQUIRED.message },
    players: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    goals: {
        scorers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
        total: { type: Number, default: 0 }
    },
    result: { type: String, enum: enumHelper.toArray(enums.MATCH.RESULT), required: codes.MATCH_RESULT.RESULT.REQUIRED.message  }

}, { timestamps: true });

/**
 * @description Exports Match Result Model
 * @author filipditrich
 * @type {Model}
 */
module.exports = mongoose.model('MatchResult', matchResultSchema);