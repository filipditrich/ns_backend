module.exports = {

    development: {
        db: {
            url: "mongodb://localhost:27017/northern_stars"
        },
        token: {
            secret: 'n0rt43rn5tar5',
            ttl: 1800
        },
        secret: {
            sp1: 'firstpart',
            sp2: 'secondpart'
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
        }
    },

    production: {
        db: {
            url: null
        }
    }

};