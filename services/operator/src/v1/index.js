const router = require('express').Router();
const _ = require('lodash');
const genericRouteHelper = require('northernstars-shared').routeHelper;


genericRouteHelper.importRoutes(_.clone(require('./routes/index.route.conf'), true));


module.exports = function (app) {

    /** Route Handler **/
    router.use(genericRouteHelper.genericRouteHandler);

    return router;

};