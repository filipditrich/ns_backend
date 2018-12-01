const Route = require('northernstars-shared').routeInterface;
const SysCtrl = require('../controllers/system.controller');
const enums = require('northernstars-shared').sysEnums;

module.exports = [

    new Route('CODES', 'GET', '/sys/codes', { secret: true }, SysCtrl.exportCodes),
    new Route('ROUTES', 'GET', '/sys/routes', { secret: true }, SysCtrl.exportRoutes),
    new Route('SERVICES', 'POST', '/sys/services', { secret: true }, SysCtrl.updateServices),
    // TODO: create 'serverOnly' routes
    new Route('REMINDERS', 'POST', '/sys/reminders', { }, SysCtrl.reminders),

];