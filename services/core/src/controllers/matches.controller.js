const errorHelper = require('northernstars-shared').errorHelper;
const userHelper = require('northernstars-shared').userHelper;
const sysCodes = require('northernstars-shared').sysCodes;
const Match = require('../models/match.model');
const User = require('../../../operator/src/models/user.schema');

const Place = require('../models/place.model');
const codes = require('../assets/codes.asset');
const moment = require('moment');
const ObjectId = require('mongodb').ObjectId;
const objectIdRegExp = /^[0-9a-fA-F]{24}$/;
const enums = require('../assets/enums.asset');

exports.createMatch = (req, res, next) => {

    const input = req.body;

    if (!input) return next(errorHelper.prepareError(codes.MATCH.MISSING));
    if (!input.date) return next(errorHelper.prepareError(codes.MATCH.DATE.MISSING));
    if (!input.title) return next(errorHelper.prepareError(codes.MATCH.TITLE.MISSING));
    if (!input.place) return next(errorHelper.prepareError(codes.PLACE.MISSING));
    // if (!input.enrollment.enrollmentCloses) return next(errorHelper.prepareError(codes.MATCH.ENROLLMENT.CLOSES.MISSING));

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
            if (matches.length !== 0) {
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
                        matches: inRange
                    });
                }
            } else {
                Place.findOne({ name: "Liberec" }).exec()
                    .then(place => {
                       if (!place) return next(errorHelper.prepareError(codes.PLACE.NOT_FOUND));
                        input['createdBy'] = req.user._id;
                        input['afterMatch'] = [];
                        const newMatch = new Match(input);
                        newMatch.save().then(() => {
                            res.json({ response: codes.MATCH.CREATED });
                        }).catch(error => {
                            return next(errorHelper.prepareError(error));
                        });
                    })
                    .catch(error => {
                        return next(errorHelper.prepareError(error));
                    });
            }
        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });

};

exports.getMatches = (req, res, next) => {

    const id = req.params['id'];
    const query = !!id ? { _id: id } : {};

    Match.find(query).exec()
        .then(matches => {

            if (matches.length === 0 && id) return next(errorHelper.prepareError(codes.MATCH.NOT_FOUND));
            if (matches.length === 0 && !id) return next(errorHelper.prepareError(codes.MATCH.NULL_FOUND));
            res.json({ response: sysCodes.RESOURCE.LOADED, output: matches });

        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });

};

exports.getAllMatches = (req, res, next) => {
    Match.find({}).exec()
        .then(matches => {
            res.json({ status: sysCodes.RESOURCE.LOADED, response: matches })
        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });
}

// exports.getCompPlayers = (req, res, next) => {
//     Match.find().exec()
//         .then(matches => {
//             const usersArray = [];
//             res.json({
//                 response: matches
//             })
//         })
//         .catch(error => {
//             return next(errorHelper.prepareError(error));
//         });
// }

exports.matchParticipation = (req, res, next) => {
    Match.findOne({_id:  req.body["matchID"]}).exec()
        .then(match => {
            if(!match) return next(errorHelper.prepareError(codes.MATCH.NOT_FOUND));

            const matchPlayers = match.enrollment.players;
            if(!matchPlayers.includes(req.body.userID)) {


                Match.findOne({"enrollment.players._id": req.body["userID"]}).exec()
                    .then(response => {
                        if(response) {
                            return next(errorHelper.prepareError(codes.MATCH.ENROLLMENT.PLAYERS.STATUS.ALREADY_PARTICIPATING))
                        } else {
                            const values = {
                                _id: new ObjectId(req.body.userID),
                                name: req.body["userName"]

                            };
                            const newvalues = {$push: {"enrollment.players": values}};
                            match.update(newvalues).then(() => {
                                res.json({response: codes.MATCH.UPDATED});
                            }).catch(error => {
                                return next(errorHelper.prepareError(error));
                            });
                        }
                    }, err => {
                        return next(errorHelper.prepareError(err));
                    })

            } else {
                return next(errorHelper.prepareError(codes.MATCH.ENROLLMENT.PLAYERS.STATUS.ALREADY_PARTICIPATING));
            }

        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        })
}

// TODO: send mail to attendants
exports.cancelMatch = (req, res, next) => {

    const id = req.params['id'];
    let reqUser;
    userHelper.getUser(req.headers)
        .then(user => reqUser = user)
        .catch(error => { return next(errorHelper.prepareError(error)) });

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
           }).catch(error => { return next(errorHelper.prepareError(error)) })

        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });

};

exports.writeResults = (req, res, next) => {
    const id = req.body['matchID'];
    const reqBody = req.body['value'];
    let reqUser;
    userHelper.getUser(req.headers)
        .then(user => reqUser = user)
        .catch(error => { return next(errorHelper.prepareError(error)) });

    if (!reqBody) return next(errorHelper.prepareError(codes.MATCH.MISSING));

    Match.findOne({ _id: id }).exec()
        .then(match => {

            if (!match) return next(errorHelper.prepareError(codes.MATCH.NOT_FOUND));

            // const matchInArray = match.filter(objects => objects.length > 6);
            let i = 0;
            let canParticipate;
            while (i < match.afterMatch.length) {
                if(match.afterMatch[i].player == reqUser._id) {
                    canParticipate = false
                } else {
                    canParticipate = true
                }
                i++;
            }
            if(match.afterMatch.length === 0) canParticipate = true;
            if(canParticipate) {
                const afterMatch = {
                    player: new ObjectId(reqUser._id),
                    jersey: reqBody.jersey,
                    status: reqBody.result
                };
                match.update(
                    {$push: {"afterMatch": afterMatch}}
                ).then(() => {
                    res.json({response: codes.MATCH.UPDATED})
                }).catch(error => {
                    return next(errorHelper.prepareError(error))
                })
            } else {
                res.json({
                    failed: true
                })
            }
        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });

}

// TODO: mail attendants
exports.updateMatch = (req, res, next) => {

    const id = req.params['id'];
    const update = req.body['match'];

    if (!update) return next(errorHelper.prepareError(codes.MATCH.MISSING));

    Match.findOne({ _id: id }).exec()
        .then(match => {

            if (!match) return next(errorHelper.prepareError(codes.MATCH.NOT_FOUND));
            match.update(update).then(() => {
                res.json({ response: codes.MATCH.UPDATED });
            }).catch(error => {
                return next(errorHelper.prepareError(error));
            });
        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });

};

exports.deleteMatch = (req, res, next) => {

    const id = req.params['id'];

    Match.findOne({ _id: id }).exec()
        .then(match => {
            if (!match) return next(errorHelper.prepareError(codes.MATCH.NOT_FOUND));
            match.remove().then(() => {
                res.json({ response: codes.MATCH.DELETED });
            }).catch(error => {
                return next(errorHelper.prepareError(error));
            });
        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });

};