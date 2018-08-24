const router = require('express').Router();
const _ = require('lodash');
const genericRouteHelper = require('northernstars-shared').routeHelper;

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

    return router;

};