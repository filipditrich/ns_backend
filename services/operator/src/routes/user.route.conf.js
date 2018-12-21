const Route = require('northernstars-shared').routeInterface;
const UserCtrl = require('../controllers/user.controller');
const sysEnums = require('northernstars-shared').sysEnums;
const adminAndMods = [ sysEnums.AUTH.ROLES.admin.key, sysEnums.AUTH.ROLES.super.key, sysEnums.AUTH.ROLES.moderator.key ];

/**
 * @description Core API - Place Routes
 */
module.exports = [

    /** Basic CRUD **/
    new Route('ADD_USER', 'POST', '/users', { roles: adminAndMods }, UserCtrl.createUser),
    // new Route('UPD_USER', 'PUT', '/users/:id([a-fA-F0-9]{24})', { roles: adminAndMods }, UserCtrl),
    // new Route('DEL_USER', 'DELETE', '/users/:id([a-fA-F0-9]{24})', { roles: adminAndMods }, UserCtrl),
    new Route('GET_USER', 'GET', '/users/:id([a-fA-F0-9]{24})?', { roles: sysEnums.AUTH.ROLES.anyone.key }, UserCtrl.getUser),

];