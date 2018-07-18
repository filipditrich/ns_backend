const codes = require('../../../common/assets/codes');
const jwt = require('jsonwebtoken');
const config = require('../../../common/config/common');
const env = require('express')().get('env');
const RegistrationRequest = require('../models/registration-request');
const User = require('../models/user');
const codeHelper = require('../../../common/helpers/code-helper');
const _ = require('lodash');

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

exports.requestRegistration = (req, res, next) => {

    let email = req.body.email;
    let name = req.body.name;

    if (!email) return next(codes.AUTH.EMAIL.MISSING);
    if (!name) return next(codes.AUTH.NAME.MISSING);

    RegistrationRequest.findOne({ email: email }).exec()
        .then(alreadyRequested => {

            if (alreadyRequested) return next(codes.AUTH.EMAIL.ALREADY_REQUESTED);

            User.findOne({ email: email }).exec()
                .then(alreadyRegistered => {

                    if (alreadyRegistered) return next(codes.AUTH.EMAIL.IN_USE);

                    let request = new RegistrationRequest({
                        email: email,
                        name: name
                    });

                    request.save((error, saved) => {
                        if (error) {
                            if (!error.errors) return next(error);
                            let stack = {};
                            _.forEach(error.errors, (value, key) => { stack[key] = value.message });

                            return next(codeHelper.generateValidationError(stack));
                        }
                        res.json({
                            response: codes.AUTH.REGISTRATION.SUCCESS,
                            email: saved.email
                        });
                    });

                })
                .catch(error => {
                    return next(error);
                });
        })
        .catch(error => {
            return next(error);
        });
};

exports.finishRegistration = (req, res, next) => {

    let hash = req.params['registrationHash'];

    let username = req.body.username;
    let password = req.body.password;
    // TODO - more credentials

    if (!username) return next(codes.AUTH.USERNAME.MISSING);
    if (!password) return next(codes.AUTH.PASSWORD.MISSING);

    RegistrationRequest.findOne({ 'registration.registrationHash': hash }).exec()
        .then(request => {

            if (!request) return next(codes.AUTH.REGISTRATION.REQUEST.NON_EXISTENCE);
            if (!request.approval.approved) return next(codes.AUTH.REGISTRATION.REQUEST.NOT_APPROVED);
            if (request.registration.userRegistered) return next(codes.AUTH.REGISTRATION.REQUEST.USER_REGISTERED);

            User.findOne({ username: username }).exec()
                .then(userWithUsername => {
                    if (userWithUsername) return next(codes.AUTH.USERNAME.IN_USE);

                    let newUser = new User({
                        username: username,
                        password: password,
                        name: req.body.name || request.name,
                        email: request.email
                    });

                    newUser.save((error, saved) => {
                        if (error) {
                            if (!error.errors) return next(error);
                            let stack = {};
                            _.forEach(error.errors, (value, key) => { stack[key] = value.message });

                            return next(codeHelper.generateValidationError(stack));
                        }

                        request.registration.userRegistered = true;
                        request.save(err => { if (err) return next(err) });

                        res.json({
                            response: codes.AUTH.REGISTRATION.SUCCESS,
                            user: setUserInfo(saved)
                        });
                    });

                }).catch(error => {
                    return next(error);
            })

        })
        .catch(error => {
            return next(error)
        });

};












