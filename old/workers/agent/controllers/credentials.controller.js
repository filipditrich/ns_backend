const _ = require('lodash');
const codes = require('../../../common/assets/codes');
const PwdResetRequest = require('../../../../microservices/authenticator/api/v1/models/pwd-reset-request.schema');
const User = require('../models/user.model');
const codeHelper = require('../../../common/helpers/code.helper');
const mailHelper = require('../../../common/helpers/mail.helper');
const errorHelper = require('../../../common/helpers/error.helper');

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