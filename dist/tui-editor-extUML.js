/*!
 * tui-editor
 * @version 1.4.10
 * @author NHN FE Development Lab <dl_javascript@nhn.com> (https://nhn.github.io/tui.editor/)
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory((function webpackLoadOptionalExternalModule() { try { return require("tui-editor"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return require("tui-editor/dist/tui-editor-Viewer"); } catch(e) {} }()), require("plantuml-encoder"));
	else if(typeof define === 'function' && define.amd)
		define(["tui-editor", "tui-editor/dist/tui-editor-Viewer", "plantuml-encoder"], factory);
	else {
		var a = typeof exports === 'object' ? factory((function webpackLoadOptionalExternalModule() { try { return require("tui-editor"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return require("tui-editor/dist/tui-editor-Viewer"); } catch(e) {} }()), require("plantuml-encoder")) : factory(root["tui"]["Editor"], root["tui"]["Editor"], root["plantumlEncoder"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function(__WEBPACK_EXTERNAL_MODULE__4__, __WEBPACK_EXTERNAL_MODULE__5__, __WEBPACK_EXTERNAL_MODULE__44__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 43);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
* @fileoverview Editor/Viewer proxy for extensions
* @author NHN FE Development Lab <dl_javascript@nhn.com>
*/
/* eslint global-require: 0 no-empty: 0 */

var Editor = void 0;
try {
  Editor = __webpack_require__(4);
} catch (e) {}
if (!Editor) {
  try {
    Editor = __webpack_require__(5);
  } catch (e) {}
}

exports.default = Editor;

/***/ }),

/***/ 4:
/***/ (function(module, exports) {

if(typeof __WEBPACK_EXTERNAL_MODULE__4__ === 'undefined') {var e = new Error("Cannot find module 'undefined'"); e.code = 'MODULE_NOT_FOUND'; throw e;}
module.exports = __WEBPACK_EXTERNAL_MODULE__4__;

/***/ }),

/***/ 43:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _plantumlEncoder = __webpack_require__(44);

var _plantumlEncoder2 = _interopRequireDefault(_plantumlEncoder);

var _editorProxy = __webpack_require__(1);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @fileoverview Implements UML extension
* @author NHN FE Development Lab <dl_javascript@nhn.com>
*/
var codeBlockManager = _editorProxy2.default.codeBlockManager;

var DEFAULT_RENDERER_URL = 'http://www.plantuml.com/plantuml/png/';
var UML_LANGUAGES = ['uml', 'plantuml'];

/**
 * plant uml plugin
 * @param {Editor} editor - editor
 * @param {object} [options={}] - plugin options
 * @param {string} options.rendererURL - plant uml renderer url
 * @ignore
 */
function umlExtension(editor) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$rendererURL = options.rendererURL,
      rendererURL = _options$rendererURL === undefined ? DEFAULT_RENDERER_URL : _options$rendererURL;

  /**
   * render html from uml
   * @param {string} umlCode - plant uml code text
   * @returns {string} - rendered html
   */

  function plantUMLReplacer(umlCode) {
    var renderedHTML = void 0;

    try {
      if (!_plantumlEncoder2.default) {
        throw new Error('plantuml-encoder dependency required');
      }
      renderedHTML = '<img src="' + rendererURL + _plantumlEncoder2.default.encode(umlCode) + '" />';
    } catch (err) {
      renderedHTML = 'Error occurred on encoding uml: ' + err.message;
    }

    return renderedHTML;
  }

  var codeBlockLanguages = editor.options.codeBlockLanguages;

  UML_LANGUAGES.forEach(function (umlLanguage) {
    if (codeBlockLanguages.indexOf(umlLanguage) < 0) {
      codeBlockLanguages.push(umlLanguage);
    }
    codeBlockManager.setReplacer(umlLanguage, plantUMLReplacer);
  });
}

_editorProxy2.default.defineExtension('uml', umlExtension);

exports.default = umlExtension;

/***/ }),

/***/ 44:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__44__;

/***/ }),

/***/ 5:
/***/ (function(module, exports) {

if(typeof __WEBPACK_EXTERNAL_MODULE__5__ === 'undefined') {var e = new Error("Cannot find module 'undefined'"); e.code = 'MODULE_NOT_FOUND'; throw e;}
module.exports = __WEBPACK_EXTERNAL_MODULE__5__;

/***/ })

/******/ });
});