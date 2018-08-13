const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('./common.config');
const codes = require('../assets/codes');
const User = require('../../workers/auth/models/user.model');

/**
 * @description: Creates passport authentication strategies
 * @param passport
 * @param env
 */
module.exports = function (passport, env) {

    const options = {
        login: {
            usernameFiled: 'username'
        },
        jwt: {
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
            secretOrKey: config[env].token.secret
        }
    };

    passport.use('login', new LocalStrategy(options.login, (username, password, done) => {
        if (!username) return done(null, false, codes.AUTH.USERNAME.MISSING);
        if (!password) return done(null, false, codes.AUTH.PASSWORD.MISSING);

        User.findOne({ username: username }).exec()
            .then(user => {
                if (!user) return done(null, false, codes.AUTH.USERNAME.NOT_MATCH);
                user.comparePassword(password, (error, isMatch) => {
                   if (error) return done(error, false);
                   if (!isMatch) return done(null, false, codes.AUTH.PASSWORD.NOT_MATCH);
                   return done(null, user, codes.AUTH.LOGIN.SUCCESS)
                });
            })
            .catch(error => {
                return done(error);
            });
    }));

    passport.use('jwt', new JwtStrategy(options.jwt, (payload, done) => {
        User.findById(payload._id).exec()
            .then(user => {
                if (user) return done(null, user, codes.AUTH.TOKEN.VALID);
                return done(null, false, codes.AUTH.TOKEN.INVALID)
            })
            .catch(error => {
                return done(error);
            })
    }));

};