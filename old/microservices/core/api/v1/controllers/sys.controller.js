const codes = require('../assets/codes.asset');
const commonCodes = require('../../../../../_repo/assets/system-codes.asset');
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
        formatted['userRoles'] = route.authRoles;
        output.push(formatted);
    });

    res.json({ response: commonCodes.RESOURCE.LOADED, output: output });
};