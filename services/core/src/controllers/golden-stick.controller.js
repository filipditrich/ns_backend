const iV = require('northernstars-shared').validatorHelper.inputValidator;
const errorHelper = require('northernstars-shared').errorHelper;
const sysCodes = require('northernstars-shared').sysCodes;
const formatDates = require('northernstars-shared').dateHelper.formatDates;
const codes = require('../assets/codes.asset');
const service = require('../config/settings.config');
const GoldenStick = require('../models/golden-stick.model');
const rp = require('request-promise');
const moment = require('moment');

/**
 * @description Creates a GoldenStick
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
exports.create = (req, res, next) => {

    const input = req.body['input'];
    if (!input) return next(errorHelper.prepareError(codes.GOLDEN_STICK.MISSING));

    // validation
    const validation = iV.validate(input, [{ field: 'name', rules: { required: true } }]);
    if (!validation.success) return next(errorHelper.prepareError(validation));

    GoldenStick.findOne({ name: input.name }).exec()
        .then(goldenStick => {

            if (goldenStick) return next(errorHelper.prepareError(codes.GOLDEN_STICK.NAME.DUPLICATE));

            const newGoldenStick = new GoldenStick({
                ...input,
                createdBy: req.user._id,
                updatedBy: req.user._id
            });
            newGoldenStick.save().then(() => {
                res.json({ response: codes.GOLDEN_STICK.CREATED });
            }).catch(error => next(errorHelper.prepareError(error)));
        })
        .catch(error => next(errorHelper.prepareError(error)));

};

/**
 * @description Lists GoldenStick(s)
 * @param req
 * @param res
 * @param next
 */
exports.get = (req, res, next) => {

    const id = req.params['id'];
    const query = !!id ? { _id: id } : {};

    GoldenStick.find(query).exec()
        .then(goldenSticks => {

            goldenSticks = Boolean(req.query['show-all']) ? goldenSticks : goldenSticks.filter(goldenStick => goldenStick.name !== '(unavailable goldenStick)');

            if (goldenSticks.length === 0 && id) return next(errorHelper.prepareError(codes.GOLDEN_STICK.NOT_FOUND));
            if (goldenSticks.length === 0 && !id) return next(errorHelper.prepareError(codes.GOLDEN_STICK.NULL_FOUND));

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

                goldenSticks.forEach(goldenStick => {
                    goldenStick = goldenStick.toObject();

                    // time-zone format
                    goldenStick = formatDates(goldenStick, [
                        'createdAt', 'updatedAt',
                    ], service.timezone);

                    // extend 'createdBy' field
                    const createdByIndex = users.findIndex(obj => obj._id.toString() === goldenStick.createdBy.toString());
                    goldenStick.createdBy = createdByIndex >= 0 ? users[createdByIndex] : users[deletedUserIndex];

                    // extend 'updatedBy' field
                    const updatedByIndex = users.findIndex(obj => obj._id.toString() === goldenStick.updatedBy.toString());
                    goldenStick.updatedBy = updatedByIndex >= 0 ? users[updatedByIndex] : users[deletedUserIndex];

                    fin.push(goldenStick);
                });

                res.json({ response: sysCodes.RESOURCE.LOADED, output: fin });

            }).catch(error => next(errorHelper.prepareError(error)));

        })
        .catch(error => next(errorHelper.prepareError(error)));

};

/**
 * @description Updates a GoldenStick
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
exports.update = (req, res, next) => {

    const id = req.params['id'];
    const update = req.body['input'];
    if (!update) return next(errorHelper.prepareError(codes.GOLDEN_STICK.MISSING));

    // validation
    const validation = iV.validate(update, [{ field: 'name', rules: {} }]);
    if (!validation.success) return next(errorHelper.prepareError(validation));

    GoldenStick.findOne({ _id: id }).exec()
        .then(goldenStick => {
            if (!goldenStick) return next(errorHelper.prepareError(codes.GOLDEN_STICK.NOT_FOUND));

            GoldenStick.findOne({ name: update.name, _id: { $ne: goldenStick._id } }).exec()
                .then(duplicate => {
                    if (duplicate) return next(errorHelper.prepareError(codes.GOLDEN_STICK.NAME.DUPLICATE));

                    goldenStick.update(update, { runValidators: true }).then(() => {
                        res.json({ response: codes.GOLDEN_STICK.UPDATED });
                    }).catch(error => next(errorHelper.prepareError(error)));
                }).catch(error => next(errorHelper.prepareError(error)));
        })
        .catch(error => next(errorHelper.prepareError(error)));


};

/**
 * @description Deletes a GoldenStick
 * @param req
 * @param res
 * @param next
 */
exports.delete = (req, res, next) => {

    const id = req.params['id'];

    GoldenStick.findOne({ _id: id }).exec()
        .then(goldenStick => {
            if (!goldenStick) return next(errorHelper.prepareError(codes.GOLDEN_STICK.NOT_FOUND));

            goldenStick.remove().then(() =>{
                res.json({ response: codes.GOLDEN_STICK.DELETED });
            }).catch(error => next(errorHelper.prepareError(error)));
        })
        .catch(error => next(errorHelper.prepareError(error)));

};
