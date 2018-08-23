module.exports = {

    USERNAME: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 24
    },

    PASSWORD: {
        MIN_LENGTH: 6,
        MAX_LENGTH: 32,
        REG_EXP: /^(?=.*\d)(?=.*[a-z0-9])(?=.*[A-Z]).*$/
    },

    EMAIL: {
        REG_EXP: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    }

};