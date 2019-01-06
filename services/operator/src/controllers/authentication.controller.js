const rp = require('request-promise');
const _ = require('lodash');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const codes = require('../assets/codes.asset');
const settings = require('../config/settings.config');
const User = require('../models/user.schema');
const PwdResetRequest = require('../models/pwd-reset-request.schema');
const RegistrationRequest = require('../models/registration-request.schema');
const serverConfig = require('northernstars-shared').serverConfig;
const sysCodes = require('northernstars-shared').sysCodes;
const codeHelper = require('northernstars-shared').codeHelper;
const mailHelper = require('northernstars-shared').mailHelper;
const errorHelper = require('northernstars-shared').errorHelper;
const StrategyCtrl = require('northernstars-shared').strategiesCtrl;
const schemaFields = require('northernstars-shared').schemaFields;
const iV = require('northernstars-shared').validatorHelper.inputValidator;


/**
 * @description: generates and signs new JWT token
 * @param user
 * @returns {*}
 */
function generateToken(user) {
    return jwt.sign(user, serverConfig[settings.environment].token.secret, {
        expiresIn: serverConfig[settings.environment].token.ttl
    });
}

/**
 * @description: returns basic user info
 * @param request
 * @returns {{_id: *, username: *, roles: (string[]|roles|{type, default})}}
 */
exports.setUserInfo = (request) => {
    return {
        _id: request._id,
        username: request.username,
        email: request.email,
        name: request.name,
        roles: request.roles,
        number: request.number,
        team: request.team
    }
};

/**
 * @description: Outputs basic user info after successful login
 * @param req
 * @param res
 * @param next
 */
exports.login = (req, res, next) => {

    exports.requireLogin(req, res, next).then(user => {
        let userInfo = exports.setUserInfo(user);
        res.json({
            response: codes.LOGIN.SUCCESS,
            output: {
                user: userInfo,
                token: generateToken(userInfo)
            }
        });
    }).catch(error => next(errorHelper.prepareError(error)));
};

