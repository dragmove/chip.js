let isDefined = function (obj) {
  let flag = true;
  if (obj === null || typeof obj === 'undefined') return false;
  return flag;
};

let isFunction = function (obj) {
  if (!isDefined(obj)) return false;
  return (obj.constructor === Function);
};

export {
  isDefined,
  isFunction
};