const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const chalk = require('chalk');
const routes = require('./routes/index');
const morgan = require('morgan');
const passport = require('passport');
const cors = require('cors');
const config = require('../../common/config/common');

// App Variables
app.set('port', process.env.PORT || 3000);
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

// Listen on Server
app.listen(app.get('port'), () => {
   console.log('%s Agent Worker server listening on port %d in %s mode', chalk.green('[✓]'), app.get('port'), app.get('env'));
});

// Export Routes
routes(app);