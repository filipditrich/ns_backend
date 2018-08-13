const BaseCtrl = require('../../../common/controllers/base.controller');
const ApiConsumers = require('../../../common/controllers/strategies.controller').apiConsumers;
const apiRoutes = require('./api.route');

/**
 * @description Index Routes
 * @author filipditrich
 * @param app
 */
module.exports = function (app) {

    // Check for all incoming requests -- Very first Express Middleware (for routes)
    app.use((req, res, next) => { ApiConsumers(req, res, next) });

    app.use('/api/', apiRoutes(app));

    // Invalid Endpoints (Routes)
    app.use((req, res, next) => { BaseCtrl.invalidEndpoint(req, res, next) });

    // Response Handler (Errors) -- Final Express Middleware!
    app.use((error, req, res, next) => { BaseCtrl.handleError(error, req, res, next) });

};