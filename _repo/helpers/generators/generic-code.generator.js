const messageGenerator = require('./generic-message.generator');

exports.duplicate = function(field) {
    return {
        name: `${field.toUpperCase()}_DUPLICATE`,
        message: messageGenerator.duplicate(field),
        status: 400,
        success: false
    }
};

exports.invalid = function(field) {
    return {
        name: `${field.toUpperCase()}_INVALID`,
        message: messageGenerator.invalid(field),
        status: 422,
        success: false
    }
};

exports.notFound = function(field) {
    return {
        name: `${field.toUpperCase()}_NOT_FOUND`,
        message: messageGenerator.notFound(field),
        status: 404,
        success: false
    }
};

exports.multipleNotFound = function(field) {
    return {
        name: `NO_${field.toUpperCase()}S_FOUND`,
        message: messageGenerator.multipleNotFound(field),
        status: 404,
        success: false
    }
};

exports.missing = function(field) {
    return {
        name: `${field.toUpperCase()}_MISSING`,
        message: messageGenerator.missing(field),
        status: 400,
        success: false
    }
};

exports.required = function(field) {
    return {
        name: `${field.toUpperCase()}_REQUIRED`,
        message: messageGenerator.required(field),
        status: 400,
        success: false
    }
};

exports.fail = function(field, status = 400) {
    return {
        name: `${field.toUpperCase()}_FAILED`,
        message: messageGenerator.fail(field),
        status: status,
        success: false
    }
};

exports.success = function(field) {
    return {
        name: `${field.toUpperCase()}_SUCCESSFUL`,
        message: messageGenerator.success(field),
        status: 200,
        success: true
    }
};

exports.create = function (field) {
    return {
        name: `${field.toUpperCase()}_CREATE_OK`,
        message: messageGenerator.create(field),
        status: 200,
        success: true
    }
};

exports.update = function (field) {
    return {
        name: `${field.toUpperCase()}_UPDATE_OK`,
        message: messageGenerator.update(field),
        status: 200,
        success: true
    }
};

exports.delete = function (field) {
    return {
        name: `${field.toUpperCase()}_DELETE_OK`,
        message: messageGenerator.delete(field),
        status: 200,
        success: true
    }
};