const codes = require('../assets/system-codes.asset');
const config = require('../config/server.config');
const jwtDecode = require('jwt-decode');
const generatorHelper = require('../helpers/generators/base.generator');
const errorHelper = require('../helpers/error.helper');
const BaseCtrl = require('../helpers/generic.helper');
const env = require('express')().get('env');

/**
 * @description: Checks if the incoming secret matches the server secret
 * @param req
 * @param res
 * @param next
 * @return {Promise<any>}
 */
exports.requireSecret = (req, res, next) => {
    return new Promise((resolve, reject) => {

        let secretHeader = req.headers['x-secret'];
        if (!secretHeader) reject(errorHelper.prepareError(codes.SECRET.MISSING));

        let secret = secretHeader.split("x")[0];
        let index = secretHeader.split("x")[1];
        let candidate = generatorHelper.generateMiddleString(secret, index);
        let real = generatorHelper.generateMiddleString(config[env].secret.secret, config[env].secret.index);

        if (candidate !== real) reject(errorHelper.prepareError(codes.SECRET.INVALID));
        resolve();

    });
};

/**
 * @description: Checks if the user that made the request has enough privileges to do such an action
 * @param req
 * @param res
 * @param next
 * @param roles
 * @return {Promise<any>}
 */
exports.roleAuthorization = (req, res, next, roles) => {
    return new Promise((resolve, reject) => {

        if (roles === 'anybody') { resolve() }

        let user = !!req.user ? req.user : !!req.headers['authorization'] ? jwtDecode(req.headers['authorization']) : false;
        if (!user) reject(codes.AUTH.ROLES.UNAUTHORIZED_ACCESS);

        if (user.roles.some(role => roles.indexOf(role) >= 0)){
            return resolve();
        } else {
            return reject(codes.AUTH.ROLES.UNAUTHORIZED_ACCESS);
        }
    });
};

/**
 * @description: Check if the request is among allowed API consumers
 * @param req
 * @param res
 * @param next
 * @param serviceConfig
 * @return {*}
 */
exports.apiConsumers = (req, res, next, serviceConfig) => {
    const headers = req.headers;

    if (!headers['application-id'] || serviceConfig.consumers.indexOf(headers['application-id']) < 0) {

        // development purposes
        if (env === 'development'){ return next(); }

        else {
            const error = errorHelper.prepareError(codes.API.UNAUTHORIZED_CONSUMER);
            BaseCtrl.handleError(error, req, res, next);
        }
    } else {
        return next();
    }
};

exports.microserviceCommunication = (req, res, next) => {
    const headers = req.headers;

    if (!headers['x-microservice-communication-secret']) {
        const error = errorHelper.prepareError(codes.API.NOT_GATEWAY);
        return next(error);
    }

    if (config[env].secret.microSvcCommunication !== headers['x-microservice-communication-secret']) {
        const error = errorHelper.prepareError(codes.HEADERS.BAD_STRUCT);
        return next(error);
    }

    return next();
};