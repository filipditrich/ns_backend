const app = require('express')();
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const serviceSettings = require('./src/config/settings.config');
const BaseCtrl = require('northernstars-shared').genericHelper;
const StrategiesCtrl = require('northernstars-shared').strategiesCtrl;
const MongooseHelper = require('northernstars-shared').mongooseHelper;

/** App Variables **/
app.set('env', serviceSettings.environment);
app.set('serviceID', serviceSettings.id);
app.set('port', serviceSettings.port);

/** Mongoose **/
MongooseHelper.connect(mongoose, serviceSettings)
.then(() => {

    /** Body Parser **/
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    /** Logger **/
    app.use(morgan('dev'));

    /** Cross-Origin Requests **/
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, App-Handle-Errors-Generically, Application-ID, X-Secret");
        res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
        if (req.method === 'OPTIONS') {
            res.end();
        } else {
            next();
        }
    });

    /** Server **/
    app.listen(app.get('port'), () => {
        console.log(`✅ ${serviceSettings.name} Server Listening on port ${app.get('port')} in ${app.get('env')} mode.`);
    });

    /** Service Configuration **/
    BaseCtrl.updateService(serviceSettings).then(response => {
        if (response.response.success) {
            console.log('✅ Service configuration updated successfully.' );

            /** Micro Service Communication **/
            app.use(StrategiesCtrl.microserviceCommunication);

            /** Expose API **/
            app.use('/api/', require('./src')(app));

            /** Invalid Endpoints **/
            app.use(BaseCtrl.invalidEndpoint);

            /** Response Error Handler **/
            app.use(BaseCtrl.handleError);

        } else {
            console.log('❌ Something went wrong. The request has been processed but with no success output', response.response);
            process.exit(1);
        }
    }).catch(error => {
        console.log('❌ Error while updating service configuration. ', error);
        process.exit(1);
    });

})
.catch(error => {
    console.log(error);
    process.exit(1);
});