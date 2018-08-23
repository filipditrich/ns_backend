const mongoose = require('mongoose');
const validators = require('northernstars-shared').validatorHelper;
const generators = require('northernstars-shared').baseGenerator;
const sysCodes = require('northernstars-shared').sysCodes;

const registrationRequestSchema = mongoose.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: sysCodes.AUTH.EMAIL.MISSING.name,
        validate: [validators.validateEmail, sysCodes.AUTH.EMAIL.INVALID.name]
    },
    name: {
        type: String
    },
    requestedOn: { type: Date, default: Date.now() },
    approval: {
        approved: { type: Boolean, default: false },
        approvedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
        approvedByUser: { type: String },
        approvedOn: { type: Date }
    },
    registration: {
        registrationHash: { type: String },
        userRegistered: { type: Boolean, default: false },
        user: { type: mongoose.Schema.ObjectId, ref: 'User' }
    }
});

registrationRequestSchema.pre('save', function(next) {

    if (this.isNew) {
        generators.generateRandomUnequalDocument(64, this.constructor, 'registration.registrationHash')
            .then(hash => {
                this.registration.registrationHash = hash;
                next();
            })
            .catch(error => { next(error) })
    } else { next() }

});

/**
 * @description Exports Registration Request model
 * @author filipditrich
 * @type {Model}
 */
module.exports = mongoose.model('RegistrationRequest', registrationRequestSchema);