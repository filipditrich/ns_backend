const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const chalk = require('chalk');
const routes = require('./routes/index.route');
const morgan = require('morgan');
const passport = require('passport');
const cors = require('cors');
const routeHelper = require('../../common/helpers/route-helper');
const endpoints = require('./config/endpoints.config');

// App Variables
app.set('port', process.env.PORT || 3001);
app.set('env', process.env.NODE_ENV || 'development');

// Mongoose ORM
require('../../common/config/mongoose')(app.get('env'));

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cross-Origin Requests
app.use(cors());

// Morgan Logger
app.use(morgan('dev'));

// Passport Configuration
require('../../common/config/passport')(passport, app.get('env'));
app.use(passport.initialize());
app.use(passport.session());

// Provoke Routes
routeHelper.matrix(endpoints, null, 'each', endpoints)
    .then(() => {
        console.log('%s Routes successfully provoked.', chalk.green('✅'));
    })
    .catch(error => {
        console.log('%s Routes couldn\'t have been provoked! : ' + error, chalk.red('❌'));
    });

// Listen on Server
app.listen(app.get('port'), () => {
    console.log('%s Backdrop Worker server listening on port %d in %s mode.', chalk.green('✅'), app.get('port'), app.get('env'));
});

// Export Routes
routes(app);