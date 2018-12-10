const errorHelper = require('northernstars-shared').errorHelper;
const sysCodes = require('northernstars-shared').sysCodes;
const codes = require('../assets/codes.asset');
const service = require('../config/settings.config');
const Team = require('../models/team.model');
const rp = require('request-promise');

/**
 * @description Creates a Team
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
exports.create = (req, res, next) => {

    const input = req.body['input'];

    if (!input) return next(errorHelper.prepareError(codes.TEAM.MISSING));
    if (!input.name) return next(errorHelper.prepareError(codes.TEAM.NAME.MISSING));
    // if (!input.jersey) return next(errorHelper.prepareError(codes.TEAM.JERSEY.MISSING));

    Team.findOne({ name: input.name }).exec()
        .then(team => {

            if (team) return next(errorHelper.prepareError(codes.TEAM.DUPLICATE));

            const newTeam = new Team({
                name: input.name,
                jersey: input.jersey,
                createdBy: req.user._id,
                updatedBy: req.user._id
            });
            newTeam.save().then(() => {
                res.json({ response: codes.TEAM.CREATED });
            }).catch(error => {
                return next(errorHelper.prepareError(error));
            });

        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });

};

/**
 * @description Lists Team(s)
 * @param req
 * @param res
 * @param next
 */
exports.get = (req, res, next) => {

    const id = req.params['id'];
    const query = !!id ? { _id: id } : {};

    Team.find(query).exec()
        .then(teams => {

            teams = Boolean(req.query['show-all']) ? teams : teams.filter(team => team.name !== '(unavailable team)');

            if (teams.length === 0 && id) return next(errorHelper.prepareError(codes.TEAM.NOT_FOUND));
            if (teams.length === 0 && !id) return next(errorHelper.prepareError(codes.TEAM.NULL_FOUND));

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

            rp(options).then(response => {
                const users = response.body.output;
                if (users.length === 0) return next(errorHelper.prepareError(sysCodes.REQUEST.INVALID)); // this shouldn't happen

                const fin = [];

                // define deletedUserIndex (should always be in database)
                const deletedUserIndex = users.findIndex(obj => obj.username === 'deletedUser');
                if (deletedUserIndex === -1) console.error(`NO '(deleted user)' user defined!`);

                teams.forEach(team => {
                    team = team.toObject();

                    // extend 'createdBy' field
                    const createdByIndex = users.findIndex(obj => obj._id.toString() === team.createdBy.toString());
                    team.createdBy = createdByIndex >= 0 ? users[createdByIndex] : users[deletedUserIndex];

                    // extend 'updatedBy' field
                    const updatedByIndex = users.findIndex(obj => obj._id.toString() === team.updatedBy.toString());
                    team.updatedBy = updatedByIndex >= 0 ? users[updatedByIndex] : users[deletedUserIndex];

                    fin.push(team);
                });

                res.json({ response: sysCodes.RESOURCE.LOADED, output: fin });

            }).catch(error => {
                return next(errorHelper.prepareError(error));
            });

        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });

};

/**
 * @description Updates a Team
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
exports.update = (req, res, next) => {

    const id = req.params['id'];
    const update = req.body['input'];

    if (!update) return next(errorHelper.prepareError(codes.TEAM.MISSING));
    if (!update.name) return next(errorHelper.prepareError(codes.TEAM.NAME.MISSING));

    Team.findOne({ _id: id }).exec()
        .then(team => {
            if (!team) return next(errorHelper.prepareError(codes.TEAM.NOT_FOUND));

            Team.findOne({ name: update.name, _id: { $ne: team._id } }).exec()
                .then(duplicate => {
                   if (duplicate) return next(errorHelper.prepareError(codes.TEAM.DUPLICATE));

                    team.update(update, { runValidators: true }).then(() => {
                        res.json({ response: codes.TEAM.UPDATED });
                    }).catch(error => {
                        return next(errorHelper.prepareError(error));
                    });
                })
                .catch(error => {
                    return next(errorHelper.prepareError(error));
                });
        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });


};

/**
 * @description Deletes a Team
 * @param req
 * @param res
 * @param next
 */
exports.delete = (req, res, next) => {

    const id = req.params['id'];

    Team.findOne({ _id: id }).exec()
        .then(team => {

            // Find all affected Matches
            if (!team) return next(errorHelper.prepareError(codes.TEAM.NOT_FOUND));
            const Match = require('../models/match.model');

            Match.find({ 'afterMatch.teams' : team._id }).exec()
                .then(matches => {

                    // Replace all affected Matches with default 'Unavailable Team' team
                    Team.findOne({ name: '(unavailable team)' }).exec()
                        .then(defaultTeam => {

                            return new Promise((resolve, reject) => {
                                // If it doesn't exist yet, create it
                                if (!defaultTeam) {

                                    // Assign default 'Unavailable Jersey' jersey to it
                                    const Jersey = require('../models/jersey.model');
                                    Jersey.findOne({name: '(unavailable jersey)'}).exec()
                                        .then(defaultJersey => {
                                            return new Promise((success, fail) => {

                                                // If it doesn't exist yet, create it
                                                if (!defaultJersey) {
                                                    new Jersey({ name: '(unavailable jersey)' }).save().then(saved => success(saved))
                                                        .catch(error => fail(error));
                                                } else {
                                                    success(defaultJersey)
                                                }
                                            });
                                        })
                                        .then(DefaultJersey => {
                                            new Team({ name: '(unavailable team)', jersey: DefaultJersey._id }).save().then(defTeam => {
                                                resolve(defTeam);
                                            }).catch(error => reject(error));
                                        })
                                        .catch(error => {
                                            return next(errorHelper.prepareError(error));
                                        });
                                } else { resolve(defaultTeam) }
                            });

                            }).then(defaultTeam => {

                                matches.forEach(match => {
                                    match.afterMatch.teams.forEach((_team, i) => {
                                        if (_team === match._id) {
                                            match.afterMatch.teams[i] = defaultTeam._id;
                                        }
                                        if (match.afterMatch.winner === team._id) {
                                            match.afterMatch.winner = defaultTeam._id;
                                        }
                                    });
                                });

                                team.remove().then(() =>{
                                    res.json({ response: codes.TEAM.DELETED });
                                }).catch(error => {
                                    return next(errorHelper.prepareError(error));
                                });

                        })
                        .catch(error => {
                            return next(errorHelper.prepareError(error));
                        });
                })
                .catch(error => {
                    return next(errorHelper.prepareError(error));
                });
        });

};