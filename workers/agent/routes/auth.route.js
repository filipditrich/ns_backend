
const router = require('express').Router();
const BaseCtrl = require('../../../common/controllers/base.controller');
const StrategiesCtrl = require('../../../common/controllers/strategies.controller');
const AuthCtrl = require('../controllers/authentication.controller');
const codes = require('../../../common/assets/codes');
const AUTH = require('../config/endpoints.config').API.AUTH;
const REQ = require('../config/endpoints.config').API.AUTH.REQUEST;
const RequestRoutes = router;

module.exports = function (req, res, next) {

    // Login
    router[AUTH.LOGIN.meta.method]
    (`/${AUTH.LOGIN.endpoint}`, StrategiesCtrl.requireLogin, AuthCtrl.login);

    // Register Request
    RequestRoutes[REQ.REGISTRATION.meta.method]
    (`/${REQ.REGISTRATION.endpoint}`, AuthCtrl.requestRegistration);

    // Password Reset
    RequestRoutes[REQ.PASSWORD_RESET.meta.method]
    (`/${REQ.PASSWORD_RESET.endpoint}`, AuthCtrl.requestPasswordReset);

    RequestRoutes[REQ.PASSWORD_RESET.meta.method]
    (`/${REQ.PASSWORD_RESET.endpoint}/:hash`, AuthCtrl.resetPassword); // TODO - password reset notify? idk

    // Forgot Username
    RequestRoutes[REQ.FORGOTTEN_USERNAME.meta.method]
    (`/${REQ.FORGOTTEN_USERNAME.endpoint}`, AuthCtrl.forgotUsername);

    // -> Request Routes
    router.use(`/${REQ.endpoint}`, RequestRoutes);

    // Finish registration
    router[AUTH.REGISTER.meta.method]
    (`/${AUTH.REGISTER.endpoint}/:hash`, AuthCtrl.finishRegistration);

    router[AUTH.REGISTER_CHECK.meta.method](`/${AUTH.REGISTER_CHECK.endpoint}/:hash`, AuthCtrl.preFinishRegistration);

    // TODO - delete x transport
    // Tests
    // router.get('/protected', StrategiesCtrl.authenticateToken, (req, res) => res.send("Protected AREA"));
    // router.get('/admin', StrategiesCtrl.authenticateToken, StrategiesCtrl.roleAuthorization(['admin']), (req, res) => res.send("Admin AREA"));
    // router.post('/secret', StrategiesCtrl.authenticateToken, StrategiesCtrl.requireSecret, (req, res) => res.json(codes));

    // Invalid Endpoints
    router.use((req, res, next) => BaseCtrl.invalidEndpoint(req, res, next));

    return router;

};