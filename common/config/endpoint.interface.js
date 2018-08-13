const _ = require('lodash');


/**
 * @description Simple endpoint interface model
 * @author filipditrich
 * @param id
 * @param endpoint
 * @param sub
 * @param meta
 * @constructor
 */
let Endpoint = function (id, endpoint, sub = false, meta = false) {

    this.id = id;
    this.endpoint = endpoint;
    this.url = '';
    if (sub) {
        if (Array.isArray(sub)) {
            _.forEach(sub, (value, key) => {
               this[value.id] = value.endpoint;
            });
        } else {
            this[sub.id] = sub.endpoint;
        }
    }
    if (meta) {
        this.meta = {
            method: meta.method,
            authorization: meta.authorization
        }
    }

    function clearEndpoint() {
        delete this;
    }

};

/**
 * @type {Endpoint}
 */
module.exports = Endpoint;