const request = require('request-promise');
const rp = require('request-promise');
const codes = require('../assets/codes.asset');
const Service = require('../models/service.schema');
const serviceSettings = require('../config/settings.config');
const User = require('../models/user.schema');
const settings = require('../config/settings.config');
const sysCodes = require('northernstars-shared').sysCodes;
const errorHelper = require('northernstars-shared').errorHelper;
const serverConf = require('northernstars-shared').serverConfig;
const mailHelper = require('northernstars-shared').mailHelper;
const moment = require('moment');
const _ = require('lodash');

/**
 * @description Exports Service Codes
 * @param req
 * @param res
 * @param next
 */
exports.exportCodes = (req, res, next) => {

    let output = {};
    return Service.find({}).exec()
        .then(services => {
            let promises = [];

            if (services.length !== 0) {
                promises.push(new Promise((resolve, reject) => {
                    services.forEach(service => {
                        request.get({
                            uri: `http://${service.host}:${service.port}/api/sys/export/codes`,
                            headers: {
                                'Content-Type': 'application/json',
                                'Application-ID': `${serverConf[service.environment].consumers[0]}`,
                                'X-Secret': `${serverConf[service.environment].secret.secret}x${serverConf[service.environment].secret.index}`,
                                'X-Microservice-Communication-Secret': serverConf[service.environment].secret.microSvcCommunication
                            },
                            json: true
                        }).then(response => {
                            output[service.id] = response.output;
                            resolve();
                        }).catch(error => {
                            reject(error);
                        })
                    })
                }));
            }

            return Promise.all(promises).then(() => {
                output[serviceSettings.id] = codes;
                output['shared'] = sysCodes;
                return output;
            }).catch(error => next(errorHelper.prepareError(error)));
        })
        .catch(error => next(errorHelper.prepareError(error)));

};

/**
 * @description Exports Service Routes
 * @param req
 * @param res
 * @param next
 */
exports.exportRoutes = (req, res, next) => {

    let output = {},
        routes = require('../routes/index.route.conf'),
        allowed = ['id', 'method', 'url', 'params', 'roles'];

    return Service.find({}).exec()
        .then(services => {
            let promises = [];

            if (services.length !== 0) {
                promises.push(new Promise((resolve, reject) => {
                    services.forEach(service => {
                        request.get({
                            uri: `http://${service.host}:${service.port}/api/sys/export/routes`,
                            headers: {
                                'Content-Type': 'application/json',
                                'Application-ID': `${serverConf[service.environment].consumers[0]}`,
                                'X-Secret': `${serverConf[service.environment].secret.secret}x${serverConf[service.environment].secret.index}`,
                                'X-Microservice-Communication-Secret': serverConf[service.environment].secret.microSvcCommunication
                            },
                            json: true
                        }).then(response => {
                            output[service.id] = _.map(response.output, _.partialRight(_.pick, allowed));
                            resolve();
                        }).catch(error => {
                            reject(error);
                        })
                    })
                }));
            }

            return Promise.all(promises).then(() => {
                output[serviceSettings.id] = _.map(routes, _.partialRight(_.pick, allowed));
                return output;
            }).catch(error => next(errorHelper.prepareError(error)));
        })
        .catch(error => next(errorHelper.prepareError(error)));

};

/**
 * @description Updates/Adds Service into the settings
 * @param req
 * @param res
 * @param next
 */
exports.updateServices = (req, res, next) => {

    const serviceConfig = req.body['service'];
    Service.findOne({ id: serviceConfig.id }).exec()
        .then(service => {
            if (!service) {
                exports.addService(serviceConfig.id, serviceConfig)
                    .then(() => {
                        settings.services[serviceConfig.id] = {
                            name: serviceConfig.name,
                            host: serviceConfig.host,
                            port: serviceConfig.port,
                            secret: serviceConfig.secret,
                            environment: serviceConfig.environment
                        };
                        res.json({ response: sysCodes.REQUEST.PROCESSED, output: settings });
                        exports.serviceChecker();
                    })
                    .catch(error => next(errorHelper.prepareError(error)));
            } else {
                exports.updateService(serviceConfig.id, serviceConfig)
                    .then(() => {
                        settings.services[serviceConfig.id] = {
                            name: serviceConfig.name,
                            host: serviceConfig.host,
                            port: serviceConfig.port,
                            secret: serviceConfig.secret,
                            environment: serviceConfig.environment
                        };
                        res.json({ response: sysCodes.REQUEST.PROCESSED, output: settings });
                        exports.serviceChecker();
                    })
                    .catch(error => next(errorHelper.prepareError(error)));
            }
        }).catch(error => next(errorHelper.prepareError(error)));
};

/**
 * @description Loads saved services
 */
