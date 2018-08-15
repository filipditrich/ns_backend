const router = require('express').Router();
const JerseysCtrl = require('../controllers/jerseys.controller');
const worker = require('../config/worker.config').worker().id;

/**
 * @description Generic Getters
 * @param id
 */
const method = function(id) { return require('../../../common/helpers/route.helper').getRouteMethod(id, worker) };
const endpoint = function(id) { return require('../../../common/helpers/route.helper').getRouteEndpoint(id, worker) };
const auth = function(id) { return require('../../../common/helpers/route.helper').getRouteAuth(id, worker) };

/**
 * @description Jersey Sub-Route of Common Worker
 * @author filipditrich
 * @param app
 * @returns {Router|router}
 */
module.exports = function (app) {

    router[method('ADD_JERSEY')](endpoint('ADD_JERSEY'), auth('ADD_JERSEY'), JerseysCtrl.newJersey);
    router[method('GET_JERSEY')](endpoint('GET_JERSEY'), auth('GET_JERSEY'), JerseysCtrl.getJerseys);
    router[method('UPD_JERSEY')](endpoint('UPD_JERSEY'), auth('UPD_JERSEY'), JerseysCtrl.updateJersey);
    router[method('DEL_JERSEY')](endpoint('DEL_JERSEY'), auth('DEL_JERSEY'), JerseysCtrl.deleteJersey);

    return router;

};