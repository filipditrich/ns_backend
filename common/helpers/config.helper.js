const _ = require('lodash');
const commonConfig = require('../config/common.config');

/**
 * @description Generates Worker Config
 * @author filipditrich
 * @param env
 * @param workerID
 * @param workerConfig
 */
module.exports = function(env, workerID, workerConfig) {
    workerConfig.workerConfig = _.find(commonConfig[env].workers, { id: workerID });
    workerConfig.workerConfig['environment'] = env;
};
