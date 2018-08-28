const mongoose = require('mongoose');
const enumHelper = require('northernstars-shared').enumHelper;
const sysEnums = require('northernstars-shared').sysEnums;

const serviceSchema = mongoose.Schema({

    id: { type: String, unique: true, required: true, lowercase: true },
    name: { type: String, unique: true, required: true },
    port: { type: Number, unique: true, required: true },
    environment: { type: String, enum: enumHelper.toArray(sysEnums.SYSTEM.ENVIRONMENT), default: sysEnums.SYSTEM.ENVIRONMENT.development.key },
    db: {
        url: { type: String, default: 'mongodb://localhost:27017' },
        name: { type: String, unique: true, required: true }
    },
    isOnline: { type: Boolean, default: true }

}, { timestamps: true });

/**
 * @description Exports Service Model
 * @author filipditrich
 * @type {Model}
 */
module.exports = mongoose.model('Service', serviceSchema);