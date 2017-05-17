const camelCase = require('camelcase');
const isPlainObject = require('is-plain-object');

const camelizeObject = (data, exceps) => {
  if (Array.isArray(data)) return data.map(item => camelizeObject(item));
  if (!isPlainObject(data)) return data;

  return Object.keys(data).reduce((result, key) => {
    const newKey = isException(key, exceps || []) ? key : camelCase(key);
    if (isPlainObject(data[key])) return camelDeepObject(newKey, result, data[key], exceps);
    if (Array.isArray(data[key])) return camelArray(newKey, result, data[key], exceps);
    return camelPropery(newKey, result, data[key]);
  }, {});
};

const isException = (key, exceps) => exceps.indexOf(key) > -1;

const camelDeepObject = (newKey, result, data, exceps) => {
  const func = () => camelizeObject(data, exceps);
  return applyOnResult(newKey, result, func);
};

const camelArray = (newKey, result, dataArr, exceps) => {
  const func = () => dataArr.map(item => camelizeObject(item, exceps));
  return applyOnResult(newKey, result, func);
};

const camelPropery = (newKey, result, data) => {
  const func = () => data;
  return applyOnResult(newKey, result, func);
};

const applyOnResult = (newKey, result, func) => {
  const partial = {};
  partial[newKey] = func();
  return Object.assign({}, result, partial);
};

module.exports = camelizeObject;
