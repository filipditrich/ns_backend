const mongoose = require('mongoose');
const validators = require('../../../common/helpers/validator.helper');
const generators = require('../../../common/helpers/generator.helper');
const codes = require('../../../common/assets/codes');

const registrationRequestSchema = mongoose.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: codes.AUTH.EMAIL.MISSING.name,
        validate: [validators.validateEmail, codes.AUTH.EMAIL.INVALID.name]
    },
    name: {
        type: String,
        required: codes.AUTH.NAME.MISSING
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
        generators.generateRandomUnequalDocument(32, this.constructor, 'registration.registrationHash')
            .then(hash => {
                this.registration.registrationHash = hash;
                next();
            })
            .catch(error => { next(error) })
    } else { next() }

});


module.exports = mongoose.model('RegistrationRequest', registrationRequestSchema);