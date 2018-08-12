const router = require('express').Router();
const BaseCtrl = require('../../../common/controllers/base.controller');
const MatchCtrl = require('../controllers/match.controller');
const StrategiesCtrl = require('../../../common/controllers/strategies.controller');
const MATCHES = require('../config/endpoints.config').API.MATCHES;
const UserRoles = require('../../../common/assets/enums').AUTH.ROLES;
const BasicAdminAuth = StrategiesCtrl.roleAuthorization([UserRoles.admin.key, UserRoles.superAdmin.key]);

/**
 * @description Sports Worker Match Route
 * @author filipditrich
 * @param req
 * @param res
 * @param next
 * @return {Router|router|*}
 */
module.exports = function (req, res, next) {

    // Basic CRUD routes
    router.post(`/${MATCHES.CRUD.endpoint}/:collection`, BasicAdminAuth, MatchCtrl.create);
    router.get(`/${MATCHES.CRUD.endpoint}/:collection/:id([a-fA-F0-9]{24})?`, MatchCtrl.read);
    router.put(`/${MATCHES.CRUD.endpoint}/:collection/:id([a-fA-F0-9]{24})`, BasicAdminAuth, MatchCtrl.update);
    router.delete(`/${MATCHES.CRUD.endpoint}/:collection/:id([a-fA-F0-9]{24})`, BasicAdminAuth, MatchCtrl.delete);


    // Invalid Endpoints
    router.use((req, res, next) => BaseCtrl.invalidEndpoint(req, res, next));

    return router;

};