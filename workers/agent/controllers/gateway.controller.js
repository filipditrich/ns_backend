const _ = require('lodash');
const config = require('../../../common/config/common.config');
const env = require('../config/worker.config').environment();
const StrategiesCtrl = require('../../../common/controllers/strategies.controller');
const errorHelper = require('../../../common/helpers/error.helper');
const commonCodes = require('../../../common/assets/codes');

exports.authTokenIfNeeded = (req, res, next) => {
    const endpoint = req.params['endpoint'];

    let worker = _.find(config[env].workers, { id: endpoint });
    if (worker) {
        if (worker.auth) {
            if (worker.auth.doesRequireToken) {
                return StrategiesCtrl.authenticateToken(req, res, next);
            } else {
                return next();
            }
        } else {
            return next(errorHelper.prepareError(commonCodes.CONFIG.WRONG_CONFIG_STRUCTURE));
        }
    } else {
        return next(errorHelper.prepareError(commonCodes.CONFIG.CONFIG_MISSING));
    }

};

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