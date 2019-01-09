const iV = require('northernstars-shared').validatorHelper.inputValidator;
const errorHelper = require('northernstars-shared').errorHelper;
const sysCodes = require('northernstars-shared').sysCodes;
const formatDates = require('northernstars-shared').dateHelper.formatDates;
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

    // validation
    const validation = iV.validate(input, [{ field: 'name', rules: { required: true } }]);
    if (!validation.success) return next(errorHelper.prepareError(validation));

    Team.findOne({ name: input.name }).exec()
        .then(team => {

            if (team) return next(errorHelper.prepareError(codes.TEAM.NAME.DUPLICATE));

            const newTeam = new Team({
                name: input.name,
                jersey: input.jersey,
                createdBy: req.user._id,
                updatedBy: req.user._id
            });
            newTeam.save().then(() => {
                res.json({ response: codes.TEAM.CREATED });
            }).catch(error => next(errorHelper.prepareError(error)));
        })
        .catch(error => next(errorHelper.prepareError(error)));

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
            req.headers['x-bypass'] = service.root.secret;
            const options = {
                uri: `http://${service.root.host}:${service.root.port}/api/users?show-all=true`,
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

                    // time-zone format
                    team = formatDates(team, [
                        'createdAt', 'updatedAt',
                    ], service.timezone);

                    // extend 'createdBy' field
                    const createdByIndex = users.findIndex(obj => obj._id.toString() === team.createdBy.toString());
                    team.createdBy = createdByIndex >= 0 ? users[createdByIndex] : users[deletedUserIndex];

                    // extend 'updatedBy' field
                    const updatedByIndex = users.findIndex(obj => obj._id.toString() === team.updatedBy.toString());
                    team.updatedBy = updatedByIndex >= 0 ? users[updatedByIndex] : users[deletedUserIndex];

                    fin.push(team);
                });

                res.json({ response: sysCodes.RESOURCE.LOADED, output: fin });

            }).catch(error => next(errorHelper.prepareError(error)));

        })
        .catch(error => next(errorHelper.prepareError(error)));

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

    // validation
    const validation = iV.validate(update, [{ field: 'name', rules: {} }]);
    if (!validation.success) return next(errorHelper.prepareError(validation));

    Team.findOne({ _id: id }).exec()
        .then(team => {
            if (!team) return next(errorHelper.prepareError(codes.TEAM.NOT_FOUND));

            Team.findOne({ name: update.name, _id: { $ne: team._id } }).exec()
                .then(duplicate => {
                   if (duplicate) return next(errorHelper.prepareError(codes.TEAM.NAME.DUPLICATE));

                    team.update(update, { runValidators: true }).then(() => {
                        res.json({ response: codes.TEAM.UPDATED });
                    }).catch(error => next(errorHelper.prepareError(error)));
                }).catch(error => next(errorHelper.prepareError(error)));
        })
        .catch(error => next(errorHelper.prepareError(error)));


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
            if (!team) return next(errorHelper.prepareError(codes.TEAM.NOT_FOUND));

            team.remove().then(() =>{
                res.json({ response: codes.TEAM.DELETED });
            }).catch(error => next(errorHelper.prepareError(error)));
        })
        .catch(error => next(errorHelper.prepareError(error)));

};