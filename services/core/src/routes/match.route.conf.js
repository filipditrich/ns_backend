const Route = require('northernstars-shared').routeInterface;
const MatchesCtrl = require('../controllers/matches.controller');
const sysEnums = require('northernstars-shared').sysEnums;
const adminAndMods = [ sysEnums.AUTH.ROLES.admin.key, sysEnums.AUTH.ROLES.super.key, sysEnums.AUTH.ROLES.moderator.key ];

/**
 * @description Core API - Match Routes
 */
module.exports = [

    /** Basic CRUD **/
    new Route('ADD_MATCH', 'POST', '/matches', { roles: adminAndMods }, MatchesCtrl.create),
    new Route('UPD_MATCH', 'PUT', '/matches/:id([a-fA-F0-9]{24})', { roles: adminAndMods }, MatchesCtrl.update),
    new Route('DEL_MATCH', 'DELETE', '/matches/:id([a-fA-F0-9]{24})', { roles: adminAndMods }, MatchesCtrl.delete),
    new Route('GET_MATCH', 'GET', '/matches/:id([a-fA-F0-9]{24})?', { roles: sysEnums.AUTH.ROLES.anyone.key }, MatchesCtrl.get),
    new Route('MATCH_ENROLLMENT', 'POST', '/matches/enrollment', { roles: sysEnums.AUTH.ROLES.anyone.key }, MatchesCtrl.matchParticipation),
    new Route('WRITE_MATCH_RESULTS', 'POST', '/matches/write-results', { roles: sysEnums.AUTH.ROLES.anyone.key }, MatchesCtrl.writeResults),

    new Route('TEST', 'POST', '/matches/test', { roles: sysEnums.AUTH.ROLES.anyone.key }, MatchesCtrl.test),

    new Route('CANCEL_MATCH', 'PUT', '/matches/cancel/:id([a-fA-F0-9]{24})', { roles: adminAndMods }, MatchesCtrl.cancelMatch),

];