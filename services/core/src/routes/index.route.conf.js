const JerseyRoutes = require('./jersey.route.conf');
const MatchRoutes = require('./match.route.conf');
const PlaceRoutes = require('./place.route.conf');
const TeamRoutes = require('./team.route.conf');
const _ = require('lodash');

/** All Routes **/
module.exports = [];

/** Push in Routes **/
pushRoutes([
    JerseyRoutes,
    MatchRoutes,
    TeamRoutes,
    PlaceRoutes
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