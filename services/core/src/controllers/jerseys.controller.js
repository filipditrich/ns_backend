const errorHelper = require('northernstars-shared').errorHelper;
const sysCodes = require('northernstars-shared').sysCodes;
const Jersey = require('../models/jersey.model');
const codes = require('../assets/codes.asset');
const rp = require('request-promise');

exports.newJersey = (req, res, next) => {

    const input = req.body['input'];

    if (!input) return next(errorHelper.prepareError(codes.JERSEY.MISSING));
    if (!input.name) return next(errorHelper.prepareError(codes.JERSEY.NAME.MISSING));

    Jersey.findOne({ name: input.name }).exec()
        .then(foundJersey => {

            if (foundJersey) return next(errorHelper.prepareError(codes.JERSEY.DUPLICATE));
            input['createdBy'] = req.user._id;
            input['updatedBy'] = req.user._id;
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

            jerseys = Boolean(req.query['show-all']) ? jerseys : jerseys.filter(jersey => jersey.name !== '(unavailable jersey)');

            if (jerseys.length === 0 && id) return next(errorHelper.prepareError(codes.JERSEY.NOT_FOUND));
            if (jerseys.length === 0 && !id) return next(errorHelper.prepareError(codes.JERSEY.NULL_FOUND));

            // options
            delete req.headers['content-type'];
            delete req.headers['content-length'];
            const options = {
                uri: `http://localhost:4000/api/users?show-all=true`,
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

                jerseys.forEach(jersey => {
                    jersey = jersey.toObject();

                    // extend 'createdBy' field
                    const createdByIndex = users.findIndex(obj => obj._id.toString() === jersey.createdBy.toString());
                    jersey.createdBy = createdByIndex >= 0 ? users[createdByIndex] : users[deletedUserIndex];

                    // extend 'updatedBy' field
                    const updatedByIndex = users.findIndex(obj => obj._id.toString() === jersey.updatedBy.toString());
                    jersey.updatedBy = updatedByIndex >= 0 ? users[updatedByIndex] : users[deletedUserIndex];

                    fin.push(jersey);
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

exports.updateJersey = (req, res, next) => {

    const id = req.params['id'];
    const update = req.body['input'];

    if (!update) return next(errorHelper.prepareError(codes.JERSEY.MISSING));
    if (!update.name) return next(errorHelper.prepareError(codes.JERSEY.NAME.MISSING));

    Jersey.findOne({ _id: id }).exec()
        .then(jersey => {
            if (!jersey) return next(errorHelper.prepareError(codes.JERSEY.NOT_FOUND));

            Jersey.findOne({ name: update.name, _id: { $ne: jersey._id } }).exec()
                .then(duplicate => {
                    if (duplicate) return next(errorHelper.prepareError(codes.JERSEY.DUPLICATE));

                    jersey.update(update, { runValidators: true }).then(() => {
                        res.json({ response: codes.JERSEY.UPDATED });
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

exports.deleteJersey = (req, res, next) => {

    const id = req.params['id'];

    Jersey.findOne({ _id: id }).exec()
        .then(jersey => {

            // Delete Jersey Usages in Teams
            if (!jersey) return next(errorHelper.prepareError(codes.JERSEY.NOT_FOUND));
            const Team = require('../models/team.model');

            Team.find({ jersey: jersey._id }).exec()
                .then(teams => {
                    // Check if the database contains the default '(unavailable jersey)' jersey
                    // if no, then create one
                    Jersey.findOne({ name: '(unavailable jersey)' }).exec()
                        .then(defaultJersey => {
                            return new Promise((resolve, reject) => {
                                if (!defaultJersey) {
                                    const newDefaultJersey = new Jersey({
                                        name: '(unavailable jersey)'
                                    });
                                    newDefaultJersey.save().then(saved => resolve(saved))
                                        .catch(error => reject(error));
                                } else { resolve(defaultJersey) }
                            });
                        })
                        // Assign default '(unavailable jersey)' jersey to the affected teams
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

exports.getAllJersey = (req, res, next) => {
    Jersey.find({}).exec()
        .then(jerseys => {
            res.json({ status: sysCodes.RESOURCE.LOADED, response: jerseys })
        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });
}