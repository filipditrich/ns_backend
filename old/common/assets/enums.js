/**
 * @description System Level Enums
 * @author filipditrich
 */
module.exports = {

    AUTH: {
        ROLES: {
            player: { key: 'player', value: 'player' },
            admin: { key: 'admin', value: 'admin' },
            moderator: { key: 'moderator', value: 'moderator' },
            superAdmin: { key: 'super', value: 'super' }
        },
        TEAMS: {
            ns: { key: 'ns', value: 'Northern Stars' },
            other: { key: 'other', value: 'Other' }
        }
    },

    METHODS: {
        get: { key: 0, value: 'get' },
        post: { key: 1, value: 'post' },
        put: { key: 2, value: 'put' },
        delete: { key: 3, value: 'delete' },
        options: { key: 4, value: 'options' },
        use: { key: 5, value: 'use' }
    },

    WORKERS: {
        agent: { key: 0, value: 'agent' },
        backdrop: { key: 1, value: 'backdrop' },
        sport: { key: 2, value: 'sport' }
    }

};