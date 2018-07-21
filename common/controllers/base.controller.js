const codes = require('../assets/codes');
const env = require('express')().get('env');
const errorHelper = require('../helpers/error.helper');


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

    res.status(error.status || error.statusCode || 500);

    let response = {
        identifier: error.name,
        message: error.message || false,
        status: error.status || error.statusCode || 500,
        success: error.success || false,
    };

    // show error stack only in development environment
    if (env === 'development') response['stack'] = error.stack || null;

    res.json({ response });

};