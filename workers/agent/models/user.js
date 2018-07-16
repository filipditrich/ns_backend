const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validators = require('../../../common/helpers/validators');
const enumHelpers = require('../../../common/helpers/enum-helpers');
const enums = require('../../../common/assets/enums');

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email Address is Required',
        validate: [validators.validateEmail, 'Invalid email']
    },
    roles: {
        type: [{ type: String, enum: enumHelpers.toArray(enums.AUTH.ROLES) }],
        default: enums.AUTH.ROLES.player.key
    }
}, { timestamps: true });

userSchema.pre('save', function (next) {
   if (!this.isModified('password')) return next();
   bcrypt.genSalt(10, (error, salt) => {
      if (error) return next(error);
      bcrypt.hash(this.password, salt, (error, hash) => {
         if (error) return next(error);
         this.password = hash;
         next();
      });
   });
});

userSchema.methods.comparePassword = function (candidate, callback) {
  bcrypt.compare(candidate, this.password, function (error, isMatch) {
      if (error) return callback(error);
      callback(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);