const mongoose = require('mongoose');
const codes = require('../assets/codes.asset');
const enumHelper = require('northernstars-shared').enumHelper;
const enums = require('../assets/enums.asset');

/**
 * Match Enrollment Players Schema
 */
const matchEnrollmentPlayersSchema = new mongoose.Schema({
    player: { type: mongoose.Schema.ObjectId, ref: 'User', required: codes.MATCH.ENROLLMENT.PLAYERS.PLAYER.REQUIRED.message },
    enrolledOn: { type: Date, default: Date.now },
    status: { type: String, enum: enumHelper.toArray(enums.MATCH.ENROLL_STATUS), required: codes.MATCH.ENROLLMENT.PLAYERS.STATUS.REQUIRED.message }
});

/**
 * Match Schema
 */
const matchSchema = new mongoose.Schema({
    title: { type: String, required: codes.MATCH.TITLE.REQUIRED.message },
    date: { type: Date, required: codes.MATCH.DATE.REQUIRED.message },
    place: { type: mongoose.Schema.ObjectId, ref: 'Place', required: codes.PLACE.REQUIRED.message },
    note: { type: String },

    enrollment: {
        players: [ matchEnrollmentPlayersSchema ],
        enrollmentOpens: { type: Date, default: Date.now },
        enrollmentCloses: { type: Date },
        maxCapacity: { type: Number, required: codes.MATCH.ENROLLMENT.MAX_CAP.REQUIRED },
    },

    reminder: {
        reminderDate: { type: Date },
        reminderTeams: [
            { type: mongoose.Schema.ObjectId, ref: 'Team' }
        ],
        remind: { type: Boolean, default: false },
        hasBeenReminded: { type: Boolean, default: false },
    },

    group: { type: mongoose.Schema.ObjectId, ref: 'Group', required: codes.MATCH.GROUP.REQUIRED },

    results: { type: Object }, // unnecessary

    cancelled: { type: Boolean, default: false },
    cancelledBy: { type: mongoose.Schema.ObjectId, ref: 'User' },

    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
}, { timestamps: true });

/**
 * @description Sets default values
 */
matchSchema.pre('save', function(next) {
    if (!this.enrollment.enrollmentCloses) {
        this.enrollment.enrollmentCloses = this.get('date');
    }
    // if reminderDate is not set, then do not remind anyone at all
    if (!this.reminder.reminderDate) {
        this.reminder.hasBeenReminded = false;
        this.reminder.remind = false;
    } else {
        this.reminder.hasBeenReminded = false;
        this.reminder.remind = true;
    }
    next();
});

/**
 * @description Exports Match Model
 * @author filipditrich
 * @type {Model}
 */
module.exports = mongoose.model('Match', matchSchema);