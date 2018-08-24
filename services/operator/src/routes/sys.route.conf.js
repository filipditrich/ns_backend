const Route = require('northernstars-shared').routeInterface;
const SysCtrl = require('../controllers/system.controller');

module.exports = [

    new Route('CODES', 'GET', '/sys/codes', { secret: true }, SysCtrl.exportCodes),
    new Route('ROUTES', 'GET', '/sys/routes', { secret: true }, SysCtrl.exportRoutes)

];