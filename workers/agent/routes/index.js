const AuthRoute = require('./auth');
const AdminRoute = require('./admin');
const SysRoute = require('./sys');
const BaseCtrl = require('../../../common/controllers/base');
const API = require('express').Router();
const config = require('../../../common/config/common');
const codes = require('../../../common/assets/codes');
const errorHelper = require('../../../common/helpers/error-helper');
const ApiConsumers = require('../../../common/controllers/strategies').apiConsumers;
const endpoints = require('../config/endpoints.config');

module.exports = function (app) {

    // Check for all incoming requests -- Very first Express Middleware (for routes)
    app.use((req, res, next) => { ApiConsumers(req, res, next) });

    // Various API Routes
    API.use(`/${endpoints.API.AUTH.endpoint}`, AuthRoute(app));
    API.use(`/${endpoints.API.ADMIN.endpoint}`, AdminRoute(app));

    // Invalid Endpoints (API)
    API.use((req, res, next) => { BaseCtrl.invalidEndpoint(req, res, next) });

    // API Routes
    app.use(`/${endpoints.API.endpoint}`, API);

    // Invalid Endpoints (Routes)
    app.use((req, res, next) => { BaseCtrl.invalidEndpoint(req, res, next) });

    // Response Handler (Errors) -- Final Express Middleware!
    app.use((error, req, res, next) => { BaseCtrl.handleError(error, req, res, next) });

};