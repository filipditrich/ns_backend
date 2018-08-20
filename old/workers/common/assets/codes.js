module.exports = {

    PLACE: {
        DUPLICATE: duplicate('place'),
        NOT_FOUND: notFound('place'),
        NULL_FOUND: multipleNotFound('place'),
        MISSING: missing('place'),
        NAME: {
            MISSING: missing('place_name')
        },

        UPDATED: CRUD('place', 'update', true),
        DELETED: CRUD('place', 'delete', true),
        CREATED: CRUD('place', 'create', true),

    },

    TEAM: {
        DUPLICATE: duplicate('team'),
        NOT_FOUND: notFound('team'),
        NULL_FOUND: multipleNotFound('team'),
        MISSING: missing('team'),
        NAME: {
            MISSING: missing('team_name')
        },
        JERSEY: {
            MISSING: missing('team_jersey')
        },

        UPDATED: CRUD('team', 'update', true),
        DELETED: CRUD('team', 'delete', true),
        CREATED: CRUD('team', 'create', true),
    },

    JERSEY: {
        DUPLICATE: duplicate('jersey'),
        NOT_FOUND: notFound('jersey'),
        NULL_FOUND: multipleNotFound('jersey'),
        MISSING: missing('jersey'),
        NAME: {
            MISSING: missing('jersey_name')
        },

        UPDATED: CRUD('jersey', 'update', true),
        DELETED: CRUD('jersey', 'delete', true),
        CREATED: CRUD('jersey', 'create', true),
    },

    MATCH: {
        DUPLICATE: duplicate('match'),
        NOT_FOUND: notFound('match'),
        NULL_FOUND: multipleNotFound('match'),
        MISSING: missing('match'),

        DATE: {
            DUPLICATE: duplicate('match_date'),
            DUPLICATE_ADVISABLE: {
              name: 'MATCH_DATE_DUPLICATE_BUT_ADVISABLE',
              status: 200,
              success: false
            },
            MISSING: missing('match_date')
        },
        TITLE: {
            MISSING: missing('match_title')
        },

        UPDATED: CRUD('match', 'update', true),
        DELETED: CRUD('match', 'delete', true),
        CREATED: CRUD('match', 'create', true),
    }

};

function duplicate(field) {
    field = field.toUpperCase();

    return {
        name: `${field}_DUPLICATE`,
        status: 400,
        success: false
    }
}
function notFound(field) {
    field = field.toUpperCase();

    return {
        name: `${field}_NOT_FOUND`,
        status: 404,
        success: false
    }
}
function multipleNotFound(field) {
    field = field.toUpperCase();

    return {
        name: `NO_${field.toUpperCase()}S_FOUND`,
        status: 404,
        success: false
    }
}
function missing(field) {
    field = field.toUpperCase();

    return {
        name: `${field}_MISSING`,
        status: 400,
        success: false
    }
}
function CRUD(field, crud, success) {
    const res = success ? 'OK' : 'FAIL';
    const status = success ? 200 : 400;
    return {
        name: `${field.toUpperCase()}_${crud.toUpperCase()}_${res.toUpperCase()}`,
        status: status,
        success: success
    }
}