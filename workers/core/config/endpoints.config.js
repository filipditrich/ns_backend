const IEndpoint = require('../../../common/config/endpoint.interface');
const enums = require('../../../common/assets/enums');
const noChildren = false;
const _post = enums.METHODS.post.value;
const _use = enums.METHODS.use.value;
const _get = enums.METHODS.get.value;
const _put = enums.METHODS.put.value;
const _delete = enums.METHODS.delete.value;

/**
 * @description Endpoints configuration for Core Worker
 * @author filipditrich
 * @type {{IEndpoint[]}}
 */
module.exports = {

    CONF: new IEndpoint('CONF', 'conf', [
        { id: 'WORKERS', endpoint: new IEndpoint('WORKERS', 'workers', false, { method: _get, authorization: false })},
        { id: 'CODES', endpoint: new IEndpoint('CODES', 'codes', false, { method: _get, authorization: false }) },
        { id: 'ENDPOINTS', endpoint: new IEndpoint('ENDPOINTS', 'endpoints', false, { method: _get, authorization: false }) }
    ], { method: _use, authorization: false })

};