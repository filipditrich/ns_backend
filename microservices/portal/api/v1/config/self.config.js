/**
 * @description Exports Micro-Service Configuration
 * @author Filip Ditrich
 */
module.exports = {

    id: 'portal',
    name: 'Portal Gateway',
    port: process.env.port || 4000,
    environment: process.env.NODE_ENV || 'development',

    consumers: [ '6e6f7274-6865-726e-7374-6172732e637a' ]

};