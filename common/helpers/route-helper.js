const _ = require('lodash');

/**
 * @description: Traverses in object to endpath (x.y.z)
 * @param obj
 * @param keys
 * @return {T}
 */
exports.traverse = function (obj, keys) {
    return keys.split('.').reduce(function (cur, key) {
        return cur[key];
    }, obj);
};

/**
 * @description: Generates URL endpath (without host and port) from endpoints config
 * @param obj
 * @param endpath
 * @param fnc
 * @param endpoints
 * @return {Promise<any[]>}
 */
exports.matrix = function (obj, endpath, fnc = false, endpoints) {

    let promises = [];

    const recursion = async function (value, key, endpath) {

        return new Promise((resolve, reject) => {
            if (typeof value === 'object') {
                if (key !== 'meta') {
                    if (endpath) {
                        each(value, (endpath + '.' + key));
                    } else {
                        each(value, key);
                    }
                    resolve();
                }
            } else {
                if (key === 'url') {
                    try {
                        exports.traverse(endpoints, endpath).url = '/' + endpath.toLowerCase().split(".").join("/");
                        resolve();
                    } catch (error) { reject(error); }
                }
            }
        });

    };

    const each = function (obj, endpath) {
        promises.push(new Promise((resolve, reject) => {

            _.forEach(obj, (value, key) => {
                recursion(value, key, endpath)
                    .then(() => resolve())
                    .catch(error => reject(error));
            });

        }));
    };

    if (fnc && fnc === 'each') { each(obj, endpath) }

    return Promise.all(promises);

};
