const IEndpoint = require('../../../common/config/endpoint.interface');
const enums = require('../../../common/assets/enums');
const noChildren = false;
const _post = enums.METHODS.post.value;
const _use = enums.METHODS.use.value;
const _get = enums.METHODS.get.value;
const _put = enums.METHODS.put.value;
const _delete = enums.METHODS.delete.value;
const anybody = 'anybody';

/**
 * @description Endpoints configuration for Core Worker
 * @author filipditrich
 * @type {{IEndpoint[]}}
 */
module.exports = {

    CONF: new IEndpoint('CONF', 'conf', [
        { id: 'WORKERS', endpoint: new IEndpoint('WORKERS', 'workers', noChildren, { method: _get, authorization: anybody })},
        { id: 'CODES', endpoint: new IEndpoint('CODES', 'codes', noChildren, { method: _get, authorization: anybody }) },
        { id: 'ENDPOINTS', endpoint: new IEndpoint('ENDPOINTS', 'endpoints', noChildren, { method: _get, authorization: anybody }) }
    ], { method: _use, authorization: anybody })

};