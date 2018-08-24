const codes = require('../assets/system-codes.asset');
const config = require('../config/server.config');
const jwtDecode = require('jwt-decode');
const generatorHelper = require('../helpers/generators/base.generator');
const errorHelper = require('../helpers/error.helper');
const BaseCtrl = require('../helpers/generic.helper');
const jwt = require('jsonwebtoken');
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

/**
 * @description Verifies that the request is coming from inside the API gateway
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
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

/**
 * @description Verifies the incoming token and assigns its decoded value to the req.user
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.verifyToken = (req, res, next) => {

    const token = req.headers['authorization'];

    if (!token) return next(errorHelper.prepareError(codes.HEADERS.BAD_STRUCT));

    try {
        jwt.verify(token, config[env].token.secret, (err, decoded) => {
            if (error) {
                if (error instanceof jwt.JsonWebTokenError) return next(errorHelper.prepareError(codes.AUTH.TOKEN.INVALID));
                if (error instanceof jwt.NotBeforeError) return next(errorHelper.prepareError(codes.AUTH.TOKEN.INVALID));
                if (error instanceof jwt.TokenExpiredError) return next(errorHelper.prepareError(codes.AUTH.TOKEN.EXPIRED));
            }
            console.log(decoded);
            req.user = decoded;
        });
        return next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) return next(errorHelper.prepareError(codes.AUTH.TOKEN.INVALID));
        if (error instanceof jwt.NotBeforeError) return next(errorHelper.prepareError(codes.AUTH.TOKEN.INVALID));
        if (error instanceof jwt.TokenExpiredError) return next(errorHelper.prepareError(codes.AUTH.TOKEN.EXPIRED));
    }

};