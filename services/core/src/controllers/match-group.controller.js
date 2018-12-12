const errorHelper = require('northernstars-shared').errorHelper;
const sysCodes = require('northernstars-shared').sysCodes;
const rp = require('request-promise');
const service = require('../config/settings.config');
const MatchGroup = require('../models/match-group.model');
const codes = require('../assets/codes.asset');

/**
 * @description Creates a Match Group
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
exports.create = (req, res, next) => {

    const input = req.body['input'];

    if (!input) return next(errorHelper.prepareError(codes.MATCH.GROUP.MISSING));
    if (!input.name) return next(errorHelper.prepareError(codes.MATCH.GROUP.NAME.MISSING));

    MatchGroup.findOne({ name: input.name }).exec()
        .then(foundGroup => {

            if (foundGroup) return next(errorHelper.prepareError(codes.MATCH.GROUP.DUPLICATE));
            input['createdBy'] = req.user._id;
            input['updatedBy'] = req.user._id;
            const newMatchGroup = new MatchGroup(input);
            newMatchGroup.save()
                .then(() => {
                    res.json({ response: codes.MATCH.GROUP.CREATED });
                })
                .catch(error => next(errorHelper.prepareError(error)));
        })
        .catch(error => next(errorHelper.prepareError(error)));

};

/**
 * @description Lists Match Group(s)
 * @param req
 * @param res
 * @param next
 */
exports.get = (req, res, next) => {

    const id = req.params['id'];
    const query = !!id ? {_id: id} : {};

    MatchGroup.find(query).exec()
        .then(groups => {

            groups = Boolean(req.query['show-all']) ? groups : groups.filter(team => team.name !== '(unavailable group)');

            if (groups.length === 0 && id) return next(errorHelper.prepareError(codes.MATCH.GROUP.NOT_FOUND));
            if (groups.length === 0 && !id) return next(errorHelper.prepareError(codes.MATCH.GROUP.NULL_FOUND));

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

            rp(options)
                .then(response => {
                    const users = response.body.output;
                    if (users.length === 0) return next(errorHelper.prepareError(sysCodes.REQUEST.INVALID)); // this shouldn't happen

                    const fin = [];

                    // define deletedUserIndex (should always be in database)
                    const deletedUserIndex = users.findIndex(obj => obj.username === 'deletedUser');
                    if (deletedUserIndex === -1) console.error(`NO '(deleted user)' user defined!`);

                    groups.forEach(group => {
                        group = group.toObject();

                        // extend 'createdBy' field
                        const createdByIndex = users.findIndex(obj => obj._id.toString() === group.createdBy.toString());
                        group.createdBy = createdByIndex >= 0 ? users[createdByIndex] : users[deletedUserIndex];

                        // extend 'updatedBy' field
                        const updatedByIndex = users.findIndex(obj => obj._id.toString() === group.updatedBy.toString());
                        group.updatedBy = updatedByIndex >= 0 ? users[updatedByIndex] : users[deletedUserIndex];

                        fin.push(group);
                    });

                res.json({response: sysCodes.RESOURCE.LOADED, output: fin});

                })
                .catch(error => next(errorHelper.prepareError(error)));
        })
        .catch(error => next(errorHelper.prepareError(error)));
};

/**
 * @description Updates a Match Group
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
exports.update = (req, res, next) => {

    const id = req.params['id'];
    const update = req.body['input'];

    if (!update) return next(errorHelper.prepareError(codes.MATCH.GROUP.MISSING));
    if (!update.name) return next(errorHelper.prepareError(codes.MATCH.GROUP.NAME.MISSING));

    MatchGroup.findOne({ _id: id }).exec()
        .then(group => {
            if (!group) return next(errorHelper.prepareError(codes.MATCH.GROUP.NOT_FOUND));

            MatchGroup.findOne({ name: update.name, _id: { $ne: group._id } }).exec()
                .then(duplicate => {
                    if (duplicate) return next(errorHelper.prepareError(codes.MATCH.GROUP.DUPLICATE));

                    group.update(update, { runValidators: true })
                        .then(() => {
                            res.json({ response: codes.MATCH.GROUP.UPDATED });
                        })
                        .catch(error => next(errorHelper.prepareError(error)));
                })
                .catch(error => next(errorHelper.prepareError(error)));
        })
        .catch(error => next(errorHelper.prepareError(error)));

};

/**
 * @description Deletes a Match Group
 * @param req
 * @param res
 * @param next
 */
exports.delete = (req, res, next) => {

    const id = req.params['id'];

    MatchGroup.findOne({ _id: id }).exec()
        .then(group => {

            // Delete Group Usages in Matches
            if (!group) return next(errorHelper.prepareError(codes.MATCH.GROUP.NOT_FOUND));
            const Match = require('../models/match.model');

            Match.find({ group: group._id }).exec()
                .then(matches => {
                    // Check if the database contains the default '(unavailable group)' group
                    // if no, then create one
                    MatchGroup.findOne({ name: '(unavailable group)' }).exec()
                        .then(defaultGroup => {
                            return new Promise((resolve, reject) => {
                                if (!defaultGroup) {
                                    const newDefaultGroup = new MatchGroup({
                                        name: '(unavailable group)'
                                    });
                                    newDefaultGroup.save().then(saved => resolve(saved))
                                        .catch(error => reject(error));
                                } else { resolve(defaultGroup) }
                            });
                        })
                        // Assign default '(unavailable group)' group to the affected teams
                        .then(defaultGroup => {
                            const promises = [];
                            matches.forEach(match => {
                                const promise = new Promise((resolve, reject) => {
                                    match.group = defaultGroup._id;
                                    match.save().then(() => resolve()).catch(error => reject(error));
                                });
                                promises.push(promise);
                            });
                            Promise.all(promises).then(() => {
                                group.remove()
                                    .then(() => {
                                        res.json({ response: codes.MATCH.GROUP.DELETED });
                                    })
                                    .catch(error => next(errorHelper.prepareError(error)));
                            }).catch(error => next(errorHelper.prepareError(error)));
                        })
                        .catch(error => next(errorHelper.prepareError(error)))
                })
                .catch(error => next(errorHelper.prepareError(error)));
        })
        .catch(error => next(errorHelper.prepareError(error)));

};
