const pathToRegExp = require('path-to-regexp');
const StrategiesCtrl = require('../controllers/strategies.controller');

let Route = function (id, method, path, controller, auth = {}) {

    this.id = id;
    this.path = path;
    this.regExp = pathToRegExp(this.path);
    this.method = method;
    this.controller = (req, res, next) => { controller(req, res, next) };
    this.authRoles = auth.authRoles;
    this.doesRequireToken = auth.doesRequireToken;
    this.pre = {};
    this.params = [];

    // Get the params
    this.path.split("/").filter(x => x.startsWith(":")).forEach((param, i) => {
       param = param.replace(/\((.*?)\)/, "").replace("?", "").replace(":", "");
       this.params.push(param);
    });

    // Remove the params and its regexps from the url
    this.url = path.split("/").filter(x => !x.startsWith(":")).join("/");

    // Require Secret Method
    if (auth.doesRequireSecret) {
        this.pre.secretAuth = (req, res, next) => {
            return StrategiesCtrl.requireSecret(req, res, next);
        }
    }

    // Role Authorization Method
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