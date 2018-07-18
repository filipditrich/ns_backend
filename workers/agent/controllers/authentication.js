const codes = require('../../../common/assets/codes');
const jwt = require('jsonwebtoken');
const config = require('../../../common/config/common');
const env = require('express')().get('env');
const RegistrationRequest = require('../models/registration-request');
const PwdResetRequest = require('../models/pwd-reset-request');
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

exports.requestPasswordReset = (req, res, next) => {

    let email = req.body.email,
        username = req.body.username;

    if (!email && !username) return next(codes.AUTH.RESET.CREDENTIALS.MISSING);
    if (email && username) return next(codes.AUTH.RESET.CREDENTIALS.TOO_MANY);

    let query = {};
    if (email) query['email'] = email;
    if (username) query['username'] = username;

    User.findOne(query).exec()
        .then(user => {

            if (!user) return next(codes.AUTH.RESET.USER.NOT_FOUND)

            PwdResetRequest.findOne({ forUser: user._id }).exec()
                .then(alreadyRequested => {
                    if (alreadyRequested) return next(codes.AUTH.RESET.ALREADY_MADE);

                    const newRequest = new PwdResetRequest({
                        forUser: user._id
                    });

                    newRequest.save((error, saved) => {
                        if (error) return next(error);
                        res.json(saved);
                    })

                })
                .catch(error => {
                    return next(error);
                })
        })
        .catch(error => {
            return next(error);
        })

};

exports.resetPassword = (req, res, next) => {

    let hash = req.params['resetHash'];
    let password = req.body.password;
    if (!password) return next(codes.AUTH.PASSWORD.MISSING);

    // This needs to be done manually now, since mongoose will not
    // validate all fields again on .save()
    if (password.length > 32) return next(codes.AUTH.PASSWORD.LONG);
    if (password.length < 6) return next(codes.AUTH.PASSWORD.SHORT);

    PwdResetRequest.findOne({ resetHash: hash }).exec()
        .then(request => {
            if (!request) return next(codes.AUTH.RESET.NOT_FOUND);

            User.findById(request.forUser).exec()
                .then(user => {
                    if (!user) return next(codes.UNEXPECTED); // shouldn't happen

                    user.password = password;
                    user.save((error, saved) => {
                        if (error) {
                            if (!error.errors) return next(error);
                            let stack = {};
                            _.forEach(error.errors, (value, key) => { stack[key] = value.message });

                            return next(codeHelper.generateValidationError(stack));
                        }
                        request.remove(error => {
                            if (error) return next(error);
                            res.json(saved);
                        });
                    })

                })
                .catch(error => {
                    return next(error);
                })

        })
        .catch(error => {
            return next(error);
        })

};

exports.forgotUsername = (req, res, next) => {

    let email = req.body.email;
    if (!email) return next(codes.AUTH.EMAIL.MISSING);

    User.findOne({ email: email }).exec()
        .then(user => {
            if (!user) return next(codes.AUTH.EMAIL.NOT_FOUND);

            // TODO - send mail with username
            // ...

            res.json({ result: codes.AUTH.RESET.MAILING.SENT });

        })
        .catch(error => {
            return next(error);
        })

};









