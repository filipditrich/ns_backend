const IEndpoint = require('../../../common/config/endpoint.interface');
const enums = require('../../../common/assets/enums');
const noChildren = false;
const post = enums.METHODS.post.value;
const use = enums.METHODS.use.value;

/**
 * @description Endpoints configuration for Auth Worker
 * @author filipditrich
 * @type {{IEndpoint[]}}
 */
module.exports = {

    LOGIN: new IEndpoint('LOGIN', 'login', noChildren, { method: post, authorization: false }),
    REGISTRATION: new IEndpoint('REG_FIN', 'registration/:hash', noChildren, { method: post, authorization: false }),
    REGISTRATION_REQUEST: new IEndpoint('REG_REQ', 'registration-request', noChildren, { method: post, authorization: false }),

    CREDENTIALS: new IEndpoint('CREDS', 'credentials', [
        { id: 'PASSWORD_RESET', endpoint: new IEndpoint('PWD_RES', 'password-reset/:hash', noChildren, { method: post, authorization: false }) },
        { id: 'FORGOTTEN_PASSWORD', endpoint: new IEndpoint('PWD_FGT', 'forgotten-password', noChildren, { method: post, authorization: false }) },
        { id: 'FORGOTTEN_USERNAME', endpoint: new IEndpoint('USN_FGT', 'forgotten-username', noChildren, { method: post, authorization: false }) }
    ], { method: use, authorization: false })

};