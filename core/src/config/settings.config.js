/**
 * @description Exports Service Configuration
 */
module.exports = {

    id: process.env.SVC_ID || "core",
    name: "Core Service",
    port: process.env.port || 4001,
    environment: process.env.NODE_ENV || 'development',

    db: {
        url: 'mongodb://localhost:27017',
        name: 'NSCore'
    },

};