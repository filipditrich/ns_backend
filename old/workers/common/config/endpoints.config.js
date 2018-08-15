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
 * @description Endpoints configuration for Common Worker
 * @author filipditrich
 * @type {{IEndpoint[]}}
 */

module.exports = {

    PLACES: new IEndpoint('PLACES', 'places', [
        { id: 'ADD', endpoint: new IEndpoint('ADD_PLACE', 'add', noChildren, { method: _post, authorization: [ enums.AUTH.ROLES.moderator.value, enums.AUTH.ROLES.admin.value, enums.AUTH.ROLES.superAdmin.value ] }) },
        { id: 'DEL', endpoint: new IEndpoint('DEL_PLACE', 'del/:id([a-fA-F0-9]{24})', noChildren, { method: _delete, authorization: [ enums.AUTH.ROLES.moderator.value, enums.AUTH.ROLES.admin.value, enums.AUTH.ROLES.superAdmin.value ] }) },
        { id: 'GET', endpoint: new IEndpoint('GET_PLACE', 'get/:id([a-fA-F0-9]{24})?', noChildren, { method: _get, authorization: anybody }) },
        { id: 'UPD', endpoint: new IEndpoint('UPD_PLACE', 'upd/:id([a-fA-F0-9]{24})', noChildren, { method: _put, authorization: [ enums.AUTH.ROLES.moderator.value, enums.AUTH.ROLES.admin.value, enums.AUTH.ROLES.superAdmin.value ] }) }
    ], { method: _use, authorization: anybody }),

    JERSEYS: new IEndpoint('JERSEYS', 'jerseys', [
        { id: 'ADD', endpoint: new IEndpoint('ADD_JERSEY', 'add', noChildren, { method: _post, authorization: [ enums.AUTH.ROLES.moderator.value, enums.AUTH.ROLES.admin.value, enums.AUTH.ROLES.superAdmin.value ] }) },
        { id: 'DEL', endpoint: new IEndpoint('DEL_JERSEY', 'del/:id([a-fA-F0-9]{24})', noChildren, { method: _delete, authorization: [ enums.AUTH.ROLES.moderator.value, enums.AUTH.ROLES.admin.value, enums.AUTH.ROLES.superAdmin.value ] }) },
        { id: 'GET', endpoint: new IEndpoint('GET_JERSEY', 'get/:id([a-fA-F0-9]{24})?', noChildren, { method: _get, authorization: anybody }) },
        { id: 'UPD', endpoint: new IEndpoint('UPD_JERSEY', 'upd/:id([a-fA-F0-9]{24})', noChildren, { method: _put, authorization: [ enums.AUTH.ROLES.moderator.value, enums.AUTH.ROLES.admin.value, enums.AUTH.ROLES.superAdmin.value ] }) }
    ], { method: _use, authorization: anybody }),

    TEAMS: new IEndpoint('TEAMS', 'teams', [
        { id: 'ADD', endpoint: new IEndpoint('ADD_TEAM', 'add', noChildren, { method: _post, authorization: [ enums.AUTH.ROLES.moderator.value, enums.AUTH.ROLES.admin.value, enums.AUTH.ROLES.superAdmin.value ] }) },
        { id: 'DEL', endpoint: new IEndpoint('DEL_TEAM', 'del/:id([a-fA-F0-9]{24})', noChildren, { method: _delete, authorization: [ enums.AUTH.ROLES.moderator.value, enums.AUTH.ROLES.admin.value, enums.AUTH.ROLES.superAdmin.value ] }) },
        { id: 'GET', endpoint: new IEndpoint('GET_TEAM', 'get/:id([a-fA-F0-9]{24})?', noChildren, { method: _get, authorization: anybody }) },
        { id: 'UPD', endpoint: new IEndpoint('UPD_TEAM', 'upd/:id([a-fA-F0-9]{24})', noChildren, { method: _put, authorization: [ enums.AUTH.ROLES.moderator.value, enums.AUTH.ROLES.admin.value, enums.AUTH.ROLES.superAdmin.value ] }) }
    ], { method: _use, authorization: anybody }),

    MATCHES: new IEndpoint('MATCHES', 'MATCHES', [
        { id: 'ADD', endpoint: new IEndpoint('ADD_MATCH', 'add', noChildren, { method: _post, authorization: [ enums.AUTH.ROLES.moderator.value, enums.AUTH.ROLES.admin.value, enums.AUTH.ROLES.superAdmin.value ] }) },
        { id: 'DEL', endpoint: new IEndpoint('DEL_MATCH', 'del/:id([a-fA-F0-9]{24})', noChildren, { method: _delete, authorization: [ enums.AUTH.ROLES.moderator.value, enums.AUTH.ROLES.admin.value, enums.AUTH.ROLES.superAdmin.value ] }) },
        { id: 'GET', endpoint: new IEndpoint('GET_MATCH', 'get/:id([a-fA-F0-9]{24})?', noChildren, { method: _get, authorization: anybody }) },
        { id: 'UPD', endpoint: new IEndpoint('UPD_MATCH', 'upd/:id([a-fA-F0-9]{24})', noChildren, { method: _put, authorization: [ enums.AUTH.ROLES.moderator.value, enums.AUTH.ROLES.admin.value, enums.AUTH.ROLES.superAdmin.value ] }) }
    ], { method: _use, authorization: anybody })

};