const IEndpoint = require('../../../common/config/endpoint.interface');
const enums = require('../../../common/assets/enums');

module.exports = {

    API: new IEndpoint('api', [
        { id: 'ASSEMBLY', endpoint: new IEndpoint('assembly', [
                { id: 'ROUTES', endpoint: new IEndpoint('routes', false, { method: 'get', authorization: false }) },
                { id: 'CODES', endpoint: new IEndpoint('codes', false, { method: 'get', authorization: false }) },
            ])}
    ])

};