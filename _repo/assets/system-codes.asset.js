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
        success: false,
        at: 'UNDEFINED'
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
        },
        NOT_GATEWAY: {
            name: 'API_REQUEST_OUTSIDE_GATEWAY',
            message: 'The request has been made out of the API Gateway.',
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
    },

    HEADERS: {
        BAD_STRUCT: {
            name: 'BAD_HEADERS_STRUCTURE',
            message: 'Wrong headers structure in request',
            status: 400,
            success: false
        }
    },

    SERVICE: {
        NOT_FOUND: {
            name: 'SERVICE_NOT_FOUND',
            message: 'The requested service has not been found.',
            status: 404,
            success: false
        },
        BAD_SYS_ROUTE_CONF: {
            name: 'SERVICE_BAD_SYS_ROUTE_CONF',
            message: 'Wrong system route configuration provided. Please contact administrator.',
            status: 500,
            success: false
        },
        UNREACHABLE: {
            name: 'SERVICE_UNREACHABLE',
            message: 'Service server is currently unreachable.',
            status: 500,
            success: false
        }
    },

    RESOURCE: {
        LOADED: {
            name: 'RESOURCE_LOADED',
            status: 200,
            success: true
        }
    },

    REQUEST: {
        VALID: {
            name: 'REQUEST_VALID',
            message: 'Request is valid.',
            status: 200,
            success: true
        },
        INVALID: {
            name: 'REQUEST_INVALID',
            message: 'This request is invalid.',
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
    }

};