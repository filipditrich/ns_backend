const app = require('express')();
const morgan = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const serviceSettings = require('./src/config/settings.config');
const BaseCtrl = require('northernstars-shared').genericHelper;

/** App Variables **/
app.set('env', serviceSettings.environment);
app.set('serviceID', serviceSettings.id);
app.set('port', serviceSettings.port);

/** Mongoose **/
require('northernstars-shared').mongooseHelper.connect(mongoose, serviceSettings)
.then(() => {

    /** Body Parser **/
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    /** Passport **/
    require('./src/config/passport.config')(passport);
    app.use(passport.initialize());
    app.use(passport.session());

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

    /** API Consumers **/
    app.use((req, res, next) => {
        require('northernstars-shared').strategiesCtrl.apiConsumers(req, res, next, serviceSettings.environment);
    });

    /** Expose API **/
    app.use('/api/', require('./src')(app));

    /** Invalid Endpoints **/
    app.use(BaseCtrl.invalidEndpoint);

    /** Response Error Handler **/
    app.use(BaseCtrl.handleError);

    /** Service Availability Checker **/
    setInterval(() => { require('./src/controllers/system.controller').serviceChecker() }, 1800000);

})
.catch(error => {
    console.log(error);
    process.exit(1);
});

module.exports = app;