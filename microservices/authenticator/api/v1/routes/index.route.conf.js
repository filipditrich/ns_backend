const Route = require('../../../../../_repo/interfaces/route.interface');
const AuthCtrl = require('../controllers/user/auth.controller');
const CredCtrl = require('../controllers/user/credentials.controller');
const SysCtrl = require('../controllers/sys.controller');

const AdminRegReqCtrl = require('../controllers/admin/registration-requests.controller');

const commonEnums = require('../../../../../_repo/assets/system-enums.asset');
const adminAndMods = [ commonEnums.AUTH.ROLES.admin.key, commonEnums.AUTH.ROLES.super.key, commonEnums.AUTH.ROLES.moderator.key ];
const everybody = [ commonEnums.AUTH.ROLES.admin.key, commonEnums.AUTH.ROLES.super.key, commonEnums.AUTH.ROLES.moderator.key, commonEnums.AUTH.ROLES.player.key ];

// TODO: export routes from multiple config files
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

    /** ADMIN **/
    new Route('ADMIN_REG_REQ_APPROVE', 'post', '/admin/registration-requests/approve/:hash', AdminRegReqCtrl.approveRegistrationRequest, { doesRequireToken: true, authRoles: adminAndMods })

];