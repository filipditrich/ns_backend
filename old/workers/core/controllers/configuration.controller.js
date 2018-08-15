const _ = require('lodash');
const codes = require('../../../common/assets/codes');
const commonConfig = require('../../../common/config/common.config');
const commonEndpoints = require('../../../common/config/endpoints.config');
const env = require('../config/worker.config').environment();
const errorHelper = require('../../../common/helpers/error.helper');
const routeHelper = require('../../../common/helpers/route.helper');


/**
 * @description Export All Endpoints
 * @param req
 * @param res
 * @param next
 */
exports.exportRoutes = (req, res, next) => {

    const promises = [];

    _.forEach(commonConfig[env].workers, worker => {
        promises.push(new Promise((resolve, reject) => {
            const endpoints = require(`../../${worker.id}/config/endpoints.config`);
            routeHelper.matrix(endpoints, null, 'each', endpoints, worker.id)
                .then(() => { commonEndpoints[worker.id] = endpoints; resolve() })
                .catch(error => { reject(error) });
        }));
    });

    Promise.all(promises).then(() => {
        res.json({
            response: codes.RESOURCE.LOADED,
            output: require('../../../common/config/endpoints.config')
        });
    }).catch(error => { return next(errorHelper.prepareError(error)) });

};

/**
 * @description Exports Server Response Codes
 * @param req
 * @param res
 * @param next
 */
exports.exportCodes = (req, res, next) => {

    res.json({
        response: codes.RESOURCE.LOADED,
        output: codes
    });

};
