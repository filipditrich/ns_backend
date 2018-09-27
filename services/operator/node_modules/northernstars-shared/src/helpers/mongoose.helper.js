exports.connect = function (mongoose, serviceConfig) {

    return new Promise((resolve, reject) => {
        mongoose.connect(connectionURI(serviceConfig), { useNewUrlParser: true })
            .then(() => {
                console.log(`✅ Connection to ${serviceConfig.db.name} database established.`);
                resolve();
            })
            .catch(error => {
                console.error('❌ %s \n %s', `Connection to ${serviceConfig.db.name} database failed.`, error.message);
                reject(error.message);
            });
    });

};

function connectionURI(config) {
    return `${config.db.url}/${config.db.name}`;
}