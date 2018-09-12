const errorHelper = require('northernstars-shared').errorHelper;
const userHelper = require('northernstars-shared').userHelper;
const sysCodes = require('northernstars-shared').sysCodes;
const Match = require('../models/match.model');
const Place = require('../models/place.model');
const codes = require('../assets/codes.asset');
const moment = require('moment');
const objectIdRegExp = /^[0-9a-fA-F]{24}$/;

exports.createMatch = (req, res, next) => {

    const input = req.body['match'];

    if (!input) return next(errorHelper.prepareError(codes.MATCH.MISSING));
    if (!input.date) return next(errorHelper.prepareError(codes.MATCH.DATE.MISSING));
    if (!input.title) return next(errorHelper.prepareError(codes.MATCH.TITLE.MISSING));
    if (!input.place) return next(errorHelper.prepareError(codes.PLACE.MISSING));
    if (!input.enrollment.enrollmentCloses) return next(errorHelper.prepareError(codes.MATCH.ENROLLMENT.CLOSES.MISSING));

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
                Place.findOne({ _id: input.place }).exec()
                    .then(place => {
                       if (!place) return next(errorHelper.prepareError(codes.PLACE.NOT_FOUND));
                        input['createdBy'] = req.user._id;
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