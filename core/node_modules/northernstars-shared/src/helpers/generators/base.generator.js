const randomString = require('randomstring');
const codes = require('../../assets/system-codes.asset');

/**
 * @description: Generates a random string of some length (default = 32)
 * @param length
 * @returns {String}
 */
exports.generateRandom = function (length = 32) {
    return randomString.generate(length);
};

/**
 * @description: Generates a new random string that's unequal to <modelQuerySelector> field in model <model>
 * @param length
 * @param model
 * @param modelQuerySelector
 * @returns {Promise<any>}
 */
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

/**
 * @description: Returns middle of the string based on the index (default = 0)
 * @param string
 * @param index
 * @return {*}
 */
exports.generateMiddleString = (string, index = 0) => {
    return string.substr((Math.round((string.length / 2)) - Math.round((index / 2))), index);
};