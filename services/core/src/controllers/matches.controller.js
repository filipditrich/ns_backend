const errorHelper = require('northernstars-shared').errorHelper;
const userHelper = require('northernstars-shared').userHelper;
const sysCodes = require('northernstars-shared').sysCodes;
const enumHelper = require('northernstars-shared').enumHelper;
const mailHelper = require('northernstars-shared').mailHelper;
const Match = require('../models/match.model');
const MatchResult = require('../models/match-result.model');
const service = require('../config/settings.config');
const rp = require('request-promise');
const Place = require('../models/place.model');
const Jersey = require('../models/jersey.model');
const codes = require('../assets/codes.asset');
const MatchGroup = require('../models/match-group.model');
const moment = require('moment');
const objectIdRegExp = /^[0-9a-fA-F]{24}$/;
const enums = require('../assets/enums.asset');
const iV = require('northernstars-shared').validatorHelper.inputValidator;

/**
 * @description Creates a match
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
exports.create = (req, res, next) => {

    const input = req.body['input'];
    if (!input) return next(errorHelper.prepareError(codes.MATCH.MISSING));

    // validation
    const validators = [
        { field: 'title', rules: { required: true, min: 1, max: 99 } },
        { field: 'group', rules: { required: true, objectId: true } },
        { field: 'place', rules: { required: true, objectId: true } },
        { field: 'date', rules: { required: true, date: true } },
        { field: 'group', rules: { required: true, objectId: true } },
        { field: 'enrollment.maxCapacity', rules: { required: true, number: true, min: 1 } },
    ];
    const validation = iV.validate(input, validators);
    if (!validation.success) return next(errorHelper.prepareError(validation));

    const force = Boolean(req.query['force-create']);
    const d = new Date(input.date);
    const gte = new Date(d.getTime() - 3600000);
    const lte = new Date(d.getTime() + 3600000);

    Match.find({ date: { $gte: gte, $lte: lte } }).exec()
        .then(matches => {

            // If the match date is duplicate send response to the user
            // with an advise that hes making a dup and whether he wouldn't
            // rather just edit the already saved match with this date
            // ps:  its just a fucking stupid feature where I spent additional
            //      30 minutes, while in a insuperable rush before production
            //      mode deployment. :)

            let inRange = [];
            if (matches.length !== 0 && !force) {
                let same = [];
                matches.forEach(match => {
                    if (moment(match.date).isSame(new Date(input.date))) {
                        same.push(match)
                    } else {
                        inRange.push(match);
                    }
                });
                if (same.length !== 0) return next(errorHelper.prepareError(codes.MATCH.DATE.DUPLICATE));
                if (inRange.length !== 0) {
                    res.json({
                        response: codes.MATCH.DATE.DUPLICATE_ADVISABLE,
                        output: inRange
                    });
                }
            } else {
                Place.findOne({ _id: input.place }).exec()
                    .then(place => {
                        if (!place) return next(errorHelper.prepareError(codes.PLACE.NOT_FOUND));
                        input['createdBy'] = req.user._id;
                        input['updatedBy'] = req.user._id;

                        const newMatch = new Match(input);
                        newMatch.save().then(() => {
                            res.json({ response: codes.MATCH.CREATED });
                        }).catch(error => next(errorHelper.prepareError(error)));
                    }).catch(error => next(errorHelper.prepareError(error)));
            }
        }).catch(error => next(errorHelper.prepareError(error)));

};

/**
 * @description Outputs all matches or a specified match as an array of length 1
 * @param req
 * @param res
 * @param next
 */
