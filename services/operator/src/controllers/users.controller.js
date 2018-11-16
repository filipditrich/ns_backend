const User = require('../models/user.schema');
const errorHelper = require('northernstars-shared').errorHelper;
const codes = require('../assets/codes.asset');

exports.getUserData = (req, res, next) => {
    const userID = req.params["id"];

    User.findOne({_id: userID}).exec()
        .then(user => {
            res.json({response: user});
        }, err => {
            return next(errorHelper.prepareError(err))
        })
}

exports.updateUser = (req, res, next) => {
    const userID = req.params["id"];
    const update = req.body;

   User.findOne({_id: userID}).exec()
       .then(user => {
          user.update(update).then(() => {
              res.json({response: codes.USER.UPDATED})
          })
       }, err => {
           return next(errorHelper.prepareError(err));
       })
}

