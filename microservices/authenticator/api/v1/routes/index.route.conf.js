const Route = require('../../../../../_repo/interfaces/route.interface');
const AuthCtrl = require('../controllers/auth.controller');
const CredCtrl = require('../controllers/credentials.controller');

module.exports = [

    new Route('LOGIN', 'post', '/login', AuthCtrl.login),
    new Route('REG', 'post', '/registration/:hash', AuthCtrl.finishRegistration),
    new Route('REG_REQ', 'post', '/registration-request', AuthCtrl.requestRegistration),

    new Route('PWD_RES', 'post', '/credentials/password-reset/:hash', CredCtrl.resetPassword),
    new Route('PWD_FGT', 'post', '/credentials/forgotten-password', CredCtrl.requestPasswordReset),
    new Route('USN_FGT', 'post', '/credentials/forgotten-username', CredCtrl.forgotUsername),

    new Route('TKN_AUTH', 'get', '/authenticate-token', AuthCtrl.tokenCheck)

];