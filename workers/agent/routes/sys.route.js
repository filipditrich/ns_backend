const router = require('express').Router();
const BaseCtrl = require('../../../common/controllers/base.controller');
const StrategiesCtrl = require('../../../common/controllers/strategies.controller');
const codes = require('../../../common/assets/codes');

module.exports = function (req, res, next) {

    router.get('/', (req, res) => res.send("SYSTEM API"));

    // Invalid Endpoints
    router.use((req, res, next) => BaseCtrl.invalidEndpoint(req, res, next));

    return router;

};