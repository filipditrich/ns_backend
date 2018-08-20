const codes = require('../assets/codes.asset');
const commonCodes = require('../../../../../_repo/assets/system-codes.asset');
const errorHelper = require('../../../../../_repo/helpers/error.helper');
const _ = require('lodash');

exports.exportCodes = (req, res, next) => {
    res.json({ response: commonCodes.RESOURCE.LOADED, output: codes });
};

exports.exportRoutes = (req, res, next) => {
    const routes = require('../routes/index.route.conf');
    const output = [];

    routes.forEach(route => {
        let formatted = {};
        formatted['id'] = route.id;
        formatted['method'] = route.method;
        formatted['url'] = route.url;
        formatted['params'] = route.params;
        formatted['userRoles'] = route.userRoles;
        output.push(formatted);
    })
    ;
    res.json({ response: commonCodes.RESOURCE.LOADED, output: output });
};

exports.existCheck = (req, res, next) => {
    const schema = req.params['schema'];
    const check = req.body['check'];
    let Schema;

    try {
        Schema = require(`../models/${schema}.schema`);
    } catch (err) { return next(errorHelper.prepareError(commonCodes.REQUEST.CHECK.NOT_FOUND)) }

    if (!check) return next(errorHelper.prepareError(commonCodes.REQUEST.CHECK.QUERY_MISSING));

    Schema.find(check).exec()
        .then(results => {
            if (results.length < 1) return next(errorHelper.prepareError(commonCodes.REQUEST.CHECK.NOT_FOUND));
            res.json({ response: commonCodes.REQUEST.CHECK.FOUND });
        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });

};