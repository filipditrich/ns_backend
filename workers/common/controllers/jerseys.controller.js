const Jersey = require('../models/jersey.model');
const errorHelper = require('../../../common/helpers/error.helper');
const codes = require('../assets/codes');
const commonCodes = require('../../../common/assets/codes');

exports.newJersey = (req, res, next) => {

    const input = req.body['jersey'];

    if (!input) return next(errorHelper.prepareError(codes.JERSEY.MISSING));
    if (!input.name) return next(errorHelper.prepareError(codes.JERSEY.NAME.MISSING));

    Jersey.findOne({ name: input.name }).exec()
        .then(foundJersey => {

            if (foundJersey) return next(errorHelper.prepareError(codes.JERSEY.DUPLICATE));
            const newJersey = new Jersey(input);
            newJersey.save().then(saved => {
                res.json({ response: codes.JERSEY.CREATED });
            }).catch(error => {
                return next(errorHelper.prepareError(error));
            });
        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });

};

exports.getJerseys = (req, res, next) => {

    const id = req.params['id'];
    const query = !!id ? { _id: id } : {};

    Jersey.find(query).exec()
        .then(jerseys => {

            if (jerseys.length === 0 && id) return next(errorHelper.prepareError(codes.JERSEY.NOT_FOUND));
            if (jerseys.length === 0 && !id) return next(errorHelper.prepareError(codes.JERSEY.NULL_FOUND));
            res.json({ response: commonCodes.RESOURCE.LOADED, output: jerseys });

        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });

};

exports.updateJersey = (req, res, next) => {

    const id = req.params['id'];
    const update = req.body['jersey'];

    if (!update) return next(errorHelper.prepareError(codes.JERSEY.MISSING));
    if (!update.name) return next(errorHelper.prepareError(codes.JERSEY.NAME.MISSING));

    Jersey.findOne({ _id: id }).exec()
        .then(jersey => {

            if (!jersey) return next(errorHelper.prepareError(codes.JERSEY.NOT_FOUND));
            jersey.update(update).then(() => {
                res.json({ response: codes.JERSEY.UPDATED });
            }).catch(error => {
                return next(errorHelper.prepareError(error));
            });
        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });

};

exports.deleteJersey = (req, res, next) => {

    const id = req.params['id'];

    Jersey.findOne({ _id: id }).exec()
        .then(jersey => {

            // Delete Jersey Usages in Teams
            if (!jersey) return next(errorHelper.prepareError(codes.JERSEY.NOT_FOUND));
            const Team = require('../models/team.model');

            Team.find({ jersey: jersey._id }).exec()
                .then(teams => {
                    // Check if the database contains the default 'Unavailable Jersey' jersey
                    // if no, then create one
                    Jersey.findOne({ name: 'Unavailable Jersey' }).exec()
                        .then(defaultJersey => {
                            return new Promise((resolve, reject) => {
                                if (!defaultJersey) {
                                    const newDefaultJersey = new Jersey({
                                        name: 'Unavailable Jersey'
                                    });
                                    newDefaultJersey.save().then(saved => resolve(saved))
                                        .catch(error => reject(error));
                                } else { resolve(defaultJersey) }
                            });
                        })
                        // Assign default 'Unavailable Jersey' jersey to the affected teams
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
                                    res.json({ response: codes.JERSEY.DELETED });
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

};