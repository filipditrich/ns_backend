const Route = require('northernstars-shared').routeInterface;
const MatchesCtrl = require('../controllers/matches.controller');
const sysEnums = require('northernstars-shared').sysEnums;
const adminAndMods = [ sysEnums.AUTH.ROLES.admin.key, sysEnums.AUTH.ROLES.super.key, sysEnums.AUTH.ROLES.moderator.key ];

/**
 * @description Core API - Match Routes
 */
module.exports = [

    /** Basic CRUD **/
    new Route('ADD_MATCH', 'POST', '/matches', { roles: adminAndMods }, MatchesCtrl.createMatch),
    new Route('UPD_MATCH', 'PUT', '/matches/:id([a-fA-F0-9]{24})', { roles: adminAndMods }, MatchesCtrl.updateMatch),
    new Route('DEL_MATCH', 'DELETE', '/matches/:id([a-fA-F0-9]{24})', { roles: adminAndMods }, MatchesCtrl.deleteMatch),
    new Route('GET_MATCH', 'GET', '/matches/:id([a-fA-F0-9]{24})?', { roles: sysEnums.AUTH.ROLES.anyone.key }, MatchesCtrl.getMatches),
    new Route('GET_ALL_MATCHES', 'POST', '/matches/get-all', { roles: sysEnums.AUTH.ROLES.anyone.key }, MatchesCtrl.getAllMatches),
    // new Route('GET_COMP_PLAYERS', 'GET', '/matches/competing-players', { roles: sysEnums.AUTH.ROLES.anyone.key }, MatchesCtrl.getCompPlayers),
    new Route('MATCH_PARTICIPATION', 'POST', '/matches/participation', { roles: sysEnums.AUTH.ROLES.anyone.key }, MatchesCtrl.matchParticipation),
    new Route('WRITE_MATCH_RESULTS', 'POST', '/matches/write-results', { roles: sysEnums.AUTH.ROLES.anyone.key }, MatchesCtrl.writeResults),

    new Route('CANCEL_MATCH', 'PUT', '/matches/cancel/:id([a-fA-F0-9]{24})', { roles: sysEnums.AUTH.ROLES.anyone.key}, MatchesCtrl.cancelMatch),

];