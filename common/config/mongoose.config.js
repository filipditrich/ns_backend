const mongoose = require('mongoose');
const chalk = require('chalk');
const messages = require('../assets/messages');
const config =  require('./common.config');
const _ = require('lodash');

/**
 * @description Initializes Connection to MongoDB
 * @author filipditrich
 * @param env
 * @param worker
 */
module.exports = function (env, worker) {

    let wdb = _.find(config[env].workers, { id: worker });

    mongoose.connect(getMongoUrl(wdb), { useNewUrlParser: true })
        .then(() => {
            console.log('%s %s', chalk.green('✅'), messages.SYSTEM.DATABASE.MONGOOSE.CONNECTION_SUCCESSFUL);
        })
        .catch(error => {
            console.log('%s %s : %s', chalk.red('❌'), messages.SYSTEM.DATABASE.MONGOOSE.CONNECTION_FAILED, error.message);
            process.exit();
        });

};

function getMongoUrl(worker) {
    const credentials = worker.db.credentials;
    const host = worker.db.host;
    const port = worker.db.port;
    const name = worker.db.name;
    return `mongodb://${credentials}${host}:${port}/${name}`;
}