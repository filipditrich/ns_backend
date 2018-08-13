const router = require('express').Router();
const CredCtrl = require('../controllers/credentials.controller');
const worker = require('../config/worker.config').worker().id;
const _method = require('../../../common/helpers/route.helper').getRouteMethod;
const method = function(id) { return _method(id, worker) };
const _endpoint = require('../../../common/helpers/route.helper').getRouteEndpoint;
const endpoint = function(id) { return _endpoint(id, worker) };
const _auth = require('../../../common/helpers/route.helper').getRouteAuth;
const auth = function(id) { return _auth(id, worker) };

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