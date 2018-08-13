/**
 * @description Exports Server Settings for Individual Environment
 * @author filipditrich
 */
module.exports = {

    development: {
        token: {
            secret: 'n0rt43rn5tar5',
            ttl: 1800
        },
        secret: {
            secret: '937a43fc73c501dfa94d7dcf0cf668e0',
            index: 7
        },
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
        workers: [
            {
                id: 'core',
                api: {
                    protocol: 'http',
                    baseUrl: 'localhost',
                    port: 3001
                },
                db: {
                    credentials: '',
                    host: 'localhost',
                    port: 27017,
                    name: 'NSCore'
                }
            },
            {
                id: 'auth',
                api: {
                    protocol: 'http',
                    baseUrl: 'localhost',
                    port: 3002
                },
                db: {
                    credentials: '',
                    host: 'localhost',
                    port: 27017,
                    name: 'NSAuth'
                }
            }
        ],
        api: {
            consumers: [ '6e6f7274-6865-726e-7374-6172732e637a' ]
        }
    },

    production: {},
    test: {},

    shared: {
        fields: {
            password: {
                minLength: 6,
                maxLength: 32,
                regExp: /^(?=.*\d)(?=.*[a-z0-9])(?=.*[A-Z]).*$/
            },
            email: {
                regExp: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            },
            username: {
                minLength: 3,
                maxLength: 16,
                lowercase: true
            }
        },
    }

};