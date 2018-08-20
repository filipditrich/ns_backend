const Route = require('../../../../../_repo/interfaces/route.interface');
const ExportCtrl = require('../controllers/export.controller');

module.exports = [

    new Route('EPT_CODES', 'get', '/export/codes', ExportCtrl.exportCodes),
    new Route('EPT_ROUTES', 'get', '/export/routes', ExportCtrl.exportRoutes)

];