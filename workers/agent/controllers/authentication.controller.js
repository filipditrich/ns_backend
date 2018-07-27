const codes = require('../../../common/assets/codes');
const jwt = require('jsonwebtoken');
const config = require('../../../common/config/common.config');
const env = require('express')().get('env');
const RegistrationRequest = require('../models/registration-request.model');
const PwdResetRequest = require('../models/pwd-reset-request.model');
const User = require('../models/user.model');
const codeHelper = require('../../../common/helpers/code.helper');
const _ = require('lodash');
const mailHelper = require('../../../common/helpers/mail.helper');
const errorHelper = require('../../../common/helpers/error.helper');

/**
 * @description: generates and signs new JWT token
 * @param user
 * @returns {*}
 */
function generateToken(user) {
    return jwt.sign(user, config[env].token.secret, {
        expiresIn: config[env].token.ttl
    });
}

/**
 * @description: returns basic user info
 * @param request
 * @returns {{_id: *, username: *, roles: (string[]|roles|{type, default})}}
 */
function setUserInfo(request) {
    return {
        _id: request._id,
        username: request.username,
        roles: request.roles
    }
}

/**
 * @description: Outputs basic user info after successful login
 * @param req
 * @param res
 * @param next
 */
exports.login = (req, res, next) => {
    let userInfo = setUserInfo(req.user);
    res.json({
        response: codes.AUTH.LOGIN.SUCCESS,
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    });
};

/**
 * @description: Requests a new registration request
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.requestRegistration = (req, res, next) => {

    let email = req.body.email;
    let name = req.body.name;

    if (!email) return next(errorHelper.prepareError(codes.AUTH.EMAIL.MISSING));
    if (!name) return next(errorHelper.prepareError(codes.AUTH.NAME.MISSING));

    RegistrationRequest.findOne({ email: email }).exec()
        .then(alreadyRequested => {

            if (alreadyRequested) return next(errorHelper.prepareError(codes.AUTH.EMAIL.ALREADY_REQUESTED));

            User.findOne({ email: email }).exec()
                .then(alreadyRegistered => {

                    if (alreadyRegistered) return next(errorHelper.prepareError(codes.AUTH.EMAIL.IN_USE));

                    let request = new RegistrationRequest({
                        email: email,
                        name: name
                    });

                    request.save((error, saved) => {
                        if (error) {
                            if (!error.errors) return next(errorHelper.prepareError(error));
                            let stack = {};
                            _.forEach(error.errors, (value, key) => { stack[key] = value.message });

                            return next(errorHelper.prepareError(codeHelper.generateValidationError(stack)));
                        }

                        mailHelper.mail('registration-requested', {
                           email: saved.email,
                           name: saved.name,
                           subject: 'Registration Request Processed!'
                        }).then(() => {
                            res.json({
                                response: codes.AUTH.REGISTRATION.SUCCESS,
                                email: saved.email
                            });
                        }).catch(error => {
                            return next(errorHelper.prepareError(error));
                        });

                    });

                })
                .catch(error => {
                    return next(errorHelper.prepareError(error));
                });
        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });
};

/**
 * @description: Checks if the request with hash is valid (due to Angular)
 * @param req
 * @param res
 * @param next
 */
exports.preFinishRegistration = (req, res, next) => {
    RegistrationRequest.findOne({ 'registration.registrationHash': req.params['hash'] }).exec()
        .then(request => {
            if (!request) return next(errorHelper.prepareError(codes.REQUEST.INVALID));
            if (!request.approval.approved) return next(errorHelper.prepareError(codes.REQUEST.INVALID));
            if (request.registration.userRegistered) return next(errorHelper.prepareError(codes.REQUEST.INVALID));
            res.json({ response: codes.REQUEST.VALID, request: request });
        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });
};