/**
 * @description: Tries to login a user based on incoming login data
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.requireLogin = (req, res, next) => {
    return new Promise((resolve, reject) => {
        return passport.authenticate('login', {
            session: false,
            badRequestMessage: codes.LOGIN.INCOMPLETE_REQUEST.name
        }, (error, user, response) => {
            if (!error && !user && response && response.message === codes.LOGIN.INCOMPLETE_REQUEST.name){
                return reject(codes.LOGIN.INCOMPLETE_REQUEST);
            }
            if (error) reject(error);
            if (!user) reject(response);
            req.user = user;
            resolve(user);
        })(req, res, next);
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
            if (!request) return next(errorHelper.prepareError(sysCodes.REQUEST.INVALID));
            if (!request.approval.approved) return next(errorHelper.prepareError(sysCodes.REQUEST.INVALID));
            if (request.registration.userRegistered) return next(errorHelper.prepareError(sysCodes.REQUEST.INVALID));
            res.json({ response: sysCodes.REQUEST.VALID, output: request });
        }).catch(error => next(errorHelper.prepareError(error)));
};

/**
 * @description: Requests a new registration request
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.requestRegistration = (req, res, next) => {
    let input = req.body['input'];
    if (!input) return next(errorHelper.prepareError(sysCodes.REQUEST.INVALID));

    // validation
    const validators = [
        { field: 'name', rules: { required: true } },
        { field: 'email', rules: { required: true, email: true } },
    ];
    const validation = iV.validate(input, validators);
    if (!validation.success) return next(errorHelper.prepareError(validation));

    let email = input.email;
    let name = input.name;

    RegistrationRequest.findOne({ email: email }).exec()
        .then(alreadyRequested => {
            if (alreadyRequested) return next(errorHelper.prepareError(codes.EMAIL.ALREADY_REQUESTED));

            User.findOne({ email: email }).exec()
                .then(alreadyRegistered => {
                    if (alreadyRegistered) return next(errorHelper.prepareError(codes.EMAIL.IN_USE));

                    let request = new RegistrationRequest({ email, name });
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
                            subject: 'Registrační žádost vytvořena!'
                        }).then(() => {
                            res.json({
                                response: codes.REGISTRATION.REQUEST.SUCCESS,
                                output: {
                                    email: saved.email
                                }
                            });
                        }).catch(error => next(errorHelper.prepareError(error)));
                    });
                }).catch(error => next(errorHelper.prepareError(error)));
        }).catch(error => next(errorHelper.prepareError(error)));
};

/**
 * @description: Get registration request
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.getRegistrationRequest = (req, res, next) => {

    const id = req.params['id'];
    const query = !!id ? { _id: id } : {};

    RegistrationRequest.find(query).exec()
        .then(registrationRequests => {
            if (registrationRequests.length === 0) return next(errorHelper.prepareError(codes.REGISTRATION.REQUEST.NULL_FOUND));

            User.find({}).exec()
                .then(users => {
                    if (users.length === 0) return next(errorHelper.prepareError(sysCodes.REQUEST.INVALID)); // this shouldn't happen
                    const fin = [];

                    // define deletedUserIndex (should always be in database)
                    const deletedUserIndex = users.findIndex(obj => obj.username === 'deletedUser');
                    if (deletedUserIndex === -1) console.error(`NO '(deleted user)' user defined!`);

                    registrationRequests.forEach(request => {
                        request = request.toObject();
                        // extend 'approval.approvedBy' field
                        if (!!request.approval.approvedBy) {
                            const approvedByIndex = users.findIndex(obj => obj._id.toString() === request.approval.approvedBy.toString());
                            request.approval.approvedBy = approvedByIndex >= 0 ? exports.setUserInfo(users[approvedByIndex]) : exports.setUserInfo(users[deletedUserIndex]);
                        }
                        // extend 'registration.user' field
                        if (!!request.registration.user) {
                            const userIndex = users.findIndex(obj => obj._id.toString() === request.registration.user.toString());
                            request.registration.user = userIndex >= 0 ? exports.setUserInfo(users[userIndex]) : exports.setUserInfo(users[deletedUserIndex]);
                        }
                        fin.push(request);
                    });

                    res.json({ response: sysCodes.RESOURCE.LOADED, output: fin });
                }).catch(error => next(errorHelper.prepareError(error)));
        }).catch(error => next(errorHelper.prepareError(error)));
};

/**
 * @description: Check if registration hash exists
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.existCheck = (req, res, next) => {
    const type = req.params['type'];
    const input = req.body['input'];
    if (!input) return next(errorHelper.prepareError(sysCodes.REQUEST.INVALID));

    switch (type) {
        case 'registration-request': {
            RegistrationRequest.findOne({"registration.registrationHash": input.hash}).exec()
                .then(request => {
                    if (!request) return next(errorHelper.prepareError(sysCodes.REQUEST.INVALID));
                    res.json({ response: sysCodes.REQUEST.VALID })
                })
                .catch(error => next(errorHelper.prepareError(error)));
            break;
        }
        case 'password-reset': {
            PwdResetRequest.findOne({"resetHash": input.hash}).exec()
                .then(request => {
                    if (!request) return next(errorHelper.prepareError(sysCodes.REQUEST.INVALID));
                    res.json({ response: sysCodes.REQUEST.VALID })
                })
                .catch(error => next(errorHelper.prepareError(error)));
            break;
        }
        default: {
            return next(errorHelper.prepareError(sysCodes.UNDEFINED));
        }
    }
};

/**
 * @description Finishes the registration process (registers the user)
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
exports.finishRegistration = (req, res, next) => {

    let hash = req.params['hash'];
    let input = req.body['input'];
    if (!input) return next(errorHelper.prepareError(sysCodes.REQUEST.INVALID));

    // validation
    const validators = [
        { field: 'username', rules: { required: true } },
        { field: 'password', rules: { required: true,
                minLength: schemaFields.PASSWORD.MIN_LENGTH,
                maxLength: schemaFields.PASSWORD.MAX_LENGTH
            }
        },
        { field: 'number', rules: { required: true,
                min: schemaFields.NUMBER.MIN,
                max: schemaFields.NUMBER.MAX
            }
        },
        { field: 'team', rules: { required: true, objectId: true } },
    ];
    const validation = iV.validate(input, validators);
    if (!validation.success) return next(errorHelper.prepareError(validation));

    let username = input.username;
    let password = input.password;
    let number = input.number;
    let team = input.team;
    let name = input.name;

    RegistrationRequest.findOne({ 'registration.registrationHash': hash }).exec()
        .then(request => {

            if (!request) return next(errorHelper.prepareError(codes.REGISTRATION.REQUEST.NON_EXISTENCE));
            if (!request.approval.approved) return next(errorHelper.prepareError(codes.REGISTRATION.REQUEST.NOT_APPROVED));
            if (request.registration.userRegistered) return next(errorHelper.prepareError(codes.REGISTRATION.REQUEST.USER_REGISTERED));

            User.find({}).exec()
                .then(users => {
                    const usernameDup = users.filter(x => x.username === username);
                    if (usernameDup.length) return next(errorHelper.prepareError(codes.USERNAME.IN_USE));

                    // TODO: check for Team validity
                    // rp({})

                    let newUser = new User({
                        username, password, number, team,
                        name: request.name || name,
                        email: request.email,
                    });

                    newUser.save((error, saved) => {
                        if (error) {
                            if (!error.errors) return next(errorHelper.prepareError(error));
                            let stack = {};
                            _.forEach(error.errors, (value, key) => { stack[key] = value.message });

                            return next(errorHelper.prepareError(codeHelper.generateValidationError(stack)));
                        }

                        request.registration.userRegistered = true;
                        request.registration.user = saved._id;
                        request.save(err => {
                            if (err) return next(errorHelper.prepareError(err));

                            mailHelper.mail('registration-finished', {
                                email: saved.email,
                                name: saved.name,
                                username: saved.username,
                                subject: 'Vítejte v týmu!'
                            }).then(() => {
                                res.json({
                                    response: codes.REGISTRATION.SUCCESS,
                                    output: {
                                        user: exports.setUserInfo(saved)
                                    }
                                });
                            }).catch(error => next(errorHelper.prepareError(error)));
                        });
                    });
                }).catch(error => next(errorHelper.prepareError(error)));
        }).catch(error => next(errorHelper.prepareError(error)));

};

/**
 * @description Verifies the request header token
 * @param req
 * @param res
 * @param next
 */
