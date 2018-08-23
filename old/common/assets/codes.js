/**
 * @description Response Codes
 * @author filipditrich
 */
module.exports = {

    UNEXPECTED: {
        name: 'UNEXPECTED_ERROR',
        status: 500,
        success: false
    },

    UNDEFINED: {
        name: 'UNDEFINED_ERROR',
        message: 'An undefined error occurred. Please contact administrator with code 0x000000',
        status: 500,
        success: false
    },

    CRUD: {
        UPDATE: {
            UPDATED: {
                name: 'UPDATE_OK',
                status: 200,
                success: true
            },
            UNCHANGED: {
                name: 'UPDATE_FAIL_NO_CHANGE',
                status: 400,
                success: false
            }
        },
        READ: {
            FOUND: {
                name: 'READ_OK',
                status: 200,
                success: true
            },
            NOT_FOUND: {
                name: 'READ_FAIL_NOT_FOUND',
                status: 404,
                success: false
            }
        },
        DELETE: {
            DELETED: {
                name: 'DELETE_OK',
                status: 200,
                success: true
            },
            NOT_DELETED: {
                name: 'DELETE_FAIL_NOT_DELETED',
                status: 400,
                success: false
            }
        }
    },

    REQUEST: {
        VALID: {
            name: 'REQUEST_VALID',
            status: 200,
            success: true
        },
        INVALID: {
            name: 'REQUEST_INVALID',
            status: 403,
            success: false
        },
        CHECK: {
            QUERY_MISSING: {
                name: 'CHECK_QUERY_MISSING',
                message: 'Check query is missing from the request',
                status: 400,
                success: false
            },
            NOT_FOUND: {
                name: 'CHECK_RESULT_NOT_FOUND',
                message: 'The check provided no results.',
                status: 404,
                success: false
            },
            FOUND: {
                name: 'CHECK_RESULT_FOUND',
                message: 'The check resulted with found data.',
                status: 200,
                success: true
            }
        },
        PROCESSED: {
            name: 'REQUEST_PROCESSED',
            status: 200,
            success: true
        }
    },

    API: {
        UNAUTHORIZED_CONSUMER: {
            name: 'UNAUTHORIZED_API_CONSUMER',
            message: 'Unauthorized API consumer',
            status: 401,
            success: false
        },
        INVALID_ENDPOINT: {
            name: 'INVALID_ENDPOINT',
            message: 'Invalid Endpoint Reached',
            status: 404,
            success: false
        },
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
                name: 'REQUEST_WITH_EMAIL_ALREADY_MADE',
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
            },
            NOT_FOUND: {
                name: 'EMAIL_NOT_FOUND',
                status: 400,
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
                ALREADY_APPROVED: {
                  name: 'REQUEST_ALREADY_APPROVED',
                  status: 400,
                  success: false
                },
                USER_REGISTERED: {
                    name: 'REQUEST_USER_REGISTERED',
                    status: 400,
                    success: false
                },
                APPROVE_SUCCESS: {
                    name: 'REQUEST_APPROVAL_SUCCESS',
                    status: 200,
                    success: true
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
        },
        RESET: {
            CREDENTIALS: {
                TOO_MANY: {
                    name: 'MULTIPLE_CREDENTIALS',
                    status: 400,
                    success: false
                },
                MISSING: {
                    name: 'MISSING_CREDENTIALS',
                    status: 400,
                    success: false
                }
            },
            USER: {
                NOT_FOUND: {
                    name: 'USER_NOT_FOUND',
                    status: 400,
                    success: false
                }
            },
            ALREADY_MADE: {
                name: 'RESET_REQUEST_ALREADY_MADE',
                status: 400,
                success: false
            },
            NOT_FOUND: {
                name: 'RESET_REQUEST_NOT_FOUND',
                status: 404,
                success: false
            },
            MAILING: {
                SENT: {
                    name: 'EMAIL_SENT',
                    status: 200,
                    success: true
                }
            },
            SAME_PASSWORD: {
                name: 'NEW_PASSWORD_IS_OLD',
                status: 400,
                success: false
            },
            SUCCESS: {
                name: 'PASSWORD_RESET_SENT',
                status: 200,
                success: true
            }
        }
    },

    RESOURCE: {
        LOADED: {
            name: 'RESOURCE_LOADED',
            status: 200,
            success: true
        }
    },

    CONFIG: {
        WRONG_CONFIG_STRUCTURE: {
            name: 'WRONG_WORKER_CONFIG_STRUCTURE',
            status: 500,
            success: true
        },
        CONFIG_MISSING: {
            name: 'WORKER_CONFIG_MISSING',
            status: 500,
            success: true
        }
    }

};