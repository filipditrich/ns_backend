const serverConf = require('northernstars-shared').serverConfig;
const errorHelper = require('northernstars-shared').errorHelper;
const sysCodes = require('northernstars-shared').sysCodes;
const Service = require('../models/service.schema');
const request = require('request-promise');
const _ = require('lodash');

/**
 * @description Handles all API Gateway Requests
 * @param req
 * @param res
 * @param next
 */
exports.gatewayHandler = (req, res, next) => {

    Service.findOne({ id: req.params['msvc'] }).exec()
        .then(service => {
            if (!service) return next(errorHelper.prepareError(sysCodes.API.INVALID_ENDPOINT));

            // Modify Headers
            delete req.headers['content-type'];
            delete req.headers['content-length'];
            req.headers['x-microservice-communication-secret'] = serverConf[service.environment].secret.microSvcCommunication;

            const path = req.originalUrl
                .split("/")
                .filter(x => x !== 'api' && x !== '' && x !== service.id)
                .join("/");

            const redirect = `http://${service.host}:${service.port}/api/${path}`;

            request({
                method: req.method,
                uri: redirect,
                body: req.body,
                headers: req.headers,
                json: true,
            }).then(response => {

                res.json(response);

            }).catch(error => {
                const err = !!error.error ? !!error.error.response ? error.error.response : error.error : error;
                return next(err);
            });

        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });

};