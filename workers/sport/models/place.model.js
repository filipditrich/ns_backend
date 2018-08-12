const mongoose = require('mongoose');
const validators = require('../../../common/helpers/validator.helper');
const codes = require('../../../common/assets/codes');
const msgs = require('../assets/messages');

const placeSchema = mongoose.Schema({

    name: { type: String, required: true }
    // TODO: address schema

}, { timestamps: true });

/**
 * @description Exports Place Model
 * @author filipditrich
 * @type {Model}
 */
module.exports = mongoose.model('Place', placeSchema);