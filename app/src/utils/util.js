let isDefined = function (obj) {
  let flag = true;
  if (obj === null || typeof obj === 'undefined') return false;
  return flag;
};

let isString = function (obj) {
  if (!isDefined(obj)) return false;
  return (obj.constructor === String);
};

let isArray = function (obj) {
  if (!isDefined(obj)) return false;
  return (obj.constructor === Array);
};

let isFunction = function (obj) {
  if (!isDefined(obj)) return false;
  return (obj.constructor === Function);
};

let isExistJQueryObj = function (obj) {
  return !(!obj || obj.length <= 0);
};

let not = function not(func) {
  return function (object) {
    return !func(object);
  };
};

export {
  isDefined,
  isString,
  isArray,
  isFunction,
  isExistJQueryObj,
  not
};