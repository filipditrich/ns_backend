const Match = require('../models/match.model');
const errorHelper = require('../../../common/helpers/error.helper');
const codes = require('../assets/codes');
const commonCodes = require('../../../common/assets/codes');
const moment = require('moment');

exports.createMatch = (req, res, next) => {

    const input = req.body['match'];

    if (!input) return next(errorHelper.prepareError(codes.MATCH.MISSING));
    if (!input.date) return next(errorHelper.prepareError(codes.MATCH.DATE.MISSING));
    if (!input.title) return next(errorHelper.prepareError(codes.MATCH.TITLE.MISSING));

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
                const newMatch = new Match(input);
                newMatch.save().then(() => {
                    res.json({ response: codes.MATCH.CREATED });
                }).catch(error => {
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
            res.json({ response: commonCodes.RESOURCE.LOADED, output: matches });

        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });

};

exports.updateMatch = (req, res, next) => {

    const id = req.params['id'];
    const update = req.body['match'];
    // const options = req.body['options'];
    // TODO: after the user enrollment logic implementation
    // TODO: -> create function to notify enrolled players about the change if (options.notify === true)

    if (!update) return next(errorHelper.prepareError(codes.MATCH.MISSING));

    Match.findOne({ _id: id }).exec()
        .then(jersey => {

            if (!jersey) return next(errorHelper.prepareError(codes.MATCH.NOT_FOUND));
            jersey.update(update).then(() => {
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