const mongoose = require('mongoose');
const msgs = require('../assets/messages.asset');
const codes = require('../assets/codes.asset');
const enumHelper = require('northernstars-shared').enumHelper;
const enums = require('../assets/enums.asset');

const matchEnrollmentPlayersSchema = mongoose.Schema({
    player: { type: mongoose.Schema.ObjectId, ref: 'User', required: codes.MATCH.ENROLLMENT.PLAYERS.PLAYER.REQUIRED.message },
    name: {type: String, ref: 'User', required: codes.MATCH.ENROLLMENT.PLAYERS.PLAYER.REQUIRED.message},
    enrolledOn: { type: Date, default: Date.now },
    status: { type: String, enum: enumHelper.toArray(enums.MATCH.ENROLL_STATUS), required: codes.MATCH.ENROLLMENT.PLAYERS.STATUS.REQUIRED.message }
});

const writeResultPlayerSchema = mongoose.Schema({
    player: { type: mongoose.Schema.ObjectId, ref: 'User', required: codes.MATCH.ENROLLMENT.PLAYERS.PLAYER.REQUIRED.message },
    jersey: { type: String, required:codes.JERSEY.REQUIRED },
    status: { type: String, enum: enumHelper.toArray(enums.MATCH.RESULT), required: codes.MATCH.ENROLLMENT.PLAYERS.STATUS.REQUIRED.message }
})

const matchSchema = mongoose.Schema({
    title: { type: String, required: codes.MATCH.TITLE.REQUIRED.message },
    date: { type: Date, required: codes.MATCH.DATE.REQUIRED.message },
    place: { type: String, required: codes.PLACE.REQUIRED.message },
    note: { type: String },
    //do place: , ref: 'Place',

    enrollment: {
        players: [ matchEnrollmentPlayersSchema ],
        enrollmentOpens: { type: Date, default: Date.now },
    },

    //do enrollment: enrollmentCloses: { type: Date, required: codes.MATCH.ENROLLMENT.CLOSES.REQUIRED.message },
    afterMatch: [writeResultPlayerSchema],
    cancelled: { type: Boolean, default: false },
    cancelledBy: { type: mongoose.Schema.ObjectId, ref: 'User' },

    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
}, { timestamps: true });

/**
 * @description Exports Match Model
 * @author filipditrich
 * @type {Model}
 */
module.exports = mongoose.model('Match', matchSchema);