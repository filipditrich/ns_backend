const Route = require('northernstars-shared').routeInterface;
const MatchGroupCtrl = require('../controllers/match-group.controller');
const sysEnums = require('northernstars-shared').sysEnums;
const adminAndMods = [ sysEnums.AUTH.ROLES.admin.key, sysEnums.AUTH.ROLES.super.key, sysEnums.AUTH.ROLES.moderator.key ];

/**
 * @description Core API - Match Group Routes
 */
module.exports = [

    /** Basic CRUD **/
    new Route('ADD_GROUP', 'POST', '/groups', { roles: adminAndMods }, MatchGroupCtrl.create),
    new Route('UPD_GROUP', 'PUT', '/groups/:id([a-fA-F0-9]{24})', { roles: adminAndMods }, MatchGroupCtrl.update),
    new Route('DEL_GROUP', 'DELETE', '/groups/:id([a-fA-F0-9]{24})', { roles: adminAndMods }, MatchGroupCtrl.delete),
    new Route('GET_GROUP', 'GET', '/groups/:id([a-fA-F0-9]{24})?', { roles: sysEnums.AUTH.ROLES.anyone.key }, MatchGroupCtrl.get),
    new Route('GET_GROUP_BY_NAME', 'GET', '/groups/n/:name', { roles: sysEnums.AUTH.ROLES.anyone.key }, MatchGroupCtrl.getByName)

];