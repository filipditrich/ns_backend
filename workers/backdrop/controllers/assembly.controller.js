const enums = require('../../../common/assets/enums');
const path = require('path');
const BaseCtrl = require('../../../common/controllers/base.controller');
const codes = require('../../../common/assets/codes');
const routeHelper = require('../../../common/helpers/route.helper');
const errorHelper = require('../../../common/helpers/error.helper');
const proxy = require('express-http-proxy');

/**
 * @description Export Server Routes
 * @param req
 * @param res
 * @param next
 */
exports.exportRoutes = (req, res, next) => {

    let type = req.params['worker'];

    if (type === enums.WORKERS.agent.value) {

        const endpointsRaw = require(path.join(__dirname, '../../agent/config/endpoints.config'));
        routeHelper.matrix(endpointsRaw, null, 'each', endpointsRaw)
            .then(() => {
                res.json({
                    response: codes.RESOURCE.LOADED,
                    endpoints: endpointsRaw
                });
            })
            .catch(error => {
                return next(errorHelper.prepareError(error))
            });

    } else if (type === enums.WORKERS.sport.value) {

        const endpointsRaw = require(path.join(__dirname, '../../sport/config/endpoints.config'));
        routeHelper.matrix(endpointsRaw, null, 'each', endpointsRaw)
            .then(() => {
                res.json({
                    response: codes.RESOURCE.LOADED,
                    endpoints: endpointsRaw
                });
            })
            .catch(error => {
                return next(errorHelper.prepareError(error))
            });

    } else if (type === enums.WORKERS.backdrop.value) {

        const endpoints = require(path.join(__dirname, '../config/endpoints.config'));
        res.json({
            response: codes.RESOURCE.LOADED,
            endpoints: endpoints
        });

    } else {
        BaseCtrl.invalidEndpoint(req, res, next);
    }

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
        codes: codes
    });

};

exports.exportVariables = (req, res, next) => {

    proxy('http://localhost:3002/api/matches/crud/teams');

};
