const router = require('express').Router();
const endpoints = require('../config/endpoints.config');
const AssemblyCtrl = require('../controllers/assembly.controller');

module.exports = function (req, res, next) {


    router[endpoints.API.ASSEMBLY.ROUTES.meta.method]
    (`/${endpoints.API.ASSEMBLY.ROUTES.endpoint}/:worker`, AssemblyCtrl.exportRoutes);


    return router;

};