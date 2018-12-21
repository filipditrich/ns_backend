const app = require('express')();
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const serviceSettings = require('./src/config/settings.config');
const BaseCtrl = require('northernstars-shared').genericHelper;
const StrategiesCtrl = require('northernstars-shared').strategiesCtrl;
const MongooseHelper = require('northernstars-shared').mongooseHelper;
const conf = require('northernstars-shared').serverConfig;
const serviceConf = require('./src/config/settings.config');

/** App Variables **/
app.set('env', serviceSettings.environment);
app.set('serviceID', serviceSettings.id);
app.set('port', serviceSettings.port);

/** Mongoose **/
MongooseHelper.connect(mongoose, serviceSettings)
.then(() => {

    /** Body Parser **/
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

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

    /** Generate Service Secret **/
    serviceSettings['secret'] = require('northernstars-shared').baseGenerator.generateRandom();

    /** Service Configuration **/
    BaseCtrl.updateService(serviceSettings).then(response => {
        if (response.response.success) {
            console.log('✅ Service configuration updated successfully.');

            // save the ROOT config
            serviceSettings.root = {
                host: response.output.host,
                port: response.output.port,
                secret: response.output.secret,
                environment: response.output.environment
            };

            /** Micro Service Communication **/
            app.use(StrategiesCtrl.microserviceCommunication);

            /** Expose API **/
            app.use('/api/', require('./src')(app));

            /** Invalid Endpoints **/
            app.use(BaseCtrl.invalidEndpoint);

            /** Response Error Handler **/
            app.use(BaseCtrl.handleError);

        } else {
            console.log('❌ Something went wrong. The request has been processed but with no success output', response.response);
            process.exit(1);
        }
    }).catch(error => {
        console.log('❌ Error while updating service configuration. ', error);
        process.exit(1);
    });

    /**
     * @description interval for Match Reminder
     */
    setInterval(() => {
        console.log(`\n------------ REMINDER STARTED ------------\n`);
        const Match = require('./src/models/match.model');
        const moment = require('moment');
        const rp = require('request-promise');

        Match.find({}).exec()
            .then(matches => {
                if (matches.length > 0) {
                    matches.forEach(match => {
                        if (!match.hasBeenReminded && moment(new Date()).isSame(match.reminderDate, 'day')) {
                            match.hasBeenReminded = true;
                            const userArr = match.enrollment.players.map(x => x.player);
                            rp({
                                method: 'POST',
                                uri: `http://localhost:4000/api/sys/reminders`,
                                body: {
                                    input: {mailList: userArr}
                                },
                                headers: {
                                    'X-Secret': conf[serviceSettings.environment].secret.secret,
                                    'Application-ID': conf[serviceSettings.environment].consumers[0]
                                },
                                json: true,
                            }).then(res => {
                                match.save().then(() => {
                                    const sent = res.output.sent;
                                    console.log(`UPCOMING REMINDER: Sent ${sent.upcomingSent.length}/${sent.upcoming.length} emails.`);
                                    console.log(`MATCH REMINDER: Sent ${sent.reminderSent.length}/${sent.reminder.length} emails.`);
                                    console.log(`SENT: ${sent.reminderSent.length + sent.upcomingSent.length} emails out of ${sent.usersTotal} total users.`);
                                    console.log(`\n------------ REMINDER ENDED ------------\n`);
                                }).catch(error => {
                                    console.log(error);
                                });
                            }).catch(error => {
                                console.log(error);
                            });
                        } else {
                            console.log('~~nothing to remind~~');
                            console.log(`\n------------ REMINDER ENDED ------------\n`);
                        }
                    });
                }
            }).catch(error => {
            console.log(error)
        });
    }, 2 * 60 * 60 * 1000); // every 2 hours
    // }, 10000);

})
.catch(error => {
    console.log(error);
    process.exit(1);
});