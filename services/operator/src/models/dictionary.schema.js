const mongoose = require('mongoose');

const dictionarySchema = mongoose.Schema({

    id: { type: String, upperCase: true, required: true, unique: true },
    cs: { type: String, required: true },
    en: { type: String, required: true },

    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    updatedBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }

}, { timestamps: true });

/**
 * @description Exports App Info Model
 * @author filipditrich
 * @type {Model}
 */
module.exports = mongoose.model('Dictionary', dictionarySchema);