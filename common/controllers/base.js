const codes = require('../assets/codes');

exports.invalidEndpoint = function (req, res, next) {
    next(codes.API.INVALID_ENDPOINT);
};