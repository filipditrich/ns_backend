const router = require('express').Router();
const worker = require('../config/worker.config').worker().id;
const CredCtrl = require('../controllers/credentials.controller');

/**
 * @description Generic Getters
 * @param id
 */
const method = function(id) { return require('../../../common/helpers/route.helper').getRouteMethod(id, worker) };
const endpoint = function(id) { return require('../../../common/helpers/route.helper').getRouteEndpoint(id, worker) };
const auth = function(id) { return require('../../../common/helpers/route.helper').getRouteAuth(id, worker) };

/**
 * @description Credentials Sub-Route of Auth Worker
 * @author filipditrich
 * @param app
 * @returns {Router|router}
 */
module.exports = function (app) {

    router[method('PWD_RES')](endpoint('PWD_RES'), auth('PWD_RES'), CredCtrl.resetPassword);
    router[method('PWD_FGT')](endpoint('PWD_FGT'), auth('PWD_FGT'), CredCtrl.requestPasswordReset);
    router[method('USN_FGT')](endpoint('USN_FGT'), auth('USN_FGT'), CredCtrl.forgotUsername);

    return router;

};