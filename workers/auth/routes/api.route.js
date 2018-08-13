const router = require('express').Router();
const API = router;
const worker = require('../config/worker.config').worker().id;
const BaseCtrl = require('../../../common/controllers/base.controller');
const AuthCtrl = require('../controllers/auth.controller');
const requireLogin = require('../../../common/controllers/strategies.controller').requireLogin;
const CredRoute = require('./credentials.route');

/**
 * @description Generic Getters
 * @param id
 */
const method = function(id) { return require('../../../common/helpers/route.helper').getRouteMethod(id, worker) };
const endpoint = function(id) { return require('../../../common/helpers/route.helper').getRouteEndpoint(id, worker) };
const auth = function(id) { return require('../../../common/helpers/route.helper').getRouteAuth(id, worker) };

/**
 * @description Auth API
 * @author filipditrich
 * @param app
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