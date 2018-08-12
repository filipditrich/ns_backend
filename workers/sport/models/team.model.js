const mongoose = require('mongoose');
const validators = require('../../../common/helpers/validator.helper');
const codes = require('../../../common/assets/codes');
const msgs = require('../assets/messages');

const teamSchema = mongoose.Schema({

    name: { type: String, required: true },
    jersey: { type: mongoose.Schema.ObjectId, ref: 'Jersey', required: true }

}, { timestamps: true });

/**
 * @description Exports Team Model
 * @author filipditrich
 * @type {Model}
 */
module.exports = mongoose.model('Team', teamSchema);