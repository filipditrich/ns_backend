/**
 * @description Exports Service Configuration
 */
module.exports = {

    id: process.env.SVC_ID || "operator",
    name: "Operator Service",
    port: process.env.port || 4000,
    environment: process.env.NODE_ENV || 'development',

    db: {
        url: 'mongodb://localhost:27017' || process.env.MONGO_URL,
        name: 'NSOperator' || process.env.MONGO_ID
    },

    consumers: [ '6e6f7274-6865-726e-7374-6172732e637a' ]

};