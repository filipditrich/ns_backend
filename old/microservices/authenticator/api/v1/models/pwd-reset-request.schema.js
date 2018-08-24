const mongoose = require('mongoose');
const generators = require('../../../../../old/common/helpers/generator.helper');

const passwordResetRequest = mongoose.Schema({

    forUser: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    resetHash: { type: String }

});

passwordResetRequest.pre('save', function(next) {

    if (this.isNew) {
        generators.generateRandomUnequalDocument(64, this.constructor, 'resetHash')
            .then(hash => {
                this.resetHash = hash;
                next();
            })
            .catch(error => { next(error) })
    } else { next(); }

});

/**
 * @description Exports Password Reset Request model
 * @author filipditrich
 * @type {Model}
 */
module.exports = mongoose.model('PwdResetRequest', passwordResetRequest);