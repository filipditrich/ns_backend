const Route = require('northernstars-shared').routeInterface;
const JerseysCtrl = require('../controllers/jerseys.controller');
const sysEnums = require('northernstars-shared').sysEnums;
const adminAndMods = [ sysEnums.AUTH.ROLES.admin.key, sysEnums.AUTH.ROLES.super.key, sysEnums.AUTH.ROLES.moderator.key ];

/**
 * @description Core API - Jersey Routes
 */
module.exports = [

    /** Basic CRUD **/
    new Route('ADD_JERSEY', 'POST', '/jerseys', { roles: adminAndMods }, JerseysCtrl.newJersey),
    new Route('UPD_JERSEY', 'PUT', '/jerseys/:id([a-fA-F0-9]{24})', { roles: adminAndMods }, JerseysCtrl.updateJersey),
    new Route('DEL_JERSEY', 'DELETE', '/jerseys/:id([a-fA-F0-9]{24})', { roles: adminAndMods }, JerseysCtrl.deleteJersey),
    new Route('GET_JERSEY', 'GET', '/jerseys/:id([a-fA-F0-9]{24})?', { roles: sysEnums.AUTH.ROLES.anyone.key }, JerseysCtrl.getJerseys),

];