const AuthRoute = require('./auth');
const AdminRoute = require('./admin');
const SysRoute = require('./sys');
const BaseCtrl = require('../../../common/controllers/base');
const API = require('express').Router();

module.exports = function (app) {

    // Various API Routes
    API.use('/auth', AuthRoute(app));
    API.use('/admin', AdminRoute(app));
    API.use('/sys', SysRoute(app));

    // Invalid Endpoints (API)
    API.use((req, res, next) => { BaseCtrl.invalidEndpoint(req, res, next) });

    // API Routes
    app.use('/API', API);

    // Invalid Endpoints (Routes)
    app.use((req, res, next) => { BaseCtrl.invalidEndpoint(req, res, next) });

};