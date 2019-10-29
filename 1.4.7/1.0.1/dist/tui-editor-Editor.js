/*!
 * tui-editor
 * @version 1.0.1
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com> (https://nhnent.github.io/tui.editor/)
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jquery"), require("tui-code-snippet"), require("codemirror"), require("markdown-it"), require("toMark"), require("highlight.js"), require("squire-rte"));
	else if(typeof define === 'function' && define.amd)
		define(["jquery", "tui-code-snippet", "codemirror", "markdown-it", "toMark", "highlight.js", "squire-rte"], factory);
	else if(typeof exports === 'object')
		exports["Editor"] = factory(require("jquery"), require("tui-code-snippet"), require("codemirror"), require("markdown-it"), require("toMark"), require("highlight.js"), require("squire-rte"));
	else
		root["tui"] = root["tui"] || {}, root["tui"]["Editor"] = factory(root["$"], (root["tui"] && root["tui"]["util"]), root["CodeMirror"], root["markdownit"], root["toMark"], root["hljs"], root["Squire"]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_19__, __WEBPACK_EXTERNAL_MODULE_20__, __WEBPACK_EXTERNAL_MODULE_28__, __WEBPACK_EXTERNAL_MODULE_58__) {
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 38);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements CommandManager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _command = __webpack_require__(17);

var _command2 = _interopRequireDefault(_command);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isMac = /Mac/.test(navigator.platform);
var KEYMAP_OS_INDEX = isMac ? 1 : 0;

/**
 * Class CommandManager
 */

