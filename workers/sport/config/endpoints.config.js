const IEndpoint = require('../../../common/config/endpoint.interface');

/**
 * @description Endpoint Route Configuration
 * @author filipditrich
 * @type {{API: Endpoint}}
 */
module.exports = {

    API: new IEndpoint('API', 'api', [
        { id: 'MATCHES', endpoint: new IEndpoint('MATCHES', 'matches', [
                { id: 'CRUD', endpoint: new IEndpoint('CRUD', 'crud') }
            ])}
    ])

};