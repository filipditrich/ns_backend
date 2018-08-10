
const router = require('express').Router();
const BaseCtrl = require('../../../common/controllers/base.controller');
const StrategiesCtrl = require('../../../common/controllers/strategies.controller');
const AuthCtrl = require('../controllers/authentication.controller');
const codes = require('../../../common/assets/codes');
const AUTH = require('../config/endpoints.config').API.AUTH;
const REQ = require('../config/endpoints.config').API.AUTH.REQUEST;
const RequestRoutes = router;

/**
 * @description Authentication Routing
 * @author filipditrich
 * @param req
 * @param res
 * @param next
 * @returns {Router|router}
 */
module.exports = function (req, res, next) {

    // Login
    router[AUTH.LOGIN.meta.method]
    (`/${AUTH.LOGIN.endpoint}`, StrategiesCtrl.requireLogin, AuthCtrl.login);

    // Register Request
    RequestRoutes[REQ.REGISTRATION.meta.method]
    (`/${REQ.REGISTRATION.endpoint}`, AuthCtrl.requestRegistration);

    // Password Reset
    RequestRoutes[REQ['PASSWORD-RESET'].meta.method]
    (`/${REQ['PASSWORD-RESET'].endpoint}`, AuthCtrl.requestPasswordReset);

    RequestRoutes[REQ['PASSWORD-RESET'].meta.method]
    (`/${REQ['PASSWORD-RESET'].endpoint}/:hash`, AuthCtrl.resetPassword); // TODO - password reset notify? idk

    RequestRoutes[REQ['PASSWORD-RESET-CHECK'].meta.method]
    (`/${REQ['PASSWORD-RESET-CHECK'].endpoint}/:hash`, AuthCtrl.preResetPassword);

    // Forgot Username
    RequestRoutes[REQ['FORGOTTEN-USERNAME'].meta.method]
    (`/${REQ['FORGOTTEN-USERNAME'].endpoint}`, AuthCtrl.forgotUsername);

    // -> Request Routes
    router.use(`/${REQ.endpoint}`, RequestRoutes);

    // Finish registration
    router[AUTH.REGISTER.meta.method]
    (`/${AUTH.REGISTER.endpoint}/:hash`, AuthCtrl.finishRegistration);

    router[AUTH['REGISTER-CHECK'].meta.method](`/${AUTH['REGISTER-CHECK'].endpoint}/:hash`, AuthCtrl.preFinishRegistration);

    // Invalid Endpoints
    router.use((req, res, next) => BaseCtrl.invalidEndpoint(req, res, next));

    return router;

};