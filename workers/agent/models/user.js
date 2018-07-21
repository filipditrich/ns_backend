const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validators = require('../../../common/helpers/validators');
const enumHelpers = require('../../../common/helpers/enum-helpers');
const enums = require('../../../common/assets/enums');
const codes = require('../../../common/assets/codes');
const config = require('../../../common/config/common');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: codes.AUTH.NAME.MISSING
    },
    username: {
        type: String,
        required: codes.AUTH.USERNAME.MISSING.name,
        unique: true,
        lowercase: config.shared.fields.username.lowercase
    },
    password: {
        type: String,
        required: codes.AUTH.PASSWORD.MISSING.name,
        minLength: [config.shared.fields.password.minLength, codes.AUTH.PASSWORD.SHORT.name],
        maxLength: [config.shared.fields.password.maxLength, codes.AUTH.PASSWORD.LONG.name],
        validate: [validators.passwordStrength, codes.AUTH.PASSWORD.WEAK.name]
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: codes.AUTH.EMAIL.MISSING.name,
        validate: [validators.validateEmail, codes.AUTH.EMAIL.INVALID.name]
    },
    roles: {
        type: [{ type: String, enum: enumHelpers.toArray(enums.AUTH.ROLES) }],
        default: enums.AUTH.ROLES.player.key
    }
}, { timestamps: true });

// TODO - rewrite fncs with bcrypt to promsises

userSchema.pre('save', function (next) {
   if (!this.isModified('password')) return next();
   bcrypt.genSalt(10)
       .then(salt => {
           bcrypt.hash(this.password, salt)
               .then(hash => {
                   this.password = hash;
                   next();
               })
               .catch(error => { return next(error) });
       }).catch(error => { return next(error) })
});

userSchema.methods.comparePassword = function (candidate, callback) {
    bcrypt.compare(candidate, this.password)
        .then(isMatch => {
            callback(null, isMatch);
        })
        .catch(error => { return next(error) });
};

module.exports = mongoose.model('User', userSchema);