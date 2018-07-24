module.exports = {

    AUTH: {
        ROLES: {
            player: { key: 'player', value: 'player' },
            admin: { key: 'admin', value: 'admin' },
            moderator: { key: 'moderator', value: 'moderator' }
        },
    },

    METHODS: {
        get: { key: 0, value: 'get' },
        post: { key: 1, value: 'post' },
        put: { key: 2, value: 'put' },
        delete: { key: 3, value: 'delete' },
        options: { key: 4, value: 'options' }
    },

    WORKERS: {
        agent: { key: 0, value: 'agent' },
        backdrop: { key: 1, value: 'backdrop' }
    }

};