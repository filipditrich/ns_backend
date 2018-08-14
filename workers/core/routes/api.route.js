const router = require('express').Router();
const ConfRoutes = router;
const worker = require('../config/worker.config').worker().id;
const BaseCtrl = require('../../../common/controllers/base.controller');
const ConfCtrl = require('../controllers/configuration.controller');

/**
 * @description Generic Getters
 * @param id
 */
const method = function(id) { return require('../../../common/helpers/route.helper').getRouteMethod(id, worker) };
const endpoint = function(id) { return require('../../../common/helpers/route.helper').getRouteEndpoint(id, worker) };
const auth = function(id) { return require('../../../common/helpers/route.helper').getRouteAuth(id, worker) };

/**
 * @description Core API
 * @author filipditrich
 * @param app
 * @returns {Router|router}
 */
module.exports = function (app) {

    ConfRoutes[method('CODES')](endpoint('CODES'), auth('CODES'), ConfCtrl.exportCodes);
    ConfRoutes[method('ENDPOINTS')](endpoint('ENDPOINTS'), auth('ENDPOINTS'), ConfCtrl.exportRoutes);

    router[method('CONF')](endpoint('CONF'), auth('CONF'), ConfRoutes);

    // Invalid Endpoints
    router.use((req, res, next) => BaseCtrl.invalidEndpoint(req, res, next));

    return router;

};