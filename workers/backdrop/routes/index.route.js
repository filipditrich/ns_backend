const BaseCtrl = require('../../../common/controllers/base.controller');
const endpoints = require('../config/endpoints.config');
const ApiRoutes = require('express').Router();
const AssemblyRoute = require('./assembly.route');
const StrategiesCtrl = require('../../../common/controllers/strategies.controller');

module.exports = function (app) {

    app.use((req, res, next) => { StrategiesCtrl.apiConsumers(req, res, next) });
    app.use((req, res, next) => { StrategiesCtrl.requireSecret(req, res, next) });

    // Assembly Route
    ApiRoutes.use(`/${endpoints.API.ASSEMBLY.endpoint}`, AssemblyRoute(app));

    // -> Api Routes
    app.use(`/${endpoints.API.endpoint}`, ApiRoutes);


    // Invalid Endpoints (Routes)
    app.use((req, res, next) => { BaseCtrl.invalidEndpoint(req, res, next) });

    // Response Handler (Errors) -- Final Express Middleware!
    app.use((error, req, res, next) => { BaseCtrl.handleError(error, req, res, next) });

};