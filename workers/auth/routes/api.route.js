const express = require('express');
const router = express.Router();
const BaseCtrl = require('../../../common/controllers/base.controller');
const AuthCtrl = require('../controllers/auth.controller');
const requireLogin = require('../../../common/controllers/strategies.controller').requireLogin;
const API = router;
const worker = require('../config/worker.config').worker().id;
const CredRoute = require('./credentials.route');
const _method = require('../../../common/helpers/route.helper').getRouteMethod;
const method = function(id) { return _method(id, worker) };
const _endpoint = require('../../../common/helpers/route.helper').getRouteEndpoint;
const endpoint = function(id) { return _endpoint(id, worker) };
const _auth = require('../../../common/helpers/route.helper').getRouteAuth;
const auth = function(id) { return _auth(id, worker) };

/**
 * @description Auth API
 * @author filipditrich
 * @param req
 * @param res
 * @param next
 * @returns {Router|router}
 */
module.exports = function (app) {


    API[method('LOGIN')](endpoint('LOGIN'), auth('LOGIN'), requireLogin, AuthCtrl.login);
    router[method('REG_FIN')](endpoint('REG_FIN'), auth('REG_FIN'), AuthCtrl.finishRegistration);
    router[method('REG_REQ')](endpoint('REG_REQ'), auth('REG_REQ'), AuthCtrl.requestRegistration);
    router[method('CREDS')](endpoint('CREDS'), auth('CREDS'), CredRoute(app));


    // Invalid Endpoints
    router.use((req, res, next) => BaseCtrl.invalidEndpoint(req, res, next));

    return router;

};