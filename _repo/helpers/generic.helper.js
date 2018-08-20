const codes = require('../assets/system-codes.asset');
const services = require('../config/services.config');
const env = require('express')().get('env');
const errorHelper = require('./error.helper');
const _ = require('lodash');


/**
 * @description: Creates a new error when reaching invalid endpoint and passes to next express middleware
 * @param req
 * @param res
 * @param next
 */
exports.invalidEndpoint = function (req, res, next) {
    next(errorHelper.prepareError(codes.API.INVALID_ENDPOINT));
};

/**
 * @description: Prepares and renders incoming error
 * @param error
 * @param req
 * @param res
 * @param next
 */
exports.handleError = function (error, req, res, next) {

    let input = errorHelper.prepareError(error);

    let response = {
        name: input.name,
        message: input.message || false,
        status: input.status || error.statusCode || 500,
        success: input.success || false,
        errorAt: input.errorAt || 'undefined'
    };

    // show error stack only in development environment
    if (env === 'development') response['stack'] = error.stack || null;

    res.status(response.status).json({ response });

};