exports.loadServices = () => {
    Service.find({}).exec()
        .then(services => {
            const promises = [];
            services.forEach(service => {
                settings.services[service.id] = {
                    name: service.name,
                    host: service.host,
                    port: service.port,
                    secret: service.secret,
                    environment: service.environment
                };

                const updReq = new Promise((resolve, reject) => {
                    rp.post({
                        uri: `http://${service.host}:${service.port}/api/sys/root-upd`,
                        headers: {
                            'Content-Type': 'application/json',
                            'Application-ID': serverConf[service.environment].consumers[0],
                            'X-Bypass': service.secret,
                            'X-Secret': `${serverConf[service.environment].secret.secret}x${serverConf[service.environment].secret.index}`,
                            'X-Microservice-Communication-Secret': serverConf[service.environment].secret.microSvcCommunication
                        },
                        body: { root: settings },
                        json: true
                    }).then(response => { resolve(response); }).catch(error => { reject(error); });
                });
                promises.push(updReq);
            });

            Promise.all(promises).then(() => {
                exports.serviceChecker(true);
            }).catch(error => {
                console.log(`❌ Error updating on or more services`, error.message);
            });
        });
};


/**
 * @description Removes a Service
 * @param id
 * @return {Promise<T | Array<number>>}
 */
exports.removeService = (id) => {
    return Service.findOne({ id }).exec()
        .then(service => {
            return service ? service.remove() :
                Promise.reject(sysCodes.UNEXPECTED);
        }).catch(error => Promise.reject(error));
};

/**
 * @description Updates a Service
 * @param id
 * @param update
 * @return {Promise<T | Array<number>>}
 */
exports.updateService = (id, update) => {
    return new Promise((resolve, reject) => {
       Service.findOne({ id }).exec()
           .then(service => {
               if (service) {
                   service.update(update).then(() => {
                       resolve();
                   }).catch(error => {
                       reject(error);
                   });
               } else {
                   console.log(id);
               }
           })
           .catch(error => { reject(error) });
    });
};

/**
 * @description Adds/Updates a Service
 * @param id
 * @param input
 * @return {Promise<T | Array<number>>}
 */
exports.addService = (id, input) => {
    return Service.findOne({ id }).exec()
        .then(service => {
            return service ? exports.updateService(id, input)
                : new Service(input).save();
        }).catch(error => Promise.reject(error));
};

/**
 * @description Checks the connectivity between Operator and Services
 */
exports.serviceChecker = (loaded = false) => {
    const services = Object.keys(settings.services);
    const promises = [];

    if (services.length) {
        console.log(loaded ? '\nCONNECTED SERVICES ------------ \n' : '\nSERVICE CHECK STARTED --------- \n');
        services.forEach(service => {
            const svc = settings.services[service];
            const svcCheck = new Promise((resolve, reject) => {
                rp({
                    uri: `http://${svc.host}:${svc.port}/api/sys/up-check`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Application-ID': serverConf[svc.environment].consumers[0],
                        'X-Bypass': svc.secret,
                        'X-Secret': `${serverConf[svc.environment].secret.secret}x${serverConf[svc.environment].secret.index}`,
                        'X-Microservice-Communication-Secret': serverConf[svc.environment].secret.microSvcCommunication
                    },
                    json: true
                }).then(response => {
                    exports.updateService(service, { upTime: response.output['runtime'] }).then(() => {
                        const outputted = response.output['runtime'];
                        const runtime = require('moment')(new Date()).subtract(outputted, 'seconds').toNow(true);
                        const alt = outputted >= 60 ? outputted >= 3600 ? outputted >= 86400 ?
                            `${(outputted / 60 / 60 / 24).toFixed(2)} day(s)`
                            : `${(outputted / 60 / 60).toFixed(2)} hour(s)`
                            : `${(outputted / 60).toFixed(2)} minute(s)`
                            : `${Math.round(outputted)} second(s)`;
                        console.log(loaded ?
                            `▪️ ${settings.services[service].name} (${runtime}) [${alt}]` :
                            `✅ ${settings.services[service].name} is up and running for ${runtime} [${alt}]`);
                        resolve();
                    }).catch(error => {
                        reject(error);
                    });
                }).catch(error => {
                    if (error.message && error.message.search(new RegExp('ECONNREFUSED', 'i')) >= 0) {
                        console.log(`❌ ${svc.name} is unreachable. Removing from the list`);
                    } else {
                        console.log(`❌ Error in communication with ${svc.name}: `, error.message, 'Service is now removed from this list');
                    }
                    exports.removeService(service).then(() => {
                        delete settings.services[svc];
                    }).catch(error => {
                        reject(error);
                    });
                });
            });
            promises.push(svcCheck);
        });

        Promise.all(promises).then(() => {
            console.log(loaded ? '\n-------------------------------' : `\n-------------------------------\n`);
        }).catch(error => {
            console.log("An error occurred while checking for services: ", error);
        });
    }

};

