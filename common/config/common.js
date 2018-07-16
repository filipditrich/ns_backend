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
        }
    },

    production: {
        db: {
            url: null
        }
    }

};