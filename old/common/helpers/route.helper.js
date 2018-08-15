const _ = require('lodash');
const endpointCollection = require('../config/endpoints.config');
const IEndpoint = require('../config/endpoint.interface');
const StrategiesCtrl = require('../controllers/strategies.controller');

/**
 * @description: Traverses in object to endpath (x.y.z)
 * @param obj
 * @param keys
 * @return {T}
 */
exports.traverse = function (obj, keys) {
    return keys.split('.').reduce(function (cur, key) {
        return cur[key];
    }, obj);
};

/**
 * @description Returns fuck TOOD:
 * @author dr-fred
 * @param o
 * @param val
 * @return {*}
 */
exports.routeById = function (o, val) {
    const prop = 'id';

    if(o==null) return false;
    if( o[prop] === val ){
        return o;
    }
    let result, p;
    for (p in o) {
        if( o.hasOwnProperty(p) && typeof o[p] === 'object' ) {
            result = exports.routeById(o[p], val);
            if(result){
                return result;
            }
        }
    }
    return result;

};

exports.getRouteMeta = function (id, worker) {
    return exports.routeById(endpointCollection[worker], id).meta;
};

exports.getRouteEndpoint = function (id, worker) {
    return '/' + exports.routeById(endpointCollection[worker], id).endpoint;
};

/**
 * @description: Generates URL endpath (without host and port) from endpoints config
 * @param obj
 * @param endpath
 * @param fnc
 * @param endpoints
 * @return {Promise<any[]>}
 */
exports.matrix = function (obj, endpath, fnc = false, endpoints) {

    let promises = [];

    const recursion = async function (value, key, endpath) {

        return new Promise((resolve, reject) => {
            if (typeof value === 'object') {
                if (key !== 'meta') {
                    if (endpath) {
                        each(value, (endpath + '.' + key)); resolve();
                    } else {
                        each(value, key); resolve();
                    }
                }
            } else {
                if (key === 'url') {
                    try {
                        exports.traverse(endpoints, endpath).url = '/' + endpath.toLowerCase().split(".").join("/").replace(/_/g, '-');
                        resolve();
                    } catch (error) { reject(error); }
                }
            }
        });

    };

    const each = function (obj, endpath) {
        promises.push(new Promise((resolve, reject) => {

            _.forEach(obj, (value, key) => {
                recursion(value, key, endpath)
                    .then(() => resolve())
                    .catch(error => { reject(error) });
            });

        }));
    };

    if (fnc && fnc === 'each') { each(obj, endpath) }

    return Promise.all(promises);

};

exports.invokeMeta = function (obj) {

    if(obj === null) return false;
    let result;
    for (let p in obj) {
        if( obj.hasOwnProperty(p) && typeof obj[p] === 'object' ) {
            if (p === 'meta') {
                obj[p] = exports.editMeta(obj[p]);
                result = obj[p];
            }
            else {
                result = exports.invokeMeta(obj[p]);
                if(result){ return result; }
            }
        }
    }
    return result;
};

exports.editMeta = function (metaObj) {

    if (!metaObj.method || !metaObj.authRoles || !metaObj.controllerFunction) { throw new Error("Bad Meta Structure") }

    try {
        const meta = { method: metaObj.method, fnc: {} };
        meta['fnc']['tokenAuth'] = metaObj.doesRequireToken ? (req, res, next) => { return StrategiesCtrl.authenticateToken(req, res, next); } : null;
        meta['fnc']['secretAuth'] = metaObj.doesRequireSecret ? (req, res, next) => { return StrategiesCtrl.requireSecret(req, res, next); } : null;
        meta['fnc']['optional'] = metaObj.optionalMiddleware ? (req, res, next) => { return metaObj.optionalMiddleware(req, res, next); } : null;
        meta['fnc']['roleAuth'] = () => { return StrategiesCtrl.roleAuthorization(metaObj.authRoles); };
        meta['fnc']['controller'] = meta.method === 'use' ? (app) => { return metaObj.controllerFunction(app); } : (req, res, next) => { return metaObj.controllerFunction(req, res, next); };

        return meta;

    } catch (error) { throw error; }


};