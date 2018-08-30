const genericRouteHelper = require('northernstars-shared').routeHelper;
const GatewayCtrl = require('./controllers/gateway.controller');
const router = require('express').Router();
const _ = require('lodash');

/**
 * @description Import Routes
 */
genericRouteHelper.importRoutes(_.clone(require('./routes/index.route.conf'), true));

/**
 * @description Main Router Entry
 * @param app
 * @returns {Router|router}
 */
module.exports = function (app) {

    /** Route Handler **/
    router.use(genericRouteHelper.genericRouteHandler);

    /** API Gateway Handler **/
    router.use('/:msvc', GatewayCtrl.gatewayHandler);

    return router;

};