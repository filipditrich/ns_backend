const IEndpoint = require('../../../common/config/endpoint.interface');
const enums = require('../../../common/assets/enums');

/**
 * @description Endpoint Route Configuration
 * @author filipditrich
 * @type {{API: Endpoint}}
 */
module.exports = {

    API: new IEndpoint('API', 'api', [
        { id: 'ASSEMBLY', endpoint: new IEndpoint('ABLY', 'assembly', [
                { id: 'ROUTES', endpoint: new IEndpoint('ABLY_ROUTES', 'routes', false, { method: 'get', authorization: false }) },
                { id: 'CODES', endpoint: new IEndpoint('ABLY_CODES', 'codes', false, { method: 'get', authorization: false }) },
                { id: 'VARIABLES', endpoint: new IEndpoint('ABLY_VARIABLES', 'variables', false, { method: 'get', authorization: false }) }
            ])},
    ])

};