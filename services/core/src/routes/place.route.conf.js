const Route = require('northernstars-shared').routeInterface;
const PlacesCtrl = require('../controllers/places.controller');
const sysEnums = require('northernstars-shared').sysEnums;
const adminAndMods = [ sysEnums.AUTH.ROLES.admin.key, sysEnums.AUTH.ROLES.super.key, sysEnums.AUTH.ROLES.moderator.key ];

/**
 * @description Core API - Place Routes
 */
module.exports = [

    /** Basic CRUD **/
    new Route('ADD_PLACE', 'POST', '/places', { roles: adminAndMods }, PlacesCtrl.addPlace),
    new Route('UPD_PLACE', 'PUT', '/places/:id([a-fA-F0-9]{24})', { roles: adminAndMods }, PlacesCtrl.updatePlace),
    new Route('DEL_PLACE', 'DELETE', '/places/:id([a-fA-F0-9]{24})', { roles: adminAndMods }, PlacesCtrl.deletePlace),
    new Route('GET_PLACE', 'GET', '/places/:id([a-fA-F0-9]{24})?', { roles: sysEnums.AUTH.ROLES.anyone.key }, PlacesCtrl.getPlaces),

];