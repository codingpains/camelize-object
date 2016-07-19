const camelCase = require('camelcase');
const isPlainObject = require('is-plain-object');

const camelizeObject = (data) => {
  if (!isPlainObject(data)) return;
  return Object.keys(data).reduce((result, key) => {
    if (isPlainObject(data[key])) {
      result[key] = camelizeObject(data[key]);
    } else if (Array.isArray(data[key])) {
      result[key] = data[key].map(camelizeObject);
    } else {
      result[camelCase(key)] = data[key];
    }
    return result;
  }, {});
};

module.exports = camelizeObject;
