/**
 * @description Exports Service Configuration
 */
module.exports = {

    id: process.env.SVC_ID || "operator",
    name: "Operator Service",
    host: process.env.HOST_URL | 'localhost',
    port: process.env.port || 4000,
    environment: process.env.NODE_ENV || 'development',
    timezone: process.env.TZ || 'Europe/Prague',

    db: {
        url: process.env.MONGO_URL || 'mongodb://localhost:27017',
        name: process.env.MONGO_ID || 'NSOperator'
    },

    consumers: [ '6e6f7274-6865-726e-7374-6172732e637a' ],

    services: {},

};