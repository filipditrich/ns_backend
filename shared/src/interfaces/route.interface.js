const _ = require('lodash');
const pathToRegExp = require('path-to-regexp');
const StrategiesCtrl = require('../controllers/strategies.controller');

class Route {

    constructor(id, method, path, auth = {}, controller) {
        this.id = id;
        this.method = method.toLowerCase();
        this.scope = _.join([this.id, this.method], ':');
        this.path = path;
        this.url = this.path.split('/').filter(x => !x.startsWith(':')).join('/');
        this.regexp = pathToRegExp(this.path);
        this.roles = auth.roles || false;

        this.middleware = {
            secret: !!auth.secret && auth.secret ? (req, res, next) => { return StrategiesCtrl.requireSecret(req, res, next); } : false,
            authorization: !!auth.roles && auth.roles ? (req, res, next) => {
                return StrategiesCtrl.verifyToken(req, res, next).then(() => {
                    return StrategiesCtrl.roleAuthorization(req, res, next, auth.roles);
                }).catch(error => { return next(error); })
            } : false
        };
        this.controller = controller;

        this.params = [];
        this.path.split('/').filter(x => x.startsWith(':')).forEach(param => {
            param = param.replace(/\((.*?)\)/, '').replace('?', '').replace(':', '');
            this.params.push(param);

        });
    }

}


/**
 * @description Exports Route Interface
 * @author Filip Ditrich
 * @type {Route}
 */
module.exports = Route;