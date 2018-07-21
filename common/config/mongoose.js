const mongoose = require('mongoose');
const chalk = require('chalk');
const messages = require('../assets/messages');
const config =  require('./common');

module.exports = function (env) {

    mongoose.connect(config[env].db.url, { useNewUrlParser: true })
        .then(() => {
            console.log('%s %s', chalk.green('✅'), messages.SYSTEM.DATABASE.MONGOOSE.CONNECTION_SUCCESSFUL);
        })
        .catch(error => {
            console.log('%s %s : %s', chalk.red('❌'), messages.SYSTEM.DATABASE.MONGOOSE.CONNECTION_FAILED, error.message);
            process.exit();
        });

};