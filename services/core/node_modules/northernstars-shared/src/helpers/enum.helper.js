/**
 * @description: Returns an array of enums from an object
 * @param enums
 * @returns {any[]}
 */
exports.toArray = function (enums) {
    return Object.keys(enums).map(function (item) { return enums[item].key });
};