exports.get = (req, res, next) => {

    const id = req.params['id'];
    const query = !!id ? { _id: id } : {};
    const matchResQuery = !!id ? { match: id }: {};

    Match.find(query).exec()
        .then(matches => {

            if (matches.length === 0 && id) return next(errorHelper.prepareError(codes.MATCH.NOT_FOUND));
            if (matches.length === 0 && !id) return next(errorHelper.prepareError(codes.MATCH.NULL_FOUND));
            const formatted = [];

            return MatchResult.find(matchResQuery).exec()
                .then(results => {
                    matches.forEach(match => {
                        let formattedMatch = match.toObject();
                        // create 'results' field
                        const matchResults = results.filter(x => x.match.toString() === match._id.toString());
                        formattedMatch['results'] = matchResults.length ? matchResults[0] : false;
                        formatted.push(formattedMatch);
                    });
                    return Jersey.find({}).exec();
                })
                .then(jerseys => {
                    // define unavailableJersey (should always be in database)
                    const unavailableJersey = jerseys.find(obj => obj.name === '(unavailable jersey)');
                    if (!unavailableJersey) console.error(`NO '(unavailable jersey)' jersey defined!`);

                    formatted.forEach(match => {
                        // extend 'results.players[i].jersey' fields
                        if (match['results']) {
                            match['results'].players.forEach((result, i) => {
                                const jersey = jerseys.find(x => x._id.toString() === result.jersey.toString());
                                match['results'].players[i].jersey = jersey || unavailableJersey;
                            });
                        }
                    });
                    return Place.find({}).exec();
                })
                .then(places => {
                    // define unavailablePlace (should always be in database)
                    const unavailablePlace = places.find(obj => obj.name === '(unavailable place)');
                    if (!unavailablePlace) console.error(`NO '(unavailable place)' place defined!`);

                    formatted.forEach(match => {
                        // extend 'place' field
                        const place = places.find(obj => obj._id.toString() === match.place.toString());
                        match.place = place || unavailablePlace;
                    });
                    return MatchGroup.find({}).exec();
                })
                .then(groups => {
                    // define unavailableGroup (should always be in database)
                    const unavailableGroup = groups.find(obj => obj.name === '(unavailable group)');
                    if (!unavailableGroup) console.error(`NO '(unavailable group)' group defined!`);

                    formatted.forEach(match => {
                        // extend 'group' field
                        const group = groups.find(obj => obj._id.toString() === match.group.toString());
                        match.group = group || unavailableGroup;
                    });
                    // options
                    delete req.headers['content-type'];
                    delete req.headers['content-length'];
                    const options = {
                        uri: `http://${service.services.operator.host}:${service.services.operator.port}/api/users?show-all=true`,
                        json: true,
                        resolveWithFullResponse: true,
                        method: 'GET',
                        headers: req.headers
                    };
                    return rp(options);
                })
                .then(response => {
                    const users = response.body.output;
                    if (users.length === 0) return next(errorHelper.prepareError(sysCodes.REQUEST.INVALID)); // this shouldn't happen

                    // define deletedUser (should always be in database)
                    const deletedUser = users.findIndex(obj => obj.username === 'deletedUser');
                    if (!deletedUser) console.error(`NO '(deleted user)' user defined!`);

                    formatted.forEach(match => {
                        // extend 'createdBy' field
                        const createdBy = users.find(obj => obj._id.toString() === match.createdBy.toString());
                        match.createdBy = createdBy || deletedUser;

                        // extend 'updatedBy' field
                        const updatedBy = users.find(obj => obj._id.toString() === match.updatedBy.toString());
                        match.updatedBy = updatedBy || deletedUser;

                        // extend enrollment players fields
                        match.enrollment.players.forEach((player, i) => {
                            const ePlayer = users.find(obj => obj._id.toString() === player.player.toString());
                            match.enrollment.players[i].info = ePlayer || deletedUser;
                        });

                        // extend result players fields if results are present
                        if (match.results) {
                            match.results.players.forEach((player, i) => {
                                const rPlayer = users.find(obj => obj._id.toString() === player.player.toString());
                                match.results.players[i].player = rPlayer || deletedUser;
                            });
                        }

                    });

                    res.json({ response: sysCodes.RESOURCE.LOADED, output: formatted });
                });
        }).catch(error => next(errorHelper.prepareError(error)));
};

