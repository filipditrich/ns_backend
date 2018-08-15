module.exports = {

    PLACE: {
        REQUIRED: required('place')
    },

    MATCH: {
        TITLE: {
            REQUIRED: required('match title')
        },
        DATE: {
            REQUIRED: required('match date')
        }
    },

    JERSEY: {
        NAME: {
            REQUIRED: required('jersey name'),
            UNIQUE: unique('jersey name')
        }
    },

    TEAM: {
        NAME: {
            REQUIRED: required('team name'),
            UNIQUE: unique('team name')
        },
        JERSEY: {
            REQUIRED: required('team jersey')
        }
    }

};

function required(field) {
    return `${field.replace(/\b\w/g, l => l.toUpperCase())} is required.`
}

function unique(field) {
    return `${field.replace(/\b\w/g, l => l.toUpperCase())} must be unique.`
}