const _ = require('lodash');
const servicesConfig = require('../../../../../_repo/config/services.config');
const serviceConfig = require('../config/self.config');
const errorHelper = require('../../../../../_repo/helpers/error.helper');
const commonCodes = require('../../../../../_repo/assets/system-codes.asset');
const axios = require('axios');

exports.exportCodes = (req, res, next) => {

    const promises = [];
    const final = {};
    final[serviceConfig.id] = require('../assets/codes.asset');
    final['system'] = commonCodes;

    _.forEach(servicesConfig, svc => {
        promises.push(new Promise((resolve, reject) => {
            if (svc.id === serviceConfig.id) { resolve(); } else {
                const url = `http://localhost:${svc.port}/api/${svc.api.version}/sys/export/codes`;
                delete req.headers['content-type'];

                axios({
                    method: 'GET',
                    url: url.toString(),
                    headers: req.headers
                }).then(response => {
                    final[svc.id] = response.data.output;
                    resolve();
                }).catch(error => {
                    const err = !!error.response ? !!error.response.data ? !!error.response.data.response ? error.response.data.response : error.response.data : error.response : error;
                    const rejectWith = err.name === commonCodes.API.INVALID_ENDPOINT.name ? errorHelper.prepareError(commonCodes.SERVICE.BAD_SYS_ROUTE_CONF, svc.id) : err;
                    reject(rejectWith);
                });
            }
        }));
    });

    Promise.all(promises).then(() => {
        res.json({ response: commonCodes.RESOURCE.LOADED, output: final });
    }).catch(error => {
        return next(error);
    });


};

exports.exportRoutes = (req, res, next) => {

    const promises = [];
    const final = {};
    final[serviceConfig.id] = require('../routes/index.route.conf');

    _.forEach(servicesConfig, svc => {
        promises.push(new Promise((resolve, reject) => {

            if (svc.id === serviceConfig.id) { resolve(); } else {
                const url = `http://localhost:${svc.port}/api/${svc.api.version}/sys/export/routes`;
                delete req.headers['content-type'];

                axios({
                    method: 'GET',
                    url: url.toString(),
                    headers: req.headers
                }).then(response => {
                    final[svc.id] = response.data.output;
                    resolve();
                }).catch(error => {
                    const err = !!error.response ? !!error.response.data ? !!error.response.data.response ? error.response.data.response : error.response.data : error.response : error;
                    const rejectWith = err.name = commonCodes.API.INVALID_ENDPOINT.name ? errorHelper.prepareError(commonCodes.SERVICE.BAD_SYS_ROUTE_CONF, svc.id) : err;
                    reject(rejectWith);
                });
            }
        }));
    });

    Promise.all(promises).then(() => {
        res.json({ response: commonCodes.RESOURCE.LOADED, output: final });
    }).catch(error => {
        return next(error);
    });

};
