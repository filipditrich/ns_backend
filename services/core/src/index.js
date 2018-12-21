const router = require('express').Router();
const _ = require('lodash');
const genericRouteHelper = require('northernstars-shared').routeHelper;

/**
 * @description Import Routes and Settings
 */
genericRouteHelper.importRoutes(_.clone(require('./routes/index.route.conf'), true));
genericRouteHelper.importSettings(_.clone(require('./config/settings.config'), true));

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