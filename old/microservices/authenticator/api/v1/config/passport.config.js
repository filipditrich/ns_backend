const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const sysCodes = require('../../../../../_repo/assets/system-codes.asset');
const config = require('./self.config');
const codes = require('../assets/codes.asset');
const User = require('../models/user.schema');

/**
 * @description Passport Authentication Strategies
 * @author Filip Ditrich
 * @param passport
 */
module.exports = function (passport) {

    const options = {
        login: {},
        jwt: {
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
            secretOrKey: config.token.secret
        }
    };

    passport.use('login', new LocalStrategy(options.login, (username, password, done) => {
        if (!username) return done(null, false, codes.USERNAME.MISSING);
        if (!password) return done(null, false, codes.PASSWORD.MISSING);

        User.findOne({ username: username }).exec()
            .then(user => {
                if (!user) return done(null, false, codes.USERNAME.NOT_MATCH);
                user.comparePassword(password, (error, isMatch) => {
                    if (error) return done(error, false);
                    if (!isMatch) return done(null, false, codes.PASSWORD.NOT_MATCH);
                    return done(null, user, codes.LOGIN.SUCCESS)
                });
            })
            .catch(error => {
                return done(error);
            });
    }));

    passport.use('jwt', new JwtStrategy(options.jwt, (payload, done) => {
        User.findById(payload._id).exec()
            .then(user => {
                if (user) return done(null, user, sysCodes.AUTH.TOKEN.VALID);
                return done(null, false, sysCodes.AUTH.TOKEN.INVALID)
            })
            .catch(error => {
                return done(error);
            })
    }));

};