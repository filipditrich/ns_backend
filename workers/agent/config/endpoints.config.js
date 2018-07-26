const IEndpoint = require('../../../common/config/endpoint.interface');
const enums = require('../../../common/assets/enums');

module.exports = {

    API: new IEndpoint('API', 'api', [
        { id: 'AUTH', endpoint: new IEndpoint('AUTH', 'auth', [
                { id: 'LOGIN', endpoint: new IEndpoint('LOGIN', 'login', false, { method: enums.METHODS.post.value, authorization: false }) },
                { id: 'REGISTER', endpoint: new IEndpoint('REG', 'register', false, { method: enums.METHODS.post.value, authorization: false } ) },
                { id: 'REGISTER-CHECK', endpoint: new IEndpoint('REG_CHECK', 'register-check', false, { method: enums.METHODS.get.value, authorization: false }) },
                { id: 'REQUEST', endpoint: new IEndpoint('REQ', 'request', [
                        { id: 'REGISTRATION', endpoint: new IEndpoint('REG_REQ', 'registration', false, { method: enums.METHODS.post.value, authorization: false }) },
                        { id: 'PASSWORD-RESET', endpoint: new IEndpoint('PWD_R', 'password-reset', false, { method: enums.METHODS.post.value, authorization: false }) },
                        { id: 'PASSWORD-RESET-CHECK', endpoint: new IEndpoint('PWD_R_CHECK', 'password-reset-check', false, { method: enums.METHODS.get.value, authorization: false }) },
                        { id: 'FORGOTTEN-USERNAME', endpoint: new IEndpoint('USN_R', 'forgotten-username', false, { method: enums.METHODS.post.value, authorization: false }) }
                    ])}
            ])},
        { id: 'ADMIN', endpoint: new IEndpoint('ADMIN', 'admin', [
                { id: 'REGISTRATION-REQUESTS', endpoint: new IEndpoint('REG_REQS', 'registration-requests', [
                        { id: 'APPROVE', endpoint: new IEndpoint('APPROVE', 'approve', false, { method: enums.METHODS.put.value, authorization: enums.AUTH.ROLES.admin.value })},
                        { id: 'LIST', endpoint: new IEndpoint('LIST_REQS', 'list', false, { method: enums.METHODS.get.value, authorization: enums.AUTH.ROLES.admin.value })}
                    ])}
            ], { method: false, authorization: enums.AUTH.ROLES.admin.value })}
    ])

};
