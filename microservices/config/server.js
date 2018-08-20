/**
 * Core Micro Service Server
 */

const app = require('express')();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const BaseCtrl = require('../../_repo/helpers/generic.helper');
const StrategiesCtrl = require('../../_repo/controllers/strategies.controller');
const serviceConfig = require('./api/v1/config/self.config');

/** App Variables **/
app.set('env', process.env.NODE_ENV || serviceConfig.environment);
app.set('serviceID', process.env.SVC_ID || serviceConfig.id);
app.set('port', process.env.PORT || serviceConfig.port);

/** Mongoose **/
require('../../_repo/helpers/mongoose.helper')(serviceConfig);

/** Body Parser **/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/** Logger **/
app.use(morgan('dev'));

/** Cross-Origin Requests **/
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, App-Handle-Errors-Generically, Application-ID, X-Secret, X-Microservice-Communication-Secret");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        res.end();
    } else {
        next();
    }
});

/** Server **/
app.listen(app.get('port'), () => {
    console.log(`✅ ${serviceConfig.name} Server Listening on port ${app.get('port')} in ${app.get('env')} mode.`);
});

/** API Consumer Authorization **/
app.use((req, res, next) => { StrategiesCtrl.apiConsumers(req, res, next, serviceConfig) });

/** Micro Service Communication Check **/
app.use(StrategiesCtrl.microserviceCommunication);

/** Expose API (v1) **/
app.use('/api/v1/', require('./api/v1/core')(app));

/** Invalid Endpoints **/
app.use(BaseCtrl.invalidEndpoint);

/** Response Error Handler **/
app.use(BaseCtrl.handleError);