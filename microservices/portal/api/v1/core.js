const router = require('express').Router();
const StrategiesCtrl = require('../../../../_repo/controllers/strategies.controller');
const serviceConfig = require('./config/self.config');
const microservices = require('./config/microservices.config');
const request = require('request-promise');
const _ = require('lodash');

module.exports = function (app) {

    /** API Consumer Authorization **/
    router.use((req, res, next) => { StrategiesCtrl.apiConsumers(req, res, next, serviceConfig) });

    /** API Gateway Logic **/
    router.use('/:msvc', (req, res, next) => {
        const match = _.find(microservices, { id: req.params['msvc'] });
        const originalReq = req;

        if (match) {
            const url = req.originalUrl
                .split("/")
                .filter(x => x !== 'api' && x !== "" && x !== match.id && !/v[0-9][0-9]*/.test(x))
                .join("/");

            const redirect = `http://localhost:${match.port}/api/${match.api.version}/${url}`;

            if (match.api.tokenAuth) {
                request.get({
                    uri: 'http://localhost:3001/api/v1/authenticate-token',
                    headers: { 'Authorization': req.headers['authorization'] },
                    json: true
                }).then(response => {

                    try {
                        res.redirect(307, redirect);
                    } catch(error) { return next(error); }

                }).catch(error => {
                    return next(error);
                });
            } else {

                try {
                    res.redirect(307, redirect);
                } catch(error) { return next(error); }

            }

        } else { next(); }

    });

    return router;

};