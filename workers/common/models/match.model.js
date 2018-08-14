const mongoose = require('mongoose');
const msgs = require('../assets/messages');
const enumHelper = require('../../../common/helpers/enum.helper');
const enums = require('../assets/enums');

const matchTeamSchema = mongoose.Schema({
    team: { type: mongoose.Schema.ObjectId, ref: 'Team' },
    players: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    goals: {
        scorers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
        total: { type: Number }
    },
    result: { type: String, enum: enumHelper.toArray(enums.MATCH.RESULT) }
});

const matchSchema = mongoose.Schema({
    title: { type: String, required: msgs.MATCH.TITLE.REQUIRED },
    date: { type: Date, required: msgs.MATCH.DATE.REQUIRED },
    place: { type: mongoose.Schema.ObjectId, ref: 'Place' },
    note: { type: String },
    afterMatch: {
        teams: [ matchTeamSchema ],
        winner: { type: mongoose.Schema.ObjectId, ref: 'Team' },
    },
    cancelled: { type: Boolean, default: false },
    cancelledBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
}, { timestamps: true });

/**
 * @description Exports Match Model
 * @author filipditrich
 * @type {Model}
 */
module.exports = mongoose.model('Match', matchSchema);