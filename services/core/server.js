const app = require('express')();
const morgan = require('morgan');
const mongoose = require('mongoose');
const serviceSettings = require('./src/config/settings.config');
const bodyParser = require('body-parser');
const BaseCtrl = require('northernstars-shared').genericHelper;
const StrategiesCtrl = require('northernstars-shared').strategiesCtrl;
const MongooseHelper = require('northernstars-shared').mongooseHelper;
const SysCtrl = require('./src/controllers/sys.controller');

/** App Variables **/
app.set('env', serviceSettings.environment);
app.set('serviceID', serviceSettings.id);
app.set('port', serviceSettings.port);

/** MongoDB connection **/
MongooseHelper.connect(mongoose, serviceSettings)
    .then(() => {
        return SysCtrl.ensureUnavailable();
    })
    .then(() => {
        /** Body Parser **/
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(bodyParser.json());

        /** Logger **/
        // TODO: Environmental variable (specified values from object in config)
        app.use(morgan('dev'));

        /** Server **/
        app.listen(app.get('port'), () => {
            console.log(`✅ ${serviceSettings.name} Server Listening on port ${app.get('port')} in ${app.get('env')} mode.`);
        });

        /** Generate Service Secret **/
        serviceSettings['secret'] = require('northernstars-shared').baseGenerator.generateRandom();

        return BaseCtrl.updateService(serviceSettings);
    })
    .then(response => {
        if (response.response.success) {
            // save the ROOT config
            serviceSettings.root['port'] = response.output.port;
            serviceSettings.root['secret'] = response.output.secret;
            serviceSettings.root['environment'] = response.output.environment;

            console.log('✅ Service configuration updated successfully.');
            return Promise.resolve();
        } else { return Promise.reject(response.response); }
    })
    .then(() => {

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

        /** Micro Service Communication **/
        app.use(StrategiesCtrl.microserviceCommunication);

        /** Expose API **/
        app.use('/api/', require('./src')(app));

        /** Invalid Endpoints **/
        app.use(BaseCtrl.invalidEndpoint);

        /** Response Error Handler **/
        app.use(BaseCtrl.handleError);

        return Promise.resolve();
    })
    .then(() => {
        /** Match Reminders **/
        // TODO: Route to force start reminder
        SysCtrl.reminders();
    })
    .catch(error => {
       console.log(error);
       process.exit(1);
    });
