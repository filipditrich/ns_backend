const AuthRoute = require('./auth');
const AdminRoute = require('./admin');
const SysRoute = require('./sys');
const BaseCtrl = require('../../../common/controllers/base');
const API = require('express').Router();
const config = require('../../../common/config/common');
const codes = require('../../../common/assets/codes');
const errorHelper = require('../../../common/helpers/error-helper');

module.exports = function (app) {

    // Check for all incoming requests -- Very first Express Middleware (for routes)
    app.use((req, res, next) => {
        const headers = req.headers;
        // Check if the request is among approved API consumers
        if (!headers['application-id'] || config[app.get('env')].api.consumers.indexOf(headers['application-id']) < 0) {
            // development purposes
            if (app.get('env') === 'development'){ next(); }
            else {
                const error = errorHelper.prepareError(codes.API.UNAUTHORIZED_CONSUMER);
                BaseCtrl.handleError(error, req, res, next);
            }
        } else {
            next();
        }
    });

    // Various API Routes
    API.use('/auth', AuthRoute(app));
    API.use('/admin', AdminRoute(app));
    API.use('/sys', SysRoute(app));

    // Invalid Endpoints (API)
    API.use((req, res, next) => { BaseCtrl.invalidEndpoint(req, res, next) });

    // API Routes
    app.use('/api', API);

    // Invalid Endpoints (Routes)
    app.use((req, res, next) => { BaseCtrl.invalidEndpoint(req, res, next) });

    // Response Handler (Errors) -- Final Express Middleware!
    app.use((error, req, res, next) => { BaseCtrl.handleError(error, req, res, next) });

};