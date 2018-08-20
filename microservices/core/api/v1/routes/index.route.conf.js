const Route = require('../../../../../_repo/interfaces/route.interface');
const JerseyCtrl = require('../controllers/jerseys.controller');
const PlaceCtrl = require('../controllers/places.controller');
const TeamCtrl = require('../controllers/teams.controller');
const MatchCtrl = require('../controllers/matches.controller');
const SysCtrl = require('../controllers/sys.controller');

const commonEnums = require('../../../../../_repo/assets/system-enums.asset');
const adminAndMods = [ commonEnums.AUTH.ROLES.admin.key, commonEnums.AUTH.ROLES.super.key, commonEnums.AUTH.ROLES.moderator.key ];
const everybody = [ commonEnums.AUTH.ROLES.admin.key, commonEnums.AUTH.ROLES.super.key, commonEnums.AUTH.ROLES.moderator.key, commonEnums.AUTH.ROLES.player.key ];

module.exports = [

    /** Jerseys **/
    new Route('ADD_JERSEY', 'post', '/jerseys/add', JerseyCtrl.newJersey, { authRoles:  adminAndMods }),
    new Route('DEL_JERSEY', 'delete', '/jerseys/del/:id([a-fA-F0-9]{24})', JerseyCtrl.deleteJersey, { authRoles: adminAndMods }),
    new Route('UPD_JERSEY', 'put', '/jerseys/upd/:id([a-fA-F0-9]{24})', JerseyCtrl.updateJersey, { authRoles: adminAndMods }),
    new Route('GET_JERSEY', 'get', '/jerseys/get/:id([a-fA-F0-9]{24})?', JerseyCtrl.getJerseys, { authRoles: everybody }),

    /** Places **/
    new Route('ADD_PLACE', 'post', '/places/add', PlaceCtrl.addPlace, { authRoles:  adminAndMods }),
    new Route('DEL_PLACE', 'delete', '/places/del/:id([a-fA-F0-9]{24})', PlaceCtrl.deletePlace, { authRoles: adminAndMods }),
    new Route('UPD_PLACE', 'put', '/places/upd/:id([a-fA-F0-9]{24})', PlaceCtrl.updatePlace, { authRoles: adminAndMods }),
    new Route('GET_PLACE', 'get', '/places/get/:id([a-fA-F0-9]{24})?', PlaceCtrl.getPlaces, { authRoles: everybody }),

    /** Teams **/
    new Route('ADD_TEAM', 'post', '/teams/add', TeamCtrl.addTeam, { authRoles:  adminAndMods }),
    new Route('DEL_TEAM', 'delete', '/teams/del/:id([a-fA-F0-9]{24})', TeamCtrl.deleteTeam, { authRoles: adminAndMods }),
    new Route('UPD_TEAM', 'put', '/teams/upd/:id([a-fA-F0-9]{24})', TeamCtrl.updateTeam, { authRoles: adminAndMods }),
    new Route('GET_TEAM', 'get', '/teams/get/:id([a-fA-F0-9]{24})?', TeamCtrl.getTeams, { authRoles: everybody }),

    /** Matches **/
    new Route('ADD_MATCH', 'post', '/matches/add', MatchCtrl.createMatch, { authRoles:  adminAndMods }),
    new Route('DEL_MATCH', 'delete', '/matches/del/:id([a-fA-F0-9]{24})', MatchCtrl.deleteMatch, { authRoles: adminAndMods }),
    new Route('CANCEL_MATCH', 'put', '/matches/cancel/:id([a-fA-F0-9]{24})', MatchCtrl.cancelMatch, { authRoles: adminAndMods }),
    new Route('UPD_MATCH', 'put', '/matches/upd/:id([a-fA-F0-9]{24})', MatchCtrl.updateMatch, { authRoles: adminAndMods }),
    new Route('GET_MATCH', 'get', '/matches/get/:id([a-fA-F0-9]{24})?', MatchCtrl.getMatches, { authRoles: everybody }),

    /** SYSTEM ROUTES **/
    new Route('EPT_CODES', 'get', '/sys/export/codes', SysCtrl.exportCodes),
    new Route('EPT_ROUTES', 'get', '/sys/export/routes', SysCtrl.exportRoutes)

];