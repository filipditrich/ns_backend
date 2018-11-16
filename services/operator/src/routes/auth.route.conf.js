const Route = require('northernstars-shared').routeInterface;
const AuthCtrl = require('../controllers/authentication.controller');
const CredCtrl = require('../controllers/credentials.controller');
const sysEnums = require('northernstars-shared').sysEnums;
const adminAndMods = [ sysEnums.AUTH.ROLES.admin.key, sysEnums.AUTH.ROLES.super.key, sysEnums.AUTH.ROLES.moderator.key ];


/**
 * @description API Unsecured Authentication Routes
 **/
module.exports = [

    /** Basic Auth Routes **/
    new Route('LOGIN', 'POST', '/auth/login', {}, AuthCtrl.login ),
    new Route('REG', 'POST', '/auth/registration/:hash', {}, AuthCtrl.finishRegistration),
    new Route('REG_REQ', 'POST', '/auth/registration-request', {}, AuthCtrl.requestRegistration),
    new Route('ALL_REG_REQ', 'GET', '/auth/all-registration-request', {}, AuthCtrl.getAllRegistrationRequests),
    new Route('REG_REQ_GET', 'GET', '/auth/registration-request/:hash', {}, AuthCtrl.preFinishRegistration),
    new Route('REG_REQ_APR', 'POST', '/auth/registration-approval', {}, AuthCtrl.requestAprroval),
    new Route('EXIST_CHECK', 'POST', '/auth/registration-request-check', {}, AuthCtrl.existCheck),

    /** Credential Routes **/
    new Route('PWD_RES', 'POST', '/auth/credentials/password-reset/:hash', {}, CredCtrl.resetPassword),
    new Route('PWD_FGT', 'POST', '/auth/credentials/forgotten-password', {}, CredCtrl.requestPasswordReset),
    new Route('USN_FGT', 'POST', '/auth/credentials/forgotten-username', {}, CredCtrl.forgotUsername),

    /** Invitation Routes **/
    new Route('INV_REQ', 'POST', '/auth/invitations-request/', {}, AuthCtrl.requestRegistration)
];