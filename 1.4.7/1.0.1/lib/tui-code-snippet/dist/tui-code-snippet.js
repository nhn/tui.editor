/*!
 * tui-code-snippet.js
 * @version 1.2.9
 * @author NHNEnt FE Development Lab <dl_javascript@nhnent.com>
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["util"] = factory();
	else
		root["tui"] = root["tui"] || {}, root["tui"]["util"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @fileoverview
	 * @author NHN Ent.
	 *         FE Development Lab <dl_javascript@nhnent.com>
	 * @namespace tui.util
	 * @example
	 * // node, commonjs
	 * var util = require('tui-code-snippet');
	 * @example
	 * // distribution file, script
	 * <script src='path-to/tui-code-snippt.js'></script>
	 * <script>
	 * var util = tui.util;
	 * <script>
	 */
	var util = {};
	var object = __webpack_require__(1);
	var extend = object.extend;

	extend(util, object);
	extend(util, __webpack_require__(3));
	extend(util, __webpack_require__(2));
	extend(util, __webpack_require__(4));
	extend(util, __webpack_require__(5));
	extend(util, __webpack_require__(6));
	extend(util, __webpack_require__(7));
	extend(util, __webpack_require__(8));

	util.browser = __webpack_require__(9);
	util.popup = __webpack_require__(10);
	util.formatDate = __webpack_require__(11);
	util.defineClass = __webpack_require__(12);
	util.defineModule = __webpack_require__(13);
	util.defineNamespace = __webpack_require__(14);
	util.CustomEvents = __webpack_require__(15);
	util.Enum = __webpack_require__(16);
	util.ExMap = __webpack_require__(17);
	util.HashMap = __webpack_require__(19);
	util.Map = __webpack_require__(18);

	module.exports = util;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview This module has some functions for handling a plain object, json.
	 * @author NHN Ent.
	 *         FE Development Lab <dl_javascript@nhnent.com>
	 */

	'use strict';

	var type = __webpack_require__(2);
	var array = __webpack_require__(3);

	/**
	 * The last id of stamp
	 * @type {number}
	 * @private
	 */
	var lastId = 0;

	/**
	 * Extend the target object from other objects.
	 * @param {object} target - Object that will be extended
	 * @param {...object} objects - Objects as sources
	 * @returns {object} Extended object
	 * @memberof tui.util
	 */
	function extend(target, objects) { // eslint-disable-line no-unused-vars
	    var hasOwnProp = Object.prototype.hasOwnProperty;
	    var source, prop, i, len;

	    for (i = 1, len = arguments.length; i < len; i += 1) {
	        source = arguments[i];
	        for (prop in source) {
	            if (hasOwnProp.call(source, prop)) {
	                target[prop] = source[prop];
	            }
	        }
	    }

	    return target;
	}

	/**
	 * Assign a unique id to an object
	 * @param {object} obj - Object that will be assigned id.
	 * @returns {number} Stamped id
	 * @memberof tui.util
	 */
	function stamp(obj) {
	    if (!obj.__fe_id) {
	        lastId += 1;
	        obj.__fe_id = lastId; // eslint-disable-line camelcase
	    }

	    return obj.__fe_id;
	}

	/**
	 * Verify whether an object has a stamped id or not.
	 * @param {object} obj - adjusted object
	 * @returns {boolean}
	 * @memberof tui.util
	 */
	function hasStamp(obj) {
	    return type.isExisty(pick(obj, '__fe_id'));
	}

	/**
	 * Reset the last id of stamp
	 * @private
	 */
	function resetLastId() {
	    lastId = 0;
	}

	/**
	 * Return a key-list(array) of a given object
	 * @param {object} obj - Object from which a key-list will be extracted
	 * @returns {Array} A key-list(array)
	 * @memberof tui.util
	 */
	function keys(obj) {
	    var keyArray = [];
	    var key;

	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) {
	            keyArray.push(key);
	        }
	    }

	    return keyArray;
	}

	/**
	 * Return the equality for multiple objects(jsonObjects).<br>
	 *  See {@link http://stackoverflow.com/questions/1068834/object-comparison-in-javascript}
	 * @param {...object} object - Multiple objects for comparing.
	 * @returns {boolean} Equality
	 * @memberof tui.util
	 * @example
	 * //-- #1. Get Module --//
	 * var util = require('tui-code-snippet'); // node, commonjs
	 * var util = tui.util; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var jsonObj1 = {name:'milk', price: 1000};
	 * var jsonObj2 = {name:'milk', price: 1000};
	 * var jsonObj3 = {name:'milk', price: 1000};
	 * util.compareJSON(jsonObj1, jsonObj2, jsonObj3);   // true
	 *
	 * var jsonObj4 = {name:'milk', price: 1000};
	 * var jsonObj5 = {name:'beer', price: 3000};
	 * util.compareJSON(jsonObj4, jsonObj5); // false
	 */
	function compareJSON(object) {
	    var argsLen = arguments.length;
	    var i = 1;

	    if (argsLen < 1) {
	        return true;
	    }

	    for (; i < argsLen; i += 1) {
	        if (!isSameObject(object, arguments[i])) {
	            return false;
	        }
	    }

	    return true;
	}

	/**
	 * @param {*} x - object to compare
	 * @param {*} y - object to compare
	 * @returns {boolean} - whether object x and y is same or not
	 * @private
	 */
	function isSameObject(x, y) { // eslint-disable-line complexity
	    var leftChain = [];
	    var rightChain = [];
	    var p;

	    // remember that NaN === NaN returns false
	    // and isNaN(undefined) returns true
	    if (isNaN(x) &&
	        isNaN(y) &&
	        type.isNumber(x) &&
	        type.isNumber(y)) {
	        return true;
	    }

	    // Compare primitives and functions.
	    // Check if both arguments link to the same object.
	    // Especially useful on step when comparing prototypes
	    if (x === y) {
	        return true;
	    }

	    // Works in case when functions are created in constructor.
	    // Comparing dates is a common scenario. Another built-ins?
	    // We can even handle functions passed across iframes
	    if ((type.isFunction(x) && type.isFunction(y)) ||
	        (x instanceof Date && y instanceof Date) ||
	        (x instanceof RegExp && y instanceof RegExp) ||
	        (x instanceof String && y instanceof String) ||
	        (x instanceof Number && y instanceof Number)) {
	        return x.toString() === y.toString();
	    }

	    // At last checking prototypes as good a we can
	    if (!(x instanceof Object && y instanceof Object)) {
	        return false;
	    }

	    if (x.isPrototypeOf(y) ||
	        y.isPrototypeOf(x) ||
	        x.constructor !== y.constructor ||
	        x.prototype !== y.prototype) {
	        return false;
	    }

	    // check for infinitive linking loops
	    if (array.inArray(x, leftChain) > -1 ||
	        array.inArray(y, rightChain) > -1) {
	        return false;
	    }

	    // Quick checking of one object beeing a subset of another.
	    for (p in y) {
	        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
	            return false;
	        } else if (typeof y[p] !== typeof x[p]) {
	            return false;
	        }
	    }

	    // This for loop executes comparing with hasOwnProperty() and typeof for each property in 'x' object,
	    // and verifying equality for x[property] and y[property].
	    for (p in x) {
	        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
	            return false;
	        } else if (typeof y[p] !== typeof x[p]) {
	            return false;
	        }

	        if (typeof (x[p]) === 'object' || typeof (x[p]) === 'function') {
	            leftChain.push(x);
	            rightChain.push(y);

	            if (!isSameObject(x[p], y[p])) {
	                return false;
	            }

	            leftChain.pop();
	            rightChain.pop();
	        } else if (x[p] !== y[p]) {
	            return false;
	        }
	    }

	    return true;
	}
	/* eslint-enable complexity */

	/**
	 * Retrieve a nested item from the given object/array
	 * @param {object|Array} obj - Object for retrieving
	 * @param {...string|number} paths - Paths of property
	 * @returns {*} Value
	 * @memberof tui.util
	 * @example
	 * //-- #1. Get Module --//
	 * var util = require('tui-code-snippet'); // node, commonjs
	 * var util = tui.util; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var obj = {
	 *     'key1': 1,
	 *     'nested' : {
	 *         'key1': 11,
	 *         'nested': {
	 *             'key1': 21
	 *         }
	 *     }
	 * };
	 * util.pick(obj, 'nested', 'nested', 'key1'); // 21
	 * util.pick(obj, 'nested', 'nested', 'key2'); // undefined
	 *
	 * var arr = ['a', 'b', 'c'];
	 * util.pick(arr, 1); // 'b'
	 */
	function pick(obj, paths) { // eslint-disable-line no-unused-vars
	    var args = arguments;
	    var target = args[0];
	    var i = 1;
	    var length = args.length;

	    for (; i < length; i += 1) {
	        if (type.isUndefined(target) ||
	            type.isNull(target)) {
	            return;
	        }

	        target = target[args[i]];
	    }

	    return target; // eslint-disable-line consistent-return
	}

	module.exports = {
	    extend: extend,
	    stamp: stamp,
	    hasStamp: hasStamp,
	    resetLastId: resetLastId,
	    keys: Object.prototype.keys || keys,
	    compareJSON: compareJSON,
	    pick: pick
	};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	/**
	 * @fileoverview This module provides some functions to check the type of variable
	 * @author NHN Ent.
	 *         FE Development Lab <dl_javascript@nhnent.com>
	 */

	'use strict';

	var toString = Object.prototype.toString;

	/**
	 * Check whether the given variable is existing or not.<br>
	 *  If the given variable is not null and not undefined, returns true.
	 * @param {*} param - Target for checking
	 * @returns {boolean} Is existy?
	 * @memberof tui.util
	 * @example
	 * //-- #1. Get Module --//
	 * var util = require('tui-code-snippet'); // node, commonjs
	 * var util = tui.util; // distribution file
	 *
	 * //-- #2. Use property --//
	 * util.isExisty(''); //true
	 * util.isExisty(0); //true
	 * util.isExisty([]); //true
	 * util.isExisty({}); //true
	 * util.isExisty(null); //false
	 * util.isExisty(undefined); //false
	*/
	function isExisty(param) {
	    return !isUndefined(param) && !isNull(param);
	}

	/**
	 * Check whether the given variable is undefined or not.<br>
	 *  If the given variable is undefined, returns true.
	 * @param {*} obj - Target for checking
	 * @returns {boolean} Is undefined?
	 * @memberof tui.util
	 */
	function isUndefined(obj) {
	    return obj === undefined; // eslint-disable-line no-undefined
	}

	/**
	 * Check whether the given variable is null or not.<br>
	 *  If the given variable(arguments[0]) is null, returns true.
	 * @param {*} obj - Target for checking
	 * @returns {boolean} Is null?
	 * @memberof tui.util
	 */
	function isNull(obj) {
	    return obj === null;
	}

	/**
	 * Check whether the given variable is truthy or not.<br>
	 *  If the given variable is not null or not undefined or not false, returns true.<br>
	 *  (It regards 0 as true)
	 * @param {*} obj - Target for checking
	 * @returns {boolean} Is truthy?
	 * @memberof tui.util
	 */
	function isTruthy(obj) {
	    return isExisty(obj) && obj !== false;
	}

	/**
	 * Check whether the given variable is falsy or not.<br>
	 *  If the given variable is null or undefined or false, returns true.
	 * @param {*} obj - Target for checking
	 * @returns {boolean} Is falsy?
	 * @memberof tui.util
	 */
	function isFalsy(obj) {
	    return !isTruthy(obj);
	}

	/**
	 * Check whether the given variable is an arguments object or not.<br>
	 *  If the given variable is an arguments object, return true.
	 * @param {*} obj - Target for checking
	 * @returns {boolean} Is arguments?
	 * @memberof tui.util
	 */
	function isArguments(obj) {
	    var result = isExisty(obj) &&
	        ((toString.call(obj) === '[object Arguments]') || !!obj.callee);

	    return result;
	}

	/**
	 * Check whether the given variable is an instance of Array or not.<br>
	 *  If the given variable is an instance of Array, return true.
	 * @param {*} obj - Target for checking
	 * @returns {boolean} Is array instance?
	 * @memberof tui.util
	 */
	function isArray(obj) {
	    return obj instanceof Array;
	}

	/**
	 * Check whether the given variable is an object or not.<br>
	 *  If the given variable is an object, return true.
	 * @param {*} obj - Target for checking
	 * @returns {boolean} Is object?
	 * @memberof tui.util
	 */
	function isObject(obj) {
	    return obj === Object(obj);
	}

	/**
	 * Check whether the given variable is a function or not.<br>
	 *  If the given variable is a function, return true.
	 * @param {*} obj - Target for checking
	 * @returns {boolean} Is function?
	 * @memberof tui.util
	 */
	function isFunction(obj) {
	    return obj instanceof Function;
	}

	/**
	 * Check whether the given variable is a number or not.<br>
	 *  If the given variable is a number, return true.
	 * @param {*} obj - Target for checking
	 * @returns {boolean} Is number?
	 * @memberof tui.util
	 */
	function isNumber(obj) {
	    return typeof obj === 'number' || obj instanceof Number;
	}

	/**
	 * Check whether the given variable is a string or not.<br>
	 *  If the given variable is a string, return true.
	 * @param {*} obj - Target for checking
	 * @returns {boolean} Is string?
	 * @memberof tui.util
	 */
	function isString(obj) {
	    return typeof obj === 'string' || obj instanceof String;
	}

	/**
	 * Check whether the given variable is a boolean or not.<br>
	 *  If the given variable is a boolean, return true.
	 * @param {*} obj - Target for checking
	 * @returns {boolean} Is boolean?
	 * @memberof tui.util
	 */
	function isBoolean(obj) {
	    return typeof obj === 'boolean' || obj instanceof Boolean;
	}

	/**
	 * Check whether the given variable is an instance of Array or not.<br>
	 *  If the given variable is an instance of Array, return true.<br>
	 *  (It is used for multiple frame environments)
	 * @param {*} obj - Target for checking
	 * @returns {boolean} Is an instance of array?
	 * @memberof tui.util
	 */
	function isArraySafe(obj) {
	    return toString.call(obj) === '[object Array]';
	}

	/**
	 * Check whether the given variable is a function or not.<br>
	 *  If the given variable is a function, return true.<br>
	 *  (It is used for multiple frame environments)
	 * @param {*} obj - Target for checking
	 * @returns {boolean} Is a function?
	 * @memberof tui.util
	 */
	function isFunctionSafe(obj) {
	    return toString.call(obj) === '[object Function]';
	}

	/**
	 * Check whether the given variable is a number or not.<br>
	 *  If the given variable is a number, return true.<br>
	 *  (It is used for multiple frame environments)
	 * @param {*} obj - Target for checking
	 * @returns {boolean} Is a number?
	 * @memberof tui.util
	 */
	function isNumberSafe(obj) {
	    return toString.call(obj) === '[object Number]';
	}

	/**
	 * Check whether the given variable is a string or not.<br>
	 *  If the given variable is a string, return true.<br>
	 *  (It is used for multiple frame environments)
	 * @param {*} obj - Target for checking
	 * @returns {boolean} Is a string?
	 * @memberof tui.util
	 */
	function isStringSafe(obj) {
	    return toString.call(obj) === '[object String]';
	}

	/**
	 * Check whether the given variable is a boolean or not.<br>
	 *  If the given variable is a boolean, return true.<br>
	 *  (It is used for multiple frame environments)
	 * @param {*} obj - Target for checking
	 * @returns {boolean} Is a boolean?
	 * @memberof tui.util
	 */
	function isBooleanSafe(obj) {
	    return toString.call(obj) === '[object Boolean]';
	}

	/**
	 * Check whether the given variable is a instance of HTMLNode or not.<br>
	 *  If the given variables is a instance of HTMLNode, return true.
	 * @param {*} html - Target for checking
	 * @returns {boolean} Is HTMLNode ?
	 * @memberof tui.util
	 */
	function isHTMLNode(html) {
	    if (typeof HTMLElement === 'object') {
	        return (html && (html instanceof HTMLElement || !!html.nodeType));
	    }

	    return !!(html && html.nodeType);
	}

	/**
	 * Check whether the given variable is a HTML tag or not.<br>
	 *  If the given variables is a HTML tag, return true.
	 * @param {*} html - Target for checking
	 * @returns {Boolean} Is HTML tag?
	 * @memberof tui.util
	 */
	function isHTMLTag(html) {
	    if (typeof HTMLElement === 'object') {
	        return (html && (html instanceof HTMLElement));
	    }

	    return !!(html && html.nodeType && html.nodeType === 1);
	}

	/**
	 * Check whether the given variable is empty(null, undefined, or empty array, empty object) or not.<br>
	 *  If the given variables is empty, return true.
	 * @param {*} obj - Target for checking
	 * @returns {boolean} Is empty?
	 * @memberof tui.util
	 */
	function isEmpty(obj) {
	    if (!isExisty(obj) || _isEmptyString(obj)) {
	        return true;
	    }

	    if (isArray(obj) || isArguments(obj)) {
	        return obj.length === 0;
	    }

	    if (isObject(obj) && !isFunction(obj)) {
	        return !_hasOwnProperty(obj);
	    }

	    return true;
	}

	/**
	 * Check whether given argument is empty string
	 * @param {*} obj - Target for checking
	 * @returns {boolean} whether given argument is empty string
	 * @memberof tui.util
	 * @private
	 */
	function _isEmptyString(obj) {
	    return isString(obj) && obj === '';
	}

	/**
	 * Check whether given argument has own property
	 * @param {Object} obj - Target for checking
	 * @returns {boolean} - whether given argument has own property
	 * @memberof tui.util
	 * @private
	 */
	function _hasOwnProperty(obj) {
	    var key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) {
	            return true;
	        }
	    }

	    return false;
	}

	/**
	 * Check whether the given variable is not empty
	 * (not null, not undefined, or not empty array, not empty object) or not.<br>
	 *  If the given variables is not empty, return true.
	 * @param {*} obj - Target for checking
	 * @returns {boolean} Is not empty?
	 * @memberof tui.util
	 */
	function isNotEmpty(obj) {
	    return !isEmpty(obj);
	}

	/**
	 * Check whether the given variable is an instance of Date or not.<br>
	 *  If the given variables is an instance of Date, return true.
	 * @param {*} obj - Target for checking
	 * @returns {boolean} Is an instance of Date?
	 * @memberof tui.util
	 */
	function isDate(obj) {
	    return obj instanceof Date;
	}

	/**
	 * Check whether the given variable is an instance of Date or not.<br>
	 *  If the given variables is an instance of Date, return true.<br>
	 *  (It is used for multiple frame environments)
	 * @param {*} obj - Target for checking
	 * @returns {boolean} Is an instance of Date?
	 * @memberof tui.util
	 */
	function isDateSafe(obj) {
	    return toString.call(obj) === '[object Date]';
	}

	module.exports = {
	    isExisty: isExisty,
	    isUndefined: isUndefined,
	    isNull: isNull,
	    isTruthy: isTruthy,
	    isFalsy: isFalsy,
	    isArguments: isArguments,
	    isArray: isArray,
	    isArraySafe: isArraySafe,
	    isObject: isObject,
	    isFunction: isFunction,
	    isFunctionSafe: isFunctionSafe,
	    isNumber: isNumber,
	    isNumberSafe: isNumberSafe,
	    isDate: isDate,
	    isDateSafe: isDateSafe,
	    isString: isString,
	    isStringSafe: isStringSafe,
	    isBoolean: isBoolean,
	    isBooleanSafe: isBooleanSafe,
	    isHTMLNode: isHTMLNode,
	    isHTMLTag: isHTMLTag,
	    isEmpty: isEmpty,
	    isNotEmpty: isNotEmpty
	};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview This module has some functions for handling array.
	 * @author NHN Ent.
	 *         FE Development Lab <dl_javascript@nhnent.com>
	 */

	'use strict';

	var collection = __webpack_require__(4);
	var type = __webpack_require__(2);

	var aps = Array.prototype.slice;
	var util;

	/**
	 * Generate an integer Array containing an arithmetic progression.
	 * @param {number} start - start index
	 * @param {number} stop - stop index
	 * @param {number} step - next visit index = current index + step
	 * @returns {Array}
	 * @memberof tui.util
	 * @example
	 * //-- #1. Get Module --//
	 * var util = require('tui-code-snippet'); // node, commonjs
	 * var util = tui.util; // distribution file
	 *
	 * //-- #2. Use property --//
	 * util.range(5); // [0, 1, 2, 3, 4]
	 * util.range(1, 5); // [1,2,3,4]
	 * util.range(2, 10, 2); // [2,4,6,8]
	 * util.range(10, 2, -2); // [10,8,6,4]
	 */
	var range = function(start, stop, step) {
	    var arr = [];
	    var flag;

	    if (type.isUndefined(stop)) {
	        stop = start || 0;
	        start = 0;
	    }

	    step = step || 1;
	    flag = step < 0 ? -1 : 1;
	    stop *= flag;

	    for (; start * flag < stop; start += step) {
	        arr.push(start);
	    }

	    return arr;
	};

	/* eslint-disable valid-jsdoc */
	/**
	 * Zip together multiple lists into a single array
	 * @param {...Array}
	 * @returns {Array}
	 * @memberof tui.util
	 * @example
	 * //-- #1. Get Module --//
	 * var util = require('tui-code-snippet'); // node, commonjs
	 * var util = tui.util; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var result = util.zip([1, 2, 3], ['a', 'b','c'], [true, false, true]);
	 * console.log(result[0]); // [1, 'a', true]
	 * console.log(result[1]); // [2, 'b', false]
	 * console.log(result[2]); // [3, 'c', true]
	 */
	var zip = function() {/* eslint-enable valid-jsdoc */
	    var arr2d = aps.call(arguments);
	    var result = [];

	    collection.forEach(arr2d, function(arr) {
	        collection.forEach(arr, function(value, index) {
	            if (!result[index]) {
	                result[index] = [];
	            }
	            result[index].push(value);
	        });
	    });

	    return result;
	};

	/**
	 * Returns the first index at which a given element can be found in the array
	 * from start index(default 0), or -1 if it is not present.<br>
	 * It compares searchElement to elements of the Array using strict equality
	 * (the same method used by the ===, or triple-equals, operator).
	 * @param {*} searchElement Element to locate in the array
	 * @param {Array} array Array that will be traversed.
	 * @param {number} startIndex Start index in array for searching (default 0)
	 * @returns {number} the First index at which a given element, or -1 if it is not present
	 * @memberof tui.util
	 * @example
	 * //-- #1. Get Module --//
	 * var util = require('tui-code-snippet'); // node, commonjs
	 * var util = tui.util; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var arr = ['one', 'two', 'three', 'four'];
	 * var idx1 = util.inArray('one', arr, 3); // -1
	 * var idx2 = util.inArray('one', arr); // 0
	 */
	var inArray = function(searchElement, array, startIndex) {
	    var i;
	    var length;
	    startIndex = startIndex || 0;

	    if (!type.isArray(array)) {
	        return -1;
	    }

	    if (Array.prototype.indexOf) {
	        return Array.prototype.indexOf.call(array, searchElement, startIndex);
	    }

	    length = array.length;
	    for (i = startIndex; startIndex >= 0 && i < length; i += 1) {
	        if (array[i] === searchElement) {
	            return i;
	        }
	    }

	    return -1;
	};

	util = {
	    inArray: inArray,
	    range: range,
	    zip: zip
	};

	module.exports = util;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview This module has some functions for handling object as collection.
	 * @author NHN Ent.
	 *         FE Development Lab <dl_javascript@nhnent.com>
	 */

	'use strict';

	var type = __webpack_require__(2);
	var object = __webpack_require__(1);

	/**
	 * Execute the provided callback once for each element present
	 * in the array(or Array-like object) in ascending order.<br>
	 * If the callback function returns false, the loop will be stopped.<br>
	 * Callback function(iteratee) is invoked with three arguments:
	 *  - The value of the element
	 *  - The index of the element
	 *  - The array(or Array-like object) being traversed
	 * @param {Array} arr The array(or Array-like object) that will be traversed
	 * @param {function} iteratee Callback function
	 * @param {Object} [context] Context(this) of callback function
	 * @memberof tui.util
	  * //-- #1. Get Module --//
	 * var util = require('tui-code-snippet'); // node, commonjs
	 * var util = tui.util; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var sum = 0;
	 *
	 * util.forEachArray([1,2,3], function(value){
	 *     sum += value;
	 * });
	 * alert(sum); // 6
	 */
	function forEachArray(arr, iteratee, context) {
	    var index = 0;
	    var len = arr.length;

	    context = context || null;

	    for (; index < len; index += 1) {
	        if (iteratee.call(context, arr[index], index, arr) === false) {
	            break;
	        }
	    }
	}

	/**
	 * Execute the provided callback once for each property of object which actually exist.<br>
	 * If the callback function returns false, the loop will be stopped.<br>
	 * Callback function(iteratee) is invoked with three arguments:
	 *  - The value of the property
	 *  - The name of the property
	 *  - The object being traversed
	 * @param {Object} obj The object that will be traversed
	 * @param {function} iteratee  Callback function
	 * @param {Object} [context] Context(this) of callback function
	 * @memberof tui.util
	 * @example
	 * //-- #1. Get Module --//
	 * var util = require('tui-code-snippet'); // node, commonjs
	 * var util = tui.util; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var sum = 0;
	 *
	 * util.forEachOwnProperties({a:1,b:2,c:3}, function(value){
	 *     sum += value;
	 * });
	 * alert(sum); // 6
	 **/
	function forEachOwnProperties(obj, iteratee, context) {
	    var key;

	    context = context || null;

	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) {
	            if (iteratee.call(context, obj[key], key, obj) === false) {
	                break;
	            }
	        }
	    }
	}

	/**
	 * Execute the provided callback once for each property of object(or element of array) which actually exist.<br>
	 * If the object is Array-like object(ex-arguments object), It needs to transform to Array.(see 'ex2' of example).<br>
	 * If the callback function returns false, the loop will be stopped.<br>
	 * Callback function(iteratee) is invoked with three arguments:
	 *  - The value of the property(or The value of the element)
	 *  - The name of the property(or The index of the element)
	 *  - The object being traversed
	 * @param {Object} obj The object that will be traversed
	 * @param {function} iteratee Callback function
	 * @param {Object} [context] Context(this) of callback function
	 * @memberof tui.util
	 * //-- #1. Get Module --//
	 * var util = require('tui-code-snippet'); // node, commonjs
	 * var util = tui.util; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var sum = 0;
	 *
	 * util.forEach([1,2,3], function(value){
	 *     sum += value;
	 * });
	 * alert(sum); // 6
	 *
	 * // In case of Array-like object
	 * var array = Array.prototype.slice.call(arrayLike); // change to array
	 * util.forEach(array, function(value){
	 *     sum += value;
	 * });
	 */
	function forEach(obj, iteratee, context) {
	    if (type.isArray(obj)) {
	        forEachArray(obj, iteratee, context);
	    } else {
	        forEachOwnProperties(obj, iteratee, context);
	    }
	}

	/**
	 * Execute the provided callback function once for each element in an array, in order,
	 * and constructs a new array from the results.<br>
	 * If the object is Array-like object(ex-arguments object),
	 * It needs to transform to Array.(see 'ex2' of forEach example)<br>
	 * Callback function(iteratee) is invoked with three arguments:
	 *  - The value of the property(or The value of the element)
	 *  - The name of the property(or The index of the element)
	 *  - The object being traversed
	 * @param {Object} obj The object that will be traversed
	 * @param {function} iteratee Callback function
	 * @param {Object} [context] Context(this) of callback function
	 * @returns {Array} A new array composed of returned values from callback function
	 * @memberof tui.util
	 * //-- #1. Get Module --//
	 * var util = require('tui-code-snippet'); // node, commonjs
	 * var util = tui.util; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var result = util.map([0,1,2,3], function(value) {
	 *     return value + 1;
	 * });
	 *
	 * alert(result);  // 1,2,3,4
	 */
	function map(obj, iteratee, context) {
	    var resultArray = [];

	    context = context || null;

	    forEach(obj, function() {
	        resultArray.push(iteratee.apply(context, arguments));
	    });

	    return resultArray;
	}

	/**
	 * Execute the callback function once for each element present in the array(or Array-like object or plain object).<br>
	 * If the object is Array-like object(ex-arguments object),
	 * It needs to transform to Array.(see 'ex2' of forEach example)<br>
	 * Callback function(iteratee) is invoked with four arguments:
	 *  - The previousValue
	 *  - The currentValue
	 *  - The index
	 *  - The object being traversed
	 * @param {Object} obj The object that will be traversed
	 * @param {function} iteratee Callback function
	 * @param {Object} [context] Context(this) of callback function
	 * @returns {*} The result value
	 * @memberof tui.util
	 * @example
	 * //-- #1. Get Module --//
	 * var util = require('tui-code-snippet'); // node, commonjs
	 * var util = tui.util; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var result = util.reduce([0,1,2,3], function(stored, value) {
	 *     return stored + value;
	 * });
	 *
	 * alert(result); // 6
	 */
	function reduce(obj, iteratee, context) {
	    var index = 0;
	    var keys, length, store;

	    context = context || null;

	    if (!type.isArray(obj)) {
	        keys = object.keys(obj);
	        length = keys.length;
	        store = obj[keys[index += 1]];
	    } else {
	        length = obj.length;
	        store = obj[index];
	    }

	    index += 1;
	    for (; index < length; index += 1) {
	        store = iteratee.call(context, store, obj[keys ? keys[index] : index]);
	    }

	    return store;
	}

	/**
	 * Transform the Array-like object to Array.<br>
	 * In low IE (below 8), Array.prototype.slice.call is not perfect. So, try-catch statement is used.
	 * @param {*} arrayLike Array-like object
	 * @returns {Array} Array
	 * @memberof tui.util
	 * @example
	 * //-- #1. Get Module --//
	 * var util = require('tui-code-snippet'); // node, commonjs
	 * var util = tui.util; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var arrayLike = {
	 *     0: 'one',
	 *     1: 'two',
	 *     2: 'three',
	 *     3: 'four',
	 *     length: 4
	 * };
	 * var result = util.toArray(arrayLike);
	 *
	 * alert(result instanceof Array); // true
	 * alert(result); // one,two,three,four
	 */
	function toArray(arrayLike) {
	    var arr;
	    try {
	        arr = Array.prototype.slice.call(arrayLike);
	    } catch (e) {
	        arr = [];
	        forEachArray(arrayLike, function(value) {
	            arr.push(value);
	        });
	    }

	    return arr;
	}

	/**
	 * Create a new array or plain object with all elements(or properties)
	 * that pass the test implemented by the provided function.<br>
	 * Callback function(iteratee) is invoked with three arguments:
	 *  - The value of the property(or The value of the element)
	 *  - The name of the property(or The index of the element)
	 *  - The object being traversed
	 * @param {Object} obj Object(plain object or Array) that will be traversed
	 * @param {function} iteratee Callback function
	 * @param {Object} [context] Context(this) of callback function
	 * @returns {Object} plain object or Array
	 * @memberof tui.util
	 * @example
	  * //-- #1. Get Module --//
	 * var util = require('tui-code-snippet'); // node, commonjs
	 * var util = tui.util; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var result1 = util.filter([0,1,2,3], function(value) {
	 *     return (value % 2 === 0);
	 * });
	 * alert(result1); // [0, 2]
	 *
	 * var result2 = util.filter({a : 1, b: 2, c: 3}, function(value) {
	 *     return (value % 2 !== 0);
	 * });
	 * alert(result2.a); // 1
	 * alert(result2.b); // undefined
	 * alert(result2.c); // 3
	 */
	function filter(obj, iteratee, context) {
	    var result, add;

	    context = context || null;

	    if (!type.isObject(obj) || !type.isFunction(iteratee)) {
	        throw new Error('wrong parameter');
	    }

	    if (type.isArray(obj)) {
	        result = [];
	        add = function(subResult, args) {
	            subResult.push(args[0]);
	        };
	    } else {
	        result = {};
	        add = function(subResult, args) {
	            subResult[args[1]] = args[0];
	        };
	    }

	    forEach(obj, function() {
	        if (iteratee.apply(context, arguments)) {
	            add(result, arguments);
	        }
	    }, context);

	    return result;
	}

	/**
	 * fetching a property
	 * @param {Array} arr target collection
	 * @param {String|Number} property property name
	 * @returns {Array}
	 * @memberof tui.util
	 * @example
	 * //-- #1. Get Module --//
	 * var util = require('tui-code-snippet'); // node, commonjs
	 * var util = tui.util; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var objArr = [
	 *     {'abc': 1, 'def': 2, 'ghi': 3},
	 *     {'abc': 4, 'def': 5, 'ghi': 6},
	 *     {'abc': 7, 'def': 8, 'ghi': 9}
	 * ];
	 * var arr2d = [
	 *     [1, 2, 3],
	 *     [4, 5, 6],
	 *     [7, 8, 9]
	 * ];
	 * util.pluck(objArr, 'abc'); // [1, 4, 7]
	 * util.pluck(arr2d, 2); // [3, 6, 9]
	 */
	function pluck(arr, property) {
	    var result = map(arr, function(item) {
	        return item[property];
	    });

	    return result;
	}

	module.exports = {
	    forEachOwnProperties: forEachOwnProperties,
	    forEachArray: forEachArray,
	    forEach: forEach,
	    toArray: toArray,
	    map: map,
	    reduce: reduce,
	    filter: filter,
	    pluck: pluck
	};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	/**
	 * @fileoverview This module provides a bind() function for context binding.
	 * @author NHN Ent.
	 *         FE Development Lab <dl_javascript@nhnent.com>
	 */

	'use strict';

	/**
	 * Create a new function that, when called, has its this keyword set to the provided value.
	 * @param {function} fn A original function before binding
	 * @param {*} obj context of function in arguments[0]
	 * @returns {function()} A new bound function with context that is in arguments[1]
	 * @memberof tui.util
	 */
	function bind(fn, obj) {
	    var slice = Array.prototype.slice;
	    var args;

	    if (fn.bind) {
	        return fn.bind.apply(fn, slice.call(arguments, 1));
	    }

	    /* istanbul ignore next */
	    args = slice.call(arguments, 2);

	    /* istanbul ignore next */
	    return function() {
	        /* istanbul ignore next */
	        return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
	    };
	}

	module.exports = {
	    bind: bind
	};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	/**
	 * @fileoverview This module provides some simple function for inheritance.
	 * @author NHN Ent.
	 *         FE Development Lab <dl_javascript@nhnent.com>
	 */

	'use strict';

	/**
	 * Create a new object with the specified prototype object and properties.
	 * @param {Object} obj This object will be a prototype of the newly-created object.
	 * @returns {Object}
	 * @memberof tui.util
	 */
	function createObject(obj) {
	    function F() {} // eslint-disable-line require-jsdoc
	    F.prototype = obj;

	    return new F();
	}

	/**
	 * Provide a simple inheritance in prototype-oriented.<br>
	 * Caution :
	 *  Don't overwrite the prototype of child constructor.
	 *
	 * @param {function} subType Child constructor
	 * @param {function} superType Parent constructor
	 * @memberof tui.util
	 * @example
	 * //-- #1. Get Module --//
	 * var util = require('tui-code-snippet'); // node, commonjs
	 * var util = tui.util; // distribution file
	 *
	 * //-- #2. Use property --//
	 * // Parent constructor
	 * function Animal(leg) {
	 *     this.leg = leg;
	 * }
	 * Animal.prototype.growl = function() {
	 *     // ...
	 * };
	 *
	 * // Child constructor
	 * function Person(name) {
	 *     this.name = name;
	 * }
	 *
	 * // Inheritance
	 * util.inherit(Person, Animal);
	 *
	 * // After this inheritance, please use only the extending of property.
	 * // Do not overwrite prototype.
	 * Person.prototype.walk = function(direction) {
	 *     // ...
	 * };
	 */
	function inherit(subType, superType) {
	    var prototype = createObject(superType.prototype);
	    prototype.constructor = subType;
	    subType.prototype = prototype;
	}

	module.exports = {
	    createObject: createObject,
	    inherit: inherit
	};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview This module has some functions for handling the string.
	 * @author NHN Ent.
	 *         FE Development Lab <dl_javascript@nhnent.com>
	 */

	'use strict';

	var collection = __webpack_require__(4);
	var object = __webpack_require__(1);
	/**
	 * Transform the given HTML Entity string into plain string
	 * @param {String} htmlEntity - HTML Entity type string
	 * @returns {String} Plain string
	 * @memberof tui.util
	 * @example
	 * //-- #1. Get Module --//
	 * var util = require('tui-code-snippet'); // node, commonjs
	 * var util = tui.util; // distribution file
	 *
	 * //-- #2. Use property --//
	 *  var htmlEntityString = "A &#39;quote&#39; is &lt;b&gt;bold&lt;/b&gt;"
	 *  var result = util.decodeHTMLEntity(htmlEntityString); //"A 'quote' is <b>bold</b>"
	 */
	function decodeHTMLEntity(htmlEntity) {
	    var entities = {
	        '&quot;': '"',
	        '&amp;': '&',
	        '&lt;': '<',
	        '&gt;': '>',
	        '&#39;': '\'',
	        '&nbsp;': ' '
	    };

	    return htmlEntity.replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&nbsp;/g, function(m0) {
	        return entities[m0] ? entities[m0] : m0;
	    });
	}

	/**
	 * Transform the given string into HTML Entity string
	 * @param {String} html - String for encoding
	 * @returns {String} HTML Entity
	 * @memberof tui.util
	 * @example
	 * //-- #1. Get Module --//
	 * var util = require('tui-code-snippet'); // node, commonjs
	 * var util = tui.util; // distribution file
	 *
	 * //-- #2. Use property --//
	 *  var htmlEntityString = "<script> alert('test');</script><a href='test'>";
	 *  var result = util.encodeHTMLEntity(htmlEntityString);
	 * //"&lt;script&gt; alert(&#39;test&#39;);&lt;/script&gt;&lt;a href=&#39;test&#39;&gt;"
	 */
	function encodeHTMLEntity(html) {
	    var entities = {
	        '"': 'quot',
	        '&': 'amp',
	        '<': 'lt',
	        '>': 'gt',
	        '\'': '#39'
	    };

	    return html.replace(/[<>&"']/g, function(m0) {
	        return entities[m0] ? '&' + entities[m0] + ';' : m0;
	    });
	}

	/**
	 * Return whether the string capable to transform into plain string is in the given string or not.
	 * @param {String} string - test string
	 * @memberof tui.util
	 * @returns {boolean}
	 */
	function hasEncodableString(string) {
	    return (/[<>&"']/).test(string);
	}

	/**
	 * Return duplicate charters
	 * @param {string} operandStr1 The operand string
	 * @param {string} operandStr2 The operand string
	 * @private
	 * @memberof tui.util
	 * @returns {string}
	 * @example
	 * //-- #1. Get Module --//
	 * var util = require('tui-code-snippet'); // node, commonjs
	 * var util = tui.util; // distribution file
	 *
	 * //-- #2. Use property --//
	 * util.getDuplicatedChar('fe dev', 'nhn entertainment'); // 'e'
	 * util.getDuplicatedChar('fdsa', 'asdf'); // 'asdf'
	 */
	function getDuplicatedChar(operandStr1, operandStr2) {
	    var i = 0;
	    var len = operandStr1.length;
	    var pool = {};
	    var dupl, key;

	    for (; i < len; i += 1) {
	        key = operandStr1.charAt(i);
	        pool[key] = 1;
	    }

	    for (i = 0, len = operandStr2.length; i < len; i += 1) {
	        key = operandStr2.charAt(i);
	        if (pool[key]) {
	            pool[key] += 1;
	        }
	    }

	    pool = collection.filter(pool, function(item) {
	        return item > 1;
	    });

	    pool = object.keys(pool).sort();
	    dupl = pool.join('');

	    return dupl;
	}

	module.exports = {
	    decodeHTMLEntity: decodeHTMLEntity,
	    encodeHTMLEntity: encodeHTMLEntity,
	    hasEncodableString: hasEncodableString,
	    getDuplicatedChar: getDuplicatedChar
	};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	/**
	 * @fileoverview collections of some technic methods.
	 * @author NHN Ent. FE Development Lab <e0242.nhnent.com>
	 */

	'use strict';

	var tricks = {};
	var aps = Array.prototype.slice;

	/**
	 * Creates a debounced function that delays invoking fn until after delay milliseconds has elapsed
	 * since the last time the debouced function was invoked.
	 * @param {function} fn The function to debounce.
	 * @param {number} [delay=0] The number of milliseconds to delay
	 * @memberof tui.util
	 * @returns {function} debounced function.
	 * @example
	 * //-- #1. Get Module --//
	 * var util = require('tui-code-snippet'); // node, commonjs
	 * var util = tui.util; // distribution file
	 *
	 * //-- #2. Use property --//
	 * function someMethodToInvokeDebounced() {}
	 *
	 * var debounced = util.debounce(someMethodToInvokeDebounced, 300);
	 *
	 * // invoke repeatedly
	 * debounced();
	 * debounced();
	 * debounced();
	 * debounced();
	 * debounced();
	 * debounced();    // last invoke of debounced()
	 *
	 * // invoke someMethodToInvokeDebounced() after 300 milliseconds.
	 */
	function debounce(fn, delay) {
	    var timer, args;

	    /* istanbul ignore next */
	    delay = delay || 0;

	    function debounced() { // eslint-disable-line require-jsdoc
	        args = aps.call(arguments);

	        window.clearTimeout(timer);
	        timer = window.setTimeout(function() {
	            fn.apply(null, args);
	        }, delay);
	    }

	    return debounced;
	}

	/**
	 * return timestamp
	 * @memberof tui.util
	 * @returns {number} The number of milliseconds from Jan. 1970 00:00:00 (GMT)
	 */
	function timestamp() {
	    return Number(new Date());
	}

	/**
	 * Creates a throttled function that only invokes fn at most once per every interval milliseconds.
	 *
	 * You can use this throttle short time repeatedly invoking functions. (e.g MouseMove, Resize ...)
	 *
	 * if you need reuse throttled method. you must remove slugs (e.g. flag variable) related with throttling.
	 * @param {function} fn function to throttle
	 * @param {number} [interval=0] the number of milliseconds to throttle invocations to.
	 * @memberof tui.util
	 * @returns {function} throttled function
	 * @example
	 * //-- #1. Get Module --//
	 * var util = require('tui-code-snippet'); // node, commonjs
	 * var util = tui.util; // distribution file
	 *
	 * //-- #2. Use property --//
	 * function someMethodToInvokeThrottled() {}
	 *
	 * var throttled = util.throttle(someMethodToInvokeThrottled, 300);
	 *
	 * // invoke repeatedly
	 * throttled();    // invoke (leading)
	 * throttled();
	 * throttled();    // invoke (near 300 milliseconds)
	 * throttled();
	 * throttled();
	 * throttled();    // invoke (near 600 milliseconds)
	 * // ...
	 * // invoke (trailing)
	 *
	 * // if you need reuse throttled method. then invoke reset()
	 * throttled.reset();
	 */
	function throttle(fn, interval) {
	    var base;
	    var isLeading = true;
	    var tick = function(_args) {
	        fn.apply(null, _args);
	        base = null;
	    };
	    var debounced, stamp, args;

	    /* istanbul ignore next */
	    interval = interval || 0;

	    debounced = tricks.debounce(tick, interval);

	    function throttled() { // eslint-disable-line require-jsdoc
	        args = aps.call(arguments);

	        if (isLeading) {
	            tick(args);
	            isLeading = false;

	            return;
	        }

	        stamp = tricks.timestamp();

	        base = base || stamp;

	        // pass array directly because `debounce()`, `tick()` are already use
	        // `apply()` method to invoke developer's `fn` handler.
	        //
	        // also, this `debounced` line invoked every time for implements
	        // `trailing` features.
	        debounced(args);

	        if ((stamp - base) >= interval) {
	            tick(args);
	        }
	    }

	    function reset() { // eslint-disable-line require-jsdoc
	        isLeading = true;
	        base = null;
	    }

	    throttled.reset = reset;

	    return throttled;
	}

	tricks.timestamp = timestamp;
	tricks.debounce = debounce;
	tricks.throttle = throttle;

	module.exports = tricks;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

	/**
	 * @fileoverview This module detects the kind of well-known browser and version.
	 * @author NHN Ent.
	 *         FE Development Lab <dl_javascript@nhnent.com>
	 */

	'use strict';

	/**
	 * This object has an information that indicate the kind of browser.<br>
	 * The list below is a detectable browser list.
	 *  - ie8 ~ ie11
	 *  - chrome
	 *  - firefox
	 *  - safari
	 *  - edge
	 * @memberof tui.util
	 * @example
	 * //-- #1. Get Module --//
	 * var util = require('tui-code-snippet'); // node, commonjs
	 * var util = tui.util; // distribution file
	 *
	 * //-- #2. Use property --//
	 * util.browser.chrome === true; // chrome
	 * util.browser.firefox === true; // firefox
	 * util.browser.safari === true; // safari
	 * util.browser.msie === true; // IE
	 * util.browser.edge === true; // edge
	 * util.browser.others === true; // other browser
	 * util.browser.version; // browser version
	 */
	var browser = {
	    chrome: false,
	    firefox: false,
	    safari: false,
	    msie: false,
	    edge: false,
	    others: false,
	    version: 0
	};

	var nav = window.navigator;
	var appName = nav.appName.replace(/\s/g, '_');
	var userAgent = nav.userAgent;

	var rIE = /MSIE\s([0-9]+[.0-9]*)/;
	var rIE11 = /Trident.*rv:11\./;
	var rEdge = /Edge\/(\d+)\./;
	var versionRegex = {
	    firefox: /Firefox\/(\d+)\./,
	    chrome: /Chrome\/(\d+)\./,
	    safari: /Version\/([\d.]+).*Safari\/(\d+)/
	};

	var key, tmp;

	var detector = {
	    Microsoft_Internet_Explorer: function() { // eslint-disable-line camelcase
	        var detectedVersion = userAgent.match(rIE);

	        if (detectedVersion) { // ie8 ~ ie10
	            browser.msie = true;
	            browser.version = parseFloat(detectedVersion[1]);
	        } else { // no version information
	            browser.others = true;
	        }
	    },
	    Netscape: function() { // eslint-disable-line complexity
	        var detected = false;

	        if (rIE11.exec(userAgent)) {
	            browser.msie = true;
	            browser.version = 11;
	            detected = true;
	        } else if (rEdge.exec(userAgent)) {
	            browser.edge = true;
	            browser.version = userAgent.match(rEdge)[1];
	            detected = true;
	        } else {
	            for (key in versionRegex) {
	                if (versionRegex.hasOwnProperty(key)) {
	                    tmp = userAgent.match(versionRegex[key]);
	                    if (tmp && tmp.length > 1) { // eslint-disable-line max-depth
	                        browser[key] = detected = true;
	                        browser.version = parseFloat(tmp[1] || 0);
	                        break;
	                    }
	                }
	            }
	        }
	        if (!detected) {
	            browser.others = true;
	        }
	    }
	};

	var fn = detector[appName];

	if (fn) {
	    detector[appName]();
	}

	module.exports = browser;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview This module has some methods for handling popup-window
	 * @author NHN Ent.
	 *         FE Development Lab <dl_javascript@nhnent.com>
	 */

	'use strict';

	var collection = __webpack_require__(4);
	var type = __webpack_require__(2);
	var func = __webpack_require__(5);
	var browser = __webpack_require__(9);
	var object = __webpack_require__(1);

	var popupId = 0;

	/**
	 * Popup management class
	 * @constructor
	 * @memberof tui.util
	 * @example
	 * // node, commonjs
	 * var popup = require('tui-code-snippet').popup;
	 * @example
	 * // distribution file, script
	 * <script src='path-to/tui-code-snippt.js'></script>
	 * <script>
	 * var popup = tui.util.popup;
	 * <script>
	 */
	function Popup() {
	    /**
	     * Caching the window-contexts of opened popups
	     * @type {Object}
	     */
	    this.openedPopup = {};

	    /**
	     * In IE7, an error occurs when the closeWithParent property attaches to window object.<br>
	     * So, It is for saving the value of closeWithParent instead of attaching to window object.
	     * @type {Object}
	     */
	    this.closeWithParentPopup = {};

	    /**
	     * Post data bridge for IE11 popup
	     * @type {string}
	     */
	    this.postBridgeUrl = '';
	}

	/**********
	 * public methods
	 **********/

	/**
	 * Returns a popup-list administered by current window.
	 * @param {string} [key] The key of popup.
	 * @returns {Object} popup window list object
	 */
	Popup.prototype.getPopupList = function(key) {
	    var target;
	    if (type.isExisty(key)) {
	        target = this.openedPopup[key];
	    } else {
	        target = this.openedPopup;
	    }

	    return target;
	};

	/**
	 * Open popup
	 * Caution:
	 *  In IE11, when transfer data to popup by POST, must set the postBridgeUrl.
	 *
	 * @param {string} url - popup url
	 * @param {Object} options - popup options
	 *     @param {string} [options.popupName] - Key of popup window.<br>
	 *      If the key is set, when you try to open by this key, the popup of this key is focused.<br>
	 *      Or else a new popup window having this key is opened.
	 *
	 *     @param {string} [options.popupOptionStr=""] - Option string of popup window<br>
	 *      It is same with the third parameter of window.open() method.<br>
	 *      See {@link http://www.w3schools.com/jsref/met_win_open.asp}
	 *
	 *     @param {boolean} [options.closeWithParent=true] - Is closed when parent window closed?
	 *
	 *     @param {boolean} [options.useReload=false] - This property indicates whether reload the popup or not.<br>
	 *      If true, the popup will be reloaded when you try to re-open the popup that has been opened.<br>
	 *      When transmit the POST-data, some browsers alert a message for confirming whether retransmit or not.
	 *
	 *     @param {string} [options.postBridgeUrl='']
	 *      Use this url to avoid a certain bug occuring when transmitting POST data to the popup in IE11.<br>
	 *      This specific buggy situation is known to happen because IE11 tries to open the requested url<br>
	 *      not in a new popup window as intended, but in a new tab.<br>
	 *      See {@link http://wiki.nhnent.com/pages/viewpage.action?pageId=240562844}
	 *
	 *     @param {string} [options.method=get]
	 *     The method of transmission when the form-data is transmitted to popup-window.
	 *
	 *     @param {Object} [options.param=null]
	 *     Using as parameters for transmission when the form-data is transmitted to popup-window.
	 */
	Popup.prototype.openPopup = function(url, options) { // eslint-disable-line complexity
	    var popup, formElement, useIEPostBridge;

	    options = object.extend({
	        popupName: 'popup_' + popupId + '_' + Number(new Date()),
	        popupOptionStr: '',
	        useReload: true,
	        closeWithParent: true,
	        method: 'get',
	        param: {}
	    }, options || {});

	    options.method = options.method.toUpperCase();

	    this.postBridgeUrl = options.postBridgeUrl || this.postBridgeUrl;

	    useIEPostBridge = options.method === 'POST' && options.param &&
	            browser.msie && browser.version === 11;

	    if (!type.isExisty(url)) {
	        throw new Error('Popup#open() need popup url.');
	    }

	    popupId += 1;

	    /*
	     * In form-data transmission
	     * 1. Create a form before opening a popup.
	     * 2. Transmit the form-data.
	     * 3. Remove the form after transmission.
	     */
	    if (options.param) {
	        if (options.method === 'GET') {
	            url = url + (/\?/.test(url) ? '&' : '?') + this._parameterize(options.param);
	        } else if (options.method === 'POST') {
	            if (!useIEPostBridge) {
	                formElement = this.createForm(url, options.param, options.method, options.popupName);
	                url = 'about:blank';
	            }
	        }
	    }

	    popup = this.openedPopup[options.popupName];

	    if (!type.isExisty(popup)) {
	        this.openedPopup[options.popupName] = popup = this._open(useIEPostBridge, options.param,
	            url, options.popupName, options.popupOptionStr);
	    } else if (popup.closed) {
	        this.openedPopup[options.popupName] = popup = this._open(useIEPostBridge, options.param,
	            url, options.popupName, options.popupOptionStr);
	    } else {
	        if (options.useReload) {
	            popup.location.replace(url);
	        }
	        popup.focus();
	    }

	    this.closeWithParentPopup[options.popupName] = options.closeWithParent;

	    if (!popup || popup.closed || type.isUndefined(popup.closed)) {
	        alert('please enable popup windows for this website');
	    }

	    if (options.param && options.method === 'POST' && !useIEPostBridge) {
	        if (popup) {
	            formElement.submit();
	        }
	        if (formElement.parentNode) {
	            formElement.parentNode.removeChild(formElement);
	        }
	    }

	    window.onunload = func.bind(this.closeAllPopup, this);
	};

	/**
	 * Close the popup
	 * @param {boolean} [skipBeforeUnload] - If true, the 'window.onunload' will be null and skip unload event.
	 * @param {Window} [popup] - Window-context of popup for closing. If omit this, current window-context will be closed.
	 */
	Popup.prototype.close = function(skipBeforeUnload, popup) {
	    var target = popup || window;
	    skipBeforeUnload = type.isExisty(skipBeforeUnload) ? skipBeforeUnload : false;

	    if (skipBeforeUnload) {
	        window.onunload = null;
	    }

	    if (!target.closed) {
	        target.opener = window.location.href;
	        target.close();
	    }
	};

	/**
	 * Close all the popups in current window.
	 * @param {boolean} closeWithParent - If true, popups having the closeWithParentPopup property as true will be closed.
	 */
	Popup.prototype.closeAllPopup = function(closeWithParent) {
	    var hasArg = type.isExisty(closeWithParent);

	    collection.forEachOwnProperties(this.openedPopup, function(popup, key) {
	        if ((hasArg && this.closeWithParentPopup[key]) || !hasArg) {
	            this.close(false, popup);
	        }
	    }, this);
	};

	/**
	 * Activate(or focus) the popup of the given name.
	 * @param {string} popupName - Name of popup for activation
	 */
	Popup.prototype.focus = function(popupName) {
	    this.getPopupList(popupName).focus();
	};

	/**
	 * Return an object made of parsing the query string.
	 * @returns {Object} An object having some information of the query string.
	 * @private
	 */
	Popup.prototype.parseQuery = function() {
	    var param = {};
	    var search, pair;

	    search = window.location.search.substr(1);
	    collection.forEachArray(search.split('&'), function(part) {
	        pair = part.split('=');
	        param[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
	    });

	    return param;
	};

	/**
	 * Create a hidden form from the given arguments and return this form.
	 * @param {string} action - URL for form transmission
	 * @param {Object} [data] - Data for form transmission
	 * @param {string} [method] - Method of transmission
	 * @param {string} [target] - Target of transmission
	 * @param {HTMLElement} [container] - Container element of form.
	 * @returns {HTMLElement} Form element
	 */
	Popup.prototype.createForm = function(action, data, method, target, container) {
	    var form = document.createElement('form'),
	        input;

	    container = container || document.body;

	    form.method = method || 'POST';
	    form.action = action || '';
	    form.target = target || '';
	    form.style.display = 'none';

	    collection.forEachOwnProperties(data, function(value, key) {
	        input = document.createElement('input');
	        input.name = key;
	        input.type = 'hidden';
	        input.value = value;
	        form.appendChild(input);
	    });

	    container.appendChild(form);

	    return form;
	};

	/**********
	 * private methods
	 **********/

	/**
	 * Return an query string made by parsing the given object
	 * @param {Object} obj - An object that has information for query string
	 * @returns {string} - Query string
	 * @private
	 */
	Popup.prototype._parameterize = function(obj) {
	    var query = [];

	    collection.forEachOwnProperties(obj, function(value, key) {
	        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
	    });

	    return query.join('&');
	};

	/**
	 * Open popup
	 * @param {boolean} useIEPostBridge - A switch option whether to use alternative
	 *                                  of tossing POST data to the popup window in IE11
	 * @param {Object} param - A data for tossing to popup
	 * @param {string} url - Popup url
	 * @param {string} popupName - Popup name
	 * @param {string} optionStr - Setting for popup, ex) 'width=640,height=320,scrollbars=yes'
	 * @returns {Window} Window context of popup
	 * @private
	 */
	Popup.prototype._open = function(useIEPostBridge, param, url, popupName, optionStr) {
	    var popup;

	    if (useIEPostBridge) {
	        popup = window.open(this.postBridgeUrl, popupName, optionStr);
	        setTimeout(function() {
	            popup.redirect(url, param);
	        }, 100);
	    } else {
	        popup = window.open(url, popupName, optionStr);
	    }

	    return popup;
	};

	module.exports = new Popup();


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview This module has a function for date format.
	 * @author NHN Ent.
	 *         FE Development Lab <dl_javascript@nhnent.com>
	 */

	'use strict';

	var type = __webpack_require__(2);
	var object = __webpack_require__(1);

	var tokens = /[\\]*YYYY|[\\]*YY|[\\]*MMMM|[\\]*MMM|[\\]*MM|[\\]*M|[\\]*DD|[\\]*D|[\\]*HH|[\\]*H|[\\]*A/gi;
	var MONTH_STR = [
	    'Invalid month', 'January', 'February', 'March', 'April', 'May',
	    'June', 'July', 'August', 'September', 'October', 'November', 'December'
	];
	var MONTH_DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	var replaceMap = {
	    M: function(date) {
	        return Number(date.month);
	    },
	    MM: function(date) {
	        var month = date.month;

	        return (Number(month) < 10) ? '0' + month : month;
	    },
	    MMM: function(date) {
	        return MONTH_STR[Number(date.month)].substr(0, 3);
	    },
	    MMMM: function(date) {
	        return MONTH_STR[Number(date.month)];
	    },
	    D: function(date) {
	        return Number(date.date);
	    },
	    d: function(date) {
	        return replaceMap.D(date); // eslint-disable-line new-cap
	    },
	    DD: function(date) {
	        var dayInMonth = date.date;

	        return (Number(dayInMonth) < 10) ? '0' + dayInMonth : dayInMonth;
	    },
	    dd: function(date) {
	        return replaceMap.DD(date); // eslint-disable-line new-cap
	    },
	    YY: function(date) {
	        return Number(date.year) % 100;
	    },
	    yy: function(date) {
	        return replaceMap.YY(date); // eslint-disable-line new-cap
	    },
	    YYYY: function(date) {
	        var prefix = '20',
	            year = date.year;
	        if (year > 69 && year < 100) {
	            prefix = '19';
	        }

	        return (Number(year) < 100) ? prefix + String(year) : year;
	    },
	    yyyy: function(date) {
	        return replaceMap.YYYY(date); // eslint-disable-line new-cap
	    },
	    A: function(date) {
	        return date.meridiem;
	    },
	    a: function(date) {
	        return date.meridiem;
	    },
	    hh: function(date) {
	        var hour = date.hour;

	        return (Number(hour) < 10) ? '0' + hour : hour;
	    },
	    HH: function(date) {
	        return replaceMap.hh(date);
	    },
	    h: function(date) {
	        return String(Number(date.hour));
	    },
	    H: function(date) {
	        return replaceMap.h(date);
	    },
	    m: function(date) {
	        return String(Number(date.minute));
	    },
	    mm: function(date) {
	        var minute = date.minute;

	        return (Number(minute) < 10) ? '0' + minute : minute;
	    }
	};

	/**
	 * Check whether the given variables are valid date or not.
	 * @param {number} year - Year
	 * @param {number} month - Month
	 * @param {number} date - Day in month.
	 * @returns {boolean} Is valid?
	 * @private
	 */
	function isValidDate(year, month, date) { // eslint-disable-line complexity
	    var isValidYear, isValidMonth, isValid, lastDayInMonth;

	    year = Number(year);
	    month = Number(month);
	    date = Number(date);

	    isValidYear = (year > -1 && year < 100) || ((year > 1969) && (year < 2070));
	    isValidMonth = (month > 0) && (month < 13);

	    if (!isValidYear || !isValidMonth) {
	        return false;
	    }

	    lastDayInMonth = MONTH_DAYS[month];
	    if (month === 2 && year % 4 === 0) {
	        if (year % 100 !== 0 || year % 400 === 0) {
	            lastDayInMonth = 29;
	        }
	    }

	    isValid = (date > 0) && (date <= lastDayInMonth);

	    return isValid;
	}

	/**
	 * Return a string that transformed from the given form and date.
	 * @param {string} form - Date form
	 * @param {Date|Object} date - Date object
	 * @param {{meridiemSet: {AM: string, PM: string}}} option - Option
	 * @returns {boolean|string} A transformed string or false.
	 * @memberof tui.util
	 * @example
	 *  // key             | Shorthand
	 *  // --------------- |-----------------------
	 *  // years           | YY / YYYY / yy / yyyy
	 *  // months(n)       | M / MM
	 *  // months(str)     | MMM / MMMM
	 *  // days            | D / DD / d / dd
	 *  // hours           | H / HH / h / hh
	 *  // minutes         | m / mm
	 *  // meridiem(AM,PM) | A / a
	 *
	 * //-- #1. Get Module --//
	 * var util = require('tui-code-snippet'); // node, commonjs
	 * var util = tui.util; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var dateStr1 = util.formatDate('yyyy-MM-dd', {
	 *     year: 2014,
	 *     month: 12,
	 *     date: 12
	 * });
	 * alert(dateStr1); // '2014-12-12'
	 *
	 * var dateStr2 = util.formatDate('MMM DD YYYY HH:mm', {
	 *     year: 1999,
	 *     month: 9,
	 *     date: 9,
	 *     hour: 0,
	 *     minute: 2
	 * });
	 * alert(dateStr2); // 'Sep 09 1999 00:02'
	 *
	 * var dt = new Date(2010, 2, 13),
	 *     dateStr3 = util.formatDate('yyyy년 M월 dd일', dt);
	 * alert(dateStr3); // '2010년 3월 13일'
	 *
	 * var option4 = {
	 *     meridiemSet: {
	 *         AM: '오전',
	 *         PM: '오후'
	 *     }
	 * };
	 * var date4 = {year: 1999, month: 9, date: 9, hour: 13, minute: 2};
	 * var dateStr4 = util.formatDate('yyyy-MM-dd A hh:mm', date4, option4));
	 * alert(dateStr4); // '1999-09-09 오후 01:02'
	 */
	function formatDate(form, date, option) { // eslint-disable-line complexity
	    var am = object.pick(option, 'meridiemSet', 'AM') || 'AM';
	    var pm = object.pick(option, 'meridiemSet', 'PM') || 'PM';
	    var meridiem, nDate, resultStr;

	    if (type.isDate(date)) {
	        nDate = {
	            year: date.getFullYear(),
	            month: date.getMonth() + 1,
	            date: date.getDate(),
	            hour: date.getHours(),
	            minute: date.getMinutes()
	        };
	    } else {
	        nDate = {
	            year: date.year,
	            month: date.month,
	            date: date.date,
	            hour: date.hour,
	            minute: date.minute
	        };
	    }

	    if (!isValidDate(nDate.year, nDate.month, nDate.date)) {
	        return false;
	    }

	    nDate.meridiem = '';
	    if (/([^\\]|^)[aA]\b/.test(form)) {
	        meridiem = (nDate.hour > 11) ? pm : am;
	        if (nDate.hour > 12) { // See the clock system: https://en.wikipedia.org/wiki/12-hour_clock
	            nDate.hour %= 12;
	        }
	        if (nDate.hour === 0) {
	            nDate.hour = 12;
	        }
	        nDate.meridiem = meridiem;
	    }

	    resultStr = form.replace(tokens, function(key) {
	        if (key.indexOf('\\') > -1) { // escape character
	            return key.replace(/\\/, '');
	        }

	        return replaceMap[key](nDate) || '';
	    });

	    return resultStr;
	}

	module.exports = formatDate;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview
	 *  This module provides a function to make a constructor
	 * that can inherit from the other constructors like the CLASS easily.
	 * @author NHN Ent.
	 *         FE Development Lab <dl_javascript@nhnent.com>
	 */

	'use strict';

	var inherit = __webpack_require__(6).inherit;
	var extend = __webpack_require__(1).extend;

	/**
	 * Help a constructor to be defined and to inherit from the other constructors
	 * @param {*} [parent] Parent constructor
	 * @param {Object} props Members of constructor
	 *  @param {Function} props.init Initialization method
	 *  @param {Object} [props.static] Static members of constructor
	 * @returns {*} Constructor
	 * @memberof tui.util
	 * @example
	 * //-- #1. Get Module --//
	 * var util = require('tui-code-snippet'); // node, commonjs
	 * var util = tui.util; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var Parent = util.defineClass({
	 *     init: function() { // constuructor
	 *         this.name = 'made by def';
	 *     },
	 *     method: function() {
	 *         // ...
	 *     },
	 *     static: {
	 *         staticMethod: function() {
	 *              // ...
	 *         }
	 *     }
	 * });
	 *
	 * var Child = util.defineClass(Parent, {
	 *     childMethod: function() {}
	 * });
	 *
	 * Parent.staticMethod();
	 *
	 * var parentInstance = new Parent();
	 * console.log(parentInstance.name); //made by def
	 * parentInstance.staticMethod(); // Error
	 *
	 * var childInstance = new Child();
	 * childInstance.method();
	 * childInstance.childMethod();
	 */
	function defineClass(parent, props) {
	    var obj;

	    if (!props) {
	        props = parent;
	        parent = null;
	    }

	    obj = props.init || function() {};

	    if (parent) {
	        inherit(obj, parent);
	    }

	    if (props.hasOwnProperty('static')) {
	        extend(obj, props['static']);
	        delete props['static'];
	    }

	    extend(obj.prototype, props);

	    return obj;
	}

	module.exports = defineClass;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Define module
	 * @author NHN Ent.
	 *         FE Development Lab <dl_javscript@nhnent.com>
	 * @dependency type.js, defineNamespace.js
	 */

	'use strict';

	var defineNamespace = __webpack_require__(14);
	var type = __webpack_require__(2);

	var INITIALIZATION_METHOD_NAME = 'initialize';

	/**
	 * Define module
	 * @param {string} namespace - Namespace of module
	 * @param {Object} moduleDefinition - Object literal for module
	 * @returns {Object} Defined module
	 * @memberof tui.util
	 * @example
	  * //-- #1. Get Module --//
	 * var util = require('tui-code-snippet'); // node, commonjs
	 * var util = tui.util; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var myModule = util.defineModule('modules.myModule', {
	 *     name: 'john',
	 *     message: '',
	 *     initialize: function() {
	 *        this.message = 'hello world';
	 *     },
	 *     getMessage: function() {
	 *         return this.name + ': ' + this.message
	 *     }
	 * });
	 *
	 * console.log(myModule.getMessage());  // 'john: hello world';
	 */
	function defineModule(namespace, moduleDefinition) {
	    var base = moduleDefinition || {};

	    if (type.isFunction(base[INITIALIZATION_METHOD_NAME])) {
	        base[INITIALIZATION_METHOD_NAME]();
	    }

	    return defineNamespace(namespace, base);
	}

	module.exports = defineModule;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Define namespace
	 * @author NHN Ent.
	 *         FE Development Lab <dl_javascript@nhnent.com>
	 * @dependency object.js, collection.js
	 */

	'use strict';

	var collection = __webpack_require__(4);
	var object = __webpack_require__(1);

	/**
	 * Define namespace
	 * @param {string} namespace - Namespace (ex- 'foo.bar.baz')
	 * @param {(object|function)} props - A set of modules or one module
	 * @param {boolean} [isOverride] - Override the props to the namespace.<br>
	 *                                  (It removes previous properties of this namespace)
	 * @returns {(object|function)} Defined namespace
	 * @memberof tui.util
	 * @example
	 * //-- #1. Get Module --//
	 * var util = require('tui-code-snippet'); // node, commonjs
	 * var util = tui.util; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var neComp = util.defineNamespace;
	 * neComp.listMenu = defineClass({
	 *     init: function() {
	 *         // ...
	 *     }
	 * });
	 */
	function defineNamespace(namespace, props, isOverride) {
	    var names, result, prevLast, last;

	    names = namespace.split('.');
	    names.unshift(window);

	    result = collection.reduce(names, function(obj, name) {
	        obj[name] = obj[name] || {};

	        return obj[name];
	    });

	    if (isOverride) {
	        last = names.pop();
	        prevLast = object.pick.apply(null, names);
	        result = prevLast[last] = props;
	    } else {
	        object.extend(result, props);
	    }

	    return result;
	}

	module.exports = defineNamespace;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview
	 *  This module provides some functions for custom events.<br>
	 *  And it is implemented in the observer design pattern.
	 * @author NHN Ent.
	 *         FE Development Lab <dl_javascript@nhnent.com>
	 */

	'use strict';

	var collection = __webpack_require__(4);
	var type = __webpack_require__(2);
	var object = __webpack_require__(1);

	var R_EVENTNAME_SPLIT = /\s+/g;

	/**
	 * A unit of event handler item.
	 * @ignore
	 * @typedef {object} HandlerItem
	 * @property {function} fn - event handler
	 * @property {object} ctx - context of event handler
	 */

	/**
	 * @class
	 * @memberof tui.util
	 * @example
	 * // node, commonjs
	 * var CustomEvents = require('tui-code-snippet').CustomEvents;
	 * @example
	 * // distribution file, script
	 * <script src='path-to/tui-code-snippt.js'></script>
	 * <script>
	 * var CustomEvents = tui.util.CustomEvents;
	 * </script>
	 */
	function CustomEvents() {
	    /**
	     * @type {HandlerItem[]}
	     */
	    this.events = null;

	    /**
	     * only for checking specific context event was binded
	     * @type {object[]}
	     */
	    this.contexts = null;
	}

	/**
	 * Mixin custom events feature to specific constructor
	 * @param {function} func - constructor
	 * @example
	 * //-- #1. Get Module --//
	 * var CustomEvents = require('tui-code-snippet').CustomEvents; // node, commonjs
	 * var CustomEvents = tui.util.CustomEvents; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var model;
	 * function Model() {
	 *     this.name = '';
	 * }
	 * CustomEvents.mixin(Model);
	 *
	 * model = new Model();
	 * model.on('change', function() { this.name = 'model'; }, this);
	 * model.fire('change');
	 * alert(model.name); // 'model';
	 */
	CustomEvents.mixin = function(func) {
	    object.extend(func.prototype, CustomEvents.prototype);
	};

	/**
	 * Get HandlerItem object
	 * @param {function} handler - handler function
	 * @param {object} [context] - context for handler
	 * @returns {HandlerItem} HandlerItem object
	 * @private
	 */
	CustomEvents.prototype._getHandlerItem = function(handler, context) {
	    var item = {handler: handler};

	    if (context) {
	        item.context = context;
	    }

	    return item;
	};

	/**
	 * Get event object safely
	 * @param {string} [eventName] - create sub event map if not exist.
	 * @returns {(object|array)} event object. if you supplied `eventName`
	 *  parameter then make new array and return it
	 * @private
	 */
	CustomEvents.prototype._safeEvent = function(eventName) {
	    var events = this.events;
	    var byName;

	    if (!events) {
	        events = this.events = {};
	    }

	    if (eventName) {
	        byName = events[eventName];

	        if (!byName) {
	            byName = [];
	            events[eventName] = byName;
	        }

	        events = byName;
	    }

	    return events;
	};

	/**
	 * Get context array safely
	 * @returns {array} context array
	 * @private
	 */
	CustomEvents.prototype._safeContext = function() {
	    var context = this.contexts;

	    if (!context) {
	        context = this.contexts = [];
	    }

	    return context;
	};

	/**
	 * Get index of context
	 * @param {object} ctx - context that used for bind custom event
	 * @returns {number} index of context
	 * @private
	 */
	CustomEvents.prototype._indexOfContext = function(ctx) {
	    var context = this._safeContext();
	    var index = 0;

	    while (context[index]) {
	        if (ctx === context[index][0]) {
	            return index;
	        }

	        index += 1;
	    }

	    return -1;
	};

	/**
	 * Memorize supplied context for recognize supplied object is context or
	 *  name: handler pair object when off()
	 * @param {object} ctx - context object to memorize
	 * @private
	 */
	CustomEvents.prototype._memorizeContext = function(ctx) {
	    var context, index;

	    if (!type.isExisty(ctx)) {
	        return;
	    }

	    context = this._safeContext();
	    index = this._indexOfContext(ctx);

	    if (index > -1) {
	        context[index][1] += 1;
	    } else {
	        context.push([ctx, 1]);
	    }
	};

	/**
	 * Forget supplied context object
	 * @param {object} ctx - context object to forget
	 * @private
	 */
	CustomEvents.prototype._forgetContext = function(ctx) {
	    var context, contextIndex;

	    if (!type.isExisty(ctx)) {
	        return;
	    }

	    context = this._safeContext();
	    contextIndex = this._indexOfContext(ctx);

	    if (contextIndex > -1) {
	        context[contextIndex][1] -= 1;

	        if (context[contextIndex][1] <= 0) {
	            context.splice(contextIndex, 1);
	        }
	    }
	};

	/**
	 * Bind event handler
	 * @param {(string|{name:string, handler:function})} eventName - custom
	 *  event name or an object {eventName: handler}
	 * @param {(function|object)} [handler] - handler function or context
	 * @param {object} [context] - context for binding
	 * @private
	 */
	CustomEvents.prototype._bindEvent = function(eventName, handler, context) {
	    var events = this._safeEvent(eventName);
	    this._memorizeContext(context);
	    events.push(this._getHandlerItem(handler, context));
	};

	/**
	 * Bind event handlers
	 * @param {(string|{name:string, handler:function})} eventName - custom
	 *  event name or an object {eventName: handler}
	 * @param {(function|object)} [handler] - handler function or context
	 * @param {object} [context] - context for binding
	 * //-- #1. Get Module --//
	 * var CustomEvents = require('tui-code-snippet').CustomEvents; // node, commonjs
	 * var CustomEvents = tui.util.CustomEvents; // distribution file
	 *
	 * //-- #2. Use property --//
	 * // # 2.1 Basic Usage
	 * CustomEvents.on('onload', handler);
	 *
	 * // # 2.2 With context
	 * CustomEvents.on('onload', handler, myObj);
	 *
	 * // # 2.3 Bind by object that name, handler pairs
	 * CustomEvents.on({
	 *     'play': handler,
	 *     'pause': handler2
	 * });
	 *
	 * // # 2.4 Bind by object that name, handler pairs with context object
	 * CustomEvents.on({
	 *     'play': handler
	 * }, myObj);
	 */
	CustomEvents.prototype.on = function(eventName, handler, context) {
	    var self = this;

	    if (type.isString(eventName)) {
	        // [syntax 1, 2]
	        eventName = eventName.split(R_EVENTNAME_SPLIT);
	        collection.forEach(eventName, function(name) {
	            self._bindEvent(name, handler, context);
	        });
	    } else if (type.isObject(eventName)) {
	        // [syntax 3, 4]
	        context = handler;
	        collection.forEach(eventName, function(func, name) {
	            self.on(name, func, context);
	        });
	    }
	};

	/**
	 * Bind one-shot event handlers
	 * @param {(string|{name:string,handler:function})} eventName - custom
	 *  event name or an object {eventName: handler}
	 * @param {function|object} [handler] - handler function or context
	 * @param {object} [context] - context for binding
	 */
	CustomEvents.prototype.once = function(eventName, handler, context) {
	    var self = this;

	    if (type.isObject(eventName)) {
	        context = handler;
	        collection.forEach(eventName, function(func, name) {
	            self.once(name, func, context);
	        });

	        return;
	    }

	    function onceHandler() { // eslint-disable-line require-jsdoc
	        handler.apply(context, arguments);
	        self.off(eventName, onceHandler, context);
	    }

	    this.on(eventName, onceHandler, context);
	};

	/**
	 * Splice supplied array by callback result
	 * @param {array} arr - array to splice
	 * @param {function} predicate - function return boolean
	 * @private
	 */
	CustomEvents.prototype._spliceMatches = function(arr, predicate) {
	    var i = 0;
	    var len;

	    if (!type.isArray(arr)) {
	        return;
	    }

	    for (len = arr.length; i < len; i += 1) {
	        if (predicate(arr[i]) === true) {
	            arr.splice(i, 1);
	            len -= 1;
	            i -= 1;
	        }
	    }
	};

	/**
	 * Get matcher for unbind specific handler events
	 * @param {function} handler - handler function
	 * @returns {function} handler matcher
	 * @private
	 */
	CustomEvents.prototype._matchHandler = function(handler) {
	    var self = this;

	    return function(item) {
	        var needRemove = handler === item.handler;

	        if (needRemove) {
	            self._forgetContext(item.context);
	        }

	        return needRemove;
	    };
	};

	/**
	 * Get matcher for unbind specific context events
	 * @param {object} context - context
	 * @returns {function} object matcher
	 * @private
	 */
	CustomEvents.prototype._matchContext = function(context) {
	    var self = this;

	    return function(item) {
	        var needRemove = context === item.context;

	        if (needRemove) {
	            self._forgetContext(item.context);
	        }

	        return needRemove;
	    };
	};

	/**
	 * Get matcher for unbind specific hander, context pair events
	 * @param {function} handler - handler function
	 * @param {object} context - context
	 * @returns {function} handler, context matcher
	 * @private
	 */
	CustomEvents.prototype._matchHandlerAndContext = function(handler, context) {
	    var self = this;

	    return function(item) {
	        var matchHandler = (handler === item.handler);
	        var matchContext = (context === item.context);
	        var needRemove = (matchHandler && matchContext);

	        if (needRemove) {
	            self._forgetContext(item.context);
	        }

	        return needRemove;
	    };
	};

	/**
	 * Unbind event by event name
	 * @param {string} eventName - custom event name to unbind
	 * @param {function} [handler] - handler function
	 * @private
	 */
	CustomEvents.prototype._offByEventName = function(eventName, handler) {
	    var self = this;
	    var forEach = collection.forEachArray;
	    var andByHandler = type.isFunction(handler);
	    var matchHandler = self._matchHandler(handler);

	    eventName = eventName.split(R_EVENTNAME_SPLIT);

	    forEach(eventName, function(name) {
	        var handlerItems = self._safeEvent(name);

	        if (andByHandler) {
	            self._spliceMatches(handlerItems, matchHandler);
	        } else {
	            forEach(handlerItems, function(item) {
	                self._forgetContext(item.context);
	            });

	            self.events[name] = [];
	        }
	    });
	};

	/**
	 * Unbind event by handler function
	 * @param {function} handler - handler function
	 * @private
	 */
	CustomEvents.prototype._offByHandler = function(handler) {
	    var self = this;
	    var matchHandler = this._matchHandler(handler);

	    collection.forEach(this._safeEvent(), function(handlerItems) {
	        self._spliceMatches(handlerItems, matchHandler);
	    });
	};

	/**
	 * Unbind event by object(name: handler pair object or context object)
	 * @param {object} obj - context or {name: handler} pair object
	 * @param {function} handler - handler function
	 * @private
	 */
	CustomEvents.prototype._offByObject = function(obj, handler) {
	    var self = this;
	    var matchFunc;

	    if (this._indexOfContext(obj) < 0) {
	        collection.forEach(obj, function(func, name) {
	            self.off(name, func);
	        });
	    } else if (type.isString(handler)) {
	        matchFunc = this._matchContext(obj);

	        self._spliceMatches(this._safeEvent(handler), matchFunc);
	    } else if (type.isFunction(handler)) {
	        matchFunc = this._matchHandlerAndContext(handler, obj);

	        collection.forEach(this._safeEvent(), function(handlerItems) {
	            self._spliceMatches(handlerItems, matchFunc);
	        });
	    } else {
	        matchFunc = this._matchContext(obj);

	        collection.forEach(this._safeEvent(), function(handlerItems) {
	            self._spliceMatches(handlerItems, matchFunc);
	        });
	    }
	};

	/**
	 * Unbind custom events
	 * @param {(string|object|function)} eventName - event name or context or
	 *  {name: handler} pair object or handler function
	 * @param {(function)} handler - handler function
	 * @example
	 * //-- #1. Get Module --//
	 * var CustomEvents = require('tui-code-snippet').CustomEvents; // node, commonjs
	 * var CustomEvents = tui.util.CustomEvents; // distribution file
	 *
	 * //-- #2. Use property --//
	 * // # 2.1 off by event name
	 * CustomEvents.off('onload');
	 *
	 * // # 2.2 off by event name and handler
	 * CustomEvents.off('play', handler);
	 *
	 * // # 2.3 off by handler
	 * CustomEvents.off(handler);
	 *
	 * // # 2.4 off by context
	 * CustomEvents.off(myObj);
	 *
	 * // # 2.5 off by context and handler
	 * CustomEvents.off(myObj, handler);
	 *
	 * // # 2.6 off by context and event name
	 * CustomEvents.off(myObj, 'onload');
	 *
	 * // # 2.7 off by an Object.<string, function> that is {eventName: handler}
	 * CustomEvents.off({
	 *   'play': handler,
	 *   'pause': handler2
	 * });
	 *
	 * // # 2.8 off the all events
	 * CustomEvents.off();
	 */
	CustomEvents.prototype.off = function(eventName, handler) {
	    if (type.isString(eventName)) {
	        // [syntax 1, 2]
	        this._offByEventName(eventName, handler);
	    } else if (!arguments.length) {
	        // [syntax 8]
	        this.events = {};
	        this.contexts = [];
	    } else if (type.isFunction(eventName)) {
	        // [syntax 3]
	        this._offByHandler(eventName);
	    } else if (type.isObject(eventName)) {
	        // [syntax 4, 5, 6]
	        this._offByObject(eventName, handler);
	    }
	};

	/**
	 * Fire custom event
	 * @param {string} eventName - name of custom event
	 */
	CustomEvents.prototype.fire = function(eventName) {  // eslint-disable-line
	    this.invoke.apply(this, arguments);
	};

	/**
	 * Fire a event and returns the result of operation 'boolean AND' with all
	 *  listener's results.
	 *
	 * So, It is different from {@link CustomEvents#fire}.
	 *
	 * In service code, use this as a before event in component level usually
	 *  for notifying that the event is cancelable.
	 * @param {string} eventName - Custom event name
	 * @param {...*} data - Data for event
	 * @returns {boolean} The result of operation 'boolean AND'
	 * @example
	 * var map = new Map();
	 * map.on({
	 *     'beforeZoom': function() {
	 *         // It should cancel the 'zoom' event by some conditions.
	 *         if (that.disabled && this.getState()) {
	 *             return false;
	 *         }
	 *         return true;
	 *     }
	 * });
	 *
	 * if (this.invoke('beforeZoom')) {    // check the result of 'beforeZoom'
	 *     // if true,
	 *     // doSomething
	 * }
	 */
	CustomEvents.prototype.invoke = function(eventName) {
	    var events, args, index, item;

	    if (!this.hasListener(eventName)) {
	        return true;
	    }

	    events = this._safeEvent(eventName);
	    args = Array.prototype.slice.call(arguments, 1);
	    index = 0;

	    while (events[index]) {
	        item = events[index];

	        if (item.handler.apply(item.context, args) === false) {
	            return false;
	        }

	        index += 1;
	    }

	    return true;
	};

	/**
	 * Return whether at least one of the handlers is registered in the given
	 *  event name.
	 * @param {string} eventName - Custom event name
	 * @returns {boolean} Is there at least one handler in event name?
	 */
	CustomEvents.prototype.hasListener = function(eventName) {
	    return this.getListenerLength(eventName) > 0;
	};

	/**
	 * Return a count of events registered.
	 * @param {string} eventName - Custom event name
	 * @returns {number} number of event
	 */
	CustomEvents.prototype.getListenerLength = function(eventName) {
	    var events = this._safeEvent(eventName);

	    return events.length;
	};

	module.exports = CustomEvents;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview This module provides a Enum Constructor.
	 * @author NHN Ent.
	 *         FE Development Lab <dl_javascript@nhnent.com>
	 * @example
	 * // node, commonjs
	 * var Enum = require('tui-code-snippet').Enum;
	 * @example
	 * // distribution file, script
	 * <script src='path-to/tui-code-snippt.js'></script>
	 * <script>
	 * var Enum = tui.util.Enum;
	 * <script>
	 */

	'use strict';

	var collection = __webpack_require__(4);
	var type = __webpack_require__(2);

	/**
	 * Check whether the defineProperty() method is supported.
	 * @type {boolean}
	 * @ignore
	 */
	var isSupportDefinedProperty = (function() {
	    try {
	        Object.defineProperty({}, 'x', {});

	        return true;
	    } catch (e) {
	        return false;
	    }
	})();

	/**
	 * A unique value of a constant.
	 * @type {number}
	 * @ignore
	 */
	var enumValue = 0;

	/**
	 * Make a constant-list that has unique values.<br>
	 * In modern browsers (except IE8 and lower),<br>
	 *  a value defined once can not be changed.
	 *
	 * @param {...string|string[]} itemList Constant-list (An array of string is available)
	 * @class
	 * @memberof tui.util
	 * @example
	 * //-- #1. Get Module --//
	 * var Enum = require('tui-code-snippet').Enum; // node, commonjs
	 * var Enum = tui.util.Enum; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var MYENUM = new Enum('TYPE1', 'TYPE2');
	 * var MYENUM2 = new Enum(['TYPE1', 'TYPE2']);
	 *
	 * //usage
	 * if (value === MYENUM.TYPE1) {
	 *      ....
	 * }
	 *
	 * //add (If a duplicate name is inputted, will be disregarded.)
	 * MYENUM.set('TYPE3', 'TYPE4');
	 *
	 * //get name of a constant by a value
	 * MYENUM.getName(MYENUM.TYPE1); // 'TYPE1'
	 *
	 * // In modern browsers (except IE8 and lower), a value can not be changed in constants.
	 * var originalValue = MYENUM.TYPE1;
	 * MYENUM.TYPE1 = 1234; // maybe TypeError
	 * MYENUM.TYPE1 === originalValue; // true
	 **/
	function Enum(itemList) {
	    if (itemList) {
	        this.set.apply(this, arguments);
	    }
	}

	/**
	 * Define a constants-list
	 * @param {...string|string[]} itemList Constant-list (An array of string is available)
	 */
	Enum.prototype.set = function(itemList) {
	    var self = this;

	    if (!type.isArray(itemList)) {
	        itemList = collection.toArray(arguments);
	    }

	    collection.forEach(itemList, function itemListIteratee(item) {
	        self._addItem(item);
	    });
	};

	/**
	 * Return a key of the constant.
	 * @param {number} value A value of the constant.
	 * @returns {string|undefined} Key of the constant.
	 */
	Enum.prototype.getName = function(value) {
	    var self = this;
	    var foundedKey;

	    collection.forEach(this, function(itemValue, key) { // eslint-disable-line consistent-return
	        if (self._isEnumItem(key) && value === itemValue) {
	            foundedKey = key;

	            return false;
	        }
	    });

	    return foundedKey;
	};

	/**
	 * Create a constant.
	 * @private
	 * @param {string} name Constant name. (It will be a key of a constant)
	 */
	Enum.prototype._addItem = function(name) {
	    var value;

	    if (!this.hasOwnProperty(name)) {
	        value = this._makeEnumValue();

	        if (isSupportDefinedProperty) {
	            Object.defineProperty(this, name, {
	                enumerable: true,
	                configurable: false,
	                writable: false,
	                value: value
	            });
	        } else {
	            this[name] = value;
	        }
	    }
	};

	/**
	 * Return a unique value for assigning to a constant.
	 * @private
	 * @returns {number} A unique value
	 */
	Enum.prototype._makeEnumValue = function() {
	    var value;

	    value = enumValue;
	    enumValue += 1;

	    return value;
	};

	/**
	 * Return whether a constant from the given key is in instance or not.
	 * @param {string} key - A constant key
	 * @returns {boolean} Result
	 * @private
	 */
	Enum.prototype._isEnumItem = function(key) {
	    return type.isNumber(this[key]);
	};

	module.exports = Enum;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview
	 *  Implements the ExMap (Extended Map) object.
	 * @author NHN Ent.
	 *         FE Development Lab <dl_javascript@nhnent.com>
	 */

	'use strict';

	var collection = __webpack_require__(4);
	var Map = __webpack_require__(18);

	// Caching tui.util for performance enhancing
	var mapAPIsForRead = ['get', 'has', 'forEach', 'keys', 'values', 'entries'];
	var mapAPIsForDelete = ['delete', 'clear'];

	/**
	 * The ExMap object is Extended Version of the tui.util.Map object.<br>
	 * and added some useful feature to make it easy to manage the Map object.
	 * @constructor
	 * @param {Array} initData - Array of key-value pairs (2-element Arrays).
	 *      Each key-value pair will be added to the new Map
	 * @memberof tui.util
	 * @example
	 * // node, commonjs
	 * var ExMap = require('tui-code-snippet').ExMap;
	 * @example
	 * // distribution file, script
	 * <script src='path-to/tui-code-snippt.js'></script>
	 * <script>
	 * var ExMap = tui.util.ExMap;
	 * <script>
	 */
	function ExMap(initData) {
	    this._map = new Map(initData);
	    this.size = this._map.size;
	}

	collection.forEachArray(mapAPIsForRead, function(name) {
	    ExMap.prototype[name] = function() {
	        return this._map[name].apply(this._map, arguments);
	    };
	});

	collection.forEachArray(mapAPIsForDelete, function(name) {
	    ExMap.prototype[name] = function() {
	        var result = this._map[name].apply(this._map, arguments);
	        this.size = this._map.size;

	        return result;
	    };
	});

	ExMap.prototype.set = function() {
	    this._map.set.apply(this._map, arguments);
	    this.size = this._map.size;

	    return this;
	};

	/**
	 * Sets all of the key-value pairs in the specified object to the Map object.
	 * @param  {Object} object - Plain object that has a key-value pair
	 */
	ExMap.prototype.setObject = function(object) {
	    collection.forEachOwnProperties(object, function(value, key) {
	        this.set(key, value);
	    }, this);
	};

	/**
	 * Removes the elements associated with keys in the specified array.
	 * @param  {Array} keys - Array that contains keys of the element to remove
	 */
	ExMap.prototype.deleteByKeys = function(keys) {
	    collection.forEachArray(keys, function(key) {
	        this['delete'](key);
	    }, this);
	};

	/**
	 * Sets all of the key-value pairs in the specified Map object to this Map object.
	 * @param  {Map} map - Map object to be merged into this Map object
	 */
	ExMap.prototype.merge = function(map) {
	    map.forEach(function(value, key) {
	        this.set(key, value);
	    }, this);
	};

	/**
	 * Looks through each key-value pair in the map and returns the new ExMap object of
	 * all key-value pairs that pass a truth test implemented by the provided function.
	 * @param  {function} predicate - Function to test each key-value pair of the Map object.<br>
	 *      Invoked with arguments (value, key). Return true to keep the element, false otherwise.
	 * @returns {ExMap} A new ExMap object
	 */
	ExMap.prototype.filter = function(predicate) {
	    var filtered = new ExMap();

	    this.forEach(function(value, key) {
	        if (predicate(value, key)) {
	            filtered.set(key, value);
	        }
	    });

	    return filtered;
	};

	module.exports = ExMap;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	
	/**
	 * @fileoverview
	 *  Implements the Map object.
	 * @author NHN Ent.
	 *         FE Development Lab <dl_javascript@nhnent.com>
	 */

	'use strict';

	var collection = __webpack_require__(4);
	var type = __webpack_require__(2);
	var array = __webpack_require__(3);
	var browser = __webpack_require__(9);
	var func = __webpack_require__(5);

	/**
	 * Using undefined for a key can be ambiguous if there's deleted item in the array,<br>
	 * which is also undefined when accessed by index.<br>
	 * So use this unique object as an undefined key to distinguish it from deleted keys.
	 * @private
	 * @constant
	 */
	var _KEY_FOR_UNDEFINED = {};

	/**
	 * For using NaN as a key, use this unique object as a NaN key.<br>
	 * This makes it easier and faster to compare an object with each keys in the array<br>
	 * through no exceptional comapring for NaN.
	 * @private
	 * @constant
	 */
	var _KEY_FOR_NAN = {};

	/**
	 * Constructor of MapIterator<br>
	 * Creates iterator object with new keyword.
	 * @constructor
	 * @param  {Array} keys - The array of keys in the map
	 * @param  {function} valueGetter - Function that returns certain value,
	 *      taking key and keyIndex as arguments.
	 * @ignore
	 */
	function MapIterator(keys, valueGetter) {
	    this._keys = keys;
	    this._valueGetter = valueGetter;
	    this._length = this._keys.length;
	    this._index = -1;
	    this._done = false;
	}

	/**
	 * Implementation of Iterator protocol.
	 * @returns {{done: boolean, value: *}} Object that contains done(boolean) and value.
	 */
	MapIterator.prototype.next = function() {
	    var data = {};
	    do {
	        this._index += 1;
	    } while (type.isUndefined(this._keys[this._index]) && this._index < this._length);

	    if (this._index >= this._length) {
	        data.done = true;
	    } else {
	        data.done = false;
	        data.value = this._valueGetter(this._keys[this._index], this._index);
	    }

	    return data;
	};

	/**
	 * The Map object implements the ES6 Map specification as closely as possible.<br>
	 * For using objects and primitive values as keys, this object uses array internally.<br>
	 * So if the key is not a string, get(), set(), has(), delete() will operates in O(n),<br>
	 * and it can cause performance issues with a large dataset.
	 *
	 * Features listed below are not supported. (can't be implented without native support)
	 * - Map object is iterable<br>
	 * - Iterable object can be used as an argument of constructor
	 *
	 * If the browser supports full implementation of ES6 Map specification, native Map obejct
	 * will be used internally.
	 * @class
	 * @param  {Array} initData - Array of key-value pairs (2-element Arrays).
	 *      Each key-value pair will be added to the new Map
	 * @memberof tui.util
	 * @example
	 * // node, commonjs
	 * var Map = require('tui-code-snippet').Map;
	 * @example
	 * // distribution file, script
	 * <script src='path-to/tui-code-snippt.js'></script>
	 * <script>
	 * var Map = tui.util.Map;
	 * <script>
	 */
	function Map(initData) {
	    this._valuesForString = {};
	    this._valuesForIndex = {};
	    this._keys = [];

	    if (initData) {
	        this._setInitData(initData);
	    }

	    this.size = 0;
	}

	/* eslint-disable no-extend-native */
	/**
	 * Add all elements in the initData to the Map object.
	 * @private
	 * @param  {Array} initData - Array of key-value pairs to add to the Map object
	 */
	Map.prototype._setInitData = function(initData) {
	    if (!type.isArray(initData)) {
	        throw new Error('Only Array is supported.');
	    }
	    collection.forEachArray(initData, function(pair) {
	        this.set(pair[0], pair[1]);
	    }, this);
	};

	/**
	 * Returns true if the specified value is NaN.<br>
	 * For unsing NaN as a key, use this method to test equality of NaN<br>
	 * because === operator doesn't work for NaN.
	 * @private
	 * @param {*} value - Any object to be tested
	 * @returns {boolean} True if value is NaN, false otherwise.
	 */
	Map.prototype._isNaN = function(value) {
	    return typeof value === 'number' && value !== value; // eslint-disable-line no-self-compare
	};

	/**
	 * Returns the index of the specified key.
	 * @private
	 * @param  {*} key - The key object to search for.
	 * @returns {number} The index of the specified key
	 */
	Map.prototype._getKeyIndex = function(key) {
	    var result = -1;
	    var value;

	    if (type.isString(key)) {
	        value = this._valuesForString[key];
	        if (value) {
	            result = value.keyIndex;
	        }
	    } else {
	        result = array.inArray(key, this._keys);
	    }

	    return result;
	};

	/**
	 * Returns the original key of the specified key.
	 * @private
	 * @param  {*} key - key
	 * @returns {*} Original key
	 */
	Map.prototype._getOriginKey = function(key) {
	    var originKey = key;
	    if (key === _KEY_FOR_UNDEFINED) {
	        originKey = undefined; // eslint-disable-line no-undefined
	    } else if (key === _KEY_FOR_NAN) {
	        originKey = NaN;
	    }

	    return originKey;
	};

	/**
	 * Returns the unique key of the specified key.
	 * @private
	 * @param  {*} key - key
	 * @returns {*} Unique key
	 */
	Map.prototype._getUniqueKey = function(key) {
	    var uniqueKey = key;
	    if (type.isUndefined(key)) {
	        uniqueKey = _KEY_FOR_UNDEFINED;
	    } else if (this._isNaN(key)) {
	        uniqueKey = _KEY_FOR_NAN;
	    }

	    return uniqueKey;
	};

	/**
	 * Returns the value object of the specified key.
	 * @private
	 * @param  {*} key - The key of the value object to be returned
	 * @param  {number} keyIndex - The index of the key
	 * @returns {{keyIndex: number, origin: *}} Value object
	 */
	Map.prototype._getValueObject = function(key, keyIndex) { // eslint-disable-line consistent-return
	    if (type.isString(key)) {
	        return this._valuesForString[key];
	    }

	    if (type.isUndefined(keyIndex)) {
	        keyIndex = this._getKeyIndex(key);
	    }
	    if (keyIndex >= 0) {
	        return this._valuesForIndex[keyIndex];
	    }
	};

	/**
	 * Returns the original value of the specified key.
	 * @private
	 * @param  {*} key - The key of the value object to be returned
	 * @param  {number} keyIndex - The index of the key
	 * @returns {*} Original value
	 */
	Map.prototype._getOriginValue = function(key, keyIndex) {
	    return this._getValueObject(key, keyIndex).origin;
	};

	/**
	 * Returns key-value pair of the specified key.
	 * @private
	 * @param  {*} key - The key of the value object to be returned
	 * @param  {number} keyIndex - The index of the key
	 * @returns {Array} Key-value Pair
	 */
	Map.prototype._getKeyValuePair = function(key, keyIndex) {
	    return [this._getOriginKey(key), this._getOriginValue(key, keyIndex)];
	};

	/**
	 * Creates the wrapper object of original value that contains a key index
	 * and returns it.
	 * @private
	 * @param  {type} origin - Original value
	 * @param  {type} keyIndex - Index of the key
	 * @returns {{keyIndex: number, origin: *}} Value object
	 */
	Map.prototype._createValueObject = function(origin, keyIndex) {
	    return {
	        keyIndex: keyIndex,
	        origin: origin
	    };
	};

	/**
	 * Sets the value for the key in the Map object.
	 * @param  {*} key - The key of the element to add to the Map object
	 * @param  {*} value - The value of the element to add to the Map object
	 * @returns {Map} The Map object
	 */
	Map.prototype.set = function(key, value) {
	    var uniqueKey = this._getUniqueKey(key);
	    var keyIndex = this._getKeyIndex(uniqueKey);
	    var valueObject;

	    if (keyIndex < 0) {
	        keyIndex = this._keys.push(uniqueKey) - 1;
	        this.size += 1;
	    }
	    valueObject = this._createValueObject(value, keyIndex);

	    if (type.isString(key)) {
	        this._valuesForString[key] = valueObject;
	    } else {
	        this._valuesForIndex[keyIndex] = valueObject;
	    }

	    return this;
	};

	/**
	 * Returns the value associated to the key, or undefined if there is none.
	 * @param  {*} key - The key of the element to return
	 * @returns {*} Element associated with the specified key
	 */
	Map.prototype.get = function(key) {
	    var uniqueKey = this._getUniqueKey(key);
	    var value = this._getValueObject(uniqueKey);

	    return value && value.origin;
	};

	/**
	 * Returns a new Iterator object that contains the keys for each element
	 * in the Map object in insertion order.
	 * @returns {Iterator} A new Iterator object
	 */
	Map.prototype.keys = function() {
	    return new MapIterator(this._keys, func.bind(this._getOriginKey, this));
	};

	/**
	 * Returns a new Iterator object that contains the values for each element
	 * in the Map object in insertion order.
	 * @returns {Iterator} A new Iterator object
	 */
	Map.prototype.values = function() {
	    return new MapIterator(this._keys, func.bind(this._getOriginValue, this));
	};

	/**
	 * Returns a new Iterator object that contains the [key, value] pairs
	 * for each element in the Map object in insertion order.
	 * @returns {Iterator} A new Iterator object
	 */
	Map.prototype.entries = function() {
	    return new MapIterator(this._keys, func.bind(this._getKeyValuePair, this));
	};

	/**
	 * Returns a boolean asserting whether a value has been associated to the key
	 * in the Map object or not.
	 * @param  {*} key - The key of the element to test for presence
	 * @returns {boolean} True if an element with the specified key exists;
	 *          Otherwise false
	 */
	Map.prototype.has = function(key) {
	    return !!this._getValueObject(key);
	};

	/**
	 * Removes the specified element from a Map object.
	 * @param {*} key - The key of the element to remove
	 * @function delete
	 * @memberof tui.util.Map.prototype
	 */
	// cannot use reserved keyword as a property name in IE8 and under.
	Map.prototype['delete'] = function(key) {
	    var keyIndex;

	    if (type.isString(key)) {
	        if (this._valuesForString[key]) {
	            keyIndex = this._valuesForString[key].keyIndex;
	            delete this._valuesForString[key];
	        }
	    } else {
	        keyIndex = this._getKeyIndex(key);
	        if (keyIndex >= 0) {
	            delete this._valuesForIndex[keyIndex];
	        }
	    }

	    if (keyIndex >= 0) {
	        delete this._keys[keyIndex];
	        this.size -= 1;
	    }
	};

	/**
	 * Executes a provided function once per each key/value pair in the Map object,
	 * in insertion order.
	 * @param  {function} callback - Function to execute for each element
	 * @param  {thisArg} thisArg - Value to use as this when executing callback
	 */
	Map.prototype.forEach = function(callback, thisArg) {
	    thisArg = thisArg || this;
	    collection.forEachArray(this._keys, function(key) {
	        if (!type.isUndefined(key)) {
	            callback.call(thisArg, this._getValueObject(key).origin, key, this);
	        }
	    }, this);
	};

	/**
	 * Removes all elements from a Map object.
	 */
	Map.prototype.clear = function() {
	    Map.call(this);
	};
	/* eslint-enable no-extend-native */

	// Use native Map object if exists.
	// But only latest versions of Chrome and Firefox support full implementation.
	(function() {
	    if (window.Map && (
	        (browser.firefox && browser.version >= 37) ||
	            (browser.chrome && browser.version >= 42)
	    )
	    ) {
	        Map = window.Map; // eslint-disable-line no-func-assign
	    }
	})();

	module.exports = Map;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview This module provides the HashMap constructor.
	 * @author NHN Ent.
	 *         FE Development Lab <dl_javascript@nhnent.com>
	 */

	'use strict';

	var collection = __webpack_require__(4);
	var type = __webpack_require__(2);
	/**
	 * All the data in hashMap begin with _MAPDATAPREFIX;
	 * @type {string}
	 * @private
	 */
	var _MAPDATAPREFIX = 'å';

	/**
	 * HashMap can handle the key-value pairs.<br>
	 * Caution:<br>
	 *  HashMap instance has a length property but is not an instance of Array.
	 * @param {Object} [obj] A initial data for creation.
	 * @constructor
	 * @memberof tui.util
	 * @deprecated since version 1.3.0
	 * @example
	 * // node, commonjs
	 * var HashMap = require('tui-code-snippet').HashMap;
	 * var hm = new tui.util.HashMap({
	  'mydata': {
	    'hello': 'imfine'
	  },
	  'what': 'time'
	});
	 * @example
	 * // distribution file, script
	 * <script src='path-to/tui-code-snippt.js'></script>
	 * <script>
	 * var HashMap = tui.util.HashMap;
	 * <script>
	 * var hm = new tui.util.HashMap({
	  'mydata': {
	    'hello': 'imfine'
	  },
	  'what': 'time'
	});
	 */
	function HashMap(obj) {
	    /**
	     * size
	     * @type {number}
	     */
	    this.length = 0;

	    if (obj) {
	        this.setObject(obj);
	    }
	}

	/**
	 * Set a data from the given key with value or the given object.
	 * @param {string|Object} key A string or object for key
	 * @param {*} [value] A data
	 * @example
	 * //-- #1. Get Module --//
	 * var HashMap = require('tui-code-snippet').HashMap; // node, commonjs
	 * var HashMap = tui.util.HashMap; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var hm = new HashMap();
	 * hm.set('key', 'value');
	 * hm.set({
	 *     'key1': 'data1',
	 *     'key2': 'data2'
	 * });
	 */
	HashMap.prototype.set = function(key, value) {
	    if (arguments.length === 2) {
	        this.setKeyValue(key, value);
	    } else {
	        this.setObject(key);
	    }
	};

	/**
	 * Set a data from the given key with value.
	 * @param {string} key A string for key
	 * @param {*} value A data
	 * @example
	 * //-- #1. Get Module --//
	 * var HashMap = require('tui-code-snippet').HashMap; // node, commonjs
	 * var HashMap = tui.util.HashMap; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var hm = new HashMap();
	 * hm.setKeyValue('key', 'value');
	 */
	HashMap.prototype.setKeyValue = function(key, value) {
	    if (!this.has(key)) {
	        this.length += 1;
	    }
	    this[this.encodeKey(key)] = value;
	};

	/**
	 * Set a data from the given object.
	 * @param {Object} obj A object for data
	 * @example
	 * //-- #1. Get Module --//
	 * var HashMap = require('tui-code-snippet').HashMap; // node, commonjs
	 * var HashMap = tui.util.HashMap; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var hm = new HashMap();
	 * hm.setObject({
	 *     'key1': 'data1',
	 *     'key2': 'data2'
	 * });
	 */
	HashMap.prototype.setObject = function(obj) {
	    var self = this;

	    collection.forEachOwnProperties(obj, function(value, key) {
	        self.setKeyValue(key, value);
	    });
	};

	/**
	 * Merge with the given another hashMap.
	 * @param {HashMap} hashMap Another hashMap instance
	 */
	HashMap.prototype.merge = function(hashMap) {
	    var self = this;

	    hashMap.each(function(value, key) {
	        self.setKeyValue(key, value);
	    });
	};

	/**
	 * Encode the given key for hashMap.
	 * @param {string} key A string for key
	 * @returns {string} A encoded key
	 * @private
	 */
	HashMap.prototype.encodeKey = function(key) {
	    return _MAPDATAPREFIX + key;
	};

	/**
	 * Decode the given key in hashMap.
	 * @param {string} key A string for key
	 * @returns {string} A decoded key
	 * @private
	 */
	HashMap.prototype.decodeKey = function(key) {
	    var decodedKey = key.split(_MAPDATAPREFIX);

	    return decodedKey[decodedKey.length - 1];
	};

	/**
	 * Return the value from the given key.
	 * @param {string} key A string for key
	 * @returns {*} The value from a key
	 * @example
	 * //-- #1. Get Module --//
	 * var HashMap = require('tui-code-snippet').HashMap; // node, commonjs
	 * var HashMap = tui.util.HashMap; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var hm = new HashMap();
	 * hm.set('key', 'value');
	 * hm.get('key') // value
	 */
	HashMap.prototype.get = function(key) {
	    return this[this.encodeKey(key)];
	};

	/**
	 * Check the existence of a value from the key.
	 * @param {string} key A string for key
	 * @returns {boolean} Indicating whether a value exists or not.
	 * @example
	 * //-- #1. Get Module --//
	 * var HashMap = require('tui-code-snippet').HashMap; // node, commonjs
	 * var HashMap = tui.util.HashMap; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var hm = new HashMap();
	 * hm.set('key', 'value');
	 * hm.has('key') // true
	 */
	HashMap.prototype.has = function(key) {
	    return this.hasOwnProperty(this.encodeKey(key));
	};

	/**
	 * Remove a data(key-value pairs) from the given key or the given key-list.
	 * @param {...string|string[]} key A string for key
	 * @returns {string|string[]} A removed data
	 * @example
	 * //-- #1. Get Module --//
	 * var HashMap = require('tui-code-snippet').HashMap; // node, commonjs
	 * var HashMap = tui.util.HashMap; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var hm = new HashMap();
	 * hm.set('key', 'value');
	 * hm.set('key2', 'value');
	 *
	 * hm.remove('key');
	 * hm.remove('key', 'key2');
	 * hm.remove(['key', 'key2']);
	 */
	HashMap.prototype.remove = function(key) {
	    if (arguments.length > 1) {
	        key = collection.toArray(arguments);
	    }

	    return type.isArray(key) ? this.removeByKeyArray(key) : this.removeByKey(key);
	};

	/**
	 * Remove data(key-value pair) from the given key.
	 * @param {string} key A string for key
	 * @returns {*|null} A removed data
	 * @example
	 * //-- #1. Get Module --//
	 * var HashMap = require('tui-code-snippet').HashMap; // node, commonjs
	 * var HashMap = tui.util.HashMap; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var hm = new HashMap();
	 * hm.set('key', 'value');
	 * hm.removeByKey('key')
	 */
	HashMap.prototype.removeByKey = function(key) {
	    var data = this.has(key) ? this.get(key) : null;

	    if (data !== null) {
	        delete this[this.encodeKey(key)];
	        this.length -= 1;
	    }

	    return data;
	};

	/**
	 * Remove a data(key-value pairs) from the given key-list.
	 * @param {string[]} keyArray An array of keys
	 * @returns {string[]} A removed data
	 * @example
	 * //-- #1. Get Module --//
	 * var HashMap = require('tui-code-snippet').HashMap; // node, commonjs
	 * var HashMap = tui.util.HashMap; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var hm = new HashMap();
	 * hm.set('key', 'value');
	 * hm.set('key2', 'value');
	 * hm.removeByKeyArray(['key', 'key2']);
	 */
	HashMap.prototype.removeByKeyArray = function(keyArray) {
	    var data = [];
	    var self = this;

	    collection.forEach(keyArray, function(key) {
	        data.push(self.removeByKey(key));
	    });

	    return data;
	};

	/**
	 * Remove all the data
	 */
	HashMap.prototype.removeAll = function() {
	    var self = this;

	    this.each(function(value, key) {
	        self.remove(key);
	    });
	};

	/**
	 * Execute the provided callback once for each all the data.
	 * @param {Function} iteratee Callback function
	 * @example
	 * //-- #1. Get Module --//
	 * var HashMap = require('tui-code-snippet').HashMap; // node, commonjs
	 * var HashMap = tui.util.HashMap; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var hm = new HashMap();
	 * hm.set('key', 'value');
	 * hm.set('key2', 'value');
	 *
	 * hm.each(function(value, key) {
	 *     //do something...
	 * });
	 */
	HashMap.prototype.each = function(iteratee) {
	    var self = this;
	    var flag;

	    collection.forEachOwnProperties(this, function(value, key) { // eslint-disable-line consistent-return
	        if (key.charAt(0) === _MAPDATAPREFIX) {
	            flag = iteratee(value, self.decodeKey(key));
	        }

	        if (flag === false) {
	            return flag;
	        }
	    });
	};

	/**
	 * Return the key-list stored.
	 * @returns {Array} A key-list
	 * @example
	 * //-- #1. Get Module --//
	 * var HashMap = require('tui-code-snippet').HashMap; // node, commonjs
	 * var HashMap = tui.util.HashMap; // distribution file
	 *
	 * //-- #2. Use property --//
	 *  var hm = new HashMap();
	 *  hm.set('key', 'value');
	 *  hm.set('key2', 'value');
	 *  hm.keys();  //['key', 'key2');
	 */
	HashMap.prototype.keys = function() {
	    var keys = [];
	    var self = this;

	    this.each(function(value, key) {
	        keys.push(self.decodeKey(key));
	    });

	    return keys;
	};

	/**
	 * Work similarly to Array.prototype.map().<br>
	 * It executes the provided callback that checks conditions once for each element of hashMap,<br>
	 *  and returns a new array having elements satisfying the conditions
	 * @param {Function} condition A function that checks conditions
	 * @returns {Array} A new array having elements satisfying the conditions
	 * @example
	 * //-- #1. Get Module --//
	 * var HashMap = require('tui-code-snippet').HashMap; // node, commonjs
	 * var HashMap = tui.util.HashMap; // distribution file
	 *
	 * //-- #2. Use property --//
	 * var hm1 = new HashMap();
	 * hm1.set('key', 'value');
	 * hm1.set('key2', 'value');
	 *
	 * hm1.find(function(value, key) {
	 *     return key === 'key2';
	 * }); // ['value']
	 *
	 * var hm2 = new HashMap({
	 *     'myobj1': {
	 *         visible: true
	 *     },
	 *     'mybobj2': {
	 *         visible: false
	 *     }
	 * });
	 *
	 * hm2.find(function(obj, key) {
	 *     return obj.visible === true;
	 * }); // [{visible: true}];
	 */
	HashMap.prototype.find = function(condition) {
	    var founds = [];

	    this.each(function(value, key) {
	        if (condition(value, key)) {
	            founds.push(value);
	        }
	    });

	    return founds;
	};

	/**
	 * Return a new Array having all values.
	 * @returns {Array} A new array having all values
	 */
	HashMap.prototype.toArray = function() {
	    var result = [];

	    this.each(function(v) {
	        result.push(v);
	    });

	    return result;
	};

	module.exports = HashMap;


/***/ })
/******/ ])
});
;