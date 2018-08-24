const router = require('express').Router();
const genericRouteHelper = require('../../../../_repo/helpers/route.helper');
const _ = require('lodash');
genericRouteHelper.importRoutes(_.clone(require('./routes/index.route.conf'), true));


module.exports = function (app) {

    /** Route Handler **/
    router.use(genericRouteHelper.genericRouteHandler);

    return router;

};