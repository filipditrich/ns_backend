/**
 * @description Exports Service Configuration
 */
module.exports = {

    id: process.env.SVC_ID || "operator",
    name: "Operator Service",
    port: process.env.port || 4000,
    environment: process.env.NODE_ENV || 'development',

    database: {
        url: 'mongodb://localhost:27017',
        name: 'NSOperator'
    }

};