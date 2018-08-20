exports.duplicate = function (name) {
    return `Duplicate value in '${formatName(name)}' field.`;
};

exports.invalid = function (name) {
    return `The provided ${formatName(name)} is not valid.`
};

exports.notFound = function (name) {
    return `The specified ${formatName(name)} was not found.`;
};

exports.multipleNotFound = function (name) {
    return `No ${formatName(name)} was found.`;
};

exports.missing = function (name) {
    return `${formatName(name)} is missing.`;
};

exports.required = function (name) {
    return `${formatName(name)} is required.`;
};

exports.fail = function (name) {
    return `${formatName(name)} failed.`;
};

exports.success = function (name) {
    return `${formatName(name)} was successful.`;
};

exports.create = function (name) {
    return `${formatName(name)} has been created successfully.`
};

exports.update = function (name) {
    return `${formatName(name)} has been updated successfully.`
};

exports.delete = function (name) {
    return `${formatName(name)} has been deleted successfully.`
};

function formatName(name) {
    return name.split("_").filter(x => x !== "_").join(" ").replace(/\b\w/g, l => l.toUpperCase());
}