var CommandManager = function () {
  /**
   * @param {ToastUIEditor} base nedInstance
   * @param {object} [options={}] - option object
   *  @param {boolean} [options.useCommandShortcut=true] - execute command with keyMap
   */
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
     * @memberof CommandManager
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
     * @memberof CommandManager
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
     * @memberof CommandManager
     * @param {String} name Command name
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
 * @memberof ComponentManager
 * @param {string} type Command type
 * @param {{name: string, keyMap: object}} props Property
 * @returns {*}
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

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileoverview DOM Utils
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
var FIND_ZWB = /\u200B/g;

/**
 * isTextNode
 * Check if node is text node
 * @param {Node} node node to check
 * @returns {boolean} result
 * @ignore
 */
var isTextNode = function isTextNode(node) {
  return node && node.nodeType === Node.TEXT_NODE;
};

/**
 * isElemNode
 * Check if node is element node
 * @param {Node} node node to check
 * @returns {boolean} result
 * @ignore
 */
var isElemNode = function isElemNode(node) {
  return node && node.nodeType === Node.ELEMENT_NODE;
};

/**
 * getNodeName
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
 * getTextLength
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
 * getOffsetLength
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
 * getNodeOffsetOfParent
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
 * getChildNodeByOffset
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
 * getNodeWithDirectionUntil
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
 * getPrevOffsetNodeUntil
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

var getParentUntilBy = function getParentUntilBy(node, condition) {
  var foundedNode = void 0;

  while (node.parentNode && !condition(node.parentNode)) {
    node = node.parentNode;
  }

  if (condition(node.parentNode)) {
    foundedNode = node;
  }

  return foundedNode;
};

/**
 * getParentUntil
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
 * getNodeWithDirectionUnderParent
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
 * getTopPrevNodeUnder
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
 * getNextTopBlockNode
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
 * @param {string} direction Boolean value for direction true is find next cell
 * @returns {HTMLElement|null}
 * @ignore
 */
var getTableCellByDirection = function getTableCellByDirection(node, direction) {
  var isForward = true;
  var targetElement = null;

  if (_tuiCodeSnippet2.default.isUndefined(direction) || direction !== 'next' && direction !== 'previous') {
    return null;
  } else if (direction === 'previous') {
    isForward = false;
  }

  if (isForward) {
    targetElement = node.nextElementSibling;
  } else {
    targetElement = node.previousElementSibling;
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
  var isForward = true;
  var tableCellElement = null;
  var $node = void 0,
      index = void 0,
      $targetRowElement = void 0,
      $currentContainer = void 0,
      $siblingContainer = void 0,
      isSiblingContainerExists = void 0;

  if (_tuiCodeSnippet2.default.isUndefined(direction) || direction !== 'next' && direction !== 'previous') {
    return null;
  } else if (direction === 'previous') {
    isForward = false;
  }

  if (node) {
    $node = (0, _jquery2.default)(node);

    if (isForward) {
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

    return tableCellElement;
  }

  return null;
};

exports.default = {
  getNodeName: getNodeName,
  isTextNode: isTextNode,
  isElemNode: isElemNode,
  getTextLength: getTextLength,
  getOffsetLength: getOffsetLength,
  getPrevOffsetNodeUntil: getPrevOffsetNodeUntil,
  getNodeOffsetOfParent: getNodeOffsetOfParent,
  getChildNodeByOffset: getChildNodeByOffset,
  getTopPrevNodeUnder: getTopPrevNodeUnder,
  getTopNextNodeUnder: getTopNextNodeUnder,
  getParentUntil: getParentUntil,
  getTopBlockNode: getTopBlockNode,
  getPrevTextNode: getPrevTextNode,
  findOffsetNode: findOffsetNode,
  getPath: getPath,
  getNodeInfo: getNodeInfo,
  getTableCellByDirection: getTableCellByDirection,
  getSiblingRowCellByDirection: getSiblingRowCellByDirection
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.I18n = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements i18n
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
  /**
   * Creates an instance of I18n.
   * @memberof I18n
   */
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var CLASS_PREFIX = 'tui-popup-';
var CLASS_FIT_WINDOW = 'fit-window';

var LAYOUT_TEMPLATE_MODELESS = '<div class="' + CLASS_PREFIX + 'header">\n        <span class="' + CLASS_PREFIX + 'title"></span>\n        <div class="' + CLASS_PREFIX + 'header-buttons">\n            <button type="button" class="' + CLASS_PREFIX + 'close-button"></button>\n        </div>\n    </div>\n    <div class="' + CLASS_PREFIX + 'body"></div>';

var LAYOUT_TEMPLATE_MODAL = '<div class="' + CLASS_PREFIX + 'wrapper">\n        <div class="' + CLASS_PREFIX + 'header">\n            <span class="' + CLASS_PREFIX + 'title"></span>\n            <div class="' + CLASS_PREFIX + 'header-buttons">\n                <button type="button" class="' + CLASS_PREFIX + 'close-button"></button>\n            </div>\n        </div>\n        <div class="' + CLASS_PREFIX + 'body"></div>\n    </div>';

/**
 * A number, or a string containing a number.
 * @typedef {Object} LayerPopupOption
    * @property {string[]} openerCssQuery - Css Query list to bind clickevent that open popup
    * @property {string[]} closerCssQuery - Css Query list to bind clickevent that close popup
    * @property {jQuery} $el - popup root element
    * @property {jQuery|string} content - popup content that html string or jQuery element
    * @property {string} textContent - popup text content
    * @property {string} title - popup title
    * @property {boolean} header - whether to draw header
    * @property {jQuery} $target - element to append popup
    * @property {boolean} modal - true: modal, false: modeless
    * @property {string} headerButtons - replace header(close) button
 */

/**
 * Class LayerPopup
 * @extends {UIController}
 */

var LayerPopup = function (_UIController) {
  _inherits(LayerPopup, _UIController);

  /**
   * Creates an instance of LayerPopup.
   * @param {LayerPopupOption} options - popup option
   * @memberof LayerPopup
   */
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
   * @memberof LayerPopup
   * @protected
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
     * @memberof LayerPopup
     * @protected
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
     * @memberof LayerPopup
     * @protected
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
     * @memberof LayerPopup
     * @protected
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
     * @memberof LayerPopup
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
     * @memberof LayerPopup
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
     * @memberof LayerPopup
     * @returns {HTMLElement} - title html element
     */

  }, {
    key: 'getTitleElement',
    value: function getTitleElement() {
      return this.$el.find('.' + CLASS_PREFIX + 'title').get(0);
    }

    /**
     * hide popup
     * @memberof LayerPopup
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
     * @memberof LayerPopup
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
     * @memberof LayerPopup
     */

  }, {
    key: 'isShow',
    value: function isShow() {
      return this._isShow;
    }

    /**
     * remove popup content
     * @memberof LayerPopup
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
    }

    /**
     * make popup size fit to window
     * @param {boolean} fit - true to make popup fit to window
     * @memberof LayerPopup
     * @protected
     */

  }, {
    key: 'setFitToWindow',
    value: function setFitToWindow(fit) {
      this.$el.toggleClass(CLASS_FIT_WINDOW, fit);
    }

    /**
     * make popup size fit to window
     * @memberof LayerPopup
     * @protected
     * @returns {boolean} - true for fit to window
     */

  }, {
    key: 'isFitToWindow',
    value: function isFitToWindow() {
      return this.$el.hasClass(CLASS_FIT_WINDOW);
    }

    /**
     * toggle size fit to window
     * @memberof LayerPopup
     * @protected
     * @returns {boolean} - true for fit to window
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

module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _highlight = __webpack_require__(28);

var _highlight2 = _interopRequireDefault(_highlight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class Code Block Manager
 */
var CodeBlockManager = function () {
  /**
   * Creates an instance of CodeBlockManager.
   * @memberof CodeBlockManager
   */
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
     * @memberof CodeBlockManager
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
     * @static
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
 */

var UIController = function () {
  /**
   * Creates an instance of UIController.
   * @param {Object} [options] - options
   * @param {jQuery} [options.rootElement] - root element
   * @param {string} [options.tagName] - tag name
   * @param {string} [options.className] - class name
   * @memberof UIController
   */
  function UIController() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, UIController);

    options = _tuiCodeSnippet2.default.extend({
      tagName: 'div'
    }, options);

    this.tagName = options.tagName;
    this.className = options.className;

    /**
     * ui id
     * @type {number}
     * @protected
     */
    this._id = makeUIInstanceId();

    /**
     * rootElement
     * @type {jQuery}
     */
    this.$el = null;

    this._setRootElement(options.rootElement);
  }

  /**
   * @param {string|object} aType - event name and selector string
   * @param {function} aFn - event handler
   * @memberof UIController
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
     * @memberof UIController
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
     * @memberof UIController
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
     * @memberof UIController
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
     * @memberof UIController
     */

  }, {
    key: 'remove',
    value: function remove() {
      this.$el.remove();
    }

    /**
     * destroy
     * @memberof UIController
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _preview = __webpack_require__(10);

var _preview2 = _interopRequireDefault(_preview);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements markdown preview
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Class Markdown Preview
 * @extends {Preview}
 */
var MarkdownPreview = function (_Preview) {
  _inherits(MarkdownPreview, _Preview);

  /**
   * Creates an instance of MarkdownPreview.
   * @param {jQuery} $el - base jQuery element
   * @param {EventManager} eventManager - event manager
   * @param {Convertor} convertor - convertor
   * @param {boolean} isViewer - true for view only mode
   * @memberof MarkdownPreview
   */
  function MarkdownPreview($el, eventManager, convertor, isViewer) {
    _classCallCheck(this, MarkdownPreview);

    var _this = _possibleConstructorReturn(this, (MarkdownPreview.__proto__ || Object.getPrototypeOf(MarkdownPreview)).call(this, $el, eventManager, convertor, isViewer));

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
          _this2.lazyRunner.run('refresh', latestMarkdownValue.replace(/<br>\n/g, '<br>'));
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
     * @memberof MarkdownPreview
     * @override
     */

  }, {
    key: 'render',
    value: function render(html) {
      _get(MarkdownPreview.prototype.__proto__ || Object.getPrototypeOf(MarkdownPreview.prototype), 'render', this).call(this, html);

      this.eventManager.emit('previewRenderAfter', this);
    }
  }]);

  return MarkdownPreview;
}(_preview2.default);

exports.default = MarkdownPreview;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements preview
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _lazyRunner = __webpack_require__(16);

var _lazyRunner2 = _interopRequireDefault(_lazyRunner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class Preview
 **/
var Preview = function () {
  /**
   * Creates an instance of Preview.
   * @param {jQuery} $el Container element for preview
   * @param {EventManager} eventManager Event manager instance
   * @param {Convertor} convertor Convertor instance
   * @param {boolean} isViewer - whether viewer mode or not
   * @memberof Preview
   */
  function Preview($el, eventManager, convertor, isViewer) {
    _classCallCheck(this, Preview);

    this.eventManager = eventManager;
    this.convertor = convertor;
    this.$el = $el;
    this.isViewer = !!isViewer;

    this._initContentSection();

    this.lazyRunner = new _lazyRunner2.default();

    this.lazyRunner.registerLazyRunFunction('refresh', this.refresh, 800, this);
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
     * @memberof Preview
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
     * @memberof Preview
     */

  }, {
    key: 'getHTML',
    value: function getHTML() {
      return this._$previewContent.html();
    }

    /**
     * set html string
     * @param {string} html - html preview string
     * @memberof Preview
     */

  }, {
    key: 'setHTML',
    value: function setHTML(html) {
      this._$previewContent.html(html);
    }

    /**
     * Render HTML on preview
     * @memberof Preview
     * @param {string} html HTML string
     * @protected
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
     * @memberof Preview
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
     * @memberof Preview
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
/* 11 */
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
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
var HTML_ATTR_LIST_RX = new RegExp('^(abbr|align|alt|axis|bgcolor|border|cellpadding|cellspacing|class|clear|' + 'color|cols|compact|coords|dir|face|headers|height|hreflang|hspace|' + 'ismap|lang|language|nohref|nowrap|rel|rev|rows|rules|' + 'scope|scrolling|shape|size|span|start|summary|tabindex|target|title|type|' + 'valign|value|vspace|width|checked|mathvariant|encoding|id|name|' + 'background|cite|href|longdesc|src|usemap|xlink:href|data-+|checked|style)', 'g');

var SVG_ATTR_LIST_RX = new RegExp('^(accent-height|accumulate|additive|alphabetic|arabic-form|ascent|' + 'baseProfile|bbox|begin|by|calcMode|cap-height|class|color|color-rendering|content|' + 'cx|cy|d|dx|dy|descent|display|dur|end|fill|fill-rule|font-family|font-size|font-stretch|' + 'font-style|font-variant|font-weight|from|fx|fy|g1|g2|glyph-name|gradientUnits|hanging|' + 'height|horiz-adv-x|horiz-origin-x|ideographic|k|keyPoints|keySplines|keyTimes|lang|' + 'marker-end|marker-mid|marker-start|markerHeight|markerUnits|markerWidth|mathematical|' + 'max|min|offset|opacity|orient|origin|overline-position|overline-thickness|panose-1|' + 'path|pathLength|points|preserveAspectRatio|r|refX|refY|repeatCount|repeatDur|' + 'requiredExtensions|requiredFeatures|restart|rotate|rx|ry|slope|stemh|stemv|stop-color|' + 'stop-opacity|strikethrough-position|strikethrough-thickness|stroke|stroke-dasharray|' + 'stroke-dashoffset|stroke-linecap|stroke-linejoin|stroke-miterlimit|stroke-opacity|' + 'stroke-width|systemLanguage|target|text-anchor|to|transform|type|u1|u2|underline-position|' + 'underline-thickness|unicode|unicode-range|units-per-em|values|version|viewBox|visibility|' + 'width|widths|x|x-height|x1|x2|xlink:actuate|xlink:arcrole|xlink:role|xlink:show|xlink:title|' + 'xlink:type|xml:base|xml:lang|xml:space|xmlns|xmlns:xlink|y|y1|y2|zoomAndPan)', 'g');

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

  return finalizeHtml($html, needHtmlText);
}

/**
 * Remove unnecessary tags
 * @private
 * @param {jQuery} $html jQuery instance
 */
function removeUnnecessaryTags($html) {
  $html.find('script, iframe, textarea, form, button, select, meta, style, link, title').remove();
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements EventManager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var eventList = ['previewBeforeHook', 'previewRenderAfter', 'previewNeedsRefresh', 'addImageBlobHook', 'setMarkdownAfter', 'contentChangedFromWysiwyg', 'changeFromWysiwyg', 'contentChangedFromMarkdown', 'changeFromMarkdown', 'change', 'changeModeToWysiwyg', 'changeModeToMarkdown', 'changeModeBefore', 'changeMode', 'changePreviewStyle', 'openPopupAddLink', 'openPopupAddImage', 'openPopupAddTable', 'openPopupTableUtils', 'openHeadingSelect', 'openPopupCodeBlockLanguages', 'openPopupCodeBlockEditor', 'closePopupCodeBlockLanguages', 'closePopupCodeBlockEditor', 'closeAllPopup', 'command', 'addCommandBefore', 'htmlUpdate', 'markdownUpdate', 'renderedHtmlUpdated', 'removeEditor', 'convertorAfterMarkdownToHtmlConverted', 'convertorBeforeHtmlToMarkdownConverted', 'convertorAfterHtmlToMarkdownConverted', 'stateChange', 'wysiwygSetValueAfter', 'wysiwygSetValueBefore', 'wysiwygGetValueBefore', 'wysiwygProcessHTMLText', 'wysiwygRangeChangeAfter', 'wysiwygKeyEvent', 'scroll', 'click', 'mousedown', 'mouseover', 'mouseout', 'mouseup', 'contextmenu', 'keydown', 'keyup', 'keyMap', 'load', 'focus', 'blur', 'paste', 'pasteBefore', 'willPaste', 'copy', 'copyBefore', 'copyAfter', 'cut', 'cutAfter', 'drop', 'show', 'hide'];

/**
 * Class EventManager
 */

var EventManager = function () {
  /**
   * Creates an instance of EventManager.
   * @memberof EventManager
   */
  function EventManager() {
    _classCallCheck(this, EventManager);

    this.events = new _tuiCodeSnippet2.default.Map();
    this.TYPE = new _tuiCodeSnippet2.default.Enum(eventList);
  }

  /**
   * Listen event and bind event handler
   * @memberof EventManager
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
     * @memberof EventManager
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
     * @memberof EventManager
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
     * @memberof EventManager
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
     * @memberof EventManager
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
     * @memberof EventManager
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
     * @memberof EventManager
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
     * @memberof EventManager
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
      });

      this.events.set(type, handlersToSurvive);
    }
  }]);

  return EventManager;
}();

exports.default = EventManager;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview extension manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class ExtManager
 */
var ExtManager = function () {
  /**
   * Creates an instance of ExtManager.
   * @memberof ExtManager
   */
  function ExtManager() {
    _classCallCheck(this, ExtManager);

    this.exts = new _tuiCodeSnippet2.default.Map();
  }

  /**
   * defineExtension
   * Defined Extension
   * @memberof ExtManager
   * @param {string} name extension name
   * @param {ExtManager~extension} ext extension
   */


  _createClass(ExtManager, [{
    key: 'defineExtension',
    value: function defineExtension(name, ext) {
      this.exts.set(name, ext);
    }

    /**
     * Apply extensions
     * @memberof ExtManager
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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Convertor have responsible to convert markdown and html
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _markdownIt = __webpack_require__(19);

var _markdownIt2 = _interopRequireDefault(_markdownIt);

var _toMark = __webpack_require__(20);

var _toMark2 = _interopRequireDefault(_toMark);

var _htmlSanitizer = __webpack_require__(11);

var _htmlSanitizer2 = _interopRequireDefault(_htmlSanitizer);

var _markdownitTaskPlugin = __webpack_require__(21);

var _markdownitTaskPlugin2 = _interopRequireDefault(_markdownitTaskPlugin);

var _markdownitCodeBlockPlugin = __webpack_require__(22);

var _markdownitCodeBlockPlugin2 = _interopRequireDefault(_markdownitCodeBlockPlugin);

var _markdownitCodeRenderer = __webpack_require__(23);

var _markdownitCodeRenderer2 = _interopRequireDefault(_markdownitCodeRenderer);

var _markdownitBlockQuoteRenderer = __webpack_require__(24);

var _markdownitBlockQuoteRenderer2 = _interopRequireDefault(_markdownitBlockQuoteRenderer);

var _markdownitTableRenderer = __webpack_require__(25);

var _markdownitTableRenderer2 = _interopRequireDefault(_markdownitTableRenderer);

var _markdownitHtmlBlockRenderer = __webpack_require__(26);

var _markdownitHtmlBlockRenderer2 = _interopRequireDefault(_markdownitHtmlBlockRenderer);

var _markdownitBackticksRenderer = __webpack_require__(27);

var _markdownitBackticksRenderer2 = _interopRequireDefault(_markdownitBackticksRenderer);

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

/**
 * Class Convertor
 */

var Convertor = function () {
  /**
   * Convertor constructor
   * @param {EventManager} em - EventManager instance
   */
  function Convertor(em) {
    _classCallCheck(this, Convertor);

    this.eventManager = em;
  }

  /**
   * _markdownToHtmlWithCodeHighlight
   * Convert markdown to html with Codehighlight
   * @private
   * @memberof Convertor
   * @param {string} markdown markdown text
   * @returns {string} html text
   */


  _createClass(Convertor, [{
    key: '_markdownToHtmlWithCodeHighlight',
    value: function _markdownToHtmlWithCodeHighlight(markdown) {
      markdown = markdown.replace(/<br>/ig, '<br data-tomark-pass>');
      // eslint-disable-next-line
      var onerrorStripeRegex = /(<img[^>]*)(onerror\s*=\s*[\"']?[^\"']*[\"']?)(.*)/i;
      while (onerrorStripeRegex.exec(markdown)) {
        markdown = markdown.replace(onerrorStripeRegex, '$1$3');
      }

      var renderedHTML = markdownitHighlight.render(markdown);
      renderedHTML = this._removeBrToMarkPassAttributeInCode(renderedHTML);

      return renderedHTML;
    }

    /**
     * _markdownToHtml
     * Convert markdown to html
     * @private
     * @memberof Convertor
     * @param {string} markdown markdown text
     * @returns {string} html text
     */

  }, {
    key: '_markdownToHtml',
    value: function _markdownToHtml(markdown) {
      markdown = markdown.replace(/<br>/ig, '<br data-tomark-pass>');
      // eslint-disable-next-line
      var onerrorStripeRegex = /(<img[^>]*)(onerror\s*=\s*[\"']?[^\"']*[\"']?)(.*)/i;
      while (onerrorStripeRegex.exec(markdown)) {
        markdown = markdown.replace(onerrorStripeRegex, '$1$3');
      }

      var renderedHTML = markdownit.render(markdown);
      renderedHTML = this._removeBrToMarkPassAttributeInCode(renderedHTML);

      return renderedHTML;
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
        $code.html($code.html().replace(/&lt;br data-tomark-pass&gt;/, '&lt;br&gt;'));
      });

      renderedHTML = $wrapperDiv.html();

      return renderedHTML;
    }

    /**
     * toHTMLWithCodeHightlight
     * Convert markdown to html with Codehighlight
     * emit convertorAfterMarkdownToHtmlConverted
     * @memberof Convertor
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
     * @memberof Convertor
     * @param {string} markdown markdown text
     * @returns {string} html text
     */

  }, {
    key: 'toHTML',
    value: function toHTML(markdown) {
      var html = this._markdownToHtml(markdown);

      html = this.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', html);

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
     * toMarkdown
     * Convert html to markdown
     * emit convertorAfterHtmlToMarkdownConverted
     * @memberof Convertor
     * @param {string} html html text
     * @param {object | null} toMarkOptions - toMark library options
     * @returns {string} markdown text
     */

  }, {
    key: 'toMarkdown',
    value: function toMarkdown(html, toMarkOptions) {
      var resultArray = [];

      html = this.eventManager.emitReduce('convertorBeforeHtmlToMarkdownConverted', html);

      var markdown = (0, _toMark2.default)(this._appendAttributeForBrIfNeed(html), toMarkOptions);

      markdown = this.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', markdown);

      _tuiCodeSnippet2.default.forEach(markdown.split('\n'), function (line, index) {
        var FIND_TABLE_RX = /^\|[^|]*\|/ig;
        var FIND_CODE_RX = /`[^`]*<br>[^`]*`/ig;

        if (!FIND_CODE_RX.test(line) && !FIND_TABLE_RX.test(line)) {
          line = line.replace(/<br>/ig, '<br>\n');
        }
        resultArray[index] = line;
      });

      return resultArray.join('\n');
    }
  }, {
    key: '_appendAttributeForBrIfNeed',
    value: function _appendAttributeForBrIfNeed(html) {
      var FIND_BR_RX = /<br>/ig;
      var FIND_DOUBLE_BR_RX = /<br \/><br \/>/ig;
      var FIND_PASSING_AND_NORMAL_BR_RX = /<br data-tomark-pass \/><br \/>(.)/ig;
      var FIRST_TWO_BRS_BEFORE_RX = /([^>]|<\/b>|<\/i>|<\/s>|<img [^>]*>)/;
      var TWO_BRS_RX = /<br data-tomark-pass \/><br data-tomark-pass \/>/;
      var FIND_FIRST_TWO_BRS_RX = new RegExp(FIRST_TWO_BRS_BEFORE_RX.source + TWO_BRS_RX.source, 'g');

      html = html.replace(FIND_BR_RX, '<br />');

      html = html.replace(FIND_DOUBLE_BR_RX, '<br data-tomark-pass /><br data-tomark-pass />');

      var div = document.createElement('div');
      var $div = (0, _jquery2.default)(div);
      $div.html(html);
      $div.find('pre br,code br').each(function (index, node) {
        if (node.hasAttribute('data-tomark-pass')) {
          node.removeAttribute('data-tomark-pass');
        }
      });

      html = $div.html().replace(/<br data-tomark-pass="">/ig, '<br data-tomark-pass />');
      html = html.replace(FIND_BR_RX, '<br />');

      html = html.replace(FIND_PASSING_AND_NORMAL_BR_RX, '<br data-tomark-pass /><br data-tomark-pass />$1');
      html = html.replace(FIND_FIRST_TWO_BRS_RX, '$1<br /><br />');

      return html;
    }

    /**
     * get markdownit with code highlight
     * @returns {markdownit} - markdownit instance
     * @memberof Convertor
     * @static
     */

  }], [{
    key: 'getMarkdownitHighlightRenderer',
    value: function getMarkdownitHighlightRenderer() {
      return markdownitHighlight;
    }
  }]);

  return Convertor;
}();

exports.default = Convertor;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileoverview Implements KeyMapper
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
 */

var KeyMapper = function () {
  /**
   * Creates an instance of KeyMapper.
   * @param {object} [options] options
   *  @param {string} options.splitter splitter string default is +
   * @memberof KeyMapper
   */
  function KeyMapper(options) {
    _classCallCheck(this, KeyMapper);

    this._setSplitter(options);
  }

  /**
   * Set key splitter
   * @param {object} options Option object
   * @memberof KeyMapper
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
     * @memberof KeyMapper
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
     * @memberof KeyMapper
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
     * @memberof KeyMapper
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
     * @static
     * @param {string} char - a character to be converted
     * @returns {number} key code for the char
     * @memberof KeyMapper
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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements LazyRunner
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class LazyRunner
 */
var LazyRunner = function () {
  /**
   * Creates an instance of LazyRunner.
   * @memberof LazyRunner
   */
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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements Command
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class Command
 */
var Command = function () {
  /**
   * @param {string} name Command name
   * @param {number} type Command type (Command.TYPE)
   * @param {Array.<string>} [keyMap] keyMap
   */
  function Command(name, type, keyMap) {
    _classCallCheck(this, Command);

    this.name = name;
    this.type = type;

    if (keyMap) {
      this.setKeyMap(keyMap);
    }
  }
  /**
   * getName
   * returns Name of command
   * @memberof Command
   * @returns {string} Command Name
   */


  _createClass(Command, [{
    key: 'getName',
    value: function getName() {
      return this.name;
    }

    /**
     * getType
     * returns Type of command
     * @memberof Command
     * @returns {number} Command Command type number
     */

  }, {
    key: 'getType',
    value: function getType() {
      return this.type;
    }

    /**
     * isMDType
     * returns whether Command Type is Markdown or not
     * @memberof Command
     * @returns {boolean} result
     */

  }, {
    key: 'isMDType',
    value: function isMDType() {
      return this.type === Command.TYPE.MD;
    }

    /**
     * isWWType
     * returns whether Command Type is Wysiwyg or not
     * @memberof Command
     * @returns {boolean} result
     */

  }, {
    key: 'isWWType',
    value: function isWWType() {
      return this.type === Command.TYPE.WW;
    }

    /**
     * isGlobalType
     * returns whether Command Type is Global or not
     * @memberof Command
     * @returns {boolean} result
     */

  }, {
    key: 'isGlobalType',
    value: function isGlobalType() {
      return this.type === Command.TYPE.GB;
    }

    /**
     * setKeyMap
     * Set keymap value for each os
     * @memberof Command
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
 * @memberof Command
 * @param {string} typeStr Editor type name
 * @param {object} props Property
 *     @param {string} props.name Command name
 *     @param {number} props.type Command type number
 * @returns {Command}
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
 * @memberof Command
 * @type {object}
 */
Command.TYPE = {
  MD: 0,
  WW: 1,
  GB: 2
};

exports.default = Command;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implement Module for managing import external data such as image
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var URLRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/([^\s]*))?$/g;

/**
 * Class ImportManager
 */

var ImportManager = function () {
  /**
   * Creates an instance of ImportManager.
   * @param {EventManager} eventManager - eventManager
   * @memberof ImportManager
   */
  function ImportManager(eventManager) {
    _classCallCheck(this, ImportManager);

    this.eventManager = eventManager;
    this._lastState = null;

    this._initEvent();
    this._initDefaultImageImporter();
  }

  /**
   * graceful decode uri component
   * @param {string} originalURI - string to be decoded
   * @returns {string} decoded string
   * @memberof ImportManager
   * @static
   */


  _createClass(ImportManager, [{
    key: '_initEvent',


    /**
     * Initialize event handler
     * @memberof ImportManager
     * @private
     */
    value: function _initEvent() {
      var _this = this;

      this.eventManager.listen('stateChange', function (ev) {
        _this._lastState = ev;
      });

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
     * @memberof ImportManager
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
     * @memberof ImportManager
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
     * @memberof ImportManager
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
     * @memberof ImportManager
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
            evData.codemirrorIgnore = true;

            var blob = item.name ? item : item.getAsFile(); // Blob or File
            _this3._emitAddImageBlobHook(blob, evData.type);

            return false;
          }

          return true;
        });
      }
    }

    /**
     * Returns if current cursor state is in block format ex) blockquote, list, task, codeblock
     * @returns {boolean}
     * @private
     */

  }, {
    key: '_isInBlockFormat',
    value: function _isInBlockFormat() {
      var state = this._lastState;

      return state && (state.codeBlock || state.list || state.task || state.code);
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
     * @static
     * @param {string} text - string to encode
     * @returns {string} - markdown character encoded string
     * @memberof ImportManager
     */

  }, {
    key: 'encodeMarkdownCharacters',
    value: function encodeMarkdownCharacters(text) {
      return text.replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\[/g, '%5B').replace(/\]/g, '%5D').replace(/</g, '%3C').replace(/>/g, '%3E');
    }

    /**
     * escape markdown critical characters
     * @static
     * @param {string} text - string to escape
     * @returns {string} - markdown character escaped string
     * @memberof ImportManager
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
/* 19 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_19__;

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_20__;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Copyright (c) 2016, Revin Guillen.
// Distributed under an MIT license: https://github.com/revin/markdown-it-task-lists/

/**
 * @fileoverview Implements markdownitTaskPlugin
 * @modifier Sungho Kim(sungho-kim@nhnent.com) FE Development Lab/NHN Ent.
 * @modifier Junghwan Park(junghwan.park@nhnent.com) FE Development Lab/NHN Ent.
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
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Copyright (c) 2016, Revin Guillen.
// Distributed under an MIT license: https://github.com/revin/markdown-it-task-lists/
/* eslint-disable */
/**
 * @fileoverview Implements markdownitCodeBlockPlugin
 * @modifier NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

/**
 * Code block renderer for Markdown-it
 * @param {object} markdownit Markdown-it instance
 * @ignore
 */
var MarkdownitCodeBlockRenderer = function MarkdownitCodeBlockRenderer(markdownit) {
    markdownit.core.ruler.after('block', 'tui-code-block', function (state) {
        var tokens = state.tokens;
        var currentToken, tokenIndex;

        for (tokenIndex = 0; tokenIndex < tokens.length; tokenIndex += 1) {
            currentToken = tokens[tokenIndex];

            if (isCodeFenceToken(currentToken) && currentToken.info) {
                setTokenAttribute(currentToken, 'data-language', escape(currentToken.info.replace(' ', ''), true));
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.
// Distributed under an ISC license: https://github.com/markdown-it/markdown-it/
/**
 * @fileoverview Implements MarkdownItCodeRenderer
 * @modifier NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.
// Distributed under MIT license: https://github.com/markdown-it/markdown-it/
/**
 * @fileoverview Implements markdownitCodeBlockQuoteRenderer
 * @modifier NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.
// Distributed under an ISC license: https://github.com/markdown-it/markdown-it/

/**
 * @fileoverview Implements markdownitTableRenderer
 * @modifier NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.
// Distributed under an ISC license: https://github.com/markdown-it/markdown-it/

/**
 * @fileoverview Implements markdownitHtmlBlockRenderer
 * @modifier NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.
// Distributed under MIT license: https://github.com/markdown-it/markdown-it/
/**
 * @fileoverview Implements markdownitBackticksRenderer
 * @modifier NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
        // https://github.nhnent.com/fe/tui.editor/pull/981
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
/* 28 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_28__;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements editor preivew
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _mdPreview = __webpack_require__(9);

var _mdPreview2 = _interopRequireDefault(_mdPreview);

var _eventManager = __webpack_require__(12);

var _eventManager2 = _interopRequireDefault(_eventManager);

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _extManager = __webpack_require__(13);

var _extManager2 = _interopRequireDefault(_extManager);

var _convertor = __webpack_require__(14);

var _convertor2 = _interopRequireDefault(_convertor);

var _domUtils = __webpack_require__(3);

var _domUtils2 = _interopRequireDefault(_domUtils);

var _codeBlockManager = __webpack_require__(7);

var _codeBlockManager2 = _interopRequireDefault(_codeBlockManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TASK_ATTR_NAME = 'data-te-task';
var TASK_CHECKED_CLASS_NAME = 'checked';

/**
 * Class ToastUIEditorViewer
 */

var ToastUIEditorViewer = function () {
  /**
     * Viewer
     * @param {object} options Option object
        * @param {string} options.initialValue Editor's initial value
        * @param {object} options.events eventlist Event list
            * @param {function} options.events.load It would be emitted when editor fully load
            * @param {function} options.events.change It would be emitted when content changed
            * @param {function} options.events.stateChange It would be emitted when format change by cursor position
            * @param {function} options.events.focus It would be emitted when editor get focus
            * @param {function} options.events.blur It would be emitted when editor loose focus
        * @param {object} options.hooks Hook list
            * @param {function} options.hooks.previewBeforeHook Submit preview to hook URL before preview be shown
    */
  function ToastUIEditorViewer(options) {
    var _this = this;

    _classCallCheck(this, ToastUIEditorViewer);

    this.options = options;

    this.eventManager = new _eventManager2.default();
    this.commandManager = new _commandManager2.default(this);
    this.convertor = new _convertor2.default(this.eventManager);
    this.toMarkOptions = null;

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

    this.preview = new _mdPreview2.default((0, _jquery2.default)(this.options.el), this.eventManager, this.convertor, true);

    this.preview.$el.on('mousedown', _jquery2.default.proxy(this._toggleTask, this));

    _extManager2.default.applyExtension(this, this.options.exts);

    this.setValue(this.options.initialValue);

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
      var isBeneathTaskBox = ev.offsetX < 18 && ev.offsetY > 18;

      if (ev.target.hasAttribute(TASK_ATTR_NAME) && !isBeneathTaskBox) {
        (0, _jquery2.default)(ev.target).toggleClass(TASK_CHECKED_CLASS_NAME);
        this.eventManager.emit('change', {
          source: 'viewer',
          data: ev
        });
      }
    }

    /**
     * Set content for preview
     * @memberof ToastUIEditorViewer
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
     * @memberof ToastUIEditorViewer
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
     * @memberof ToastUIEditorViewer
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
     * @memberof ToastUIEditorViewer
     * @param {string} type Event type
     */

  }, {
    key: 'off',
    value: function off(type) {
      this.eventManager.removeEventHandler(type);
    }

    /**
     * Remove Viewer preview from document
     * @memberof ToastUIEditorViewer
     */

  }, {
    key: 'remove',
    value: function remove() {
      this.eventManager.emit('removeEditor');
      this.preview.$el.off('mousedown', _jquery2.default.proxy(this._toggleTask, this));
      this.options = null;
      this.eventManager = null;
      this.commandManager = null;
      this.convertor = null;
      this.preview = null;
    }

    /**
     * Add hook to Viewer preview's event
     * @memberof ToastUIEditorViewer
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
     * @memberof ToastUIEditorViewer
     * @returns {boolean}
     */

  }, {
    key: 'isViewer',
    value: function isViewer() {
      return true;
    }

    /**
     * Return false
     * @memberof ToastUIEditorViewer
     * @returns {boolean}
     */

  }, {
    key: 'isMarkdownMode',
    value: function isMarkdownMode() {
      return false;
    }

    /**
     * Return false
     * @memberof ToastUIEditorViewer
     * @returns {boolean}
     */

  }, {
    key: 'isWysiwygMode',
    value: function isWysiwygMode() {
      return false;
    }

    /**
     * Define extension
     * @memberof ToastUIEditorViewer
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
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uicontroller = __webpack_require__(8);

var _uicontroller2 = _interopRequireDefault(_uicontroller);

var _tooltip = __webpack_require__(31);

var _tooltip2 = _interopRequireDefault(_tooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements UI Button
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Class Button UI
 * @extends {UIController}
 */
var Button = function (_UIController) {
  _inherits(Button, _UIController);

  /**
   * Creates an instance of Button.
   * @param {object} options - button options
   *  @param {string} options.className - button class name
   *  @param {string} options.command - command name to execute on click
   *  @param {string} options.event - event name to trigger on click
   *  @param {string} options.text - text on button
   *  @param {string} options.tooltip - text on tooltip
   *  @param {string} options.style - button style
   *  @param {string} options.state - button state
   * @memberof Button
   */
  function Button(options) {
    _classCallCheck(this, Button);

    var _this = _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this, {
      tagName: 'button',
      className: options.className + ' tui-toolbar-icons',
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

  _createClass(Button, [{
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
      _tooltip2.default.show(this.$el, this._tooltip);
    }
  }, {
    key: '_onOut',
    value: function _onOut() {
      _tooltip2.default.hide();
    }
  }]);

  return Button;
}(_uicontroller2.default);

exports.default = Button;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements tooltip
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TOOLTIP_CONTENT = '<div class="tui-tooltip"><div class="arrow"></div><span class="text"></span></span></div>';

/**
 * Class Tooltip
 */

var Tooltip = function () {
  /**
   * Creates an instance of Tooltip.
   * @memberof Tooltip
   */
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
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements CodeBlockExt
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _codemirror = __webpack_require__(6);

var _codemirror2 = _interopRequireDefault(_codemirror);

__webpack_require__(41);

__webpack_require__(42);

__webpack_require__(43);

__webpack_require__(44);

__webpack_require__(45);

__webpack_require__(46);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class CodeMirrorExt
 */
var CodeMirrorExt = function () {
  /**
   * Creates an instance of CodeMirrorExt.
   * @param {HTMLElement} el - container jquery element
   * @param {Object} [options={}] - codeMirror options
   * @memberof CodeMirrorExt
   */
  function CodeMirrorExt(el) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, CodeMirrorExt);

    this.editorContainerEl = el;

    /**
     * @memberof CodeMirrorExt
     * @protected
     * @member
     */
    this.cm = null;

    this._init(options);
  }

  /**
   * init
   * @param {Object} options - codeMirror option
   * @memberof CodeMirrorExt
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
        indentUnit: 4
      }, options);

      this.cm = _codemirror2.default.fromTextArea(cmTextarea, options);
    }

    /**
     * getCurrentRange
     * @memberof CodeMirrorExt
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
     * @memberof CodeMirrorExt
     */

  }, {
    key: 'focus',
    value: function focus() {
      this.cm.focus();
    }

    /**
     * blur focus to current Editor
     * @memberof CodeMirrorExt
     */

  }, {
    key: 'blur',
    value: function blur() {
      this.cm.getInputField().blur();
    }

    /**
     * Remove Editor from document
     * @memberof CodeMirrorExt
     */

  }, {
    key: 'remove',
    value: function remove() {
      this.cm.toTextArea();
    }

    /**
     * Set Editor value
     * @memberof CodeMirrorExt
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
      this.cm.refresh();
    }

    /**
     * Get editor value
     * @memberof CodeMirrorExt
     * @returns {string} - codeMirror text value
     */

  }, {
    key: 'getValue',
    value: function getValue() {
      return this.cm.getValue('\n');
    }

    /**
     * Get CodeMirror instance
     * @memberof CodeMirrorExt
     * @returns {CodeMirror}
     */

  }, {
    key: 'getEditor',
    value: function getEditor() {
      return this.cm;
    }

    /**
     * Reset Editor
     * @memberof CodeMirrorExt
     */

  }, {
    key: 'reset',
    value: function reset() {
      this.setValue('');
    }

    /**
     * Get current caret position
     * @memberof CodeMirrorExt
     * @returns {{from: {line: number, ch: number}, to: {line: number, ch: number}}}
     */

  }, {
    key: 'getCaretPosition',
    value: function getCaretPosition() {
      return this.cm.cursorCoords();
    }

    /**
     * Add widget
     * @memberof CodeMirrorExt
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
     * @memberof CodeMirrorExt
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
     * @memberof CodeMirrorExt
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
     * @memberof CodeMirrorExt
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
     * @memberof CodeMirrorExt
     */

  }, {
    key: 'setMinHeight',
    value: function setMinHeight(minHeight) {
      var contentWrapper = this.getWrapperElement();

      contentWrapper.style.minHeight = minHeight + 'px';
    }

    /**
     * get code mirror wrapper element
     * @returns {HTMLElement} - code mirror wrapper element
     * @memberof CodeMirrorExt
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
     * @memberof CodeMirrorExt
     */

  }, {
    key: 'getCursor',
    value: function getCursor(start) {
      return this.cm.getCursor(start);
    }

    /**
     * Set cursor position to end
     * @memberof CodeMirrorExt
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
     * @memberof CodeMirrorExt
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
     * @memberof CodeMirrorExt
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
     * @memberof CodeMirrorExt
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
     * @memberof CodeMirrorExt
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
     * @memberof CodeMirrorExt
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
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileoverview Implements ComponentManager
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

/**
 * Class ComponentManager
 */
var ComponentManager = function () {
  /**
   * Constructor
   * @param {MarkdownEditor|WysiwygEditor} editor - Editor instance
   */
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
   * @memberof ComponentManager
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
     * @memberof ComponentManager
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
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements wysiwyg table manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _domUtils = __webpack_require__(3);

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
 */

var WwTableManager = function () {
  /**
   * Creates an instance of WwTableManager.
   * @param {WysiwygEditor} wwe - WysiwygEditor instance
   * @memberof WwTableManager
   */
  function WwTableManager(wwe) {
    _classCallCheck(this, WwTableManager);

    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @memberof WwTableManager#
     * @type {string}
     */
    this.name = 'table';

    this._lastCellNode = null;
    this._init();
  }

  /**
   * _init
   * Initialize
   * @memberof WwTableManager
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
     * _initEvent
     * Initialize event
     * @memberof WwTableManager
     * @private
     */

  }, {
    key: '_initEvent',
    value: function _initEvent() {
      var _this = this;

      this.eventManager.listen('wysiwygRangeChangeAfter.table', function () {
        var range = _this.wwe.getEditor().getSelection();
        var isRangeInTable = _this.isInTable(range);

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

      this.onBindedPaste = this._onPaste.bind(this);
      this.wwe.getEditor().addEventListener('paste', this.onBindedPaste);
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
     * Paste clibpard data.
     * @param {jQuery} $clipboardTable - jQuery table element of clipboard
     */

  }, {
    key: 'pasteClipboardData',
    value: function pasteClipboardData($clipboardTable) {
      if (this.wwe.componentManager.getManager('tableSelection').getSelectedCells().length) {
        return;
      }

      this._expandTableIfNeed($clipboardTable);
      this._pasteDataIntoTable($clipboardTable);
    }

    /**
     * On paste.
     * @param {MouseEvent} ev - event
     * @private
     */

  }, {
    key: '_onPaste',
    value: function _onPaste(ev) {
      var range = this.wwe.getEditor().getSelection();
      var isNotPastingIntoTextNode = !_domUtils2.default.isTextNode(range.commonAncestorContainer);

      if (this.isInTable(range) && !range.collapsed && isNotPastingIntoTextNode) {
        ev.preventDefault();
      }
    }

    /**
     * _initKeyHandler
     * Initialize key event handler
     * @memberof WwTableManager
     * @private
     */

  }, {
    key: '_initKeyHandler',
    value: function _initKeyHandler() {
      var _this3 = this;

      this.keyEventHandlers = {
        'DEFAULT': function DEFAULT(ev, range, keymap) {
          var isRangeInTable = _this3.isInTable(range);

          if (isRangeInTable && !_this3._isSingleModifierKey(keymap)) {
            _this3._recordUndoStateIfNeed(range);
            _this3._removeBRIfNeed(range);
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
          } else if (_this3.isInTable(range)) {
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
     * isInTable
     * Check whether passed range is in table or not
     * @param {Range} range range
     * @returns {boolean} result
     * @memberof WwTableManager
     */

  }, {
    key: 'isInTable',
    value: function isInTable(range) {
      var target = void 0,
          result = void 0;

      if (range.collapsed) {
        target = range.startContainer;
        result = !!(0, _jquery2.default)(target).closest('[contenteditable=true] table').length;
      } else {
        target = range.commonAncestorContainer;
        result = !!(0, _jquery2.default)(target).closest('[contenteditable=true] table').length || !!(0, _jquery2.default)(range.cloneContents()).find('table').length;
      }

      return result;
    }

    /**
     * _isBeforeTable
     * Check whether passed range is right before table or not
     * @param {Range} range range
     * @returns {boolean} result
     * @memberof WwTableManager
     * @private
     */

  }, {
    key: '_isBeforeTable',
    value: function _isBeforeTable(range) {
      return _domUtils2.default.getNodeName(_domUtils2.default.getChildNodeByOffset(range.startContainer, range.startOffset)) === 'TABLE';
    }

    /**
     * _isAfterTable
     * Check whether passed range is right after table or not
     * @param {Range} range range
     * @returns {boolean} result
     * @memberof WwTableManager
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
        if (this.isInTable(range)) {
          if (isBackspace) {
            this._tableHandlerOnBackspace(range, ev);
          } else {
            this._tableHandlerOnDelete(range, ev);
          }

          this._insertBRIfNeed(range);
          this._removeContentsAndChangeSelectionIfNeed(range, keymap, ev);
          isNeedNext = false;
        } else if (!isBackspace && this._isBeforeTable(range) || isBackspace && this._isAfterTable(range)) {
          ev.preventDefault();
          var startOffset = isBackspace ? range.startOffset - 1 : range.startOffset;
          this._removeTable(range, _domUtils2.default.getChildNodeByOffset(range.startContainer, startOffset));
          isNeedNext = false;
        }
      } else if (this.isInTable(range)) {
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
     * _tableHandlerOnBackspace
     * Backspace handler in table
     * @param {Range} range range
     * @param {Event} event event
     * @memberof WwTableManager
     * @private
     */

  }, {
    key: '_tableHandlerOnBackspace',
    value: function _tableHandlerOnBackspace(range, event) {
      var prevNode = _domUtils2.default.getPrevOffsetNodeUntil(range.startContainer, range.startOffset, 'TR'),
          prevNodeName = _domUtils2.default.getNodeName(prevNode);

      if (!prevNode || prevNodeName === 'TD' || prevNodeName === 'TH') {
        event.preventDefault();
      } else if (prevNodeName === 'BR' && prevNode.parentNode.childNodes.length !== 1) {
        event.preventDefault();
        (0, _jquery2.default)(prevNode).remove();
      }
    }
    /**
     * Return whether delete non text or not
     * @param {Range} range Range object
     * @returns {boolean}
     */

  }, {
    key: 'isNonTextDeleting',
    value: function isNonTextDeleting(range) {
      var currentElement = range.startContainer;
      var nextNode = currentElement.nextSibling;
      var nextNodeName = _domUtils2.default.getNodeName(nextNode);
      var currentNodeName = _domUtils2.default.getNodeName(currentElement);

      var isCellDeleting = currentNodeName === nextNodeName && currentNodeName !== 'TEXT';
      var isEndOfText = (!nextNode || nextNodeName === 'BR' && nextNode.parentNode.lastChild === nextNode) && _domUtils2.default.isTextNode(currentElement) && range.startOffset === currentElement.nodeValue.length;
      var isLastCellOfRow = !isEndOfText && (0, _jquery2.default)(currentElement).parents('tr').children().last()[0] === currentElement && (currentNodeName === 'TD' || currentNodeName === 'TH');

      return isCellDeleting || isEndOfText || isLastCellOfRow;
    }
    /**
     * _tableHandlerOnDelete
     * Delete handler in table
     * @param {Range} range range
     * @param {Event} event event
     * @memberof WwTableManager
     * @private
     */

  }, {
    key: '_tableHandlerOnDelete',
    value: function _tableHandlerOnDelete(range, event) {
      var needPreventDefault = this.isNonTextDeleting(range);

      if (needPreventDefault) {
        event.preventDefault();
        range.startContainer.normalize();
      }
    }

    /**
     * _appendBrIfTdOrThNotHaveAsLastChild
     * Append br if td or th doesn't have br as last child
     * @param {Range} range range
     * @memberof WwTableManager
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

      if (_domUtils2.default.getNodeName(tdOrTh.lastChild) !== 'BR' && _domUtils2.default.getNodeName(tdOrTh.lastChild) !== 'DIV' && !isIE10And11) {
        (0, _jquery2.default)(tdOrTh).append((0, _jquery2.default)('<br />')[0]);
      }
    }

    /**
     * _unwrapBlockInTable
     * Unwrap default block tag in table
     * For Squire default action making abnormal behavior, remove default blocks in Table after setValue() called
     * @memberof WwTableManager
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
     * _removeTable
     * Remove table
     * @param {Range} range range
     * @param {Node} table table
     * @memberof WwTableManager
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
     * _recordUndoStateIfNeed
     * record undo state if need
     * @param {Range} range range
     * @memberof WwTableManager
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
     * _recordUndoStateAndResetCellNode
     * record undo state and reset last cell node
     * @param {Range} range range
     * @memberof WwTableManager
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

      var parentNode = startContainer.parentNode;

      var tableData = this._getTableDataFromTable(fragment);
      var isTextInTableCell = parentNode.tagName === 'TD' || parentNode.tagName === 'TH';
      var isTableCell = startContainer.tagName === 'TD' || startContainer.tagName === 'TH';
      var isTextNode = startContainer.nodeType === 3;
      var brString = isIE10 ? '' : '<br />';
      var anchorElement = void 0,
          td = void 0,
          tr = void 0,
          tdContent = void 0;

      if (isTextNode && isTextInTableCell) {
        anchorElement = parentNode;
      } else if (isTableCell) {
        anchorElement = startContainer;
      } else {
        anchorElement = (0, _jquery2.default)(startContainer).find('th,td').get(0);
      }

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
     * @param {?boolean} useHeader - whether use header or not
     * @private
     */

  }, {
    key: '_completeIncompleteTable',
    value: function _completeIncompleteTable(node, useHeader) {
      var nodeName = node.tagName;
      var table = void 0,
          completedTableContents = void 0;

      useHeader = _tuiCodeSnippet2.default.isUndefined(useHeader) ? true : useHeader;

      if (nodeName === 'TABLE') {
        table = node;
      } else {
        table = (0, _jquery2.default)('<table></table>');
        table.insertAfter(node);

        if (nodeName === 'TBODY') {
          completedTableContents = this._generateTheadAndTbodyFromTbody(node);
        } else if (nodeName === 'THEAD') {
          completedTableContents = this._generateTheadAndTbodyFromThead(node);
        } else if (nodeName === 'TR') {
          completedTableContents = this._generateTheadAndTbodyFromTr(node);
        }

        if (useHeader) {
          table.append(completedTableContents.thead);
        }

        table.append(completedTableContents.tbody);
      }

      this.tableCellAppendAidForTableElement(table);
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
        } else if (node.nodeName === 'TABLE' && $node.find('thead').length === 0 && $node.find('tbody').length === 0) {
          $node.remove();
        }

        _this4._completeIncompleteTable(node);
      });
    }

    /**
     * Reset _lastCellNode to null
     * @memberof WwTableManager
     */

  }, {
    key: 'resetLastCellNode',
    value: function resetLastCellNode() {
      this._lastCellNode = null;
    }
    /**
     * Set _lastCellNode to given node
     * @param {HTMLElement} node Table cell
     * @memberof WwTableManager
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
    key: '_isSingleModifierKey',
    value: function _isSingleModifierKey(keymap) {
      return keymap === 'META' || keymap === 'SHIFT' || keymap === 'ALT' || keymap === 'CONTROL';
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
     * Get sibling textNode by given direction
     * @param {HTMLElement} currentTextNode Current text node
     * @param {boolean} isNext Boolean value whether direction equals 'next'
     * @returns {boolean|null}
     * @private
     */

  }, {
    key: '_getSiblingTextNodeByDirection',
    value: function _getSiblingTextNodeByDirection(currentTextNode, isNext) {
      var isPreviousLineExist = currentTextNode.previousSibling && currentTextNode.previousSibling.nodeName === 'BR' && currentTextNode.previousSibling.previousSibling && currentTextNode.previousSibling.previousSibling.nodeType === 3;
      var isNextLineExist = currentTextNode.nextSibling && currentTextNode.nextSibling.nodeName === 'BR' && currentTextNode.nextSibling.nextSibling && currentTextNode.nextSibling.nextSibling.nodeType === 3;
      var target = void 0;

      if (isNext && isNextLineExist) {
        target = currentTextNode.nextSibling.nextSibling;
      } else if (!isNext && isPreviousLineExist) {
        target = currentTextNode.previousSibling.previousSibling;
      }

      return target;
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
      var startContainer = range.startContainer;

      var isNext = direction === 'next';
      var isRow = scale === 'row';
      var target = void 0,
          textOffset = void 0;

      if (isRow) {
        if (_domUtils2.default.isTextNode(startContainer)) {
          target = this._getSiblingTextNodeByDirection(startContainer, isNext);
          if (target) {
            textOffset = target.length < range.startOffset ? target.length : range.startOffset;

            range.setStart(target, textOffset);
            range.collapse(true);

            return;
          }
        }

        target = _domUtils2.default.getSiblingRowCellByDirection(currentCell, direction, false);
      } else {
        target = _domUtils2.default.getTableCellByDirection(currentCell, direction);
        if (!target) {
          target = _domUtils2.default.getSiblingRowCellByDirection(currentCell, direction, true);
        }
      }

      if (target) {
        range.setStart(target, 0);
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

      if (range.collapsed) {
        if (this.isInTable(range) && currentCell) {
          if ((direction === 'previous' || interval === 'row') && !_tuiCodeSnippet2.default.isUndefined(ev)) {
            ev.preventDefault();
          }

          this._changeSelectionToTargetCell(currentCell, range, direction, interval);
          sq.setSelection(range);

          isNeedNext = false;
        }
      }

      return isNeedNext;
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
     * @memberof WwTableManager
     */

  }, {
    key: 'getTableIDClassName',
    value: function getTableIDClassName() {
      var tableClassName = TABLE_CLASS_PREFIX + this.tableID;
      this.tableID += 1;

      return tableClassName;
    }

    /**
     * Remove br when text inputted
     * @param {Range} range Range object
     * @private
     */

  }, {
    key: '_removeBRIfNeed',
    value: function _removeBRIfNeed(range) {
      var isText = _domUtils2.default.isTextNode(range.startContainer);
      var startContainer = isText ? range.startContainer.parentNode : range.startContainer;
      var nodeName = _domUtils2.default.getNodeName(startContainer);

      if (/td|th/i.test(nodeName) && range.collapsed && startContainer.textContent.length === 1) {
        (0, _jquery2.default)(startContainer).find('br').remove();
      }
    }

    /**
     * Insert br when text deleted
     * @param {Range} range Range object
     * @private
     */

  }, {
    key: '_insertBRIfNeed',
    value: function _insertBRIfNeed(range) {
      var isText = _domUtils2.default.isTextNode(range.startContainer);
      var currentCell = isText ? range.startContainer.parentNode : range.startContainer;
      var nodeName = _domUtils2.default.getNodeName(currentCell);
      var $currentCell = (0, _jquery2.default)(currentCell);

      if (/td|th/i.test(nodeName) && range.collapsed && !currentCell.textContent.length && !$currentCell.children().length && !isIE10And11) {
        currentCell.normalize();
        $currentCell.append('<br>');
      }
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
      this.wwe.getEditor().removeEventListener('paste', this.onBindedPaste);
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
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements wysiwyg table selection manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _domUtils = __webpack_require__(3);

var _domUtils2 = _interopRequireDefault(_domUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TABLE_CELL_SELECTED_CLASS_NAME = 'te-cell-selected';

/**
 * Class WwTableSelectionManager
 */

var WwTableSelectionManager = function () {
  /**
     * Creates an instance of WwTableSelectionManager.
     * @param {WysiwygEditor} wwe - WysiwygEditor instance
     * @memberof WwTableSelectionManager
     */
  function WwTableSelectionManager(wwe) {
    _classCallCheck(this, WwTableSelectionManager);

    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
         * Name property
         * @memberof WwTableSelectionManager#
         * @type {string}
         */
    this.name = 'tableSelection';

    this._init();
  }

  /**
     * _init
     * Initialize
     * @memberof WwTableSelectionManager
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
       * _initEvent
       * Initialize event
       * @memberof WwTableSelectionManager
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
          if (isTextSelect) {
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
          _this.setTableSelectionTimerIfNeed(selectionStart);
          _this.eventManager.listen('mouseover.tableSelection', onMouseover);
          _this.eventManager.listen('mouseup.tableSelection', onMouseup);
          if (_this.onDragStart && selectionStart) {
            _this.onDragStart(selectionStart);
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
       * @memberof WwTableSelectionManager
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
       * @memberof WwTableSelectionManager
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
       * @memberof WwTableSelectionManager
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
      var tableManager = this.wwe.componentManager.getManager('table');
      var firstSelectedCell = $selectedCells.first().get(0);
      var lastSelectedCell = $selectedCells.last().get(0);

      if ($selectedCells.length && tableManager.isInTable(range)) {
        range.setStart(firstSelectedCell, 0);
        range.setEnd(lastSelectedCell, lastSelectedCell.childNodes.length);
        sq.setSelection(range);
      }
    }

    /**
       * Style to selected cells.
       * @param {function} onStyle - function for styling
       */

  }, {
    key: 'styleToSelectedCells',
    value: function styleToSelectedCells(onStyle) {
      this.createRangeBySelectedCells();
      onStyle(this.wwe.getEditor());
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
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements wysiwyg code block manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _domUtils = __webpack_require__(3);

var _domUtils2 = _interopRequireDefault(_domUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tagEntities = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};

var FIND_ZWS_RX = /\u200B/g;
var CODEBLOCK_ATTR_NAME = 'data-te-codeblock';

/**
 * Class WwCodeBlockManager
 */

var WwCodeBlockManager = function () {
  /**
   * Creates an instance of WwCodeBlockManager.
   * @param {WysiwygEditor} wwe - wysiwygEditor instance
   * @memberof WwCodeBlockManager
   */
  function WwCodeBlockManager(wwe) {
    _classCallCheck(this, WwCodeBlockManager);

    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @memberof WwCodeBlockManager#
     * @type {string}
     */
    this.name = 'codeblock';

    this._init();
  }
  /**
   * _init
   * Initialize
   * @memberof WwCodeBlockManager
   * @private
   */


  _createClass(WwCodeBlockManager, [{
    key: '_init',
    value: function _init() {
      this._initKeyHandler();
      this._initEvent();
    }

    /**
     * _initKeyHandler
     * Initialize key event handler
     * @memberof WwCodeBlockManager
     * @private
     */

  }, {
    key: '_initKeyHandler',
    value: function _initKeyHandler() {
      this.wwe.addKeyEventHandler('BACK_SPACE', this._removeCodeblockIfNeed.bind(this));
    }

    /**
     * _initEvent
     * Initialize eventmanager event
     * @memberof WwCodeBlockManager
     * @private
     */

  }, {
    key: '_initEvent',
    value: function _initEvent() {
      var self = this;

      this.eventManager.listen('wysiwygSetValueAfter', function () {
        self.splitCodeblockToEachLine();
      });

      this.eventManager.listen('wysiwygProcessHTMLText', function (html) {
        return self._mergeCodeblockEachlinesFromHTMLText(html);
      });
    }

    /**
     * Convert copied nodes to code block if need
     * @memberof WwCodeBlockManager
     * @param {Array.<Node>} nodes Node array
     * @returns {DocumentFragment}
     */

  }, {
    key: 'prepareToPasteOnCodeblock',
    value: function prepareToPasteOnCodeblock(nodes) {
      var range = this.wwe.getEditor().getSelection().cloneRange();
      var frag = this.wwe.getEditor().getDocument().createDocumentFragment();

      if (nodes.length === 1 && this._isCodeBlock(nodes[0])) {
        frag.appendChild(this._copyCodeblockTypeFromRangeCodeblock(nodes.shift(), range));
      } else {
        frag.appendChild(this._copyCodeblockTypeFromRangeCodeblock(this.convertToCodeblock(nodes), range));
      }

      return frag;
    }

    /**
     * Wrap nodes into code block
     * @memberof WwCodeBlockManager
     * @param {Array.<Node>} nodes Node array
     * @returns {HTMLElement} Code block element
     */

  }, {
    key: 'convertToCodeblock',
    value: function convertToCodeblock(nodes) {
      var $codeblock = (0, _jquery2.default)('<pre />');
      var self = this;
      var node = nodes.shift();

      while (_tuiCodeSnippet2.default.isTruthy(node)) {
        $codeblock.append(self._makeCodeBlockLineHtml(_tuiCodeSnippet2.default.isString(node) ? node : node.textContent));
        node = nodes.shift();
      }

      $codeblock.attr(CODEBLOCK_ATTR_NAME, '');

      return $codeblock[0];
    }

    /**
     * Copy content with code block style from code block selection
     * @memberof WwCodeBlockManager
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
     * Merge code block lines
     * @memberof WwCodeBlockManager
     * @param {string} html HTML string
     * @returns {string}
     * @private
     */

  }, {
    key: '_mergeCodeblockEachlinesFromHTMLText',
    value: function _mergeCodeblockEachlinesFromHTMLText(html) {
      html = html.replace(/<pre( .*?)?>(.*?)<\/pre>/g, function (match, codeAttr, code) {
        code = code.replace(/<br \/>/g, '\n');
        code = code.replace(/<div ?(.*?)>/g, '');
        code = code.replace(/\n$/, '');

        return '<pre><code' + (codeAttr || '') + '>' + code + '</code></pre>';
      });

      return html;
    }

    /**
     * Split code block to lines
     * @memberof WwCodeBlockManager
     * @param {HTMLElement} node root node to find pre
     * @private
     */

  }, {
    key: 'splitCodeblockToEachLine',
    value: function splitCodeblockToEachLine(node) {
      var self = this;

      if (!node) {
        node = this.wwe.get$Body();
      }

      (0, _jquery2.default)(node).find('pre').each(function (index, pre) {
        var $pre = (0, _jquery2.default)(pre);
        var lang = $pre.find('code').attr('data-language');
        var textLines = void 0;

        // if this pre can have lines
        if ($pre.children().length > 1) {
          textLines = [];

          $pre.children().each(function (idx, childNode) {
            if ((childNode.nodeName === 'DIV' || childNode.nodeName === 'P') && !(0, _jquery2.default)(childNode).find('br').length) {
              (0, _jquery2.default)(childNode).append('<br>');
            }
          });
        }

        $pre.find('br').replaceWith('\n');
        textLines = $pre.text().replace(/\s+$/, '').split(/\n/g);

        if (lang) {
          $pre.attr('data-language', lang);
          $pre.addClass('lang-' + lang);
        }

        $pre.empty();

        _tuiCodeSnippet2.default.forEach(textLines, function (line) {
          $pre.append(self._makeCodeBlockLineHtml(line));
        });

        $pre.attr(CODEBLOCK_ATTR_NAME, '');
      });
    }

    /**
     * Make code HTML text
     * @memberof WwCodeBlockManager
     * @param {string} lineContent Content text
     * @returns {string}
     * @private
     */

  }, {
    key: '_makeCodeBlockLineHtml',
    value: function _makeCodeBlockLineHtml(lineContent) {
      if (!lineContent) {
        lineContent = '<br>';
      } else {
        lineContent = sanitizeHtmlCode(lineContent);
      }

      return '<div>' + lineContent + '</div>';
    }

    /**
     * Remove codeblock if need
     * @memberof WwCodeBlockManager
     * @param {Event} ev Event object
     * @param {Range} range Range object
     * @returns {boolean}
     * @private
     */

  }, {
    key: '_removeCodeblockIfNeed',
    value: function _removeCodeblockIfNeed(ev, range) {
      var self = this;

      if (!this.isInCodeBlock(range)) {
        return true;
      }

      var pre = (0, _jquery2.default)(range.startContainer).closest('pre');
      var $div = (0, _jquery2.default)(pre).find('div').eq(0);
      var codeContent = $div.text().replace(FIND_ZWS_RX, '');

      // only one code
      if ((range.startOffset === 0 || codeContent.length === 0) && (0, _jquery2.default)(pre).find('div').length <= 1) {
        this.wwe.getEditor().modifyBlocks(function () {
          var newFrag = self.wwe.getEditor().getDocument().createDocumentFragment();
          var content = void 0;

          if (codeContent.length === 0) {
            content = '<br>';
          } else {
            content = $div.html().replace(FIND_ZWS_RX, '');
          }

          (0, _jquery2.default)(newFrag).append((0, _jquery2.default)('<div>' + content + '</div>'));

          return newFrag;
        });

        return false;
      }

      return true;
    }

    /**
     * Return boolean value of whether current range is in the code block
     * @memberof WwCodeBlockManager
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

      return this._isCodeBlock(target);
    }

    /**
     * Verify given element is code block
     * @memberof WwCodeBlockManager
     * @param {HTMLElement} element Element
     * @returns {boolean}
     * @private
     */

  }, {
    key: '_isCodeBlock',
    value: function _isCodeBlock(element) {
      return !!(0, _jquery2.default)(element).closest('pre').length;
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
  return code.replace(/[<>&]/g, function (tag) {
    return tagEntities[tag] || tag;
  });
}

exports.default = WwCodeBlockManager;

/***/ }),
/* 37 */
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var CLASS_TAB_ACTIVE = 'te-tab-active';

/**
 * Class Tab
 * @extends {UIController}
 */

var Tab = function (_UIController) {
  _inherits(Tab, _UIController);

  /**
   * Creates an instance of Tab.
   * @param {object} options - options
   *  @param {string} [options.initName] - name of the default activated button
   *  @param {string[]} options.items - Button names to be created
   *  @param {DOMElement[]} options.sections - Dom elements for tab
   *  @param {function} [options.onItemClick] - when button is clicked pass button name to function
   * @memberof Tab
   */
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
     * activate
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
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Editor = __webpack_require__(39);

// for jquery
/**
 * @fileoverview entry point for editor
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implemtents Editor
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


// markdown commands


// wysiwyg Commands


// langs


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _button = __webpack_require__(30);

var _button2 = _interopRequireDefault(_button);

var _markdownEditor = __webpack_require__(40);

var _markdownEditor2 = _interopRequireDefault(_markdownEditor);

var _mdPreview = __webpack_require__(9);

var _mdPreview2 = _interopRequireDefault(_mdPreview);

var _wysiwygEditor = __webpack_require__(49);

var _wysiwygEditor2 = _interopRequireDefault(_wysiwygEditor);

var _layout = __webpack_require__(62);

var _layout2 = _interopRequireDefault(_layout);

var _eventManager = __webpack_require__(12);

var _eventManager2 = _interopRequireDefault(_eventManager);

var _commandManager2 = __webpack_require__(2);

var _commandManager3 = _interopRequireDefault(_commandManager2);

var _extManager = __webpack_require__(13);

var _extManager2 = _interopRequireDefault(_extManager);

var _importManager = __webpack_require__(18);

var _importManager2 = _interopRequireDefault(_importManager);

var _wwCodeBlockManager = __webpack_require__(36);

var _wwCodeBlockManager2 = _interopRequireDefault(_wwCodeBlockManager);

var _convertor = __webpack_require__(14);

var _convertor2 = _interopRequireDefault(_convertor);

var _viewer = __webpack_require__(29);

var _viewer2 = _interopRequireDefault(_viewer);

var _i18n = __webpack_require__(4);

var _i18n2 = _interopRequireDefault(_i18n);

var _defaultUI = __webpack_require__(63);

var _defaultUI2 = _interopRequireDefault(_defaultUI);

var _domUtils = __webpack_require__(3);

var _domUtils2 = _interopRequireDefault(_domUtils);

var _wwTableManager = __webpack_require__(34);

var _wwTableManager2 = _interopRequireDefault(_wwTableManager);

var _wwTableSelectionManager = __webpack_require__(35);

var _wwTableSelectionManager2 = _interopRequireDefault(_wwTableSelectionManager);

var _codeBlockManager = __webpack_require__(7);

var _codeBlockManager2 = _interopRequireDefault(_codeBlockManager);

var _bold = __webpack_require__(77);

var _bold2 = _interopRequireDefault(_bold);

var _italic = __webpack_require__(78);

var _italic2 = _interopRequireDefault(_italic);

var _strike = __webpack_require__(79);

var _strike2 = _interopRequireDefault(_strike);

var _blockquote = __webpack_require__(80);

var _blockquote2 = _interopRequireDefault(_blockquote);

var _heading = __webpack_require__(81);

var _heading2 = _interopRequireDefault(_heading);

var _paragraph = __webpack_require__(82);

var _paragraph2 = _interopRequireDefault(_paragraph);

var _hr = __webpack_require__(83);

var _hr2 = _interopRequireDefault(_hr);

var _addLink = __webpack_require__(84);

var _addLink2 = _interopRequireDefault(_addLink);

var _addImage = __webpack_require__(85);

var _addImage2 = _interopRequireDefault(_addImage);

var _ul = __webpack_require__(86);

var _ul2 = _interopRequireDefault(_ul);

var _ol = __webpack_require__(87);

var _ol2 = _interopRequireDefault(_ol);

var _table = __webpack_require__(88);

var _table2 = _interopRequireDefault(_table);

var _task = __webpack_require__(89);

var _task2 = _interopRequireDefault(_task);

var _code = __webpack_require__(90);

var _code2 = _interopRequireDefault(_code);

var _codeBlock = __webpack_require__(91);

var _codeBlock2 = _interopRequireDefault(_codeBlock);

var _bold3 = __webpack_require__(92);

var _bold4 = _interopRequireDefault(_bold3);

var _italic3 = __webpack_require__(93);

var _italic4 = _interopRequireDefault(_italic3);

var _strike3 = __webpack_require__(94);

var _strike4 = _interopRequireDefault(_strike3);

var _blockquote3 = __webpack_require__(95);

var _blockquote4 = _interopRequireDefault(_blockquote3);

var _addImage3 = __webpack_require__(96);

var _addImage4 = _interopRequireDefault(_addImage3);

var _addLink3 = __webpack_require__(97);

var _addLink4 = _interopRequireDefault(_addLink3);

var _hr3 = __webpack_require__(98);

var _hr4 = _interopRequireDefault(_hr3);

var _heading3 = __webpack_require__(99);

var _heading4 = _interopRequireDefault(_heading3);

var _paragraph3 = __webpack_require__(100);

var _paragraph4 = _interopRequireDefault(_paragraph3);

var _ul3 = __webpack_require__(101);

var _ul4 = _interopRequireDefault(_ul3);

var _ol3 = __webpack_require__(102);

var _ol4 = _interopRequireDefault(_ol3);

var _table3 = __webpack_require__(103);

var _table4 = _interopRequireDefault(_table3);

var _tableAddRow = __webpack_require__(104);

var _tableAddRow2 = _interopRequireDefault(_tableAddRow);

var _tableAddCol = __webpack_require__(105);

var _tableAddCol2 = _interopRequireDefault(_tableAddCol);

var _tableRemoveRow = __webpack_require__(106);

var _tableRemoveRow2 = _interopRequireDefault(_tableRemoveRow);

var _tableRemoveCol = __webpack_require__(107);

var _tableRemoveCol2 = _interopRequireDefault(_tableRemoveCol);

var _tableAlignCol = __webpack_require__(108);

var _tableAlignCol2 = _interopRequireDefault(_tableAlignCol);

var _tableRemove = __webpack_require__(109);

var _tableRemove2 = _interopRequireDefault(_tableRemove);

var _increaseDepth = __webpack_require__(110);

var _increaseDepth2 = _interopRequireDefault(_increaseDepth);

var _decreaseDepth = __webpack_require__(111);

var _decreaseDepth2 = _interopRequireDefault(_decreaseDepth);

var _task3 = __webpack_require__(112);

var _task4 = _interopRequireDefault(_task3);

var _code3 = __webpack_require__(113);

var _code4 = _interopRequireDefault(_code3);

var _codeBlock3 = __webpack_require__(114);

var _codeBlock4 = _interopRequireDefault(_codeBlock3);

__webpack_require__(115);

__webpack_require__(116);

__webpack_require__(117);

__webpack_require__(118);

__webpack_require__(119);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __nedInstance = [];

/**
 * @callback addImageBlobHook
 * @param  {File|Blob} fileOrBlob - image blob
 * @param  {callback} callback - callback function to be called after
 * @param  {string} source - source of an event the item belongs to. 'paste', 'drop', 'ui'
 */

/**
 * Class ToastUIEditor
 */

var ToastUIEditor = function () {
  /**
     * ToastUI Editor
     * @param {object} options Option object
         * @param {string} [options.height='300px'] - Editor's height style value. Height is applied as border-box ex) '300px', '100%', 'auto'
         * @param {string} [options.minHeight='200px'] - Editor's min-height style value in pixel ex) '300px'
         * @param {string} options.initialValue - Editor's initial value
         * @param {string} options.previewStyle - Markdown editor's preview style (tab, vertical)
         * @param {string} options.initialEditType - Initial editor type (markdown, wysiwyg)
         * @param {object} options.events - eventlist Event list
             * @param {function} options.events.load - It would be emitted when editor fully load
             * @param {function} options.events.change - It would be emitted when content changed
             * @param {function} options.events.stateChange - It would be emitted when format change by cursor position
             * @param {function} options.events.focus - It would be emitted when editor get focus
             * @param {function} options.events.blur - It would be emitted when editor loose focus
         * @param {object} options.hooks - Hook list
             * @param {function} options.hooks.previewBeforeHook - Submit preview to hook URL before preview be shown
             * @param {addImageBlobHook} options.hooks.addImageBlobHook - hook for image upload.
        * @param {string} language - language
        * @param {boolean} [options.useCommandShortcut=true] - whether use keyboard shortcuts to perform commands
        * @param {boolean} useDefaultHTMLSanitizer - use default htmlSanitizer
        * @param {string[]} options.codeBlockLanguages - supported code block languages to be listed
    */
  function ToastUIEditor(options) {
    var _this = this;

    _classCallCheck(this, ToastUIEditor);

    this.options = _jquery2.default.extend({
      previewStyle: 'tab',
      initialEditType: 'markdown',
      height: '300px',
      minHeight: '200px',
      language: 'en_US',
      useDefaultHTMLSanitizer: true,
      useCommandShortcut: true,
      codeBlockLanguages: _codeBlockManager.CodeBlockManager.getHighlightJSLanguages()
    }, options);

    this.eventManager = new _eventManager2.default();

    this.importManager = new _importManager2.default(this.eventManager);

    this.commandManager = new _commandManager3.default(this, {
      useCommandShortcut: this.options.useCommandShortcut
    });

    this.convertor = new _convertor2.default(this.eventManager);

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

    this.mdEditor = _markdownEditor2.default.factory(this.layout.getMdEditorContainerEl(), this.eventManager);
    this.preview = new _mdPreview2.default(this.layout.getPreviewEl(), this.eventManager, this.convertor);
    this.wwEditor = _wysiwygEditor2.default.factory(this.layout.getWwEditorContainerEl(), this.eventManager, {
      useCommandShortcut: this.options.useCommandShortcut
    });
    this.toMarkOptions = null;

    this.changePreviewStyle(this.options.previewStyle);

    this.changeMode(this.options.initialEditType, true);

    this.setValue(this.options.initialValue, false);

    this.minHeight(this.options.minHeight);

    this.height(this.options.height);

    _extManager2.default.applyExtension(this, this.options.exts);

    this.eventManager.emit('load', this);

    __nedInstance.push(this);

    this._addDefaultCommands();
  }

  /**
   * change preview style
   * @memberof ToastUIEditor
   * @param {string} style - 'tab'|'vertical'
   */


  _createClass(ToastUIEditor, [{
    key: 'changePreviewStyle',
    value: function changePreviewStyle(style) {
      this.layout.changePreviewStyle(style);
      this.mdPreviewStyle = style;
      this.eventManager.emit('changePreviewStyle', style);
      this.eventManager.emit('previewNeedsRefresh');
    }

    /**
     * call commandManager's exec method
     * @memberof ToastUIEditor
     */

  }, {
    key: 'exec',
    value: function exec() {
      var _commandManager;

      (_commandManager = this.commandManager).exec.apply(_commandManager, arguments);
    }

    /**
     * add default commands
     * @memberof ToastUIEditor
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
      this.addCommand(_increaseDepth2.default);
      this.addCommand(_decreaseDepth2.default);
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
     * @memberof ToastUIEditor
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
     * @memberof ToastUIEditor
     * @param {string} type Event type
     */

  }, {
    key: 'off',
    value: function off(type) {
      this.eventManager.removeEventHandler(type);
    }

    /**
     * Add hook to TUIEditor event
     * @memberof ToastUIEditor
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
     * @memberof ToastUIEditor
     * @param {string} type Event type
     */

  }, {
    key: 'removeHook',
    value: function removeHook(type) {
      this.eventManager.removeEventHandler(type);
    }

    /**
     * Get CodeMirror instance
     * @memberof ToastUIEditor
     * @returns {CodeMirror}
     */

  }, {
    key: 'getCodeMirror',
    value: function getCodeMirror() {
      return this.mdEditor.getEditor();
    }

    /**
     * Get SquireExt instance
     * @memberof ToastUIEditor
     * @returns {SquireExt}
     */

  }, {
    key: 'getSquire',
    value: function getSquire() {
      return this.wwEditor.getEditor();
    }

    /**
     * Set focus to current Editor
     * @memberof ToastUIEditor
     */

  }, {
    key: 'focus',
    value: function focus() {
      this.getCurrentModeEditor().focus();
    }

    /**
     * Remove focus of current Editor
     * @memberof ToastUIEditor
     */

  }, {
    key: 'blur',
    value: function blur() {
      this.getCurrentModeEditor().blur();
    }

    /**
     * Set cursor position to end
     * @memberof ToastUIEditor
     */

  }, {
    key: 'moveCursorToEnd',
    value: function moveCursorToEnd() {
      this.getCurrentModeEditor().moveCursorToEnd();
    }

    /**
     * Set cursor position to start
     * @memberof ToastUIEditor
     */

  }, {
    key: 'moveCursorToStart',
    value: function moveCursorToStart() {
      this.getCurrentModeEditor().moveCursorToStart();
    }

    /**
     * Set markdown syntax text.
     * @memberof ToastUIEditor
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
     * @memberof ToastUIEditor
     * @param {string} html - html syntax text
     * @param {boolean} [cursorToEnd=true] - move cursor to contents end
     */

  }, {
    key: 'setHtml',
    value: function setHtml(html) {
      var cursorToEnd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      html = html || '';
      this.wwEditor.setValue(html);

      if (this.isMarkdownMode()) {
        var markdown = this.convertor.toMarkdown(this.wwEditor.getValue(), this.toMarkOptions);
        this.mdEditor.setValue(markdown, cursorToEnd);
        this.eventManager.emit('setMarkdownAfter', markdown);
      }
    }

    /**
     * Set markdown syntax text.
     * @memberof ToastUIEditor
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
     * @memberof ToastUIEditor
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
     * @memberof ToastUIEditor
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
     * @memberof ToastUIEditor
     * @returns {string}
     * @deprecated
     */

  }, {
    key: 'getValue',
    value: function getValue() {
      return this.getMarkdown();
    }

    /**
     * insert text
     * @param {string} text - text string to insert
     * @memberof ToastUIEditor
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
     * @memberof ToastUIEditor
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
     * @memberof ToastUIEditor
     * @param {string} height - editor height
     * @returns {string} editor height
     */

  }, {
    key: 'height',
    value: function height(_height) {
      if (_tuiCodeSnippet2.default.isExisty(_height)) {
        if (_height === 'auto') {
          this.options.el.classList.add('auto-height');
          this.minHeight(this.minHeight());
        } else {
          this.options.el.classList.remove('auto-height');
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
     * @memberof ToastUIEditor
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
     * @memberof ToastUIEditor
     * @returns {string}
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
     * @memberof ToastUIEditor
     * @returns {boolean}
     */

  }, {
    key: 'isMarkdownMode',
    value: function isMarkdownMode() {
      return this.currentMode === 'markdown';
    }

    /**
     * Return true if current editor mode is WYSIWYG
     * @memberof ToastUIEditor
     * @returns {boolean}
     */

  }, {
    key: 'isWysiwygMode',
    value: function isWysiwygMode() {
      return this.currentMode === 'wysiwyg';
    }

    /**
     * Return false
     * @memberof ToastUIEditor
     * @returns {boolean}
     */

  }, {
    key: 'isViewer',
    value: function isViewer() {
      return false;
    }

    /**
     * Get current Markdown editor's preview style
     * @memberof ToastUIEditor
     * @returns {string}
     */

  }, {
    key: 'getCurrentPreviewStyle',
    value: function getCurrentPreviewStyle() {
      return this.mdPreviewStyle;
    }

    /**
     * Change editor's mode to given mode string
     * @memberof ToastUIEditor
     * @param {string} mode - Editor mode name of want to change
     * @param {boolean} isWithoutFocus - Change mode without focus
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
     * @memberof ToastUIEditor
     */

  }, {
    key: 'remove',
    value: function remove() {
      var self = this;
      var i = __nedInstance.length - 1;
      this.wwEditor.remove();
      this.mdEditor.remove();
      this.layout.remove();

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
     * @memberof ToastUIEditor
     */

  }, {
    key: 'hide',
    value: function hide() {
      this.eventManager.emit('hide', this);
    }

    /**
     * Show TUIEditor
     * @memberof ToastUIEditor
     */

  }, {
    key: 'show',
    value: function show() {
      this.eventManager.emit('show', this);
      this.getCodeMirror().refresh();
    }

    /**
     * Scroll Editor content to Top
     * @memberof ToastUIEditor
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
     * @memberof ToastUIEditor
     * @param {UI} UI UI instance
     */

  }, {
    key: 'setUI',
    value: function setUI(UI) {
      this._ui = UI;
    }

    /**
     * Get _ui property
     * @memberof ToastUIEditor
     * @returns {UI}
     */

  }, {
    key: 'getUI',
    value: function getUI() {
      return this._ui;
    }

    /**
     * Reset TUIEditor
     * @memberof ToastUIEditor
     */

  }, {
    key: 'reset',
    value: function reset() {
      this.wwEditor.reset();
      this.mdEditor.reset();
    }

    /**
     * Get current range
     * @memberof ToastUIEditor
     * @returns {{start, end}|Range}
     */

  }, {
    key: 'getRange',
    value: function getRange() {
      return this.getCurrentModeEditor().getRange();
    }

    /**
     * Get text object of current range
     * @memberof ToastUIEditor
     * @param {{start, end}|Range} range Range object of each editor
     * @returns {object} TextObject class
     */

  }, {
    key: 'getTextObject',
    value: function getTextObject(range) {
      return this.getCurrentModeEditor().getTextObject(range);
    }

    /**
     * get selected text
     * @returns {string} - selected text
     * @memberof ToastUIEditor
     */

  }, {
    key: 'getSelectedText',
    value: function getSelectedText() {
      var range = this.getRange();
      var textObject = this.getTextObject(range);

      return textObject.getTextContent() || '';
    }

    /**
     * Get instance of TUIEditor
     * @memberof ToastUIEditor
     * @returns {Array}
     */

  }], [{
    key: 'getInstances',
    value: function getInstances() {
      return __nedInstance;
    }

    /**
     * Define extension
     * @memberof ToastUIEditor
     * @param {string} name Extension name
     * @param {ExtManager~extension} ext extension
     */

  }, {
    key: 'defineExtension',
    value: function defineExtension(name, ext) {
      _extManager2.default.defineExtension(name, ext);
    }

    /**
     * Factory method for Editor
     * @memberof ToastUIEditor
     * @param {object} options Option for initialize TUIEditor
     * @returns {ToastUIEditor}
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
 */
ToastUIEditor.Button = _button2.default;

/**
 * WwCodeBlockManager class
 * @type {Class.<WwCodeBlockManager>}
 */
ToastUIEditor.WwCodeBlockManager = _wwCodeBlockManager2.default;

/**
 * WwTableManager class
 * @type {Class.<WwTableManager>}
 */
ToastUIEditor.WwTableManager = _wwTableManager2.default;

/**
 * WwTableManager class
 * @type {Class.<WwTableSelectionManager>}
 */
ToastUIEditor.WwTableSelectionManager = _wwTableSelectionManager2.default;

/**
 * CommandManager class
 * @type {Class.<CommandManager>}
 */
ToastUIEditor.CommandManager = _commandManager3.default;

/**
 * MarkdownIt hightlight instance
 * @type {MarkdownIt}
 */
ToastUIEditor.markdownitHighlight = _convertor2.default.getMarkdownitHighlightRenderer();

module.exports = ToastUIEditor;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _codeMirrorExt = __webpack_require__(32);

var _codeMirrorExt2 = _interopRequireDefault(_codeMirrorExt);

var _keyMapper = __webpack_require__(15);

var _keyMapper2 = _interopRequireDefault(_keyMapper);

var _mdListManager = __webpack_require__(47);

var _mdListManager2 = _interopRequireDefault(_mdListManager);

var _componentManager = __webpack_require__(33);

var _componentManager2 = _interopRequireDefault(_componentManager);

var _mdTextObject = __webpack_require__(48);

var _mdTextObject2 = _interopRequireDefault(_mdTextObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements markdown editor
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var keyMapper = _keyMapper2.default.getSharedInstance();

/**
 * Class MarkdownEditor
 */

var MarkdownEditor = function (_CodeMirrorExt) {
  _inherits(MarkdownEditor, _CodeMirrorExt);

  /**
   * Creates an instance of MarkdownEditor.
   * @param {jQuery} $el - container jquery element
   * @param {EventManager} eventManager - event manager
   * @memberof MarkdownEditor
   */
  function MarkdownEditor($el, eventManager) {
    _classCallCheck(this, MarkdownEditor);

    var _this = _possibleConstructorReturn(this, (MarkdownEditor.__proto__ || Object.getPrototypeOf(MarkdownEditor)).call(this, $el.get(0), {
      mode: 'gfm',
      dragDrop: true,
      allowDropFileTypes: ['image'],
      extraKeys: {
        'Enter': 'newlineAndIndentContinue',
        'Tab': 'subListIndentTab',
        'Shift-Tab': 'indentLessOrderedList'
      }
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
   * @memberof MarkdownEditor
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
        _this2.getEditor().refresh();
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

        var _token$state = token.state,
            base = _token$state.base,
            overlay = _token$state.overlay;


        var state = {
          bold: !!base.strong,
          italic: !!base.em,
          strike: !!base.strikethrough,
          code: !!overlay.code,
          codeBlock: !!overlay.codeBlock,
          quote: !!base.quote,
          list: !!base.list,
          task: !!base.task,
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
     * @memberof MarkdownEditor
     * @override
     * @param {string} markdown - Markdown syntax text
     * @param {boolean} [cursorToEnd=true] - move cursor to contents end
     */

  }, {
    key: 'setValue',
    value: function setValue(markdown, cursorToEnd) {
      _get(MarkdownEditor.prototype.__proto__ || Object.getPrototypeOf(MarkdownEditor.prototype), 'setValue', this).call(this, markdown, cursorToEnd);
      this._emitMarkdownEditorContentChangedEvent();
    }

    /**
     * Get text object of current range
     * @memberof MarkdownEditor
     * @param {{start, end}} range Range object of each editor
     * @returns {object}
     */

  }, {
    key: 'getTextObject',
    value: function getTextObject(range) {
      return new _mdTextObject2.default(this, range);
    }

    /**
     * Emit contentChangedFromMarkdown event
     * @memberof MarkdownEditor
     * @private
     */

  }, {
    key: '_emitMarkdownEditorContentChangedEvent',
    value: function _emitMarkdownEditorContentChangedEvent() {
      this.eventManager.emit('contentChangedFromMarkdown', this);
    }

    /**
     * Emit changeEvent
     * @memberof MarkdownEditor
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
     * @memberof MarkdownEditor
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
     * MarkdownEditor factory method
     * @memberof MarkdownEditor
     * @param {jQuery} $el - Container element for editor
     * @param {EventManager} eventManager - EventManager instance
     * @returns {MarkdownEditor} - MarkdownEditor
     */

  }], [{
    key: 'factory',
    value: function factory($el, eventManager) {
      var mde = new MarkdownEditor($el, eventManager);

      return mde;
    }
  }]);

  return MarkdownEditor;
}(_codeMirrorExt2.default);

exports.default = MarkdownEditor;

/***/ }),
/* 41 */
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
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
/* 42 */
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
 * @modifier NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _codemirror = __webpack_require__(6);

var _codemirror2 = _interopRequireDefault(_codemirror);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*eslint-disable */
"use strict"; // CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
/**
 * @modifier NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
// based on https://github.com/codemirror/CodeMirror/blob/ff04f127ba8a736b97d06c505fb85d976e3f2980/mode/markdown/markdown.js


_codemirror2.default.defineMode("markdown", function (cmCfg, modeCfg) {

  var htmlFound = _codemirror2.default.modes.hasOwnProperty("xml");
  var htmlMode = _codemirror2.default.getMode(cmCfg, htmlFound ? { name: "xml", htmlMode: true } : "text/plain");

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

  // Should underscores in words open/close em/strong?
  if (modeCfg.underscoresBreakWords === undefined) modeCfg.underscoresBreakWords = true;

  // TUI.EDITOR MODIFICATION START
  // scrollSync prototype
  // https://github.nhnent.com/fe/tui.editor/commit/f63d6ae79078923d369e6c170d07485f05c42fd7
  // Use `fencedCodeBlocks` to configure fenced code blocks. false to
  // disable, string to specify a precise regexp that the fence should
  // match, and true to allow three or more backticks or tildes (as
  // per CommonMark).
  // Turn on fenced code blocks? ("```" to start/end)
  // if (modeCfg.fencedCodeBlocks === undefined) modeCfg.fencedCodeBlocks = false;
  // TUI.EDITOR MODIFICATION END

  // Turn on task lists? ("- [ ] " and "- [x] ")
  if (modeCfg.taskLists === undefined) modeCfg.taskLists = false;

  // Turn on strikethrough syntax
  if (modeCfg.strikethrough === undefined) modeCfg.strikethrough = false;

  var codeDepth = 0;

  var header = 'header',
      code = 'comment',
      quote = 'quote',
      list1 = 'variable-2',
      list2 = 'variable-3',
      list3 = 'keyword',
      hr = 'hr',
      image = 'tag',
      formatting = 'formatting',
      linkinline = 'link',
      linkemail = 'link',
      linktext = 'link',
      linkhref = 'string',
      em = 'em',
      strong = 'strong',
      strikethrough = 'strikethrough';

  var hrRE = /^([*\-_])(?:\s*\1){2,}\s*$/,
      ulRE = /^[*\-+]\s+/,
      olRE = /^[0-9]+([.)])\s+/,
      taskListRE = /^\[(x| )\](?=\s)/ // Must follow ulRE or olRE
  // TUI.EDITOR MODIFICATION START
  // scrollSync prototype
  // https://github.nhnent.com/fe/tui.editor/commit/f63d6ae79078923d369e6c170d07485f05c42fd7
  ,
      atxHeaderRE = modeCfg.allowAtxHeaderWithoutSpace ? /^(#+)/ : /^(#+)(?: |$)/,
      setextHeaderRE = /^ *(?:\={1,}|-{1,})\s*$/,
      textRE = /^[^#!\[\]*_\\<>` "'(~]+/,
      fencedCodeRE = new RegExp("^(" + (modeCfg.fencedCodeBlocks === true ? "~~~+|```+" : modeCfg.fencedCodeBlocks) + ")[ \\t]*([\\w+#]*)");
  // ,   atxHeaderRE = /^(#+)(?: |$)/
  // ,   setextHeaderRE = /^ *(?:\={1,}|-{1,})\s*$/
  // ,   textRE = /^[^#!\[\]*_\\<>` "'(~]+/;
  // TUI.EDITOR MODIFICATION END

  function switchInline(stream, state, f) {
    state.f = state.inline = f;
    return f(stream, state);
  }

  function switchBlock(stream, state, f) {
    state.f = state.block = f;
    return f(stream, state);
  }

  // TUI.EDITOR MODIFICATION START
  // scrollSync prototype
  // https://github.nhnent.com/fe/tui.editor/commit/f63d6ae79078923d369e6c170d07485f05c42fd7
  function lineIsEmpty(line) {
    return !line || !/\S/.test(line.string);
  }
  // TUI.EDITOR MODIFICATION END

  // Blocks

  function blankLine(state) {
    // Reset linkTitle state
    state.linkTitle = false;
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
    if (!htmlFound && state.f == htmlBlock) {
      state.f = inlineNormal;
      state.block = blockNormal;
    }
    // Reset state.trailingSpace
    state.trailingSpace = 0;
    state.trailingSpaceNewLine = false;
    // TUI.EDITOR MODIFICATION START
    // scrollSync prototype
    // https://github.nhnent.com/fe/tui.editor/commit/f63d6ae79078923d369e6c170d07485f05c42fd7
    // Mark this line as blank
    state.prevLine = state.thisLine;
    state.thisLine = null;
    // state.thisLineHasContent = false;
    // TUI.EDITOR MODIFICATION END
    return null;
  }

  function blockNormal(stream, state) {

    var sol = stream.sol();

    var prevLineIsList = state.list !== false,
        prevLineIsIndentedCode = state.indentedCode;

    state.indentedCode = false;

    if (prevLineIsList) {
      if (state.indentationDiff >= 0) {
        // Continued list
        if (state.indentationDiff < 4) {
          // Only adjust indentation if *not* a code block
          state.indentation -= state.indentationDiff;
        }
        state.list = null;
        // TUI.EDITOR MODIFICATION START
        // bug: no highlight in list
        // https://github.nhnent.com/fe/tui.editor/commit/d42c37639942633ccaf755c0c0d20f460c0b2441
        // https://github.nhnent.com/fe/tui.editor/issues/1002
      }
      if (state.indentation > 0) {
        state.list = null;
        // state.listDepth = Math.floor(state.indentation / 4) + 1;
        // } else if (state.indentation > 0) {
        //   state.list = null;
        state.listDepth = Math.floor(state.indentation / 4);
        // TUI.EDITOR MODIFICATION END
      } else {
        // No longer a list
        state.list = false;
        state.listDepth = 0;
      }
    }

    var match = null;
    if (state.indentationDiff >= 4) {
      stream.skipToEnd();
      // TUI.EDITOR MODIFICATION START
      // scrollSync prototype
      // https://github.nhnent.com/fe/tui.editor/commit/f63d6ae79078923d369e6c170d07485f05c42fd7
      if (prevLineIsIndentedCode || lineIsEmpty(state.prevLine)) {
        // if (prevLineIsIndentedCode || !state.prevLineHasContent) {
        // TUI.EDITOR MODIFICATION END
        state.indentation -= 4;
        state.indentedCode = true;
        return code;
      } else {
        return null;
      }
    } else if (stream.eatSpace()) {
      return null;
    } else if ((match = stream.match(atxHeaderRE)) && match[1].length <= 6) {
      state.header = match[1].length;
      if (modeCfg.highlightFormatting) state.formatting = "header";
      state.f = state.inline;
      return getType(state);
      // TUI.EDITOR MODIFICATION START
      // scrollSync prototype
      // https://github.nhnent.com/fe/tui.editor/commit/f63d6ae79078923d369e6c170d07485f05c42fd7
    } else if (!lineIsEmpty(state.prevLine) && !state.quote && !prevLineIsList && !prevLineIsIndentedCode && (match = stream.match(setextHeaderRE))) {
      // } else if (state.prevLineHasContent && !state.quote && !prevLineIsList && !prevLineIsIndentedCode && (match = stream.match(setextHeaderRE))) {
      // TUI.EDITOR MODIFICATION END
      state.header = match[0].charAt(0) == '=' ? 1 : 2;
      if (modeCfg.highlightFormatting) state.formatting = "header";
      state.f = state.inline;
      return getType(state);
    } else if (stream.eat('>')) {
      state.quote = sol ? 1 : state.quote + 1;
      if (modeCfg.highlightFormatting) state.formatting = "quote";
      stream.eatSpace();
      return getType(state);
    } else if (stream.peek() === '[') {
      return switchInline(stream, state, footnoteLink);
    } else if (stream.match(hrRE, true)) {
      state.hr = true;
      return hr;
      // TUI.EDITOR MODIFICATION START
      // scrollSync prototype
      // https://github.nhnent.com/fe/tui.editor/commit/f63d6ae79078923d369e6c170d07485f05c42fd7
    } else if ((lineIsEmpty(state.prevLine) || prevLineIsList) && (stream.match(ulRE, false) || stream.match(olRE, false))) {
      // } else if ((!state.prevLineHasContent || prevLineIsList) && (stream.match(ulRE, false) || stream.match(olRE, false))) {
      // TUI.EDITOR MODIFICATION END
      var listType = null;
      if (stream.match(ulRE, true)) {
        listType = 'ul';
      } else {
        stream.match(olRE, true);
        listType = 'ol';
      }
      // TUI.EDITOR MODIFICATION START
      // scrollSync prototype
      // https://github.nhnent.com/fe/tui.editor/commit/f63d6ae79078923d369e6c170d07485f05c42fd7
      // Roll back to original #1002
      // https://github.nhnent.com/fe/tui.editor/issues/1002
      // state.indentation = stream.column() + stream.current().length;
      state.indentation += 4;
      // TUI.EDITOR MODIFICATION END
      state.list = true;
      state.listDepth++;
      if (modeCfg.taskLists && stream.match(taskListRE, false)) {
        state.taskList = true;
        // TUI.EDITOR MODIFICATION START
        // Do not show table format pasting confirm on paste event where in Bloc... (#720)
        // https://github.nhnent.com/fe/tui.editor/commit/ed0b8b6c0cd5928a962e533f797e5bafcbfd6b33
        state.task = true; // to manage task state
        // TUI.EDITOR MODIFICATION END
      }
      state.f = state.inline;
      if (modeCfg.highlightFormatting) state.formatting = ["list", "list-" + listType];
      return getType(state);
      // TUI.EDITOR MODIFICATION START
      // scrollSync prototype
      // https://github.nhnent.com/fe/tui.editor/commit/f63d6ae79078923d369e6c170d07485f05c42fd7
    } else if (modeCfg.fencedCodeBlocks && (match = stream.match(fencedCodeRE, true))) {
      state.fencedChars = match[1];
      // try switching mode
      state.localMode = getMode(match[2]);
      // } else if (modeCfg.fencedCodeBlocks && stream.match(/^```[ \t]*([\w+#]*)/, true)) {
      //   // try switching mode
      //   state.localMode = getMode(RegExp.$1);
      // TUI.EDITOR MODIFICATION END
      if (state.localMode) state.localState = state.localMode.startState();
      state.f = state.block = local;
      if (modeCfg.highlightFormatting) state.formatting = "code-block";
      state.code = true;
      return getType(state);
    }

    return switchInline(stream, state, state.inline);
  }

  function htmlBlock(stream, state) {
    var style = htmlMode.token(stream, state.htmlState);
    if (htmlFound && state.htmlState.tagStart === null && !state.htmlState.context && state.htmlState.tokenize.isInText || state.md_inside && stream.current().indexOf(">") > -1) {
      state.f = inlineNormal;
      state.block = blockNormal;
      state.htmlState = null;
    }
    return style;
  }

  function local(stream, state) {
    // TUI.EDITOR MODIFICATION START
    // scrollSync prototype
    // https://github.nhnent.com/fe/tui.editor/commit/f63d6ae79078923d369e6c170d07485f05c42fd7
    if (stream.sol() && state.fencedChars && stream.match(state.fencedChars, false)) {
      // if (stream.sol() && stream.match("```", false)) {
      // TUI.EDITOR MODIFICATION END
      state.localMode = state.localState = null;
      state.f = state.block = leavingLocal;
      return null;
    } else if (state.localMode) {
      return state.localMode.token(stream, state.localState);
    } else {
      stream.skipToEnd();
      return code;
    }
  }

  function leavingLocal(stream, state) {
    // TUI.EDITOR MODIFICATION START
    // scrollSync prototype
    // https://github.nhnent.com/fe/tui.editor/commit/f63d6ae79078923d369e6c170d07485f05c42fd7
    stream.match(state.fencedChars);
    state.block = blockNormal;
    state.f = inlineNormal;
    state.fencedChars = null;
    // stream.match("```");
    // state.block = blockNormal;
    // state.f = inlineNormal;
    // TUI.EDITOR MODIFICATION END
    if (modeCfg.highlightFormatting) state.formatting = "code-block";
    state.code = true;
    var returnType = getType(state);
    state.code = false;
    return returnType;
  }

  // Inline
  function getType(state) {
    var styles = [];

    if (state.formatting) {
      styles.push(formatting);

      if (typeof state.formatting === "string") state.formatting = [state.formatting];

      for (var i = 0; i < state.formatting.length; i++) {
        styles.push(formatting + "-" + state.formatting[i]);

        if (state.formatting[i] === "header") {
          styles.push(formatting + "-" + state.formatting[i] + "-" + state.header);
        }

        // Add `formatting-quote` and `formatting-quote-#` for blockquotes
        // Add `error` instead if the maximum blockquote nesting depth is passed
        if (state.formatting[i] === "quote") {
          if (!modeCfg.maxBlockquoteDepth || modeCfg.maxBlockquoteDepth >= state.quote) {
            styles.push(formatting + "-" + state.formatting[i] + "-" + state.quote);
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
      styles.push(linkhref, "url");
    } else {
      // Only apply inline styles to non-url text
      if (state.strong) {
        styles.push(strong);
      }
      if (state.em) {
        styles.push(em);
      }
      if (state.strikethrough) {
        styles.push(strikethrough);
      }

      if (state.linkText) {
        styles.push(linktext);
      }

      if (state.code) {
        styles.push(code);
      }
    }

    if (state.header) {
      styles.push(header);styles.push(header + "-" + state.header);
    }

    if (state.quote) {
      styles.push(quote);

      // Add `quote-#` where the maximum for `#` is modeCfg.maxBlockquoteDepth
      if (!modeCfg.maxBlockquoteDepth || modeCfg.maxBlockquoteDepth >= state.quote) {
        styles.push(quote + "-" + state.quote);
      } else {
        styles.push(quote + "-" + modeCfg.maxBlockquoteDepth);
      }
    }

    if (state.list !== false) {
      var listMod = (state.listDepth - 1) % 3;
      if (!listMod) {
        styles.push(list1);
      } else if (listMod === 1) {
        styles.push(list2);
      } else {
        styles.push(list3);
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
      var taskOpen = stream.match(taskListRE, true)[1] !== "x";
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

    // Get sol() value now, before character is consumed
    var sol = stream.sol();

    var ch = stream.next();

    if (ch === '\\') {
      stream.next();
      if (modeCfg.highlightFormatting) {
        var type = getType(state);
        return type ? type + " formatting-escape" : "formatting-escape";
      }
    }

    // Matches link titles present on next line
    if (state.linkTitle) {
      state.linkTitle = false;
      var matchCh = ch;
      if (ch === '(') {
        matchCh = ')';
      }
      matchCh = (matchCh + '').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
      var regex = '^\\s*(?:[^' + matchCh + '\\\\]+|\\\\\\\\|\\\\.)' + matchCh;
      if (stream.match(new RegExp(regex), true)) {
        return linkhref;
      }
    }

    // If this block is changed, it may need to be updated in GFM mode
    if (ch === '`') {
      var previousFormatting = state.formatting;
      if (modeCfg.highlightFormatting) state.formatting = "code";
      var t = getType(state);
      var before = stream.pos;
      stream.eatWhile('`');
      var difference = 1 + stream.pos - before;
      if (!state.code) {
        codeDepth = difference;
        state.code = true;
        return getType(state);
      } else {
        if (difference === codeDepth) {
          // Must be exact
          state.code = false;
          return t;
        }
        state.formatting = previousFormatting;
        return getType(state);
      }
    } else if (state.code) {
      return getType(state);
    }

    if (ch === '!' && stream.match(/\[[^\]]*\] ?(?:\(|\[)/, false)) {
      stream.match(/\[[^\]]*\]/);
      // TUI.EDITOR MODIFICATION START
      // remove image syntax from highlight
      // https://github.nhnent.com/fe/tui.editor/commit/d2160b8c16f392372569dc2a22f12957afd7d9f2
      // hash string in image link is too long to highligh. exclude image from highlight
      // state.inline = state.f = linkHref;
      // TUI.EDITOR MODIFICATION END
      return image;
    }

    if (ch === '[' && stream.match(/.*\](\(.*\)| ?\[.*\])/, false)) {
      state.linkText = true;
      if (modeCfg.highlightFormatting) state.formatting = "link";
      return getType(state);
    }

    if (ch === ']' && state.linkText && stream.match(/\(.*\)| ?\[.*\]/, false)) {
      if (modeCfg.highlightFormatting) state.formatting = "link";
      var type = getType(state);
      state.linkText = false;
      state.inline = state.f = linkHref;
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
      return type + linkinline;
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
      return type + linkemail;
    }
    // TUI.EDITOR MODIFICATION START
    // codemirror markdown mode fix to prevent htmlBlock
    // https://github.nhnent.com/fe/tui.editor/commit/35910adb507646b6129fd4d349c65bbe28832211
    // we dont need html Block it ruin markdown blocks
    /*
        if (ch === '<' && stream.match(/^(!--|\w)/, false)) {
          var end = stream.string.indexOf(">", stream.pos);
          if (end != -1) {
            var atts = stream.string.substring(stream.start, end);
            if (/markdown\s*=\s*('|"){0,1}1('|"){0,1}/.test(atts)) state.md_inside = true;
          }
          stream.backUp(1);
          state.htmlState = CodeMirror.startState(htmlMode);
          return switchBlock(stream, state, htmlBlock);
        }
    
        if (ch === '<' && stream.match(/^\/\w*?>/)) {
          state.md_inside = false;
          return "tag";
        }
    */
    // TUI.EDITOR MODIFICATION END

    var ignoreUnderscore = false;
    if (!modeCfg.underscoresBreakWords) {
      if (ch === '_' && stream.peek() !== '_' && stream.match(/(\w)/, false)) {
        var prevPos = stream.pos - 2;
        if (prevPos >= 0) {
          var prevCh = stream.string.charAt(prevPos);
          if (prevCh !== '_' && prevCh.match(/(\w)/, false)) {
            ignoreUnderscore = true;
          }
        }
      }
    }
    if (ch === '*' || ch === '_' && !ignoreUnderscore) {
      if (sol && stream.peek() === ' ') {
        // Do nothing, surrounded by newline and space
      } else if (state.strong === ch && stream.eat(ch)) {
        // Remove STRONG
        if (modeCfg.highlightFormatting) state.formatting = "strong";
        var t = getType(state);
        state.strong = false;
        return t;
      } else if (!state.strong && stream.eat(ch)) {
        // Add STRONG
        state.strong = ch;
        if (modeCfg.highlightFormatting) state.formatting = "strong";
        return getType(state);
      } else if (state.em === ch) {
        // Remove EM
        if (modeCfg.highlightFormatting) state.formatting = "em";
        var t = getType(state);
        state.em = false;
        return t;
      } else if (!state.em) {
        // Add EM
        state.em = ch;
        if (modeCfg.highlightFormatting) state.formatting = "em";
        return getType(state);
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

    if (ch === ' ') {
      if (stream.match(/ +$/, false)) {
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
      return type + linkinline;
    }

    stream.match(/^[^>]+/, true);

    return linkinline;
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

      if (stream.match(inlineRE(endChar), true)) {
        stream.backUp(1);
      }

      state.linkHref = true;
      return getType(state);
    };
  }

  function footnoteLink(stream, state) {
    if (stream.match(/^[^\]]*\]:/, false)) {
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

    stream.match(/^[^\]]+/, true);

    return linktext;
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
    return linkhref + " url";
  }

  var savedInlineRE = [];
  function inlineRE(endChar) {
    if (!savedInlineRE[endChar]) {
      // Escape endChar for RegExp (taken from http://stackoverflow.com/a/494122/526741)
      endChar = (endChar + '').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
      // Match any non-endChar, escaped character, as well as the closing
      // endChar.
      savedInlineRE[endChar] = new RegExp('^(?:[^\\\\]|\\\\.)*?(' + endChar + ')');
    }
    return savedInlineRE[endChar];
  }

  var mode = {
    startState: function startState() {
      return {
        f: blockNormal,
        // TUI.EDITOR MODIFICATION START
        // scrollSync prototype
        // https://github.nhnent.com/fe/tui.editor/commit/f63d6ae79078923d369e6c170d07485f05c42fd7
        prevLine: null,
        thisLine: null,
        // prevLineHasContent: false,
        // thisLineHasContent: false,
        // TUI.EDITOR MODIFICATION END

        block: blockNormal,
        htmlState: null,
        indentation: 0,

        inline: inlineNormal,
        text: handleText,

        formatting: false,
        linkText: false,
        linkHref: false,
        linkTitle: false,
        em: false,
        strong: false,
        header: 0,
        hr: false,
        // TUI.EDITOR MODIFICATION START
        // Do not show table format pasting confirm on paste event where in Bloc... (#720)
        // https://github.nhnent.com/fe/tui.editor/commit/ed0b8b6c0cd5928a962e533f797e5bafcbfd6b33
        task: false,
        // TUI.EDITOR MODIFICATION END
        taskList: false,
        list: false,
        listDepth: 0,
        quote: 0,
        trailingSpace: 0,
        trailingSpaceNewLine: false,
        strikethrough: false,
        // TUI.EDITOR MODIFICATION START
        // scrollSync prototype
        // https://github.nhnent.com/fe/tui.editor/commit/f63d6ae79078923d369e6c170d07485f05c42fd7
        fencedChars: null
        // TUI.EDITOR MODIFICATION END
      };
    },

    copyState: function copyState(s) {
      return {
        f: s.f,

        // TUI.EDITOR MODIFICATION START
        // scrollSync prototype
        // https://github.nhnent.com/fe/tui.editor/commit/f63d6ae79078923d369e6c170d07485f05c42fd7
        prevLine: s.prevLine,
        thisLine: s.this,
        // prevLineHasContent: s.prevLineHasContent,
        // thisLineHasContent: s.thisLineHasContent,
        // TUI.EDITOR MODIFICATION END

        block: s.block,
        htmlState: s.htmlState && _codemirror2.default.copyState(htmlMode, s.htmlState),
        indentation: s.indentation,

        localMode: s.localMode,
        localState: s.localMode ? _codemirror2.default.copyState(s.localMode, s.localState) : null,

        inline: s.inline,
        text: s.text,
        formatting: false,
        linkTitle: s.linkTitle,
        // TUI.EDITOR MODIFICATION START
        // scrollSync prototype
        // https://github.nhnent.com/fe/tui.editor/commit/f63d6ae79078923d369e6c170d07485f05c42fd7
        code: s.code,
        // TUI.EDITOR MODIFICATION END
        em: s.em,
        strong: s.strong,
        strikethrough: s.strikethrough,
        header: s.header,
        hr: s.hr,
        taskList: s.taskList,
        // TUI.EDITOR MODIFICATION START
        // Do not show table format pasting confirm on paste event where in Bloc... (#720)
        // https://github.nhnent.com/fe/tui.editor/commit/ed0b8b6c0cd5928a962e533f797e5bafcbfd6b33
        task: s.task, // to manage task state
        // TUI.EDITOR MODIFICATION END
        list: s.list,
        listDepth: s.listDepth,
        quote: s.quote,
        indentedCode: s.indentedCode,
        trailingSpace: s.trailingSpace,
        trailingSpaceNewLine: s.trailingSpaceNewLine,
        md_inside: s.md_inside,
        // TUI.EDITOR MODIFICATION START
        // scrollSync prototype
        // https://github.nhnent.com/fe/tui.editor/commit/f63d6ae79078923d369e6c170d07485f05c42fd7
        fencedChars: s.fencedChars
        // TUI.EDITOR MODIFICATION END
      };
    },

    token: function token(stream, state) {

      // Reset state.formatting
      state.formatting = false;

      // TUI.EDITOR MODIFICATION START
      // scrollSync prototype
      // https://github.nhnent.com/fe/tui.editor/commit/f63d6ae79078923d369e6c170d07485f05c42fd7
      if (stream != state.thisLine) {
        var forceBlankLine = state.header || state.hr;
        // if (stream.sol()) {
        //   var forceBlankLine = !!state.header || state.hr;
        // TUI.EDITOR MODIFICATION END

        // Reset state.header and state.hr
        state.header = 0;
        state.hr = false;

        if (stream.match(/^\s*$/, true) || forceBlankLine) {
          // TUI.EDITOR MODIFICATION START
          // scrollSync prototype
          // https://github.nhnent.com/fe/tui.editor/commit/f63d6ae79078923d369e6c170d07485f05c42fd7
          blankLine(state);
          if (!forceBlankLine) return null;
          state.prevLine = null;
        }

        state.prevLine = state.thisLine;
        state.thisLine = stream;
        //   state.prevLineHasContent = false;
        //   blankLine(state);
        //   return forceBlankLine ? this.token(stream, state) : null;
        // } else {
        //   state.prevLineHasContent = state.thisLineHasContent;
        //   state.thisLineHasContent = true;
        // }
        // TUI.EDITOR MODIFICATION END

        // Reset state.taskList
        state.taskList = false;
        // TUI.EDITOR MODIFICATION START
        // Do not show table format pasting confirm on paste event where in Bloc... (#720)
        // https://github.nhnent.com/fe/tui.editor/commit/ed0b8b6c0cd5928a962e533f797e5bafcbfd6b33
        state.task = false; // to manage task status
        // Reset state.code
        // state.code = false;
        // TUI.EDITOR MODIFICATION END

        // Reset state.trailingSpace
        state.trailingSpace = 0;
        state.trailingSpaceNewLine = false;

        state.f = state.block;
        var indentation = stream.match(/^\s*/, true)[0].replace(/\t/g, '    ').length;
        var difference = Math.floor((indentation - state.indentation) / 4) * 4;
        if (difference > 4) difference = 4;
        var adjustedIndentation = state.indentation + difference;
        state.indentationDiff = adjustedIndentation - state.indentation;
        state.indentation = adjustedIndentation;
        if (indentation > 0) return null;
      }
      return state.f(stream, state);
    },

    innerMode: function innerMode(state) {
      if (state.block == htmlBlock) return { state: state.htmlState, mode: htmlMode };
      if (state.localState) return { state: state.localState, mode: state.localMode };
      return { state: state, mode: mode };
    },

    blankLine: blankLine,

    getType: getType,
    // TUI.EDITOR MODIFICATION START
    // Exclude closing tags highlighting fixes #789 (#801)
    // https://github.nhnent.com/fe/tui.editor/commit/815b271cd426c6939413136a0532846a58cd36ab
    closeBrackets: "()[]{}''\"\"``",
    // TUI.EDITOR MODIFICATION END
    fold: "markdown"
  };
  return mode;
}, "xml");

_codemirror2.default.defineMIME("text/x-markdown", "markdown");

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _codemirror = __webpack_require__(6);

var _codemirror2 = _interopRequireDefault(_codemirror);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*eslint-disable */
var urlRE = /^((?:(?:aaas?|about|acap|adiumxtra|af[ps]|aim|apt|attachment|aw|beshare|bitcoin|bolo|callto|cap|chrome(?:-extension)?|cid|coap|com-eventbrite-attendee|content|crid|cvs|data|dav|dict|dlna-(?:playcontainer|playsingle)|dns|doi|dtn|dvb|ed2k|facetime|feed|file|finger|fish|ftp|geo|gg|git|gizmoproject|go|gopher|gtalk|h323|hcp|https?|iax|icap|icon|im|imap|info|ipn|ipp|irc[6s]?|iris(?:\.beep|\.lwz|\.xpc|\.xpcs)?|itms|jar|javascript|jms|keyparc|lastfm|ldaps?|magnet|mailto|maps|market|message|mid|mms|ms-help|msnim|msrps?|mtqp|mumble|mupdate|mvn|news|nfs|nih?|nntp|notes|oid|opaquelocktoken|palm|paparazzi|platform|pop|pres|proxy|psyc|query|res(?:ource)?|rmi|rsync|rtmp|rtsp|secondlife|service|session|sftp|sgn|shttp|sieve|sips?|skype|sm[bs]|snmp|soap\.beeps?|soldat|spotify|ssh|steam|svn|tag|teamspeak|tel(?:net)?|tftp|things|thismessage|tip|tn3270|tv|udp|unreal|urn|ut2004|vemmi|ventrilo|view-source|webcal|wss?|wtai|wyciwyg|xcon(?:-userid)?|xfire|xmlrpc\.beeps?|xmpp|xri|ymsgr|z39\.50[rs]?):(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]|\([^\s()<>]*\))+(?:\([^\s()<>]*\)|[^\s`*!()\[\]{};:'".,<>?«»“”‘’]))/i; // CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
/**
 * @modifier NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
      if (stream.sol() || state.ateSpace) {
        state.ateSpace = false;
        /*
        //we dont need this
        if (modeConfig.gitHubSpice !== false) {
          if(stream.match(/^(?:[a-zA-Z0-9\-_]+\/)?(?:[a-zA-Z0-9\-_]+@)?(?:[a-f0-9]{7,40}\b)/)) {
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
        */
      }
      stream.next();
      return null;
    },
    blankLine: blankLine
  };

  var markdownConfig = {
    underscoresBreakWords: false,
    taskLists: true,
    fencedCodeBlocks: '```',
    strikethrough: true
  };
  for (var attr in modeConfig) {
    markdownConfig[attr] = modeConfig[attr];
  }
  markdownConfig.name = "markdown";
  return _codemirror2.default.overlayMode(_codemirror2.default.getMode(config, markdownConfig), gfmOverlay);
}, "markdown");

_codemirror2.default.defineMIME("text/x-gfm", "gfm");

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _codemirror = __webpack_require__(6);

var _codemirror2 = _interopRequireDefault(_codemirror);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*eslint-disable */
var listRE = /^(\s*)(>[> ]*|[*+-]\s(?:\[(?:x|\s)\]\s)?|(\d+)([.)]\s(?:\[(?:x|\s)\]\s)?))(\s*)/,
    emptyListRE = /^(\s*)(>[> ]*|[*+-]\s(?:\[(?:x|\s)\]\s)?|(\d+)([.)]\s(?:\[(?:x|\s)\]\s)?))(\s*)$/,
    FIND_CODEBLOCK_START_RX = /^ *(`{3,}|~{3,})[ \.]*\S+ */,
    unorderedListRE = /[*+-]\s/; // CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
/**
 * @modifier NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */


_codemirror2.default.commands.subListIndentTab = function (cm) {
    if (cm.getOption("disableInput")) return _codemirror2.default.Pass;
    var ranges = cm.listSelections();
    for (var i = 0; i < ranges.length; i++) {
        var pos = ranges[i].head;
        var line = cm.getLine(pos.line);
        var cursorBeforeTextInline = line.substr(0, pos.ch);

        if (listRE.test(cursorBeforeTextInline)) {
            cm.replaceRange(Array(cm.getOption("indentUnit") + 1).join(" ") + line, {
                line: pos.line, ch: 0
            }, {
                line: pos.line, ch: line.length
            }, '+input');
            cm.setCursor(pos.line, pos.ch + 4);
        } else {
            if (cm.somethingSelected()) cm.indentSelection("add");else cm.execCommand("insertSoftTab");
        }
    }
    // TUI.EDITOR MODIFICATION START
    // 
    // https://github.nhnent.com/fe/tui.editor/commit/f63d6ae79078923d369e6c170d07485f05c42fd7
    cm.execCommand('fixOrderedListNumber');
    /// TUI.EDITOR MODIFICATION END
};

_codemirror2.default.commands.newlineAndIndentContinue = function (cm) {
    if (cm.getOption("disableInput")) return _codemirror2.default.Pass;
    var ranges = cm.listSelections(),
        replacements = [];

    for (var i = 0; i < ranges.length; i++) {
        var pos = ranges[i].head;
        var eolState = cm.getStateAfter(pos.line);
        var inList = eolState.base.list !== false;
        var inQuote = eolState.base.quote !== 0;

        var line = cm.getLine(pos.line);
        var isCodeBlockStart = FIND_CODEBLOCK_START_RX.test(line);
        var match = listRE.exec(line);
        var cursor = cm.getCursor();

        if (!ranges[i].empty() || !inList && !inQuote && !isCodeBlockStart || !match && !isCodeBlockStart) {
            cm.execCommand("newlineAndIndent");
            return;
        }

        if (isCodeBlockStart) {
            cursor = cm.getCursor();

            if (cursor.line !== pos.line || cursor.ch !== line.length) {
                cm.execCommand("newlineAndIndent");
                return;
            }
        }

        if (emptyListRE.test(line) && cursor.ch > 0) {
            cm.replaceRange("", {
                line: pos.line, ch: 0
            }, {
                line: pos.line, ch: line.length
            });
            replacements[i] = "\n";
        } else if (isCodeBlockStart) {
            replacements[i] = '\n\n```';
        } else {
            var indent = match[1],
                after = match[5],
                bullet;
            if (indent.length === pos.ch) {
                bullet = "";
            } else if (unorderedListRE.test(match[2]) || match[2].indexOf(">") >= 0) {
                bullet = match[2];
            } else {
                bullet = parseInt(match[3], 10) + 1 + match[4];
            }
            replacements[i] = "\n" + indent + bullet + after;
        }
    }

    cm.replaceSelections(replacements);

    if (isCodeBlockStart) {
        cm.setCursor(pos.line + 1, 0);
    }
};

/***/ }),
/* 46 */
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
 * @modifier NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileoverview Implements markdown list manager
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
var FIND_MD_OL_RX = /^[ \t]*[\d]+\. .*/;
var FIND_MD_UL_RX = /^[ \t]*[-*] .*/;
var FIND_MD_TASK_RX = /^[ \t]*[-*]( \[[ xX]])? .*/;
var FIND_TABLE_RX = /^\|([-\s\w\d\t<>?!@#$%^&*()_=+\\/'";: \r[\]]*\|+)+/i;
var FIND_HEADING_RX = /^#+\s/;
var FIND_BLOCK_RX = /^ {0,3}(```|\||>)/;

/**
 * Class MdListManager
 */

var MdListManager = function () {
  /**
   * Creates an instance of MdListManager.
   * @param {MarkdownEditor} mde - MarkdownEditor instance
   * @memberof MdListManager
   */
  function MdListManager(mde) {
    _classCallCheck(this, MdListManager);

    this.mde = mde;
    this.eventManager = mde.eventManager;

    /**
     * Name property
     * @memberof MdListManager#
     * @type {string}
     */
    this.name = 'list';
  }

  /**
   * Return whether passed line is list or paragraph or not
   * @param {string} line line text
   * @returns {boolean}
   */


  _createClass(MdListManager, [{
    key: 'isListOrParagraph',
    value: function isListOrParagraph(line) {
      return !FIND_BLOCK_RX.test(line) && !FIND_TABLE_RX.test(line) && !FIND_HEADING_RX.test(line);
    }

    /**
     * Append blank line at list top or bottom if needed
     * @param {CodeMirror} cm CodeMirror instance
     * @param {number} index index number
     * @param {number} endLineNumber end line index number
     * @param {number} startLineNumber start line index number
     */

  }, {
    key: 'appendBlankLineIfNeed',
    value: function appendBlankLineIfNeed(cm, index, endLineNumber, startLineNumber) {
      var doc = cm.getDoc();
      var cursorPositionFactor = 0;
      var isMultiLineSelection = startLineNumber !== endLineNumber;
      var nextLineOfLastIndex = doc.getLine(this._getEndLineNumberOfList(doc, endLineNumber) + 1);
      var previousLineOfFirstIndex = doc.getLine(this._getStartLineNumberOfList(doc, startLineNumber) - 1);

      var nextLine = doc.getLine(index + 1);
      if (isMultiLineSelection && this._isNeedAppendBlankLine(nextLineOfLastIndex) || !isMultiLineSelection && this._isNeedAppendBlankLine(nextLine)) {
        doc.replaceRange('\n', {
          line: index,
          ch: doc.getLine(index).length
        });
      }

      var previousLine = doc.getLine(index - 1);
      if (isMultiLineSelection && this._isNeedAppendBlankLine(previousLineOfFirstIndex) || !isMultiLineSelection && this._isNeedAppendBlankLine(previousLine)) {
        doc.replaceRange('\n', {
          line: startLineNumber,
          ch: 0
        });
        cursorPositionFactor += 1;
      }
      if (!isMultiLineSelection) {
        var currentLineNumber = index + cursorPositionFactor;
        cm.setCursor(currentLineNumber, doc.getLine(currentLineNumber).length);
      }
    }

    /**
     * Return whether need to append blank line or not
     * @param {string} line Line text
     * @returns {boolean}
     * @private
     */

  }, {
    key: '_isNeedAppendBlankLine',
    value: function _isNeedAppendBlankLine(line) {
      return line && line.length !== 0 && !this._isAList(line);
    }

    /**
     * Sort line number of selection descending
     * @param {{from, to}} range start, end CodeMirror range information
     * @returns {{start: {number}, end: {number}}}
     */

  }, {
    key: 'createSortedLineRange',
    value: function createSortedLineRange(range) {
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
     * Expand line range if need
     * @param {object} doc doc instance
     * @param {{from, to}} range CodeMirror range information
     * @param {function} comparator comparator function
     * @returns {{start: number, end: number}}
     */

  }, {
    key: 'expandLineRangeIfNeed',
    value: function expandLineRangeIfNeed(doc, range, comparator) {
      var lineRange = this.createSortedLineRange(range);
      var start = lineRange.start,
          end = lineRange.end;


      var isRangeStartInUlOrTask = this._isDifferentListType(comparator, doc.getLine(start));
      var isRangeEndInUlOrTask = this._isDifferentListType(comparator, doc.getLine(end));

      if (isRangeStartInUlOrTask) {
        start = this._getStartLineNumberOfList(doc, start);
      }

      if (isRangeEndInUlOrTask) {
        end = this._getEndLineNumberOfList(doc, end);
      }

      return {
        start: start,
        end: end
      };
    }

    /**
     * Replace list syntax
     * @param {object} doc CodeMirror doc instance
     * @param {number} lineNumber Line number
     * @param {RegExp} regexp Regexp for find list syntax
     * @param {string} replacePattern Replacement string
     */

  }, {
    key: 'replaceLineText',
    value: function replaceLineText(doc, lineNumber, regexp, replacePattern) {
      var line = doc.getLine(lineNumber);
      var currentLineStart = {
        line: lineNumber,
        ch: 0
      };
      var currentLineEnd = {
        line: lineNumber,
        ch: line.length
      };

      line = line.replace(regexp, replacePattern);

      doc.replaceRange(line, currentLineStart, currentLineEnd);
    }

    /**
     * Return whether is a different list type or not
     * @param {function} comparator comparator function
     * @param {string} line line string
     * @returns {boolean}
     * @private
     */

  }, {
    key: '_isDifferentListType',
    value: function _isDifferentListType(comparator, line) {
      return line && line.length !== 0 && comparator.call(this, line);
    }

    /**
     * Return whether is a list or not
     * @param {string} line line string
     * @returns {boolean}
     * @private
     */

  }, {
    key: '_isAList',
    value: function _isAList(line) {
      return line && line.length !== 0 && this._isListLine(line);
    }

    /**
     * Return whether passed line is list or not
     * @param {string} line Line text
     * @returns {Boolean}
     * @private
     */

  }, {
    key: '_isListLine',
    value: function _isListLine(line) {
      return !!(line.match(FIND_MD_TASK_RX) || line.match(FIND_MD_UL_RX) || line.match(FIND_MD_OL_RX));
    }

    /**
     * Get start line number of current list
     * @param {object} doc CodeMirror doc instance
     * @param {number} startLineNumber start line number of selection
     * @returns {number|undefined}
     * @private
     */

  }, {
    key: '_getStartLineNumberOfList',
    value: function _getStartLineNumberOfList(doc, startLineNumber) {
      var lineNumber = void 0;

      for (lineNumber = startLineNumber; lineNumber > 0; lineNumber -= 1) {
        var previousLine = doc.getLine(lineNumber - 1);
        if (!previousLine || !this._isListLine(previousLine)) {
          break;
        }
      }

      return lineNumber;
    }

    /**
     * Get end line number of current list
     * @param {object} doc CodeMirror doc instance
     * @param {number} endLineNumber end line number of selection
     * @returns {number|undefined}
     * @private
     */

  }, {
    key: '_getEndLineNumberOfList',
    value: function _getEndLineNumberOfList(doc, endLineNumber) {
      var lineCount = doc.lineCount();
      var lineNumber = void 0;

      for (lineNumber = endLineNumber; lineNumber < lineCount; lineNumber += 1) {
        var nextLine = doc.getLine(lineNumber + 1);
        if (!nextLine || !this._isListLine(nextLine)) {
          break;
        }
      }

      return lineNumber;
    }
  }]);

  return MdListManager;
}();

exports.default = MdListManager;

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileoverview Implements markdown textObject
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

/**
 * Class Markdown textObject
 */
var mdTextObject = function () {
  /**
   * Creates an instance of mdTextObject.
   * @param {MarkdownEditor} mde - MarkdownEditor instance
   * @param {object} range - range
   * @memberof mdTextObject
   */
  function mdTextObject(mde, range) {
    _classCallCheck(this, mdTextObject);

    this._mde = mde;

    this.setRange(range || mde.getRange());
  }

  /**
   * Set start
   * @memberof mdTextObject
   * @param {object} rangeStart Start of range
   * @private
   */


  _createClass(mdTextObject, [{
    key: '_setStart',
    value: function _setStart(rangeStart) {
      this._start = rangeStart;
    }

    /**
     * Set end
     * @private
     * @memberof mdTextObject
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
     * @private
     * @memberof mdTextObject
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
     * @private
     * @memberof mdTextObject
     * @param {object} range Range object
     */

  }, {
    key: 'setEndBeforeRange',
    value: function setEndBeforeRange(range) {
      this._setEnd(range.start);
    }

    /**
     * Expand startOffset by 1
     * @private
     * @memberof mdTextObject
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
     * @private
     * @memberof mdTextObject
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
     * @private
     * @memberof mdTextObject
     * @returns {{start: {line: number, ch: number}, end: {line: number, ch: number}}}
     */

  }, {
    key: 'getTextContent',
    value: function getTextContent() {
      return this._mde.getEditor().getRange(this._start, this._end);
    }

    /**
     * Replace current selection's content with given text content
     * @private
     * @memberof mdTextObject
     * @param {string} content Replacement content
     */

  }, {
    key: 'replaceContent',
    value: function replaceContent(content) {
      this._mde.getEditor().replaceRange(content, this._start, this._end, '+input');
    }

    /**
     * Delete current selection's content
     * @private
     * @memberof mdTextObject
     */

  }, {
    key: 'deleteContent',
    value: function deleteContent() {
      this._mde.getEditor().replaceRange('', this._start, this._end, '+delete');
    }

    /**
     * peek StartBeforeOffset
     * @private
     * @memberof mdTextObject
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

  return mdTextObject;
}();

exports.default = mdTextObject;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implments wysiwygEditor
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _domUtils = __webpack_require__(3);

var _domUtils2 = _interopRequireDefault(_domUtils);

var _wwClipboardManager = __webpack_require__(50);

var _wwClipboardManager2 = _interopRequireDefault(_wwClipboardManager);

var _wwListManager = __webpack_require__(52);

var _wwListManager2 = _interopRequireDefault(_wwListManager);

var _wwTaskManager = __webpack_require__(53);

var _wwTaskManager2 = _interopRequireDefault(_wwTaskManager);

var _wwTableManager = __webpack_require__(34);

var _wwTableManager2 = _interopRequireDefault(_wwTableManager);

var _wwTableSelectionManager = __webpack_require__(35);

var _wwTableSelectionManager2 = _interopRequireDefault(_wwTableSelectionManager);

var _wwHrManager = __webpack_require__(54);

var _wwHrManager2 = _interopRequireDefault(_wwHrManager);

var _wwPManager = __webpack_require__(55);

var _wwPManager2 = _interopRequireDefault(_wwPManager);

var _wwHeadingManager = __webpack_require__(56);

var _wwHeadingManager2 = _interopRequireDefault(_wwHeadingManager);

var _wwCodeBlockManager = __webpack_require__(36);

var _wwCodeBlockManager2 = _interopRequireDefault(_wwCodeBlockManager);

var _squireExt = __webpack_require__(57);

var _squireExt2 = _interopRequireDefault(_squireExt);

var _keyMapper = __webpack_require__(15);

var _keyMapper2 = _interopRequireDefault(_keyMapper);

var _wwTextObject = __webpack_require__(59);

var _wwTextObject2 = _interopRequireDefault(_wwTextObject);

var _componentManager = __webpack_require__(33);

var _componentManager2 = _interopRequireDefault(_componentManager);

var _codeBlockGadget = __webpack_require__(60);

var _codeBlockGadget2 = _interopRequireDefault(_codeBlockGadget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var keyMapper = _keyMapper2.default.getSharedInstance();

var FIND_EMPTY_LINE = /<(.+)>(<br>|<br \/>|<BR>|<BR \/>)<\/\1>/g,
    FIND_UNNECESSARY_BR = /(?:<br>|<br \/>|<BR>|<BR \/>)<\/(.+?)>/g,
    FIND_BLOCK_TAGNAME_RX = /\b(H[\d]|LI|P|BLOCKQUOTE|TD|PRE)\b/;

var EDITOR_CONTENT_CSS_CLASSNAME = 'tui-editor-contents';

var canObserveMutations = typeof MutationObserver !== 'undefined';

/**
 * Class WysiwygEditor
 */

var WysiwygEditor = function () {
  /**
   * Creates an instance of WysiwygEditor.
   * @param {jQuery} $el element to insert editor
   * @param {EventManager} eventManager EventManager instance
   * @param {object} [options={}] - option object
   *  @param {boolean} [options.useCommandShortcut=true] - whether to use squire command shortcuts
   * @memberof WysiwygEditor
   */
  function WysiwygEditor($el, eventManager) {
    var _this = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, WysiwygEditor);

    this.componentManager = new _componentManager2.default(this);
    this.eventManager = eventManager;
    this.$editorContainerEl = $el;

    this._height = 0;

    this._silentChange = false;

    this._keyEventHandlers = {};
    this._managers = {};

    this._options = _jquery2.default.extend({
      'useCommandShortcut': true
    }, options);

    this._initEvent();
    this._initDefaultKeyEventHandler();

    this.debouncedPostProcessForChange = _tuiCodeSnippet2.default.debounce(function () {
      return _this.postProcessForChange();
    }, 0);
  }

  /**
   * init
   * @memberof WysiwygEditor
   */


  _createClass(WysiwygEditor, [{
    key: 'init',
    value: function init() {
      var $editorBody = (0, _jquery2.default)('<div />');

      this.$editorContainerEl.append($editorBody);

      this.editor = new _squireExt2.default($editorBody[0], {
        blockTag: 'DIV',
        leafNodeNames: {
          'HR': false
        }
      });
      if (!this._options.useCommandShortcut) {
        this.editor.blockCommandShortcuts();
      }

      this._clipboardManager = new _wwClipboardManager2.default(this);
      this._initSquireEvent();
      this._clipboardManager.init();

      this.get$Body().addClass(EDITOR_CONTENT_CSS_CLASSNAME);
      this.$editorContainerEl.css('position', 'relative');

      this.codeBlockGadget = new _codeBlockGadget2.default({
        eventManager: this.eventManager,
        container: this.$editorContainerEl,
        wysiwygEditor: this
      });
    }

    /**
     * _preprocessForInlineElement
     * Seperate anchor tags with \u200B and replace blank space between <br> and <img to <br>$1
     * @param {string} html Inner html of content editable
     * @returns {string}
     * @memberof WysiwygEditor
     * @private
     */

  }, {
    key: '_preprocessForInlineElement',
    value: function _preprocessForInlineElement(html) {
      return html.replace(/<br>( *)<img/g, '<br><br>$1<img');
    }
    /**
     * _initEvent
     * Initialize EventManager event handler
     * @memberof WysiwygEditor
     * @private
     */

  }, {
    key: '_initEvent',
    value: function _initEvent() {
      var _this2 = this;

      this.eventManager.listen('wysiwygSetValueBefore', function (html) {
        return _this2._preprocessForInlineElement(html);
      });
      this.eventManager.listen('wysiwygKeyEvent', function (ev) {
        return _this2._runKeyEventHandlers(ev.data, ev.keyMap);
      });
      this.eventManager.listen('wysiwygRangeChangeAfter', function () {
        return _this2._scrollToRangeIfNeed();
      });
    }

    /**
     * addKeyEventHandler
     * Add key event handler
     * @memberof WysiwygEditor
     * @param {string} keyMap keyMap string
     * @param {function} handler handler
     */

  }, {
    key: 'addKeyEventHandler',
    value: function addKeyEventHandler(keyMap, handler) {
      if (!handler) {
        handler = keyMap;
        keyMap = 'DEFAULT';
      }

      if (!this._keyEventHandlers[keyMap]) {
        this._keyEventHandlers[keyMap] = [];
      }

      this._keyEventHandlers[keyMap].push(handler);
    }

    /**
     * REmove key event handler.
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
     * _runKeyEventHandlers
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
     * _initSquireEvent
     * Initialize squire event
     * @private
     */

  }, {
    key: '_initSquireEvent',
    value: function _initSquireEvent() {
      var _this3 = this;

      var squire = this.getEditor();
      var isNeedFirePostProcessForRangeChange = false;

      squire.addEventListener('copy', function (clipboardEvent) {
        _this3.eventManager.emit('copy', {
          source: 'wysiwyg',
          data: clipboardEvent
        });
        _tuiCodeSnippet2.default.debounce(function () {
          if (!_this3.isEditorValid()) {
            return;
          }

          _this3.eventManager.emit('copyAfter', {
            source: 'wysiwyg',
            data: clipboardEvent
          });
        })();
      });

      squire.addEventListener(_tuiCodeSnippet2.default.browser.msie ? 'beforecut' : 'cut', function (clipboardEvent) {
        _this3.eventManager.emit('cut', {
          source: 'wysiwyg',
          data: clipboardEvent
        });
        _tuiCodeSnippet2.default.debounce(function () {
          if (!_this3.isEditorValid()) {
            return;
          }

          _this3.eventManager.emit('cutAfter', {
            source: 'wysiwyg',
            data: clipboardEvent
          });
        })();
      });

      squire.addEventListener(_tuiCodeSnippet2.default.browser.msie ? 'beforepaste' : 'paste', function (clipboardEvent) {
        _this3.eventManager.emit('paste', {
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

        _this3.eventManager.emit('drop', {
          source: 'wysiwyg',
          data: ev
        });

        return false;
      });

      // change event will fired after range has been updated
      squire.addEventListener('input', _tuiCodeSnippet2.default.debounce(function () {
        if (!_this3.isEditorValid()) {
          return;
        }

        if (!_this3._silentChange) {
          var eventObj = {
            source: 'wysiwyg'
          };

          _this3.eventManager.emit('changeFromWysiwyg', eventObj);
          _this3.eventManager.emit('change', eventObj);
          _this3.eventManager.emit('contentChangedFromWysiwyg', _this3);
        } else {
          _this3._silentChange = false;
        }

        _this3.getEditor().preserveLastLine();
      }, 0));

      squire.addEventListener('keydown', function (keyboardEvent) {
        var range = _this3.getEditor().getSelection();

        if (!range.collapsed) {
          isNeedFirePostProcessForRangeChange = true;
        }

        _this3.eventManager.emit('keydown', {
          source: 'wysiwyg',
          data: keyboardEvent
        });

        _this3._onKeyDown(keyboardEvent);
      });

      if (_tuiCodeSnippet2.default.browser.firefox) {
        squire.addEventListener('keypress', function (keyboardEvent) {
          var keyCode = keyboardEvent.keyCode;


          if (keyCode === 13 || keyCode === 9) {
            var range = _this3.getEditor().getSelection();

            if (!range.collapsed) {
              isNeedFirePostProcessForRangeChange = true;
            }

            _this3.eventManager.emit('keydown', {
              source: 'wysiwyg',
              data: keyboardEvent
            });

            _this3._onKeyDown(keyboardEvent);
          }
        });

        // firefox produces shattered text nodes
        squire.addEventListener('keyup', function () {
          var range = _this3.getRange();

          if (_domUtils2.default.isTextNode(range.commonAncestorContainer) && _domUtils2.default.isTextNode(range.commonAncestorContainer.previousSibling)) {
            var prevLen = range.commonAncestorContainer.previousSibling.length;
            var curEl = range.commonAncestorContainer;

            range.commonAncestorContainer.previousSibling.appendData(range.commonAncestorContainer.data);

            range.setStart(range.commonAncestorContainer.previousSibling, prevLen + range.startOffset);
            range.collapse(true);

            curEl.parentNode.removeChild(curEl);

            _this3.setRange(range);
            range.detach();
          }
        });
      }

      squire.addEventListener('keyup', function (keyboardEvent) {
        if (isNeedFirePostProcessForRangeChange) {
          _this3.debouncedPostProcessForChange();
          isNeedFirePostProcessForRangeChange = false;
        }

        _this3.eventManager.emit('keyup', {
          source: 'wysiwyg',
          data: keyboardEvent
        });
      });

      this.$editorContainerEl.on('scroll', function (ev) {
        _this3.eventManager.emit('scroll', {
          source: 'wysiwyg',
          data: ev
        });
      });

      squire.addEventListener('click', function (ev) {
        _this3.eventManager.emit('click', {
          source: 'wysiwyg',
          data: ev
        });
      });

      squire.addEventListener('mousedown', function (ev) {
        _this3.eventManager.emit('mousedown', {
          source: 'wysiwyg',
          data: ev
        });
      });

      squire.addEventListener('mouseover', function (ev) {
        _this3.eventManager.emit('mouseover', {
          source: 'wysiwyg',
          data: ev
        });
      });

      squire.addEventListener('mouseout', function (ev) {
        _this3.eventManager.emit('mouseout', {
          source: 'wysiwyg',
          data: ev
        });
      });

      squire.addEventListener('mouseup', function (ev) {
        _this3.eventManager.emit('mouseup', {
          source: 'wysiwyg',
          data: ev
        });
      });

      squire.addEventListener('contextmenu', function (ev) {
        _this3.eventManager.emit('contextmenu', {
          source: 'wysiwyg',
          data: ev
        });
      });

      squire.addEventListener('focus', function () {
        _this3.eventManager.emit('focus', {
          source: 'wysiwyg'
        });
      });

      squire.addEventListener('blur', function () {
        _this3.eventManager.emit('blur', {
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
          list: /LI(?!.task-list-item)/.test(_this3._getLastLiString(data.path)),
          task: /LI.task-list-item/.test(_this3._getLastLiString(data.path)),
          source: 'wysiwyg'
        };

        _this3.eventManager.emit('stateChange', state);
      });

      squire.addEventListener('willPaste', function (ev) {
        _this3.eventManager.emit('willPaste', {
          source: 'wysiwyg',
          data: ev
        });
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
     * _initDefaultKeyEventHandler
     * Initialize default event handler
     * @private
     */

  }, {
    key: '_initDefaultKeyEventHandler',
    value: function _initDefaultKeyEventHandler() {
      var _this4 = this;

      this.addKeyEventHandler('ENTER', function (ev, range) {
        if (_this4._isInOrphanText(range)) {
          // We need this cuz input text right after table make orphan text in webkit
          _this4.defer(function () {
            _this4._wrapDefaultBlockToOrphanTexts();
            _this4.breakToNewDefaultBlock(range, 'before');
          });
        }

        _this4.defer(function () {
          _this4._scrollToRangeIfNeed();
        });
      });

      this.addKeyEventHandler('TAB', function (ev) {
        var sq = _this4.getEditor();
        var range = sq.getSelection();
        var isAbleToInput4Spaces = range.collapsed && _this4._isCursorNotInRestrictedAreaOfTabAction(sq);
        var isTextSelection = !range.collapsed && _domUtils2.default.isTextNode(range.commonAncestorContainer);

        ev.preventDefault();
        if (isAbleToInput4Spaces || isTextSelection) {
          sq.insertPlainText('\xA0\xA0\xA0\xA0');

          return false;
        }

        return true;
      });
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
     * Scroll editor area to current cursor position if need
     * @private
     */

  }, {
    key: '_scrollToRangeIfNeed',
    value: function _scrollToRangeIfNeed() {
      var $editorContainerEl = this.$editorContainerEl;
      var range = this.getRange();
      var cursorTop = this.getEditor().getCursorPosition(range).top - $editorContainerEl.offset().top;

      if (cursorTop >= $editorContainerEl.height()) {
        var target = range.endContainer;
        if (!(target instanceof Element)) {
          target = target.parentNode;
        }
        target.scrollIntoView(false);
      }
    }

    /**
     * _isInOrphanText
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
     * _wrapDefaultBlockTo
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
     * @this Node
     * @returns {boolean} true or not
     */

  }, {
    key: 'findTextNodeFilter',
    value: function findTextNodeFilter() {
      return this.nodeType === Node.TEXT_NODE;
    }

    /**
     * _joinSplitedTextNodes
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
     * saveSelection
     * Save current selection before modification
     * @memberof WysiwygEditor
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
     * restoreSavedSelection
     * Restore saved selection
     * @memberof WysiwygEditor
     */

  }, {
    key: 'restoreSavedSelection',
    value: function restoreSavedSelection() {
      this.setRange(this.getEditor()._getRangeAndRemoveBookmark());
    }

    /**
     * reset
     * Reset wysiwyg editor
     * @memberof WysiwygEditor
     */

  }, {
    key: 'reset',
    value: function reset() {
      this.setValue('');
    }

    /**
     * changeBlockFormatTo
     * Change current range block format to passed tag
     * @memberof WysiwygEditor
     * @param {string} targetTagName Target element tag name
     */

  }, {
    key: 'changeBlockFormatTo',
    value: function changeBlockFormatTo(targetTagName) {
      this.getEditor().changeBlockFormatTo(targetTagName);
      this.eventManager.emit('wysiwygRangeChangeAfter', this);
    }

    /**
     * makeEmptyBlockCurrentSelection
     * Make empty block to current selection
     * @memberof WysiwygEditor
     */

  }, {
    key: 'makeEmptyBlockCurrentSelection',
    value: function makeEmptyBlockCurrentSelection() {
      var _this5 = this;

      this.getEditor().modifyBlocks(function (frag) {
        if (!frag.textContent) {
          frag = _this5.getEditor().createDefaultBlock();
        }

        return frag;
      });
    }

    /**
     * focus
     * Focus to editor
     * @memberof WysiwygEditor
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
     * blur
     * Remove focus of editor
     * @memberof WysiwygEditor
     */

  }, {
    key: 'blur',
    value: function blur() {
      this.editor.blur();
    }

    /**
     * remove
     * Remove wysiwyg editor
     * @memberof WysiwygEditor
     */

  }, {
    key: 'remove',
    value: function remove() {
      this.getEditor().destroy();

      this.editor = null;
      this.$body = null;
      this.eventManager = null;
    }

    /**
     * setHeight
     * Set editor height
     * @memberof WysiwygEditor
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
     * set min height
     * @param {number} minHeight - min height in px
     * @memberof WysiwygEditor
     */

  }, {
    key: 'setMinHeight',
    value: function setMinHeight(minHeight) {
      var editorBody = this.get$Body().get(0);
      editorBody.style.minHeight = minHeight + 'px';
    }

    /**
     * setValue
     * Set value to wysiwyg editor
     * @memberof WysiwygEditor
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
     * insert given text to cursor position or selected area
     * @param {string} text - text string to insert
     * @memberof WysiwygEditor
     */

  }, {
    key: 'insertText',
    value: function insertText(text) {
      this.editor.insertPlainText(text);
    }

    /**
     * getValue
     * Get value of wysiwyg editor
     * @memberof WysiwygEditor
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

      // remove unnecessary brs
      html = html.replace(FIND_UNNECESSARY_BR, '</$1>');

      // remove contenteditable block, in this case div
      html = html.replace(/<div[^>]*>/g, '');
      html = html.replace(/<\/div>/g, '<br />');

      html = this.eventManager.emitReduce('wysiwygProcessHTMLText', html);

      return html;
    }

    /**
     * _prepareGetHTML
     * Prepare before get html
     * @memberof WysiwygEditor
     * @private
     */

  }, {
    key: '_prepareGetHTML',
    value: function _prepareGetHTML() {
      var _this6 = this;

      this.getEditor().modifyDocument(function () {
        _this6._joinSplitedTextNodes();
        _this6.eventManager.emit('wysiwygGetValueBefore', _this6);
      });
    }

    /**
     * postProcessForChange
     * @memberof WysiwygEditor
     */

  }, {
    key: 'postProcessForChange',
    value: function postProcessForChange() {
      var _this7 = this;

      if (!this.isEditorValid()) {
        return;
      }

      this.getEditor().modifyDocument(function () {
        _this7.eventManager.emit('wysiwygRangeChangeAfter', _this7);
      });
    }

    /**
     * readySilentChange
     * Ready to silent change
     * @memberof WysiwygEditor
     */

  }, {
    key: 'readySilentChange',
    value: function readySilentChange() {
      if (canObserveMutations && !this.getEditor().isIgnoreChange()) {
        this._silentChange = true;
      }
    }

    /**
     * getEditor
     * Get squire
     * @memberof WysiwygEditor
     * @returns {SquireExt} squire
     */

  }, {
    key: 'getEditor',
    value: function getEditor() {
      return this.editor;
    }

    /**
     * replaceSelection
     * Replace text of passed range
     * @memberof WysiwygEditor
     * @param {string} content Content for change current selection
     * @param {Range} range range
     */

  }, {
    key: 'replaceSelection',
    value: function replaceSelection(content, range) {
      this.getEditor().replaceSelection(content, range);
    }

    /**
     * replaceRelativeOffset
     * Replace content by relative offset
     * @memberof WysiwygEditor
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
     * addWidget
     * Add widget to selection
     * @memberof WysiwygEditor
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
        top: pos.top - editorContainerPos.top,
        left: pos.left - editorContainerPos.left
      });
    }

    /**
     * get$Body
     * Get jQuery wrapped body container of Squire
     * @memberof WysiwygEditor
     * @returns {JQuery} jquery body
     */

  }, {
    key: 'get$Body',
    value: function get$Body() {
      return this.getEditor().get$Body();
    }

    /**
     * hasFormatWithRx
     * Check with given regexp whether current path has some format or not
     * @memberof WysiwygEditor
     * @param {RegExp} rx Regexp
     * @returns {boolean} Match result
     */

  }, {
    key: 'hasFormatWithRx',
    value: function hasFormatWithRx(rx) {
      return this.getEditor().getPath().match(rx);
    }

    /**
     * breakToNewDefaultBlock
     * Break line to new default block from passed range
     * @memberof WysiwygEditor
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
     * replaceContentText
     * Replace textContet of node
     * @memberof WysiwygEditor
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
     * unwrapBlockTag
     * Unwrap Block tag of current range
     * @memberof WysiwygEditor
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
     * Set cursor position to end
     * @memberof WysiwygEditor
     */

  }, {
    key: 'moveCursorToEnd',
    value: function moveCursorToEnd() {
      this.getEditor().moveCursorToEnd();
      var contentNodes = this.get$Body().get(0).childNodes;
      if (contentNodes.length > 0) {
        contentNodes[contentNodes.length - 1].scrollIntoView(false);
      }
      this._correctRangeAfterMoveCursor('end');
    }

    /**
     * Set cursor position to start
     * @memberof WysiwygEditor
     */

  }, {
    key: 'moveCursorToStart',
    value: function moveCursorToStart() {
      this.getEditor().moveCursorToStart();
      this.scrollTop(0);
    }

    /**
     * Set cursor position to start
     * @memberof WysiwygEditor
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
     * _correctRangeAfterMoveCursor
     * For arrange Range after moveCursorToEnd api invocation. Squire has bug in Firefox, IE.
     * @memberof WysiwygEditor
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
     * @memberof WysiwygEditor
     * @returns {Range}
     */

  }, {
    key: 'getRange',
    value: function getRange() {
      return this.getEditor().getSelection().cloneRange();
    }

    /**
     * set range
     * @param {Range} range - range to set
     * @memberof WysiwygEditor
     */

  }, {
    key: 'setRange',
    value: function setRange(range) {
      this.getEditor().setSelection(range);
    }

    /**
     * Get text object of current range
     * @memberof WysiwygEditor
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
      var _this8 = this;

      var delay = delayOffset ? delayOffset : 0;

      setTimeout(function () {
        if (_this8.isEditorValid()) {
          callback(_this8);
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
     * @memberof WysiwygEditor
     * @param {jQuery} $el Container element for editor
     * @param {EventManager} eventManager EventManager instance
     * @param {object} [options={}] - option object
     *  @param {boolean} [options.useCommandShortcut=true] - whether to use squire command shortcuts
     * @returns {WysiwygEditor} wysiwygEditor
     */

  }], [{
    key: 'factory',
    value: function factory($el, eventManager, options) {
      var wwe = new WysiwygEditor($el, eventManager, options);

      wwe.init();

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
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements wysiwyg editor clipboard manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _domUtils = __webpack_require__(3);

var _domUtils2 = _interopRequireDefault(_domUtils);

var _wwPasteContentHelper = __webpack_require__(51);

var _wwPasteContentHelper2 = _interopRequireDefault(_wwPasteContentHelper);

var _i18n = __webpack_require__(4);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PASTE_TABLE_BOOKMARK = 'tui-paste-table-bookmark';
var PASTE_TABLE_CELL_BOOKMARK = 'tui-paste-table-cell-bookmark';

/**
 * Class WwClipboardManager
 */

var WwClipboardManager = function () {
  /**
   * Creates an instance of WwClipboardManager.
   * @param {WysiwygEditor} wwe - WysiwygEditor instance
   * @memberof WwClipboardManager
   */
  function WwClipboardManager(wwe) {
    _classCallCheck(this, WwClipboardManager);

    this.wwe = wwe;
    this._pch = new _wwPasteContentHelper2.default(this.wwe);
    this._selectedSellCount = 0;
    this._$clipboardArea = null;
  }

  /**
   * init
   * initialize
   * @memberof WwClipboardManager
   */


  _createClass(WwClipboardManager, [{
    key: 'init',
    value: function init() {
      var _this = this;

      this.wwe.eventManager.listen('willPaste', function (ev) {
        return _this._onWillPaste(ev.data);
      });
      this.wwe.eventManager.listen('copy', this._onCopyCut.bind(this));
      this.wwe.eventManager.listen('copyAfter', this._onCopyAfter.bind(this));
      this.wwe.eventManager.listen('cut', this._onCopyCut.bind(this));
      this.wwe.eventManager.listen('cutAfter', this._onCutAfter.bind(this));
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
        tableManager.removeClassAttrbuteFromAllCellsIfNeed();

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
  }, {
    key: '_onWillPaste',
    value: function _onWillPaste(pasteData) {
      var _this2 = this;

      var $clipboardContainer = (0, _jquery2.default)('<div>').append(pasteData.fragment.cloneNode(true));

      this._setTableBookmark($clipboardContainer);

      if (this._pasteToTable($clipboardContainer)) {
        pasteData.preventDefault();
      } else {
        this._preparePaste($clipboardContainer);
        this._setTableBookmark($clipboardContainer);

        pasteData.fragment = document.createDocumentFragment();
        (0, _jquery2.default)($clipboardContainer[0].childNodes).each(function (index, element) {
          pasteData.fragment.appendChild(element);
        });
      }

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
     * Paste to table.
     * @param {jQuery} $clipboardContainer - clibpard container
     * @returns {boolean} whether processed or not
     * @private
     */

  }, {
    key: '_pasteToTable',
    value: function _pasteToTable($clipboardContainer) {
      var tableManager = this.wwe.componentManager.getManager('table');
      var tableSelectionManager = this.wwe.componentManager.getManager('tableSelection');
      var range = this.wwe.getEditor().getSelection();
      var pastingToTable = tableManager.isInTable(range);

      var _$clipboardContainer$ = $clipboardContainer.get(0),
          childNodes = _$clipboardContainer$.childNodes;

      var containsOneTableOnly = childNodes.length === 1 && childNodes[0].nodeName === 'TABLE';
      var processed = false;

      if (pastingToTable) {
        if (containsOneTableOnly) {
          tableManager.pasteClipboardData($clipboardContainer.first());
          $clipboardContainer.html(''); // drains clipboard data as we've pasted everything here.
          processed = true;
        } else if (tableSelectionManager.getSelectedCells().length) {
          alert(_i18n2.default.get('Cannot paste values ​​other than a table in the cell selection state'));
          $clipboardContainer.html(''); // drains clipboard data
          processed = true;
        }
      }

      return processed;
    }

    /**
     * Prepare paste.
     * @param {jQuery} $clipboardContainer - temporary jQuery container for clipboard contents
     * @private
     */

  }, {
    key: '_preparePaste',
    value: function _preparePaste($clipboardContainer) {
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
     * @memberof WwClipboardManager
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
     * _extendRange
     * extend range if need
     * @memberof WwClipboardManager
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
     * @memberof WwClipboardManager
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
     * @memberof WwClipboardManager
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
     * _isWholeCommonAncestorContainerSelected
     * Check whether whole commonAncestorContainter textContent selected or not
     * @memberof WwClipboardManager
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
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements WwPasteContentHelper
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _domUtils = __webpack_require__(3);

var _domUtils2 = _interopRequireDefault(_domUtils);

var _htmlSanitizer = __webpack_require__(11);

var _htmlSanitizer2 = _interopRequireDefault(_htmlSanitizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class WwPasteContentHelper
 */
var WwPasteContentHelper = function () {
  /**
   * Creates an instance of WwPasteContentHelper.
   * @param {WysiwygEditor} wwe - wysiwygEditor instance
   * @memberof WwPasteContentHelper
   */
  function WwPasteContentHelper(wwe) {
    _classCallCheck(this, WwPasteContentHelper);

    this.wwe = wwe;
  }

  /**
   * Process paste data before paste
   * @memberof WwPasteContentHelper
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

      // prepare to paste as inline of first node if possible
      if (childNodes.length && childNodes[0].tagName === 'DIV') {
        $tempContainer.append(this._unwrapFragmentFirstChildForPasteAsInline(childNodes[0]));
        childNodes.shift();
      }

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
     * @memberof WwPasteContentHelper
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
        var isInlineNode = /^(SPAN|A|CODE|EM|I|STRONG|B|S|ABBR|ACRONYM|CITE|DFN|KBD|SAMP|VAR|BDO|Q|SUB|SUP)$/ig.test(node.tagName);
        /* eslint-enable max-len */

        if (isTextNode || isInlineNode) {
          if (!currentDiv) {
            currentDiv = document.createElement('div');
            $tempContainer.append(currentDiv);
            // newFrag.appendChild(currentDiv);
          }

          currentDiv.appendChild(node);
        } else {
          if (currentDiv && currentDiv.lastChild.tagName !== 'BR') {
            currentDiv.appendChild((0, _jquery2.default)('<br/>')[0]);
          }

          currentDiv = null;
          $tempContainer.append(node);
          // newFrag.appendChild(node);
        }
      });

      return $tempContainer.html();
    }

    /**
     * Processing paste data after paste
     * @param {jQuery} $container - clipboard container
     * @memberof WwPasteContentHelper
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
     * @memberof WwPasteContentHelper
     * @private
     * @param {jQuery} $container - clipboard container
     */

  }, {
    key: '_preElementAid',
    value: function _preElementAid($container) {
      var wwCodeblockManager = this.wwe.componentManager.getManager('codeblock');

      wwCodeblockManager.splitCodeblockToEachLine($container);
    }

    /**
     * Unwrap span children of document fragment with div element
     * @param {jQuery} $container - clipboard container
     * @memberof WwPasteContentHelper
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
      var $leafElements = $container.find(':not(:has(*))').not('b,s,i,em,code,span');

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
     * @memberof WwPasteContentHelper
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

        $blockElement.replaceWith($blockElement.html());
      });
    }

    /**
     * Remove inline style
     * @param {Node} node Node for remove style attribute
     * @memberof WwPasteContentHelper
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
     * @memberof WwPasteContentHelper
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
     * @memberof WwPasteContentHelper
     * @private
     * @param {Node} node Pasting DocumentFragment
     * @returns {NodeList}
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
     * @memberof WwPasteContentHelper
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
     * @memberof WwPasteContentHelper
     * @private
     */

  }, {
    key: '_tableElementAid',
    value: function _tableElementAid($container) {
      this._completeTableIfNeed($container);
      this._updateTableIDClassName($container);
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
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements wysiwyg list manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _domUtils = __webpack_require__(3);

var _domUtils2 = _interopRequireDefault(_domUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FIND_LI_ELEMENT = /<li/i;
var DIV_OR_LI = 'DIV,LI';
var UL_OR_OL = 'OL,UL';

/**
 * Class WwListManager
 */

var WwListManager = function () {
  /**
   * Creates an instance of WwListManager.
   * @param {WysiwygEditor} wwe - WysiwygEditor instance
   * @memberof WwListManager
   */
  function WwListManager(wwe) {
    _classCallCheck(this, WwListManager);

    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @memberof WwListManager#
     * @type {string}
     */
    this.name = 'list';

    this._init();
  }

  /**
   * _init
   * Initialize
   * @memberof WwListManager
   * @private
   */


  _createClass(WwListManager, [{
    key: '_init',
    value: function _init() {
      this._initEvent();
      this._initKeyHandler();
    }

    /**
     * _initEvent
     * Initialize event
     * @memberof WwListManager
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
        html = _this._insertBlankToBetweenSameList(html);
        html = _this._convertFromArbitraryNestingList(html);

        return html;
      });

      this.eventManager.listen('convertorAfterHtmlToMarkdownConverted', function (markdown) {
        return markdown.replace(/:BLANK_LINE:\n/g, '');
      });
    }
  }, {
    key: '_initKeyHandler',
    value: function _initKeyHandler() {
      var _this2 = this;

      this.wwe.addKeyEventHandler('TAB', function (ev, range) {
        var isNeedNext = void 0;

        if (range.collapsed) {
          if (_this2.wwe.getEditor().hasFormat('LI')) {
            ev.preventDefault();
            _this2.eventManager.emit('command', 'IncreaseDepth');

            isNeedNext = false;
          }
        }

        return isNeedNext;
      });

      this.wwe.addKeyEventHandler('SHIFT+TAB', function (ev, range) {
        var isNeedNext = void 0;

        if (range.collapsed) {
          if (_this2.wwe.getEditor().hasFormat('LI')) {
            ev.preventDefault();
            var $ul = (0, _jquery2.default)(range.startContainer).closest('li').children(UL_OR_OL);

            _this2.eventManager.emit('command', 'DecreaseDepth');

            if ($ul.length && !$ul.prev().length) {
              _this2._removeBranchList($ul);
            }

            isNeedNext = false;
          }
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
     * @memberof WwListManager
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
     * @memberof WwListManager
     * @private
     * @param {jQuery|HTMLElement} $root root to remove branch list
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
     * @memberof WwListManager
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
  }, {
    key: '_insertBlankToBetweenSameList',
    value: function _insertBlankToBetweenSameList(html) {
      return html.replace(/<\/(ul|ol)>(<br \/>|<br>){0,}<\1>/g, '</$1>:BLANK_LINE:<$1>');
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
        while (prevLI.tagName !== 'LI') {
          prevLI = prevLI.previousElementSibling;
        }

        prevLI.appendChild(nestedList);

        nestedList = wrapperDiv.querySelector(NESTED_LIST_QUERY);
      }

      return wrapperDiv.innerHTML;
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
     * @ignore
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
     * @ignore
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
  }]);

  return WwListManager;
}();

exports.default = WwListManager;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements wysiwyg task manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TASK_CLASS_NAME = 'task-list-item';
var TASK_ATTR_NAME = 'data-te-task';
var TASK_CHECKED_CLASS_NAME = 'checked';

/**
 * Class WwTaskManager
 */

var WwTaskManager = function () {
  /**
   * Creates an instance of WwTaskManager.
   * @param {WysiwygEditor} wwe - WysiwygEditor instance
   * @memberof WwTaskManager
   */
  function WwTaskManager(wwe) {
    _classCallCheck(this, WwTaskManager);

    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @memberof WwTaskManager#
     * @type {string}
     */
    this.name = 'task';

    this._init();
  }

  /**
   * _init
   * Init
   * @memberof WwTaskManager
   * @private
   */


  _createClass(WwTaskManager, [{
    key: '_init',
    value: function _init() {
      this._initKeyHandler();
      this._initEvent();

      this.wwe.getEditor().addEventListener('mousedown', function (ev) {
        var isOnTaskBox = ev.offsetX < 18 && ev.offsetY < 18;

        if (ev.target.hasAttribute(TASK_ATTR_NAME) && isOnTaskBox) {
          (0, _jquery2.default)(ev.target).toggleClass(TASK_CHECKED_CLASS_NAME);
        }
      });
    }

    /**
     * _initEvent
     * Initialize event
     * @memberof WwTaskManager
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
     * _initKeyHandler
     * Initialize key event handler
     * @memberof WwTaskManager
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
     * isInTaskList
     * Check whether passed range is in task list or not
     * @param {Range} range range
     * @returns {boolean} result
     * @memberof WwTaskManager
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
     * unformatTask
     * Unforamt task
     * @param {Node} node target
     * @memberof WwTaskManager
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
     * formatTask
     * Format task
     * @param {Node} node target
     * @memberof WwTaskManager
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
     * _formatTaskIfNeed
     * Format task if current range has task class name
     * @memberof WwTaskManager
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
     * _removeTaskListClass
     * Remove tasklist class
     * @memberof WwTaskManager
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
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements wysiwyg hr manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _domUtils = __webpack_require__(3);

var _domUtils2 = _interopRequireDefault(_domUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class WwHrManager
 */
var WwHrManager = function () {
  /**
   * Creates an instance of WwHrManager.
   * @param {WysiwygEditor} wwe - WysiwygEditor instance
   * @memberof WwHrManager
   */
  function WwHrManager(wwe) {
    _classCallCheck(this, WwHrManager);

    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @memberof WwHrManager#
     * @type {string}
     */
    this.name = 'hr';

    this._init();
  }

  /**
   * _init
   * Initialize
   * @memberof WwHrManager
   * @private
   */


  _createClass(WwHrManager, [{
    key: '_init',
    value: function _init() {
      this._initKeyHandler();
      this._initEvent();
    }

    /**
     * _initEvent
     * Initialize eventmanager event
     * @memberof WwHrManager
     * @private
     */

  }, {
    key: '_initEvent',
    value: function _initEvent() {
      var _this = this;

      this.eventManager.listen('wysiwygSetValueAfter', function () {
        _this._unwrapDivOnHr();
      });

      this.eventManager.listen('wysiwygGetValueBefore', function () {
        _this._wrapDefaultBlockToOrphanTexts();
      });
    }

    /**
     * _initKeyHandler
     * Initialize key event handler
     * @memberof WwHrManager
     * @private
     */

  }, {
    key: '_initKeyHandler',
    value: function _initKeyHandler() {
      var _this2 = this;

      this.wwe.addKeyEventHandler(function (ev, range) {
        return _this2._onTypedInHr(range);
      });

      this.wwe.addKeyEventHandler('ENTER', function (ev, range) {
        if (range.collapsed) {
          return _this2._removeHrOnEnter(range, ev);
        }

        return true;
      });

      this.wwe.addKeyEventHandler('BACK_SPACE', function (ev, range) {
        if (range.collapsed) {
          return _this2._removeHrOnBackspace(range, ev);
        }

        return true;
      });
    }

    /**
     * _isInHr
     * Check whether passed range is in hr or not
     * @param {Range} range range
     * @returns {boolean} result
     * @memberof WwHrManager
     * @private
     */

  }, {
    key: '_isInHr',
    value: function _isInHr(range) {
      return _domUtils2.default.getNodeName(range.startContainer.childNodes[range.startOffset]) === 'HR';
    }

    /**
     * _isNearHr
     * Check whether passed range is near hr or not
     * @param {Range} range range
     * @returns {boolean} result
     * @memberof WwHrManager
     * @private
     */

  }, {
    key: '_isNearHr',
    value: function _isNearHr(range) {
      var prevNode = _domUtils2.default.getChildNodeByOffset(range.startContainer, range.startOffset - 1);

      return _domUtils2.default.getNodeName(prevNode) === 'HR';
    }

    /**
     * Handler for delete HR when user typing within
     * @param {Range} range Range object
     * @memberof WwHrManager
     * @private
     */

  }, {
    key: '_onTypedInHr',
    value: function _onTypedInHr(range) {
      var _this3 = this;

      // in case user try to input above hr
      if (this._isInHr(range) || this._isNearHr(range)) {
        this.wwe.defer(function (wwe) {
          wwe.saveSelection();
          _this3._wrapDefaultBlockToOrphanTexts();
          wwe.restoreSavedSelection();
        });
      }
    }

    /**
     * _removeHrOnEnter
     * Remove hr if need on enter
     * @param {Range} range range
     * @param {Event} ev event
     * @returns {boolean} return true if hr was removed
     * @memberof WwHrManager
     * @private
     */

  }, {
    key: '_removeHrOnEnter',
    value: function _removeHrOnEnter(range, ev) {
      var hrSuspect = void 0,
          blockPosition = void 0;

      if (this._isInHr(range)) {
        hrSuspect = _domUtils2.default.getChildNodeByOffset(range.startContainer, range.startOffset);
      } else if (this._isNearHr(range)) {
        hrSuspect = _domUtils2.default.getChildNodeByOffset(range.startContainer, range.startOffset - 1);
        blockPosition = 'before';
      }

      return this._changeHrToNewDefaultBlock(hrSuspect, range, ev, blockPosition);
    }

    /**
     * _removeHrOnBackspace
     * Remove hr if need on backspace
     * @param {Range} range range
     * @param {Event} ev event
     * @returns {boolean} return true if hr was removed
     * @memberof WwHrManager
     * @private
     */

  }, {
    key: '_removeHrOnBackspace',
    value: function _removeHrOnBackspace(range, ev) {
      var hrSuspect = void 0,
          blockPosition = void 0;

      if (this._isInHr(range)) {
        hrSuspect = _domUtils2.default.getChildNodeByOffset(range.startContainer, range.startOffset);
      } else if (range.startOffset === 0) {
        hrSuspect = _domUtils2.default.getTopPrevNodeUnder(range.startContainer, this.wwe.get$Body()[0]);
        blockPosition = 'none';
      } else if (this._isNearHr(range)) {
        hrSuspect = _domUtils2.default.getChildNodeByOffset(range.startContainer, range.startOffset - 1);
        blockPosition = 'before';
      }

      return this._changeHrToNewDefaultBlock(hrSuspect, range, ev, blockPosition);
    }

    /**
     * _changeHrToNewDefaultBlock
     * Remove hr and add new default block then set range to it
     * @param {Node} hrSuspect Node could be hr
     * @param {Range} range range
     * @param {Event} ev event
     * @param {strong} newBlockPosition new default block add position
     * @returns {boolean} return true if hr was removed
     * @memberof WwHrManager
     * @private
     */

  }, {
    key: '_changeHrToNewDefaultBlock',
    value: function _changeHrToNewDefaultBlock(hrSuspect, range, ev, newBlockPosition) {
      if (hrSuspect && _domUtils2.default.getNodeName(hrSuspect) === 'HR') {
        ev.preventDefault();

        if (newBlockPosition !== 'none') {
          this.wwe.breakToNewDefaultBlock(range, newBlockPosition);
        }

        (0, _jquery2.default)(hrSuspect).remove();

        return false;
      }

      return true;
    }

    /**
     * _unwrapDivOnHr
     * Unwrap default block on hr
     * @memberof WwHrManager
     * @private
     */

  }, {
    key: '_unwrapDivOnHr',
    value: function _unwrapDivOnHr() {
      var editorContentBody = this.wwe.get$Body().get(0);
      this.wwe.get$Body().find('hr').each(function (index, node) {
        var parentDiv = (0, _jquery2.default)(node).parent('div');
        if (parentDiv[0] !== editorContentBody) {
          parentDiv.find('br').remove();
          (0, _jquery2.default)(node).unwrap();
        }
      });
    }

    /**
     * _wrapDefaultBlockToOrphanTexts
     * Wrap default block to orphan texts
     * mainly, this is used for orphan text that made by controlling hr
     * @memberof WwHrManager
     * @private
     */

  }, {
    key: '_wrapDefaultBlockToOrphanTexts',
    value: function _wrapDefaultBlockToOrphanTexts() {
      var textNodes = this.wwe.get$Body().contents().filter(findTextNodeFilter);

      textNodes.each(function (i, node) {
        (0, _jquery2.default)(node).wrap('<div />');
      });
    }
  }]);

  return WwHrManager;
}();

/**
 * findTextNodeFilter
 * @function
 * @this Node
 * @returns {boolean}
 * @ignore
 */


function findTextNodeFilter() {
  return this.nodeType === Node.TEXT_NODE;
}

exports.default = WwHrManager;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements wysiwyg p tag manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class WwPManager
 */
var WwPManager = function () {
  /**
   * Creates an instance of WwPManager.
   * @param {WysiwygEditor} wwe - wysiwygEditor instance
   * @memberof WwPManager
   */
  function WwPManager(wwe) {
    _classCallCheck(this, WwPManager);

    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @memberof WwPManager#
     * @type {string}
     */
    this.name = 'p';

    this._initEvent();
  }

  /**
   * _initEvent
   * Initialize event
   * @memberof WwPManager
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
     * _ensurePtagContentWrappedWithDiv
     * Wrap new line inside P tag to DIV, and additional empty line added within too
     * @memberof WwPManager
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
     * _unwrapPtags
     * Unwrap P tag
     * @memberof WwPManager
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
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements wysiwyg heading manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _domUtils = __webpack_require__(3);

var _domUtils2 = _interopRequireDefault(_domUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FIND_HEADING_RX = /h[\d]/i;

/**
 * Class WwHeadingManager
 */

var WwHeadingManager = function () {
  /**
   * Creates an instance of WwHeadingManager.
   * @param {WysiwygEditor} wwe - WysiwygEditor instance
   * @memberof WwHeadingManager
   */
  function WwHeadingManager(wwe) {
    _classCallCheck(this, WwHeadingManager);

    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @memberof WwHeadingManager#
     * @type {string}
     */
    this.name = 'heading';

    this._init();
  }

  /**
   * _init
   * Initialize
   * @memberof WwHeadingManager
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
     * _initKeyHandler
     * Initialize key event handler
     * @memberof WwHeadingManager
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
     * _wrapDefaultBlockToHeadingInner
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
     * _unwrapHeading
     * Unwrap heading
     * @memberof WwHeadingManager
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
     * _onEnter
     * Enter key handler
     * @memberof WwHeadingManager
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
     * _insertEmptyBlockToPrevious
     * Insert empty block to previous of passed range
     * @memberof WwHeadingManager
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
     * _removePrevTopNodeIfNeed
     * Remove previous top node if need
     * @memberof WwHeadingManager
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
/* 57 */
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

var _squireRte = __webpack_require__(58);

var _squireRte2 = _interopRequireDefault(_squireRte);

var _domUtils = __webpack_require__(3);

var _domUtils2 = _interopRequireDefault(_domUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements squire extension
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var FIND_BLOCK_TAGNAME_RX = /\b(H[\d]|LI|P|BLOCKQUOTE|TD)\b/;
var isIElt11 = /Trident\/[456]\./.test(navigator.userAgent);

/**
 * Class SquireExt
 * @extends {Squire}
 */

var SquireExt = function (_Squire) {
  _inherits(SquireExt, _Squire);

  /**
   * Creates an instance of SquireExt.
   * @augments Squire
   * @memberof SquireExt
   */
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
   * _decorateHandlerToCancelable
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

      var isMac = /Mac/.test(navigator.platform);
      var meta = isMac ? 'meta' : 'ctrl';
      var keys = ['b', 'i', 'u', 'shift-7', 'shift-5', 'shift-6', 'shift-8', 'shift-9', '[', ']'];

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
/* 58 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_58__;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements WwTextObject
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _domUtils = __webpack_require__(3);

var _domUtils2 = _interopRequireDefault(_domUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isIE11 = _tuiCodeSnippet2.default.browser.msie && _tuiCodeSnippet2.default.browser.version === 11;
var isWindowChrome = navigator.appVersion.indexOf('Win') !== -1 && _tuiCodeSnippet2.default.browser.chrome;
var isNeedOffsetFix = isIE11 || isWindowChrome;

/**
 * Class WwTextObject
 */

var WwTextObject = function () {
  /**
   * Creates an instance of WwTextObject.
   * @param {WysiwygEditor} wwe - wysiwygEditor
   * @param {Range} range - Range object
   * @memberof WwTextObject
   */
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
   * @memberof WwTextObject
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
     * @memberof WwTextObject
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
     * @memberof WwTextObject
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
     * @memberof WwTextObject
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
     * @memberof WwTextObject
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
     * @memberof WwTextObject
     */

  }, {
    key: 'getTextContent',
    value: function getTextContent() {
      return this._range.cloneContents().textContent;
    }

    /**
     * Replace current selection content to given text
     * @param {string} content Text content
     * @memberof WwTextObject
     */

  }, {
    key: 'replaceContent',
    value: function replaceContent(content) {
      this._wwe.getEditor().setSelection(this._range);
      this._wwe.getEditor().insertHTML(content);
      this._range = this._wwe.getRange();
    }

    /**
     * Delete current selection content
     * @memberof WwTextObject
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
     * @memberof WwTextObject
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
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _blockOverlay = __webpack_require__(61);

var _blockOverlay2 = _interopRequireDefault(_blockOverlay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements UI code block gadget
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var EVENT_LANGUAGE_CHANGED = 'language-changed';
var GADGET_WIDTH = 250;
var GADGET_HEIGHT = 30;

/**
 * Class CodeBlockGadget
 * @extends {BlockOverlay}
 */

var CodeBlockGadget = function (_BlockOverlay) {
  _inherits(CodeBlockGadget, _BlockOverlay);

  /**
   * Creates an instance of CodeBlockGadget.
   * @param {Object} options - options
   * @param {EventManager} options.eventManager - event manager instance
   * @param {HTMLElement} options.container - container element
   * @param {WysiwygEditor} options.wysiwygEditor - wysiwyg editor instance
   * @memberof CodeBlockGadget
   */
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
      this.$el.addClass('code-block-header');
      this._$languageLabel = (0, _jquery2.default)('<span>text</span>');
      this.$el.append(this._$languageLabel);
      this._$buttonOpenModalEditor = (0, _jquery2.default)('<button type="button">Editor</button>');
      this.$el.append(this._$buttonOpenModalEditor);
    }
  }, {
    key: '_initDOMEvent',
    value: function _initDOMEvent() {
      var _this2 = this;

      this._$buttonOpenModalEditor.on('click', function () {
        return _this2._openPopupCodeBlockEditor();
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
     * @memberof CodeBlockGadget
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
     * @memberof CodeBlockGadget
     * @protected
     * @override
     */

  }, {
    key: 'onShow',
    value: function onShow() {
      var _this3 = this;

      _get(CodeBlockGadget.prototype.__proto__ || Object.getPrototypeOf(CodeBlockGadget.prototype), 'onShow', this).call(this);

      this._onAttachedElementChange = function () {
        return _this3._updateLanguage();
      };
      (0, _jquery2.default)(this.getAttachedElement()).on(EVENT_LANGUAGE_CHANGED, this._onAttachedElementChange);

      this._updateLanguage();
    }

    /**
     * on hide
     * @memberof CodeBlockGadget
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
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements UI block overlay
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class BlockOverlay
 */
var BlockOverlay = function () {
  /**
   * Creates an instance of BlockOverlay.
   * @param {Object} options - options
   *  @param {EventManager} options.eventManager - event manager instance
   *  @param {HTMLElement} options.container - container element
   *  @param {string} options.attachedSelector - selector string to find attached element
   * @memberof BlockOverlay
   */
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
     * @memberof BlockOverlay
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
     * @memberof BlockOverlay
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
     * @memberof BlockOverlay
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
     * @memberof BlockOverlay
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
     * @memberof BlockOverlay
     * @protected
     * @abstract
     */

  }, {
    key: 'onShow',
    value: function onShow() {}

    /**
     * called on hide. you may want to override to get the event
     * @memberof BlockOverlay
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
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview editor layout
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
 */

var Layout = function () {
  /**
   * Creates an instance of Layout.
   * @param {object} options - Option object
   * @param {EventManager} eventManager - Event manager instance
   * @memberof Layout
   */
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
   * @memberof Layout
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
     * @memberof Layout
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
     * @memberof Layout
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
     * @memberof Layout
     */

  }, {
    key: 'switchToWYSIWYG',
    value: function switchToWYSIWYG() {
      this.$containerEl.removeClass('te-md-mode');
      this.$containerEl.addClass('te-ww-mode');
    }

    /**
     * Switch editor mode to Markdown
     * @memberof Layout
     */

  }, {
    key: 'switchToMarkdown',
    value: function switchToMarkdown() {
      this.$containerEl.removeClass('te-ww-mode');
      this.$containerEl.addClass('te-md-mode');
    }

    /**
     * Initialize editor to Markdown and set preview section
     * @memberof Layout
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
     * @memberof Layout
     * @private
     */

  }, {
    key: '_initWysiwygSection',
    value: function _initWysiwygSection() {
      this.$wwEditorContainerEl = this.$containerEl.find('.te-ww-container .te-editor');
    }

    /**
     * Set preview to vertical split style
     * @memberof Layout
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
     * @memberof Layout
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
     * @memberof Layout
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
     * @memberof Layout
     */

  }, {
    key: 'hide',
    value: function hide() {
      this.$el.find('.tui-editor').addClass('te-hide');
    }

    /**
     * Show Editor
     * @memberof Layout
     */

  }, {
    key: 'show',
    value: function show() {
      this.$el.find('.tui-editor').removeClass('te-hide');
    }

    /**
     * Remove Editor
     * @memberof Layout
     */

  }, {
    key: 'remove',
    value: function remove() {
      this.$el.find('.tui-editor').remove();
    }

    /**
     * Get jQuery wrapped editor container element
     * @memberof Layout
     * @returns {jQuery}
     */

  }, {
    key: 'getEditorEl',
    value: function getEditorEl() {
      return this.$containerEl;
    }

    /**
     * Get jQuery wrapped preview element
     * @memberof Layout
     * @returns {jQuery}
     */

  }, {
    key: 'getPreviewEl',
    value: function getPreviewEl() {
      return this.$previewEl;
    }

    /**
     * Get jQuery wrapped Markdown editor element
     * @memberof Layout
     * @returns {jQuery}
     */

  }, {
    key: 'getMdEditorContainerEl',
    value: function getMdEditorContainerEl() {
      return this.$mdEditorContainerEl;
    }

    /**
     * Get jQuery wrapped WYSIWYG editor element
     * @memberof Layout
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
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview default UI
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _toolbar = __webpack_require__(64);

var _toolbar2 = _interopRequireDefault(_toolbar);

var _tab = __webpack_require__(37);

var _tab2 = _interopRequireDefault(_tab);

var _layerpopup = __webpack_require__(5);

var _layerpopup2 = _interopRequireDefault(_layerpopup);

var _modeSwitch = __webpack_require__(65);

var _modeSwitch2 = _interopRequireDefault(_modeSwitch);

var _popupAddLink = __webpack_require__(66);

var _popupAddLink2 = _interopRequireDefault(_popupAddLink);

var _popupAddImage = __webpack_require__(67);

var _popupAddImage2 = _interopRequireDefault(_popupAddImage);

var _popupTableUtils = __webpack_require__(68);

var _popupTableUtils2 = _interopRequireDefault(_popupTableUtils);

var _popupAddTable = __webpack_require__(69);

var _popupAddTable2 = _interopRequireDefault(_popupAddTable);

var _popupAddHeading = __webpack_require__(70);

var _popupAddHeading2 = _interopRequireDefault(_popupAddHeading);

var _popupCodeBlockLanguages = __webpack_require__(71);

var _popupCodeBlockLanguages2 = _interopRequireDefault(_popupCodeBlockLanguages);

var _popupCodeBlockEditor = __webpack_require__(72);

var _popupCodeBlockEditor2 = _interopRequireDefault(_popupCodeBlockEditor);

var _i18n = __webpack_require__(4);

var _i18n2 = _interopRequireDefault(_i18n);

var _tooltip = __webpack_require__(31);

var _tooltip2 = _interopRequireDefault(_tooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CLASS_TOOLBAR = 'te-toolbar-section';
var CLASS_MARKDOWN_TAB = 'te-markdown-tab-section';
var CLASS_EDITOR = 'te-editor-section';
var CLASS_MODE_SWITCH = 'te-mode-switch-section';
var CONTAINER_TEMPLATE = '\n    <div class="tui-editor-defaultUI">\n        <div class="' + CLASS_TOOLBAR + '"><div class="' + CLASS_MARKDOWN_TAB + '"></div></div>\n        <div class="' + CLASS_EDITOR + '"></div>\n        <div class="' + CLASS_MODE_SWITCH + '"></div>\n    </div>\n';

/**
 * Class Default UI
 * initialize ui instances. toolbar, popups
 */

var DefaultUI = function () {
  /**
   * Creates an instance of DefaultUI.
   * @param {ToastUIEditor} editor - editor instance
   * @memberof DefaultUI
   */
  function DefaultUI(editor) {
    _classCallCheck(this, DefaultUI);

    /**
     * UI name
     * @memberof DefaultUI#
     * @public
     * @type {string}
     */
    this.name = 'default';

    /**
     * Toolbar instance
     * @memberof DefaultUI#
     * @type {Toolbar}
     */
    this.toolbar = null;

    /**
     * Toolbar wrapper element
     * @memberof DefaultUI#
     * @type {jQuery}
     */
    this.$el = null;

    /**
     * @memberof DefaultUI#
     * @type {HTMLElement}
     * @private
     */
    this._container = null;

    /**
     * editor section element
     * @memberof DefaultUI#
     * @private
     * @type {HTMLElement}
     */
    this._editorSection = null;

    this._editor = editor;
    this._initialEditType = editor.options.initialEditType;

    this._init(editor.options.el);
    this._initEvent();
  }

  _createClass(DefaultUI, [{
    key: '_init',
    value: function _init(container) {
      this._container = container;
      this.$el = (0, _jquery2.default)(CONTAINER_TEMPLATE).appendTo(container);
      this._editorSection = this.$el.find('.' + CLASS_EDITOR).get(0);
      this._editorSection.appendChild(this._editor.layout.getEditorEl().get(0));

      this._initToolbar();
      this._initModeSwitch();

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
    value: function _initToolbar() {
      this.toolbar = new _toolbar2.default(this._editor.eventManager);
      this.$el.find('.' + CLASS_TOOLBAR).append(this.toolbar.$el);
    }
  }, {
    key: '_initModeSwitch',
    value: function _initModeSwitch() {
      var _this = this;

      this._modeSwitch = new _modeSwitch2.default(this._initialEditType === 'markdown' ? _modeSwitch2.default.TYPE.MARKDOWN : _modeSwitch2.default.TYPE.WYSIWYG);
      this.$el.find('.' + CLASS_MODE_SWITCH).append(this._modeSwitch.$el);

      this._modeSwitch.on('modeSwitched', function (ev, type) {
        return _this._editor.changeMode(type);
      });
    }
  }, {
    key: '_initMarkdownTab',
    value: function _initMarkdownTab() {
      var editor = this._editor;

      this.markdownTab = new _tab2.default({
        initName: _i18n2.default.get('Write'),
        items: [_i18n2.default.get('Write'), _i18n2.default.get('Preview')],
        sections: [editor.layout.getMdEditorContainerEl(), editor.layout.getPreviewEl()]
      });
      this._$markdownTabSection = this.$el.find('.' + CLASS_MARKDOWN_TAB);
      this._$markdownTabSection.append(this.markdownTab.$el);

      this.markdownTab.on('itemClick', function (ev, itemText) {
        if (itemText === _i18n2.default.get('Preview')) {
          editor.eventManager.emit('previewNeedsRefresh');
        } else {
          editor.getCodeMirror().focus();
        }
      });
    }
  }, {
    key: '_markdownTabControl',
    value: function _markdownTabControl() {
      if (this._editor.isMarkdownMode() && this._editor.getCurrentPreviewStyle() === 'tab') {
        this._$markdownTabSection.show();
        this.markdownTab.activate(_i18n2.default.get('Write'));
      } else {
        this._$markdownTabSection.hide();
      }
    }
  }, {
    key: '_initPopupAddLink',
    value: function _initPopupAddLink() {
      this.popupAddLink = new _popupAddLink2.default({
        $target: this.$el,
        editor: this._editor
      });
    }
  }, {
    key: '_initPopupAddImage',
    value: function _initPopupAddImage() {
      this.popupAddImage = new _popupAddImage2.default({
        $target: this.$el,
        eventManager: this._editor.eventManager
      });
    }
  }, {
    key: '_initPopupAddTable',
    value: function _initPopupAddTable() {
      this.popupAddTable = new _popupAddTable2.default({
        $target: this.$el,
        eventManager: this._editor.eventManager,
        $button: this.$el.find('button.tui-table'),
        css: {
          'position': 'absolute'
        }
      });
    }
  }, {
    key: '_initPopupAddHeading',
    value: function _initPopupAddHeading() {
      this.popupAddHeading = new _popupAddHeading2.default({
        $target: this.$el,
        eventManager: this._editor.eventManager,
        $button: this.$el.find('button.tui-heading'),
        css: {
          'position': 'absolute'
        }
      });
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

      this.popupTableUtils = new _popupTableUtils2.default({
        $target: this.$el,
        eventManager: this._editor.eventManager
      });
    }
  }, {
    key: '_initPopupCodeBlockLanguages',
    value: function _initPopupCodeBlockLanguages() {
      var editor = this._editor;
      this.popupCodeBlockLanguages = new _popupCodeBlockLanguages2.default({
        $target: this.$el,
        eventManager: editor.eventManager,
        languages: editor.options.codeBlockLanguages
      });
    }
  }, {
    key: '_initPopupCodeBlockEditor',
    value: function _initPopupCodeBlockEditor() {
      this.popupCodeBlockEditor = new _popupCodeBlockEditor2.default({
        $target: this.$el,
        eventManager: this._editor.eventManager,
        convertor: this._editor.convertor
      });
    }

    /**
     * get editor section height
     * @returns {Number} - height of editor section
     * @memberof DefaultUI
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
     * @memberof DefaultUI
     */

  }, {
    key: 'getEditorHeight',
    value: function getEditorHeight() {
      var clientRect = this._container.getBoundingClientRect();

      return clientRect.bottom - clientRect.top;
    }

    /**
     * hide
     * @memberof DefaultUI
     */

  }, {
    key: 'hide',
    value: function hide() {
      this.$el.addClass('te-hide');
    }

    /**
     * show
     * @memberof DefaultUI
     */

  }, {
    key: 'show',
    value: function show() {
      this.$el.removeClass('te-hide');
    }

    /**
     * remove
     * @memberof DefaultUI
     */

  }, {
    key: 'remove',
    value: function remove() {
      this.$el.remove();
      _tooltip2.default.hide();
    }

    /**
     * creates popup
     * @param {LayerPopupOption} options - layerPopup options
     * @returns {LayerPopup} - crated layerPopup
     * @memberof DefaultUI
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
/* 64 */
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

var _button = __webpack_require__(30);

var _button2 = _interopRequireDefault(_button);

var _i18n = __webpack_require__(4);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements toolbar
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var TOOLBAR_BUTTON_CLASS_NAME = 'tui-toolbar-icons';
var TOOLBAR_DIVIDER_CLASS_NAME = 'tui-toolbar-divider';

/**
 * Class Toolbar
 * @extends {UIController}
 */

var Toolbar = function (_UIController) {
  _inherits(Toolbar, _UIController);

  /**
   * Creates an instance of Toolbar.
   * @param {EventManager} eventManager - event manager
   * @memberof Toolbar
   */
  function Toolbar(eventManager) {
    _classCallCheck(this, Toolbar);

    var _this = _possibleConstructorReturn(this, (Toolbar.__proto__ || Object.getPrototypeOf(Toolbar)).call(this, {
      tagName: 'div',
      className: 'tui-editor-defaultUI-toolbar'
    }));

    _this.buttons = [];

    _this.eventManager = eventManager;

    _this._render();
    _this._initButton(['heading', 'bold', 'italic', 'strike', '|', 'hr', 'quote', 'ul', 'ol', 'task', '|', 'table', 'image', 'link', '|', 'code', 'codeBlock']);

    _this.eventManager.listen('stateChange', function (ev) {
      _tuiCodeSnippet2.default.forEach(_this.buttons, function (button) {
        if (button._state) {
          if (ev[button._state]) {
            button.$el.addClass('active');
          } else {
            button.$el.removeClass('active');
          }
        }
      });
    });
    return _this;
  }

  /**
   * render
   * Render toolbar
   * @private
   */


  _createClass(Toolbar, [{
    key: '_render',
    value: function _render() {
      this.$buttonContainer = this.$el;
    }

    /**
     * add button
     * @param {Button} button - button instance
     * @param {Number} [index] - location the button will be placed
     * @memberof Toolbar
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
  }, {
    key: '_addButton',
    value: function _addButton(button, index) {
      var $btn = this._setButton(button, index).$el;

      if (_tuiCodeSnippet2.default.isNumber(index)) {
        this.$buttonContainer.find('.' + TOOLBAR_BUTTON_CLASS_NAME).eq(index - 1).before($btn);
      } else {
        this.$buttonContainer.append($btn);
      }
    }

    /**
     * add divider
     * @returns {jQuery} - created divider jquery element
     * @memberof Toolbar
     */

  }, {
    key: 'addDivider',
    value: function addDivider() {
      var $el = (0, _jquery2.default)('<div class="' + TOOLBAR_DIVIDER_CLASS_NAME + '"></div>');
      this.$buttonContainer.append($el);

      return $el;
    }
  }, {
    key: '_setButton',
    value: function _setButton(button, index) {
      var ev = this.eventManager;
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
        this.buttons.splice(index, 0, button);
      } else {
        this.buttons.push(button);
      }

      return button;
    }

    /**
     * init button
     * @param {Array} buttonList using button list
     * @private
     */

  }, {
    key: '_initButton',
    value: function _initButton(buttonList) {
      var _this2 = this;

      this.buttonOptions = {
        heading: {
          className: 'tui-heading',
          event: 'openHeadingSelect',
          tooltip: _i18n2.default.get('Headings')
        },
        bold: {
          className: 'tui-bold',
          command: 'Bold',
          tooltip: _i18n2.default.get('Bold'),
          state: 'bold'
        },
        italic: {
          className: 'tui-italic',
          command: 'Italic',
          tooltip: _i18n2.default.get('Italic'),
          state: 'italic'
        },
        strike: {
          className: 'tui-strike',
          command: 'Strike',
          tooltip: _i18n2.default.get('Strike'),
          state: 'strike'
        },
        ul: {
          className: 'tui-ul',
          command: 'UL',
          tooltip: _i18n2.default.get('Unordered list')
        },
        ol: {
          className: 'tui-ol',
          command: 'OL',
          tooltip: _i18n2.default.get('Ordered list')
        },
        task: {
          className: 'tui-task',
          command: 'Task',
          tooltip: _i18n2.default.get('Task')
        },
        hr: {
          className: 'tui-hrline',
          command: 'HR',
          tooltip: _i18n2.default.get('Line')
        },
        table: {
          className: 'tui-table',
          event: 'openPopupAddTable',
          tooltip: _i18n2.default.get('Insert table')
        },
        image: {
          className: 'tui-image',
          event: 'openPopupAddImage',
          tooltip: _i18n2.default.get('Insert image')
        },
        link: {
          className: 'tui-link',
          event: 'openPopupAddLink',
          tooltip: _i18n2.default.get('Insert link')
        },
        quote: {
          className: 'tui-quote',
          command: 'Blockquote',
          tooltip: _i18n2.default.get('Blockquote'),
          state: 'quote'
        },
        codeBlock: {
          className: 'tui-codeblock',
          command: 'CodeBlock',
          tooltip: _i18n2.default.get('Insert CodeBlock'),
          state: 'codeBlock'
        },
        code: {
          className: 'tui-code',
          command: 'Code',
          tooltip: _i18n2.default.get('Code'),
          state: 'code'
        }
      };

      _tuiCodeSnippet2.default.forEach(buttonList, function (buttonName) {
        if (buttonName === '|') {
          _this2.addDivider();
        } else if (_this2.buttonOptions[buttonName]) {
          _this2.addButton(new _button2.default(_this2.buttonOptions[buttonName]));
        }
      });
    }
  }]);

  return Toolbar;
}(_uicontroller2.default);

exports.default = Toolbar;

/***/ }),
/* 65 */
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

var _i18n = __webpack_require__(4);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements ui mode switch
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var MARKDOWN = 'markdown';
var WYSIWYG = 'wysiwyg';

/**
 * Class ModeSwitch
 * UI Control for switch between Markdown and WYSIWYG
 * @extends {UIController}
 */

var ModeSwitch = function (_UIController) {
  _inherits(ModeSwitch, _UIController);

  /**
   * Creates an instance of ModeSwitch.
   * @param {string} initialType - initial type of editor
   * @memberof ModeSwitch
   */
  function ModeSwitch(initialType) {
    _classCallCheck(this, ModeSwitch);

    var _this = _possibleConstructorReturn(this, (ModeSwitch.__proto__ || Object.getPrototypeOf(ModeSwitch)).call(this, {
      tagName: 'div',
      className: 'te-mode-switch'
    }));

    _this._render();
    _this._switchType(_tuiCodeSnippet2.default.isExisty(initialType) ? initialType : MARKDOWN);
    return _this;
  }

  _createClass(ModeSwitch, [{
    key: '_render',
    value: function _render() {
      this.buttons = {};
      this.buttons.$markdown = (0, _jquery2.default)('<button class="te-switch-button markdown" type="button">' + _i18n2.default.get('Markdown') + '</button>');
      this.buttons.$wysiwyg = (0, _jquery2.default)('<button class="te-switch-button wysiwyg" type="button">' + _i18n2.default.get('WYSIWYG') + '</button>');
      this.$el.append(this.buttons.$markdown);
      this.$el.append(this.buttons.$wysiwyg);

      this.on('click .markdown', this._changeMarkdown.bind(this));
      this.on('click .wysiwyg', this._changeWysiwyg.bind(this));
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
      this.buttons.$markdown.removeClass('active');
      this.buttons.$wysiwyg.removeClass('active');
      this.buttons['$' + type].addClass('active');
    }
  }, {
    key: '_switchType',
    value: function _switchType(type) {
      if (this.type === type) {
        return;
      }

      this.type = type;
      this._setActiveButton(type);
      this.trigger('modeSwitched', this.type);
    }
  }]);

  return ModeSwitch;
}(_uicontroller2.default);

/**
 * @static
 * @memberof ModeSwitch
 * @property {string} MARKDOWN - markdown
 * @property {string} WYSIWYG - wysiwyg
 */


ModeSwitch.TYPE = {
  MARKDOWN: MARKDOWN,
  WYSIWYG: WYSIWYG
};

exports.default = ModeSwitch;

/***/ }),
/* 66 */
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

var _i18n = __webpack_require__(4);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements PopupAddLink
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/([^\s]*))?$/;

/**
 * Class PopupAddLink
 * It implements a link Add Popup
 * @extends {LayerPopup}
 */

var PopupAddLink = function (_LayerPopup) {
  _inherits(PopupAddLink, _LayerPopup);

  /**
   * Creates an instance of PopupAddLink.
   * @param {LayerPopupOption} options - layer popup options
   * @memberof PopupAddLink
   */
  function PopupAddLink(options) {
    _classCallCheck(this, PopupAddLink);

    var POPUP_CONTENT = '\n            <label for="linkText">' + _i18n2.default.get('Link text') + '</label>\n            <input type="text" class="te-link-text-input" />\n            <label for="url">' + _i18n2.default.get('URL') + '</label>\n            <input type="text" class="te-url-input" />\n            <div class="te-button-section">\n                <button type="button" class="te-ok-button">' + _i18n2.default.get('OK') + '</button>\n                <button type="button" class="te-close-button">' + _i18n2.default.get('Cancel') + '</button>\n            </div>\n        ';
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
   * @memberof PopupAddLink
   * @protected
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
     * @memberof PopupAddLink
     * @protected
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
     * @memberof PopupAddLink
     * @protected
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

        if (selectedText.length > 0 && inputURL.value.length < 1) {
          inputURL.focus();
        } else {
          inputText.focus();
          inputText.setSelectionRange(0, selectedText.length);
        }
      });

      this.on('hidden', function () {
        _this2._resetInputs();
      });
    }

    /**
     * bind editor events
     * @memberof PopupAddLink
     * @protected
     * @abstract
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
        this._inputText.classList.add('wrong');

        return;
      }
      if (url.length < 1) {
        this._inputURL.classList.add('wrong');

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
      this._inputURL.classList.remove('wrong');
      this._inputText.classList.remove('wrong');
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
/* 67 */
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

var _tab = __webpack_require__(37);

var _tab2 = _interopRequireDefault(_tab);

var _i18n = __webpack_require__(4);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements PopupAddImage
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
 * @extends {LayerPopup}
 */

var PopupAddImage = function (_LayerPopup) {
  _inherits(PopupAddImage, _LayerPopup);

  /**
   * Creates an instance of PopupAddImage.
   * @param {LayerPopupOption} options - layer popup option
   * @memberof PopupAddImage
   */
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
   * @memberof PopupAddImage
   * @protected
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
     * @memberof PopupAddImage
     * @protected
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
     * @memberof PopupAddImage
     * @protected
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
          var imageFile = _this2._$imageFileInput.get(0).files.item(0);
          var hookCallback = function hookCallback(url, text) {
            return _this2._applyImage(url, altText || text);
          };

          _this2.eventManager.emit('addImageBlobHook', imageFile, hookCallback, TYPE_UI);
        }

        _this2.hide();
      });

      this.tab.on('itemClick', function () {
        return _this2._resetInputs();
      });
    }

    /**
     * bind editor events
     * @memberof PopupAddImage
     * @protected
     * @abstract
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
  }]);

  return PopupAddImage;
}(_layerpopup2.default);

exports.default = PopupAddImage;

/***/ }),
/* 68 */
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

var _i18n = __webpack_require__(4);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements PopupTableUtils
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * PopupTableUtils
 * It implements table utils popup
 * @extends {LayerPopup}
 */
var PopupTableUtils = function (_LayerPopup) {
  _inherits(PopupTableUtils, _LayerPopup);

  /**
   * Creates an instance of PopupTableUtils.
   * @param {LayerPopupOption} options - layer popup options
   * @memberof PopupTableUtils
   */
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
   * @memberof PopupTableUtils
   * @protected
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
     * @memberof PopupTableUtils
     * @protected
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
      this.on('click .te-table-remove-row', function () {
        return _this2.eventManager.emit('command', 'RemoveRow');
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
    }

    /**
     * bind editor events
     * @memberof PopupTableUtils
     * @protected
     * @abstract
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

      this.eventManager.listen('openPopupTableUtils', function (event) {
        var offset = _this3.$el.parent().offset();
        var x = event.clientX - offset.left;
        var y = event.clientY - offset.top + (0, _jquery2.default)(window).scrollTop();

        _this3.eventManager.emit('closeAllPopup');

        _this3.$el.css({
          position: 'absolute',
          top: y + 5, // beside mouse pointer
          left: x + 10
        });

        _this3.show();
      });
    }
  }]);

  return PopupTableUtils;
}(_layerpopup2.default);

exports.default = PopupTableUtils;

/***/ }),
/* 69 */
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
 * @extends {LayerPopup}
 */

var PopupAddTable = function (_LayerPopup) {
  _inherits(PopupAddTable, _LayerPopup);

  /**
   * Creates an instance of PopupAddTable.
   * @param {LayerPopupOption} options - layer popup option
   * @memberof PopupAddTable
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
   * @memberof PopupAddTable
   * @protected
   * @override
   */


  _createClass(PopupAddTable, [{
    key: '_initInstance',
    value: function _initInstance(options) {
      _get(PopupAddTable.prototype.__proto__ || Object.getPrototypeOf(PopupAddTable.prototype), '_initInstance', this).call(this, options);

      this._selectedBound = {};
      this._tableBound = {};
      this._eventManager = options.eventManager;
      this.$button = options.$button;
    }

    /**
     * initialize DOM, render popup
     * @memberof PopupAddTable
     * @protected
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
     * @memberof PopupAddTable
     * @protected
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
     * @memberof PopupAddTable
     * @protected
     * @abstract
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
        _this3._eventManager.emit('closeAllPopup');
        var $button = _this3.$button;
        var position = $button.position();
        _this3.$el.css({
          top: position.top + $button.outerHeight(true),
          left: position.left
        });
        _this3.show();
        _this3._selectionOffset = _this3.$el.find('.' + CLASS_TABLE_SELECTION).offset();
      });
    }

    /**
     * _cacheElements
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
     * _resizeTableBySelectionIfNeed
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
     * _getResizedTableBound
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
     * _isNeedResizeTable
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
     * _getBoundByOffset
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
     * _getOffsetByBound
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
     * _setTableSizeByBound
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
     * _getSelectionBoundByOffset
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
     * _setSelectionAreaByBound
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
     * _setSelectedBound
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
     * _getSelectedTableSize
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
     * _setDisplayText
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
     * _setTableSize
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
     * _setSelectionArea
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
/* 70 */
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

var _i18n = __webpack_require__(4);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements PopupAddTable
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Class PopupHeading
 * It implements Popup to add headings
 * @extends {LayerPopup}
 */
var PopupAddHeading = function (_LayerPopup) {
  _inherits(PopupAddHeading, _LayerPopup);

  /**
   * Creates an instance of PopupAddHeading.
   * @param {LayerPopupOption} options - layer popup option
   * @memberof PopupAddHeading
   */
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
   * @memberof PopupAddHeading
   * @protected
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
     * @memberof PopupAddHeading
     * @protected
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
     * @memberof PopupAddHeading
     * @protected
     * @abstract
     */

  }, {
    key: '_initEditorEvent',
    value: function _initEditorEvent() {
      var _this3 = this;

      _get(PopupAddHeading.prototype.__proto__ || Object.getPrototypeOf(PopupAddHeading.prototype), '_initEditorEvent', this).call(this);

      this._eventManager.listen('focus', this.hide.bind(this));
      this._eventManager.listen('closeAllPopup', this.hide.bind(this));
      this._eventManager.listen('openHeadingSelect', function () {
        _this3._eventManager.emit('closeAllPopup');

        var $button = _this3._$button;
        var position = $button.position();
        _this3.$el.css({
          top: position.top + $button.outerHeight(true),
          left: position.left
        });

        _this3.show();
      });
    }
  }]);

  return PopupAddHeading;
}(_layerpopup2.default);

exports.default = PopupAddHeading;

/***/ }),
/* 71 */
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var BUTTON_CLASS_PREFIX = 'te-popup-code-block-lang-';

/**
 * Class Popup code block languages select list
 * @extends {LayerPopup}
 */

var PopupCodeBlockLanguages = function (_LayerPopup) {
  _inherits(PopupCodeBlockLanguages, _LayerPopup);

  /**
   * Creates an instance of PopupCodeBlockLanguages.
   * @param {LayerPopupOption} options - layer popup option
   * @memberof PopupCodeBlockLanguages
   */
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
   * @memberof PopupCodeBlockLanguages
   * @protected
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
     * @memberof PopupCodeBlockLanguages
     * @protected
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
     * @memberof PopupCodeBlockLanguages
     * @protected
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
     * @memberof PopupCodeBlockLanguages
     * @protected
     * @abstract
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
     * @memberof PopupCodeBlockLanguages
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
     * @memberof PopupCodeBlockLanguages
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
     * @memberof PopupCodeBlockLanguages
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
     * @public
     * @memberof PopupCodeBlockLanguages
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
     * @memberof PopupCodeBlockLanguages
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
     * @protected
     * @memberof PopupCodeBlockLanguages
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
     * @memberof PopupCodeBlockLanguages
     * @protected
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
/* 72 */
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

var _scrollSyncSplit = __webpack_require__(73);

var _scrollSyncSplit2 = _interopRequireDefault(_scrollSyncSplit);

var _codeBlockEditor = __webpack_require__(74);

var _codeBlockEditor2 = _interopRequireDefault(_codeBlockEditor);

var _codeBlockPreview = __webpack_require__(75);

var _codeBlockPreview2 = _interopRequireDefault(_codeBlockPreview);

var _codeBlockLanguagesCombo = __webpack_require__(76);

var _codeBlockLanguagesCombo2 = _interopRequireDefault(_codeBlockLanguagesCombo);

var _i18n = __webpack_require__(4);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements popup code block editor
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var CLASS_PREFIX = 'popup-editor-';
var CLASS_OK_BUTTON = 'te-ok-button';
var CLASS_CLOSE_BUTTON = 'te-close-button';
var CLASS_POPUP_CLOSE_BUTTON = 'tui-popup-close-button';
var TEMPLATE_HEADER_BUTTONS = '\n    <button type="button" class="' + CLASS_PREFIX + 'toggle-scroll"></button>\n    <button type="button" class="' + CLASS_PREFIX + 'toggle-preview"></button>\n    <button type="button" class="' + CLASS_PREFIX + 'toggle-fit"></button>\n    <button type="button" class="' + CLASS_POPUP_CLOSE_BUTTON + '"></button>\n';

/**
 * Class popup code block editor
 * @extends {LayerPopup}
 */

var PopupCodeBlockEditor = function (_LayerPopup) {
  _inherits(PopupCodeBlockEditor, _LayerPopup);

  /**
   * Creates an instance of PopupCodeBlockEditor.
   * @param {LayerPopupOption} options - layer popup option
   * @memberof PopupCodeBlockEditor
   */
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
   * @memberof PopupCodeBlockEditor
   * @protected
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
     * @memberof PopupCodeBlockEditor
     * @protected
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
     * @memberof PopupCodeBlockEditor
     * @protected
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
     * @memberof PopupCodeBlockEditor
     * @protected
     * @abstract
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
      codeMirrorWrapper.classList.add(CLASS_PREFIX + 'editor-wrapper');

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
     * @memberof PopupCodeBlockEditor
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
     * @memberof PopupCodeBlockEditor
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
     * @memberof PopupCodeBlockEditor
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
     * @memberof PopupCodeBlockEditor
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
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements scroll sync split
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
 */

var ScrollSyncSplit = function () {
  /**
   * Creates an instance of ScrollSyncSplit.
   * @param {Element} baseElement - an element which attach a splitSyncSplit
   * @param {Element} leftElement - an element to be on left side split view
   * @param {Element} rightElement - an element to be on right side split view
   * @param {object} options - options
   *  @param {boolean} [options.showScrollSyncButton=false] - show scroll sync button on top right corner
   *  @param {boolean} [options.scrollSync=true] - true for enable scroll sync
   *  @param {boolean} [options.splitView=true] - true for split, false for single view
   * @memberof ScrollSyncSplit
   */
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
     * @memberof ScrollSyncSplit
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
      element.classList.add(CLASS_CONTENT[side]);
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
     * @memberof ScrollSyncSplit
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
     * @memberof ScrollSyncSplit
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
     * @memberof ScrollSyncSplit
     */

  }, {
    key: 'toggleScrollSync',
    value: function toggleScrollSync() {
      this._el.classList.toggle(CLASS_SCROLL_SYNC);
    }
  }, {
    key: 'setSplitView',
    value: function setSplitView(activate) {
      (0, _jquery2.default)(this._el).toggleClass(CLASS_SINGLE_CONTENT, !activate);
    }

    /**
     * toggle split
     * @memberof ScrollSyncSplit
     */

  }, {
    key: 'toggleSplitView',
    value: function toggleSplitView() {
      this._el.classList.toggle(CLASS_SINGLE_CONTENT);
    }

    /**
     * is scroll synced
     * @returns {boolean} - true for synced, false for each scroll
     * @memberof ScrollSyncSplit
     */

  }, {
    key: 'isScrollSynced',
    value: function isScrollSynced() {
      return this._el.classList.contains(CLASS_SCROLL_SYNC);
    }

    /**
     * is split view
     * @returns {boolean} - true for split view, false for single view
     * @memberof ScrollSyncSplit
     */

  }, {
    key: 'isSplitView',
    value: function isSplitView() {
      return !this._el.classList.contains(CLASS_SINGLE_CONTENT);
    }

    /**
     * sync scroll
     * @memberof ScrollSyncSplit
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
     * @memberof ScrollSyncSplit
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
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _codeMirrorExt = __webpack_require__(32);

var _codeMirrorExt2 = _interopRequireDefault(_codeMirrorExt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements code block editor
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var EVENT_LANGUAGE_CHANGED = 'language-changed';

/**
 * Class Code Block Editor
 * @extends {CodeMirrorExt}
 */

var CodeBlockEditor = function (_CodeMirrorExt) {
  _inherits(CodeBlockEditor, _CodeMirrorExt);

  /**
   * Creates an instance of CodeBlockEditor.
   * @param {HTMLElement} el - code block editor container element
   * @param {EventManager} eventManager - event manager
   * @memberof CodeBlockEditor
   */
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
     * @memberof CodeBlockEditor
     */

  }, {
    key: 'load',
    value: function load(codeBlockElement) {
      var el = codeBlockElement.cloneNode(true);
      var texts = [];

      var divs = el.querySelectorAll('div');
      [].slice.call(divs).forEach(function (div) {
        texts.push(div.innerText.replace(/\n$/, ''));
      });

      this.setLanguage(el.getAttribute('data-language') || '');
      this.setEditorCodeText(texts.join('\n'));
    }

    /**
     * save code to code block element
     * @param {HTMLElement} codeBlockElement - code block element
     * @memberof CodeBlockEditor
     */

  }, {
    key: 'save',
    value: function save(codeBlockElement) {
      codeBlockElement.innerHTML = '';

      var codeLines = this.getEditorCodeText().split('\n');
      codeLines.forEach(function (codeLine) {
        var div = document.createElement('div');
        codeBlockElement.appendChild(div);

        var childElement = void 0;
        if (codeLine.length > 0) {
          childElement = document.createTextNode(codeLine);
        } else {
          childElement = document.createElement('br');
        }
        div.appendChild(childElement);
      });

      codeBlockElement.setAttribute('data-language', this._language);
      (0, _jquery2.default)(codeBlockElement).trigger(EVENT_LANGUAGE_CHANGED);
    }

    /**
     * clear code and language
     * @memberof CodeBlockEditor
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
     * @memberof CodeBlockEditor
     */

  }, {
    key: 'getLanguage',
    value: function getLanguage() {
      return this._language;
    }

    /**
     * set code language
     * @param {string} [language=''] - code language
     * @memberof CodeBlockEditor
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
     * @memberof CodeBlockEditor
     */

  }, {
    key: 'getEditorCodeText',
    value: function getEditorCodeText() {
      return this.getValue();
    }

    /**
     * set code text
     * @param {string} [code=''] - code text
     * @memberof CodeBlockEditor
     */

  }, {
    key: 'setEditorCodeText',
    value: function setEditorCodeText() {
      var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      this.setValue(code);
    }

    /**
     * refresh. call if codemirror resized
     * @memberof CodeBlockEditor
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
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _preview = __webpack_require__(10);

var _preview2 = _interopRequireDefault(_preview);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements CodeBlockPreview
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var EVENT_REQUIRE_SCROLL_SYNC = 'requireScrollSync';

/**
 * Class Code block preview
 * @extends {Preview}
 */

var CodeBlockPreview = function (_Preview) {
  _inherits(CodeBlockPreview, _Preview);

  /**
   * Creates an instance of CodeBlockPreview.
   * @param {jQuery} $el - base element
   * @param {EventManager} eventManager - event manager
   * @param {Convertor} convertor - convertor
   * @param {CodeBlockEditor} codeBlockEditor - code block editor
   * @memberof CodeBlockPreview
   */
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
     * @memberof CodeBlockPreview
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
     * @memberof CodeBlockPreview
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
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements UI code block languages combo
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _i18n = __webpack_require__(4);

var _i18n2 = _interopRequireDefault(_i18n);

var _keyMapper = __webpack_require__(15);

var _keyMapper2 = _interopRequireDefault(_keyMapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class CodeBlockLanguagesCombo
 */
var CodeBlockLanguagesCombo = function () {
  /**
   * Creates an instance of CodeBlockLanguagesCombo.
   * @param {EventManager} eventManager - event manager instance
   * @memberof CodeBlockLanguagesCombo
   */
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
     * @memberof CodeBlockGadget
     */

  }, {
    key: '_showPopupCodeBlockLanguages',
    value: function _showPopupCodeBlockLanguages() {
      var _this2 = this;

      var clientRect = this._inputLanguage.getBoundingClientRect();
      this._wrapper.classList.toggle('active', true);
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
      if (this._wrapper.classList.contains('active')) {
        inputLanguage.blur();
      } else {
        inputLanguage.focus();
      }
    }
  }, {
    key: '_onFocusOut',
    value: function _onFocusOut() {
      this._wrapper.classList.toggle('active', false);
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
     * @memberof CodeBlockLanguagesCombo
     */

  }, {
    key: 'setOnLanguageSelected',
    value: function setOnLanguageSelected(callback) {
      this._onLanguageSelected = callback;
    }

    /**
     * hide popup
     * @private
     * @memberof CodeBlockGadget
     */

  }, {
    key: '_hidePopupCodeBlockLanguages',
    value: function _hidePopupCodeBlockLanguages() {
      this._eventManager.emit('closePopupCodeBlockLanguages');
    }

    /**
     * set language
     * @param {string} language - code block language
     * @memberof CodeBlockLanguagesCombo
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
     * @memberof CodeBlockGadget
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
     * @memberof CodeBlockLanguagesCombo
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
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var boldRegex = /^[*_]{2,}[^*_]*[*_]{2,}$/;

/**
 * Bold
 * Add bold markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Bold
 * @ignore
 */
/**
* @fileoverview Implements Bold markdown command
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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

    var cursor = doc.getCursor();
    var selection = doc.getSelection();
    var isEmpty = !selection;

    // if selection is empty, expend selection to detect a syntax
    if (isEmpty && cursor.ch > 1) {
      var tmpSelection = this.expendSelection(doc, cursor);
      selection = tmpSelection || selection;
    }

    var isRemoved = this.isNeedRemove(selection);
    var result = isRemoved ? this.remove(selection) : this.append(selection);

    doc.replaceSelection(result, 'around');

    if (isEmpty && !isRemoved) {
      this.setCursorToCenter(doc, cursor);
    }

    cm.focus();
  },


  /**
   * test it has bold
   * @param {string} text - text selected
   * @returns {boolean} - true if it has bold
   */
  isNeedRemove: function isNeedRemove(text) {
    return boldRegex.test(text);
  },


  /**
   * apply bold
   * @param {string} text - text selected
   * @returns {string} - bold text
   */
  append: function append(text) {
    return '**' + text + '**';
  },


  /**
   * remove bold
   * @param {string} text - text selected
   * @returns {string} - un-bold text
   */
  remove: function remove(text) {
    return text.substr(2, text.length - 4);
  },


  /**
   * expand selection
   * @param {CodeMirror.doc} doc - codemirror document
   * @param {object} cursor - codemirror cursor
   * @returns {string} - text selected
   */
  expendSelection: function expendSelection(doc, cursor) {
    var tmpSelection = doc.getSelection();
    var result = void 0;
    var start = {
      line: cursor.line,
      ch: cursor.ch - 2
    };
    var end = {
      line: cursor.line,
      ch: cursor.ch + 2
    };

    doc.setSelection(start, end);

    if (tmpSelection === '****' || tmpSelection === '____') {
      result = tmpSelection;
    } else {
      doc.setSelection(cursor);
    }

    return result;
  },


  /**
   * move cursor to center
   * @param {CodeMirror.doc} doc - codemirror document
   * @param {object} cursor - codemirror cursor
   */
  setCursorToCenter: function setCursorToCenter(doc, cursor) {
    doc.setCursor(cursor.line, cursor.ch + 2);
  }
});

exports.default = Bold;

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var boldItalicRegex = /^[*_]{3,}[^*_]*[*_]{3,}$/; /**
                                                   * @fileoverview Implements Italic markdown command
                                                   * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                   */

var italicRegex = /^[*_][^*_]*[*_]$/;

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

    var cursor = doc.getCursor();
    var selection = doc.getSelection();
    var isEmpty = !selection;
    var isWithBold = false;
    var tmpSelection = void 0;

    // if selection is empty, expend selection to detect a syntax
    if (isEmpty) {
      if (cursor.ch > 2) {
        tmpSelection = this.expendWithBoldSelection(doc, cursor);

        if (tmpSelection) {
          isWithBold = 'with';
        }
      }

      if (isWithBold !== 'with' && cursor.ch > 1) {
        isWithBold = this.expendOnlyBoldSelection(doc, cursor);
      }

      if (!isWithBold && cursor.ch > 0) {
        this.expendSelection(doc, cursor);
        selection = tmpSelection || selection;
      }
    }

    var isRemoved = this.isNeedRemove(selection);
    var result = isRemoved ? this.remove(selection) : this.append(selection);

    doc.replaceSelection(result, 'around');

    if (isEmpty) {
      this.setCursorToCenter(doc, cursor, isRemoved);
    }

    cm.focus();
  },


  /**
   * isNeedRemove
   * test given text has italic or bold
   * @param {string} text - text to test
   * @returns {boolean} - true if it has italic or bold
   */
  isNeedRemove: function isNeedRemove(text) {
    return italicRegex.test(text) || boldItalicRegex.test(text);
  },


  /**
   * apply italic
   * @param {string} text - text to apply
   * @returns {string} - italic text
   */
  append: function append(text) {
    return '_' + text + '_';
  },


  /**
   * remove italic
   * @param {string} text - text to remove italic syntax
   * @returns {string} - italic syntax revmoed text
   */
  remove: function remove(text) {
    return text.substr(1, text.length - 2);
  },


  /**
   * expand selected area
   * @param {CodeMirror.doc} doc - codemirror document
   * @param {object} cursor - codemirror cursor
   * @returns {string} - text in range after it has been expaneded
   */
  expendWithBoldSelection: function expendWithBoldSelection(doc, cursor) {
    var tmpSelection = doc.getSelection();
    var result = void 0;
    var start = {
      line: cursor.line,
      ch: cursor.ch - 3
    };
    var end = {
      line: cursor.line,
      ch: cursor.ch + 3
    };

    doc.setSelection(start, end);

    if (tmpSelection === '******' || tmpSelection === '______') {
      result = tmpSelection;
    } else {
      doc.setSelection(cursor);
    }

    return result;
  },


  /**
   * expand only bold selection
   * @param {CodeMirror.doc} doc - codemirror document
   * @param {object} cursor - codemirror cursor
   * @returns {string} - text in area after it has been expaneded
   */
  expendOnlyBoldSelection: function expendOnlyBoldSelection(doc, cursor) {
    var tmpSelection = doc.getSelection();
    var result = false;
    var start = {
      line: cursor.line,
      ch: cursor.ch - 2
    };
    var end = {
      line: cursor.line,
      ch: cursor.ch + 2
    };

    doc.setSelection(start, end);

    if (tmpSelection === '****' || tmpSelection === '____') {
      doc.setSelection(cursor);
      result = 'only';
    }

    return result;
  },


  /**
   * expand only italic selection
   * @param {CodeMirror.doc} doc - codemirror document
   * @param {object} cursor - codemirror cursor
   * @returns {string} - text in area after it has been expaneded
   */
  expendSelection: function expendSelection(doc, cursor) {
    var tmpSelection = doc.getSelection();
    var result = void 0;
    var start = {
      line: cursor.line,
      ch: cursor.ch - 2
    };
    var end = {
      line: cursor.line,
      ch: cursor.ch + 2
    };

    doc.setSelection(start, end);

    if (tmpSelection === '****' || tmpSelection === '____') {
      result = tmpSelection;
    } else {
      doc.setSelection(cursor);
    }

    return result;
  },

  /**
   * move cursor to center
   * @param {CodeMirror.doc} doc - codemirror document
   * @param {object} cursor - codemirror cursor
   * @param {boolean} isRemoved - whether it involes deletion
   */
  setCursorToCenter: function setCursorToCenter(doc, cursor, isRemoved) {
    var pos = isRemoved ? -1 : 1;
    doc.setCursor(cursor.line, cursor.ch + pos);
  }
});

exports.default = Italic;

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var strikeRegex = /^[~~](.*[\s\n]*.*)*[~~]$/;

/**
 * Strike
 * Add strike markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Strike
 * @ignore
 */
/**
 * @fileoverview Implements StrikeThrough markdown command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
    var cursor = doc.getCursor();
    var selection = doc.getSelection();
    var isNeedToRemove = this.hasStrikeSyntax(selection);

    var result = void 0;

    if (isNeedToRemove) {
      result = this.remove(selection);
    } else {
      result = this.append(selection);
    }

    doc.replaceSelection(result, 'around');

    var isEmptySelection = !selection;

    if (isEmptySelection && !isNeedToRemove) {
      this.setCursorToCenter(doc, cursor, isNeedToRemove);
    }

    cm.focus();
  },


  /**
   * hasStrikeSyntax
   * @param {string} text Source text
   * @returns {boolean} Boolean value of strike syntax removal
   */
  hasStrikeSyntax: function hasStrikeSyntax(text) {
    return strikeRegex.test(text);
  },


  /**
   * append strike
   * @param {string} text - text to apply
   * @returns {string} - strike through text
   */
  append: function append(text) {
    return '~~' + text + '~~';
  },


  /**
   * remove strike
   * @param {string} text - text to remove
   * @returns {string} - strike removed text
   */
  remove: function remove(text) {
    return text.substr(2, text.length - 4);
  },


  /**
   * set cursor to center
   * @param {CodeMirror.doc} doc - codemirror document
   * @param {object} cursor - codemirror cursor
   * @param {boolean} isRemoved - whether it involes deletion
   */
  setCursorToCenter: function setCursorToCenter(doc, cursor, isRemoved) {
    var pos = isRemoved ? -2 : 2;
    doc.setCursor(cursor.line, cursor.ch + pos);
  }
});

exports.default = Strike;

/***/ }),
/* 80 */
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
 * Add blockquote markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Blockquote
 * @ignore
 */
var Blockquote = _commandManager2.default.command('markdown', /** @lends Blockquote */{
  name: 'Blockquote',
  keyMap: ['CTRL+Q', 'META+Q'],
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
    var lineLength = textLinesToModify.length;

    for (var i = 0; i < lineLength; i += 1) {
      textLinesToModify[i] = '>' + textLinesToModify[i];
    }

    doc.replaceRange(textLinesToModify.join('\n'), from, to);

    range.to.ch += 1;

    doc.setCursor(range.to);

    cm.focus();
  }
}); /**
    * @fileoverview Implements Blockquote markdown command
    * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
    */
exports.default = Blockquote;

/***/ }),
/* 81 */
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
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
/* 82 */
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
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
/* 83 */
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
     * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
     */

exports.default = HR;

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _importManager = __webpack_require__(18);

var _importManager2 = _interopRequireDefault(_importManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @fileoverview Implements Addlink markdown command
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

    var replaceText = '![' + data.altText + '](' + data.imageUrl + ')';

    doc.replaceRange(replaceText, from, to, '+addImage');

    cm.focus();
  }
}); /**
    * @fileoverview Implments AddImage markdown command
    * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
    */
exports.default = AddImage;

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FIND_MD_OL_RX = /^[ \t]*[\d]+\. .*/; /**
                                          * @fileoverview Implements UL markdown command
                                          * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                          */

var FIND_MD_UL_RX = /^[ \t]*[-*] .*/;
var FIND_MD_TASK_RX = /^[ \t]*[-*]( \[[ xX]])? .*/;

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
    var cm = mde.getEditor();
    var doc = cm.getDoc();
    var range = mde.getCurrentRange();
    var listManager = mde.componentManager.getManager('list');
    var lineRange = listManager.expandLineRangeIfNeed(doc, range, isOlOrTask);
    var startLineNumber = lineRange.start;
    var endLineNumber = lineRange.end;
    var line = void 0,
        currentLineStart = void 0;

    for (var i = startLineNumber; i <= endLineNumber; i += 1) {
      currentLineStart = {
        line: i,
        ch: 0
      };

      line = doc.getLine(i);

      if (listManager.isListOrParagraph(line)) {
        if (isOlOrTask(line)) {
          listManager.replaceLineText(doc, i, /[\d]+\. /, '* ');
        } else if (!line.match(FIND_MD_UL_RX)) {
          doc.replaceRange('* ', currentLineStart);
        }

        if (i === endLineNumber) {
          listManager.appendBlankLineIfNeed(cm, i, endLineNumber, startLineNumber);
        }
      } else {
        break;
      }
    }
    cm.focus();
  }
});

/**
 * Return whether passed line is OL or TASK or neither
 * @param {string} line Line text
 * @returns {boolean}
 */
function isOlOrTask(line) {
  return !!(line && (line.match(FIND_MD_TASK_RX) || line.match(FIND_MD_OL_RX)));
}

exports.default = UL;

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FIND_MD_OL_RX = /^[ \t]*[\d]+\. .*/; /**
                                          * @fileoverview Implements OL markdown command
                                          * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                          */

var FIND_MD_UL_RX = /^[ \t]*[-*] .*/;
var FIND_MD_TASK_RX = /^[ \t]*[-*]( \[[ xX]])? .*/;

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
    var cm = mde.getEditor();
    var doc = cm.getDoc();
    var range = mde.getCurrentRange();
    var listManager = mde.componentManager.getManager('list');
    var lineRange = listManager.expandLineRangeIfNeed(doc, range, isUlOrTask);
    var startLineNumber = lineRange.start;
    var endLineNumber = lineRange.end;
    var ordinalNumber = 1;
    var line = void 0,
        currentLineStart = void 0;

    for (var i = startLineNumber; i <= endLineNumber; i += 1) {
      currentLineStart = {
        line: i,
        ch: 0
      };

      line = doc.getLine(i);

      if (listManager.isListOrParagraph(line)) {
        if (isUlOrTask(line)) {
          listManager.replaceLineText(doc, i, /[*-] /, ordinalNumber + '. ');
        } else if (!line.match(FIND_MD_OL_RX)) {
          doc.replaceRange(ordinalNumber + '. ', currentLineStart);
        }

        ordinalNumber += 1;

        if (i === endLineNumber) {
          listManager.appendBlankLineIfNeed(cm, i, endLineNumber, startLineNumber);
        }
      } else {
        break;
      }
    }
    cm.focus();
  }
});

/**
 * Return whether passed line is UL or TASK or neither
 * @param {string} line Line text
 * @returns {boolean}
 */
function isUlOrTask(line) {
  return !!(line && (line.match(FIND_MD_TASK_RX) || line.match(FIND_MD_UL_RX)));
}

exports.default = OL;

/***/ }),
/* 88 */
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
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FIND_MD_OL_RX = /^[ \t]*[\d]+\. .*/; /**
                                          * @fileoverview Implements Task markdown command
                                          * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                          */

var FIND_MD_UL_RX = /^[ \t]*[-*] .*/;
var FIND_MD_TASK_RX = /^[ \t]*[-*]( \[[ xX]])? .*/;
var FIND_TASK_SYNTAX_RX = /([*-] |[\d]+\. )(\[[ xX]] )/;

/**
 * Task
 * @extends Command
 * @module markdownCommands/Task
 * @ignore
 */
var Task = _commandManager2.default.command('markdown', /** @lends Task */{
  name: 'Task',
  keyMap: ['CTRL+T', 'META+T'],
  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec: function exec(mde) {
    var cm = mde.getEditor();
    var doc = cm.getDoc();
    var range = mde.getCurrentRange();
    var listManager = mde.componentManager.getManager('list');
    var lineRange = listManager.createSortedLineRange(range);
    var startLineNumber = lineRange.start;
    var endLineNumber = lineRange.end;
    var line = void 0,
        currentLineStart = void 0;

    for (var i = startLineNumber; i <= endLineNumber; i += 1) {
      currentLineStart = {
        line: i,
        ch: 0
      };

      line = doc.getLine(i);

      var hasTaskSyntax = !!line.match(FIND_TASK_SYNTAX_RX);

      if (listManager.isListOrParagraph(line)) {
        if (isOlOrUl(line) && hasTaskSyntax) {
          listManager.replaceLineText(doc, i, FIND_TASK_SYNTAX_RX, '$1');
        } else if (isOlOrUl(line) && !hasTaskSyntax) {
          listManager.replaceLineText(doc, i, /([*-] |[\d]+\. )/, '$1[ ] ');
        } else if (!line.match(FIND_MD_TASK_RX)) {
          doc.replaceRange('* [ ] ', currentLineStart);
        }

        if (i === endLineNumber) {
          listManager.appendBlankLineIfNeed(cm, i, endLineNumber, startLineNumber);
        }
      } else {
        break;
      }
    }
    cm.focus();
  }
});

/**
 * Return whether passed line is OL or UL or neither
 * @param {string} line Line text
 * @returns {boolean}
 */
function isOlOrUl(line) {
  return !!(line && (line.match(FIND_MD_UL_RX) || line.match(FIND_MD_OL_RX)));
}

exports.default = Task;

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    var range = cm.getCursor();

    doc.replaceSelection(this.append(selection), 'around');

    if (!selection) {
      doc.setCursor(range.line, range.ch + 1);
    }

    cm.focus();
  },

  /**
   * apply Code
   * @param {string} text - selected text
   * @returns {string} - text after code syntax applied
   */
  append: function append(text) {
    return '`' + text + '`';
  }
}); /**
    * @fileoverview Implements Code markdown command
    * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
    */
exports.default = Code;

/***/ }),
/* 91 */
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
     * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
     */
exports.default = CodeBlock;

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _domUtils = __webpack_require__(3);

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
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
    } else {
      styleBold(sq);
    }

    var range = sq.getSelection();
    if (sq.hasFormat('table') && !_domUtils2.default.isTextNode(range.commonAncestorContainer)) {
      range.collapse(true);
      sq.setSelection(range);
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
  } else if (!sq.hasFormat('a') && !sq.hasFormat('PRE')) {
    if (sq.hasFormat('code')) {
      sq.changeFormat(null, { tag: 'code' });
    }
    sq.bold();
  }
}

exports.default = Bold;

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _domUtils = __webpack_require__(3);

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
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
    var range = sq.getSelection();
    var tableSelectionManager = wwe.componentManager.getManager('tableSelection');

    wwe.focus();

    if (sq.hasFormat('table') && tableSelectionManager.getSelectedCells().length) {
      tableSelectionManager.styleToSelectedCells(styleItalic);
    } else {
      styleItalic(sq);
    }

    if (sq.hasFormat('table') && !_domUtils2.default.isTextNode(range.commonAncestorContainer)) {
      range.collapse(true);
      sq.setSelection(range);
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
  } else if (!sq.hasFormat('a') && !sq.hasFormat('PRE')) {
    if (sq.hasFormat('code')) {
      sq.changeFormat(null, { tag: 'code' });
    }
    sq.italic();
  }
}

exports.default = Italic;

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _domUtils = __webpack_require__(3);

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
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
    var range = sq.getSelection();
    var tableSelectionManager = wwe.componentManager.getManager('tableSelection');

    wwe.focus();

    if (sq.hasFormat('table') && tableSelectionManager.getSelectedCells().length) {
      tableSelectionManager.styleToSelectedCells(styleStrike);
    } else {
      styleStrike(sq);
    }

    if (sq.hasFormat('table') && !_domUtils2.default.isTextNode(range.commonAncestorContainer)) {
      range.collapse(true);
      sq.setSelection(range);
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
  } else if (!sq.hasFormat('a') && !sq.hasFormat('PRE')) {
    if (sq.hasFormat('code')) {
      sq.changeFormat(null, { tag: 'code' });
    }
    sq.strikethrough();
  }
}

exports.default = Strike;

/***/ }),
/* 95 */
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
  keyMap: ['CTRL+Q', 'META+Q'],
  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();

    wwe.focus();

    if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
      wwe.unwrapBlockTag();
      sq.increaseQuoteLevel();
    }
  }
}); /**
     * @fileoverview Implements block quote WysiwygCommand
     * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
     */

exports.default = Blockquote;

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

    wwe.focus();

    if (!sq.hasFormat('PRE')) {
      sq.insertImage(data.imageUrl, { 'alt': data.altText });
    }
  }
}); /**
     * @fileoverview Implements AddImage wysiwyg command
     * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
     */
exports.default = AddImage;

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _importManager = __webpack_require__(18);

var _importManager2 = _interopRequireDefault(_importManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var decodeURIGraceful = _importManager2.default.decodeURIGraceful,
    encodeMarkdownCharacters = _importManager2.default.encodeMarkdownCharacters;

/**
 * AddLink
 * Add link markdown syntax to wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/AddLink
 * @ignore
 */
/**
 * @fileoverview Implements AddLink wysiwyg command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
    var url = data.url,
        linkText = data.linkText;

    linkText = decodeURIGraceful(linkText);
    url = encodeMarkdownCharacters(url);

    wwe.focus();

    if (!sq.hasFormat('PRE')) {
      sq.removeAllFormatting();

      if (sq.getSelectedText()) {
        sq.makeLink(url);
      } else {
        var link = sq.createElement('A', { href: url });
        (0, _jquery2.default)(link).text(linkText);
        sq.insertElement(link);
      }
    }
  }
});

exports.default = AddLink;

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _domUtils = __webpack_require__(3);

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
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
    var currentNode = void 0,
        nextBlockNode = void 0,
        previousSibling = void 0;

    if (range.collapsed && !sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
      currentNode = _domUtils2.default.getChildNodeByOffset(range.startContainer, range.startOffset);
      nextBlockNode = _domUtils2.default.getTopNextNodeUnder(currentNode, wwe.get$Body()[0]);

      if (!nextBlockNode) {
        nextBlockNode = sq.createDefaultBlock();
        wwe.get$Body().append(nextBlockNode);
      }

      var hr = sq.createElement('HR');

      sq.modifyBlocks(function (frag) {
        frag.appendChild(hr);

        return frag;
      });

      previousSibling = hr.previousSibling;

      if (previousSibling && _domUtils2.default.isTextNode(previousSibling) && _domUtils2.default.getTextLength(previousSibling) === 0) {
        hr.parentNode.removeChild(previousSibling);
      }

      range.selectNodeContents(nextBlockNode);
      range.collapse(true);

      sq.setSelection(range);
    }

    wwe.focus();
  }
});

exports.default = HR;

/***/ }),
/* 99 */
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
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
/* 100 */
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
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
    var _range = range,
        startContainer = _range.startContainer,
        endContainer = _range.endContainer,
        startOffset = _range.startOffset,
        endOffset = _range.endOffset;


    wwe.focus();
    sq.saveUndoState(range);

    var lines = listManager.getLinesOfSelection(startContainer, endContainer);

    var newLIs = [];
    for (var i = 0; i < lines.length; i += 1) {
      var newLI = this._changeFormatToUnorderedListIfNeed(wwe, lines[i]);
      newLIs.push(newLI);
    }

    range = sq.getSelection();
    range.setStart(newLIs[0].firstChild, startOffset);
    range.setEnd(newLIs[newLIs.length - 1].firstChild, endOffset);
    sq.setSelection(range);
    sq.saveUndoState(range);
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
    var newLI = range.startContainer;

    if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
      range.setStart(target, 0);
      range.collapse(true);
      sq.setSelection(range);

      if (sq.hasFormat('LI')) {
        wwe.saveSelection(range);
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
     * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
     */
exports.default = UL;

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
    var _range = range,
        startContainer = _range.startContainer,
        startOffset = _range.startOffset,
        endContainer = _range.endContainer,
        endOffset = _range.endOffset;


    wwe.focus();
    sq.saveUndoState(range);

    var lines = listManager.getLinesOfSelection(startContainer, endContainer);

    var newLIs = [];
    for (var i = 0; i < lines.length; i += 1) {
      var newLI = this._changeFormatToOrderedListIfNeed(wwe, lines[i]);
      newLIs.push(newLI);
    }

    range = sq.getSelection();
    range.setStart(newLIs[0].firstChild, startOffset);
    range.setEnd(newLIs[newLIs.length - 1].firstChild, endOffset);
    sq.setSelection(range);
    sq.saveUndoState(range);
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
    var newLI = range.startContainer;

    if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
      range.setStart(target, 0);
      range.collapse(true);
      sq.setSelection(range);

      if (sq.hasFormat('LI')) {
        wwe.saveSelection(range);
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
     * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
     */

exports.default = OL;

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
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
/* 104 */
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
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
/* 105 */
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

var _domUtils = __webpack_require__(3);

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
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
/* 106 */
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
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _domUtils = __webpack_require__(3);

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
    var tableMgr = wwe.componentManager.getManager('table');
    var selectionMgr = wwe.componentManager.getManager('tableSelection');
    var isAbleToRemoveColumn = (0, _jquery2.default)(range.startContainer).closest('table').find('thead tr th').length > 1;

    wwe.focus();
    // IE 800a025e error on removing part of selection range. collpase
    range.collapse(true);
    sq.setSelection(range);

    if (sq.hasFormat('TR', null, range) && isAbleToRemoveColumn) {
      sq.saveUndoState(range);
      var $nextFocus = void 0,
          $cell = void 0;

      var $selectedCellsByManager = selectionMgr.getSelectedCells();
      if ($selectedCellsByManager.length > 1) {
        var $tailCell = $selectedCellsByManager.last();
        var $headCell = $selectedCellsByManager.first();
        $nextFocus = $tailCell.next().length > 0 ? $tailCell.next() : $headCell.prev();

        removeMultipleColsByCells($selectedCellsByManager);
      } else {
        $cell = getCellByRange(range);
        $nextFocus = $cell.next().length ? $cell.next() : $cell.prev();

        removeColByCell($cell);
      }

      focusToCell(sq, $nextFocus, tableMgr);
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
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _commandManager = __webpack_require__(2);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _domUtils = __webpack_require__(3);

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
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
/* 109 */
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
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
/* 110 */
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
 * IncreaseDepth
 * increase depth of list or task to wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/IncreaseDepth
 * @ignore
 */
/**
 * @fileoverview Implements incease depth wysiwyg command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
var IncreaseDepth = _commandManager2.default.command('wysiwyg', /** @lends HR */{
  name: 'IncreaseDepth',
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

exports.default = IncreaseDepth;

/***/ }),
/* 111 */
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
 * DecreaseDepth
 * decrease depth of list or task to wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/DecreaseDepth
 * @ignore
 */
/**
 * @fileoverview Implements decrease depth wysiwyg command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
var DecreaseDepth = _commandManager2.default.command('wysiwyg', /** @lends HR */{
  name: 'DecreaseDepth',

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
 * test if decrease the depth of given list item
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

exports.default = DecreaseDepth;

/***/ }),
/* 112 */
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
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
var Task = _commandManager2.default.command('wysiwyg', /** @lends Task */{
  name: 'Task',
  keyMap: ['CTRL+T', 'META+T'],
  /**
   * Command Handler
   * @param {WysiwygEditor} wwe WYSIWYGEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    var range = sq.getSelection();
    var listManager = wwe.componentManager.getManager('list');
    var _range = range,
        startContainer = _range.startContainer,
        endContainer = _range.endContainer,
        startOffset = _range.startOffset,
        endOffset = _range.endOffset;


    wwe.focus();

    sq.saveUndoState(range);

    var lines = listManager.getLinesOfSelection(startContainer, endContainer);

    var newLIs = [];
    for (var i = 0; i < lines.length; i += 1) {
      var newLI = this._changeFormatToTaskIfNeed(wwe, lines[i]);
      newLIs.push(newLI);
    }

    range = sq.getSelection();
    range.setStart(newLIs[0].firstChild, startOffset);
    range.setEnd(newLIs[newLIs.length - 1].firstChild, endOffset);
    sq.setSelection(range);
    sq.saveUndoState(range);
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
    var newLI = range.startContainer;

    if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
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

var _domUtils = __webpack_require__(3);

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
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
    var range = sq.getSelection();
    var tableSelectionManager = wwe.componentManager.getManager('tableSelection');
    var _styleCode = _tuiCodeSnippet2.default.bind(styleCode, null, wwe.getEditor());

    wwe.focus();

    if (sq.hasFormat('table') && tableSelectionManager.getSelectedCells().length) {
      tableSelectionManager.styleToSelectedCells(_styleCode);
    } else {
      _styleCode(sq);
    }

    if (sq.hasFormat('table') && !_domUtils2.default.isTextNode(range.commonAncestorContainer)) {
      range.collapse(true);
      sq.setSelection(range);
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
/* 114 */
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

var CODEBLOCK_CLASS_PREFIX = 'te-content-codeblock-'; /**
                                                       * @fileoverview Implements code block WysiwygCommand
                                                       * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                       */

var CODEBLOCK_ATTR_NAME = 'data-te-codeblock';
var codeBlockID = 0;

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
      var attr = CODEBLOCK_ATTR_NAME + ' class = "' + CODEBLOCK_CLASS_PREFIX + codeBlockID + '"';

      if (type) {
        attr += ' data-language="' + type + '"';
      }

      var codeBlockBody = getCodeBlockBody(range, wwe);
      sq.insertHTML('<pre ' + attr + '>' + codeBlockBody + '</pre>');

      focusToFirstCode(wwe.get$Body().find('.' + CODEBLOCK_CLASS_PREFIX + codeBlockID), wwe);

      codeBlockID += 1;
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

  range.setStartBefore($pre.find('div')[0].firstChild);
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
  var contents = void 0,
      nodes = void 0;

  if (range.collapsed) {
    nodes = [(0, _jquery2.default)('<div><br></div>')[0]];
  } else {
    contents = range.extractContents();
    nodes = _tuiCodeSnippet2.default.toArray(contents.childNodes);
  }

  var codeBlock = mgr.convertToCodeblock(nodes).innerHTML;

  return codeBlock;
}

exports.default = CodeBlock;

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _i18n = __webpack_require__(4);

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
  'Insert link': 'Insert link',
  'Insert CodeBlock': 'Insert codeBlock',
  'Insert table': 'Insert table',
  'Insert image': 'Insert image',
  'Heading': 'Heading',
  'Image URL': 'Image URL',
  'Select image file': 'Select image file',
  'Description': 'Description',
  'OK': 'OK',
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
  'Cannot paste values ​​other than a table in the cell selection state': 'Cannot paste values ​​other than a table in the cell selection state.',
  'Choose language': 'Choose language'
}); /**
    * @fileoverview I18N for English
    * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
    */

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _i18n = __webpack_require__(4);

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
  'Insert link': '링크 삽입',
  'Insert CodeBlock': '코드블럭 삽입',
  'Insert table': '표 삽입',
  'Insert image': '이미지 삽입',
  'Heading': '제목',
  'Image URL': '이미지 주소',
  'Select image file': '이미지 파일을 선택하세요.',
  'Description': '설명',
  'OK': '확인',
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
  'Cannot paste values ​​other than a table in the cell selection state.': '셀 선택 상태에서는 테이블 이외의 값은 붙여넣을 수 없습니다.',
  'Choose language': '언어 선택'
}); /**
    * @fileoverview I18N for Korean
    * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
    */

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _i18n = __webpack_require__(4);

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
  'Line': '画水平线',
  'Blockquote': '引用块',
  'Unordered list': '无序列表',
  'Ordered list': '有序列表',
  'Task': '任务',
  'Insert link': '插入链接',
  'Insert CodeBlock': '插入代码块',
  'Insert table': '插入表格',
  'Insert image': '插入图片',
  'Heading': '标题',
  'Image URL': '图片网址',
  'Select image file': '选择映像文件',
  'Description': '说明',
  'OK': '确认',
  'Cancel': '取消',
  'File': '文件',
  'URL': 'URL',
  'Link text': '链接文本',
  'Add row': '添加一行',
  'Add col': '添加列',
  'Remove row': '删除行',
  'Remove col': '删除列',
  'Align left': '左对齐',
  'Align center': '居中对齐',
  'Align right': '右对齐',
  'Remove table': '删除表',
  'Would you like to paste as table?': '你想粘贴表吗?',
  'Text color': '文字色相',
  'Auto scroll enabled': '自动滚动启用',
  'Auto scroll disabled': '自动的滚动作非使用',
  'Cannot paste values ​​other than a table in the cell selection state': '在单元格选择状态下无法粘贴表格以外的值。',
  'Choose language': '选择语言'
}); /**
    * @fileoverview I18N for Chinese
    * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
    */

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _i18n = __webpack_require__(4);

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
  'Insert link': 'リンク挿入',
  'Insert CodeBlock': 'コードブロック挿入',
  'Insert table': 'テーブル挿入',
  'Insert image': '画像挿入',
  'Heading': '見出し',
  'Image URL': 'イメージURL',
  'Select image file': '画像ファイル選択',
  'Description': 'ディスクリプション ',
  'OK': 'はい',
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
  'Cannot paste values ​​other than a table in the cell selection state': '表以外の値をセル選択状態に貼り付けることはできません。',
  'Choose language': '言語選択'
}); /**
    * @fileoverview I18N for Japanese
    * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
    */

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _i18n = __webpack_require__(4);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_i18n2.default.setLanguage(['nl', 'nl_NL'], {
  'Markdown': 'Markdown',
  'WYSIWYG': 'WYSIWYG',
  'Write': 'Write',
  'Preview': 'Preview',
  'Headings': 'Koppen',
  'Paragraph': 'tekst',
  'Bold': 'Vet',
  'Italic': 'Cursief',
  'Strike': 'Doorhalen',
  'Code': 'Inline Code',
  'Line': 'Regel',
  'Blockquote': 'Citaatblok',
  'Unordered list': 'Opsomming',
  'Ordered list': 'Genummerde opsomming',
  'Task': 'Taak',
  'Insert link': 'Link invoegen',
  'Insert CodeBlock': 'Codeblok toevoegen',
  'Insert table': 'Tabel invoegen',
  'Insert image': 'Afbeelding invoegen',
  'Heading': 'Kop',
  'Image URL': 'Afbeelding URL',
  'Select image file': 'Selecteer een afbeelding',
  'Description': 'Omschrijving',
  'OK': 'OK',
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
  'Cannot paste values ​​other than a table in the cell selection state': 'Kan geen waardes anders dan de tabel in de cell plakken',
  'Choose language': 'Kies een taal'
}); /**
    * @fileoverview I18N for Dutch
    * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
    */

/***/ })
/******/ ]);
});