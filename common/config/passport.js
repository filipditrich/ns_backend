// const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('./common');
const codes = require('../assets/codes');
const User = require('../../workers/agent/models/user');

/**
 * @description: Creates passport authentication strategies
 * @param passport
 * @param env
 */
module.exports = function (passport, env) {

    const options = {
        secret: {
            usernameField: 'sp1',
            passwordField: 'sp2'
        },
        login: {
            usernameFiled: 'username'
        },
        jwt: {
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
            secretOrKey: config[env].token.secret
        }
    };

    passport.use('secret', new LocalStrategy(options.secret, (sp1, sp2, done) => {
       if ((!sp1 && sp2 ) || (sp1 && !sp2)) return done(null, false, codes.SECRET.INCOMPLETE);
       if (!sp1 || !sp2) return done(null, false, codes.SECRET.MISSING);

       if ((sp1 === config[env].secret.sp1) && (sp2 === config[env].secret.sp2)) {
           return done(null, true, codes.SECRET.VERIFIED);
       } else {
           return done(null, false, codes.SECRET.INVALID);
       }
    }));

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
                if (user) return done(null, user, codes.AUTH.TOKEN.VALID)
                return done(null, false, codes.AUTH.TOKEN.INVALID)
            })
            .catch(error => {
                return done(error);
            })
    }));

};