const codes = require('../assets/codes');

exports.getCodeObj = (name) => {  }; // TODO

exports.generateValidationError = function (stack) {
    return {
        name: codes.AUTH.VALIDATION.name,
        status: codes.AUTH.VALIDATION.status,
        success: codes.AUTH.VALIDATION.success,
        stack: stack
    }
};