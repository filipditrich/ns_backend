const codes = require('../assets/codes');

exports.getCodeObj = (name) => {  }; // TODO

/**
 * @description: Generates a validation error
 * @param stack
 * @returns {{name: string, status: number, success: boolean, stack: *}}
 */
exports.generateValidationError = function (stack) {
    return {
        name: codes.AUTH.VALIDATION.name,
        status: codes.AUTH.VALIDATION.status,
        success: codes.AUTH.VALIDATION.success,
        stack: stack
    }
};