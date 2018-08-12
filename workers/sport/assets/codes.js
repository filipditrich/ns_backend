/**
 * @description Exports Worker Specific Response Codes
 * @author filipditrich
 */
module.exports = {

    MATCH: {

        JERSEY: {
            DUPLICATE: {
                name: 'JERSEY_DUPLICATE',
                status: 400,
                success: false
            },
            CREATED: {
                name: 'JERSEY_CREATE_OK',
                status: 200,
                success: true
            },
            MISSING: {
                name: 'JERSEY_MISSING',
                status: 400,
                success: false
            },
            NOT_FOUND: {
                name: 'JERSEY_NOT_FOUND',
                status: 404,
                success: false
            }
        },

        TEAM: {
            DUPLICATE: {
                name: 'TEAM_DUPLICATE',
                status: 400,
                success: false
            },
            CREATED: {
                name: 'TEAM_CREATE_OK',
                status: 200,
                success: true
            }
        },

        MATCH: {
            DATE_DUP: {
                name: 'MATCH_DATE_DUPLICATE',
                status: 400,
                success: false
            },
            DATE_DUP_ADVISE: {
                name: 'MATCH_DATE_DUPLICATE_ADVISABLE',
                status: 422,
                success: false
            },
            CREATED: {
                name: 'MATCH_CREATE_OK',
                status: 200,
                success: true
            },
            NOT_FOUND: {
                name: 'MATCH_NOT_FOUND',
                status: 404,
                success: false
            }
        },

        PLACE: {
            DUPLICATE: {
                name: 'PLACE_DUPLICATE',
                status: 400,
                success: false
            },
            CREATED: {
                name: 'PLACE_CREATE_OK',
                status: 200,
                success: true
            }
        }

    }

};