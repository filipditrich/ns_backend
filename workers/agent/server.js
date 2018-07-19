const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const chalk = require('chalk');
const routes = require('./routes/index');
const morgan = require('morgan');
const passport = require('passport');
const cors = require('cors');

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

// Listen Server
app.listen(app.get('port'), () => {
   console.log('%s Agent Worker server listening on port %d in %s mode', chalk.green('[✓]'), app.get('port'), app.get('env'));
});

const mh = require('../../common/helpers/mail-helper');

app.get('/', (req, res) => {
    mh.send('registration-requested', [{ email: 'ditrich@visionarygraphics.cz', subject: 'Test Email', name: 'Tester 01' }])
        .then(r => {res.send("MAIL SENT")}).catch(err => { return next(err)});
});

routes(app);

// Response Handler (Errors)
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        response: {
            identifier: error.name || error.identifier,
            message: error.message,
            success: error.success || false,
            status: error.status || 500,
            stack: error.stack || null
        }
    })
});