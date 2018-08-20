const mongoose = require('mongoose');
const msgs = require('../assets/messages.asset');

const placeSchema = mongoose.Schema({

    name: { type: String, required: msgs.PLACE.REQUIRED }
    // TODO: address schema

}, { timestamps: true });

/**
 * @description Exports Place Model
 * @author filipditrich
 * @type {Model}
 */
module.exports = mongoose.model('Place', placeSchema);