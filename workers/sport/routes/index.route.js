const BaseCtrl = require('../../../common/controllers/base.controller');
const API = require('express').Router();
const StrategiesCtrl = require('../../../common/controllers/strategies.controller');
const endpoints = require('../config/endpoints.config');
const MatchRoute = require('./match.route');

/**
 * @description Main Routing for Sports Worker
 * @author filipditrich
 * @param app
 */
module.exports = function (app) {

    // Authentication on all routes via APIConsumers and Secret
    // app.use((req, res, next) => { StrategiesCtrl.apiConsumers(req, res, next) });
    // app.use((req, res, next) => { StrategiesCtrl.requireSecret(req, res, next) });

    API.use(`/${endpoints.API.MATCHES.endpoint}`, MatchRoute(app));

    app.use(`/${endpoints.API.endpoint}`, API);

    // Invalid Endpoints (Routes)
    app.use((req, res, next) => { BaseCtrl.invalidEndpoint(req, res, next) });

    // Response Handler (Errors) -- Final Express Middleware!
    app.use((error, req, res, next) => { BaseCtrl.handleError(error, req, res, next) });

};