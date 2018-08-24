const JwtDecode = require('jwt-decode');
const sysCodes = require('../assets/system-codes.asset');

exports.getUser = function (headers) {
    return new Promise((resolve, reject) => {
        const token = headers['authorization'];

        if (!!token) { resolve(JwtDecode(token)) }
        else reject(sysCodes.HEADERS.BAD_STRUCT)
    });
};