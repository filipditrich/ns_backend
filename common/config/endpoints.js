const enums = require('../assets/enums');
const IEndpoint = require('../config/endpoint.interface');

module.exports = {
    API: new IEndpoint('api', [
        { id: 'AUTH', endpoint: new IEndpoint('auth', [
                { id: 'LOGIN', endpoint: new IEndpoint('login', false, { method: enums.METHODS.post.value, authorization: false }) },
                { id: 'REGISTER', endpoint: new IEndpoint('register/:registrationHash', false, { method: enums.METHODS.post.value, authorization: false } ) },
                { id: 'REQUEST', endpoint: new IEndpoint('request', [
                        { id: 'REGISTRATION', endpoint: new IEndpoint('registration', false, { method: enums.METHODS.post.value, authorization: false }) },
                        { id: 'PASSWORD_RESET', endpoint: new IEndpoint('password-reset', [
                                { id: 'PASSWORD_RESET_HASH', endpoint: new IEndpoint(':hash', false, { method: enums.METHODS.post.value, authorization: false }) }
                            ], { method: enums.METHODS.post.value, authorization: false }) },
                        { id: 'FORGOTTEN_USERNAME', endpoint: new IEndpoint('forgotten-username', false, { method: enums.METHODS.post.value, authorization: false }) }
                    ])}
                ])},
        { id: 'ADMIN', endpoint: new IEndpoint('admin', [
                { id: 'REGISTRATION_REQUESTS', endpoint: new IEndpoint('registration-requests', [
                        { id: 'APPROVE', endpoint: new IEndpoint('approve', [
                                { id: 'APPROVE_HASH', endpoint: new IEndpoint(':hash', false, { method: enums.METHODS.put.value, authorization: enums.AUTH.ROLES.admin.value }) }
                            ] ) }
                    ])  }
            ])}
    ])
};
