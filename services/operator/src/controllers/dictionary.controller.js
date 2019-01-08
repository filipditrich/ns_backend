const iV = require('northernstars-shared').validatorHelper.inputValidator;
const sysCodes = require('northernstars-shared').sysCodes;
const errorHelper = require('northernstars-shared').errorHelper;
const codes = require('../assets/codes.asset');
const modelBase = '../models/';
const User = require(modelBase + 'user.schema');
const Dictionary = require(modelBase + 'dictionary.schema');

/**
 * @description Creates a new Dictionary
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.create = (req, res, next) => {

    const input = req.body['input'];
    if (!input) return next(errorHelper.prepareError(codes.DICTIONARY.MISSING));

    // validation
    const validation = iV.validate(input, [
        { field: 'id', rules: { required: true, uppercase: true } },
        { field: 'cs', rules: { required: true } },
        { field: 'en', rules: { required: true } }
    ]);
    if (!validation.success) return next(errorHelper.prepareError(validation));

    Dictionary.findOne({ id: input.id }).exec()
        .then(foundDict => {

            if (foundDict) return next(errorHelper.prepareError(codes.DICTIONARY.DUPLICATE));
            input['createdBy'] = req.user._id;
            input['updatedBy'] = req.user._id;
            new Dictionary(input).save().then(() => {
                res.json({ response: codes.DICTIONARY.CREATED });
            }).catch(error => next(errorHelper.prepareError(error)));
        })
        .catch(error => next(errorHelper.prepareError(error)));

};

/**
 * @description Lists a Dictionary(ies)
 * @param req
 * @param res
 * @param next
 */
exports.get = (req, res, next) => {

    const id = req.params['id'] ? req.params['id'].toUpperCase() : null;
    const query = id ? { id } : {};
    let dict;

    Dictionary.find(query).exec()
        .then(dictionary => {
            if (dictionary.length === 0 && id) return next(errorHelper.prepareError(codes.DICTIONARY.NOT_FOUND));
            if (dictionary.length === 0 && !id) return next(errorHelper.prepareError(codes.DICTIONARY.NULL_FOUND));

            dict = dictionary;
            return User.find({}).exec();
        })
        .then(users => {
            if (users.length === 0) return next(errorHelper.prepareError(sysCodes.REQUEST.INVALID)); // this shouldn't happen
            const fin = [];

            // define deletedUserIndex (should always be in database)
            const deletedUser = users.find(obj => obj.username === 'deletedUser');
            if (!deletedUser) console.error(`NO '(deleted user)' user defined!`);

            dict.forEach(d => {
                d = d.toObject();

                // extend 'createdBy' field
                const createdBy = users.find(obj => obj._id.toString() === d.createdBy.toString());
                d.createdBy = createdBy || deletedUser;

                // extend 'updatedBy' field
                const updatedBy = users.find(obj => obj._id.toString() === d.updatedBy.toString());
                d.updatedBy = updatedBy || deletedUser;

                fin.push(d);
            });
            res.json({ response: sysCodes.RESOURCE.LOADED, output: fin });
        })
        .catch(error => next(errorHelper.prepareError(error)));

};

/**
 * @description Updates a Dictionary
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.update = (req, res, next) => {

    const id = req.params['id'].toUpperCase();
    const update = req.body['input'];
    if (!update) return next(errorHelper.prepareError(codes.DICTIONARY.MISSING));

    // validation
    const validation = iV.validate(update, [
        { field: 'id', rules: { uppercase: true } },
        { field: 'cs', rules: {} },
        { field: 'en', rules: {} }
    ]);
    if (!validation.success) return next(errorHelper.prepareError(validation));

    Dictionary.findOne({ id }).exec()
        .then(dict => {
            if (!dict) return next(errorHelper.prepareError(codes.DICTIONARY.NOT_FOUND));

            Dictionary.findOne({ id: update.id, _id: { $ne: dict._id } }).exec()
                .then(duplicate => {
                    if (duplicate) return next(errorHelper.prepareError(codes.DICTIONARY.DUPLICATE));

                    update['updatedBy'] = req.user._id;
                    dict.update(update, { runValidators: true }).then(() => {
                        res.json({ response: codes.DICTIONARY.UPDATED });
                    }).catch(error => next(errorHelper.prepareError(error)));
                }).catch(error => next(errorHelper.prepareError(error)));
        })
        .catch(error => next(errorHelper.prepareError(error)));
};

/**
 * @description Deletes a Dictionary
 * @param req
 * @param res
 * @param next
 */
exports.delete = (req, res, next) => {

    const id = req.params['id'].toUpperCase();

    Dictionary.findOne({ id }).exec()
        .then(dict => {
            dict.remove().then(() => {
                res.json({ response: codes.DICTIONARY.DELETED });
            }).catch(error => next(errorHelper.prepareError(error)));
        })
        .catch(error => next(errorHelper.prepareError(error)));

};
