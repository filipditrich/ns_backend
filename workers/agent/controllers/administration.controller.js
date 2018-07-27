const RegistrationRequest = require('../models/registration-request.model');
const codes = require('../../../common/assets/codes');
const errorHelper = require('../../../common/helpers/error.helper');
const codeHelper = require('../../../common/helpers/code.helper');
const mailHelper = require('../../../common/helpers/mail.helper');
const _ = require('lodash');

/**
 * @description: Approves a registration request
 * @param req
 * @param res
 * @param next
 */
exports.approveRegistration = (req, res, next) => {

    let hash = req.params['hash'];

    RegistrationRequest.findOne({ 'registration.registrationHash': hash }).exec()
        .then(request => {

            if (!request) return next(errorHelper.prepareError(codes.AUTH.REGISTRATION.REQUEST.NON_EXISTENCE));
            if (request.registration.userRegistered) return next(errorHelper.prepareError(codes.AUTH.REGISTRATION.REQUEST.USER_REGISTERED));
            if (request.approval.approved) return next(errorHelper.prepareError(codes.AUTH.REGISTRATION.REQUEST.ALREADY_APPROVED));

            request.approval.approved = true;
            request.approval.approvedOn = new Date();
            request.approval.approvedBy = req.user._id;
            request.approval.approvedByUser = req.user.name;


            request.save(error => {
               if (error) return next(errorHelper.prepareError(error));

                mailHelper.mail('registration-approved', {
                    email: request.email,
                    name: request.name,
                    hash: request.registration.registrationHash,
                    subject: 'Registration Approved!'
                }).then(() => {
                    res.json({ response: codes.AUTH.REGISTRATION.REQUEST.APPROVE_SUCCESS });
                }).catch(error => {
                    return next(errorHelper.prepareError(error));
                });

            });

        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });

};


exports.getRequests = (req, res, next) => {

    RegistrationRequest.find({}).exec()
        .then(requests => {
            res.json({
                response: codes.RESOURCE.LOADED,
                requests: requests
            });
        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        })

};

exports.sendInvites = (req, res, next) => {

    let emails = req.body.emails;
    let recipients = [];
    if (!Array.isArray(emails)) { recipients.push(emails); } else { recipients = emails }
    if (!emails) return next(errorHelper.prepareError(codes.REQUEST.INVALID));
    let sent = [],
        unsent = [],
        promises = [];

    _.each(recipients, recipient => {

        promises.push(
            new Promise((resolve, reject) => {
                RegistrationRequest.findOne({ email: recipient }).exec()
                    .then(request => {
                        if (request) {
                            if (!request.approval.approved) {
                                req.params['hash'] = request.registration.registrationHash;
                                exports.approveRegistration(req, res, next);
                            } else {
                                unsent.push(recipient);
                                resolve();
                            }
                        } else {
                            let newRequest = new RegistrationRequest({
                                email: recipient,
                                approval: {
                                    approved: true,
                                    approvedOn: Date().now,
                                    approvedBy: req.user._id,
                                }
                            });

                            newRequest.save().then(saved => {
                                mailHelper.mail('registration-invitation', {
                                    email: saved.email,
                                    subject: 'NS Team App Invitation!',
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
            })
        );

    });

    Promise.all(promises).then(() => {
        res.json({
            response: codes.REQUEST.PROCESSED,
            sent: sent,
            unsent: unsent
        });
    }).catch(error => {
        return next(errorHelper.prepareError(error));
    })



};