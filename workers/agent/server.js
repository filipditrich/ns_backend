/**
 * @description Auth Worker Server
 * @author filipditrich
 */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const chalk = require('chalk');
const morgan = require('morgan');
const passport = require('passport');
const endpoints = require('./config/endpoints.config');
const commonEndpoints = require('../../common/config/endpoints.config');
const workerConfig = require('./config/worker.config');
const configHelper = require('../../common/helpers/config.helper');
const routeHelper = require('../../common/helpers/route.helper');


// App Variables
app.set('env', process.env.NODE_ENV || 'development');
app.set('worker', process.env.WKR_ID || 'auth');

// Create the Worker Configuration
configHelper(app.get('env'), app.get('worker'), workerConfig);

app.set('port', process.env.PORT || workerConfig.port());

// Mongoose ORM
require('../../common/config/mongoose.config')(workerConfig);

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Morgan Logger
app.use(morgan('dev'));

// Passport Configuration
require('../../common/config/passport.config')(passport, workerConfig.environment());
app.use(passport.initialize());
app.use(passport.session());

// Provoke Routes
routeHelper.matrix(endpoints, null, 'each', endpoints, workerConfig.worker().id)
    .then(() => {
        console.log('%s Routes successfully provoked.', chalk.green('✅'));
        commonEndpoints[workerConfig.worker().id] = endpoints;

        // Export Routes
        require('./routes/index.route')(app);
    })
    .catch(error => {
        console.log(`${chalk.red('❌')} Routes couldn't have been provoked! :`, error); process.exit(1)
    });

// Listen on Server
app.listen(app.get('port'), () => {
    console.log('%s %s Worker server listening on port %d in %s mode', chalk.green('✅'),workerConfig.worker().id.replace(/\b\w/g, l => l.toUpperCase()), workerConfig.port(), workerConfig.environment());
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