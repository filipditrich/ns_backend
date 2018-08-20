const Route = require('../../../../../_repo/interfaces/route.interface');
const AuthCtrl = require('../controllers/auth.controller');
const CredCtrl = require('../controllers/credentials.controller');
const SysCtrl = require('../controllers/sys.controller');

module.exports = [

    /** BASIC AUTH ROUTES **/
    new Route('LOGIN', 'post', '/login', AuthCtrl.login),
    new Route('REG', 'post', '/registration/:hash', AuthCtrl.finishRegistration),
    new Route('REG_REQ', 'post', '/registration-request', AuthCtrl.requestRegistration),
    new Route('REQ_REQ_GET', 'get', '/registration-request/:hash', AuthCtrl.preFinishRegistration),

    /** CREDENTIAL ROUTES **/
    new Route('PWD_RES', 'post', '/credentials/password-reset/:hash', CredCtrl.resetPassword),
    new Route('PWD_FGT', 'post', '/credentials/forgotten-password', CredCtrl.requestPasswordReset),
    new Route('USN_FGT', 'post', '/credentials/forgotten-username', CredCtrl.forgotUsername),

    /** TOKEN AUTH **/
    new Route('TKN_AUTH', 'get', '/authenticate-token', AuthCtrl.tokenCheck),

    /** SYSTEM ROUTES **/
    new Route('EPT_CODES', 'get', '/sys/export/codes', SysCtrl.exportCodes),
    new Route('EPT_ROUTES', 'get', '/sys/export/routes', SysCtrl.exportRoutes),
    new Route('EXIST_CHECK', 'post', '/sys/exist-check/:schema', SysCtrl.existCheck),

];