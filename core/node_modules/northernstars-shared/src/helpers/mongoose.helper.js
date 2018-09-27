module.exports = function (mongoose, serviceConfig) {

    mongoose.connect(connectionURI(serviceConfig), { useNewUrlParser: true })
        .then(() => {
            console.log(`✅ Connection to ${serviceConfig.db.name} database established.`);
        })
        .catch(error => {
            console.error('❌ %s \n %s', `Connection to ${serviceConfig.db.name} database failed.`, error.message);
            process.exit(1);
        });

};

function connectionURI(config) {
    return `${config.db.url}/${config.db.name}`;
}