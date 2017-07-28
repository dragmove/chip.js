let not = function not(func) {
  return function (object) {
    return !func(object);
  };
};

let existy = function existy(obj) {
  return obj != null;
};

let isDefined = function isDefined(obj) {
  let flag = true;
  if (obj === null || typeof obj === 'undefined') return false;
  return flag;
};

let isNotDefined = not(isDefined);

let isNumber = function isNumber(obj) {
  if (!isDefined(obj)) return false;
  return (obj.constructor === Number);
};

let isInteger = function (obj) {
  if (!isNumber(obj)) return false;

  // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
  return (isFinite(obj) && Math.floor(obj) === obj);
};

let isString = function isString(obj) {
  if (!isDefined(obj)) return false;
  return (obj.constructor === String);
};

let isObject = function isObject(obj) {
  if (!isDefined(obj)) return false;
  return (obj.constructor === Object);
};

let isFunction = function isFunction(obj) {
  if (!isDefined(obj)) return false;
  return (obj.constructor === Function);
};

let isExistJQueryEle = function isExistJQueryEle($ele) {
  return !(!$ele || $ele.length <= 0);
};

let each = function each(dataCanLoop, func, context) {
  if (!(Array.isArray(dataCanLoop) || isString(dataCanLoop))) throw new TypeError('dataCanLoop parameter type of each() must be Array or String.');

  var _context = (existy(context)) ? context : null;

  for (var i = 0, max = dataCanLoop.length; i < max; i++) {
    func.call(_context, dataCanLoop[i]);
  }
};

let allOf = function allOf(/*args*/) {
  let args = Array.prototype.slice.call(arguments);

  return args.every(function(val) {
    return (val === true);
  });
};

let anyOf = function anyOf(/*args*/) {
  let args = Array.prototype.slice.call(arguments);

  return args.some(function(val) {
    return (val === true);
  });
};

let truthy = function truthy(object) {
  return !!object;
};

let nth = function nth(dataCanLoop, index) {
  if (!(Array.isArray(dataCanLoop) || isString(dataCanLoop))) {
    throw new TypeError('dataCanLoop parameter type of nth() must be Array or String.');
  }

  if (!isInteger(index)) throw new TypeError('index parameter type of nth() must be Integer Number.');

  return (index < 0 || index > dataCanLoop.length - 1) ? null : dataCanLoop[index];
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

let lazyChain = function lazyChain(obj) {
  var calls = [];

  return {
    invoke: function (methodName /*, args */) {
      var args = rest(Array.prototype.slice.call(arguments));

      calls.push(function (target) {
        var method = target[methodName];

        if (!isDefined(method)) {
          throw Error(target.constructor.name + ' has not ' + methodName + ' method');
        }

        return method.apply(target, args);
      });

      return this;
    },

    force: function () {
      return calls.reduce(function (ret, thunk) {
        return thunk(ret);
      }, obj);
    }
  };
};

let singleEle = function singleEle($ele) {
  return $ele.length === 1;
};

let notSingleEle = not(singleEle);

export {
  not,
  existy,
  isDefined,
  isNotDefined,
  isNumber,
  isString,
  isObject,
  isFunction,
  isExistJQueryEle,
  each,
  allOf,
  anyOf,
  truthy,
  nth,
  best,
  rest,
  pipeline,
  lazyChain,
  singleEle,
  notSingleEle
};