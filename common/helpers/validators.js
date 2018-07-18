const enums = require('../assets/enums');
const enumHelpers = require('../helpers/enum-helpers');

module.exports.validateEmail = function (email) {
    let regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(email);
};

module.exports.passwordStrength = function (password) {
    return /^(?=.*\d)(?=.*[a-zA-Z0-9]).*$/.test(password);
};