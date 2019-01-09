const sysCodes = require('northernstars-shared').sysCodes;
const enums = require('../assets/enums.asset');
const conf = require('northernstars-shared').serverConfig;
const serviceSettings = require('../config/settings.config');
const codes = require('../assets/codes.asset');
const settings = require('../config/settings.config');
const _ = require('lodash');

/**
 * @description Exports/Exposes service's codes
 * @param req
 * @param res
 * @param next
 */
exports.exportCodes = (req, res, next) => {
    res.json({ response: sysCodes.RESOURCE.LOADED, output: codes });
};

/**
 * @description Exports/Exposes service's route configuration
 * @param req
 * @param res
 * @param next
 */
exports.exportRoutes = (req, res, next) => {
    const routes = require('../routes/index.route.conf');
    const allowed = ['id', 'method', 'url', 'params', 'roles'];
    const output = _.map(routes, _.partialRight(_.pick, allowed));

    res.json({ response: sysCodes.RESOURCE.LOADED, output: output });
};

/**
 * @description Checks the service's up-time
 * @param req
 * @param res
 * @param next
 */
exports.upCheck = (req, res, next) => {
    res.json({ response: sysCodes.REQUEST.PROCESSED, output: { runtime: process.uptime() }});
};

/**
 * @description Updates the root service configuration
 * @param req
 * @param res
 * @param next
 */
exports.rootUpdate = (req, res, next) => {
    const _root = req.body['root'];
    settings.root['port'] = _root.port;
    settings.root['secret'] = _root.secret;
    settings.root['environment'] = _root.environment;
    res.json({ response: sysCodes.REQUEST.PROCESSED });
};

/**
 * @description Ensures that every required (unavailable <model>) exists
 * @return {Promise<T>}
 */
exports.ensureUnavailable = () => {
    const Jersey = require('../models/jersey.model');
    const MatchGroup = require('../models/match-group.model');
    const Place = require('../models/place.model');
    const Team = require('../models/team.model');

    // TODO: create CLI for this proccess
    return Jersey.findOne({ name: '(unavailable jersey)' }).exec()
        .then(jersey => {
            if (!jersey) {
                console.log("Creating default '(unavailable jersey)' jersey");
                new Jersey({ name: '(unavailable jersey)' }).save()
                    .then(() => MatchGroup.findOne({ name: '(unavailable group)' }).exec());
            }
            return MatchGroup.findOne({ name: '(unavailable group)' }).exec();
        })
        .then(group => {
            if (!group) {
                console.log("Creating default '(unavailable group)' group");
                new MatchGroup({ name: '(unavailable group)' }).save()
                    .then(() => Place.findOne({ name: '(unavailable place)' }).exec());
            }
            return Place.findOne({ name: '(unavailable place)' }).exec();
        })
        .then(place => {
            if (!place) {
                console.log("Creating default '(unavailable place)' place");
                new Place({ name: '(unavailable place)' }).save()
                    .then(() => Team.findOne({ name: '(unavailable team)' }).exec());
            }
            return Team.findOne({ name: '(unavailable team)' }).exec();
        })
        .then(team => {
            if (!team) {
                console.log("Creating default '(unavailable team)' team");
                return new Team({ name: '(unavailable team)' }).save();
            }
            return Promise.resolve();
        })
        .catch(error => {
            return Promise.reject(error);
        });

};

/**
 * @description Match Reminders
 */
exports.reminders = () => {
    setInterval(() => {
        const Match = require('../models/match.model');
        const moment = require('moment');
        const rp = require('request-promise');
        console.log(`\n[REMINDER]› started: ${moment().format('Do MMM, hh:mm:ss')} | next reminder: ${moment().add(2, 'hours').format('Do MMM, hh:mm:ss')}`);

        Match.find({}).exec()
            .then(matches => {
                if (matches.length > 0) {
                    matches.forEach(match => {
                        if (match.reminder.remind && !match.reminder.hasBeenReminded
                        && moment(new Date()).isSameOrAfter(moment(match.reminder.reminderDate))) {

                            rp({
                                method: 'POST',
                                uri: `http://${serviceSettings.root.host}:${serviceSettings.root.port}/api/sys/reminders`,
                                body: {
                                    input: {matchInfo: match}
                                },
                                headers: {
                                    'X-Secret': conf[serviceSettings.environment].secret.secret,
                                    'Application-ID': conf[serviceSettings.environment].consumers[0]
                                },
                                json: true,
                            }).then(res => {
                                const update = match.reminder;
                                update.reminder.hasBeenReminded = true;
                                match.update({ reminder: update }).then((s) => {
                                    const sent = res.output.sent;
                                    console.log(`\n[REMINDER]› START - ${match.title}`);
                                    console.log(`› UPCOMING REMINDER: Sent ${sent.upcomingSent.length}/${sent.upcoming.length} emails.`);
                                    console.log(`› MATCH REMINDER: Sent ${sent.reminderSent.length}/${sent.reminder.length} emails.`);
                                    console.log(`› SENT: ${sent.reminderSent.length + sent.upcomingSent.length} emails out of ${sent.usersTotal} total users.`);
                                    console.log(`\n[REMINDER]› END - ${match.title}`);
                                }).catch(error => {
                                    console.log(error);
                                });
                            }).catch(error => {
                                console.log(error);
                            });
                        }
                    });
                }
            }).catch(error => {
            console.log(error)
        });
    }, 7200000);

};
