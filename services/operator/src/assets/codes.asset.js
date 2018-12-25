const codeGenerator = require('northernstars-shared').baseCodeGenerator;
const schemaFields = require('northernstars-shared').schemaFields;

module.exports = {

    USER: {
        DUPLICATE: codeGenerator.duplicate('user'),
        REQUIRED: codeGenerator.required('user'),
        MISSING: codeGenerator.missing('user'),
        INVALID: codeGenerator.invalid('user'),
        NOT_FOUND: codeGenerator.notFound('user'),
        NULL_FOUND: codeGenerator.multipleNotFound('user'),

        DELETED: codeGenerator.delete('user'),
        UPDATED: codeGenerator.update('user'),
        CREATED: codeGenerator.create('user')
    },

    NUMBER: {
        DUPLICATE: codeGenerator.delete('jersey_number'),
        REQUIRED: codeGenerator.required('jersey_number'),
        MISSING: codeGenerator.missing('jersey_number'),
        INVALID: codeGenerator.invalid('jersey_number'),
        NOT_FOUND: codeGenerator.notFound('jersey_number'),
        NULL_FOUND: codeGenerator.multipleNotFound('jersey_number'),
        MIN: {
            name: 'JERSEY_NUMBER_MIN',
            message: `Minimal accepted value for Jersey Number is ${schemaFields.NUMBER.MIN}`,
            status: 422,
            success: false
        },
        MAX: {
            name: 'JERSEY_NUMBER_MAX',
            message: `Maximum accepted value for Jersey Number is ${schemaFields.NUMBER.MAX}`,
            status: 422,
            success: false
        },
        IN_USE: {
            name: 'NUMBER_IN_USE',
            message: 'This number is already in use.',
            status: 422,
            success: false
        },
    },

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
        UNIQUE: codeGenerator.unique('username'),
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

    TEAM: {
        MISSING: codeGenerator.missing('team'),
        REQUIRED: codeGenerator.missing('team'),
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
        MIN_LENGTH: codeGenerator.minLength('password', schemaFields.PASSWORD.MIN_LENGTH),
        MAX_LENGTH: codeGenerator.maxLength('password', schemaFields.PASSWORD.MAX_LENGTH),

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
            NULL_FOUND: codeGenerator.multipleNotFound('request'),
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
            SUCCESS: codeGenerator.success('registration_request'),
        },
        INVITATION: {
            SENT: {
                name: 'REGISTRATION_INVITATION_SENT',
                status: 200,
                success: true,
            },
            MISSING_EMAILS: codeGenerator.missing('invitation_emails')
        }
    }

};