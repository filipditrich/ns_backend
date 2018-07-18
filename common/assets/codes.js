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
            },
            IN_USE: {
                name: 'USERNAME_IN_USE',
                status: 400,
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
            },
            SHORT: {
                name: 'PASSWORD_TOO_SHORT',
                status: 422,
                success: false
            },
            LONG: {
                name: 'PASSWORD_TOO_LONG',
                status: 422,
                success: false
            },
            WEAK: {
                name: 'WEAK_PASSWORD',
                status: 422,
                success: false
            }
        },
        EMAIL: {
            MISSING: {
                name: 'MISSING_EMAIL',
                status: 400,
                success: false
            },
            ALREADY_REQUESTED: {
                name: 'REQUEST_WITH_EMAIL_ALRADY_MADE',
                status: 400,
                success: false
            },
            IN_USE: {
                name: 'EMAIL_ALREADY_IN_USE',
                status: 400,
                success: false
            },
            INVALID: {
                name: 'INVALID_EMAIL',
                status: 422,
                success: false
            }
        },
        NAME: {
            MISSING: {
                name: 'MISSING_NAME',
                status: 400,
                success: false
            },
            INVALID: {
                name: 'INVALID_NAME',
                status: 422,
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
        REGISTRATION: {
            SUCCESS: {
                name: 'REGISTRATION_SUCCESSFUL',
                status: 200,
                success: true
            },
            FAIL: {
                name: 'REGISTRATION_FAILED',
                status: 401,
                success: false
            },
            REQUEST: {
                NON_EXISTENCE: {
                    name: 'REQUEST_NOT_FOUND',
                    status: 404,
                    success: false
                },
                NOT_APPROVED: {
                    name: 'REQUEST_UNAPPROVED',
                    status: 400,
                    success: false
                },
                USER_REGISTERED: {
                    name: 'REQUEST_USER_REGISTERED',
                    status: 400,
                    success: false
                }
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
        },
        VALIDATION: {
            name: 'VALIDATION_ERROR',
            status: 400,
            success: false,
        }
    }

};