const router = require('express').Router();
const StrategiesCtrl = require('../../../../_repo/controllers/strategies.controller');
const serviceConfig = require('./config/self.config');
const microservices = require('../../../../_repo/config/services.config');
const commonConfig = require('../../../../_repo/config/server.config');
const axios = require('axios');
const _ = require('lodash');

module.exports = function (app) {

    /** API Consumer Authorization **/
    router.use((req, res, next) => { StrategiesCtrl.apiConsumers(req, res, next, serviceConfig) });

    /** API Gateway Logic **/
    router.use('/:msvc', (req, res, next) => {
        const match = _.find(microservices, { id: req.params['msvc'] });
        const originalReq = req;
        delete originalReq.headers['content-type'];
        originalReq.headers['X-Microservice-Communication-Secret'] = commonConfig[serviceConfig.environment].secret.microSvcCommunication;

        if (match) {
            const url = originalReq.originalUrl
                .split("/")
                .filter(x => x !== 'api' && x !== "" && x !== match.id && !/v[0-9][0-9]*/.test(x))
                .join("/");

            const redirect = `http://localhost:${match.port}/api/${match.api.version}/${url}`;

            if (match.api.tokenAuth) {
                const authMsvc = _.find(microservices, { id: 'auth' });
                const reqUrl = `http://localhost:${authMsvc.port}/api/${authMsvc.api.version}/${authMsvc.pathToTokenAuth}`;

                axios({
                    method: 'GET',
                    url: reqUrl.toString(),
                    headers: originalReq.headers
                }).then(resp => {

                    axios({
                        method: originalReq.method,
                        url: redirect.toString(),
                        headers: originalReq.headers,
                        data: originalReq.body,
                    }).then(response => {
                        res.json(response.data);
                    }).catch(error => {
                        const err = !!error.response ? !!error.response.data ? !!error.response.data.response ? error.response.data.response : error.response.data : error.response : error;
                        return next(err);
                    });

                }).catch(error => {
                    const err = !!error.response ? !!error.response.data ? !!error.response.data.response ? error.response.data.response : error.response.data : error.response : error;
                    return next(err)
                });

            } else {

                axios({
                    method: originalReq.method,
                    url: redirect.toString(),
                    headers: originalReq.headers,
                    data: originalReq.body,
                }).then(response => {
                    res.json(response.data);
                }).catch(error => {
                    const err = !!error.response ? !!error.response.data ? !!error.response.data.response ? error.response.data.response : error.response.data : error.response : error;
                    return next(err);
                });

            }

        } else { return next(); }

    });

    return router;

};