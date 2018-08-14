const router = require('express').Router();
const worker = require('../config/worker.config').worker().id;
const BaseCtrl = require('../../../common/controllers/base.controller');
const PlaceRoutes = require('./places.route');
const TeamRoutes = require('./teams.route');
const JerseyRoutes = require('./jerseys.route');
const MatchesRoute = require('./matches.route');

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

    router[method('MATCHES')](endpoint('MATCHES'), auth('MATCHES'), MatchesRoute(app));
    router[method('TEAMS')](endpoint('TEAMS'), auth('TEAMS'), TeamRoutes(app));
    router[method('PLACES')](endpoint('PLACES'), auth('PLACES'), PlaceRoutes(app));
    router[method('JERSEYS')](endpoint('JERSEYS'), auth('JERSEYS'), JerseyRoutes(app));

    // Invalid Endpoints
    router.use((req, res, next) => BaseCtrl.invalidEndpoint(req, res, next));

    return router;

};