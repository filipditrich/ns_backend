/**
 * @description Exports Service Configuration
 */
module.exports = {

    id: process.env.SVC_ID || "core",
    name: "Core Service",
    port: process.env.port || 4001,
    host: process.env.HOST_URL || 'localhost',
    environment: process.env.NODE_ENV || 'development',

    db: {
        url: process.env.MONGO_URL || 'mongodb://localhost:27017',
        name: process.env.MONGO_ID || 'NSCore'
    },

    services: {
        operator: {
            host: process.env.NSOP_URL || 'localhost',
            port: process.env.NSOP_PORT || 4000
        }
    }

};