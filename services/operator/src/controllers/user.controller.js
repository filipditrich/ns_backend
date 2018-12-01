const _ = require('lodash');
const codes = require('../assets/codes.asset');
const sysCodes = require('northernstars-shared').sysCodes;
const sysEnums = require('northernstars-shared').sysEnums;
const PwdResetRequest = require('../models/pwd-reset-request.schema');
const User = require('../models/user.schema');
const codeHelper = require('northernstars-shared').codeHelper;
const mailHelper = require('northernstars-shared').mailHelper;
const UserInfo = require('./authentication.controller').setUserInfo;
const errorHelper = require('northernstars-shared').errorHelper;

/**
 * @description: Requests a new password reset request if there is none already
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.getUser = (req, res, next) => {

    const id = req.params['id'];
    const query = !!id ? { _id: id } : {};

    User.find(query).exec()
        .then(users => {

            if (users.length === 0 && id) return next(errorHelper.prepareError(codes.USER.NOT_FOUND));
            if (users.length === 0 && !id) return next(errorHelper.prepareError(codes.USER.NULL_FOUND));

            const formatted = [];
            users = Boolean(req.query['show-all']) ? users : users.filter(user => user.roles.some(role => role !== sysEnums.AUTH.ROLES.deleted.key));
            users.forEach(user => { formatted.push(UserInfo(user)); });

            res.json({ response: sysCodes.RESOURCE.LOADED, output: formatted });

        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });

};

exports.createUser = (req, res, next) => {

    const input = req.body['input'];
    if (!input) return next(errorHelper.prepareError(sysCodes.REQUEST.INVALID));

    if (!input.name) return next(errorHelper.prepareError(codes.NAME.MISSING));
    if (!input.username) return next(errorHelper.prepareError(codes.USERNAME.MISSING));
    if (!input.password) return next(errorHelper.prepareError(codes.PASSWORD.MISSING));
    if (!input.number) return next(errorHelper.prepareError(codes.NUMBER.MISSING));
    if (!input.team) return next(errorHelper.prepareError(codes.TEAM.MISSING));


    User.findOne({ username: input.username }).exec()
        .then(userWithUsername => {
            if (userWithUsername) return next(errorHelper.prepareError(codes.USERNAME.IN_USE));

            let newUser = new User({
                username: input.username,
                password: input.password,
                name: input.name,
                team: input.team,
                number: input.number,
                email: input.email
            });

            newUser.save((error, saved) => {
                if (error) {
                    if (!error.errors) return next(errorHelper.prepareError(error));
                    let stack = {};
                    _.forEach(error.errors, (value, key) => { stack[key] = value.message });

                    return next(errorHelper.prepareError(codeHelper.generateValidationError(stack)));
                }

                res.json({
                    response: codes.USER.CREATED,
                    output: UserInfo(saved)
                });

            });

        }).catch(error => {
        return next(errorHelper.prepareError(error));
    });

};