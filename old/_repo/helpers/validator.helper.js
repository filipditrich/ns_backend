const schemaFields = require('../assets/schema-fields.asset');

/**
 * @description: Validates an inputted email
 * @param email
 * @return {boolean}
 */
exports.validateEmail = function (email) {
    return schemaFields.EMAIL.REG_EXP.test(email);
};

/**
 * @description: Checks if the passed in password is strong enough
 * @param password
 * @return {boolean}
 */
exports.passwordStrength = function (password) {
    return schemaFields.PASSWORD.REG_EXP.test(password);
};