const codes = require('../assets/codes.asset');
const sysCodes = require('northernstars-shared').sysCodes;
const errorHelper = require('northernstars-shared').errorHelper;
const _ = require('lodash');
const Service = require('../models/service.schema');
const serverConf = require('northernstars-shared').serverConfig;
const request = require('request-promise');

exports.exportCodes = (req, res, next) => {

    // TODO: export codes from other service as well
    let output = {};
    output['operator'] = codes;
    output['shared'] = sysCodes;

    res.json({ response: sysCodes.RESOURCE.LOADED, output });

};

exports.exportRoutes = (req, res, next) => {

    // TODO: export routes from other services as well
    let output = {},
        routes = require('../routes/index.route.conf'),
        allowed = ['id', 'method', 'url', 'params', 'roles'];

    Service.find({}).exec()
        .then(services => {
            let promises = [];

            if (services.length !== 0) {
                promises.push(new Promise((resolve, reject) => {
                    services.forEach(service => {
                        request.get({
                            uri: `http://localhost:${service.port}/api/sys/export/routes`,
                            headers: {
                                'Content-Type': 'application/json',
                                'Application-ID': `${serverConf[service.environment].consumers[0]}`,
                                'X-Secret': `${serverConf[service.environment].secret.secret}x${serverConf[service.environment].secret.index}`
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

            Promise.all(promises).then(() => {
                output['operator'] = _.map(routes, _.partialRight(_.pick, allowed));
                res.json({ response: sysCodes.RESOURCE.LOADED, output });
            }).catch(error => {
                return next(errorHelper.prepareError(error));
            });
        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });

};

exports.updateServices = (req, res, next) => {

    const serviceConfig = req.body['service'];

    Service.findOne({ id: serviceConfig.id }).exec()
        .then(service => {
            return service ? service.remove() : Promise.resolve();
        })
        .then(() => {
            const svc = new Service(serviceConfig);
            svc.save().then(saved => {

                exports.serviceChecker();

                res.json({
                    response: sysCodes.REQUEST.PROCESSED,
                    output: saved
                });

            }).catch(error => {
                return next(errorHelper.prepareError(error));
            });
        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });

};

exports.serviceChecker = () => {
    const Service = require('../models/service.schema');
    const request = require('request-promise');

    Service.find({}).exec()
        .then(services => {
            if (services.length !== 0) {
                console.log(`\n\n------------ SERVICE CHECK STARTED ------------\n`);
                const promises = [];
                services.forEach(service => {
                    promises.push(request.get({
                        uri: `http://localhost:${service.port}/api/sys/up-check`,
                        headers: {
                            'Content-Type': 'application/json',
                            'Application-ID': `${serverConf[service.environment].consumers[0]}`,
                            'X-Secret': `${serverConf[service.environment].secret.secret}x${serverConf[service.environment].secret.index}`,
                            'X-Microservice-Communication-Secret': serverConf[service.environment].secret.microSvcCommunication
                        },
                        json: true
                    }).then(response => {
                        console.log(`✅ ${service.name} is up and running for ${response.output['runtime']} seconds.`);
                    }).catch(error => {
                        if (error.message && error.message.search(new RegExp('ECONNREFUSED', 'i')) >= 0) {
                            console.log(`❌ ${service.name} is unreachable. Removing from the list`);
                        } else {
                            console.log(`❌ Error in communication with ${service.name}: `, error.message, 'Service is now removed from this list');
                        }
                        service.remove();
                    }));
                });

                Promise.all(promises).then(() => {
                    if (services.length !== 0) {
                        console.log(`\n------------ SERVICE CHECK ENDED ------------\n\n`);
                    }
                }).catch(error => {
                    console.log("An error occurred while checking for services: ", error);
                });
            }
        })
        .catch(error => {
            console.log("An error occurred while checking for services: ", error);
        })
};