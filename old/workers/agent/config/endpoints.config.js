const IEndpoint = require('../../../common/config/endpoint.interface');
const enums = require('../../../common/assets/enums');
const noChildren = false;
const _post = enums.METHODS.post.value;
const _use = enums.METHODS.use.value;
const _get = enums.METHODS.get.value;
const _put = enums.METHODS.put.value;
const _delete = enums.METHODS.delete.value;
const anybody = 'anybody';
const AuthCtrl = require('../controllers/auth.controller');
const requireLogin = require('../../../common/controllers/strategies.controller').requireLogin;

/**
 * @description Endpoints configuration for Auth Worker
 * @author filipditrich
 * @type {{IEndpoint[]}}
 */
module.exports = {

    AUTH: new IEndpoint('AUTH', 'auth', [
        {
            id: 'LOGIN',
            endpoint: new IEndpoint('LOGIN', 'login', noChildren, {
                method: _post,
                doesRequireToken: false,
                doesRequireSecret: false,
                authRoles: anybody,
                optionalMiddleware: requireLogin,
                controllerFunction: AuthCtrl.login,
            })
        },
        // { id: 'REGISTRATION', endpoint: new IEndpoint('REG_FIN', 'registration/:hash', noChildren, { method: _post, authorization: anybody }) },
        // { id: 'REGISTRATION_REQUESTS', endpoint: new IEndpoint('REG_REQ', 'registration-request', noChildren, { method: _post, authorization: anybody }) },
        // { id: 'CREDENTIALS', endpoint: new IEndpoint('CREDS', 'credentials', [
        //     { id: 'PASSWORD_RESET', endpoint: new IEndpoint('PWD_RES', 'password-reset/:hash', noChildren, { method: _post, authorization: anybody }) },
        //     { id: 'FORGOTTEN_PASSWORD', endpoint: new IEndpoint('PWD_FGT', 'forgotten-password', noChildren, { method: _post, authorization: anybody }) },
        //     { id: 'FORGOTTEN_USERNAME', endpoint: new IEndpoint('USN_FGT', 'forgotten-username', noChildren, { method: _post, authorization: anybody }) }
        // ], { method: _use, authorization: anybody })}
    ], {
        method: _use,
        doesRequireToken: false,
        doesRequireSecret: false,
        authRoles: anybody,
        controllerFunction: require('../controllers/auth.controller'),
    }),

};