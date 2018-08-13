/**
 * @description Core Worker Server
 * @author filipditrich
 */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const chalk = require('chalk');
const routes = require('./routes/index.route');
const morgan = require('morgan');
const passport = require('passport');
const routeHelper = require('../../common/helpers/route.helper');
const endpoints = require('./config/endpoints.config');

// App Variables
app.set('port', process.env.PORT || 3001);
app.set('env', process.env.NODE_ENV || 'development');
app.set('worker', process.env.WKR_ID || 'core');


// Mongoose ORM
require('../../common/config/mongoose.config')(app.get('env'), 'auth');

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Morgan Logger
app.use(morgan('dev')); // TODO: env -dev?

// Passport Configuration
require('../../common/config/passport.config')(passport, app.get('env'));
app.use(passport.initialize());
app.use(passport.session());

// Provoke Routes
routeHelper.matrix(endpoints, null, 'each', endpoints, 'core')
    .then(() => {
        console.log('%s Routes successfully provoked.', chalk.green('✅'));
    })
    .catch(error => {
        console.log('%s Routes couldn\'t have been provoked! : ' + error, chalk.red('❌'));
    });

// Listen on Server
app.listen(app.get('port'), () => {
    console.log('%s Auth Worker server listening on port %d in %s mode', chalk.green('✅'), app.get('port'), app.get('env'));
});

// CORS
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

// Export Routes
routes(app);