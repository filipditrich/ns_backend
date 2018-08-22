module.exports = [

    {
        id: 'auth',
        port: 3001,
        api: {
            version: 'v1',
            tokenAuth: false
        },

        pathToTokenAuth: 'authenticate-token',
    },
    {
        id: 'config',
        port: 3002,
        api: {
            version: 'v1',
            tokenAuth: false
        }
    },
    {
        id: 'core',
        port: 3003,
        api: {
            version: 'v1',
            tokenAuth: true
        }
    }

];