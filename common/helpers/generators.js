const randomString = require('randomstring');
const codes = require('../assets/codes');

exports.generateRandom = function (length = 32) {
    return randomString.generate(length);
};

exports.generateRandomUnequalDocument = function (length, model, modelQuerySelector) {

    return new Promise((resolve, reject) => {

        if (!length) length = 32;
        if (!model) reject(codes.HELPERS.GENERATORS.MODEL_MISSING);
        if (!modelQuerySelector) reject(codes.HELPERS.GENERATORS.MODELQUERYSELECTOR_MISSING);

        const hash = randomString.generate(length);
        let query = {};
        query[modelQuerySelector] = hash;
        model.find(query).exec()
            .then(duplicate => {
                if (duplicate.length > 0) this.generateRandomUnequalDocument(length, model, modelQuerySelector);
                resolve(hash);
            })
            .catch(error => {
                reject(error);
            })

    });

};