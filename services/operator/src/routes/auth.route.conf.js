const Route = require('northernstars-shared').routeInterface;
const AuthCtrl = require('../controllers/authentication.controller');
const CredCtrl = require('../controllers/credentials.controller');

/**
 * @description API Unsecured Authentication Routes
 */
module.exports = [

    /** Basic Auth Routes **/
    new Route('LOGIN', 'POST', '/auth/login', {}, AuthCtrl.login ),
    new Route('REG', 'POST', '/auth/registration/:hash', {}, AuthCtrl.finishRegistration),
    new Route('REG_REQ', 'POST', '/auth/registration-request', {}, AuthCtrl.requestRegistration),
    new Route('REG_REQ_GET', 'GET', '/auth/registration-request/:hash', {}, AuthCtrl.preFinishRegistration),

    /** Credential Routes **/
    new Route('PWD_RES', 'POST', '/auth/credentials/password-reset/:hash', {}, CredCtrl.resetPassword),
    new Route('PWD_FGT', 'POST', '/auth/credentials/forgotten-password', {}, CredCtrl.requestPasswordReset),
    new Route('USN_FGT', 'POST', '/auth/credentials/forgotten-username', {}, CredCtrl.forgotUsername),

];