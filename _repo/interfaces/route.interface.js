const pathToRegExp = require('path-to-regexp');
const StrategiesCtrl = require('../controllers/strategies.controller');

let Route = function (id, method, path, controller, auth = {}) {

    this.id = id;
    this.path = path;
    this.regExp = pathToRegExp(this.path);
    this.method = method;
    this.controller = (req, res, next) => { controller(req, res, next) };
    this.authRoles = auth.authRoles;
    this.pre = {};

    if (auth.doesRequireSecret) {
        this.pre.secretAuth = (req, res, next) => {
            return StrategiesCtrl.requireSecret(req, res, next);
        }
    }

    if (this.authRoles) {
        this.pre.roleAuth = (req, res, next) => {
            return StrategiesCtrl.roleAuthorization(req, res, next, this.authRoles);
        }
    }

};

/**
 * @description Exports Route Interface
 * @author Filip Ditrich
 * @type {Route}
 */
module.exports = Route;