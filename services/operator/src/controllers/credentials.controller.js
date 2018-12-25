const _ = require('lodash');
const codes = require('../assets/codes.asset');
const PwdResetRequest = require('../models/pwd-reset-request.schema');
const User = require('../models/user.schema');
const sysCodes = require('northernstars-shared').sysCodes;
const codeHelper = require('northernstars-shared').codeHelper;
const mailHelper = require('northernstars-shared').mailHelper;
const errorHelper = require('northernstars-shared').errorHelper;
const schemaFields = require('northernstars-shared').schemaFields;
const iV = require('northernstars-shared').validatorHelper.inputValidator;

/**
 * @description: Requests a new password reset request if there is none already
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.requestPasswordReset = (req, res, next) => {

    const input = req.body['input'];
    if (!input) return next(errorHelper.prepareError(sysCodes.REQUEST.INVALID));
    const email = input.email, username = input.username;

    if (!email && !username) return next(errorHelper.prepareError(codes.RESET.CREDENTIALS.MISSING));
    if (email && username) return next(errorHelper.prepareError(codes.RESET.CREDENTIALS.TOO_MANY));

    let query = {};
    if (email) query['email'] = email;
    if (username) query['username'] = username;

    User.findOne(query).exec()
        .then(user => {
            if (!user) return next(errorHelper.prepareError(codes.RESET.USER.NOT_FOUND));

            PwdResetRequest.findOne({ forUser: user._id }).exec()
                .then(alreadyRequested => {
                    if (alreadyRequested) return next(errorHelper.prepareError(codes.RESET.ALREADY_MADE));

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
                            res.json({ response: codes.RESET.SUCCESS });
                        }).catch(error => next(errorHelper.prepareError(error)));
                    });
                }).catch(error => next(errorHelper.prepareError(error)));
        }).catch(error => next(errorHelper.prepareError(error)));

};

/**
 * @description: Changes user's password
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.resetPassword = (req, res, next) => {

    const hash = req.params['hash'];
    const input = req.body['input'];
    if (!input) return next(errorHelper.prepareError(sysCodes.REQUEST.INVALID));

    // This needs to be done manually now, since mongoose will not
    // validate all fields again on .save()
    const validators = [{ field: 'password', rules: { required: true,
            minLength: schemaFields.PASSWORD.MIN_LENGTH,
            maxLength: schemaFields.PASSWORD.MAX_LENGTH,
            regExp: schemaFields.PASSWORD.REG_EXP
        }
    }];
    const validation = iV.validate(input, validators);
    if (!validation.success) return next(errorHelper.prepareError(validation));

    const password = input.password;

    PwdResetRequest.findOne({ resetHash: hash }).exec()
        .then(request => {
            if (!request) return next(errorHelper.prepareError(codes.RESET.NOT_FOUND));

            User.findById(request.forUser).exec()
                .then(user => {
                    if (!user) return next(errorHelper.prepareError(sysCodes.UNEXPECTED)); // shouldn't happen

                    user.comparePassword(password, (error, isMatch) => {
                        if (error) return next(error);
                        if (isMatch) return next(errorHelper.prepareError(codes.RESET.SAME_PASSWORD));

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
                                res.json({ response: codes.RESET.SUCCESS });
                            });
                        });
                    });
                }).catch(error => next(errorHelper.prepareError(error)));
        }).catch(error => next(errorHelper.prepareError(error)));

};


/**
 * @description: Sends email to user that is associated with the inputted email
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.forgotUsername = (req, res, next) => {

    const input = req.body['input'];
    if (!input) return next(errorHelper.prepareError(sysCodes.REQUEST.INVALID));

    // validation
    const validators = [{ field: 'email', rules: { required: true } }];
    const validation = iV.validate(input, validators);
    if (!validation.success) return next(errorHelper.prepareError(validation));

    const email = input.email;

    User.findOne({ email: email }).exec()
        .then(user => {
            if (!user) return next(errorHelper.prepareError(codes.EMAIL.NOT_FOUND));

            mailHelper.mail('forgotten-username', {
                email: user.email,
                name: user.name,
                username: user.username,
                subject: 'Did you forgot your username?'
            }).then(() => {
                res.json({ response: sysCodes.MAILING.SENT });
            }).catch(error => next(errorHelper.prepareError(error)));
        }).catch(error => next(errorHelper.prepareError(error)));

};