const Route = require('northernstars-shared').routeInterface;
const AdminCtrl = require('../controllers/administrator.controller');
const sysEnums = require('northernstars-shared').sysEnums;
const roles = [ sysEnums.AUTH.ROLES.admin.key, sysEnums.AUTH.ROLES.super.key, sysEnums.AUTH.ROLES.moderator.key ];

/**
 * @description Admin Routes
 */
module.exports = [

    /** Admin Routes **/
    new Route('SEND_INVITES', 'POST', '/admin/invites', { roles }, AdminCtrl.sendInvites ),
    new Route('REG_REQ_APR', 'POST', '/auth/registration-approval', { roles }, AdminCtrl.requestApproval),

];