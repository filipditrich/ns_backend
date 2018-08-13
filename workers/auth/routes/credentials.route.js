const router = require('express').Router();
const CredCtrl = require('../controllers/credentials.controller');
const endpoints = require('../config/endpoints.config');
const _method = require('../../../common/helpers/route.helper').getRouteMethod;
const method = function(id) { return _method(id, endpoints) };
const _endpoint = require('../../../common/helpers/route.helper').getRouteEndpoint;
const endpoint = function(id) { return _endpoint(id, endpoints) };
const _auth = require('../../../common/helpers/route.helper').getRouteAuth;
const auth = function(id) { return _auth(id, endpoints) };

/**
 * @description Credentials Sub-Route of Auth Worker
 * @author filipditrich
 * @param req
 * @param res
 * @param next
 * @returns {Router|router}
 */
module.exports = function (req, res, next) {

    router[method('PWD_RES')](endpoint('PWD_RES'), auth('PWD_RES'), CredCtrl.resetPassword);
    router[method('PWD_FGT')](endpoint('PWD_FGT'), auth('PWD_FGT'), CredCtrl.requestPasswordReset);
    router[method('USN_FGN')](endpoint('USN_FGN'), auth('USN_FGN'), CredCtrl.forgotUsername);

    return router;

};