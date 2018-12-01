const _ = require('lodash');
const SysRoutes = require('./sys.route.conf');
const AuthRoutes = require('./auth.route.conf');
const UserRoutes = require('./user.route.conf');
const AdminRoutes = require('./administrator.route.conf');

/** All Routes **/
module.exports = [];

/** Push in Routes **/
pushRoutes([
    SysRoutes,
    AuthRoutes,
    UserRoutes,
    AdminRoutes
]);

/**
 * @description Pushes All Routes to the module.exports
 * @param multipleRouteArrays
 */
function pushRoutes(multipleRouteArrays) {
    _.each(multipleRouteArrays, _routeArray => {
        _.each(_routeArray, _route => {
            module.exports.push(_route);
        });
    });
}