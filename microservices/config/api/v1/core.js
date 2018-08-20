const router = require('express').Router();
const genericRouteHelper = require('../../../../_repo/helpers/route.helper');
genericRouteHelper.importRoutes(require('./routes/index.route.conf'));


module.exports = function (app) {

    /** Route Handler **/
    router.use(genericRouteHelper.genericRouteHandler);

    return router;

};