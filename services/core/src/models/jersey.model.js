const mongoose = require('mongoose');
const msgs = require('../assets/messages.asset');

const jerseySchema = mongoose.Schema({

    // TODO: rethink this
    name: { type: String, required: msgs.JERSEY.NAME.REQUIRED, unique: msgs.JERSEY.NAME.UNIQUE },
    color: { type: String },
    thumbnail: { type: String },

    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }

}, { timestamps: true });

/**
 * @description Exports Jersey Model
 * @author filipditrich
 * @type {Model}
 */
module.exports = mongoose.model('Jersey', jerseySchema);