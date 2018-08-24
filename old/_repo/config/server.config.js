module.exports = {

    development: {

        email: {
            transporter: {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: 'awehdx@gmail.com',
                    pass: 'changedPassword123'
                }
            },
            sender: '"NS Support" <awehdx@gmail.com>'
        },

        secret: {
            secret: '937a43fc73c501dfa94d7dcf0cf668e0',
            microSvcCommunication: 'f350fcc7721c44a683107c1f75f9e3d5',
            index: 7
        },

        token: {
            secret: 'v90q4gj1kp9hs9cbo8u7tfm78j26qaiv',
            ttl: 1800
        }
    },

    production: {}

};