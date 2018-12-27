const mongoose = require('mongoose');
const msgs = require('../assets/messages.asset');
const codes = require('../assets/codes.asset');
const enumHelper = require('northernstars-shared').enumHelper;
const enums = require('../assets/enums.asset');
const moment = require('moment');

const matchEnrollmentPlayersSchema = mongoose.Schema({
    player: { type: mongoose.Schema.ObjectId, ref: 'User', required: codes.MATCH.ENROLLMENT.PLAYERS.PLAYER.REQUIRED.message },
    enrolledOn: { type: Date, default: Date.now },
    status: { type: String, enum: enumHelper.toArray(enums.MATCH.ENROLL_STATUS), required: codes.MATCH.ENROLLMENT.PLAYERS.STATUS.REQUIRED.message }
});

const matchSchema = mongoose.Schema({
    title: { type: String, required: codes.MATCH.TITLE.REQUIRED.message },
    date: { type: Date, required: codes.MATCH.DATE.REQUIRED.message },
    reminderDate: { type: Date },
    hasBeenReminded: { type: Boolean, default: false },
    place: { type: mongoose.Schema.ObjectId, ref: 'Place', required: codes.PLACE.REQUIRED.message },
    note: { type: String },

    enrollment: {
        players: [ matchEnrollmentPlayersSchema ],
        enrollmentOpens: { type: Date, default: Date.now },
        enrollmentCloses: { type: Date },
        maxCapacity: { type: Number, required: codes.MATCH.ENROLLMENT.MAX_CAP.REQUIRED },
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
    this.reminderDate = moment(this.get('date')).subtract(2, 'days');
    next();
});

/**
 * @description Exports Match Model
 * @author filipditrich
 * @type {Model}
 */
module.exports = mongoose.model('Match', matchSchema);