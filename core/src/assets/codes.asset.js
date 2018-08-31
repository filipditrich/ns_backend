const codeGenerator = require('northernstars-shared').baseCodeGenerator;

module.exports = {

    PLACE: {
        DUPLICATE: codeGenerator.duplicate('place'),
        NOT_FOUND: codeGenerator.notFound('place'),
        NULL_FOUND: codeGenerator.multipleNotFound('place'),
        MISSING: codeGenerator.missing('place'),
        REQUIRED: codeGenerator.required('place'),
        NAME: {
            MISSING: codeGenerator.missing('place_name')
        },

        UPDATED: codeGenerator.update('place'),
        DELETED: codeGenerator.delete('place'),
        CREATED: codeGenerator.create('place'),
    },

    TEAM: {
        DUPLICATE: codeGenerator.duplicate('team'),
        NOT_FOUND: codeGenerator.notFound('team'),
        NULL_FOUND: codeGenerator.multipleNotFound('team'),
        MISSING: codeGenerator.missing('team'),
        REQUIRED: codeGenerator.required('team'),
        NAME: {
            MISSING: codeGenerator.missing('team_name')
        },
        JERSEY: {
            MISSING: codeGenerator.missing('team_jersey')
        },

        UPDATED: codeGenerator.update('team'),
        DELETED: codeGenerator.delete('team'),
        CREATED: codeGenerator.create('team'),
    },

    JERSEY: {
        DUPLICATE: codeGenerator.duplicate('jersey'),
        NOT_FOUND: codeGenerator.notFound('jersey'),
        NULL_FOUND: codeGenerator.multipleNotFound('jersey'),
        MISSING: codeGenerator.missing('jersey'),
        REQUIRED: codeGenerator.required('jersey'),
        NAME: {
            MISSING: codeGenerator.missing('jersey_name')
        },

        UPDATED: codeGenerator.update('jersey'),
        DELETED: codeGenerator.delete('jersey'),
        CREATED: codeGenerator.create('jersey'),
    },

    MATCH: {
        DUPLICATE: codeGenerator.duplicate('match'),
        NOT_FOUND: codeGenerator.notFound('match'),
        NULL_FOUND: codeGenerator.multipleNotFound('match'),
        MISSING: codeGenerator.missing('match'),

        DATE: {
            DUPLICATE: codeGenerator.duplicate('match_date'),
            DUPLICATE_ADVISABLE: {
                name: 'MATCH_DATE_DUPLICATE_BUT_ADVISABLE',
                status: 200,
                success: false
            },
            MISSING: codeGenerator.missing('match_date'),
            REQUIRED: codeGenerator.required('match_date')
        },
        TITLE: {
            MISSING: codeGenerator.missing('match_title'),
            REQUIRED: codeGenerator.required('match_title')
        },
        ENROLLMENT: {
            CLOSES: {
                MISSING: codeGenerator.missing('match_enrollment_close'),
                REQUIRED: codeGenerator.required('match_enrollment_close')
            },
            OPENS: {
                MISSING: codeGenerator.missing('match_enrollment_opens'),
                REQUIRED: codeGenerator.required('match_enrollment_opens')
            },
            PLAYERS: {
                PLAYER: {
                    MISSING: codeGenerator.missing('match_enrollment_players_player'),
                    REQUIRED: codeGenerator.required('match_enrollment_players_player')
                },
                STATUS: {
                    MISSING: codeGenerator.missing('match_enrollment_players_status'),
                    REQUIRED: codeGenerator.required('match_enrollment_players_status')
                }
            }
        },

        UPDATED: codeGenerator.update('match'),
        DELETED: codeGenerator.delete('match'),
        CREATED: codeGenerator.create('match'),

        CANCELLED: {
            name: 'MATCH_CANCEL_OK',
            message: "Match successfully cancelled.",
            status: 200,
            success: true
        }
    },

    MATCH_RESULT: {
        MATCH: {
            DUPLICATE: codeGenerator.duplicate('match_result_match'),
            NOT_FOUND: codeGenerator.notFound('match_result_match'),
            MISSING: codeGenerator.missing('match_result_match'),
            REQUIRED: codeGenerator.required('match_result_match')
        },
        TEAM: {
            DUPLICATE: codeGenerator.duplicate('match_result_team'),
            NOT_FOUND: codeGenerator.notFound('match_result_team'),
            MISSING: codeGenerator.missing('match_result_team'),
            REQUIRED: codeGenerator.required('match_result_team')
        },
        RESULT: {
            DUPLICATE: codeGenerator.duplicate('match_result_result'),
            MISSING: codeGenerator.missing('match_result_result'),
            REQUIRED: codeGenerator.required('match_result_result')
        }
    }

};