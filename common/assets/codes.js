module.exports = {

    INVALID_ENDPOINT: {
        name: 'INVALID_ENDPOINT',
        message: 'Invalid Endpoint Reached',
        status: 404,
        success: false
    },

    UNEXPECTED: {
        name: 'UNEXPECTED_ERROR',
        status: 500,
        success: false
    },

    SECRET: {
        INVALID: {
            name: 'INVALID_SECRET',
            status: 401,
            success: false
        },
        INCOMPLETE: {
            name: 'INCOMPLETE_SECRET',
            status: 422,
            success: false
        },
        MISSING: {
            name: 'MISSING_SECRET',
            status: 422,
            success: false
        },
        VERIFIED: {
            name: 'SECRET_VERIFIED',
            status: 200,
            success: true
        }
    },

    AUTH: {
        USERNAME: {
            MISSING: {
                name: 'MISSING_USERNAME',
                status: 422,
                success: false
            },
            NOT_MATCH: {
                name: 'USERNAME_MISMATCH',
                status: 401,
                success: false
            }
        },
        PASSWORD: {
            MISSING: {
                name: 'MISSING_PASSWORD',
                status: 422,
                success: false
            },
            NOT_MATCH: {
                name: 'PASSWORD_MISMATCH',
                status: 401,
                success: false
            }
        },
        LOGIN: {
            SUCCESS: {
                name: 'LOGIN_SUCCESSFUL',
                status: 200,
                success: true
            },
            FAIL: {
                name: 'LOGIN_FAILED',
                status: 401,
                success: false
            },
            INCOMPLETE_REQUEST: {
                name: 'INCOMPLETE_LOGIN_REQUEST',
                status: 422,
                success: false
            }
        },
        TOKEN: {
            VALID: {
                name: 'VALID_TOKEN',
                status: 200,
                success: true
            },
            INVALID: {
                name: 'INVALID_TOKEN',
                status: 401,
                success: false
            }
        },
        AUTH_ROLES: {
            UNAUTHORIZED_ACCESS: {
                name: 'UNAUTHORIZED_ACCESS',
                status: 403,
                success: false
            }
        }
    }

};