const Route = require('northernstars-shared').routeInterface;
const UsersCtrl = require('../controllers/users.controller');
const sysEnums = require('northernstars-shared').sysEnums;
const adminAndMods = [ sysEnums.AUTH.ROLES.admin.key, sysEnums.AUTH.ROLES.super.key, sysEnums.AUTH.ROLES.moderator.key ];


module.exports = [
    new Route('USR_UPDATE', 'POST', '/user-update/:id([a-fA-F0-9]{24})', { roles: sysEnums.AUTH.ROLES.anyone.key }, UsersCtrl.updateUser),
    new Route('USR_DATA', 'GET', '/user/:id([a-fA-F0-9]{24})', { roles: sysEnums.AUTH.ROLES.anyone.key }, UsersCtrl.getUserData),
]