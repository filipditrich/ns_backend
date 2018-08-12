const errorHelper = require('../../../common/helpers/error.helper');
const codes = require('../assets/codes');
const sysCodes = require('../../../common/assets/codes');
const BaseCtrl = require('../../../common/controllers/base.controller');
const moment = require('moment');

const Jersey = require('../models/jersey.model');
const Team = require('../models/team.model');
const Match = require('../models/match.model');
const Place = require('../models/place.model');

/**
 * @description Basic MatchCtrl Update function (CRUD - U)
 * @param req
 * @param res
 * @param next
 */
exports.update = (req, res, next) => {

    const collection = req.params['collection'];
    const id = req.params['id'];
    const input = req.body;
    let Schema;

    switch (collection) {
        case 'matches': Schema = Match; break;
        case 'teams': Schema = Team; break;
        case 'jerseys': Schema = Jersey; break;
        case 'places': Schema = Place; break;
        default: BaseCtrl.invalidEndpoint(req, res, next)
    }

    Schema.update({ _id: id }, input.match).exec()
        .then(response => {
            if (response.nModified < 1) { return next(errorHelper.prepareError(sysCodes.CRUD.UPDATE.UNCHANGED)) }
            res.json({ response: sysCodes.CRUD.UPDATE.UPDATED });
        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });
};

/**
 * @description Basic MatchCtrl Delete function (CRUD - D)
 * @param req
 * @param res
 * @param next
 */
