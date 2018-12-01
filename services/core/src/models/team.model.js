const mongoose = require('mongoose');
const msgs = require('../assets/messages.asset');

const teamSchema = mongoose.Schema({

    name: { type: String, required: msgs.TEAM.NAME.REQUIRED, unique: msgs.TEAM.NAME.UNIQUE },
    // jersey: { type: mongoose.Schema.ObjectId, ref: 'Jersey', required: msgs.TEAM.JERSEY.REQUIRED },

    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }

}, { timestamps: true });

/**
 * @description Exports Team Model
 * @author filipditrich
 * @type {Model}
 */
module.exports = mongoose.model('Team', teamSchema);