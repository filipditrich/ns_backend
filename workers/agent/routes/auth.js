const router = require('express').Router();
const BaseCtrl = require('../../../common/controllers/base');
const StrategiesCtrl = require('../../../common/controllers/strategies');
const AuthCtrl = require('../controllers/authentication');
const codes = require('../../../common/assets/codes');

module.exports = function (req, res, next) {

    // Login
    router.post('/login', StrategiesCtrl.requireLogin, AuthCtrl.login);

    // Registration
    router.post('/request/registration', AuthCtrl.requestRegistration); // TODO - send email to user that the registration has been successfully processed
    router.post('/register/:registrationHash', AuthCtrl.finishRegistration); // TODO - send email to the newly registered user

    // Password Reset
    router.post('/request/password-reset', AuthCtrl.requestPasswordReset); // TODO - send mail with hash in url
    router.post('/request/password-reset/:resetHash', AuthCtrl.resetPassword);

    // Forgot Username
    router.post('/request/forgot-username/', AuthCtrl.forgotUsername); // TODO - send mail with username

    // Tests
    router.get('/protected', StrategiesCtrl.authenticateToken, (req, res) => res.send("Protected AREA"));
    router.get('/admin', StrategiesCtrl.authenticateToken, StrategiesCtrl.roleAuthorization(['admin']), (req, res) => res.send("Admin AREA"));
    router.post('/secret', StrategiesCtrl.authenticateToken, StrategiesCtrl.requireSecret, (req, res) => res.json(codes));

    // Invalid Endpoints
    router.use((req, res, next) => BaseCtrl.invalidEndpoint(req, res, next));

    return router;

};