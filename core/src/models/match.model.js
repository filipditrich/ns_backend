const mongoose = require('mongoose');
const msgs = require('../assets/messages.asset');
const codes = require('../assets/codes.asset');
const enumHelper = require('northernstars-shared').enumHelper;
const enums = require('../assets/enums.asset');

// TODO: make this more complex (e.g. 'required' on some fields etc.)

const matchEnrollmentPlayersSchema = mongoose.Schema({
    player: { type: mongoose.Schema.ObjectId, ref: 'User' },
    enrolledOn: { type: Date },
    status: { type: String, enum: enumHelper.toArray(enums.MATCH.ENROLL_STATUS) }
});

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
    title: { type: String, required: codes.MATCH.TITLE.REQUIRED.message },
    date: { type: Date, required: msgs.MATCH.DATE.REQUIRED },
    place: { type: mongoose.Schema.ObjectId, ref: 'Place' },
    note: { type: String },
    enrollment: {
        players: [ matchEnrollmentPlayersSchema ],
        enrollmentOpens: { type: Date, default: Date.now },
        enrollmentCloses: { type: Date, required: msgs.MATCH },
    },
    afterMatch: {
        teams: [ matchTeamSchema ],
        winner: { type: mongoose.Schema.ObjectId, ref: 'Team' },
    },
    cancelled: { type: Boolean, default: false },
    cancelledBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    cancelledByUser: { type: String },
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
}, { timestamps: true });

/**
 * @description Exports Match Model
 * @author filipditrich
 * @type {Model}
 */
module.exports = mongoose.model('Match', matchSchema);