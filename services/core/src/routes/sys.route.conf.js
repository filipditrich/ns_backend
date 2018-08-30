const Route = require('northernstars-shared').routeInterface;
const SysCtrl = require('../controllers/sys.controller');
const sysEnums = require('northernstars-shared').sysEnums;
const adminAndMods = [ sysEnums.AUTH.ROLES.admin.key, sysEnums.AUTH.ROLES.super.key, sysEnums.AUTH.ROLES.moderator.key ];

/**
 * @description Core API - Jersey Routes
 */
module.exports = [

    new Route('UP_CHECK', 'GET', '/sys/up-check', {}, SysCtrl.upCheck),
    new Route('ROUTES', 'GET', '/sys/export/routes', { secret: true }, SysCtrl.exportRoutes),
    new Route('CODES', 'GET', '/sys/export/codes', { secret: true }, SysCtrl.exportCodes)

];