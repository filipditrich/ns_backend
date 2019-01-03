const mongoose = require('mongoose');

const appInfoSchema = mongoose.Schema({

    id: { type: String, upperCase: true, required: true, unique: true },
    value: { type: String, required: true }

}, { timestamps: true });

/**
 * @description Exports App Info Model
 * @author filipditrich
 * @type {Model}
 */
module.exports = mongoose.model('AppInfo', appInfoSchema);