exports.tokenCheck = (req, res, next) => {

    StrategyCtrl.verifyToken(req, res, next).then(() => {
        res.json({ response: sysCodes.AUTH.TOKEN.VALID });
    }).catch(error => next(errorHelper.prepareError(error)));

};

/**
 * @description Exports Teams for registration purposes (unsecured)
 * @param req
 * @param res
 * @param next
 */
exports.getRegTeams = (req, res, next) => {

    // options
    delete req.headers['content-type'];
    delete req.headers['content-length'];
    req.headers['x-microservice-communication-secret'] = serverConfig[settings.services['core'].environment].secret.microSvcCommunication;
    req.headers['x-secret'] = `${serverConfig[settings.services['core'].environment].secret.secret}x${serverConfig[settings.services['core'].environment].secret.index}`;
    req.headers['x-bypass'] = settings.services['core'].secret;

    const options = {
        uri: `http://${settings.services['core'].host}:${settings.services['core'].port}/api/teams`,
        json: true,
        resolveWithFullResponse: true,
        method: 'GET',
        headers: req.headers
    };

    rp(options)
        .then(response => {
            const teams = response.body.output;
            const allowed = ['name', '_id'];
            const output = _.map(teams, _.partialRight(_.pick, allowed));

            res.json({ response: sysCodes.RESOURCE.LOADED, output });
        })
        .catch(error => next(errorHelper.prepareError(error)));

};