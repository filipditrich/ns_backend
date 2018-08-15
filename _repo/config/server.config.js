module.exports = {

    development: {

        email: {
            transporter: {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: 'awehdx@gmail.com',
                    pass: 'testingPassword123'
                }
            },
            sender: '"NS Support" <awehdx@gmail.com>'
        },

        secret: {
            secret: '937a43fc73c501dfa94d7dcf0cf668e0',
            index: 7
        }
    },

    production: {}

};