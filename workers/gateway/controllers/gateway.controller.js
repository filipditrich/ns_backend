const _ = require('lodash');
const config = require('../../../common/config/common.config');
const env = require('express')().get('env');

exports.handleGatewayRequest = (req, res, next) => {
    const endpoint = req.params['endpoint'];

    let worker = _.find(config[env].workers, { id: endpoint });
    if (worker) {
        const path = req.originalUrl.split("/").filter(x => x !== "api" && x !== worker.id).join("/");
        return res.redirect(307, `${worker.api.protocol}://${worker.api.baseUrl}:${worker.api.port}/api${path}`);
    } else {
        return next();
    }

};