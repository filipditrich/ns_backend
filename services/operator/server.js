const app = require('express')();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const serviceConfig = require('./src/v1/config/service.config');
const passport = require('passport');
const BaseCtrl = require('../../_repo/helpers/generic.helper');

/** App Variables **/
app.set('env', serviceConfig.environment);
app.set('serviceID', serviceConfig.id);
app.set('port', serviceConfig.port);

/** Mongoose **/
require('../../_repo/helpers/mongoose.helper')(serviceConfig);

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
app.use(function (req, res, next) {
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
    console.log(`✅ ${serviceConfig.name} Server Listening on port ${app.get('port')} in ${app.get('env')} mode.`);
});

/** Expose API (v1) **/
// app.use('/api/v1/', require('./src/v1')(app));

/** Invalid Endpoints **/
app.use(BaseCtrl.invalidEndpoint);

/** Response Error Handler **/
app.use(BaseCtrl.handleError);