const router = require('express').Router();
const endpoints = require('../config/endpoints.config');
const AssemblyCtrl = require('../controllers/assembly.controller');
const StrategiesCtrl = require('../../../common/controllers/strategies.controller');
const proxy = require('express-http-proxy');

/**
 * @description Assembly Routing
 * @author filipditrich
 * @param req
 * @param res
 * @param next
 * @returns {Router|router}
 */
module.exports = function (req, res, next) {


    router[endpoints.API.ASSEMBLY.ROUTES.meta.method]
    (`/${endpoints.API.ASSEMBLY.ROUTES.endpoint}/:worker`, AssemblyCtrl.exportRoutes);

    router[endpoints.API.ASSEMBLY.CODES.meta.method]
    (`/${endpoints.API.ASSEMBLY.CODES.endpoint}`, AssemblyCtrl.exportCodes);

    router[endpoints.API.ASSEMBLY.VARIABLES.meta.method]
    (`/${endpoints.API.ASSEMBLY.VARIABLES.endpoint}`, proxy('http://localhost:3002/api/matches/crud/teams'));


    return router;

};