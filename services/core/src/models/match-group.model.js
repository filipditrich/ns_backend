const mongoose = require('mongoose');
const codes = require('../assets/codes.asset');

const matchGroupSchema = mongoose.Schema({
    name: { type: String, required: codes.MATCH.GROUP.NAME.REQUIRED },

    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
}, { timestamps: true });

/**
 * @description Exports Match Result Model
 * @author filipditrich
 * @type {Model}
 */
module.exports = mongoose.model('MatchGroup', matchGroupSchema);