/**
 * @description: Registers a new user after his registration request approval
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.finishRegistration = (req, res, next) => {

    let hash = req.params['hash'];

    let username = req.body.username;
    let password = req.body.password;
    let name = req.body.name;
    // TODO - more credentials

    if (!username) return next(errorHelper.prepareError(codes.AUTH.USERNAME.MISSING));
    if (!password) return next(errorHelper.prepareError(codes.AUTH.PASSWORD.MISSING));

    RegistrationRequest.findOne({ 'registration.registrationHash': hash }).exec()
        .then(request => {

            if (!request) return next(errorHelper.prepareError(codes.AUTH.REGISTRATION.REQUEST.NON_EXISTENCE));
            if (!request.approval.approved) return next(errorHelper.prepareError(codes.AUTH.REGISTRATION.REQUEST.NOT_APPROVED));
            if (request.registration.userRegistered) return next(errorHelper.prepareError(codes.AUTH.REGISTRATION.REQUEST.USER_REGISTERED));

            User.findOne({ username: username }).exec()
                .then(userWithUsername => {
                    if (userWithUsername) return next(errorHelper.prepareError(codes.AUTH.USERNAME.IN_USE));

                    let newUser = new User({
                        username: username,
                        password: password,
                        name: request.name || name,
                        email: request.email
                    });

                    newUser.save((error, saved) => {
                        if (error) {
                            if (!error.errors) return next(errorHelper.prepareError(error));
                            let stack = {};
                            _.forEach(error.errors, (value, key) => { stack[key] = value.message });

                            return next(errorHelper.prepareError(codeHelper.generateValidationError(stack)));
                        }

                        request.registration.userRegistered = true;
                        request.save(err => {
                            if (err) return next(errorHelper.prepareError(err));

                            mailHelper.mail('registration-finished', {
                                email: saved.email,
                                name: saved.name,
                                username: saved.username,
                                subject: 'Registration Successful!'
                            }).then(() => {
                                res.json({
                                    response: codes.AUTH.REGISTRATION.SUCCESS,
                                    user: setUserInfo(saved)
                                });
                            }).catch(error => {
                                return next(errorHelper.prepareError(error));
                            });

                        });

                    });

                }).catch(error => {
                    return next(errorHelper.prepareError(error));
            })

        })
        .catch(error => {
            return next(errorHelper.prepareError(error))
        });

};

/**
 * @description: Requests a new password reset request if there is none already
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.requestPasswordReset = (req, res, next) => {

    let email = req.body.email,
        username = req.body.username;

    if (!email && !username) return next(errorHelper.prepareError(codes.AUTH.RESET.CREDENTIALS.MISSING));
    if (email && username) return next(errorHelper.prepareError(codes.AUTH.RESET.CREDENTIALS.TOO_MANY));

    let query = {};
    if (email) query['email'] = email;
    if (username) query['username'] = username;

    User.findOne(query).exec()
        .then(user => {

            if (!user) return next(errorHelper.prepareError(codes.AUTH.RESET.USER.NOT_FOUND));

            PwdResetRequest.findOne({ forUser: user._id }).exec()
                .then(alreadyRequested => {
                    if (alreadyRequested) return next(errorHelper.prepareError(codes.AUTH.RESET.ALREADY_MADE));

                    const newRequest = new PwdResetRequest({
                        forUser: user._id
                    });

                    newRequest.save((error, saved) => {
                        if (error) return next(errorHelper.prepareError(error));

                        mailHelper.mail('password-reset-request', {
                            email: user.email,
                            name: user.name,
                            username: user.username,
                            hash: saved.resetHash,
                            subject: 'Password reset requested!'
                        }).then(() => {
                            res.json({ response: codes.AUTH.RESET.SUCCESS });
                        }).catch(error => {
                            return next(errorHelper.prepareError(error));
                        });

                    });

                })
                .catch(error => {
                    return next(errorHelper.prepareError(error));
                })
        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        })

};

/**
 * @description check if the request is valid
 * @param req
 * @param res
 * @param next
 */
exports.preResetPassword = (req, res, next) => {

    let hash = req.params['hash'];

    PwdResetRequest.findOne({ resetHash: hash }).exec()
        .then(request => {
           if (!request) return next(errorHelper.prepareError(codes.REQUEST.INVALID));
           res.json({ response: codes.REQUEST.VALID });
        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });

};

/**
 * @description: Changes user's password
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.resetPassword = (req, res, next) => {

    let hash = req.params['hash'];
    let password = req.body.password;
    if (!password) return next(errorHelper.prepareError(codes.AUTH.PASSWORD.MISSING));

    // This needs to be done manually now, since mongoose will not
    // validate all fields again on .save()
    if (password.length > 32) return next(errorHelper.prepareError(codes.AUTH.PASSWORD.LONG));
    if (password.length < 6) return next(errorHelper.prepareError(codes.AUTH.PASSWORD.SHORT));

    PwdResetRequest.findOne({ resetHash: hash }).exec()
        .then(request => {
            if (!request) return next(errorHelper.prepareError(codes.AUTH.RESET.NOT_FOUND));

            User.findById(request.forUser).exec()
                .then(user => {
                    if (!user) return next(errorHelper.prepareError(codes.UNEXPECTED)); // shouldn't happen

                    user.comparePassword(password, (error, isMatch) => {
                        if (error) return next(error);
                        if (isMatch) return next(errorHelper.prepareError(codes.AUTH.RESET.SAME_PASSWORD));

                        user.password = password;
                        user.save((error, saved) => {
                            if (error) {
                                if (!error.errors) return next(errorHelper.prepareError(error));
                                let stack = {};
                                _.forEach(error.errors, (value, key) => { stack[key] = value.message });

                                return next(errorHelper.prepareError(codeHelper.generateValidationError(stack)));
                            }
                            request.remove(error => {
                                if (error) return next(errorHelper.prepareError(error));
                                res.json({ response: codes.AUTH.RESET.SUCCESS });
                            });
                        });

                    });

                })
                .catch(error => {
                    return next(errorHelper.prepareError(error));
                })

        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        })

};


/**
 * @description: Sends email to user that is associated with the inputted email
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.forgotUsername = (req, res, next) => {

    let email = req.body.email;
    if (!email) return next(errorHelper.prepareError(codes.AUTH.EMAIL.MISSING));

    User.findOne({ email: email }).exec()
        .then(user => {
            if (!user) return next(errorHelper.prepareError(codes.AUTH.EMAIL.NOT_FOUND));

            mailHelper.mail('forgotten-username', {
                email: user.email,
                name: user.name,
                username: user.username,
                subject: 'Did you forgot your username?'
            }).then(() => {
                res.json({ response: codes.AUTH.RESET.MAILING.SENT });
            }).catch(error => {
                return next(errorHelper.prepareError(error));
            });

        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        })

};









