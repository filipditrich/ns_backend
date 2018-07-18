const router = require('express').Router();
const BaseCtrl = require('../../../common/controllers/base');
const StrategiesCtrl = require('../../../common/controllers/strategies');
const AuthCtrl = require('../controllers/authentication');
const AdminCtrl = require('../controllers/administration');
const codes = require('../../../common/assets/codes');
const enums = require('../../../common/assets/enums');

module.exports = function (req, res, next) {

    // All Admin Routes must be Authorized with valid JWT Token
    // and the logged user must have role of an administrator
    router.use(StrategiesCtrl.authenticateToken, StrategiesCtrl.roleAuthorization([enums.AUTH.ROLES.admin.key]));

    // Approve Registration Request
    router.put('/registration-requests/approve/:registrationHash', AdminCtrl.approveRegistration); // TODO - mailing

    // Invalid Endpoints
    router.use((req, res, next) => BaseCtrl.invalidEndpoint(req, res, next));

    return router;

};