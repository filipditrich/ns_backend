const codeGenerator = require('northernstars-shared').baseCodeGenerator;

// TODO - method of generating base codes for each field + base CRUD
module.exports = {

    PLACE: {
        DUPLICATE: codeGenerator.duplicate('place'),
        NOT_FOUND: codeGenerator.notFound('place'),
        NULL_FOUND: codeGenerator.multipleNotFound('place'),
        MISSING: codeGenerator.missing('place'),
        REQUIRED: codeGenerator.required('place'),
        NAME: {
            MISSING: codeGenerator.missing('place_name'),
            DUPLICATE: codeGenerator.duplicate('place_name')
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
            MISSING: codeGenerator.missing('team_name'),
            DUPLICATE: codeGenerator.duplicate('team_name'),
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
            MISSING: codeGenerator.missing('jersey_name'),
            DUPLICATE: codeGenerator.duplicate('jersey_name')
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
            INVALID: codeGenerator.invalid('match_date'),
            MISSING: codeGenerator.missing('match_date'),
            REQUIRED: codeGenerator.required('match_date')
        },
        TITLE: {
            MISSING: codeGenerator.missing('match_title'),
            REQUIRED: codeGenerator.required('match_title')
        },
        GROUP: {
            DUPLICATE: codeGenerator.duplicate('match_group'),
            NOT_FOUND: codeGenerator.notFound('match_group'),
            NULL_FOUND: codeGenerator.multipleNotFound('match_group'),
            MISSING: codeGenerator.missing('match_group'),
            REQUIRED: codeGenerator.required('match_group'),
            NAME: {
                REQUIRED: codeGenerator.required('match_group_name'),
                MISSING: codeGenerator.missing('match_group_name'),
                DUPLICATE: codeGenerator.duplicate('match_group_name')
            },

            UPDATED: codeGenerator.update('match_group'),
            DELETED: codeGenerator.delete('match_group'),
            CREATED: codeGenerator.create('match_group'),
        },
        ENROLLMENT: {
            CLOSES: {
                MISSING: codeGenerator.missing('match_enrollment_close'),
                REQUIRED: codeGenerator.required('match_enrollment_close'),
                CLOSED: {
                    name: 'MATCH_ENROLLMENT_CLOSED',
                    message: 'Match enrollment is already closed.',
                    success: false,
                    status: 400
                }
            },
            OPENS: {
                MISSING: codeGenerator.missing('match_enrollment_opens'),
                REQUIRED: codeGenerator.required('match_enrollment_opens'),
                CLOSED: {
                    name: 'MATCH_ENROLLMENT_CLOSED',
                    message: 'Match enrollment is still closed.',
                    success: false,
                    status: 400
                }
            },
            PLAYERS: {
                PLAYER: {
                    MISSING: codeGenerator.missing('match_enrollment_players_player'),
                    REQUIRED: codeGenerator.required('match_enrollment_players_player')
                },
                STATUS: {
                    MISSING: codeGenerator.missing('match_enrollment_players_status'),
                    REQUIRED: codeGenerator.required('match_enrollment_players_status'),
                    ALREADY_PARTICIPATING: {
                        name: 'MATCH_ENROLLMENT_ALREADY_PARTICIPATING',
                        message: "",
                        success: false,
                        status: 400
                    }
                },
            },
            MAX_CAP: {
                MISSING: codeGenerator.missing('match_enrollment_players_max_capacity'),
                REQUIRED: codeGenerator.required('match_enrollment_players_max_capacity'),
                INVALID: codeGenerator.invalid('match_enrollment_players_max_capacity'),
                EXCEEDED: {
                    name: 'MATCH_MAXIMUM_CAPACITY_EXCEEDED',
                    message: "Enrollment capacity of this match has been exceeded",
                    success: false,
                    status: 400
                }
            },
            MISSING: codeGenerator.missing('match_enrollment')
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

    RESULTS: {
        MATCH: {
            REQUIRED: codeGenerator.required('results_match'),
            MISSING: codeGenerator.missing('results_match'),
            NOT_PLAYED: {
                name: 'RESULTS_MATCH_NOT_PLAYED',
                message: "",
                status: 400,
                success: false
            },
            NOT_ENROLLED: {
                name: 'RESULTS_MATCH_NOT_ENROLLED',
                message: "",
                status: 400,
                success: false
            }
        },
        PLAYERS: {
            PLAYER: {
                REQUIRED: codeGenerator.required('results_players_player'),
                MISSING: codeGenerator.missing('results_players_player'),
                DUPLICATE: codeGenerator.duplicate('results_player_player'),
            },
            JERSEY: {
                REQUIRED: codeGenerator.required('results_players_jersey'),
                MISSING: codeGenerator.missing('results_players_jersey'),
                NOT_FOUND: codeGenerator.notFound('results_players_jersey'),
                OUT_OF_SET: {
                    name: 'RESULTS_PLAYERS_JERSEY_OUT_OF_SET',
                    message: "",
                    status: 400,
                    success: false
                }
            },
            STATUS: {
                REQUIRED: codeGenerator.required('results_players_status'),
                MISSING: codeGenerator.missing('results_player_status'),
                INVALID: codeGenerator.invalid('results_player_status'),
                IMPROPER: {
                    name: 'RESULTS_PLAYER_STATUS_IMPROPER',
                    message: "",
                    status: 400,
                    success: false
                }
            },
            GOALS: {},
            MISSING: codeGenerator.missing('results_players')
        },

    },


};