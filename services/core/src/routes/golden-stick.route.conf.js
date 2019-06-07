const Route = require('northernstars-shared').routeInterface;
const GSCtrl = require('../controllers/golden-stick.controller');
const sysEnums = require('northernstars-shared').sysEnums;
const adminAndMods = [ sysEnums.AUTH.ROLES.admin.key, sysEnums.AUTH.ROLES.super.key, sysEnums.AUTH.ROLES.moderator.key ];

/**
 * @description Core API - Golden Stick Routes
 */
module.exports = [

    /** Basic CRUD **/
    new Route('ADD_JERSEY', 'POST', '/golden-sticks', { roles: adminAndMods }, GSCtrl.create),
    new Route('UPD_JERSEY', 'PUT', '/golden-sticks/:id([a-fA-F0-9]{24})', { roles: adminAndMods }, GSCtrl.update),
    new Route('DEL_JERSEY', 'DELETE', '/golden-sticks/:id([a-fA-F0-9]{24})', { roles: adminAndMods }, GSCtrl.delete),
    new Route('GET_JERSEY', 'GET', '/golden-sticks/:id([a-fA-F0-9]{24})?', { roles: sysEnums.AUTH.ROLES.anyone.key }, GSCtrl.get)

];
