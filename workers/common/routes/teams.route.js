const router = require('express').Router();
const TeamsCtrl = require('../controllers/teams.controller');
const worker = require('../config/worker.config').worker().id;

/**
 * @description Generic Getters
 * @param id
 */
const method = function(id) { return require('../../../common/helpers/route.helper').getRouteMethod(id, worker) };
const endpoint = function(id) { return require('../../../common/helpers/route.helper').getRouteEndpoint(id, worker) };
const auth = function(id) { return require('../../../common/helpers/route.helper').getRouteAuth(id, worker) };

/**
 * @description Team Sub-Route of Common Worker
 * @author filipditrich
 * @param app
 * @returns {Router|router}
 */
module.exports = function (app) {

    router[method('ADD_TEAM')](endpoint('ADD_TEAM'), auth('ADD_TEAM'), TeamsCtrl.addTeam);
    router[method('GET_TEAM')](endpoint('GET_TEAM'), auth('GET_TEAM'), TeamsCtrl.getTeams);
    router[method('UPD_TEAM')](endpoint('UPD_TEAM'), auth('UPD_TEAM'), TeamsCtrl.updateTeam);
    router[method('DEL_TEAM')](endpoint('DEL_TEAM'), auth('DEL_TEAM'), TeamsCtrl.deleteTeam);

    return router;

};