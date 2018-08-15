const _ = require('lodash');
const codes = require('../../../common/assets/codes');
const jwt = require('jsonwebtoken');
const config = require('../../../common/config/common.config');
const RegistrationRequest = require('../../../../microservices/authenticator/api/v1/models/registration-request.schema');
const User = require('../models/user.model');
const env = require('../config/worker.config').environment();
const codeHelper = require('../../../common/helpers/code.helper');
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
        email: request.email,
        name: request.name,
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