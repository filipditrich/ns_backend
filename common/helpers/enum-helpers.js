exports.toArray = function (enums) {
  return Object.keys(enums).map(function (item) { return enums[item].key });
};