exports.delete = (req, res, next) => {

    const collection = req.params['collection'];
    const id = req.params['id'];

    switch (collection) {
        case 'matches': {

            Match.findOne({ _id: id }).exec()
                .then(match => {
                    if (!match) return next(errorHelper.prepareError(sysCodes.CRUD.DELETE.NOT_DELETED));

                    match.remove().then(() => {
                       res.json({ response: sysCodes.CRUD.DELETE.DELETED });
                    }).catch(error => {
                        return next(errorHelper.prepareError(error));
                    });
                })
                .catch(error => {
                    return next(errorHelper.prepareError(error));
                });

            break;
        }
        case 'jerseys': {

            Jersey.findOne({ _id: id }).exec()
                .then(jersey => {
                    if (!jersey) return next(errorHelper.prepareError(codes.MATCH.JERSEY.NOT_FOUND));
                    // Delete Jersey Usages in Teams
                    Team.find({ jersey: jersey._id }).exec()
                        .then(teams => {
                            // Check if the database contains the default 'No Jersey' jersey
                            // if no, then create one
                            Jersey.findOne({ name: 'No Jersey' }).exec()
                                .then(defaultJersey => {
                                    return new Promise((resolve, reject) => {
                                        if (!defaultJersey) {
                                            const newDefaultJersey = new Jersey({
                                                name: 'No Jersey'
                                            });
                                            newDefaultJersey.save().then(saved => resolve(saved))
                                                .catch(error => reject(error));
                                        } else { resolve(defaultJersey) }
                                    });
                                })
                                // Assign default 'No Jersey' jersey to the affected teams
                                .then(defaultJersey => {
                                    const promises = [];

                                    teams.forEach(team => {
                                        const promise = new Promise((resolve, reject) => {
                                            team.jersey = defaultJersey._id;
                                            team.save().then(() => resolve()).catch(error => reject(error));
                                        });
                                        promises.push(promise);
                                    });

                                    Promise.all(promises).then(() => {
                                        jersey.remove().then(() => {
                                            res.json({ response: sysCodes.CRUD.DELETE.DELETED });
                                        }).catch(error => {
                                            return next(errorHelper.prepareError(error));
                                        });
                                    }).catch(error => {
                                        return next(errorHelper.prepareError(error));
                                    });
                                })
                                .catch(error => {
                                    return next(errorHelper.prepareError(error));
                                })
                        })
                        .catch(error => {
                            return next(errorHelper.prepareError(error));
                        });
                })
                .catch(error => {
                    return next(errorHelper.prepareError(error));
                });

            break;
        }
        case 'places': {

            Place.findOne({ _id: id }).exec()
                .then(place => {

                    // Find all occurrences of this place in matches and unset it
                    Match.find({ place: place._id }).exec()
                        .then(matches => {
                            const promises = [];

                            matches.forEach(match => {
                               const promise = new Promise((resolve, reject) => {
                                 match.place = undefined;
                                 match.save().then(() => resolve()).catch(error => reject(error));
                               });
                               promises.push(promise);
                            });

                            Promise.all(promises).then(() => {
                                place.remove().then(() => {
                                   res.json({ response: sysCodes.CRUD.DELETE.DELETED });
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

            break;
        }
        case 'teams': {

            Team.findOne({ _id: id }).exec()
                .then(team => {
                    // Find all affected Matches
                    Match.find({ 'afterMatch.teams' : team._id }).exec()
                        .then(matches => {
                            // Replace all affected Matches with default 'No Team' team
                            Team.findOne({ name: 'No Team' }).exec()
                                .then(defaultTeam => {
                                    const promises = [];

                                    matches.forEach(match => {
                                        const promise = new Promise((resolve, reject) => {
                                            match.afterMatch.teams.forEach((_team, i) => {
                                                if (_team === match._id) {
                                                    match.afterMatch.teams[i] = defaultTeam._id;
                                                }
                                                if (match.afterMatch.winner === match._id) {
                                                    match.afterMatch.winner = defaultTeam._id;
                                                }
                                            });
                                        });
                                        promises.push(promise);
                                    });

                                    Promise.all(promises).then(() => {
                                        team.remove().then(() =>{
                                            res.json({ response: sysCodes.CRUD.DELETE.DELETED });
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

            break;
        }
        default: {
            BaseCtrl.invalidEndpoint(req, res, next);
        }
    }

};

/**
 * @description Basic MatchCtrl Read function (CRUD - R)
 * @param req
 * @param res
 * @param next
 */
exports.read = (req, res, next) => {

    const collection = req.params['collection'];
    const id = req.params['id'];
    const query = id ? { _id: id } : {};
    let Schema;

    switch (collection) {
        case 'matches': Schema = Match; break;
        case 'teams': Schema = Team; break;
        case 'jerseys': Schema = Jersey; break;
        case 'places': Schema = Place; break;
        default: BaseCtrl.invalidEndpoint(req, res, next)
    }

    Schema.find(query).exec()
        .then(output => {
            res.json({
                response: sysCodes.RESOURCE.LOADED,
                output: output
            });
        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });

};

/**
 * @description Basic MatchCtrl Create function (CRUD - C)
 * @param req
 * @param res
 * @param next
 */
exports.create = (req, res, next) => {

    const collection = req.params['collection'];
    const input = req.body;

    switch (collection) {

        case 'jerseys': {

            newJersey(input.jersey).then(jersey => {
                if (!jersey) return next(errorHelper.prepareError(codes.MATCH.JERSEY.MISSING));
                res.json({ response: codes.MATCH.JERSEY.CREATED });
            }).catch(error => {
                return next(errorHelper.prepareError(error));
            });

            break;
        }
        case 'teams': {

            Team.findOne({ name: input.team.name }).exec()
                .then(team => {

                    if (team) return next(errorHelper.prepareError(codes.MATCH.TEAM.DUPLICATE));

                    newJersey(input.team.jersey).then(jersey => {
                        if (!jersey && !input.team.jersey.id) return next(errorHelper.prepareError(codes.MATCH.JERSEY.MISSING));

                        const teamJersey = !!jersey ? jersey._id : input.team.jersey.id;
                        const newTeam = new Team({
                            name: input.team.name,
                            jersey: teamJersey
                        });

                        newTeam.save().then(() => {
                           res.json({ response: codes.MATCH.TEAM.CREATED });
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
            break;
        }
        case 'matches': {
            const d = new Date(input.match.date);
            const gte = new Date(d.getTime() - 3600000);
            const lte = new Date(d.getTime() + 3600000);

            console.log(d, gte, lte);

            Match.find({ date: { $gte: gte, $lte: lte } }).exec()
                .then(matches => {

                    // If the match date is duplicate send response to the user
                    // with an advise that hes making a dup and whether he wouldn't
                    // rather just edit the already saved match with this date
                    // ps:  its just a fucking stupid feature where I spent additional
                    //      30 minutes, while in a insuperable rush before production
                    //      mode deployment. :)

                    let inRange = [];
                    if (matches.length !== 0) {
                        let same = [];
                        matches.forEach(match => {
                            if (moment(match.date).isSame(new Date(input.match.date))) {
                                same.push(match)
                            } else {
                                inRange.push(match);
                            }
                        });
                        if (same.length !== 0) return next(errorHelper.prepareError(codes.MATCH.MATCH.DATE_DUP));
                        if (inRange.length !== 0) {
                            res.json({
                                response: codes.MATCH.MATCH.DATE_DUP_ADVISE,
                                matches: inRange
                            });
                        }
                    } else {
                        const newMatch = new Match(input.match);

                        newMatch.save().then(saved => {
                            res.json({ response: codes.MATCH.MATCH.CREATED });
                        }).catch(error => {
                            return next(errorHelper.prepareError(error));
                        });
                    }

                })
                .catch(error => {
                    return next(errorHelper.prepareError(error));
                });

            break;
        }
        case 'places': {

          Place.findOne({ name: input.place.name }).exec()
              .then(place => {
                  if (place) return next(errorHelper.prepareError(codes.MATCH.PLACE.DUPLICATE));

                  const newPlace = new Place(input.place);

                  newPlace.save().then(saved => {
                     res.json({ response: codes.MATCH.PLACE.CREATED });
                  }).catch(error => {
                      return next(errorHelper.prepareError(error));
                  });

              })
              .catch(error => {
                  return next(errorHelper.prepareError(error));
              });
          break;

        }
        default: {
            BaseCtrl.invalidEndpoint(req, res, next);
        }
    }
};

/**
 * @description Creates and return newly created jersey if
 * the request jersey 'new' field is true
 * @param jersey
 * @return {Promise<any>}
 */
function newJersey(jersey) {
    return new Promise((resolve, reject) => {

        if (jersey.new) {

            Jersey.findOne({ name: jersey.name }).exec()
                .then(foundJersey => {

                    if (foundJersey) reject(codes.MATCH.JERSEY.DUPLICATE);

                    const newJersey = new Jersey({
                        name: jersey.name
                    });

                    newJersey.save().then(saved => {
                        resolve(saved);
                    }).catch(error => {
                        reject(error);
                    });
                })
                .catch(error => {
                    return reject(error);
                });
        } else {
           resolve();
        }

    });
}