/**
 * @description Send reminders for upcoming match
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
exports.reminders = (req, res, next) => {
    const input = req.body['input'];
    const matchInfo = input['matchInfo'];
    if (!matchInfo) return next(errorHelper.prepareError(sysCodes.REQUEST.INVALID));

    User.find({}).exec()
        .then(users => {
            users = users.filter(u => u.username !== 'deletedUser');
            users = users.filter(u => matchInfo.reminder.reminderTeams
                .map(t => t.toString()).indexOf(u.team.toString()) >= 0);
            if (users.length === 0) return next(errorHelper.prepareError(codes.USER.NULL_FOUND)); // shouldn't happen
            const reminder = users.filter(user => matchInfo.enrollment.players
                .some(p => p.player.toString() === user._id.toString() && p.status === 'going'));
            const mailing = users.filter(user => !matchInfo.enrollment.players
                .some(x => x.player.toString() === user._id.toString()));
            const mailReminders = [], mailMailing = [];
            const promises = [];
            const sent = {
                upcoming: mailing,
                reminder: reminder,
                upcomingSent: [],
                reminderSent: [],
                upcomingUnsent: [],
                reminderUnsent: [],
                usersTotal: users.length,
            };
            // prepare mails for the mailing
            mailing.forEach(recipient => {
                mailMailing.push({
                    email: recipient.email,
                    name: recipient.name,
                    matchTitle: matchInfo.title,
                    date: moment(matchInfo.date).locale('cs').format('dddd, MMMM D'),
                    time: moment(matchInfo.date).locale('cs').format('k:mm'),
                    subject: 'Nejste zapsáni na nadcházející zápas',
                });
            });
            // send mailing mails
            if (mailMailing.length) {
                promises.push(new Promise((resolve, reject) => {
                    mailHelper.mail('upcoming-match', mailMailing).then(output => {
                        sent.upcomingSent = output['sent'];
                        sent.upcomingUnsent = output['unsent'];
                        resolve(output);
                    }).catch(error => { reject(error); })
                }));
            }
            // prepare mails for the reminders
            reminder.forEach(recipient => {
                mailReminders.push({
                    email: recipient.email,
                    name: recipient.name,
                    matchTitle: matchInfo.title,
                    date: moment(matchInfo.date).locale('cs').format('dddd, MMMM D'),
                    time: moment(matchInfo.date).locale('cs').format('k:mm'),
                    subject: 'Připomínka: máte nadcházející zápas',
                });
            });
            // send reminder mails
            if (mailReminders.length) {
                promises.push(new Promise((resolve, reject) => {
                    mailHelper.mail('upcoming-match-enrolled', mailReminders).then(output => {
                        sent.reminderSent = output['sent'];
                        sent.reminderUnsent = output['sent'];
                        resolve();
                    }).catch(error => { reject(error); })
                }));
            }
            // now pray for successful output
            Promise.all(promises).then(() => {
                res.json({ response: sysCodes.REQUEST.VALID, output: { sent } });
            })
            .catch(error => next(errorHelper.prepareError(error)));
        })
        .catch(error => next(errorHelper.prepareError(error)));
};

/**
 * @description Exports all frontend-needed server assets
 * @param req
 * @param res
 * @param next
 */
exports.serverAssets = (req, res, next) => {

    let routes, codes;
    exports.exportRoutes(req, res, next)
        .then(expRoutes => {
            routes = expRoutes;
            return exports.exportCodes(req, res, next);
        })
        .then(expCodes => {
            codes = expCodes;
            res.json({
                response: sysCodes.RESOURCE.LOADED,
                output: {
                    routes, codes,
                    translateList: require('../assets/translate-list.asset'),
                    sysInfo: require('../assets/app-info.asset'),
                }
            });
        })
        .catch(error => next(errorHelper.prepareError(error)));

};

/**
 * @description Ensures that 'deletedUser' exists
 * @return {Promise<T>}
 */
exports.ensureUnavailable = () => {
    const User = require('../models/user.schema');
    const sysEnums = require('northernstars-shared').sysEnums;

    return User.findOne({ username: 'deletedUser' }).exec()
        .then(user => {
            if (!user) {
                console.log("Creating default 'deletedUser' user");
                return new User({
                    username: 'deletedUser',
                    name: 'Deleted User',
                    password: 'deletedUser123',
                    email: 'spam@northernstars.cz',
                    roles: sysEnums.AUTH.ROLES.deleted.key,
                    team: 'aaa123aaa123aaa123aaa123',
                    number: 998
                }).save();
            }
            return Promise.resolve();
        })
        .catch(error => {
             return Promise.reject(error);
        });

};