const Route = require('northernstars-shared').routeInterface;
const DictCtrl = require('../controllers/dictionary.controller');
const sysEnums = require('northernstars-shared').sysEnums;
const roles = [ sysEnums.AUTH.ROLES.super.key ];

/**
 * @description Dictionary Routes
 */
module.exports = [

    /** Basic CRUD **/
    new Route('ADD_DICT', 'POST', '/dictionary', { roles }, DictCtrl.create),
    new Route('UPD_DICT', 'PUT', '/dictionary/:id([a-fA-F0-9]{24})', { roles }, DictCtrl.update),
    new Route('DEL_DICT', 'DELETE', '/dictionary/:id([a-fA-F0-9]{24})', { roles }, DictCtrl.delete),
    new Route('GET_DICT', 'GET', '/dictionary/:id([a-zA-Z0-9])?', { roles: sysEnums.AUTH.ROLES.anyone.key }, DictCtrl.get)

];