/**
 * @description Exports Micro-Service Configuration
 * @author Filip Ditrich
 */
module.exports = {

    id: 'core',
    name: 'Core Worker',
    port: process.env.port || 3003,
    environment: process.env.NODE_ENV || 'development',

    db: {
        name: process.env.DB_NAME || 'NSCoreWkr',
        url: process.env.DB_URL || 'mongodb://localhost:27017'
    },

    token: {
        secret: '48a177616a1664cbae3f00bb7ccfd356',
        ttl: 3600
    },

    consumers: [ '6e6f7274-6865-726e-7374-6172732e637a' ]

};