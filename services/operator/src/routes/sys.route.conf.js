const Route = require('northernstars-shared').routeInterface;
const SysCtrl = require('../controllers/system.controller');
const enums = require('northernstars-shared').sysEnums;

module.exports = [

    new Route('CODES', 'GET', '/sys/codes', { secret: true }, SysCtrl.exportCodes),
    new Route('ROUTES', 'GET', '/sys/routes', { secret: true }, SysCtrl.exportRoutes),
    new Route('SERVICES', 'POST', '/sys/services', { secret: true }, SysCtrl.updateServices),
    new Route('TRANSLATE_LIST', 'GET', '/sys/translate', { secret: true }, SysCtrl.exportTranslateList),
    new Route('APP_INFO', 'GET', '/sys/appinfo', { secret: true }, SysCtrl.exportAppInfo),
    // TODO: create 'serverOnly' routes
    new Route('REMINDERS', 'POST', '/sys/reminders', { }, SysCtrl.reminders),

];