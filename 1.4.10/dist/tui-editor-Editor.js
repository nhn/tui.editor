/*!
 * tui-editor
 * @version 1.4.10
 * @author NHN FE Development Lab <dl_javascript@nhn.com> (https://nhn.github.io/tui.editor/)
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jquery"), require("tui-code-snippet"), require("codemirror"), require("to-mark"), require("markdown-it"), require("highlight.js"), require("squire-rte"));
	else if(typeof define === 'function' && define.amd)
		define(["jquery", "tui-code-snippet", "codemirror", "to-mark", "markdown-it", "highlight.js", "squire-rte"], factory);
	else if(typeof exports === 'object')
		exports["Editor"] = factory(require("jquery"), require("tui-code-snippet"), require("codemirror"), require("to-mark"), require("markdown-it"), require("highlight.js"), require("squire-rte"));
	else
		root["tui"] = root["tui"] || {}, root["tui"]["Editor"] = factory(root["$"], root["tui"]["util"], root["CodeMirror"], root["toMark"], root["markdownit"], root["hljs"], root["Squire"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__0__, __WEBPACK_EXTERNAL_MODULE__1__, __WEBPACK_EXTERNAL_MODULE__6__, __WEBPACK_EXTERNAL_MODULE__18__, __WEBPACK_EXTERNAL_MODULE__23__, __WEBPACK_EXTERNAL_MODULE__32__, __WEBPACK_EXTERNAL_MODULE__67__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 45);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__0__;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements CommandManager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _command = __webpack_require__(22);

var _command2 = _interopRequireDefault(_command);

var _util = __webpack_require__(14);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KEYMAP_OS_INDEX = _util.isMac ? 1 : 0;

/**
 * Class CommandManager
 * @param {ToastUIEditor} base nedInstance
 * @param {object} [options={}] - option object
 *     @param {boolean} [options.useCommandShortcut=true] - execute command with keyMap
 * @ignore
 */

var CommandManager = function () {
  function CommandManager(base) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, CommandManager);

    this._command = new _tuiCodeSnippet2.default.Map();
    this._mdCommand = new _tuiCodeSnippet2.default.Map();
    this._wwCommand = new _tuiCodeSnippet2.default.Map();
    this._options = _jquery2.default.extend({
      'useCommandShortcut': true
    }, options);

    this.base = base;

    this.keyMapCommand = {};

    this._initEvent();
  }

  /**
   * You can change command before command addition by addCommandBefore event.
   * @param {object} command - command
   * @returns {object}
   * @private
   */


  _createClass(CommandManager, [{
    key: '_addCommandBefore',
    value: function _addCommandBefore(command) {
      var commandWrapper = { command: command };

      this.base.eventManager.emit('addCommandBefore', commandWrapper);

      return commandWrapper.command || command;
    }

    /**
     * Add command
     * @param {Command} command Command instance
     * @returns {Command} Command
     */

  }, {
    key: 'addCommand',
    value: function addCommand(command) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (args.length) {
        command = CommandManager.command.apply(CommandManager, [command].concat(args));
      }

      command = this._addCommandBefore(command);

      var name = command.getName();

      var commandBase = void 0;

      if (command.isMDType()) {
        commandBase = this._mdCommand;
      } else if (command.isWWType()) {
        commandBase = this._wwCommand;
      } else if (command.isGlobalType()) {
        commandBase = this._command;
      }

      commandBase.set(name, command);

      if (command.keyMap) {
        this.keyMapCommand[command.keyMap[KEYMAP_OS_INDEX]] = name;
      }

      return command;
    }

    /**
     * _initEvent
     * Bind event handler to eventManager
     * @private
     */

  }, {
    key: '_initEvent',
    value: function _initEvent() {
      var _this = this;

      this.base.eventManager.listen('command', function () {
        _this.exec.apply(_this, arguments);
      });

      this.base.eventManager.listen('keyMap', function (ev) {
        if (!_this._options.useCommandShortcut) {
          return;
        }
        var command = _this.keyMapCommand[ev.keyMap];

        if (command) {
          ev.data.preventDefault();
          _this.exec(command);
        }
      });
    }

    /**
     * Execute command
     * @param {String} name Command name
     * @param {*} ...args Command argument
     * @returns {*}
     */

  }, {
    key: 'exec',
    value: function exec(name) {
      var commandToRun = void 0,
          result = void 0;
      var context = this.base;

      commandToRun = this._command.get(name);

      if (!commandToRun) {
        if (this.base.isMarkdownMode()) {
          commandToRun = this._mdCommand.get(name);
          context = this.base.mdEditor;
        } else {
          commandToRun = this._wwCommand.get(name);
          context = this.base.wwEditor;
        }
      }

      if (commandToRun) {
        var _commandToRun;

        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        args.unshift(context);
        result = (_commandToRun = commandToRun).exec.apply(_commandToRun, args);
      }

      return result;
    }
  }]);

  return CommandManager;
}();

/**
 * Create command by given editor type and property object
 * @param {string} type Command type
 * @param {{name: string, keyMap: Array}} props Property
 * @returns {*}
 * @static
 */


CommandManager.command = function (type, props) {
  var command = _command2.default.factory(type, props.name, props.keyMap);

  _tuiCodeSnippet2.default.extend(command, props);

  return command;
};

exports.default = CommandManager;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.I18n = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements i18n
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sharedInstance = void 0;

var DEFAULT_CODE = 'en_US';

/**
 * Class I18n
 */

var I18n = function () {
  function I18n() {
    _classCallCheck(this, I18n);

    this._code = DEFAULT_CODE;
    this._langs = new _tuiCodeSnippet2.default.Map();
  }

  /**
   * Set locale code
   * @param {string} code locale code
   */


  _createClass(I18n, [{
    key: 'setCode',
    value: function setCode(code) {
      this._code = code;
    }

    /**
     * Set language set
     * @param {string|string[]} codes locale code
     * @param {object} data language set
     */

  }, {
    key: 'setLanguage',
    value: function setLanguage(codes, data) {
      var _this = this;

      codes = [].concat(codes);

      codes.forEach(function (code) {
        if (!_this._langs.has(code)) {
          _this._langs.set(code, data);
        } else {
          var langData = _this._langs.get(code);
          _this._langs.set(code, _tuiCodeSnippet2.default.extend(langData, data));
        }
      });
    }

    /**
     * Get text of key
     * @param {string} key key of text
     * @param {string} code locale code
     * @returns {string}
     */

  }, {
    key: 'get',
    value: function get(key, code) {
      if (!code) {
        code = this._code;
      }

      var langSet = this._langs.get(code);

      if (!langSet) {
        langSet = this._langs.get(DEFAULT_CODE);
      }

      var text = langSet[key];

      if (!text) {
        throw new Error('There is no text key "' + key + '" in ' + code);
      }

      return text;
    }
  }], [{
    key: 'getSharedInstance',
    value: function getSharedInstance() {
      if (!sharedInstance) {
        sharedInstance = new I18n();
      }

      return sharedInstance;
    }
  }]);

  return I18n;
}();

exports.I18n = I18n;
exports.default = new I18n();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileoverview DOM Utils
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
var FIND_ZWB = /\u200B/g;

/**
 * Check if node is text node
 * @param {Node} node node to check
 * @returns {boolean} result
 * @ignore
 */
var isTextNode = function isTextNode(node) {
  return node && node.nodeType === Node.TEXT_NODE;
};

/**
 * Check if node is element node
 * @param {Node} node node to check
 * @returns {boolean} result
 * @ignore
 */
var isElemNode = function isElemNode(node) {
  return node && node.nodeType === Node.ELEMENT_NODE;
};

/**
 * Check that the node is block node
 * @param {Node} node node
 * @returns {boolean}
 * @ignore
 */
var isBlockNode = function isBlockNode(node) {
  return (/^(ADDRESS|ARTICLE|ASIDE|BLOCKQUOTE|DETAILS|DIALOG|DD|DIV|DL|DT|FIELDSET|FIGCAPTION|FIGURE|FOOTER|FORM|H[\d]|HEADER|HGROUP|HR|LI|MAIN|NAV|OL|P|PRE|SECTION|UL)$/ig.test(this.getNodeName(node))
  );
};

/**
 * Get node name of node
 * @param {Node} node node
 * @returns {string} node name
 * @ignore
 */
var getNodeName = function getNodeName(node) {
  if (isElemNode(node)) {
    return node.tagName;
  }

  return 'TEXT';
};

/**
 * Get node offset length of node(for Range API)
 * @param {Node} node node
 * @returns {number} length
 * @ignore
 */
var getTextLength = function getTextLength(node) {
  var len = void 0;

  if (isElemNode(node)) {
    len = node.textContent.replace(FIND_ZWB, '').length;
  } else if (isTextNode(node)) {
    len = node.nodeValue.replace(FIND_ZWB, '').length;
  }

  return len;
};

/**
 * Get node offset length of node(for Range API)
 * @param {Node} node node
 * @returns {number} length
 * @ignore
 */
var getOffsetLength = function getOffsetLength(node) {
  var len = void 0;

  if (isElemNode(node)) {
    len = node.childNodes.length;
  } else if (isTextNode(node)) {
    len = node.nodeValue.replace(FIND_ZWB, '').length;
  }

  return len;
};

/**
 * get node offset between parent's childnodes
 * @param {Node} node node
 * @returns {number} offset(index)
 * @ignore
 */
var getNodeOffsetOfParent = function getNodeOffsetOfParent(node) {
  var childNodesOfParent = node.parentNode.childNodes;
  var i = void 0,
      t = void 0,
      found = void 0;

  for (i = 0, t = childNodesOfParent.length; i < t; i += 1) {
    if (childNodesOfParent[i] === node) {
      found = i;
      break;
    }
  }

  return found;
};

/**
 * get child node by offset
 * @param {Node} node node
 * @param {number} index offset index
 * @returns {Node} foudned node
 * @ignore
 */
var getChildNodeByOffset = function getChildNodeByOffset(node, index) {
  var currentNode = void 0;

  if (isTextNode(node)) {
    currentNode = node;
  } else if (node.childNodes.length && index >= 0) {
    currentNode = node.childNodes[index];
  }

  return currentNode;
};

/**
 * find next node from passed node
 * @param {strong} direction previous or next
 * @param {Node} node node
 * @param {string} untilNodeName parent node name to limit
 * @returns {Node} founded node
 * @ignore
 */
var getNodeWithDirectionUntil = function getNodeWithDirectionUntil(direction, node, untilNodeName) {
  var directionKey = direction + 'Sibling';
  var nodeName = void 0,
      foundedNode = void 0;

  while (node && !node[directionKey]) {
    nodeName = getNodeName(node.parentNode);

    if (nodeName === untilNodeName || nodeName === 'BODY') {
      break;
    }

    node = node.parentNode;
  }

  if (node[directionKey]) {
    foundedNode = node[directionKey];
  }

  return foundedNode;
};

/**
 * get prev node of childnode pointed with index
 * @param {Node} node node
 * @param {number} index offset index
 * @param {string} untilNodeName parent node name to limit
 * @returns {Node} founded node
 * @ignore
 */
var getPrevOffsetNodeUntil = function getPrevOffsetNodeUntil(node, index, untilNodeName) {
  var prevNode = void 0;

  if (index > 0) {
    prevNode = getChildNodeByOffset(node, index - 1);
  } else {
    prevNode = getNodeWithDirectionUntil('previous', node, untilNodeName);
  }

  return prevNode;
};

var getParentUntilBy = function getParentUntilBy(node, matchCondition, stopCondition) {
  var foundedNode = void 0;

  while (node.parentNode && !matchCondition(node.parentNode)) {
    node = node.parentNode;

    if (stopCondition && stopCondition(node.parentNode)) {
      break;
    }
  }

  if (matchCondition(node.parentNode)) {
    foundedNode = node;
  }

  return foundedNode;
};

/**
 * get parent node until paseed node name
 * @param {Node} node node
 * @param {string|HTMLNode} untilNode node name or node to limit
 * @returns {Node} founded node
 * @ignore
 */
var getParentUntil = function getParentUntil(node, untilNode) {
  var foundedNode = void 0;

  if (_tuiCodeSnippet2.default.isString(untilNode)) {
    foundedNode = getParentUntilBy(node, function (targetNode) {
      return untilNode === getNodeName(targetNode);
    });
  } else {
    foundedNode = getParentUntilBy(node, function (targetNode) {
      return untilNode === targetNode;
    });
  }

  return foundedNode;
};

/**
 * get node on the given direction under given parent
 * @param {strong} direction previous or next
 * @param {Node} node node
 * @param {string|Node} underNode parent node name to limit
 * @returns {Node} founded node
 * @ignore
 */
var getNodeWithDirectionUnderParent = function getNodeWithDirectionUnderParent(direction, node, underNode) {
  var directionKey = direction + 'Sibling';
  var foundedNode = void 0;

  node = getParentUntil(node, underNode);

  if (node && node[directionKey]) {
    foundedNode = node[directionKey];
  }

  return foundedNode;
};

/**
 * get top previous top level node under given node
 * @param {Node} node node
 * @param {Node} underNode underNode
 * @returns {Node} founded node
 * @ignore
 */
var getTopPrevNodeUnder = function getTopPrevNodeUnder(node, underNode) {
  return getNodeWithDirectionUnderParent('previous', node, underNode);
};

/**
 * get next top level block node
 * @param {Node} node node
 * @param {Node} underNode underNode
 * @returns {Node} founded node
 * @ignore
 */
var getTopNextNodeUnder = function getTopNextNodeUnder(node, underNode) {
  return getNodeWithDirectionUnderParent('next', node, underNode);
};

/**
 * Get parent element the body element
 * @param {Node} node Node for start searching
 * @returns {Node}
 * @ignore
 */
var getTopBlockNode = function getTopBlockNode(node) {
  return getParentUntil(node, 'BODY');
};

/**
 * Get previous text node
 * @param {Node} node Node for start searching
 * @returns {Node}
 * @ignore
 */
var getPrevTextNode = function getPrevTextNode(node) {
  node = node.previousSibling || node.parentNode;

  while (!isTextNode(node) && getNodeName(node) !== 'BODY') {
    if (node.previousSibling) {
      node = node.previousSibling;

      while (node.lastChild) {
        node = node.lastChild;
      }
    } else {
      node = node.parentNode;
    }
  }

  if (getNodeName(node) === 'BODY') {
    node = null;
  }

  return node;
};

/**
 * test whether root contains the given node
 * @param {HTMLNode} root - root node
 * @param {HTMLNode} node - node to test
 * @returns {Boolean} true if root contains node
 * @ignore
 */
var containsNode = function containsNode(root, node) {
  var walker = document.createTreeWalker(root, 4, null, false);
  var found = root === node;

  while (!found && walker.nextNode()) {
    found = walker.currentNode === node;
  }

  return found;
};

/**
 * find node by offset
 * @param {HTMLElement} root Root element
 * @param {Array.<number>} offsetList offset list
 * @param {function} textNodeFilter Text node filter
 * @returns {Array}
 * @ignore
 */
var findOffsetNode = function findOffsetNode(root, offsetList, textNodeFilter) {
  var result = [];
  var text = '';
  var walkerOffset = 0;
  var newWalkerOffset = void 0;

  if (!offsetList.length) {
    return result;
  }

  var offset = offsetList.shift();
  var walker = document.createTreeWalker(root, 4, null, false);

  while (walker.nextNode()) {
    text = walker.currentNode.nodeValue || '';

    if (textNodeFilter) {
      text = textNodeFilter(text);
    }

    newWalkerOffset = walkerOffset + text.length;

    while (newWalkerOffset >= offset) {
      result.push({
        container: walker.currentNode,
        offsetInContainer: offset - walkerOffset,
        offset: offset
      });

      if (!offsetList.length) {
        return result;
      }
      offset = offsetList.shift();
    }
    walkerOffset = newWalkerOffset;
  }

  // there should be offset left
  do {
    result.push({
      container: walker.currentNode,
      offsetInContainer: text.length,
      offset: offset
    });
    offset = offsetList.shift();
  } while (!_tuiCodeSnippet2.default.isUndefined(offset));

  return result;
};

var getNodeInfo = function getNodeInfo(node) {
  var path = {};

  path.tagName = node.nodeName;

  if (node.id) {
    path.id = node.id;
  }

  var className = node.className.trim();

  if (className) {
    path.className = className;
  }

  return path;
};

var getPath = function getPath(node, root) {
  var paths = [];

  while (node && node !== root) {
    if (isElemNode(node)) {
      paths.unshift(getNodeInfo(node));
    }

    node = node.parentNode;
  }

  return paths;
};

/**
 * Find next, previous TD or TH element by given TE element
 * @param {HTMLElement} node TD element
 * @param {string} direction 'next' or 'previous'
 * @returns {HTMLElement|null}
 * @ignore
 */
var getTableCellByDirection = function getTableCellByDirection(node, direction) {
  var targetElement = null;

  if (!_tuiCodeSnippet2.default.isUndefined(direction) && (direction === 'next' || direction === 'previous')) {
    if (direction === 'next') {
      targetElement = node.nextElementSibling;
    } else {
      targetElement = node.previousElementSibling;
    }
  }

  return targetElement;
};

/**
 * Find sibling TR's TD element by given TD and direction
 * @param {HTMLElement} node TD element
 * @param {string} direction Boolean value for find first TD in next line
 * @param {boolean} [needEdgeCell=false] Boolean value for find first TD in next line
 * @returns {HTMLElement|null}
 * @ignore
 */
var getSiblingRowCellByDirection = function getSiblingRowCellByDirection(node, direction, needEdgeCell) {
  var tableCellElement = null;
  var $node = void 0,
      index = void 0,
      $targetRowElement = void 0,
      $currentContainer = void 0,
      $siblingContainer = void 0,
      isSiblingContainerExists = void 0;

  if (!_tuiCodeSnippet2.default.isUndefined(direction) && (direction === 'next' || direction === 'previous')) {
    if (node) {
      $node = (0, _jquery2.default)(node);

      if (direction === 'next') {
        $targetRowElement = $node.parent().next();
        $currentContainer = $node.parents('thead');
        $siblingContainer = $currentContainer[0] && $currentContainer.next();
        isSiblingContainerExists = $siblingContainer && getNodeName($siblingContainer[0]) === 'TBODY';

        index = 0;
      } else {
        $targetRowElement = $node.parent().prev();
        $currentContainer = $node.parents('tbody');
        $siblingContainer = $currentContainer[0] && $currentContainer.prev();
        isSiblingContainerExists = $siblingContainer && getNodeName($siblingContainer[0]) === 'THEAD';

        index = node.parentNode.childNodes.length - 1;
      }

      if (_tuiCodeSnippet2.default.isUndefined(needEdgeCell) || !needEdgeCell) {
        index = getNodeOffsetOfParent(node);
      }

      if ($targetRowElement[0]) {
        tableCellElement = $targetRowElement.children('td,th')[index];
      } else if ($currentContainer[0] && isSiblingContainerExists) {
        tableCellElement = $siblingContainer.find('td,th')[index];
      }
    }
  }

  return tableCellElement;
};

/**
 * Check that the inline node is supported by markdown
 * @param {Node} node TD element
 * @returns {boolean}
 * @ignore
 */
var isMDSupportInlineNode = function isMDSupportInlineNode(node) {
  return (/^(A|B|BR|CODE|DEL|EM|I|IMG|S|SPAN|STRONG)$/ig.test(node.nodeName)
  );
};

/**
 * Check that node is styled node.
 * Styled node is a node that has text and decorates text.
 * @param {Node} node TD element
 * @returns {boolean}
 * @ignore
 */
var isStyledNode = function isStyledNode(node) {
  return (/^(A|ABBR|ACRONYM|B|BDI|BDO|BIG|CITE|CODE|DEL|DFN|EM|I|INS|KBD|MARK|Q|S|SAMP|SMALL|SPAN|STRONG|SUB|SUP|U|VAR)$/ig.test(node.nodeName)
  );
};

/**
 * remove node from 'start' node to 'end-1' node inside parent
 * if 'end' node is null, remove all child nodes after 'start' node.
 * @param {Node} parent - parent node
 * @param {Node} start - start node to remove
 * @param {Node} end - end node to remove
 * @ignore
 */
var removeChildFromStartToEndNode = function removeChildFromStartToEndNode(parent, start, end) {
  var child = start;

  if (!child || parent !== child.parentNode) {
    return;
  }

  while (child !== end) {
    var next = child.nextSibling;
    parent.removeChild(child);
    child = next;
  }
};

/**
 * remove nodes along the direction from the node to reach targetParent node
 * @param {Node} targetParent - stop removing when reach target parent node
 * @param {Node} node - start node
 * @param {boolean} isForward - direction
 * @ignore
 */
var removeNodesByDirection = function removeNodesByDirection(targetParent, node, isForward) {
  var parent = node;

  while (parent !== targetParent) {
    var nextParent = parent.parentNode;
    var _parent = parent,
        nextSibling = _parent.nextSibling,
        previousSibling = _parent.previousSibling;


    if (!isForward && nextSibling) {
      removeChildFromStartToEndNode(nextParent, nextSibling, null);
    } else if (isForward && previousSibling) {
      removeChildFromStartToEndNode(nextParent, nextParent.childNodes[0], parent);
    }

    parent = nextParent;
  }
};

var getLeafNode = function getLeafNode(node) {
  var result = node;
  while (result.childNodes && result.childNodes.length) {
    var _result = result,
        nextLeaf = _result.firstChild;

    // When inline tag have empty text node with other childnodes, ignore empty text node.

    if (isTextNode(nextLeaf) && !getTextLength(nextLeaf)) {
      result = nextLeaf.nextSibling || nextLeaf;
    } else {
      result = nextLeaf;
    }
  }

  return result;
};
/**
 * check if a coordinates is inside a task box
 * @param {object} style - computed style of task box
 * @param {number} offsetX - event x offset
 * @param {number} offsetY - event y offset
 * @returns {boolean}
 * @ignore
 */
var isInsideTaskBox = function isInsideTaskBox(style, offsetX, offsetY) {
  var rect = {
    left: parseInt(style.left, 10),
    top: parseInt(style.top, 10),
    width: parseInt(style.width, 10),
    height: parseInt(style.height, 10)
  };

  return offsetX >= rect.left && offsetX <= rect.left + rect.width && offsetY >= rect.top && offsetY <= rect.top + rect.height;
};

/**
 * Check whether node is OL or UL
 * @param {node} node - node
 * @returns {boolean} - whether node is OL or UL
 * @ignore
 */
var isListNode = function isListNode(node) {
  if (!node) {
    return false;
  }

  return node.nodeName === 'UL' || node.nodeName === 'OL';
};

/**
 * Check whether node is first list item
 * @param {node} node - node
 * @returns {boolean} whether node is first list item
 * @ignore
 */
var isFirstListItem = function isFirstListItem(node) {
  var nodeName = node.nodeName,
      parentNode = node.parentNode;


  return nodeName === 'LI' && node === parentNode.firstChild;
};

/**
 * Check whether node is first level list item
 * @param {node} node - node
 * @returns {boolean} whether node is first level list item
 * @ignore
 */
var isFirstLevelListItem = function isFirstLevelListItem(node) {
  var nodeName = node.nodeName,
      listNode = node.parentNode;
  var listParentNode = listNode.parentNode;


  return nodeName === 'LI' && !isListNode(listParentNode);
};

/**
 * Merge node to target node and detach node
 * @param {node} node - node
 * @param {node} targetNode - target node
 * @ignore
 */
var mergeNode = function mergeNode(node, targetNode) {
  if (node.hasChildNodes()) {
    _tuiCodeSnippet2.default.forEachArray(node.childNodes, function () {
      targetNode.appendChild(node.firstChild);
    });

    targetNode.normalize();
  }

  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
};

/**
 * Create hr that is not contenteditable
 * @returns {node} hr is wraped div
 * @ignore
 */
var createHorizontalRule = function createHorizontalRule() {
  var div = document.createElement('div');
  var hr = document.createElement('hr');

  div.setAttribute('contenteditable', false);
  hr.setAttribute('contenteditable', false);

  div.appendChild(hr);

  return div;
};

/**
 * Create Empty Line
 * @returns {node} <div><br></div>
 * @private
 */
var createEmptyLine = function createEmptyLine() {
  var div = document.createElement('div');
  div.appendChild(document.createElement('br'));

  return div;
};

/**
 * Find same tagName child node and change wrapping order.
 * For example, if below node need to optimize 'B' tag.
 * <i><s><b>test</b></s></i>
 * should be changed tag's order.
 * <b><i><s>test</s></i></b>
 * @param {node} node
 * @param {string} tagName
 * @returns {node}
 * @private
 */
var changeTagOrder = function changeTagOrder(node, tagName) {
  if (node.nodeName !== 'SPAN') {
    var parentNode = node.parentNode;

    var tempNode = node;

    while (tempNode.childNodes && tempNode.childNodes.length === 1 && !isTextNode(tempNode.firstChild)) {
      tempNode = tempNode.firstChild;

      if (tempNode.nodeName === 'SPAN') {
        break;
      }

      if (tempNode.nodeName === tagName) {
        var wrapper = document.createElement(tagName);

        mergeNode(tempNode, tempNode.parentNode);
        parentNode.replaceChild(wrapper, node);
        wrapper.appendChild(node);

        return wrapper;
      }
    }
  }

  return node;
};

/**
 * Find same tagName nodes and merge from startNode to endNode.
 * @param {node} startNode
 * @param {node} endNode
 * @param {string} tagName
 * @returns {node}
 * @private
 */
var mergeSameNodes = function mergeSameNodes(startNode, endNode, tagName) {
  var startBlockNode = changeTagOrder(startNode, tagName);

  if (startBlockNode.nodeName === tagName) {
    var endBlockNode = changeTagOrder(endNode, tagName);
    var mergeTargetNode = startBlockNode;
    var nextNode = startBlockNode.nextSibling;

    while (nextNode) {
      var tempNext = nextNode.nextSibling;

      nextNode = changeTagOrder(nextNode, tagName);

      if (nextNode.nodeName === tagName) {
        // eslint-disable-next-line max-depth
        if (mergeTargetNode) {
          mergeNode(nextNode, mergeTargetNode);
        } else {
          mergeTargetNode = nextNode;
        }
      } else {
        mergeTargetNode = null;
      }

      if (nextNode === endBlockNode) {
        break;
      }

      nextNode = tempNext;
    }
  }
};

/**
 * Find same tagName nodes in range and merge nodes.
 * For example range is like this
 * <s><b>AAA</b></s><b>BBB</b>
 * nodes is changed below
 * <b><s>AAA</s>BBB</b>
 * @param {range} range
 * @param {string} tagName
 * @private
 */
var optimizeRange = function optimizeRange(range, tagName) {
  var collapsed = range.collapsed,
      commonAncestorContainer = range.commonAncestorContainer,
      startContainer = range.startContainer,
      endContainer = range.endContainer;


  if (!collapsed) {
    var optimizedNode = null;

    if (startContainer !== endContainer) {
      mergeSameNodes(getParentUntil(startContainer, commonAncestorContainer), getParentUntil(endContainer, commonAncestorContainer), tagName);

      optimizedNode = commonAncestorContainer;
    } else if (isTextNode(startContainer)) {
      optimizedNode = startContainer.parentNode;
    }

    if (optimizedNode && optimizedNode.nodeName === tagName) {
      var _optimizedNode = optimizedNode,
          previousSibling = _optimizedNode.previousSibling;

      var tempNode = void 0;

      if (previousSibling) {
        tempNode = changeTagOrder(previousSibling);

        if (tempNode.nodeName === tagName) {
          mergeNode(optimizedNode, tempNode);
        }
      }

      var _optimizedNode2 = optimizedNode,
          nextSibling = _optimizedNode2.nextSibling;


      if (nextSibling) {
        tempNode = changeTagOrder(nextSibling);

        if (tempNode.nodeName === tagName) {
          mergeNode(tempNode, optimizedNode);
        }
      }
    }
  }
};

/**
 * Gets all text node from root element.
 * @param {HTMLElement} root Root element
 * @returns {Array} list of text nodes
 * @ignore
 */
var getAllTextNode = function getAllTextNode(root) {
  var walker = document.createTreeWalker(root, 4, null, false);
  var result = [];

  while (walker.nextNode()) {
    var node = walker.currentNode;

    if (isTextNode(node)) {
      result.push(node);
    }
  }

  return result;
};

/**
 * Check whether the node is 'TD' or 'TH'
 * @param {HTMLElement} node - the target node
 * @returns {boolean} - whether the node is 'TD' or 'TH'
 * @ignore
 */
var isCellNode = function isCellNode(node) {
  if (!node) {
    return false;
  }

  return node.nodeName === 'TD' || node.nodeName === 'TH';
};

/**
 * Get the last node on the target node by the condition
 * @param {HTMLElement} node - the target node
 * @returns {function} - the condition to find the node
 * @ignore
 */
var getLastNodeBy = function getLastNodeBy(node, condition) {
  var lastNode = node && node.lastChild;

  while (lastNode && condition(lastNode)) {
    lastNode = lastNode.lastChild;
  }

  return lastNode;
};

/**
 * Get the parent node on the target node by the condition
 * @param {HTMLElement} node - the target node
 * @returns {function} - the condition to find the node
 * @ignore
 */
var getParentNodeBy = function getParentNodeBy(node, condition) {
  while (node && condition(node.parentNode, node)) {
    node = node.parentNode;
  }

  return node;
};

/**
 * Get the sibling node on the target node by the condition
 * @param {HTMLElement} node - the target node
 * @param {string} direction - the direction to find node ('previous', 'next')
 * @returns {function} - the condition to find the node
 * @ignore
 */
var getSiblingNodeBy = function getSiblingNodeBy(node, direction, condition) {
  var directionKey = direction + 'Sibling';

  while (node && condition(node[directionKey], node)) {
    node = node[directionKey];
  }

  return node;
};

exports.default = {
  getNodeName: getNodeName,
  isTextNode: isTextNode,
  isElemNode: isElemNode,
  isBlockNode: isBlockNode,
  getTextLength: getTextLength,
  getOffsetLength: getOffsetLength,
  getPrevOffsetNodeUntil: getPrevOffsetNodeUntil,
  getNodeOffsetOfParent: getNodeOffsetOfParent,
  getChildNodeByOffset: getChildNodeByOffset,
  getNodeWithDirectionUntil: getNodeWithDirectionUntil,
  containsNode: containsNode,
  getTopPrevNodeUnder: getTopPrevNodeUnder,
  getTopNextNodeUnder: getTopNextNodeUnder,
  getParentUntilBy: getParentUntilBy,
  getParentUntil: getParentUntil,
  getTopBlockNode: getTopBlockNode,
  getPrevTextNode: getPrevTextNode,
  findOffsetNode: findOffsetNode,
  getPath: getPath,
  getNodeInfo: getNodeInfo,
  getTableCellByDirection: getTableCellByDirection,
  getSiblingRowCellByDirection: getSiblingRowCellByDirection,
  isMDSupportInlineNode: isMDSupportInlineNode,
  isStyledNode: isStyledNode,
  removeChildFromStartToEndNode: removeChildFromStartToEndNode,
  removeNodesByDirection: removeNodesByDirection,
  getLeafNode: getLeafNode,
  isInsideTaskBox: isInsideTaskBox,
  isListNode: isListNode,
  isFirstListItem: isFirstListItem,
  isFirstLevelListItem: isFirstLevelListItem,
  mergeNode: mergeNode,
  createHorizontalRule: createHorizontalRule,
  createEmptyLine: createEmptyLine,
  changeTagOrder: changeTagOrder,
  mergeSameNodes: mergeSameNodes,
  optimizeRange: optimizeRange,
  getAllTextNode: getAllTextNode,
  isCellNode: isCellNode,
  getLastNodeBy: getLastNodeBy,
  getParentNodeBy: getParentNodeBy,
  getSiblingNodeBy: getSiblingNodeBy
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _uicontroller = __webpack_require__(8);

var _uicontroller2 = _interopRequireDefault(_uicontroller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements LayerPopup
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var CLASS_PREFIX = 'tui-popup-';
var CLASS_FIT_WINDOW = 'fit-window';

var LAYOUT_TEMPLATE_MODELESS = '<div class="' + CLASS_PREFIX + 'header">\n        <span class="' + CLASS_PREFIX + 'title"></span>\n        <div class="' + CLASS_PREFIX + 'header-buttons">\n            <button type="button" class="' + CLASS_PREFIX + 'close-button"></button>\n        </div>\n    </div>\n    <div class="' + CLASS_PREFIX + 'body"></div>';

var LAYOUT_TEMPLATE_MODAL = '<div class="' + CLASS_PREFIX + 'wrapper">\n        <div class="' + CLASS_PREFIX + 'header">\n            <span class="' + CLASS_PREFIX + 'title"></span>\n            <div class="' + CLASS_PREFIX + 'header-buttons">\n                <button type="button" class="' + CLASS_PREFIX + 'close-button"></button>\n            </div>\n        </div>\n        <div class="' + CLASS_PREFIX + 'body"></div>\n    </div>';

/**
 * A number, or a string containing a number.
 * @typedef {object} LayerPopupOption
 * @property {string[]} [openerCssQuery] - Css Query list to bind clickevent that open popup
 * @property {string[]} [closerCssQuery] - Css Query list to bind clickevent that close popup
 * @property {jQuery} $el - popup root element
 * @property {jQuery|string} [content] - popup content that html string or jQuery element
 * @property {string} [textContent] - popup text content
 * @property {string} title - popup title
 * @property {boolean} [header] - whether to draw header
 * @property {jQuery} [$target] - element to append popup
 * @property {boolean} modal - true: modal, false: modeless
 * @property {string} [headerButtons] - replace header(close) button
 */

/**
 * Class LayerPopup
 * @param {LayerPopupOption} options - popup option
 */

var LayerPopup = function (_UIController) {
  _inherits(LayerPopup, _UIController);

  function LayerPopup(options) {
    _classCallCheck(this, LayerPopup);

    options = _tuiCodeSnippet2.default.extend({
      header: true,
      $target: (0, _jquery2.default)('body'),
      textContent: ''
    }, options);

    var _this = _possibleConstructorReturn(this, (LayerPopup.__proto__ || Object.getPrototypeOf(LayerPopup)).call(this, {
      tagName: 'div',
      className: options.modal ? CLASS_PREFIX + 'modal-background' : CLASS_PREFIX + 'wrapper',
      rootElement: options.$el
    }));

    _this._initInstance(options);
    _this._initDOM(options);
    _this._initDOMEvent(options);
    _this._initEditorEvent(options);
    return _this;
  }

  /**
   * init instance.
   * store properties & prepare before initialize DOM
   * @param {LayerPopupOption} options - layer popup options
   * @private
   */


  _createClass(LayerPopup, [{
    key: '_initInstance',
    value: function _initInstance(options) {
      this._$target = options.$target;

      if (options.$el) {
        this.$el = options.$el;
        this._isExternalHtmlUse = true;
      }

      if (options.content) {
        this.$content = (0, _jquery2.default)(options.content);
      } else {
        this.$content = options.textContent;
      }

      this.options = options;
    }

    /**
     * initialize DOM, render popup
     * @private
     */

  }, {
    key: '_initDOM',
    value: function _initDOM() {
      this._initLayout();

      if (!this._isExternalHtmlUse) {
        if (_tuiCodeSnippet2.default.isExisty(this.options.title)) {
          this.setTitle(this.options.title);
        }
        this.setContent(this.$content);
      }

      var buttons = this.options.headerButtons;
      if (buttons) {
        this.$el.find('.' + CLASS_PREFIX + 'close-button').remove();

        var $buttonWrapper = this.$el.find('.' + CLASS_PREFIX + 'header-buttons');
        $buttonWrapper.empty();
        $buttonWrapper.append((0, _jquery2.default)(buttons));
      }

      if (this.options.css) {
        this.$el.css(this.options.css);
      }
    }

    /**
     * bind DOM events
     * @private
     */

  }, {
    key: '_initDOMEvent',
    value: function _initDOMEvent() {
      var _this2 = this;

      var _options = this.options,
          openerCssQuery = _options.openerCssQuery,
          closerCssQuery = _options.closerCssQuery;

      if (openerCssQuery) {
        (0, _jquery2.default)(openerCssQuery).on('click.' + this._id, function () {
          return _this2.show();
        });
      }
      if (closerCssQuery) {
        (0, _jquery2.default)(closerCssQuery).on('click.' + this._id, function () {
          return _this2.hide();
        });
      }

      this.on('click .' + CLASS_PREFIX + 'close-button', function () {
        return _this2.hide();
      });
    }

    /**
     * bind editor events
     * @private
     * @abstract
     */

  }, {
    key: '_initEditorEvent',
    value: function _initEditorEvent() {}
  }, {
    key: '_initLayout',
    value: function _initLayout() {
      var options = this.options;


      if (!this._isExternalHtmlUse) {
        var layout = options.modal ? LAYOUT_TEMPLATE_MODAL : LAYOUT_TEMPLATE_MODELESS;
        this.$el.html(layout);
        this.$el.addClass(options.className);
        this.hide();
        this._$target.append(this.$el);
        this.$body = this.$el.find('.' + CLASS_PREFIX + 'body');

        if (!options.header) {
          this.$el.find('.' + CLASS_PREFIX + 'header').remove();
        }
      } else {
        this.hide();
        this._$target.append(this.$el);
      }
    }

    /**
     * set popup content
     * @param {jQuery|HTMLElement|string} $content - content
     */

  }, {
    key: 'setContent',
    value: function setContent($content) {
      this.$body.empty();
      this.$body.append($content);
    }

    /**
     * set title
     * @param {string} title - title text
     */

  }, {
    key: 'setTitle',
    value: function setTitle(title) {
      var $title = this.$el.find('.' + CLASS_PREFIX + 'title');

      $title.empty();
      $title.append(title);
    }

    /**
     * get title element
     * @returns {HTMLElement} - title html element
     */

  }, {
    key: 'getTitleElement',
    value: function getTitleElement() {
      return this.$el.find('.' + CLASS_PREFIX + 'title').get(0);
    }

    /**
     * hide popup
     */

  }, {
    key: 'hide',
    value: function hide() {
      this.$el.css('display', 'none');
      this._isShow = false;
      this.trigger('hidden', this);
    }

    /**
     * show popup
     */

  }, {
    key: 'show',
    value: function show() {
      this.$el.css('display', 'block');
      this._isShow = true;
      this.trigger('shown', this);
    }

    /**
     * whether this popup is visible
     * @returns {boolean} - true: shown, false: hidden
     */

  }, {
    key: 'isShow',
    value: function isShow() {
      return this._isShow;
    }

    /**
     * remove popup content
     */

  }, {
    key: 'remove',
    value: function remove() {
      var _options2 = this.options,
          openerCssQuery = _options2.openerCssQuery,
          closerCssQuery = _options2.closerCssQuery;


      this.trigger('remove', this);
      this.off();

      if (openerCssQuery) {
        (0, _jquery2.default)(openerCssQuery).off('.' + this._id);
      }
      if (closerCssQuery) {
        (0, _jquery2.default)(closerCssQuery).off('.' + this._id);
      }

      this.$el.remove();
      this.$el = null;
    }

    /**
     * make popup size fit to window
     * @param {boolean} fit - true to make popup fit to window
     * @protected
     * @ignore
     */

  }, {
    key: 'setFitToWindow',
    value: function setFitToWindow(fit) {
      this.$el.toggleClass(CLASS_FIT_WINDOW, fit);
    }

    /**
     * make popup size fit to window
     * @returns {boolean} - true for fit to window
     * @protected
     * @ignore
     */

  }, {
    key: 'isFitToWindow',
    value: function isFitToWindow() {
      return this.$el.hasClass(CLASS_FIT_WINDOW);
    }

    /**
     * toggle size fit to window
     * @returns {boolean} - true for fit to window
     * @protected
     * @ignore
     */

  }, {
    key: 'toggleFitToWindow',
    value: function toggleFitToWindow() {
      var fitToWindow = !this.isFitToWindow();
      this.setFitToWindow(fitToWindow);

      return fitToWindow;
    }
  }]);

  return LayerPopup;
}(_uicontroller2.default);

exports.default = LayerPopup;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__6__;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CodeBlockManager = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements CodeBlockManager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _highlight = __webpack_require__(32);

var _highlight2 = _interopRequireDefault(_highlight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class Code Block Manager
 */
var CodeBlockManager = function () {
  function CodeBlockManager() {
    _classCallCheck(this, CodeBlockManager);

    this._replacers = {};
  }

  /**
   * Set replacer for code block
   * @param {string} language - code block language
   * @param {function} replacer - replacer function to code block element
   */


  _createClass(CodeBlockManager, [{
    key: 'setReplacer',
    value: function setReplacer(language, replacer) {
      this._replacers[language] = replacer;
    }

    /**
     * get replacer for code block
     * @param {string} language - code block type
     * @returns {function} - replacer function
     */

  }, {
    key: 'getReplacer',
    value: function getReplacer(language) {
      return this._replacers[language];
    }

    /**
     * Create code block html.
     * @param {string} language - code block language
     * @param {string} codeText - code text
     * @returns {string}
     */

  }, {
    key: 'createCodeBlockHtml',
    value: function createCodeBlockHtml(language, codeText) {
      var replacer = this.getReplacer(language);
      var html = void 0;

      if (replacer) {
        html = replacer(codeText, language);
      } else {
        html = _highlight2.default.getLanguage(language) ? _highlight2.default.highlight(language, codeText).value : escape(codeText, false);
      }

      return html;
    }

    /**
     * get supported languages by highlight-js
     * @returns {Array<string>} - supported languages by highlight-js
     */

  }], [{
    key: 'getHighlightJSLanguages',
    value: function getHighlightJSLanguages() {
      return _highlight2.default.listLanguages();
    }
  }]);

  return CodeBlockManager;
}();

/**
 * escape code from markdown-it
 * @param {string} html HTML string
 * @param {string} encode Boolean value of whether encode or not
 * @returns {string}
 * @ignore
 */


function escape(html, encode) {
  return html.replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

exports.CodeBlockManager = CodeBlockManager;
exports.default = new CodeBlockManager();

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements ui controller
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _uiInstanceId = -1;

/**
 * get ui instance id
 * @returns {number} - new instance id
 * @ignore
 */
function makeUIInstanceId() {
  _uiInstanceId += 1;

  return _uiInstanceId;
}

/**
 * Class UIController
 * @param {Object} [options] - options
 *     @param {jQuery} [options.rootElement] - root element
 *     @param {string} [options.tagName] - tag name
 *     @param {string} [options.className] - class name
 */

var UIController = function () {

  /**
   * UI jQuery element
   * @type {Object}
   */

  /**
   * tag name
   * @type {string}
   */
  function UIController() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, UIController);

    options = _tuiCodeSnippet2.default.extend({
      tagName: 'div'
    }, options);

    this.tagName = options.tagName;

    this.className = options.className;

    this._id = makeUIInstanceId();

    this._setRootElement(options.rootElement);
  }

  /**
   * @param {string|object} aType - event name and selector string
   * @param {function} aFn - event handler
   */


  /**
   * UI Id
   * @type {number}
   * @private
   */


  /**
   * ui controller class name
   * @type {string}
   */


  _createClass(UIController, [{
    key: 'on',
    value: function on(aType, aFn) {
      var _this = this;

      if (_tuiCodeSnippet2.default.isObject(aType)) {
        _tuiCodeSnippet2.default.forEach(aType, function (fn, type) {
          _this._addEvent(type, fn);
        });
      } else {
        this._addEvent(aType, aFn);
      }
    }

    /**
     * bind event
     * @param {string} type - event name and selector
     * @param {function} fn - handler function
     * @private
     */

  }, {
    key: '_addEvent',
    value: function _addEvent(type, fn) {
      var _parseEventType2 = this._parseEventType(type),
          event = _parseEventType2.event,
          selector = _parseEventType2.selector;

      if (selector) {
        this.$el.on(event, selector, fn);
      } else {
        this.$el.on(event, fn);
      }
    }

    /**
     * unbind event handler
     * @param {string} type - event name and selector
     * @param {function} fn - handler function
     */

  }, {
    key: 'off',
    value: function off(type, fn) {
      if (type) {
        var _parseEventType3 = this._parseEventType(type),
            event = _parseEventType3.event,
            selector = _parseEventType3.selector;

        if (selector) {
          this.$el.off(event, selector, fn);
        } else {
          this.$el.off(event, fn);
        }
      } else {
        this.$el.off();
      }
    }

    /**
     * parse string into event name & selector
     * 'click td' => ['click', 'td]
     * @param {string} type - string to be parsed
     * @returns {Object} event, selector
     * @private
     */

  }, {
    key: '_parseEventType',
    value: function _parseEventType(type) {
      var splitType = type.split(' ');
      var event = splitType.shift();
      var selector = splitType.join(' ');

      return {
        event: event,
        selector: selector
      };
    }

    /**
     * set root element
     * @param {jQuery} $el - root jQuery element
     * @private
     */

  }, {
    key: '_setRootElement',
    value: function _setRootElement($el) {
      var tagName = this.tagName;
      var className = this.className;


      if (!$el) {
        className = className || 'uic' + this._id;
        $el = (0, _jquery2.default)('<' + tagName + ' class="' + className + '"/>');
      }
      this.$el = $el;
    }

    /**
     * trigger event
     * @param {...object} args - event name & extra params
     */

  }, {
    key: 'trigger',
    value: function trigger() {
      var _$el;

      (_$el = this.$el).trigger.apply(_$el, arguments);
    }
  }, {
    key: '_getEventNameWithNamespace',
    value: function _getEventNameWithNamespace(event) {
      var eventSplited = event.split(' ');
      eventSplited[0] += '.uicEvent' + this._id;

      return eventSplited.join(' ');
    }

    /**
     * remove
     */

  }, {
    key: 'remove',
    value: function remove() {
      if (this.$el) {
        this.$el.remove();
      }
    }

    /**
     * destroy
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      var _this2 = this;

      this.remove();

      _tuiCodeSnippet2.default.forEachOwnProperties(this, function (value, key) {
        _this2[key] = null;
      });
    }
  }]);

  return UIController;
}();

exports.default = UIController;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileoverview Implements htmlSanitizer
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
var HTML_ATTR_LIST_RX = new RegExp('^(abbr|align|alt|axis|bgcolor|border|cellpadding|cellspacing|class|clear|' + 'color|cols|compact|coords|dir|face|headers|height|hreflang|hspace|' + 'ismap|lang|language|nohref|nowrap|rel|rev|rows|rules|' + 'scope|scrolling|shape|size|span|start|summary|tabindex|target|title|type|' + 'valign|value|vspace|width|checked|mathvariant|encoding|id|name|' + 'background|cite|href|longdesc|src|usemap|xlink:href|data-+|checked|style)', 'g');

var SVG_ATTR_LIST_RX = new RegExp('^(accent-height|accumulate|additive|alphabetic|arabic-form|ascent|' + 'baseProfile|bbox|begin|by|calcMode|cap-height|class|color|color-rendering|content|' + 'cx|cy|d|dx|dy|descent|display|dur|end|fill|fill-rule|font-family|font-size|font-stretch|' + 'font-style|font-variant|font-weight|from|fx|fy|g1|g2|glyph-name|gradientUnits|hanging|' + 'height|horiz-adv-x|horiz-origin-x|ideographic|k|keyPoints|keySplines|keyTimes|lang|' + 'marker-end|marker-mid|marker-start|markerHeight|markerUnits|markerWidth|mathematical|' + 'max|min|offset|opacity|orient|origin|overline-position|overline-thickness|panose-1|' + 'path|pathLength|points|preserveAspectRatio|r|refX|refY|repeatCount|repeatDur|' + 'requiredExtensions|requiredFeatures|restart|rotate|rx|ry|slope|stemh|stemv|stop-color|' + 'stop-opacity|strikethrough-position|strikethrough-thickness|stroke|stroke-dasharray|' + 'stroke-dashoffset|stroke-linecap|stroke-linejoin|stroke-miterlimit|stroke-opacity|' + 'stroke-width|systemLanguage|target|text-anchor|to|transform|type|u1|u2|underline-position|' + 'underline-thickness|unicode|unicode-range|units-per-em|values|version|viewBox|visibility|' + 'width|widths|x|x-height|x1|x2|xlink:actuate|xlink:arcrole|xlink:role|xlink:show|xlink:title|' + 'xlink:type|xml:base|xml:lang|xml:space|xmlns|xmlns:xlink|y|y1|y2|zoomAndPan)', 'g');

var ATTR_VALUE_BLACK_LIST_RX = {
  'href': /^(javascript:).*/g
};

/**
 * htmlSanitizer
 * @param {string|Node} html html or Node
 * @param {boolean} [needHtmlText] pass true if need html text
 * @returns {string|DocumentFragment} result
 * @ignore
 */
function htmlSanitizer(html, needHtmlText) {
  var $html = (0, _jquery2.default)('<div />');

  html = html.replace(/<!--[\s\S]*?-->/g, '');

  $html.append(html);

  removeUnnecessaryTags($html);
  leaveOnlyWhitelistAttribute($html);
  removeInvalidAttributeValues($html);

  return finalizeHtml($html, needHtmlText);
}

/**
 * Remove unnecessary tags
 * @private
 * @param {jQuery} $html jQuery instance
 */
function removeUnnecessaryTags($html) {
  $html.find('script, iframe, textarea, form, button, select, meta, style, link, title, embed, object, details, summary').remove();
}

/**
 * Leave only white list attributes
 * @private
 * @param {jQuery} $html jQuery instance
 */
function leaveOnlyWhitelistAttribute($html) {
  $html.find('*').each(function (index, node) {
    var attrs = node.attributes;
    var blacklist = _tuiCodeSnippet2.default.toArray(attrs).filter(function (attr) {
      var isHTMLAttr = attr.name.match(HTML_ATTR_LIST_RX);
      var isSVGAttr = attr.name.match(SVG_ATTR_LIST_RX);

      return !isHTMLAttr && !isSVGAttr;
    });

    _tuiCodeSnippet2.default.forEachArray(blacklist, function (attr) {
      // Edge svg attribute name returns uppercase bug. error guard.
      // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/5579311/
      if (attrs.getNamedItem(attr.name)) {
        attrs.removeNamedItem(attr.name);
      }
    });
  });
}

/**
 * Remove invalid attribute values
 * @private
 * @param {jQuery} $html jQuery instance
 */
function removeInvalidAttributeValues($html) {
  var _loop = function _loop(attr) {
    if (ATTR_VALUE_BLACK_LIST_RX.hasOwnProperty(attr)) {
      $html.find('[' + attr + ']').each(function (index, node) {
        var attrs = node.attributes;
        var valueBlackListRX = ATTR_VALUE_BLACK_LIST_RX[attr];
        var attrItem = attrs.getNamedItem(attr);
        if (valueBlackListRX && attrItem && attrItem.value.toLowerCase().match(valueBlackListRX)) {
          attrs.removeNamedItem(attr);
        }
      });
    }
  };

  for (var attr in ATTR_VALUE_BLACK_LIST_RX) {
    _loop(attr);
  }
}

/**
 * Finalize html result
 * @private
 * @param {jQuery} $html jQuery instance
 * @param {boolean} needHtmlText pass true if need html text
 * @returns {string|DocumentFragment} result
 */
function finalizeHtml($html, needHtmlText) {
  var returnValue = void 0;

  if (needHtmlText) {
    returnValue = $html[0].innerHTML;
  } else {
    var frag = document.createDocumentFragment();
    var childNodes = _tuiCodeSnippet2.default.toArray($html[0].childNodes);
    var length = childNodes.length;


    for (var i = 0; i < length; i += 1) {
      frag.appendChild(childNodes[i]);
    }
    returnValue = frag;
  }

  return returnValue;
}

exports.default = htmlSanitizer;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implement Module for managing import external data such as image
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var URLRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/([^\s]*))?$/g;

/**
 * Class ImportManager
 * @param {EventManager} eventManager - eventManager
 * @ignore
 */

var ImportManager = function () {
  function ImportManager(eventManager) {
    _classCallCheck(this, ImportManager);

    this.eventManager = eventManager;

    this._initEvent();
    this._initDefaultImageImporter();
  }

  /**
   * graceful decode uri component
   * @param {string} originalURI - string to be decoded
   * @returns {string} decoded string
   * @static
   */


  _createClass(ImportManager, [{
    key: '_initEvent',


    /**
     * Initialize event handler
     * @private
     */
    value: function _initEvent() {
      var _this = this;

      this.eventManager.listen('drop', function (ev) {
        var items = ev.data.dataTransfer && ev.data.dataTransfer.files;
        _this._processBlobItems(items, ev.data);
      });

      this.eventManager.listen('willPaste', function (ev) {
        // IE has no interface to handle clipboard image. #976
        var fragment = ev.data.fragment;
        var descendant = fragment.querySelectorAll('*');
        // only if paste event data has one img element and the element has base64 encoded image
        if (descendant.length !== 1 || descendant[0].tagName !== 'IMG' || !/^data:image/.test(descendant[0].src)) {
          return;
        }
        ev.data.preventDefault();

        var blob = dataURItoBlob(descendant[0].src);
        _this._emitAddImageBlobHook(blob, 'paste');
      });

      this.eventManager.listen('paste', function (ev) {
        _this._processClipboard(ev.data);
      });

      this.eventManager.listen('pasteBefore', function (ev) {
        _this._decodeURL(ev);
      });
    }

    /**
     * Initialize default image importer
     * @private
     */

  }, {
    key: '_initDefaultImageImporter',
    value: function _initDefaultImageImporter() {
      this.eventManager.listen('addImageBlobHook', function (blob, callback) {
        var reader = new FileReader();

        reader.onload = function (event) {
          callback(event.target.result);
        };

        reader.readAsDataURL(blob);
      });
    }

    /**
     * Emit add image blob hook
     * @param {object} blob - blob or file
     * @param {string} type - type of an event the item belongs to. paste or drop
     * @private
     */

  }, {
    key: '_emitAddImageBlobHook',
    value: function _emitAddImageBlobHook(blob, type) {
      var _this2 = this;

      this.eventManager.emit('addImageBlobHook', blob, function (imageUrl, altText) {
        _this2.eventManager.emit('command', 'AddImage', {
          imageUrl: imageUrl,
          altText: altText || blob.name || 'image'
        });
      }, type);
    }

    /**
     * Decode url when paste link
     * @param {object} ev - event object
     * @private
     */

  }, {
    key: '_decodeURL',
    value: function _decodeURL(ev) {
      var decodeURIGraceful = ImportManager.decodeURIGraceful,
          encodeMarkdownCharacters = ImportManager.encodeMarkdownCharacters;


      if (ev.source === 'markdown' && ev.data.text) {
        var texts = ev.data.text;
        var text = texts[0];
        if (texts.length === 1 && text.match(URLRegex)) {
          text = decodeURIGraceful(text);
          text = encodeMarkdownCharacters(text);
          ev.data.update(null, null, [text]);
        }
      } else if (ev.source === 'wysiwyg') {
        var container = ev.$clipboardContainer.get(0);
        var firstChild = container.childNodes[0];
        var _text = firstChild.innerText;
        if (container.childNodes.length === 1 && firstChild.tagName === 'A' && _text.match(URLRegex)) {
          firstChild.innerText = decodeURIGraceful(_text);
          firstChild.href = encodeMarkdownCharacters(firstChild.href);
        }
      }
    }

    /**
     * Get blob or excel data from clipboard
     * @param {object} evData Clipboard data
     * @private
     */

  }, {
    key: '_processClipboard',
    value: function _processClipboard(evData) {
      var cbData = evData.clipboardData || window.clipboardData;
      var blobItems = cbData && cbData.items;
      var types = cbData.types;


      if (blobItems && types && types.length === 1 && _tuiCodeSnippet2.default.inArray('Files', [].slice.call(types)) !== -1) {
        this._processBlobItems(blobItems, evData);
      }
    }

    /**
     * Process for blob item
     * @param {Array.<string>} items Item array
     * @param {object} evData Event data
     * @private
     */

  }, {
    key: '_processBlobItems',
    value: function _processBlobItems(items, evData) {
      var _this3 = this;

      if (items) {
        _tuiCodeSnippet2.default.forEachArray(items, function (item) {
          if (item.type.indexOf('image') !== -1) {
            evData.preventDefault();
            evData.stopPropagation();
            evData.codemirrorIgnore = true;

            var blob = item.name ? item : item.getAsFile(); // Blob or File
            _this3._emitAddImageBlobHook(blob, evData.type);

            return false;
          }

          return true;
        });
      }
    }
  }], [{
    key: 'decodeURIGraceful',
    value: function decodeURIGraceful(originalURI) {
      var uris = originalURI.split(' ');
      var decodedURIs = [];
      var decodedURI = void 0;

      _tuiCodeSnippet2.default.forEachArray(uris, function (uri) {
        try {
          decodedURI = decodeURIComponent(uri);
          decodedURI = decodedURI.replace(/ /g, '%20');
        } catch (e) {
          decodedURI = uri;
        }

        return decodedURIs.push(decodedURI);
      });

      return decodedURIs.join(' ');
    }

    /**
     * encode markdown critical characters
     * @param {string} text - string to encode
     * @returns {string} - markdown character encoded string
     * @static
     */

  }, {
    key: 'encodeMarkdownCharacters',
    value: function encodeMarkdownCharacters(text) {
      return text.replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\[/g, '%5B').replace(/\]/g, '%5D').replace(/</g, '%3C').replace(/>/g, '%3E');
    }

    /**
     * escape markdown critical characters
     * @param {string} text - string to escape
     * @returns {string} - markdown character escaped string
     * @static
     */

  }, {
    key: 'escapeMarkdownCharacters',
    value: function escapeMarkdownCharacters(text) {
      return text.replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/</g, '\\<').replace(/>/g, '\\>');
    }
  }]);

  return ImportManager;
}();

/**
 * data URI to Blob
 * @param {string} dataURI - data URI string
 * @returns {Blob} - blob data
 * @ignore
 */


function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  }
  var blob = new Blob([ab], { type: mimeString });

  return blob;
}

exports.default = ImportManager;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _uicontroller = __webpack_require__(8);

var _uicontroller2 = _interopRequireDefault(_uicontroller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements Toolbar Item
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Class ToolbarItem
 * @param {Object} [options={name: 'toolbar-item'}] [description]
 */
var ToolbarItem = function (_UIController) {
  _inherits(ToolbarItem, _UIController);

  /**
   * item name
   * @type {String}
   * @static
   * @private
   */
  function ToolbarItem() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      name: ToolbarItem.name
    };

    _classCallCheck(this, ToolbarItem);

    var _this = _possibleConstructorReturn(this, (ToolbarItem.__proto__ || Object.getPrototypeOf(ToolbarItem)).call(this, _tuiCodeSnippet2.default.extend({
      className: ToolbarItem.className
    }, options)));

    _this._name = options.name;
    return _this;
  }

  /**
   * get the name of the toolbar item
   * @returns {string} - the name of the toolbar item
   */


  /**
   * toolbar item class name
   * @type {String}
   * @static
   * @private
   */


  _createClass(ToolbarItem, [{
    key: 'getName',
    value: function getName() {
      return this._name;
    }
  }]);

  return ToolbarItem;
}(_uicontroller2.default);

Object.defineProperty(ToolbarItem, 'name', {
  enumerable: true,
  writable: true,
  value: 'item'
});
Object.defineProperty(ToolbarItem, 'className', {
  enumerable: true,
  writable: true,
  value: 'tui-toolbar-item'
});
exports.default = ToolbarItem;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _preview = __webpack_require__(13);

var _preview2 = _interopRequireDefault(_preview);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements markdown preview
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Class Markdown Preview
 * @param {jQuery} $el - base jQuery element
 * @param {EventManager} eventManager - event manager
 * @param {Convertor} convertor - convertor
 * @param {boolean} isViewer - true for view only mode
 * @param {Number} delayTime - lazyRunner delay time
 * @ignore
 */
var MarkdownPreview = function (_Preview) {
  _inherits(MarkdownPreview, _Preview);

  function MarkdownPreview($el, eventManager, convertor, isViewer, delayTime) {
    _classCallCheck(this, MarkdownPreview);

    var _this = _possibleConstructorReturn(this, (MarkdownPreview.__proto__ || Object.getPrototypeOf(MarkdownPreview)).call(this, $el, eventManager, convertor, isViewer, delayTime));

    _this._initEvent();
    return _this;
  }

  /**
   * Initialize event
   * @private
   */


  _createClass(MarkdownPreview, [{
    key: '_initEvent',
    value: function _initEvent() {
      var _this2 = this;

      var latestMarkdownValue = '';

      this.eventManager.listen('contentChangedFromMarkdown', function (markdownEditor) {
        latestMarkdownValue = markdownEditor.getValue();

        if (_this2.isVisible()) {
          _this2.lazyRunner.run('refresh', latestMarkdownValue);
        }
      });

      this.eventManager.listen('previewNeedsRefresh', function (value) {
        _this2.refresh(value || latestMarkdownValue);
      });

      this.$el.on('scroll', function (event) {
        _this2.eventManager.emit('scroll', {
          source: 'preview',
          data: event
        });
      });
    }

    /**
     * render
     * @param {string} html - html string to render
     * @override
     */

  }, {
    key: 'render',
    value: function render(html) {
      _get(MarkdownPreview.prototype.__proto__ || Object.getPrototypeOf(MarkdownPreview.prototype), 'render', this).call(this, html);

      this.eventManager.emit('previewRenderAfter', this);
    }
  }, {
    key: 'remove',
    value: function remove() {
      this.$el.off('scroll');
      this.$el = null;
    }
  }]);

  return MarkdownPreview;
}(_preview2.default);

exports.default = MarkdownPreview;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements preview
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _lazyRunner = __webpack_require__(21);

var _lazyRunner2 = _interopRequireDefault(_lazyRunner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class Preview
 * @param {jQuery} $el Container element for preview
 * @param {EventManager} eventManager Event manager instance
 * @param {Convertor} convertor Convertor instance
 * @param {boolean} isViewer - whether viewer mode or not
 * @param {Number} delayTime - lazyRunner delay time
 * @ignore
 */
var Preview = function () {
  function Preview($el, eventManager, convertor, isViewer) {
    var delayTime = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 800;

    _classCallCheck(this, Preview);

    this.eventManager = eventManager;
    this.convertor = convertor;
    this.$el = $el;
    this.isViewer = !!isViewer;

    this._initContentSection();

    this.lazyRunner = new _lazyRunner2.default();

    this.lazyRunner.registerLazyRunFunction('refresh', this.refresh, delayTime, this);
  }

  /**
   * Initialize content selection
   * @private
   */


  _createClass(Preview, [{
    key: '_initContentSection',
    value: function _initContentSection() {
      this._$previewContent = (0, _jquery2.default)('<div class="tui-editor-contents" />');
      this.$el.append(this._$previewContent);
    }

    /**
     * Refresh rendering
     * @param {string} markdown Markdown text
     */

  }, {
    key: 'refresh',
    value: function refresh(markdown) {
      this.render(this.convertor.toHTMLWithCodeHightlight(markdown));
    }

    /**
     * get html string
     * @returns {string} - html preview string
     */

  }, {
    key: 'getHTML',
    value: function getHTML() {
      return this._$previewContent.html();
    }

    /**
     * set html string
     * @param {string} html - html preview string
     */

  }, {
    key: 'setHTML',
    value: function setHTML(html) {
      this._$previewContent.html(html);
    }

    /**
     * Render HTML on preview
     * @param {string} html HTML string
     */

  }, {
    key: 'render',
    value: function render(html) {
      var _$previewContent = this._$previewContent;

      html = this.eventManager.emit('previewBeforeHook', html) || html;

      _$previewContent.empty();
      _$previewContent.html(html);
    }

    /**
     * Set preview height
     * @param {number} height - Height for preview container
     */

  }, {
    key: 'setHeight',
    value: function setHeight(height) {
      this.$el.get(0).style.height = height + 'px';
    }

    /**
     * set min height
     * @param {number} minHeight - min height
     */

  }, {
    key: 'setMinHeight',
    value: function setMinHeight(minHeight) {
      this.$el.get(0).style.minHeight = minHeight + 'px';
    }

    /**
     * Is Preview visible
     * @returns {boolean} result
     */

  }, {
    key: 'isVisible',
    value: function isVisible() {
      return this.$el.css('display') !== 'none';
    }
  }]);

  return Preview;
}();

exports.default = Preview;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isMac = /Mac/.test(navigator.platform);

module.exports = {
  isMac: isMac
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements EventManager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var eventList = ['previewBeforeHook', 'previewRenderAfter', 'previewNeedsRefresh', 'addImageBlobHook', 'setMarkdownAfter', 'contentChangedFromWysiwyg', 'changeFromWysiwyg', 'contentChangedFromMarkdown', 'changeFromMarkdown', 'change', 'changeModeToWysiwyg', 'changeModeToMarkdown', 'changeModeBefore', 'changeMode', 'changePreviewStyle', 'changePreviewTabPreview', 'changePreviewTabWrite', 'openPopupAddLink', 'openPopupAddImage', 'openPopupAddTable', 'openPopupTableUtils', 'openHeadingSelect', 'openPopupCodeBlockLanguages', 'openPopupCodeBlockEditor', 'openDropdownToolbar', 'closePopupCodeBlockLanguages', 'closePopupCodeBlockEditor', 'closeAllPopup', 'command', 'addCommandBefore', 'htmlUpdate', 'markdownUpdate', 'renderedHtmlUpdated', 'removeEditor', 'convertorAfterMarkdownToHtmlConverted', 'convertorBeforeHtmlToMarkdownConverted', 'convertorAfterHtmlToMarkdownConverted', 'stateChange', 'wysiwygSetValueAfter', 'wysiwygSetValueBefore', 'wysiwygGetValueBefore', 'wysiwygProcessHTMLText', 'wysiwygRangeChangeAfter', 'wysiwygKeyEvent', 'scroll', 'click', 'mousedown', 'mouseover', 'mouseout', 'mouseup', 'contextmenu', 'keydown', 'keyup', 'keyMap', 'load', 'focus', 'blur', 'paste', 'pasteBefore', 'willPaste', 'copy', 'copyBefore', 'copyAfter', 'cut', 'cutAfter', 'drop', 'show', 'hide'];

/**
 * Class EventManager
 * @ignore
 */

var EventManager = function () {
  function EventManager() {
    _classCallCheck(this, EventManager);

    this.events = new _tuiCodeSnippet2.default.Map();
    this.TYPE = new _tuiCodeSnippet2.default.Enum(eventList);
  }

  /**
   * Listen event and bind event handler
   * @param {string} typeStr Event type string
   * @param {function} handler Event handler
   */


  _createClass(EventManager, [{
    key: 'listen',
    value: function listen(typeStr, handler) {
      var typeInfo = this._getTypeInfo(typeStr);
      var eventHandlers = this.events.get(typeInfo.type) || [];

      if (!this._hasEventType(typeInfo.type)) {
        throw new Error('There is no event type ' + typeInfo.type);
      }

      if (typeInfo.namespace) {
        handler.namespace = typeInfo.namespace;
      }

      eventHandlers.push(handler);

      this.events.set(typeInfo.type, eventHandlers);
    }

    /**
     * Emit event
     * @param {string} eventName Event name to emit
     * @returns {Array}
     */

  }, {
    key: 'emit',
    value: function emit() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var typeStr = args.shift();
      var typeInfo = this._getTypeInfo(typeStr);
      var eventHandlers = this.events.get(typeInfo.type);
      var results = void 0;

      if (eventHandlers) {
        _tuiCodeSnippet2.default.forEach(eventHandlers, function (handler) {
          var result = handler.apply(undefined, args);

          if (!_tuiCodeSnippet2.default.isUndefined(result)) {
            results = results || [];
            results.push(result);
          }
        });
      }

      return results;
    }

    /**
     * Emit given event and return result
     * @param {string} eventName Event name to emit
     * @param {string} sourceText Source text to change
     * @returns {string}
     */

  }, {
    key: 'emitReduce',
    value: function emitReduce() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var type = args.shift();
      var eventHandlers = this.events.get(type);

      if (eventHandlers) {
        _tuiCodeSnippet2.default.forEach(eventHandlers, function (handler) {
          var result = handler.apply(undefined, args);

          if (!_tuiCodeSnippet2.default.isFalsy(result)) {
            args[0] = result;
          }
        });
      }

      return args[0];
    }

    /**
     * Get event type and namespace
     * @param {string} typeStr Event type name
     * @returns {{type: string, namespace: string}}
     * @private
     */

  }, {
    key: '_getTypeInfo',
    value: function _getTypeInfo(typeStr) {
      var splited = typeStr.split('.');

      return {
        type: splited[0],
        namespace: splited[1]
      };
    }

    /**
     * Check whether event type exists or not
     * @param {string} type Event type name
     * @returns {boolean}
     * @private
     */

  }, {
    key: '_hasEventType',
    value: function _hasEventType(type) {
      return !_tuiCodeSnippet2.default.isUndefined(this.TYPE[this._getTypeInfo(type).type]);
    }

    /**
     * Add event type when given event not exists
     * @param {string} type Event type name
     */

  }, {
    key: 'addEventType',
    value: function addEventType(type) {
      if (this._hasEventType(type)) {
        throw new Error('There is already have event type ' + type);
      }

      this.TYPE.set(type);
    }

    /**
     * Remove event handler from given event type
     * @param {string} typeStr Event type name
     * @param {function} [handler] - registered event handler
     */

  }, {
    key: 'removeEventHandler',
    value: function removeEventHandler(typeStr, handler) {
      var _this = this;

      var _getTypeInfo2 = this._getTypeInfo(typeStr),
          type = _getTypeInfo2.type,
          namespace = _getTypeInfo2.namespace;

      if (type && handler) {
        this._removeEventHandlerWithHandler(type, handler);
      } else if (type && !namespace) {
        // dont use dot notation cuz eslint
        this.events['delete'](type);
      } else if (!type && namespace) {
        this.events.forEach(function (eventHandlers, eventType) {
          _this._removeEventHandlerWithTypeInfo(eventType, namespace);
        });
      } else if (type && namespace) {
        this._removeEventHandlerWithTypeInfo(type, namespace);
      }
    }

    /**
     * Remove event handler with event handler
     * @param {string} type - event type name
     * @param {function} handler - event handler
     * @private
     */

  }, {
    key: '_removeEventHandlerWithHandler',
    value: function _removeEventHandlerWithHandler(type, handler) {
      var eventHandlers = this.events.get(type) || [];
      var handlerIndex = eventHandlers.indexOf(handler);
      if (handlerIndex >= 0) {
        eventHandlers.splice(handlerIndex, 1);
      }
    }

    /**
     * Remove event handler with event type information
     * @param {string} type Event type name
     * @param {string} namespace Event namespace
     * @private
     */

  }, {
    key: '_removeEventHandlerWithTypeInfo',
    value: function _removeEventHandlerWithTypeInfo(type, namespace) {
      var handlersToSurvive = [];
      var eventHandlers = this.events.get(type);

      if (!eventHandlers) {
        return;
      }

      eventHandlers.map(function (handler) {
        if (handler.namespace !== namespace) {
          handlersToSurvive.push(handler);
        }

        return null;
      });

      this.events.set(type, handlersToSurvive);
    }
  }]);

  return EventManager;
}();

exports.default = EventManager;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview extension manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class ExtManager
 * @ignore
 */
var ExtManager = function () {
  function ExtManager() {
    _classCallCheck(this, ExtManager);

    this.exts = new _tuiCodeSnippet2.default.Map();
  }

  /**
   * Defined Extension
   * @param {string} name extension name
   * @param {function} ext extension
   */


  _createClass(ExtManager, [{
    key: 'defineExtension',
    value: function defineExtension(name, ext) {
      this.exts.set(name, ext);
    }

    /**
     * Apply extensions
     * @param {object} context Context
     * @param {Array.<string|object>} options - options or names array
     */

  }, {
    key: 'applyExtension',
    value: function applyExtension(context, options) {
      var _this = this;

      if (options) {
        options.forEach(function (option) {
          var hasOption = _tuiCodeSnippet2.default.isObject(option);
          var name = hasOption ? option.name : option;

          if (_this.exts.has(name)) {
            var ext = _this.exts.get(name);
            if (hasOption) {
              ext(context, option);
            } else {
              ext(context);
            }
          }
        });
      }
    }
  }]);

  return ExtManager;
}();

exports.default = new ExtManager();

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Convertor have responsible to convert markdown and html
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _markdownIt = __webpack_require__(23);

var _markdownIt2 = _interopRequireDefault(_markdownIt);

var _toMark = __webpack_require__(18);

var _toMark2 = _interopRequireDefault(_toMark);

var _htmlSanitizer = __webpack_require__(9);

var _htmlSanitizer2 = _interopRequireDefault(_htmlSanitizer);

var _markdownitTaskPlugin = __webpack_require__(24);

var _markdownitTaskPlugin2 = _interopRequireDefault(_markdownitTaskPlugin);

var _markdownitCodeBlockPlugin = __webpack_require__(25);

var _markdownitCodeBlockPlugin2 = _interopRequireDefault(_markdownitCodeBlockPlugin);

var _markdownitCodeRenderer = __webpack_require__(26);

var _markdownitCodeRenderer2 = _interopRequireDefault(_markdownitCodeRenderer);

var _markdownitBlockQuoteRenderer = __webpack_require__(27);

var _markdownitBlockQuoteRenderer2 = _interopRequireDefault(_markdownitBlockQuoteRenderer);

var _markdownitTableRenderer = __webpack_require__(28);

var _markdownitTableRenderer2 = _interopRequireDefault(_markdownitTableRenderer);

var _markdownitHtmlBlockRenderer = __webpack_require__(29);

var _markdownitHtmlBlockRenderer2 = _interopRequireDefault(_markdownitHtmlBlockRenderer);

var _markdownitBackticksRenderer = __webpack_require__(30);

var _markdownitBackticksRenderer2 = _interopRequireDefault(_markdownitBackticksRenderer);

var _markdownitInlinePlugin = __webpack_require__(31);

var _codeBlockManager = __webpack_require__(7);

var _codeBlockManager2 = _interopRequireDefault(_codeBlockManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var markdownitHighlight = new _markdownIt2.default({
  html: true,
  breaks: true,
  quotes: '“”‘’',
  langPrefix: 'lang-',
  highlight: function highlight(codeText, type) {
    return _codeBlockManager2.default.createCodeBlockHtml(type, codeText);
  }
});
var markdownit = new _markdownIt2.default({
  html: true,
  breaks: true,
  quotes: '“”‘’',
  langPrefix: 'lang-'
});

// markdownitHighlight
markdownitHighlight.block.ruler.at('code', _markdownitCodeRenderer2.default);
markdownitHighlight.block.ruler.at('table', _markdownitTableRenderer2.default, {
  alt: ['paragraph', 'reference']
});
markdownitHighlight.block.ruler.at('blockquote', _markdownitBlockQuoteRenderer2.default, {
  alt: ['paragraph', 'reference', 'blockquote', 'list']
});
markdownitHighlight.block.ruler.at('html_block', _markdownitHtmlBlockRenderer2.default, {
  alt: ['paragraph', 'reference', 'blockquote']
});
markdownitHighlight.inline.ruler.at('backticks', _markdownitBackticksRenderer2.default);
markdownitHighlight.use(_markdownitTaskPlugin2.default);
markdownitHighlight.use(_markdownitCodeBlockPlugin2.default);

markdownitHighlight.renderer.rules.softbreak = function (tokens, idx, options) {
  if (!options.breaks) {
    return '\n';
  }

  var prevToken = tokens[idx - 1];

  if (prevToken && prevToken.type === 'html_inline' && prevToken.content === '<br>') {
    return '';
  }

  return options.xhtmlOut ? '<br />\n' : '<br>\n';
};

// markdownit
markdownit.block.ruler.at('code', _markdownitCodeRenderer2.default);
markdownit.block.ruler.at('table', _markdownitTableRenderer2.default, {
  alt: ['paragraph', 'reference']
});
markdownit.block.ruler.at('blockquote', _markdownitBlockQuoteRenderer2.default, {
  alt: ['paragraph', 'reference', 'blockquote', 'list']
});
markdownit.block.ruler.at('html_block', _markdownitHtmlBlockRenderer2.default, {
  alt: ['paragraph', 'reference', 'blockquote']
});
markdownit.inline.ruler.at('backticks', _markdownitBackticksRenderer2.default);
markdownit.use(_markdownitTaskPlugin2.default);
markdownit.use(_markdownitCodeBlockPlugin2.default);

// This regular expression refere markdownIt.
// https://github.com/markdown-it/markdown-it/blob/master/lib/common/html_re.js
var attrName = '[a-zA-Z_:][a-zA-Z0-9:._-]*';
var unquoted = '[^"\'=<>`\\x00-\\x20]+';
var singleQuoted = "'[^']*'";
var doubleQuoted = '"[^"]*"';
var attrValue = '(?:' + unquoted + '|' + singleQuoted + '|' + doubleQuoted + ')';
var attribute = '(?:\\s+' + attrName + '(?:\\s*=\\s*' + attrValue + ')?)*\\s*';
var openingTag = '(\\\\<|<)([A-Za-z][A-Za-z0-9\\-]*' + attribute + ')(\\/?>)';
var HTML_TAG_RX = new RegExp(openingTag, 'g');

/**
 * Class Convertor
 * @param {EventManager} em - EventManager instance
 * @ignore
 */

var Convertor = function () {
  function Convertor(em) {
    _classCallCheck(this, Convertor);

    this.eventManager = em;
  }

  /**
   * _markdownToHtmlWithCodeHighlight
   * Convert markdown to html with Codehighlight
   * @param {string} markdown markdown text
   * @param {object} env environment sandbox for markdownit
   * @returns {string} html text
   * @private
   */


  _createClass(Convertor, [{
    key: '_markdownToHtmlWithCodeHighlight',
    value: function _markdownToHtmlWithCodeHighlight(markdown, env) {
      markdown = this._replaceImgAttrToDataProp(markdown);

      return markdownitHighlight.render(markdown, env);
    }

    /**
     * _markdownToHtml
     * Convert markdown to html
     * @param {string} markdown markdown text
     * @param {object} env environment sandbox for markdownit
     * @returns {string} html text
     * @private
     */

  }, {
    key: '_markdownToHtml',
    value: function _markdownToHtml(markdown, env) {
      markdown = markdown.replace(HTML_TAG_RX, function (match, $1, $2, $3) {
        return match[0] !== '\\' ? '' + $1 + $2 + ' data-tomark-pass ' + $3 : match;
      });

      markdown = this._replaceImgAttrToDataProp(markdown);

      return markdownit.render(markdown, env);
    }

    /**
     * Replace 'onerror' attribute of img tag to data property string
     * @param {string} markdown markdown text
     * @returns {string} replaced markdown text
     * @private
     */

  }, {
    key: '_replaceImgAttrToDataProp',
    value: function _replaceImgAttrToDataProp(markdown) {
      var onerrorStripeRegex = /(<img[^>]*)(onerror\s*=\s*[\\"']?[^\\"']*[\\"']?)(.*)/i;

      while (onerrorStripeRegex.exec(markdown)) {
        markdown = markdown.replace(onerrorStripeRegex, '$1$3');
      }

      return markdown;
    }

    /**
     * Remove BR's data-tomark-pass attribute text when br in code element
     * @param {string} renderedHTML Rendered HTML string from markdown editor
     * @returns {string}
     * @private
     */

  }, {
    key: '_removeBrToMarkPassAttributeInCode',
    value: function _removeBrToMarkPassAttributeInCode(renderedHTML) {
      var $wrapperDiv = (0, _jquery2.default)('<div />');

      $wrapperDiv.html(renderedHTML);

      $wrapperDiv.find('code, pre').each(function (i, codeOrPre) {
        var $code = (0, _jquery2.default)(codeOrPre);
        $code.html($code.html().replace(/\sdata-tomark-pass\s(\/?)&gt;/g, '$1&gt;'));
      });

      renderedHTML = $wrapperDiv.html();

      return renderedHTML;
    }

    /**
     * toHTMLWithCodeHightlight
     * Convert markdown to html with Codehighlight
     * emit convertorAfterMarkdownToHtmlConverted
     * @param {string} markdown markdown text
     * @returns {string} html text
     */

  }, {
    key: 'toHTMLWithCodeHightlight',
    value: function toHTMLWithCodeHightlight(markdown) {
      var html = this._markdownToHtmlWithCodeHighlight(markdown);
      html = this.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', html);

      return html;
    }

    /**
     * toHTML
     * Convert markdown to html
     * emit convertorAfterMarkdownToHtmlConverted
     * @param {string} markdown markdown text
     * @returns {string} html text
     */

  }, {
    key: 'toHTML',
    value: function toHTML(markdown) {
      var html = this._markdownToHtml(markdown);

      html = this.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', html);
      html = this._removeBrToMarkPassAttributeInCode(html);

      return html;
    }
  }, {
    key: 'initHtmlSanitizer',
    value: function initHtmlSanitizer() {
      this.eventManager.listen('convertorAfterMarkdownToHtmlConverted', function (html) {
        return (0, _htmlSanitizer2.default)(html, true);
      });
    }

    /**
     * set link attribute to markdownitHighlight, markdownit
     * using linkAttribute of markdownItInlinePlugin
     * @param {object} attr markdown text
     */

  }, {
    key: 'setLinkAttribute',
    value: function setLinkAttribute(attr) {
      var keys = Object.keys(attr);
      var setAttributeToToken = function setAttributeToToken(tokens, idx) {
        keys.forEach(function (key) {
          tokens[idx].attrPush([key, attr[key]]);
        });
      };

      markdownitHighlight.use(_markdownitInlinePlugin.linkAttribute, setAttributeToToken);
      markdownit.use(_markdownitInlinePlugin.linkAttribute, setAttributeToToken);
    }

    /**
     * toMarkdown
     * Convert html to markdown
     * emit convertorAfterHtmlToMarkdownConverted
     * @param {string} html html text
     * @param {object | null} toMarkOptions - toMark library options
     * @returns {string} markdown text
     */

  }, {
    key: 'toMarkdown',
    value: function toMarkdown(html, toMarkOptions) {
      var resultArray = [];

      html = this.eventManager.emitReduce('convertorBeforeHtmlToMarkdownConverted', html);
      html = this._appendAttributeForLinkIfNeed(html);
      html = this._appendAttributeForBrIfNeed(html);

      var markdown = (0, _toMark2.default)(html, toMarkOptions);

      markdown = this.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', markdown);
      markdown = this._removeNewlinesBeforeAfterAndBlockElement(markdown);

      _tuiCodeSnippet2.default.forEach(markdown.split('\n'), function (line, index) {
        var FIND_TABLE_RX = /^(<br>)+\||\|[^|]*\|/ig;
        var FIND_CODE_RX = /`[^`]*<br>[^`]*`/ig;
        var FIND_BRS_BEFORE_TABLE = /^(<br>)+\|/ig;

        if (FIND_TABLE_RX.test(line)) {
          line = line.replace(FIND_BRS_BEFORE_TABLE, function (match) {
            return match.replace(/<br>/ig, '<br>\n');
          });
        } else if (!FIND_CODE_RX.test(line)) {
          line = line.replace(/<br>/ig, '<br>\n');
        }
        resultArray[index] = line;
      });

      return resultArray.join('\n');
    }
  }, {
    key: '_removeNewlinesBeforeAfterAndBlockElement',
    value: function _removeNewlinesBeforeAfterAndBlockElement(markdown) {
      // Newlines('\n\n') are created on to-mark.
      var NEWLINES_BEFORE_BLOCK_RX = /<br>\n\n(#{1,6} .*|```|\||(\*+|-+|\d+\.) .*| *>[^\n]+.*)/g;
      var NEWLINES_AFTER_BLOCK_RX = /(#{1,6} .*|```|\|)\n\n<br>/g;

      markdown = markdown.replace(NEWLINES_BEFORE_BLOCK_RX, '<br>$1');
      markdown = markdown.replace(NEWLINES_AFTER_BLOCK_RX, '$1\n<br>');

      return markdown;
    }
  }, {
    key: '_appendAttributeForLinkIfNeed',
    value: function _appendAttributeForLinkIfNeed(html) {
      var LINK_RX = /!?\[.*\]\(<\s*a[^>]*>(.*?)<\s*\/\s*a>\)/ig;

      return html.replace(LINK_RX, function (match) {
        return match.replace(/<a /ig, '<a data-tomark-pass="" ');
      });
    }
  }, {
    key: '_appendAttributeForBrIfNeed',
    value: function _appendAttributeForBrIfNeed(html) {
      var FIND_BR_RX = /<br>/ig;
      var FIND_DOUBLE_BR_RX = /<br \/><br \/>/ig;
      var FIND_PASSING_AND_NORMAL_BR_RX = /<br data-tomark-pass \/><br \/>(.)/ig;
      var FIRST_TWO_BRS_BEFORE_RX = /([^>]|<\/a>|<\/code>|<\/span>|<\/b>|<\/i>|<\/s>|<img [^>]*>)/;
      var TWO_BRS_RX = /<br data-tomark-pass \/><br data-tomark-pass \/>/;
      var FIND_FIRST_TWO_BRS_RX = new RegExp(FIRST_TWO_BRS_BEFORE_RX.source + TWO_BRS_RX.source, 'g');
      var FIND_ATTRI_WITH_EMTPY_STR_RX = /<br data-tomark-pass="">/ig;

      html = html.replace(FIND_BR_RX, '<br />');

      html = html.replace(FIND_DOUBLE_BR_RX, '<br data-tomark-pass /><br data-tomark-pass />');
      html = html.replace(FIND_ATTRI_WITH_EMTPY_STR_RX, '<br data-tomark-pass />');

      html = html.replace(FIND_PASSING_AND_NORMAL_BR_RX, '<br data-tomark-pass /><br data-tomark-pass />$1');
      html = html.replace(FIND_FIRST_TWO_BRS_RX, '$1<br /><br />');

      // Preserve <br> when there is only one empty line before or after a block element.
      html = html.replace(/(.)<br \/><br \/>(<h[1-6]>|<pre>|<table>|<ul>|<ol>|<blockquote>)/g, '$1<br /><br data-tomark-pass />$2');
      html = html.replace(/(<\/h[1-6]>|<\/pre>|<\/table>|<\/ul>|<\/ol>|<\/blockquote>)<br \/>(.)/g, '$1<br data-tomark-pass />$2');

      return html;
    }

    /**
     * get markdownit with code highlight
     * @returns {markdownit} - markdownit instance
     * @static
     */

  }], [{
    key: 'getMarkdownitHighlightRenderer',
    value: function getMarkdownitHighlightRenderer() {
      return markdownitHighlight;
    }

    /**
     * get markdownit
     * @returns {markdownit} - markdownit instance
     * @static
     */

  }, {
    key: 'getMarkdownitRenderer',
    value: function getMarkdownitRenderer() {
      return markdownit;
    }
  }]);

  return Convertor;
}();

exports.default = Convertor;

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__18__;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _toolbarItem = __webpack_require__(11);

var _toolbarItem2 = _interopRequireDefault(_toolbarItem);

var _tooltip = __webpack_require__(35);

var _tooltip2 = _interopRequireDefault(_tooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements UI Button
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Class Button UI
 * @param {object} options - button options
 *     @param {string} options.className - button class name
 *     @param {string} options.command - command name to execute on click
 *     @param {string} options.event - event name to trigger on click
 *     @param {string} options.text - text on button
 *     @param {string} options.tooltip - text on tooltip
 *     @param {string} options.style - button style
 *     @param {string} options.state - button state
 * @param {jquery} $el - button rootElement
 * @deprecated
 */
var Button = function (_ToolbarItem) {
  _inherits(Button, _ToolbarItem);

  /**
   * item name
   * @type {String}
   * @static
   */
  function Button() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      tagName: 'button',
      name: Button.name
    };

    _classCallCheck(this, Button);

    var _this = _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this, {
      name: options.name,
      tagName: 'button',
      className: options.className + ' ' + Button.className,
      rootElement: options.$el
    }));

    _this._setOptions(options);

    _this._render();
    _this.on('click', _this._onClick.bind(_this));
    if (options.tooltip) {
      _this.on('mouseover', _this._onOver.bind(_this));
      _this.on('mouseout', _this._onOut.bind(_this));
    }
    return _this;
  }

  /**
   * set tooltip text
   * @param {string} text - tooltip text to show
   */


  /**
   * ToolbarItem className
   * @type {String}
   * @static
   */


  _createClass(Button, [{
    key: 'setTooltip',
    value: function setTooltip(text) {
      this._tooltip = text;
    }
  }, {
    key: '_setOptions',
    value: function _setOptions(options) {
      this._command = options.command;
      this._event = options.event;
      this._text = options.text;
      this._tooltip = options.tooltip;
      this._style = options.style;
      this._state = options.state;
    }
  }, {
    key: '_render',
    value: function _render() {
      this.$el.text(this._text);
      this.$el.attr('type', 'button');

      if (this._style) {
        this.$el.attr('style', this._style);
      }
    }
  }, {
    key: '_onClick',
    value: function _onClick() {
      if (!this.isEnabled()) {
        return;
      }

      if (this._command) {
        this.trigger('command', this._command);
      } else if (this._event) {
        this.trigger('event', this._event);
      }

      this.trigger('clicked');
    }
  }, {
    key: '_onOver',
    value: function _onOver() {
      if (!this.isEnabled()) {
        return;
      }

      _tooltip2.default.show(this.$el, this._tooltip);
    }
  }, {
    key: '_onOut',
    value: function _onOut() {
      _tooltip2.default.hide();
    }

    /**
     * enable button
     */

  }, {
    key: 'enable',
    value: function enable() {
      this.$el.attr('disabled', false);
    }

    /**
     * disable button
     */

  }, {
    key: 'disable',
    value: function disable() {
      this.$el.attr('disabled', true);
    }

    /**
     * check whether this button is enabled
     * @returns {Boolean} - true for enabled
     */

  }, {
    key: 'isEnabled',
    value: function isEnabled() {
      return !this.$el.attr('disabled');
    }
  }]);

  return Button;
}(_toolbarItem2.default);

Object.defineProperty(Button, 'name', {
  enumerable: true,
  writable: true,
  value: 'button'
});
Object.defineProperty(Button, 'className', {
  enumerable: true,
  writable: true,
  value: 'tui-toolbar-icons'
});
exports.default = Button;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileoverview Implements KeyMapper
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Constant of key mapping
 * @type {string[]}
 * @ignore
 */
var KEYBOARD_MAP = ['', // [0]
'', // [1]
'', // [2]
'CANCEL', // [3]
'', // [4]
'', // [5]
'HELP', // [6]
'', // [7]
'BACK_SPACE', // [8]
'TAB', // [9]
'', // [10]
'', // [11]
'CLEAR', // [12]
'ENTER', // [13]
'ENTER_SPECIAL', // [14]
'', // [15]
'', // [16] SHIFT
'', // [17] CONTROL
'', // [18] ALT
'PAUSE', // [19]
'CAPS_LOCK', // [20]
'KANA', // [21]
'EISU', // [22]
'JUNJA', // [23]
'FINAL', // [24]
'HANJA', // [25]
'', // [26]
'ESCAPE', // [27]
'CONVERT', // [28]
'NONCONVERT', // [29]
'ACCEPT', // [30]
'MODECHANGE', // [31]
'SPACE', // [32]
'PAGE_UP', // [33]
'PAGE_DOWN', // [34]
'END', // [35]
'HOME', // [36]
'LEFT', // [37]
'UP', // [38]
'RIGHT', // [39]
'DOWN', // [40]
'SELECT', // [41]
'PRINT', // [42]
'EXECUTE', // [43]
'PRINTSCREEN', // [44]
'INSERT', // [45]
'DELETE', // [46]
'', // [47]
'0', // [48]
'1', // [49]
'2', // [50]
'3', // [51]
'4', // [52]
'5', // [53]
'6', // [54]
'7', // [55]
'8', // [56]
'9', // [57]
':', // [58]
';', // [59]
'<', // [60]
'=', // [61]
'>', // [62]
'?', // [63]
'AT', // [64]
'A', // [65]
'B', // [66]
'C', // [67]
'D', // [68]
'E', // [69]
'F', // [70]
'G', // [71]
'H', // [72]
'I', // [73]
'J', // [74]
'K', // [75]
'L', // [76]
'M', // [77]
'N', // [78]
'O', // [79]
'P', // [80]
'Q', // [81]
'R', // [82]
'S', // [83]
'T', // [84]
'U', // [85]
'V', // [86]
'W', // [87]
'X', // [88]
'Y', // [89]
'Z', // [90]
'', // [91] META
'', // [92]
'CONTEXT_MENU', // [93]
'', // [94]
'SLEEP', // [95]
'NUMPAD0', // [96]
'NUMPAD1', // [97]
'NUMPAD2', // [98]
'NUMPAD3', // [99]
'NUMPAD4', // [100]
'NUMPAD5', // [101]
'NUMPAD6', // [102]
'NUMPAD7', // [103]
'NUMPAD8', // [104]
'NUMPAD9', // [105]
'MULTIPLY', // [106]
'ADD', // [107]
'SEPARATOR', // [108]
'SUBTRACT', // [109]
'DECIMAL', // [110]
'DIVIDE', // [111]
'F1', // [112]
'F2', // [113]
'F3', // [114]
'F4', // [115]
'F5', // [116]
'F6', // [117]
'F7', // [118]
'F8', // [119]
'F9', // [120]
'F10', // [121]
'F11', // [122]
'F12', // [123]
'F13', // [124]
'F14', // [125]
'F15', // [126]
'F16', // [127]
'F17', // [128]
'F18', // [129]
'F19', // [130]
'F20', // [131]
'F21', // [132]
'F22', // [133]
'F23', // [134]
'F24', // [135]
'', // [136]
'', // [137]
'', // [138]
'', // [139]
'', // [140]
'', // [141]
'', // [142]
'', // [143]
'NUM_LOCK', // [144]
'SCROLL_LOCK', // [145]
'WIN_OEM_FJ_JISHO', // [146]
'WIN_OEM_FJ_MASSHOU', // [147]
'WIN_OEM_FJ_TOUROKU', // [148]
'WIN_OEM_FJ_LOYA', // [149]
'WIN_OEM_FJ_ROYA', // [150]
'', // [151]
'', // [152]
'', // [153]
'', // [154]
'', // [155]
'', // [156]
'', // [157]
'', // [158]
'', // [159]
'@', // [160]
'!', // [161]
'"', // [162]
'#', // [163]
'$', // [164]
'%', // [165]
'&', // [166]
'_', // [167]
'(', // [168]
')', // [169]
'*', // [170]
'+', // [171]
'|', // [172]
'-', // [173]
'{', // [174]
'}', // [175]
'~', // [176]
'', // [177]
'', // [178]
'', // [179]
'', // [180]
'VOLUME_MUTE', // [181]
'VOLUME_DOWN', // [182]
'VOLUME_UP', // [183]
'', // [184]
'', // [185]
';', // [186]
'=', // [187]
',', // [188]
'-', // [189]
'.', // [190]
'/', // [191]
'`', // [192]
'', // [193]
'', // [194]
'', // [195]
'', // [196]
'', // [197]
'', // [198]
'', // [199]
'', // [200]
'', // [201]
'', // [202]
'', // [203]
'', // [204]
'', // [205]
'', // [206]
'', // [207]
'', // [208]
'', // [209]
'', // [210]
'', // [211]
'', // [212]
'', // [213]
'', // [214]
'', // [215]
'', // [216]
'', // [217]
'', // [218]
'[', // [219]
'\\', // [220]
']', // [221]
'\'', // [222]
'', // [223]
'META', // [224]
'ALTGR', // [225]
'', // [226]
'WIN_ICO_HELP', // [227]
'WIN_ICO_00', // [228]
'', // [229]
'WIN_ICO_CLEAR', // [230]
'', // [231]
'', // [232]
'WIN_OEM_RESET', // [233]
'WIN_OEM_JUMP', // [234]
'WIN_OEM_PA1', // [235]
'WIN_OEM_PA2', // [236]
'WIN_OEM_PA3', // [237]
'WIN_OEM_WSCTRL', // [238]
'WIN_OEM_CUSEL', // [239]
'WIN_OEM_ATTN', // [240]
'WIN_OEM_FINISH', // [241]
'WIN_OEM_COPY', // [242]
'WIN_OEM_AUTO', // [243]
'WIN_OEM_ENLW', // [244]
'WIN_OEM_BACKTAB', // [245]
'ATTN', // [246]
'CRSEL', // [247]
'EXSEL', // [248]
'EREOF', // [249]
'PLAY', // [250]
'ZOOM', // [251]
'', // [252]
'PA1', // [253]
'WIN_OEM_CLEAR', // [254]
'' // [255]
];

var sharedInstance = void 0;

/**
 * Class KeyMapper
 * @param {object} [options] options
 * @param {string} options.splitter splitter string default is +
 * @ignore
 */

var KeyMapper = function () {
  function KeyMapper(options) {
    _classCallCheck(this, KeyMapper);

    this._setSplitter(options);
  }

  /**
   * Set key splitter
   * @param {object} options Option object
   * @private
   */


  _createClass(KeyMapper, [{
    key: '_setSplitter',
    value: function _setSplitter(options) {
      var splitter = options ? options.splitter : '+';
      this._splitter = splitter;
    }

    /**
     * Convert event to keyMap
     * @param {event} event Event object
     * @returns {string}
     */

  }, {
    key: 'convert',
    value: function convert(event) {
      var keyMap = [];

      if (event.shiftKey) {
        keyMap.push('SHIFT');
      }

      if (event.ctrlKey) {
        keyMap.push('CTRL');
      }

      if (event.metaKey) {
        keyMap.push('META');
      }

      if (event.altKey) {
        keyMap.push('ALT');
      }

      var keyChar = this._getKeyCodeChar(event.keyCode);

      if (keyChar) {
        keyMap.push(keyChar);
      }

      return keyMap.join(this._splitter);
    }

    /**
     * Get character from key code
     * @param {number} keyCode Key code
     * @returns {string}
     * @private
     */

  }, {
    key: '_getKeyCodeChar',
    value: function _getKeyCodeChar(keyCode) {
      var keyCodeCharacter = KEYBOARD_MAP[keyCode];

      return keyCodeCharacter;
    }

    /**
     * Get sharedInstance
     * @returns {KeyMapper}
     */

  }], [{
    key: 'getSharedInstance',
    value: function getSharedInstance() {
      if (!sharedInstance) {
        sharedInstance = new KeyMapper();
      }

      return sharedInstance;
    }

    /**
     * get key code for a character
     * @param {string} char - a character to be converted
     * @returns {number} key code for the char
     * @static
     */

  }, {
    key: 'keyCode',
    value: function keyCode(char) {
      return KEYBOARD_MAP.indexOf(char);
    }
  }]);

  return KeyMapper;
}();

exports.default = KeyMapper;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements LazyRunner
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class LazyRunner
 * @ignore
 */
var LazyRunner = function () {
  function LazyRunner() {
    _classCallCheck(this, LazyRunner);

    this.globalTOID = null;
    this.lazyRunFunctions = {};
  }

  _createClass(LazyRunner, [{
    key: 'run',
    value: function run(fn, params, context, delay) {
      var TOID = void 0;

      if (_tuiCodeSnippet2.default.isString(fn)) {
        TOID = this._runRegisteredRun(fn, params, context, delay);
      } else {
        TOID = this._runSingleRun(fn, params, context, delay, this.globalTOID);
        this.globalTOID = TOID;
      }

      return TOID;
    }
  }, {
    key: 'registerLazyRunFunction',
    value: function registerLazyRunFunction(name, fn, delay, context) {
      context = context || this;

      this.lazyRunFunctions[name] = {
        fn: fn,
        delay: delay,
        context: context,
        TOID: null
      };
    }
  }, {
    key: '_runSingleRun',
    value: function _runSingleRun(fn, params, context, delay, TOID) {
      this._clearTOIDIfNeed(TOID);

      TOID = setTimeout(function () {
        fn.call(context, params);
      }, delay);

      return TOID;
    }
  }, {
    key: '_runRegisteredRun',
    value: function _runRegisteredRun(lazyRunName, params, context, delay) {
      var lazyRunFunction = this.lazyRunFunctions[lazyRunName];
      var fn = lazyRunFunction.fn;
      var TOID = lazyRunFunction.TOID;

      delay = delay || lazyRunFunction.delay;
      context = context || lazyRunFunction.context;

      TOID = this._runSingleRun(fn, params, context, delay, TOID);

      lazyRunFunction.TOID = TOID;

      return TOID;
    }
  }, {
    key: '_clearTOIDIfNeed',
    value: function _clearTOIDIfNeed(TOID) {
      if (TOID) {
        clearTimeout(TOID);
      }
    }
  }]);

  return LazyRunner;
}();

exports.default = LazyRunner;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements Command
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class Command
 * @param {string} name Command name
 * @param {number} type Command type (Command.TYPE)
 * @param {Array.<string>} [keyMap] keyMap
 * @ignore
 */
var Command = function () {
  function Command(name, type, keyMap) {
    _classCallCheck(this, Command);

    this.name = name;
    this.type = type;

    if (keyMap) {
      this.setKeyMap(keyMap);
    }
  }

  /**
   * returns Name of command
   * @returns {string} Command Name
   */


  _createClass(Command, [{
    key: 'getName',
    value: function getName() {
      return this.name;
    }

    /**
     * returns Type of command
     * @returns {number} Command Command type number
     */

  }, {
    key: 'getType',
    value: function getType() {
      return this.type;
    }

    /**
     * returns whether Command Type is Markdown or not
     * @returns {boolean} result
     */

  }, {
    key: 'isMDType',
    value: function isMDType() {
      return this.type === Command.TYPE.MD;
    }

    /**
     * returns whether Command Type is Wysiwyg or not
     * @returns {boolean} result
     */

  }, {
    key: 'isWWType',
    value: function isWWType() {
      return this.type === Command.TYPE.WW;
    }

    /**
     * returns whether Command Type is Global or not
     * @returns {boolean} result
     */

  }, {
    key: 'isGlobalType',
    value: function isGlobalType() {
      return this.type === Command.TYPE.GB;
    }

    /**
     * Set keymap value for each os
     * @param {string} win Windows Key(and etc)
     * @param {string} mac Mac osx key
     */

  }, {
    key: 'setKeyMap',
    value: function setKeyMap(win, mac) {
      this.keyMap = [win, mac];
    }
  }]);

  return Command;
}();

/**
 * Command factory method
 * @param {string} typeStr Editor type name
 * @param {object} props Property
 *     @param {string} props.name Command name
 *     @param {number} props.type Command type number
 * @returns {Command}
 * @static
 */


Command.factory = function (typeStr, props) {
  var type = void 0;

  if (typeStr === 'markdown') {
    type = Command.TYPE.MD;
  } else if (typeStr === 'wysiwyg') {
    type = Command.TYPE.WW;
  } else if (typeStr === 'global') {
    type = Command.TYPE.GB;
  }

  var command = new Command(props.name, type);

  _tuiCodeSnippet2.default.extend(command, props);

  return command;
};

/**
 * Command Type Constant
 * markdown : 0
 * wysiwyg : 1
 * global : 2
 * @type {object}
 * @private
 */
Command.TYPE = {
  MD: 0,
  WW: 1,
  GB: 2
};

exports.default = Command;

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__23__;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Copyright (c) 2016, Revin Guillen.
// Distributed under an MIT license: https://github.com/revin/markdown-it-task-lists/

/**
 * @fileoverview Implements markdownitTaskPlugin
 * @modifier Sungho Kim(sungho-kim@nhn.com) FE Development Lab/NHN
 * @modifier Junghwan Park(junghwan.park@nhn.com) FE Development Lab/NHN
 */
/* eslint-disable */

/**
 * Task list renderer for Markdown-it
 * @param {object} markdownit Markdown-it instance
 * @ignore
 */
var MarkdownitTaskRenderer = function MarkdownitTaskRenderer(markdownit) {
    markdownit.core.ruler.after('inline', 'tui-task-list', function (state) {
        var TASK_LIST_ITEM_CLASS_NAME = 'task-list-item';
        var CHECKED_CLASS_NAME = 'checked';
        var tokens = state.tokens;
        var className;
        var tokenIndex;

        // tokenIndex=0 'ul', tokenIndex=1 'li', tokenIndex=2 'p_open'
        for (tokenIndex = 2; tokenIndex < tokens.length; tokenIndex += 1) {
            if (isTaskListItemToken(tokens, tokenIndex)) {
                if (isChecked(tokens[tokenIndex])) {
                    className = TASK_LIST_ITEM_CLASS_NAME + ' ' + CHECKED_CLASS_NAME;
                } else {
                    className = TASK_LIST_ITEM_CLASS_NAME;
                }

                removeMarkdownTaskFormatText(tokens[tokenIndex]);

                setTokenAttribute(tokens[tokenIndex - 2], 'class', className);
                setTokenAttribute(tokens[tokenIndex - 2], 'data-te-task', '');
            }
        }
    });
};

/**
 * Remove task format text for rendering
 * @param {object} token Token object
 * @ignore
 */
function removeMarkdownTaskFormatText(token) {
    // '[X] ' length is 4
    // FIXED: we don't need first space
    token.content = token.content.slice(4);
    token.children[0].content = token.children[0].content.slice(4);
}

/**
 * Return boolean value whether task checked or not
 * @param {object} token Token object
 * @returns {boolean}
 * @ignore
 */
function isChecked(token) {
    var checked = false;

    if (token.content.indexOf('[x]') === 0 || token.content.indexOf('[X]') === 0) {
        checked = true;
    }

    return checked;
}

/**
 * Set attribute of passed token
 * @param {object} token Token object
 * @param {string} attributeName Attribute name for set
 * @param {string} attributeValue Attribute value for set
 * @ignore
 */
function setTokenAttribute(token, attributeName, attributeValue) {
    var index = token.attrIndex(attributeName);
    var attr = [attributeName, attributeValue];

    if (index < 0) {
        token.attrPush(attr);
    } else {
        token.attrs[index] = attr;
    }
}

/**
 * Return boolean value whether task list item or not
 * @param {array} tokens Token object
 * @param {number} index Number of token index
 * @returns {boolean}
 * @ignore
 */
function isTaskListItemToken(tokens, index) {
    return tokens[index].type === 'inline' && tokens[index - 1].type === 'paragraph_open' && tokens[index - 2].type === 'list_item_open' && (tokens[index].content.indexOf('[ ]') === 0 || tokens[index].content.indexOf('[x]') === 0 || tokens[index].content.indexOf('[X]') === 0);
}
/* eslint-enable */

module.exports = MarkdownitTaskRenderer;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Copyright (c) 2016, Revin Guillen.
// Distributed under an MIT license: https://github.com/revin/markdown-it-task-lists/
/* eslint-disable */
/**
 * @fileoverview Implements markdownitCodeBlockPlugin
 * @modifier NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Code block renderer for Markdown-it
 * @param {object} markdownit Markdown-it instance
 * @ignore
 */
var MarkdownitCodeBlockRenderer = function MarkdownitCodeBlockRenderer(markdownit) {
    markdownit.core.ruler.after('block', 'tui-code-block', function (state) {
        var DEFAULT_NUMBER_OF_BACKTICKS = 3;
        var tokens = state.tokens;
        var currentToken, tokenIndex, numberOfBackticks;

        for (tokenIndex = 0; tokenIndex < tokens.length; tokenIndex += 1) {
            currentToken = tokens[tokenIndex];

            if (isCodeFenceToken(currentToken)) {
                numberOfBackticks = currentToken.markup.length;
                if (numberOfBackticks > DEFAULT_NUMBER_OF_BACKTICKS) {
                    setTokenAttribute(currentToken, 'data-backticks', numberOfBackticks, true);
                }
                if (currentToken.info) {
                    setTokenAttribute(currentToken, 'data-language', escape(currentToken.info.replace(' ', ''), true));
                }
            }
        }
    });
};

/**
 * Set attribute of passed token
 * @param {object} token Token object
 * @param {string} attributeName Attribute name for set
 * @param {string} attributeValue Attribute value for set
 * @ignore
 */
function setTokenAttribute(token, attributeName, attributeValue) {
    var index = token.attrIndex(attributeName);
    var attr = [attributeName, attributeValue];

    if (index < 0) {
        token.attrPush(attr);
    } else {
        token.attrs[index] = attr;
    }
}
/**
 * Return boolean value whether passed token is code fence or not
 * @param {object} token Token object
 * @returns {boolean}
 * @ignore
 */
function isCodeFenceToken(token) {
    return token.block === true && token.tag === 'code' && token.type === 'fence';
}

/**
 * escape code from markdown-it
 * @param {string} html HTML string
 * @param {string} encode Boolean value of whether encode or not
 * @returns {string}
 * @ignore
 */
function escape(html, encode) {
    return html.replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
/* eslint-enable */

module.exports = MarkdownitCodeBlockRenderer;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.
// Distributed under an ISC license: https://github.com/markdown-it/markdown-it/
/**
 * @fileoverview Implements MarkdownItCodeRenderer
 * @modifier NHN FE Development Lab <dl_javascript@nhn.com>
 */

/* eslint-disable */
module.exports = function code(state, startLine, endLine /*, silent*/) {
    // Added by Junghwan Park
    var FIND_LIST_RX = / {0,3}(?:-|\*|\d\.) /;
    var lines = state.src.split('\n');
    var currentLine = lines[startLine];
    // Added by Junghwan Park

    var nextLine,
        last,
        token,
        emptyLines = 0;

    // Add condition by Junghwan Park
    if (currentLine.match(FIND_LIST_RX) || state.sCount[startLine] - state.blkIndent < 4) {
        // Add condition by Junghwan Park
        return false;
    }

    last = nextLine = startLine + 1;

    while (nextLine < endLine) {
        if (state.isEmpty(nextLine)) {
            emptyLines++;

            // workaround for lists: 2 blank lines should terminate indented
            // code block, but not fenced code block
            if (emptyLines >= 2 && state.parentType === 'list') {
                break;
            }

            nextLine++;
            continue;
        }

        emptyLines = 0;

        if (state.sCount[nextLine] - state.blkIndent >= 4) {
            nextLine++;
            last = nextLine;
            continue;
        }
        break;
    }

    state.line = last;

    token = state.push('code_block', 'code', 0);
    token.content = state.getLines(startLine, last, 4 + state.blkIndent, true);
    token.map = [startLine, state.line];

    return true;
};
/* eslint-enable */

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.
// Distributed under MIT license: https://github.com/markdown-it/markdown-it/
/**
 * @fileoverview Implements markdownitCodeBlockQuoteRenderer
 * @modifier NHN FE Development Lab <dl_javascript@nhn.com>
 */

/* eslint-disable */

// Block quotes



// prevent quote, pre in list #811
// ref: #989
// #811 START
// var isSpace = require('../common/utils').isSpace;

function isSpace(code) {
  switch (code) {
    case 0x09:
    case 0x20:
      return true;
  }
  return false;
}
// #811 END

module.exports = function blockquote(state, startLine, endLine, silent) {
  var adjustTab,
      ch,
      i,
      initial,
      l,
      lastLineEmpty,
      lines,
      nextLine,
      offset,
      oldBMarks,
      oldBSCount,
      oldIndent,
      oldParentType,
      oldSCount,
      oldTShift,
      spaceAfterMarker,
      terminate,
      terminatorRules,
      token,
      wasOutdented,
      oldLineMax = state.lineMax,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  // #811 START
  var FIND_LIST_RX = /(?:-|\*|\d+\.) {1,4}(?:> {0,3})[^>]*$/;
  var sourceLines = state.src.split('\n');
  var currentLine = sourceLines[startLine];
  // #811 END

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }

  // check the block quote marker
  if (state.src.charCodeAt(pos++) !== 0x3E /* > */) {
      return false;
    }
  // #811 START
  // check block quote in list
  if (currentLine.match(FIND_LIST_RX) /*&& !currentLine.match(/^ {0,6}>/)*/) {
      return false;
    }
  // #811 END

  // we know that it's going to be a valid blockquote,
  // so no point trying to find the end of it in silent mode
  if (silent) {
    return true;
  }

  // skip spaces after ">" and re-calculate offset
  initial = offset = state.sCount[startLine] + pos - (state.bMarks[startLine] + state.tShift[startLine]);

  // skip one optional space after '>'
  if (state.src.charCodeAt(pos) === 0x20 /* space */) {
      // ' >   test '
      //     ^ -- position start of line here:
      pos++;
      initial++;
      offset++;
      adjustTab = false;
      spaceAfterMarker = true;
    } else if (state.src.charCodeAt(pos) === 0x09 /* tab */) {
      spaceAfterMarker = true;

      if ((state.bsCount[startLine] + offset) % 4 === 3) {
        // '  >\t  test '
        //       ^ -- position start of line here (tab has width===1)
        pos++;
        initial++;
        offset++;
        adjustTab = false;
      } else {
        // ' >\t  test '
        //    ^ -- position start of line here + shift bsCount slightly
        //         to make extra space appear
        adjustTab = true;
      }
    } else {
    spaceAfterMarker = false;
  }

  oldBMarks = [state.bMarks[startLine]];
  state.bMarks[startLine] = pos;

  while (pos < max) {
    ch = state.src.charCodeAt(pos);

    if (isSpace(ch)) {
      if (ch === 0x09) {
        offset += 4 - (offset + state.bsCount[startLine] + (adjustTab ? 1 : 0)) % 4;
      } else {
        offset++;
      }
    } else {
      break;
    }

    pos++;
  }

  oldBSCount = [state.bsCount[startLine]];
  state.bsCount[startLine] = state.sCount[startLine] + 1 + (spaceAfterMarker ? 1 : 0);

  lastLineEmpty = pos >= max;

  oldSCount = [state.sCount[startLine]];
  state.sCount[startLine] = offset - initial;

  oldTShift = [state.tShift[startLine]];
  state.tShift[startLine] = pos - state.bMarks[startLine];

  terminatorRules = state.md.block.ruler.getRules('blockquote');

  oldParentType = state.parentType;
  state.parentType = 'blockquote';
  wasOutdented = false;

  // Search the end of the block
  //
  // Block ends with either:
  //  1. an empty line outside:
  //     ```
  //     > test
  //
  //     ```
  //  2. an empty line inside:
  //     ```
  //     >
  //     test
  //     ```
  //  3. another tag:
  //     ```
  //     > test
  //      - - -
  //     ```
  for (nextLine = startLine + 1; nextLine < endLine; nextLine++) {
    // check if it's outdented, i.e. it's inside list item and indented
    // less than said list item:
    //
    // ```
    // 1. anything
    //    > current blockquote
    // 2. checking this line
    // ```
    if (state.sCount[nextLine] < state.blkIndent) wasOutdented = true;

    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];

    if (pos >= max) {
      // Case 1: line is not inside the blockquote, and this line is empty.
      break;
    }

    if (state.src.charCodeAt(pos++) === 0x3E /* > */ && !wasOutdented) {
      // This line is inside the blockquote.

      // skip spaces after ">" and re-calculate offset
      initial = offset = state.sCount[nextLine] + pos - (state.bMarks[nextLine] + state.tShift[nextLine]);

      // skip one optional space after '>'
      if (state.src.charCodeAt(pos) === 0x20 /* space */) {
          // ' >   test '
          //     ^ -- position start of line here:
          pos++;
          initial++;
          offset++;
          adjustTab = false;
          spaceAfterMarker = true;
        } else if (state.src.charCodeAt(pos) === 0x09 /* tab */) {
          spaceAfterMarker = true;

          if ((state.bsCount[nextLine] + offset) % 4 === 3) {
            // '  >\t  test '
            //       ^ -- position start of line here (tab has width===1)
            pos++;
            initial++;
            offset++;
            adjustTab = false;
          } else {
            // ' >\t  test '
            //    ^ -- position start of line here + shift bsCount slightly
            //         to make extra space appear
            adjustTab = true;
          }
        } else {
        spaceAfterMarker = false;
      }

      oldBMarks.push(state.bMarks[nextLine]);
      state.bMarks[nextLine] = pos;

      while (pos < max) {
        ch = state.src.charCodeAt(pos);

        if (isSpace(ch)) {
          if (ch === 0x09) {
            offset += 4 - (offset + state.bsCount[nextLine] + (adjustTab ? 1 : 0)) % 4;
          } else {
            offset++;
          }
        } else {
          break;
        }

        pos++;
      }

      lastLineEmpty = pos >= max;

      oldBSCount.push(state.bsCount[nextLine]);
      state.bsCount[nextLine] = state.sCount[nextLine] + 1 + (spaceAfterMarker ? 1 : 0);

      oldSCount.push(state.sCount[nextLine]);
      state.sCount[nextLine] = offset - initial;

      oldTShift.push(state.tShift[nextLine]);
      state.tShift[nextLine] = pos - state.bMarks[nextLine];
      continue;
    }

    // Case 2: line is not inside the blockquote, and the last line was empty.
    if (lastLineEmpty) {
      break;
    }

    // Case 3: another tag found.
    terminate = false;
    for (i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }

    if (terminate) {
      // Quirk to enforce "hard termination mode" for paragraphs;
      // normally if you call `tokenize(state, startLine, nextLine)`,
      // paragraphs will look below nextLine for paragraph continuation,
      // but if blockquote is terminated by another tag, they shouldn't
      state.lineMax = nextLine;

      if (state.blkIndent !== 0) {
        // state.blkIndent was non-zero, we now set it to zero,
        // so we need to re-calculate all offsets to appear as
        // if indent wasn't changed
        oldBMarks.push(state.bMarks[nextLine]);
        oldBSCount.push(state.bsCount[nextLine]);
        oldTShift.push(state.tShift[nextLine]);
        oldSCount.push(state.sCount[nextLine]);
        state.sCount[nextLine] -= state.blkIndent;
      }

      break;
    }

    oldBMarks.push(state.bMarks[nextLine]);
    oldBSCount.push(state.bsCount[nextLine]);
    oldTShift.push(state.tShift[nextLine]);
    oldSCount.push(state.sCount[nextLine]);

    // A negative indentation means that this is a paragraph continuation
    //
    state.sCount[nextLine] = -1;
  }

  oldIndent = state.blkIndent;
  state.blkIndent = 0;

  token = state.push('blockquote_open', 'blockquote', 1);
  token.markup = '>';
  token.map = lines = [startLine, 0];

  state.md.block.tokenize(state, startLine, nextLine);

  token = state.push('blockquote_close', 'blockquote', -1);
  token.markup = '>';

  state.lineMax = oldLineMax;
  state.parentType = oldParentType;
  lines[1] = state.line;

  // Restore original tShift; this might not be necessary since the parser
  // has already been here, but just to make sure we can do that.
  for (i = 0; i < oldTShift.length; i++) {
    state.bMarks[i + startLine] = oldBMarks[i];
    state.tShift[i + startLine] = oldTShift[i];
    state.sCount[i + startLine] = oldSCount[i];
    state.bsCount[i + startLine] = oldBSCount[i];
  }
  state.blkIndent = oldIndent;

  return true;
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.
// Distributed under an ISC license: https://github.com/markdown-it/markdown-it/

/**
 * @fileoverview Implements markdownitTableRenderer
 * @modifier NHN FE Development Lab <dl_javascript@nhn.com>
 */

/*eslint-disable */
function getLine(state, line) {
    var pos = state.bMarks[line] + state.blkIndent,
        max = state.eMarks[line];

    return state.src.substr(pos, max - pos);
}

function escapedSplit(str) {
    var result = [],
        pos = 0,
        max = str.length,
        ch,
        escapes = 0,
        lastPos = 0,
        backTicked = false,
        lastBackTick = 0;

    ch = str.charCodeAt(pos);

    while (pos < max) {
        if (ch === 0x60 /* ` */ && escapes % 2 === 0) {
            backTicked = !backTicked;
            lastBackTick = pos;
        } else if (ch === 0x7c /* | */ && escapes % 2 === 0 && !backTicked) {
            result.push(str.substring(lastPos, pos));
            lastPos = pos + 1;
        } else if (ch === 0x5c /* \ */) {
                escapes += 1;
            } else {
            escapes = 0;
        }

        pos += 1;

        // If there was an un-closed backtick, go back to just after
        // the last backtick, but as if it was a normal character
        if (pos === max && backTicked) {
            backTicked = false;
            pos = lastBackTick + 1;
        }

        ch = str.charCodeAt(pos);
    }

    result.push(str.substring(lastPos));

    return result;
}

module.exports = function table(state, startLine, endLine, silent) {
    var ch, lineText, pos, i, nextLine, columns, columnCount, token, aligns, alignCount, t, tableLines, tbodyLines;

    // should have at least three lines
    if (startLine + 2 > endLine) {
        return false;
    }

    nextLine = startLine + 1;

    if (state.sCount[nextLine] < state.blkIndent) {
        return false;
    }

    // first character of the second line should be '|' or '-'

    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    if (pos >= state.eMarks[nextLine]) {
        return false;
    }

    ch = state.src.charCodeAt(pos);
    if (ch !== 0x7C /* | */ && ch !== 0x2D /* - */ && ch !== 0x3A /* : */) {
            return false;
        }

    lineText = getLine(state, startLine + 1);
    if (!/^[-:| ]+$/.test(lineText)) {
        return false;
    }

    columns = lineText.split('|');
    aligns = [];
    for (i = 0; i < columns.length; i += 1) {
        t = columns[i].trim();
        if (!t) {
            // allow empty columns before and after table, but not in between columns;
            // e.g. allow ` |---| `, disallow ` ---||--- `
            if (i === 0 || i === columns.length - 1) {
                continue;
            } else {
                return false;
            }
        }

        if (!/^:?-+:?$/.test(t)) {
            return false;
        }
        if (t.charCodeAt(t.length - 1) === 0x3A /* : */) {
                aligns.push(t.charCodeAt(0) === 0x3A /* : */ ? 'center' : 'right');
            } else if (t.charCodeAt(0) === 0x3A /* : */) {
                aligns.push('left');
            } else {
            aligns.push('');
        }
    }
    alignCount = aligns.length;

    lineText = getLine(state, startLine).trim();
    if (lineText.indexOf('|') === -1) {
        return false;
    }
    columns = escapedSplit(lineText.replace(/^\||\|$/g, ''));

    // header row will define an amount of columns in the entire table,
    // and align row shouldn't be smaller than that (the rest of the rows can)
    columnCount = columns.length;
    if (columnCount > alignCount) {
        return false;
    } else if (columnCount < alignCount) {
        for (i = 0; i < alignCount - columnCount; i += 1) {
            columns.push('');
        }
        columnCount = columns.length;
    }

    if (silent) {
        return true;
    }

    token = state.push('table_open', 'table', 1);
    token.map = tableLines = [startLine, 0];

    token = state.push('thead_open', 'thead', 1);
    token.map = [startLine, startLine + 1];

    token = state.push('tr_open', 'tr', 1);
    token.map = [startLine, startLine + 1];

    for (i = 0; i < columnCount; i += 1) {
        token = state.push('th_open', 'th', 1);
        token.map = [startLine, startLine + 1];
        if (aligns[i]) {
            // FIXED: change property style to align
            token.attrs = [['align', aligns[i]]];
        }

        token = state.push('inline', '', 0);
        token.content = columns[i].trim();
        token.map = [startLine, startLine + 1];
        token.children = [];

        token = state.push('th_close', 'th', -1);
    }

    token = state.push('tr_close', 'tr', -1);
    token = state.push('thead_close', 'thead', -1);

    token = state.push('tbody_open', 'tbody', 1);
    token.map = tbodyLines = [startLine + 2, 0];

    for (nextLine = startLine + 2; nextLine < endLine; nextLine += 1) {
        if (state.sCount[nextLine] < state.blkIndent) {
            break;
        }

        lineText = getLine(state, nextLine);
        if (lineText.indexOf('|') === -1) {
            break;
        }

        // keep spaces at beginning of line to indicate an empty first cell, but
        // strip trailing whitespace
        columns = escapedSplit(lineText.replace(/^\||\|\s*$/g, ''));

        token = state.push('tr_open', 'tr', 1);
        for (i = 0; i < columnCount; i += 1) {
            token = state.push('td_open', 'td', 1);
            if (aligns[i]) {
                // FIXED: change property style to align
                token.attrs = [['align', aligns[i]]];
            }

            token = state.push('inline', '', 0);
            token.content = columns[i] ? columns[i].trim() : '';
            token.children = [];

            token = state.push('td_close', 'td', -1);
        }
        token = state.push('tr_close', 'tr', -1);
    }
    token = state.push('tbody_close', 'tbody', -1);
    token = state.push('table_close', 'table', -1);

    tableLines[1] = tbodyLines[1] = nextLine;
    state.line = nextLine;
    return true;
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.
// Distributed under an ISC license: https://github.com/markdown-it/markdown-it/

/**
 * @fileoverview Implements markdownitHtmlBlockRenderer
 * @modifier NHN FE Development Lab <dl_javascript@nhn.com>
 */
/* eslint-disable */
// HTML block



// An array of opening and corresponding closing sequences for html tags,
// last argument defines whether it can terminate a paragraph or not
//

// void tag names --- Added by Junghwan Park

var voidTagNames = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
var HTML_SEQUENCES = [[/^<(script|pre|style)(?=(\s|>|$))/i, /<\/(script|pre|style)>/i, true], [/^<!--/, /-->/, true], [/^<\?/, /\?>/, true], [/^<![A-Z]/, />/, true], [/^<!\[CDATA\[/, /\]\]>/, true], [new RegExp('^<(' + voidTagNames.join('|') + ')', 'i'), /^\/?>$/, true], [new RegExp('^</?(address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h1|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|pre|section|source|title|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?=(\\s|/?>|$))', 'i'), /^$/, true], [/^(?:<[A-Za-z][A-Za-z0-9\-]*(?:\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\s*=\s*(?:[^"'=<>`\x00-\x20]+|'[^']*'|"[^"]*"))?)*\s*\/?>|<\/[A-Za-z][A-Za-z0-9\-]*\s*>)\s*$/, /^$/, false]];

module.exports = function html_block(state, startLine, endLine, silent) {
    var i,
        nextLine,
        token,
        lineText,
        pos = state.bMarks[startLine] + state.tShift[startLine],
        max = state.eMarks[startLine];

    if (!state.md.options.html) {
        return false;
    }

    if (state.src.charCodeAt(pos) !== 0x3C /* < */) {
            return false;
        }

    lineText = state.src.slice(pos, max);

    for (i = 0; i < HTML_SEQUENCES.length; i++) {
        if (HTML_SEQUENCES[i][0].test(lineText)) {
            // add condition for return when meet void element --- Added by Junghwan Park
            if (i === 5) {
                return false;
            } else {
                break;
            }
        }
    }

    if (i === HTML_SEQUENCES.length) {
        return false;
    }

    if (silent) {
        // true if this sequence can be a terminator, false otherwise
        return HTML_SEQUENCES[i][2];
    }

    nextLine = startLine + 1;

    // If we are here - we detected HTML block.
    // Let's roll down till block end.
    if (!HTML_SEQUENCES[i][1].test(lineText)) {
        for (; nextLine < endLine; nextLine++) {
            if (state.sCount[nextLine] < state.blkIndent) {
                break;
            }

            pos = state.bMarks[nextLine] + state.tShift[nextLine];
            max = state.eMarks[nextLine];
            lineText = state.src.slice(pos, max);

            if (HTML_SEQUENCES[i][1].test(lineText)) {
                if (lineText.length !== 0) {
                    nextLine++;
                }
                break;
            }
        }
    }

    state.line = nextLine;

    token = state.push('html_block', '', 0);
    token.map = [startLine, nextLine];
    token.content = state.getLines(startLine, nextLine, state.blkIndent, true);

    return true;
};
/* eslint-enable */

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.
// Distributed under MIT license: https://github.com/markdown-it/markdown-it/
/**
 * @fileoverview Implements markdownitBackticksRenderer
 * @modifier NHN FE Development Lab <dl_javascript@nhn.com>
 */
/* eslint-disable */

// Parse backticks
module.exports = function backtick(state, silent) {
  var start,
      max,
      marker,
      matchStart,
      matchEnd,
      token,
      pos = state.pos,
      ch = state.src.charCodeAt(pos);

  if (ch !== 0x60 /* ` */) {
      return false;
    }

  start = pos;
  pos++;
  max = state.posMax;

  while (pos < max && state.src.charCodeAt(pos) === 0x60 /* ` */) {
    pos++;
  }

  marker = state.src.slice(start, pos);

  matchStart = matchEnd = pos;

  while ((matchStart = state.src.indexOf('`', matchEnd)) !== -1) {
    matchEnd = matchStart + 1;

    while (matchEnd < max && state.src.charCodeAt(matchEnd) === 0x60 /* ` */) {
      matchEnd++;
    }

    if (matchEnd - matchStart === marker.length) {
      if (!silent) {
        token = state.push('code_inline', 'code', 0);
        token.markup = marker;
        token.content = state.src.slice(pos, matchStart).replace(/[ \n]+/g, ' ').trim();
        // TUI.EDITOR MODIFICATION START
        // store number of backtick in data-backtick
        // https://github.nhn.com/fe/tui.editor/pull/981
        token.attrSet('data-backticks', token.markup.length);
        // TUI.EDITOR MODIFICATION END
      }
      state.pos = matchEnd;
      return true;
    }
  }

  if (!silent) {
    state.pending += marker;
  }
  state.pos += marker.length;
  return true;
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// Copyright (c) 2014, Vitaly Puzrin.
// Distributed under an MIT license: https://github.com/markdown-it/markdown-it-for-inline
/* eslint-disable */

/**
 * @fileoverview Implements markdownItLinkPlugin
 * @modifier NHN FE Development Lab <dl_javascript@nhn.com>
 */

function for_inline_plugin(md, ruleName, tokenType, iteartor) {

  function scan(state) {
    var i, blkIdx, inlineTokens;

    for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
      if (state.tokens[blkIdx].type !== 'inline') {
        continue;
      }

      inlineTokens = state.tokens[blkIdx].children;

      for (i = inlineTokens.length - 1; i >= 0; i--) {
        if (inlineTokens[i].type !== tokenType) {
          continue;
        }

        iteartor(inlineTokens, i);
      }
    }
  }

  md.core.ruler.push(ruleName, scan);
};

var linkAttribute = exports.linkAttribute = function linkAttribute(markdownit, iteartor) {
  for_inline_plugin(markdownit, 'url_attribute', 'link_open', iteartor);
};

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__32__;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements editor preivew
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _mdPreview = __webpack_require__(12);

var _mdPreview2 = _interopRequireDefault(_mdPreview);

var _eventManager = __webpack_require__(15);

var _eventManager2 = _interopRequireDefault(_eventManager);

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _extManager = __webpack_require__(16);

var _extManager2 = _interopRequireDefault(_extManager);

var _convertor = __webpack_require__(17);

var _convertor2 = _interopRequireDefault(_convertor);

var _domUtils = __webpack_require__(4);

var _domUtils2 = _interopRequireDefault(_domUtils);

var _codeBlockManager = __webpack_require__(7);

var _codeBlockManager2 = _interopRequireDefault(_codeBlockManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TASK_ATTR_NAME = 'data-te-task';
var TASK_CHECKED_CLASS_NAME = 'checked';

/**
 * Class ToastUIEditorViewer
 * @param {object} options Option object
 *     @param {HTMLElement} options.el - container element
 *     @param {string} options.initialValue Editor's initial value
 *     @param {object} options.events eventlist Event list
 *         @param {function} options.events.load It would be emitted when editor fully load
 *         @param {function} options.events.change It would be emitted when content changed
 *         @param {function} options.events.stateChange It would be emitted when format change by cursor position
 *         @param {function} options.events.focus It would be emitted when editor get focus
 *         @param {function} options.events.blur It would be emitted when editor loose focus
 *     @param {object} options.hooks Hook list
 *     @param {function} options.hooks.previewBeforeHook Submit preview to hook URL before preview be shown
 *     @param {string[]} [options.exts] - extensions
 */

var ToastUIEditorViewer = function () {
  function ToastUIEditorViewer(options) {
    var _this = this;

    _classCallCheck(this, ToastUIEditorViewer);

    this.options = _jquery2.default.extend({
      useDefaultHTMLSanitizer: true,
      codeBlockLanguages: _codeBlockManager.CodeBlockManager.getHighlightJSLanguages(),
      customConvertor: null
    }, options);

    this.eventManager = new _eventManager2.default();
    this.commandManager = new _commandManager2.default(this);
    if (this.options.customConvertor) {
      // eslint-disable-next-line new-cap
      this.convertor = new this.options.customConvertor(this.eventManager);
    } else {
      this.convertor = new _convertor2.default(this.eventManager);
    }

    if (this.options.useDefaultHTMLSanitizer) {
      this.convertor.initHtmlSanitizer();
    }

    if (this.options.hooks) {
      _tuiCodeSnippet2.default.forEach(this.options.hooks, function (fn, key) {
        _this.addHook(key, fn);
      });
    }

    if (this.options.events) {
      _tuiCodeSnippet2.default.forEach(this.options.events, function (fn, key) {
        _this.on(key, fn);
      });
    }

    var _options = this.options,
        el = _options.el,
        initialValue = _options.initialValue;

    var existingHTML = el.innerHTML;
    el.innerHTML = '';

    this.preview = new _mdPreview2.default((0, _jquery2.default)(el), this.eventManager, this.convertor, true);

    this.preview.$el.on('mousedown', _jquery2.default.proxy(this._toggleTask, this));

    _extManager2.default.applyExtension(this, this.options.exts);

    if (initialValue) {
      this.setValue(initialValue);
    } else if (existingHTML) {
      this.preview.setHTML(existingHTML);
    }

    this.eventManager.emit('load', this);
  }

  /**
   * Toggle task by detecting mousedown event.
   * @param {MouseEvent} ev - event
   * @private
   */


  _createClass(ToastUIEditorViewer, [{
    key: '_toggleTask',
    value: function _toggleTask(ev) {
      var style = getComputedStyle(ev.target, ':before');

      if (ev.target.hasAttribute(TASK_ATTR_NAME) && _domUtils2.default.isInsideTaskBox(style, ev.offsetX, ev.offsetY)) {
        (0, _jquery2.default)(ev.target).toggleClass(TASK_CHECKED_CLASS_NAME);
        this.eventManager.emit('change', {
          source: 'viewer',
          data: ev
        });
      }
    }

    /**
     * Set content for preview
     * @param {string} markdown Markdown text
     */

  }, {
    key: 'setMarkdown',
    value: function setMarkdown(markdown) {
      this.markdownValue = markdown = markdown || '';

      this.preview.refresh(this.markdownValue);
      this.eventManager.emit('setMarkdownAfter', this.markdownValue);
    }

    /**
     * Set content for preview
     * @param {string} markdown Markdown text
     * @deprecated
     */

  }, {
    key: 'setValue',
    value: function setValue(markdown) {
      this.setMarkdown(markdown);
    }

    /**
     * Bind eventHandler to event type
     * @param {string} type Event type
     * @param {function} handler Event handler
     */

  }, {
    key: 'on',
    value: function on(type, handler) {
      this.eventManager.listen(type, handler);
    }

    /**
     * Unbind eventHandler from event type
     * @param {string} type Event type
     */

  }, {
    key: 'off',
    value: function off(type) {
      this.eventManager.removeEventHandler(type);
    }

    /**
     * Remove Viewer preview from document
     */

  }, {
    key: 'remove',
    value: function remove() {
      this.eventManager.emit('removeEditor');
      this.preview.$el.off('mousedown', _jquery2.default.proxy(this._toggleTask, this));
      this.preview.remove();
      this.options = null;
      this.eventManager = null;
      this.commandManager = null;
      this.convertor = null;
      this.preview = null;
    }

    /**
     * Add hook to Viewer preview's event
     * @param {string} type Event type
     * @param {function} handler Event handler
     */

  }, {
    key: 'addHook',
    value: function addHook(type, handler) {
      this.eventManager.removeEventHandler(type);
      this.eventManager.listen(type, handler);
    }

    /**
     * Return true
     * @returns {boolean}
     */

  }, {
    key: 'isViewer',
    value: function isViewer() {
      return true;
    }

    /**
     * Return false
     * @returns {boolean}
     */

  }, {
    key: 'isMarkdownMode',
    value: function isMarkdownMode() {
      return false;
    }

    /**
     * Return false
     * @returns {boolean}
     */

  }, {
    key: 'isWysiwygMode',
    value: function isWysiwygMode() {
      return false;
    }

    /**
     * Define extension
     * @param {string} name Extension name
     * @param {ExtManager~extension} ext extension
     */

  }], [{
    key: 'defineExtension',
    value: function defineExtension(name, ext) {
      _extManager2.default.defineExtension(name, ext);
    }
  }]);

  return ToastUIEditorViewer;
}();

/**
 * check whther is viewer
 * @type {boolean}
 */


ToastUIEditorViewer.isViewer = true;

/**
 * domUtil instance
 * @type {DomUtil}
 * @ignore
 */
ToastUIEditorViewer.domUtils = _domUtils2.default;

/**
 * CodeBlockManager instance
 * @type {CodeBlockManager}
 */
ToastUIEditorViewer.codeBlockManager = _codeBlockManager2.default;

/**
 * MarkdownIt hightlight instance
 * @type {MarkdownIt}
 */
ToastUIEditorViewer.markdownitHighlight = _convertor2.default.getMarkdownitHighlightRenderer();

/**
 * MarkdownIt instance
 * @type {MarkdownIt}
 */
ToastUIEditorViewer.markdownit = _convertor2.default.getMarkdownitRenderer();

/**
 * @ignore
 */
ToastUIEditorViewer.i18n = null;

/**
 * @ignore
 */
ToastUIEditorViewer.Button = null;

/**
 * @ignore
 */
ToastUIEditorViewer.WwCodeBlockManager = null;

/**
 * @ignore
 */
ToastUIEditorViewer.WwTableManager = null;

/**
 * @ignore
 */
ToastUIEditorViewer.WwTableSelectionManager = null;

module.exports = ToastUIEditorViewer;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @fileoverview This file is common logic for italic, bold, strike makrdown commands.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * range expand according to expendSize
 * If can not expand, return null
 * @param {range} range - range
 * @param {number} expendSize - expendSize
 * @returns {object} expanded range or null
 * @ignore
 */
var getExpandedRange = function getExpandedRange(range, expendSize) {
  var start = range.start,
      end = range.end;

  var expendRange = void 0;

  if (start.ch >= expendSize) {
    var from = {
      line: start.line,
      ch: start.ch - expendSize
    };
    var to = {
      line: end.line,
      ch: end.ch + expendSize
    };

    expendRange = {
      from: from,
      to: to
    };
  }

  return expendRange;
};

/**
 * remove symbol in the front and back of text
 * @param {string} text - text
 * @param {string} symbol - text
 * @returns {string}
 * @ignore
 */
var removeSyntax = exports.removeSyntax = function removeSyntax(text, symbol) {
  var symbolLength = symbol.length;

  return text.substr(symbolLength, text.length - symbolLength * 2);
};

/**
 * append symbol in the front and back of text
 * @param {string} text - text
 * @param {string} symbol - text
 * @returns {string}
 * @ignore
 */
var appendSyntax = exports.appendSyntax = function appendSyntax(text, symbol) {
  return '' + symbol + text + symbol;
};

/**
 * check expanded text and replace text using replacer
 * @param {CodeMirror.doc} doc - doc of codemirror
 * @param {range} range - origin range
 * @param {number} expandSize - expandSize
 * @param {function} checker - sytax check function
 * @param {function} replacer - text replace function
 * @returns {boolean} - if replace text, return true.
 * @ignore
 */
var expandReplace = exports.expandReplace = function expandReplace(doc, range, expandSize, checker, replacer) {
  var expendRange = getExpandedRange(range, expandSize);
  var result = false;

  if (expendRange) {
    var from = expendRange.from,
        to = expendRange.to;

    var expendRangeText = doc.getRange(from, to);
    if (checker(expendRangeText)) {
      doc.setSelection(from, to);
      doc.replaceSelection(replacer(expendRangeText), 'around');
      result = true;
    }
  }

  return result;
};

/**
 * check text and replace text using replacer
 * @param {CodeMirror.doc} doc - doc of codemirror
 * @param {string} text - text
 * @param {function} checker - sytax check function
 * @param {function} replacer - text replace function
 * @returns {boolean} - if replace text, return true.
 * @ignore
 */
var replace = exports.replace = function replace(doc, text, checker, replacer) {
  var result = false;

  if (checker(text)) {
    doc.replaceSelection(replacer(text), 'around');
    result = true;
  }

  return result;
};

var changeSyntax = exports.changeSyntax = function changeSyntax(doc, range, symbol, syntaxRegex, contentRegex) {
  var _doc$getCursor = doc.getCursor(),
      line = _doc$getCursor.line,
      ch = _doc$getCursor.ch;

  var selectionStr = doc.getSelection();
  var symbolLength = symbol.length;
  var isSyntax = function isSyntax(t) {
    return syntaxRegex.test(t);
  };

  // 1. expand text and check syntax => remove syntax
  // 2. check text is syntax => remove syntax
  // 3. If text does not match syntax, remove syntax inside text and then append syntax
  if (!(expandReplace(doc, range, symbolLength, isSyntax, function (t) {
    return removeSyntax(t, symbol);
  }) || replace(doc, selectionStr, isSyntax, function (t) {
    return removeSyntax(t, symbol);
  }))) {
    var removeSyntaxInsideText = selectionStr.replace(contentRegex, '$1');
    doc.replaceSelection(appendSyntax(removeSyntaxInsideText, symbol), 'around');
  }

  var afterSelectStr = doc.getSelection();
  var size = ch;

  if (!selectionStr) {
    // If text was not selected, after replace text, move cursor
    // For example **|** => | (move cusor -symbolLenth)
    if (isSyntax(afterSelectStr)) {
      size += symbolLength;
    } else {
      size -= symbolLength;
    }
    doc.setCursor(line, size);
  }
};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements tooltip
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TOOLTIP_CONTENT = '<div class="tui-tooltip"><div class="arrow"></div><span class="text"></span></span></div>';

/**
 * Class Tooltip
 * @ignore
 */

var Tooltip = function () {
  function Tooltip() {
    _classCallCheck(this, Tooltip);

    this.$el = (0, _jquery2.default)(TOOLTIP_CONTENT);
    this.$el.appendTo('body');
    this.hide();
  }

  /**
   * show tooltop
   * @param {jQuery} target - target jQuery element to bind
   * @param {String} text - text to show
   */


  _createClass(Tooltip, [{
    key: 'show',
    value: function show(target, text) {
      this.$el.css({
        'top': target.offset().top + target.height() + 13, // below the button
        'left': target.offset().left + 3
      }).find('.text').html(text).end().show();
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.$el.hide();
    }
  }, {
    key: 'remove',
    value: function remove() {
      this.$el.remove();
    }
  }]);

  return Tooltip;
}();

exports.default = new Tooltip();

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements CodeBlockExt
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _codemirror = __webpack_require__(6);

var _codemirror2 = _interopRequireDefault(_codemirror);

__webpack_require__(48);

__webpack_require__(49);

__webpack_require__(50);

__webpack_require__(51);

__webpack_require__(52);

__webpack_require__(53);

__webpack_require__(54);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class CodeMirrorExt
 * @param {HTMLElement} el - container jquery element
 * @param {Object} [options={}] - codeMirror options
 */
var CodeMirrorExt = function () {
  function CodeMirrorExt(el) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, CodeMirrorExt);

    this.editorContainerEl = el;

    /**
     * CodeMirror instance
     * @type {CodeMirror.EditorFromTextArea}
     * @private
     */
    this.cm = null;

    this._init(options);
  }

  /**
   * init
   * @param {Object} options - codeMirror option
   * @private
   */


  _createClass(CodeMirrorExt, [{
    key: '_init',
    value: function _init(options) {
      var cmTextarea = document.createElement('textarea');
      this.editorContainerEl.appendChild(cmTextarea);

      options = _jquery2.default.extend(true, {
        lineWrapping: true,
        theme: 'default',
        extraKeys: {
          'Shift-Tab': 'indentLess',
          'Alt-Up': 'replaceLineTextToUpper',
          'Alt-Down': 'replaceLineTextToLower'
        },
        indentUnit: 4,
        cursorScrollMargin: 12,
        specialCharPlaceholder: function specialCharPlaceholder() {
          return document.createElement('span');
        }
      }, options);

      this.cm = _codemirror2.default.fromTextArea(cmTextarea, options);
    }

    /**
     * getCurrentRange
     * @returns {Object} - selection range
     */

  }, {
    key: 'getCurrentRange',
    value: function getCurrentRange() {
      var from = this.cm.getCursor('from');
      var to = this.cm.getCursor('to');

      return {
        from: from,
        to: to,
        collapsed: from.line === to.line && from.ch === to.ch
      };
    }

    /**
     * Set focus to current Editor
     */

  }, {
    key: 'focus',
    value: function focus() {
      this.cm.focus();
    }

    /**
     * blur focus to current Editor
     */

  }, {
    key: 'blur',
    value: function blur() {
      this.cm.getInputField().blur();
    }

    /**
     * Remove Editor from document
     */

  }, {
    key: 'remove',
    value: function remove() {
      this.cm.toTextArea();
    }

    /**
     * Set Editor value
     * @param {string} markdown - Markdown syntax text
     * @param {boolean} [cursorToEnd=true] - move cursor to contents end
     */

  }, {
    key: 'setValue',
    value: function setValue(markdown) {
      var cursorToEnd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      this.cm.setValue(markdown);
      if (cursorToEnd) {
        this.moveCursorToEnd();
      }
      this.cm.doc.clearHistory();
      this.cm.refresh();
    }

    /**
     * Get editor value
     * @returns {string} - codeMirror text value
     */

  }, {
    key: 'getValue',
    value: function getValue() {
      return this.cm.getValue('\n');
    }

    /**
     * Get CodeMirror instance
     * @returns {CodeMirror}
     */

  }, {
    key: 'getEditor',
    value: function getEditor() {
      return this.cm;
    }

    /**
     * Reset Editor
     */

  }, {
    key: 'reset',
    value: function reset() {
      this.setValue('');
    }

    /**
     * Get current caret position
     * @returns {{from: {line: number, ch: number}, to: {line: number, ch: number}}}
     */

  }, {
    key: 'getCaretPosition',
    value: function getCaretPosition() {
      return this.cm.cursorCoords();
    }

    /**
     * Add widget
     * @param {object} selection - Selection object
     * @param {HTMLElement} node - Widget node
     * @param {string} style - Adding style "over" or "bottom"
     * @param {number} offset - Adding offset
     */

  }, {
    key: 'addWidget',
    value: function addWidget(selection, node, style, offset) {
      if (offset) {
        selection.ch += offset;
      }

      this.cm.addWidget(selection.end, node, true, style);
    }

    /**
     * Replace selection with given replacement content
     * @param {string} content - Replacement content text
     * @param {object} selection - Selection object
     */

  }, {
    key: 'replaceSelection',
    value: function replaceSelection(content, selection) {
      if (selection) {
        this.cm.setSelection(selection.from, selection.to);
      }

      this.cm.replaceSelection(content);
      this.focus();
    }

    /**
     * Replace selection with replacement content and offset
     * @param {string} content - Replacement content text
     * @param {number} offset - Offset
     * @param {number} overwriteLength - Length to overwrite
     */

  }, {
    key: 'replaceRelativeOffset',
    value: function replaceRelativeOffset(content, offset, overwriteLength) {
      var cursor = this.cm.getCursor();
      var selection = {
        from: {
          line: cursor.line,
          ch: cursor.ch + offset
        },
        to: {
          line: cursor.line,
          ch: cursor.ch + offset + overwriteLength
        }
      };

      this.replaceSelection(content, selection);
    }

    /**
     * Set Editor height
     * @param {number} height - Editor height
     */

  }, {
    key: 'setHeight',
    value: function setHeight(height) {
      var contentWrapper = this.getWrapperElement();

      contentWrapper.style.height = height + 'px';
    }

    /**
     * set min height
     * @param {number} minHeight - min height
     */

  }, {
    key: 'setMinHeight',
    value: function setMinHeight(minHeight) {
      var contentWrapper = this.getWrapperElement();

      contentWrapper.style.minHeight = minHeight + 'px';
    }

    /**
     * Set the placeholder to CodeMirror
     * @param {string} placeholder - placeholder to set
     */

  }, {
    key: 'setPlaceholder',
    value: function setPlaceholder(placeholder) {
      if (placeholder) {
        this.cm.setOption('placeholder', placeholder);
      }
    }

    /**
     * get code mirror wrapper element
     * @returns {HTMLElement} - code mirror wrapper element
     */

  }, {
    key: 'getWrapperElement',
    value: function getWrapperElement() {
      return this.cm.getWrapperElement();
    }

    /**
     * get code mirror cursor
     * @param {string} [start='head'] - which end of the selection. 'from'|'to'|'head'|'anchor'
     * @returns {Cursor} - code mirror cursor
     */

  }, {
    key: 'getCursor',
    value: function getCursor(start) {
      return this.cm.getCursor(start);
    }

    /**
     * Set cursor position to end
     */

  }, {
    key: 'moveCursorToEnd',
    value: function moveCursorToEnd() {
      var doc = this.getEditor().getDoc();
      var lastLine = doc.lastLine();

      doc.setCursor(lastLine, doc.getLine(lastLine).length);
    }

    /**
     * Set cursor position to start
     */

  }, {
    key: 'moveCursorToStart',
    value: function moveCursorToStart() {
      var doc = this.getEditor().getDoc();
      var firstLine = doc.firstLine();

      doc.setCursor(firstLine, 0);
    }

    /**
     * Scroll Editor content to Top
     * @param {number} value - Scroll amount
     * @returns {number} - changed scroll top
     */

  }, {
    key: 'scrollTop',
    value: function scrollTop(value) {
      if (value) {
        this.cm.scrollTo(0, value);
      }

      return this.cm.getScrollInfo().top;
    }

    /**
     * Get start, end position of current selection
     * @returns {{start: {line: *, ch: *}, end: {line: *, ch: *}}}
     */

  }, {
    key: 'getRange',
    value: function getRange() {
      var start = this.cm.getCursor('from');
      var end = this.cm.getCursor('to');

      return {
        start: {
          line: start.line,
          ch: start.ch
        },
        end: {
          line: end.line,
          ch: end.ch
        }
      };
    }

    /**
     * add codemirror event handler
     * @param {string} type - event type
     * @param {function} func - handler function
     */

  }, {
    key: 'on',
    value: function on(type, func) {
      this.cm.on(type, func);
    }

    /**
     * remove codemirror event handler
     * @param {string} type - event type
     * @param {function} func - handler function
     */

  }, {
    key: 'off',
    value: function off(type, func) {
      this.cm.off(type, func);
    }
  }]);

  return CodeMirrorExt;
}();

exports.default = CodeMirrorExt;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileoverview Implements ComponentManager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Class ComponentManager
 * @param {MarkdownEditor|WysiwygEditor} editor - Editor instance
 * @ignore
 */
var ComponentManager = function () {
  function ComponentManager(editor) {
    _classCallCheck(this, ComponentManager);

    /**
     * private
     * @type {object}
     * @private
     */
    this._managers = {};
    this._editor = editor;
  }

  /**
   * addManager
   * Add manager
   * @param {string|function} nameOrConstructor Manager name or constructor
   * @param {function} [ManagerConstructor] Constructor
   */


  _createClass(ComponentManager, [{
    key: "addManager",
    value: function addManager(nameOrConstructor, ManagerConstructor) {
      if (!ManagerConstructor) {
        ManagerConstructor = nameOrConstructor;
        nameOrConstructor = null;
      }

      var instance = new ManagerConstructor(this._editor);

      this._managers[nameOrConstructor || instance.name] = instance;
    }

    /**
     * getManager
     * Get manager by manager name
     * @param {string} name Manager name
     * @returns {object} manager
     */

  }, {
    key: "getManager",
    value: function getManager(name) {
      return this._managers[name];
    }

    /**
     * Remove Manager.
     * @param {string} name - manager name
     */

  }, {
    key: "removeManager",
    value: function removeManager(name) {
      var manager = this.getManager(name);

      if (!manager) {
        return;
      }

      if (manager.destroy) {
        manager.destroy();
      }

      delete this._managers[name];
    }
  }]);

  return ComponentManager;
}();

exports.default = ComponentManager;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements wysiwyg table manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _domUtils = __webpack_require__(4);

var _domUtils2 = _interopRequireDefault(_domUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isIE10 = _tuiCodeSnippet2.default.browser.msie && _tuiCodeSnippet2.default.browser.version === 10;
var TABLE_CLASS_PREFIX = 'te-content-table-';
var isIE10And11 = _tuiCodeSnippet2.default.browser.msie && (_tuiCodeSnippet2.default.browser.version === 10 || _tuiCodeSnippet2.default.browser.version === 11);
var BASIC_CELL_CONTENT = _tuiCodeSnippet2.default.browser.msie ? '' : '<br>';
var TABLE_CELL_SELECTED_CLASS_NAME = 'te-cell-selected';

/**
 * Class WwTableManager
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @ignore
 */

var WwTableManager = function () {
  function WwTableManager(wwe) {
    _classCallCheck(this, WwTableManager);

    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @type {string}
     */
    this.name = 'table';
    this._lastCellNode = null;
    this._init();
  }

  /**
   * Initialize
   * @private
   */


  _createClass(WwTableManager, [{
    key: '_init',
    value: function _init() {
      this._initKeyHandler();
      this._initEvent();
      this.tableID = 0;
    }

    /**
     * Initialize event
     * @private
     */

  }, {
    key: '_initEvent',
    value: function _initEvent() {
      var _this = this;

      this.eventManager.listen('wysiwygRangeChangeAfter.table', function () {
        var range = _this.wwe.getEditor().getSelection();
        var isRangeInTable = _this.wwe.isInTable(range);

        _this._unwrapBlockInTable();
        _this._completeTableIfNeed();

        if (!isRangeInTable) {
          var selectionManager = _this.wwe.componentManager.getManager('tableSelection');
          selectionManager.removeClassAttrbuteFromAllCellsIfNeed();
        }

        _this._insertDefaultBlockBetweenTable();
      });

      this.eventManager.listen('wysiwygSetValueAfter.table', function () {
        _this._unwrapBlockInTable();
        _this._insertDefaultBlockBetweenTable();
      });

      // remove last br in td or th
      this.eventManager.listen('wysiwygProcessHTMLText.table', function (html) {
        return html.replace(/<br \/>(<\/td>|<\/th>)/g, '$1');
      });

      this.eventManager.listen('cut.table', function () {
        var selectionManager = _this.wwe.componentManager.getManager('tableSelection');
        var $selectedCells = selectionManager.getSelectedCells();

        if ($selectedCells.length) {
          $selectedCells.get().forEach(function (cell) {
            return (0, _jquery2.default)(cell).html(BASIC_CELL_CONTENT);
          });
        }

        selectionManager.removeClassAttrbuteFromAllCellsIfNeed();
      });

      this.eventManager.listen('copyBefore.table', function (_ref) {
        var $clipboardContainer = _ref.$clipboardContainer;
        return _this.updateTableHtmlOfClipboardIfNeed($clipboardContainer);
      });
    }

    /**
     * Update table html of clipboard data, if has selected cells.
     * @param {jQuery} $clipboardContainer - jQuery element
     */

  }, {
    key: 'updateTableHtmlOfClipboardIfNeed',
    value: function updateTableHtmlOfClipboardIfNeed($clipboardContainer) {
      var _this2 = this;

      var selectionManager = this.wwe.componentManager.getManager('tableSelection');
      var $selectedCells = selectionManager.getSelectedCells();

      if ($selectedCells.length) {
        selectionManager.createRangeBySelectedCells();

        var fragment = this.wwe.getEditor().getSelection().cloneContents();

        (0, _jquery2.default)(fragment).children().each(function (index, node) {
          var $node = (0, _jquery2.default)(node);

          if (!_this2.isTableOrSubTableElement(node.nodeName)) {
            return;
          }

          if (node.nodeName === 'TABLE' && $node.find('thead').length === 0 && $node.find('tbody').length === 0) {
            $node.remove();
          } else if (node.previousSibling && node.previousSibling.nodeName === 'TABLE') {
            node.previousSibling.appendChild(node);
          } else {
            _this2._completeIncompleteTable(node);

            if (node.nodeName !== 'TABLE' && node.nodeName !== 'THEAD') {
              (0, _jquery2.default)(node).closest('table').find('thead').remove();
            }
          }
        });

        $clipboardContainer.append(fragment);
        $clipboardContainer.find('.' + TABLE_CELL_SELECTED_CLASS_NAME).removeClass(TABLE_CELL_SELECTED_CLASS_NAME);
      }
    }

    /**
     * Paste clibpard data that contains only table.
     * @param {Node} clipboardTable - table element of clipboard
     */

  }, {
    key: 'pasteTableData',
    value: function pasteTableData(clipboardTable) {
      var $clipboardTable = (0, _jquery2.default)(clipboardTable);
      this._expandTableIfNeed($clipboardTable);
      this._pasteDataIntoTable($clipboardTable);
    }

    /**
     * Initialize key event handler
     * @private
     */

  }, {
    key: '_initKeyHandler',
    value: function _initKeyHandler() {
      var _this3 = this;

      this.keyEventHandlers = {
        'DEFAULT': function DEFAULT(ev, range, keymap) {
          var isRangeInTable = _this3.wwe.isInTable(range);

          if (isRangeInTable && !_this3._isModifierKey(keymap)) {
            _this3._recordUndoStateIfNeed(range);
            _this3._removeContentsAndChangeSelectionIfNeed(range, keymap, ev);
          } else if (!isRangeInTable && _this3._lastCellNode) {
            _this3._recordUndoStateAndResetCellNode(range);
          }

          if (isRangeInTable && !_this3._isModifierKeyPushed(ev)) {
            _this3.wwe.getEditor().modifyDocument(function () {
              var selectionManager = _this3.wwe.componentManager.getManager('tableSelection');
              selectionManager.removeClassAttrbuteFromAllCellsIfNeed();
            });
          }
        },
        'ENTER': function ENTER(ev, range) {
          var isNeedNext = void 0;

          if (_this3._isAfterTable(range)) {
            ev.preventDefault();
            range.setStart(range.startContainer, range.startOffset - 1);
            _this3.wwe.breakToNewDefaultBlock(range);
            isNeedNext = false;
          } else if (_this3._isBeforeTable(range)) {
            ev.preventDefault();
            _this3.wwe.breakToNewDefaultBlock(range, 'before');
            isNeedNext = false;
          } else if (_this3.wwe.isInTable(range)) {
            if (!_this3._isInList(range.startContainer) && _this3._isInStyledText(range)) {
              _this3.wwe.defer(function () {
                _this3._removeBRinStyleText();
              });
            } else if (_this3._isEmptyFirstLevelLI(range)) {
              _this3.wwe.defer(function () {
                // Squire make div when LI level is decreased in first level so should replace div to br
                var afterRange = _this3.wwe.getRange().cloneRange();
                var div = afterRange.startContainer;
                var br = document.createElement('br');

                div.parentNode.replaceChild(br, div);

                afterRange.setStartBefore(br);
                afterRange.collapse(true);
                _this3.wwe.getEditor().setSelection(afterRange);
              });
            }
            _this3._appendBrIfTdOrThNotHaveAsLastChild(range);
            isNeedNext = false;
          }

          return isNeedNext;
        },
        'BACK_SPACE': function BACK_SPACE(ev, range, keymap) {
          return _this3._handleBackspaceAndDeleteKeyEvent(ev, range, keymap);
        },
        'DELETE': function DELETE(ev, range, keymap) {
          return _this3._handleBackspaceAndDeleteKeyEvent(ev, range, keymap);
        },
        'TAB': function TAB() {
          return _this3._moveCursorTo('next', 'cell');
        },
        'SHIFT+TAB': function SHIFTTAB(ev) {
          return _this3._moveCursorTo('previous', 'cell', ev);
        },
        'UP': function UP(ev) {
          return _this3._moveCursorTo('previous', 'row', ev);
        },
        'DOWN': function DOWN(ev) {
          return _this3._moveCursorTo('next', 'row', ev);
        }
      };

      _tuiCodeSnippet2.default.forEach(this.keyEventHandlers, function (handler, key) {
        return _this3.wwe.addKeyEventHandler(key, handler);
      });
    }

    /**
     * Check whether node is li and empty
     * @param {node} node node
     * @returns {boolean} whether node is li and empty
     * @private
     */

  }, {
    key: '_isEmptyListItem',
    value: function _isEmptyListItem(node) {
      var childNodes = node.childNodes,
          nodeName = node.nodeName;


      return nodeName === 'LI' && childNodes.length === 1 && childNodes[0].nodeName === 'BR';
    }

    /**
     * Check whether range is in empty LI that is first level
     * @param {range} range range
     * @returns {boolean} whether range is in empty LI that is first level
     * @private
     */

  }, {
    key: '_isEmptyFirstLevelLI',
    value: function _isEmptyFirstLevelLI(range) {
      var collapsed = range.collapsed,
          startContainer = range.startContainer,
          startOffset = range.startOffset;


      return collapsed && startOffset === 0 && this._isEmptyListItem(startContainer) && _domUtils2.default.isFirstLevelListItem(startContainer);
    }

    /**
     * Check whether range is in style tag that is like 'B', 'I', 'S', 'SPAN', 'CODE'
     * Those tag is supported in Wysiwyg.
     * @param {Range} range range
     * @returns {Boolean} range is in the style tag
     * @private
     */

  }, {
    key: '_isInStyledText',
    value: function _isInStyledText(range) {
      var startContainer = range.startContainer;

      var node = void 0;
      if (_domUtils2.default.isTextNode(startContainer)) {
        node = startContainer.parentNode;
      } else {
        node = startContainer;
      }

      return range.collapsed && _domUtils2.default.isStyledNode(node);
    }

    /**
     * When enter key occur in the styled text, 'br' tag insert in the style tag like 'b', 'i' etc.
     * So in thoes case, 'br' tag would be pulled out in this logic.
     * @private
     */

  }, {
    key: '_removeBRinStyleText',
    value: function _removeBRinStyleText() {
      var afterRange = this.wwe.getRange();
      var startContainer = afterRange.startContainer,
          startOffset = afterRange.startOffset;


      var styleNode = void 0;
      if (startContainer.nodeName === 'TD') {
        // This case is <i>TEST<br></i>|<br>
        styleNode = _domUtils2.default.getChildNodeByOffset(startContainer, startOffset - 1);
      } else {
        styleNode = _domUtils2.default.getParentUntil(startContainer, 'TD');
      }

      var brNode = styleNode.querySelector('br');
      if (!brNode) {
        return;
      }

      var _styleNode = styleNode,
          tdNode = _styleNode.parentNode,
          nodeName = _styleNode.nodeName;

      if (nodeName === 'CODE' && !brNode.previousSibling) {
        // cursor is located in the start of text
        // Before Enter : <code>|TEST</code>
        // After Enter  : <code><br>|TEST</code>
        // TO BE        : <br><code>|TEST</code>
        tdNode.insertBefore(brNode, styleNode);
        afterRange.setStart(styleNode, 0);
      } else if (nodeName === 'CODE' && !brNode.nextSibling) {
        // cursor is located in the end of text
        // Before Enter : <code>TEST|</code>
        // After Enter  : <code>TEST<br>|</code>
        // TO BE        : <code>TEST</code><br>|
        tdNode.insertBefore(brNode, styleNode.nextSibling);
        afterRange.setStart(tdNode, _domUtils2.default.getNodeOffsetOfParent(brNode) + 1);
      } else {
        // [Case 1] cursor is located in the middle of text
        // Before Enter : <i>TE|ST</i>
        // After Enter  : <i>TE<br>|ST</i>
        // TO BE        : <i>TE</i><br><i>|ST</i>
        // [Case 2] cursor is located in the start of text
        // Before Enter : <i>|TEST</i>
        // After Enter  : <i><br>|TEST</i>
        // TO BE        : <i>|</i><br><i>TEST</i>
        // [Case 3] cursor is located in the end of text
        // Before Enter : <i>TEST|</i>
        // After Enter  : <i>TEST<br>|</i>
        // TO BE        : <i>TEST</i><br><i>|</i>
        var newNode = this._splitByBR(styleNode, brNode);
        afterRange.setStart(newNode, 0);
      }

      afterRange.collapse(true);
      this.wwe.getEditor().setSelection(afterRange);
    }

    /**
     * When container node have br node, split container base on br node and pull out BR.
     * After Enter  : <i>TE<br>ST</i>
     * TO BE        : <i>TE</i><br><i>ST</i>
     * @param {Node} container container
     * @param {Node} brNode container
     * @returns {Node} node for positioning of cursor
     * @private
     */

  }, {
    key: '_splitByBR',
    value: function _splitByBR(container, brNode) {
      var cloneStyleNode = container.cloneNode(true);
      var newBR = document.createElement('br');
      var parentNode = container.parentNode;

      // Origin style node should be removed the back nodes of br node.

      _domUtils2.default.removeNodesByDirection(container, brNode, false);
      brNode.parentNode.removeChild(brNode);

      // Cloned style node should be removed the front nodes of br node
      var clonedBR = cloneStyleNode.querySelector('br');
      _domUtils2.default.removeNodesByDirection(cloneStyleNode, clonedBR, true);
      clonedBR.parentNode.removeChild(clonedBR);

      parentNode.insertBefore(cloneStyleNode, container.nextSibling);
      parentNode.insertBefore(newBR, cloneStyleNode);

      var leafNode = _domUtils2.default.getLeafNode(cloneStyleNode);
      if (!_domUtils2.default.getTextLength(leafNode)) {
        leafNode.textContent = '\u200B';
      }

      return leafNode;
    }

    /**
     * Check whether passed range is right before table or not
     * @param {Range} range range
     * @returns {boolean} result
     * @private
     */

  }, {
    key: '_isBeforeTable',
    value: function _isBeforeTable(range) {
      return _domUtils2.default.getNodeName(_domUtils2.default.getChildNodeByOffset(range.startContainer, range.startOffset)) === 'TABLE';
    }

    /**
     * Check whether passed range is right after table or not
     * @param {Range} range range
     * @returns {boolean} result
     * @private
     */

  }, {
    key: '_isAfterTable',
    value: function _isAfterTable(range) {
      var prevElem = _domUtils2.default.getPrevOffsetNodeUntil(range.startContainer, range.startOffset);

      return _domUtils2.default.getNodeName(prevElem) === 'TABLE' && range.commonAncestorContainer === this.wwe.get$Body()[0];
    }

    /**
     * Handle backspace and delete key event
     * @param {object} ev - Event object
     * @param {Range} range - Range Object
     * @param {string} keymap - keymap
     * @returns {boolean} - need next
     * @private
     */

  }, {
    key: '_handleBackspaceAndDeleteKeyEvent',
    value: function _handleBackspaceAndDeleteKeyEvent(ev, range, keymap) {
      var isBackspace = keymap === 'BACK_SPACE';
      var selectionManager = this.wwe.componentManager.getManager('tableSelection');
      var $selectedCells = selectionManager.getSelectedCells();
      var isNeedNext = true;

      if (range.collapsed) {
        if (this.wwe.isInTable(range)) {
          if (isBackspace) {
            this._tableHandlerOnBackspace(range, ev);
          } else {
            this._tableHandlerOnDelete(range, ev);
          }

          this._removeContentsAndChangeSelectionIfNeed(range, keymap, ev);
          isNeedNext = false;
        } else if (!isBackspace && this._isBeforeTable(range) || isBackspace && this._isAfterTable(range)) {
          ev.preventDefault();
          var startOffset = isBackspace ? range.startOffset - 1 : range.startOffset;
          this._removeTable(range, _domUtils2.default.getChildNodeByOffset(range.startContainer, startOffset));
          isNeedNext = false;
        }
      } else if (this.wwe.isInTable(range)) {
        if ($selectedCells.length > 0) {
          var removed = this._removeContentsAndChangeSelectionIfNeed(range, keymap, ev);
          if (removed) {
            ev.preventDefault();
            isNeedNext = false;
          }
        }
      }

      return isNeedNext;
    }

    /**
     * Move Li node to previous node that is previous node of list node.
     * @param {node} liNode li node
     * @param {range} range range
     * @private
     */

  }, {
    key: '_moveListItemToPreviousOfList',
    value: function _moveListItemToPreviousOfList(liNode, range) {
      var listNode = liNode.parentNode,
          firstChild = liNode.firstChild;

      var fragment = document.createDocumentFragment();

      _domUtils2.default.mergeNode(liNode, fragment);
      listNode.parentNode.insertBefore(fragment, listNode);

      range.setStart(firstChild, 0);
      range.collapse(true);
      this.wwe.getEditor().setSelection(range);

      if (!listNode.hasChildNodes()) {
        listNode.parentNode.removeChild(listNode);
      }
    }
  }, {
    key: '_isInList',
    value: function _isInList(targetNode) {
      return _domUtils2.default.getParentUntilBy(targetNode, function (node) {
        return node && (_domUtils2.default.isListNode(node) || node.nodeName === 'LI');
      }, function (node) {
        return node && (node.nodeName === 'TD' || node.nodeName === 'TH');
      });
    }

    /**
     * Find LI node while search parentNode inside TD
     * @param {node} startContainer startContainer
     * @returns {node} liNode or null
     * @private
     */

  }, {
    key: '_findListItem',
    value: function _findListItem(startContainer) {
      return _domUtils2.default.getParentUntilBy(startContainer, function (node) {
        return node && _domUtils2.default.isListNode(node);
      }, function (node) {
        return node && (node.nodeName === 'TD' || node.nodeName === 'TH');
      });
    }

    /**
     * Backspace handler in table
     * @param {Range} range range
     * @param {Event} event event
     * @private
     */

  }, {
    key: '_tableHandlerOnBackspace',
    value: function _tableHandlerOnBackspace(range, event) {
      var startContainer = range.startContainer,
          startOffset = range.startOffset;

      var liNode = this._findListItem(startContainer);

      if (liNode && startOffset === 0 && _domUtils2.default.isFirstListItem(liNode) && _domUtils2.default.isFirstLevelListItem(liNode)) {
        this.wwe.getEditor().saveUndoState(range);
        this._moveListItemToPreviousOfList(liNode, range);
        event.preventDefault();
      } else {
        var prevNode = _domUtils2.default.getPrevOffsetNodeUntil(startContainer, startOffset, 'TR');
        var prevNodeName = _domUtils2.default.getNodeName(prevNode);

        if (prevNodeName === 'BR' && prevNode.parentNode.childNodes.length !== 1) {
          event.preventDefault();
          (0, _jquery2.default)(prevNode).remove();
        }
      }
    }

    /**
     * Return whether delete br in the br
     * @param {Range} range Range object
     * @returns {boolean}
     * @private
     */

  }, {
    key: '_isDeletingBR',
    value: function _isDeletingBR(range) {
      var currentNode = this._getCurrentNodeInCell(range);
      var nextSibling = currentNode && currentNode.nextSibling;

      return _domUtils2.default.getNodeName(currentNode) === 'BR' && !!nextSibling && _domUtils2.default.getNodeName(nextSibling) === 'BR';
    }
  }, {
    key: '_getCurrentNodeInCell',
    value: function _getCurrentNodeInCell(range) {
      var startContainer = range.startContainer,
          startOffset = range.startOffset;

      var currentNode = void 0;

      if (_domUtils2.default.getNodeName(startContainer) === 'TD') {
        currentNode = _domUtils2.default.getChildNodeByOffset(startContainer, startOffset);
      } else if (_domUtils2.default.getParentUntil(startContainer, 'TD')) {
        currentNode = startContainer;
      }

      return currentNode;
    }

    /**
     * Check whether range is located in end of the list
     * @param {Node} liNode liNode
     * @param {Range} range range
     * @returns {Boolean} whether range is located in end of the list
     * @private
     */

  }, {
    key: '_isEndOfList',
    value: function _isEndOfList(liNode, range) {
      var startContainer = range.startContainer,
          startOffset = range.startOffset;

      var result = false;

      if (!liNode.nextSibling) {
        if (liNode === startContainer) {
          var liNodeOffset = _domUtils2.default.getOffsetLength(liNode);

          if (liNode.lastChild.nodeName === 'BR') {
            liNodeOffset -= 1;
          }

          result = liNodeOffset === startOffset;
        } else {
          var parentNode = _domUtils2.default.getParentUntil(startContainer, 'li') || startContainer;
          var startContainerOffset = _domUtils2.default.getOffsetLength(startContainer);
          var lastChild = liNode.lastChild;


          if (lastChild.nodeName === 'BR') {
            lastChild = lastChild.previousSibling;
          }

          result = lastChild === parentNode && startContainerOffset === startOffset;
        }
      }

      return result;
    }

    /**
     * Get next line nodes from target node
     * @param {Node} node target node
     * @returns {DocumentFragment} next line nodes
     * @private
     */

  }, {
    key: '_getNextLineNode',
    value: function _getNextLineNode(node) {
      var fragment = document.createDocumentFragment();
      var parentNode = _domUtils2.default.getParentUntil(node, 'TD');
      var nextSibling = parentNode.nextSibling;


      while (nextSibling) {
        var _nextSibling = nextSibling,
            next = _nextSibling.nextSibling;


        fragment.appendChild(nextSibling);

        if (nextSibling.nodeName === 'BR') {
          break;
        }

        nextSibling = next;
      }

      return fragment;
    }

    /**
     * Delete handler in table
     * @param {Range} range range
     * @param {Event} event event
     * @private
     */

  }, {
    key: '_tableHandlerOnDelete',
    value: function _tableHandlerOnDelete(range, event) {
      var liNode = this._findListItem(range.startContainer);

      if (liNode && this._isEndOfList(liNode, range)) {
        this.wwe.getEditor().saveUndoState(range);

        if (liNode.lastChild.nodeName === 'BR') {
          liNode.removeChild(liNode.lastChild);
        }

        _domUtils2.default.mergeNode(this._getNextLineNode(liNode), liNode);
        event.preventDefault();
      } else if (this._isDeletingBR(range)) {
        var currentNode = this._getCurrentNodeInCell(range);

        currentNode.parentNode.removeChild(currentNode.nextSibling);
        event.preventDefault();
      }
    }

    /**
     * Append br if td or th doesn't have br as last child
     * @param {Range} range range
     * @private
     */

  }, {
    key: '_appendBrIfTdOrThNotHaveAsLastChild',
    value: function _appendBrIfTdOrThNotHaveAsLastChild(range) {
      var startContainerNodeName = _domUtils2.default.getNodeName(range.startContainer);
      var tdOrTh = void 0;

      if (startContainerNodeName === 'TD' || startContainerNodeName === 'TH') {
        tdOrTh = range.startContainer;
      } else {
        var paths = (0, _jquery2.default)(range.startContainer).parentsUntil('tr');
        tdOrTh = paths[paths.length - 1];
      }

      var nodeName = _domUtils2.default.getNodeName(tdOrTh.lastChild);

      if (nodeName !== 'BR' && nodeName !== 'DIV' && nodeName !== 'UL' && nodeName !== 'OL' && !isIE10And11) {
        (0, _jquery2.default)(tdOrTh).append((0, _jquery2.default)('<br />')[0]);
      }
    }

    /**
     * Unwrap default block tag in table
     * For Squire default action making abnormal behavior, remove default blocks in Table after setValue() called
     * @private
     */

  }, {
    key: '_unwrapBlockInTable',
    value: function _unwrapBlockInTable() {
      this.wwe.get$Body().find('td div,th div,tr>br,td>br,th>br').each(function (index, node) {
        if (_domUtils2.default.getNodeName(node) === 'BR') {
          var parentNodeName = _domUtils2.default.getNodeName(node.parentNode);
          var isInTableCell = /TD|TH/.test(parentNodeName);
          var isEmptyTableCell = node.parentNode.textContent.length === 0;
          var isLastBR = node.parentNode.lastChild === node;

          if (parentNodeName === 'TR' || isInTableCell && !isEmptyTableCell && isLastBR) {
            (0, _jquery2.default)(node).remove();
          }
        } else {
          (0, _jquery2.default)(node).children().unwrap();
        }
      });
    }

    /**
     * Insert default block between table element
     * @private
     */

  }, {
    key: '_insertDefaultBlockBetweenTable',
    value: function _insertDefaultBlockBetweenTable() {
      this.wwe.get$Body().find('table').each(function (index, node) {
        if (node.nextElementSibling && node.nextElementSibling.nodeName === 'TABLE') {
          (0, _jquery2.default)('<div><br /></div>').insertAfter(node);
        }
      });
    }

    /**
     * Remove table
     * @param {Range} range range
     * @param {Node} table table
     * @private
     */

  }, {
    key: '_removeTable',
    value: function _removeTable(range, table) {
      if (table.tagName === 'TABLE') {
        this.wwe.getEditor().saveUndoState(range);
        this.wwe.saveSelection(range);
        (0, _jquery2.default)(table).remove();
        this.wwe.restoreSavedSelection();
      }
    }

    /**
     * record undo state if need
     * @param {Range} range range
     * @private
     */

  }, {
    key: '_recordUndoStateIfNeed',
    value: function _recordUndoStateIfNeed(range) {
      var currentCellNode = _domUtils2.default.getParentUntil(range.startContainer, 'TR');

      if (range.collapsed && currentCellNode && this._lastCellNode !== currentCellNode) {
        this.wwe.getEditor().saveUndoState(range);
        this._lastCellNode = currentCellNode;
      }
    }

    /**
     * record undo state and reset last cell node
     * @param {Range} range range
     * @private
     */

  }, {
    key: '_recordUndoStateAndResetCellNode',
    value: function _recordUndoStateAndResetCellNode(range) {
      this.wwe.getEditor().saveUndoState(range);
      this.resetLastCellNode();
    }

    /**
     * Paste table data into table element
     * @param {DocumentFragment} fragment Fragment of table element within
     * @private
     */

  }, {
    key: '_pasteDataIntoTable',
    value: function _pasteDataIntoTable(fragment) {
      var _wwe$getEditor$getSel = this.wwe.getEditor().getSelection(),
          startContainer = _wwe$getEditor$getSel.startContainer;

      var tableData = this._getTableDataFromTable(fragment);
      var isTableCell = startContainer.tagName === 'TD' || startContainer.tagName === 'TH';
      var brString = isIE10 ? '' : '<br />';
      var anchorElement = void 0,
          td = void 0,
          tr = void 0,
          tdContent = void 0;

      if (isTableCell) {
        anchorElement = startContainer;
      } else {
        anchorElement = _domUtils2.default.getParentUntilBy(startContainer, function (node) {
          return node.tagName === 'TD' || node.tagName === 'TH';
        }, function (node) {
          return (0, _jquery2.default)(node).closest('table').length === 0;
        });
        anchorElement = anchorElement ? anchorElement.parentNode : null;
      }

      anchorElement = anchorElement ? anchorElement : (0, _jquery2.default)(startContainer).find('th,td').get(0);

      td = anchorElement;
      while (tableData.length) {
        tr = tableData.shift();

        while (td && tr.length) {
          tdContent = tr.shift();

          if (tdContent.length) {
            td.textContent = tdContent;
          } else {
            td.innerHTML = brString;
          }

          td = _domUtils2.default.getTableCellByDirection(td, 'next');
        }

        td = _domUtils2.default.getSiblingRowCellByDirection(anchorElement, 'next', false);
        anchorElement = td;
      }
    }

    /**
     * Get array data from table element
     * @param {DocumentFragment} fragment table element
     * @returns {Array}
     * @private
     */

  }, {
    key: '_getTableDataFromTable',
    value: function _getTableDataFromTable(fragment) {
      var $fragment = (0, _jquery2.default)(fragment);
      var tableData = [];
      var trs = $fragment.find('tr');

      trs.each(function (i, tr) {
        var trData = [];
        var tds = (0, _jquery2.default)(tr).children();

        tds.each(function (index, cell) {
          trData.push(cell.textContent);
        });

        if (trData.length) {
          tableData.push(trData);
        }
      });

      return tableData;
    }

    /**
     * Remove selected table contents
     * @param {jQuery} $selectedCells Selected cells wrapped by jQuery
     * @private
     */

  }, {
    key: '_removeTableContents',
    value: function _removeTableContents($selectedCells) {
      this.wwe.getEditor().saveUndoState();

      $selectedCells.each(function (i, cell) {
        var brHTMLString = isIE10 ? '' : '<br />';
        (0, _jquery2.default)(cell).html(brHTMLString);
      });
    }

    /**
     * Wrap dangling table cells with new TR
     * @param {jQuery} $container - clipboard container
     * @returns {HTMLElement|null}
     */

  }, {
    key: 'wrapDanglingTableCellsIntoTrIfNeed',
    value: function wrapDanglingTableCellsIntoTrIfNeed($container) {
      var danglingTableCells = $container.children('td,th');
      var tr = void 0;

      if (danglingTableCells.length) {
        var $wrapperTr = (0, _jquery2.default)('<tr></tr>');

        danglingTableCells.each(function (i, cell) {
          $wrapperTr.append(cell);
        });

        tr = $wrapperTr.get(0);
      }

      return tr;
    }

    /**
     * Wrap TRs with new TBODY
     * @param {jQuery} $container - clipboard container
     * @returns {HTMLElement|null}
     */

  }, {
    key: 'wrapTrsIntoTbodyIfNeed',
    value: function wrapTrsIntoTbodyIfNeed($container) {
      var danglingTrs = $container.children('tr');
      var ths = danglingTrs.find('th');
      var tbody = void 0;

      if (ths.length) {
        ths.each(function (i, node) {
          var $node = (0, _jquery2.default)(node);
          var td = (0, _jquery2.default)('<td></td>');

          td.html($node.html());
          td.insertBefore(node);

          $node.detach();
        });
      }

      if (danglingTrs.length) {
        var $wrapperTableBody = (0, _jquery2.default)('<tbody></tbody>');

        danglingTrs.each(function (i, tr) {
          $wrapperTableBody.append(tr);
        });

        tbody = $wrapperTableBody.get(0);
      }

      return tbody;
    }

    /**
     * Wrap THEAD followed by TBODY both into Table
     * @param {jQuery} $container - clipboard container
     * @returns {HTMLElement|null}
     */

  }, {
    key: 'wrapTheadAndTbodyIntoTableIfNeed',
    value: function wrapTheadAndTbodyIntoTableIfNeed($container) {
      var danglingThead = $container.children('thead');
      var danglingTbody = $container.children('tbody');
      var $wrapperTable = (0, _jquery2.default)('<table></table>');
      var table = void 0;

      if (!danglingTbody.length && danglingThead.length) {
        $wrapperTable.append(danglingThead[0]);
        $wrapperTable.append('<tbody><tr></tr></tbody>');
        table = $wrapperTable.get(0);
      } else if (danglingTbody.length && !danglingThead.length) {
        $wrapperTable.append('<thead><tr></tr></thead>');
        $wrapperTable.append(danglingTbody[0]);
        table = $wrapperTable.get(0);
      } else if (danglingTbody.length && danglingThead.length) {
        $wrapperTable.append(danglingThead[0]);
        $wrapperTable.append(danglingTbody[0]);
        table = $wrapperTable.get(0);
      }

      return table;
    }

    /**
     * Whether pasting element is table element
     * @param {string} pastingNodeName Pasting node name
     * @returns {boolean}
     */

  }, {
    key: 'isTableOrSubTableElement',
    value: function isTableOrSubTableElement(pastingNodeName) {
      return pastingNodeName === 'TABLE' || pastingNodeName === 'TBODY' || pastingNodeName === 'THEAD' || pastingNodeName === 'TR' || pastingNodeName === 'TD';
    }

    /**
     * Stuff table cells into incomplete rows
     * @param {jQuery} $trs jQuery wrapped TRs
     * @param {number} maximumCellLength maximum cell length of table
     * @private
     */

  }, {
    key: '_stuffTableCellsIntoIncompleteRow',
    value: function _stuffTableCellsIntoIncompleteRow($trs, maximumCellLength) {
      $trs.each(function (rowIndex, row) {
        var $row = (0, _jquery2.default)(row);
        var tableCells = $row.find('th,td');
        var parentNodeName = _domUtils2.default.getNodeName($row.parent()[0]);
        var cellTagName = parentNodeName === 'THEAD' ? 'th' : 'td';

        for (var cellLength = tableCells.length; cellLength < maximumCellLength; cellLength += 1) {
          $row.append((0, _jquery2.default)(tableCellGenerator(1, cellTagName))[0]);
        }
      });
    }

    /**
     * Prepare to table cell stuffing
     * @param {jQuery} $trs jQuery wrapped TRs
     * @returns {{maximumCellLength: *, needTableCellStuffingAid: boolean}}
     */

  }, {
    key: 'prepareToTableCellStuffing',
    value: function prepareToTableCellStuffing($trs) {
      var maximumCellLength = $trs.eq(0).find('th,td').length;
      var needTableCellStuffingAid = false;

      $trs.each(function (i, row) {
        var cellCount = (0, _jquery2.default)(row).find('th,td').length;

        if (maximumCellLength !== cellCount) {
          needTableCellStuffingAid = true;

          if (maximumCellLength < cellCount) {
            maximumCellLength = cellCount;
          }
        }
      });

      return {
        maximumCellLength: maximumCellLength,
        needTableCellStuffingAid: needTableCellStuffingAid
      };
    }

    /**
     * Add TBODY or THEAD if need
     * @param {jQuery} $table - Table jQuery element
     * @private
     */

  }, {
    key: '_addTbodyOrTheadIfNeed',
    value: function _addTbodyOrTheadIfNeed($table) {
      var isTheadNotExists = !$table.find('thead').length;
      var isTbodyNotExists = !$table.find('tbody').length;
      var absentNode = void 0;

      if (isTheadNotExists) {
        absentNode = (0, _jquery2.default)('<thead><tr></tr></thead>').get(0);
        $table.prepend(absentNode);
      } else if (isTbodyNotExists) {
        absentNode = (0, _jquery2.default)('<tbody><tr></tr></tbody>').get(0);
        $table.append(absentNode);
      }
    }

    /**
     * Append table cells
     * @param {HTMLElement} node Table element
     */

  }, {
    key: 'tableCellAppendAidForTableElement',
    value: function tableCellAppendAidForTableElement(node) {
      var $table = (0, _jquery2.default)(node);

      this._addTbodyOrTheadIfNeed($table);
      this._addTrIntoContainerIfNeed($table);

      var $trs = $table.find('tr');
      var tableAidInformation = this.prepareToTableCellStuffing($trs);
      var maximumCellLength = tableAidInformation.maximumCellLength,
          needTableCellStuffingAid = tableAidInformation.needTableCellStuffingAid;


      if (needTableCellStuffingAid) {
        this._stuffTableCellsIntoIncompleteRow($trs, maximumCellLength);
      }
    }

    /**
     * Generate THEAD and append TDs with same amount of given TBODY
     * @param {HTMLElement} node TR element
     * @returns {{thead: HTMLElement, tbody: HTMLElement}}
     * @private
     */

  }, {
    key: '_generateTheadAndTbodyFromTbody',
    value: function _generateTheadAndTbodyFromTbody(node) {
      var tr = (0, _jquery2.default)('<tr></tr>');
      var thead = (0, _jquery2.default)('<thead></thead>');

      tr.append(tableCellGenerator((0, _jquery2.default)(node).find('tr').eq(0).find('td').length, 'th'));
      thead.append(tr);

      return {
        thead: thead[0],
        tbody: node
      };
    }

    /**
     * Generate TBODY and append TDs with same amount of given THEAD
     * @param {HTMLElement} node TR element
     * @returns {{thead: HTMLElement, tbody: HTMLElement}}
     * @private
     */

  }, {
    key: '_generateTheadAndTbodyFromThead',
    value: function _generateTheadAndTbodyFromThead(node) {
      var tr = (0, _jquery2.default)('<tr></tr>');
      var tbody = (0, _jquery2.default)('<tbody></tbody>');

      tr.append(tableCellGenerator((0, _jquery2.default)(node).find('th').length, 'td'));
      tbody.append(tr);

      return {
        thead: node,
        tbody: tbody[0]
      };
    }

    /**
     * Generate THEAD and TBODY and append given TR within
     * @param {HTMLElement} node TR element
     * @returns {{thead: HTMLElement, tbody: HTMLElement}}
     * @private
     */

  }, {
    key: '_generateTheadAndTbodyFromTr',
    value: function _generateTheadAndTbodyFromTr(node) {
      var $node = (0, _jquery2.default)(node);
      var thead = (0, _jquery2.default)('<thead></thead>');
      var tbody = (0, _jquery2.default)('<tbody></tbody>');
      var theadRow = void 0,
          tbodyRow = void 0;

      if ($node.children()[0].tagName === 'TH') {
        theadRow = node;
        tbodyRow = (0, _jquery2.default)('<tr>' + tableCellGenerator($node.find('th').length, 'td') + '</tr>').get(0);
      } else {
        theadRow = (0, _jquery2.default)('<tr>' + tableCellGenerator($node.find('td').length, 'th') + '</tr>').get(0);
        tbodyRow = node;
      }

      thead.append(theadRow);
      tbody.append(tbodyRow);

      return {
        thead: thead[0],
        tbody: tbody[0]
      };
    }

    /**
     * Complete passed table
     * @param {HTMLElement} node - Table inner element
     * @private
     */

  }, {
    key: '_completeIncompleteTable',
    value: function _completeIncompleteTable(node) {
      var nodeName = node.tagName;
      var table = void 0,
          completedTableContents = void 0;

      if (nodeName === 'TABLE') {
        table = node;
      } else {
        table = document.createElement('table');
        node.parentNode.insertBefore(table, node.nextSibling);

        if (nodeName === 'TBODY') {
          completedTableContents = this._generateTheadAndTbodyFromTbody(node);
        } else if (nodeName === 'THEAD') {
          completedTableContents = this._generateTheadAndTbodyFromThead(node);
        } else if (nodeName === 'TR') {
          completedTableContents = this._generateTheadAndTbodyFromTr(node);
        }

        table.appendChild(completedTableContents.thead);
        table.appendChild(completedTableContents.tbody);
      }

      this._removeEmptyRows(table);
      this.tableCellAppendAidForTableElement(table);
    }
  }, {
    key: '_removeEmptyRows',
    value: function _removeEmptyRows(table) {
      var trs = table.querySelectorAll('tr');
      _tuiCodeSnippet2.default.forEachArray(trs, function (tr) {
        if (!tr.cells.length) {
          tr.parentNode.removeChild(tr);
        }
      });
    }

    /**
     * Whole editor body searching incomplete table completion
     * @private
     */

  }, {
    key: '_completeTableIfNeed',
    value: function _completeTableIfNeed() {
      var _this4 = this;

      var $body = this.wwe.getEditor().get$Body();

      $body.children().each(function (index, node) {
        var $node = (0, _jquery2.default)(node);

        if (!_this4.isTableOrSubTableElement(node.nodeName)) {
          return;
        }

        if (node.nodeName === 'TABLE' && $node.find('tbody').length === 0) {
          $node.remove();
        } else {
          _this4._completeIncompleteTable(node);
        }
      });
    }

    /**
     * Reset _lastCellNode to null
     */

  }, {
    key: 'resetLastCellNode',
    value: function resetLastCellNode() {
      this._lastCellNode = null;
    }

    /**
     * Set _lastCellNode to given node
     * @param {HTMLElement} node Table cell
     */

  }, {
    key: 'setLastCellNode',
    value: function setLastCellNode(node) {
      this._lastCellNode = node;
    }

    /**
     * Return whether only modifier key pressed or not
     * @param {string} keymap Pressed keymap string
     * @returns {boolean}
     * @private
     */

  }, {
    key: '_isModifierKey',
    value: function _isModifierKey(keymap) {
      return (/((META|SHIFT|ALT|CONTROL)\+?)/g.test(keymap)
      );
    }

    /**
     * Return whether modifier keys pressed or not
     * @param {object} ev keyboard event object
     * @returns {boolean}
     * @private
     */

  }, {
    key: '_isModifierKeyPushed',
    value: function _isModifierKeyPushed(ev) {
      return ev.metaKey || ev.ctrlKey || ev.altKey || ev.shiftKey;
    }

    /**
     * Add one row into empty TBODY
     * @param {jQuery} $table Currently processing table
     * @private
     */

  }, {
    key: '_addTrIntoContainerIfNeed',
    value: function _addTrIntoContainerIfNeed($table) {
      var $trContainers = $table.children();

      $trContainers.each(function (i, container) {
        var hasNoRows = (0, _jquery2.default)(container).find('tr').length === 0;

        if (hasNoRows) {
          (0, _jquery2.default)(container).append((0, _jquery2.default)('<tr></tr>')[0]);
        }
      });
    }
  }, {
    key: '_expandTableIfNeed',
    value: function _expandTableIfNeed(fragment) {
      var range = this.wwe.getEditor().getSelection().cloneRange();
      var $table = (0, _jquery2.default)(range.startContainer).parents('table');
      var difference = this._getColumnAndRowDifference(fragment, range);

      if (difference.column < 0) {
        this._appendCellForAllRow($table, difference.column);
      }

      if (difference.row < 0) {
        this._appendRow($table, difference.row);
      }
    }
  }, {
    key: '_getColumnAndRowDifference',
    value: function _getColumnAndRowDifference(fragment, range) {
      var tableData = this._getTableDataFromTable(fragment);
      var rowLength = tableData.length;
      var columnLength = tableData[0].length;
      var $currentCell = (0, _jquery2.default)(range.startContainer).closest('th,td');
      var $currentRow = $currentCell.parent();
      var currentColumnIndex = _domUtils2.default.getNodeOffsetOfParent($currentCell[0]);
      var currentRowIndex = _domUtils2.default.getNodeOffsetOfParent($currentCell[0].parentNode);
      var $table = $currentRow.parents('table');
      var tableColumnLength = $table.find('tr').eq(0).children().length;
      var tableRowLength = $table.find('tr').length;
      var isInTbody = $currentRow.parents('tbody').length;

      if (isInTbody) {
        currentRowIndex += 1;
      }

      return {
        row: tableRowLength - (currentRowIndex + rowLength),
        column: tableColumnLength - (currentColumnIndex + columnLength)
      };
    }
  }, {
    key: '_appendCellForAllRow',
    value: function _appendCellForAllRow($table, columnDifference) {
      var brString = isIE10 ? '' : '<br />';

      $table.find('tr').each(function (i, row) {
        var tagName = void 0;

        for (var index = columnDifference; index < 0; index += 1) {
          if (i === 0) {
            tagName = 'th';
          } else {
            tagName = 'td';
          }
          (0, _jquery2.default)(row).append((0, _jquery2.default)('<' + tagName + '>' + brString + '</' + tagName + '>')[0]);
        }
      });
    }
  }, {
    key: '_appendRow',
    value: function _appendRow($table, rowDifference) {
      var newRow = $table.find('tr').last().clone();
      var brHTMLSting = isIE10 ? '' : '<br />';

      newRow.find('td').html(brHTMLSting);

      for (; rowDifference < 0; rowDifference += 1) {
        $table.find('tbody').append(newRow.clone()[0]);
      }
    }

    /**
     * Change selection to sibling cell
     * @param {HTMLElement} currentCell current TD or TH
     * @param {Range} range Range object
     * @param {string} direction 'next' or 'previous'
     * @param {string} scale 'row' or 'cell'
     * @private
     */

  }, {
    key: '_changeSelectionToTargetCell',
    value: function _changeSelectionToTargetCell(currentCell, range, direction, scale) {
      var isNext = direction === 'next';
      var isRow = scale === 'row';
      var target = void 0;

      if (isRow) {
        target = _domUtils2.default.getSiblingRowCellByDirection(currentCell, direction, false);
      } else {
        target = _domUtils2.default.getTableCellByDirection(currentCell, direction);
        if (!target) {
          target = _domUtils2.default.getSiblingRowCellByDirection(currentCell, direction, true);
        }
      }

      if (target) {
        if (isRow && !isNext) {
          this._moveToCursorEndOfCell(target, range);
        } else {
          range.setStart(target, 0);
        }
        range.collapse(true);
      } else {
        target = (0, _jquery2.default)(currentCell).parents('table').get(0);
        if (isNext) {
          range.setStart(target.nextElementSibling, 0);
        } else if (target.previousElementSibling && target.previousElementSibling.nodeName !== 'TABLE') {
          range.setStart(target.previousElementSibling, 1);
        } else {
          range.setStartBefore(target);
        }

        range.collapse(true);
      }
    }
  }, {
    key: '_moveToCursorEndOfCell',
    value: function _moveToCursorEndOfCell(cell, range) {
      var lastListItem = void 0;

      if (_domUtils2.default.isListNode(cell.lastChild)) {
        lastListItem = _domUtils2.default.getLastNodeBy(cell.lastChild, function (lastNode) {
          return lastNode.nodeName !== 'LI' || lastNode.nextSibling !== null;
        });
      }

      var lastText = _domUtils2.default.getLastNodeBy(lastListItem || cell, function (node) {
        return !_domUtils2.default.isTextNode(node);
      });

      var lastNode = lastText || lastListItem || cell;
      var offset = lastText ? lastText.length : lastNode.childNodes.length - 1;

      range.setStart(lastNode, offset);
    }

    /**
     * Move cursor to given direction by interval formatter
     * @param {string} direction 'next' or 'previous'
     * @param {string} interval 'row' or 'cell'
     * @param {object} [ev] Event object
     * @returns {boolean | null}
     * @private
     */

  }, {
    key: '_moveCursorTo',
    value: function _moveCursorTo(direction, interval, ev) {
      var sq = this.wwe.getEditor();
      var range = sq.getSelection().cloneRange();
      var currentCell = (0, _jquery2.default)(range.startContainer).closest('td,th').get(0);
      var isNeedNext = void 0;

      if (range.collapsed && this.wwe.isInTable(range) && currentCell) {
        if (interval === 'row' && !this._isMovedCursorToRow(range, direction)) {
          return isNeedNext;
        }

        if ((direction === 'previous' || interval === 'row') && !_tuiCodeSnippet2.default.isUndefined(ev)) {
          ev.preventDefault();
        }

        this._changeSelectionToTargetCell(currentCell, range, direction, interval);
        sq.setSelection(range);

        isNeedNext = false;
      }

      return isNeedNext;
    }
  }, {
    key: '_isMovedCursorToRow',
    value: function _isMovedCursorToRow(range, direction) {
      var startContainer = range.startContainer;


      if (this._isInList(startContainer)) {
        return this._isMovedCursorFromListToRow(startContainer, direction);
      }

      return this._isMovedCursorFromTextToRow(range, direction);
    }
  }, {
    key: '_isMovedCursorFromListToRow',
    value: function _isMovedCursorFromListToRow(startContainer, direction) {
      var directionKey = direction + 'Sibling';
      var listItem = this._findListItem(startContainer);

      var parentOfListItem = _domUtils2.default.getParentNodeBy(listItem, function (parentNode, currentNode) {
        var firstOrLastItem = currentNode[directionKey] === null && parentNode[directionKey] === null;

        return !_domUtils2.default.isCellNode(parentNode) && firstOrLastItem;
      });

      var firstOrLastList = _domUtils2.default.isListNode(parentOfListItem) && parentOfListItem[directionKey] === null;

      return _domUtils2.default.isCellNode(parentOfListItem.parentNode) && firstOrLastList;
    }
  }, {
    key: '_isMovedCursorFromTextToRow',
    value: function _isMovedCursorFromTextToRow(range, direction) {
      var startContainer = range.startContainer,
          startOffset = range.startOffset;

      var text = _domUtils2.default.isCellNode(startContainer) ? startContainer.childNodes[startOffset] : startContainer;

      var parentOfStyledText = _domUtils2.default.getParentNodeBy(text, function (parentNode) {
        return !_domUtils2.default.isCellNode(parentNode) && !_domUtils2.default.isTextNode(parentNode);
      });

      var foundSiblingNode = _domUtils2.default.getSiblingNodeBy(parentOfStyledText, direction, function (siblingNode) {
        return siblingNode !== null && siblingNode.nodeName !== 'BR';
      });

      return foundSiblingNode && foundSiblingNode[direction + 'Sibling'] === null;
    }

    /**
     * Remove contents and change selection if need
     * @param {Range} range - Range object
     * @param {string} keymap - keymap
     * @param {object} ev - Event object
     * @returns {boolean} - true if contents has been removed
     * @private
     */

  }, {
    key: '_removeContentsAndChangeSelectionIfNeed',
    value: function _removeContentsAndChangeSelectionIfNeed(range, keymap, ev) {
      var isTextInput = keymap.length <= 1;
      var isDeleteOperation = keymap === 'BACK_SPACE' || keymap === 'DELETE';
      var $selectedCells = this.wwe.componentManager.getManager('tableSelection').getSelectedCells();
      var firstSelectedCell = $selectedCells.first().get(0);
      var processed = false;

      if ((isTextInput || isDeleteOperation) && !this._isModifierKeyPushed(ev) && $selectedCells.length) {
        if (isDeleteOperation) {
          this._recordUndoStateIfNeed(range);
        }
        this._removeTableContents($selectedCells);

        this._lastCellNode = firstSelectedCell;

        range.setStart(firstSelectedCell, 0);
        range.collapse(true);
        this.wwe.getEditor().setSelection(range);
        processed = true;
      }

      return processed;
    }

    /**
     * Return new table ID class name string
     * @returns {string}
     */

  }, {
    key: 'getTableIDClassName',
    value: function getTableIDClassName() {
      var tableClassName = TABLE_CLASS_PREFIX + this.tableID;
      this.tableID += 1;

      return tableClassName;
    }

    /**
     * Destroy.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      var _this5 = this;

      this.eventManager.removeEventHandler('wysiwygRangeChangeAfter.table');
      this.eventManager.removeEventHandler('wysiwygSetValueAfter.table');
      this.eventManager.removeEventHandler('wysiwygProcessHTMLText.table');
      this.eventManager.removeEventHandler('cut.table');
      this.eventManager.removeEventHandler('copyBefore.table');
      _tuiCodeSnippet2.default.forEach(this.keyEventHandlers, function (handler, key) {
        return _this5.wwe.removeKeyEventHandler(key, handler);
      });
    }
  }]);

  return WwTableManager;
}();

/**
 * Generate table cell HTML text
 * @param {number} amount Amount of cells
 * @param {string} tagName Tag name of cell 'td' or 'th'
 * @private
 * @returns {string}
 */


function tableCellGenerator(amount, tagName) {
  var brHTMLString = '<br />';
  var cellString = '<' + tagName + '>' + brHTMLString + '</' + tagName + '>';
  var tdString = '';

  for (var i = 0; i < amount; i += 1) {
    tdString = tdString + cellString;
  }

  return tdString;
}

exports.default = WwTableManager;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements wysiwyg table selection manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _domUtils = __webpack_require__(4);

var _domUtils2 = _interopRequireDefault(_domUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TABLE_CELL_SELECTED_CLASS_NAME = 'te-cell-selected';

/**
 * Class WwTableSelectionManager
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @ignore
 */

var WwTableSelectionManager = function () {
  function WwTableSelectionManager(wwe) {
    _classCallCheck(this, WwTableSelectionManager);

    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @type {string}
     */
    this.name = 'tableSelection';

    this._init();
  }

  /**
     * Initialize
     * @private
     */


  _createClass(WwTableSelectionManager, [{
    key: '_init',
    value: function _init() {
      this._initEvent();

      // For disable firefox's table tool UI and table resize handler
      if (_tuiCodeSnippet2.default.browser.firefox) {
        document.execCommand('enableObjectResizing', false, 'false');
        document.execCommand('enableInlineTableEditing', false, 'false');
      }
    }

    /**
       * Initialize event
       * @private
       */

  }, {
    key: '_initEvent',
    value: function _initEvent() {
      var _this = this;

      var selectionStart = void 0,
          selectionEnd = void 0,
          validSelectionEnd = void 0;

      /**
       * Start table selection timer
       * @type {object}
       * @private
       */
      this._tableSelectionTimer = null;

      /**
       * Remove selection timer for Firefox table selection
       * @type {object}
       * @private
       */
      this._removeSelectionTimer = null;

      /**
       * Boolean value for whether selection started
       * @type {boolean}
       * @private
       */
      this._isSelectionStarted = false;

      var onMouseover = function onMouseover(ev) {
        selectionEnd = (0, _jquery2.default)(ev.data.target).closest('[contenteditable=true] td,th').get(0);

        var range = _this.wwe.getEditor().getSelection();
        var isEndsInTable = (0, _jquery2.default)(selectionEnd).parents('[contenteditable=true] table').get(0);
        var isSameCell = selectionStart === selectionEnd;
        var isTextSelect = _this._isTextSelect(range, isSameCell) && !(0, _jquery2.default)(selectionStart).hasClass(TABLE_CELL_SELECTED_CLASS_NAME);

        if (_this._isSelectionStarted && isEndsInTable && !isTextSelect) {
          window.getSelection().removeAllRanges();
          // For disable firefox's native table cell selection
          if (_tuiCodeSnippet2.default.browser.firefox && !_this._removeSelectionTimer) {
            _this._removeSelectionTimer = setInterval(function () {
              window.getSelection().removeAllRanges();
            }, 10);
          }
          _this.highlightTableCellsBy(selectionStart, selectionEnd);
          validSelectionEnd = selectionEnd;
        }
      };

      var finishSelection = function finishSelection() {
        if (_this._isSelectionStarted) {
          _this._isSelectionStarted = false;
          _this.eventManager.removeEventHandler('mouseover.tableSelection');
          _this.eventManager.removeEventHandler('mouseup.tableSelection');
        }
      };

      var onMouseup = function onMouseup(ev) {
        selectionEnd = (0, _jquery2.default)(ev.data.target).closest('[contenteditable=true] td,th').get(0);

        var range = _this.wwe.getEditor().getSelection();
        var isSameCell = selectionStart === selectionEnd;
        var isTextSelect = _this._isTextSelect(range, isSameCell) && !(0, _jquery2.default)(selectionStart).hasClass(TABLE_CELL_SELECTED_CLASS_NAME);

        _this._clearTableSelectionTimerIfNeed();

        if (_this._isSelectionStarted) {
          if (isTextSelect || _this._isListSelect(range)) {
            _this.removeClassAttrbuteFromAllCellsIfNeed();
          } else {
            _this.wwe.componentManager.getManager('table').resetLastCellNode();

            selectionEnd = selectionEnd || validSelectionEnd;

            range = _this.wwe.getEditor().getSelection();
            range.setStart(selectionEnd, 0);
            // IE wont fire copy/cut event if there is no selected range.
            // trick IE to fire the event
            if (_tuiCodeSnippet2.default.browser.msie) {
              range.setEnd(selectionEnd, 1);
            } else {
              range.setEnd(selectionEnd, 0);
              range.collapse(false);
            }
            _this.wwe.getEditor().setSelection(range);
          }
          if (_this.onDragEnd) {
            _this.onDragEnd();
          }
        }

        finishSelection();
      };

      var onMousedown = function onMousedown(ev) {
        var MOUSE_RIGHT_BUTTON = 2;
        selectionStart = (0, _jquery2.default)(ev.data.target).closest('[contenteditable=true] td,th').get(0);
        var isSelectedCell = (0, _jquery2.default)(selectionStart).hasClass(TABLE_CELL_SELECTED_CLASS_NAME);
        selectionEnd = null;

        if (!isSelectedCell || isSelectedCell && ev.data.button !== MOUSE_RIGHT_BUTTON) {
          _this.removeClassAttrbuteFromAllCellsIfNeed();
          if (selectionStart) {
            _this.setTableSelectionTimerIfNeed(selectionStart);
            _this.eventManager.listen('mouseover.tableSelection', onMouseover);
            _this.eventManager.listen('mouseup.tableSelection', onMouseup);
            if (_this.onDragStart) {
              _this.onDragStart(selectionStart);
            }
          }
        } else if (ev.data.button === MOUSE_RIGHT_BUTTON) {
          finishSelection();
        }
      };

      this.eventManager.listen('mousedown.tableSelection', onMousedown);
      this.eventManager.listen('copyBefore.tableSelection', finishSelection);
      this.eventManager.listen('pasteBefore.tableSelection', finishSelection);
    }

    /**
     * Return whether single cell text selection or not
     * @param {Range} range Range object
     * @param {boolean} isSameCell Boolean value for same cell selection
     * @returns {boolean}
     * @private
     */

  }, {
    key: '_isTextSelect',
    value: function _isTextSelect(range, isSameCell) {
      return (/TD|TH|TEXT/i.test(range.commonAncestorContainer.nodeName) && isSameCell
      );
    }

    /**
     * Return whether list selection or not
     * @param {Range} range Range object
     * @returns {boolean}
     * @private
     */

  }, {
    key: '_isListSelect',
    value: function _isListSelect(range) {
      return (/UL|OL|LI/i.test(range.commonAncestorContainer.nodeName)
      );
    }

    /**
     * Set setTimeout and setInterval timer execution if table selecting situation
     * @param {HTMLElement} selectionStart Start element
     */

  }, {
    key: 'setTableSelectionTimerIfNeed',
    value: function setTableSelectionTimerIfNeed(selectionStart) {
      var isTableSelecting = (0, _jquery2.default)(selectionStart).parents('[contenteditable=true] table').length;

      if (isTableSelecting) {
        this._isSelectionStarted = true;
      }
    }

    /**
     * Clear setTimeout and setInterval timer execution
     * @private
     */

  }, {
    key: '_clearTableSelectionTimerIfNeed',
    value: function _clearTableSelectionTimerIfNeed() {
      clearTimeout(this._tableSelectionTimer);
      // For disable firefox's native table selection
      if (_tuiCodeSnippet2.default.browser.firefox && this._removeSelectionTimer) {
        clearTimeout(this._removeSelectionTimer);
        this._removeSelectionTimer = null;
      }
    }

    /**
     * Re arrange selection when table does not include both start and end selection element
     * @param {HTMLElement} selectionStart Start element of selection
     * @param {HTMLElement} selectionEnd End element of selection
     * @returns {{startContainer: HTMLElement, endContainer: HTMLElement}}
     * @private
     */

  }, {
    key: '_reArrangeSelectionIfneed',
    value: function _reArrangeSelectionIfneed(selectionStart, selectionEnd) {
      var isRangeStartInTable = (0, _jquery2.default)(selectionStart).parents('[contenteditable=true] table').length;
      var isRangeEndInTable = (0, _jquery2.default)(selectionEnd).parents('[contenteditable=true] table').length;
      var isStartRangeOut = isRangeEndInTable && !isRangeStartInTable;
      var isEndRangeOut = !isRangeEndInTable && isRangeStartInTable;

      if (isStartRangeOut) {
        selectionStart = (0, _jquery2.default)(selectionEnd).parents('[contenteditable=true] table').find('th').first().get(0);
      } else if (isEndRangeOut) {
        selectionEnd = (0, _jquery2.default)(selectionStart).parents('[contenteditable=true] table').find('td').last().get(0);
      }

      return {
        startContainer: selectionStart,
        endContainer: selectionEnd
      };
    }

    /**
     * Apply select direction to editor
     * @param {{startContainer: HTMLElement, endContainer: HTMLElement}} selectionInformation
     *     Selection start and end element
     * @param {Range} range Range object
     * @returns {Range}
     * @private
     */

  }, {
    key: '_applySelectionDirection',
    value: function _applySelectionDirection(selectionInformation, range) {
      var nodeOffsetOfParent = _domUtils2.default.getNodeOffsetOfParent;
      var selectionStart = selectionInformation.startContainer;
      var selectionEnd = selectionInformation.endContainer;
      var rowDirection = nodeOffsetOfParent((0, _jquery2.default)(selectionStart).closest('[contenteditable=true] tr')[0]) - nodeOffsetOfParent((0, _jquery2.default)(selectionEnd).closest('[contenteditable=true] tr')[0]);
      var cellDirection = nodeOffsetOfParent(selectionStart) - nodeOffsetOfParent(selectionEnd);
      var isSameRow = rowDirection === 0;
      var isRowIncreases = rowDirection < 0;
      var isColumnIncreases = cellDirection > 0;

      if (isSameRow) {
        if (isColumnIncreases) {
          range.setStart(selectionEnd, 0);
          range.setEnd(selectionStart, 1);
        } else {
          range.setStart(selectionStart, 0);
          range.setEnd(selectionEnd, 1);
        }
      } else if (isRowIncreases) {
        range.setStart(selectionStart, 0);
        range.setEnd(selectionEnd, 1);
      } else {
        range.setStart(selectionEnd, 0);
        range.setEnd(selectionStart, 1);
      }

      return range;
    }

    /**
     * Get selection coordinate by current selection
     * @param {HTMLElement} selectionStart start element
     * @param {HTMLElement} selectionEnd end element
     * @returns {{from: {row: number, cell: number}, to: {row: number, cell: number}}}
     */

  }, {
    key: 'getSelectionRangeFromTable',
    value: function getSelectionRangeFromTable(selectionStart, selectionEnd) {
      var nodeOffsetOfParent = _domUtils2.default.getNodeOffsetOfParent;
      var startRowOffset = nodeOffsetOfParent(selectionStart.parentNode);
      var endRowOffset = nodeOffsetOfParent(selectionEnd.parentNode);
      var startCellOffset = nodeOffsetOfParent(selectionStart);
      var endCellOffset = nodeOffsetOfParent(selectionEnd);
      var startCellContainer = _domUtils2.default.getParentUntil(selectionStart, 'TABLE');
      var endCellContainer = _domUtils2.default.getParentUntil(selectionEnd, 'TABLE');
      var isReversedTheadAndTbodySelect = _domUtils2.default.getNodeName(startCellContainer) === 'TBODY' && _domUtils2.default.getNodeName(endCellContainer) === 'THEAD';
      var isTheadAndTbodySelect = startCellContainer !== endCellContainer;
      var isBothInTbody = !!(0, _jquery2.default)(selectionStart).parents('tbody').length && !!(0, _jquery2.default)(selectionEnd).parents('tbody').length;
      var start = {
        row: startRowOffset,
        cell: startCellOffset
      };
      var end = {
        row: endRowOffset,
        cell: endCellOffset
      };
      var from = void 0,
          to = void 0;

      if (isReversedTheadAndTbodySelect) {
        start.row += 1;
      } else if (isTheadAndTbodySelect) {
        end.row += 1;
      } else if (isBothInTbody) {
        start.row += 1;
        end.row += 1;
      }

      if (startRowOffset > endRowOffset || startRowOffset === endRowOffset && startCellOffset > endCellOffset) {
        from = end;
        to = start;
      } else {
        from = start;
        to = end;
      }

      return {
        from: from,
        to: to
      };
    }

    /**
     * Highlight selected table cells
     * @param {HTMLElement} selectionStart start element
     * @param {HTMLElement} selectionEnd end element
     */

  }, {
    key: 'highlightTableCellsBy',
    value: function highlightTableCellsBy(selectionStart, selectionEnd) {
      var trs = (0, _jquery2.default)(selectionStart).parents('[contenteditable=true] table').find('tr');
      var selection = this.getSelectionRangeFromTable(selectionStart, selectionEnd);
      var rowFrom = selection.from.row;
      var cellFrom = selection.from.cell;
      var rowTo = selection.to.row;
      var cellTo = selection.to.cell;

      trs.each(function (rowIndex, row) {
        (0, _jquery2.default)(row).find('td,th').each(function (cellIndex, cell) {
          var $cell = (0, _jquery2.default)(cell);
          var isFromRow = rowIndex === rowFrom;
          var isToRow = rowIndex === rowTo;

          if (isFromRow && cellIndex < cellFrom || isToRow && cellIndex > cellTo || rowIndex < rowFrom || rowIndex > rowTo) {
            $cell.removeClass(TABLE_CELL_SELECTED_CLASS_NAME);
          } else {
            $cell.addClass(TABLE_CELL_SELECTED_CLASS_NAME);
          }
        });
      });
    }

    /**
     * Remove '.te-cell-selected' class from all of table Cell
     */

  }, {
    key: 'removeClassAttrbuteFromAllCellsIfNeed',
    value: function removeClassAttrbuteFromAllCellsIfNeed() {
      this.wwe.get$Body().find('td.' + TABLE_CELL_SELECTED_CLASS_NAME + ',th.' + TABLE_CELL_SELECTED_CLASS_NAME).each(function (i, node) {
        var $node = (0, _jquery2.default)(node);

        $node.removeClass(TABLE_CELL_SELECTED_CLASS_NAME);

        if (!$node.attr('class').length) {
          $node.removeAttr('class');
        }
      });
    }

    /**
     * gets selected cells
     * @returns {jQuery} selected cells
     */

  }, {
    key: 'getSelectedCells',
    value: function getSelectedCells() {
      return this.wwe.get$Body().find('.' + TABLE_CELL_SELECTED_CLASS_NAME);
    }

    /**
     * Create selection by selected cells and collapse that selection to end
     */

  }, {
    key: 'createRangeBySelectedCells',
    value: function createRangeBySelectedCells() {
      var sq = this.wwe.getEditor();
      var range = sq.getSelection().cloneRange();
      var $selectedCells = this.getSelectedCells();
      var firstSelectedCell = $selectedCells.first().get(0);
      var lastSelectedCell = $selectedCells.last().get(0);

      if ($selectedCells.length && this.wwe.isInTable(range)) {
        range.setStart(firstSelectedCell, 0);
        range.setEnd(lastSelectedCell, lastSelectedCell.childNodes.length);
        sq.setSelection(range);
      }
    }

    /**
     * Style to selected cells.
     * @param {function} onStyle - function for styling
     * @param {Object} [options] - options to be passed into onStyle
     */

  }, {
    key: 'styleToSelectedCells',
    value: function styleToSelectedCells(onStyle, options) {
      this.createRangeBySelectedCells();
      onStyle(this.wwe.getEditor(), options);
    }

    /**
     * Destroy.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.eventManager.removeEventHandler('mousedown.tableSelection');
      this.eventManager.removeEventHandler('mouseover.tableSelection');
      this.eventManager.removeEventHandler('mouseup.tableSelection');
      this.eventManager.removeEventHandler('copyBefore.tableSelection');
      this.eventManager.removeEventHandler('pasteBefore.tableSelection');
    }
  }]);

  return WwTableSelectionManager;
}();

exports.default = WwTableSelectionManager;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements wysiwyg code block manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _domUtils = __webpack_require__(4);

var _domUtils2 = _interopRequireDefault(_domUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isIE10 = _tuiCodeSnippet2.default.browser.msie && _tuiCodeSnippet2.default.browser.version === 10;
var brString = isIE10 ? '' : '<br>';

var tagEntities = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};

var FIND_ZWS_RX = /\u200B/g;
var CODEBLOCK_ATTR_NAME = 'data-te-codeblock';

/**
 * Class WwCodeBlockManager
 * @param {WysiwygEditor} wwe - wysiwygEditor instance
 * @ignore
 */

var WwCodeBlockManager = function () {
  function WwCodeBlockManager(wwe) {
    _classCallCheck(this, WwCodeBlockManager);

    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @type {string}
     */
    this.name = 'codeblock';

    this._init();
  }

  /**
   * Initialize
   * @private
   */


  _createClass(WwCodeBlockManager, [{
    key: '_init',
    value: function _init() {
      this._initKeyHandler();
      this._initEvent();
    }

    /**
     * Initialize key event handler
     * @private
     */

  }, {
    key: '_initKeyHandler',
    value: function _initKeyHandler() {
      var _this = this;

      this._keyEventHandlers = {
        'BACK_SPACE': this._onBackspaceKeyEventHandler.bind(this),
        'ENTER': function ENTER(ev, range) {
          if (!_this.wwe.isInTable(range) && _this.wwe.getEditor().hasFormat('CODE')) {
            _this.wwe.defer(function () {
              var _wwe$getRange = _this.wwe.getRange(),
                  startContainer = _wwe$getRange.startContainer;

              var codeNode = _this._getCodeNode(startContainer);
              if (codeNode && !_domUtils2.default.getTextLength(codeNode)) {
                codeNode.parentNode.removeChild(codeNode);
              }
            });
          }
        }
      };

      _tuiCodeSnippet2.default.forEach(this._keyEventHandlers, function (handler, key) {
        return _this.wwe.addKeyEventHandler(key, handler);
      });
    }
  }, {
    key: '_getCodeNode',
    value: function _getCodeNode(node) {
      var result = void 0;
      if (node.nodeName === 'CODE') {
        result = node;
      } else if (node.parentNode.nodeName === 'CODE') {
        result = node.parentNode;
      }

      return result;
    }

    /**
     * Initialize eventmanager event
     * @private
     */

  }, {
    key: '_initEvent',
    value: function _initEvent() {
      var _this2 = this;

      this.eventManager.listen('wysiwygSetValueAfter.codeblock', function () {
        _this2.modifyCodeBlockForWysiwyg();
      });

      this.eventManager.listen('wysiwygProcessHTMLText.codeblock', function (html) {
        return _this2._changePreToPreCode(html);
      });
    }

    /**
     * Prepare nodes for pasting to code block
     * @param {Array.<Node>} nodes Node array
     * @returns {DocumentFragment}
     */

  }, {
    key: 'prepareToPasteOnCodeblock',
    value: function prepareToPasteOnCodeblock(nodes) {
      var frag = this.wwe.getEditor().getDocument().createDocumentFragment();
      var text = this.convertNodesToText(nodes);
      text = text.replace(/\n$/, '');
      frag.appendChild(document.createTextNode(text));

      return frag;
    }

    /**
     * Convert nodes to text for pasting to code block
     * @param {Array.<Node>} nodes Node array
     * @returns {string} coverted string
     */

  }, {
    key: 'convertNodesToText',
    value: function convertNodesToText(nodes) {
      var str = '';
      var node = nodes.shift();

      while (_tuiCodeSnippet2.default.isTruthy(node)) {
        var _node = node,
            childNodes = _node.childNodes;

        if (childNodes && _domUtils2.default.isBlockNode(node)) {
          str += this.convertNodesToText(_tuiCodeSnippet2.default.toArray(node.childNodes));
        } else if (node.nodeName === 'BR') {
          str += '\n';
        } else {
          str += node.textContent;
        }
        node = nodes.shift();
      }

      return str;
    }

    /**
     * Copy content with code block style from code block selection
     * @param {HTMLElement} element Copied element
     * @param {Range} range Range object
     * @returns {HTMLElement}
     * @private
     */

  }, {
    key: '_copyCodeblockTypeFromRangeCodeblock',
    value: function _copyCodeblockTypeFromRangeCodeblock(element, range) {
      var blockNode = _domUtils2.default.getParentUntil(range.commonAncestorContainer, this.wwe.get$Body()[0]);

      if (_domUtils2.default.getNodeName(blockNode) === 'PRE') {
        var attrs = (0, _jquery2.default)(blockNode).prop('attributes');

        _tuiCodeSnippet2.default.forEach(attrs, function (attr) {
          (0, _jquery2.default)(element).attr(attr.name, attr.value);
        });
      }

      return element;
    }

    /**
     * Change pre tag to pre and code
     * @param {string} html HTML string
     * @returns {string}
     * @private
     */

  }, {
    key: '_changePreToPreCode',
    value: function _changePreToPreCode(html) {
      return html.replace(/<pre( .*?)?>((.|\n)*?)<\/pre>/g, function (match, codeAttr, code) {
        return '<pre><code' + (codeAttr || '') + '>' + code + '</code></pre>';
      });
    }

    /**
     * Modify Code Block for Wysiwyg
     * @param {HTMLElement} node root node to find pre
     */

  }, {
    key: 'modifyCodeBlockForWysiwyg',
    value: function modifyCodeBlockForWysiwyg(node) {
      if (!node) {
        node = this.wwe.get$Body();
      }

      (0, _jquery2.default)(node).find('pre').each(function (index, pre) {
        var $pre = (0, _jquery2.default)(pre);
        var lang = $pre.find('code').attr('data-language');
        var numberOfBackticks = $pre.find('code').attr('data-backticks');

        // if this pre can have lines
        if ($pre.children().length > 1) {
          $pre.children().each(function (idx, childNode) {
            if ((childNode.nodeName === 'DIV' || childNode.nodeName === 'P') && !(0, _jquery2.default)(childNode).find('br').length) {
              (0, _jquery2.default)(childNode).append('\n');
            }
          });
        }
        $pre.find('br').replaceWith('\n');

        var resultText = $pre.text().replace(/\s+$/, '');
        $pre.empty();
        $pre.html(resultText ? sanitizeHtmlCode(resultText) : brString);

        if (lang) {
          $pre.attr('data-language', lang);
          $pre.addClass('lang-' + lang);
        }
        if (numberOfBackticks) {
          $pre.attr('data-backticks', numberOfBackticks);
        }
        $pre.attr(CODEBLOCK_ATTR_NAME, '');
      });
    }

    /**
     * Remove codeblock of first line when press backspace in first line
     * @param {Event} ev Event object
     * @param {Range} range Range object
     * @returns {boolean}
     * @private
     */

  }, {
    key: '_onBackspaceKeyEventHandler',
    value: function _onBackspaceKeyEventHandler(ev, range) {
      var isNeedNext = true;
      var sq = this.wwe.getEditor();
      var container = range.commonAncestorContainer;

      if (this._isCodeBlockFirstLine(range) && !this._isFrontCodeblock(range)) {
        this._removeCodeblockFirstLine(container);
        range.collapse(true);
        isNeedNext = false;
      } else if (range.collapsed && this._isEmptyLine(container) && this._isBetweenSameCodeblocks(container)) {
        var previousSibling = container.previousSibling,
            nextSibling = container.nextSibling;

        var prevTextLength = previousSibling.textContent.length;

        sq.saveUndoState(range);

        container.parentNode.removeChild(container);
        this._mergeCodeblocks(previousSibling, nextSibling);

        range.setStart(previousSibling.childNodes[0], prevTextLength);
        range.collapse(true);
        isNeedNext = false;
      }

      if (!isNeedNext) {
        sq.setSelection(range);
        ev.preventDefault();
      }

      return isNeedNext;
    }

    /**
     * Check node is empty line
     * @param {Node} node node
     * @returns {boolean}
     * @private
     */

  }, {
    key: '_isEmptyLine',
    value: function _isEmptyLine(node) {
      var nodeName = node.nodeName,
          childNodes = node.childNodes;

      var isEmpty = isIE10 ? node.textContent === '' : childNodes.length === 1 && childNodes[0].nodeName === 'BR';

      return nodeName === 'DIV' && isEmpty;
    }

    /**
     * Check whether node is between same codeblocks
     * @param {Node} node Node
     * @returns {boolean}
     * @private
     */

  }, {
    key: '_isBetweenSameCodeblocks',
    value: function _isBetweenSameCodeblocks(node) {
      var previousSibling = node.previousSibling,
          nextSibling = node.nextSibling;


      return _domUtils2.default.getNodeName(previousSibling) === 'PRE' && _domUtils2.default.getNodeName(nextSibling) === 'PRE' && previousSibling.getAttribute('data-language') === nextSibling.getAttribute('data-language');
    }
  }, {
    key: '_mergeCodeblocks',
    value: function _mergeCodeblocks(frontCodeblock, backCodeblock) {
      var postText = backCodeblock.textContent;
      frontCodeblock.childNodes[0].textContent += '\n' + postText;
      backCodeblock.parentNode.removeChild(backCodeblock);
    }

    /**
     * Check whether range is first line of code block
     * @param {Range} range Range object
     * @returns {boolean}
     * @private
     */

  }, {
    key: '_isCodeBlockFirstLine',
    value: function _isCodeBlockFirstLine(range) {
      return this.isInCodeBlock(range) && range.collapsed && range.startOffset === 0;
    }

    /**
     * Check whether front block of range is code block
     * @param {Range} range Range object
     * @returns {boolean}
     * @private
     */

  }, {
    key: '_isFrontCodeblock',
    value: function _isFrontCodeblock(range) {
      var block = _domUtils2.default.getParentUntil(range.startContainer, this.wwe.getEditor().getRoot());
      var previousSibling = block.previousSibling;


      return previousSibling && previousSibling.nodeName === 'PRE';
    }

    /**
     * Remove codeblock first line of codeblock
     * @param {Node} node Pre Node
     * @private
     */

  }, {
    key: '_removeCodeblockFirstLine',
    value: function _removeCodeblockFirstLine(node) {
      var sq = this.wwe.getEditor();
      var preNode = node.nodeName === 'PRE' ? node : node.parentNode;
      var codeContent = preNode.textContent.replace(FIND_ZWS_RX, '');
      sq.modifyBlocks(function () {
        var newFrag = sq.getDocument().createDocumentFragment();
        var strArray = codeContent.split('\n');

        var firstDiv = document.createElement('div');
        var firstLine = strArray.shift();
        firstDiv.innerHTML = '' + firstLine + brString;
        newFrag.appendChild(firstDiv);

        if (strArray.length) {
          var newPreNode = preNode.cloneNode();
          newPreNode.textContent = strArray.join('\n');
          newFrag.appendChild(newPreNode);
        }

        return newFrag;
      });
    }

    /**
     * Return boolean value of whether current range is in the code block
     * @param {Range} range Range object
     * @returns {boolean}
     */

  }, {
    key: 'isInCodeBlock',
    value: function isInCodeBlock(range) {
      var target = void 0;

      if (range.collapsed) {
        target = range.startContainer;
      } else {
        target = range.commonAncestorContainer;
      }

      return !!(0, _jquery2.default)(target).closest('pre').length;
    }

    /**
     * Destroy
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      var _this3 = this;

      this.eventManager.removeEventHandler('wysiwygSetValueAfter.codeblock');
      this.eventManager.removeEventHandler('wysiwygProcessHTMLText.codeblock');
      _tuiCodeSnippet2.default.forEach(this._keyEventHandlers, function (handler, key) {
        return _this3.wwe.removeKeyEventHandler(key, handler);
      });
    }
  }]);

  return WwCodeBlockManager;
}();

/**
 * Sanitize HTML code
 * @param {string} code code string
 * @returns {string}
 * @ignore
 */


function sanitizeHtmlCode(code) {
  return code ? code.replace(/[<>&]/g, function (tag) {
    return tagEntities[tag] || tag;
  }) : '';
}

exports.default = WwCodeBlockManager;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _uicontroller = __webpack_require__(8);

var _uicontroller2 = _interopRequireDefault(_uicontroller);

var _button = __webpack_require__(19);

var _button2 = _interopRequireDefault(_button);

var _toolbarItem = __webpack_require__(11);

var _toolbarItem2 = _interopRequireDefault(_toolbarItem);

var _toolbarDivider = __webpack_require__(42);

var _toolbarDivider2 = _interopRequireDefault(_toolbarDivider);

var _toolbarItemFactory = __webpack_require__(43);

var _toolbarItemFactory2 = _interopRequireDefault(_toolbarItemFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements toolbar
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Class Toolbar
 * @param {EventManager} eventManager - event manager
 * @param {ToolbarItem[]} [items=[]] - toolbar items
 */
var Toolbar = function (_UIController) {
  _inherits(Toolbar, _UIController);

  /**
   * items
   * @type {Array}
   * @private
   */
  function Toolbar(eventManager) {
    var items = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, Toolbar);

    var _this = _possibleConstructorReturn(this, (Toolbar.__proto__ || Object.getPrototypeOf(Toolbar)).call(this, {
      tagName: 'div',
      className: 'tui-editor-defaultUI-toolbar'
    }));

    Object.defineProperty(_this, '_items', {
      enumerable: true,
      writable: true,
      value: []
    });


    _this._eventManager = eventManager;

    _this.setItems(items);
    _this._initEvent(eventManager);
    return _this;
  }

  /**
   * init event
   * @param  {EventManager} eventManager - event manager
   * @private
   * @override
   */


  /**
   * event manager
   * @type {EventManager}
   * @private
   */


  _createClass(Toolbar, [{
    key: '_initEvent',
    value: function _initEvent(eventManager) {
      var _this2 = this;

      eventManager.listen('stateChange', function (ev) {
        _this2._items.forEach(function (item) {
          if (item._state) {
            if (ev[item._state]) {
              item.$el.addClass('active');
            } else {
              item.$el.removeClass('active');
            }
          }
        });
      });
      eventManager.listen('changePreviewTabPreview', function () {
        return _this2.disableAllButton();
      });
      eventManager.listen('changePreviewTabWrite', function () {
        return _this2.enableAllButton();
      });
      eventManager.listen('changeMode', function () {
        return _this2.enableAllButton();
      });
    }

    /**
     * disable all toolbar button
     */

  }, {
    key: 'disableAllButton',
    value: function disableAllButton() {
      this._items.forEach(function (item) {
        if (item instanceof _button2.default) {
          item.disable();
        }
      });
    }

    /**
     * enable all toolbar button
     */

  }, {
    key: 'enableAllButton',
    value: function enableAllButton() {
      this._items.forEach(function (item) {
        if (item instanceof _button2.default) {
          item.enable();
        }
      });
    }

    /**
     * get toolbar items
     * @returns {ToolbarItem[]} - toolbar items
     */

  }, {
    key: 'getItems',
    value: function getItems() {
      return this._items.slice(0);
    }

    /**
     * get toolbar item at given index
     * @param  {number} index - item index
     * @returns {ToolbarItem} - toolbar item at the index
     */

  }, {
    key: 'getItem',
    value: function getItem(index) {
      return this._items[index];
    }

    /**
     * set toolbar items
     * @param {ToolbarItem[]} items - toolbar items
     */

  }, {
    key: 'setItems',
    value: function setItems(items) {
      this.removeAllItems();
      items.forEach(this.addItem.bind(this));
    }

    /**
     * add toolbar item
     * @param {ToolbarItem|string|object} item - toolbar item
     */

  }, {
    key: 'addItem',
    value: function addItem(item) {
      this.insertItem(this._items.length, item);
    }

    /**
     * insert toolbar item
     * @param  {number} index - index at given item inserted
     * @param  {ToolbarItem|string|object} item - toolbar item
     */

  }, {
    key: 'insertItem',
    value: function insertItem(index, item) {
      var _this3 = this;

      if (_tuiCodeSnippet2.default.isString(item)) {
        item = _toolbarItemFactory2.default.create(item);
      } else if (_tuiCodeSnippet2.default.isString(item.type)) {
        item = _toolbarItemFactory2.default.create(item.type, item.options);
      }

      var children = this.$el.children();
      if (index >= 0 && index < children.length) {
        item.$el.insertBefore(children.eq(index));
        this._items.splice(index, 0, item);
      } else {
        item.$el.appendTo(this.$el);
        this._items.push(item);
      }

      item.onCommandHandler = function (e, commandName) {
        return _this3._eventManager.emit('command', commandName);
      };
      item.onEventHandler = function (e, eventName) {
        return _this3._eventManager.emit(eventName);
      };
      item.on('command', item.onCommandHandler);
      item.on('event', item.onEventHandler);
    }

    /**
     * get index of given item
     * @param  {ToolbarItem} item - toolbar item
     * @returns {number} - index of given toolbar item
     */

  }, {
    key: 'indexOfItem',
    value: function indexOfItem(item) {
      var index = void 0;
      if (item instanceof _toolbarItem2.default) {
        index = this._items.indexOf(item);
      } else if (_tuiCodeSnippet2.default.isString(item)) {
        var itemName = item;
        index = this._items.map(function (itemToTest) {
          return itemToTest.getName();
        }).indexOf(itemName);
      }

      return index;
    }

    /**
     * remove an item
     * @param  {ToolbarItem|number} item - an toolbar item or index of the item to remove
     * @param  {boolean} destroy - destroy item or not
     * @returns {ToolbarItem|undefined} - removed item
     */

  }, {
    key: 'removeItem',
    value: function removeItem(item) {
      var destroy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var index = void 0;
      var removedItem = void 0;

      if (item instanceof _toolbarItem2.default) {
        index = this.indexOfItem(item);
      } else {
        index = item;
      }

      if (index >= 0) {
        removedItem = this._items.splice(index, 1)[0];
      }
      if (removedItem) {
        if (destroy) {
          removedItem.destroy();
        } else {
          removedItem.off('command', removedItem.onCommandHandler);
          removedItem.off('event', removedItem.onEventHandler);
          removedItem.$el.detach();
        }
      }

      return removedItem;
    }

    /**
     * remove all toolbar items
     */

  }, {
    key: 'removeAllItems',
    value: function removeAllItems() {
      while (this._items && this._items.length > 0) {
        this.removeItem(0);
      }
    }

    /**
     * destroy instance
     * @override
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.removeAllItems();
      _get(Toolbar.prototype.__proto__ || Object.getPrototypeOf(Toolbar.prototype), 'destroy', this).call(this);
    }

    /**
     * add button
     * @param {Button} button - button instance
     * @param {Number} [index] - location the button will be placed
     * @deprecated
     */

  }, {
    key: 'addButton',
    value: function addButton(button, index) {
      if (_tuiCodeSnippet2.default.isArray(button)) {
        var arrayIndex = button.length - 1;
        for (; arrayIndex >= 0; arrayIndex -= 1) {
          if (_tuiCodeSnippet2.default.isNumber(index)) {
            this._addButton(button[arrayIndex], index);
          } else {
            this._addButton(button);
          }
        }
      } else {
        this._addButton(button, index);
      }
    }

    /**
     * _addButton
     * @param {Button} button - button instance
     * @param {Number} index - location the button will be placed
     * @private
     * @deprecated
     */

  }, {
    key: '_addButton',
    value: function _addButton(button, index) {
      var $btn = this._setButton(button, index).$el;

      if (_tuiCodeSnippet2.default.isNumber(index)) {
        this.$el.find('.' + _button2.default.className).eq(index - 1).before($btn);
      } else {
        this.$el.append($btn);
      }
    }

    /**
     * add divider
     * @returns {jQuery} - created divider jquery element
     * @deprecated
     */

  }, {
    key: 'addDivider',
    value: function addDivider() {
      var $el = (0, _jquery2.default)('<div class="' + _toolbarDivider2.default.className + '"></div>');
      this.$el.append($el);

      return $el;
    }

    /**
     * _setButton
     * @param {Button} button - button instance
     * @param {Number} index - location the button will be placed
     * @returns {Button} - button instance
     * @private
     * @deprecated
     */

  }, {
    key: '_setButton',
    value: function _setButton(button, index) {
      var ev = this._eventManager;
      if (!(button instanceof _button2.default)) {
        button = new _button2.default(button);
      }

      button.on('command', function (e, commandName) {
        return ev.emit('command', commandName);
      });
      button.on('event', function (e, eventName) {
        return ev.emit(eventName);
      });
      if (_tuiCodeSnippet2.default.isNumber(index)) {
        this._items.splice(index, 0, button);
      } else {
        this._items.push(button);
      }

      return button;
    }
  }]);

  return Toolbar;
}(_uicontroller2.default);

exports.default = Toolbar;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toolbarItem = __webpack_require__(11);

var _toolbarItem2 = _interopRequireDefault(_toolbarItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements Toolbar Divider
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Class ToolbarDivider
 * @ignore
 */
var ToolbarDivider = function (_ToolbarItem) {
  _inherits(ToolbarDivider, _ToolbarItem);

  /**
   * item name
   * @type {String}
   * @static
   */
  function ToolbarDivider() {
    _classCallCheck(this, ToolbarDivider);

    return _possibleConstructorReturn(this, (ToolbarDivider.__proto__ || Object.getPrototypeOf(ToolbarDivider)).call(this, {
      name: ToolbarDivider.name,
      tagName: 'div',
      className: ToolbarDivider.className
    }));
  }

  /**
   * item class name
   * @type {String}
   * @static
   */


  return ToolbarDivider;
}(_toolbarItem2.default);

Object.defineProperty(ToolbarDivider, 'name', {
  enumerable: true,
  writable: true,
  value: 'divider'
});
Object.defineProperty(ToolbarDivider, 'className', {
  enumerable: true,
  writable: true,
  value: 'tui-toolbar-divider'
});
exports.default = ToolbarDivider;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements Toolbar Item Factory
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _toolbarItem = __webpack_require__(11);

var _toolbarItem2 = _interopRequireDefault(_toolbarItem);

var _toolbarButton = __webpack_require__(76);

var _toolbarButton2 = _interopRequireDefault(_toolbarButton);

var _toolbarDivider = __webpack_require__(42);

var _toolbarDivider2 = _interopRequireDefault(_toolbarDivider);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Toolbar Item Factory
 * @ignore
 */
var ToolbarItemFactory = function () {
  function ToolbarItemFactory() {
    _classCallCheck(this, ToolbarItemFactory);
  }

  _createClass(ToolbarItemFactory, null, [{
    key: 'create',

    /**
     * create toolbar item instance
     * @param {string} name - toolbar item name
     * @param {object} [options] - options to the constructor
     * @return {ToolbarItem} - created toolbar item instance
     * @static
     */
    /* eslint-disable complexity */
    value: function create(name, options) {
      var toolbarItem = void 0;

      switch (name) {
        case 'heading':
          toolbarItem = new _toolbarButton2.default({
            name: 'heading',
            className: 'tui-heading',
            event: 'openHeadingSelect',
            tooltip: _i18n2.default.get('Headings')
          });
          break;
        case 'bold':
          toolbarItem = new _toolbarButton2.default({
            name: 'bold',
            className: 'tui-bold',
            command: 'Bold',
            tooltip: _i18n2.default.get('Bold'),
            state: 'bold'
          });
          break;
        case 'italic':
          toolbarItem = new _toolbarButton2.default({
            name: 'italic',
            className: 'tui-italic',
            command: 'Italic',
            tooltip: _i18n2.default.get('Italic'),
            state: 'italic'
          });
          break;
        case 'strike':
          toolbarItem = new _toolbarButton2.default({
            name: 'strike',
            className: 'tui-strike',
            command: 'Strike',
            tooltip: _i18n2.default.get('Strike'),
            state: 'strike'
          });
          break;
        case 'hr':
          toolbarItem = new _toolbarButton2.default({
            name: 'hr',
            className: 'tui-hrline',
            command: 'HR',
            tooltip: _i18n2.default.get('Line')
          });
          break;
        case 'quote':
          toolbarItem = new _toolbarButton2.default({
            name: 'quote',
            className: 'tui-quote',
            command: 'Blockquote',
            tooltip: _i18n2.default.get('Blockquote'),
            state: 'quote'
          });
          break;
        case 'ul':
          toolbarItem = new _toolbarButton2.default({
            name: 'ul',
            className: 'tui-ul',
            command: 'UL',
            tooltip: _i18n2.default.get('Unordered list')
          });
          break;
        case 'ol':
          toolbarItem = new _toolbarButton2.default({
            name: 'ol',
            className: 'tui-ol',
            command: 'OL',
            tooltip: _i18n2.default.get('Ordered list')
          });
          break;
        case 'task':
          toolbarItem = new _toolbarButton2.default({
            name: 'task',
            className: 'tui-task',
            command: 'Task',
            tooltip: _i18n2.default.get('Task')
          });
          break;
        case 'table':
          toolbarItem = new _toolbarButton2.default({
            name: 'table',
            className: 'tui-table',
            event: 'openPopupAddTable',
            tooltip: _i18n2.default.get('Insert table')
          });
          break;
        case 'image':
          toolbarItem = new _toolbarButton2.default({
            name: 'image',
            className: 'tui-image',
            event: 'openPopupAddImage',
            tooltip: _i18n2.default.get('Insert image'),
            state: ''
          });
          break;
        case 'link':
          toolbarItem = new _toolbarButton2.default({
            name: 'link',
            className: 'tui-link',
            event: 'openPopupAddLink',
            tooltip: _i18n2.default.get('Insert link')
          });
          break;
        case 'code':
          toolbarItem = new _toolbarButton2.default({
            name: 'code',
            className: 'tui-code',
            command: 'Code',
            tooltip: _i18n2.default.get('Code'),
            state: 'code'
          });
          break;
        case 'codeblock':
          toolbarItem = new _toolbarButton2.default({
            name: 'codeblock',
            className: 'tui-codeblock',
            command: 'CodeBlock',
            tooltip: _i18n2.default.get('Insert CodeBlock'),
            state: 'codeBlock'
          });
          break;
        case 'indent':
          toolbarItem = new _toolbarButton2.default({
            name: 'indent',
            className: 'tui-indent',
            command: 'Indent',
            tooltip: _i18n2.default.get('Indent')
          });
          break;
        case 'outdent':
          toolbarItem = new _toolbarButton2.default({
            name: 'outdent',
            className: 'tui-outdent',
            command: 'Outdent',
            tooltip: _i18n2.default.get('Outdent')
          });
          break;
        case 'divider':
          toolbarItem = new _toolbarDivider2.default();
          break;
        case 'button':
          toolbarItem = new _toolbarButton2.default(options);
          break;
        case 'item':
        default:
          toolbarItem = new _toolbarItem2.default(options);
      }

      return toolbarItem;
    }
    /* eslint-enable complexity */

  }]);

  return ToolbarItemFactory;
}();

exports.default = ToolbarItemFactory;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _uicontroller = __webpack_require__(8);

var _uicontroller2 = _interopRequireDefault(_uicontroller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements tab button ui
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var CLASS_TAB_ACTIVE = 'te-tab-active';

/**
 * Class Tab
 * @param {object} options - options
 *     @param {string} [options.initName] - name of the default activated button
 *     @param {string[]} options.items - Button names to be created
 *     @param {DOMElement[]} options.sections - Dom elements for tab
 *     @param {function} [options.onItemClick] - when button is clicked pass button name to function
 * @ignore
 */

var Tab = function (_UIController) {
  _inherits(Tab, _UIController);

  function Tab() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Tab);

    var _this = _possibleConstructorReturn(this, (Tab.__proto__ || Object.getPrototypeOf(Tab)).call(this, {
      tagName: 'div',
      className: 'te-tab'
    }));

    _this.sections = options.sections;

    _this._$activeButton = null;

    _this._render(options);
    _this._initEvent(options);
    return _this;
  }

  _createClass(Tab, [{
    key: '_initEvent',
    value: function _initEvent(options) {
      var onItemClick = options.onItemClick;

      if (onItemClick) {
        this.on('itemClick', onItemClick);
      }

      this.on('click button', this._onTabButton.bind(this));
    }
  }, {
    key: '_render',
    value: function _render(options) {
      var items = options.items,
          initName = options.initName;

      var tabButtons = [];
      for (var i = 0, len = items.length; i < len; i += 1) {
        tabButtons.push('<button type="button" data-index="' + i + '">' + items[i] + '</button>');
      }
      this.$el.html(tabButtons.join(''));
      this.activate(initName);
    }

    /**
     * Activate Section & Button
     * @param {string} name button name to activate
     */

  }, {
    key: 'activate',
    value: function activate(name) {
      var $button = this.$el.find('button:contains("' + name + '")');
      this._activateTabByButton($button);
    }
  }, {
    key: '_onTabButton',
    value: function _onTabButton(ev) {
      var $button = (0, _jquery2.default)(ev.target);
      this._activateTabByButton($button);
      this.trigger('itemClick', $button.text());
    }
  }, {
    key: '_activateTabByButton',
    value: function _activateTabByButton($button) {
      if (this._isActivatedButton($button)) {
        return;
      }

      this._updateClassByButton($button);
    }
  }, {
    key: '_updateClassByButton',
    value: function _updateClassByButton($activeButton) {
      // deactivate previously activated button
      if (this._$activeButton) {
        var sectionIndex = this._$activeButton.attr('data-index');
        this._$activeButton.removeClass(CLASS_TAB_ACTIVE);
        if (this.sections) {
          this.sections[sectionIndex].removeClass(CLASS_TAB_ACTIVE);
        }
      }

      // activate new button
      $activeButton.addClass(CLASS_TAB_ACTIVE);
      this._$activeButton = $activeButton;
      var index = $activeButton.attr('data-index');
      if (this.sections) {
        this.sections[index].addClass(CLASS_TAB_ACTIVE);
      }
    }
  }, {
    key: '_isActivatedButton',
    value: function _isActivatedButton($button) {
      return this._$activeButton && this._$activeButton.text() === $button.text();
    }
  }]);

  return Tab;
}(_uicontroller2.default);

exports.default = Tab;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Editor = __webpack_require__(46);

// for jquery
/**
 * @fileoverview entry point for editor
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
_jquery2.default.fn.tuiEditor = function () {
  var options = void 0,
      instance = void 0;

  var el = this.get(0);

  if (el) {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    options = args[0] || {};

    instance = _jquery2.default.data(el, 'tuiEditor');

    if (instance) {
      if (typeof options === 'string') {
        var _instance;

        return (_instance = instance)[options].apply(_instance, args.slice(1));
      }
    } else {
      options.el = el;
      instance = Editor.factory(options);
      _jquery2.default.data(el, 'tuiEditor', instance);
    }
  }

  return this;
};

module.exports = Editor;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements Editor
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


// markdown commands


// wysiwyg Commands


// langs


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _button = __webpack_require__(19);

var _button2 = _interopRequireDefault(_button);

var _markdownEditor = __webpack_require__(47);

var _markdownEditor2 = _interopRequireDefault(_markdownEditor);

var _mdPreview = __webpack_require__(12);

var _mdPreview2 = _interopRequireDefault(_mdPreview);

var _wysiwygEditor = __webpack_require__(57);

var _wysiwygEditor2 = _interopRequireDefault(_wysiwygEditor);

var _layout = __webpack_require__(71);

var _layout2 = _interopRequireDefault(_layout);

var _eventManager = __webpack_require__(15);

var _eventManager2 = _interopRequireDefault(_eventManager);

var _commandManager2 = __webpack_require__(2);

var _commandManager3 = _interopRequireDefault(_commandManager2);

var _extManager = __webpack_require__(16);

var _extManager2 = _interopRequireDefault(_extManager);

var _importManager = __webpack_require__(10);

var _importManager2 = _interopRequireDefault(_importManager);

var _wwCodeBlockManager = __webpack_require__(40);

var _wwCodeBlockManager2 = _interopRequireDefault(_wwCodeBlockManager);

var _convertor = __webpack_require__(17);

var _convertor2 = _interopRequireDefault(_convertor);

var _viewer = __webpack_require__(33);

var _viewer2 = _interopRequireDefault(_viewer);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _defaultUI = __webpack_require__(72);

var _defaultUI2 = _interopRequireDefault(_defaultUI);

var _domUtils = __webpack_require__(4);

var _domUtils2 = _interopRequireDefault(_domUtils);

var _wwTableManager = __webpack_require__(38);

var _wwTableManager2 = _interopRequireDefault(_wwTableManager);

var _wwTableSelectionManager = __webpack_require__(39);

var _wwTableSelectionManager2 = _interopRequireDefault(_wwTableSelectionManager);

var _codeBlockManager = __webpack_require__(7);

var _codeBlockManager2 = _interopRequireDefault(_codeBlockManager);

var _toMarkRenderer = __webpack_require__(90);

var _toMarkRenderer2 = _interopRequireDefault(_toMarkRenderer);

var _bold = __webpack_require__(91);

var _bold2 = _interopRequireDefault(_bold);

var _italic = __webpack_require__(92);

var _italic2 = _interopRequireDefault(_italic);

var _strike = __webpack_require__(93);

var _strike2 = _interopRequireDefault(_strike);

var _blockquote = __webpack_require__(94);

var _blockquote2 = _interopRequireDefault(_blockquote);

var _heading = __webpack_require__(95);

var _heading2 = _interopRequireDefault(_heading);

var _paragraph = __webpack_require__(96);

var _paragraph2 = _interopRequireDefault(_paragraph);

var _hr = __webpack_require__(97);

var _hr2 = _interopRequireDefault(_hr);

var _addLink = __webpack_require__(98);

var _addLink2 = _interopRequireDefault(_addLink);

var _addImage = __webpack_require__(99);

var _addImage2 = _interopRequireDefault(_addImage);

var _ul = __webpack_require__(100);

var _ul2 = _interopRequireDefault(_ul);

var _ol = __webpack_require__(101);

var _ol2 = _interopRequireDefault(_ol);

var _indent = __webpack_require__(102);

var _indent2 = _interopRequireDefault(_indent);

var _outdent = __webpack_require__(103);

var _outdent2 = _interopRequireDefault(_outdent);

var _table = __webpack_require__(104);

var _table2 = _interopRequireDefault(_table);

var _task = __webpack_require__(105);

var _task2 = _interopRequireDefault(_task);

var _code = __webpack_require__(106);

var _code2 = _interopRequireDefault(_code);

var _codeBlock = __webpack_require__(107);

var _codeBlock2 = _interopRequireDefault(_codeBlock);

var _bold3 = __webpack_require__(108);

var _bold4 = _interopRequireDefault(_bold3);

var _italic3 = __webpack_require__(109);

var _italic4 = _interopRequireDefault(_italic3);

var _strike3 = __webpack_require__(110);

var _strike4 = _interopRequireDefault(_strike3);

var _blockquote3 = __webpack_require__(111);

var _blockquote4 = _interopRequireDefault(_blockquote3);

var _addImage3 = __webpack_require__(112);

var _addImage4 = _interopRequireDefault(_addImage3);

var _addLink3 = __webpack_require__(113);

var _addLink4 = _interopRequireDefault(_addLink3);

var _hr3 = __webpack_require__(114);

var _hr4 = _interopRequireDefault(_hr3);

var _heading3 = __webpack_require__(115);

var _heading4 = _interopRequireDefault(_heading3);

var _paragraph3 = __webpack_require__(116);

var _paragraph4 = _interopRequireDefault(_paragraph3);

var _ul3 = __webpack_require__(117);

var _ul4 = _interopRequireDefault(_ul3);

var _ol3 = __webpack_require__(118);

var _ol4 = _interopRequireDefault(_ol3);

var _table3 = __webpack_require__(119);

var _table4 = _interopRequireDefault(_table3);

var _tableAddRow = __webpack_require__(120);

var _tableAddRow2 = _interopRequireDefault(_tableAddRow);

var _tableAddCol = __webpack_require__(121);

var _tableAddCol2 = _interopRequireDefault(_tableAddCol);

var _tableRemoveRow = __webpack_require__(122);

var _tableRemoveRow2 = _interopRequireDefault(_tableRemoveRow);

var _tableRemoveCol = __webpack_require__(123);

var _tableRemoveCol2 = _interopRequireDefault(_tableRemoveCol);

var _tableAlignCol = __webpack_require__(124);

var _tableAlignCol2 = _interopRequireDefault(_tableAlignCol);

var _tableRemove = __webpack_require__(125);

var _tableRemove2 = _interopRequireDefault(_tableRemove);

var _indent3 = __webpack_require__(126);

var _indent4 = _interopRequireDefault(_indent3);

var _outdent3 = __webpack_require__(127);

var _outdent4 = _interopRequireDefault(_outdent3);

var _task3 = __webpack_require__(128);

var _task4 = _interopRequireDefault(_task3);

var _code3 = __webpack_require__(129);

var _code4 = _interopRequireDefault(_code3);

var _codeBlock3 = __webpack_require__(130);

var _codeBlock4 = _interopRequireDefault(_codeBlock3);

__webpack_require__(131);

__webpack_require__(132);

__webpack_require__(133);

__webpack_require__(134);

__webpack_require__(135);

__webpack_require__(136);

__webpack_require__(137);

__webpack_require__(138);

__webpack_require__(139);

__webpack_require__(140);

__webpack_require__(141);

__webpack_require__(142);

__webpack_require__(143);

__webpack_require__(144);

__webpack_require__(145);

__webpack_require__(146);

__webpack_require__(147);

__webpack_require__(148);

__webpack_require__(149);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __nedInstance = [];
var gaTrackingId = 'UA-129966929-1';

var availableLinkAttributes = ['rel', 'target', 'contenteditable', 'hreflang', 'type'];

/**
 * @callback addImageBlobHook
 * @param {File|Blob} fileOrBlob - image blob
 * @param {callback} callback - callback function to be called after
 * @param {string} source - source of an event the item belongs to. 'paste', 'drop', 'ui'
 */

/**
 * ToastUI Editor
 * @param {object} options Option object
 *     @param {HTMLElement} options.el - container element
 *     @param {string} [options.height='300px'] - Editor's height style value. Height is applied as border-box ex) '300px', '100%', 'auto'
 *     @param {string} [options.minHeight='200px'] - Editor's min-height style value in pixel ex) '300px'
 *     @param {string} [options.initialValue] - Editor's initial value
 *     @param {string} [options.previewStyle] - Markdown editor's preview style (tab, vertical)
 *     @param {string} [options.initialEditType] - Initial editor type (markdown, wysiwyg)
 *     @param {object[]} [options.events] - eventlist Event list
 *         @param {function} options.events.load - It would be emitted when editor fully load
 *         @param {function} options.events.change - It would be emitted when content changed
 *         @param {function} options.events.stateChange - It would be emitted when format change by cursor position
 *         @param {function} options.events.focus - It would be emitted when editor get focus
 *         @param {function} options.events.blur - It would be emitted when editor loose focus
 *     @param {object[]} [options.hooks] - Hook list
 *         @param {function} options.hooks.previewBeforeHook - Submit preview to hook URL before preview be shown
 *         @param {addImageBlobHook} options.hooks.addImageBlobHook - hook for image upload.
 *     @param {string} [options.language='en_US'] - language
 *     @param {boolean} [options.useCommandShortcut=true] - whether use keyboard shortcuts to perform commands
 *     @param {boolean} [options.useDefaultHTMLSanitizer=true] - use default htmlSanitizer
 *     @param {string[]} [options.codeBlockLanguages] - supported code block languages to be listed. default is what highlight.js supports
 *     @param {boolean} [options.usageStatistics=true] - send hostname to google analytics
 *     @param {string[]} [options.toolbarItems] - toolbar items.
 *     @param {boolean} [options.hideModeSwitch=false] - hide mode switch tab bar
 *     @param {string[]} [options.exts] - extensions
 *     @param {object} [options.customConvertor] - convertor extention
 *     @param {string} [options.placeholder] - The placeholder text of the editable element.
 *     @param {string} [options.previewDelayTime] - the delay time for rendering preview
 *     @param {object} [options.linkAttribute] - Attributes of anchor element that shold be rel, target, contenteditable, hreflang, type
 */

var ToastUIEditor = function () {
  function ToastUIEditor(options) {
    var _this = this;

    _classCallCheck(this, ToastUIEditor);

    this.initialHtml = options.el.innerHTML;
    options.el.innerHTML = '';

    this.options = _jquery2.default.extend({
      previewStyle: 'tab',
      initialEditType: 'markdown',
      height: '300px',
      minHeight: '200px',
      language: 'en_US',
      useDefaultHTMLSanitizer: true,
      useCommandShortcut: true,
      codeBlockLanguages: _codeBlockManager.CodeBlockManager.getHighlightJSLanguages(),
      usageStatistics: true,
      toolbarItems: ['heading', 'bold', 'italic', 'strike', 'divider', 'hr', 'quote', 'divider', 'ul', 'ol', 'task', 'indent', 'outdent', 'divider', 'table', 'image', 'link', 'divider', 'code', 'codeblock'],
      hideModeSwitch: false,
      customConvertor: null
    }, options);

    this.eventManager = new _eventManager2.default();

    this.importManager = new _importManager2.default(this.eventManager);

    this.commandManager = new _commandManager3.default(this, {
      useCommandShortcut: this.options.useCommandShortcut
    });

    if (this.options.customConvertor) {
      // eslint-disable-next-line new-cap
      this.convertor = new this.options.customConvertor(this.eventManager);
    } else {
      this.convertor = new _convertor2.default(this.eventManager);
    }

    if (this.options.useDefaultHTMLSanitizer) {
      this.convertor.initHtmlSanitizer();
    }

    if (this.options.hooks) {
      _tuiCodeSnippet2.default.forEach(this.options.hooks, function (fn, key) {
        return _this.addHook(key, fn);
      });
    }

    if (this.options.events) {
      _tuiCodeSnippet2.default.forEach(this.options.events, function (fn, key) {
        return _this.on(key, fn);
      });
    }

    this.layout = new _layout2.default(options, this.eventManager);

    this.i18n = _i18n2.default;
    this.i18n.setCode(this.options.language);

    this.setUI(this.options.UI || new _defaultUI2.default(this));

    this.mdEditor = _markdownEditor2.default.factory(this.layout.getMdEditorContainerEl(), this.eventManager, this.options);
    this.preview = new _mdPreview2.default(this.layout.getPreviewEl(), this.eventManager, this.convertor, false, this.options.previewDelayTime);
    this.wwEditor = _wysiwygEditor2.default.factory(this.layout.getWwEditorContainerEl(), this.eventManager, {
      useDefaultHTMLSanitizer: this.options.useDefaultHTMLSanitizer
    });
    this.toMarkOptions = {
      gfm: true,
      renderer: _toMarkRenderer2.default
    };

    if (this.options.linkAttribute) {
      var attribute = this._sanitizeLinkAttribute(this.options.linkAttribute);

      this.convertor.setLinkAttribute(attribute);
      this.wwEditor.setLinkAttribute(attribute);
    }

    this.changePreviewStyle(this.options.previewStyle);

    this.changeMode(this.options.initialEditType, true);

    this.minHeight(this.options.minHeight);

    this.height(this.options.height);

    this.setValue(this.options.initialValue, false);

    if (this.options.placeholder) {
      this.setPlaceholder(this.options.placeholder);
    }

    if (!this.options.initialValue) {
      this.setHtml(this.initialHtml, false);
    }

    _extManager2.default.applyExtension(this, this.options.exts);

    this.eventManager.emit('load', this);

    __nedInstance.push(this);

    this._addDefaultCommands();

    if (this.options.usageStatistics) {
      _tuiCodeSnippet2.default.sendHostname('editor', gaTrackingId);
    }
  }

  /**
   * sanitize attribute for link
   * @param {object} attribute - attribute for link
   * @returns {object} sanitized attribute
   * @private
   */


  _createClass(ToastUIEditor, [{
    key: '_sanitizeLinkAttribute',
    value: function _sanitizeLinkAttribute(attribute) {
      var linkAttribute = {};

      availableLinkAttributes.forEach(function (key) {
        if (!_tuiCodeSnippet2.default.isUndefined(attribute[key])) {
          linkAttribute[key] = attribute[key];
        }
      });

      return linkAttribute;
    }

    /**
     * change preview style
     * @param {string} style - 'tab'|'vertical'
     */

  }, {
    key: 'changePreviewStyle',
    value: function changePreviewStyle(style) {
      this.layout.changePreviewStyle(style);
      this.mdPreviewStyle = style;
      this.eventManager.emit('changePreviewStyle', style);
      this.eventManager.emit('previewNeedsRefresh');
    }

    /**
     * call commandManager's exec method
     * @param {*} ...args Command argument
     */

  }, {
    key: 'exec',
    value: function exec() {
      var _commandManager;

      (_commandManager = this.commandManager).exec.apply(_commandManager, arguments);
    }

    /**
     * add default commands
     * @private
     */

  }, {
    key: '_addDefaultCommands',
    value: function _addDefaultCommands() {
      this.addCommand(_bold2.default);
      this.addCommand(_italic2.default);
      this.addCommand(_blockquote2.default);
      this.addCommand(_heading2.default);
      this.addCommand(_paragraph2.default);
      this.addCommand(_hr2.default);
      this.addCommand(_addLink2.default);
      this.addCommand(_addImage2.default);
      this.addCommand(_ul2.default);
      this.addCommand(_ol2.default);
      this.addCommand(_indent2.default);
      this.addCommand(_outdent2.default);
      this.addCommand(_table2.default);
      this.addCommand(_task2.default);
      this.addCommand(_code2.default);
      this.addCommand(_codeBlock2.default);
      this.addCommand(_strike2.default);

      this.addCommand(_bold4.default);
      this.addCommand(_italic4.default);
      this.addCommand(_blockquote4.default);
      this.addCommand(_ul4.default);
      this.addCommand(_ol4.default);
      this.addCommand(_addImage4.default);
      this.addCommand(_addLink4.default);
      this.addCommand(_hr4.default);
      this.addCommand(_heading4.default);
      this.addCommand(_paragraph4.default);
      this.addCommand(_indent4.default);
      this.addCommand(_outdent4.default);
      this.addCommand(_task4.default);
      this.addCommand(_table4.default);
      this.addCommand(_tableAddRow2.default);
      this.addCommand(_tableAddCol2.default);
      this.addCommand(_tableRemoveRow2.default);
      this.addCommand(_tableRemoveCol2.default);
      this.addCommand(_tableAlignCol2.default);
      this.addCommand(_tableRemove2.default);
      this.addCommand(_code4.default);
      this.addCommand(_codeBlock4.default);
      this.addCommand(_strike4.default);
    }
  }, {
    key: 'addCommand',
    value: function addCommand(type, props) {
      if (!props) {
        this.commandManager.addCommand(type);
      } else {
        this.commandManager.addCommand(_commandManager3.default.command(type, props));
      }
    }

    /**
     * After added command.
     */

  }, {
    key: 'afterAddedCommand',
    value: function afterAddedCommand() {
      this.eventManager.emit('afterAddedCommand', this);
    }

    /**
     * Bind eventHandler to event type
     * @param {string} type Event type
     * @param {function} handler Event handler
     */

  }, {
    key: 'on',
    value: function on(type, handler) {
      this.eventManager.listen(type, handler);
    }

    /**
     * Unbind eventHandler from event type
     * @param {string} type Event type
     */

  }, {
    key: 'off',
    value: function off(type) {
      this.eventManager.removeEventHandler(type);
    }

    /**
     * Add hook to TUIEditor event
     * @param {string} type Event type
     * @param {function} handler Event handler
     */

  }, {
    key: 'addHook',
    value: function addHook(type, handler) {
      this.eventManager.removeEventHandler(type);
      this.eventManager.listen(type, handler);
    }

    /**
     * Remove hook from TUIEditor event
     * @param {string} type Event type
     */

  }, {
    key: 'removeHook',
    value: function removeHook(type) {
      this.eventManager.removeEventHandler(type);
    }

    /**
     * Get CodeMirror instance
     * @returns {CodeMirror}
     */

  }, {
    key: 'getCodeMirror',
    value: function getCodeMirror() {
      return this.mdEditor.getEditor();
    }

    /**
     * Get SquireExt instance
     * @returns {SquireExt}
     */

  }, {
    key: 'getSquire',
    value: function getSquire() {
      return this.wwEditor.getEditor();
    }

    /**
     * Set focus to current Editor
     */

  }, {
    key: 'focus',
    value: function focus() {
      this.getCurrentModeEditor().focus();
    }

    /**
     * Remove focus of current Editor
     */

  }, {
    key: 'blur',
    value: function blur() {
      this.getCurrentModeEditor().blur();
    }

    /**
     * Set cursor position to end
     */

  }, {
    key: 'moveCursorToEnd',
    value: function moveCursorToEnd() {
      this.getCurrentModeEditor().moveCursorToEnd();
    }

    /**
     * Set cursor position to start
     */

  }, {
    key: 'moveCursorToStart',
    value: function moveCursorToStart() {
      this.getCurrentModeEditor().moveCursorToStart();
    }

    /**
     * Set markdown syntax text.
     * @param {string} markdown - markdown syntax text.
     * @param {boolean} [cursorToEnd=true] - move cursor to contents end
     */

  }, {
    key: 'setMarkdown',
    value: function setMarkdown(markdown) {
      var cursorToEnd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      markdown = markdown || '';

      if (this.isMarkdownMode()) {
        this.mdEditor.setValue(markdown, cursorToEnd);
      } else {
        this.wwEditor.setValue(this.convertor.toHTML(markdown), cursorToEnd);
      }

      this.eventManager.emit('setMarkdownAfter', markdown);
    }

    /**
     * Set html value.
     * @param {string} html - html syntax text
     * @param {boolean} [cursorToEnd=true] - move cursor to contents end
     */

  }, {
    key: 'setHtml',
    value: function setHtml(html) {
      var cursorToEnd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      html = html || '';
      this.wwEditor.setValue(html, cursorToEnd);

      if (this.isMarkdownMode()) {
        var markdown = this.convertor.toMarkdown(this.wwEditor.getValue(), this.toMarkOptions);
        this.mdEditor.setValue(markdown, cursorToEnd);
        this.eventManager.emit('setMarkdownAfter', markdown);
      }
    }

    /**
     * Set markdown syntax text.
     * @param {string} value - markdown syntax text
     * @param {boolean} [cursorToEnd=true] - move cursor to contents end
     * @deprecated
     */

  }, {
    key: 'setValue',
    value: function setValue(value) {
      var cursorToEnd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      this.setMarkdown(value, cursorToEnd);
    }

    /**
     * Get markdown syntax text.
     * @returns {string}
     */

  }, {
    key: 'getMarkdown',
    value: function getMarkdown() {
      var markdown = void 0;

      if (this.isMarkdownMode()) {
        markdown = this.mdEditor.getValue();
      } else {
        markdown = this.convertor.toMarkdown(this.wwEditor.getValue(), this.toMarkOptions);
      }

      return markdown;
    }

    /**
     * Get html syntax text.
     * @returns {string}
     */

  }, {
    key: 'getHtml',
    value: function getHtml() {
      if (this.isWysiwygMode()) {
        this.mdEditor.setValue(this.convertor.toMarkdown(this.wwEditor.getValue(), this.toMarkOptions));
      }

      return this.convertor.toHTML(this.mdEditor.getValue());
    }

    /**
     * Get editor value.
     * @returns {string}
     * @deprecated
     */

  }, {
    key: 'getValue',
    value: function getValue() {
      return this.getMarkdown();
    }

    /**
     * Insert text
     * @param {string} text - text string to insert
     */

  }, {
    key: 'insertText',
    value: function insertText(text) {
      if (this.isMarkdownMode()) {
        this.mdEditor.replaceSelection(text);
      } else {
        this.wwEditor.insertText(text);
      }
    }

    /**
     * Add widget to selection
     * @param {Range} selection Current selection
     * @param {Node} node widget node
     * @param {string} style Adding style "over" or "bottom"
     * @param {number} [offset] Offset for adjust position
     */

  }, {
    key: 'addWidget',
    value: function addWidget(selection, node, style, offset) {
      this.getCurrentModeEditor().addWidget(selection, node, style, offset);
    }

    /**
     * Set and return edithr height
     * @param {string} height - editor height
     * @returns {string} editor height
     */

  }, {
    key: 'height',
    value: function height(_height) {
      if (_tuiCodeSnippet2.default.isExisty(_height)) {
        if (_height === 'auto') {
          (0, _jquery2.default)(this.options.el).addClass('auto-height');
          this.minHeight(this.minHeight());
        } else {
          (0, _jquery2.default)(this.options.el).removeClass('auto-height');
          this.minHeight(_height);
        }
        if (_tuiCodeSnippet2.default.isNumber(_height)) {
          _height = _height + 'px';
        }

        this.options.el.style.height = _height;
        this._height = _height;
      }

      return this._height;
    }

    /**
     * Set / Get min content height
     * @param {string} minHeight - min content height in pixel
     * @returns {string} - min height in pixel
     */

  }, {
    key: 'minHeight',
    value: function minHeight(_minHeight) {
      if (_tuiCodeSnippet2.default.isExisty(_minHeight)) {
        var editorHeight = this._ui.getEditorHeight();
        var editorSectionHeight = this._ui.getEditorSectionHeight();
        var diffHeight = editorHeight - editorSectionHeight;
        this._minHeight = _minHeight;

        _minHeight = parseInt(_minHeight, 10);
        _minHeight = Math.max(_minHeight - diffHeight, 0);

        this.wwEditor.setMinHeight(_minHeight);
        this.mdEditor.setMinHeight(_minHeight);
        this.preview.setMinHeight(_minHeight);
      }

      return this._minHeight;
    }

    /**
     * Get current editor mode name
     * @returns {Object} MarkdownEditor or WysiwygEditor
     */

  }, {
    key: 'getCurrentModeEditor',
    value: function getCurrentModeEditor() {
      var editor = void 0;

      if (this.isMarkdownMode()) {
        editor = this.mdEditor;
      } else {
        editor = this.wwEditor;
      }

      return editor;
    }

    /**
     * Return true if current editor mode is Markdown
     * @returns {boolean}
     */

  }, {
    key: 'isMarkdownMode',
    value: function isMarkdownMode() {
      return this.currentMode === 'markdown';
    }

    /**
     * Return true if current editor mode is WYSIWYG
     * @returns {boolean}
     */

  }, {
    key: 'isWysiwygMode',
    value: function isWysiwygMode() {
      return this.currentMode === 'wysiwyg';
    }

    /**
     * Return false
     * @returns {boolean}
     */

  }, {
    key: 'isViewer',
    value: function isViewer() {
      return false;
    }

    /**
     * Get current Markdown editor's preview style
     * @returns {string}
     */

  }, {
    key: 'getCurrentPreviewStyle',
    value: function getCurrentPreviewStyle() {
      return this.mdPreviewStyle;
    }

    /**
     * Change editor's mode to given mode string
     * @param {string} mode - Editor mode name of want to change
     * @param {boolean} [isWithoutFocus] - Change mode without focus
     */

  }, {
    key: 'changeMode',
    value: function changeMode(mode, isWithoutFocus) {
      if (this.currentMode === mode) {
        return;
      }

      this.eventManager.emit('changeModeBefore', this.currentMode);

      this.currentMode = mode;

      if (this.isWysiwygMode()) {
        this.layout.switchToWYSIWYG();
        this.wwEditor.setValue(this.convertor.toHTML(this.mdEditor.getValue()), !isWithoutFocus);
        this.eventManager.emit('changeModeToWysiwyg');
      } else {
        this.layout.switchToMarkdown();
        this.mdEditor.resetState();
        this.mdEditor.setValue(this.convertor.toMarkdown(this.wwEditor.getValue(), this.toMarkOptions), !isWithoutFocus);
        this.getCodeMirror().refresh();
        this.eventManager.emit('changeModeToMarkdown');
      }

      this.eventManager.emit('changeMode', mode);

      if (!isWithoutFocus) {
        this.focus();
      }
    }

    /**
     * Remove TUIEditor from document
     */

  }, {
    key: 'remove',
    value: function remove() {
      var self = this;
      var i = __nedInstance.length - 1;
      this.wwEditor.remove();
      this.mdEditor.remove();
      this.layout.remove();
      this.preview.remove();

      if (this.getUI()) {
        this.getUI().remove();
      }

      this.eventManager.emit('removeEditor');
      this.eventManager.events.forEach(function (value, key) {
        self.off(key);
      });
      this.eventManager = null;

      for (; i >= 0; i -= 1) {
        if (__nedInstance[i] === this) {
          __nedInstance.splice(i, 1);
        }
      }
    }

    /**
     * Hide TUIEditor
     */

  }, {
    key: 'hide',
    value: function hide() {
      this.eventManager.emit('hide', this);
    }

    /**
     * Show TUIEditor
     */

  }, {
    key: 'show',
    value: function show() {
      this.eventManager.emit('show', this);
      this.getCodeMirror().refresh();
    }

    /**
     * Scroll Editor content to Top
     * @param {number} value Scroll amount
     * @returns {number}
     */

  }, {
    key: 'scrollTop',
    value: function scrollTop(value) {
      return this.getCurrentModeEditor().scrollTop(value);
    }

    /**
     * Set UI to private UI property
     * @param {UI} UI UI instance
     */

  }, {
    key: 'setUI',
    value: function setUI(UI) {
      this._ui = UI;
    }

    /**
     * Get _ui property
     * @returns {DefaultUI|UI}
     */

  }, {
    key: 'getUI',
    value: function getUI() {
      return this._ui;
    }

    /**
     * Reset TUIEditor
     */

  }, {
    key: 'reset',
    value: function reset() {
      this.wwEditor.reset();
      this.mdEditor.reset();
    }

    /**
     * Get current range
     * @returns {{start, end}|Range}
     */

  }, {
    key: 'getRange',
    value: function getRange() {
      return this.getCurrentModeEditor().getRange();
    }

    /**
     * Get text object of current range
     * @param {{start, end}|Range} range Range object of each editor
     * @returns {MdTextObject|WwTextObject} TextObject class
     */

  }, {
    key: 'getTextObject',
    value: function getTextObject(range) {
      return this.getCurrentModeEditor().getTextObject(range);
    }

    /**
     * get selected text
     * @returns {string} - selected text
     */

  }, {
    key: 'getSelectedText',
    value: function getSelectedText() {
      var range = this.getRange();
      var textObject = this.getTextObject(range);

      return textObject.getTextContent() || '';
    }

    /**
     * Set the placeholder on all editors
     * @param {string} placeholder - placeholder to set
     */

  }, {
    key: 'setPlaceholder',
    value: function setPlaceholder(placeholder) {
      this.mdEditor.setPlaceholder(placeholder);
      this.wwEditor.setPlaceholder(placeholder);
    }

    /**
     * Get instance of TUIEditor
     * @returns {Array}
     */

  }], [{
    key: 'getInstances',
    value: function getInstances() {
      return __nedInstance;
    }

    /**
     * Define extension
     * @param {string} name Extension name
     * @param {function} ext extension
     */

  }, {
    key: 'defineExtension',
    value: function defineExtension(name, ext) {
      _extManager2.default.defineExtension(name, ext);
    }

    /**
     * Factory method for Editor
     * @param {object} options Option for initialize TUIEditor
     * @returns {object} ToastUIEditor or ToastUIEditorViewer
     */

  }, {
    key: 'factory',
    value: function factory(options) {
      var tuiEditor = void 0;

      if (options.viewer) {
        tuiEditor = new _viewer2.default(options);
      } else {
        tuiEditor = new ToastUIEditor(options);
      }

      return tuiEditor;
    }
  }]);

  return ToastUIEditor;
}();

/**
 * check whther is viewer
 * @type {boolean}
 */


ToastUIEditor.isViewer = false;

/**
 * I18n instance
 * @type {I18n}
 */
ToastUIEditor.i18n = _i18n2.default;

/**
 * domUtil instance
 * @type {DomUtil}
 * @ignore
 */
ToastUIEditor.domUtils = _domUtils2.default;

/**
 * CodeBlockManager instance
 * @type {CodeBlockManager}
 */
ToastUIEditor.codeBlockManager = _codeBlockManager2.default;

/**
 * Button class
 * @type {Class.<Button>}
 * @deprecated
 */
ToastUIEditor.Button = _button2.default;

/**
 * WwCodeBlockManager class
 * @type {Class.<WwCodeBlockManager>}
 * @ignore
 */
ToastUIEditor.WwCodeBlockManager = _wwCodeBlockManager2.default;

/**
 * WwTableManager class
 * @type {Class.<WwTableManager>}
 * @ignore
 */
ToastUIEditor.WwTableManager = _wwTableManager2.default;

/**
 * WwTableManager class
 * @type {Class.<WwTableSelectionManager>}
 * @ignore
 */
ToastUIEditor.WwTableSelectionManager = _wwTableSelectionManager2.default;

/**
 * CommandManager class
 * @type {Class.<CommandManager>}
 * @ignore
 */
ToastUIEditor.CommandManager = _commandManager3.default;

/**
 * MarkdownIt hightlight instance
 * @type {MarkdownIt}
 */
ToastUIEditor.markdownitHighlight = _convertor2.default.getMarkdownitHighlightRenderer();

/**
 * MarkdownIt instance
 * @type {MarkdownIt}
 */
ToastUIEditor.markdownit = _convertor2.default.getMarkdownitRenderer();

module.exports = ToastUIEditor;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _codeMirrorExt = __webpack_require__(36);

var _codeMirrorExt2 = _interopRequireDefault(_codeMirrorExt);

var _keyMapper = __webpack_require__(20);

var _keyMapper2 = _interopRequireDefault(_keyMapper);

var _mdListManager = __webpack_require__(55);

var _mdListManager2 = _interopRequireDefault(_mdListManager);

var _componentManager = __webpack_require__(37);

var _componentManager2 = _interopRequireDefault(_componentManager);

var _mdTextObject = __webpack_require__(56);

var _mdTextObject2 = _interopRequireDefault(_mdTextObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements markdown editor
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var keyMapper = _keyMapper2.default.getSharedInstance();

/**
 * Class MarkdownEditor
 * @param {jQuery} $el - container jquery element
 * @param {EventManager} eventManager - event manager
 * @param {Object} options - options of editor
 */

var MarkdownEditor = function (_CodeMirrorExt) {
  _inherits(MarkdownEditor, _CodeMirrorExt);

  function MarkdownEditor($el, eventManager, options) {
    _classCallCheck(this, MarkdownEditor);

    var _this = _possibleConstructorReturn(this, (MarkdownEditor.__proto__ || Object.getPrototypeOf(MarkdownEditor)).call(this, $el.get(0), {
      mode: 'gfm',
      dragDrop: true,
      allowDropFileTypes: ['image'],
      extraKeys: {
        'Enter': 'newlineAndIndentContinueMarkdownList',
        'Tab': 'indentOrderedList',
        'Shift-Tab': 'indentLessOrderedList'
      },
      viewportMargin: options && options.height === 'auto' ? Infinity : 10
    }));

    _this.eventManager = eventManager;
    _this.componentManager = new _componentManager2.default(_this);
    _this.componentManager.addManager(_mdListManager2.default);

    /**
     * latest state info
     * @type {object}
     * @private
     */
    _this._latestState = null;

    _this._initEvent();
    return _this;
  }

  /**
   * _initEvent
   * Initialize EventManager event handler
   * @private
   */


  _createClass(MarkdownEditor, [{
    key: '_initEvent',
    value: function _initEvent() {
      var _this2 = this;

      this.cm.getWrapperElement().addEventListener('click', function () {
        _this2.eventManager.emit('click', {
          source: 'markdown'
        });
      });

      this.cm.on('beforeChange', function (cm, ev) {
        if (ev.origin === 'paste') {
          _this2.eventManager.emit('pasteBefore', {
            source: 'markdown',
            data: ev
          });
        }
      });

      this.cm.on('change', function (cm, cmEvent) {
        _this2._emitMarkdownEditorContentChangedEvent();
        _this2._emitMarkdownEditorChangeEvent(cmEvent);
      });

      this.cm.on('focus', function () {
        _this2.eventManager.emit('focus', {
          source: 'markdown'
        });
      });

      this.cm.on('blur', function () {
        _this2.eventManager.emit('blur', {
          source: 'markdown'
        });
      });

      this.cm.on('scroll', function (cm, eventData) {
        _this2.eventManager.emit('scroll', {
          source: 'markdown',
          data: eventData
        });
      });

      this.cm.on('keydown', function (cm, keyboardEvent) {
        _this2.eventManager.emit('keydown', {
          source: 'markdown',
          data: keyboardEvent
        });

        _this2.eventManager.emit('keyMap', {
          source: 'markdown',
          keyMap: keyMapper.convert(keyboardEvent),
          data: keyboardEvent
        });
      });

      this.cm.on('keyup', function (cm, keyboardEvent) {
        _this2.eventManager.emit('keyup', {
          source: 'markdown',
          data: keyboardEvent
        });
      });

      this.cm.on('copy', function (cm, ev) {
        _this2.eventManager.emit('copy', {
          source: 'markdown',
          data: ev
        });
      });

      this.cm.on('cut', function (cm, ev) {
        _this2.eventManager.emit('cut', {
          source: 'markdown',
          data: ev
        });
      });

      this.cm.on('paste', function (cm, clipboardEvent) {
        _this2.eventManager.emit('paste', {
          source: 'markdown',
          data: clipboardEvent
        });
      });

      this.cm.on('drop', function (cm, eventData) {
        eventData.preventDefault();

        _this2.eventManager.emit('drop', {
          source: 'markdown',
          data: eventData
        });
      });

      this.cm.on('cursorActivity', function () {
        var token = _this2.cm.getTokenAt(_this2.cm.getCursor());
        var base = token.state.base;

        var state = {
          bold: !!base.strong,
          italic: !!base.em,
          strike: !!base.strikethrough,
          code: base.code > 0,
          codeBlock: base.code === -1,
          quote: !!base.quote,
          list: !!base.list,
          task: !!base.taskList,
          source: 'markdown'
        };

        if (!_this2._latestState || _this2._isStateChanged(_this2._latestState, state)) {
          _this2.eventManager.emit('stateChange', state);
          _this2._latestState = state;
        }
      });
    }

    /**
     * Set Editor value
     * @param {string} markdown - Markdown syntax text
     * @param {boolean} [cursorToEnd=true] - move cursor to contents end
     * @override
     */

  }, {
    key: 'setValue',
    value: function setValue(markdown, cursorToEnd) {
      _get(MarkdownEditor.prototype.__proto__ || Object.getPrototypeOf(MarkdownEditor.prototype), 'setValue', this).call(this, markdown, cursorToEnd);
      this._emitMarkdownEditorContentChangedEvent();
    }

    /**
     * Get text object of current range
     * @param {{start, end}} range Range object of each editor
     * @returns {MdTextObject}
     */

  }, {
    key: 'getTextObject',
    value: function getTextObject(range) {
      return new _mdTextObject2.default(this, range);
    }

    /**
     * Emit contentChangedFromMarkdown event
     * @private
     */

  }, {
    key: '_emitMarkdownEditorContentChangedEvent',
    value: function _emitMarkdownEditorContentChangedEvent() {
      this.eventManager.emit('contentChangedFromMarkdown', this);
    }

    /**
     * Emit changeEvent
     * @param {event} e - Event object
     * @private
     */

  }, {
    key: '_emitMarkdownEditorChangeEvent',
    value: function _emitMarkdownEditorChangeEvent(e) {
      if (e.origin !== 'setValue') {
        var eventObj = {
          source: 'markdown'
        };

        this.eventManager.emit('changeFromMarkdown', eventObj);
        this.eventManager.emit('change', eventObj);
      }
    }

    /**
     * Return whether state changed or not
     * @param {object} previousState - Previous state
     * @param {object} currentState - Current state
     * @returns {boolean} - changed state
     * @private
     */

  }, {
    key: '_isStateChanged',
    value: function _isStateChanged(previousState, currentState) {
      var result = false;

      _tuiCodeSnippet2.default.forEach(currentState, function (currentStateTypeValue, stateType) {
        result = previousState[stateType] !== currentStateTypeValue;

        return !result;
      });

      return result;
    }

    /**
     * latestState reset
     */

  }, {
    key: 'resetState',
    value: function resetState() {
      this._latestState = null;
    }

    /**
     * MarkdownEditor factory method
     * @param {jQuery} $el - Container element for editor
     * @param {EventManager} eventManager - EventManager instance
     * @param {Object} options - options of editor
     * @returns {MarkdownEditor} - MarkdownEditor
     * @ignore
     */

  }], [{
    key: 'factory',
    value: function factory($el, eventManager, options) {
      var mde = new MarkdownEditor($el, eventManager, options);

      return mde;
    }
  }]);

  return MarkdownEditor;
}(_codeMirrorExt2.default);

exports.default = MarkdownEditor;

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _codemirror = __webpack_require__(6);

var _codemirror2 = _interopRequireDefault(_codemirror);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var listRE = /^(\s*)((\d+)([.)]\s(?:\[(?:x|\s)\]\s)?))(.*)/;

/**
 * simple wrapper for indentLess command
 * to run fixOrderedListNumber on Shift-Tab
 * @param {CodeMirror} cm - CodeMirror instance
 * @returns {CodeMirror.Pass|null} - next command
 * @ignore
 */
/**
* @fileoverview codemirror extension for fix ordered list number
* @author NHN FE Development Lab <dl_javascript@nhn.com>
*/

_codemirror2.default.commands.indentLessOrderedList = function (cm) {
  if (cm.getOption('disableInput')) {
    return _codemirror2.default.Pass;
  }
  cm.execCommand('indentLess');
  cm.execCommand('fixOrderedListNumber');

  return null;
};

/**
 * fix ordered list number
 * @param {CodeMirror} cm - CodeMirror instance
 * @returns {CodeMirror.Pass|null} - next command
 * @ignore
 */
_codemirror2.default.commands.fixOrderedListNumber = function (cm) {
  if (cm.getOption('disableInput')) {
    return _codemirror2.default.Pass;
  }

  var ranges = cm.listSelections();
  for (var i = 0; i < ranges.length; i += 1) {
    var pos = ranges[i].head;
    var lineNumber = findFirstListItem(pos.line, cm);

    if (lineNumber >= 0) {
      var lineText = cm.getLine(lineNumber);

      var _listRE$exec = listRE.exec(lineText),
          indent = _listRE$exec[1],
          index = _listRE$exec[3];

      fixNumber(lineNumber, indent.length, parseInt(index, 10), cm);
    }
  }

  return null;
};

/**
 * fix list numbers
 * @param {number} lineNumber - line number of list item to be normalized
 * @param {number} prevIndentLength - previous indent length
 * @param {number} startIndex - start index
 * @param {CodeMirror} cm - CodeMirror instance
 * @returns {number} - next line number
 * @ignore
 */
function fixNumber(lineNumber, prevIndentLength, startIndex, cm) {
  var indent = void 0,
      delimiter = void 0,
      text = void 0,
      indentLength = void 0;
  var index = startIndex;
  var lineText = cm.getLine(lineNumber);

  do {
    var _listRE$exec2 = listRE.exec(lineText);

    indent = _listRE$exec2[1];
    delimiter = _listRE$exec2[4];
    text = _listRE$exec2[5];

    indentLength = indent.length;

    if (indentLength === prevIndentLength) {
      // fix number
      cm.replaceRange('' + indent + index + delimiter + text, {
        line: lineNumber,
        ch: 0
      }, {
        line: lineNumber,
        ch: lineText.length
      });
      index += 1;
      lineNumber += 1;
    } else if (indentLength > prevIndentLength) {
      // nested list start
      lineNumber = fixNumber(lineNumber, indentLength, 1, cm);
    } else {
      // nested list end
      return lineNumber;
    }

    lineText = cm.getLine(lineNumber);
  } while (listRE.test(lineText));

  return lineNumber;
}

/**
 * find line number of list item which contains given lineNumber
 * @param {number} lineNumber - line number of list item
 * @param {CodeMirror} cm - CodeMirror instance
 * @returns {number} - line number of first list item
 * @ignore
 */
function findFirstListItem(lineNumber, cm) {
  var nextLineNumber = lineNumber;
  var lineText = cm.getLine(lineNumber);

  while (listRE.test(lineText)) {
    nextLineNumber -= 1;
    lineText = cm.getLine(nextLineNumber);
  }

  if (lineNumber === nextLineNumber) {
    nextLineNumber = -1;
  } else {
    nextLineNumber += 1;
  }

  return nextLineNumber;
}

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _codemirror = __webpack_require__(6);

var _codemirror2 = _interopRequireDefault(_codemirror);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*eslint-disable */
_codemirror2.default.overlayMode = function (base, overlay, combine) {
  return {
    startState: function startState() {
      return {
        base: _codemirror2.default.startState(base),
        overlay: _codemirror2.default.startState(overlay),
        basePos: 0, baseCur: null,
        overlayPos: 0, overlayCur: null,
        streamSeen: null
      };
    },
    copyState: function copyState(state) {
      return {
        base: _codemirror2.default.copyState(base, state.base),
        overlay: _codemirror2.default.copyState(overlay, state.overlay),
        basePos: state.basePos, baseCur: null,
        overlayPos: state.overlayPos, overlayCur: null
      };
    },

    token: function token(stream, state) {
      if (stream != state.streamSeen || Math.min(state.basePos, state.overlayPos) < stream.start) {
        state.streamSeen = stream;
        state.basePos = state.overlayPos = stream.start;
      }

      if (stream.start == state.basePos) {
        state.baseCur = base.token(stream, state.base);
        state.basePos = stream.pos;
      }
      if (stream.start == state.overlayPos) {
        stream.pos = stream.start;
        state.overlayCur = overlay.token(stream, state.overlay);
        state.overlayPos = stream.pos;
      }
      stream.pos = Math.min(state.basePos, state.overlayPos);

      // state.overlay.combineTokens always takes precedence over combine,
      // unless set to null
      if (state.overlayCur == null) return state.baseCur;else if (state.baseCur != null && state.overlay.combineTokens || combine && state.overlay.combineTokens == null) return state.baseCur + " " + state.overlayCur;else return state.overlayCur;
    },

    indent: base.indent && function (state, textAfter) {
      return base.indent(state.base, textAfter);
    },
    electricChars: base.electricChars,

    innerMode: function innerMode(state) {
      return { state: state.base, mode: base };
    },

    blankLine: function blankLine(state) {
      if (base.blankLine) base.blankLine(state.base);
      if (overlay.blankLine) overlay.blankLine(state.overlay);
    }
  };
}; // CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// Utility function that allows modes to be combined. The mode given
// as the base argument takes care of most of the normal mode
// functionality, but a second (typically simple) mode is used, which
// can override the style of text. Both modes get to parse all of the
// text, but when both assign a non-null style to a piece of code, the
// overlay wins, unless the combine argument was true and not overridden,
// or state.overlay.combineTokens was true, in which case the styles are
// combined.
/**
 * @modifier NHN FE Development Lab <dl_javascript@nhn.com>
 */

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _codemirror = __webpack_require__(6);

var _codemirror2 = _interopRequireDefault(_codemirror);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*eslint-disable */
_codemirror2.default.defineMode("markdown", function (cmCfg, modeCfg) {

  var htmlMode = _codemirror2.default.getMode(cmCfg, "text/html");
  var htmlModeMissing = htmlMode.name == "null";

  function getMode(name) {
    if (_codemirror2.default.findModeByName) {
      var found = _codemirror2.default.findModeByName(name);
      if (found) name = found.mime || found.mimes[0];
    }
    var mode = _codemirror2.default.getMode(cmCfg, name);
    return mode.name == "null" ? null : mode;
  }

  // Should characters that affect highlighting be highlighted separate?
  // Does not include characters that will be output (such as `1.` and `-` for lists)
  if (modeCfg.highlightFormatting === undefined) modeCfg.highlightFormatting = false;

  // Maximum number of nested blockquotes. Set to 0 for infinite nesting.
  // Excess `>` will emit `error` token.
  if (modeCfg.maxBlockquoteDepth === undefined) modeCfg.maxBlockquoteDepth = 0;

  // Turn on task lists? ("- [ ] " and "- [x] ")
  if (modeCfg.taskLists === undefined) modeCfg.taskLists = false;

  // Turn on strikethrough syntax
  if (modeCfg.strikethrough === undefined) modeCfg.strikethrough = false;

  if (modeCfg.emoji === undefined) modeCfg.emoji = false;

  if (modeCfg.fencedCodeBlockHighlighting === undefined) modeCfg.fencedCodeBlockHighlighting = true;

  if (modeCfg.xml === undefined) modeCfg.xml = true;

  // Allow token types to be overridden by user-provided token types.
  if (modeCfg.tokenTypeOverrides === undefined) modeCfg.tokenTypeOverrides = {};

  var tokenTypes = {
    header: "header",
    code: "comment",
    quote: "quote",
    list1: "variable-2",
    list2: "variable-3",
    list3: "keyword",
    hr: "hr",
    image: "image",
    imageAltText: "image-alt-text",
    imageMarker: "image-marker",
    formatting: "formatting",
    linkInline: "link",
    linkEmail: "link",
    linkText: "link",
    linkHref: "string",
    em: "em",
    strong: "strong",
    strikethrough: "strikethrough",
    emoji: "builtin"
  };

  for (var tokenType in tokenTypes) {
    if (tokenTypes.hasOwnProperty(tokenType) && modeCfg.tokenTypeOverrides[tokenType]) {
      tokenTypes[tokenType] = modeCfg.tokenTypeOverrides[tokenType];
    }
  }

  var hrRE = /^([*\-_])(?:\s*\1){2,}\s*$/,
      listRE = /^(?:[*\-+]|^[0-9]+([.)]))\s+/,
      taskListRE = /^\[(x| )\](?=\s)/i // Must follow listRE
  ,
      atxHeaderRE = modeCfg.allowAtxHeaderWithoutSpace ? /^(#+)/ : /^(#+)(?: |$)/,
      setextHeaderRE = /^ *(?:\={1,}|-{1,})\s*$/,
      textRE = /^[^#!\[\]*_\\<>` "'(~:]+/,
      fencedCodeRE = /^(~~~+|```+)[ \t]*([\w+#-]*)[^\n`]*$/,
      linkDefRE = /^\s*\[[^\]]+?\]:.*$/ // naive link-definition
  ,
      punctuation = /[!\"#$%&\'()*+,\-\.\/:;<=>?@\[\\\]^_`{|}~]/,
      expandedTab = "    "; // CommonMark specifies tab as 4 spaces

  function switchInline(stream, state, f) {
    state.f = state.inline = f;
    return f(stream, state);
  }

  function switchBlock(stream, state, f) {
    state.f = state.block = f;
    return f(stream, state);
  }

  function lineIsEmpty(line) {
    return !line || !/\S/.test(line.string);
  }

  // Blocks

  function blankLine(state) {
    // Reset linkTitle state
    state.linkTitle = false;
    state.linkHref = false;
    state.linkText = false;
    // Reset EM state
    state.em = false;
    // Reset STRONG state
    state.strong = false;
    // Reset strikethrough state
    state.strikethrough = false;
    // Reset state.quote
    state.quote = 0;
    // Reset state.indentedCode
    state.indentedCode = false;
    if (state.f == htmlBlock) {
      var exit = htmlModeMissing;
      if (!exit) {
        var inner = _codemirror2.default.innerMode(htmlMode, state.htmlState);
        exit = inner.mode.name == "xml" && inner.state.tagStart === null && !inner.state.context && inner.state.tokenize.isInText;
      }
      if (exit) {
        state.f = inlineNormal;
        state.block = blockNormal;
        state.htmlState = null;
      }
    }
    // Reset state.trailingSpace
    state.trailingSpace = 0;
    state.trailingSpaceNewLine = false;
    // Mark this line as blank
    state.prevLine = state.thisLine;
    state.thisLine = { stream: null };
    return null;
  }

  function blockNormal(stream, state) {
    var firstTokenOnLine = stream.column() === state.indentation;
    var prevLineLineIsEmpty = lineIsEmpty(state.prevLine.stream);
    var prevLineIsIndentedCode = state.indentedCode;
    var prevLineIsHr = state.prevLine.hr;
    var prevLineIsList = state.list !== false;
    var maxNonCodeIndentation = (state.listStack[state.listStack.length - 1] || 0) + 3;

    state.indentedCode = false;

    var lineIndentation = state.indentation;
    // compute once per line (on first token)
    if (state.indentationDiff === null) {
      state.indentationDiff = state.indentation;
      if (prevLineIsList) {
        // Reset inline styles which shouldn't propagate aross list items
        state.em = false;
        state.strong = false;
        state.code = false;
        state.strikethrough = false;

        state.list = null;
        // While this list item's marker's indentation is less than the deepest
        //  list item's content's indentation,pop the deepest list item
        //  indentation off the stack, and update block indentation state
        while (lineIndentation < state.listStack[state.listStack.length - 1]) {
          state.listStack.pop();
          if (state.listStack.length) {
            state.indentation = state.listStack[state.listStack.length - 1];
            // less than the first list's indent -> the line is no longer a list
          } else {
            state.list = false;
          }
        }
        if (state.list !== false) {
          state.indentationDiff = lineIndentation - state.listStack[state.listStack.length - 1];
        }
      }
    }

    // not comprehensive (currently only for setext detection purposes)
    var allowsInlineContinuation = !prevLineLineIsEmpty && !prevLineIsHr && !state.prevLine.header && (!prevLineIsList || !prevLineIsIndentedCode) && !state.prevLine.fencedCodeEnd;

    var isHr = (state.list === false || prevLineIsHr || prevLineLineIsEmpty) && state.indentation <= maxNonCodeIndentation && stream.match(hrRE);

    var match = null;
    if (state.indentationDiff >= 4 && (prevLineIsIndentedCode || state.prevLine.fencedCodeEnd || state.prevLine.header || prevLineLineIsEmpty)) {
      stream.skipToEnd();
      state.indentedCode = true;
      return tokenTypes.code;
    } else if (stream.eatSpace()) {
      return null;
    } else if (firstTokenOnLine && state.indentation <= maxNonCodeIndentation && (match = stream.match(atxHeaderRE)) && match[1].length <= 6) {
      state.quote = 0;
      state.header = match[1].length;
      state.thisLine.header = true;
      if (modeCfg.highlightFormatting) state.formatting = "header";
      state.f = state.inline;
      return getType(state);
    } else if (state.indentation <= maxNonCodeIndentation && stream.eat('>')) {
      state.quote = firstTokenOnLine ? 1 : state.quote + 1;
      if (modeCfg.highlightFormatting) state.formatting = "quote";
      stream.eatSpace();
      return getType(state);
    } else if (!isHr && !state.setext && firstTokenOnLine && state.indentation <= maxNonCodeIndentation && (match = stream.match(listRE))) {
      var listType = match[1] ? "ol" : "ul";

      state.indentation = lineIndentation + stream.current().length;
      state.list = true;
      state.quote = 0;

      // Add this list item's content's indentation to the stack
      state.listStack.push(state.indentation);

      if (modeCfg.taskLists && stream.match(taskListRE, false)) {
        state.taskList = true;
      }
      state.f = state.inline;
      if (modeCfg.highlightFormatting) state.formatting = ["list", "list-" + listType];
      return getType(state);
    } else if (firstTokenOnLine && state.indentation <= maxNonCodeIndentation && (match = stream.match(fencedCodeRE, true))) {
      state.quote = 0;
      state.fencedEndRE = new RegExp(match[1] + "+ *$");
      // try switching mode
      state.localMode = modeCfg.fencedCodeBlockHighlighting && getMode(match[2]);
      if (state.localMode) state.localState = _codemirror2.default.startState(state.localMode);
      state.f = state.block = local;
      if (modeCfg.highlightFormatting) state.formatting = "code-block";
      state.code = -1;
      return getType(state);
      // SETEXT has lowest block-scope precedence after HR, so check it after
      //  the others (code, blockquote, list...)
    } else if (
    // if setext set, indicates line after ---/===
    state.setext ||
    // line before ---/===
    (!allowsInlineContinuation || !prevLineIsList) && !state.quote && state.list === false && !state.code && !isHr && !linkDefRE.test(stream.string) && (match = stream.lookAhead(1)) && (match = match.match(setextHeaderRE))) {
      if (!state.setext) {
        state.header = match[0].charAt(0) == '=' ? 1 : 2;
        state.setext = state.header;
      } else {
        state.header = state.setext;
        // has no effect on type so we can reset it now
        state.setext = 0;
        stream.skipToEnd();
        if (modeCfg.highlightFormatting) state.formatting = "header";
      }
      state.thisLine.header = true;
      state.f = state.inline;
      return getType(state);
    } else if (isHr) {
      stream.skipToEnd();
      state.hr = true;
      state.thisLine.hr = true;
      return tokenTypes.hr;
    } else if (stream.peek() === '[') {
      return switchInline(stream, state, footnoteLink);
    }

    return switchInline(stream, state, state.inline);
  }

  function htmlBlock(stream, state) {
    var style = htmlMode.token(stream, state.htmlState);
    if (!htmlModeMissing) {
      var inner = _codemirror2.default.innerMode(htmlMode, state.htmlState);
      if (inner.mode.name == "xml" && inner.state.tagStart === null && !inner.state.context && inner.state.tokenize.isInText || state.md_inside && stream.current().indexOf(">") > -1) {
        state.f = inlineNormal;
        state.block = blockNormal;
        state.htmlState = null;
      }
    }
    return style;
  }

  function local(stream, state) {
    var currListInd = state.listStack[state.listStack.length - 1] || 0;
    var hasExitedList = state.indentation < currListInd;
    var maxFencedEndInd = currListInd + 3;
    if (state.fencedEndRE && state.indentation <= maxFencedEndInd && (hasExitedList || stream.match(state.fencedEndRE))) {
      if (modeCfg.highlightFormatting) state.formatting = "code-block";
      var returnType;
      if (!hasExitedList) returnType = getType(state);
      state.localMode = state.localState = null;
      state.block = blockNormal;
      state.f = inlineNormal;
      state.fencedEndRE = null;
      state.code = 0;
      state.thisLine.fencedCodeEnd = true;
      if (hasExitedList) return switchBlock(stream, state, state.block);
      return returnType;
    } else if (state.localMode) {
      return state.localMode.token(stream, state.localState);
    } else {
      stream.skipToEnd();
      return tokenTypes.code;
    }
  }

  // Inline
  function getType(state) {
    var styles = [];

    if (state.formatting) {
      styles.push(tokenTypes.formatting);

      if (typeof state.formatting === "string") state.formatting = [state.formatting];

      for (var i = 0; i < state.formatting.length; i++) {
        styles.push(tokenTypes.formatting + "-" + state.formatting[i]);

        if (state.formatting[i] === "header") {
          styles.push(tokenTypes.formatting + "-" + state.formatting[i] + "-" + state.header);
        }

        // Add `formatting-quote` and `formatting-quote-#` for blockquotes
        // Add `error` instead if the maximum blockquote nesting depth is passed
        if (state.formatting[i] === "quote") {
          if (!modeCfg.maxBlockquoteDepth || modeCfg.maxBlockquoteDepth >= state.quote) {
            styles.push(tokenTypes.formatting + "-" + state.formatting[i] + "-" + state.quote);
          } else {
            styles.push("error");
          }
        }
      }
    }

    if (state.taskOpen) {
      styles.push("meta");
      return styles.length ? styles.join(' ') : null;
    }
    if (state.taskClosed) {
      styles.push("property");
      return styles.length ? styles.join(' ') : null;
    }

    if (state.linkHref) {
      styles.push(tokenTypes.linkHref, "url");
    } else {
      // Only apply inline styles to non-url text
      if (state.strong) {
        styles.push(tokenTypes.strong);
      }
      if (state.em) {
        styles.push(tokenTypes.em);
      }
      if (state.strikethrough) {
        styles.push(tokenTypes.strikethrough);
      }
      if (state.emoji) {
        styles.push(tokenTypes.emoji);
      }
      if (state.linkText) {
        styles.push(tokenTypes.linkText);
      }
      if (state.code) {
        styles.push(tokenTypes.code);
      }
      if (state.image) {
        styles.push(tokenTypes.image);
      }
      if (state.imageAltText) {
        styles.push(tokenTypes.imageAltText, "link");
      }
      if (state.imageMarker) {
        styles.push(tokenTypes.imageMarker);
      }
    }

    if (state.header) {
      styles.push(tokenTypes.header, tokenTypes.header + "-" + state.header);
    }

    if (state.quote) {
      styles.push(tokenTypes.quote);

      // Add `quote-#` where the maximum for `#` is modeCfg.maxBlockquoteDepth
      if (!modeCfg.maxBlockquoteDepth || modeCfg.maxBlockquoteDepth >= state.quote) {
        styles.push(tokenTypes.quote + "-" + state.quote);
      } else {
        styles.push(tokenTypes.quote + "-" + modeCfg.maxBlockquoteDepth);
      }
    }

    if (state.list !== false) {
      var listMod = (state.listStack.length - 1) % 3;
      if (!listMod) {
        styles.push(tokenTypes.list1);
      } else if (listMod === 1) {
        styles.push(tokenTypes.list2);
      } else {
        styles.push(tokenTypes.list3);
      }
    }

    if (state.trailingSpaceNewLine) {
      styles.push("trailing-space-new-line");
    } else if (state.trailingSpace) {
      styles.push("trailing-space-" + (state.trailingSpace % 2 ? "a" : "b"));
    }

    return styles.length ? styles.join(' ') : null;
  }

  function handleText(stream, state) {
    if (stream.match(textRE, true)) {
      return getType(state);
    }
    return undefined;
  }

  function inlineNormal(stream, state) {
    var style = state.text(stream, state);
    if (typeof style !== 'undefined') return style;

    if (state.list) {
      // List marker (*, +, -, 1., etc)
      state.list = null;
      return getType(state);
    }

    if (state.taskList) {
      var taskOpen = stream.match(taskListRE, true)[1] === " ";
      if (taskOpen) state.taskOpen = true;else state.taskClosed = true;
      if (modeCfg.highlightFormatting) state.formatting = "task";
      state.taskList = false;
      return getType(state);
    }

    state.taskOpen = false;
    state.taskClosed = false;

    if (state.header && stream.match(/^#+$/, true)) {
      if (modeCfg.highlightFormatting) state.formatting = "header";
      return getType(state);
    }

    var ch = stream.next();

    // Matches link titles present on next line
    if (state.linkTitle) {
      state.linkTitle = false;
      var matchCh = ch;
      if (ch === '(') {
        matchCh = ')';
      }
      matchCh = (matchCh + '').replace(/([.?*+^\[\]\\(){}|-])/g, "\\$1");
      var regex = '^\\s*(?:[^' + matchCh + '\\\\]+|\\\\\\\\|\\\\.)' + matchCh;
      if (stream.match(new RegExp(regex), true)) {
        return tokenTypes.linkHref;
      }
    }

    // If this block is changed, it may need to be updated in GFM mode
    if (ch === '`') {
      var previousFormatting = state.formatting;
      if (modeCfg.highlightFormatting) state.formatting = "code";
      stream.eatWhile('`');
      var count = stream.current().length;
      if (state.code == 0 && (!state.quote || count == 1)) {
        state.code = count;
        return getType(state);
      } else if (count == state.code) {
        // Must be exact
        var t = getType(state);
        state.code = 0;
        return t;
      } else {
        state.formatting = previousFormatting;
        return getType(state);
      }
    } else if (state.code) {
      return getType(state);
    }

    if (ch === '\\') {
      stream.next();
      if (modeCfg.highlightFormatting) {
        var type = getType(state);
        var formattingEscape = tokenTypes.formatting + "-escape";
        return type ? type + " " + formattingEscape : formattingEscape;
      }
    }

    if (ch === '!' && stream.match(/\[[^\]]*\] ?(?:\(|\[)/, false)) {
      state.imageMarker = true;
      state.image = true;
      if (modeCfg.highlightFormatting) state.formatting = "image";
      return getType(state);
    }

    if (ch === '[' && state.imageMarker && stream.match(/[^\]]*\](\(.*?\)| ?\[.*?\])/, false)) {
      state.imageMarker = false;
      state.imageAltText = true;
      if (modeCfg.highlightFormatting) state.formatting = "image";
      return getType(state);
    }

    if (ch === ']' && state.imageAltText) {
      if (modeCfg.highlightFormatting) state.formatting = "image";
      var type = getType(state);
      state.imageAltText = false;
      state.image = false;
      state.inline = state.f = linkHref;
      return type;
    }

    if (ch === '[' && !state.image) {
      if (state.linkText && stream.match(/^.*?\]/)) return getType(state);
      state.linkText = true;
      if (modeCfg.highlightFormatting) state.formatting = "link";
      return getType(state);
    }

    if (ch === ']' && state.linkText) {
      if (modeCfg.highlightFormatting) state.formatting = "link";
      var type = getType(state);
      state.linkText = false;
      state.inline = state.f = stream.match(/\(.*?\)| ?\[.*?\]/, false) ? linkHref : inlineNormal;
      return type;
    }

    if (ch === '<' && stream.match(/^(https?|ftps?):\/\/(?:[^\\>]|\\.)+>/, false)) {
      state.f = state.inline = linkInline;
      if (modeCfg.highlightFormatting) state.formatting = "link";
      var type = getType(state);
      if (type) {
        type += " ";
      } else {
        type = "";
      }
      return type + tokenTypes.linkInline;
    }

    if (ch === '<' && stream.match(/^[^> \\]+@(?:[^\\>]|\\.)+>/, false)) {
      state.f = state.inline = linkInline;
      if (modeCfg.highlightFormatting) state.formatting = "link";
      var type = getType(state);
      if (type) {
        type += " ";
      } else {
        type = "";
      }
      return type + tokenTypes.linkEmail;
    }

    if (modeCfg.xml && ch === '<' && stream.match(/^(!--|\?|!\[CDATA\[|[a-z][a-z0-9-]*(?:\s+[a-z_:.\-]+(?:\s*=\s*[^>]+)?)*\s*(?:>|$))/i, false)) {
      var end = stream.string.indexOf(">", stream.pos);
      if (end != -1) {
        var atts = stream.string.substring(stream.start, end);
        if (/markdown\s*=\s*('|"){0,1}1('|"){0,1}/.test(atts)) state.md_inside = true;
      }
      stream.backUp(1);
      state.htmlState = _codemirror2.default.startState(htmlMode);
      return switchBlock(stream, state, htmlBlock);
    }

    if (modeCfg.xml && ch === '<' && stream.match(/^\/\w*?>/)) {
      state.md_inside = false;
      return "tag";
    } else if (ch === "*" || ch === "_") {
      var len = 1,
          before = stream.pos == 1 ? " " : stream.string.charAt(stream.pos - 2);
      while (len < 3 && stream.eat(ch)) {
        len++;
      }var after = stream.peek() || " ";
      // See http://spec.commonmark.org/0.27/#emphasis-and-strong-emphasis
      var leftFlanking = !/\s/.test(after) && (!punctuation.test(after) || /\s/.test(before) || punctuation.test(before));
      var rightFlanking = !/\s/.test(before) && (!punctuation.test(before) || /\s/.test(after) || punctuation.test(after));
      var setEm = null,
          setStrong = null;
      if (len % 2) {
        // Em
        if (!state.em && leftFlanking && (ch === "*" || !rightFlanking || punctuation.test(before))) setEm = true;else if (state.em == ch && rightFlanking && (ch === "*" || !leftFlanking || punctuation.test(after))) setEm = false;
      }
      if (len > 1) {
        // Strong
        if (!state.strong && leftFlanking && (ch === "*" || !rightFlanking || punctuation.test(before))) setStrong = true;else if (state.strong == ch && rightFlanking && (ch === "*" || !leftFlanking || punctuation.test(after))) setStrong = false;
      }
      if (setStrong != null || setEm != null) {
        if (modeCfg.highlightFormatting) state.formatting = setEm == null ? "strong" : setStrong == null ? "em" : "strong em";
        if (setEm === true) state.em = ch;
        if (setStrong === true) state.strong = ch;
        var t = getType(state);
        if (setEm === false) state.em = false;
        if (setStrong === false) state.strong = false;
        return t;
      }
    } else if (ch === ' ') {
      if (stream.eat('*') || stream.eat('_')) {
        // Probably surrounded by spaces
        if (stream.peek() === ' ') {
          // Surrounded by spaces, ignore
          return getType(state);
        } else {
          // Not surrounded by spaces, back up pointer
          stream.backUp(1);
        }
      }
    }

    if (modeCfg.strikethrough) {
      if (ch === '~' && stream.eatWhile(ch)) {
        if (state.strikethrough) {
          // Remove strikethrough
          if (modeCfg.highlightFormatting) state.formatting = "strikethrough";
          var t = getType(state);
          state.strikethrough = false;
          return t;
        } else if (stream.match(/^[^\s]/, false)) {
          // Add strikethrough
          state.strikethrough = true;
          if (modeCfg.highlightFormatting) state.formatting = "strikethrough";
          return getType(state);
        }
      } else if (ch === ' ') {
        if (stream.match(/^~~/, true)) {
          // Probably surrounded by space
          if (stream.peek() === ' ') {
            // Surrounded by spaces, ignore
            return getType(state);
          } else {
            // Not surrounded by spaces, back up pointer
            stream.backUp(2);
          }
        }
      }
    }

    if (modeCfg.emoji && ch === ":" && stream.match(/^[a-z_\d+-]+:/)) {
      state.emoji = true;
      if (modeCfg.highlightFormatting) state.formatting = "emoji";
      var retType = getType(state);
      state.emoji = false;
      return retType;
    }

    if (ch === ' ') {
      if (stream.match(/^ +$/, false)) {
        state.trailingSpace++;
      } else if (state.trailingSpace) {
        state.trailingSpaceNewLine = true;
      }
    }

    return getType(state);
  }

  function linkInline(stream, state) {
    var ch = stream.next();

    if (ch === ">") {
      state.f = state.inline = inlineNormal;
      if (modeCfg.highlightFormatting) state.formatting = "link";
      var type = getType(state);
      if (type) {
        type += " ";
      } else {
        type = "";
      }
      return type + tokenTypes.linkInline;
    }

    stream.match(/^[^>]+/, true);

    return tokenTypes.linkInline;
  }

  function linkHref(stream, state) {
    // Check if space, and return NULL if so (to avoid marking the space)
    if (stream.eatSpace()) {
      return null;
    }
    var ch = stream.next();
    if (ch === '(' || ch === '[') {
      state.f = state.inline = getLinkHrefInside(ch === "(" ? ")" : "]");
      if (modeCfg.highlightFormatting) state.formatting = "link-string";
      state.linkHref = true;
      return getType(state);
    }
    return 'error';
  }

  var linkRE = {
    ")": /^(?:[^\\\(\)]|\\.|\((?:[^\\\(\)]|\\.)*\))*?(?=\))/,
    "]": /^(?:[^\\\[\]]|\\.|\[(?:[^\\\[\]]|\\.)*\])*?(?=\])/
  };

  function getLinkHrefInside(endChar) {
    return function (stream, state) {
      var ch = stream.next();

      if (ch === endChar) {
        state.f = state.inline = inlineNormal;
        if (modeCfg.highlightFormatting) state.formatting = "link-string";
        var returnState = getType(state);
        state.linkHref = false;
        return returnState;
      }

      stream.match(linkRE[endChar]);
      state.linkHref = true;
      return getType(state);
    };
  }

  function footnoteLink(stream, state) {
    if (stream.match(/^([^\]\\]|\\.)*\]:/, false)) {
      state.f = footnoteLinkInside;
      stream.next(); // Consume [
      if (modeCfg.highlightFormatting) state.formatting = "link";
      state.linkText = true;
      return getType(state);
    }
    return switchInline(stream, state, inlineNormal);
  }

  function footnoteLinkInside(stream, state) {
    if (stream.match(/^\]:/, true)) {
      state.f = state.inline = footnoteUrl;
      if (modeCfg.highlightFormatting) state.formatting = "link";
      var returnType = getType(state);
      state.linkText = false;
      return returnType;
    }

    stream.match(/^([^\]\\]|\\.)+/, true);

    return tokenTypes.linkText;
  }

  function footnoteUrl(stream, state) {
    // Check if space, and return NULL if so (to avoid marking the space)
    if (stream.eatSpace()) {
      return null;
    }
    // Match URL
    stream.match(/^[^\s]+/, true);
    // Check for link title
    if (stream.peek() === undefined) {
      // End of line, set flag to check next line
      state.linkTitle = true;
    } else {
      // More content on line, check if link title
      stream.match(/^(?:\s+(?:"(?:[^"\\]|\\\\|\\.)+"|'(?:[^'\\]|\\\\|\\.)+'|\((?:[^)\\]|\\\\|\\.)+\)))?/, true);
    }
    state.f = state.inline = inlineNormal;
    return tokenTypes.linkHref + " url";
  }

  var mode = {
    startState: function startState() {
      return {
        f: blockNormal,

        prevLine: { stream: null },
        thisLine: { stream: null },

        block: blockNormal,
        htmlState: null,
        indentation: 0,

        inline: inlineNormal,
        text: handleText,

        formatting: false,
        linkText: false,
        linkHref: false,
        linkTitle: false,
        code: 0,
        em: false,
        strong: false,
        header: 0,
        setext: 0,
        hr: false,
        taskList: false,
        list: false,
        listStack: [],
        quote: 0,
        trailingSpace: 0,
        trailingSpaceNewLine: false,
        strikethrough: false,
        emoji: false,
        fencedEndRE: null
      };
    },

    copyState: function copyState(s) {
      return {
        f: s.f,

        prevLine: s.prevLine,
        thisLine: s.thisLine,

        block: s.block,
        htmlState: s.htmlState && _codemirror2.default.copyState(htmlMode, s.htmlState),
        indentation: s.indentation,

        localMode: s.localMode,
        localState: s.localMode ? _codemirror2.default.copyState(s.localMode, s.localState) : null,

        inline: s.inline,
        text: s.text,
        formatting: false,
        linkText: s.linkText,
        linkTitle: s.linkTitle,
        linkHref: s.linkHref,
        code: s.code,
        em: s.em,
        strong: s.strong,
        strikethrough: s.strikethrough,
        emoji: s.emoji,
        header: s.header,
        setext: s.setext,
        hr: s.hr,
        taskList: s.taskList,
        list: s.list,
        listStack: s.listStack.slice(0),
        quote: s.quote,
        indentedCode: s.indentedCode,
        trailingSpace: s.trailingSpace,
        trailingSpaceNewLine: s.trailingSpaceNewLine,
        md_inside: s.md_inside,
        fencedEndRE: s.fencedEndRE
      };
    },

    token: function token(stream, state) {

      // Reset state.formatting
      state.formatting = false;

      if (stream != state.thisLine.stream) {
        state.header = 0;
        state.hr = false;

        if (stream.match(/^\s*$/, true)) {
          blankLine(state);
          return null;
        }

        state.prevLine = state.thisLine;
        state.thisLine = { stream: stream

          // Reset state.taskList
        };state.taskList = false;

        // Reset state.trailingSpace
        state.trailingSpace = 0;
        state.trailingSpaceNewLine = false;

        if (!state.localState) {
          state.f = state.block;
          if (state.f != htmlBlock) {
            var indentation = stream.match(/^\s*/, true)[0].replace(/\t/g, expandedTab).length;
            state.indentation = indentation;
            state.indentationDiff = null;
            if (indentation > 0) return null;
          }
        }
      }
      return state.f(stream, state);
    },

    innerMode: function innerMode(state) {
      if (state.block == htmlBlock) return { state: state.htmlState, mode: htmlMode };
      if (state.localState) return { state: state.localState, mode: state.localMode };
      return { state: state, mode: mode };
    },

    indent: function indent(state, textAfter, line) {
      if (state.block == htmlBlock && htmlMode.indent) return htmlMode.indent(state.htmlState, textAfter, line);
      if (state.localState && state.localMode.indent) return state.localMode.indent(state.localState, textAfter, line);
      return _codemirror2.default.Pass;
    },

    blankLine: blankLine,

    getType: getType,

    closeBrackets: "()[]{}''\"\"``",
    fold: "markdown"
  };
  return mode;
}, "xml"); // CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
/**
 * @modifier NHN FE Development Lab <dl_javascript@nhn.com>
 */
// based on https://github.com/codemirror/CodeMirror/blob/ff04f127ba8a736b97d06c505fb85d976e3f2980/mode/markdown/markdown.js


_codemirror2.default.defineMIME("text/markdown", "markdown");

_codemirror2.default.defineMIME("text/x-markdown", "markdown");

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _codemirror = __webpack_require__(6);

var _codemirror2 = _interopRequireDefault(_codemirror);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*eslint-disable */
var urlRE = /^((?:(?:aaas?|about|acap|adiumxtra|af[ps]|aim|apt|attachment|aw|beshare|bitcoin|bolo|callto|cap|chrome(?:-extension)?|cid|coap|com-eventbrite-attendee|content|crid|cvs|data|dav|dict|dlna-(?:playcontainer|playsingle)|dns|doi|dtn|dvb|ed2k|facetime|feed|file|finger|fish|ftp|geo|gg|git|gizmoproject|go|gopher|gtalk|h323|hcp|https?|iax|icap|icon|im|imap|info|ipn|ipp|irc[6s]?|iris(?:\.beep|\.lwz|\.xpc|\.xpcs)?|itms|jar|javascript|jms|keyparc|lastfm|ldaps?|magnet|mailto|maps|market|message|mid|mms|ms-help|msnim|msrps?|mtqp|mumble|mupdate|mvn|news|nfs|nih?|nntp|notes|oid|opaquelocktoken|palm|paparazzi|platform|pop|pres|proxy|psyc|query|res(?:ource)?|rmi|rsync|rtmp|rtsp|secondlife|service|session|sftp|sgn|shttp|sieve|sips?|skype|sm[bs]|snmp|soap\.beeps?|soldat|spotify|ssh|steam|svn|tag|teamspeak|tel(?:net)?|tftp|things|thismessage|tip|tn3270|tv|udp|unreal|urn|ut2004|vemmi|ventrilo|view-source|webcal|wss?|wtai|wyciwyg|xcon(?:-userid)?|xfire|xmlrpc\.beeps?|xmpp|xri|ymsgr|z39\.50[rs]?):(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]|\([^\s()<>]*\))+(?:\([^\s()<>]*\)|[^\s`*!()\[\]{};:'".,<>?«»“”‘’]))/i; // CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
/**
 * @modifier NHN FE Development Lab <dl_javascript@nhn.com>
 */


_codemirror2.default.defineMode("gfm", function (config, modeConfig) {
  var codeDepth = 0;
  function blankLine(state) {
    state.code = false;
    return null;
  }
  var gfmOverlay = {
    startState: function startState() {
      return {
        code: false,
        codeBlock: false,
        ateSpace: false
      };
    },
    copyState: function copyState(s) {
      return {
        code: s.code,
        codeBlock: s.codeBlock,
        ateSpace: s.ateSpace
      };
    },
    token: function token(stream, state) {
      state.combineTokens = null;

      // Hack to prevent formatting override inside code blocks (block and inline)
      if (state.codeBlock) {
        if (stream.match(/^```+/)) {
          state.codeBlock = false;
          return null;
        }
        stream.skipToEnd();
        return null;
      }
      if (stream.sol()) {
        state.code = false;
      }
      if (stream.sol() && stream.match(/^```+/)) {
        stream.skipToEnd();
        state.codeBlock = true;
        return null;
      }
      // If this block is changed, it may need to be updated in Markdown mode
      if (stream.peek() === '`') {
        stream.next();
        var before = stream.pos;
        stream.eatWhile('`');
        var difference = 1 + stream.pos - before;
        if (!state.code) {
          codeDepth = difference;
          state.code = true;
        } else {
          if (difference === codeDepth) {
            // Must be exact
            state.code = false;
          }
        }
        return null;
      } else if (state.code) {
        stream.next();
        return null;
      }
      // Check if space. If so, links can be formatted later on
      if (stream.eatSpace()) {
        state.ateSpace = true;
        return null;
      }
      // Disable GitHub specifics. SHA, Num, Combine links
      /*
      if (stream.sol() || state.ateSpace) {
        state.ateSpace = false;
        if (modeConfig.gitHubSpice !== false) {
          if(stream.match(/^(?:[a-zA-Z0-9\-_]+\/)?(?:[a-zA-Z0-9\-_]+@)?(?=.{0,6}\d)(?:[a-f0-9]{7,40}\b)/)) {
            // User/Project@SHA
            // User@SHA
            // SHA
            state.combineTokens = true;
            return "link";
          } else if (stream.match(/^(?:[a-zA-Z0-9\-_]+\/)?(?:[a-zA-Z0-9\-_]+)?#[0-9]+\b/)) {
            // User/Project#Num
            // User#Num
            // #Num
            state.combineTokens = true;
            return "link";
          }
        }
      }
      if (stream.match(urlRE) &&
          stream.string.slice(stream.start - 2, stream.start) != "](" &&
          (stream.start == 0 || /\W/.test(stream.string.charAt(stream.start - 1)))) {
        // URLs
        // Taken from http://daringfireball.net/2010/07/improved_regex_for_matching_urls
        // And then (issue #1160) simplified to make it not crash the Chrome Regexp engine
        // And then limited url schemes to the CommonMark list, so foo:bar isn't matched as a URL
        state.combineTokens = true;
        return "link";
      }
      */
      stream.next();
      return null;
    },
    blankLine: blankLine
  };

  var markdownConfig = {
    taskLists: true,
    strikethrough: true,
    emoji: true
  };
  for (var attr in modeConfig) {
    markdownConfig[attr] = modeConfig[attr];
  }
  markdownConfig.name = "markdown";
  return _codemirror2.default.overlayMode(_codemirror2.default.getMode(config, markdownConfig), gfmOverlay);
}, "markdown");

_codemirror2.default.defineMIME("text/x-gfm", "gfm");

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _codemirror = __webpack_require__(6);

var _codemirror2 = _interopRequireDefault(_codemirror);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*eslint-disable */
var listRE = /^(\s*)(>[> ]*|[*+-] \[[x ]\]\s|[*+-]\s|(\d+)([.)]))(\s*)/,
    emptyListRE = /^(\s*)(>[> ]*|[*+-] \[[x ]\]|[*+-]|(\d+)[.)])(\s*)$/,
    unorderedListRE = /[*+-]\s/; // CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
/**
 * @modifier NHN FE Development Lab <dl_javascript@nhn.com>
 */


_codemirror2.default.commands.indentOrderedList = function (cm) {
  if (cm.getOption("disableInput")) return _codemirror2.default.Pass;
  var ranges = cm.listSelections();
  for (var i = 0; i < ranges.length; i++) {
    var pos = ranges[i].head;
    var line = cm.getLine(pos.line);
    var cursorBeforeTextInline = line.substr(0, pos.ch);

    if (listRE.test(cursorBeforeTextInline) || cm.somethingSelected()) {
      cm.indentSelection("add");
    } else {
      cm.execCommand("insertSoftTab");
    }
  }
  cm.execCommand('fixOrderedListNumber');
};

_codemirror2.default.commands.newlineAndIndentContinueMarkdownList = function (cm) {
  if (cm.getOption("disableInput")) return _codemirror2.default.Pass;
  var ranges = cm.listSelections(),
      replacements = [];
  for (var i = 0; i < ranges.length; i++) {
    var pos = ranges[i].head;

    // If we're not in Markdown mode, fall back to normal newlineAndIndent
    var eolState = cm.getStateAfter(pos.line);
    var inner = _codemirror2.default.innerMode(cm.getMode(), eolState);
    if (inner.mode.name !== "markdown") {
      cm.execCommand("newlineAndIndent");
      return;
    } else {
      eolState = inner.state;
    }

    var inList = eolState.list !== false;
    var inQuote = eolState.quote !== 0;

    var line = cm.getLine(pos.line),
        match = listRE.exec(line);
    var cursorBeforeBullet = /^\s*$/.test(line.slice(0, pos.ch));
    if (!ranges[i].empty() || !inList && !inQuote || !match || cursorBeforeBullet) {
      cm.execCommand("newlineAndIndent");
      return;
    }
    if (emptyListRE.test(line)) {
      if (!/>\s*$/.test(line)) cm.replaceRange("", {
        line: pos.line, ch: 0
      }, {
        line: pos.line, ch: pos.ch + 1
      });
      replacements[i] = "\n";
    } else {
      var indent = match[1],
          after = match[5];
      var numbered = !(unorderedListRE.test(match[2]) || match[2].indexOf(">") >= 0);
      var bullet = numbered ? parseInt(match[3], 10) + 1 + match[4] : match[2].replace("x", " ");
      replacements[i] = "\n" + indent + bullet + after;

      if (numbered) incrementRemainingMarkdownListNumbers(cm, pos);
    }
  }

  cm.replaceSelections(replacements);
};

// Auto-updating Markdown list numbers when a new item is added to the
// middle of a list
function incrementRemainingMarkdownListNumbers(cm, pos) {
  var startLine = pos.line,
      lookAhead = 0,
      skipCount = 0;
  var startItem = listRE.exec(cm.getLine(startLine)),
      startIndent = startItem[1];

  do {
    lookAhead += 1;
    var nextLineNumber = startLine + lookAhead;
    var nextLine = cm.getLine(nextLineNumber),
        nextItem = listRE.exec(nextLine);

    if (nextItem) {
      var nextIndent = nextItem[1];
      var newNumber = parseInt(startItem[3], 10) + lookAhead - skipCount;
      var nextNumber = parseInt(nextItem[3], 10),
          itemNumber = nextNumber;

      if (startIndent === nextIndent && !isNaN(nextNumber)) {
        if (newNumber === nextNumber) itemNumber = nextNumber + 1;
        if (newNumber > nextNumber) itemNumber = newNumber + 1;
        cm.replaceRange(nextLine.replace(listRE, nextIndent + itemNumber + nextItem[4] + nextItem[5]), {
          line: nextLineNumber, ch: 0
        }, {
          line: nextLineNumber, ch: nextLine.length
        });
      } else {
        if (startIndent.length > nextIndent.length) return;
        // This doesn't run if the next line immediatley indents, as it is
        // not clear of the users intention (new indented item or same level)
        if (startIndent.length < nextIndent.length && lookAhead === 1) return;
        skipCount += 1;
      }
    }
  } while (nextItem);
}

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _codemirror = __webpack_require__(6);

var _codemirror2 = _interopRequireDefault(_codemirror);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*eslint-disable */
_codemirror2.default.commands.replaceLineTextToUpper = function (cm) {
    if (cm.getOption("disableInput")) {
        return _codemirror2.default.Pass;
    }

    var ranges = cm.listSelections();
    var lineAdjustment = -1;

    for (var i = 0; i < ranges.length; i++) {
        var range = ranges[i];
        var from = range.anchor;
        var to = range.head;

        if (isSameLineSelection(range) && to.line > 0) {
            replaceSingleLine(cm, from, to, lineAdjustment);
        } else if (!isRangeCollapsed(range)) {
            var topLine = from.line < to.line ? from.line : to.line;

            if (topLine > 0) {
                var upper = from.line === topLine ? from : to;
                var bottom = from.line === topLine ? to : from;
                replaceMultiLine(cm, upper, bottom, lineAdjustment);
            }
        }
    }
}; // CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
/**
 * @modifier NHN FE Development Lab <dl_javascript@nhn.com>
 */


_codemirror2.default.commands.replaceLineTextToLower = function (cm) {
    if (cm.getOption("disableInput")) {
        return _codemirror2.default.Pass;
    }

    var ranges = cm.listSelections();
    var lineAdjustment = 1;

    for (var i = 0; i < ranges.length; i++) {
        var range = ranges[i];
        var from = range.anchor;
        var to = range.head;
        var isLastLine = to.line === cm.lastLine();

        if (isSameLineSelection(range) && !isLastLine) {
            replaceSingleLine(cm, from, to, lineAdjustment);
        } else if (!isRangeCollapsed(range)) {
            var topLine = from.line < to.line ? from.line : to.line;
            var upper = from.line === topLine ? from : to;
            var bottom = from.line === topLine ? to : from;

            if (bottom.line < cm.lastLine()) {
                replaceMultiLine(cm, upper, bottom, lineAdjustment);
            }
        }
    }
};

function isRangeCollapsed(range) {
    return isSameLineSelection(range) && range.anchor.ch === range.head.ch;
}

function isSameLineSelection(range) {
    return range.anchor.line === range.head.line;
}

function replaceSingleLine(cm, from, to, lineAdjustment) {
    var currentLine = cm.getLine(to.line);
    var replacement = cm.getLine(to.line + lineAdjustment);
    var range = {
        anchor: from,
        head: to
    };

    cm.replaceRange(replacement, {
        line: to.line, ch: 0
    }, {
        line: to.line, ch: currentLine.length
    }, '+input');

    cm.replaceRange(currentLine, {
        line: to.line + lineAdjustment, ch: 0
    }, {
        line: to.line + lineAdjustment, ch: replacement.length
    }, '+input');

    if (isRangeCollapsed(range)) {
        cm.setCursor({
            line: to.line + lineAdjustment,
            ch: to.ch
        });
    } else {
        cm.setSelection({
            line: from.line + lineAdjustment,
            ch: from.ch
        }, {
            line: to.line + lineAdjustment,
            ch: to.ch
        });
    }
}

function replaceMultiLine(cm, upper, bottom, lineAdjustment) {
    var rangeContent = cm.getRange({
        line: upper.line, ch: 0
    }, {
        line: bottom.line, ch: cm.getLine(bottom.line).length
    });
    var edgeLineOfConcern = lineAdjustment > 0 ? bottom : upper;
    var replacement = cm.getLine(edgeLineOfConcern.line + lineAdjustment);
    var targetLine = void 0;

    if (lineAdjustment > 0) {
        targetLine = upper;
    } else {
        targetLine = bottom;
    }

    cm.replaceRange(replacement, {
        line: targetLine.line, ch: 0
    }, {
        line: targetLine.line, ch: cm.getLine(targetLine.line).length
    }, '+input');

    cm.replaceRange(rangeContent, {
        line: upper.line + lineAdjustment, ch: 0
    }, {
        line: bottom.line + lineAdjustment, ch: cm.getLine(bottom.line + lineAdjustment).length
    }, '+input');

    cm.setSelection({
        line: upper.line + lineAdjustment, ch: upper.ch
    }, {
        line: bottom.line + lineAdjustment, ch: bottom.ch
    });
}

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _codemirror = __webpack_require__(6);

var _codemirror2 = _interopRequireDefault(_codemirror);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable */
_codemirror2.default.defineOption('placeholder', '', function (cm, val, old) {
  var prev = old && old != _codemirror2.default.Init;
  if (val && !prev) {
    cm.on('blur', onBlur);
    cm.on('change', onChange);
    cm.on('swapDoc', onChange);
    onChange(cm);
  } else if (!val && prev) {
    cm.off('blur', onBlur);
    cm.off('change', onChange);
    cm.off('swapDoc', onChange);
    clearPlaceholder(cm);
    var wrapper = cm.getWrapperElement();
    wrapper.className = wrapper.className.replace(' CodeMirror-empty', '');
  }

  if (val && !cm.hasFocus()) onBlur(cm);
}); // CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
/**
 * @modifier NHN FE Development Lab <dl_javascript@nhn.com>
 */


function clearPlaceholder(cm) {
  if (cm.state.placeholder) {
    cm.state.placeholder.parentNode.removeChild(cm.state.placeholder);
    cm.state.placeholder = null;
  }
}
function setPlaceholder(cm) {
  clearPlaceholder(cm);
  var elt = cm.state.placeholder = document.createElement('pre');
  elt.style.cssText = 'height: 0; overflow: visible';
  elt.className = 'CodeMirror-placeholder';
  var placeHolder = cm.getOption('placeholder');
  if (typeof placeHolder == 'string') placeHolder = document.createTextNode(placeHolder);
  elt.appendChild(placeHolder);
  cm.display.lineSpace.insertBefore(elt, cm.display.lineSpace.firstChild);
}

function onBlur(cm) {
  if (isEmpty(cm)) setPlaceholder(cm);
}
function onChange(cm) {
  var wrapper = cm.getWrapperElement(),
      empty = isEmpty(cm);
  wrapper.className = wrapper.className.replace(' CodeMirror-empty', '') + (empty ? ' CodeMirror-empty' : '');

  if (empty) setPlaceholder(cm);else clearPlaceholder(cm);
}

function isEmpty(cm) {
  return cm.lineCount() === 1 && cm.getLine(0) === '';
}

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileoverview Implements markdown list manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

var FIND_LIST_RX = /^[ \t]*([-*]|[\d]+\.)( \[[ xX]])? /;
var FIND_TASK_LIST_RX = /^[ \t]*([*-] |[\d]+\. )(\[[ xX]] )/;

var FIND_UL_RX = /^[ \t]*[-*] .*/;
var FIND_OL_TASK_RX = /^[ \t]*[\d]+\. \[[ xX]] .*/;

var LIST_SYNTAX_RX = /([*-] |[\d]+\. )/;
var TASK_SYNTAX_RX = /([-*] |[\d]+\. )(\[[ xX]] )/;
var LIST_OR_TASK_SYNTAX_RX = /([-*]|[\d]+\.)( \[[ xX]])? /;
var UL_TASK_SYNTAX_RX = /([-*])( \[[ xX]]) /;
var OL_SYNTAX_RX = /([\d])+\.( \[[ xX]])? /;

var FIND_TABLE_RX = /^\|([-\s\w\d\t<>?!@#$%^&*()_=+\\/'";: \r[\]]*\|+)+/i;
var FIND_HEADING_RX = /^#+\s/;
var FIND_BLOCK_RX = /^ {0,3}(```|\||>)/;

/**
 * Class MdListManager
 * @param {MarkdownEditor} mde - MarkdownEditor instance
 * @ignore
 */

var MdListManager = function () {
  function MdListManager(mde) {
    _classCallCheck(this, MdListManager);

    this.cm = mde.getEditor();
    this.doc = this.cm.getDoc();

    /**
     * Name property
     * @type {string}
     */
    this.name = 'list';
  }

  /**
   * Sort line number of selection descending
   * @param {{from, to}} range start, end CodeMirror range information
   * @returns {{start: {number}, end: {number}}}
   * @private
   */


  _createClass(MdListManager, [{
    key: '_createSortedLineRange',
    value: function _createSortedLineRange(range) {
      var isReversed = range.from.line > range.to.line;
      var rangeStart = {
        line: isReversed ? range.to.line : range.from.line,
        ch: 0
      };
      var rangeEnd = {
        line: isReversed ? range.from.line : range.to.line,
        ch: 0
      };

      return {
        start: rangeStart.line,
        end: rangeEnd.line
      };
    }

    /**
     * For odering the ol list, search preivous lines and
     * calculate ordinal number when find ol list
     * @param {number} lineNumber lineNumber
     * @returns {number}
     * @private
     */

  }, {
    key: '_calculateOrdinalNumber',
    value: function _calculateOrdinalNumber(lineNumber) {
      var ordinalNumber = 1;

      for (var i = lineNumber - 1; i >= 0; i -= 1) {
        var depth = this._getListDepth(i);

        if (depth === 1 && OL_SYNTAX_RX.exec(this.doc.getLine(i))) {
          ordinalNumber = parseInt(RegExp.$1, 10) + 1;
          break;
        } else if (depth === 0) {
          break;
        }
      }

      return ordinalNumber;
    }
  }, {
    key: '_isListLine',
    value: function _isListLine(lineNumber) {
      return !!FIND_LIST_RX.exec(this.doc.getLine(lineNumber));
    }

    /**
     * If text already have sytax for heading, table and code block,
     * can not change to list.
     * @param {number} lineNumber lineNumber
     * @returns {boolean}
     * @private
     */

  }, {
    key: '_isCanBeList',
    value: function _isCanBeList(lineNumber) {
      var line = this.doc.getLine(lineNumber);

      return !FIND_BLOCK_RX.test(line) && !FIND_TABLE_RX.test(line) && !FIND_HEADING_RX.test(line);
    }

    /**
     * Return a function for change according to type
     * @param {string} type ol, ul, task
     * @returns {Function}
     * @private
     */

  }, {
    key: '_getChangeFn',
    value: function _getChangeFn(type) {
      var _this = this;

      var fn = void 0;

      switch (type) {
        case 'ol':
        case 'ul':
          fn = function fn(lineNumber) {
            return _this._changeToList(lineNumber, type);
          };
          break;
        case 'task':
          fn = function fn(lineNumber) {
            return _this._changeToTask(lineNumber);
          };
          break;
        default:
          break;
      }

      return fn;
    }

    /**
     * Change syntax by traversing each line selected.
     * @param {{from, to}} range start, end CodeMirror range information
     * @param {string} type ol, ul, task
     */

  }, {
    key: 'changeSyntax',
    value: function changeSyntax(range, type) {
      var newListLine = [];
      var lineRange = this._createSortedLineRange(range);
      var startLineNumber = lineRange.start,
          endLineNumber = lineRange.end;


      var changeFn = this._getChangeFn(type);

      for (var lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber += 1) {
        if (!this._isCanBeList(lineNumber)) {
          break;
        }

        // If text of lineNumber is not list, cache for inserting blank line
        if (!this._isListLine(lineNumber)) {
          newListLine.push(lineNumber);
        }

        changeFn(lineNumber);
      }

      // Should insert blank line before and after new list
      this._insertBlankLineForNewList(newListLine);

      this.cm.focus();
    }
  }, {
    key: '_replaceLineText',
    value: function _replaceLineText(text, lineNumber) {
      this.doc.replaceRange(text, {
        line: lineNumber,
        ch: 0
      });
    }

    /**
     * change to list according to the type.
     * @param {number} lineNumber line number
     * @param {string} type ol, ul
     * @private
     */

  }, {
    key: '_changeToList',
    value: function _changeToList(lineNumber, type) {
      var _this2 = this;

      if (this._isListLine(lineNumber)) {
        // If type is ol, need ordinal number.
        this._changeSameDepthList(lineNumber, type === 'ol' ? function (lineNum, ordinalNumber) {
          _this2._replaceListTypeToOL(lineNum, ordinalNumber);
        } : function (lineNum) {
          _this2._replaceListTypeToUL(lineNum);
        });
      } else {
        this._replaceLineText(type === 'ol' ? this._calculateOrdinalNumber(lineNumber) + '. ' : '* ', lineNumber);
      }
    }

    /**
     * change to task list according
     * @param {number} lineNumber line number
     * @private
     */

  }, {
    key: '_changeToTask',
    value: function _changeToTask(lineNumber) {
      if (FIND_TASK_LIST_RX.exec(this.doc.getLine(lineNumber))) {
        this._replaceLineTextByRegexp(lineNumber, TASK_SYNTAX_RX, '$1');
      } else if (this._isListLine(lineNumber)) {
        this._replaceLineTextByRegexp(lineNumber, LIST_SYNTAX_RX, '$1[ ] ');
      } else {
        this._replaceLineText('* [ ] ', lineNumber);
      }
    }
  }, {
    key: '_getListDepth',
    value: function _getListDepth(lineNumber) {
      return this.doc.getLine(lineNumber) ? this.doc.cm.getStateAfter(lineNumber).base.listStack.length : 0;
    }
  }, {
    key: '_findSameDepthList',
    value: function _findSameDepthList(listNumber, depth, isIncrease) {
      var lineCount = this.doc.lineCount();
      var result = [];
      var i = listNumber;
      var currentLineDepth = void 0;

      while (isIncrease ? i < lineCount - 1 : i > 0) {
        i = isIncrease ? i + 1 : i - 1;
        currentLineDepth = this._getListDepth(i);

        if (currentLineDepth === depth) {
          result.push(i);
        } else if (currentLineDepth < depth) {
          break;
        }
      }

      return result;
    }

    /**
     * Find Sampe depth list before and after the line number,
     * and then same depth lines change using replacer function
     * @param {number} lineNumber line number
     * @param {Function} replacer The function should be called with line numbers and ordinal number as arguments.
     * @private
     */

  }, {
    key: '_changeSameDepthList',
    value: function _changeSameDepthList(lineNumber, replacer) {
      var depth = this._getListDepth(lineNumber);

      var backwardList = this._findSameDepthList(lineNumber, depth, false).reverse();
      var forwardList = this._findSameDepthList(lineNumber, depth, true);
      var sameDepthList = backwardList.concat([lineNumber]).concat(forwardList);

      sameDepthList.forEach(function (lineNum, i) {
        replacer(lineNum, i + 1);
      });
    }

    /**
     * Replace text using regular expression
     * @param {number} lineNumber Line number
     * @param {RegExp} regexp Regexp for find list syntax
     * @param {string} replacePattern Replacement string
     * @private
     */

  }, {
    key: '_replaceLineTextByRegexp',
    value: function _replaceLineTextByRegexp(lineNumber, regexp, replacePattern) {
      var line = this.doc.getLine(lineNumber);
      var currentLineStart = {
        line: lineNumber,
        ch: 0
      };
      var currentLineEnd = {
        line: lineNumber,
        ch: line.length
      };

      line = line.replace(regexp, replacePattern);

      this.doc.replaceRange(line, currentLineStart, currentLineEnd);
    }
  }, {
    key: '_replaceListTypeToUL',
    value: function _replaceListTypeToUL(lineNumber) {
      var lineText = this.doc.getLine(lineNumber);

      if (UL_TASK_SYNTAX_RX.exec(lineText)) {
        this._replaceLineTextByRegexp(lineNumber, UL_TASK_SYNTAX_RX, '$1 ');
      } else if (OL_SYNTAX_RX.exec(lineText)) {
        this._replaceLineTextByRegexp(lineNumber, OL_SYNTAX_RX, '* ');
      }
    }
  }, {
    key: '_replaceListTypeToOL',
    value: function _replaceListTypeToOL(lineNumber, ordinalNumber) {
      var lineText = this.doc.getLine(lineNumber);

      if (FIND_UL_RX.exec(lineText) || FIND_OL_TASK_RX.exec(lineText)) {
        this._replaceLineTextByRegexp(lineNumber, LIST_OR_TASK_SYNTAX_RX, ordinalNumber + '. ');
      } else if (OL_SYNTAX_RX.exec(lineText)) {
        if (parseInt(RegExp.$1, 10) !== ordinalNumber) {
          this._replaceLineTextByRegexp(lineNumber, OL_SYNTAX_RX, ordinalNumber + '. ');
        }
      }
    }

    /**
     * The new list must have a blank line before and after.
     * @param {Array} newListLines lines that changed to list
     * @private
     */

  }, {
    key: '_insertBlankLineForNewList',
    value: function _insertBlankLineForNewList(newListLines) {
      var length = newListLines.length;


      if (length) {
        var startLineNumber = newListLines[0];
        var endLineNumber = newListLines[length - 1];

        if (this._isNotBlankNotListLine(endLineNumber + 1)) {
          this.doc.replaceRange('\n', {
            line: endLineNumber,
            ch: this.doc.getLine(endLineNumber).length
          });
        }

        if (startLineNumber > 0 && this._isNotBlankNotListLine(startLineNumber - 1)) {
          this.doc.replaceRange('\n', {
            line: startLineNumber,
            ch: 0
          });
        }
      }
    }
  }, {
    key: '_isNotBlankNotListLine',
    value: function _isNotBlankNotListLine(lineNumber) {
      return !!this.doc.getLine(lineNumber) && !this._isListLine(lineNumber);
    }
  }]);

  return MdListManager;
}();

exports.default = MdListManager;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileoverview Implements markdown textObject
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Class Markdown textObject
 * @param {MarkdownEditor} mde - MarkdownEditor instance
 * @param {object} range - range
 */
var MdTextObject = function () {
  function MdTextObject(mde, range) {
    _classCallCheck(this, MdTextObject);

    this._mde = mde;

    this.setRange(range || mde.getRange());
  }

  /**
   * Set start
   * @param {object} rangeStart Start of range
   * @private
   */


  _createClass(MdTextObject, [{
    key: '_setStart',
    value: function _setStart(rangeStart) {
      this._start = rangeStart;
    }

    /**
     * Set end
     * @param {object} rangeEnd End of range
     * @private
     */

  }, {
    key: '_setEnd',
    value: function _setEnd(rangeEnd) {
      this._end = rangeEnd;
    }

    /**
     * Set range to given range
     * @param {object} range Range object
     */

  }, {
    key: 'setRange',
    value: function setRange(range) {
      this._setStart(range.start);
      this._setEnd(range.end);
    }

    /**
     * Set start to end
     * @param {object} range Range object
     */

  }, {
    key: 'setEndBeforeRange',
    value: function setEndBeforeRange(range) {
      this._setEnd(range.start);
    }

    /**
     * Expand startOffset by 1
     */

  }, {
    key: 'expandStartOffset',
    value: function expandStartOffset() {
      var start = this._start;

      if (start.ch !== 0) {
        start.ch -= 1;
      }
    }

    /**
     * Expand endOffset by 1
     */

  }, {
    key: 'expandEndOffset',
    value: function expandEndOffset() {
      var end = this._end;

      if (end.ch < this._mde.getEditor().getDoc().getLine(end.line).length) {
        end.ch += 1;
      }
    }

    /**
     * Get current selection's text content
     * @returns {{start: {line: number, ch: number}, end: {line: number, ch: number}}}
     */

  }, {
    key: 'getTextContent',
    value: function getTextContent() {
      return this._mde.getEditor().getRange(this._start, this._end);
    }

    /**
     * Replace current selection's content with given text content
     * @param {string} content Replacement content
     */

  }, {
    key: 'replaceContent',
    value: function replaceContent(content) {
      this._mde.getEditor().replaceRange(content, this._start, this._end, '+input');
    }

    /**
     * Delete current selection's content
     */

  }, {
    key: 'deleteContent',
    value: function deleteContent() {
      this._mde.getEditor().replaceRange('', this._start, this._end, '+delete');
    }

    /**
     * peek StartBeforeOffset
     * @param {number} offset Offset
     * @returns {{start: {line: number, ch: number}, end: {line: number, ch: number}}}
     */

  }, {
    key: 'peekStartBeforeOffset',
    value: function peekStartBeforeOffset(offset) {
      var peekStart = {
        line: this._start.line,
        ch: Math.max(this._start.ch - offset, 0)
      };

      return this._mde.getEditor().getRange(peekStart, this._start);
    }
  }]);

  return MdTextObject;
}();

exports.default = MdTextObject;

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implments wysiwygEditor
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _domUtils = __webpack_require__(4);

var _domUtils2 = _interopRequireDefault(_domUtils);

var _wwClipboardManager = __webpack_require__(58);

var _wwClipboardManager2 = _interopRequireDefault(_wwClipboardManager);

var _wwListManager = __webpack_require__(61);

var _wwListManager2 = _interopRequireDefault(_wwListManager);

var _wwTaskManager = __webpack_require__(62);

var _wwTaskManager2 = _interopRequireDefault(_wwTaskManager);

var _wwTableManager = __webpack_require__(38);

var _wwTableManager2 = _interopRequireDefault(_wwTableManager);

var _wwTableSelectionManager = __webpack_require__(39);

var _wwTableSelectionManager2 = _interopRequireDefault(_wwTableSelectionManager);

var _wwHrManager = __webpack_require__(63);

var _wwHrManager2 = _interopRequireDefault(_wwHrManager);

var _wwPManager = __webpack_require__(64);

var _wwPManager2 = _interopRequireDefault(_wwPManager);

var _wwHeadingManager = __webpack_require__(65);

var _wwHeadingManager2 = _interopRequireDefault(_wwHeadingManager);

var _wwCodeBlockManager = __webpack_require__(40);

var _wwCodeBlockManager2 = _interopRequireDefault(_wwCodeBlockManager);

var _squireExt = __webpack_require__(66);

var _squireExt2 = _interopRequireDefault(_squireExt);

var _keyMapper = __webpack_require__(20);

var _keyMapper2 = _interopRequireDefault(_keyMapper);

var _wwTextObject = __webpack_require__(68);

var _wwTextObject2 = _interopRequireDefault(_wwTextObject);

var _componentManager = __webpack_require__(37);

var _componentManager2 = _interopRequireDefault(_componentManager);

var _codeBlockGadget = __webpack_require__(69);

var _codeBlockGadget2 = _interopRequireDefault(_codeBlockGadget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var keyMapper = _keyMapper2.default.getSharedInstance();

var FIND_EMPTY_LINE = /<([a-z]+|h\d)>(<br>|<br \/>)<\/\1>/gi;
var FIND_UNNECESSARY_BR = /(?:<br>|<br \/>)<\/(.+?)>/gi;
var FIND_BLOCK_TAGNAME_RX = /\b(H[\d]|LI|P|BLOCKQUOTE|TD|PRE)\b/;
var FIND_OPENING_SPAN_WITH_SPACE = /<span([^>]*)>[\u0020]/g;
var FIND_CLOSING_SPAN_WITH_SPACE = /[\u0020]<\/span>/g;
var FIND_TABLE_AND_HEADING_RX = /^(TABLE|H[1-6])$/;

var EDITOR_CONTENT_CSS_CLASSNAME = 'tui-editor-contents';
var PLACEHOLDER_CSS_CLASSNAME = 'tui-editor-contents-placeholder';

var canObserveMutations = typeof MutationObserver !== 'undefined';

/**
 * Class WysiwygEditor
 * @param {jQuery} $el element to insert editor
 * @param {EventManager} eventManager EventManager instance
 */

var WysiwygEditor = function () {
  function WysiwygEditor($el, eventManager) {
    var _this = this;

    _classCallCheck(this, WysiwygEditor);

    this.componentManager = new _componentManager2.default(this);
    this.eventManager = eventManager;
    this.$editorContainerEl = $el;

    this._height = 0;

    this._silentChange = false;

    this._keyEventHandlers = {};
    this._managers = {};
    this._linkAttribute = {};

    this._initEvent();
    this._initDefaultKeyEventHandler();

    this.debouncedPostProcessForChange = _tuiCodeSnippet2.default.debounce(function () {
      return _this.postProcessForChange();
    }, 0);
  }

  /**
   * init
   * @param {boolean} useDefaultHTMLSanitizer - whether to use default html sanitizer
   */


  _createClass(WysiwygEditor, [{
    key: 'init',
    value: function init(useDefaultHTMLSanitizer) {
      var $editorBody = (0, _jquery2.default)('<div />');

      this.$editorContainerEl.append($editorBody);

      this.editor = new _squireExt2.default($editorBody[0], {
        blockTag: 'DIV',
        leafNodeNames: {
          'HR': false
        },
        allowedBlocks: useDefaultHTMLSanitizer ? [] : ['details', 'summary']
      });
      this.editor.blockCommandShortcuts();

      this._clipboardManager = new _wwClipboardManager2.default(this);
      this._initSquireEvent();
      this._clipboardManager.init();

      this.get$Body().addClass(EDITOR_CONTENT_CSS_CLASSNAME);
      this.$editorContainerEl.css('position', 'relative');
      this._togglePlaceholder();

      this.codeBlockGadget = new _codeBlockGadget2.default({
        eventManager: this.eventManager,
        container: this.$editorContainerEl,
        wysiwygEditor: this
      });
    }

    /**
     * Initialize EventManager event handler
     * @private
     */

  }, {
    key: '_initEvent',
    value: function _initEvent() {
      var _this2 = this;

      this.eventManager.listen('wysiwygKeyEvent', function (ev) {
        return _this2._runKeyEventHandlers(ev.data, ev.keyMap);
      });
      this.eventManager.listen('wysiwygRangeChangeAfter', function () {
        return _this2.scrollIntoCursor();
      });
      this.eventManager.listen('contentChangedFromWysiwyg', function () {
        _this2._togglePlaceholder();
      });
    }

    /**
     * Add key event handler
     * @param {string|Array.<string>} keyMap - keyMap string or array of string
     * @param {function} handler handler
     */

  }, {
    key: 'addKeyEventHandler',
    value: function addKeyEventHandler(keyMap, handler) {
      var _this3 = this;

      if (!handler) {
        handler = keyMap;
        keyMap = 'DEFAULT';
      }

      if (!_tuiCodeSnippet2.default.isArray(keyMap)) {
        keyMap = [keyMap];
      }

      keyMap.forEach(function (key) {
        if (!_this3._keyEventHandlers[key]) {
          _this3._keyEventHandlers[key] = [];
        }
        _this3._keyEventHandlers[key].push(handler);
      });
    }

    /**
     * Remove key event handler.
     * @param {string} keyMap keyMap string
     * @param {function} handler handler
     */

  }, {
    key: 'removeKeyEventHandler',
    value: function removeKeyEventHandler(keyMap, handler) {
      if (!handler) {
        handler = keyMap;
        keyMap = 'DEFAULT';
      }

      var handlers = this._keyEventHandlers[keyMap];

      if (handlers) {
        this._keyEventHandlers[keyMap] = handlers.filter(function (_handler) {
          return _handler !== handler;
        });
      }
    }

    /**
     * Run key event handler
     * @param {Event} event event object
     * @param {string} keyMap keyMapString
     * @private
     */

  }, {
    key: '_runKeyEventHandlers',
    value: function _runKeyEventHandlers(event, keyMap) {
      var range = this.getRange();
      var handlers = void 0,
          isNeedNext = void 0;

      handlers = this._keyEventHandlers.DEFAULT;

      if (handlers) {
        _tuiCodeSnippet2.default.forEachArray(handlers, function (handler) {
          isNeedNext = handler(event, range, keyMap);

          return isNeedNext;
        });
      }

      handlers = this._keyEventHandlers[keyMap];

      if (handlers && isNeedNext !== false) {
        _tuiCodeSnippet2.default.forEachArray(handlers, function (handler) {
          return handler(event, range, keyMap);
        });
      }
    }

    /**
     * Initialize squire event
     * @private
     */

  }, {
    key: '_initSquireEvent',
    value: function _initSquireEvent() {
      var _this4 = this;

      var squire = this.getEditor();
      var isNeedFirePostProcessForRangeChange = false;

      squire.addEventListener('copy', function (clipboardEvent) {
        _this4.eventManager.emit('copy', {
          source: 'wysiwyg',
          data: clipboardEvent
        });
        _tuiCodeSnippet2.default.debounce(function () {
          if (!_this4.isEditorValid()) {
            return;
          }

          _this4.eventManager.emit('copyAfter', {
            source: 'wysiwyg',
            data: clipboardEvent
          });
        })();
      });

      squire.addEventListener(_tuiCodeSnippet2.default.browser.msie ? 'beforecut' : 'cut', function (clipboardEvent) {
        _this4.eventManager.emit('cut', {
          source: 'wysiwyg',
          data: clipboardEvent
        });
        _tuiCodeSnippet2.default.debounce(function () {
          if (!_this4.isEditorValid()) {
            return;
          }

          _this4.eventManager.emit('cutAfter', {
            source: 'wysiwyg',
            data: clipboardEvent
          });
        })();
      });

      squire.addEventListener(_tuiCodeSnippet2.default.browser.msie ? 'beforepaste' : 'paste', function (clipboardEvent) {
        _this4.eventManager.emit('paste', {
          source: 'wysiwyg',
          data: clipboardEvent
        });
      });

      squire.addEventListener('dragover', function (ev) {
        ev.preventDefault();

        return false;
      });

      squire.addEventListener('drop', function (ev) {
        ev.preventDefault();

        _this4.eventManager.emit('drop', {
          source: 'wysiwyg',
          data: ev
        });

        return false;
      });

      // change event will fired after range has been updated
      squire.addEventListener('input', _tuiCodeSnippet2.default.debounce(function () {
        if (!_this4.isEditorValid()) {
          return;
        }

        if (!_this4._silentChange) {
          var eventObj = {
            source: 'wysiwyg'
          };

          _this4.eventManager.emit('changeFromWysiwyg', eventObj);
          _this4.eventManager.emit('change', eventObj);
          _this4.eventManager.emit('contentChangedFromWysiwyg', _this4);
        } else {
          _this4._silentChange = false;
        }

        _this4.getEditor().preserveLastLine();
      }, 0));

      squire.addEventListener('keydown', function (keyboardEvent) {
        var range = _this4.getEditor().getSelection();

        if (!range.collapsed) {
          isNeedFirePostProcessForRangeChange = true;
        }

        _this4.eventManager.emit('keydown', {
          source: 'wysiwyg',
          data: keyboardEvent
        });

        _this4._onKeyDown(keyboardEvent);
      });

      if (_tuiCodeSnippet2.default.browser.firefox) {
        squire.addEventListener('keypress', function (keyboardEvent) {
          var keyCode = keyboardEvent.keyCode;


          if (keyCode === 13 || keyCode === 9) {
            var range = _this4.getEditor().getSelection();

            if (!range.collapsed) {
              isNeedFirePostProcessForRangeChange = true;
            }

            _this4.eventManager.emit('keydown', {
              source: 'wysiwyg',
              data: keyboardEvent
            });

            _this4._onKeyDown(keyboardEvent);
          }
        });

        // firefox produces shattered text nodes
        squire.addEventListener('keyup', function () {
          var range = _this4.getRange();

          if (_domUtils2.default.isTextNode(range.commonAncestorContainer) && _domUtils2.default.isTextNode(range.commonAncestorContainer.previousSibling)) {
            var prevLen = range.commonAncestorContainer.previousSibling.length;
            var curEl = range.commonAncestorContainer;

            range.commonAncestorContainer.previousSibling.appendData(range.commonAncestorContainer.data);

            range.setStart(range.commonAncestorContainer.previousSibling, prevLen + range.startOffset);
            range.collapse(true);

            curEl.parentNode.removeChild(curEl);

            _this4.setRange(range);
            range.detach();
          }
        });
      }

      squire.addEventListener('keyup', function (keyboardEvent) {
        if (isNeedFirePostProcessForRangeChange) {
          _this4.debouncedPostProcessForChange();
          isNeedFirePostProcessForRangeChange = false;
        }

        _this4.eventManager.emit('keyup', {
          source: 'wysiwyg',
          data: keyboardEvent
        });
      });

      this.$editorContainerEl.on('scroll', function (ev) {
        _this4.eventManager.emit('scroll', {
          source: 'wysiwyg',
          data: ev
        });
      });

      squire.addEventListener('click', function (ev) {
        _this4.eventManager.emit('click', {
          source: 'wysiwyg',
          data: ev
        });
      });

      squire.addEventListener('mousedown', function (ev) {
        _this4.eventManager.emit('mousedown', {
          source: 'wysiwyg',
          data: ev
        });
      });

      squire.addEventListener('mouseover', function (ev) {
        _this4.eventManager.emit('mouseover', {
          source: 'wysiwyg',
          data: ev
        });
      });

      squire.addEventListener('mouseout', function (ev) {
        _this4.eventManager.emit('mouseout', {
          source: 'wysiwyg',
          data: ev
        });
      });

      squire.addEventListener('mouseup', function (ev) {
        _this4.eventManager.emit('mouseup', {
          source: 'wysiwyg',
          data: ev
        });
      });

      squire.addEventListener('contextmenu', function (ev) {
        _this4.eventManager.emit('contextmenu', {
          source: 'wysiwyg',
          data: ev
        });
      });

      squire.addEventListener('focus', function () {
        _this4.eventManager.emit('focus', {
          source: 'wysiwyg'
        });
      });

      squire.addEventListener('blur', function () {
        _this4.fixIMERange();
        _this4.eventManager.emit('blur', {
          source: 'wysiwyg'
        });
      });

      // Toolbar status active/inactive
      squire.addEventListener('pathChange', function (data) {
        var state = {
          bold: /(>B|>STRONG|^B$|^STRONG$)/.test(data.path),
          italic: /(>I|>EM|^I$|^EM$)/.test(data.path),
          strike: /(^S>|>S$|>S>|^S$)/.test(data.path),
          code: /CODE/.test(data.path),
          codeBlock: /PRE/.test(data.path),
          quote: /BLOCKQUOTE/.test(data.path),
          list: /LI(?!.task-list-item)/.test(_this4._getLastLiString(data.path)),
          task: /LI.task-list-item/.test(_this4._getLastLiString(data.path)),
          source: 'wysiwyg'
        };

        _this4.eventManager.emit('stateChange', state);
      });

      squire.addEventListener('willPaste', function (ev) {
        // ev has 'fragment' when event occurs from 'insertHTML' of squire
        // ev has 'text' when event occurs from 'insertPlainText' of squire
        if (ev.fragment) {
          _this4.eventManager.emit('willPaste', {
            source: 'wysiwyg',
            data: ev
          });
        }
      });
    }
  }, {
    key: '_togglePlaceholder',
    value: function _togglePlaceholder() {
      var squire = this.getEditor();
      squire.modifyDocument(function () {
        var root = squire.getRoot();
        if (root.textContent || root.childNodes.length > 1) {
          root.classList.remove(PLACEHOLDER_CSS_CLASSNAME);
        } else {
          root.classList.add(PLACEHOLDER_CSS_CLASSNAME);
        }
      });
    }

    /**
     * Return last matched list item path string matched index to end
     * @param {string} path Full path string of current selection
     * @returns {string}
     * @private
     */

  }, {
    key: '_getLastLiString',
    value: function _getLastLiString(path) {
      var foundedListItem = /LI[^UO]*$/.exec(path);
      var result = void 0;

      if (foundedListItem) {
        result = foundedListItem[0];
      } else {
        result = '';
      }

      return result;
    }

    /**
     * Handler of keydown event
     * @param {object} keyboardEvent Event object
     * @private
     */

  }, {
    key: '_onKeyDown',
    value: function _onKeyDown(keyboardEvent) {
      var keyMap = keyMapper.convert(keyboardEvent);

      // to avoid duplicate event firing in firefox
      if (keyboardEvent.keyCode) {
        this.eventManager.emit('keyMap', {
          source: 'wysiwyg',
          keyMap: keyMap,
          data: keyboardEvent
        });

        if (!keyboardEvent.defaultPrevented) {
          this.eventManager.emit('wysiwygKeyEvent', {
            keyMap: keyMap,
            data: keyboardEvent
          });
        }
      }
    }

    /**
     * Initialize default event handler
     * @private
     */

  }, {
    key: '_initDefaultKeyEventHandler',
    value: function _initDefaultKeyEventHandler() {
      var _this5 = this;

      this.addKeyEventHandler('ENTER', function (ev, range) {
        if (_this5._isInOrphanText(range)) {
          // We need this cuz input text right after table make orphan text in webkit
          _this5.defer(function () {
            _this5._wrapDefaultBlockToOrphanTexts();
            _this5.breakToNewDefaultBlock(range, 'before');
          });
        }

        _this5.defer(function () {
          return _this5.scrollIntoCursor();
        });
      });

      this.addKeyEventHandler('TAB', function (ev) {
        var sq = _this5.getEditor();
        var range = sq.getSelection();
        var isAbleToInput4Spaces = range.collapsed && _this5._isCursorNotInRestrictedAreaOfTabAction(sq);
        var isTextSelection = !range.collapsed && _domUtils2.default.isTextNode(range.commonAncestorContainer);

        ev.preventDefault();
        if (isAbleToInput4Spaces || isTextSelection) {
          sq.insertPlainText('\xA0\xA0\xA0\xA0');

          return false;
        }

        return true;
      });

      this.addKeyEventHandler('BACK_SPACE', function (ev, range, keymap) {
        return _this5._handleRemoveKeyEvent(ev, range, keymap);
      });
      this.addKeyEventHandler('DELETE', function (ev, range, keymap) {
        return _this5._handleRemoveKeyEvent(ev, range, keymap);
      });
    }
  }, {
    key: '_handleRemoveKeyEvent',
    value: function _handleRemoveKeyEvent(ev, range, keyMap) {
      var sq = this.getEditor();

      if (this._isStartHeadingOrTableAndContainsThem(range)) {
        var keyStr = keyMap === 'BACK_SPACE' ? 'backspace' : 'delete';

        sq.removeAllFormatting();
        sq._keyHandlers[keyStr](sq, ev, sq.getSelection());
        sq.removeLastUndoStack();

        return false;
      }

      return true;
    }
  }, {
    key: '_isStartHeadingOrTableAndContainsThem',
    value: function _isStartHeadingOrTableAndContainsThem(range) {
      var startContainer = range.startContainer,
          startOffset = range.startOffset,
          commonAncestorContainer = range.commonAncestorContainer,
          collapsed = range.collapsed;

      var root = this.getEditor().getRoot();
      var result = false;

      if (!collapsed && commonAncestorContainer === root) {
        if (startContainer === root) {
          result = FIND_TABLE_AND_HEADING_RX.test(_domUtils2.default.getChildNodeByOffset(startContainer, startOffset).nodeName);
        } else if (startOffset === 0) {
          result = FIND_TABLE_AND_HEADING_RX.test(_domUtils2.default.getParentUntil(startContainer, root).nodeName);
        }
      }

      return result;
    }
  }, {
    key: '_wrapDefaultBlockToOrphanTexts',
    value: function _wrapDefaultBlockToOrphanTexts() {
      var textNodes = this.get$Body().contents().filter(this.findTextNodeFilter);

      textNodes.each(function (i, node) {
        if (node.nextSibling && node.nextSibling.tagName === 'BR') {
          (0, _jquery2.default)(node.nextSibling).remove();
        }

        (0, _jquery2.default)(node).wrap('<div />');
      });
    }

    /**
     * check if range is orphan text
     * @param {Range} range range
     * @returns {boolean} result
     * @private
     */

  }, {
    key: '_isInOrphanText',
    value: function _isInOrphanText(range) {
      return range.startContainer.nodeType === Node.TEXT_NODE && range.startContainer.parentNode === this.get$Body()[0];
    }

    /**
     * Wrap default block to passed range
     * @param {Range} range range
     * @private
     */

  }, {
    key: '_wrapDefaultBlockTo',
    value: function _wrapDefaultBlockTo(range) {
      this.saveSelection(range);
      this._joinSplitedTextNodes();
      this.restoreSavedSelection();

      range = this.getRange();

      var textElem = range.startContainer;
      var cursorOffset = range.startOffset;

      // after code below, range range is arranged by body
      var block = this.getEditor().createDefaultBlock([range.startContainer]);

      // range for insert block
      var insertTargetNode = _domUtils2.default.getChildNodeByOffset(range.startContainer, range.startOffset);
      if (insertTargetNode) {
        range.setStartBefore(insertTargetNode);
      } else {
        // only child in container
        range.selectNodeContents(range.startContainer);
      }

      range.collapse(true);

      range.insertNode(block);

      // revert range to original node
      range.setStart(textElem, cursorOffset);
      range.collapse(true);

      this.setRange(range);
    }

    /**
     * findTextNodeFilter
     * @returns {boolean} true or not
     */

  }, {
    key: 'findTextNodeFilter',
    value: function findTextNodeFilter() {
      return this.nodeType === Node.TEXT_NODE;
    }

    /**
     * Join spliated text nodes
     * @private
     */

  }, {
    key: '_joinSplitedTextNodes',
    value: function _joinSplitedTextNodes() {
      var prevNode = void 0,
          lastGroup = void 0;
      var nodesToRemove = [];
      var textNodes = this.get$Body().contents().filter(this.findTextNodeFilter);

      textNodes.each(function (i, node) {
        if (prevNode === node.previousSibling) {
          lastGroup.nodeValue += node.nodeValue;
          nodesToRemove.push(node);
        } else {
          lastGroup = node;
        }

        prevNode = node;
      });

      (0, _jquery2.default)(nodesToRemove).remove();
    }

    /**
     * Save current selection before modification
     * @param {Range} range Range object
     */

  }, {
    key: 'saveSelection',
    value: function saveSelection(range) {
      if (!range) {
        range = this.getRange();
      }

      this.getEditor()._saveRangeToBookmark(range);
    }

    /**
     * set selection by start/end container/offset
     * @param {HTMLNode} startContainer - start container
     * @param {Number} startOffset - start offset
     * @param {HTMLNode} endContainer - end container
     * @param {Number} endOffset - end offset
     * @returns {Range} - range instance
     */

  }, {
    key: 'setSelectionByContainerAndOffset',
    value: function setSelectionByContainerAndOffset(startContainer, startOffset, endContainer, endOffset) {
      var sq = this.getEditor();
      var range = sq.getSelection();
      range.setStart(startContainer, startOffset);
      range.setEnd(endContainer, endOffset);
      sq.setSelection(range);

      return range;
    }

    /**
     * Restore saved selection
     */

  }, {
    key: 'restoreSavedSelection',
    value: function restoreSavedSelection() {
      this.setRange(this.getEditor()._getRangeAndRemoveBookmark());
    }

    /**
     * Reset wysiwyg editor
     */

  }, {
    key: 'reset',
    value: function reset() {
      this.setValue('');
    }

    /**
     * Change current range block format to passed tag
     * @param {string} targetTagName Target element tag name
     */

  }, {
    key: 'changeBlockFormatTo',
    value: function changeBlockFormatTo(targetTagName) {
      this.getEditor().changeBlockFormatTo(targetTagName);
      this.eventManager.emit('wysiwygRangeChangeAfter', this);
    }

    /**
     * Make empty block to current selection
     */

  }, {
    key: 'makeEmptyBlockCurrentSelection',
    value: function makeEmptyBlockCurrentSelection() {
      var _this6 = this;

      this.getEditor().modifyBlocks(function (frag) {
        if (!frag.textContent) {
          frag = _this6.getEditor().createDefaultBlock();
        }

        return frag;
      });
    }

    /**
     * Focus to editor
     */

  }, {
    key: 'focus',
    value: function focus() {
      var scrollTop = this.scrollTop();

      this.editor.focus();

      // In webkit, if contenteditable element focus method have been invoked when another input element has focus,
      // contenteditable scroll to top automatically so we need scroll it back
      if (scrollTop !== this.scrollTop()) {
        this.scrollTop(scrollTop);
      }
    }

    /**
     * Remove focus of editor
     */

  }, {
    key: 'blur',
    value: function blur() {
      this.editor.blur();
    }

    /**
     * Remove wysiwyg editor
     */

  }, {
    key: 'remove',
    value: function remove() {
      this.$editorContainerEl.off('scroll');
      this.getEditor().destroy();
      this.editor = null;
      this.$body = null;
      this.eventManager = null;
    }

    /**
     * Set editor height
     * @param {number|string} height pixel of height or "auto"
     */

  }, {
    key: 'setHeight',
    value: function setHeight(height) {
      this._height = height;

      this.$editorContainerEl.css('overflow', 'auto');
      this.$editorContainerEl.css('height', '100%');
      this.$editorContainerEl.parent().height(height);

      var paddingHeight = parseInt(this.$editorContainerEl.css('padding-top'), 10) - parseInt(this.$editorContainerEl.css('padding-bottom'), 10);
      var marginHeight = parseInt(this.get$Body().css('margin-top'), 10) - parseInt(this.get$Body().css('margin-bottom'), 10);
      this.get$Body().css('min-height', height - marginHeight - paddingHeight + 'px');
    }

    /**
     * Set min height
     * @param {number} minHeight - min height in px
     */

  }, {
    key: 'setMinHeight',
    value: function setMinHeight(minHeight) {
      var editorBody = this.get$Body().get(0);
      editorBody.style.minHeight = minHeight + 'px';
    }

    /**
     * Set the placeholder to wysiwyg editor
     * @param {string} placeholder - placeholder to set
     */

  }, {
    key: 'setPlaceholder',
    value: function setPlaceholder(placeholder) {
      if (placeholder) {
        this.getEditor().getRoot().setAttribute('data-placeholder', placeholder);
      }
    }

    /**
     * Set attribute of link for wysiwyg
     * @param {object} attribute - attribute of anchor tag
     */

  }, {
    key: 'setLinkAttribute',
    value: function setLinkAttribute(attribute) {
      this._linkAttribute = attribute;
    }

    /**
     * Get attribute of link for wysiwyg
     * @returns {object} attribute - attribute of anchor tag
     */

  }, {
    key: 'getLinkAttribute',
    value: function getLinkAttribute() {
      return this._linkAttribute;
    }

    /**
     * Set value to wysiwyg editor
     * @param {string} html - HTML text
     * @param {boolean} [cursorToEnd=true] - move cursor to contents end
     */

  }, {
    key: 'setValue',
    value: function setValue(html) {
      var cursorToEnd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      html = this.eventManager.emitReduce('wysiwygSetValueBefore', html);

      this.editor.setHTML(html);

      this.eventManager.emit('wysiwygSetValueAfter', this);
      this.eventManager.emit('contentChangedFromWysiwyg', this);

      if (cursorToEnd) {
        this.moveCursorToEnd();
      }

      this.getEditor().preserveLastLine();

      this.getEditor().removeLastUndoStack();
      this.getEditor().saveUndoState();
    }

    /**
     * Insert given text to cursor position or selected area
     * @param {string} text - text string to insert
     */

  }, {
    key: 'insertText',
    value: function insertText(text) {
      this.editor.insertPlainText(text);
    }

    /**
     * Get value of wysiwyg editor
     * @returns {string} html
     */

  }, {
    key: 'getValue',
    value: function getValue() {
      this._prepareGetHTML();

      var html = this.editor.getHTML();

      // empty line replace to br
      html = html.replace(FIND_EMPTY_LINE, function (match, tag) {
        var result = void 0;

        // we maintain empty list
        if (tag === 'li') {
          result = match;
          // we maintain empty table
        } else if (tag === 'td' || tag === 'th') {
          result = '<' + tag + '></' + tag + '>';
        } else {
          result = '<br />';
        }

        return result;
      });

      // replace a space of the first and end in sapn tag to &nbsp;.
      html = html.replace(FIND_OPENING_SPAN_WITH_SPACE, '<span$1>&nbsp;');
      html = html.replace(FIND_CLOSING_SPAN_WITH_SPACE, '&nbsp;</span>');

      // remove unnecessary brs
      html = html.replace(FIND_UNNECESSARY_BR, '</$1>');

      // remove contenteditable block, in this case div
      html = html.replace(/<div[^>]*>/g, '');
      html = html.replace(/<\/div>/g, '<br />');

      html = this.eventManager.emitReduce('wysiwygProcessHTMLText', html);

      return html;
    }

    /**
     * Prepare before get html
     * @private
     */

  }, {
    key: '_prepareGetHTML',
    value: function _prepareGetHTML() {
      var _this7 = this;

      this.getEditor().modifyDocument(function () {
        _this7._joinSplitedTextNodes();
        _this7.eventManager.emit('wysiwygGetValueBefore', _this7);
      });
    }

    /**
     * postProcessForChange
     */

  }, {
    key: 'postProcessForChange',
    value: function postProcessForChange() {
      var _this8 = this;

      if (!this.isEditorValid()) {
        return;
      }

      this.getEditor().modifyDocument(function () {
        _this8.eventManager.emit('wysiwygRangeChangeAfter', _this8);
      });
    }

    /**
     * Ready to silent change
     */

  }, {
    key: 'readySilentChange',
    value: function readySilentChange() {
      if (canObserveMutations && !this.getEditor().isIgnoreChange()) {
        this._silentChange = true;
      }
    }

    /**
     * Get squire
     * @returns {SquireExt} squire
     */

  }, {
    key: 'getEditor',
    value: function getEditor() {
      return this.editor;
    }

    /**
     * Replace text of passed range
     * @param {string} content Content for change current selection
     * @param {Range} range range
     */

  }, {
    key: 'replaceSelection',
    value: function replaceSelection(content, range) {
      this.getEditor().replaceSelection(content, range);
    }

    /**
     * Replace content by relative offset
     * @param {string} content Content for change current selection
     * @param {number} offset Offset of current range
     * @param {number} overwriteLength Length to overwrite content
     */

  }, {
    key: 'replaceRelativeOffset',
    value: function replaceRelativeOffset(content, offset, overwriteLength) {
      this.getEditor().replaceRelativeOffset(content, offset, overwriteLength);
    }

    /**
     * Add widget to selection
     * @param {Range} range Range object
     * @param {Node} node Widget node
     * @param {string} style Adding style "over" or "bottom"
     * @param {number} [offset] Offset to adjust position
     */

  }, {
    key: 'addWidget',
    value: function addWidget(range, node, style, offset) {
      var pos = this.getEditor().getSelectionPosition(range, style, offset);
      var editorContainerPos = this.$editorContainerEl.offset();

      this.$editorContainerEl.append(node);

      (0, _jquery2.default)(node).css({
        position: 'absolute',
        top: pos.top - editorContainerPos.top + this.scrollTop(),
        left: pos.left - editorContainerPos.left
      });
    }

    /**
     * Get jQuery wrapped body container of Squire
     * @returns {JQuery} jquery body
     */

  }, {
    key: 'get$Body',
    value: function get$Body() {
      return this.getEditor().get$Body();
    }

    /**
     * Check with given regexp whether current path has some format or not
     * @param {RegExp} rx Regexp
     * @returns {boolean} Match result
     */

  }, {
    key: 'hasFormatWithRx',
    value: function hasFormatWithRx(rx) {
      return this.getEditor().getPath().match(rx);
    }

    /**
     * Break line to new default block from passed range
     * @param {Range} range Range object
     * @param {string} [where] "before" or not
     */

  }, {
    key: 'breakToNewDefaultBlock',
    value: function breakToNewDefaultBlock(range, where) {
      var div = this.editor.createDefaultBlock();
      var currentNode = _domUtils2.default.getChildNodeByOffset(range.startContainer, range.startOffset) || _domUtils2.default.getChildNodeByOffset(range.startContainer, range.startOffset - 1);
      var appendBefore = _domUtils2.default.getParentUntil(currentNode, this.get$Body()[0]);

      if (where === 'before') {
        (0, _jquery2.default)(appendBefore).before(div);
      } else {
        (0, _jquery2.default)(appendBefore).after(div);
      }

      range.setStart(div, 0);
      range.collapse(true);
      this.setRange(range);
    }

    /**
     * Replace textContet of node
     * @param {Node} container Container node
     * @param {string} from Target text to change
     * @param {string} to Replacement text
     */

  }, {
    key: 'replaceContentText',
    value: function replaceContentText(container, from, to) {
      var before = (0, _jquery2.default)(container).html();
      (0, _jquery2.default)(container).html(before.replace(from, to));
    }

    /**
     * Unwrap Block tag of current range
     * @param {function} [condition] iterate with tagName
     */

  }, {
    key: 'unwrapBlockTag',
    value: function unwrapBlockTag(condition) {
      if (!condition) {
        condition = function condition(tagName) {
          return FIND_BLOCK_TAGNAME_RX.test(tagName);
        };
      }

      this.getEditor().changeBlockFormat(condition);
      this.eventManager.emit('wysiwygRangeChangeAfter', this);
    }

    /**
     * move scroll to cursor
     * scrollIntoView browser function may cause scrolling on document.
     * this function aims to replace scrollIntoView function to prevent that.
     * it will move the scroll of squire only.
     */

  }, {
    key: 'scrollIntoCursor',
    value: function scrollIntoCursor() {
      var scrollTop = this.scrollTop();

      var _getEditor$getCursorP = this.getEditor().getCursorPosition(),
          cursorTop = _getEditor$getCursorP.top,
          cursorHeight = _getEditor$getCursorP.height;

      var _$editorContainerEl$g = this.$editorContainerEl.get(0).getBoundingClientRect(),
          editorTop = _$editorContainerEl$g.top,
          editorHeight = _$editorContainerEl$g.height;

      var cursorAboveEditor = cursorTop - editorTop;
      var cursorBelowEditor = cursorTop + cursorHeight - (editorTop + editorHeight);

      if (cursorAboveEditor < 0) {
        this.scrollTop(scrollTop + cursorAboveEditor);
      } else if (cursorBelowEditor > 0) {
        this.scrollTop(Math.ceil(scrollTop + cursorBelowEditor));
      }
    }

    /**
     * Set cursor position to end
     */

  }, {
    key: 'moveCursorToEnd',
    value: function moveCursorToEnd() {
      this.getEditor().moveCursorToEnd();
      this.scrollIntoCursor();
      this._correctRangeAfterMoveCursor('end');
    }

    /**
     * Set cursor position to start
     */

  }, {
    key: 'moveCursorToStart',
    value: function moveCursorToStart() {
      this.getEditor().moveCursorToStart();
      this.scrollTop(0);
    }

    /**
     * Set cursor position to start
     * @param {number} value Scroll amount
     * @returns {boolean}
     */

  }, {
    key: 'scrollTop',
    value: function scrollTop(value) {
      if (_tuiCodeSnippet2.default.isUndefined(value)) {
        return this.$editorContainerEl.scrollTop();
      }

      return this.$editorContainerEl.scrollTop(value);
    }

    /**
     * For arrange Range after moveCursorToEnd api invocation. Squire has bug in Firefox, IE.
     * @param {string} direction Direction of cursor move
     * @private
     */

  }, {
    key: '_correctRangeAfterMoveCursor',
    value: function _correctRangeAfterMoveCursor(direction) {
      var range = this.getRange();
      var cursorContainer = this.get$Body().get(0);

      if (direction === 'start') {
        while (cursorContainer.firstChild) {
          cursorContainer = cursorContainer.firstChild;
        }
      } else {
        while (cursorContainer.lastChild) {
          cursorContainer = cursorContainer.lastChild;
        }
      }

      // IE have problem with cursor after br
      if (cursorContainer.tagName === 'BR') {
        range.setStartBefore(cursorContainer);
      } else {
        range.setStartAfter(cursorContainer);
      }

      range.collapse(true);

      this.setRange(range);
    }

    /**
     * Get current Range object
     * @returns {Range}
     */

  }, {
    key: 'getRange',
    value: function getRange() {
      return this.getEditor().getSelection().cloneRange();
    }

    /**
     * get IME range
     * cjk composition causes wrong caret position.
     * it returns fixed IME composition range
     * @returns {Range}
     */

  }, {
    key: 'getIMERange',
    value: function getIMERange() {
      var range = void 0;
      var selection = getSelection();

      if (selection && selection.rangeCount) {
        range = selection.getRangeAt(0).cloneRange();
      }

      return range;
    }

    /**
     * get IME range
     * cjk composition causes wrong caret position.
     * it sets fixed IME composition range
     */

  }, {
    key: 'fixIMERange',
    value: function fixIMERange() {
      var range = this.getIMERange();

      // range exists and it's an WYSIWYG editor content
      if (range && (0, _jquery2.default)(range.commonAncestorContainer).closest(this.$editorContainerEl).length) {
        this.setRange(range);
      }
    }

    /**
     * set range
     * @param {Range} range - range to set
     */

  }, {
    key: 'setRange',
    value: function setRange(range) {
      this.getEditor().setSelection(range);
    }

    /**
     * Check whether passed range is in table or not
     * @param {Range} range range
     * @returns {boolean} result
     */

  }, {
    key: 'isInTable',
    value: function isInTable(range) {
      var target = range.collapsed ? range.startContainer : range.commonAncestorContainer;

      return !!(0, _jquery2.default)(target).closest('[contenteditable=true] table').length;
    }

    /**
     * Get text object of current range
     * @param {Range} range Range object
     * @returns {WwTextObject}
     */

  }, {
    key: 'getTextObject',
    value: function getTextObject(range) {
      return new _wwTextObject2.default(this, range);
    }
  }, {
    key: 'defer',
    value: function defer(callback, delayOffset) {
      var _this9 = this;

      var delay = delayOffset ? delayOffset : 0;

      setTimeout(function () {
        if (_this9.isEditorValid()) {
          callback(_this9);
        }
      }, delay);
    }
  }, {
    key: 'isEditorValid',
    value: function isEditorValid() {
      return this.getEditor() && _jquery2.default.contains(this.$editorContainerEl[0].ownerDocument, this.$editorContainerEl[0]);
    }
  }, {
    key: '_isCursorNotInRestrictedAreaOfTabAction',
    value: function _isCursorNotInRestrictedAreaOfTabAction(editor) {
      return !editor.hasFormat('li') && !editor.hasFormat('blockquote') && !editor.hasFormat('table');
    }

    /**
     * WysiwygEditor factory method
     * @param {jQuery} $el Container element for editor
     * @param {EventManager} eventManager EventManager instance
     * @param {object} [options={}] - option object
     *     @param {boolean} [options.useDefaultHTMLSanitizer=true] - whether to use default html sanitizer
     * @returns {WysiwygEditor} wysiwygEditor
     * @ignore
     */

  }], [{
    key: 'factory',
    value: function factory($el, eventManager, options) {
      var wwe = new WysiwygEditor($el, eventManager, options);

      wwe.init(options.useDefaultHTMLSanitizer);

      wwe.componentManager.addManager(_wwListManager2.default);
      wwe.componentManager.addManager(_wwTaskManager2.default);
      wwe.componentManager.addManager(_wwTableSelectionManager2.default);
      wwe.componentManager.addManager(_wwTableManager2.default);
      wwe.componentManager.addManager(_wwHrManager2.default);
      wwe.componentManager.addManager(_wwPManager2.default);
      wwe.componentManager.addManager(_wwHeadingManager2.default);
      wwe.componentManager.addManager(_wwCodeBlockManager2.default);

      return wwe;
    }
  }]);

  return WysiwygEditor;
}();

exports.default = WysiwygEditor;

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements wysiwyg editor clipboard manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _domUtils = __webpack_require__(4);

var _domUtils2 = _interopRequireDefault(_domUtils);

var _wwPasteContentHelper = __webpack_require__(59);

var _wwPasteContentHelper2 = _interopRequireDefault(_wwPasteContentHelper);

var _wwTablePasteHelper = __webpack_require__(60);

var _wwTablePasteHelper2 = _interopRequireDefault(_wwTablePasteHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PASTE_TABLE_BOOKMARK = 'tui-paste-table-bookmark';
var PASTE_TABLE_CELL_BOOKMARK = 'tui-paste-table-cell-bookmark';

/**
 * Class WwClipboardManager
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @ignore
 */

var WwClipboardManager = function () {
  function WwClipboardManager(wwe) {
    _classCallCheck(this, WwClipboardManager);

    this.wwe = wwe;
    this._pch = new _wwPasteContentHelper2.default(this.wwe);
    this._tablePasteHelper = new _wwTablePasteHelper2.default(this.wwe);
    this._selectedSellCount = 0;
    this._$clipboardArea = null;
  }

  /**
   * initialize
   */


  _createClass(WwClipboardManager, [{
    key: 'init',
    value: function init() {
      var _this = this;

      this.wwe.eventManager.listen('willPaste', function (ev) {
        return _this._executeHandler(_this._onWillPaste.bind(_this), ev);
      });
      this.wwe.eventManager.listen('copy', function (ev) {
        return _this._executeHandler(_this._onCopyCut.bind(_this), ev);
      });
      this.wwe.eventManager.listen('copyAfter', function (ev) {
        return _this._executeHandler(_this._onCopyAfter.bind(_this), ev);
      });
      this.wwe.eventManager.listen('cut', function (ev) {
        return _this._executeHandler(_this._onCopyCut.bind(_this), ev);
      });
      this.wwe.eventManager.listen('cutAfter', function (ev) {
        return _this._executeHandler(_this._onCutAfter.bind(_this), ev);
      });
      this.wwe.eventManager.listen('paste', function (ev) {
        return _this._executeHandler(_this._onPasteIntoTable.bind(_this), ev);
      });
    }
  }, {
    key: '_executeHandler',
    value: function _executeHandler(handler, event) {
      if (event.source === 'wysiwyg') {
        handler(event);
      }
    }
  }, {
    key: '_onCopyCut',
    value: function _onCopyCut(event) {
      var tableManager = this.wwe.componentManager.getManager('tableSelection');
      var selectedCellCount = tableManager.getSelectedCells().length;
      if (!selectedCellCount) {
        // preserve selection range in a cell, let squire do the job
        return;
      }
      if (!tableManager.mergedTableSelectionManager) {
        // set selection range to all contents in selected cells, then squire
        tableManager.createRangeBySelectedCells();

        return;
      }
      var editor = this.wwe.getEditor();
      var clipboardEvent = event.data;
      var range = editor.getSelection().cloneRange();
      var $clipboardContainer = (0, _jquery2.default)('<div />');

      this._extendRange(range);
      $clipboardContainer.append(range.cloneContents());
      this._updateCopyDataForListTypeIfNeed(range, $clipboardContainer);
      this.wwe.eventManager.emit('copyBefore', {
        source: 'wysiwyg',
        $clipboardContainer: $clipboardContainer
      });

      this._setClipboardData(clipboardEvent, $clipboardContainer.html(), $clipboardContainer.text());
    }
  }, {
    key: '_clearClipboardArea',
    value: function _clearClipboardArea() {
      if (this._$clipboardArea) {
        this._$clipboardArea.remove();
        this._$clipboardArea = null;
      }
    }
  }, {
    key: '_onCopyAfter',
    value: function _onCopyAfter() {
      this.wwe.getEditor().get$Body().focus();
      this._clearClipboardArea();
    }
  }, {
    key: '_onCutAfter',
    value: function _onCutAfter() {
      var range = this.wwe.getEditor().getSelection();
      range.deleteContents();
      this.wwe.getEditor().focus();
      this._clearClipboardArea();
    }

    /**
     * Process paste event when occured in table
     * @param {{source: string, data: event}} event - event
     * @private
     */

  }, {
    key: '_onPasteIntoTable',
    value: function _onPasteIntoTable(event) {
      var ev = event.data;

      var range = this.wwe.getEditor().getSelection();

      if (this.wwe.isInTable(range) && this._isSingleCellSelected(range)) {
        this._tablePasteHelper.pasteClipboard(ev);
      }
    }
  }, {
    key: '_isSingleCellSelected',
    value: function _isSingleCellSelected(range) {
      var startContainer = range.startContainer,
          endContainer = range.endContainer;


      return this._getCell(startContainer) === this._getCell(endContainer);
    }
  }, {
    key: '_getCell',
    value: function _getCell(node) {
      return node.nodeName === 'TD' ? node : _domUtils2.default.getParentUntil(node, 'TR');
    }
  }, {
    key: '_replaceNewLineToBr',
    value: function _replaceNewLineToBr(node) {
      var textNodes = _domUtils2.default.getAllTextNode(node);

      textNodes.forEach(function (textNode) {
        if (/\n/.test(textNode.nodeValue)) {
          textNode.parentNode.innerHTML = textNode.nodeValue.replace(/\n/g, '<br>');
        }
      });
    }
  }, {
    key: '_onWillPaste',
    value: function _onWillPaste(event) {
      var _this2 = this;

      var pasteData = event.data;

      var $clipboardContainer = (0, _jquery2.default)('<div>').append(pasteData.fragment.cloneNode(true));
      this._preparePaste($clipboardContainer);
      this._setTableBookmark($clipboardContainer);

      pasteData.fragment = document.createDocumentFragment();
      $clipboardContainer.contents().each(function (index, element) {
        pasteData.fragment.appendChild(element);
      });

      // once right after the squire insertHTML DOM.
      var handler = function handler() {
        _this2.wwe.getEditor().removeEventListener('input', handler);
        _this2.wwe.eventManager.emit('wysiwygRangeChangeAfter', _this2);
        _this2._focusTableBookmark();
      };
      this.wwe.getEditor().addEventListener('input', handler);
    }
  }, {
    key: '_setClipboardData',
    value: function _setClipboardData(clipboardEvent, htmlContent, textContent) {
      if (_tuiCodeSnippet2.default.browser.msie) {
        clipboardEvent.squirePrevented = true;
        this._$clipboardArea = this._createClipboardArea();
        this._$clipboardArea.html(htmlContent);
        this._$clipboardArea.focus();
        window.getSelection().selectAllChildren(this._$clipboardArea[0]);
      } else {
        clipboardEvent.preventDefault();
        clipboardEvent.stopPropagation();
        clipboardEvent.clipboardData.setData('text/html', htmlContent);
        clipboardEvent.clipboardData.setData('text/plain', textContent);
      }
    }
  }, {
    key: '_createClipboardArea',
    value: function _createClipboardArea() {
      return (0, _jquery2.default)('<DIV>').attr({
        contenteditable: 'true',
        style: 'position:fixed; overflow:hidden; top:0; right:100%; width:1px; height:1px;'
      }).appendTo(document.body);
    }

    /**
     * Update copy data, when commonAncestorContainer nodeName is list type like UL or OL.
     * @param {object} range - text range
     * @param {jQuery} $clipboardContainer - clibpard container jQuery element
     * @private
     */

  }, {
    key: '_updateCopyDataForListTypeIfNeed',
    value: function _updateCopyDataForListTypeIfNeed(range, $clipboardContainer) {
      var commonAncestorNodeName = range.commonAncestorContainer.nodeName;
      if (commonAncestorNodeName !== 'UL' && commonAncestorNodeName !== 'OL') {
        return;
      }

      var $newParent = (0, _jquery2.default)('<' + commonAncestorNodeName + ' />');
      $newParent.append($clipboardContainer.html());
      $clipboardContainer.html('');
      $clipboardContainer.append($newParent);
    }

    /**
     * Remove empty font elements.
     * @param {jQuery} $clipboardContainer - cliboard jQuery container
     * @private
     */

  }, {
    key: '_removeEmptyFontElement',
    value: function _removeEmptyFontElement($clipboardContainer) {
      // clipboard data from ms word tend to have unneccesary font tags
      $clipboardContainer.children('font').each(function (index, element) {
        var $element = (0, _jquery2.default)(element);

        if (!$element.text().trim()) {
          $element.remove();
        }
      });
    }

    /**
     * MS Office use specific CSS attributes with mso- prefix.
     * But safari does not support mso- prefix.
     * @param {string} html - html string
     * @returns {boolean}
     * @private
     */

  }, {
    key: '_isFromMs',
    value: function _isFromMs(html) {
      return (/<p style="[^>]*mso-/.test(html)
      );
    }

    /**
     * P tags append 'BR' to make blank line.
     * Our viewer renders new line as P tag with margin.
     * When pasting text from viewer, insert BR between P tags.
     * @param {Node} node - node
     * @private
     */

  }, {
    key: '_preProcessPtag',
    value: function _preProcessPtag(node) {
      var pTags = node.querySelectorAll('p');

      _tuiCodeSnippet2.default.forEachArray(pTags, function (pTag) {
        if (pTag.lastChild && pTag.lastChild.nodeName !== 'BR') {
          pTag.appendChild(document.createElement('br'));
        }

        pTag.appendChild(document.createElement('br'));
      });
    }

    /**
     * Prepare paste.
     * @param {jQuery} $clipboardContainer - temporary jQuery container for clipboard contents
     * @private
     */

  }, {
    key: '_preparePaste',
    value: function _preparePaste($clipboardContainer) {
      // When pasting text, the empty line processing differ our viewer and MS Office.
      // In our viewer case, <p>aaa</p><p>bbb<p> have empty line becuase P tags have margin.
      // In MS Office case, <p>aaa</p><p>bbb<p> do not have empty line becuase P tags means just one line.
      if (!this._isFromMs($clipboardContainer.html())) {
        this._preProcessPtag($clipboardContainer.get(0));
      }

      this._replaceNewLineToBr($clipboardContainer.get(0));
      this._removeEmptyFontElement($clipboardContainer);

      this._pch.preparePaste($clipboardContainer);

      this.wwe.eventManager.emit('pasteBefore', {
        source: 'wysiwyg',
        $clipboardContainer: $clipboardContainer
      });
    }

    /**
     * set table bookmark which will gain focus after document modification ends.
     * @param {jQuery} $clipboardContainer - clipboard container
     * @private
     */

  }, {
    key: '_setTableBookmark',
    value: function _setTableBookmark($clipboardContainer) {
      var $lastNode = (0, _jquery2.default)($clipboardContainer[0].childNodes).last();
      var isLastNodeTable = $lastNode[0] && $lastNode[0].nodeName === 'TABLE';

      if (isLastNodeTable) {
        $lastNode.addClass(PASTE_TABLE_BOOKMARK);
      }
    }

    /**
     * Focus to table after document modification.
     * @param {object} sq - squire editor instance
     * @private
     */

  }, {
    key: '_focusTableBookmark',
    value: function _focusTableBookmark() {
      var sq = this.wwe.getEditor();
      var range = sq.getSelection().cloneRange();
      var $bookmarkedTable = sq.get$Body().find('.' + PASTE_TABLE_BOOKMARK);
      var $bookmarkedCell = sq.get$Body().find('.' + PASTE_TABLE_CELL_BOOKMARK);

      if ($bookmarkedTable.length) {
        $bookmarkedTable.removeClass(PASTE_TABLE_BOOKMARK);
        range.setEndAfter($bookmarkedTable[0]);
        range.collapse(false);
        sq.setSelection(range);
      }
      if ($bookmarkedCell.length) {
        $bookmarkedCell.removeClass(PASTE_TABLE_CELL_BOOKMARK);
        range.selectNodeContents($bookmarkedCell[0]);
        range.collapse(false);
        sq.setSelection(range);
      }
    }

    /**
     * extend range if need
     * @param {Range} range to extend
     * @private
     */

  }, {
    key: '_extendRange',
    value: function _extendRange(range) {
      // non-text node && not selected whole area, then expand the range
      if (_domUtils2.default.isTextNode(range.commonAncestorContainer) && (range.startOffset !== 0 || range.commonAncestorContainer.textContent.length !== range.endOffset) && range.commonAncestorContainer.nodeName !== 'TD') {
        return;
      }

      if (range.startOffset === 0) {
        range = this._extendStartRange(range);
      }

      if (range.endOffset === _domUtils2.default.getOffsetLength(range.endContainer)) {
        range = this._extendEndRange(range);
      }

      // commonAncestor if all of it's children has been selected
      if (this._isWholeCommonAncestorContainerSelected(range)) {
        range.selectNode(range.commonAncestorContainer);
      }
      this.wwe.getEditor().setSelection(range);
    }

    /**
     * Extends current range's startContainer
     * @param {Range} range Range object
     * @returns {Range}
     * @private
     */

  }, {
    key: '_extendStartRange',
    value: function _extendStartRange(range) {
      var newBound = range.startContainer;

      // expand range
      while (newBound.parentNode !== range.commonAncestorContainer && newBound.parentNode !== this.wwe.get$Body()[0] && !newBound.previousSibling) {
        newBound = newBound.parentNode;
      }

      // expand range
      range.setStart(newBound.parentNode, _domUtils2.default.getNodeOffsetOfParent(newBound));

      return range;
    }

    /**
     * Extends current range's endContainer
     * @param {Range} range Range object
     * @returns {Range}
     * @private
     */

  }, {
    key: '_extendEndRange',
    value: function _extendEndRange(range) {
      var newBound = range.endContainer;
      var boundNext = newBound.nextSibling;

      // expand range
      while (newBound.parentNode !== range.commonAncestorContainer && newBound.parentNode !== this.wwe.get$Body()[0] && (!boundNext || _domUtils2.default.getNodeName(boundNext) === 'BR' && newBound.parentNode.lastChild === boundNext)) {
        newBound = newBound.parentNode;
        boundNext = newBound.nextSibling;
      }

      // expand range level
      range.setEnd(newBound.parentNode, _domUtils2.default.getNodeOffsetOfParent(newBound) + 1);

      return range;
    }

    /**
     * Check whether whole commonAncestorContainter textContent selected or not
     * @param {Range} range Range object
     * @returns {boolean} result
     * @private
     */

  }, {
    key: '_isWholeCommonAncestorContainerSelected',
    value: function _isWholeCommonAncestorContainerSelected(range) {
      return range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE && range.commonAncestorContainer !== this.wwe.get$Body()[0] && range.startOffset === 0 && range.endOffset === range.commonAncestorContainer.childNodes.length && range.commonAncestorContainer === range.startContainer && range.commonAncestorContainer === range.endContainer;
    }
  }]);

  return WwClipboardManager;
}();

exports.default = WwClipboardManager;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements WwPasteContentHelper
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _domUtils = __webpack_require__(4);

var _domUtils2 = _interopRequireDefault(_domUtils);

var _htmlSanitizer = __webpack_require__(9);

var _htmlSanitizer2 = _interopRequireDefault(_htmlSanitizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class WwPasteContentHelper
 * @param {WysiwygEditor} wwe - wysiwygEditor instance
 * @ignore
 */
var WwPasteContentHelper = function () {
  function WwPasteContentHelper(wwe) {
    _classCallCheck(this, WwPasteContentHelper);

    this.wwe = wwe;
  }

  /**
   * Process paste data before paste
   * @param {jQuery} $container - clipboard container
   */


  _createClass(WwPasteContentHelper, [{
    key: 'preparePaste',
    value: function preparePaste($container) {
      var range = this.wwe.getEditor().getSelection().cloneRange();
      var wwCodeblockManager = this.wwe.componentManager.getManager('codeblock');
      var firstBlockIsTaken = false;
      var $tempContainer = (0, _jquery2.default)('<div />');

      var nodeName = void 0,
          node = void 0,
          isPastingList = void 0;

      this._pasteFirstAid($container);

      var childNodes = _tuiCodeSnippet2.default.toArray($container[0].childNodes);
      while (childNodes.length) {
        node = childNodes[0];

        nodeName = _domUtils2.default.getNodeName(node);
        isPastingList = nodeName === 'LI' || nodeName === 'UL' || nodeName === 'OL';

        if (wwCodeblockManager.isInCodeBlock(range)) {
          $tempContainer.append(wwCodeblockManager.prepareToPasteOnCodeblock(childNodes));
        } else if (isPastingList) {
          $tempContainer.append(this._prepareToPasteList(childNodes, range, firstBlockIsTaken));
          firstBlockIsTaken = true;
        } else {
          $tempContainer.append(childNodes.shift());
        }
      }

      $container.html($tempContainer.html());
    }

    /**
     * Wrap orphan node(inline, text) with div element
     * @param {jQuery} $container - clipboard container
     * @returns {DocumentFragment}
     * @private
     */

  }, {
    key: '_wrapOrphanNodeWithDiv',
    value: function _wrapOrphanNodeWithDiv($container) {
      var $tempContainer = (0, _jquery2.default)('<div />');
      var array = _tuiCodeSnippet2.default.toArray($container[0].childNodes);
      var currentDiv = void 0;

      _tuiCodeSnippet2.default.forEachArray(array, function (node) {
        var isTextNode = node.nodeType === 3;
        /* eslint-disable max-len */
        var isInlineNode = /^(SPAN|A|CODE|EM|I|STRONG|B|S|U|ABBR|ACRONYM|CITE|DFN|KBD|SAMP|VAR|BDO|Q|SUB|SUP)$/ig.test(node.tagName);
        var isBR = node.nodeName === 'BR';
        /* eslint-enable max-len */

        if (isTextNode || isInlineNode || isBR) {
          if (!currentDiv) {
            currentDiv = document.createElement('div');
            $tempContainer.append(currentDiv);
          }

          currentDiv.appendChild(node);

          if (isBR) {
            currentDiv = null;
          }
        } else {
          if (currentDiv && currentDiv.lastChild.tagName !== 'BR') {
            currentDiv.appendChild((0, _jquery2.default)('<br/>')[0]);
          }

          currentDiv = null;
          $tempContainer.append(node);
        }
      });

      return $tempContainer.html();
    }

    /**
     * Processing paste data after paste
     * @param {jQuery} $container - clipboard container
     * @private
     */

  }, {
    key: '_pasteFirstAid',
    value: function _pasteFirstAid($container) {
      var _this = this;

      var blockTags = 'div, section, article, aside, nav, menus, p';

      $container.html((0, _htmlSanitizer2.default)($container.html(), true));

      $container.find('*').each(function (i, node) {
        _this._removeStyles(node);
      });

      this._unwrapIfNonBlockElementHasBr($container);
      this._unwrapNestedBlocks($container, blockTags);
      this._removeUnnecessaryBlocks($container, blockTags);

      $container.html(this._wrapOrphanNodeWithDiv($container));

      this._preElementAid($container);

      this._tableElementAid($container);

      $container.children('br').remove();
    }

    /**
     * PRE tag formatting
     * @param {jQuery} $container - clipboard container
     * @private
     */

  }, {
    key: '_preElementAid',
    value: function _preElementAid($container) {
      var wwCodeblockManager = this.wwe.componentManager.getManager('codeblock');
      wwCodeblockManager.modifyCodeBlockForWysiwyg($container);
    }

    /**
     * Unwrap span children of document fragment with div element
     * @param {jQuery} $container - clipboard container
     * @private
     */

  }, {
    key: '_unwrapIfNonBlockElementHasBr',
    value: function _unwrapIfNonBlockElementHasBr($container) {
      var nonBlockElements = $container.find('span, a, b, em, i, s');

      nonBlockElements.each(function (i, node) {
        var brChildren = (0, _jquery2.default)(node).children('br');

        if (brChildren.length && node.nodeName !== 'LI' && node.nodeName !== 'UL') {
          brChildren.eq(0).unwrap();
        }
      });
    }

    /**
     * Unwrap nested block elements
     * @param {jQuery} $container - clipboard container
     * @param {string} blockTags - Tag names of block tag
     * @private
     */

  }, {
    key: '_unwrapNestedBlocks',
    value: function _unwrapNestedBlocks($container, blockTags) {
      var $leafElements = $container.find(':not(:has(*))').not('b,s,i,em,code,span,hr');

      $leafElements.each(function (i, node) {
        var leafElement = node.nodeName === 'BR' ? (0, _jquery2.default)(node.parentNode) : (0, _jquery2.default)(node);

        while (leafElement.parents(blockTags).length) {
          var $parent = leafElement.parent(blockTags);

          if ($parent.length && $parent[0] !== $container[0]) {
            leafElement.unwrap();
          } else {
            leafElement = leafElement.parent();
          }
        }
      });
    }

    /**
     * Remove unnecessary block element in pasting data
     * @param {jQuery} $container - clipboard container
     * @param {string} blockTags - Tag names of block tag
     * @private
     */

  }, {
    key: '_removeUnnecessaryBlocks',
    value: function _removeUnnecessaryBlocks($container, blockTags) {
      $container.find(blockTags).each(function (index, blockElement) {
        var $blockElement = (0, _jquery2.default)(blockElement);
        var tagName = blockElement.tagName;

        var isDivElement = tagName === 'DIV';
        var isInListItem = $blockElement.parent('li').length !== 0;
        var isInBlockquote = $blockElement.parent('blockquote').length !== 0;
        var hasBlockChildElement = $blockElement.children(blockTags).length;

        if (isDivElement && (isInListItem || isInBlockquote || !hasBlockChildElement)) {
          return;
        }

        if (blockElement.lastChild && blockElement.lastChild.nodeName !== 'BR') {
          $blockElement.append(document.createElement('br'));
        }

        $blockElement.replaceWith($blockElement.html());
      });
    }

    /**
     * Remove inline style
     * @param {Node} node Node for remove style attribute
     * @private
     */

  }, {
    key: '_removeStyles',
    value: function _removeStyles(node) {
      var $node = (0, _jquery2.default)(node);
      var colorValue = void 0;

      if (_domUtils2.default.getNodeName($node[0]) !== 'SPAN') {
        $node.removeAttr('style');
      } else {
        // Most browser return computed color value even if without style attribute
        if ($node.attr('style')) {
          colorValue = $node.css('color');
        }

        $node.removeAttr('style');

        if (colorValue) {
          $node.css('color', colorValue);
        } else {
          $node.contents().unwrap();
        }
      }
    }

    /**
     * Processing before paste list
     * @param {Array.<HTMLElement>} nodes Pasting data
     * @param {object} rangeInfo Range information
     * @param {boolean} firstBlockIsTaken Whether first block element taken or not
     * @returns {DocumentFragment}
     * @private
     */

  }, {
    key: '_prepareToPasteList',
    value: function _prepareToPasteList(nodes, rangeInfo, firstBlockIsTaken) {
      var nodeName = _domUtils2.default.getNodeName(nodes[0]);
      var node = nodes.shift();
      var newFragment = this.wwe.getEditor().getDocument().createDocumentFragment();

      // IE somethimes returns ul without li
      if (nodeName !== 'LI' && nodes.length && nodes[0].tagName === 'LI') {
        nodeName = 'LI';

        node = this._makeNodeAndAppend({
          tagName: nodeName
        }, node);
      }

      // pasting list into list, we should care indentation
      if (nodeName === 'OL' || nodeName === 'UL') {
        // ignore cursor if pasting data has block
        if (!firstBlockIsTaken && this.wwe.getEditor().hasFormat('LI')) {
          (0, _jquery2.default)(newFragment).append(this._wrapCurrentFormat(node));
        } else {
          (0, _jquery2.default)(newFragment).append(node);
        }
      } else if (nodeName === 'LI') {
        // handle list group
        var listGroup = this.wwe.getEditor().getDocument().createDocumentFragment();
        listGroup.appendChild(node);

        while (nodes.length && nodes[0].tagName === 'LI') {
          listGroup.appendChild(nodes.shift());
        }

        // pasting list into list, we should care indentation
        // ignore cursor if pasting data has block
        if (!firstBlockIsTaken && this.wwe.getEditor().hasFormat('LI')) {
          (0, _jquery2.default)(newFragment).append(this._wrapCurrentFormat(listGroup));
        } else if (rangeInfo && (rangeInfo.commonAncestorName === 'UL' || rangeInfo.commonAncestorName === 'OL')) {
          (0, _jquery2.default)(newFragment).append(this._makeNodeAndAppend({
            tagName: rangeInfo.commonAncestorName
          }, listGroup));
          // list from outside
        } else {
          (0, _jquery2.default)(newFragment).append(this._makeNodeAndAppend({
            tagName: 'UL'
          }, listGroup));
        }
      }

      return newFragment;
    }

    /**
     * Unwrap fragment first child for pasting node inline
     * @param {Node} node Pasting DocumentFragment
     * @returns {NodeList}
     * @private
     */

  }, {
    key: '_unwrapFragmentFirstChildForPasteAsInline',
    value: function _unwrapFragmentFirstChildForPasteAsInline(node) {
      (0, _jquery2.default)(node).find('br').remove();

      return node.childNodes;
    }

    /**
     * Wrap nodes with current format
     * @param {DocumentFragment} nodes P
     * @returns {HTMLElement}
     * @private
     */

  }, {
    key: '_wrapCurrentFormat',
    value: function _wrapCurrentFormat(nodes) {
      var _this2 = this;

      var currentTagName = void 0;

      // expand to pasting area
      this._eachCurrentPath(function (path) {
        if (path.tagName !== 'DIV') {
          if (_domUtils2.default.isElemNode(nodes)) {
            currentTagName = nodes.tagName;
          } else {
            currentTagName = nodes.firstChild.tagName;
          }

          if (path.tagName !== currentTagName) {
            nodes = _this2._makeNodeAndAppend(path, nodes);
          }
        }
      });

      return nodes;
    }
  }, {
    key: '_eachCurrentPath',
    value: function _eachCurrentPath(iteratee) {
      var paths = _domUtils2.default.getPath(this.wwe.getEditor().getSelection().startContainer, this.wwe.get$Body()[0]);

      for (var i = paths.length - 1; i > -1; i -= 1) {
        iteratee(paths[i]);
      }
    }

    /** _makeNodeAndAppend
     * make node and append their own children
     * @param {HTMLElement} pathInfo HTMLElement to make
     * @param {HTMLElement} content Nodes to append
     * @returns {HTMLElement} node
     * @private
     */

  }, {
    key: '_makeNodeAndAppend',
    value: function _makeNodeAndAppend(pathInfo, content) {
      var node = (0, _jquery2.default)('<' + pathInfo.tagName + '/>');

      node.append(content);

      if (pathInfo.id) {
        node.attr('id', pathInfo.id);
      }

      if (pathInfo.className) {
        node.addClass(pathInfo.className);
      }

      return node[0];
    }

    /**
     * Pasting table element pre-process
     * @param {jQuery} $container - clipboard container
     * @private
     */

  }, {
    key: '_tableElementAid',
    value: function _tableElementAid($container) {
      this._removeColgroup($container);
      this._completeTableIfNeed($container);
      this._updateTableIDClassName($container);
    }

    /**
     * Remove colgroup tag
     * @param {jQuery} $container - clipboard container
     * @private
     **/

  }, {
    key: '_removeColgroup',
    value: function _removeColgroup($container) {
      $container.find('colgroup').remove();
    }

    /**
     * Complete and append table to fragment
     * @param {jQuery} $container - clipboard container
     * @private
     */

  }, {
    key: '_completeTableIfNeed',
    value: function _completeTableIfNeed($container) {
      var tableManager = this.wwe.componentManager.getManager('table');
      var wrapperTr = tableManager.wrapDanglingTableCellsIntoTrIfNeed($container);

      if (wrapperTr) {
        $container.append(wrapperTr);
      }

      var wrapperTbody = tableManager.wrapTrsIntoTbodyIfNeed($container);

      if (wrapperTbody) {
        $container.append(wrapperTbody);
      }

      var wrapperTable = tableManager.wrapTheadAndTbodyIntoTableIfNeed($container);

      if (wrapperTable) {
        $container.append(wrapperTable);
      }
    }

    /**
     * Update table ID class name in fragment
     * @param {jQuery} $container - clipboard container
     * @private
     */

  }, {
    key: '_updateTableIDClassName',
    value: function _updateTableIDClassName($container) {
      var tableManager = this.wwe.componentManager.getManager('table');

      $container.find('table').each(function (index, table) {
        (0, _jquery2.default)(table).removeClass(function (idx, className) {
          return className.replace(/.*\s*(te-content-table-\d+)\s*.*/, '$1');
        });
      });

      $container.find('table').each(function (index, table) {
        (0, _jquery2.default)(table).addClass(tableManager.getTableIDClassName());
      });
    }
  }]);

  return WwPasteContentHelper;
}();

exports.default = WwPasteContentHelper;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Paste helper when past to table
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _domUtils = __webpack_require__(4);

var _domUtils2 = _interopRequireDefault(_domUtils);

var _htmlSanitizer = __webpack_require__(9);

var _htmlSanitizer2 = _interopRequireDefault(_htmlSanitizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class WwTablePasteHelper
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @ignore
 */
var WwTablePasteHelper = function () {
  function WwTablePasteHelper(wwe) {
    _classCallCheck(this, WwTablePasteHelper);

    this.wwe = wwe;
  }

  /**
   * Prossse paste clipboardEvent
   * @param {ClipboardEvent} ev - ClipboardEvent
   */


  _createClass(WwTablePasteHelper, [{
    key: 'pasteClipboard',
    value: function pasteClipboard(ev) {
      var cbData = ev.clipboardData || window.clipboardData;
      var items = cbData && cbData.items;

      if (items) {
        this._pasteClipboardItem(items);
        ev.preventDefault();
      } else {
        this._pasteClipboardUsingPasteArea();
        ev.squirePrevented = true;
      }
    }

    /**
     * ClipboardEvent is not supported in IE.
     * To get clipboard, create temporay element and then paste into that element.
     * After end of paste, can get clipboard from that temporary element.
     * @param {ClipboardEvent} ev - ClipboardEvent
     * @private
     */

  }, {
    key: '_pasteClipboardUsingPasteArea',
    value: function _pasteClipboardUsingPasteArea() {
      var _this = this;

      var sq = this.wwe.getEditor();
      var range = sq.getSelection();
      var startContainer = range.startContainer,
          startOffset = range.startOffset,
          endContainer = range.endContainer,
          endOffset = range.endOffset;

      var pasteArea = document.createElement('div');
      var _document = document,
          body = _document.body;


      pasteArea.setAttribute('contenteditable', true);
      pasteArea.setAttribute('style', 'position:fixed; overflow:hidden; top:0; right:100%; width:1px; height:1px;');
      body.appendChild(pasteArea);

      range.selectNodeContents(pasteArea);
      sq.setSelection(range);

      setTimeout(function () {
        var clipboard = body.removeChild(pasteArea);

        range.setStart(startContainer, startOffset);
        range.setEnd(endContainer, endOffset);

        sq.focus();
        sq.setSelection(range);

        _this._pasteClipboardHtml(clipboard.innerHTML);
      });
    }

    /**
     * Paste items of clipboard data
     * @param {DataTransfer.items} items - items of clipboarddata
     * @private
     */

  }, {
    key: '_pasteClipboardItem',
    value: function _pasteClipboardItem(items) {
      var _this2 = this;

      var textItem = null;
      var htmlItem = null;

      _tuiCodeSnippet2.default.forEachArray(items, function (item) {
        if (item.type === 'text/html') {
          htmlItem = item;
        } else if (item.type === 'text/plain') {
          textItem = item;
        }
      });

      if (htmlItem) {
        htmlItem.getAsString(function (html) {
          _this2._pasteClipboardHtml(html);
        });
      } else if (textItem) {
        textItem.getAsString(function (text) {
          _this2._pasteClipboardContainer(document.createTextNode(text));
        });
      }
    }

    /**
     * Paste html of clipboard
     * @param {string} html - html
     * @private
     */

  }, {
    key: '_pasteClipboardHtml',
    value: function _pasteClipboardHtml(html) {
      var container = document.createDocumentFragment();
      var startFramgmentStr = '<!--StartFragment-->';
      var endFragmentStr = '<!--EndFragment-->';
      var startFragmentIndex = html.indexOf(startFramgmentStr);
      var endFragmentIndex = html.lastIndexOf(endFragmentStr);

      if (startFragmentIndex > -1 && endFragmentIndex > -1) {
        html = html.slice(startFragmentIndex + startFramgmentStr.length, endFragmentIndex);
      }

      // Wrap with <tr> if html contains dangling <td> tags
      // Dangling <td> tag is that tag does not have <tr> as parent node.
      if (/<\/td>((?!<\/tr>)[\s\S])*$/i.test(html)) {
        html = '<TR>' + html + '</TR>';
      }
      // Wrap with <table> if html contains dangling <tr> tags
      // Dangling <tr> tag is that tag does not have <table> as parent node.
      if (/<\/tr>((?!<\/table>)[\s\S])*$/i.test(html)) {
        html = '<TABLE>' + html + '</TABLE>';
      }

      container.appendChild((0, _htmlSanitizer2.default)(html));
      this._pasteClipboardContainer(container);
    }

    /**
     * Paste container of clipboard
     * @param {DocumentFragment} clipboardContainer - clipboard
     * @private
     */

  }, {
    key: '_pasteClipboardContainer',
    value: function _pasteClipboardContainer(clipboardContainer) {
      var sq = this.wwe.getEditor();
      var childNodes = clipboardContainer.childNodes;

      var containsOneTableOnly = childNodes.length === 1 && childNodes[0].nodeName === 'TABLE';

      if (containsOneTableOnly) {
        var tableManager = this.wwe.componentManager.getManager('table');
        tableManager.pasteTableData(clipboardContainer);
      } else {
        var range = sq.getSelection().cloneRange();
        var fragment = this._preparePasteDocumentFragment(clipboardContainer);

        sq.saveUndoState(range);

        if (!range.collapsed) {
          this._deleteContentsRange(range);
        }

        if (_domUtils2.default.isTextNode(range.startContainer)) {
          this._pasteIntoTextNode(range, fragment);
        } else {
          this._pasteIntoElements(range, fragment);
        }

        sq.setSelection(range);
      }
    }

    /**
     * Prepare clipboard for paste to table
     * @param {DocumentFragment} clipboardContainer - clipboard
     * @returns {DocumentFragment} processed result
     * @private
     */

  }, {
    key: '_preparePasteDocumentFragment',
    value: function _preparePasteDocumentFragment(clipboardContainer) {
      var childNodes = clipboardContainer.childNodes;

      var fragment = document.createDocumentFragment();

      if (childNodes.length) {
        fragment.appendChild(this._unwrapBlock(clipboardContainer));
      } else if (this._isPossibleInsertToTable(clipboardContainer)) {
        fragment.appendChild(clipboardContainer);
      }

      return fragment;
    }

    /**
     * unwrap block node
     * @param {Node} node - target node
     * @returns {DocumentFragment} processed result
     * @private
     */

  }, {
    key: '_unwrapBlock',
    value: function _unwrapBlock(node) {
      var fragment = document.createDocumentFragment();
      var childNodes = _tuiCodeSnippet2.default.toArray(node.childNodes);

      while (childNodes.length) {
        var child = childNodes.shift();

        if (this._isPossibleInsertToTable(child)) {
          fragment.appendChild(child);
        } else {
          fragment.appendChild(this._unwrapBlock(child));

          // If current child is last or fragment already has last br,
          // appending br would create unintended line break.
          var lastChild = fragment.lastChild;

          if (childNodes.length && lastChild && lastChild.nodeName !== 'BR') {
            fragment.appendChild(document.createElement('br'));
          }
        }
      }

      return fragment;
    }
  }, {
    key: '_isPossibleInsertToTable',
    value: function _isPossibleInsertToTable(node) {
      var nodeName = node.nodeName;

      var isChildlessCode = nodeName === 'CODE' && node.childNodes.length > 1;
      var isList = nodeName === 'UL' || nodeName === 'OL';

      return !isChildlessCode && (isList || _domUtils2.default.isMDSupportInlineNode(node) || _domUtils2.default.isTextNode(node));
    }

    /**
     * paste fragment to offset of range.startContainer
     * @param {Range} range - selection range
     * @param {DocumentFragment} fragment - paste data
     * @private
     */

  }, {
    key: '_pasteIntoElements',
    value: function _pasteIntoElements(range, fragment) {
      var container = range.startContainer,
          offset = range.startOffset;

      var node = _domUtils2.default.getChildNodeByOffset(container, offset);

      if (!node) {
        // For example when container is br, br don't have child, so node is null
        if (container.nodeName === 'TD') {
          container.appendChild(fragment);
          range.setStart(container, container.childNodes.length);
        } else {
          var parentNode = container.parentNode,
              nextSibling = container.nextSibling;


          parentNode.insertBefore(fragment, nextSibling);

          if (nextSibling) {
            range.setStart(nextSibling, 0);
          } else {
            range.setStartAfter(parentNode.lastChild);
          }
        }
      } else {
        container.insertBefore(fragment, node);
        range.setStart(node, 0);
      }

      range.collapse(true);
    }

    /**
     * paste fragment to offset of text node
     * @param {Range} range - selection range
     * @param {DocumentFragment} fragment - paste data
     * @private
     */

  }, {
    key: '_pasteIntoTextNode',
    value: function _pasteIntoTextNode(range, fragment) {
      var container = range.startContainer,
          offset = range.startOffset;
      var parentNode = container.parentNode,
          textContent = container.textContent;

      var prevText = textContent.slice(0, offset);
      var postText = textContent.slice(offset, textContent.length);
      var fragmentChildNodes = fragment.childNodes;

      var firstChild = fragmentChildNodes[0];
      var isFragmenthasOneTextNode = fragmentChildNodes.length === 1 && _domUtils2.default.isTextNode(firstChild);

      if (!prevText) {
        parentNode.insertBefore(fragment, container);
        range.setStart(container, 0);
      } else if (!postText) {
        var nextSibling = container.nextSibling;


        parentNode.insertBefore(fragment, nextSibling);
        range.setStartAfter(nextSibling);
      } else if (isFragmenthasOneTextNode) {
        var firstChildText = firstChild.textContent;


        container.textContent = '' + prevText + firstChildText + postText;
        range.setStart(container, prevText.length + firstChildText.length);
      } else {
        var resultFragment = document.createDocumentFragment();

        resultFragment.appendChild(document.createTextNode(prevText));
        resultFragment.appendChild(fragment);
        resultFragment.appendChild(document.createTextNode(postText));
        parentNode.replaceChild(resultFragment, container);

        var childNodesArray = _tuiCodeSnippet2.default.toArray(parentNode.childNodes);
        var index = 0;
        childNodesArray.forEach(function (child, i) {
          if (child.textContent === postText) {
            index = i;
          }
        });

        range.setStart(parentNode.childNodes[index], 0);
      }

      range.collapse(true);
    }

    /**
     * delete contents of range that is not collapse
     * @param {Range} range - range is not collapse
     * @private
     */

  }, {
    key: '_deleteContentsRange',
    value: function _deleteContentsRange(range) {
      var startContainer = range.startContainer,
          startOffset = range.startOffset,
          endContainer = range.endContainer,
          endOffset = range.endOffset;


      if (startContainer === endContainer) {
        this._deleteContentsByOffset(startContainer, startOffset, endOffset);
        range.setStart(startContainer, startOffset);
        range.collapse(true);
      } else {
        this._deleteNotCollapsedRangeContents(range);
      }
    }
  }, {
    key: '_deleteNotCollapsedRangeContents',
    value: function _deleteNotCollapsedRangeContents(range) {
      var startContainer = range.startContainer,
          startOffset = range.startOffset,
          endContainer = range.endContainer,
          endOffset = range.endOffset;

      var common = range.commonAncestorContainer;
      var startBlock = this._getBlock(startContainer, common, startOffset);
      var endBlock = this._getBlock(endContainer, common, endOffset - 1);

      if (startBlock === endBlock) {
        this._removeInSameBlock(startBlock, startContainer, endContainer, startOffset, endOffset);

        // When endContainer is not same endBlock, endBlock is removed.
        // For example, aaa| <- this is cursor.
        // When cursor is last, endContainer would be 'TD' and endBlock is text node
        // In this case, remove all 'aaa' so endBlock should be null.
        endBlock = endContainer !== endBlock ? null : endBlock;
      } else {
        var nextOfstartBlock = startBlock.nextSibling;


        if (startContainer.nodeName === 'TD') {
          nextOfstartBlock = this._removeOneLine(startBlock);
        } else {
          // Remove child nodes from node of startOffset in startContainer.
          this._deleteContentsByOffset(startContainer, startOffset, _domUtils2.default.getOffsetLength(startContainer));

          // Remove nodes from startContainer in startBlock
          _domUtils2.default.removeNodesByDirection(startBlock, startContainer, false);
        }

        if (endContainer.nodeName === 'TD') {
          endBlock = this._removeOneLine(endBlock);
        } else {
          // Remove child nodes until node of endOffset in endContainer.
          this._deleteContentsByOffset(endContainer, 0, endOffset);

          // Remove nodes until endContainer in endBlock
          _domUtils2.default.removeNodesByDirection(endBlock, endContainer, true);
        }

        // Remove nodes between startBlock and endBlock
        _domUtils2.default.removeChildFromStartToEndNode(common, nextOfstartBlock, endBlock);
      }

      if (endBlock) {
        range.setStart(endBlock, 0);
      } else {
        range.setStartAfter(startBlock);
      }

      range.collapse(true);
    }
  }, {
    key: '_removeInSameBlock',
    value: function _removeInSameBlock(block, startContainer, endContainer, startOffset, endOffset) {
      var start = startContainer === block ? startOffset : 0;
      var end = endContainer === block ? endOffset : _domUtils2.default.getOffsetLength(block);

      this._deleteContentsByOffset(block, start, end);
    }
  }, {
    key: '_removeOneLine',
    value: function _removeOneLine(node) {
      var nextSibling = node.nextSibling,
          parentNode = node.parentNode;

      var next = nextSibling;

      parentNode.removeChild(node);

      if (nextSibling && nextSibling.nodeName === 'BR') {
        next = nextSibling.nextSibling;
        parentNode.removeChild(nextSibling);
      }

      return next;
    }

    /**
     * Find parent block node of startContainer and endContainer
     * If startContainer or endContainer is same commonAncestor,
     * find node at offset of startContainer and endContainer.
     * @param {Node} node - startContainer or endContainer
     * @param {Node} parent - commonAncestor
     * @param {Number} offset - startOffset or endOffset-1
     * @returns {Node} block node
     * @private
     */

  }, {
    key: '_getBlock',
    value: function _getBlock(node, parent, offset) {
      return _domUtils2.default.getParentUntil(node, parent) || _domUtils2.default.getChildNodeByOffset(node, offset);
    }

    /**
     * delete contents from start offset to end offset
     * @param {Node} container - container
     * @param {Number} startOffset - start offset
     * @param {Number} endOffset - end offset
     * @private
     */

  }, {
    key: '_deleteContentsByOffset',
    value: function _deleteContentsByOffset(container, startOffset, endOffset) {
      if (_domUtils2.default.isTextNode(container)) {
        var textContent = container.textContent;

        var prevText = textContent.slice(0, startOffset);
        var postText = textContent.slice(endOffset, textContent.length);

        container.textContent = '' + prevText + postText;
      } else {
        var startNode = _domUtils2.default.getChildNodeByOffset(container, startOffset);
        var endNode = _domUtils2.default.getChildNodeByOffset(container, endOffset);

        if (startNode) {
          _domUtils2.default.removeChildFromStartToEndNode(container, startNode, endNode || null);
        }
      }
    }
  }]);

  return WwTablePasteHelper;
}();

exports.default = WwTablePasteHelper;

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements wysiwyg list manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _domUtils = __webpack_require__(4);

var _domUtils2 = _interopRequireDefault(_domUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FIND_LI_ELEMENT = /<li/i;
var DIV_OR_LI = 'DIV,LI';
var UL_OR_OL = 'OL,UL';
var FIND_CELL_TAG_RX = /(<(?:th|td)[^>]*>)(.*?)(<\/(?:th|td)>)/g;
var FIND_LIST_OR_LIST_ITEM_TAG_RX = /<(ul|ol|li)([^>]*)>/g;

/**
 * Class WwListManager
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @ignore
 */

var WwListManager = function () {
  function WwListManager(wwe) {
    _classCallCheck(this, WwListManager);

    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @type {string}
     */
    this.name = 'list';

    this._init();
  }

  /**
   * Initialize
   * @private
   */


  _createClass(WwListManager, [{
    key: '_init',
    value: function _init() {
      this._initEvent();
      this._initKeyHandler();
    }

    /**
     * Initialize event
     * @private
     */

  }, {
    key: '_initEvent',
    value: function _initEvent() {
      var _this = this;

      this.eventManager.listen('wysiwygSetValueBefore', function (html) {
        return _this._convertToArbitraryNestingList(html);
      });

      this.eventManager.listen('wysiwygRangeChangeAfter', function () {
        _this._findAndRemoveEmptyList();
        _this._removeBranchListAll();
      });

      this.eventManager.listen('wysiwygSetValueAfter', function () {
        _this._removeBranchListAll();
      });

      this.eventManager.listen('wysiwygProcessHTMLText', function (html) {
        html = _this._convertFromArbitraryNestingList(html);

        return html;
      });

      this.eventManager.listen('convertorBeforeHtmlToMarkdownConverted', function (html) {
        return _this._insertDataToMarkPassForListInTable(html);
      });
    }
  }, {
    key: '_initKeyHandler',
    value: function _initKeyHandler() {
      var _this2 = this;

      this.wwe.addKeyEventHandler(['TAB', 'CTRL+]', 'META+]'], function (ev) {
        var isNeedNext = void 0;

        if (_this2.wwe.getEditor().hasFormat('LI')) {
          ev.preventDefault();
          _this2.eventManager.emit('command', 'Indent');

          isNeedNext = false;
        }

        return isNeedNext;
      });

      this.wwe.addKeyEventHandler(['SHIFT+TAB', 'CTRL+[', 'META+['], function (ev, range) {
        var isNeedNext = void 0;

        if (_this2.wwe.getEditor().hasFormat('LI')) {
          ev.preventDefault();
          var $ul = (0, _jquery2.default)(range.startContainer).closest('li').children(UL_OR_OL);

          _this2.eventManager.emit('command', 'Outdent');

          if ($ul.length && !$ul.prev().length) {
            _this2._removeBranchList($ul);
          }

          isNeedNext = false;
        }

        return isNeedNext;
      });

      this.wwe.addKeyEventHandler('ENTER', function (ev, range) {
        if (range.collapsed) {
          if (_this2.wwe.getEditor().hasFormat('LI')) {
            _this2.wwe.defer(function () {
              var afterRange = _this2.wwe.getRange();
              var $li = (0, _jquery2.default)(afterRange.startContainer).parents('li').eq(0);
              _this2._removeBranchListAll($li);
            });
          }
        }
      });

      this.wwe.addKeyEventHandler('BACK_SPACE', function (ev, range) {
        if (range.collapsed) {
          if (_this2.wwe.getEditor().hasFormat('LI')) {
            _this2.wwe.defer(function () {
              _this2._removeBranchListAll();
            });
          }
        }
      });
    }

    /**
     * Find empty list for whole container and remove it.
     * @private
     */

  }, {
    key: '_findAndRemoveEmptyList',
    value: function _findAndRemoveEmptyList() {
      this.wwe.get$Body().find(UL_OR_OL).each(function (index, node) {
        if (!FIND_LI_ELEMENT.test(node.innerHTML)) {
          (0, _jquery2.default)(node).remove();
        }
      });
    }

    /**
     * Remove branch lists all from body
     * @param {jQuery|HTMLElement} $root root to remove branch list
     * @private
     */

  }, {
    key: '_removeBranchListAll',
    value: function _removeBranchListAll($root) {
      var _this3 = this;

      $root = !$root ? this.wwe.get$Body() : (0, _jquery2.default)($root);

      $root.find('li ul, li ol').each(function (idx, node) {
        if (!node || node.previousSibling) {
          return;
        }
        _this3._removeBranchList(node);
      });
    }

    /**
     * Remove branch list of passed list(ul, ol)
     * @param {HTMLElement} list list
     * @private
     */

  }, {
    key: '_removeBranchList',
    value: function _removeBranchList(list) {
      var $list = (0, _jquery2.default)(list);
      var $branchRoot = $list;

      while (!$branchRoot[0].previousSibling && $branchRoot[0].parentElement.tagName.match(/UL|OL|LI/g)) {
        $branchRoot = $branchRoot.parent();
      }

      var $firstLi = $branchRoot.children('li').eq(0);

      $branchRoot.prepend($list.children().unwrap());

      $firstLi.remove();
    }

    /**
     * make arbitrary nesting list out of standard list
     * `<ul><li>text<ul><li>text2</li></ul></li></ul>` to
     * `<ul><li>text</li><ul><li>text2</li></ul></ul>`
     * @param {string} html string to convert
     * @returns {string} converted HTML text
     * @private
     */

  }, {
    key: '_convertToArbitraryNestingList',
    value: function _convertToArbitraryNestingList(html) {
      var NESTED_LIST_QUERY = 'li > ul, li > ol';
      var wrapper = document.createElement('div');
      wrapper.innerHTML = html;

      var nestedList = wrapper.querySelector(NESTED_LIST_QUERY);
      while (nestedList !== null) {
        var parentLI = nestedList.parentNode;
        var parentList = parentLI.parentNode;

        parentList.insertBefore(nestedList, parentLI.nextElementSibling);

        nestedList = wrapper.querySelector(NESTED_LIST_QUERY);
      }

      return wrapper.innerHTML;
    }

    /**
     * make standard list out of arbitrary nesting list
     * `<ul><li>text<ul><li>text2</li></ul></li></ul>` from
     * `<ul><li>text</li><ul><li>text2</li></ul></ul>`
     * @param {string} html string to convert
     * @returns {string} converted HTML text
     * @private
     */

  }, {
    key: '_convertFromArbitraryNestingList',
    value: function _convertFromArbitraryNestingList(html) {
      var NESTED_LIST_QUERY = 'ol > ol, ol > ul, ul > ol, ul > ul';
      var wrapperDiv = document.createElement('div');
      wrapperDiv.innerHTML = html;

      var nestedList = wrapperDiv.querySelector(NESTED_LIST_QUERY);
      while (nestedList !== null) {
        var prevLI = nestedList.previousElementSibling;
        while (prevLI && prevLI.tagName !== 'LI') {
          prevLI = prevLI.previousElementSibling;
        }

        if (prevLI) {
          prevLI.appendChild(nestedList);
        } else {
          this._unwrap(nestedList);
        }

        nestedList = wrapperDiv.querySelector(NESTED_LIST_QUERY);
      }

      return wrapperDiv.innerHTML;
    }

    /**
     * unwrap nesting list
     * @param {Node} nestedList - nested list to unwrap
     * @private
     */

  }, {
    key: '_unwrap',
    value: function _unwrap(nestedList) {
      var fragment = document.createDocumentFragment();
      while (nestedList.firstChild) {
        fragment.appendChild(nestedList.firstChild);
      }
      nestedList.parentNode.replaceChild(fragment, nestedList);
    }
  }, {
    key: '_insertDataToMarkPassForListInTable',
    value: function _insertDataToMarkPassForListInTable(html) {
      var replacedHtml = html.replace(FIND_CELL_TAG_RX, function (match, tdStart, tdContent, tdEnd) {
        var content = tdContent.replace(FIND_LIST_OR_LIST_ITEM_TAG_RX, '<$1 data-tomark-pass="" $2>');

        return '' + tdStart + content + tdEnd;
      });

      return replacedHtml;
    }

    /**
     * Return lines in selection
     * @param {Node} start Start element
     * @param {Node} end End element
     * @param {HTMLElement} body Editor body element
     * @returns {Array.<HTMLElement>}
     * @private
     */

  }, {
    key: 'getLinesOfSelection',
    value: function getLinesOfSelection(start, end) {
      var lines = [];
      var isLastLine = false;
      var needNext = true;
      var nextLine = void 0;

      if (_domUtils2.default.isTextNode(start)) {
        start = (0, _jquery2.default)(start).parents(DIV_OR_LI).first().get(0);
      }

      if (_domUtils2.default.isTextNode(end)) {
        end = (0, _jquery2.default)(end).parents(DIV_OR_LI).first().get(0);
      }

      for (var line = start; needNext; line = nextLine) {
        if ((0, _jquery2.default)(line).is(DIV_OR_LI)) {
          lines.push(line);

          if (line === end) {
            isLastLine = true;
          } else {
            nextLine = this._getNextLine(line, end);
          }
        } else {
          break;
        }
        needNext = nextLine && !isLastLine;
      }

      return lines;
    }

    /**
     * get next line
     * @param {Node} currentLine - current line node
     * @param {Node} end - last node in selection
     * @returns {Node} - next line node
     * @private
     */

  }, {
    key: '_getNextLine',
    value: function _getNextLine(currentLine, end) {
      var nextLine = currentLine.nextElementSibling;

      if (!nextLine) {
        // current line was the last line in ul/ol
        // while we have lines those has not been processed yet.
        nextLine = currentLine.parentNode.nextElementSibling;
      } else if ((0, _jquery2.default)(nextLine).is(UL_OR_OL)) {
        // we don't sure firstChild is LI. arbtrary list can have another ol/ul
        nextLine = nextLine.querySelector('li');
      }

      if ((0, _jquery2.default)(nextLine).is(DIV_OR_LI) || nextLine === end) {
        return nextLine;
      }

      return this._getNextLine(nextLine);
    }

    /**
     * merge to previous list
     * consider remove this function when https://github.com/neilj/Squire/issues/294 resolved
     * @param {HTMLLIElement} currentLine - current li element
     */

  }, {
    key: 'mergeList',
    value: function mergeList(currentLine) {
      var currentList = currentLine.parentNode;
      var prevList = currentList.previousElementSibling;
      var nextList = currentList.nextElementSibling;

      if (currentList.firstElementChild === currentLine) {
        if (prevList && (0, _jquery2.default)(prevList).is(UL_OR_OL)) {
          this._mergeList(currentList, prevList);
          currentList = prevList;
        }
      }

      if (currentList.lastElementChild === currentLine) {
        if (nextList && (0, _jquery2.default)(nextList).is(UL_OR_OL)) {
          this._mergeList(nextList, currentList);
        }
      }
    }

    /**
     * merge list to targetList
     * @param {HTMLOListElement|HTMLUListElement} list - list to merge
     * @param {HTMLOListElement|HTMLUListElement} targetList - target list
     * @private
     */

  }, {
    key: '_mergeList',
    value: function _mergeList(list, targetList) {
      var listItem = list.firstElementChild;

      if (targetList && (0, _jquery2.default)(targetList).is(UL_OR_OL)) {
        while (listItem) {
          var temp = listItem.nextElementSibling;
          targetList.appendChild(listItem);
          listItem = temp;
        }

        list.parentNode.removeChild(list);
      }
    }

    /**
     * Check whether is available to make List in table.
     * @returns {boolean} - li element
     */

  }, {
    key: 'isAvailableMakeListInTable',
    value: function isAvailableMakeListInTable() {
      var selectionManager = this.wwe.componentManager.getManager('tableSelection');
      var $selectedCells = selectionManager.getSelectedCells();
      var sq = this.wwe.getEditor();

      return $selectedCells.length === 0 && sq.hasFormat('table') && !sq.hasFormat('OL') && !sq.hasFormat('UL');
    }

    /**
     * Find parent node before TD
     * @param {Node} node - startContainer or endContainer of range
     * @param {Number} offset - offset
     * @returns {Node} - parent node before TD
     * @private
     */

  }, {
    key: '_getParentNodeBeforeTD',
    value: function _getParentNodeBeforeTD(node, offset) {
      var parentNode = _domUtils2.default.getParentUntil(node, 'TD');

      if (!parentNode) {
        var childNodes = node.childNodes;

        var length = childNodes ? childNodes.length : 0;
        var newOffset = offset > 0 && offset === length ? offset - 1 : offset;

        parentNode = _domUtils2.default.getChildNodeByOffset(node, newOffset);
      }

      return parentNode;
    }

    /**
     * Find LI node inside TD
     * If target node is not li and parents of taget node is not li, return null.
     * @param {Node} targetNode - startContainer or endContainer of range
     * @param {Number} offset - offset
     * @returns {Node} - LI node or null
     * @private
     */

  }, {
    key: '_findLINodeInsideTD',
    value: function _findLINodeInsideTD(targetNode, offset) {
      var liNode = null;

      var liParent = _domUtils2.default.getParentUntilBy(targetNode, function (node) {
        return node && _domUtils2.default.isListNode(node);
      }, function (node) {
        return node && node.nodeName === 'TD';
      });

      if (liParent) {
        liNode = liParent;
      } else if (targetNode.nodeName === 'LI') {
        liNode = targetNode;
      } else if (_domUtils2.default.isListNode(targetNode)) {
        var childLength = targetNode.childNodes.length;

        liNode = targetNode.childNodes[offset >= childLength ? childLength - 1 : offset];
      }

      return liNode;
    }

    /**
     * Get first node on the line where range start.
     * @param {Node} targetNode - startContainer
     * @param {Number} offset - startOffset
     * @returns {Node} - first node where range start
     * @private
     */

  }, {
    key: '_getFirstNodeInLineOfTable',
    value: function _getFirstNodeInLineOfTable(targetNode, offset) {
      var startNode = this._findLINodeInsideTD(targetNode, offset);

      if (!startNode) {
        startNode = this._getParentNodeBeforeTD(targetNode, offset);

        var _startNode = startNode,
            previousSibling = _startNode.previousSibling;

        while (previousSibling && previousSibling.nodeName !== 'BR' && !_domUtils2.default.isListNode(previousSibling)) {
          startNode = previousSibling;
          previousSibling = startNode.previousSibling;
        }
      }

      return startNode;
    }

    /**
     * Get last node on the line where range end.
     * @param {Node} targetNode - endContainer
     * @param {Number} offset - endOffset
     * @returns {Node} - last node where range end
     * @private
     */

  }, {
    key: '_getLastNodeInLineOfTable',
    value: function _getLastNodeInLineOfTable(targetNode, offset) {
      var endNode = this._findLINodeInsideTD(targetNode, offset);

      if (!endNode) {
        endNode = this._getParentNodeBeforeTD(targetNode, offset);

        while (endNode.nextSibling) {
          if (endNode.nodeName === 'BR' || _domUtils2.default.isListNode(endNode)) {
            break;
          }

          endNode = endNode.nextSibling;
        }
      }

      return endNode;
    }

    /**
     * Check whether node is last node in the line of table
     * If the node is li or br, the node is last node in the line of table.
     * @param {node} node - node
     * @returns {boolean} - whether node is last node in line of table
     * @private
     */

  }, {
    key: '_isLastNodeInLineOfTable',
    value: function _isLastNodeInLineOfTable(node) {
      var nodeName = node.nodeName;


      return nodeName === 'LI' || nodeName === 'BR';
    }

    /**
     * Get next node in the line of table
     * If current node is li node and nextSibling is not existing, next node is parent's nextSibling.
     * If nextSibiling of node is a list node (UL or OL), next node is first child of the list node.
     * @param {node} node - node
     * @returns {node} - next node
     * @private
     */

  }, {
    key: '_getNextNodeInLineOfTable',
    value: function _getNextNodeInLineOfTable(node) {
      var nextSibling = node.nextSibling;


      if (node.nodeName === 'LI' && !nextSibling) {
        var parentNode = node.parentNode;


        while (parentNode.nodeName !== 'TD') {
          if (parentNode.nextSibling) {
            nextSibling = parentNode.nextSibling;
            break;
          }

          parentNode = parentNode.parentNode;
        }
      } else if (_domUtils2.default.isListNode(nextSibling)) {
        nextSibling = nextSibling.firstChild;
      }

      return nextSibling;
    }

    /**
     * get nodes in each lines of table
     * @param {range} range - range
     * @returns {array} - each nodes in line
     * @private
     */

  }, {
    key: '_getLinesOfSelectionInTable',
    value: function _getLinesOfSelectionInTable(range) {
      var startContainer = range.startContainer,
          endContainer = range.endContainer,
          startOffset = range.startOffset,
          endOffset = range.endOffset;

      var firstNode = this._getFirstNodeInLineOfTable(startContainer, startOffset);
      var lastNode = this._getLastNodeInLineOfTable(endContainer, endOffset);

      var lines = [];
      var oneLine = [];

      while (firstNode) {
        oneLine.push(firstNode);

        if (this._isLastNodeInLineOfTable(firstNode)) {
          lines.push(oneLine);
          oneLine = [];
        }

        if (firstNode === lastNode) {
          if (oneLine.length) {
            lines.push(oneLine);
          }
          break;
        }

        firstNode = this._getNextNodeInLineOfTable(firstNode);
      }

      return lines;
    }

    /**
     * create OL or UL element
     * @param {string} listType - OL, UL or TASK
     * @returns {Node} - OL or UL element
     * @private
     */

  }, {
    key: '_createListElement',
    value: function _createListElement(listType) {
      return document.createElement(listType === 'TASK' ? 'UL' : listType);
    }

    /**
     * create li element
     * @param {array} oneLineNodes - node array
     * @param {string} listType - OL, UL or TASK
     * @returns {Node} - li element
     * @private
     */

  }, {
    key: '_createListItemElement',
    value: function _createListItemElement(oneLineNodes, listType) {
      var liNode = document.createElement('li');

      oneLineNodes.forEach(function (node) {
        liNode.appendChild(node);
      });

      if (listType === 'TASK') {
        var taskManager = this.wwe.componentManager.getManager('task');

        taskManager.formatTask(liNode);
      }

      return liNode;
    }
  }, {
    key: '_mergeListWithPreviousSibiling',
    value: function _mergeListWithPreviousSibiling(node) {
      var previousSibling = node.previousSibling;

      var result = node;

      if (previousSibling && node.nodeName === previousSibling.nodeName) {
        this._mergeList(node, previousSibling);
        result = previousSibling;
      }

      return result;
    }
  }, {
    key: '_mergeListWithNextSibiling',
    value: function _mergeListWithNextSibiling(node) {
      var nextSibling = node.nextSibling;


      if (nextSibling && node.nodeName === nextSibling.nodeName) {
        this._mergeList(nextSibling, node);
      }

      return node;
    }

    /**
     * make listNode (OL or UL)
     * @param {range} range - range
     * @param {staring} listType - UL, OL, TASK
     * @returns {array} childNodes of list node (OL/UL)
     */

  }, {
    key: 'createListInTable',
    value: function createListInTable(range, listType) {
      var _this4 = this;

      var lines = this._getLinesOfSelectionInTable(range);

      var lastLine = lines[lines.length - 1];
      var lastNode = lastLine[lastLine.length - 1];
      var nextNode = lastNode.nextSibling;
      var parentNode = lastNode.parentNode;

      var listNode = this._createListElement(listType);
      var _listNode = listNode,
          listNodeName = _listNode.nodeName;


      var newLIs = [];
      lines.forEach(function (oneLineNodes) {
        var oneLineFirstNode = oneLineNodes[0];
        var liElement = void 0;

        // oneLineFirstNode was already a list item in the table
        if (oneLineFirstNode.nodeName === 'LI') {
          var existingListNode = oneLineFirstNode.parentNode;
          liElement = oneLineFirstNode;

          // If the existing list that is already in table is not same the list to be created,
          // change the existing list to the list to be created
          if (existingListNode.nodeName !== listNodeName) {
            var childNodes = existingListNode.childNodes;


            _tuiCodeSnippet2.default.forEachArray(childNodes, function () {
              listNode.appendChild(existingListNode.firstChild);
            });

            existingListNode.parentNode.replaceChild(listNode, existingListNode);
          }

          listNode = liElement.parentNode;
        } else {
          liElement = _this4._createListItemElement(oneLineNodes, listType);
          listNode.appendChild(liElement);
        }

        newLIs.push(liElement);
      });

      if (!listNode.parentNode) {
        parentNode.insertBefore(listNode, nextNode);
      }

      listNode = this._mergeListWithPreviousSibiling(listNode);
      this._mergeListWithNextSibiling(listNode);

      return newLIs;
    }

    /**
     * adjust range for list node (OL/UL)
     * according to origin startContainer and endContainer
     * @param {node} startContainer - startContainer
     * @param {node} endContainer - endContainer
     * @param {number} startOffset - startOffset
     * @param {number} endOffset - endOffset
     * @param {array} listNode - node array
     */

  }, {
    key: 'adjustRange',
    value: function adjustRange(startContainer, endContainer, startOffset, endOffset, listNode) {
      var newStartContainer = _domUtils2.default.containsNode(listNode[0], startContainer) ? startContainer : listNode[0];
      var newEndContainer = _domUtils2.default.containsNode(listNode[listNode.length - 1], endContainer) ? endContainer : listNode[listNode.length - 1];

      var newStartOffset = startContainer.nodeName === 'TD' ? 0 : startOffset;
      var newEndOffset = endContainer.nodeName === 'TD' ? 0 : endOffset;

      this.wwe.setSelectionByContainerAndOffset(newStartContainer, newStartOffset, newEndContainer, newEndOffset);
    }
  }]);

  return WwListManager;
}();

exports.default = WwListManager;

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements wysiwyg task manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _domUtils = __webpack_require__(4);

var _domUtils2 = _interopRequireDefault(_domUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TASK_CLASS_NAME = 'task-list-item';
var TASK_ATTR_NAME = 'data-te-task';
var TASK_CHECKED_CLASS_NAME = 'checked';

/**
 * Class WwTaskManager
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @ignore
 */

var WwTaskManager = function () {
  function WwTaskManager(wwe) {
    _classCallCheck(this, WwTaskManager);

    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @type {string}
     */
    this.name = 'task';

    this._init();
  }

  /**
   * Init
   * @private
   */


  _createClass(WwTaskManager, [{
    key: '_init',
    value: function _init() {
      this._initKeyHandler();
      this._initEvent();

      this.wwe.getEditor().addEventListener('mousedown', function (ev) {
        var style = getComputedStyle(ev.target, ':before');

        if (ev.target.hasAttribute(TASK_ATTR_NAME) && _domUtils2.default.isInsideTaskBox(style, ev.offsetX, ev.offsetY)) {
          // Prevent cursor focusing
          ev.preventDefault();
          (0, _jquery2.default)(ev.target).toggleClass(TASK_CHECKED_CLASS_NAME);
        }
      });
    }

    /**
     * Initialize event
     * @private
     */

  }, {
    key: '_initEvent',
    value: function _initEvent() {
      var _this = this;

      this.eventManager.listen('wysiwygSetValueAfter', function () {
        _this._removeTaskListClass();
      });
    }

    /**
     * Initialize key event handler
     * @private
     */

  }, {
    key: '_initKeyHandler',
    value: function _initKeyHandler() {
      var _this2 = this;

      this.wwe.addKeyEventHandler('ENTER', function (ev, range) {
        if (_this2.isInTaskList(range)) {
          _this2.wwe.defer(function () {
            var newRange = _this2.wwe.getRange();
            var $li = (0, _jquery2.default)(newRange.startContainer).closest('li');
            $li.removeClass(TASK_CHECKED_CLASS_NAME);
          });
        }
      });
    }

    /**
     * Check whether passed range is in task list or not
     * @param {Range} range range
     * @returns {boolean} result
     */

  }, {
    key: 'isInTaskList',
    value: function isInTaskList(range) {
      var li = void 0;

      if (!range) {
        range = this.wwe.getEditor().getSelection().cloneRange();
      }

      if (range.startContainer.nodeType === Node.ELEMENT_NODE && range.startContainer.tagName === 'LI') {
        li = range.startContainer;
      } else {
        li = (0, _jquery2.default)(range.startContainer).parents('li').get(0);
      }

      return (0, _jquery2.default)(li).hasClass(TASK_CLASS_NAME);
    }

    /**
     * Unforamt task
     * @param {Node} node target
     */

  }, {
    key: 'unformatTask',
    value: function unformatTask(node) {
      var $li = (0, _jquery2.default)(node).closest('li');

      $li.removeClass(TASK_CLASS_NAME);
      $li.removeClass(TASK_CHECKED_CLASS_NAME);

      $li.removeAttr(TASK_ATTR_NAME);

      if (!$li.attr('class')) {
        $li.removeAttr('class');
      }
    }

    /**
     * Format task
     * @param {Node} node target
     */

  }, {
    key: 'formatTask',
    value: function formatTask(node) {
      var $selected = (0, _jquery2.default)(node);
      var $li = $selected.closest('li');

      $li.addClass(TASK_CLASS_NAME);
      $li.attr(TASK_ATTR_NAME, '');
    }

    /**
     * Format task if current range has task class name
     * @private
     */

  }, {
    key: '_formatTaskIfNeed',
    value: function _formatTaskIfNeed() {
      var range = this.wwe.getEditor().getSelection().cloneRange();

      if (this.isInTaskList(range)) {
        this.formatTask(range.startContainer);
      }
    }

    /**
     * Remove tasklist class
     * @private
     */

  }, {
    key: '_removeTaskListClass',
    value: function _removeTaskListClass() {
      // because task-list class is block merge normal list and task list
      this.wwe.get$Body().find('.task-list').each(function (index, node) {
        (0, _jquery2.default)(node).removeClass('task-list');
      });
    }
  }]);

  return WwTaskManager;
}();

exports.default = WwTaskManager;

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements wysiwyg hr manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _domUtils = __webpack_require__(4);

var _domUtils2 = _interopRequireDefault(_domUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class WwHrManager
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @ignore
 */
var WwHrManager = function () {
  function WwHrManager(wwe) {
    _classCallCheck(this, WwHrManager);

    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @type {string}
     */
    this.name = 'hr';

    this._init();
  }

  /**
   * Initialize
   * @private
   */


  _createClass(WwHrManager, [{
    key: '_init',
    value: function _init() {
      this._initEvent();
    }

    /**
     * Initialize eventmanager event
     * @private
     */

  }, {
    key: '_initEvent',
    value: function _initEvent() {
      var _this = this;

      this.eventManager.listen('wysiwygSetValueAfter', function () {
        _this._insertEmptyLineIfNeed();
        _this._changeHRForWysiwyg();
      });
    }

    /**
     * If <hr> is frist or last child of root, insert empty line before or after HR
     * @private
     */

  }, {
    key: '_insertEmptyLineIfNeed',
    value: function _insertEmptyLineIfNeed() {
      var editorContentBody = this.wwe.get$Body()[0];
      var firstChild = editorContentBody.firstChild,
          lastChild = editorContentBody.lastChild;


      if (firstChild && firstChild.nodeName === 'HR') {
        editorContentBody.insertBefore(_domUtils2.default.createEmptyLine(), firstChild);
      } else if (lastChild && lastChild.nodeName === 'HR') {
        editorContentBody.appendChild(_domUtils2.default.createEmptyLine());
      }
    }

    /**
     * <hr> is set contenteditable to false with wrapping div like below.
     * <div contenteditable="false"><hr contenteditable="false"><div>
     * @private
     */

  }, {
    key: '_changeHRForWysiwyg',
    value: function _changeHRForWysiwyg() {
      var editorContentBody = this.wwe.get$Body()[0];
      var hrNodes = editorContentBody.querySelectorAll('hr');

      _tuiCodeSnippet2.default.forEachArray(hrNodes, function (hrNode) {
        var parentNode = hrNode.parentNode;


        parentNode.replaceChild(_domUtils2.default.createHorizontalRule(), hrNode);
      });
    }
  }]);

  return WwHrManager;
}();

exports.default = WwHrManager;

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements wysiwyg p tag manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class WwPManager
 * @param {WysiwygEditor} wwe - wysiwygEditor instance
 * @ignore
 */
var WwPManager = function () {
  function WwPManager(wwe) {
    _classCallCheck(this, WwPManager);

    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @type {string}
     */
    this.name = 'p';

    this._initEvent();
  }

  /**
   * Initialize event
   * @private
   */


  _createClass(WwPManager, [{
    key: '_initEvent',
    value: function _initEvent() {
      var _this = this;

      this.eventManager.listen('wysiwygSetValueBefore', function (html) {
        return _this._splitPtagContentLines(html);
      });

      this.eventManager.listen('wysiwygSetValueAfter', function () {
        _this._ensurePtagContentWrappedWithDiv();
        _this._unwrapPtags();
      });
    }

    /**
     * Split multiple line content of p tags
     * @param {string} html html text
     * @returns {string} result
     * @private
     */

  }, {
    key: '_splitPtagContentLines',
    value: function _splitPtagContentLines(html) {
      if (html) {
        var $wrapper = (0, _jquery2.default)('<div />');

        $wrapper.html(html);
        $wrapper.find('p').each(function (pIndex, para) {
          var content = para.innerHTML;
          var lines = content.split(/<br>/gi);
          var lastIndex = lines.length - 1;
          // cross browsing: old browser not has nextElementSibling attribute
          var nextElement = para.nextElementSibling || para.nextSibling;
          var splitedContent = '';

          splitedContent = lines.map(function (line, index) {
            var result = '';

            if (index > 0 && index < lastIndex) {
              line = line ? line : '<br>';
            }

            if (line) {
              result = '<div>' + line + '</div>';
            }

            return result;
          });

          // For paragraph, we add empty line
          if (nextElement && nextElement.nodeName === 'P') {
            splitedContent.push('<div><br></div>');
          }

          (0, _jquery2.default)(para).replaceWith((0, _jquery2.default)(splitedContent.join('')));
        });
        html = $wrapper.html();
      }

      return html;
    }

    /**
     * Wrap new line inside P tag to DIV, and additional empty line added within too
     * @private
     */

  }, {
    key: '_ensurePtagContentWrappedWithDiv',
    value: function _ensurePtagContentWrappedWithDiv() {
      this.wwe.get$Body().find('p').each(function (index, node) {
        if ((0, _jquery2.default)(node).find('div').length <= 0) {
          (0, _jquery2.default)(node).wrapInner('<div />');
        }

        if ((0, _jquery2.default)(node).next().is('p')) {
          (0, _jquery2.default)(node).append('<div><br></div>');
        }
      });
    }

    /**
     * Unwrap P tag
     * @private
     */

  }, {
    key: '_unwrapPtags',
    value: function _unwrapPtags() {
      this.wwe.get$Body().find('div').each(function (index, node) {
        if ((0, _jquery2.default)(node).parent().is('p')) {
          (0, _jquery2.default)(node).unwrap();
        }
      });
    }
  }]);

  return WwPManager;
}();

exports.default = WwPManager;

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements wysiwyg heading manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _domUtils = __webpack_require__(4);

var _domUtils2 = _interopRequireDefault(_domUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FIND_HEADING_RX = /h[\d]/i;

/**
 * Class WwHeadingManager
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @ignore
 */

var WwHeadingManager = function () {
  function WwHeadingManager(wwe) {
    _classCallCheck(this, WwHeadingManager);

    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @type {string}
     */
    this.name = 'heading';

    this._init();
  }

  /**
   * Initialize
   * @private
   */


  _createClass(WwHeadingManager, [{
    key: '_init',
    value: function _init() {
      this._initEvent();
      this._initKeyHandler();
    }
  }, {
    key: '_initEvent',
    value: function _initEvent() {
      var _this = this;

      this.eventManager.listen('wysiwygSetValueAfter', function () {
        _this._wrapDefaultBlockToHeadingInner();
      });
    }

    /**
     * Initialize key event handler
     * @private
     */

  }, {
    key: '_initKeyHandler',
    value: function _initKeyHandler() {
      var _this2 = this;

      this.wwe.addKeyEventHandler('ENTER', function (ev, range) {
        if (_this2.wwe.hasFormatWithRx(FIND_HEADING_RX)) {
          _this2._onEnter(ev, range);

          return false;
        }

        return true;
      });

      this.wwe.addKeyEventHandler('BACK_SPACE', function (ev, range) {
        if (_this2.wwe.hasFormatWithRx(FIND_HEADING_RX)) {
          _this2._removePrevTopNodeIfNeed(ev, range);

          return false;
        }

        return true;
      });
    }

    /**
     * Wrap default block to heading inner contents
     * @private
     */

  }, {
    key: '_wrapDefaultBlockToHeadingInner',
    value: function _wrapDefaultBlockToHeadingInner() {
      this.wwe.get$Body().find('h1, h2, h3, h4, h5, h6').each(function (index, node) {
        if ((0, _jquery2.default)(node).children('div, p').length <= 0) {
          (0, _jquery2.default)(node).wrapInner('<div />');
        }
      });
    }

    /**
     * Unwrap heading
     * @private
     */

  }, {
    key: '_unwrapHeading',
    value: function _unwrapHeading() {
      this.wwe.unwrapBlockTag(function (node) {
        return FIND_HEADING_RX.test(node);
      });
    }

    /**
     * Enter key handler
     * @param {Event} event event object
     * @param {Range} range range
     * @private
     */

  }, {
    key: '_onEnter',
    value: function _onEnter(event, range) {
      var _this3 = this;

      if (range.startOffset > 0) {
        // I hate this but there's no way
        this.wwe.defer(function (wwe) {
          _this3._unwrapHeading();
          wwe.getEditor().removeLastUndoStack();
        });
      } else {
        event.preventDefault();
        this._insertEmptyBlockToPrevious(range);
      }
    }

    /**
     * Insert empty block to previous of passed range
     * @param {Range} range range
     * @private
     */

  }, {
    key: '_insertEmptyBlockToPrevious',
    value: function _insertEmptyBlockToPrevious(range) {
      this.wwe.getEditor().saveUndoState(range);
      (0, _jquery2.default)('<div><br></div>').insertBefore(_domUtils2.default.getParentUntil(range.startContainer, this.wwe.get$Body()[0]));
    }

    /**
     * Remove previous top node if need
     * @param {Event} event event object
     * @param {Range} range range
     * @returns {Boolean} whether needed or not
     * @private
     */

  }, {
    key: '_removePrevTopNodeIfNeed',
    value: function _removePrevTopNodeIfNeed(event, range) {
      var isHandled = false;

      if (range.collapsed && range.startOffset === 0) {
        var startContainer = range.startContainer;

        var prevTopNode = _domUtils2.default.getTopPrevNodeUnder(startContainer, this.wwe.get$Body()[0]);
        var isPrevTopNodeEmpty = prevTopNode && prevTopNode.textContent.length === 0;
        var sq = this.wwe.getEditor();

        if (startContainer.textContent.length === 0) {
          isHandled = this._removeHedingAndChangeSelection(event, range, prevTopNode);
        } else if (isPrevTopNodeEmpty) {
          event.preventDefault();
          sq.saveUndoState(range);

          (0, _jquery2.default)(prevTopNode).remove();
          isHandled = true;
        }
      }

      return isHandled;
    }

    /**
     * Remove heading and change selection
     * @param {object} event Event object
     * @param {Range} range Range object
     * @param {HTMLElement} prevTopNode Previous top node
     * @returns {boolean}
     * @private
     */

  }, {
    key: '_removeHedingAndChangeSelection',
    value: function _removeHedingAndChangeSelection(event, range, prevTopNode) {
      var startContainer = range.startContainer;

      var sq = this.wwe.getEditor();
      var $Body = this.wwe.get$Body();
      var isHeading = FIND_HEADING_RX.test(_domUtils2.default.getNodeName(startContainer));
      var headingElement = isHeading ? startContainer : (0, _jquery2.default)(startContainer).parents('h1,h2,h3,h4,h5,h6')[0];
      var targetNode = prevTopNode;
      var offset = 1;

      if (!event.defaultPrevented) {
        event.preventDefault();
        sq.saveUndoState(range);
      }

      (0, _jquery2.default)(headingElement).remove();

      if (!prevTopNode) {
        targetNode = $Body.children('div').first().get(0);
        offset = 0;
      }

      range.setStart(targetNode, offset);
      range.collapse(true);
      sq.setSelection(range);

      return true;
    }
  }]);

  return WwHeadingManager;
}();

exports.default = WwHeadingManager;

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _squireRte = __webpack_require__(67);

var _squireRte2 = _interopRequireDefault(_squireRte);

var _domUtils = __webpack_require__(4);

var _domUtils2 = _interopRequireDefault(_domUtils);

var _util = __webpack_require__(14);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements squire extension
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var FIND_BLOCK_TAGNAME_RX = /\b(H[\d]|LI|P|BLOCKQUOTE|TD)\b/;
var isIElt11 = /Trident\/[456]\./.test(navigator.userAgent);

/**
 * Class SquireExt
 * @params {Squire} ...args
 */

var SquireExt = function (_Squire) {
  _inherits(SquireExt, _Squire);

  function SquireExt() {
    var _ref;

    _classCallCheck(this, SquireExt);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, (_ref = SquireExt.__proto__ || Object.getPrototypeOf(SquireExt)).call.apply(_ref, [this].concat(args)));

    _this._decorateHandlerToCancelable('copy');
    _this._decorateHandlerToCancelable(isIElt11 ? 'beforecut' : 'cut');
    _this._decorateHandlerToCancelable(isIElt11 ? 'beforepaste' : 'paste');

    _this.get$Body = function () {
      _this.$body = _this.$body || (0, _jquery2.default)(_this.getRoot());

      return _this.$body;
    };
    return _this;
  }

  /**
   * Decorate squire handler to cancelable cuz sometimes, we dont need squire handler process
   * event.preventDefault() will cancel squire and browser default behavior
   * event.squirePrevented = true will cancel squire but allow browser default behavior
   * @param {string} eventName event name
   * @private
   */


  _createClass(SquireExt, [{
    key: '_decorateHandlerToCancelable',
    value: function _decorateHandlerToCancelable(eventName) {
      var handlers = this._events[eventName];

      if (handlers.length > 1) {
        throw new Error('too many' + eventName + 'handlers in squire');
      }

      var handler = handlers[0].bind(this);

      handlers[0] = function (event) {
        if (!event.defaultPrevented && !event.squirePrevented) {
          handler(event);
        }
      };
    }
  }, {
    key: 'changeBlockFormat',
    value: function changeBlockFormat(srcCondition, targetTagName) {
      var _this2 = this;

      this.modifyBlocks(function (frag) {
        var current = void 0,
            newFrag = void 0,
            newBlock = void 0,
            nextBlock = void 0,
            tagName = void 0,
            lastNodeOfNextBlock = void 0,
            appendChidToNextBlock = void 0;

        // HR is non-block element, so frag don't have it
        // make a default block
        if (frag.childNodes.length) {
          current = frag.childNodes.item(0);
        } else {
          current = _this2.createDefaultBlock();
          frag.appendChild(current);
        }

        if (srcCondition) {
          // find last depth
          while (current.firstChild) {
            current = current.firstChild;
          }

          appendChidToNextBlock = function appendChidToNextBlock(node) {
            nextBlock.appendChild(node);
          };

          // find tag
          while (current !== frag) {
            var _current = current;
            tagName = _current.tagName;


            if (_tuiCodeSnippet2.default.isFunction(srcCondition) ? srcCondition(tagName) : tagName === srcCondition) {
              nextBlock = current.childNodes.item(0);

              // there is no next blocktag
              // eslint-disable-next-line max-depth
              if (!_domUtils2.default.isElemNode(nextBlock) || current.childNodes.length > 1) {
                nextBlock = _this2.createDefaultBlock();

                _tuiCodeSnippet2.default.forEachArray(_tuiCodeSnippet2.default.toArray(current.childNodes), appendChidToNextBlock);

                lastNodeOfNextBlock = nextBlock.lastChild;

                // remove unneccesary br
                // eslint-disable-next-line max-depth
                if (lastNodeOfNextBlock && _domUtils2.default.getNodeName(lastNodeOfNextBlock) === 'BR') {
                  nextBlock.removeChild(lastNodeOfNextBlock);
                }
              }

              // eslint-disable-next-line max-depth
              if (targetTagName) {
                newBlock = _this2.createElement(targetTagName, [nextBlock]);
              } else {
                newBlock = nextBlock;
              }

              newFrag = _this2.getDocument().createDocumentFragment();
              newFrag.appendChild(newBlock);

              frag = newFrag;

              break;
            }

            current = current.parentNode;
          }
        }

        // if source condition node is not founded, we wrap current div node with node named targetTagName
        if ((!newFrag || !srcCondition) && targetTagName && _domUtils2.default.getNodeName(frag.childNodes[0]) === 'DIV') {
          frag = _this2.createElement(targetTagName, [frag.childNodes[0]]);
        }

        return frag;
      });
    }
  }, {
    key: 'changeBlockFormatTo',
    value: function changeBlockFormatTo(targetTagName) {
      this.changeBlockFormat(function (tagName) {
        return FIND_BLOCK_TAGNAME_RX.test(tagName);
      }, targetTagName);
    }
  }, {
    key: 'getCaretPosition',
    value: function getCaretPosition() {
      return this.getCursorPosition();
    }
  }, {
    key: 'replaceSelection',
    value: function replaceSelection(content, selection) {
      if (selection) {
        this.setSelection(selection);
      }

      this._ignoreChange = true;
      this.insertHTML(content);
    }
  }, {
    key: 'replaceRelativeOffset',
    value: function replaceRelativeOffset(content, offset, overwriteLength) {
      var selection = this.getSelection().cloneRange();

      this._replaceRelativeOffsetOfSelection(content, offset, overwriteLength, selection);
    }
  }, {
    key: '_replaceRelativeOffsetOfSelection',
    value: function _replaceRelativeOffsetOfSelection(content, offset, overwriteLength, selection) {
      var startSelectionInfo = void 0,
          endSelectionInfo = void 0,
          finalOffset = void 0;
      var endOffsetNode = selection.endContainer;
      var endTextOffset = selection.endOffset;

      if (_domUtils2.default.getNodeName(endOffsetNode) !== 'TEXT') {
        endOffsetNode = this._getClosestTextNode(endOffsetNode, endTextOffset);

        if (endOffsetNode) {
          if (_domUtils2.default.isTextNode(endOffsetNode)) {
            endTextOffset = endOffsetNode.nodeValue.length;
          } else {
            endTextOffset = endOffsetNode.textContent.length;
          }
        }
      }

      if (endOffsetNode) {
        startSelectionInfo = this.getSelectionInfoByOffset(endOffsetNode, endTextOffset + offset);
        selection.setStart(startSelectionInfo.element, startSelectionInfo.offset);

        finalOffset = endTextOffset + (offset + overwriteLength);
        endSelectionInfo = this.getSelectionInfoByOffset(endOffsetNode, finalOffset);
        selection.setEnd(endSelectionInfo.element, endSelectionInfo.offset);

        this.replaceSelection(content, selection);
      } else {
        this.replaceSelection(content);
      }
    }
  }, {
    key: '_getClosestTextNode',
    value: function _getClosestTextNode(node, offset) {
      var foundNode = _domUtils2.default.getChildNodeByOffset(node, offset - 1);

      if (_domUtils2.default.getNodeName(foundNode) !== 'TEXT') {
        foundNode = foundNode.previousSibling;
      }

      return foundNode;
    }
  }, {
    key: 'getSelectionInfoByOffset',
    value: function getSelectionInfoByOffset(anchorElement, offset) {
      var traceElement = void 0,
          traceElementLength = void 0,
          traceOffset = void 0,
          stepLength = void 0;
      var direction = offset >= 0 ? 'next' : 'previous';
      var offsetAbs = Math.abs(offset);
      var latestAvailableElement = traceElement;

      if (direction === 'next') {
        traceElement = anchorElement;
      } else {
        traceElement = anchorElement.previousSibling;
      }

      traceOffset = offsetAbs;
      stepLength = 0;

      while (traceElement) {
        if (_domUtils2.default.isTextNode(traceElement)) {
          traceElementLength = traceElement.nodeValue.length;
        } else {
          traceElementLength = traceElement.textContent.length;
        }

        stepLength += traceElementLength;

        if (offsetAbs <= stepLength) {
          break;
        }

        traceOffset -= traceElementLength;

        if (_domUtils2.default.getTextLength(traceElement) > 0) {
          latestAvailableElement = traceElement;
        }

        traceElement = traceElement[direction + 'Sibling'];
      }

      if (!traceElement) {
        traceElement = latestAvailableElement;
        traceOffset = _domUtils2.default.getTextLength(traceElement);
      }

      if (direction === 'previous') {
        traceOffset = _domUtils2.default.getTextLength(traceElement) - traceOffset;
      }

      return {
        element: traceElement,
        offset: traceOffset
      };
    }
  }, {
    key: 'getSelectionPosition',
    value: function getSelectionPosition(selection, style, offset) {
      var marker = this.createElement('INPUT');
      var range = selection.cloneRange();
      var endSelectionInfo = this.getSelectionInfoByOffset(selection.endContainer, selection.endOffset + (offset || 0));
      range.setStart(range.startContainer, range.startOffset);
      range.setEnd(endSelectionInfo.element, endSelectionInfo.offset);

      // to prevent squire input event fire
      this._ignoreChange = true;
      this.insertElement(marker, range);

      var pos = (0, _jquery2.default)(marker).offset();

      if (style !== 'over') {
        pos.top += (0, _jquery2.default)(marker).outerHeight();
      }

      marker.parentNode.removeChild(marker);

      selection.setStart(selection.endContainer, selection.endOffset);
      selection.collapse(true);

      this.setSelection(selection);

      return pos;
    }
  }, {
    key: 'removeLastUndoStack',
    value: function removeLastUndoStack() {
      if (this._undoStack.length) {
        this._undoStackLength -= 1;
        this._undoIndex -= 1;
        this._undoStack.pop();
        this._isInUndoState = false;
      }
    }
  }, {
    key: 'replaceParent',
    value: function replaceParent(node, from, to) {
      var target = (0, _jquery2.default)(node).closest(from);

      if (target.length) {
        target.wrapInner('<' + to + '/>');
        target.children().unwrap();
      }
    }
  }, {
    key: 'preserveLastLine',
    value: function preserveLastLine() {
      var lastBlock = this.get$Body().children().last();

      if (_domUtils2.default.getNodeName(lastBlock[0]) !== 'DIV') {
        this._ignoreChange = true;
        (0, _jquery2.default)(this.createDefaultBlock()).insertAfter(lastBlock);
      }
    }
  }, {
    key: 'scrollTop',
    value: function scrollTop(top) {
      if (_tuiCodeSnippet2.default.isUndefined(top)) {
        return this.get$Body().scrollTop();
      }

      return this.get$Body().scrollTop(top);
    }
  }, {
    key: 'isIgnoreChange',
    value: function isIgnoreChange() {
      return this._ignoreChange;
    }
  }, {
    key: 'focus',
    value: function focus() {
      _squireRte2.default.prototype.focus.call(this);
    }
  }, {
    key: 'blockCommandShortcuts',
    value: function blockCommandShortcuts() {
      var _this3 = this;

      var meta = _util.isMac ? 'meta' : 'ctrl';
      var keys = ['b', 'i', 'u', 'shift-7', 'shift-5', 'shift-6', 'shift-8', 'shift-9', '[', ']', 'd'];

      keys.forEach(function (key) {
        _this3.setKeyHandler(meta + '-' + key, function (editor, keyboardEvent) {
          keyboardEvent.preventDefault();
        });
      });
    }
  }]);

  return SquireExt;
}(_squireRte2.default);

exports.default = SquireExt;

/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__67__;

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements WwTextObject
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _domUtils = __webpack_require__(4);

var _domUtils2 = _interopRequireDefault(_domUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isIE11 = _tuiCodeSnippet2.default.browser.msie && _tuiCodeSnippet2.default.browser.version === 11;
var isWindowChrome = navigator.appVersion.indexOf('Win') !== -1 && _tuiCodeSnippet2.default.browser.chrome;
var isWindows10 = /Windows (NT )?10/g.test(navigator.appVersion);
var isNeedOffsetFix = isIE11 || isWindowChrome && !isWindows10;

/**
 * Class WwTextObject
 * @param {WysiwygEditor} wwe - wysiwygEditor
 * @param {Range} range - Range object
 */

var WwTextObject = function () {
  function WwTextObject(wwe, range) {
    _classCallCheck(this, WwTextObject);

    this._wwe = wwe;

    // msie11 and window chrome can't make start offset of range api correctly when compositing korean.
    // so we need fix this when compositing korean.(and maybe other languages that needs composition.)
    if (isNeedOffsetFix) {
      this.isComposition = false;
      this._initCompositionEvent();
    }

    this.setRange(range || this._wwe.getRange());
  }

  /**
   * Initialize composition event
   * @private
   */


  _createClass(WwTextObject, [{
    key: '_initCompositionEvent',
    value: function _initCompositionEvent() {
      var _this = this;

      this._wwe.getEditor().addEventListener('compositionstart', function () {
        _this.isComposition = true;
      });

      this._wwe.getEditor().addEventListener('compositionend', function () {
        _this.isComposition = false;
      });
    }

    /**
     * Set _range object to given range object
     * @param {Range} range Range object
     */

  }, {
    key: 'setRange',
    value: function setRange(range) {
      if (this._range) {
        this._range.detach();
      }

      this._range = range;
    }

    /**
     * Expand start offset by one
     */

  }, {
    key: 'expandStartOffset',
    value: function expandStartOffset() {
      var range = this._range;

      if (_domUtils2.default.isTextNode(range.startContainer) && range.startOffset > 0) {
        range.setStart(range.startContainer, range.startOffset - 1);
      }
    }

    /**
     * Expand end offset by one
     */

  }, {
    key: 'expandEndOffset',
    value: function expandEndOffset() {
      var range = this._range;

      if (_domUtils2.default.isTextNode(range.endContainer) && range.endOffset < range.endContainer.nodeValue.length) {
        range.setEnd(range.endContainer, range.endOffset + 1);
      }
    }

    /**
     * setEnd range on start
     * @param {Range} range Range object
     */

  }, {
    key: 'setEndBeforeRange',
    value: function setEndBeforeRange(range) {
      var offset = range.startOffset;

      if (this.isComposition) {
        offset += 1;
      }

      this._range.setEnd(range.startContainer, offset);
    }

    /**
     * Get text content
     * @returns {string}
     */

  }, {
    key: 'getTextContent',
    value: function getTextContent() {
      return this._range.cloneContents().textContent;
    }

    /**
     * Replace current selection content to given text
     * @param {string} content Text content
     */

  }, {
    key: 'replaceContent',
    value: function replaceContent(content) {
      this._wwe.getEditor().setSelection(this._range);
      this._wwe.getEditor().insertHTML(content);

      // When range is in table, 'insertHTML' makes div in table.
      // So after 'insertHTML', div in table should be unwrap.
      // 'wysiwygRangeChangeAfter' event let wwTableManager call '_unwrapBlockInTable'
      if (this._wwe.isInTable(this._range)) {
        this._wwe.eventManager.emit('wysiwygRangeChangeAfter', this._wwe);
      }

      this._range = this._wwe.getRange();
    }

    /**
     * Delete current selection content
     */

  }, {
    key: 'deleteContent',
    value: function deleteContent() {
      this._wwe.getEditor().setSelection(this._range);
      this._wwe.getEditor().insertHTML('');
      this._range = this._wwe.getRange();
    }

    /**
     * Peek previous element's content
     * @param {number} offset Offset to peek
     * @returns {string}
     */

  }, {
    key: 'peekStartBeforeOffset',
    value: function peekStartBeforeOffset(offset) {
      var range = this._range.cloneRange();

      range.setStart(range.startContainer, Math.max(range.startOffset - offset, 0));
      range.setEnd(this._range.startContainer, this._range.startOffset);

      return range.cloneContents().textContent;
    }
  }]);

  return WwTextObject;
}();

exports.default = WwTextObject;

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _blockOverlay = __webpack_require__(70);

var _blockOverlay2 = _interopRequireDefault(_blockOverlay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements UI code block gadget
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var EVENT_LANGUAGE_CHANGED = 'language-changed';
var GADGET_WIDTH = 250;
var GADGET_HEIGHT = 30;

/**
 * Class CodeBlockGadget
 * @param {Object} options - options
 *     @param {EventManager} options.eventManager - event manager instance
 *     @param {HTMLElement} options.container - container element
 *     @param {WysiwygEditor} options.wysiwygEditor - wysiwyg editor instance
 * @ignore
 */

var CodeBlockGadget = function (_BlockOverlay) {
  _inherits(CodeBlockGadget, _BlockOverlay);

  function CodeBlockGadget(_ref) {
    var eventManager = _ref.eventManager,
        container = _ref.container,
        wysiwygEditor = _ref.wysiwygEditor;

    _classCallCheck(this, CodeBlockGadget);

    var _this = _possibleConstructorReturn(this, (CodeBlockGadget.__proto__ || Object.getPrototypeOf(CodeBlockGadget)).call(this, {
      eventManager: eventManager,
      container: container,
      attachedSelector: 'pre'
    }));

    _this._wysiwygEditor = wysiwygEditor;
    _this._popupCodeBlockLanguages = null;

    _this._initDOM();
    _this._initDOMEvent();
    return _this;
  }

  _createClass(CodeBlockGadget, [{
    key: '_initDOM',
    value: function _initDOM() {
      var _this2 = this;

      this.$el.addClass('code-block-header');
      this._$languageLabel = (0, _jquery2.default)('<span>text</span>');
      this.$el.append(this._$languageLabel);
      this._$buttonOpenModalEditor = (0, _jquery2.default)('<button type="button">Editor</button>');
      this.$el.append(this._$buttonOpenModalEditor);
      this._eventManager.emit('removeEditor', function () {
        _this2._$buttonOpenModalEditor.off('click');
        _this2._$buttonOpenModalEditor = null;
      });
    }
  }, {
    key: '_initDOMEvent',
    value: function _initDOMEvent() {
      var _this3 = this;

      this._$buttonOpenModalEditor.on('click', function () {
        return _this3._openPopupCodeBlockEditor();
      });
    }
  }, {
    key: '_openPopupCodeBlockEditor',
    value: function _openPopupCodeBlockEditor() {
      this._eventManager.emit('openPopupCodeBlockEditor', this.getAttachedElement());
    }
  }, {
    key: '_updateLanguage',
    value: function _updateLanguage() {
      var attachedElement = this.getAttachedElement();
      var language = attachedElement ? attachedElement.getAttribute('data-language') : null;

      this._$languageLabel.text(language ? language : 'text');
    }

    /**
     * update gadget position
     * @protected
     * @override
     */

  }, {
    key: 'syncLayout',
    value: function syncLayout() {
      var $attachedElement = (0, _jquery2.default)(this.getAttachedElement());
      var offset = $attachedElement.offset();

      offset.left = offset.left + ($attachedElement.outerWidth() - GADGET_WIDTH);

      this.$el.offset(offset);
      this.$el.height(GADGET_HEIGHT);
      this.$el.width(GADGET_WIDTH);
    }

    /**
     * on show
     * @protected
     * @override
     */

  }, {
    key: 'onShow',
    value: function onShow() {
      var _this4 = this;

      _get(CodeBlockGadget.prototype.__proto__ || Object.getPrototypeOf(CodeBlockGadget.prototype), 'onShow', this).call(this);

      this._onAttachedElementChange = function () {
        return _this4._updateLanguage();
      };
      (0, _jquery2.default)(this.getAttachedElement()).on(EVENT_LANGUAGE_CHANGED, this._onAttachedElementChange);

      this._updateLanguage();
    }

    /**
     * on hide
     * @protected
     * @override
     */

  }, {
    key: 'onHide',
    value: function onHide() {
      (0, _jquery2.default)(this.getAttachedElement()).off(EVENT_LANGUAGE_CHANGED, this._onAttachedElementChange);

      _get(CodeBlockGadget.prototype.__proto__ || Object.getPrototypeOf(CodeBlockGadget.prototype), 'onHide', this).call(this);
    }
  }]);

  return CodeBlockGadget;
}(_blockOverlay2.default);

exports.default = CodeBlockGadget;

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements UI block overlay
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class BlockOverlay
 * @param {Object} options - options
 *     @param {EventManager} options.eventManager - event manager instance
 *     @param {HTMLElement} options.container - container element
 *     @param {string} options.attachedSelector - selector string to find attached element
 * @ignore
 */
var BlockOverlay = function () {
  function BlockOverlay(_ref) {
    var eventManager = _ref.eventManager,
        container = _ref.container,
        attachedSelector = _ref.attachedSelector;

    _classCallCheck(this, BlockOverlay);

    this._eventManager = eventManager;
    this._attachedSelector = '[contenteditable=true] ' + attachedSelector;
    this._$container = (0, _jquery2.default)(container);
    this._$attachedElement = null;

    /**
     * is activated.
     * if this blockOverlay is active, It always be visible unconditionally.
     * @type {boolean}
     * @private
     */
    this.active = false;

    this._createElement();
    this._initEvent();
  }

  _createClass(BlockOverlay, [{
    key: '_createElement',
    value: function _createElement() {
      this.$el = (0, _jquery2.default)('<div class="te-ww-block-overlay">');
      this.$el.css({
        position: 'absolute',
        display: 'none',
        'z-index': 1
      });
      this._$container.append(this.$el);
    }
  }, {
    key: '_initEvent',
    value: function _initEvent() {
      var _this = this;

      this._eventManager.listen('change', this._onChange.bind(this));
      this._eventManager.listen('mouseover', this._onMouseOver.bind(this));
      this._eventManager.listen('focus', function () {
        _this.setVisibility(false);
      });
      this._eventManager.listen('mousedown', function () {
        _this.setVisibility(false);
      });
    }
  }, {
    key: '_onChange',
    value: function _onChange() {
      if (this._$attachedElement && _jquery2.default.contains(document, this._$attachedElement[0])) {
        this.syncLayout();
      } else {
        this.setVisibility(false);
      }
    }
  }, {
    key: '_onMouseOver',
    value: function _onMouseOver(ev) {
      var originalEvent = ev.data;
      var $eventTarget = (0, _jquery2.default)(originalEvent.target);
      var $attachedElement = $eventTarget.closest(this._attachedSelector);

      if ($attachedElement.length) {
        this._$attachedElement = $attachedElement;
        this.setVisibility(true);
      } else if ($eventTarget.closest(this.$el).length) {
        this.setVisibility(true);
      } else if (!this.active) {
        this.setVisibility(false);
      }
    }

    /**
     * update blockOverlay position & size update to attached element
     * you may want to override this to adjust position & size
     * @protected
     */

  }, {
    key: 'syncLayout',
    value: function syncLayout() {
      this.$el.offset(this._$attachedElement.offset());
      this.$el.width(this._$attachedElement.outerWidth());
      this.$el.height(this._$attachedElement.outerHeight());
    }

    /**
     * attached element
     * @protected
     * @returns {HTMLElement} - attached element
     */

  }, {
    key: 'getAttachedElement',
    value: function getAttachedElement() {
      return this._$attachedElement ? this._$attachedElement.get(0) : null;
    }

    /**
     * visibility
     * @protected
     * @returns {boolean} visibility
     */

  }, {
    key: 'getVisibility',
    value: function getVisibility() {
      return this.$el.css('display') === 'block';
    }

    /**
     * visibility
     * @param {boolean} visibility - is visible
     * @protected
     */

  }, {
    key: 'setVisibility',
    value: function setVisibility(visibility) {
      if (visibility && this._$attachedElement) {
        if (!this.getVisibility()) {
          this.$el.css('display', 'block');
          this.syncLayout();
          this.onShow();
        }
      } else if (!visibility) {
        if (this.getVisibility()) {
          this.$el.css('display', 'none');
          this.onHide();
        }
      }
    }

    /**
     * called on show. you may want to override to get the event
     * @protected
     * @abstract
     */

  }, {
    key: 'onShow',
    value: function onShow() {}

    /**
     * called on hide. you may want to override to get the event
     * @protected
     */

  }, {
    key: 'onHide',
    value: function onHide() {
      this.active = false;
      this._$attachedElement = null;
    }
  }]);

  return BlockOverlay;
}();

exports.default = BlockOverlay;

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview editor layout
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Editor container template
 * @type {string}
 * @ignore
 */
var containerTmpl = ['<div class="tui-editor">', '<div class="te-md-container">', '<div class="te-editor" />', '<div class="te-md-splitter" />', '<div class="te-preview" />', '</div>', '<div class="te-ww-container">', '<div class="te-editor" />', '</div>', '</div>'].join('');

/**
 * Class Layout
 * @param {object} options - Option object
 * @param {EventManager} eventManager - Event manager instance
 * @ignore
 */

var Layout = function () {
  function Layout(options, eventManager) {
    _classCallCheck(this, Layout);

    this.$el = (0, _jquery2.default)(options.el);
    this.height = options.height;
    this.type = options.initialEditType;
    this.eventManager = eventManager;

    this.init();
    this._initEvent();
  }

  /**
   * Initializer
   * @protected
   */


  _createClass(Layout, [{
    key: 'init',
    value: function init() {
      this._renderLayout();

      this._initMarkdownAndPreviewSection();
      this._initWysiwygSection();
    }

    /**
     * Initialize show and hide event
     * @private
     */

  }, {
    key: '_initEvent',
    value: function _initEvent() {
      this.eventManager.listen('hide', this.hide.bind(this));
      this.eventManager.listen('show', this.show.bind(this));
    }

    /**
     * Create editor container with template
     * @private
     */

  }, {
    key: '_renderLayout',
    value: function _renderLayout() {
      this.$el.css('box-sizing', 'border-box');
      this.$containerEl = (0, _jquery2.default)(containerTmpl).appendTo(this.$el);
    }

    /**
     * Switch editor mode to WYSIWYG
     */

  }, {
    key: 'switchToWYSIWYG',
    value: function switchToWYSIWYG() {
      this.$containerEl.removeClass('te-md-mode');
      this.$containerEl.addClass('te-ww-mode');
    }

    /**
     * Switch editor mode to Markdown
     */

  }, {
    key: 'switchToMarkdown',
    value: function switchToMarkdown() {
      this.$containerEl.removeClass('te-ww-mode');
      this.$containerEl.addClass('te-md-mode');
    }

    /**
     * Initialize editor to Markdown and set preview section
     * @private
     */

  }, {
    key: '_initMarkdownAndPreviewSection',
    value: function _initMarkdownAndPreviewSection() {
      this.$mdEditorContainerEl = this.$containerEl.find('.te-md-container .te-editor');
      this.$previewEl = this.$containerEl.find('.te-md-container .te-preview');
    }

    /**
     * Initialize editor to WYSIWYG
     * @private
     */

  }, {
    key: '_initWysiwygSection',
    value: function _initWysiwygSection() {
      this.$wwEditorContainerEl = this.$containerEl.find('.te-ww-container .te-editor');
    }

    /**
     * Set preview to vertical split style
     * @private
     */

  }, {
    key: '_verticalSplitStyle',
    value: function _verticalSplitStyle() {
      this.$containerEl.find('.te-md-container').removeClass('te-preview-style-tab');
      this.$containerEl.find('.te-md-container').addClass('te-preview-style-vertical');
    }

    /**
     * Set tab style preview mode
     * @private
     */

  }, {
    key: '_tabStyle',
    value: function _tabStyle() {
      this.$containerEl.find('.te-md-container').removeClass('te-preview-style-vertical');
      this.$containerEl.find('.te-md-container').addClass('te-preview-style-tab');
    }

    /**
     * Toggle preview style between tab and vertical split
     * @param {string} style Preview style ('tab' or 'vertical')
     */

  }, {
    key: 'changePreviewStyle',
    value: function changePreviewStyle(style) {
      if (style === 'tab') {
        this._tabStyle();
      } else if (style === 'vertical') {
        this._verticalSplitStyle();
      }
    }

    /**
     * Hide Editor
     */

  }, {
    key: 'hide',
    value: function hide() {
      this.$el.find('.tui-editor').addClass('te-hide');
    }

    /**
     * Show Editor
     */

  }, {
    key: 'show',
    value: function show() {
      this.$el.find('.tui-editor').removeClass('te-hide');
    }

    /**
     * Remove Editor
     */

  }, {
    key: 'remove',
    value: function remove() {
      this.$el.find('.tui-editor').remove();
    }

    /**
     * Get jQuery wrapped editor container element
     * @returns {jQuery}
     */

  }, {
    key: 'getEditorEl',
    value: function getEditorEl() {
      return this.$containerEl;
    }

    /**
     * Get jQuery wrapped preview element
     * @returns {jQuery}
     */

  }, {
    key: 'getPreviewEl',
    value: function getPreviewEl() {
      return this.$previewEl;
    }

    /**
     * Get jQuery wrapped Markdown editor element
     * @returns {jQuery}
     */

  }, {
    key: 'getMdEditorContainerEl',
    value: function getMdEditorContainerEl() {
      return this.$mdEditorContainerEl;
    }

    /**
     * Get jQuery wrapped WYSIWYG editor element
     * @returns {jQuery}
     */

  }, {
    key: 'getWwEditorContainerEl',
    value: function getWwEditorContainerEl() {
      return this.$wwEditorContainerEl;
    }
  }]);

  return Layout;
}();

exports.default = Layout;

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview default UI
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _defaultToolbar = __webpack_require__(73);

var _defaultToolbar2 = _interopRequireDefault(_defaultToolbar);

var _tab = __webpack_require__(44);

var _tab2 = _interopRequireDefault(_tab);

var _layerpopup = __webpack_require__(5);

var _layerpopup2 = _interopRequireDefault(_layerpopup);

var _modeSwitch = __webpack_require__(78);

var _modeSwitch2 = _interopRequireDefault(_modeSwitch);

var _popupAddLink = __webpack_require__(79);

var _popupAddLink2 = _interopRequireDefault(_popupAddLink);

var _popupAddImage = __webpack_require__(80);

var _popupAddImage2 = _interopRequireDefault(_popupAddImage);

var _popupTableUtils = __webpack_require__(81);

var _popupTableUtils2 = _interopRequireDefault(_popupTableUtils);

var _popupAddTable = __webpack_require__(82);

var _popupAddTable2 = _interopRequireDefault(_popupAddTable);

var _popupAddHeading = __webpack_require__(83);

var _popupAddHeading2 = _interopRequireDefault(_popupAddHeading);

var _popupCodeBlockLanguages = __webpack_require__(84);

var _popupCodeBlockLanguages2 = _interopRequireDefault(_popupCodeBlockLanguages);

var _popupCodeBlockEditor = __webpack_require__(85);

var _popupCodeBlockEditor2 = _interopRequireDefault(_popupCodeBlockEditor);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _tooltip = __webpack_require__(35);

var _tooltip2 = _interopRequireDefault(_tooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CLASS_TOOLBAR = 'te-toolbar-section';
var CLASS_MARKDOWN_TAB = 'te-markdown-tab-section';
var CLASS_EDITOR = 'te-editor-section';
var CLASS_MODE_SWITCH = 'te-mode-switch-section';
var CONTAINER_TEMPLATE = '\n    <div class="tui-editor-defaultUI">\n        <div class="' + CLASS_TOOLBAR + '"><div class="' + CLASS_MARKDOWN_TAB + '"></div></div>\n        <div class="' + CLASS_EDITOR + '"></div>\n        <div class="' + CLASS_MODE_SWITCH + '"></div>\n    </div>\n';

/**
 * Class DefaultUI
 * @param {ToastUIEditor} editor - editor instance
 */

var DefaultUI = function () {

  /**
   * mode switch instance
   * @private
   * @type {ModeSwitch}
   */


  /**
   * markdown tab section jQuery element
   * @private
   * @type {HTMLElement}
   */


  /**
   * editor type ww/md
   * @private
   * @type {string}
   */


  /**
   * @type {HTMLElement}
   * @private
   */


  /**
   * DefaultToolbar wrapper element
   * @type {jQuery}
   */
  function DefaultUI(editor) {
    _classCallCheck(this, DefaultUI);

    Object.defineProperty(this, 'name', {
      enumerable: true,
      writable: true,
      value: 'default'
    });
    Object.defineProperty(this, '_popups', {
      enumerable: true,
      writable: true,
      value: []
    });

    this._editor = editor;
    this._initialEditType = editor.options.initialEditType;

    this._init(editor.options);
    this._initEvent();
  }

  /**
   * popup instances
   * @private
   * @type {Array}
   */


  /**
   * markdown tab
   * @private
   * @type {Tab}
   */


  /**
   * editor instance
   * @private
   * @type {ToastUIEditor}
   */


  /**
   * editor section element
   * @private
   * @type {HTMLElement}
   */


  /**
   * DefaultToolbar instance
   * @type {DefaultToolbar}
   * @private
   */

  /**
   * UI name
   * @type {string}
   */


  _createClass(DefaultUI, [{
    key: '_init',
    value: function _init(_ref) {
      var container = _ref.el,
          toolbarItems = _ref.toolbarItems,
          hideModeSwitch = _ref.hideModeSwitch;

      this.$el = (0, _jquery2.default)(CONTAINER_TEMPLATE).appendTo(container);
      this._container = container;
      this._editorSection = this.$el.find('.' + CLASS_EDITOR).get(0);
      this._editorSection.appendChild(this._editor.layout.getEditorEl().get(0));

      this._initToolbar(this._editor.eventManager, toolbarItems);
      this._initModeSwitch(hideModeSwitch);

      this._initPopupAddLink();
      this._initPopupAddImage();
      this._initPopupAddTable();
      this._initPopupAddHeading();
      this._initPopupTableUtils();
      this._initPopupCodeBlockLanguages();
      this._initPopupCodeBlockEditor();

      this._initMarkdownTab();
    }
  }, {
    key: '_initEvent',
    value: function _initEvent() {
      this._editor.eventManager.listen('hide', this.hide.bind(this));
      this._editor.eventManager.listen('show', this.show.bind(this));
      this._editor.eventManager.listen('changeMode', this._markdownTabControl.bind(this));
      this._editor.eventManager.listen('changePreviewStyle', this._markdownTabControl.bind(this));
    }
  }, {
    key: '_initToolbar',
    value: function _initToolbar(eventManager, toolbarItems) {
      var toolbar = new _defaultToolbar2.default(eventManager, toolbarItems);
      this._toolbar = toolbar;
      this.$el.find('.' + CLASS_TOOLBAR).append(toolbar.$el);
    }
  }, {
    key: '_initModeSwitch',
    value: function _initModeSwitch(hideModeSwitch) {
      var _this = this;

      var modeSwitchTabBar = this.$el.find('.' + CLASS_MODE_SWITCH);
      var editType = this._initialEditType === 'markdown' ? _modeSwitch2.default.TYPE.MARKDOWN : _modeSwitch2.default.TYPE.WYSIWYG;
      var modeSwitch = new _modeSwitch2.default(modeSwitchTabBar, editType);
      this._modeSwitch = modeSwitch;

      if (hideModeSwitch) {
        modeSwitch.hide();
      }

      modeSwitch.on('modeSwitched', function (ev, type) {
        return _this._editor.changeMode(type);
      });
    }
  }, {
    key: '_initMarkdownTab',
    value: function _initMarkdownTab() {
      var editor = this._editor;

      this._markdownTab = new _tab2.default({
        initName: _i18n2.default.get('Write'),
        items: [_i18n2.default.get('Write'), _i18n2.default.get('Preview')],
        sections: [editor.layout.getMdEditorContainerEl(), editor.layout.getPreviewEl()]
      });
      this._$markdownTabSection = this.$el.find('.' + CLASS_MARKDOWN_TAB);
      this._$markdownTabSection.append(this._markdownTab.$el);

      this._markdownTab.on('itemClick', function (ev, itemText) {
        if (itemText === _i18n2.default.get('Preview')) {
          editor.eventManager.emit('previewNeedsRefresh');
          editor.eventManager.emit('changePreviewTabPreview');
          editor.eventManager.emit('closeAllPopup');
        } else {
          editor.getCodeMirror().focus();
          editor.eventManager.emit('changePreviewTabWrite');
        }
      });
    }
  }, {
    key: '_markdownTabControl',
    value: function _markdownTabControl() {
      if (this._editor.isMarkdownMode() && this._editor.getCurrentPreviewStyle() === 'tab') {
        this._$markdownTabSection.show();
        this._markdownTab.activate(_i18n2.default.get('Write'));
      } else {
        this._$markdownTabSection.hide();
      }
    }
  }, {
    key: '_initPopupAddLink',
    value: function _initPopupAddLink() {
      this._popups.push(new _popupAddLink2.default({
        $target: this.$el,
        editor: this._editor
      }));
    }
  }, {
    key: '_initPopupAddImage',
    value: function _initPopupAddImage() {
      this._popups.push(new _popupAddImage2.default({
        $target: this.$el,
        eventManager: this._editor.eventManager
      }));
    }
  }, {
    key: '_initPopupAddTable',
    value: function _initPopupAddTable() {
      this._popups.push(new _popupAddTable2.default({
        $target: this._toolbar.$el,
        eventManager: this._editor.eventManager,
        $button: this.$el.find('button.tui-table'),
        css: {
          'position': 'absolute'
        }
      }));
    }
  }, {
    key: '_initPopupAddHeading',
    value: function _initPopupAddHeading() {
      this._popups.push(new _popupAddHeading2.default({
        $target: this._toolbar.$el,
        eventManager: this._editor.eventManager,
        $button: this.$el.find('button.tui-heading'),
        css: {
          'position': 'absolute'
        }
      }));
    }
  }, {
    key: '_initPopupTableUtils',
    value: function _initPopupTableUtils() {
      var _this2 = this;

      this._editor.eventManager.listen('contextmenu', function (ev) {
        if ((0, _jquery2.default)(ev.data.target).parents('[contenteditable=true] table').length > 0) {
          ev.data.preventDefault();
          _this2._editor.eventManager.emit('openPopupTableUtils', ev.data);
        }
      });

      this._popups.push(new _popupTableUtils2.default({
        $target: this.$el,
        eventManager: this._editor.eventManager
      }));
    }
  }, {
    key: '_initPopupCodeBlockLanguages',
    value: function _initPopupCodeBlockLanguages() {
      var editor = this._editor;
      this._popups.push(new _popupCodeBlockLanguages2.default({
        $target: this.$el,
        eventManager: editor.eventManager,
        languages: editor.options.codeBlockLanguages
      }));
    }
  }, {
    key: '_initPopupCodeBlockEditor',
    value: function _initPopupCodeBlockEditor() {
      this._popups.push(new _popupCodeBlockEditor2.default({
        $target: this.$el,
        eventManager: this._editor.eventManager,
        convertor: this._editor.convertor
      }));
    }

    /**
     * get toolbar instance
     * @returns {Toolbar} - toolbar instance
     */

  }, {
    key: 'getToolbar',
    value: function getToolbar() {
      return this._toolbar;
    }

    /**
     * set toolbar instance
     * @param {Toolbar} toolbar - toolbar
     */

  }, {
    key: 'setToolbar',
    value: function setToolbar(toolbar) {
      this._toolbar.destroy();
      this._toolbar = toolbar;
    }

    /**
     * get mode switch instance
     * @returns {ModeSwitch} - mode switch instance
     */

  }, {
    key: 'getModeSwitch',
    value: function getModeSwitch() {
      return this._modeSwitch;
    }

    /**
     * get editor section height
     * @returns {Number} - height of editor section
     */

  }, {
    key: 'getEditorSectionHeight',
    value: function getEditorSectionHeight() {
      var clientRect = this._editorSection.getBoundingClientRect();

      return clientRect.bottom - clientRect.top;
    }

    /**
     * get editor height
     * @returns {Number} - height of editor
     */

  }, {
    key: 'getEditorHeight',
    value: function getEditorHeight() {
      var clientRect = this._container.getBoundingClientRect();

      return clientRect.bottom - clientRect.top;
    }

    /**
     * get Table Popup
     * @returns {PopupTableUtils} - PopupTableUtils
     */

  }, {
    key: 'getPopupTableUtils',
    value: function getPopupTableUtils() {
      var tablePopup = void 0;
      this._popups.forEach(function (popup) {
        if (popup instanceof _popupTableUtils2.default) {
          tablePopup = popup;
        }
      });

      return tablePopup;
    }

    /**
     * hide
     */

  }, {
    key: 'hide',
    value: function hide() {
      this.$el.addClass('te-hide');
    }

    /**
     * show
     */

  }, {
    key: 'show',
    value: function show() {
      this.$el.removeClass('te-hide');
    }

    /**
     * remove
     */

  }, {
    key: 'remove',
    value: function remove() {
      this.$el.remove();
      this._markdownTab.remove();
      this._modeSwitch.remove();
      this._toolbar.destroy();
      this._popups.forEach(function (popup) {
        return popup.remove();
      });
      this._popups = [];
      _tooltip2.default.hide();
    }

    /**
     * creates popup
     * @param {LayerPopupOption} options - layerPopup options
     * @returns {LayerPopup} - crated layerPopup
     */

  }, {
    key: 'createPopup',
    value: function createPopup(options) {
      return new _layerpopup2.default(options);
    }
  }]);

  return DefaultUI;
}();

exports.default = DefaultUI;

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _resizeObserverPolyfill = __webpack_require__(74);

var _resizeObserverPolyfill2 = _interopRequireDefault(_resizeObserverPolyfill);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _toolbar = __webpack_require__(41);

var _toolbar2 = _interopRequireDefault(_toolbar);

var _popupDropdownToolbar = __webpack_require__(77);

var _popupDropdownToolbar2 = _interopRequireDefault(_popupDropdownToolbar);

var _toolbarItemFactory = __webpack_require__(43);

var _toolbarItemFactory2 = _interopRequireDefault(_toolbarItemFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview implements DefaultToolbar
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var MORE_BUTTON_NAME = 'more';

/**
 * Class DefaultToolbar
 */

var DefaultToolbar = function (_Toolbar) {
  _inherits(DefaultToolbar, _Toolbar);

  /**
   * popup dropdown toolbar
   * @type {PopupDropdownToolbar}
   * @private
   */
  function DefaultToolbar(eventManager, options) {
    _classCallCheck(this, DefaultToolbar);

    var _this = _possibleConstructorReturn(this, (DefaultToolbar.__proto__ || Object.getPrototypeOf(DefaultToolbar)).call(this, eventManager, options));

    _this._init(eventManager);
    _this._bindWidthChangedEvent();
    return _this;
  }

  /**
   * insert toolbar item
   * @param  {number} index - index at given item inserted
   * @param  {ToolbarItem|string|object} item - toolbar item
   * @override
   */


  /**
   * resize observer
   * @type {ResizeObserver}
   * @private
   */

  /**
   * more button
   * @type {ToolbarButton}
   * @private
   */


  _createClass(DefaultToolbar, [{
    key: 'insertItem',
    value: function insertItem(index, item) {
      _get(DefaultToolbar.prototype.__proto__ || Object.getPrototypeOf(DefaultToolbar.prototype), 'insertItem', this).call(this, index, item);
      this._arrangeMoreButton();
    }
  }, {
    key: '_init',
    value: function _init(eventManager) {
      var moreButton = _toolbarItemFactory2.default.create('button', {
        name: MORE_BUTTON_NAME,
        className: 'tui-more',
        tooltip: _i18n2.default.get('More'),
        event: _popupDropdownToolbar2.default.OPEN_EVENT
      });
      this._moreButton = moreButton;

      this._popupDropdownToolbar = new _popupDropdownToolbar2.default({
        eventManager: eventManager,
        $target: this.$el,
        $button: moreButton.$el
      });

      this.addItem(moreButton);
    }
  }, {
    key: '_bindWidthChangedEvent',
    value: function _bindWidthChangedEvent() {
      var _this2 = this;

      this._observer = new _resizeObserverPolyfill2.default(function () {
        _this2._popupDropdownToolbar.hide();
        _this2._balanceButtons();
      });
      this._observer.observe(this.$el.get(0));
    }
  }, {
    key: '_balanceButtons',
    value: function _balanceButtons() {
      var _this3 = this;

      var dropDownToolbarItems = this._popupDropdownToolbar.getItems();
      dropDownToolbarItems.forEach(function (item) {
        _this3._popupDropdownToolbar.removeItem(item, false);

        var itemLength = _this3.getItems().length;
        _get(DefaultToolbar.prototype.__proto__ || Object.getPrototypeOf(DefaultToolbar.prototype), 'insertItem', _this3).call(_this3, itemLength, item);
      });

      this.removeItem(this._moreButton, false);
      _get(DefaultToolbar.prototype.__proto__ || Object.getPrototypeOf(DefaultToolbar.prototype), 'insertItem', this).call(this, 0, this._moreButton);

      var toolbarHeight = this.$el.height();
      var defaultToolbarItems = this.getItems();
      var overflowItems = defaultToolbarItems.filter(function (item) {
        return item.$el.position().top > toolbarHeight;
      });

      overflowItems.forEach(function (item) {
        _this3.removeItem(item, false);
        _this3._popupDropdownToolbar.addItem(item);
      });

      this._arrangeMoreButton();
    }
  }, {
    key: '_arrangeMoreButton',
    value: function _arrangeMoreButton() {
      if (!this._popupDropdownToolbar) {
        return;
      }

      this.removeItem(this._moreButton, false);

      var hasOverflow = this._popupDropdownToolbar.getItems().length > 0;
      var itemLength = this.getItems().length;
      if (hasOverflow) {
        _get(DefaultToolbar.prototype.__proto__ || Object.getPrototypeOf(DefaultToolbar.prototype), 'insertItem', this).call(this, itemLength, this._moreButton);
      }
    }

    /**
     * destroy
     * @override
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      if (this._observer) {
        this._observer.disconnect();
        this._observer = null;
      }
    }
  }]);

  return DefaultToolbar;
}(_toolbar2.default);

exports.default = DefaultToolbar;

/***/ }),
/* 74 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/**
 * A collection of shims that provide minimal functionality of the ES6 collections.
 *
 * These implementations are not meant to be used outside of the ResizeObserver
 * modules as they cover only a limited range of use cases.
 */
/* eslint-disable require-jsdoc, valid-jsdoc */
var MapShim = (function () {
    if (typeof Map !== 'undefined') {
        return Map;
    }
    /**
     * Returns index in provided array that matches the specified key.
     *
     * @param {Array<Array>} arr
     * @param {*} key
     * @returns {number}
     */
    function getIndex(arr, key) {
        var result = -1;
        arr.some(function (entry, index) {
            if (entry[0] === key) {
                result = index;
                return true;
            }
            return false;
        });
        return result;
    }
    return /** @class */ (function () {
        function class_1() {
            this.__entries__ = [];
        }
        Object.defineProperty(class_1.prototype, "size", {
            /**
             * @returns {boolean}
             */
            get: function () {
                return this.__entries__.length;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {*} key
         * @returns {*}
         */
        class_1.prototype.get = function (key) {
            var index = getIndex(this.__entries__, key);
            var entry = this.__entries__[index];
            return entry && entry[1];
        };
        /**
         * @param {*} key
         * @param {*} value
         * @returns {void}
         */
        class_1.prototype.set = function (key, value) {
            var index = getIndex(this.__entries__, key);
            if (~index) {
                this.__entries__[index][1] = value;
            }
            else {
                this.__entries__.push([key, value]);
            }
        };
        /**
         * @param {*} key
         * @returns {void}
         */
        class_1.prototype.delete = function (key) {
            var entries = this.__entries__;
            var index = getIndex(entries, key);
            if (~index) {
                entries.splice(index, 1);
            }
        };
        /**
         * @param {*} key
         * @returns {void}
         */
        class_1.prototype.has = function (key) {
            return !!~getIndex(this.__entries__, key);
        };
        /**
         * @returns {void}
         */
        class_1.prototype.clear = function () {
            this.__entries__.splice(0);
        };
        /**
         * @param {Function} callback
         * @param {*} [ctx=null]
         * @returns {void}
         */
        class_1.prototype.forEach = function (callback, ctx) {
            if (ctx === void 0) { ctx = null; }
            for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
                var entry = _a[_i];
                callback.call(ctx, entry[1], entry[0]);
            }
        };
        return class_1;
    }());
})();

/**
 * Detects whether window and document objects are available in current environment.
 */
var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document;

// Returns global object of a current environment.
var global$1 = (function () {
    if (typeof global !== 'undefined' && global.Math === Math) {
        return global;
    }
    if (typeof self !== 'undefined' && self.Math === Math) {
        return self;
    }
    if (typeof window !== 'undefined' && window.Math === Math) {
        return window;
    }
    // eslint-disable-next-line no-new-func
    return Function('return this')();
})();

/**
 * A shim for the requestAnimationFrame which falls back to the setTimeout if
 * first one is not supported.
 *
 * @returns {number} Requests' identifier.
 */
var requestAnimationFrame$1 = (function () {
    if (typeof requestAnimationFrame === 'function') {
        // It's required to use a bounded function because IE sometimes throws
        // an "Invalid calling object" error if rAF is invoked without the global
        // object on the left hand side.
        return requestAnimationFrame.bind(global$1);
    }
    return function (callback) { return setTimeout(function () { return callback(Date.now()); }, 1000 / 60); };
})();

// Defines minimum timeout before adding a trailing call.
var trailingTimeout = 2;
/**
 * Creates a wrapper function which ensures that provided callback will be
 * invoked only once during the specified delay period.
 *
 * @param {Function} callback - Function to be invoked after the delay period.
 * @param {number} delay - Delay after which to invoke callback.
 * @returns {Function}
 */
function throttle (callback, delay) {
    var leadingCall = false, trailingCall = false, lastCallTime = 0;
    /**
     * Invokes the original callback function and schedules new invocation if
     * the "proxy" was called during current request.
     *
     * @returns {void}
     */
    function resolvePending() {
        if (leadingCall) {
            leadingCall = false;
            callback();
        }
        if (trailingCall) {
            proxy();
        }
    }
    /**
     * Callback invoked after the specified delay. It will further postpone
     * invocation of the original function delegating it to the
     * requestAnimationFrame.
     *
     * @returns {void}
     */
    function timeoutCallback() {
        requestAnimationFrame$1(resolvePending);
    }
    /**
     * Schedules invocation of the original function.
     *
     * @returns {void}
     */
    function proxy() {
        var timeStamp = Date.now();
        if (leadingCall) {
            // Reject immediately following calls.
            if (timeStamp - lastCallTime < trailingTimeout) {
                return;
            }
            // Schedule new call to be in invoked when the pending one is resolved.
            // This is important for "transitions" which never actually start
            // immediately so there is a chance that we might miss one if change
            // happens amids the pending invocation.
            trailingCall = true;
        }
        else {
            leadingCall = true;
            trailingCall = false;
            setTimeout(timeoutCallback, delay);
        }
        lastCallTime = timeStamp;
    }
    return proxy;
}

// Minimum delay before invoking the update of observers.
var REFRESH_DELAY = 20;
// A list of substrings of CSS properties used to find transition events that
// might affect dimensions of observed elements.
var transitionKeys = ['top', 'right', 'bottom', 'left', 'width', 'height', 'size', 'weight'];
// Check if MutationObserver is available.
var mutationObserverSupported = typeof MutationObserver !== 'undefined';
/**
 * Singleton controller class which handles updates of ResizeObserver instances.
 */
var ResizeObserverController = /** @class */ (function () {
    /**
     * Creates a new instance of ResizeObserverController.
     *
     * @private
     */
    function ResizeObserverController() {
        /**
         * Indicates whether DOM listeners have been added.
         *
         * @private {boolean}
         */
        this.connected_ = false;
        /**
         * Tells that controller has subscribed for Mutation Events.
         *
         * @private {boolean}
         */
        this.mutationEventsAdded_ = false;
        /**
         * Keeps reference to the instance of MutationObserver.
         *
         * @private {MutationObserver}
         */
        this.mutationsObserver_ = null;
        /**
         * A list of connected observers.
         *
         * @private {Array<ResizeObserverSPI>}
         */
        this.observers_ = [];
        this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
        this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
    }
    /**
     * Adds observer to observers list.
     *
     * @param {ResizeObserverSPI} observer - Observer to be added.
     * @returns {void}
     */
    ResizeObserverController.prototype.addObserver = function (observer) {
        if (!~this.observers_.indexOf(observer)) {
            this.observers_.push(observer);
        }
        // Add listeners if they haven't been added yet.
        if (!this.connected_) {
            this.connect_();
        }
    };
    /**
     * Removes observer from observers list.
     *
     * @param {ResizeObserverSPI} observer - Observer to be removed.
     * @returns {void}
     */
    ResizeObserverController.prototype.removeObserver = function (observer) {
        var observers = this.observers_;
        var index = observers.indexOf(observer);
        // Remove observer if it's present in registry.
        if (~index) {
            observers.splice(index, 1);
        }
        // Remove listeners if controller has no connected observers.
        if (!observers.length && this.connected_) {
            this.disconnect_();
        }
    };
    /**
     * Invokes the update of observers. It will continue running updates insofar
     * it detects changes.
     *
     * @returns {void}
     */
    ResizeObserverController.prototype.refresh = function () {
        var changesDetected = this.updateObservers_();
        // Continue running updates if changes have been detected as there might
        // be future ones caused by CSS transitions.
        if (changesDetected) {
            this.refresh();
        }
    };
    /**
     * Updates every observer from observers list and notifies them of queued
     * entries.
     *
     * @private
     * @returns {boolean} Returns "true" if any observer has detected changes in
     *      dimensions of it's elements.
     */
    ResizeObserverController.prototype.updateObservers_ = function () {
        // Collect observers that have active observations.
        var activeObservers = this.observers_.filter(function (observer) {
            return observer.gatherActive(), observer.hasActive();
        });
        // Deliver notifications in a separate cycle in order to avoid any
        // collisions between observers, e.g. when multiple instances of
        // ResizeObserver are tracking the same element and the callback of one
        // of them changes content dimensions of the observed target. Sometimes
        // this may result in notifications being blocked for the rest of observers.
        activeObservers.forEach(function (observer) { return observer.broadcastActive(); });
        return activeObservers.length > 0;
    };
    /**
     * Initializes DOM listeners.
     *
     * @private
     * @returns {void}
     */
    ResizeObserverController.prototype.connect_ = function () {
        // Do nothing if running in a non-browser environment or if listeners
        // have been already added.
        if (!isBrowser || this.connected_) {
            return;
        }
        // Subscription to the "Transitionend" event is used as a workaround for
        // delayed transitions. This way it's possible to capture at least the
        // final state of an element.
        document.addEventListener('transitionend', this.onTransitionEnd_);
        window.addEventListener('resize', this.refresh);
        if (mutationObserverSupported) {
            this.mutationsObserver_ = new MutationObserver(this.refresh);
            this.mutationsObserver_.observe(document, {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true
            });
        }
        else {
            document.addEventListener('DOMSubtreeModified', this.refresh);
            this.mutationEventsAdded_ = true;
        }
        this.connected_ = true;
    };
    /**
     * Removes DOM listeners.
     *
     * @private
     * @returns {void}
     */
    ResizeObserverController.prototype.disconnect_ = function () {
        // Do nothing if running in a non-browser environment or if listeners
        // have been already removed.
        if (!isBrowser || !this.connected_) {
            return;
        }
        document.removeEventListener('transitionend', this.onTransitionEnd_);
        window.removeEventListener('resize', this.refresh);
        if (this.mutationsObserver_) {
            this.mutationsObserver_.disconnect();
        }
        if (this.mutationEventsAdded_) {
            document.removeEventListener('DOMSubtreeModified', this.refresh);
        }
        this.mutationsObserver_ = null;
        this.mutationEventsAdded_ = false;
        this.connected_ = false;
    };
    /**
     * "Transitionend" event handler.
     *
     * @private
     * @param {TransitionEvent} event
     * @returns {void}
     */
    ResizeObserverController.prototype.onTransitionEnd_ = function (_a) {
        var _b = _a.propertyName, propertyName = _b === void 0 ? '' : _b;
        // Detect whether transition may affect dimensions of an element.
        var isReflowProperty = transitionKeys.some(function (key) {
            return !!~propertyName.indexOf(key);
        });
        if (isReflowProperty) {
            this.refresh();
        }
    };
    /**
     * Returns instance of the ResizeObserverController.
     *
     * @returns {ResizeObserverController}
     */
    ResizeObserverController.getInstance = function () {
        if (!this.instance_) {
            this.instance_ = new ResizeObserverController();
        }
        return this.instance_;
    };
    /**
     * Holds reference to the controller's instance.
     *
     * @private {ResizeObserverController}
     */
    ResizeObserverController.instance_ = null;
    return ResizeObserverController;
}());

/**
 * Defines non-writable/enumerable properties of the provided target object.
 *
 * @param {Object} target - Object for which to define properties.
 * @param {Object} props - Properties to be defined.
 * @returns {Object} Target object.
 */
var defineConfigurable = (function (target, props) {
    for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
        var key = _a[_i];
        Object.defineProperty(target, key, {
            value: props[key],
            enumerable: false,
            writable: false,
            configurable: true
        });
    }
    return target;
});

/**
 * Returns the global object associated with provided element.
 *
 * @param {Object} target
 * @returns {Object}
 */
var getWindowOf = (function (target) {
    // Assume that the element is an instance of Node, which means that it
    // has the "ownerDocument" property from which we can retrieve a
    // corresponding global object.
    var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;
    // Return the local global object if it's not possible extract one from
    // provided element.
    return ownerGlobal || global$1;
});

// Placeholder of an empty content rectangle.
var emptyRect = createRectInit(0, 0, 0, 0);
/**
 * Converts provided string to a number.
 *
 * @param {number|string} value
 * @returns {number}
 */
function toFloat(value) {
    return parseFloat(value) || 0;
}
/**
 * Extracts borders size from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @param {...string} positions - Borders positions (top, right, ...)
 * @returns {number}
 */
function getBordersSize(styles) {
    var positions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        positions[_i - 1] = arguments[_i];
    }
    return positions.reduce(function (size, position) {
        var value = styles['border-' + position + '-width'];
        return size + toFloat(value);
    }, 0);
}
/**
 * Extracts paddings sizes from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @returns {Object} Paddings box.
 */
function getPaddings(styles) {
    var positions = ['top', 'right', 'bottom', 'left'];
    var paddings = {};
    for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
        var position = positions_1[_i];
        var value = styles['padding-' + position];
        paddings[position] = toFloat(value);
    }
    return paddings;
}
/**
 * Calculates content rectangle of provided SVG element.
 *
 * @param {SVGGraphicsElement} target - Element content rectangle of which needs
 *      to be calculated.
 * @returns {DOMRectInit}
 */
function getSVGContentRect(target) {
    var bbox = target.getBBox();
    return createRectInit(0, 0, bbox.width, bbox.height);
}
/**
 * Calculates content rectangle of provided HTMLElement.
 *
 * @param {HTMLElement} target - Element for which to calculate the content rectangle.
 * @returns {DOMRectInit}
 */
function getHTMLElementContentRect(target) {
    // Client width & height properties can't be
    // used exclusively as they provide rounded values.
    var clientWidth = target.clientWidth, clientHeight = target.clientHeight;
    // By this condition we can catch all non-replaced inline, hidden and
    // detached elements. Though elements with width & height properties less
    // than 0.5 will be discarded as well.
    //
    // Without it we would need to implement separate methods for each of
    // those cases and it's not possible to perform a precise and performance
    // effective test for hidden elements. E.g. even jQuery's ':visible' filter
    // gives wrong results for elements with width & height less than 0.5.
    if (!clientWidth && !clientHeight) {
        return emptyRect;
    }
    var styles = getWindowOf(target).getComputedStyle(target);
    var paddings = getPaddings(styles);
    var horizPad = paddings.left + paddings.right;
    var vertPad = paddings.top + paddings.bottom;
    // Computed styles of width & height are being used because they are the
    // only dimensions available to JS that contain non-rounded values. It could
    // be possible to utilize the getBoundingClientRect if only it's data wasn't
    // affected by CSS transformations let alone paddings, borders and scroll bars.
    var width = toFloat(styles.width), height = toFloat(styles.height);
    // Width & height include paddings and borders when the 'border-box' box
    // model is applied (except for IE).
    if (styles.boxSizing === 'border-box') {
        // Following conditions are required to handle Internet Explorer which
        // doesn't include paddings and borders to computed CSS dimensions.
        //
        // We can say that if CSS dimensions + paddings are equal to the "client"
        // properties then it's either IE, and thus we don't need to subtract
        // anything, or an element merely doesn't have paddings/borders styles.
        if (Math.round(width + horizPad) !== clientWidth) {
            width -= getBordersSize(styles, 'left', 'right') + horizPad;
        }
        if (Math.round(height + vertPad) !== clientHeight) {
            height -= getBordersSize(styles, 'top', 'bottom') + vertPad;
        }
    }
    // Following steps can't be applied to the document's root element as its
    // client[Width/Height] properties represent viewport area of the window.
    // Besides, it's as well not necessary as the <html> itself neither has
    // rendered scroll bars nor it can be clipped.
    if (!isDocumentElement(target)) {
        // In some browsers (only in Firefox, actually) CSS width & height
        // include scroll bars size which can be removed at this step as scroll
        // bars are the only difference between rounded dimensions + paddings
        // and "client" properties, though that is not always true in Chrome.
        var vertScrollbar = Math.round(width + horizPad) - clientWidth;
        var horizScrollbar = Math.round(height + vertPad) - clientHeight;
        // Chrome has a rather weird rounding of "client" properties.
        // E.g. for an element with content width of 314.2px it sometimes gives
        // the client width of 315px and for the width of 314.7px it may give
        // 314px. And it doesn't happen all the time. So just ignore this delta
        // as a non-relevant.
        if (Math.abs(vertScrollbar) !== 1) {
            width -= vertScrollbar;
        }
        if (Math.abs(horizScrollbar) !== 1) {
            height -= horizScrollbar;
        }
    }
    return createRectInit(paddings.left, paddings.top, width, height);
}
/**
 * Checks whether provided element is an instance of the SVGGraphicsElement.
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */
var isSVGGraphicsElement = (function () {
    // Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
    // interface.
    if (typeof SVGGraphicsElement !== 'undefined') {
        return function (target) { return target instanceof getWindowOf(target).SVGGraphicsElement; };
    }
    // If it's so, then check that element is at least an instance of the
    // SVGElement and that it has the "getBBox" method.
    // eslint-disable-next-line no-extra-parens
    return function (target) { return (target instanceof getWindowOf(target).SVGElement &&
        typeof target.getBBox === 'function'); };
})();
/**
 * Checks whether provided element is a document element (<html>).
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */
function isDocumentElement(target) {
    return target === getWindowOf(target).document.documentElement;
}
/**
 * Calculates an appropriate content rectangle for provided html or svg element.
 *
 * @param {Element} target - Element content rectangle of which needs to be calculated.
 * @returns {DOMRectInit}
 */
function getContentRect(target) {
    if (!isBrowser) {
        return emptyRect;
    }
    if (isSVGGraphicsElement(target)) {
        return getSVGContentRect(target);
    }
    return getHTMLElementContentRect(target);
}
/**
 * Creates rectangle with an interface of the DOMRectReadOnly.
 * Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
 *
 * @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
 * @returns {DOMRectReadOnly}
 */
function createReadOnlyRect(_a) {
    var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
    // If DOMRectReadOnly is available use it as a prototype for the rectangle.
    var Constr = typeof DOMRectReadOnly !== 'undefined' ? DOMRectReadOnly : Object;
    var rect = Object.create(Constr.prototype);
    // Rectangle's properties are not writable and non-enumerable.
    defineConfigurable(rect, {
        x: x, y: y, width: width, height: height,
        top: y,
        right: x + width,
        bottom: height + y,
        left: x
    });
    return rect;
}
/**
 * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
 * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
 *
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @param {number} width - Rectangle's width.
 * @param {number} height - Rectangle's height.
 * @returns {DOMRectInit}
 */
function createRectInit(x, y, width, height) {
    return { x: x, y: y, width: width, height: height };
}

/**
 * Class that is responsible for computations of the content rectangle of
 * provided DOM element and for keeping track of it's changes.
 */
var ResizeObservation = /** @class */ (function () {
    /**
     * Creates an instance of ResizeObservation.
     *
     * @param {Element} target - Element to be observed.
     */
    function ResizeObservation(target) {
        /**
         * Broadcasted width of content rectangle.
         *
         * @type {number}
         */
        this.broadcastWidth = 0;
        /**
         * Broadcasted height of content rectangle.
         *
         * @type {number}
         */
        this.broadcastHeight = 0;
        /**
         * Reference to the last observed content rectangle.
         *
         * @private {DOMRectInit}
         */
        this.contentRect_ = createRectInit(0, 0, 0, 0);
        this.target = target;
    }
    /**
     * Updates content rectangle and tells whether it's width or height properties
     * have changed since the last broadcast.
     *
     * @returns {boolean}
     */
    ResizeObservation.prototype.isActive = function () {
        var rect = getContentRect(this.target);
        this.contentRect_ = rect;
        return (rect.width !== this.broadcastWidth ||
            rect.height !== this.broadcastHeight);
    };
    /**
     * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
     * from the corresponding properties of the last observed content rectangle.
     *
     * @returns {DOMRectInit} Last observed content rectangle.
     */
    ResizeObservation.prototype.broadcastRect = function () {
        var rect = this.contentRect_;
        this.broadcastWidth = rect.width;
        this.broadcastHeight = rect.height;
        return rect;
    };
    return ResizeObservation;
}());

var ResizeObserverEntry = /** @class */ (function () {
    /**
     * Creates an instance of ResizeObserverEntry.
     *
     * @param {Element} target - Element that is being observed.
     * @param {DOMRectInit} rectInit - Data of the element's content rectangle.
     */
    function ResizeObserverEntry(target, rectInit) {
        var contentRect = createReadOnlyRect(rectInit);
        // According to the specification following properties are not writable
        // and are also not enumerable in the native implementation.
        //
        // Property accessors are not being used as they'd require to define a
        // private WeakMap storage which may cause memory leaks in browsers that
        // don't support this type of collections.
        defineConfigurable(this, { target: target, contentRect: contentRect });
    }
    return ResizeObserverEntry;
}());

var ResizeObserverSPI = /** @class */ (function () {
    /**
     * Creates a new instance of ResizeObserver.
     *
     * @param {ResizeObserverCallback} callback - Callback function that is invoked
     *      when one of the observed elements changes it's content dimensions.
     * @param {ResizeObserverController} controller - Controller instance which
     *      is responsible for the updates of observer.
     * @param {ResizeObserver} callbackCtx - Reference to the public
     *      ResizeObserver instance which will be passed to callback function.
     */
    function ResizeObserverSPI(callback, controller, callbackCtx) {
        /**
         * Collection of resize observations that have detected changes in dimensions
         * of elements.
         *
         * @private {Array<ResizeObservation>}
         */
        this.activeObservations_ = [];
        /**
         * Registry of the ResizeObservation instances.
         *
         * @private {Map<Element, ResizeObservation>}
         */
        this.observations_ = new MapShim();
        if (typeof callback !== 'function') {
            throw new TypeError('The callback provided as parameter 1 is not a function.');
        }
        this.callback_ = callback;
        this.controller_ = controller;
        this.callbackCtx_ = callbackCtx;
    }
    /**
     * Starts observing provided element.
     *
     * @param {Element} target - Element to be observed.
     * @returns {void}
     */
    ResizeObserverSPI.prototype.observe = function (target) {
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }
        // Do nothing if current environment doesn't have the Element interface.
        if (typeof Element === 'undefined' || !(Element instanceof Object)) {
            return;
        }
        if (!(target instanceof getWindowOf(target).Element)) {
            throw new TypeError('parameter 1 is not of type "Element".');
        }
        var observations = this.observations_;
        // Do nothing if element is already being observed.
        if (observations.has(target)) {
            return;
        }
        observations.set(target, new ResizeObservation(target));
        this.controller_.addObserver(this);
        // Force the update of observations.
        this.controller_.refresh();
    };
    /**
     * Stops observing provided element.
     *
     * @param {Element} target - Element to stop observing.
     * @returns {void}
     */
    ResizeObserverSPI.prototype.unobserve = function (target) {
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }
        // Do nothing if current environment doesn't have the Element interface.
        if (typeof Element === 'undefined' || !(Element instanceof Object)) {
            return;
        }
        if (!(target instanceof getWindowOf(target).Element)) {
            throw new TypeError('parameter 1 is not of type "Element".');
        }
        var observations = this.observations_;
        // Do nothing if element is not being observed.
        if (!observations.has(target)) {
            return;
        }
        observations.delete(target);
        if (!observations.size) {
            this.controller_.removeObserver(this);
        }
    };
    /**
     * Stops observing all elements.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.disconnect = function () {
        this.clearActive();
        this.observations_.clear();
        this.controller_.removeObserver(this);
    };
    /**
     * Collects observation instances the associated element of which has changed
     * it's content rectangle.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.gatherActive = function () {
        var _this = this;
        this.clearActive();
        this.observations_.forEach(function (observation) {
            if (observation.isActive()) {
                _this.activeObservations_.push(observation);
            }
        });
    };
    /**
     * Invokes initial callback function with a list of ResizeObserverEntry
     * instances collected from active resize observations.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.broadcastActive = function () {
        // Do nothing if observer doesn't have active observations.
        if (!this.hasActive()) {
            return;
        }
        var ctx = this.callbackCtx_;
        // Create ResizeObserverEntry instance for every active observation.
        var entries = this.activeObservations_.map(function (observation) {
            return new ResizeObserverEntry(observation.target, observation.broadcastRect());
        });
        this.callback_.call(ctx, entries, ctx);
        this.clearActive();
    };
    /**
     * Clears the collection of active observations.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.clearActive = function () {
        this.activeObservations_.splice(0);
    };
    /**
     * Tells whether observer has active observations.
     *
     * @returns {boolean}
     */
    ResizeObserverSPI.prototype.hasActive = function () {
        return this.activeObservations_.length > 0;
    };
    return ResizeObserverSPI;
}());

// Registry of internal observers. If WeakMap is not available use current shim
// for the Map collection as it has all required methods and because WeakMap
// can't be fully polyfilled anyway.
var observers = typeof WeakMap !== 'undefined' ? new WeakMap() : new MapShim();
/**
 * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
 * exposing only those methods and properties that are defined in the spec.
 */
var ResizeObserver = /** @class */ (function () {
    /**
     * Creates a new instance of ResizeObserver.
     *
     * @param {ResizeObserverCallback} callback - Callback that is invoked when
     *      dimensions of the observed elements change.
     */
    function ResizeObserver(callback) {
        if (!(this instanceof ResizeObserver)) {
            throw new TypeError('Cannot call a class as a function.');
        }
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }
        var controller = ResizeObserverController.getInstance();
        var observer = new ResizeObserverSPI(callback, controller, this);
        observers.set(this, observer);
    }
    return ResizeObserver;
}());
// Expose public methods of ResizeObserver.
[
    'observe',
    'unobserve',
    'disconnect'
].forEach(function (method) {
    ResizeObserver.prototype[method] = function () {
        var _a;
        return (_a = observers.get(this))[method].apply(_a, arguments);
    };
});

var index = (function () {
    // Export existing implementation if available.
    if (typeof global$1.ResizeObserver !== 'undefined') {
        return global$1.ResizeObserver;
    }
    return ResizeObserver;
})();

/* harmony default export */ __webpack_exports__["default"] = (index);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(75)))

/***/ }),
/* 75 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _button = __webpack_require__(19);

var _button2 = _interopRequireDefault(_button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements UI Button
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Toolbar Button UI
 * @ignore
 */
var ToolbarButton = function (_Button) {
  _inherits(ToolbarButton, _Button);

  function ToolbarButton() {
    _classCallCheck(this, ToolbarButton);

    return _possibleConstructorReturn(this, (ToolbarButton.__proto__ || Object.getPrototypeOf(ToolbarButton)).apply(this, arguments));
  }

  return ToolbarButton;
}(_button2.default);

exports.default = ToolbarButton;

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _layerpopup = __webpack_require__(5);

var _layerpopup2 = _interopRequireDefault(_layerpopup);

var _toolbar = __webpack_require__(41);

var _toolbar2 = _interopRequireDefault(_toolbar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview implements DefaultToolbar
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Class PopupDropdownToolbar
 * @param {LayerPopupOption} options - layer popup option
 * @ignore
 */
var PopupDropdownToolbar = function (_LayerPopup) {
  _inherits(PopupDropdownToolbar, _LayerPopup);

  function PopupDropdownToolbar(options) {
    _classCallCheck(this, PopupDropdownToolbar);

    options = _tuiCodeSnippet2.default.extend({
      header: false,
      className: 'te-dropdown-toolbar'
    }, options);
    return _possibleConstructorReturn(this, (PopupDropdownToolbar.__proto__ || Object.getPrototypeOf(PopupDropdownToolbar)).call(this, options));
  }

  /**
   * get toolbar instance it contains
   * @returns {Toolbar} - toolbar instance
   */

  /**
   * open event string
   * @type {string}
   */


  _createClass(PopupDropdownToolbar, [{
    key: 'getToolbar',
    value: function getToolbar() {
      return this._toolbar;
    }

    /**
     * get toolbar items
     * @returns {ToolbarItem[]} - toolbar items
     */

  }, {
    key: 'getItems',
    value: function getItems() {
      return this.getToolbar().getItems();
    }

    /**
     * get toolbar item at given index
     * @param  {number} index - item index
     * @returns {ToolbarItem} - toolbar item at the index
     */

  }, {
    key: 'getItem',
    value: function getItem(index) {
      return this.getToolbar().getItem(index);
    }

    /**
     * set toolbar items
     * @param {ToolbarItem[]} items - toolbar items
     */

  }, {
    key: 'setItems',
    value: function setItems(items) {
      this.getToolbar().setItems(items);
    }

    /**
     * add toolbar item
     * @param {ToolbarItem|string|object} item - toolbar item
     */

  }, {
    key: 'addItem',
    value: function addItem(item) {
      this.getToolbar().addItem(item);
    }

    /**
     * insert toolbar item
     * @param  {number} index - index at given item inserted
     * @param  {ToolbarItem|string|object} item - toolbar item
     */

  }, {
    key: 'insertItem',
    value: function insertItem(index, item) {
      this.getToolbar().insertItem(index, item);
    }

    /**
     * get index of given item
     * @param  {ToolbarItem} item - toolbar item
     * @returns {number} - index of given toolbar item
     */

  }, {
    key: 'indexOfItem',
    value: function indexOfItem(item) {
      return this.getToolbar().indexOfItem(item);
    }

    /**
     * remove an item
     * @param  {number} index - item index to remove
     * @param  {boolean} destroy - destroy item or not
     * @returns {ToolbarItem} - removed item
     */

  }, {
    key: 'removeItem',
    value: function removeItem(index, destroy) {
      return this.getToolbar().removeItem(index, destroy);
    }

    /**
     * remove all toolbar items
     */

  }, {
    key: 'removeAllItems',
    value: function removeAllItems() {
      this.getToolbar().removeAllItems();
    }

    /**
     * init instance.
     * store properties & prepare before initialize DOM
     * @param {LayerPopupOption} options - layer popup options
     * @private
     * @override
     */

  }, {
    key: '_initInstance',
    value: function _initInstance(options) {
      _get(PopupDropdownToolbar.prototype.__proto__ || Object.getPrototypeOf(PopupDropdownToolbar.prototype), '_initInstance', this).call(this, options);

      var $button = options.$button,
          eventManager = options.eventManager;


      this._$button = $button;
      this._eventManager = eventManager;
      this._toolbar = new _toolbar2.default(eventManager);
    }

    /**
     * initialize DOM, render popup
     * @private
     * @override
     */

  }, {
    key: '_initDOM',
    value: function _initDOM() {
      _get(PopupDropdownToolbar.prototype.__proto__ || Object.getPrototypeOf(PopupDropdownToolbar.prototype), '_initDOM', this).call(this);

      this.setContent(this._toolbar.$el);
    }

    /**
     * bind editor events
     * @private
     * @override
     */

  }, {
    key: '_initEditorEvent',
    value: function _initEditorEvent() {
      var _this2 = this;

      _get(PopupDropdownToolbar.prototype.__proto__ || Object.getPrototypeOf(PopupDropdownToolbar.prototype), '_initEditorEvent', this).call(this);

      this._eventManager.listen('focus', function () {
        return _this2.hide();
      });
      this._eventManager.listen('closeAllPopup', function () {
        return _this2.hide();
      });
      this._eventManager.listen(PopupDropdownToolbar.OPEN_EVENT, function () {
        var isShown = _this2.isShow();
        _this2._eventManager.emit('closeAllPopup');
        if (!isShown) {
          _this2.show();
        }

        // to give toolbar element enough width before the calculation
        _this2.$el.css({
          left: '-1000px'
        });
        var $button = _this2._$button;
        var position = $button.position();
        var buttonOuterHeightWithMargin = $button.outerHeight(true);
        var buttonMarginBottom = (buttonOuterHeightWithMargin - $button.outerHeight()) / 2;
        var top = position.top + buttonOuterHeightWithMargin - buttonMarginBottom;
        var left = position.left + $button.outerWidth(true) - _this2.$el.outerWidth(true);

        _this2.$el.css({
          top: top,
          left: left
        });
      });
    }
  }]);

  return PopupDropdownToolbar;
}(_layerpopup2.default);

Object.defineProperty(PopupDropdownToolbar, 'OPEN_EVENT', {
  enumerable: true,
  writable: true,
  value: 'openDropdownToolbar'
});
exports.default = PopupDropdownToolbar;

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _uicontroller = __webpack_require__(8);

var _uicontroller2 = _interopRequireDefault(_uicontroller);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements ui mode switch
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var MARKDOWN = 'markdown';
var WYSIWYG = 'wysiwyg';

/**
 * Class ModeSwitch
 * UI Control for switch between Markdown and WYSIWYG
 * @param {jQuery} $rootElement - root jquery element
 * @param {string} initialType - initial type of editor
 */

var ModeSwitch = function (_UIController) {
  _inherits(ModeSwitch, _UIController);

  /**
   * current mode
   * @type {String}
   * @private
   */

  /**
   * mode switch type
   * @property {string} MARKDOWN - Markdown
   * @property {string} WYSIWYG - WYSIWYG
   * @static
   * @ignore
   */
  function ModeSwitch($rootElement, initialType) {
    _classCallCheck(this, ModeSwitch);

    var _this = _possibleConstructorReturn(this, (ModeSwitch.__proto__ || Object.getPrototypeOf(ModeSwitch)).call(this, {
      tagName: 'div',
      className: 'te-mode-switch'
    }));

    Object.defineProperty(_this, '_buttons', {
      enumerable: true,
      writable: true,
      value: {}
    });


    _this._render($rootElement);
    _this._switchType(_tuiCodeSnippet2.default.isExisty(initialType) ? initialType : MARKDOWN);
    return _this;
  }

  /**
   * is the switch tab bar shown
   * @returns {Boolean} - showing status
   */


  /**
   * root element
   * @type {jQuery}
   * @private
   */


  /**
   * mode switch buttons
   * @type {Object}
   * @private
   */


  _createClass(ModeSwitch, [{
    key: 'isShown',
    value: function isShown() {
      return this._$rootElement.css('display') === 'block';
    }

    /**
     * show switch tab bar
     */

  }, {
    key: 'show',
    value: function show() {
      this._$rootElement.css('display', 'block');
    }

    /**
     * hide switch tab bar
     */

  }, {
    key: 'hide',
    value: function hide() {
      this._$rootElement.css('display', 'none');
    }
  }, {
    key: '_render',
    value: function _render($rootElement) {
      this._buttons.$markdown = (0, _jquery2.default)('<button class="te-switch-button markdown" type="button">' + _i18n2.default.get('Markdown') + '</button>');
      this._buttons.$wysiwyg = (0, _jquery2.default)('<button class="te-switch-button wysiwyg" type="button">' + _i18n2.default.get('WYSIWYG') + '</button>');
      this.$el.append(this._buttons.$markdown);
      this.$el.append(this._buttons.$wysiwyg);

      if ($rootElement) {
        $rootElement.append(this.$el);
        this._$rootElement = $rootElement;
      }

      this.on('click .markdown', this._changeMarkdown.bind(this));
      this.on('click .wysiwyg', this._changeWysiwyg.bind(this));

      this.show();
    }
  }, {
    key: '_changeMarkdown',
    value: function _changeMarkdown() {
      this._switchType(MARKDOWN);
    }
  }, {
    key: '_changeWysiwyg',
    value: function _changeWysiwyg() {
      this._switchType(WYSIWYG);
    }
  }, {
    key: '_setActiveButton',
    value: function _setActiveButton(type) {
      this._buttons.$markdown.removeClass('active');
      this._buttons.$wysiwyg.removeClass('active');
      this._buttons['$' + type].addClass('active');
    }
  }, {
    key: '_switchType',
    value: function _switchType(type) {
      if (this._type === type) {
        return;
      }

      this._type = type;
      this._setActiveButton(type);
      this.trigger('modeSwitched', this._type);
    }
  }]);

  return ModeSwitch;
}(_uicontroller2.default);

Object.defineProperty(ModeSwitch, 'TYPE', {
  enumerable: true,
  writable: true,
  value: {
    MARKDOWN: MARKDOWN,
    WYSIWYG: WYSIWYG
  }
});
exports.default = ModeSwitch;

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _layerpopup = __webpack_require__(5);

var _layerpopup2 = _interopRequireDefault(_layerpopup);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements PopupAddLink
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/([^\s]*))?$/;

/**
 * Class PopupAddLink
 * It implements a link Add Popup
 * @param {LayerPopupOption} options - layer popup options
 * @ignore
 */

var PopupAddLink = function (_LayerPopup) {
  _inherits(PopupAddLink, _LayerPopup);

  function PopupAddLink(options) {
    _classCallCheck(this, PopupAddLink);

    var POPUP_CONTENT = '\n            <label for="url">' + _i18n2.default.get('URL') + '</label>\n            <input type="text" class="te-url-input" />\n            <label for="linkText">' + _i18n2.default.get('Link text') + '</label>\n            <input type="text" class="te-link-text-input" />\n            <div class="te-button-section">\n                <button type="button" class="te-ok-button">' + _i18n2.default.get('OK') + '</button>\n                <button type="button" class="te-close-button">' + _i18n2.default.get('Cancel') + '</button>\n            </div>\n        ';
    options = _tuiCodeSnippet2.default.extend({
      header: true,
      title: _i18n2.default.get('Insert link'),
      className: 'te-popup-add-link tui-editor-popup',
      content: POPUP_CONTENT
    }, options);
    return _possibleConstructorReturn(this, (PopupAddLink.__proto__ || Object.getPrototypeOf(PopupAddLink)).call(this, options));
  }

  /**
   * init instance.
   * store properties & prepare before initialize DOM
   * @param {LayerPopupOption} options - layer popup options
   * @private
   * @override
   */


  _createClass(PopupAddLink, [{
    key: '_initInstance',
    value: function _initInstance(options) {
      _get(PopupAddLink.prototype.__proto__ || Object.getPrototypeOf(PopupAddLink.prototype), '_initInstance', this).call(this, options);

      this._editor = options.editor;
      this._eventManager = options.editor.eventManager;
    }

    /**
     * initialize DOM, render popup
     * @private
     * @override
     */

  }, {
    key: '_initDOM',
    value: function _initDOM() {
      _get(PopupAddLink.prototype.__proto__ || Object.getPrototypeOf(PopupAddLink.prototype), '_initDOM', this).call(this);

      var el = this.$el.get(0);
      this._inputText = el.querySelector('.te-link-text-input');
      this._inputURL = el.querySelector('.te-url-input');
    }

    /**
     * bind DOM events
     * @private
     * @override
     */

  }, {
    key: '_initDOMEvent',
    value: function _initDOMEvent() {
      var _this2 = this;

      _get(PopupAddLink.prototype.__proto__ || Object.getPrototypeOf(PopupAddLink.prototype), '_initDOMEvent', this).call(this);

      this.on('click .te-close-button', function () {
        return _this2.hide();
      });
      this.on('click .te-ok-button', function () {
        return _this2._addLink();
      });

      this.on('shown', function () {
        var inputText = _this2._inputText;
        var inputURL = _this2._inputURL;

        var selectedText = _this2._editor.getSelectedText().trim();

        inputText.value = selectedText;
        if (URL_REGEX.exec(selectedText)) {
          inputURL.value = selectedText;
        }

        inputURL.focus();
      });

      this.on('hidden', function () {
        _this2._resetInputs();
      });
    }

    /**
     * bind editor events
     * @private
     * @override
     */

  }, {
    key: '_initEditorEvent',
    value: function _initEditorEvent() {
      var _this3 = this;

      _get(PopupAddLink.prototype.__proto__ || Object.getPrototypeOf(PopupAddLink.prototype), '_initEditorEvent', this).call(this);

      var eventManager = this._eventManager;
      eventManager.listen('focus', function () {
        return _this3.hide();
      });
      eventManager.listen('closeAllPopup', function () {
        return _this3.hide();
      });
      eventManager.listen('openPopupAddLink', function () {
        eventManager.emit('closeAllPopup');
        _this3.show();
      });
    }
  }, {
    key: '_addLink',
    value: function _addLink() {
      var _getValue2 = this._getValue(),
          url = _getValue2.url,
          linkText = _getValue2.linkText;

      this._clearValidationStyle();

      if (linkText.length < 1) {
        (0, _jquery2.default)(this._inputText).addClass('wrong');

        return;
      }
      if (url.length < 1) {
        (0, _jquery2.default)(this._inputURL).addClass('wrong');

        return;
      }

      this._eventManager.emit('command', 'AddLink', {
        linkText: linkText,
        url: url
      });
      this.hide();
    }
  }, {
    key: '_getValue',
    value: function _getValue() {
      var url = this._inputURL.value;
      var linkText = this._inputText.value;

      return {
        url: url,
        linkText: linkText
      };
    }
  }, {
    key: '_clearValidationStyle',
    value: function _clearValidationStyle() {
      (0, _jquery2.default)(this._inputURL).removeClass('wrong');
      (0, _jquery2.default)(this._inputText).removeClass('wrong');
    }
  }, {
    key: '_resetInputs',
    value: function _resetInputs() {
      this._inputText.value = '';
      this._inputURL.value = '';
      this._clearValidationStyle();
    }
  }]);

  return PopupAddLink;
}(_layerpopup2.default);

exports.default = PopupAddLink;

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _layerpopup = __webpack_require__(5);

var _layerpopup2 = _interopRequireDefault(_layerpopup);

var _tab = __webpack_require__(44);

var _tab2 = _interopRequireDefault(_tab);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements PopupAddImage
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var CLASS_IMAGE_URL_INPUT = 'te-image-url-input';
var CLASS_IMAGE_FILE_INPUT = 'te-image-file-input';
var CLASS_ALT_TEXT_INPUT = 'te-alt-text-input';
var CLASS_OK_BUTTON = 'te-ok-button';
var CLASS_CLOSE_BUTTON = 'te-close-button';
var CLASS_FILE_TYPE = 'te-file-type';
var CLASS_URL_TYPE = 'te-url-type';
var CLASS_TAB_SECTION = 'te-tab-section';
var TYPE_UI = 'ui';

/**
 * Class PopupAddImage
 * It implements a Image Add Popup
 * @param {LayerPopupOption} options - layer popup option
 * @ignore
 */

var PopupAddImage = function (_LayerPopup) {
  _inherits(PopupAddImage, _LayerPopup);

  function PopupAddImage(options) {
    _classCallCheck(this, PopupAddImage);

    var POPUP_CONTENT = '\n            <div class="' + CLASS_TAB_SECTION + '"></div>\n            <div class="' + CLASS_URL_TYPE + '">\n                <label for="">' + _i18n2.default.get('Image URL') + '</label>\n                <input type="text" class="' + CLASS_IMAGE_URL_INPUT + '" />\n            </div>\n            <form enctype="multipart/form-data" class="' + CLASS_FILE_TYPE + '">\n                <label for="">' + _i18n2.default.get('Select image file') + '</label>\n                <input type="file" class="' + CLASS_IMAGE_FILE_INPUT + '" accept="image/*" />\n            </form>\n            <label for="url">' + _i18n2.default.get('Description') + '</label>\n            <input type="text" class="' + CLASS_ALT_TEXT_INPUT + '" />\n            <div class="te-button-section">\n                <button type="button" class="' + CLASS_OK_BUTTON + '">' + _i18n2.default.get('OK') + '</button>\n                <button type="button" class="' + CLASS_CLOSE_BUTTON + '">' + _i18n2.default.get('Cancel') + '</button>\n            </div>\n        ';
    options = _tuiCodeSnippet2.default.extend({
      header: true,
      title: _i18n2.default.get('Insert image'),
      className: 'te-popup-add-image tui-editor-popup',
      content: POPUP_CONTENT
    }, options);
    return _possibleConstructorReturn(this, (PopupAddImage.__proto__ || Object.getPrototypeOf(PopupAddImage)).call(this, options));
  }

  /**
   * init instance.
   * store properties & prepare before initialize DOM
   * @param {LayerPopupOption} options - layer popup options
   * @private
   * @override
   */


  _createClass(PopupAddImage, [{
    key: '_initInstance',
    value: function _initInstance(options) {
      _get(PopupAddImage.prototype.__proto__ || Object.getPrototypeOf(PopupAddImage.prototype), '_initInstance', this).call(this, options);

      this.eventManager = options.eventManager;
    }

    /**
     * initialize DOM, render popup
     * @private
     * @override
     */

  }, {
    key: '_initDOM',
    value: function _initDOM() {
      _get(PopupAddImage.prototype.__proto__ || Object.getPrototypeOf(PopupAddImage.prototype), '_initDOM', this).call(this);

      var $popup = this.$el;

      this._$imageUrlInput = $popup.find('.' + CLASS_IMAGE_URL_INPUT);
      this._$imageFileInput = $popup.find('.' + CLASS_IMAGE_FILE_INPUT);
      this._$altTextInput = $popup.find('.' + CLASS_ALT_TEXT_INPUT);

      var $fileTypeSection = $popup.find('.' + CLASS_FILE_TYPE);
      var $urlTypeSection = $popup.find('.' + CLASS_URL_TYPE);
      var $tabSection = this.$body.find('.' + CLASS_TAB_SECTION);
      this.tab = new _tab2.default({
        initName: _i18n2.default.get('File'),
        items: [_i18n2.default.get('File'), _i18n2.default.get('URL')],
        sections: [$fileTypeSection, $urlTypeSection]
      });
      $tabSection.append(this.tab.$el);
    }

    /**
     * bind DOM events
     * @private
     * @override
     */

  }, {
    key: '_initDOMEvent',
    value: function _initDOMEvent() {
      var _this2 = this;

      _get(PopupAddImage.prototype.__proto__ || Object.getPrototypeOf(PopupAddImage.prototype), '_initDOMEvent', this).call(this);

      this.on('shown', function () {
        return _this2._$imageUrlInput.focus();
      });
      this.on('hidden', function () {
        return _this2._resetInputs();
      });

      this.on('change .' + CLASS_IMAGE_FILE_INPUT, function () {
        var filename = _this2._$imageFileInput.val().split('\\').pop();
        _this2._$altTextInput.val(filename);
      });

      this.on('click .' + CLASS_CLOSE_BUTTON, function () {
        return _this2.hide();
      });
      this.on('click .' + CLASS_OK_BUTTON, function () {
        var imageUrl = _this2._$imageUrlInput.val();
        var altText = _this2._$altTextInput.val();

        if (imageUrl) {
          _this2._applyImage(imageUrl, altText);
        } else {
          var _$imageFileInput$get = _this2._$imageFileInput.get(0),
              files = _$imageFileInput$get.files;

          if (files.length) {
            var imageFile = files.item(0);
            var hookCallback = function hookCallback(url, text) {
              return _this2._applyImage(url, text || altText);
            };

            _this2.eventManager.emit('addImageBlobHook', imageFile, hookCallback, TYPE_UI);
          }
        }

        _this2.hide();
      });

      this.tab.on('itemClick', function () {
        return _this2._resetInputs();
      });
    }

    /**
     * bind editor events
     * @private
     * @override
     */

  }, {
    key: '_initEditorEvent',
    value: function _initEditorEvent() {
      var _this3 = this;

      _get(PopupAddImage.prototype.__proto__ || Object.getPrototypeOf(PopupAddImage.prototype), '_initEditorEvent', this).call(this);

      this.eventManager.listen('focus', function () {
        return _this3.hide();
      });
      this.eventManager.listen('closeAllPopup', function () {
        return _this3.hide();
      });

      this.eventManager.listen('openPopupAddImage', function () {
        _this3.eventManager.emit('closeAllPopup');
        _this3.show();
      });
    }
  }, {
    key: '_applyImage',
    value: function _applyImage(imageUrl, altText) {
      this.eventManager.emit('command', 'AddImage', {
        imageUrl: imageUrl,
        altText: altText || 'image'
      });
      this.hide();
    }
  }, {
    key: '_resetInputs',
    value: function _resetInputs() {
      this.$el.find('input').val('');
    }

    /**
     * Remove popup
     * @override
     */

  }, {
    key: 'remove',
    value: function remove() {
      this.tab.remove();
      _get(PopupAddImage.prototype.__proto__ || Object.getPrototypeOf(PopupAddImage.prototype), 'remove', this).call(this);
    }
  }]);

  return PopupAddImage;
}(_layerpopup2.default);

exports.default = PopupAddImage;

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DISABLED_MENU_CLASS_NAME = exports.REMOVE_ROW_MENU_CLASS_NAME = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _layerpopup = __webpack_require__(5);

var _layerpopup2 = _interopRequireDefault(_layerpopup);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements PopupTableUtils
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var REMOVE_ROW_MENU_CLASS_NAME = exports.REMOVE_ROW_MENU_CLASS_NAME = 'te-table-remove-row';
var DISABLED_MENU_CLASS_NAME = exports.DISABLED_MENU_CLASS_NAME = 'te-context-menu-disabled';

/**
 * PopupTableUtils
 * It implements table utils popup
 * @param {LayerPopupOption} options - layer popup options
 */

var PopupTableUtils = function (_LayerPopup) {
  _inherits(PopupTableUtils, _LayerPopup);

  function PopupTableUtils(options) {
    _classCallCheck(this, PopupTableUtils);

    var POPUP_CONTENT = '\n            <button type="button" class="te-table-add-row">' + _i18n2.default.get('Add row') + '</button>\n            <button type="button" class="te-table-add-col">' + _i18n2.default.get('Add col') + '</button>\n            <button type="button" class="te-table-remove-row">' + _i18n2.default.get('Remove row') + '</button>\n            <button type="button" class="te-table-remove-col">' + _i18n2.default.get('Remove col') + '</button>\n            <hr/>\n            <button type="button" class="te-table-col-align-left">' + _i18n2.default.get('Align left') + '</button>\n            <button type="button" class="te-table-col-align-center">' + _i18n2.default.get('Align center') + '</button>\n            <button type="button" class="te-table-col-align-right">' + _i18n2.default.get('Align right') + '</button>\n            <hr/>\n            <button type="button" class="te-table-remove">' + _i18n2.default.get('Remove table') + '</button>\n        ';
    options = _tuiCodeSnippet2.default.extend({
      header: false,
      className: 'te-popup-table-utils',
      content: POPUP_CONTENT
    }, options);
    return _possibleConstructorReturn(this, (PopupTableUtils.__proto__ || Object.getPrototypeOf(PopupTableUtils)).call(this, options));
  }

  /**
   * init instance.
   * store properties & prepare before initialize DOM
   * @param {LayerPopupOption} options - layer popup options
   * @private
   * @override
   */


  _createClass(PopupTableUtils, [{
    key: '_initInstance',
    value: function _initInstance(options) {
      _get(PopupTableUtils.prototype.__proto__ || Object.getPrototypeOf(PopupTableUtils.prototype), '_initInstance', this).call(this, options);
      this.eventManager = options.eventManager;
    }

    /**
     * bind DOM events
     * @private
     * @override
     */

  }, {
    key: '_initDOMEvent',
    value: function _initDOMEvent() {
      var _this2 = this;

      _get(PopupTableUtils.prototype.__proto__ || Object.getPrototypeOf(PopupTableUtils.prototype), '_initDOMEvent', this).call(this);

      this.on('click .te-table-add-row', function () {
        return _this2.eventManager.emit('command', 'AddRow');
      });
      this.on('click .te-table-add-col', function () {
        return _this2.eventManager.emit('command', 'AddCol');
      });
      this.on('click .te-table-col-align-left', function () {
        return _this2.eventManager.emit('command', 'AlignCol', 'left');
      });
      this.on('click .te-table-col-align-center', function () {
        return _this2.eventManager.emit('command', 'AlignCol', 'center');
      });
      this.on('click .te-table-col-align-right', function () {
        return _this2.eventManager.emit('command', 'AlignCol', 'right');
      });
      this.on('click .te-table-remove-col', function () {
        return _this2.eventManager.emit('command', 'RemoveCol');
      });
      this.on('click .te-table-remove', function () {
        return _this2.eventManager.emit('command', 'RemoveTable');
      });
      this._bindClickEventOnRemoveRowMenu();
    }

    /**
     * bind editor events
     * @private
     * @override
     */

  }, {
    key: '_initEditorEvent',
    value: function _initEditorEvent() {
      var _this3 = this;

      _get(PopupTableUtils.prototype.__proto__ || Object.getPrototypeOf(PopupTableUtils.prototype), '_initEditorEvent', this).call(this);

      this.eventManager.listen('focus', function () {
        return _this3.hide();
      });
      this.eventManager.listen('mousedown', function () {
        return _this3.hide();
      });
      this.eventManager.listen('closeAllPopup', function () {
        return _this3.hide();
      });
      this.eventManager.listen('openPopupTableUtils', function (ev) {
        var offset = _this3.$el.parent().offset();
        var x = ev.clientX - offset.left;
        var y = ev.clientY - offset.top + (0, _jquery2.default)(window).scrollTop();

        _this3._disableRemoveRowMenu(ev.target);

        _this3.$el.css({
          position: 'absolute',
          top: y + 5, // beside mouse pointer
          left: x + 10
        });
        _this3.eventManager.emit('closeAllPopup');
        _this3.show();
      });
    }
  }, {
    key: '_bindClickEventOnRemoveRowMenu',
    value: function _bindClickEventOnRemoveRowMenu() {
      var _this4 = this;

      this.on('click .' + REMOVE_ROW_MENU_CLASS_NAME, function (ev) {
        var target = ev.target;


        if ((0, _jquery2.default)(target).hasClass(DISABLED_MENU_CLASS_NAME)) {
          ev.preventDefault();
        } else {
          _this4.eventManager.emit('command', 'RemoveRow');
        }
      });
    }
  }, {
    key: '_disableRemoveRowMenu',
    value: function _disableRemoveRowMenu(target) {
      var $menu = this.$el.find('.' + REMOVE_ROW_MENU_CLASS_NAME);

      if (target.nodeName === 'TH') {
        $menu.addClass(DISABLED_MENU_CLASS_NAME);
      } else {
        $menu.removeClass(DISABLED_MENU_CLASS_NAME);
      }
    }
  }]);

  return PopupTableUtils;
}(_layerpopup2.default);

exports.default = PopupTableUtils;

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _layerpopup = __webpack_require__(5);

var _layerpopup2 = _interopRequireDefault(_layerpopup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements PopupAddTable
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var CLASS_TABLE_SELECTION = 'te-table-selection';
var CLASS_TABLE_HEADER = 'te-table-header';
var CLASS_TABLE_BODY = 'te-table-body';
var CLASS_SELECTION_AREA = 'te-selection-area';
var CLASS_DESCRIPTION = 'te-description';

var POPUP_CONTENT = '\n    <div class="' + CLASS_TABLE_SELECTION + '">\n        <div class="' + CLASS_TABLE_HEADER + '"></div>\n        <div class="' + CLASS_TABLE_BODY + '"></div>\n        <div class="' + CLASS_SELECTION_AREA + '"></div>\n    </div>\n    <p class="' + CLASS_DESCRIPTION + '"></p>\n';

var CELL_WIDTH = 25;
var CELL_HEIGHT = 17;
var MIN_ROW_INDEX = 7;
var MAX_ROW_INDEX = 14;
var MIN_COL_INDEX = 5;
var MAX_COL_INDEX = 9;
var MIN_ROW_SELECTION_INDEX = 1;
var MIN_COL_SELECTION_INDEX = 1;
var HEADER_ROW_COUNT = 1;
var LAST_BORDER = 1;

/**
 * Class PopupAddTable
 * It implements Popup to add a table
 * @param {LayerPopupOption} options - layer popup option
 * @ignore
 */

var PopupAddTable = function (_LayerPopup) {
  _inherits(PopupAddTable, _LayerPopup);

  /**
   * Toolbar Button which the Popup is bound to.
   * @type {jQuery}
   * @private
   */
  function PopupAddTable(options) {
    _classCallCheck(this, PopupAddTable);

    options = _tuiCodeSnippet2.default.extend({
      header: false,
      className: 'te-popup-add-table',
      content: POPUP_CONTENT
    }, options);
    return _possibleConstructorReturn(this, (PopupAddTable.__proto__ || Object.getPrototypeOf(PopupAddTable)).call(this, options));
  }

  /**
   * init instance.
   * store properties & prepare before initialize DOM
   * @param {LayerPopupOption} options - layer popup options
   * @private
   * @override
   */


  /**
   * EventManager instance
   * @type {EventManager}
   * @private
   */


  _createClass(PopupAddTable, [{
    key: '_initInstance',
    value: function _initInstance(options) {
      _get(PopupAddTable.prototype.__proto__ || Object.getPrototypeOf(PopupAddTable.prototype), '_initInstance', this).call(this, options);

      this._selectedBound = {};
      this._tableBound = {};
      this._eventManager = options.eventManager;
      this._$button = options.$button;
    }

    /**
     * initialize DOM, render popup
     * @private
     * @override
     */

  }, {
    key: '_initDOM',
    value: function _initDOM() {
      _get(PopupAddTable.prototype.__proto__ || Object.getPrototypeOf(PopupAddTable.prototype), '_initDOM', this).call(this);

      this._cacheElements();
      this._setTableSizeByBound(MIN_COL_INDEX, MIN_ROW_INDEX);
    }

    /**
     * bind DOM events
     * @private
     * @override
     */

  }, {
    key: '_initDOMEvent',
    value: function _initDOMEvent(options) {
      var _this2 = this;

      _get(PopupAddTable.prototype.__proto__ || Object.getPrototypeOf(PopupAddTable.prototype), '_initDOMEvent', this).call(this, options);

      this.on('mousemove .' + CLASS_TABLE_SELECTION, function (ev) {
        var x = ev.pageX - _this2._selectionOffset.left;
        var y = ev.pageY - _this2._selectionOffset.top;
        var bound = _this2._getSelectionBoundByOffset(x, y);

        _this2._resizeTableBySelectionIfNeed(bound.col, bound.row);

        _this2._setSelectionAreaByBound(bound.col, bound.row);
        _this2._setDisplayText(bound.col, bound.row);
        _this2._setSelectedBound(bound.col, bound.row);
      });

      this.on('click .' + CLASS_TABLE_SELECTION, function () {
        var tableSize = _this2._getSelectedTableSize();
        _this2._eventManager.emit('command', 'Table', tableSize.col, tableSize.row);
      });
    }

    /**
     * bind editor events
     * @private
     * @override
     */

  }, {
    key: '_initEditorEvent',
    value: function _initEditorEvent() {
      var _this3 = this;

      _get(PopupAddTable.prototype.__proto__ || Object.getPrototypeOf(PopupAddTable.prototype), '_initEditorEvent', this).call(this);

      this._eventManager.listen('focus', function () {
        return _this3.hide();
      });
      this._eventManager.listen('closeAllPopup', function () {
        return _this3.hide();
      });

      this._eventManager.listen('openPopupAddTable', function () {
        var $button = _this3._$button;

        var _$button$get = $button.get(0),
            offsetTop = _$button$get.offsetTop,
            offsetLeft = _$button$get.offsetLeft;

        _this3.$el.css({
          top: offsetTop + $button.outerHeight(),
          left: offsetLeft
        });
        _this3._eventManager.emit('closeAllPopup');
        _this3.show();
        _this3._selectionOffset = _this3.$el.find('.' + CLASS_TABLE_SELECTION).offset();
      });
    }

    /**
     * Cache elements for use
     * @private
     */

  }, {
    key: '_cacheElements',
    value: function _cacheElements() {
      this.$header = this.$el.find('.' + CLASS_TABLE_HEADER);
      this.$body = this.$el.find('.' + CLASS_TABLE_BODY);
      this.$selection = this.$el.find('.' + CLASS_SELECTION_AREA);
      this.$desc = this.$el.find('.' + CLASS_DESCRIPTION);
    }

    /**
     * Resize table if need
     * @param {number} col column index
     * @param {number} row row index
     * @private
     */

  }, {
    key: '_resizeTableBySelectionIfNeed',
    value: function _resizeTableBySelectionIfNeed(col, row) {
      var resizedBound = this._getResizedTableBound(col, row);

      if (resizedBound) {
        this._setTableSizeByBound(resizedBound.col, resizedBound.row);
      }
    }

    /**
     * Get resized table bound if Need
     * @param {number} col column index
     * @param {number} row row index
     * @returns {object} bound
     * @private
     */

  }, {
    key: '_getResizedTableBound',
    value: function _getResizedTableBound(col, row) {
      var resizedCol = void 0,
          resizedRow = void 0,
          resizedBound = void 0;

      if (col >= MIN_COL_INDEX && col < MAX_COL_INDEX) {
        resizedCol = col + 1;
      } else if (col < MIN_COL_INDEX) {
        resizedCol = MIN_COL_INDEX;
      }

      if (row >= MIN_ROW_INDEX && row < MAX_ROW_INDEX) {
        resizedRow = row + 1;
      } else if (row < MIN_ROW_INDEX) {
        resizedRow = MIN_ROW_INDEX;
      }

      if (this._isNeedResizeTable(resizedCol, resizedRow)) {
        resizedBound = {
          row: resizedRow || this._tableBound.row,
          col: resizedCol || this._tableBound.col
        };
      }

      return resizedBound;
    }

    /**
     * check if need resize table
     * @param {number} col column index
     * @param {number} row row index
     * @returns {boolean} result
     * @private
     */

  }, {
    key: '_isNeedResizeTable',
    value: function _isNeedResizeTable(col, row) {
      return col && col !== this._tableBound.col || row && row !== this._tableBound.row;
    }

    /**
     * Get bound by offset
     * @param {number} x offset
     * @param {number} y offset
     * @returns {object} bound
     * @private
     */

  }, {
    key: '_getBoundByOffset',
    value: function _getBoundByOffset(x, y) {
      var row = parseInt(y / CELL_HEIGHT, 10);
      var col = parseInt(x / CELL_WIDTH, 10);

      return {
        row: row,
        col: col
      };
    }

    /**
     * Get offset by bound
     * @param {number} col column index
     * @param {number} row row index
     * @returns {object} offset
     * @private
     */

  }, {
    key: '_getOffsetByBound',
    value: function _getOffsetByBound(col, row) {
      var x = col * CELL_WIDTH + CELL_WIDTH,
          y = row * CELL_HEIGHT + CELL_HEIGHT;

      return {
        x: x,
        y: y
      };
    }

    /**
     * Set table size with bound
     * @param {number} col column index
     * @param {number} row row index
     * @private
     */

  }, {
    key: '_setTableSizeByBound',
    value: function _setTableSizeByBound(col, row) {
      var boundOffset = this._getOffsetByBound(col, row - HEADER_ROW_COUNT);
      this._setTableSize(boundOffset.x, boundOffset.y);
      this._tableBound.row = row;
      this._tableBound.col = col;
    }

    /**
     * Get selection bound that process with range by offset
     * @param {number} x offset
     * @param {number} y offset
     * @returns {object} bound
     * @private
     */

  }, {
    key: '_getSelectionBoundByOffset',
    value: function _getSelectionBoundByOffset(x, y) {
      var bound = this._getBoundByOffset(x, y);

      if (bound.row < MIN_ROW_SELECTION_INDEX) {
        bound.row = MIN_ROW_SELECTION_INDEX;
      } else if (bound.row > this._tableBound.row) {
        bound.row = this._tableBound.row;
      }

      if (bound.col < MIN_COL_SELECTION_INDEX) {
        bound.col = MIN_COL_SELECTION_INDEX;
      } else if (bound.col > this._tableBound.col) {
        bound.col = this._tableBound.col;
      }

      return bound;
    }

    /**
     * Set selection area with bound
     * @param {number} col column index
     * @param {number} row row index
     * @private
     */

  }, {
    key: '_setSelectionAreaByBound',
    value: function _setSelectionAreaByBound(col, row) {
      var boundOffset = this._getOffsetByBound(col, row);
      this._setSelectionArea(boundOffset.x, boundOffset.y);
    }

    /**
     * Set selected bound
     * @param {number} col column index
     * @param {number} row row index
     * @private
     */

  }, {
    key: '_setSelectedBound',
    value: function _setSelectedBound(col, row) {
      this._selectedBound.col = col;
      this._selectedBound.row = row;
    }

    /**
     * Get selected table size
     * @returns {object} bound
     * @private
     */

  }, {
    key: '_getSelectedTableSize',
    value: function _getSelectedTableSize() {
      return {
        row: this._selectedBound.row + 1,
        col: this._selectedBound.col + 1
      };
    }

    /**
     * Set selected table size text for display
     * @param {number} col column index
     * @param {number} row row index
     * @private
     */

  }, {
    key: '_setDisplayText',
    value: function _setDisplayText(col, row) {
      this.$desc.html(col + 1 + ' x ' + (row + 1));
    }

    /**
     * Set table element size
     * @param {number} x offset
     * @param {number} y offset
     * @private
     */

  }, {
    key: '_setTableSize',
    value: function _setTableSize(x, y) {
      x += LAST_BORDER;
      y += LAST_BORDER;

      this.$header.css({
        height: CELL_HEIGHT,
        width: x
      });

      this.$body.css({
        height: y,
        width: x
      });

      this.$el.css({
        width: x + 30
      });
    }

    /**
     * Set selection element size
     * @param {number} x offset
     * @param {number} y offset
     * @private
     */

  }, {
    key: '_setSelectionArea',
    value: function _setSelectionArea(x, y) {
      x += LAST_BORDER;
      y += LAST_BORDER;

      this.$selection.css({
        height: y,
        width: x
      });
    }
  }]);

  return PopupAddTable;
}(_layerpopup2.default);

PopupAddTable.CELL_WIDTH = CELL_WIDTH;
PopupAddTable.CELL_HEIGHT = CELL_HEIGHT;
PopupAddTable.MIN_ROW_SELECTION_INDEX = MIN_ROW_SELECTION_INDEX;
PopupAddTable.MIN_COL_SELECTION_INDEX = MIN_COL_SELECTION_INDEX;

exports.default = PopupAddTable;

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _layerpopup = __webpack_require__(5);

var _layerpopup2 = _interopRequireDefault(_layerpopup);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements PopupAddHeading
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Class PopupAddHeading
 * It implements Popup to add headings
 * @param {LayerPopupOption} options - layer popup option
 * @ignore
 */
var PopupAddHeading = function (_LayerPopup) {
  _inherits(PopupAddHeading, _LayerPopup);

  function PopupAddHeading(options) {
    _classCallCheck(this, PopupAddHeading);

    var POPUP_CONTENT = '\n            <ul>\n                <li data-value="1" data-type="Heading"><h1>' + _i18n2.default.get('Heading') + ' 1</h1></li>\n                <li data-value="2" data-type="Heading"><h2>' + _i18n2.default.get('Heading') + ' 2</h2></li>\n                <li data-value="3" data-type="Heading"><h3>' + _i18n2.default.get('Heading') + ' 3</h3></li>\n                <li data-value="4" data-type="Heading"><h4>' + _i18n2.default.get('Heading') + ' 4</h4></li>\n                <li data-value="5" data-type="Heading"><h5>' + _i18n2.default.get('Heading') + ' 5</h5></li>\n                <li data-value="6" data-type="Heading"><h6>' + _i18n2.default.get('Heading') + ' 6</h6></li>\n                <li data-type="Paragraph"><div>' + _i18n2.default.get('Paragraph') + '</div></li>\n            </ul>\n        ';
    options = _tuiCodeSnippet2.default.extend({
      header: false,
      className: 'te-heading-add',
      content: POPUP_CONTENT
    }, options);
    return _possibleConstructorReturn(this, (PopupAddHeading.__proto__ || Object.getPrototypeOf(PopupAddHeading)).call(this, options));
  }

  /**
   * init instance.
   * store properties & prepare before initialize DOM
   * @param {LayerPopupOption} options - layer popup options
   * @private
   * @override
   */


  _createClass(PopupAddHeading, [{
    key: '_initInstance',
    value: function _initInstance(options) {
      _get(PopupAddHeading.prototype.__proto__ || Object.getPrototypeOf(PopupAddHeading.prototype), '_initInstance', this).call(this, options);

      this._eventManager = options.eventManager;
      this._$button = options.$button;
    }

    /**
     * bind DOM events
     * @private
     * @override
     */

  }, {
    key: '_initDOMEvent',
    value: function _initDOMEvent() {
      var _this2 = this;

      _get(PopupAddHeading.prototype.__proto__ || Object.getPrototypeOf(PopupAddHeading.prototype), '_initDOMEvent', this).call(this);

      this.on('click li', function (ev) {
        var $li = (0, _jquery2.default)(ev.target).closest('li');
        _this2._eventManager.emit('command', $li.data('type'), $li.data('value'));
      });
    }

    /**
     * bind editor events
     * @private
     * @override
     */

  }, {
    key: '_initEditorEvent',
    value: function _initEditorEvent() {
      var _this3 = this;

      _get(PopupAddHeading.prototype.__proto__ || Object.getPrototypeOf(PopupAddHeading.prototype), '_initEditorEvent', this).call(this);

      this._eventManager.listen('focus', this.hide.bind(this));
      this._eventManager.listen('closeAllPopup', this.hide.bind(this));
      this._eventManager.listen('openHeadingSelect', function () {
        var $button = _this3._$button;

        var _$button$get = $button.get(0),
            offsetTop = _$button$get.offsetTop,
            offsetLeft = _$button$get.offsetLeft;

        _this3.$el.css({
          top: offsetTop + $button.outerHeight(),
          left: offsetLeft
        });

        _this3._eventManager.emit('closeAllPopup');
        _this3.show();
      });
    }
  }]);

  return PopupAddHeading;
}(_layerpopup2.default);

exports.default = PopupAddHeading;

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _layerpopup = __webpack_require__(5);

var _layerpopup2 = _interopRequireDefault(_layerpopup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements popup code block languages
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var BUTTON_CLASS_PREFIX = 'te-popup-code-block-lang-';

/**
 * Class Popup code block languages select list
 * @param {LayerPopupOption} options - layer popup option
 * @ignore
 */

var PopupCodeBlockLanguages = function (_LayerPopup) {
  _inherits(PopupCodeBlockLanguages, _LayerPopup);

  function PopupCodeBlockLanguages(options) {
    _classCallCheck(this, PopupCodeBlockLanguages);

    var popupButtonsHTML = [];
    var _options = options,
        languages = _options.languages;

    languages.forEach(function (lang) {
      return popupButtonsHTML.push('<button type="button" class="' + BUTTON_CLASS_PREFIX + lang + '" data-lang="' + lang + '">' + lang + '</button>');
    });

    options = _tuiCodeSnippet2.default.extend({
      header: false,
      className: 'te-popup-code-block-languages',
      content: popupButtonsHTML.join('')
    }, options);
    return _possibleConstructorReturn(this, (PopupCodeBlockLanguages.__proto__ || Object.getPrototypeOf(PopupCodeBlockLanguages)).call(this, options));
  }

  /**
   * init instance.
   * store properties & prepare before initialize DOM
   * @param {LayerPopupOption} options - layer popup options
   * @private
   * @override
   */


  _createClass(PopupCodeBlockLanguages, [{
    key: '_initInstance',
    value: function _initInstance(options) {
      _get(PopupCodeBlockLanguages.prototype.__proto__ || Object.getPrototypeOf(PopupCodeBlockLanguages.prototype), '_initInstance', this).call(this, options);

      this._onSelectedLanguage = null;
      this._onDismissed = null;
      this._currentButton = null;
      this._$buttons = null;
      this._languages = options.languages;

      this.eventManager = options.eventManager;
    }

    /**
     * initialize DOM, render popup
     * @private
     * @override
     */

  }, {
    key: '_initDOM',
    value: function _initDOM(options) {
      _get(PopupCodeBlockLanguages.prototype.__proto__ || Object.getPrototypeOf(PopupCodeBlockLanguages.prototype), '_initDOM', this).call(this, options);

      this.$el.css('z-index', 10000);

      this._$buttons = this.$el.find('button');
      this._activateButtonByIndex(0);
    }

    /**
     * bind DOM events
     * @private
     * @override
     */

  }, {
    key: '_initDOMEvent',
    value: function _initDOMEvent() {
      var _this2 = this;

      _get(PopupCodeBlockLanguages.prototype.__proto__ || Object.getPrototypeOf(PopupCodeBlockLanguages.prototype), '_initDOMEvent', this).call(this);

      var handler = function handler(event) {
        var language = (0, _jquery2.default)(event.target).data('lang');
        if (_this2._onSelectedLanguage) {
          _this2._onSelectedLanguage(language);
        }
        _this2.hide();
      };
      this._languages.forEach(function (lang) {
        return _this2.on('mousedown .' + BUTTON_CLASS_PREFIX + lang, handler);
      });
    }

    /**
     * bind editor events
     * @private
     * @override
     */

  }, {
    key: '_initEditorEvent',
    value: function _initEditorEvent() {
      var _this3 = this;

      _get(PopupCodeBlockLanguages.prototype.__proto__ || Object.getPrototypeOf(PopupCodeBlockLanguages.prototype), '_initEditorEvent', this).call(this);

      this.eventManager.listen('openPopupCodeBlockLanguages', function (data) {
        _this3.show(data.callback);
        var elementStyle = _this3.$el.get(0).style;
        elementStyle.top = data.offset.top + 'px';
        elementStyle.left = data.offset.left + 'px';
        _this3.setCurrentLanguage(data.language);

        return _this3;
      });
      this.eventManager.listen('focus', function () {
        return _this3.hide();
      });
      this.eventManager.listen('mousedown', function () {
        return _this3.hide();
      });
      this.eventManager.listen('closeAllPopup', function () {
        return _this3.hide();
      });
      this.eventManager.listen('closePopupCodeBlockLanguages', function () {
        return _this3.hide();
      });
      this.eventManager.listen('scroll', function () {
        return _this3.hide();
      });
    }

    /**
     * activate an item by index
     * @param {number} index - item index
     * @private
     */

  }, {
    key: '_activateButtonByIndex',
    value: function _activateButtonByIndex(index) {
      if (this._currentButton) {
        (0, _jquery2.default)(this._currentButton).removeClass('active');
      }
      this._currentButton = this._$buttons.get(index);
      (0, _jquery2.default)(this._currentButton).addClass('active');
      this._currentButton.scrollIntoView();
    }

    /**
     * move to prev language
     */

  }, {
    key: 'prev',
    value: function prev() {
      var index = this._$buttons.index(this._currentButton) - 1;
      if (index < 0) {
        index = this._$buttons.length - 1;
      }
      this._activateButtonByIndex(index);
    }

    /**
     * move to next language
     */

  }, {
    key: 'next',
    value: function next() {
      var index = this._$buttons.index(this._currentButton) + 1;
      if (index >= this._$buttons.length) {
        index = 0;
      }
      this._activateButtonByIndex(index);
    }

    /**
     * current language
     * @returns {string} language
     */

  }, {
    key: 'getCurrentLanguage',
    value: function getCurrentLanguage() {
      var language = (0, _jquery2.default)(this._currentButton).data('lang');

      return language;
    }

    /**
     * set current language
     * @param {string} language - current language
     */

  }, {
    key: 'setCurrentLanguage',
    value: function setCurrentLanguage(language) {
      var item = this._$buttons.filter('.' + BUTTON_CLASS_PREFIX + language);
      if (item.length > 0) {
        var index = this._$buttons.index(item);
        this._activateButtonByIndex(index);
      }
    }

    /**
     * show popup
     * @param {object} callback - to be called on language selected & dismissed
     * @override
     */

  }, {
    key: 'show',
    value: function show(callback) {
      this._onSelectedLanguage = callback.selected;
      this._onDismissed = callback.dismissed;
      _get(PopupCodeBlockLanguages.prototype.__proto__ || Object.getPrototypeOf(PopupCodeBlockLanguages.prototype), 'show', this).call(this);
    }

    /**
     * hide popup
     * @override
     */

  }, {
    key: 'hide',
    value: function hide() {
      if (this._onDismissed) {
        this._onDismissed();
      }
      this._onSelectedLanguage = null;
      this._onDismissed = null;
      _get(PopupCodeBlockLanguages.prototype.__proto__ || Object.getPrototypeOf(PopupCodeBlockLanguages.prototype), 'hide', this).call(this);
    }
  }]);

  return PopupCodeBlockLanguages;
}(_layerpopup2.default);

exports.default = PopupCodeBlockLanguages;

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _layerpopup = __webpack_require__(5);

var _layerpopup2 = _interopRequireDefault(_layerpopup);

var _scrollSyncSplit = __webpack_require__(86);

var _scrollSyncSplit2 = _interopRequireDefault(_scrollSyncSplit);

var _codeBlockEditor = __webpack_require__(87);

var _codeBlockEditor2 = _interopRequireDefault(_codeBlockEditor);

var _codeBlockPreview = __webpack_require__(88);

var _codeBlockPreview2 = _interopRequireDefault(_codeBlockPreview);

var _codeBlockLanguagesCombo = __webpack_require__(89);

var _codeBlockLanguagesCombo2 = _interopRequireDefault(_codeBlockLanguagesCombo);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements popup code block editor
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var CLASS_PREFIX = 'popup-editor-';
var CLASS_OK_BUTTON = 'te-ok-button';
var CLASS_CLOSE_BUTTON = 'te-close-button';
var CLASS_POPUP_CLOSE_BUTTON = 'tui-popup-close-button';
var TEMPLATE_HEADER_BUTTONS = '\n    <button type="button" class="' + CLASS_PREFIX + 'toggle-scroll"></button>\n    <button type="button" class="' + CLASS_PREFIX + 'toggle-preview"></button>\n    <button type="button" class="' + CLASS_PREFIX + 'toggle-fit"></button>\n    <button type="button" class="' + CLASS_POPUP_CLOSE_BUTTON + '"></button>\n';

/**
 * Class popup code block editor
 * @param {LayerPopupOption} options - layer popup option
 * @ignore
 */

var PopupCodeBlockEditor = function (_LayerPopup) {
  _inherits(PopupCodeBlockEditor, _LayerPopup);

  function PopupCodeBlockEditor(options) {
    _classCallCheck(this, PopupCodeBlockEditor);

    var TEMPLATE_CONTENT = '\n            <div class="' + CLASS_PREFIX + 'body"></div>\n            <div class="te-button-section">\n                <button type="button" class="' + CLASS_OK_BUTTON + '">' + _i18n2.default.get('OK') + '</button>\n                <button type="button" class="' + CLASS_CLOSE_BUTTON + '">' + _i18n2.default.get('Cancel') + '</button>\n            </div>\n        ';
    options = _tuiCodeSnippet2.default.extend({
      header: true,
      title: 'CodeBlock Editor',
      content: TEMPLATE_CONTENT,
      className: 'tui-popup-code-block-editor',
      headerButtons: TEMPLATE_HEADER_BUTTONS,
      modal: true
    }, options);
    return _possibleConstructorReturn(this, (PopupCodeBlockEditor.__proto__ || Object.getPrototypeOf(PopupCodeBlockEditor)).call(this, options));
  }

  /**
   * init instance.
   * store properties & prepare before initialize DOM
   * @param {LayerPopupOption} options - layer popup options
   * @private
   * @override
   */


  _createClass(PopupCodeBlockEditor, [{
    key: '_initInstance',
    value: function _initInstance(options) {
      _get(PopupCodeBlockEditor.prototype.__proto__ || Object.getPrototypeOf(PopupCodeBlockEditor.prototype), '_initInstance', this).call(this, options);

      this.eventManager = options.eventManager;
      this.convertor = options.convertor;
    }

    /**
     * initialize DOM, render popup
     * @private
     * @override
     */

  }, {
    key: '_initDOM',
    value: function _initDOM(options) {
      _get(PopupCodeBlockEditor.prototype.__proto__ || Object.getPrototypeOf(PopupCodeBlockEditor.prototype), '_initDOM', this).call(this, options);

      var el = this.$el.get(0);
      this._body = el.querySelector('.' + CLASS_PREFIX + 'body');
      this._toggleFitButton = el.querySelector('.' + CLASS_PREFIX + 'toggle-fit');
      this._togglePreviewButton = el.querySelector('.' + CLASS_PREFIX + 'toggle-preview');
      this._toggleScrollButton = el.querySelector('.' + CLASS_PREFIX + 'toggle-scroll');
      this._okButton = el.querySelector('.' + CLASS_OK_BUTTON);
      this._closeButton = el.querySelector('.' + CLASS_CLOSE_BUTTON);

      this._codeMirrorWrapper = this._createCodeBlockEditor();
      this._previewWrapper = this._createPreview();
      this._scrollSyncSplit = new _scrollSyncSplit2.default(this._body, this._codeMirrorWrapper, this._previewWrapper);

      this._updateFitWindowButton();
      this._updatePreviewButton();
      this._updateScrollButton();

      this._codeBlockLanguagesCombo = this._createCodeBlockLanguagesCombo();
    }

    /**
     * bind DOM events
     * @private
     * @override
     */

  }, {
    key: '_initDOMEvent',
    value: function _initDOMEvent() {
      var _this2 = this;

      _get(PopupCodeBlockEditor.prototype.__proto__ || Object.getPrototypeOf(PopupCodeBlockEditor.prototype), '_initDOMEvent', this).call(this);

      this.on('scroll', function (ev) {
        return ev.preventDefault();
      });
      this.on('click .' + CLASS_PREFIX + 'toggle-fit', function () {
        return _this2._toggleFitToWindow();
      });
      this.on('click .' + CLASS_PREFIX + 'toggle-preview', function () {
        return _this2._togglePreview();
      });
      this.on('click .' + CLASS_PREFIX + 'toggle-scroll', function () {
        return _this2._toggleScroll();
      });
      this.on('click .' + CLASS_OK_BUTTON, function () {
        return _this2._save();
      });
      this.on('click .' + CLASS_CLOSE_BUTTON, function () {
        return _this2.hide();
      });
      this.on('click .' + CLASS_PREFIX + 'close', function () {
        return _this2.hide();
      });
      this.on('click .' + CLASS_PREFIX + 'editor-wrapper', function (ev) {
        if (ev.target === _this2._codeMirrorWrapper) {
          _this2._focusEditor(true);
        }
      });
    }

    /**
     * bind editor events
     * @private
     * @override
     */

  }, {
    key: '_initEditorEvent',
    value: function _initEditorEvent() {
      var _this3 = this;

      _get(PopupCodeBlockEditor.prototype.__proto__ || Object.getPrototypeOf(PopupCodeBlockEditor.prototype), '_initEditorEvent', this).call(this);

      this.eventManager.listen('openPopupCodeBlockEditor', function (codeBlockElement) {
        _this3.eventManager.emit('closeAllPopup');
        _this3.show(codeBlockElement);

        return _this3;
      });
      this.eventManager.listen('closeAllPopup', this.hide.bind(this));
      this.eventManager.listen('closePopupCodeBlockEditor', this.hide.bind(this));
    }
  }, {
    key: '_createCodeBlockEditor',
    value: function _createCodeBlockEditor() {
      var codeMirrorWrapper = document.createElement('div');
      codeMirrorWrapper.className = CLASS_PREFIX + 'editor-wrapper';

      this._codeBlockEditor = new _codeBlockEditor2.default(codeMirrorWrapper, this.eventManager);

      return codeMirrorWrapper;
    }
  }, {
    key: '_createPreview',
    value: function _createPreview() {
      var previewWrapper = document.createElement('div');
      this._codeBlockPreview = new _codeBlockPreview2.default((0, _jquery2.default)(previewWrapper), this.eventManager, this.convertor, this._codeBlockEditor);

      return previewWrapper;
    }
  }, {
    key: '_createCodeBlockLanguagesCombo',
    value: function _createCodeBlockLanguagesCombo() {
      var _this4 = this;

      var titleElement = this.getTitleElement();
      var codeBlockLanguagesCombo = new _codeBlockLanguagesCombo2.default(this.eventManager);

      codeBlockLanguagesCombo.setOnLanguageSelected(function (selectedLanguage) {
        _this4._codeBlockEditor.setLanguage(selectedLanguage);
        _this4._codeBlockEditor.refresh();
        _this4._focusEditor();
      });

      titleElement.innerHTML = 'CodeBlock Editor';
      titleElement.appendChild(codeBlockLanguagesCombo.getElement());

      return codeBlockLanguagesCombo;
    }
  }, {
    key: '_updateFitWindowButton',
    value: function _updateFitWindowButton() {
      (0, _jquery2.default)(this._toggleFitButton).toggleClass('active', this.isFitToWindow());
    }
  }, {
    key: '_updatePreviewButton',
    value: function _updatePreviewButton() {
      (0, _jquery2.default)(this._togglePreviewButton).toggleClass('active', this._scrollSyncSplit.isSplitView());
    }
  }, {
    key: '_updateScrollButton',
    value: function _updateScrollButton() {
      if (this._scrollSyncSplit.isSplitView()) {
        this._toggleScrollButton.style.display = 'inline-block';
      } else {
        this._toggleScrollButton.style.display = 'none';
      }
      (0, _jquery2.default)(this._toggleScrollButton).toggleClass('active', this._scrollSyncSplit.isScrollSynced());
    }
  }, {
    key: '_focusEditor',
    value: function _focusEditor(cursorToEnd) {
      this._codeBlockEditor.focus();
      if (cursorToEnd) {
        this._codeBlockEditor.moveCursorToEnd();
      } else {
        this._codeBlockEditor.moveCursorToStart();
      }
    }
  }, {
    key: '_togglePreview',
    value: function _togglePreview() {
      this._scrollSyncSplit.toggleSplitView();
      this._updatePreviewButton();
      this._updateScrollButton();
      this._codeBlockEditor.refresh();
    }
  }, {
    key: '_toggleFitToWindow',
    value: function _toggleFitToWindow() {
      this.toggleFitToWindow();
      this._updateFitWindowButton();
      this._codeBlockEditor.refresh();
    }
  }, {
    key: '_toggleScroll',
    value: function _toggleScroll() {
      this._scrollSyncSplit.toggleScrollSync();
      this._updateScrollButton();
    }

    /**
     * store code mirror text to wysiwyg code block
     * @private
     */

  }, {
    key: '_save',
    value: function _save() {
      this._codeBlockEditor.save(this._codeBlockElement);
      this.hide();
    }

    /**
     * load code mirror text from wysiwyg code block
     * @param {HTMLElement} codeBlockElement - code block element instance to load code from
     * @private
     */

  }, {
    key: '_load',
    value: function _load(codeBlockElement) {
      this._codeBlockElement = codeBlockElement;
      this._codeBlockEditor.load(codeBlockElement);
      this._codeBlockLanguagesCombo.setLanguage(this._codeBlockEditor.getLanguage());
      this._focusEditor();
      this._codeBlockPreview.refresh();
    }

    /**
     * show popup
     * @param {HTMLElement} codeBlockElement - code block element
     * @override
     */

  }, {
    key: 'show',
    value: function show(codeBlockElement) {
      _get(PopupCodeBlockEditor.prototype.__proto__ || Object.getPrototypeOf(PopupCodeBlockEditor.prototype), 'show', this).call(this);

      if (!codeBlockElement) {
        throw new Error('should be called with codeBlockElement');
      }
      this._load(codeBlockElement);
    }

    /**
     * hide popup
     * @override
     */

  }, {
    key: 'hide',
    value: function hide() {
      this.setFitToWindow(false);

      if (this._codeBlockEditor) {
        this._codeBlockEditor.clear();
      }
      if (this._codeBlockPreview) {
        this._codeBlockPreview.clear();
      }
      this._codeBlockElement = null;

      _get(PopupCodeBlockEditor.prototype.__proto__ || Object.getPrototypeOf(PopupCodeBlockEditor.prototype), 'hide', this).call(this);
    }
  }]);

  return PopupCodeBlockEditor;
}(_layerpopup2.default);

exports.default = PopupCodeBlockEditor;

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements scroll sync split
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CLASS_SPLIT_SCROLL = 'tui-split-scroll';
var CLASS_SINGLE_CONTENT = 'single-content';
var CLASS_SCROLL_SYNC = 'scroll-sync';
var CLASS_SCROLL_WRAPPER = 'tui-split-scroll-wrapper';
var CLASS_SCROLL_CONTENT = 'tui-split-scroll-content';
var CLASS_SPLITTER = 'tui-splitter';
var EVENT_REQUIRE_SCROLL_SYNC = 'requireScrollSync';
var EVENT_REQUIRE_SCROLL_INTO_VIEW = 'requireScrollIntoView';
var CLASS_CONTENT_LEFT = 'tui-split-content-left';
var CLASS_CONTENT_RIGHT = 'tui-split-content-right';
var CLASS_CONTENT = {
  'left': CLASS_CONTENT_LEFT,
  'right': CLASS_CONTENT_RIGHT
};

/**
 * Class ScrollSyncSplit
 * @param {Element} baseElement - an element which attach a splitSyncSplit
 * @param {Element} leftElement - an element to be on left side split view
 * @param {Element} rightElement - an element to be on right side split view
 * @param {object} options - options
 *     @param {boolean} [options.showScrollSyncButton=false] - show scroll sync button on top right corner
 *     @param {boolean} [options.scrollSync=true] - true for enable scroll sync
 *     @param {boolean} [options.splitView=true] - true for split, false for single view
 * @ignore
 */

var ScrollSyncSplit = function () {
  function ScrollSyncSplit(baseElement, leftElement, rightElement) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck(this, ScrollSyncSplit);

    options = _tuiCodeSnippet2.default.extend({
      showScrollSyncButton: false,
      scrollSync: true,
      splitView: true
    }, options);
    this._baseElement = baseElement;

    /**
     * left, right side content elements
     * @type {HTMLElement[]}
     * @private
     */
    this._contentElements = [];

    this._initDom(leftElement, rightElement, options);
    this._initDomEvent();
  }

  _createClass(ScrollSyncSplit, [{
    key: '_initDom',
    value: function _initDom(leftElement, rightElement, options) {
      var el = document.createElement('div');
      el.className = CLASS_SPLIT_SCROLL;
      this._el = el;

      var scrollWrapper = document.createElement('div');
      scrollWrapper.className = CLASS_SCROLL_WRAPPER;
      this._scrollWrapper = scrollWrapper;
      this._setScrollSync(options.scrollSync);
      this.setSplitView(options.splitView);

      var contentWrapper = document.createElement('div');
      contentWrapper.className = CLASS_SCROLL_CONTENT;
      this._contentWrapper = contentWrapper;

      var splitter = document.createElement('div');
      splitter.className = CLASS_SPLITTER;

      this._baseElement.appendChild(el);
      el.appendChild(scrollWrapper);
      scrollWrapper.appendChild(contentWrapper);
      scrollWrapper.appendChild(splitter);
      this._setLeft(leftElement);
      this._setRight(rightElement);
    }
  }, {
    key: '_initDomEvent',
    value: function _initDomEvent() {
      this._contentWrapper.addEventListener('scroll', this.sync.bind(this));
    }
  }, {
    key: '_requireScrollIntoView',
    value: function _requireScrollIntoView(event) {
      var element = event.target;

      var _element$getBoundingC = element.getBoundingClientRect(),
          targetTop = _element$getBoundingC.top,
          targetBottom = _element$getBoundingC.bottom;

      var wrapperTop = void 0,
          wrapperBottom = void 0,
          wrapperElement = void 0;

      if (this.isScrollSynced()) {
        wrapperElement = this._contentWrapper;
      } else if ((0, _jquery2.default)(element).parents(this._contentElements.left).length) {
        wrapperElement = this._contentElements.left;
      } else if ((0, _jquery2.default)(element).parents(this._contentElements.right).length) {
        wrapperElement = this._contentElements.right;
      } else {
        return;
      }

      var _wrapperElement$getBo = wrapperElement.getBoundingClientRect();

      wrapperTop = _wrapperElement$getBo.top;
      wrapperBottom = _wrapperElement$getBo.bottom;


      if (targetTop < wrapperTop) {
        wrapperElement.scrollTop = wrapperElement.scrollTop + targetTop - wrapperTop;
      } else if (targetBottom > wrapperBottom) {
        wrapperElement.scrollTop = wrapperElement.scrollTop + targetBottom - wrapperBottom;
      }

      this.sync();
    }

    /**
     * set content element for given side
     * @param {Element} element - content element
     * @param {string} side - 'left' | 'right'
     * @private
     */

  }, {
    key: '_setContentElement',
    value: function _setContentElement(element, side) {
      var _this = this;

      var contentElement = this._contentElements[side];

      if (contentElement) {
        (0, _jquery2.default)(contentElement).off(EVENT_REQUIRE_SCROLL_INTO_VIEW);
        this._contentWrapper.removeChild(contentElement);
      }
      (0, _jquery2.default)(element).addClass(CLASS_CONTENT[side]);
      this._contentWrapper.appendChild(element);
      (0, _jquery2.default)(element).on(EVENT_REQUIRE_SCROLL_INTO_VIEW, function (ev) {
        return _this._requireScrollIntoView(ev);
      });
      (0, _jquery2.default)(element).on(EVENT_REQUIRE_SCROLL_SYNC, function () {
        return _this.sync();
      });

      this._contentElements[side] = element;

      this.sync();
    }

    /**
     * set left side element
     * @param {Element} element - an element to be on left side split view
     * @private
     */

  }, {
    key: '_setLeft',
    value: function _setLeft(element) {
      this._setContentElement(element, 'left');
    }

    /**
     * set right side element
     * @param {Element} element - an element to be on right side split view
     * @private
     */

  }, {
    key: '_setRight',
    value: function _setRight(element) {
      this._setContentElement(element, 'right');
    }
  }, {
    key: '_setScrollSync',
    value: function _setScrollSync(activate) {
      (0, _jquery2.default)(this._el).toggleClass(CLASS_SCROLL_SYNC, activate);
    }

    /**
     * toggle multi scroll
     */

  }, {
    key: 'toggleScrollSync',
    value: function toggleScrollSync() {
      (0, _jquery2.default)(this._el).toggleClass(CLASS_SCROLL_SYNC);
    }
  }, {
    key: 'setSplitView',
    value: function setSplitView(activate) {
      (0, _jquery2.default)(this._el).toggleClass(CLASS_SINGLE_CONTENT, !activate);
    }

    /**
     * toggle split
     */

  }, {
    key: 'toggleSplitView',
    value: function toggleSplitView() {
      (0, _jquery2.default)(this._el).toggleClass(CLASS_SINGLE_CONTENT);
    }

    /**
     * is scroll synced
     * @returns {boolean} - true for synced, false for each scroll
     */

  }, {
    key: 'isScrollSynced',
    value: function isScrollSynced() {
      return (0, _jquery2.default)(this._el).hasClass(CLASS_SCROLL_SYNC);
    }

    /**
     * is split view
     * @returns {boolean} - true for split view, false for single view
     */

  }, {
    key: 'isSplitView',
    value: function isSplitView() {
      return !(0, _jquery2.default)(this._el).hasClass(CLASS_SINGLE_CONTENT);
    }

    /**
     * sync scroll
     */

  }, {
    key: 'sync',
    value: function sync() {
      if (!this._contentElements.left || !this._contentElements.right) {
        return;
      }

      var wrapperHeight = this._contentWrapper.clientHeight;
      var scrollTop = this._contentWrapper.scrollTop;

      var leftElement = this._contentElements.left;
      var rightElement = this._contentElements.right;

      var scrollingElement = leftElement.offsetHeight - wrapperHeight > 0 ? leftElement : rightElement;
      var followingElement = scrollingElement === leftElement ? rightElement : leftElement;

      var scrollingElementHeight = scrollingElement.offsetHeight;
      var scrollingElementScrollMax = Math.max(scrollingElementHeight - wrapperHeight, 0);
      var followingElementHeight = Math.max(followingElement.offsetHeight, wrapperHeight);
      var followingElementTopMax = scrollingElementHeight - followingElementHeight;

      scrollingElement.style.top = '0px';
      followingElement.style.top = scrollTop / scrollingElementScrollMax * followingElementTopMax + 'px';
    }

    /**
     * scroll top
     * @param {number} top - scroll top in pixel
     */

  }, {
    key: 'scrollTop',
    value: function scrollTop(top) {
      this._contentWrapper.scrollTop = top;
    }
  }]);

  return ScrollSyncSplit;
}();

exports.default = ScrollSyncSplit;

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _codeMirrorExt = __webpack_require__(36);

var _codeMirrorExt2 = _interopRequireDefault(_codeMirrorExt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements code block editor
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var EVENT_LANGUAGE_CHANGED = 'language-changed';

/**
 * Class Code Block Editor
 * @param {HTMLElement} el - code block editor container element
 * @param {EventManager} eventManager - event manager
 * @ignore
 */

var CodeBlockEditor = function (_CodeMirrorExt) {
  _inherits(CodeBlockEditor, _CodeMirrorExt);

  function CodeBlockEditor(el, eventManager) {
    _classCallCheck(this, CodeBlockEditor);

    var _this = _possibleConstructorReturn(this, (CodeBlockEditor.__proto__ || Object.getPrototypeOf(CodeBlockEditor)).call(this, el, {
      singleCursorHeightPerLine: false,
      theme: 'none'
    }));

    _this._language = '';
    _this._eventManager = eventManager;

    _this._initEvent();
    return _this;
  }

  _createClass(CodeBlockEditor, [{
    key: '_initEvent',
    value: function _initEvent() {
      var _this2 = this;

      this.on('cursorActivity', this._onRequireScrollIntoView.bind(this));
      this.on('beforeChange', function (cm, ev) {
        if (ev.origin === 'paste') {
          _this2._eventManager.emit('pasteBefore', {
            source: 'codeblock',
            data: ev
          });
        }
      });
    }
  }, {
    key: '_onRequireScrollIntoView',
    value: function _onRequireScrollIntoView() {
      var cursor = this.getCursor();
      var wrapper = this.getWrapperElement();

      // CodeMirror cursorActivity event fires before actually attach a new line element to DOM
      // we should proceed at next tick
      setTimeout(function () {
        var lineElement = wrapper.querySelector('pre:nth-child(' + (cursor.line + 1) + ')');
        (0, _jquery2.default)(lineElement).trigger('requireScrollIntoView');
      }, 0);
    }

    /**
     * load code from code block element
     * @param {HTMLElement} codeBlockElement - code block element
     */

  }, {
    key: 'load',
    value: function load(codeBlockElement) {
      var el = codeBlockElement.cloneNode(true);
      this.setLanguage(el.getAttribute('data-language') || '');
      this.setEditorCodeText(el.textContent);
    }

    /**
     * save code to code block element
     * @param {HTMLElement} codeBlockElement - code block element
     */

  }, {
    key: 'save',
    value: function save(codeBlockElement) {
      codeBlockElement.innerHTML = '';
      codeBlockElement.textContent = this.getEditorCodeText();
      codeBlockElement.setAttribute('data-language', this._language);
      (0, _jquery2.default)(codeBlockElement).trigger(EVENT_LANGUAGE_CHANGED);
    }

    /**
     * clear code and language
     */

  }, {
    key: 'clear',
    value: function clear() {
      this.setLanguage('');
      this.setEditorCodeText('');
    }

    /**
     * get code language
     * @returns {string} - code language
     */

  }, {
    key: 'getLanguage',
    value: function getLanguage() {
      return this._language;
    }

    /**
     * set code language
     * @param {string} [language=''] - code language
     */

  }, {
    key: 'setLanguage',
    value: function setLanguage() {
      var language = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      this._language = language;
    }

    /**
     * get code text
     * @returns {string} - code text
     */

  }, {
    key: 'getEditorCodeText',
    value: function getEditorCodeText() {
      return this.getValue();
    }

    /**
     * set code text
     * @param {string} [code=''] - code text
     */

  }, {
    key: 'setEditorCodeText',
    value: function setEditorCodeText() {
      var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      this.setValue(code);
    }

    /**
     * refresh. call if codemirror resized
     */

  }, {
    key: 'refresh',
    value: function refresh() {
      this.cm.refresh();
    }
  }]);

  return CodeBlockEditor;
}(_codeMirrorExt2.default);

exports.default = CodeBlockEditor;

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _preview = __webpack_require__(13);

var _preview2 = _interopRequireDefault(_preview);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements CodeBlockPreview
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var EVENT_REQUIRE_SCROLL_SYNC = 'requireScrollSync';

/**
 * Class Code block preview
 * @param {jQuery} $el - base element
 * @param {EventManager} eventManager - event manager
 * @param {Convertor} convertor - convertor
 * @param {CodeBlockEditor} codeBlockEditor - code block editor
 * @ignore
 */

var CodeBlockPreview = function (_Preview) {
  _inherits(CodeBlockPreview, _Preview);

  function CodeBlockPreview($el, eventManager, convertor, codeBlockEditor) {
    _classCallCheck(this, CodeBlockPreview);

    var _this = _possibleConstructorReturn(this, (CodeBlockPreview.__proto__ || Object.getPrototypeOf(CodeBlockPreview)).call(this, $el, eventManager, convertor, true));

    _this._codeBlockEditor = codeBlockEditor;

    _this._initEvent();
    return _this;
  }

  _createClass(CodeBlockPreview, [{
    key: '_initEvent',
    value: function _initEvent() {
      var _this2 = this;

      this._codeBlockEditor.on('update', function () {
        return _this2.lazyRunner.run('refresh');
      });
    }

    /**
     * refresh preview
     * @override
     */

  }, {
    key: 'refresh',
    value: function refresh() {
      var language = this._codeBlockEditor.getLanguage();
      var codeText = this._codeBlockEditor.getEditorCodeText();

      _get(CodeBlockPreview.prototype.__proto__ || Object.getPrototypeOf(CodeBlockPreview.prototype), 'refresh', this).call(this, '```' + language + '\n' + codeText + '\n```');
      this.$el.trigger(EVENT_REQUIRE_SCROLL_SYNC);
    }

    /**
     * clear preview
     */

  }, {
    key: 'clear',
    value: function clear() {
      _get(CodeBlockPreview.prototype.__proto__ || Object.getPrototypeOf(CodeBlockPreview.prototype), 'render', this).call(this, '');
    }
  }]);

  return CodeBlockPreview;
}(_preview2.default);

exports.default = CodeBlockPreview;

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements UI code block languages combo
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _keyMapper = __webpack_require__(20);

var _keyMapper2 = _interopRequireDefault(_keyMapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class CodeBlockLanguagesCombo
 * @param {EventManager} eventManager - event manager instance
 * @ignore
 */
var CodeBlockLanguagesCombo = function () {
  function CodeBlockLanguagesCombo(eventManager) {
    _classCallCheck(this, CodeBlockLanguagesCombo);

    this._eventManager = eventManager;

    this._initDOM();
    this._initDOMEvent();
  }

  _createClass(CodeBlockLanguagesCombo, [{
    key: '_initDOM',
    value: function _initDOM() {
      this._inputLanguage = (0, _jquery2.default)('<input type="text" maxlength="20" placeholder="' + _i18n2.default.get('Choose language') + '">').get(0);
      this._wrapper = (0, _jquery2.default)('<span class="te-input-language">').get(0);
      this._wrapper.appendChild(this._inputLanguage);
    }
  }, {
    key: '_initDOMEvent',
    value: function _initDOMEvent() {
      var _this = this;

      this._inputLanguage.addEventListener('keydown', function (event) {
        return _this._onKeyEvent(event);
      });
      this._inputLanguage.addEventListener('focus', function () {
        return _this._showPopupCodeBlockLanguages();
      });
      this._inputLanguage.addEventListener('focusout', function () {
        return _this._onFocusOut();
      });
      this._wrapper.addEventListener('mousedown', function (ev) {
        if (ev.target !== _this._wrapper) {
          return;
        }
        ev.preventDefault();
        _this._toggleFocus();
      });
    }

    /**
     * show popup
     * @private
     */

  }, {
    key: '_showPopupCodeBlockLanguages',
    value: function _showPopupCodeBlockLanguages() {
      var _this2 = this;

      var clientRect = this._inputLanguage.getBoundingClientRect();
      (0, _jquery2.default)(this._wrapper).toggleClass('active', true);
      this.active = true;

      this._popupCodeBlockLanguages = this._eventManager.emitReduce('openPopupCodeBlockLanguages', {
        language: this._prevStoredLanguage,
        offset: {
          left: clientRect.left,
          top: clientRect.bottom
        },
        callback: {
          selected: function selected(selectedLanguage) {
            return _this2._onLanguageSelectedFromList(selectedLanguage);
          },
          dismissed: function dismissed() {
            _this2._popupCodeBlockLanguages = null;
          }
        }
      });
    }
  }, {
    key: '_toggleFocus',
    value: function _toggleFocus() {
      var inputLanguage = this._inputLanguage;
      if ((0, _jquery2.default)(this._wrapper).hasClass('active')) {
        inputLanguage.blur();
      } else {
        inputLanguage.focus();
      }
    }
  }, {
    key: '_onFocusOut',
    value: function _onFocusOut() {
      (0, _jquery2.default)(this._wrapper).toggleClass('active', false);
      this._inputLanguage.value = this._prevStoredLanguage;
      this._hidePopupCodeBlockLanguages();
    }
  }, {
    key: '_onKeyEvent',
    value: function _onKeyEvent(event) {
      if (this._popupCodeBlockLanguages) {
        switch (event.which) {
          case _keyMapper2.default.keyCode('UP'):
            this._popupCodeBlockLanguages.prev();
            event.preventDefault();
            break;
          case _keyMapper2.default.keyCode('DOWN'):
            this._popupCodeBlockLanguages.next();
            event.preventDefault();
            break;
          case _keyMapper2.default.keyCode('ENTER'):
          case _keyMapper2.default.keyCode('TAB'):
            {
              var language = this._popupCodeBlockLanguages.getCurrentLanguage();
              this._inputLanguage.value = language;
              this._storeInputLanguage();
              event.preventDefault();
              break;
            }
          default:
            this._popupCodeBlockLanguages.hide();
        }
      } else if (event.which === _keyMapper2.default.keyCode('ENTER') || event.which === _keyMapper2.default.keyCode('TAB')) {
        this._storeInputLanguage();
        event.preventDefault();
      }
    }
  }, {
    key: '_onLanguageSelectedFromList',
    value: function _onLanguageSelectedFromList(selectedLanguage) {
      this._inputLanguage.value = selectedLanguage;
      this._storeInputLanguage();
    }

    /**
     * set a callback to be called on language selected
     * @param {function} callback - callback function
     * @protected
     */

  }, {
    key: 'setOnLanguageSelected',
    value: function setOnLanguageSelected(callback) {
      this._onLanguageSelected = callback;
    }

    /**
     * hide popup
     * @private
     */

  }, {
    key: '_hidePopupCodeBlockLanguages',
    value: function _hidePopupCodeBlockLanguages() {
      this._eventManager.emit('closePopupCodeBlockLanguages');
    }

    /**
     * set language
     * @param {string} language - code block language
     * @protected
     */

  }, {
    key: 'setLanguage',
    value: function setLanguage(language) {
      this._prevStoredLanguage = language;
      this._inputLanguage.value = language;
    }

    /**
     * store selection(typed) language & hide popup
     * @private
     */

  }, {
    key: '_storeInputLanguage',
    value: function _storeInputLanguage() {
      var selectedLanguage = this._inputLanguage.value;

      this.setLanguage(selectedLanguage);
      if (this._onLanguageSelected) {
        this._onLanguageSelected(selectedLanguage);
      }

      this._hidePopupCodeBlockLanguages();
    }

    /**
     * get element body
     * @returns {HTMLElement} - CodeBlockLanguagesCombo body element
     * @protected
     */

  }, {
    key: 'getElement',
    value: function getElement() {
      return this._wrapper;
    }
  }]);

  return CodeBlockLanguagesCombo;
}();

exports.default = CodeBlockLanguagesCombo;

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toMark = __webpack_require__(18);

var _toMark2 = _interopRequireDefault(_toMark);

var _domUtils = __webpack_require__(4);

var _domUtils2 = _interopRequireDefault(_domUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Check if given node is valid delimiter run.
 * According to common-mark spec, following examples are not valid delimiter runs.
 * 1. opening (*|**) preceded by an alphanumeric and followed by a punctuation.
 *    (ex: a**~~c~~b**)
 * 2. closing (*|**) preceded by a punctuation and followed by an alphanumeric.
 *    (ex: **b~~c~~**a)
 * @see {@link https://spec.commonmark.org/0.29/#delimiter-run}
 * @see {@link https://github.com/commonmark/commonmark-spec/issues/611#issuecomment-533578503}
 */
function isValidDelimiterRun(node) {
  var isElemNode = _domUtils2.default.isElemNode,
      isTextNode = _domUtils2.default.isTextNode;

  var isInvalidOpener = isTextNode(node.previousSibling) && isElemNode(node.firstChild);
  var isInvalidCloser = isTextNode(node.nextSibling) && isElemNode(node.lastChild);

  return !isInvalidOpener && !isInvalidCloser;
}

function convertEmphasis(node, subContent, delimiter) {
  var FIND_BEFORE_AND_AFTER_SPACES_RX = /^(\s*)((?:.|\n)*\S)(\s*)$/m;

  var _subContent$match = subContent.match(FIND_BEFORE_AND_AFTER_SPACES_RX),
      beforeSpaces = _subContent$match[1],
      trimmedContent = _subContent$match[2],
      afterSpaces = _subContent$match[3];

  var convertedContent = void 0;

  if (isValidDelimiterRun(node)) {
    convertedContent = '' + delimiter + trimmedContent + delimiter;
  } else {
    var tagName = node.nodeName.toLowerCase();

    convertedContent = '<' + tagName + '>' + trimmedContent + '</' + tagName + '>';
  }

  return '' + beforeSpaces + convertedContent + afterSpaces;
}

exports.default = _toMark2.default.Renderer.factory(_toMark2.default.gfmRenderer, {
  'EM, I': function EMI(node, subContent) {
    if (this.isEmptyText(subContent)) {
      return '';
    }

    return convertEmphasis(node, subContent, '*');
  },
  'STRONG, B': function STRONGB(node, subContent) {
    if (this.isEmptyText(subContent)) {
      return '';
    }

    return convertEmphasis(node, subContent, '**');
  },
  'DEL, S': function DELS(node, subContent) {
    if (this.isEmptyText(subContent)) {
      return '';
    }

    return convertEmphasis(node, subContent, '~~');
  }
});

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _emphasisCommon = __webpack_require__(34);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @fileoverview Implements Bold markdown command
* @author NHN FE Development Lab <dl_javascript@nhn.com>
*/
var boldRangeRegex = /^(\*{2}|_{2}).*\1$/;
var boldContentRegex = /[*_]{2,}([^*_]*)[*_]{2,}/g;
var boldSymbol = '**';

/**
 * Bold
 * Add bold markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Bold
 * @ignore
 */
var Bold = _commandManager2.default.command('markdown', /** @lends Bold */{
  name: 'Bold',
  keyMap: ['CTRL+B', 'META+B'],
  /**
   * Command Handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec: function exec(mde) {
    var cm = mde.getEditor();
    var doc = cm.getDoc();
    var originRange = mde.getRange();

    (0, _emphasisCommon.changeSyntax)(doc, originRange, boldSymbol, boldRangeRegex, boldContentRegex);

    cm.focus();
  }
});

exports.default = Bold;

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _emphasisCommon = __webpack_require__(34);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileoverview Implements Italic markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
var boldItalicRangeRegex = /^(\*{3}|_{3}).*\1$/;
var boldRangeRegex = /^(\*{2}|_{2}).*\1$/;
var italicRangeRegex = /^(\*|_).*\1$/;
var italicContentRegex = /([^*_])[*_]([^*_]+)[*_]([^*_])/g;

var isBoldItalic = function isBoldItalic(t) {
  return boldItalicRangeRegex.test(t);
};
var isBold = function isBold(t) {
  return boldRangeRegex.test(t);
};
var isItalic = function isItalic(t) {
  return italicRangeRegex.test(t);
};

var italicSymbol = '*';
var boldSymbol = '**';
var boldItalicSymbol = '***';
var italicLength = italicSymbol.length;
var boldLength = boldSymbol.length;
var boldItalicLength = boldItalicSymbol.length;

/**
 * remove italic syntax in the middle of given text
 * @param {string} text - text selected
 * @returns {string} - text eliminated all italic in the middle of it's content
 * @ignore
 */
var removeItalicInsideText = function removeItalicInsideText(text) {
  return text ? text.replace(italicContentRegex, '$1$2$3') : '';
};

var replaceText = function replaceText(doc, text, range) {
  // Check 3 cases when both text and expand text
  // case 1 : bold & italic (when expand 3 both front and end) => remove italic
  // case 2 : bold (when expand 2 both front and end) => append
  // case 3 : italic (expand 1 both front and end) => remove
  var expandReplaceBind = _emphasisCommon.expandReplace.bind(this, doc, range);

  return expandReplaceBind(boldItalicLength, isBoldItalic, function (t) {
    return (0, _emphasisCommon.removeSyntax)(t, italicSymbol);
  }) || expandReplaceBind(boldLength, isBold, function (t) {
    return (0, _emphasisCommon.appendSyntax)(removeItalicInsideText(t), italicSymbol);
  }) || expandReplaceBind(italicLength, isItalic, function (t) {
    return (0, _emphasisCommon.removeSyntax)(t, italicSymbol);
  }) || (0, _emphasisCommon.replace)(doc, text, isBoldItalic, function (t) {
    return (0, _emphasisCommon.removeSyntax)(t, italicSymbol);
  }) || (0, _emphasisCommon.replace)(doc, text, isBold, function (t) {
    return (0, _emphasisCommon.appendSyntax)(removeItalicInsideText(t), italicSymbol);
  }) || (0, _emphasisCommon.replace)(doc, text, isItalic, function (t) {
    return (0, _emphasisCommon.removeSyntax)(t, italicSymbol);
  });
};

var replaceEmptyText = function replaceEmptyText(doc, range) {
  // Check 3 cases when expand text
  // case 1 : bold & italic => remove italic
  // case 2 : bold => append
  // case 3 : italic => remove
  // if there is no match, make italic
  return (0, _emphasisCommon.expandReplace)(doc, range, boldItalicLength, isBoldItalic, function (t) {
    return (0, _emphasisCommon.removeSyntax)(t, italicSymbol);
  }) || (0, _emphasisCommon.expandReplace)(doc, range, boldLength, isBold, function (t) {
    return (0, _emphasisCommon.appendSyntax)(t, italicSymbol);
  }) || (0, _emphasisCommon.expandReplace)(doc, range, italicLength, isItalic, function () {
    return '';
  }) || doc.replaceSelection('' + italicSymbol + italicSymbol, 'around');
};

/**
 * Italic
 * Add italic markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Italic
 * @ignore
 */
var Italic = _commandManager2.default.command('markdown', /** @lends Italic */{
  name: 'Italic',
  keyMap: ['CTRL+I', 'META+I'],
  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec: function exec(mde) {
    var cm = mde.getEditor();
    var doc = cm.getDoc();

    var _doc$getCursor = doc.getCursor(),
        line = _doc$getCursor.line,
        ch = _doc$getCursor.ch;

    var range = mde.getRange();
    var selectionStr = doc.getSelection();

    if (selectionStr) {
      // check selectionStr match bold & italic, bold, italic and then
      // if there is no match, append italic
      if (!replaceText(doc, selectionStr, range)) {
        // Before append italic, remove italic inside text and then append italic
        // Example: One*Two*Three => *OneTwoThree*
        doc.replaceSelection((0, _emphasisCommon.appendSyntax)(removeItalicInsideText(selectionStr), italicSymbol), 'around');
      }
    } else {
      replaceEmptyText(doc, range);

      var afterSelectStr = doc.getSelection();
      var size = ch;

      // If text was not selected, after replace text, move cursor
      if (isBoldItalic(afterSelectStr) || isItalic(afterSelectStr) && !isBold(afterSelectStr)) {
        // For example **|** => ***|*** (move cusor +symbolLenth)
        size += italicLength;
      } else {
        // For example *|* => | (move cusor -symbolLenth)
        size -= italicLength;
      }

      doc.setCursor(line, size);
    }

    cm.focus();
  }
});

exports.default = Italic;

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _emphasisCommon = __webpack_require__(34);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileoverview Implements StrikeThrough markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
var strikeRangeRegex = /^~~.*~~$/;
var strikeContentRegex = /~~([^~]*)~~/g;
var strikeSymbol = '~~';

/**
 * Strike
 * Add strike markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Strike
 * @ignore
 */
var Strike = _commandManager2.default.command('markdown', /** @lends Strike */{
  name: 'Strike',
  keyMap: ['CTRL+S', 'META+S'],
  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec: function exec(mde) {
    var cm = mde.getEditor();
    var doc = cm.getDoc();
    var originRange = mde.getRange();

    (0, _emphasisCommon.changeSyntax)(doc, originRange, strikeSymbol, strikeRangeRegex, strikeContentRegex);

    cm.focus();
  }
});

exports.default = Strike;

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BlockquoteRegex = /^> ?/;

/**
 * Blockquote
 * Add blockquote markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Blockquote
 * @ignore
 */
/**
* @fileoverview Implements Blockquote markdown command
* @author NHN FE Development Lab <dl_javascript@nhn.com>
*/
var Blockquote = _commandManager2.default.command('markdown', /** @lends Blockquote */{
  name: 'Blockquote',
  keyMap: ['ALT+Q', 'ALT+Q'],
  /**
   * command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec: function exec(mde) {
    var cm = mde.getEditor();
    var doc = cm.getDoc();

    var range = mde.getCurrentRange();

    var from = {
      line: range.from.line,
      ch: 0
    };

    var to = {
      line: range.to.line,
      ch: doc.getLineHandle(range.to.line).text.length
    };

    var textToModify = doc.getRange(from, to);
    var textLinesToModify = textToModify.split('\n');
    var isNeedToRemove = this._haveBlockquote(textLinesToModify);
    var resultText = void 0;

    if (isNeedToRemove) {
      resultText = this._removeBlockquote(textLinesToModify);
    } else {
      resultText = this._addBlockquote(textLinesToModify);
    }

    doc.replaceRange(resultText.join('\n'), from, to);

    if (isNeedToRemove) {
      var length = textLinesToModify.length;
      if (this._isBlockquoteWithSpace(textLinesToModify[length - 1])) {
        range.to.ch -= 2;
      } else {
        range.to.ch -= 1;
      }
    } else {
      range.to.ch += 2;
    }

    doc.setCursor(range.to);

    cm.focus();
  },


  /**
   * check all text in textArr starts with '>'
   * @param {Array} textArr - text array
   * @returns {boolean} - true if all text in textArr starts with '>'
   * @private
   */
  _haveBlockquote: function _haveBlockquote(textArr) {
    for (var i = 0; i < textArr.length; i += 1) {
      if (!BlockquoteRegex.test(textArr[i])) {
        return false;
      }
    }

    return true;
  },


  /**
   * add '> ' to all text in textArr
   * @param {Array} textArr - text array
   * @returns {Array} - new text array added '> '
   * @private
   */
  _addBlockquote: function _addBlockquote(textArr) {
    return textArr.map(function (text) {
      return '> ' + text;
    });
  },


  /**
   * remove '> ' or '>' to all text in textArr
   * @param {Array} textArr - text array
   * @returns {Array} - new text array removed '> ' or  '>'
   * @private
   */
  _removeBlockquote: function _removeBlockquote(textArr) {
    return textArr.map(function (text) {
      return text.replace(BlockquoteRegex, '');
    });
  },


  /**
   * check text start '> '
   * @param {string} text - text
   * @returns {boolean} - if text start '> ', true
   * @private
   */
  _isBlockquoteWithSpace: function _isBlockquoteWithSpace(text) {
    return (/^> /.test(text)
    );
  }
});

exports.default = Blockquote;

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileoverview Implements Heading markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
var FIND_HEADING_RX = /^#+\s/g;

/**
 * Heading
 * Add heading markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Heading
 * @ignore
 */
var Heading = _commandManager2.default.command('markdown', /** @lends Heading */{
  name: 'Heading',
  /**
   * Command Handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   * @param {number} size heading size
   */
  exec: function exec(mde, size) {
    var cm = mde.getEditor();
    var doc = cm.getDoc();

    var range = mde.getCurrentRange();

    var from = {
      line: range.from.line,
      ch: 0
    };

    var to = {
      line: range.to.line,
      ch: doc.getLineHandle(range.to.line).text.length
    };

    var lengthOfCurrentLineBefore = doc.getLine(to.line).length;
    var textToModify = doc.getRange(from, to);
    var textLinesToModify = textToModify.split('\n');

    _tuiCodeSnippet2.default.forEachArray(textLinesToModify, function (line, index) {
      textLinesToModify[index] = getHeadingMarkdown(line, size);
    });

    doc.replaceRange(textLinesToModify.join('\n'), from, to);

    range.to.ch += doc.getLine(to.line).length - lengthOfCurrentLineBefore;

    doc.setSelection(from, range.to);

    cm.focus();
  }
});

/**
 * Get heading markdown
 * @param {string} text Source test
 * @param {number} size size
 * @returns {string}
 */
function getHeadingMarkdown(text, size) {
  var foundedHeading = text.match(FIND_HEADING_RX);
  var heading = '';

  do {
    heading += '#';
    size -= 1;
  } while (size > 0);

  if (foundedHeading) {
    var _text$split = text.split(foundedHeading[0]);

    text = _text$split[1];
  }

  return heading + ' ' + text;
}

exports.default = Heading;

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Paragraph
 * Convert selected lines to paragraph
 * @extends Command
 * @module markdownCommands/Paragraph
 * @ignore
 */
/**
 * @fileoverview Implements Paragraph markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
var Paragraph = _commandManager2.default.command('markdown', /** @lends Paragraph */{
  name: 'Paragraph',
  /**
   * Command Handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec: function exec(mde) {
    var cm = mde.getEditor();
    var doc = cm.getDoc();
    var range = mde.getCurrentRange();
    var from = {
      line: range.from.line,
      ch: 0
    };
    var to = {
      line: range.to.line,
      ch: doc.getLineHandle(range.to.line).text.length
    };

    var lengthOfCurrentLineBefore = doc.getLine(to.line).length;
    var textToModify = doc.getRange(from, to);
    var textLines = textToModify.split('\n');

    _tuiCodeSnippet2.default.forEachArray(textLines, function (line, index) {
      textLines[index] = getParagraphMarkdown(line);
    });

    doc.replaceRange(textLines.join('\n'), from, to);

    range.to.ch += doc.getLine(to.line).length - lengthOfCurrentLineBefore;

    doc.setSelection(from, to);

    cm.focus();
  }
});
/**
 * Get paragraph markdown lineText
 * @param {string} lineText line lineText
 * @returns {string}
 */
function getParagraphMarkdown(lineText) {
  var headingRx = /^(#{1,6}| *((?:\*|-|\d\.)(?: \[[ xX]])?)) /;

  return lineText.replace(headingRx, '');
}

exports.default = Paragraph;

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * HR
 * Add HR markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/HR
 * @ignore
 */
var HR = _commandManager2.default.command('markdown', /** @lends HR */{
  name: 'HR',
  keyMap: ['CTRL+L', 'META+L'],
  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec: function exec(mde) {
    var cm = mde.getEditor();
    var doc = cm.getDoc();
    var replaceText = '';

    var range = mde.getCurrentRange();

    var from = {
      line: range.from.line,
      ch: range.from.ch
    };

    var to = {
      line: range.to.line,
      ch: range.to.ch
    };

    if (range.collapsed) {
      replaceText = doc.getLine(from.line);
      from.ch = 0;
      to.ch = doc.getLineHandle(range.to.line).text.length;
    }

    if (doc.getLine(from.line).length) {
      replaceText += '\n\n* * *\n\n';
    } else {
      replaceText += '\n* * *\n';
    }

    doc.replaceRange(replaceText, from, to);

    cm.focus();
  }
}); /**
     * @fileoverview Implements HR markdown command
     * @author NHN FE Development Lab <dl_javascript@nhn.com>
     */

exports.default = HR;

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _importManager = __webpack_require__(10);

var _importManager2 = _interopRequireDefault(_importManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @fileoverview Implements Addlink markdown command
* @author NHN FE Development Lab <dl_javascript@nhn.com>
*/
var decodeURIGraceful = _importManager2.default.decodeURIGraceful,
    encodeMarkdownCharacters = _importManager2.default.encodeMarkdownCharacters,
    escapeMarkdownCharacters = _importManager2.default.escapeMarkdownCharacters;

/**
 * AddLink
 * Add link markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/AddLink
 * @ignore
 */

var AddLink = _commandManager2.default.command('markdown', /** @lends AddLink */{
  name: 'AddLink',
  /**
   * command handler for AddLink
   * @param {MarkdownEditor} mde - MarkdownEditor instance
   * @param {object} data - data for image
   */
  exec: function exec(mde, data) {
    var cm = mde.getEditor();
    var doc = cm.getDoc();

    var range = mde.getCurrentRange();

    var from = {
      line: range.from.line,
      ch: range.from.ch
    };

    var to = {
      line: range.to.line,
      ch: range.to.ch
    };

    var linkText = data.linkText,
        url = data.url;

    linkText = decodeURIGraceful(linkText);
    linkText = escapeMarkdownCharacters(linkText);
    url = encodeMarkdownCharacters(url);

    var replaceText = '[' + linkText + '](' + url + ')';

    doc.replaceRange(replaceText, from, to);

    cm.focus();
  }
});

exports.default = AddLink;

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _importManager = __webpack_require__(10);

var _importManager2 = _interopRequireDefault(_importManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @fileoverview Implments AddImage markdown command
* @author NHN FE Development Lab <dl_javascript@nhn.com>
*/
var decodeURIGraceful = _importManager2.default.decodeURIGraceful,
    encodeMarkdownCharacters = _importManager2.default.encodeMarkdownCharacters,
    escapeMarkdownCharacters = _importManager2.default.escapeMarkdownCharacters;

/**
 * AddImage
 * Add Image markdown syntax to markdown Editor
 * @extends Command
 * @module markdownCommands/AddImage
 * @ignore
 */

var AddImage = _commandManager2.default.command('markdown', /** @lends AddImage */{
  name: 'AddImage',
  /**
   * Command Handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   * @param {object} data data for image
   */
  exec: function exec(mde, data) {
    var cm = mde.getEditor();
    var doc = cm.getDoc();

    var range = mde.getCurrentRange();

    var from = {
      line: range.from.line,
      ch: range.from.ch
    };

    var to = {
      line: range.to.line,
      ch: range.to.ch
    };

    var altText = data.altText,
        imageUrl = data.imageUrl;

    altText = decodeURIGraceful(altText);
    altText = escapeMarkdownCharacters(altText);
    imageUrl = encodeMarkdownCharacters(imageUrl);
    var replaceText = '![' + altText + '](' + imageUrl + ')';

    doc.replaceRange(replaceText, from, to, '+addImage');

    cm.focus();
  }
});

exports.default = AddImage;

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * UL
 * Add unordered list markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/UL
 * @ignore
 */
var UL = _commandManager2.default.command('markdown', /** @lends UL */{
  name: 'UL',
  keyMap: ['CTRL+U', 'META+U'],
  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec: function exec(mde) {
    var range = mde.getCurrentRange();
    var listManager = mde.componentManager.getManager('list');

    listManager.changeSyntax(range, 'ul');
  }
}); /**
     * @fileoverview Implements UL markdown command
     * @author NHN FE Development Lab <dl_javascript@nhn.com>
     */
exports.default = UL;

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * OL
 * Add ordered list markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/OL
 * @ignore
 */
var OL = _commandManager2.default.command('markdown', /** @lends OL */{
  name: 'OL',
  keyMap: ['CTRL+O', 'META+O'],
  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec: function exec(mde) {
    var range = mde.getCurrentRange();
    var listManager = mde.componentManager.getManager('list');

    listManager.changeSyntax(range, 'ol');
  }
}); /**
     * @fileoverview Implements OL markdown command
     * @author NHN FE Development Lab <dl_javascript@nhn.com>
     */

exports.default = OL;

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Indent
 * Add Indent markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/inent
 * @ignore
 */
var Indent = _commandManager2.default.command('markdown', /** @lends Indent */{
  name: 'Indent',
  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec: function exec(mde) {
    var cm = mde.getEditor();
    cm.execCommand('indentOrderedList');
  }
}); /**
     * @fileoverview Implements Indent markdown command
     * @author NHN FE Development Lab <dl_javascript@nhn.com>
     */

exports.default = Indent;

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Outdent
 * Add Outdent markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/outdent
 * @ignore
 */
var Outdent = _commandManager2.default.command('markdown', /** @lends Outdent */{
  name: 'Outdent',
  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec: function exec(mde) {
    var cm = mde.getEditor();
    cm.execCommand('indentLessOrderedList');
  }
}); /**
     * @fileoverview Implements Outdent markdown command
     * @author NHN FE Development Lab <dl_javascript@nhn.com>
     */

exports.default = Outdent;

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Table
 * Add table markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Table
 * @ignore
 */
var Table = _commandManager2.default.command('markdown', /** @lends Table */{
  name: 'Table',
  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   * @param {number} col column count
   * @param {number} row row count
   * @param {Array} data initial table data
   */
  exec: function exec(mde, col, row, data) {
    var cm = mde.getEditor();
    var doc = cm.getDoc();
    var table = '\n';

    if (cm.getCursor().ch > 0) {
      table += '\n';
    }

    table += makeHeader(col, data);
    table += makeBody(col, row - 1, data);

    doc.replaceSelection(table);

    if (!data) {
      cm.setCursor(cm.getCursor().line - row, 2);
    }

    mde.focus();
  }
});

/**
 * makeHeader
 * make table header markdown string
 * @param {number} col Column count
 * @param {array} data Cell's text content
 * @returns {string} markdown string
 */
/**
 * @fileoverview Implements Table markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

function makeHeader(col, data) {
  var header = '|';
  var border = '|';
  var index = 0;

  while (col) {
    if (data) {
      header += ' ' + data[index] + ' |';
      index += 1;
    } else {
      header += '  |';
    }

    border += ' --- |';

    col -= 1;
  }

  return header + '\n' + border + '\n';
}

/**
 * makeBody
 * make table body markdown string
 * @param {number} col column count
 * @param {number} row row count
 * @param {Array} data initial table data
 * @returns {string} html string
 */
function makeBody(col, row, data) {
  var body = '';
  var index = col;

  for (var irow = 0; irow < row; irow += 1) {
    body += '|';

    for (var icol = 0; icol < col; icol += 1) {
      if (data) {
        body += ' ' + data[index] + ' |';
        index += 1;
      } else {
        body += '  |';
      }
    }

    body += '\n';
  }

  body = body.replace(/\n$/g, '');

  return body;
}
exports.default = Table;

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Task
 * @extends Command
 * @module markdownCommands/Task
 * @ignore
 */
var Task = _commandManager2.default.command('markdown', /** @lends Task */{
  name: 'Task',
  keyMap: ['ALT+T', 'ALT+T'],
  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec: function exec(mde) {
    var range = mde.getCurrentRange();
    var listManager = mde.componentManager.getManager('list');

    listManager.changeSyntax(range, 'task');
  }
}); /**
     * @fileoverview Implements Task markdown command
     * @author NHN FE Development Lab <dl_javascript@nhn.com>
     */
exports.default = Task;

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var codeRangeRegex = /^`([^`]+)`$/; /**
                                    * @fileoverview Implements Code markdown command
                                    * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                    */

var codeContentRegex = /`([^`]+)`/g;

/**
 * Code
 * Add code markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Code
 * @ignore
 */
var Code = _commandManager2.default.command('markdown', /** @lends Code */{
  name: 'Code',
  keyMap: ['SHIFT+CTRL+C', 'SHIFT+META+C'],
  /**
   * Command Handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec: function exec(mde) {
    var cm = mde.getEditor();
    var doc = cm.getDoc();
    var selection = doc.getSelection();
    var cursor = cm.getCursor();
    var hasSyntax = this.hasStrikeSyntax(selection);

    var result = void 0;
    if (hasSyntax) {
      result = this.remove(selection);
      result = this._removeCodeSyntax(result);
    } else {
      result = this._removeCodeSyntax(selection);
      result = this.append(result);
    }

    doc.replaceSelection(result, 'around');

    if (!selection && !hasSyntax) {
      this.setCursorToCenter(doc, cursor, hasSyntax);
    }

    cm.focus();
  },


  /**
   * set cursor to center
   * @param {CodeMirror.doc} doc - codemirror document
   * @param {object} cursor - codemirror cursor
   * @param {boolean} isRemoved - whether it involes deletion
   */
  setCursorToCenter: function setCursorToCenter(doc, cursor, isRemoved) {
    var pos = isRemoved ? -1 : 1;
    doc.setCursor(cursor.line, cursor.ch + pos);
  },


  /**
   * has code syntax
   * @param {string} text Source text
   * @returns {boolean} true if the given text has a code syntax
   */
  hasStrikeSyntax: function hasStrikeSyntax(text) {
    return codeRangeRegex.test(text);
  },


  /**
   * apply Code
   * @param {string} text - selected text
   * @returns {string} - text after code syntax applied
   */
  append: function append(text) {
    return '`' + text + '`';
  },


  /**
   * remove Code
   * @param {string} text - selected text
   * @returns {string} - text after code syntax removed
   */
  remove: function remove(text) {
    return text.substr(1, text.length - 2);
  },


  /**
   * remove bold syntax in the middle of given text
   * @param {string} text - text selected
   * @returns {string} - text eliminated all code in the middle of it's content
   * @private
   */
  _removeCodeSyntax: function _removeCodeSyntax(text) {
    return text ? text.replace(codeContentRegex, '$1') : '';
  }
});

exports.default = Code;

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * CodeBlock
 * Add CodeBlock markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/CodeBlock
 * @ignore
 */
var CodeBlock = _commandManager2.default.command('markdown', /** @lends CodeBlock */{
  name: 'CodeBlock',
  keyMap: ['SHIFT+CTRL+P', 'SHIFT+META+P'],
  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec: function exec(mde) {
    var cm = mde.getEditor();
    var doc = cm.getDoc();
    var range = mde.getCurrentRange();
    var replaceText = ['```', doc.getSelection(), '```'];
    var cursorOffset = 1;
    // insert a line break to the front if the selection starts in the middle of a text
    if (range.from.ch !== 0) {
      replaceText.unshift('');
      cursorOffset += 1;
    }
    // insert a line break to the end if the selection has trailing text
    if (range.to.ch !== doc.getLine(range.to.line).length) {
      replaceText.push('');
    }
    doc.replaceSelection(replaceText.join('\n'));

    cm.setCursor(range.from.line + cursorOffset, 0);

    cm.focus();
  }
}); /**
     * @fileoverview Implements CodeBlock markdown command
     * @author NHN FE Development Lab <dl_javascript@nhn.com>
     */
exports.default = CodeBlock;

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _domUtils = __webpack_require__(4);

var _domUtils2 = _interopRequireDefault(_domUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Bold
 * Add bold to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/Bold
 * @ignore
 */
/**
 * @fileoverview Implements bold WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
var Bold = _commandManager2.default.command('wysiwyg', /** @lends Bold */{
  name: 'Bold',
  keyMap: ['CTRL+B', 'META+B'],
  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    var tableSelectionManager = wwe.componentManager.getManager('tableSelection');

    wwe.focus();

    if (sq.hasFormat('table') && tableSelectionManager.getSelectedCells().length) {
      tableSelectionManager.styleToSelectedCells(styleBold);

      var range = sq.getSelection();
      range.collapse(true);
      sq.setSelection(range);
    } else {
      styleBold(sq);
      _domUtils2.default.optimizeRange(sq.getSelection(), 'B');
    }
  }
});

/**
 * Style bold.
 * @param {object} sq - squire editor instance
 */
function styleBold(sq) {
  if (sq.hasFormat('b') || sq.hasFormat('strong')) {
    sq.changeFormat(null, { tag: 'b' });
  } else if (!sq.hasFormat('PRE')) {
    if (sq.hasFormat('code')) {
      sq.changeFormat(null, { tag: 'code' });
    }
    sq.bold();
  }
}

exports.default = Bold;

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _domUtils = __webpack_require__(4);

var _domUtils2 = _interopRequireDefault(_domUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Italic
 * Add Italic to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/Italic
 * @ignore
 */
/**
 * @fileoverview Implements italic WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

var Italic = _commandManager2.default.command('wysiwyg', /** @lends Italic */{
  name: 'Italic',
  keyMap: ['CTRL+I', 'META+I'],
  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    var tableSelectionManager = wwe.componentManager.getManager('tableSelection');

    wwe.focus();

    if (sq.hasFormat('table') && tableSelectionManager.getSelectedCells().length) {
      tableSelectionManager.styleToSelectedCells(styleItalic);

      var range = sq.getSelection();
      range.collapse(true);
      sq.setSelection(range);
    } else {
      styleItalic(sq);
      _domUtils2.default.optimizeRange(sq.getSelection(), 'I');
    }
  }
});

/**
 * Style italic.
 * @param {object} sq - squire editor instance
 */
function styleItalic(sq) {
  if (sq.hasFormat('i') || sq.hasFormat('em')) {
    sq.changeFormat(null, { tag: 'i' });
  } else if (!sq.hasFormat('PRE')) {
    if (sq.hasFormat('code')) {
      sq.changeFormat(null, { tag: 'code' });
    }
    sq.italic();
  }
}

exports.default = Italic;

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _domUtils = __webpack_require__(4);

var _domUtils2 = _interopRequireDefault(_domUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Strike
 * Add strike to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/Strike
 * @ignore
 */
/**
 * @fileoverview Implements strike WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

var Strike = _commandManager2.default.command('wysiwyg', /** @lends Strike */{
  name: 'Strike',
  keyMap: ['CTRL+S', 'META+S'],
  /**
   * command handler
   * @param {WysiwygEditor} wwe WysiwygEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    var tableSelectionManager = wwe.componentManager.getManager('tableSelection');

    wwe.focus();

    if (sq.hasFormat('table') && tableSelectionManager.getSelectedCells().length) {
      tableSelectionManager.styleToSelectedCells(styleStrike);

      var range = sq.getSelection();
      range.collapse(true);
      sq.setSelection(range);
    } else {
      styleStrike(sq);
      _domUtils2.default.optimizeRange(sq.getSelection(), 'S');
    }
  }
});

/**
 * Style strike.
 * @param {object} sq - squire editor instance
 */
function styleStrike(sq) {
  if (sq.hasFormat('S')) {
    sq.changeFormat(null, { tag: 'S' });
  } else if (!sq.hasFormat('PRE')) {
    if (sq.hasFormat('code')) {
      sq.changeFormat(null, { tag: 'code' });
    }
    sq.strikethrough();
  }
}

exports.default = Strike;

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Blockquote
 * Add Blockquote to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/Blockquote
 * @ignore
 */
var Blockquote = _commandManager2.default.command('wysiwyg', /** @lends Blockquote */{
  name: 'Blockquote',
  keyMap: ['ALT+Q', 'ALT+Q'],
  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();

    wwe.focus();

    if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
      if (sq.hasFormat('BLOCKQUOTE')) {
        sq.decreaseQuoteLevel();
      } else {
        sq.increaseQuoteLevel();
      }
    }
  }
}); /**
     * @fileoverview Implements block quote WysiwygCommand
     * @author NHN FE Development Lab <dl_javascript@nhn.com>
     */

exports.default = Blockquote;

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _importManager = __webpack_require__(10);

var _importManager2 = _interopRequireDefault(_importManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileoverview Implements AddImage wysiwyg command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
var decodeURIGraceful = _importManager2.default.decodeURIGraceful,
    encodeMarkdownCharacters = _importManager2.default.encodeMarkdownCharacters;

/**
 * AddImage
 * Add Image markdown syntax to wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/AddImage
 * @ignore
 */

var AddImage = _commandManager2.default.command('wysiwyg', /** @lends AddImage */{
  name: 'AddImage',
  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   * @param {object} data data for image
   */
  exec: function exec(wwe, data) {
    var sq = wwe.getEditor();
    var altText = data.altText,
        imageUrl = data.imageUrl;

    altText = decodeURIGraceful(altText);
    imageUrl = encodeMarkdownCharacters(imageUrl);

    wwe.focus();

    if (!sq.hasFormat('PRE')) {
      sq.insertImage(imageUrl, { 'alt': altText });
    }
  }
});

exports.default = AddImage;

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _importManager = __webpack_require__(10);

var _importManager2 = _interopRequireDefault(_importManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileoverview Implements AddLink wysiwyg command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
var decodeURIGraceful = _importManager2.default.decodeURIGraceful,
    encodeMarkdownCharacters = _importManager2.default.encodeMarkdownCharacters;

/**
 * AddLink
 * Add link markdown syntax to wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/AddLink
 * @ignore
 */

var AddLink = _commandManager2.default.command('wysiwyg', /** @lends AddLink */{
  name: 'AddLink',
  /**
   * command handler
   * @param {WysiwygEditor} wwe - wysiwygEditor instance
   * @param {object} data - data for image
   */
  exec: function exec(wwe, data) {
    var sq = wwe.getEditor();
    var linkAttibute = wwe.getLinkAttribute();
    var url = data.url,
        linkText = data.linkText;

    linkText = decodeURIGraceful(linkText);
    url = encodeMarkdownCharacters(url);

    wwe.focus();

    if (!sq.hasFormat('PRE')) {
      sq.removeAllFormatting();

      if (sq.getSelectedText()) {
        sq.makeLink(url, linkAttibute);
      } else {
        var link = sq.createElement('A', _tuiCodeSnippet2.default.extend({
          href: url
        }, linkAttibute));

        (0, _jquery2.default)(link).text(linkText);
        sq.insertElement(link);
      }
    }
  }
});

exports.default = AddLink;

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _domUtils = __webpack_require__(4);

var _domUtils2 = _interopRequireDefault(_domUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * HR
 * Add horizontal line markdown syntax to wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/HR
 * @ignore
 */
/**
 * @fileoverview Implements HR wysiwyg command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
var HR = _commandManager2.default.command('wysiwyg', /** @lends HR */{
  name: 'HR',
  keyMap: ['CTRL+L', 'META+L'],
  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    var range = sq.getSelection();

    if (range.collapsed && !sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
      var hr = document.createElement('hr');
      var currentNode = _domUtils2.default.getChildNodeByOffset(range.startContainer, range.startOffset);
      var nextBlockNode = _domUtils2.default.getTopNextNodeUnder(currentNode, wwe.get$Body()[0]);

      // If nextBlockNode is div that has hr and has contenteditable as false,
      // nextBlockNode should be set as nextSibling that is normal block.
      if (nextBlockNode && !_domUtils2.default.isTextNode(nextBlockNode)) {
        while (nextBlockNode && nextBlockNode.getAttribute('contenteditable') === 'false') {
          nextBlockNode = nextBlockNode.nextSibling;
        }
      }

      if (!nextBlockNode) {
        nextBlockNode = _domUtils2.default.createEmptyLine();
        wwe.get$Body().append(nextBlockNode);
      }

      sq.modifyBlocks(function (frag) {
        frag.appendChild(hr);

        return frag;
      });

      var previousSibling = hr.previousSibling;

      if (previousSibling && _domUtils2.default.isTextNode(previousSibling) && _domUtils2.default.getTextLength(previousSibling) === 0) {
        hr.parentNode.removeChild(previousSibling);
      }

      hr.parentNode.replaceChild(_domUtils2.default.createHorizontalRule(), hr);

      range.selectNodeContents(nextBlockNode);
      range.collapse(true);

      sq.setSelection(range);
      sq.saveUndoState(range);
    }

    wwe.focus();
  }
});

exports.default = HR;

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Heading
 * Convert selected root level contents to heading with size wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/Heading
 * @ignore
 */
/**
 * @fileoverview Implements Heading wysiwyg command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
var Heading = _commandManager2.default.command('wysiwyg', /** @lends Heading */{
  name: 'Heading',
  /**
   * Command handler
   * @param {WysiwygEditor} wwe WYSIWYGEditor instance
   * @param {Number} size size
   */
  exec: function exec(wwe, size) {
    var sq = wwe.getEditor();
    var blockTagName = 'h1, h2, h3, h4, h5, h6, div';

    wwe.focus();

    if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
      sq.modifyBlocks(function (fragment) {
        (0, _jquery2.default)(fragment).children(blockTagName).each(function (index, block) {
          var headingHTML = '<H' + size + ' />';
          var $block = (0, _jquery2.default)(block);

          if ($block.is('DIV')) {
            $block.wrap(headingHTML);
          } else {
            var $wrapperHeading = (0, _jquery2.default)(headingHTML);

            $wrapperHeading.insertBefore(block);
            $wrapperHeading.html($block.html());
            $block.remove();
          }
        });

        return fragment;
      });
    }
  }
});

exports.default = Heading;

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Paragraph
 * Convert selected contents to paragraph only heading and list
 * @extends Command
 * @module wysiwygCommands/Paragraph
 * @ignore
 */
/**
 * @fileoverview Implements Paragraph wysiwyg command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
var Paragraph = _commandManager2.default.command('wysiwyg', /** @lends Paragraph */{
  name: 'Paragraph',
  /**
   * Command handler
   * @param {WysiwygEditor} wwe WYSIWYGEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();

    wwe.focus();

    if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
      sq.modifyBlocks(function (fragment) {
        var $newFragment = (0, _jquery2.default)(document.createDocumentFragment());

        (0, _jquery2.default)(fragment).children().each(function (index, block) {
          if (block.nodeName.match(/h\d/i)) {
            $newFragment.append((0, _jquery2.default)(block).children());
          } else if (block.nodeName.match(/ul|ol/i)) {
            (0, _jquery2.default)(block).find('li').each(function (i, listItem) {
              $newFragment.append((0, _jquery2.default)(listItem).children());
            });
          } else {
            $newFragment.append(block);
          }
        });

        return $newFragment[0];
      });
    }
  }
});

exports.default = Paragraph;

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * UL
 * Add UL to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/UL
 * @ignore
 */
var UL = _commandManager2.default.command('wysiwyg', /** @lends UL */{
  name: 'UL',
  keyMap: ['CTRL+U', 'META+U'],
  /**
   * Command Handler
   * @param {WysiwygEditor} wwe WYSIWYGEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    var range = sq.getSelection();
    var listManager = wwe.componentManager.getManager('list');
    var startContainer = range.startContainer,
        endContainer = range.endContainer,
        startOffset = range.startOffset,
        endOffset = range.endOffset;

    var newLIs = [];

    wwe.focus();
    sq.saveUndoState(range);

    if (listManager.isAvailableMakeListInTable()) {
      newLIs = listManager.createListInTable(range, 'UL');
    } else {
      var lines = listManager.getLinesOfSelection(startContainer, endContainer);

      for (var i = 0; i < lines.length; i += 1) {
        var newLI = this._changeFormatToUnorderedListIfNeed(wwe, lines[i]);
        if (newLI) {
          newLIs.push(newLI);
        }
      }
    }

    if (newLIs.length) {
      listManager.adjustRange(startContainer, endContainer, startOffset, endOffset, newLIs);
    }
  },


  /**
   * Change format to unordered list if need
   * @param {WysiwygEditor} wwe Wysiwyg editor instance
   * @param {HTMLElement} target Element target for change
   * @returns {HTMLElement} newly created list
   * @private
   */
  _changeFormatToUnorderedListIfNeed: function _changeFormatToUnorderedListIfNeed(wwe, target) {
    var sq = wwe.getEditor();
    var range = sq.getSelection();
    var taskManager = wwe.componentManager.getManager('task');
    var newLI = void 0;

    if (!sq.hasFormat('PRE')) {
      range.setStart(target, 0);
      range.collapse(true);
      sq.setSelection(range);

      if (sq.hasFormat('LI')) {
        wwe.saveSelection(range);
        taskManager.unformatTask(range.startContainer);
        sq.replaceParent(range.startContainer, 'ol', 'ul');
        wwe.restoreSavedSelection();
      } else {
        wwe.unwrapBlockTag();
        sq.makeUnorderedList();
      }

      newLI = sq.getSelection().startContainer;
    }

    return newLI;
  }
}); /**
     * @fileoverview Implements ul WysiwygCommand
     * @author NHN FE Development Lab <dl_javascript@nhn.com>
     */
exports.default = UL;

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * OL
 * Add OL to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/OL
 * @ignore
 */
var OL = _commandManager2.default.command('wysiwyg', /** @lends OL */{
  name: 'OL',
  keyMap: ['CTRL+O', 'META+O'],
  /**
   * Command Handler
   * @param {WysiwygEditor} wwe WYSIWYGEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    var range = sq.getSelection();
    var listManager = wwe.componentManager.getManager('list');
    var startContainer = range.startContainer,
        startOffset = range.startOffset,
        endContainer = range.endContainer,
        endOffset = range.endOffset;

    var newLIs = [];

    wwe.focus();
    sq.saveUndoState(range);

    if (listManager.isAvailableMakeListInTable()) {
      newLIs = listManager.createListInTable(range, 'OL');
    } else {
      var lines = listManager.getLinesOfSelection(startContainer, endContainer);

      for (var i = 0; i < lines.length; i += 1) {
        var newLI = this._changeFormatToOrderedListIfNeed(wwe, lines[i]);
        if (newLI) {
          newLIs.push(newLI);
        }
      }
    }

    if (newLIs.length) {
      listManager.adjustRange(startContainer, endContainer, startOffset, endOffset, newLIs);
    }
  },


  /**
   * Change format to unordered list if need
   * @param {WysiwygEditor} wwe Wysiwyg editor instance
   * @param {HTMLElement} target Element target for change
   * @returns {HTMLElement} newly created list item
   * @private
   */
  _changeFormatToOrderedListIfNeed: function _changeFormatToOrderedListIfNeed(wwe, target) {
    var sq = wwe.getEditor();
    var range = sq.getSelection();
    var taskManager = wwe.componentManager.getManager('task');
    var newLI = void 0;

    if (!sq.hasFormat('PRE')) {
      range.setStart(target, 0);
      range.collapse(true);
      sq.setSelection(range);

      if (sq.hasFormat('LI')) {
        wwe.saveSelection(range);
        taskManager.unformatTask(range.startContainer);
        sq.replaceParent(range.startContainer, 'ul', 'ol');
        wwe.restoreSavedSelection();
      } else {
        wwe.unwrapBlockTag();
        sq.makeOrderedList();
      }

      newLI = sq.getSelection().startContainer;
    }

    return newLI;
  }
}); /**
     * @fileoverview Implements ol WysiwygCommand
     * @author NHN FE Development Lab <dl_javascript@nhn.com>
     */

exports.default = OL;

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Table
 * Add table to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/Table
 * @ignore
 */
var Table = _commandManager2.default.command('wysiwyg', /** @lends Table */{
  name: 'Table',
  /**
   * Command Handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   * @param {number} col column count
   * @param {number} row row count
   * @param {Array} data initial table data
   */
  exec: function exec(wwe, col, row, data) {
    var sq = wwe.getEditor();
    var tableIDClassName = wwe.componentManager.getManager('table').getTableIDClassName();
    var tableHTMLString = void 0;

    if (!sq.getSelection().collapsed || sq.hasFormat('TABLE') || sq.hasFormat('PRE')) {
      wwe.focus();

      return;
    }

    tableHTMLString = '<table class="' + tableIDClassName + '">';
    tableHTMLString += makeHeader(col, data);
    tableHTMLString += makeBody(col, row - 1, data);
    tableHTMLString += '</table>';

    sq.insertHTML(tableHTMLString);

    wwe.focus();

    if (!data) {
      focusToFirstTh(sq, wwe.get$Body().find('.' + tableIDClassName));
    }
  }
});

/**
 * Focus to first th
 * @param {Squire} sq Squire instance
 * @param {jQuery} $table jQuery wrapped table element
 */
/**
 * @fileoverview Implements table WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
function focusToFirstTh(sq, $table) {
  var range = sq.getSelection();

  range.selectNodeContents($table.find('th')[0]);
  range.collapse(true);
  sq.setSelection(range);
}

/**
 * makeHeader
 * make table header html string
 * @param {number} col column count
 * @param {string} data cell data
 * @returns {string} html string
 */
function makeHeader(col, data) {
  var header = '<thead><tr>';
  var index = 0;

  while (col) {
    header += '<th>';

    if (data) {
      header += data[index];
      index += 1;
    }

    header += '</th>';
    col -= 1;
  }

  header += '</tr></thead>';

  return header;
}

/**
 * makeBody
 * make table body html string
 * @param {number} col column count
 * @param {number} row row count
 * @param {string} data cell data
 * @returns {string} html string
 */
function makeBody(col, row, data) {
  var body = '<tbody>';
  var index = col;

  for (var irow = 0; irow < row; irow += 1) {
    body += '<tr>';

    for (var icol = 0; icol < col; icol += 1) {
      body += '<td>';

      if (data) {
        body += data[index];
        index += 1;
      }

      body += '</td>';
    }

    body += '</tr>';
  }

  body += '</tbody>';

  return body;
}

exports.default = Table;

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * AddRow
 * Add Row to selected table
 * @extends Command
 * @module wysiwygCommands/TableAddRow
 * @ignore
 */
var TableAddRow = _commandManager2.default.command('wysiwyg', /** @lends AddRow */{
  name: 'AddRow',
  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    var range = sq.getSelection().cloneRange();
    var selectedRowLength = getSelectedRowsLength(wwe);
    var $tr = void 0,
        $newRow = void 0;

    wwe.focus();

    if (sq.hasFormat('TD')) {
      sq.saveUndoState(range);
      $tr = (0, _jquery2.default)(range.startContainer).closest('tr');
      for (var i = 0; i < selectedRowLength; i += 1) {
        $newRow = getNewRow($tr);
        $newRow.insertAfter($tr);
      }

      focusToFirstTd(sq, $newRow);
    } else if (sq.hasFormat('TH')) {
      sq.saveUndoState(range);
      $tr = (0, _jquery2.default)(range.startContainer).parents('thead').next('tbody').children('tr').eq(0);
      for (var _i = 0; _i < selectedRowLength; _i += 1) {
        $newRow = getNewRow($tr);
        $newRow.insertBefore($tr);
      }

      focusToFirstTd(sq, $newRow);
    }
  }
});

/**
 * get number of selected rows
 * @param {WysiwygEditor} wwe - wysiwygEditor instance
 * @returns {number} - number of selected rows
 * @ignore
 */
/**
 * @fileoverview Implements table add row WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
function getSelectedRowsLength(wwe) {
  var selectionMgr = wwe.componentManager.getManager('tableSelection');
  var $selectedCells = selectionMgr.getSelectedCells();
  var length = 1;

  if ($selectedCells.length > 1) {
    var first = $selectedCells.first().get(0);
    var last = $selectedCells.last().get(0);
    var range = selectionMgr.getSelectionRangeFromTable(first, last);
    length = range.to.row - range.from.row + 1;
  }

  return length;
}

/**
 * Get new row of given row
 * @param {jQuery} $tr - jQuery wrapped table row
 * @returns {jQuery} - new cloned jquery element
 * @ignore
 */
function getNewRow($tr) {
  var cloned = $tr.clone();
  var htmlString = _tuiCodeSnippet2.default.browser.msie ? '' : '<br />';

  cloned.find('td').html(htmlString);

  return cloned;
}

/**
 * Focus to first table cell
 * @param {Squire} sq - Squire instance
 * @param {jQuery} $tr - jQuery wrapped table row
 * @ignore
 */
function focusToFirstTd(sq, $tr) {
  var range = sq.getSelection();

  range.selectNodeContents($tr.find('td')[0]);
  range.collapse(true);
  sq.setSelection(range);
}

exports.default = TableAddRow;

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _domUtils = __webpack_require__(4);

var _domUtils2 = _interopRequireDefault(_domUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * AddCol
 * Add col to selected table
 * @extends Command
 * @module wysiwygCommands/TableAddCol
 * @ignore
 */
/**
 * @fileoverview Implements table add column WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
var TableAddCol = _commandManager2.default.command('wysiwyg', /** @lends AddCol */{
  name: 'AddCol',
  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    var range = sq.getSelection().cloneRange();
    var numberOfCols = getNumberOfCols(wwe);
    var $cell = void 0;

    wwe.focus();

    if (sq.hasFormat('TR')) {
      sq.saveUndoState(range);

      $cell = getCellByRange(range);
      addColToCellAfter($cell, numberOfCols);

      focusToNextCell(sq, $cell);
    }
  }
});

/**
 * get number of selected cols
 * @param {WysiwygEditor} wwe - wysiwyg editor instance
 * @returns {number} - number of selected cols
 * @ignore
 */
function getNumberOfCols(wwe) {
  var selectionMgr = wwe.componentManager.getManager('tableSelection');
  var $selectedCells = selectionMgr.getSelectedCells();
  var length = 1;

  if ($selectedCells.length > 0) {
    var maxLength = $selectedCells.get(0).parentNode.querySelectorAll('td, th').length;
    length = Math.min(maxLength, $selectedCells.length);
  }

  return length;
}

/**
 * Get cell by range object
 * @param {Range} range - range
 * @returns {jQuery} - jQuery html element
 * @ignore
 */
function getCellByRange(range) {
  var cell = range.startContainer;

  if (_domUtils2.default.getNodeName(cell) === 'TD' || _domUtils2.default.getNodeName(cell) === 'TH') {
    cell = (0, _jquery2.default)(cell);
  } else {
    cell = (0, _jquery2.default)(cell).parentsUntil('tr');
  }

  return cell;
}

/**
 * Add column to after the current cell
 * @param {jQuery} $cell - jQuery wrapped table cell
 * @param {number} [numberOfCols=1] - number of cols
 * @ignore
 */
function addColToCellAfter($cell) {
  var numberOfCols = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  var index = $cell.index();
  var cellToAdd = void 0;

  $cell.parents('table').find('tr').each(function (n, tr) {
    var isTBody = _domUtils2.default.getNodeName(tr.parentNode) === 'TBODY';
    var isMSIE = _tuiCodeSnippet2.default.browser.msie;
    var cell = tr.children[index];
    for (var i = 0; i < numberOfCols; i += 1) {
      if (isTBody) {
        cellToAdd = document.createElement('td');
      } else {
        cellToAdd = document.createElement('th');
      }
      if (!isMSIE) {
        cellToAdd.appendChild(document.createElement('br'));
      }
      (0, _jquery2.default)(cellToAdd).insertAfter(cell);
    }
  });
}

/**
 * Focus to next cell
 * @param {Squire} sq - Squire instance
 * @param {jQuery} $cell - jQuery wrapped table cell
 * @ignore
 */
function focusToNextCell(sq, $cell) {
  var range = sq.getSelection();

  range.selectNodeContents($cell.next()[0]);
  range.collapse(true);

  sq.setSelection(range);
}

exports.default = TableAddCol;

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * RemoveRow
 * remove Row to selected table
 * @extends Command
 * @module wysiwygCommands/TableRemoveRow
 * @ignore
 */
/**
 * @fileoverview Implements table remove row WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
var TableRemoveRow = _commandManager2.default.command('wysiwyg', /** @lends RemoveRow */{
  name: 'RemoveRow',
  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    var range = sq.getSelection().cloneRange();
    var $table = (0, _jquery2.default)(range.startContainer).parents('table');
    var selectionMgr = wwe.componentManager.getManager('tableSelection');
    var tableMgr = wwe.componentManager.getManager('table');
    var $tr = getTrs(range, selectionMgr, $table);
    var tbodyRowLength = $table.find('tbody tr').length;

    wwe.focus();

    if ((sq.hasFormat('TD') || sq.hasFormat('TABLE')) && tbodyRowLength > 1) {
      sq.saveUndoState(range);
      var $nextFocus = $tr.last().next()[0] ? $tr.last().next() : $tr.first().prev();

      if ($nextFocus.length) {
        focusToFirstTd(sq, range, $nextFocus, tableMgr);
      }
      $tr.remove();
    }
    selectionMgr.removeClassAttrbuteFromAllCellsIfNeed();
  }
});

/**
 * Focus to first TD in given TR
 * @param {SquireExt} sq Squire instance
 * @param {Range} range Range object
 * @param {jQuery} $tr jQuery wrapped TR
 * @param {object} tableMgr Table manager
 */
function focusToFirstTd(sq, range, $tr, tableMgr) {
  var nextFocusCell = $tr.find('td').get(0);
  range.setStart(nextFocusCell, 0);
  range.collapse(true);

  tableMgr.setLastCellNode(nextFocusCell);
  sq.setSelection(range);
}

/**
 * Get start, end row index from current range
 * @param {HTMLElement} firstSelectedCell Range object
 * @param {object} rangeInformation Range information object
 * @param {jQuery} $table jquery wrapped TABLE
 * @returns {jQuery}
 */
function getSelectedRows(firstSelectedCell, rangeInformation, $table) {
  var tbodyRowLength = $table.find('tbody tr').length;
  var isStartContainerInThead = (0, _jquery2.default)(firstSelectedCell).parents('thead').length;
  var startRowIndex = rangeInformation.from.row;
  var endRowIndex = rangeInformation.to.row;

  if (isStartContainerInThead) {
    startRowIndex += 1;
  }

  var isWholeTbodySelected = (startRowIndex === 1 || isStartContainerInThead) && endRowIndex === tbodyRowLength;

  if (isWholeTbodySelected) {
    endRowIndex -= 1;
  }

  return $table.find('tr').slice(startRowIndex, endRowIndex + 1);
}

/**
 * Get TRs
 * @param {Range} range Range object
 * @param {object} selectionMgr Table selection manager
 * @param {jQuery} $table current table
 * @returns {jQuery}
 */
function getTrs(range, selectionMgr, $table) {
  var $selectedCells = selectionMgr.getSelectedCells();
  var rangeInformation = void 0,
      trs = void 0;

  if ($selectedCells.length) {
    rangeInformation = selectionMgr.getSelectionRangeFromTable($selectedCells.first().get(0), $selectedCells.last().get(0));
    trs = getSelectedRows($selectedCells.first()[0], rangeInformation, $table);
  } else {
    var cell = (0, _jquery2.default)(range.startContainer).closest('td,th').get(0);
    rangeInformation = selectionMgr.getSelectionRangeFromTable(cell, cell);
    trs = getSelectedRows(cell, rangeInformation, $table);
  }

  return trs;
}
exports.default = TableRemoveRow;

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _domUtils = __webpack_require__(4);

var _domUtils2 = _interopRequireDefault(_domUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * RemoveCol
 * remove Row to selected table
 * @extends Command
 * @module wysiwygCommands/TableRemoveCol
 * @ignore
 */
var TableRemoveCol = _commandManager2.default.command('wysiwyg', /** @lends RemoveCol */{
  name: 'RemoveCol',
  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    var range = sq.getSelection().cloneRange();
    var $table = (0, _jquery2.default)(range.startContainer).parents('table');
    var tableMgr = wwe.componentManager.getManager('table');
    var selectionMgr = wwe.componentManager.getManager('tableSelection');
    var hasMultipleCols = (0, _jquery2.default)(range.startContainer).closest('table').find('thead tr th').length > 1;

    wwe.focus();
    // IE 800a025e error on removing part of selection range. collapse
    range.collapse(true);
    sq.setSelection(range);

    if (sq.hasFormat('TR', null, range) && hasMultipleCols) {
      var tbodyColLength = $table.find('tbody tr:first td').length;
      var $selectedCellsByManager = selectionMgr.getSelectedCells();

      if ($selectedCellsByManager.length < tbodyColLength) {
        sq.saveUndoState(range);
        var $nextFocus = void 0;

        if ($selectedCellsByManager.length > 1) {
          var $tailCell = $selectedCellsByManager.last();
          var $headCell = $selectedCellsByManager.first();
          $nextFocus = $tailCell.next().length ? $tailCell.next() : $headCell.prev();

          removeMultipleColsByCells($selectedCellsByManager);
        } else {
          var $cell = getCellByRange(range);
          $nextFocus = $cell.next().length ? $cell.next() : $cell.prev();

          removeColByCell($cell);
        }

        focusToCell(sq, $nextFocus, tableMgr);
      }
    }
  }
});

/**
 * Get cell by range object
 * @param {Range} range range
 * @returns {HTMLElement|Node}
 */
/**
 * @fileoverview Implements table remove column WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
function getCellByRange(range) {
  var cell = range.startContainer;

  if (_domUtils2.default.getNodeName(cell) === 'TD' || _domUtils2.default.getNodeName(cell) === 'TH') {
    cell = (0, _jquery2.default)(cell);
  } else {
    cell = (0, _jquery2.default)(cell).parentsUntil('tr');
  }

  return cell;
}

/**
 * Remove columns by given cells
 * @param {jQuery} $cells - jQuery table cells
 */
function removeMultipleColsByCells($cells) {
  var numberOfCells = $cells.length;
  for (var i = 0; i < numberOfCells; i += 1) {
    var $cellToDelete = $cells.eq(i);
    if ($cellToDelete.length > 0) {
      removeColByCell($cells.eq(i));
    }
  }
}

/**
 * Remove column by given cell
 * @param {jQuery} $cell - jQuery wrapped table cell
 */
function removeColByCell($cell) {
  var index = $cell.index();

  $cell.parents('table').find('tr').each(function (n, tr) {
    (0, _jquery2.default)(tr).children().eq(index).remove();
  });
}

/**
 * Focus to given cell
 * @param {Squire} sq - Squire instance
 * @param {jQuery} $cell - jQuery wrapped table cell
 * @param {object} tableMgr - Table manager instance
 */
function focusToCell(sq, $cell, tableMgr) {
  var nextFocusCell = $cell.get(0);

  if ($cell.length && _jquery2.default.contains(document, $cell)) {
    var range = sq.getSelection();
    range.selectNodeContents($cell[0]);
    range.collapse(true);
    sq.setSelection(range);

    tableMgr.setLastCellNode(nextFocusCell);
  }
}

exports.default = TableRemoveCol;

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _domUtils = __webpack_require__(4);

var _domUtils2 = _interopRequireDefault(_domUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * AlignCol
 * Align selected column's text content to given direction
 * @extends Command
 * @module wysiwygCommands/TableAlignCol
 * @ignore
 */
var TableAlignCol = _commandManager2.default.command('wysiwyg', /** @lends AlignCol */{
  name: 'AlignCol',
  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   * @param {string} alignDirection Align direction
   */
  exec: function exec(wwe, alignDirection) {
    var sq = wwe.getEditor();
    var range = sq.getSelection().cloneRange();
    var selectionMgr = wwe.componentManager.getManager('tableSelection');
    var rangeInformation = getRangeInformation(range, selectionMgr);

    wwe.focus();

    if (sq.hasFormat('TR')) {
      sq.saveUndoState(range);

      var $table = (0, _jquery2.default)(range.startContainer).parents('table');

      var selectionInformation = getSelectionInformation($table, rangeInformation);

      setAlignAttributeToTableCells($table, alignDirection, selectionInformation);
    }
    selectionMgr.removeClassAttrbuteFromAllCellsIfNeed();
  }
});

/**
 * Set Column align
 * @param {jQuery} $table jQuery wrapped TABLE
 * @param {string} alignDirection 'left' or 'center' or 'right'
 * @param {{
 *     startColumnIndex: number,
 *     endColumnIndex: number,
 *     isDivided: boolean
 *     }} selectionInformation start, end column index and boolean value for whether range divided or not
 */
/**
 * @fileoverview Implements table align column WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
function setAlignAttributeToTableCells($table, alignDirection, selectionInformation) {
  var isDivided = selectionInformation.isDivided || false;
  var start = selectionInformation.startColumnIndex;
  var end = selectionInformation.endColumnIndex;
  var columnLength = $table.find('tr').eq(0).find('td,th').length;

  $table.find('tr').each(function (n, tr) {
    (0, _jquery2.default)(tr).children('td,th').each(function (index, cell) {
      if (isDivided && (start <= index && index <= columnLength || index <= end)) {
        (0, _jquery2.default)(cell).attr('align', alignDirection);
      } else if (start <= index && index <= end) {
        (0, _jquery2.default)(cell).attr('align', alignDirection);
      }
    });
  });
}

/**
 * Return start, end column index and boolean value for whether range divided or not
 * @param {jQuery} $table jQuery wrapped TABLE
 * @param {{startColumnIndex: number, endColumnIndex: number}} rangeInformation Range information
 * @returns {{startColumnIndex: number, endColumnIndex: number, isDivided: boolean}}
 */
function getSelectionInformation($table, rangeInformation) {
  var columnLength = $table.find('tr').eq(0).find('td,th').length;
  var from = rangeInformation.from,
      to = rangeInformation.to;

  var startColumnIndex = void 0,
      endColumnIndex = void 0,
      isDivided = void 0;

  if (from.row === to.row) {
    startColumnIndex = from.cell;
    endColumnIndex = to.cell;
  } else if (from.row < to.row) {
    if (from.cell <= to.cell) {
      startColumnIndex = 0;
      endColumnIndex = columnLength - 1;
    } else {
      startColumnIndex = from.cell;
      endColumnIndex = to.cell;
      isDivided = true;
    }
  }

  return {
    startColumnIndex: startColumnIndex,
    endColumnIndex: endColumnIndex,
    isDivided: isDivided
  };
}

/**
 * Get range information
 * @param {Range} range Range object
 * @param {object} selectionMgr Table selection manager
 * @returns {object}
 */
function getRangeInformation(range, selectionMgr) {
  var $selectedCells = selectionMgr.getSelectedCells();
  var rangeInformation = void 0,
      startCell = void 0;

  if ($selectedCells.length) {
    rangeInformation = selectionMgr.getSelectionRangeFromTable($selectedCells.first().get(0), $selectedCells.last().get(0));
  } else {
    var startContainer = range.startContainer;

    startCell = _domUtils2.default.isTextNode(startContainer) ? (0, _jquery2.default)(startContainer).parent('td,th')[0] : startContainer;
    rangeInformation = selectionMgr.getSelectionRangeFromTable(startCell, startCell);
  }

  return rangeInformation;
}

exports.default = TableAlignCol;

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * RemoveTable
 * Remove selected table
 * @extends Command
 * @module wysiwygCommands/TableRemove
 * @ignore
 */
/**
 * @fileoverview Implements table remove WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
var TableRemove = _commandManager2.default.command('wysiwyg', /** @lends RemoveTable */{
  name: 'RemoveTable',
  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    var range = sq.getSelection().cloneRange();

    if (sq.hasFormat('TABLE')) {
      sq.saveUndoState(range);
      var $table = (0, _jquery2.default)(range.startContainer).closest('table');

      $table.remove();
    }

    wwe.focus();
  }
});

exports.default = TableRemove;

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Indent
 * Indent list or task to wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/indent
 * @ignore
 */
/**
 * @fileoverview Implements Indent wysiwyg command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
var Indent = _commandManager2.default.command('wysiwyg', /** @lends Indent */{
  name: 'Indent',
  /**
   * Command Handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec: function exec(wwe) {
    var listManager = wwe.componentManager.getManager('list');
    var range = wwe.getEditor().getSelection();
    var $node = (0, _jquery2.default)(range.startContainer).closest('li');
    var prevClasses = void 0,
        nodeClasses = void 0,
        nextClasses = void 0;

    var $prev = $node.prev();

    if ($prev.length && $node.length) {
      var $next = $node.find('li').eq(0);

      wwe.getEditor().saveUndoState();

      nodeClasses = $node.attr('class');
      prevClasses = $prev.attr('class');
      nextClasses = $next.attr('class');

      $node.removeAttr('class');
      $prev.removeAttr('class');

      if ($next.length && !$next.children('div').length) {
        $next.removeAttr('class');
      }

      wwe.getEditor().increaseListLevel();
      listManager.mergeList($node.get(0));

      $node.attr('class', nodeClasses);
      $prev.attr('class', prevClasses);
      $next.attr('class', nextClasses);
    }
  }
});

exports.default = Indent;

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Outdent
 * Outdent list or task to wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/Outdent
 * @ignore
 */
/**
 * @fileoverview Implements Outdent wysiwyg command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
var Outdent = _commandManager2.default.command('wysiwyg', /** @lends Outdent */{
  name: 'Outdent',

  /**
   * Command Handler
   * @param {WysiwygEditor} wwe WysiwygEditor instance
   */
  exec: function exec(wwe) {
    var $node = getCurrent$Li(wwe);

    if ($node.length && isExecutable($node)) {
      wwe.getEditor().saveUndoState();

      var nodeClasses = $node.attr('class');
      wwe.getEditor().decreaseListLevel();

      $node = getCurrent$Li(wwe);
      $node.attr('class', nodeClasses);
    }
  }
});

/**
 * test if outdent the given list item
 * arbitrary list allows list item to be in any position
 * while markdown spec does not
 * @param {jQuery} $currentLiNode - jQuery list item element
 * @returns {boolean} - true to executable
 * @ignore
 */
function isExecutable($currentLiNode) {
  return !$currentLiNode.next().is('OL,UL');
}

/**
 * Get list item element of current selection
 * @param {object} wwe Wysiwyg editor instance
 * @returns {jQuery}
 * @ignore
 */
function getCurrent$Li(wwe) {
  var range = wwe.getEditor().getSelection();

  return (0, _jquery2.default)(range.startContainer).closest('li');
}

exports.default = Outdent;

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Task
 * Add Task to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/Task
 * @ignore
 */
/**
 * @fileoverview Implements Task WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
var Task = _commandManager2.default.command('wysiwyg', /** @lends Task */{
  name: 'Task',
  keyMap: ['ALT+T', 'ALT+T'],
  /**
   * Command Handler
   * @param {WysiwygEditor} wwe WYSIWYGEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    var range = sq.getSelection();
    var listManager = wwe.componentManager.getManager('list');
    var startContainer = range.startContainer,
        endContainer = range.endContainer,
        startOffset = range.startOffset,
        endOffset = range.endOffset;

    var newLIs = [];

    wwe.focus();

    sq.saveUndoState(range);

    if (listManager.isAvailableMakeListInTable()) {
      newLIs = listManager.createListInTable(range, 'TASK');
    } else {
      var lines = listManager.getLinesOfSelection(startContainer, endContainer);

      for (var i = 0; i < lines.length; i += 1) {
        var newLI = this._changeFormatToTaskIfNeed(wwe, lines[i]);
        if (newLI) {
          newLIs.push(newLI);
        }
      }
    }

    if (newLIs.length) {
      listManager.adjustRange(startContainer, endContainer, startOffset, endOffset, newLIs);
    }
  },


  /**
   * Change format to unordered list and return current li element if need
   * @param {WysiwygEditor} wwe Wysiwyg editor instance
   * @param {HTMLElement} target Element target for change
   * @returns {HTMLElement} newly created list
   * @private
   */
  _changeFormatToTaskIfNeed: function _changeFormatToTaskIfNeed(wwe, target) {
    var sq = wwe.getEditor();
    var range = sq.getSelection();
    var taskManager = wwe.componentManager.getManager('task');
    var newLI = void 0;

    if (!sq.hasFormat('PRE')) {
      range.setStart(target, 0);
      range.collapse(true);
      sq.setSelection(range);

      if (!sq.hasFormat('li')) {
        sq.makeUnorderedList();
        target = sq.getSelection().startContainer;
      }

      if ((0, _jquery2.default)(target).hasClass('task-list-item')) {
        taskManager.unformatTask(target);
      } else {
        taskManager.formatTask(target);
      }

      newLI = sq.getSelection().startContainer;
    }

    return newLI;
  }
});

exports.default = Task;

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _domUtils = __webpack_require__(4);

var _domUtils2 = _interopRequireDefault(_domUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Code
 * Add bold to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/Code
 * @ignore
 */
/**
 * @fileoverview Implements code WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
var Code = _commandManager2.default.command('wysiwyg', /** @lends Code */{
  name: 'Code',
  keyMap: ['SHIFT+CTRL+C', 'SHIFT+META+C'],
  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    var tableSelectionManager = wwe.componentManager.getManager('tableSelection');
    var _styleCode = _tuiCodeSnippet2.default.bind(styleCode, null, wwe.getEditor());

    wwe.focus();

    if (sq.hasFormat('table') && tableSelectionManager.getSelectedCells().length) {
      tableSelectionManager.styleToSelectedCells(_styleCode);

      var range = sq.getSelection();
      range.collapse(true);
      sq.setSelection(range);
    } else {
      _styleCode(sq);
    }
  }
});

/**
 * removeUnnecessaryCodeInNextToRange
 * Remove unnecessary code tag next to range, code tag made by squire
 * @param {Range} range range object
 */
function removeUnnecessaryCodeInNextToRange(range) {
  if (_domUtils2.default.getNodeName(range.startContainer.nextSibling) === 'CODE' && _domUtils2.default.getTextLength(range.startContainer.nextSibling) === 0) {
    (0, _jquery2.default)(range.startContainer.nextSibling).remove();
  }
}

/**
 * Style code.
 * @param {object} editor - editor instance
 * @param {object} sq - squire editor instance
 */
function styleCode(editor, sq) {
  if (!sq.hasFormat('PRE') && sq.hasFormat('code')) {
    sq.changeFormat(null, { tag: 'code' });
    removeUnnecessaryCodeInNextToRange(editor.getSelection().cloneRange());
  } else if (!sq.hasFormat('a') && !sq.hasFormat('PRE')) {
    if (sq.hasFormat('b')) {
      sq.removeBold();
    } else if (sq.hasFormat('i')) {
      sq.removeItalic();
    }

    sq.changeFormat({ tag: 'code' });

    var range = sq.getSelection().cloneRange();
    range.setStart(range.endContainer, range.endOffset);
    range.collapse(true);

    sq.setSelection(range);
  }
}

exports.default = Code;

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CODEBLOCK_CLASS_TEMP = 'te-content-codeblock-temp'; /**
                                                         * @fileoverview Implements code block WysiwygCommand
                                                         * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                         */

var CODEBLOCK_ATTR_NAME = 'data-te-codeblock';

/**
 * CodeBlock
 * Add CodeBlock to wysiwygEditor
 * @extends Command
 * @module wysiwygCommands/Codeblock
 * @ignore
 */
var CodeBlock = _commandManager2.default.command('wysiwyg', /** @lends CodeBlock */{
  name: 'CodeBlock',
  keyMap: ['SHIFT+CTRL+P', 'SHIFT+META+P'],
  /**
   * Command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   * @param {string} type of language
   */
  exec: function exec(wwe, type) {
    var sq = wwe.getEditor();
    var range = sq.getSelection().cloneRange();
    if (!sq.hasFormat('PRE') && !sq.hasFormat('TABLE')) {
      var attr = CODEBLOCK_ATTR_NAME + ' class = "' + CODEBLOCK_CLASS_TEMP + '"';

      if (type) {
        attr += ' data-language="' + type + '"';
      }

      var codeBlockBody = getCodeBlockBody(range, wwe);
      sq.insertHTML('<pre ' + attr + '>' + codeBlockBody + '</pre>');

      focusToFirstCode(wwe.get$Body().find('.' + CODEBLOCK_CLASS_TEMP), wwe);
    }

    wwe.focus();
  }
});

/**
 * focusToFirstCode
 * Focus to first code tag content of pre tag
 * @param {jQuery} $pre pre tag
 * @param {WysiwygEditor} wwe wysiwygEditor
 */
function focusToFirstCode($pre, wwe) {
  var range = wwe.getEditor().getSelection().cloneRange();
  $pre.removeClass(CODEBLOCK_CLASS_TEMP);

  range.setStartBefore($pre.get(0).firstChild);
  range.collapse(true);

  wwe.getEditor().setSelection(range);
}
/**
 * getCodeBlockBody
 * get text wrapped by code
 * @param {object} range range object
 * @param {object} wwe wysiwyg editor
 * @returns {string}
 */
function getCodeBlockBody(range, wwe) {
  var mgr = wwe.componentManager.getManager('codeblock');
  var codeBlock = void 0;
  if (range.collapsed) {
    codeBlock = '<br>';
  } else {
    var contents = range.extractContents();
    var nodes = _tuiCodeSnippet2.default.toArray(contents.childNodes);
    var tempDiv = (0, _jquery2.default)('<div>').append(mgr.prepareToPasteOnCodeblock(nodes));
    codeBlock = tempDiv.html();
  }

  return codeBlock;
}

exports.default = CodeBlock;

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_i18n2.default.setLanguage(['en', 'en_US'], {
  'Markdown': 'Markdown',
  'WYSIWYG': 'WYSIWYG',
  'Write': 'Write',
  'Preview': 'Preview',
  'Headings': 'Headings',
  'Paragraph': 'Paragraph',
  'Bold': 'Bold',
  'Italic': 'Italic',
  'Strike': 'Strike',
  'Code': 'Inline code',
  'Line': 'Line',
  'Blockquote': 'Blockquote',
  'Unordered list': 'Unordered list',
  'Ordered list': 'Ordered list',
  'Task': 'Task',
  'Indent': 'Indent',
  'Outdent': 'Outdent',
  'Insert link': 'Insert link',
  'Insert CodeBlock': 'Insert codeBlock',
  'Insert table': 'Insert table',
  'Insert image': 'Insert image',
  'Heading': 'Heading',
  'Image URL': 'Image URL',
  'Select image file': 'Select image file',
  'Description': 'Description',
  'OK': 'OK',
  'More': 'More',
  'Cancel': 'Cancel',
  'File': 'File',
  'URL': 'URL',
  'Link text': 'Link text',
  'Add row': 'Add row',
  'Add col': 'Add col',
  'Remove row': 'Remove row',
  'Remove col': 'Remove col',
  'Align left': 'Align left',
  'Align center': 'Align center',
  'Align right': 'Align right',
  'Remove table': 'Remove table',
  'Would you like to paste as table?': 'Would you like to paste as table?',
  'Text color': 'Text color',
  'Auto scroll enabled': 'Auto scroll enabled',
  'Auto scroll disabled': 'Auto scroll disabled',
  'Choose language': 'Choose language'
}); /**
    * @fileoverview I18N for English
    * @author NHN FE Development Lab <dl_javascript@nhn.com>
    */

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_i18n2.default.setLanguage(['ko', 'ko_KR'], {
  'Markdown': '마크다운',
  'WYSIWYG': '위지윅',
  'Write': '편집하기',
  'Preview': '미리보기',
  'Headings': '제목크기',
  'Paragraph': '본문',
  'Bold': '굵게',
  'Italic': '기울임꼴',
  'Strike': '취소선',
  'Code': '인라인 코드',
  'Line': '문단나눔',
  'Blockquote': '인용구',
  'Unordered list': '글머리 기호',
  'Ordered list': '번호 매기기',
  'Task': '체크박스',
  'Indent': '들여쓰기',
  'Outdent': '내어쓰기',
  'Insert link': '링크 삽입',
  'Insert CodeBlock': '코드블럭 삽입',
  'Insert table': '표 삽입',
  'Insert image': '이미지 삽입',
  'Heading': '제목',
  'Image URL': '이미지 주소',
  'Select image file': '이미지 파일을 선택하세요.',
  'Description': '설명',
  'OK': '확인',
  'More': '더 보기',
  'Cancel': '취소',
  'File': '파일',
  'URL': '주소',
  'Link text': '링크 텍스트',
  'Add row': '행 추가',
  'Add col': '열 추가',
  'Remove row': '행 삭제',
  'Remove col': '열 삭제',
  'Align left': '왼쪽 정렬',
  'Align center': '가운데 정렬',
  'Align right': '오른쪽 정렬',
  'Remove table': '표 삭제',
  'Would you like to paste as table?': '표형태로 붙여 넣겠습니까?',
  'Text color': '글자 색상',
  'Auto scroll enabled': '자동 스크롤 켜짐',
  'Auto scroll disabled': '자동 스크롤 꺼짐',
  'Choose language': '언어 선택'
}); /**
    * @fileoverview I18N for Korean
    * @author NHN FE Development Lab <dl_javascript@nhn.com>
    */

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_i18n2.default.setLanguage(['zh', 'zh_CN'], {
  'Markdown': 'Markdown',
  'WYSIWYG': '所见即所得',
  'Write': '编辑',
  'Preview': '预览',
  'Headings': '标题',
  'Paragraph': '文本',
  'Bold': '加粗',
  'Italic': '斜体字',
  'Strike': '删除线',
  'Code': '内嵌代码',
  'Line': '水平线',
  'Blockquote': '引用块',
  'Unordered list': '无序列表',
  'Ordered list': '有序列表',
  'Task': '任务',
  'Indent': '缩进',
  'Outdent': '减少缩进',
  'Insert link': '插入链接',
  'Insert CodeBlock': '插入代码块',
  'Insert table': '插入表格',
  'Insert image': '插入图片',
  'Heading': '标题',
  'Image URL': '图片网址',
  'Select image file': '选择图片文件',
  'Description': '说明',
  'OK': '确认',
  'More': '更多',
  'Cancel': '取消',
  'File': '文件',
  'URL': 'URL',
  'Link text': '链接文本',
  'Add row': '添加行',
  'Add col': '添加列',
  'Remove row': '删除行',
  'Remove col': '删除列',
  'Align left': '左对齐',
  'Align center': '居中对齐',
  'Align right': '右对齐',
  'Remove table': '删除表格',
  'Would you like to paste as table?': '需要粘贴为表格吗?',
  'Text color': '文字颜色',
  'Auto scroll enabled': '自动滚动已启用',
  'Auto scroll disabled': '自动滚动已禁用',
  'Choose language': '选择语言'
}); /**
    * @fileoverview I18N for Chinese
    * @author NHN FE Development Lab <dl_javascript@nhn.com>
    */

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_i18n2.default.setLanguage(['ja', 'ja_JP'], {
  'Markdown': 'マークダウン',
  'WYSIWYG': 'WYSIWYG',
  'Write': '編集する',
  'Preview': 'プレビュー',
  'Headings': '見出し',
  'Paragraph': '本文',
  'Bold': '太字',
  'Italic': 'イタリック',
  'Strike': 'ストライク',
  'Code': 'インラインコード',
  'Line': 'ライン',
  'Blockquote': '引用',
  'Unordered list': '番号なしリスト',
  'Ordered list': '順序付きリスト',
  'Task': 'タスク',
  'Indent': 'インデント',
  'Outdent': 'アウトデント',
  'Insert link': 'リンク挿入',
  'Insert CodeBlock': 'コードブロック挿入',
  'Insert table': 'テーブル挿入',
  'Insert image': '画像挿入',
  'Heading': '見出し',
  'Image URL': 'イメージURL',
  'Select image file': '画像ファイル選択',
  'Description': 'ディスクリプション ',
  'OK': 'はい',
  'More': 'もっと',
  'Cancel': 'キャンセル',
  'File': 'ファイル',
  'URL': 'URL',
  'Link text': 'リンクテキスト',
  'Add row': '行追加',
  'Add col': '列追加',
  'Remove row': '行削除',
  'Remove col': '列削除',
  'Align left': '左揃え',
  'Align center': '中央揃え',
  'Align right': '右揃え',
  'Remove table': 'テーブル削除',
  'Would you like to paste as table?': 'テーブルを貼り付けますか?',
  'Text color': '文字色相',
  'Auto scroll enabled': '自動スクロールが有効',
  'Auto scroll disabled': '自動スクロールを無効に',
  'Choose language': '言語選択'
}); /**
    * @fileoverview I18N for Japanese
    * @author NHN FE Development Lab <dl_javascript@nhn.com>
    */

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_i18n2.default.setLanguage(['nl', 'nl_NL'], {
  'Markdown': 'Markdown',
  'WYSIWYG': 'WYSIWYG',
  'Write': 'Opslaan',
  'Preview': 'Voorbeeld',
  'Headings': 'Koppen',
  'Paragraph': 'Alinea',
  'Bold': 'Vet',
  'Italic': 'Cursief',
  'Strike': 'Doorhalen',
  'Code': 'Inline code',
  'Line': 'Regel',
  'Blockquote': 'Citaatblok',
  'Unordered list': 'Opsomming',
  'Ordered list': 'Genummerde opsomming',
  'Task': 'Taak',
  'Indent': 'Niveau verhogen',
  'Outdent': 'Niveau verlagen',
  'Insert link': 'Link invoegen',
  'Insert CodeBlock': 'Codeblok toevoegen',
  'Insert table': 'Tabel invoegen',
  'Insert image': 'Afbeelding invoegen',
  'Heading': 'Kop',
  'Image URL': 'Afbeelding URL',
  'Select image file': 'Selecteer een afbeelding',
  'Description': 'Omschrijving',
  'OK': 'OK',
  'More': 'Meer',
  'Cancel': 'Annuleren',
  'File': 'Bestand',
  'URL': 'URL',
  'Link text': 'Link tekst',
  'Add row': 'Rij toevoegen',
  'Add col': 'Kolom toevoegen',
  'Remove row': 'Rij verwijderen',
  'Remove col': 'Kolom verwijderen',
  'Align left': 'Links uitlijnen',
  'Align center': 'Centreren',
  'Align right': 'Rechts uitlijnen',
  'Remove table': 'Verwijder tabel',
  'Would you like to paste as table?': 'Wil je dit als tabel plakken?',
  'Text color': 'Tekstkleur',
  'Auto scroll enabled': 'Autoscroll ingeschakeld',
  'Auto scroll disabled': 'Autoscroll uitgeschakeld',
  'Choose language': 'Kies een taal'
}); /**
    * @fileoverview I18N for Dutch
    * @author NHN FE Development Lab <dl_javascript@nhn.com>
    */

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_i18n2.default.setLanguage(['es', 'es_ES'], {
  'Markdown': 'Markdown',
  'WYSIWYG': 'WYSIWYG',
  'Write': 'Escribir',
  'Preview': 'Vista previa',
  'Headings': 'Encabezados',
  'Paragraph': 'Párrafo',
  'Bold': 'Negrita',
  'Italic': 'Itálica',
  'Strike': 'Tachado',
  'Code': 'Código',
  'Line': 'Línea',
  'Blockquote': 'Cita',
  'Unordered list': 'Lista desordenada',
  'Ordered list': 'Lista ordenada',
  'Task': 'Tarea',
  'Indent': 'Sangría',
  'Outdent': 'Saliendo',
  'Insert link': 'Insertar enlace',
  'Insert CodeBlock': 'Insertar bloque de código',
  'Insert table': 'Insertar tabla',
  'Insert image': 'Insertar imagen',
  'Heading': 'Encabezado',
  'Image URL': 'URL de la imagen',
  'Select image file': 'Seleccionar archivo de imagen',
  'Description': 'Descripción',
  'OK': 'Aceptar',
  'More': 'Más',
  'Cancel': 'Cancelar',
  'File': 'Archivo',
  'URL': 'URL',
  'Link text': 'Texto del enlace',
  'Add row': 'Agregar fila',
  'Add col': 'Agregar columna',
  'Remove row': 'Eliminar fila',
  'Remove col': 'Eliminar columna',
  'Align left': 'Alinear a la izquierda',
  'Align center': 'Centrar',
  'Align right': 'Alinear a la derecha',
  'Remove table': 'Eliminar tabla',
  'Would you like to paste as table?': '¿Desea pegar como tabla?',
  'Text color': 'Color del texto',
  'Auto scroll enabled': 'Desplazamiento automático habilitado',
  'Auto scroll disabled': 'Desplazamiento automático deshabilitado',
  'Choose language': 'Elegir idioma'
}); /**
    * @fileoverview I18N for Spanish
    * @author Enrico Lamperti <oss@elamperti.com>
    */

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_i18n2.default.setLanguage(['de', 'de_DE'], {
  'Markdown': 'Markdown',
  'WYSIWYG': 'WYSIWYG',
  'Write': 'Verfassen',
  'Preview': 'Vorschau',
  'Headings': 'Überschriften',
  'Paragraph': 'Text',
  'Bold': 'Fett',
  'Italic': 'Kursiv',
  'Strike': 'Durchgestrichen',
  'Code': 'Code',
  'Line': 'Trennlinie',
  'Blockquote': 'Blocktext',
  'Unordered list': 'Aufzählung',
  'Ordered list': 'Nummerierte Aufzählung',
  'Task': 'Aufgabe',
  'Indent': 'Einrücken',
  'Outdent': 'Ausrücken',
  'Insert link': 'Link einfügen',
  'Insert CodeBlock': 'Codeblock einfügen',
  'Insert table': 'Tabelle einfügen',
  'Insert image': 'Grafik einfügen',
  'Heading': 'Titel',
  'Image URL': 'Bild URL',
  'Select image file': 'Grafik auswählen',
  'Description': 'Beschreibung',
  'OK': 'OK',
  'More': 'Mehr',
  'Cancel': 'Abbrechen',
  'File': 'Datei',
  'URL': 'URL',
  'Link text': 'Anzuzeigender Text',
  'Add row': 'Zeile hinzufügen',
  'Add col': 'Spalte hinzufügen',
  'Remove row': 'Zeile entfernen',
  'Remove col': 'Spalte entfernen',
  'Align left': 'Links ausrichten',
  'Align center': 'Zentrieren',
  'Align right': 'Rechts ausrichten',
  'Remove table': 'Tabelle entfernen',
  'Would you like to paste as table?': 'Möchten Sie eine Tabelle einfügen?',
  'Text color': 'Textfarbe',
  'Auto scroll enabled': 'Autoscrollen aktiviert',
  'Auto scroll disabled': 'Autoscrollen deaktiviert',
  'Choose language': 'Sprache auswählen'
}); /**
    * @fileoverview I18N for German
    * @author Jann-Niklas Kiepert <jannkiepert@vivaldi.net>
    */

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_i18n2.default.setLanguage(['ru', 'ru_RU'], {
  'Markdown': 'Markdown',
  'WYSIWYG': 'WYSIWYG',
  'Write': 'Написать',
  'Preview': 'Предварительный просмотр',
  'Headings': 'Заголовки',
  'Paragraph': 'Абзац',
  'Bold': 'Жирный',
  'Italic': 'Курсив',
  'Strike': 'Зачеркнутый',
  'Code': 'Встроенный код',
  'Line': 'Строка',
  'Blockquote': 'Блок цитирования',
  'Unordered list': 'Неупорядоченный список',
  'Ordered list': 'Упорядоченный список',
  'Task': 'Задача',
  'Indent': 'отступ',
  'Outdent': 'Выступ',
  'Insert link': 'Вставить ссылку',
  'Insert CodeBlock': 'Вставить код',
  'Insert table': 'Вставить таблицу',
  'Insert image': 'Вставить изображение',
  'Heading': 'Заголовок',
  'Image URL': 'URL изображения',
  'Select image file': 'Выбрать файл изображения',
  'Description': 'Описание',
  'OK': 'Хорошо',
  'More': 'еще',
  'Cancel': 'Отмена',
  'File': 'Файл',
  'URL': 'URL',
  'Link text': 'Текст ссылки',
  'Add row': 'Добавить ряд',
  'Add col': 'Добавить столбец',
  'Remove row': 'Удалить ряд',
  'Remove col': 'Удалить столбец',
  'Align left': 'Выровнять по левому краю',
  'Align center': 'Выровнять по центру',
  'Align right': 'Выровнять по правому краю',
  'Remove table': 'Удалить таблицу',
  'Would you like to paste as table?': 'Вы хотите вставить в виде таблицы?',
  'Text color': 'Цвет текста',
  'Auto scroll enabled': 'Автоматическая прокрутка включена',
  'Auto scroll disabled': 'Автоматическая прокрутка отключена',
  'Choose language': 'Выбрать язык'
}); /**
    * @fileoverview I18N for Russian
    * @author Stepan Samko <stpnsamko@gmail.com>
    */

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_i18n2.default.setLanguage(['fr', 'fr_FR'], {
  'Markdown': 'Markdown',
  'WYSIWYG': 'WYSIWYG',
  'Write': 'Écrire',
  'Preview': 'Aperçu',
  'Headings': 'En-têtes',
  'Paragraph': 'Paragraphe',
  'Bold': 'Gras',
  'Italic': 'Italique',
  'Strike': 'Barré',
  'Code': 'Code en ligne',
  'Line': 'Ligne',
  'Blockquote': 'Citation',
  'Unordered list': 'Liste non-ordonnée',
  'Ordered list': 'Liste ordonnée',
  'Task': 'Tâche',
  'Indent': 'Retrait',
  'Outdent': 'Sortir',
  'Insert link': 'Insérer un lien',
  'Insert CodeBlock': 'Insérer un bloc de code',
  'Insert table': 'Insérer un tableau',
  'Insert image': 'Insérer une image',
  'Heading': 'En-tête',
  'Image URL': 'URL de l\'image',
  'Select image file': 'Sélectionnez un fichier image',
  'Description': 'Description',
  'OK': 'OK',
  'More': 'de plus',
  'Cancel': 'Annuler',
  'File': 'Fichier',
  'URL': 'URL',
  'Link text': 'Texte du lien',
  'Add row': 'Ajouter une ligne',
  'Add col': 'Ajouter une colonne',
  'Remove row': 'Supprimer une ligne',
  'Remove col': 'Supprimer une colonne',
  'Align left': 'Aligner à gauche',
  'Align center': 'Aligner au centre',
  'Align right': 'Aligner à droite',
  'Remove table': 'Supprimer le tableau',
  'Would you like to paste as table?': 'Voulez-vous coller ce contenu en tant que tableau ?',
  'Text color': 'Couleur du texte',
  'Auto scroll enabled': 'Défilement automatique activé',
  'Auto scroll disabled': 'Défilement automatique désactivé',
  'Choose language': 'Choix de la langue'
}); /**
    * @fileoverview I18N for French
    * @author Stanislas Michalak <stanislas.michalak@gmail.com>
    */

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_i18n2.default.setLanguage(['uk', 'uk_UA'], {
  'Markdown': 'Markdown',
  'WYSIWYG': 'WYSIWYG',
  'Write': 'Написати',
  'Preview': 'Попередній перегляд',
  'Headings': 'Заголовки',
  'Paragraph': 'Абзац',
  'Bold': 'Жирний',
  'Italic': 'Курсив',
  'Strike': 'Закреслений',
  'Code': 'Вбудований код',
  'Line': 'Лінія',
  'Blockquote': 'Блок цитування',
  'Unordered list': 'Невпорядкований список',
  'Ordered list': 'Упорядкований список',
  'Task': 'Завдання',
  'Indent': 'відступ',
  'Outdent': 'застарілий',
  'Insert link': 'Вставити посилання',
  'Insert CodeBlock': 'Вставити код',
  'Insert table': 'Вставити таблицю',
  'Insert image': 'Вставити зображення',
  'Heading': 'Заголовок',
  'Image URL': 'URL зображення',
  'Select image file': 'Вибрати файл зображення',
  'Description': 'Опис',
  'OK': 'OK',
  'More': 'ще',
  'Cancel': 'Скасувати',
  'File': 'Файл',
  'URL': 'URL',
  'Link text': 'Текст посилання',
  'Add row': 'Додати ряд',
  'Add col': 'Додати стовпчик',
  'Remove row': 'Видалити ряд',
  'Remove col': 'Видалити стовпчик',
  'Align left': 'Вирівняти по лівому краю',
  'Align center': 'Вирівняти по центру',
  'Align right': 'Вирівняти по правому краю',
  'Remove table': 'Видалити таблицю',
  'Would you like to paste as table?': 'Ви хочете вставити у вигляді таблиці?',
  'Text color': 'Колір тексту',
  'Auto scroll enabled': 'Автоматична прокрутка включена',
  'Auto scroll disabled': 'Автоматична прокрутка відключена',
  'Choose language': 'Вибрати мову'
}); /**
    * @fileoverview I18N for Ukrainian
    * @author Nikolya <k_m_i@i.ua>
    */

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_i18n2.default.setLanguage(['tr', 'tr_TR'], {
  'Markdown': 'Markdown',
  'WYSIWYG': 'WYSIWYG',
  'Write': 'Düzenle',
  'Preview': 'Ön izleme',
  'Headings': 'Başlıklar',
  'Paragraph': 'Paragraf',
  'Bold': 'Kalın',
  'Italic': 'İtalik',
  'Strike': 'Altı çizgili',
  'Code': 'Satır içi kod',
  'Line': 'Çizgi',
  'Blockquote': 'Alıntı',
  'Unordered list': 'Sıralanmamış liste',
  'Ordered list': 'Sıralı liste',
  'Task': 'Görev kutusu',
  'Indent': 'Girintiyi arttır',
  'Outdent': 'Girintiyi azalt',
  'Insert link': 'Bağlantı ekle',
  'Insert CodeBlock': 'Kod bloku ekle',
  'Insert table': 'Tablo ekle',
  'Insert image': 'İmaj ekle',
  'Heading': 'Başlık',
  'Image URL': 'İmaj URL',
  'Select image file': 'İmaj dosyası seç',
  'Description': 'Açıklama',
  'OK': 'Onay',
  'More': 'Daha Fazla',
  'Cancel': 'İptal',
  'File': 'Dosya',
  'URL': 'URL',
  'Link text': 'Bağlantı yazısı',
  'Add row': 'Satır ekle',
  'Add col': 'Sütun ekle',
  'Remove row': 'Satır sil',
  'Remove col': 'Sütun sil',
  'Align left': 'Sola hizala',
  'Align center': 'Merkeze hizala',
  'Align right': 'Sağa hizala',
  'Remove table': 'Tabloyu kaldır',
  'Would you like to paste as table?': 'Tablo olarak yapıştırmak ister misiniz?',
  'Text color': 'Metin rengi',
  'Auto scroll enabled': 'Otomatik kaydırma açık',
  'Auto scroll disabled': 'Otomatik kaydırma kapalı',
  'Choose language': 'Dil seçiniz'
}); /**
    * @fileoverview I18N for Turkish
    * @author Mesut Gölcük <mesutgolcuk@gmail.com>
    */

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_i18n2.default.setLanguage(['fi', 'fi_FI'], {
  'Markdown': 'Markdown',
  'WYSIWYG': 'WYSIWYG',
  'Write': 'Kirjoita',
  'Preview': 'Esikatselu',
  'Headings': 'Otsikot',
  'Paragraph': 'Kappale',
  'Bold': 'Lihavointi',
  'Italic': 'Kursivointi',
  'Strike': 'Yliviivaus',
  'Code': 'Koodi',
  'Line': 'Vaakaviiva',
  'Blockquote': 'Lainaus',
  'Unordered list': 'Luettelo',
  'Ordered list': 'Numeroitu luettelo',
  'Task': 'Tehtävä',
  'Indent': 'Suurenna sisennystä',
  'Outdent': 'Pienennä sisennystä',
  'Insert link': 'Lisää linkki',
  'Insert CodeBlock': 'Lisää koodia',
  'Insert table': 'Lisää taulukko',
  'Insert image': 'Lisää kuva',
  'Heading': 'Otsikko',
  'Image URL': 'Kuvan URL',
  'Select image file': 'Valitse kuvatiedosto',
  'Description': 'Kuvaus',
  'OK': 'OK',
  'More': 'Lisää',
  'Cancel': 'Peruuta',
  'File': 'Tiedosto',
  'URL': 'URL',
  'Link text': 'Linkkiteksti',
  'Add row': 'Lisää rivi',
  'Add col': 'Lisää sarake',
  'Remove row': 'Poista rivi',
  'Remove col': 'Poista sarake',
  'Align left': 'Tasaus vasemmalle',
  'Align center': 'Keskitä',
  'Align right': 'Tasaus oikealle',
  'Remove table': 'Poista taulukko',
  'Would you like to paste as table?': 'Haluatko liittää taulukkomuodossa?',
  'Text color': 'Tekstin väri',
  'Auto scroll enabled': 'Automaattinen skrollaus käytössä',
  'Auto scroll disabled': 'Automaattinen skrollaus pois käytöstä',
  'Choose language': 'Valitse kieli'
}); /**
    * @fileoverview I18N for Finnish
    * @author Tomi Mynttinen <pikseli@iki.fi>
    */

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_i18n2.default.setLanguage(['cs', 'cs_CZ'], {
  'Markdown': 'Markdown',
  'WYSIWYG': 'WYSIWYG',
  'Write': 'Napsat',
  'Preview': 'Náhled',
  'Headings': 'Nadpisy',
  'Paragraph': 'Odstavec',
  'Bold': 'Tučné',
  'Italic': 'Kurzíva',
  'Strike': 'Přeškrtnuté',
  'Code': 'Kód',
  'Line': 'Vodorovná čára',
  'Blockquote': 'Citace',
  'Unordered list': 'Seznam s odrážkami',
  'Ordered list': 'Číslovaný seznam',
  'Task': 'Úkol',
  'Indent': 'Zvětšit odsazení',
  'Outdent': 'Zmenšit odsazení',
  'Insert link': 'Vložit odkaz',
  'Insert CodeBlock': 'Vložit blok kódu',
  'Insert table': 'Vložit tabulku',
  'Insert image': 'Vložit obrázek',
  'Heading': 'Nadpis',
  'Image URL': 'URL obrázku',
  'Select image file': 'Vybrat obrázek',
  'Description': 'Popis',
  'OK': 'OK',
  'More': 'Více',
  'Cancel': 'Zrušit',
  'File': 'Soubor',
  'URL': 'URL',
  'Link text': 'Text odkazu',
  'Add row': 'Přidat řádek',
  'Add col': 'Přidat sloupec',
  'Remove row': 'Odebrat řádek',
  'Remove col': 'Odebrat sloupec',
  'Align left': 'Zarovnat vlevo',
  'Align center': 'Zarovnat na střed',
  'Align right': 'Zarovnat vpravo',
  'Remove table': 'Odstranit tabulku',
  'Would you like to paste as table?': 'Chcete vložit jako tabulku?',
  'Text color': 'Barva textu',
  'Auto scroll enabled': 'Automatické rolování zapnuto',
  'Auto scroll disabled': 'Automatické rolování vypnuto',
  'Choose language': 'Vybrat jazyk'
}); /**
    * @fileoverview I18N for Czech
    * @author Dmitrij Tkačenko <dmitrij.tkacenko@scalesoft.cz>
    */

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_i18n2.default.setLanguage(['ar', 'ar_AR'], {
  'Markdown': 'لغة ترميز',
  'WYSIWYG': 'ما تراه هو ما تحصل عليه',
  'Write': 'يكتب',
  'Preview': 'عرض مسبق',
  'Headings': 'العناوين',
  'Paragraph': 'فقرة',
  'Bold': 'خط عريض',
  'Italic': 'خط مائل',
  'Strike': 'إضراب',
  'Code': 'رمز',
  'Line': 'خط',
  'Blockquote': 'فقرة مقتبسة',
  'Unordered list': 'قائمة غير مرتبة',
  'Ordered list': 'قائمة مرتبة',
  'Task': 'مهمة',
  'Indent': 'المسافة البادئة',
  'Outdent': 'المسافة الخارجة',
  'Insert link': 'أدخل الرابط',
  'Insert CodeBlock': 'أدخل الكود',
  'Insert table': 'أدخل جدول',
  'Insert image': 'أدخل صورة',
  'Heading': 'عنوان',
  'Image URL': 'رابط الصورة',
  'Select image file': 'حدد ملف الصورة',
  'Description': 'وصف',
  'OK': 'موافقة',
  'More': 'أكثر',
  'Cancel': 'إلغاء',
  'File': 'ملف',
  'URL': 'رابط',
  'Link text': 'نص الرابط',
  'Add row': 'ضف سطر',
  'Add col': 'ضف عمود',
  'Remove row': 'حذف سطر',
  'Remove col': 'حذف عمود',
  'Align left': 'محاذاة اليسار',
  'Align center': 'محاذاة الوسط',
  'Align right': 'محاذاة اليمين',
  'Remove table': 'حذف الجدول',
  'Would you like to paste as table?': 'هل تريد اللصق كجدول',
  'Text color': 'لون النص',
  'Auto scroll enabled': 'التحريك التلقائي ممكّن',
  'Auto scroll disabled': 'التحريك التلقائي معطّل',
  'Choose language': 'اختر اللغة'
}); /**
    * @fileoverview I18N for Arabic
    * @author Amira Salah <amira.salah@itworx.com>
    */

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_i18n2.default.setLanguage(['pl', 'pl_PL'], {
  'Markdown': 'Markdown',
  'WYSIWYG': 'WYSIWYG',
  'Write': 'Napisz',
  'Preview': 'Podgląd',
  'Headings': 'Nagłówki',
  'Paragraph': 'Akapit',
  'Bold': 'Pogrubienie',
  'Italic': 'Kursywa',
  'Strike': 'Przekreślenie',
  'Code': 'Fragment kodu',
  'Line': 'Linia',
  'Blockquote': 'Cytat',
  'Unordered list': 'Lista nieuporządkowana',
  'Ordered list': 'Lista uporządkowana',
  'Task': 'Zadanie',
  'Indent': 'Utwórz wcięcie',
  'Outdent': 'Usuń wcięcie',
  'Insert link': 'Umieść odnośnik',
  'Insert CodeBlock': 'Umieść blok kodu',
  'Insert table': 'Umieść tabelę',
  'Insert image': 'Umieść obraz',
  'Heading': 'Nagłówek',
  'Image URL': 'Adres URL obrazu',
  'Select image file': 'Wybierz plik obrazu',
  'Description': 'Opis',
  'OK': 'OK',
  'More': 'Więcej',
  'Cancel': 'Anuluj',
  'File': 'Plik',
  'URL': 'URL',
  'Link text': 'Tekst odnośnika',
  'Add row': 'Dodaj rząd',
  'Add col': 'Dodaj kolumnę',
  'Remove row': 'Usuń rząd',
  'Remove col': 'Usuń kolumnę',
  'Align left': 'Wyrównaj do lewej',
  'Align center': 'Wyśrodkuj',
  'Align right': 'Wyrównaj do prawej',
  'Remove table': 'Usuń tabelę',
  'Would you like to paste as table?': 'Czy chcesz wkleić tekst jako tabelę?',
  'Text color': 'Kolor tekstu',
  'Auto scroll enabled': 'Włączono automatyczne przewijanie',
  'Auto scroll disabled': 'Wyłączono automatyczne przewijanie',
  'Choose language': 'Wybierz język'
}); /**
    * @fileoverview I18N for Polish
    * @author Marcin Mikołajczak <me@m4sk.in>
    */

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_i18n2.default.setLanguage(['zhtw', 'zh_TW'], {
  'Markdown': 'Markdown',
  'WYSIWYG': '所見即所得',
  'Write': '編輯',
  'Preview': '預覽',
  'Headings': '標題',
  'Paragraph': '內文',
  'Bold': '粗體',
  'Italic': '斜體',
  'Strike': '刪除線',
  'Code': '內嵌程式碼',
  'Line': '分隔線',
  'Blockquote': '引言',
  'Unordered list': '項目符號清單',
  'Ordered list': '編號清單',
  'Task': '核取方塊清單',
  'Indent': '增加縮排',
  'Outdent': '減少縮排',
  'Insert link': '插入超連結',
  'Insert CodeBlock': '插入程式碼區塊',
  'Insert table': '插入表格',
  'Insert image': '插入圖片',
  'Heading': '標題',
  'Image URL': '圖片網址',
  'Select image file': '選擇圖片檔案',
  'Description': '描述',
  'OK': '確認',
  'More': '更多',
  'Cancel': '取消',
  'File': '檔案',
  'URL': 'URL',
  'Link text': '超連結文字',
  'Add row': '增加行',
  'Add col': '增加列',
  'Remove row': '刪除行',
  'Remove col': '刪除列',
  'Align left': '靠左對齊',
  'Align center': '置中',
  'Align right': '靠右對齊',
  'Remove table': '刪除表格',
  'Would you like to paste as table?': '您要以表格貼上嗎？',
  'Text color': '文字顏色',
  'Auto scroll enabled': '已啟用自動滾動',
  'Auto scroll disabled': '已停用自動滾動',
  'Choose language': '選擇語言'
}); /**
    * @fileoverview I18N for Traditional Chinese
    * @author Tzu-Ray Su <raysu3329@gmail.com>
    */

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_i18n2.default.setLanguage(['gl', 'gl_ES'], {
  'Markdown': 'Markdown',
  'WYSIWYG': 'WYSIWYG',
  'Write': 'Escribir',
  'Preview': 'Vista previa',
  'Headings': 'Encabezados',
  'Paragraph': 'Parágrafo',
  'Bold': 'Negriña',
  'Italic': 'Cursiva',
  'Strike': 'Riscado',
  'Code': 'Código',
  'Line': 'Liña',
  'Blockquote': 'Cita',
  'Unordered list': 'Lista desordenada',
  'Ordered list': 'Lista ordenada',
  'Task': 'Tarefa',
  'Indent': 'Sangría',
  'Outdent': 'Anular sangría',
  'Insert link': 'Inserir enlace',
  'Insert CodeBlock': 'Inserir bloque de código',
  'Insert table': 'Inserir táboa',
  'Insert image': 'Inserir imaxe',
  'Heading': 'Encabezado',
  'Image URL': 'URL da imaxe',
  'Select image file': 'Seleccionar arquivo da imaxe',
  'Description': 'Descrición',
  'OK': 'Aceptar',
  'More': 'Máis',
  'Cancel': 'Cancelar',
  'File': 'Arquivo',
  'URL': 'URL',
  'Link text': 'Texto do enlace',
  'Add row': 'Agregar fila',
  'Add col': 'Agregar columna',
  'Remove row': 'Eliminar fila',
  'Remove col': 'Eliminar columna',
  'Align left': 'Aliñar á esquerda',
  'Align center': 'Centrar',
  'Align right': 'Aliñar á dereita',
  'Remove table': 'Eliminar táboa',
  'Would you like to paste as table?': 'Desexa pegar como táboa?',
  'Text color': 'Cor do texto',
  'Auto scroll enabled': 'Desprazamento automático habilitado',
  'Auto scroll disabled': 'Desprazamento automático deshabilitado',
  'Choose language': 'Elixir idioma'
}); /**
    * @fileoverview I18N for Spanish
    * @author Aida Vidal <avidal@emapic.es>
    */

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_i18n2.default.setLanguage(['sv', 'sv_SE'], {
  'Markdown': 'Markdown',
  'WYSIWYG': 'WYSIWYG',
  'Write': 'Skriv',
  'Preview': 'Förhandsgranska',
  'Headings': 'Överskrifter',
  'Paragraph': 'Paragraf',
  'Bold': 'Fet',
  'Italic': 'Kursiv',
  'Strike': 'Genomstruken',
  'Code': 'Kodrad',
  'Line': 'Linje',
  'Blockquote': 'Citatblock',
  'Unordered list': 'Punktlista',
  'Ordered list': 'Numrerad lista',
  'Task': 'Att göra',
  'Indent': 'Öka indrag',
  'Outdent': 'Minska indrag',
  'Insert link': 'Infoga länk',
  'Insert CodeBlock': 'Infoga kodblock',
  'Insert table': 'Infoga tabell',
  'Insert image': 'Infoga bild',
  'Heading': 'Överskrift',
  'Image URL': 'Bildadress',
  'Select image file': 'Välj en bildfil',
  'Description': 'Beskrivning',
  'OK': 'OK',
  'More': 'Mer',
  'Cancel': 'Avbryt',
  'File': 'Fil',
  'URL': 'Adress',
  'Link text': 'Länktext',
  'Add row': 'Infoga rad',
  'Add col': 'Infoga kolumn',
  'Remove row': 'Radera rad',
  'Remove col': 'Radera kolumn',
  'Align left': 'Vänsterjustera',
  'Align center': 'Centrera',
  'Align right': 'Högerjustera',
  'Remove table': 'Radera tabell',
  'Would you like to paste as table?': 'Vill du klistra in som en tabell?',
  'Text color': 'Textfärg',
  'Auto scroll enabled': 'Automatisk scroll aktiverad',
  'Auto scroll disabled': 'Automatisk scroll inaktiverad',
  'Choose language': 'Välj språk'
}); /**
     * @fileoverview I18N for Swedish
     * @author Magnus Aspling <magnus@yug.se>
     */

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_i18n2.default.setLanguage(['it', 'it_IT'], {
  'Markdown': 'Markdown',
  'WYSIWYG': 'WYSIWYG',
  'Write': 'Scrivere',
  'Preview': 'Anteprima',
  'Headings': 'Intestazioni',
  'Paragraph': 'Paragrafo',
  'Bold': 'Grassetto',
  'Italic': 'Corsivo',
  'Strike': 'Barrato',
  'Code': 'Codice',
  'Line': 'Linea',
  'Blockquote': 'Blocco citazione',
  'Unordered list': 'Lista puntata',
  'Ordered list': 'Lista numerata',
  'Task': 'Attività',
  'Indent': 'Aggiungi indentazione',
  'Outdent': 'Rimuovi indentazione',
  'Insert link': 'Inserisci link',
  'Insert CodeBlock': 'Inserisci blocco di codice',
  'Insert table': 'Inserisci tabella',
  'Insert image': 'Inserisci immagine',
  'Heading': 'Intestazione',
  'Image URL': 'URL immagine',
  'Select image file': 'Seleziona file immagine',
  'Description': 'Descrizione',
  'OK': 'OK',
  'More': 'Più',
  'Cancel': 'Cancella',
  'File': 'File',
  'URL': 'URL',
  'Link text': 'Testo del collegamento',
  'Add row': 'Aggiungi riga',
  'Add col': 'Aggiungi colonna',
  'Remove row': 'Rimuovi riga',
  'Remove col': 'Rimuovi colonna',
  'Align left': 'Allinea a sinistra',
  'Align center': 'Allinea al centro',
  'Align right': 'Allinea a destra',
  'Remove table': 'Rimuovi tabella',
  'Would you like to paste as table?': 'Desideri incollare sotto forma di tabella?',
  'Text color': 'Colore del testo',
  'Auto scroll enabled': 'Scrolling automatico abilitato',
  'Auto scroll disabled': 'Scrolling automatico disabilitato',
  'Choose language': 'Scegli la lingua'
}); /**
    * @fileoverview I18N for Italian
    * @author Massimo Redaelli <massimo@typish.io>
    */

/***/ })
/******/ ]);
});