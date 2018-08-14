const router = require('express').Router();
const MatchesCtrl = require('../controllers/matches.controller');
const worker = require('../config/worker.config').worker().id;

/**
 * @description Generic Getters
 * @param id
 */
const method = function(id) { return require('../../../common/helpers/route.helper').getRouteMethod(id, worker) };
const endpoint = function(id) { return require('../../../common/helpers/route.helper').getRouteEndpoint(id, worker) };
const auth = function(id) { return require('../../../common/helpers/route.helper').getRouteAuth(id, worker) };

/**
 * @description Matches Sub-Route of Common Worker
 * @author filipditrich
 * @param app
 * @returns {Router|router}
 */
module.exports = function (app) {

    router[method('ADD_MATCH')](endpoint('ADD_MATCH'), auth('ADD_MATCH'), MatchesCtrl.createMatch);
    router[method('GET_MATCH')](endpoint('GET_MATCH'), auth('GET_MATCH'), MatchesCtrl.getMatches);
    router[method('UPD_MATCH')](endpoint('UPD_MATCH'), auth('UPD_MATCH'), MatchesCtrl.updateMatch);
    router[method('DEL_MATCH')](endpoint('DEL_MATCH'), auth('DEL_MATCH'), MatchesCtrl.deleteMatch);

    return router;

};