/**
 * @description Updates a Match and notifies enrolled users about the change
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
exports.update = (req, res, next) => {

    const id = req.params['id'];
    const update = req.body['input'];
    if (!update) return next(errorHelper.prepareError(codes.MATCH.MISSING));

    // validation
    const validators = [
        { field: 'title', rules: { min: 1, max: 99 } },
        { field: 'group', rules: { objectId: true } },
        { field: 'place', rules: { objectId: true } },
        { field: 'date', rules: { date: true } },
        { field: 'group', rules: { objectId: true } },
        { field: 'enrollment.maxCapacity', rules: { number: true, min: 1 } },
    ];
    const validation = iV.validate(update, validators);
    if (!validation.success) return next(errorHelper.prepareError(validation));

    Match.findOne({ _id: id }).exec()
        .then(match => {

            if (!match) return next(errorHelper.prepareError(codes.MATCH.NOT_FOUND));

            // check if place is valid
            new Promise(resolve => {
                if (update.place) {
                    Place.findOne({ _id: update.place }).exec()
                        .then(place => {
                            if (!place) return next(errorHelper.prepareError(codes.PLACE.NOT_FOUND));
                            update.place = place._id;
                            resolve();
                        })
                        .catch(error => next(errorHelper.prepareError(error)));
                } else { resolve(); }
            }).then(() => {
                // check if group is valid
                return new Promise(resolve => {
                    if (update.group) {
                        MatchGroup.findOne({ _id: update.group }).exec()
                            .then(group => {
                                if (!group) return next(errorHelper.prepareError(codes.MATCH.GROUP.NOT_FOUND));
                                update.group = group._id;
                                resolve();
                            })
                    } else { resolve(); }
                });
            }).then(() => {
                match.update(update, { runValidators: true })
                    .then(() => {

                        // get differences (update)
                        match = match.toObject();
                        let diff = Object.keys(update).reduce((diff, key) => {
                            if (match[key] === update[key]) return diff;
                            return { ...diff, [key]: update[key] }
                        }, {});

                        // determine whether to notify enrolled users or not
                        const notify = Boolean(req.query['notify']) && moment(match.date).isAfter(new Date()) && Object.keys(diff).length;

                        new Promise(resolve => {
                            if (notify) {
                                const notifications = [];

                                // options
                                delete req.headers['content-type'];
                                delete req.headers['content-length'];
                                const options = {
                                    uri: `http://${service.services.operator.host}:${service.services.operator.port}/api/users?show-all=true`,
                                    json: true,
                                    resolveWithFullResponse: true,
                                    method: 'GET',
                                    headers: req.headers
                                };

                                // get data for each user to whom is going to be the notification sent
                                rp(options).then(response => {
                                    const users = response.body.output;
                                    if (users.length === 0) return next(errorHelper.prepareError(sysCodes.REQUEST.INVALID)); // this shouldn't happen

                                    // create the notification
                                    match.enrollment.players.filter(x => x.status === enums.MATCH.ENROLL_STATUS.going.key).forEach(player => {
                                        const user = users.find(x => x._id.toString() === player.player.toString());
                                        notifications.push({
                                            match, diff,
                                            email: user.email,
                                            username: user.username,
                                            name: user.name,
                                            updatedBy: req.user.username,
                                            updatedByName: req.user.name,
                                            subject: 'Match Update',
                                        });
                                    });

                                    // send emails with the notification
                                    mailHelper.mail('match-update', notifications).then(output => {
                                        resolve(output);
                                    }).catch(error => next(errorHelper.prepareError(error)));
                                }).catch(error => next(errorHelper.prepareError(error)));
                            } else resolve();
                        }).then(status => {
                            res.json({
                                response: notify ? sysCodes.MAILING.SENT : codes.MATCH.UPDATED,
                                output: { mailing: !!status ? status : notify, diff }
                            });
                        }).catch(error => next(errorHelper.prepareError(error)));
                    })
                    .catch(error => next(errorHelper.prepareError(error)));
                })
                .catch(error => next(errorHelper.prepareError(error)));
        })
        .catch(error => next(errorHelper.prepareError(error)));

};

/**
 * @description Deletes a Match
 * @param req
 * @param res
 * @param next
 */
exports.delete = (req, res, next) => {

    const id = req.params['id'];

    Match.findOne({ _id: id }).exec()
        .then(match => {
            if (!match) return next(errorHelper.prepareError(codes.MATCH.NOT_FOUND));
            match.remove().then(() => {
                res.json({ response: codes.MATCH.DELETED });
            }).catch(error => next(errorHelper.prepareError(error)));
        }).catch(error => next(errorHelper.prepareError(error)));

};

