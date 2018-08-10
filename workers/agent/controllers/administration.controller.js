const RegistrationRequest = require('../models/registration-request.model');
const codes = require('../../../common/assets/codes');
const errorHelper = require('../../../common/helpers/error.helper');
const codeHelper = require('../../../common/helpers/code.helper');
const mailHelper = require('../../../common/helpers/mail.helper');
const _ = require('lodash');

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

/**
 * @description List requests
 * @param req
 * @param res
 * @param next
 */
// TODO - check if this is using, cuz it shouldnt be used no more
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

/**
 * @description Send emails with invitations
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
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

/**
 * @description Basic Admin Listing Function (CRUD - READ)
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.list = (req, res, next) => {

    const list = req.params['list'];
    const id = req.params['id'] || false;

    const query = id ? { _id: id } : {};

    switch (list) {
        case 'registration-requests': {

            RegistrationRequest.find(query).exec()
                .then(requests => {
                    res.json({
                        response: codes.RESOURCE.LOADED,
                        output: requests
                    });
                })
                .catch(error => {
                    return next(errorHelper.prepareError(error));
                });
            break;
        }
        case 'users': {
            const User = require('../models/user.model');

            User.find(query).exec()
                .then(users => {
                    let output = [];
                    users.forEach(user => {
                        output.push(setUserInfo(user));
                    });
                    res.json({
                        response: codes.RESOURCE.LOADED,
                        output: output
                    })
                })
                .catch(error => {
                    return next(errorHelper.prepareError(error));
                });
            break;
        }
        default: {
            return next(errorHelper.prepareError(codes.API.INVALID_ENDPOINT));
        }
    }

};

/**
 * @description Basic Admin Update Function (CRUD - U)
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.update = (req, res, next) => {

    const collection = req.params['collection'];
    const id = req.params['id'];
    const update = req.body.update;

    switch (collection) {
        case 'users': {
            const User = require('../models/user.model');

            User.update({ _id: id }, update).exec()
                .then(response => {
                    if (response.nModified < 1) { return next(errorHelper.prepareError(codes.CRUD.UPDATE.UNCHANGED)) }
                    res.json({ response: codes.CRUD.UPDATE.UPDATED })
                })
                .catch(error => {
                    return next(errorHelper.prepareError(error));
                });

            break;
        }
        default: {
            return next(errorHelper.prepareError(codes.API.INVALID_ENDPOINT));
        }
    }

};

/**
 * @description Basic Admin Delete Function (CRUD - D)
 * @param req
 * @param res
 * @param next
 */
exports.delete = (req, res, next) => {

    const collection = req.params['collection'];
    const id = req.params['id'];

    switch (collection) {
        case 'users': {
            const User = require('../models/user.model');

            User.findOne({ _id: id }).exec()
                .then(user => {
                    if (!user) return next(errorHelper.prepareError(codes.CRUD.DELETE.NOT_DELETED));
                    RegistrationRequest.findOne({ email: user.email }).exec()
                        .then(request => {

                            if (request) {
                               request.remove().catch(error => {
                                   return next(errorHelper.prepareError(error));
                               });
                            }

                            user.remove().then(() => {
                                res.json({ response: codes.CRUD.DELETE.DELETED });
                            }).catch(error => {
                                return next(errorHelper.prepareError(error));
                            });

                        })
                        .catch(error => {
                            return next(errorHelper.prepareError(error));
                        });
                })
                .catch(error => {
                    return next(errorHelper.prepareError(error));
                })

        }
    }

};

/**
 * @description Basic Admin Create Function (CRUD - C)
 * @param req
 * @param res
 * @param next
 */
exports.create = (req, res, next) => {

    const collection = req.params['collection'];
    const input = req.body.user;

    switch (collection) {

        case 'users': {
            const User = require('../models/user.model');

            User.findOne({ username: input.username }).exec()
                .then(userWithUsername => {
                    if (userWithUsername) return next(errorHelper.prepareError(codes.AUTH.USERNAME.IN_USE));

                    User.findOne({ email: input.email }).exec()
                        .then(userWithEmail => {
                            if (userWithEmail) return next(errorHelper.prepareError(codes.AUTH.EMAIL.IN_USE));

                            const newUser = new User(input);

                            newUser.save().then(saved => {

                                if (req.body.options.mail) {

                                    mailHelper.mail('registration-finished', {
                                        name: saved.name,
                                        username: saved.username,
                                        email: saved.email,
                                        subject: 'Account created'
                                    }).then(() => {
                                        res.json({ response: codes.REQUEST.PROCESSED });
                                    }).catch(error => {
                                        return next(errorHelper.prepareError(error));
                                    });

                                } else {
                                    res.json({ response: codes.REQUEST.PROCESSED });
                                }

                            }).catch(error => {
                                return next(errorHelper.prepareError(error));
                            })
                        })
                        .catch(error => {
                            return next(errorHelper.prepareError(error));
                        })
                })
                .catch(error => {
                    return next(errorHelper.prepareError(error));
                })
        }
    }
};