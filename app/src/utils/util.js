let existy = function existy(obj) {
  return obj != null;
};

let isDefined = function (obj) {
  let flag = true;
  if (obj === null || typeof obj === 'undefined') return false;
  return flag;
};

let isString = function (obj) {
  if (!isDefined(obj)) return false;
  return (obj.constructor === String);
};

let isFunction = function (obj) {
  if (!isDefined(obj)) return false;
  return (obj.constructor === Function);
};

let isExistJQueryEle = function ($ele) {
  return !(!$ele || $ele.length <= 0);
};

let not = function not(func) {
  return function (object) {
    return !func(object);
  };
};

let each = function each(dataCanLoop, func, context) {
  if (!(Array.isArray(dataCanLoop) || isString(dataCanLoop))) throw new TypeError('dataCanLoop parameter type of each() must be Array or String.');

  var _context = (existy(context)) ? context : null;

  for (var i = 0, max = dataCanLoop.length; i < max; i++) {
    func.call(_context, dataCanLoop[i]);
  }
};

let best = function best(conditionFunc, array) {
  if (!isFunction(conditionFunc)) throw new TypeError('conditionFunc parameter type of best() must be Function.');
  if (!Array.isArray(array)) throw new TypeError('array parameter type of best() must be Array.');

  return array.reduce(function (previousValue, currentValue) {
    return conditionFunc(previousValue, currentValue) ? previousValue : currentValue;
  });
};

let rest = function rest(array, beginIndex) {
  if (!Array.isArray(array)) throw new TypeError('array parameter type of rest() must be Array.');

  var begin = (!existy(beginIndex)) ? 1 : beginIndex;
  return Array.prototype.slice.call(array, begin);
};

let pipeline = function pipeline(seed /* args */) {
  var restArgs = rest(Array.prototype.slice.call(arguments));

  return restArgs.reduce(function (prev, current) {
    return current(prev);
  }, seed);
};

let notSingleEle = not(function ($ele) {
  return $ele.length === 1;
});

export {
  existy,
  isDefined,
  isString,
  isFunction,
  isExistJQueryEle,
  not,
  each,
  best,
  rest,
  pipeline,
  notSingleEle
};