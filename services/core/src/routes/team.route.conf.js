const Route = require('northernstars-shared').routeInterface;
const TeamsCtrl = require('../controllers/teams.controller');
const sysEnums = require('northernstars-shared').sysEnums;
const adminAndMods = [ sysEnums.AUTH.ROLES.admin.key, sysEnums.AUTH.ROLES.super.key, sysEnums.AUTH.ROLES.moderator.key ];

/**
 * @description Core API - Jersey Routes
 */
module.exports = [

    /** Basic CRUD **/
    new Route('ADD_TEAM', 'POST', '/teams', { roles: adminAndMods }, TeamsCtrl.addTeam),
    new Route('UPD_TEAM', 'PUT', '/teams/:id([a-fA-F0-9]{24})', { roles: adminAndMods }, TeamsCtrl.updateTeam),
    new Route('DEL_TEAM', 'DELETE', '/teams/:id([a-fA-F0-9]{24})', { roles: adminAndMods }, TeamsCtrl.deleteTeam),
    new Route('GET_TEAM', 'GET', '/teams/:id([a-fA-F0-9]{24})?', { roles: sysEnums.AUTH.ROLES.anyone.key }, TeamsCtrl.getTeams),

];