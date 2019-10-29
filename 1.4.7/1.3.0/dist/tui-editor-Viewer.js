/*!
 * tui-editor
 * @version 1.3.0
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com> (https://nhnent.github.io/tui.editor/)
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jquery"), require("tui-code-snippet"), require("markdown-it"), require("to-mark"), require("highlight.js"));
	else if(typeof define === 'function' && define.amd)
		define(["jquery", "tui-code-snippet", "markdown-it", "to-mark", "highlight.js"], factory);
	else if(typeof exports === 'object')
		exports["Editor"] = factory(require("jquery"), require("tui-code-snippet"), require("markdown-it"), require("to-mark"), require("highlight.js"));
	else
		root["tui"] = root["tui"] || {}, root["tui"]["Editor"] = factory(root["$"], (root["tui"] && root["tui"]["util"]), root["markdownit"], root["toMark"], root["hljs"]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_22__, __WEBPACK_EXTERNAL_MODULE_23__, __WEBPACK_EXTERNAL_MODULE_31__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 142);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),

/***/ 1:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),

/***/ 11:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _preview = __webpack_require__(12);

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

/***/ 12:
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

var _lazyRunner = __webpack_require__(20);

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

/***/ 13:
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

/***/ 14:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isMac = /Mac/.test(navigator.platform);

module.exports = {
  isMac: isMac
};

/***/ }),

/***/ 142:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Viewer = __webpack_require__(32);

// for jquery
/**
 * @fileoverview entry point for viewer
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
      instance = new Viewer(options);
      _jquery2.default.data(el, 'tuiEditor', instance);
    }
  }

  return this;
};

module.exports = Viewer;

/***/ }),

/***/ 15:
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

var eventList = ['previewBeforeHook', 'previewRenderAfter', 'previewNeedsRefresh', 'addImageBlobHook', 'setMarkdownAfter', 'contentChangedFromWysiwyg', 'changeFromWysiwyg', 'contentChangedFromMarkdown', 'changeFromMarkdown', 'change', 'changeModeToWysiwyg', 'changeModeToMarkdown', 'changeModeBefore', 'changeMode', 'changePreviewStyle', 'changePreviewTabPreview', 'changePreviewTabWrite', 'openPopupAddLink', 'openPopupAddImage', 'openPopupAddTable', 'openPopupTableUtils', 'openHeadingSelect', 'openPopupCodeBlockLanguages', 'openPopupCodeBlockEditor', 'openDropdownToolbar', 'closePopupCodeBlockLanguages', 'closePopupCodeBlockEditor', 'closeAllPopup', 'command', 'addCommandBefore', 'htmlUpdate', 'markdownUpdate', 'renderedHtmlUpdated', 'removeEditor', 'convertorAfterMarkdownToHtmlConverted', 'convertorBeforeHtmlToMarkdownConverted', 'convertorAfterHtmlToMarkdownConverted', 'stateChange', 'wysiwygSetValueAfter', 'wysiwygSetValueBefore', 'wysiwygGetValueBefore', 'wysiwygProcessHTMLText', 'wysiwygRangeChangeAfter', 'wysiwygKeyEvent', 'scroll', 'click', 'mousedown', 'mouseover', 'mouseout', 'mouseup', 'contextmenu', 'keydown', 'keyup', 'keyMap', 'load', 'focus', 'blur', 'paste', 'pasteBefore', 'willPaste', 'copy', 'copyBefore', 'copyAfter', 'cut', 'cutAfter', 'drop', 'show', 'hide'];

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

        return null;
      });

      this.events.set(type, handlersToSurvive);
    }
  }]);

  return EventManager;
}();

exports.default = EventManager;

/***/ }),

/***/ 16:
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

/***/ 17:
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

var _markdownIt = __webpack_require__(22);

var _markdownIt2 = _interopRequireDefault(_markdownIt);

var _toMark = __webpack_require__(23);

var _toMark2 = _interopRequireDefault(_toMark);

var _htmlSanitizer = __webpack_require__(13);

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
      var FIRST_TWO_BRS_BEFORE_RX = /([^>]|<\/a>|<\/code>|<\/span>|<\/b>|<\/i>|<\/s>|<img [^>]*>)/;
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

    /**
     * get markdownit
     * @returns {markdownit} - markdownit instance
     * @memberof Convertor
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

/***/ 2:
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

var _command = __webpack_require__(21);

var _command2 = _interopRequireDefault(_command);

var _util = __webpack_require__(14);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KEYMAP_OS_INDEX = _util.isMac ? 1 : 0;

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
 * @memberof CommandManager
 * @param {string} type Command type
 * @param {{name: string, keyMap: Array}} props Property
 * @returns {*}
 */


CommandManager.command = function (type, props) {
  var command = _command2.default.factory(type, props.name, props.keyMap);

  _tuiCodeSnippet2.default.extend(command, props);

  return command;
};

exports.default = CommandManager;

/***/ }),

/***/ 20:
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

/***/ 21:
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

/***/ 22:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_22__;

/***/ }),

/***/ 23:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_23__;

/***/ }),

/***/ 24:
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

/***/ 25:
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

/***/ 26:
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

/***/ 27:
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

/***/ 28:
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

/***/ 29:
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

/***/ 30:
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

/***/ 31:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_31__;

/***/ }),

/***/ 32:
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

var _mdPreview = __webpack_require__(11);

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
 */

var ToastUIEditorViewer = function () {
  /**
   * Viewer
   * @param {object} options Option object
    * @param {HTMLElement} options.el - container element
    * @param {string} options.initialValue Editor's initial value
    * @param {object} options.events eventlist Event list
      * @param {function} options.events.load It would be emitted when editor fully load
      * @param {function} options.events.change It would be emitted when content changed
      * @param {function} options.events.stateChange It would be emitted when format change by cursor position
      * @param {function} options.events.focus It would be emitted when editor get focus
      * @param {function} options.events.blur It would be emitted when editor loose focus
    * @param {object} options.hooks Hook list
      * @param {function} options.hooks.previewBeforeHook Submit preview to hook URL before preview be shown
    * @param {string[]} [options.exts] - extensions
    */
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
    this.toMarkOptions = null;

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

/***/ 4:
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
 * test whether root contains the given node
 * @param {HTMLNode} root - root node
 * @param {HTMLNode} node - node to test
 * @returns {Boolean} true if root contains node
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
  isBlockNode: isBlockNode,
  getTextLength: getTextLength,
  getOffsetLength: getOffsetLength,
  getPrevOffsetNodeUntil: getPrevOffsetNodeUntil,
  getNodeOffsetOfParent: getNodeOffsetOfParent,
  getChildNodeByOffset: getChildNodeByOffset,
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
  getSiblingRowCellByDirection: getSiblingRowCellByDirection
};

/***/ }),

/***/ 7:
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


var _highlight = __webpack_require__(31);

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

/***/ })

/******/ });
});