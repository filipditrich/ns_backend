/**
 * @description Exports Service Configuration
 */
module.exports = {

    id: process.env.SVC_ID || "operator",
    name: "Operator Service",
    port: process.env.port || 4000,
    environment: process.env.NODE_ENV || 'development',

    db: {
        url: process.env.MONGO_URL || 'mongodb://localhost:27017',
        name: process.env.MONGO_ID || 'NSOperator'
    },

    consumers: [ '6e6f7274-6865-726e-7374-6172732e637a' ]

};