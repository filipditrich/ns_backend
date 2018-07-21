const router = require('express').Router();
const endpoints = require('../config/endpoints.config');
const AssemblyCtrl = require('../controllers/assembly.controller');
const StrategiesCtrl = require('../../../common/controllers/strategies.controller');

module.exports = function (req, res, next) {


    router[endpoints.API.ASSEMBLY.ROUTES.meta.method]
    (`/${endpoints.API.ASSEMBLY.ROUTES.endpoint}/:worker`, AssemblyCtrl.exportRoutes);

    router[endpoints.API.ASSEMBLY.CODES.meta.method]
    (`/${endpoints.API.ASSEMBLY.CODES.endpoint}`, StrategiesCtrl.requireSecret, AssemblyCtrl.exportCodes);


    return router;

};