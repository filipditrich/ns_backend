const LocalStrategy = require('passport-local').Strategy;
const codes = require('../assets/codes.asset');
const User = require('../models/user.schema');

/**
 * @description Passport Authentication Strategies
 * @author Visionary
 * @param passport
 */
module.exports = function (passport) {

    passport.use('login', new LocalStrategy({}, (username, password, done) => {
        if (!username) return done(null, false, codes.USERNAME.MISSING);
        if (!password) return done(null, false, codes.PASSWORD.MISSING);

        User.findOne({ username: username }).exec()
            .then((user) => {
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

};
