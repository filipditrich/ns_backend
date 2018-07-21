const passport = require('passport');
const User = require('../../workers/agent/models/user');
const codes = require('../assets/codes');
const errorHelper = require('../../common/helpers/error-helper');
const BaseCtrl = require('../controllers/base');
const env = require('express')().get('env');
const config = require('../config/common');

/**
 * @description: Tries to login a user based on incoming login data
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.requireLogin = (req, res, next) => {
  return passport.authenticate('login', {
      session: false,
      badRequestMessage: codes.AUTH.LOGIN.INCOMPLETE_REQUEST.name
  }, (error, user, response) => {
      if (!error && !user && response && response.message === codes.AUTH.LOGIN.INCOMPLETE_REQUEST.name){
          return next(errorHelper.prepareError(codes.AUTH.LOGIN.INCOMPLETE_REQUEST));
      }
      if (error) return next(errorHelper.prepareError(error));
      if (!user) return next(errorHelper.prepareError(response));
      req.user = user;
      return next();
  })(req, res, next);
};

/**
 * @description: Checks if the sent token in headers is still signed (valid)
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.authenticateToken = (req, res, next) => {
  return passport.authenticate('jwt', {
      session: false
  }, (error, user) => {
      if (error) return next(errorHelper.prepareError(error));
      if (!user) return next(errorHelper.prepareError(errorHelper.prepareError(codes.AUTH.TOKEN.INVALID)));
      req.user = user;
      next();
  })(req, res, next);
};

/**
 * @description: Checks if the incoming secret matches the server secret
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.requireSecret = (req, res, next) => {
  return passport.authenticate('secret', {
      session: false,
      badRequestMessage: codes.SECRET.MISSING.name
  }, (error, isMatch, response) => {
      if (!error && !isMatch && response && response.message === codes.SECRET.MISSING.name){
          return next(errorHelper.prepareError(codes.SECRET.MISSING))
      }
      if (error) return next(errorHelper.prepareError(error));
      if (!isMatch) return next(errorHelper.prepareError(response));
      return next();
  })(req, res, next);
};

/**
 * @description: Checks if the user that made the request has enough privileges to do such an action
 * @param roles
 * @returns {Function}
 */
exports.roleAuthorization = roles => {
  return (req, res, next) => {
      let user = req.user;
      User.findById(user._id).exec()
          .then(user => {
             if (!user) return next(errorHelper.prepareError(codes.UNEXPECTED));
             if (user.roles.some(role => roles.indexOf(role) >= 0)){
                 return next();
             } else {
                 return next(errorHelper.prepareError(codes.AUTH.AUTH_ROLES.UNAUTHORIZED_ACCESS));
             }
          })
          .catch(error => {
              return next(errorHelper.prepareError(error));
          });
  }
};

/**
 * @description: Check if the request is among allowed API consumers
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
exports.apiConsumers = (req, res, next) => {
    const headers = req.headers;
    if (!headers['application-id'] || config[env].api.consumers.indexOf(headers['application-id']) < 0) {
        // development purposes
        if (env === 'development'){ return next(); }

        else {
            const error = errorHelper.prepareError(codes.API.UNAUTHORIZED_CONSUMER);
            BaseCtrl.handleError(error, req, res, next);
        }
    } else {
        return next();
    }
};