const codes = require('../assets/codes.asset');
const sysCodes = require('northernstars-shared').sysCodes;
const _ = require('lodash');

exports.exportCodes = (req, res, next) => {

    // TODO: export codes from other service as well
    let output = {};
    output['operator'] = codes;
    output['shared'] = sysCodes;

    res.json({ response: sysCodes.RESOURCE.LOADED, output });

};

exports.exportRoutes = (req, res, next) => {

    // TODO: export routes from other services as well
    let output = {},
        routes = require('../routes/index.route.conf'),
        allowed = ['id', 'method', 'url', 'params', 'roles'];

    output['operator'] = _.map(routes, _.partialRight(_.pick, allowed));

    res.json({ response: sysCodes.RESOURCE.LOADED, output })

};