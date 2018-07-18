const mongoose = require('mongoose');
const validators = require('../../../common/helpers/validators');
const randomString = require('randomstring');

const registrationRequestSchema = mongoose.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email Address is Required',
        validate: [validators.validateEmail, 'Invalid email']
    },
    name: { type: String, required: 'Your name is required' },
    requestedOn: { type: Date, default: Date.now() },
    approval: {
        approved: { type: Boolean, default: false },
        approvedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
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
        generateRegistrationHash(this.constructor)
            .then(hash => {
                this.registration.registrationHash = hash;
                next();
            })
            .catch(error => {
                next(error);
            })
    } else {
        next();
    }

});

function generateRegistrationHash(model) {
    return new Promise((resolve, reject) => {

        const hash = randomString.generate(32);
        model.find({ 'registration.registrationHash': hash }).exec()
            .then(duplicate => {
                if (duplicate.length > 0) generateRegistrationHash(model);
                resolve(hash);
            })
            .catch(error => {
                reject(error);
            });

    });
}


module.exports = mongoose.model('RegistrationRequest', registrationRequestSchema);