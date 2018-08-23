const app = require('express')();
const morgan = require('morgan');
const passport = require('passport');
const bodyParser = require('body-parser');
const serviceSettings = require('./src/v1/config/settings.config');
const BaseCtrl = require('northernstars-shared').genericHelper;

/** App Variables **/
app.set('env', serviceSettings.environment);
app.set('serviceID', serviceSettings.id);
app.set('port', serviceSettings.port);

/** Mongoose **/
require('northernstars-shared').mongooseHelper(serviceSettings);

/** Body Parser **/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/** Passport **/
require('./src/v1/config/passport.config')(passport);
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

/** Expose API (v1) **/
app.use('/api/v1/', require('./src/v1')(app));

/** Invalid Endpoints **/
app.use(BaseCtrl.invalidEndpoint);

/** Response Error Handler **/
app.use(BaseCtrl.handleError);