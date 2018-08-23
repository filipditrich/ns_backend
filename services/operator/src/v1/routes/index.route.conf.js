const _ = require('lodash');
const SysRoutes = require('./sys.route.conf');
const AuthRoutes = require('./auth.route.conf');

module.exports = [];
pushRoutes([SysRoutes, AuthRoutes]);

function pushRoutes(multipleRouteArrays) {
    _.each(multipleRouteArrays, _routeArray => {
        _.each(_routeArray, _route => {
            module.exports.push(_route);
        });
    });
}