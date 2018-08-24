const router = require('express').Router();
const _ = require('lodash');
const routes = require('./routes/index.route.conf');
const errorHelper = require('../../../../_repo/helpers/error.helper');
// const genericRouteHelper = require('../../../../_repo/helpers/route.helper');
// genericRouteHelper.importRoutes(require('./routes/index.route.conf'));


module.exports = function (app) {

    /** Route Handler **/
    // This Extends the Generic Route Handler
    router.use((req, res, next) => {

        const match = _.find(routes, route => {
            return (new RegExp(route.regExp)).test(req.path) && route.method.toUpperCase() === req.method;
        });

        if (match) {

            const params = (new RegExp(match.regExp)).exec(req.path);
            params.shift(); // get rid of the full match (leaves only the params)

            match.path.split("/").filter(x => x.startsWith(":")).forEach((param, i) => {
                // format the param (delete ':' selector and delete possible Regular Expression
                param = param.replace(/\((.*?)\)/, "").replace("?", "").replace(":", "");
                req.params[param] = params[i];
            });

            const pre = [];

            if (match.doesRequireToken) {
                const AuthToken = require('./controllers/strategy.controller').authenticateToken;
                pre.push(AuthToken(req, res, next));

            }

            _.forEach(match.pre, p => pre.push(p(req, res, next)));

            Promise.all(pre).then(() => {

                try {
                    match.controller(req, res, next);
                } catch (error) {
                    return next(errorHelper.prepareError(error));
                }

            }).catch(error => {
                return next(errorHelper.prepareError(error));
            });


        } else {
            return next();
        }

    });

    return router;

};