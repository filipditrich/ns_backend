const JwtDecode = require('jwt-decode');
const sysCodes = require('../assets/system-codes.asset');
const jwt = require('jsonwebtoken');
const serverConfig = require('northernstars-shared').serverConfig;

exports.getUser = function (headers) {
    return new Promise((resolve, reject) => {
        const token = headers['authorization'];

        if (!!token) { resolve(JwtDecode(token)) }
        else reject(sysCodes.HEADERS.BAD_STRUCT)
    });
};

/**
 * @description: generates and signs new JWT token
 * @param user
 * @returns {*}
 */
exports.generateToken = (user, settings) => {
    return jwt.sign(user, serverConfig[settings.environment].token.secret, {
        expiresIn: serverConfig[settings.environment].token.ttl
    });
};

/**
 * @description: returns basic user info
 * @param request
 * @returns {{_id: *, username: *, roles: (string[]|roles|{type, default})}}
 */
exports.setUserInfo = request => {
    return {
        _id: request._id,
        username: request.username,
        email: request.email,
        name: request.name,
        roles: request.roles
    }
};