/**
 * @description Adds/Updates user (requester) enrollment status
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
exports.matchParticipation = (req, res, next) => {

    const input = req.body['input'];
    if (!input || !input.id) return next(errorHelper.prepareError(codes.MATCH.MISSING));
    if (!input.enrollment) return next(errorHelper.prepareError(codes.MATCH.ENROLLMENT.MISSING));
    if (!input.enrollment.status) return next(errorHelper.prepareError(codes.MATCH.ENROLLMENT.PLAYERS.STATUS.MISSING));

    // assign user ID on server side, so the requester can only enroll himself
    input.enrollment.player = req.user._id;

    Match.findOne({ _id: input.id }).exec()
        .then(match => {
            if (!match) return next(errorHelper.prepareError(codes.MATCH.NOT_FOUND));
            if (moment(match.enrollment.enrollmentCloses).isBefore(new Date()))
                return next(errorHelper.prepareError(codes.MATCH.ENROLLMENT.CLOSES.CLOSED));
            if (input.enrollment.status === enums.MATCH.ENROLL_STATUS.going.key
                && match.enrollment.players.filter(player => player.status === enums.MATCH.ENROLL_STATUS.going.key).length >= match.enrollment.maxCapacity) {
                return next(errorHelper.prepareError(codes.MATCH.ENROLLMENT.MAX_CAP.EXCEEDED));
            }

            const matchPlayers = match.enrollment.players;
            const duplicate = matchPlayers.filter(enrolled => enrolled.player.toString() === input.enrollment.player.toString())[0];
            const isUpdating = !!duplicate && duplicate.status !== input.enrollment.status;
            const isDuplicate = !!duplicate && duplicate.status === input.enrollment.status;
            if (isDuplicate) return next(errorHelper.prepareError(codes.MATCH.ENROLLMENT.PLAYERS.STATUS.ALREADY_PARTICIPATING));

            let update;
            if (isUpdating) {
                duplicate.status = input.enrollment.status;
                duplicate.enrolledOn = new Date();
                const playerIndex = matchPlayers.findIndex(obj => obj.player.toString() === duplicate.player.toString());
                matchPlayers[playerIndex] = duplicate;

                update = { "enrollment.players": matchPlayers };
            } else {
                update = { $push: { "enrollment.players": input.enrollment } };
            }

            match.update(update, { runValidators: true }).then(() => {
                res.json({ response: codes.MATCH.UPDATED });
            }).catch(error => next(errorHelper.prepareError(error)));
        }).catch(error => next(errorHelper.prepareError(error)));
};

/**
 * @description Cancels a Match
 * @param req
 * @param res
 * @param next
 */
// TODO: implement + send mail to attendants
exports.cancelMatch = (req, res, next) => {

    const id = req.params['id'];
    let reqUser;
    userHelper.getUser(req.headers)
        .then(user => reqUser = user)
        .catch(error =>  next(errorHelper.prepareError(error)));

    Match.findOne({ _id: id }).exec()
        .then(match => {
            if (!match) return next(errorHelper.prepareError(codes.MATCH.NOT_FOUND));
            const cancellation = {
                cancelled: true,
                cancelledBy: reqUser._id,
                cancelledByUser: reqUser.name
            };
            match.update(cancellation).then(() => {
                res.json({ response: codes.MATCH })
            }).catch(error =>  next(errorHelper.prepareError(error)))
        }).catch(error => next(errorHelper.prepareError(error)));

};

