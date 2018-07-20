const codes = require('../assets/codes');
const env = require('express')().get('env');
const errorHelper = require('../helpers/error-helper');

exports.invalidEndpoint = function (req, res, next) {
    next(errorHelper.prepareError(codes.API.INVALID_ENDPOINT));
};

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