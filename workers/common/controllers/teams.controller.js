const Team = require('../models/team.model');
const errorHelper = require('../../../common/helpers/error.helper');
const codes = require('../assets/codes');
const commonCodes = require('../../../common/assets/codes');

exports.addTeam = (req, res, next) => {

    const input = req.body['team'];

    if (!input) return next(errorHelper.prepareError(codes.TEAM.MISSING));
    if (!input.name) return next(errorHelper.prepareError(codes.TEAM.NAME.MISSING));
    if (!input.jersey) return next(errorHelper.prepareError(codes.TEAM.JERSEY.MISSING));

    Team.findOne({ name: input.name }).exec()
        .then(team => {

            if (team) return next(errorHelper.prepareError(codes.TEAM.DUPLICATE));

            const newTeam = new Team({
                name: input.name,
                jersey: input.jersey
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

exports.getTeams = (req, res, next) => {

    const id = req.params['id'];
    const query = !!id ? { _id: id } : {};

    Team.find(query).exec()
        .then(teams => {

            if (teams.length === 0 && id) return next(errorHelper.prepareError(codes.PLACE.NOT_FOUND));
            if (teams.length === 0 && !id) return next(errorHelper.prepareError(codes.PLACE.NULL_FOUND));
            res.json({ response: commonCodes.RESOURCE.LOADED, output: teams });

        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });

};

exports.updateTeam = (req, res, next) => {

    const id = req.params['id'];
    const update = req.body['team'];

    if (!update) return next(errorHelper.prepareError(codes.TEAM.MISSING));
    if (!update.name) return next(errorHelper.prepareError(codes.TEAM.NAME.MISSING));

    Team.findOne({ _id: id }).exec()
        .then(team => {

            if (!team) return next(errorHelper.prepareError(codes.TEAM.NOT_FOUND));
            team.update(update).then(() => {
                res.json({ response: codes.TEAM.UPDATED });
            }).catch(error => {
                return next(errorHelper.prepareError(error));
            });
        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });


};

exports.deleteTeam = (req, res, next) => {

    const id = req.params['id'];

    Team.findOne({ _id: id }).exec()
        .then(team => {

            // Find all affected Matches
            if (!team) return next(errorHelper.prepareError(codes.TEAM.NOT_FOUND));
            const Match = require('../models/match.model');

            Match.find({ 'afterMatch.teams' : team._id }).exec()
                .then(matches => {

                    // Replace all affected Matches with default 'Unavailable Team' team
                    Team.findOne({ name: 'Unavailable Team' }).exec()
                        .then(defaultTeam => {

                            return new Promise((resolve, reject) => {
                                // If it doesn't exist yet, create it
                                if (!defaultTeam) {
                                    new Team({ name: 'Unavailable Team' }).save().then(defTeam => {
                                        resolve(defTeam);
                                    }).catch(error => reject(error));
                                } else { resolve(defaultTeam) }
                            });

                            }).then(defaultTeam => {

                                const promises = [];

                                matches.forEach(match => {
                                    const promise = new Promise((resolve, reject) => {
                                        match.afterMatch.teams.forEach((_team, i) => {
                                            if (_team === match._id) {
                                                match.afterMatch.teams[i] = defaultTeam._id;
                                            }
                                            if (match.afterMatch.winner === team._id) {
                                                match.afterMatch.winner = defaultTeam._id;
                                            }
                                        });
                                    });
                                    promises.push(promise);
                                });
                                Promise.all(promises).then(() => {
                                    team.remove().then(() =>{
                                        res.json({ response: commonCodes.CRUD.DELETE.DELETED });
                                    }).catch(error => {
                                        return next(errorHelper.prepareError(error));
                                    });

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