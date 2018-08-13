const router = require('express').Router();
const PlacesCtrl = require('../controllers/places.controller');
const worker = require('../config/worker.config').worker().id;

/**
 * @description Generic Getters
 * @param id
 */
const method = function(id) { return require('../../../common/helpers/route.helper').getRouteMethod(id, worker) };
const endpoint = function(id) { return require('../../../common/helpers/route.helper').getRouteEndpoint(id, worker) };
const auth = function(id) { return require('../../../common/helpers/route.helper').getRouteAuth(id, worker) };

/**
 * @description Places Sub-Route of Common Worker
 * @author filipditrich
 * @param app
 * @returns {Router|router}
 */
module.exports = function (app) {

    router[method('ADD_PLACE')](endpoint('ADD_PLACE'), auth('ADD_PLACE'), PlacesCtrl.addPlace);

    return router;

};