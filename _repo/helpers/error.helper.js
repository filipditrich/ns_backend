const codes = require('../assets/system-codes.asset');

/**
 * @description: Returns a new error based on the input
 * @param input
 * @returns {Error}
 */
exports.prepareError = function (input) {
    let error = new Error();

    error.name = input ? input.name : codes.UNDEFINED.name;
    error.status = input ? input.status : codes.UNDEFINED.status;
    error.message = input ? input.message || null : codes.UNDEFINED.message;
    error.success = input ? input.success || false : codes.UNDEFINED.success;

    return error;
};