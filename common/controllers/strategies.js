const passport = require('passport');
const User = require('../../workers/agent/models/user');
const codes = require('../assets/codes');

exports.requireLogin = (req, res, next) => {
  return passport.authenticate('login', {
      session: false,
      badRequestMessage: codes.AUTH.LOGIN.INCOMPLETE_REQUEST.name
  }, (error, user, response) => {
      if (!error && !user && response && response.message === codes.AUTH.LOGIN.INCOMPLETE_REQUEST.name){
          return next(codes.AUTH.LOGIN.INCOMPLETE_REQUEST);
      }
      if (error) return next(error);
      if (!user) return next(response);
      req.user = user;
      return next();
  })(req, res, next);
};

exports.authenticateToken = (req, res, next) => {
  return passport.authenticate('jwt', {
      session: false
  }, (error, user) => {
      if (error) return next(error);
      if (!user) return next(codes.AUTH.TOKEN.INVALID)
      req.user = user;
      next();
  })(req, res, next);
};

exports.requireSecret = (req, res, next) => {
    console.log(req.body);
  return passport.authenticate('secret', {
      session: false,
      badRequestMessage: codes.SECRET.MISSING.name
  }, (error, isMatch, response) => {
      if (!error && !isMatch && response && response.message === codes.SECRET.MISSING.name){
          return next(codes.SECRET.MISSING)
      }
      if (error) return next(error);
      if (!isMatch) return next(response);
      return next();
  })(req, res, next);
};

exports.roleAuthorization = roles => {
  return (req, res, next) => {
      let user = req.user;
      User.findById(user._id).exec()
          .then(user => {
             if (!user) return next(codes.UNEXPECTED);
             if (user.roles.some(role => roles.indexOf(role) >= 0)){
                 return next();
             } else {
                 return next(codes.AUTH.AUTH_ROLES.UNAUTHORIZED_ACCESS);
             }
          })
          .catch(error => {
              return next(error);
          });
  }
};