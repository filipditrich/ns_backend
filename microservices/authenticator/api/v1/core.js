const router = require('express').Router();
const StrategiesCtrl = require('../../../../_repo/controllers/strategies.controller');
const serviceConfig = require('./config/self.config');
const routes = require('./routes/index.route.conf');
const _ = require('lodash');

module.exports = function (app) {

    /** API Consumer Authorization **/
    router.use((req, res, next) => { StrategiesCtrl.apiConsumers(req, res, next, serviceConfig) });

    /** Route Handler **/
    router.use((req, res, next) => {

        const match = _.find(routes, route => {
            return (new RegExp(route.regExp)).test(req.path) && route.method.toUpperCase() === req.method;
        });

        if (match) {

            const params = (new RegExp(match.regExp)).exec(req.path);
            params.shift(); // get rid of the full match (leaves only the params)

            match.path.split("/").filter(x => x.startsWith(":")).forEach((param, i) => {
                param = param.substring(1);
                req.params[param] = params[i];
            });

            const pre = [];
            _.forEach(match.pre, p => pre.push(p(req, res, next)));

            Promise.all(pre).then(() => {

                try {
                    match.controller(req, res, next);
                } catch (error) {
                    return next(error);
                }

            }).catch(error => {
                return next(error);
            });


        } else {
            next();
        }

    });

    return router;

};