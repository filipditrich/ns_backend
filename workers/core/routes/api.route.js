const express = require('express');
const router = express.Router();
const worker = express().get('worker');
console.log(worker);
const API = router;
const ConfRoutes = router;
const BaseCtrl = require('../../../common/controllers/base.controller');
const ConfCtrl = require('../controllers/configuration.controller');
const _method = require('../../../common/helpers/route.helper').getRouteMethod;
const method = function(id) { return _method(id, worker) };
const _endpoint = require('../../../common/helpers/route.helper').getRouteEndpoint;
const endpoint = function(id) { return _endpoint(id, worker) };
const _auth = require('../../../common/helpers/route.helper').getRouteAuth;
const auth = function(id) { return _auth(id, worker) };

/**
 * @description Core API
 * @author filipditrich
 * @param req
 * @param res
 * @param next
 * @returns {Router|router}
 */
module.exports = function (req, res, next) {


    ConfRoutes[method('CODES')](endpoint('CODES'), auth('CODES'), ConfCtrl.exportCodes);
    ConfRoutes[method('ENDPOINTS')](endpoint('ENDPOINTS'), auth('ENDPOINTS'), ConfCtrl.exportRoutes);

    API[method('CONF')](endpoint('CONF'), auth('CONF'), ConfRoutes);

    router.use('/api', API);

    // Invalid Endpoints
    router.use((req, res, next) => BaseCtrl.invalidEndpoint(req, res, next));

    return router;

};