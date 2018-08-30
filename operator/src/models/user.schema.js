const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schemaFields = require('northernstars-shared').schemaFields;
const validators = require('northernstars-shared').validatorHelper;
const enumHelper = require('northernstars-shared').enumHelper;
const sysEnums = require('northernstars-shared').sysEnums;
const codes = require('../assets/codes.asset');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: codes.NAME.REQUIRED.message
    },
    username: {
        type: String,
        required: codes.USERNAME.REQUIRED.message,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: codes.PASSWORD.REQUIRED.message,
        minLength: [schemaFields.PASSWORD.MIN_LENGTH, codes.PASSWORD.MIN_LENGTH.message],
        maxLength: [schemaFields.PASSWORD.MAX_LENGTH, codes.PASSWORD.MAX_LENGTH.message],
        validate: [validators.passwordStrength, codes.PASSWORD.WEAK.message]
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: codes.EMAIL.REQUIRED.message,
        validate: [validators.validateEmail, codes.EMAIL.INVALID.message]
    },
    roles: {
        type: [{ type: String, enum: enumHelper.toArray(sysEnums.AUTH.ROLES) }],
        default: sysEnums.AUTH.ROLES.player.key
    },
    team: {
        type: String, enum: enumHelper.toArray(sysEnums.AUTH.TEAM), default: sysEnums.AUTH.TEAM.ns.key
    }
}, { timestamps: true });

/**
 * @description Hashes the password before saving
 */
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

/**
 * @description Compares Passwords
 * @param candidate
 * @param callback
 */
userSchema.methods.comparePassword = function (candidate, callback) {
    bcrypt.compare(candidate, this.password)
        .then(isMatch => {
            callback(null, isMatch);
        })
        .catch(error => { callback(error) });
};

/**
 * @description Exports User Model
 * @author filipditrich
 * @type {Model}
 */
module.exports = mongoose.model('User', userSchema);