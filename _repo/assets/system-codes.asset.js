module.exports = {

    AUTH: {
        TOKEN: {
            VALID: {
                name: 'AUTH_TOKEN_VALID',
                message: 'Token authenticated successfully',
                status: 200,
                success: true
            },
            INVALID: {
                name: 'AUTH_TOKEN_INVALID',
                message: 'Token was not authenticated.',
                status: 401,
                success: false
            }
        },
        ROLES: {
            UNAUTHORIZED_ACCESS: {
                name: 'ROLE_AUTH_UNAUTHORIZED',
                message: 'A higher role privilege is required to do such an action',
                status: 401,
                success: false
            }
        },
        VALIDATION: {
            name: 'VALIDATION_ERROR',
            status: 400,
            success: false
        }
    },

    UNDEFINED: {
        name: 'ERR_UNDEFINED',
        message: 'An undefined error.',
        status: 500,
        success: false
    },

    UNEXPECTED: {
        name: 'ERR_UNEXPECTED',
        message: 'An unexpected error occurred.',
        status: 500,
        success: false
    },

    API: {
        INVALID_ENDPOINT: {
            name: 'INVALID_ENDPOINT',
            message: 'Invalid endpoint have been reached.',
            status: 404,
            success: false
        },
        UNAUTHORIZED_CONSUMER: {
            name: 'UNAUTHORIZED_API_CONSUMER',
            message: 'Unauthorized API consumer.',
            status: 401,
            success: false
        }
    },

    SECRET: {
        MISSING: {
            name: 'SERVER_SECRET_MISSING',
            message: 'Server secret was not present in the request.',
            status: 400,
            success: false
        },
        INVALID: {
            name: 'SERVER_SECRET_INVALID',
            message: 'Server secret is invalid.',
            status: 401,
            success: false
        }
    },

    HELPERS: {
        GENERATORS: {
            MODEL_MISSING: {
                name: 'H_GEN_MODEL_MISSING',
                status: 500,
                success: false
            },
            MODELQUERYSELECTOR_MISSING: {
                name: 'H_GEN_MODELQUERYSELECTOR_MISSING',
                status: 500,
                success: false
            }
        }
    },

    MAILING: {
        SENT: {
            name: 'MAILING_SENT_OK',
            message: 'Mail sent successfully.',
            status: 200,
            success: true
        }
    }

};