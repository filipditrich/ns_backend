const router = require('express').Router();
const BaseCtrl = require('../../../common/controllers/base.controller');
const AuthCtrl = require('../controllers/auth.controller');
const requireLogin = require('../../../common/controllers/strategies.controller').requireLogin;
const API = router;
const CredRoute = require('./credentials.route');
const endpoints = require('../config/endpoints.config');
const _method = require('../../../common/helpers/route.helper').getRouteMethod;
const method = function(id) { return _method(id, endpoints) };
const _endpoint = require('../../../common/helpers/route.helper').getRouteEndpoint;
const endpoint = function(id) { return _endpoint(id, endpoints) };
const _auth = require('../../../common/helpers/route.helper').getRouteAuth;
const auth = function(id) { return _auth(id, endpoints) };

/**
 * @description API Routes for Auth Worker
 * @author filipditrich
 * @param req
 * @param res
 * @param next
 * @returns {Router|router}
 */
module.exports = function (req, res, next) {


    API[method('LOGIN')](endpoint('LOGIN'), auth('LOGIN'), requireLogin, AuthCtrl.login);
    API[method('REG_FIN')](endpoint('REG_FIN'), auth('REG_FIN'), AuthCtrl.finishRegistration);
    API[method('REG_REQ')](endpoint('REG_REQ'), auth('REG_REQ'), AuthCtrl.requestRegistration);
    API[method('CREDS')](endpoint('CREDS'), auth('CREDS'), CredRoute);

    router.use('/api', API);

    // Invalid Endpoints
    router.use((req, res, next) => BaseCtrl.invalidEndpoint(req, res, next));

    return router;

};