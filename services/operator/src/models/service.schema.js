const mongoose = require('mongoose');
const enumHelper = require('northernstars-shared').enumHelper;
const sysEnums = require('northernstars-shared').sysEnums;

const serviceSchema = mongoose.Schema({

    id: { type: String, unique: true, required: true, lowercase: true },
    name: { type: String, unique: true, required: true },
    host: { type: String, unique: true, required: true },
    port: { type: Number, unique: true, required: true },
    environment: { type: String, enum: enumHelper.toArray(sysEnums.SYSTEM.ENVIRONMENT), default: sysEnums.SYSTEM.ENVIRONMENT.development.key },
    secret: { type: String, required: true },
    upTime: { type: Number, default: 0 }

}, { timestamps: true });

/**
 * @description Exports Service Model
 * @author filipditrich
 * @type {Model}
 */
module.exports = mongoose.model('Service', serviceSchema);