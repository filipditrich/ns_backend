const mongoose = require('mongoose');

module.exports = function (serviceConfig) {

    mongoose.connect(connectionURI(serviceConfig), { useNewUrlParser: true })
        .then(() => {
            console.log(`✅ Connection to ${serviceConfig.database.name} database established.`);
        })
        .catch(error => {
            console.error('❌ %s \n %s', `Connection to ${serviceConfig.database.name} database failed.`, error.message);
            process.exit(1);
        });

};

function connectionURI(serviceConfig) {
    return `${serviceConfig.database.url}/${serviceConfig.database.name}`;
}