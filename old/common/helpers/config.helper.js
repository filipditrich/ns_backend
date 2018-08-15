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
    if (!workerConfig.workerConfig) {
        const chalk = require('chalk');
        console.log('%s %s worker couldn\'t have been started because of missing or wrong configuration!', chalk.red('❌'), workerID.replace(/\b\w/g, l => l.toUpperCase()));
        process.exit(1);
    }
    workerConfig.workerConfig['environment'] = env;
};