/**
 * @description Writes Match results
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
// TODO - delete 'draft' sitation :--) fuckheads...
exports.writeResults = (req, res, next) => {
    const input = req.body['input'];
    const resEnums = enums.MATCH.RESULT;

    // input validation
    if (!input) return next(errorHelper.prepareError(codes.RESULTS.PLAYERS.MISSING));
    if (!input.match) return next(errorHelper.prepareError(codes.RESULTS.MATCH.MISSING));
    if (!input.match.match(objectIdRegExp)) return next(errorHelper.prepareError(sysCodes.REQUEST.INPUT.OBJECT_ID_ERR));
    if (!input.jersey) return next(errorHelper.prepareError(codes.RESULTS.PLAYERS.JERSEY.MISSING));
    if (!input.jersey.match(objectIdRegExp)) return next(errorHelper.prepareError(sysCodes.REQUEST.INPUT.OBJECT_ID_ERR));
    if (!input.status) return next(errorHelper.prepareError(codes.RESULTS.PLAYERS.STATUS.MISSING));
    if (enumHelper.toArray(resEnums).indexOf(input.status) < 0)
        return next(errorHelper.prepareError(codes.RESULTS.PLAYERS.STATUS.INVALID));

    // get request user
    let reqUser = !!req.user ? req.user : false;
    if (!reqUser) userHelper.getUser(req.headers)
        .then(user => reqUser = user)
        .catch(error => next(errorHelper.prepareError(error)));

    Match.findOne({ _id: input.match }).exec()
        .then(match => {
            // match to write results to does not exits
            if (!match) return next(errorHelper.prepareError(codes.MATCH.NOT_FOUND));
            // user requesting to write results has not been enrolled to it
            if (match.enrollment.players.map(x => x.player.toString()).indexOf(reqUser._id) < 0)
                return next(errorHelper.prepareError(codes.RESULTS.MATCH.NOT_ENROLLED));
            // match has not been played yet (is in the future)
            if (moment(match.date).isAfter(new Date()))
                return next(errorHelper.prepareError(codes.RESULTS.MATCH.NOT_PLAYED));

            Jersey.findOne({ _id: input.jersey }).exec()
                .then(jersey => {
                    if (!jersey) return next(errorHelper.prepareError(codes.RESULTS.PLAYERS.JERSEY.NOT_FOUND));
                    MatchResult.findOne({ match: match._id }).exec()
                        .then(result => {
                            let newResult;
                            if (!result) {
                                newResult = new MatchResult({
                                    match: match._id,
                                    players: [{ player: reqUser._id, jersey: input.jersey, status: input.status }]
                                });
                                newResult.save().then(() => {
                                    res.json({ response: sysCodes.REQUEST.PROCESSED });
                                }).catch(error => {
                                    return next(errorHelper.prepareError(error));
                                });
                            } else {
                                const winRes = result.players.filter(x => x.status === resEnums.win.key);
                                const looseRes = result.players.filter(x => x.status === resEnums.loose.key);
                                const draftRes = result.players.filter(x => x.status === resEnums.draft.key);

                                // can't write results more than once
                                if (result.players.findIndex(x => x.player.toString() === reqUser._id.toString()) >= 0)
                                    return next(errorHelper.prepareError(codes.RESULTS.PLAYERS.PLAYER.DUPLICATE));
                                // cannot write draft if already written as LOOSE or WIN
                                if ((looseRes.length || winRes.length) && input.status === resEnums.draft.key)
                                    return next(errorHelper.prepareError(codes.RESULTS.PLAYERS.STATUS.IMPROPER));
                                // cannot write WIN or LOOSE if already written as DRAFT
                                if (draftRes.length && (input.status === resEnums.win.key || input.status === resEnums.loose.key))
                                    return next(errorHelper.prepareError(codes.RESULTS.PLAYERS.STATUS.IMPROPER));
                                // check if input jersey and status corresponds to the written results with same
                                // result as input only when (w/l situation)
                                const sameRes = result.players.filter(x => x.status === input.status);
                                if (input.status !== resEnums.draft.key && sameRes.length
                                    && (sameRes.map(y => y.jersey.toString()).indexOf(jersey._id.toString()) < 0
                                        || sameRes.map(z => z.status).indexOf(input.status) < 0))
                                    return next(errorHelper.prepareError(codes.RESULTS.PLAYERS.STATUS.IMPROPER));
                                const diffRes = result.players.filter(x => x.status !== input.status);
                                if (input.status !== resEnums.draft.key && diffRes.length
                                    && (diffRes.map(y => y.jersey.toString()).indexOf(jersey._id.toString()) >= 0
                                        || diffRes.map(z => z.status).indexOf(input.status) >= 0))
                                    return next(errorHelper.prepareError(codes.RESULTS.PLAYERS.STATUS.IMPROPER));
                                // check if input jersey is corresponding to the already written result jerseys
                                const jerseyArr = Array.from([ ...new Set(result.players.map(x => x.jersey.toString())) ]);
                                if (jerseyArr.length > 1 && jerseyArr.indexOf(jersey._id.toString()) < 0)
                                    return next(errorHelper.prepareError(codes.RESULTS.PLAYERS.JERSEY.OUT_OF_SET));
                                // check if input status is corresponding to the already written result inputs
                                const statusArr = Array.from([ ...new Set(result.players.map(x => x.status)) ]);
                                if (statusArr.length > 1 && statusArr.indexOf(input.status) < 0) {
                                    return next(errorHelper.prepareError(codes.RESULTS.PLAYERS.STATUS.IMPROPER));
                                }

                                result.players.push({
                                    player: reqUser._id,
                                    jersey: jersey._id,
                                    status: input.status
                                });

                                result.save().then(() => {
                                    res.json({ response: sysCodes.REQUEST.PROCESSED });
                                }).catch(error => next(errorHelper.prepareError(error)));
                            }
                        }).catch(error => next(errorHelper.prepareError(error)));
                }).catch(error => next(errorHelper.prepareError(error)));
        }).catch(error => next(errorHelper.prepareError(error)));
};