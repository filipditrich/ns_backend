const sysCodes = require('northernstars-shared').sysCodes;
const codes = require('../assets/codes.asset');
const _ = require('lodash');

/**
 * @description Exports/Exposes service's codes
 * @param req
 * @param res
 * @param next
 */
exports.exportCodes = (req, res, next) => {
    res.json({ response: sysCodes.RESOURCE.LOADED, output: codes });
};

/**
 * @description Exports/Exposes service's route configuration
 * @param req
 * @param res
 * @param next
 */
exports.exportRoutes = (req, res, next) => {
    const routes = require('../routes/index.route.conf');
    const allowed = ['id', 'method', 'url', 'params', 'roles'];
    const output = _.map(routes, _.partialRight(_.pick, allowed));

    res.json({ response: sysCodes.RESOURCE.LOADED, output: output });
};

/**
 * @description Checks the service's up-time
 * @param req
 * @param res
 * @param next
 */
exports.upCheck = (req, res, next) => {

    res.json({ response: sysCodes.REQUEST.PROCESSED, output: { runtime: process.uptime() }});

};