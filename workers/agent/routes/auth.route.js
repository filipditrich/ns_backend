const router = require('express').Router();
const BaseCtrl = require('../../../common/controllers/base.controller');
const StrategiesCtrl = require('../../../common/controllers/strategies.controller');
const AuthCtrl = require('../controllers/authentication.controller');
const codes = require('../../../common/assets/codes');
const endpoints = require('../config/endpoints.config');
const RequestRoutes = router;

module.exports = function (req, res, next) {

    // Login
    router[endpoints.API.AUTH.LOGIN.meta.method]
    (`/${endpoints.API.AUTH.LOGIN.endpoint}`, StrategiesCtrl.requireLogin, AuthCtrl.login);

    // Register Request
    RequestRoutes[endpoints.API.AUTH.REQUEST.REGISTRATION.meta.method]
    (`/${endpoints.API.AUTH.REQUEST.REGISTRATION.endpoint}`, AuthCtrl.requestRegistration);

    // Password Reset
    RequestRoutes[endpoints.API.AUTH.REQUEST.PASSWORD_RESET.meta.method]
    (`/${endpoints.API.AUTH.REQUEST.PASSWORD_RESET.endpoint}`, AuthCtrl.requestPasswordReset);

    RequestRoutes[endpoints.API.AUTH.REQUEST.PASSWORD_RESET.meta.method]
    (`/${endpoints.API.AUTH.REQUEST.PASSWORD_RESET.endpoint}/:hash`, AuthCtrl.resetPassword); // TODO - password reset notify? idk

    // Forgot Username
    RequestRoutes[endpoints.API.AUTH.REQUEST.FORGOTTEN_USERNAME.meta.method]
    (`/${endpoints.API.AUTH.REQUEST.FORGOTTEN_USERNAME.endpoint}`, AuthCtrl.forgotUsername);

    // -> Request Routes
    router.use(`/${endpoints.API.AUTH.REQUEST.endpoint}`, RequestRoutes);

    // Finish registration
    router[endpoints.API.AUTH.REGISTER.meta.method]
    (`/${endpoints.API.AUTH.REGISTER.endpoint}/:hash`, AuthCtrl.finishRegistration);

    // TODO - delete x transport
    // Tests
    router.get('/protected', StrategiesCtrl.authenticateToken, (req, res) => res.send("Protected AREA"));
    router.get('/admin', StrategiesCtrl.authenticateToken, StrategiesCtrl.roleAuthorization(['admin']), (req, res) => res.send("Admin AREA"));
    router.post('/secret', StrategiesCtrl.authenticateToken, StrategiesCtrl.requireSecret, (req, res) => res.json(codes));

    // Invalid Endpoints
    router.use((req, res, next) => BaseCtrl.invalidEndpoint(req, res, next));

    return router;

};