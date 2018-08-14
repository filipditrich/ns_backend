const router = require('express').Router();
const worker = require('../config/worker.config').worker().id;
const BaseCtrl = require('../../../common/controllers/base.controller');
const GatewayCtrl = require('../controllers/gateway.controller');
const AuthRoute = require('./auth.route');

/**
 * @description Generic Getters
 * @param id
 */
const method = function(id) { return require('../../../common/helpers/route.helper').getRouteMethod(id, worker) };
const endpoint = function(id) { return require('../../../common/helpers/route.helper').getRouteEndpoint(id, worker) };
const auth = function(id) { return require('../../../common/helpers/route.helper').getRouteAuth(id, worker) };

/**
 * @description Auth API
 * @author filipditrich
 * @param app
 * @returns {Router|router}
 */
module.exports = function (app) {


    router[method('AUTH')](endpoint('AUTH'), auth('AUTH'), AuthRoute(app));

    router.use('/:endpoint', GatewayCtrl.authTokenIfNeeded,  GatewayCtrl.handleGatewayRequest);

    // Invalid Endpoints
    router.use((req, res, next) => BaseCtrl.invalidEndpoint(req, res, next));

    return router;

};