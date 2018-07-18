const mongoose = require('mongoose');
const validators = require('../../../common/helpers/validators');
const randomString = require('randomstring');
const generators = require('../../../common/helpers/generators');

const passwordResetRequest = mongoose.Schema({

    forUser: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    resetHash: { type: String }

});

passwordResetRequest.pre('save', function(next) {

    if (this.isNew) {
        generators.generateRandomUnequalDocument(32, this.constructor, 'resetHash')
            .then(hash => {
                this.resetHash = hash;
                next();
            })
            .catch(error => { next(error) })
    } else { next(); }

});

module.exports = mongoose.model('PwdResetRequest', passwordResetRequest);