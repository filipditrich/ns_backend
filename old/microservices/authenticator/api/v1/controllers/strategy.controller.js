const passport = require('passport');
const errorHelper = require('../../../../../_repo/helpers/error.helper');
const codes = require('../assets/codes.asset');
const sysCodes = require('../../../../../_repo/assets/system-codes.asset');

/**
 * @description: Tries to login a user based on incoming login data
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.requireLogin = (req, res, next) => {
    return new Promise((resolve, reject) => {

        return passport.authenticate('login', {
            session: false,
            badRequestMessage: codes.LOGIN.INCOMPLETE_REQUEST.name
        }, (error, user, response) => {
            if (!error && !user && response && response.message === codes.LOGIN.INCOMPLETE_REQUEST.name){
                return reject(codes.LOGIN.INCOMPLETE_REQUEST);
            }
            if (error) reject(error);
            if (!user) reject(response);
            req.user = user;
            resolve();
        })(req, res, next);

    });
};

/**
 * @description: Checks if the sent token in headers is still signed (valid)
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.authenticateToken = (req, res, next) => {
    return new Promise((resolve, reject) => {

        return passport.authenticate('jwt', {
            session: false
        }, (error, user) => {
            if (error) reject(error);
            if (!user) reject(sysCodes.AUTH.TOKEN.INVALID);
            req.user = user;
            resolve();
        })(req, res, next);

    });
};