const _ = require('lodash');
const codes = require('../assets/codes.asset');
const sysCodes = require('northernstars-shared').sysCodes;
const RegistrationRequest = require('../models/registration-request.schema');
const User = require('../models/user.schema');
const codeHelper = require('northernstars-shared').codeHelper;
const service = require('../config/settings.config');
const formatDates = require('northernstars-shared').dateHelper.formatDates;
const mailHelper = require('northernstars-shared').mailHelper;
const errorHelper = require('northernstars-shared').errorHelper;
const userHelper = require('northernstars-shared').userHelper;
const iV = require('northernstars-shared').validatorHelper.inputValidator;

/**
 * @description Send invitation emails to the recipients list
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
exports.sendInvites = (req, res, next) => {

    let emails = req.body['input'];
    if (!emails) return next(errorHelper.prepareError(codes.REGISTRATION.INVITATION.MISSING_EMAILS));

    let recipients = [];
    if (!Array.isArray(emails)) { recipients.push(emails); } else { recipients = emails }
    const sent = [], unsent = [], promises = [];

    _.each(recipients, recipient => {

        promises.push(
            new Promise((resolve, reject) => {
                User.findOne({ email: recipient }).exec()
                    .then(user => {
                        if (user) {
                            unsent.push({ email: recipient, reason: 'USER_ALREADY_REGISTERED' });
                            resolve();
                        } else {
                            RegistrationRequest.findOne({ email: recipient }).exec()
                                .then(request => {
                                    if (request) {
                                        if (!request.approval.approved) {
                                            req.body['input'] = { id: request._id, state: true };
                                            exports.requestApproval(req, res, next, true).then(() => {
                                                console.log("RESOLVED");
                                                resolve();
                                            }).catch(error => reject(error));
                                        } else {
                                            unsent.push({ email: recipient, reason: 'REGISTRATION_ALREADY_APPROVED' });
                                            resolve();
                                        }
                                    } else {

                                        let newRequest = new RegistrationRequest({
                                            email: recipient,
                                            approval: {
                                                approved: true,
                                                approvedOn: new Date(),
                                                approvedBy: req.user._id,
                                            }
                                        });

                                        newRequest.save().then(saved => {
                                            mailHelper.mail('registration-invitation', {
                                                email: saved.email,
                                                subject: `Pozvánka do Northern Stars aplikace`,
                                                hash: saved.registration.registrationHash,
                                                invitedBy: req.user.name,
                                                invitedByUsername: req.user.username
                                            }).then(() => {
                                                sent.push(saved.email);
                                                resolve();
                                            }).catch(error => {
                                                reject(errorHelper.prepareError(error));
                                            });
                                        }).catch(error => {
                                            if (!error.errors) reject(errorHelper.prepareError(error));
                                            let stack = {};
                                            _.forEach(error.errors, (value, key) => { stack[key] = value.message });

                                            reject(errorHelper.prepareError(codeHelper.generateValidationError(stack)));
                                        });
                                    }
                                })
                                .catch(error => {
                                    reject(errorHelper.prepareError(error));
                                });
                        }
                    })
                    .catch(error => {
                        reject(errorHelper.prepareError(error));
                    });
            }));
    });

    Promise.all(promises).then(() => {
        res.json({
            response: codes.REGISTRATION.INVITATION.SENT,
            output: { sent: sent, unsent: unsent }
        });
    }).catch(error => {
        return next(errorHelper.prepareError(error));
    });

};

/**
 * @description: Registration request approval
 * @param req
 * @param res
 * @param next
 * @param outside
 * @returns {*}
 */
exports.requestApproval = (req, res, next, outside = false) =>{
    const input = req.body['input'];
    if (!input) return next(errorHelper.prepareError(sysCodes.REQUEST.INVALID));

    // validation
    const validators = [ { field: 'id', rules: { required: true } } ];
    const validation = iV.validate(input, validators);
    if (!validation.success) return next(errorHelper.prepareError(validation));

    if (!outside) {
        RegistrationRequest.findOne({ _id: input.id }).exec()
            .then(request => {

                if (!request) return next(errorHelper.prepareError(codes.REGISTRATION.REQUEST.NON_EXISTENCE));
                if (request.approval.approved) return next(errorHelper.prepareError(codes.REGISTRATION.REQUEST.ALREADY_APPROVED));

                request.approval.approved = input.state;
                request.approval.approvedOn = new Date();
                userHelper.getUser(req.headers).then(user => {
                    request.approval.approvedBy = user._id;
                }).catch(error => { return next(errorHelper.prepareError(error)); });

                request.save().then(() => {

                    // time-zone format
                    const output = formatDates(request.toObject(), [
                        'requestedOn', 'approval.approvedOn'
                    ], service.timezone);

                    mailHelper.mail(input.state ? 'registration-approved' : 'registration-rejected', {
                        name: request.name,
                        email: request.email,
                        hash: request.registration.registrationHash,
                        subject: input.state ? 'Registrační žádost přijata!' : 'Registrační žádost odmítnuta!'
                    }).then(() => {
                        res.json({
                            response: sysCodes.REQUEST.VALID, output
                        });
                    }).catch(error => {
                        return next(errorHelper.prepareError(error));
                    });
                }).catch(error => {
                    return next(errorHelper.prepareError(error));
                });
            })
            .catch(error => {
                return next(errorHelper.prepareError(error));
            });
    } else {
        return new Promise((resolve, reject) => {
            RegistrationRequest.findOne({ _id: id }).exec()
                .then(request => {

                    if (!request) return next(errorHelper.prepareError(codes.REGISTRATION.REQUEST.NON_EXISTENCE));
                    if (request.approval.approved) return next(errorHelper.prepareError(codes.REGISTRATION.REQUEST.ALREADY_APPROVED));

                    request.approval.approved = input.state;
                    request.approval.approvedOn = new Date();
                    userHelper.getUser(req.headers).then(user => {
                        request.approval.approvedBy = user._id;
                    }).catch(error => { return next(errorHelper.prepareError(error)); });

                    request.save().then(() => {

                        mailHelper.mail(input.state ? 'registration-approved' : 'registration-rejected', {
                            name: request.name,
                            email: request.email,
                            hash: request.registration.registrationHash,
                            subject: input.state ? 'Registration Request Approved!' : 'Registration Request Rejected!'
                        }).then(() => {
                            resolve();
                        }).catch(error => {
                            reject(error);
                        });
                    }).catch(error => {
                        reject(error);
                    });
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
};