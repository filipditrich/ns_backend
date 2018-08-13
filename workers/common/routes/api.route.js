const router = require('express').Router();
const worker = require('../config/worker.config').worker().id;
const BaseCtrl = require('../../../common/controllers/base.controller');
const PlaceRoutes = require('./places.route');

/**
 * @description Generic Getters
 * @param id
 */
const method = function(id) { return require('../../../common/helpers/route.helper').getRouteMethod(id, worker) };
const endpoint = function(id) { return require('../../../common/helpers/route.helper').getRouteEndpoint(id, worker) };
const auth = function(id) { return require('../../../common/helpers/route.helper').getRouteAuth(id, worker) };

/**
 * @description Common API
 * @author filipditrich
 * @param app
 * @returns {Router|router}
 */
module.exports = function (app) {


    router[method('PLACES')](endpoint('PLACES'), auth('PLACES'), PlaceRoutes(app));

    // Invalid Endpoints
    router.use((req, res, next) => BaseCtrl.invalidEndpoint(req, res, next));

    return router;

};