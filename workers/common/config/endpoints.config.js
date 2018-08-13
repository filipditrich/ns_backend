const IEndpoint = require('../../../common/config/endpoint.interface');
const enums = require('../../../common/assets/enums');
const noChildren = false;
const _post = enums.METHODS.post.value;
const _use = enums.METHODS.use.value;
const _get = enums.METHODS.get.value;
const _put = enums.METHODS.put.value;
const _delete = enums.METHODS.delete.value;

/**
 * @description Endpoints configuration for Common Worker
 * @author filipditrich
 * @type {{IEndpoint[]}}
 */
module.exports = {

    PLACES: new IEndpoint('PLACES', 'places', [
        { id: 'ADD', endpoint: new IEndpoint('ADD_PLACE', 'add', noChildren, { method: _post, authentication: [ enums.AUTH.ROLES.moderator.value, enums.AUTH.ROLES.admin.value, enums.AUTH.ROLES.superAdmin.value ] }) },
        { id: 'DEL', endpoint: new IEndpoint('DEL_PLACE', 'del:id([a-fA-F0-9]{24})', noChildren, { method: _delete, authentication: [ enums.AUTH.ROLES.moderator.value, enums.AUTH.ROLES.admin.value, enums.AUTH.ROLES.superAdmin.value ] }) },
        { id: 'GET', endpoint: new IEndpoint('GET_PLACE', 'get/:id([a-fA-F0-9]{24})?', noChildren, { method: _get, authentication: false }) },
        { id: 'UPD', endpoint: new IEndpoint('UPD_PLACE', 'upd/:id([a-fA-F0-9]{24})?', noChildren, { method: _put, authentication: [ enums.AUTH.ROLES.moderator.value, enums.AUTH.ROLES.admin.value, enums.AUTH.ROLES.superAdmin.value ] }) }
    ], { method: _use, authorization: false })

};