const router = require('express').Router();
const BaseCtrl = require('../../../common/controllers/base.controller');
const StrategiesCtrl = require('../../../common/controllers/strategies.controller');
const AuthCtrl = require('../controllers/authentication.controller');
const AdminCtrl = require('../controllers/administration.controller');
const codes = require('../../../common/assets/codes');
const enums = require('../../../common/assets/enums');
const endpoints = require('../config/endpoints.config');
const RegistrationRequestRoutes = router;

module.exports = function (req, res, next) {

    // All Admin Routes must be Authorized with valid JWT Token
    // and the logged user must have role of an administrator
    router.use(StrategiesCtrl.authenticateToken, StrategiesCtrl.roleAuthorization([endpoints.API.ADMIN.meta.authorization]));

    // Approve Registration Request
    RegistrationRequestRoutes[endpoints.API.ADMIN['REGISTRATION-REQUESTS'].APPROVE.meta.method]
    (`/${endpoints.API.ADMIN['REGISTRATION-REQUESTS'].APPROVE.endpoint}/:hash`, AdminCtrl.approveRegistration);

    RegistrationRequestRoutes[endpoints.API.ADMIN['REGISTRATION-REQUESTS'].LIST.meta.method]
    (`/${endpoints.API.ADMIN['REGISTRATION-REQUESTS'].LIST.endpoint}`, AdminCtrl.getRequests);

    router.use(`/${endpoints.API.ADMIN['REGISTRATION-REQUESTS'].endpoint}`, RegistrationRequestRoutes);


    // Invalid Endpoints
    router.use((req, res, next) => BaseCtrl.invalidEndpoint(req, res, next));

    return router;

};