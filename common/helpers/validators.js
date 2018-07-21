const enums = require('../assets/enums');
const enumHelpers = require('../helpers/enum-helpers');
const config = require('../config/common');

/**
 * @description: Validates an inputted email
 * @param email
 * @return {boolean}
 */
exports.validateEmail = function (email) {
    return config.shared.fields.email.regExp.test(email);
};

/**
 * @description: Checks if the passed in password is strong enough
 * @param password
 * @return {boolean}
 */
exports.passwordStrength = function (password) {
    return config.shared.fields.password.regExp.test(password);
};