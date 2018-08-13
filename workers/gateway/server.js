/**
 * @description Main Server File - API Gateway
 * @author filipditrich
 */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const chalk = require('chalk');
const routes = require('./routes/index.route');
const morgan = require('morgan');
const passport = require('passport');
const mailing = require('../../common/config/nodemailer.config');

// App Variables
app.set('port', process.env.PORT || 4000);
app.set('env', process.env.NODE_ENV || 'development');

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Morgan Logger
app.use(morgan('dev'));

// Passport Configuration
require('../../common/config/passport.config')(passport, app.get('env'));
app.use(passport.initialize());
app.use(passport.session());

// Check SMTP Connection
mailing.checkAuth().then(() => {
    console.log('%s SMTP Connection has been established.', chalk.green('✅'));
}).catch(error => {
    console.log('%s SMTP Connection could not be established! : %s', chalk.red('❌'), error);
});

// // TODO: Https
// const fs = require('fs');
// const https = require('https');
// const options = {
//     key: fs.readFileSync('../../common/assets/ssl/app.key'),
//     cert: fs.readFileSync('../../common/assets/ssl/app.crt'),
//     requestCert: false,
//     rejectUnauthorized: false
// };
// // Listen on Server
// const server = https.createServer(options, app).listen(app.get('port'), () => {
//     console.log('%s API Gateway server listening on port %d in %s mode', chalk.green('✅'), app.get('port'), app.get('env'));
// });

app.listen(app.get('port'), () => {
    console.log('%s API Gateway server listening on port %d in %s mode', chalk.green('✅'), app.get('port'), app.get('env'));
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