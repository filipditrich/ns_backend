const Route = require('northernstars-shared').routeInterface;
const SysCtrl = require('../controllers/system.controller');
const enums = require('northernstars-shared').sysEnums;

module.exports = [

    new Route('ASSETS', 'GET', '/sys/assets', { secret: true }, SysCtrl.serverAssets),
    new Route('SERVICES', 'POST', '/sys/services', { secret: true }, SysCtrl.updateServices),
    // TODO: create 'serverOnly' routes
    new Route('REMINDERS', 'POST', '/sys/reminders', { }, SysCtrl.reminders),
    new Route('O', 'POST', '/sys/dummy', { }, SysCtrl.dummyDict)

];