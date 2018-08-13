const mongoose = require('mongoose');
const messages = require('../assets/messages');
const chalk = require('chalk');

/**
 * @description Initializes Connection to MongoDB
 * @author filipditrich
 * @param workerConfig
 */
module.exports = function (workerConfig) {

    mongoose.connect(getMongoUrl(workerConfig), { useNewUrlParser: true })
        .then(() => {
            console.log('%s %s', chalk.green('✅'), `Connection to ${workerConfig.worker().db.name} database established.`);
        })
        .catch(error => {
            console.log('%s %s : %s', chalk.red('❌'), `Connection to ${workerConfig.worker().db.name} database failed.`, error.message);
            process.exit();
        });

};

function getMongoUrl(workerConf) {
    const db = workerConf.worker().db;
    return `mongodb://${db.credentials}${db.host}:${db.port}/${db.name}`;
}