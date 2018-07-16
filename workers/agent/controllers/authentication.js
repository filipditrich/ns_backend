const codes = require('../../../common/assets/codes');
const jwt = require('jsonwebtoken');
const config = require('../../../common/config/common');
const env = require('express')().get('env');

function generateToken(user) {
    return jwt.sign(user, config[env].token.secret, {
        expiresIn: config[env].token.ttl
    });
}

function setUserInfo(request) {
    return {
        _id: request._id,
        username: request.username,
        roles: request.roles
    }
}

exports.login = (req, res, next) => {
    let userInfo = setUserInfo(req.user);
    res.json({
        response: codes.AUTH.LOGIN.SUCCESS,
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    });
};