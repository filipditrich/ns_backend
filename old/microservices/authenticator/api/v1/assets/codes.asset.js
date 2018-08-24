const codeGenerator = require('../../../../../_repo/helpers/generators/generic-code.generator');
const schemaFields = require('../../../../../_repo/assets/schema-fields.asset');

module.exports = {

    NAME: {
        DUPLICATE: codeGenerator.duplicate('name'),
        REQUIRED: codeGenerator.required('name'),
        MISSING: codeGenerator.missing('name'),
        INVALID: codeGenerator.invalid('name'),
        NOT_FOUND: codeGenerator.notFound('name'),
        NULL_FOUND: codeGenerator.multipleNotFound('name')
    },

    USERNAME: {
        DUPLICATE: codeGenerator.duplicate('username'),
        REQUIRED: codeGenerator.required('username'),
        MISSING: codeGenerator.missing('username'),
        INVALID: codeGenerator.invalid('username'),
        NOT_FOUND: codeGenerator.notFound('username'),
        NULL_FOUND: codeGenerator.multipleNotFound('username'),
        IN_USE: {
            name: 'USERNAME_IN_USE',
            message: 'This username is already in use.',
            status: 422,
            success: false
        },
        NOT_MATCH: {
            name: 'USERNAME_MISMATCH',
            message: 'This username does not match any account.',
            status: 401,
            success: false
        }
    },

    EMAIL: {
        DUPLICATE: codeGenerator.duplicate('email'),
        REQUIRED: codeGenerator.required('email'),
        MISSING: codeGenerator.missing('email'),
        INVALID: codeGenerator.invalid('email'),
        NOT_FOUND: codeGenerator.notFound('email'),
        NULL_FOUND: codeGenerator.multipleNotFound('email'),
        IN_USE: {
            name: 'EMAIL_IN_USE',
            message: 'This email is already in use.',
            status: 422,
            success: false
        },
        ALREADY_REQUESTED: {
            name: 'EMAIL_ALREADY_REQUESTED',
            message: 'A registration request has already been made with this email address.',
            status: 400,
            success: false
        }
    },

    PASSWORD: {
        DUPLICATE: codeGenerator.duplicate('password'),
        REQUIRED: codeGenerator.required('password'),
        MISSING: codeGenerator.missing('password'),
        INVALID: codeGenerator.invalid('password'),
        NOT_FOUND: codeGenerator.notFound('password'),
        NULL_FOUND: codeGenerator.multipleNotFound('password'),

        MIN_LENGTH: {
            name: 'PASSWORD_TOO_SHORT',
            message: `Password must be at least ${schemaFields.PASSWORD.MIN_LENGTH} characters long.`,
            status: 422,
            success: false
        },
        MAX_LENGTH: {
            name: 'PASSWORD_TOO_LONG',
            message: `Password length exceeded. Password can be only ${schemaFields.PASSWORD.MAX_LENGTH} characters long.`,
            status: 422,
            success: false
        },
        WEAK: {
            name: 'PASSWORD_TOO_WEAK',
            message: 'This password is too weak. Password must contain one digit, one lowercase and one uppercase character.',
            status: 422,
            success: false
        },
        NOT_MATCH: {
            name: 'PASSWORD_MISMATCH',
            message: 'This password is invalid.',
            status: 401,
            success: false
        }
    },

    LOGIN: {

        SUCCESS: codeGenerator.success('login'),
        FAIL: codeGenerator.fail('login', 401),
        INCOMPLETE_REQUEST: {
            name: 'INCOMPLETE_LOGIN_REQUEST',
            status: 422,
            success: false
        }


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
            NOT_FOUND: codeGenerator.notFound('user')
        },
        ALREADY_MADE: {
            name: 'RESET_REQUEST_ALREADY_MADE',
            status: 400,
            success: false
        },
        NOT_FOUND: codeGenerator.notFound('reset_request'),
        SAME_PASSWORD: {
            name: 'NEW_PASSWORD_IS_OLD',
            status: 400,
            success: false
        },
        SUCCESS: codeGenerator.success('password_reset')
    },

    REGISTRATION: {
        SUCCESS: codeGenerator.success('registration'),
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
            },
            SUCCESS: codeGenerator.success('registration_request')
        }
    }

};