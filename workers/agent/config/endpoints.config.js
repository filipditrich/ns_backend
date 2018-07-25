const IEndpoint = require('../../../common/config/endpoint.interface');
const enums = require('../../../common/assets/enums');

module.exports = {

    API: new IEndpoint('API', 'api', [
        { id: 'AUTH', endpoint: new IEndpoint('AUTH', 'auth', [
                { id: 'LOGIN', endpoint: new IEndpoint('LOGIN', 'login', false, { method: enums.METHODS.post.value, authorization: false }) },
                { id: 'REGISTER', endpoint: new IEndpoint('REG', 'register', false, { method: enums.METHODS.post.value, authorization: false } ) },
                { id: 'REGISTER_CHECK', endpoint: new IEndpoint('REG_CHECK', 'register_check', false, { method: enums.METHODS.get.value, authorization: false }) },
                { id: 'REQUEST', endpoint: new IEndpoint('REQ', 'request', [
                        { id: 'REGISTRATION', endpoint: new IEndpoint('REG_REQ', 'registration', false, { method: enums.METHODS.post.value, authorization: false }) },
                        { id: 'PASSWORD_RESET', endpoint: new IEndpoint('PWD_R', 'password_reset', false, { method: enums.METHODS.post.value, authorization: false }) },
                        { id: 'FORGOTTEN_USERNAME', endpoint: new IEndpoint('USN_R', 'forgotten-username', false, { method: enums.METHODS.post.value, authorization: false }) }
                    ])}
            ])},
        { id: 'ADMIN', endpoint: new IEndpoint('ADMIN', 'admin', [
                { id: 'REGISTRATION_REQUESTS', endpoint: new IEndpoint('REG_REQS', 'registration_requests', [
                        { id: 'APPROVE', endpoint: new IEndpoint('APPROVE', 'approve', false, { method: enums.METHODS.put.value, authorization: enums.AUTH.ROLES.admin.value })}
                    ])}
            ], { method: false, authorization: enums.AUTH.ROLES.admin.value })}
    ])

};
