/*!
 * tui-editor
 * @version 1.0.4
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com> (https://nhnent.github.io/tui.editor/)
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jquery"), require("tui-code-snippet"), (function webpackLoadOptionalExternalModule() { try { return require("tui-editor"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return require("tui-editor/dist/tui-editor-Viewer"); } catch(e) {} }()));
	else if(typeof define === 'function' && define.amd)
		define(["jquery", "tui-code-snippet", "tui-editor", "tui-editor/dist/tui-editor-Viewer"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("jquery"), require("tui-code-snippet"), (function webpackLoadOptionalExternalModule() { try { return require("tui-editor"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return require("tui-editor/dist/tui-editor-Viewer"); } catch(e) {} }())) : factory(root["$"], (root["tui"] && root["tui"]["util"]), (root["tui"] && root["tui"]["Editor"]), (root["tui"] && root["tui"]["Editor"]));
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 46);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
* @fileoverview Editor/Viewer proxy for extensions
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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

/***/ 2:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),

/***/ 4:
/***/ (function(module, exports) {

if(typeof __WEBPACK_EXTERNAL_MODULE_4__ === 'undefined') {var e = new Error("Cannot find module \"undefined\""); e.code = 'MODULE_NOT_FOUND'; throw e;}
module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),

/***/ 46:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _editorProxy = __webpack_require__(1);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

var _scrollManager = __webpack_require__(47);

var _scrollManager2 = _interopRequireDefault(_scrollManager);

var _sectionManager = __webpack_require__(48);

var _sectionManager2 = _interopRequireDefault(_sectionManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @fileoverview Implements Scroll Sync Extension
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
var Button = _editorProxy2.default.Button;

/**
 * scrollSync plugin
 * @param {Editor} editor - editor
 * @ignore
 */

function scrollSyncExtension(editor) {
  var className = 'tui-scrollsync';
  var i18n = editor.i18n;
  var TOOL_TIP = {
    active: i18n.get('Auto scroll enabled'),
    inActive: i18n.get('Auto scroll disabled')
  };

  if (editor.isViewer()) {
    return;
  }

  var cm = editor.getCodeMirror();
  var sectionManager = new _sectionManager2.default(cm, editor.preview);
  var scrollManager = new _scrollManager2.default(sectionManager, cm, editor.preview.$el);

  var isScrollable = false;
  var isActive = true;
  var button = void 0;
  var $divider = void 0;

  // UI
  if (editor.getUI().name === 'default') {
    // init button
    button = new Button({
      className: className,
      command: 'scrollSyncToggle',
      tooltip: TOOL_TIP.active,
      $el: (0, _jquery2.default)('<button class="active ' + className + '" type="button"></button>')
    });

    $divider = editor.getUI().toolbar.addDivider();
    editor.getUI().toolbar.addButton(button);

    changeButtonVisiblityStateIfNeed();
    // hide scroll follow button in wysiwyg
    editor.on('changeMode', changeButtonVisiblityStateIfNeed);
    editor.on('changePreviewStyle', changeButtonVisiblityStateIfNeed);

    // Commands
    editor.addCommand('markdown', {
      name: 'scrollSyncToggle',
      exec: function exec() {
        isActive = !isActive;
        button._onOut();
        if (isActive) {
          button.$el.addClass('active');
          button.tooltip = TOOL_TIP.active;
        } else {
          button.$el.removeClass('active');
          button.tooltip = TOOL_TIP.inActive;
        }
        button._onOver();
      }
    });
  }

  // Events
  cm.on('change', function () {
    isScrollable = false;
    sectionManager.makeSectionList();
  });

  /**
   * change button visiblity state
   */
  function changeButtonVisiblityStateIfNeed() {
    if (editor.mdPreviewStyle === 'vertical' && editor.currentMode === 'markdown') {
      button.$el.show();
      $divider.show();
    } else {
      button.$el.hide();
      $divider.hide();
    }
  }

  editor.on('previewRenderAfter', function () {
    sectionManager.sectionMatch();
    scrollManager.syncPreviewScrollTopToMarkdown();
    isScrollable = true;
  });

  editor.eventManager.listen('scroll', function (event) {
    if (!isActive) {
      return;
    }

    if (isScrollable && editor.preview.isVisible()) {
      if (event.source === 'markdown' && !scrollManager.isMarkdownScrollEventBlocked) {
        scrollManager.syncPreviewScrollTopToMarkdown();
      } else if (event.source === 'preview' && !scrollManager.isPreviewScrollEventBlocked) {
        scrollManager.syncMarkdownScrollTopToPreview();
      }
    } else {
      scrollManager.saveScrollInfo();
    }
  });
}

_editorProxy2.default.defineExtension('scrollSync', scrollSyncExtension);

exports.default = scrollSyncExtension;

/***/ }),

/***/ 47:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * @fileoverview Implements Scroll Sync Extension ScrollManager Module
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */


var _tuiCodeSnippet = __webpack_require__(2);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PREVIEW_MARGIN_TOP = 57;
var SCROLL_TOP_PADDING = 20;
var SCROLL_BOCKING_RESET_DELAY = 15;

/**
 * Class ScrollManager
 * manage scroll sync between markdown editor and preview
 */

var ScrollManager = function () {
  /**
   * Creates an instance of ScrollManager.
   * @param {SectionManager} sectionManager - sectionManager
   * @param {CodeMirror} cm - CodeMirror
   * @param {jQuery} $previewContainerEl - preview container
   * @memberof ScrollManager
   */
  function ScrollManager(sectionManager, cm, $previewContainerEl) {
    _classCallCheck(this, ScrollManager);

    this.sectionManager = sectionManager;
    this.cm = cm;
    this.$previewContainerEl = $previewContainerEl;
    this.$contents = this.$previewContainerEl.find('.tui-editor-contents');
    this.releaseTimer = null;
    /**
     * current timeout id needs animation
     * @type {number}
     */
    this._currentTimeoutId = null;

    /**
     * Saved scrollInfo object of CodeMirror
     * @type {object}
     */
    this._savedScrollInfo = null;
  }

  /**
   * _getEditorSectionHeight
   * Return section height of editor
   * @param {object} section section be calculated height
   * @returns {number} height
   * @private
   */


  _createClass(ScrollManager, [{
    key: '_getEditorSectionHeight',
    value: function _getEditorSectionHeight(section) {
      var height = this.cm.heightAtLine(section.end, 'local');
      height -= this.cm.heightAtLine(section.start > 0 ? section.start - 1 : 0, 'local');

      return height;
    }

    /**
     * _getLineHeightGapInSection
     * Return height gap between passed line in passed section
     * @param {object} section section be calculated
     * @param {number} line line number
     * @returns {number} gap
     * @private
     */

  }, {
    key: '_getEditorLineHeightGapInSection',
    value: function _getEditorLineHeightGapInSection(section, line) {
      var gap = this.cm.heightAtLine(line, 'local');
      gap -= this.cm.heightAtLine(section.start > 0 ? section.start - 1 : 0, 'local');

      return Math.max(gap, 0);
    }

    /**
     * _getSectionScrollRatio
     * Return ratio of height between scrollTop line and scrollTop section
     * @param {object} section section be calculated
     * @param {number} line line number
     * @returns {number} ratio
     * @private
     */

  }, {
    key: '_getEditorSectionScrollRatio',
    value: function _getEditorSectionScrollRatio(section, line) {
      var isOneLine = section.end === section.start;
      var ratio = void 0;

      if (isOneLine) {
        ratio = 0;
      } else {
        ratio = this._getEditorLineHeightGapInSection(section, line) / this._getEditorSectionHeight(section);
      }

      return ratio;
    }

    /**
     * _getScrollFactorsOfEditor
     * Return Scroll Information of editor for preview scroll sync
     * @returns {object} scroll factors
     * @private
     */

  }, {
    key: '_getScrollFactorsOfEditor',
    value: function _getScrollFactorsOfEditor() {
      var cm = this.cm;

      var scrollInfo = cm.getScrollInfo();
      var topLine = void 0,
          topSection = void 0,
          ratio = void 0,
          factors = void 0;

      // if codemirror has not visible scrollInfo have incorrect value
      // so we use saved scroll info for alternative
      scrollInfo = this._fallbackScrollInfoIfIncorrect(scrollInfo);

      var isEditorBottom = scrollInfo.height - scrollInfo.top <= scrollInfo.clientHeight;

      if (isEditorBottom) {
        factors = {
          isEditorBottom: isEditorBottom
        };
      } else {
        topLine = cm.coordsChar({
          left: scrollInfo.left,
          top: scrollInfo.top
        }, 'local').line;

        topSection = this.sectionManager.sectionByLine(topLine);

        ratio = this._getEditorSectionScrollRatio(topSection, topLine);

        factors = {
          section: topSection,
          sectionRatio: ratio
        };
      }

      return factors;
    }

    /**
     * Return Scroll Information of editor for Markdown scroll sync
     * @returns {object} scroll factors
     * @private
     */

  }, {
    key: '_getScrollInfoForMarkdown',
    value: function _getScrollInfoForMarkdown() {
      var _this = this;

      var sectionList = this.sectionManager.getSectionList();
      var factors = void 0;

      _tuiCodeSnippet2.default.forEachArray(sectionList, function (section) {
        var $div = section.$previewSectionEl;
        var $preview = $div.parent().parent();
        var isPreviewBottom = $preview[0].clientHeight - $preview.scrollTop() <= $preview[0].height;
        var needNext = true;

        if (isPreviewBottom) {
          factors = {
            isPreviewBottom: isPreviewBottom
          };
          needNext = false;
        } else if (_this._isTopSection($preview, $div)) {
          factors = {
            section: section,
            sectionRatio: _this._getMarkdownEditorScrollRatio($preview, $div)
          };
          needNext = false;
        }

        return needNext;
      });

      return factors;
    }

    /**
     * Return ScrollRatio for Markdown scroll value
     * @param {jQuery} $preview jQuery wrapped preview container
     * @param {jQuery} $div jQuery wrapped section div element
     * @returns {number}
     * @private
     */

  }, {
    key: '_getMarkdownEditorScrollRatio',
    value: function _getMarkdownEditorScrollRatio($preview, $div) {
      return ($preview.scrollTop() - $div[0].offsetTop) / $div.height();
    }

    /**
     * _getScrollTopForPreview
     * Return scrollTop value for preview
     * @returns {number|undefined} scrollTop value, when something wrong then return undefined
     * @private
     */

  }, {
    key: '_getScrollTopForPreview',
    value: function _getScrollTopForPreview() {
      var scrollTop = void 0;

      var scrollFactors = this._getScrollFactorsOfEditor();
      var section = scrollFactors.section,
          sectionRatio = scrollFactors.sectionRatio;


      if (scrollFactors.isEditorBottom) {
        scrollTop = this.$contents.height();
      } else if (section.$previewSectionEl) {
        scrollTop = section.$previewSectionEl[0].offsetTop;
        scrollTop += section.$previewSectionEl.height() * sectionRatio - SCROLL_TOP_PADDING;
      }

      scrollTop = scrollTop && Math.max(scrollTop, 0);

      return scrollTop;
    }

    /**
     * Return scrollTop value for Markdown editor
     * @returns {number}
     * @private
     */

  }, {
    key: '_getScrollTopForMarkdown',
    value: function _getScrollTopForMarkdown() {
      var scrollTop = void 0;
      var scrollFactors = this._getScrollInfoForMarkdown();
      var ratio = scrollFactors.sectionRatio;

      if (scrollFactors.isPreviewBottom) {
        scrollTop = this.cm.getScrollInfo().height;
      } else if (scrollFactors.section) {
        var section = scrollFactors.section;

        var coordsAtStart = this.cm.charCoords({
          line: section.start,
          char: 0
        }, 'local');
        var coordsAtEnd = this.cm.charCoords({
          line: section.end,
          char: 0
        }, 'local');

        scrollTop = coordsAtStart.top;
        scrollTop += (coordsAtEnd.top - coordsAtStart.top) * ratio;
      }

      scrollTop = scrollTop && Math.max(scrollTop, 0);

      return scrollTop;
    }

    /**
     * syncPreviewScrollTopToMarkdown
     * sync preview scroll to markdown
     */

  }, {
    key: 'syncPreviewScrollTopToMarkdown',
    value: function syncPreviewScrollTopToMarkdown() {
      var _this2 = this;

      var $previewContainerEl = this.$previewContainerEl;

      var sourceScrollTop = $previewContainerEl.scrollTop();
      var targetScrollTop = this._getScrollTopForPreview();

      this.isPreviewScrollEventBlocked = true;

      this._animateRun(sourceScrollTop, targetScrollTop, function (deltaScrollTop) {
        clearTimeout(_this2.releaseTimer);

        $previewContainerEl.scrollTop(deltaScrollTop);

        _this2.releaseTimer = setTimeout(function () {
          _this2.isPreviewScrollEventBlocked = false;
        }, SCROLL_BOCKING_RESET_DELAY);
      });
    }

    /**
     * syncMarkdownScrollTopToPreview
     * sync markdown scroll to preview
     */

  }, {
    key: 'syncMarkdownScrollTopToPreview',
    value: function syncMarkdownScrollTopToPreview() {
      var _this3 = this;

      var codeMirror = this.cm;
      var codeMirrorScrollInfo = codeMirror.getScrollInfo();
      var sourceScrollTop = codeMirrorScrollInfo.top;
      var targetScrollTop = this._getScrollTopForMarkdown();

      this.isMarkdownScrollEventBlocked = true;

      this._animateRun(sourceScrollTop, targetScrollTop, function (deltaScrollTop) {
        clearTimeout(_this3.releaseTimer);

        codeMirror.scrollTo(0, deltaScrollTop);

        _this3.releaseTimer = setTimeout(function () {
          _this3.isMarkdownScrollEventBlocked = false;
        }, SCROLL_BOCKING_RESET_DELAY);
      });
    }

    /**
     * _animateRun
     * animate with passed Callback
     * @param {number} originValue original value
     * @param {number} targetValue target value
     * @param {function} stepCB callback function
     * @private
     */

  }, {
    key: '_animateRun',
    value: function _animateRun(originValue, targetValue, stepCB) {
      var valueDiff = targetValue - originValue,
          startTime = Date.now(),
          self = this;

      // if already doing animation
      if (this._currentTimeoutId) {
        clearTimeout(this._currentTimeoutId);
      }

      /**
       * Each animation step
       */
      function step() {
        var stepTime = Date.now();
        var progress = (stepTime - startTime) / 200; // 200 is animation time
        var deltaValue = void 0;

        if (progress < 1) {
          deltaValue = originValue + valueDiff * Math.cos((1 - progress) * Math.PI / 2);
          stepCB(Math.ceil(deltaValue));
          self._currentTimeoutId = setTimeout(step, 1);
        } else {
          stepCB(targetValue);
          self._currentTimeoutId = null;
        }
      }

      step();
    }

    /**
     * Fallback to saved scrolInfo if incorrect scrollInfo passed
     * this because incorrect CodeMirror returns scrollInfo if CodeMirror is invisible
     * @param {object} scrollInfo scrollInfo
     * @returns {object} scrollInfo
     * @private
     */

  }, {
    key: '_fallbackScrollInfoIfIncorrect',
    value: function _fallbackScrollInfoIfIncorrect(scrollInfo) {
      return scrollInfo.height < 0 && this._savedScrollInfo ? this._savedScrollInfo : scrollInfo;
    }

    /**
     * Save Codemirror's scrollInfo for alternative use
     * memberOf ScrollManager
     */

  }, {
    key: 'saveScrollInfo',
    value: function saveScrollInfo() {
      this._savedScrollInfo = this.cm.getScrollInfo();
    }

    /**
     * Return whether given range is top section of preview contents or not
     * @param {jQuery} $preview jQuery wrapped preview container
     * @param {jQuery} $div jQuery wrapped section div element
     * @returns {boolean}
     * @private
     */

  }, {
    key: '_isTopSection',
    value: function _isTopSection($preview, $div) {
      var previewScrollTop = $preview.scrollTop();
      var divOffsetTop = $div[0].offsetTop;
      var divHeight = $div.height();
      var isSectionBegin = previewScrollTop >= divOffsetTop - PREVIEW_MARGIN_TOP;
      var isSectionEnd = previewScrollTop > divOffsetTop + divHeight;

      return isSectionBegin && !isSectionEnd;
    }
  }]);

  return ScrollManager;
}();

exports.default = ScrollManager;

/***/ }),

/***/ 48:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * @fileoverview Implements Scroll Sync Extension SectionManager Module
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FIND_HEADER_RX = /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/;
var FIND_LIST_RX = /^ *(\*|-|\d+\.|[*-] \[[ xX]])\s/;
var FIND_QUOTE_RX = /^ {0,3}(> ?)+\s/;
var FIND_IMAGE_RX = /^ {0,3}!\[([^[\]]*)]\(([^)]*)\)/;
var FIND_SETEXT_HEADER_RX = /^ *(?:={1,}|-{1,})\s*$/;
var FIND_CODEBLOCK_END_RX = /^ *(`{3,}|~{3,})[ ]*$/;
var FIND_CODEBLOCK_START_RX = /^ *(`{3,}|~{3,})[ .]*(\S+)? */;
var FIND_SPACE = /\s/g;

/**
 * Class SectionManager
 * manage logical markdown content sections
 */

var SectionManager = function () {
  /**
   * Creates an instance of SectionManager.
   * @param {CodeMirror} cm - codemirror
   * @param {Preview} preview - preview
   * @memberof SectionManager
   */
  function SectionManager(cm, preview) {
    _classCallCheck(this, SectionManager);

    this.cm = cm;
    this.preview = preview;
    this.$previewContent = preview.$el.find('.tui-editor-contents');

    /**
     *  section list
     * @type {object[]}
     */
    this._sectionList = null;

    /**
     * current working section needs making section list
     * @type {object}
     */
    this._currentSection = null;
  }

  /**
   * _addNewSection
   * add new section
   * @param {number} start initial start line number
   * @param {number} end initial end line number
   * @private
   */


  _createClass(SectionManager, [{
    key: '_addNewSection',
    value: function _addNewSection(start, end) {
      var newSection = this._makeSectionData(start, end);
      this._sectionList.push(newSection);
      this._currentSection = newSection;
    }

    /**
     * getSectionList
     * return section list
     * @returns {object[]} section object list
     */

  }, {
    key: 'getSectionList',
    value: function getSectionList() {
      if (!this._sectionList) {
        this.makeSectionList();
      }

      return this._sectionList;
    }

    /**
     * _makeSectionData
     * make default section object
     * @param {number} start initial start line number
     * @param {number} end initial end line number
     * @returns {object} section object
     * @private
     */

  }, {
    key: '_makeSectionData',
    value: function _makeSectionData(start, end) {
      return {
        start: start,
        end: end,
        $previewSectionEl: null
      };
    }

    /**
     * _updateCurrentSectionEnd
     * update current section's end line number
     * @param {number} end end value to update
     * @private
     */

  }, {
    key: '_updateCurrentSectionEnd',
    value: function _updateCurrentSectionEnd(end) {
      this._currentSection.end = end;
    }

    /**
     * _eachLineState
     * iterate codemiror lines, callback function parameter pass line type and line number
     * @param {function} iteratee callback function
     * @private
     */

  }, {
    key: '_eachLineState',
    value: function _eachLineState(iteratee) {
      var isSection = void 0,
          i = void 0,
          lineString = void 0,
          nextLineString = void 0,
          prevLineString = void 0,
          isTrimming = true,
          onTable = false,
          onCodeBlock = false,
          trimCapture = '';
      var isRightAfterImageSection = false;
      var isEnsuredSection = false;
      var codeblockStartLineIndex = void 0;

      var lineLength = this.cm.getDoc().lineCount();

      for (i = 0; i < lineLength; i += 1) {
        isSection = false;
        lineString = this.cm.getLine(i);
        nextLineString = this.cm.getLine(i + 1) || '';
        prevLineString = this.cm.getLine(i - 1) || '';
        var isCodeBlockEnded = this._isCodeBlockEnd(prevLineString) && codeblockStartLineIndex !== i - 1;

        if (onTable && (!lineString || !this._isTableCode(lineString))) {
          onTable = false;
        } else if (!onTable && this._isTable(lineString, nextLineString)) {
          onTable = true;
        }

        if (onCodeBlock && isCodeBlockEnded) {
          onCodeBlock = false;
        }
        if (!onCodeBlock && this._isCodeBlockStart(lineString)) {
          onCodeBlock = this._doFollowedLinesHaveCodeBlockEnd(i, lineLength);
          codeblockStartLineIndex = i;
        }

        if (isEnsuredSection && lineString.length !== 0) {
          if (this._isIndependentImage(onCodeBlock, onTable, lineString, prevLineString)) {
            isRightAfterImageSection = true;
            isEnsuredSection = true;
          } else {
            isRightAfterImageSection = false;
            isEnsuredSection = false;
          }

          isSection = true;
        } else if (this._isAtxHeader(lineString)) {
          isRightAfterImageSection = false;
          isSection = true;
          isEnsuredSection = false;
          // setext header
        } else if (!this._isCodeBlockEnd(lineString) && !onTable && this._isSeTextHeader(lineString, nextLineString)) {
          isRightAfterImageSection = false;
          isSection = true;
          isEnsuredSection = false;
        } else if (this._isIndependentImage(onCodeBlock, onTable, lineString, prevLineString)) {
          isRightAfterImageSection = true;
          isSection = true;
          isEnsuredSection = false;
        } else if (isRightAfterImageSection && lineString.length === 0) {
          isRightAfterImageSection = false;
          isEnsuredSection = true;
        }

        // resolve wrong number of sections mismatch compare to preview
        if (isTrimming) {
          trimCapture += lineString.trim();

          if (trimCapture) {
            isTrimming = false;
          } else {
            continue;
          }
        }

        iteratee(isSection, i);
      }
    }

    /**
     * Return whether is independent image line with padding lines top and bottom
     * @param {boolean} onCodeBlock Is on codeblock
     * @param {boolean} onTable Is on table
     * @param {string} lineString Current line string
     * @param {string} prevLineString Previous line string
     * @returns {boolean}
     * @private
     */

  }, {
    key: '_isIndependentImage',
    value: function _isIndependentImage(onCodeBlock, onTable, lineString, prevLineString) {
      return !onCodeBlock && !onTable && this._isImage(lineString) && !this._isList(lineString) && !this._isQuote(lineString) && prevLineString.length === 0;
    }

    /**
     * _doFollowedLinesHaveCodeBlockEnd
     * Check if follow lines have codeblock end
     * @param {number} lineIndex current index
     * @param {number} lineLength line length
     * @returns {boolean} result
     * @private
     */

  }, {
    key: '_doFollowedLinesHaveCodeBlockEnd',
    value: function _doFollowedLinesHaveCodeBlockEnd(lineIndex, lineLength) {
      var doLineHaveCodeBlockEnd = false;

      for (var i = lineIndex + 1; i < lineLength; i += 1) {
        if (this._isCodeBlockEnd(this.cm.getLine(i))) {
          doLineHaveCodeBlockEnd = true;
          break;
        }
      }

      return doLineHaveCodeBlockEnd;
    }

    /**
     * _isCodeBlockStart
     * Check if passed string have code block start
     * @param {string} string string to check
     * @returns {boolean} result
     * @private
     */

  }, {
    key: '_isCodeBlockStart',
    value: function _isCodeBlockStart(string) {
      return FIND_CODEBLOCK_START_RX.test(string);
    }

    /**
     * _isCodeBlockEnd
     * Check if passed string have code block end
     * @param {string} string string to check
     * @returns {boolean} result
     * @private
     */

  }, {
    key: '_isCodeBlockEnd',
    value: function _isCodeBlockEnd(string) {
      return FIND_CODEBLOCK_END_RX.test(string);
    }

    /**
     * _isTable
     * Check if passed string have table
     * @param {string} lineString current line string
     * @param {string} nextLineString next line string
     * @returns {boolean} result
     * @private
     */

  }, {
    key: '_isTable',
    value: function _isTable(lineString, nextLineString) {
      return this._isTableCode(lineString) && this._isTableAligner(nextLineString);
    }

    /**
     * _isTableCode
     * Check if passed string have table code
     * @param {string} string string to check
     * @returns {boolean} result
     * @private
     */

  }, {
    key: '_isTableCode',
    value: function _isTableCode(string) {
      return (/(^\S?.*\|.*)/.test(string)
      );
    }

    /**
     * _isTableAligner
     * Check if passed string have table align code
     * @param {string} string string to check
     * @returns {boolean} result
     * @private
     */

  }, {
    key: '_isTableAligner',
    value: function _isTableAligner(string) {
      return (/(\s*[-:]+\s*\|)+/.test(string)
      );
    }

    /**
     * _isAtxHeader
     * Check if passed string have atx header
     * @param {string} string string to check
     * @returns {boolean} result
     * @private
     */

  }, {
    key: '_isAtxHeader',
    value: function _isAtxHeader(string) {
      return FIND_HEADER_RX.test(string);
    }

    /**
     * _isSeTextHeader
     * @param {string} lineString current line string
     * @param {string} nextLineString next line string
     * @returns {boolean} result
     * @private
     */

  }, {
    key: '_isSeTextHeader',
    value: function _isSeTextHeader(lineString, nextLineString) {
      return lineString.replace(FIND_SPACE, '') !== '' && nextLineString && FIND_SETEXT_HEADER_RX.test(nextLineString);
    }
  }, {
    key: '_isImage',
    value: function _isImage(lineString) {
      return FIND_IMAGE_RX.test(lineString);
    }
  }, {
    key: '_isList',
    value: function _isList(lineString) {
      return FIND_LIST_RX.test(lineString);
    }
  }, {
    key: '_isQuote',
    value: function _isQuote(lineString) {
      return FIND_QUOTE_RX.test(lineString);
    }

    /**
     * makeSectionList
     * make section list
     */

  }, {
    key: 'makeSectionList',
    value: function makeSectionList() {
      var _this = this;

      this._sectionList = [];

      this._eachLineState(function (isSection, lineNumber) {
        if (isSection || !_this._sectionList.length) {
          _this._addNewSection(lineNumber, lineNumber);
        } else {
          _this._updateCurrentSectionEnd(lineNumber);
        }
      });
    }

    /**
     * sectionMatch
     * make preview sections then match section list with preview section element
     */

  }, {
    key: 'sectionMatch',
    value: function sectionMatch() {
      if (this.getSectionList()) {
        var sections = this._getPreviewSections();
        this._matchPreviewSectionsWithSectionlist(sections);
      }
    }

    /**
     * _matchPreviewSectionsWithSectionlist
     * match section list with preview section element
     * @param {HTMLNode[]} sections section nodes
     * @private
     */

  }, {
    key: '_matchPreviewSectionsWithSectionlist',
    value: function _matchPreviewSectionsWithSectionlist(sections) {
      var sectionList = this.getSectionList();
      sections.forEach(function (childs, index) {
        var section = sectionList[index];
        if (section) {
          var $sectionDiv = (0, _jquery2.default)('<div class=\'content-id-' + index + '\'></div>');
          section.$previewSectionEl = (0, _jquery2.default)(childs).wrapAll($sectionDiv).parent();
        }
      });
    }

    /**
     * _getPreviewSections
     * get preview html section group to make section
     * @returns {array[]} element node array
     * @private
     */

  }, {
    key: '_getPreviewSections',
    value: function _getPreviewSections() {
      var sections = [];
      var lastSection = 0;
      var isRightAfterImageSection = false;

      sections[0] = [];

      this.$previewContent.contents().filter(findElementNodeFilter).each(function (index, el) {
        var isParagraph = el.tagName === 'P';
        var isHeading = el.tagName.match(/^(H1|H2|H3|H4|H5|H6)$/);
        var isImage = isParagraph && el.childNodes[0].nodeName === 'IMG';

        if ((isHeading || isImage || isRightAfterImageSection) && sections[lastSection].length) {
          sections.push([]);
          lastSection += 1;
          isRightAfterImageSection = false;
        }

        if (isImage) {
          isRightAfterImageSection = true;
        }

        sections[lastSection].push(el);
      });

      return sections;
    }

    /**
     * _sectionByLine
     * get section by markdown line
     * @param {number} line markdown editor line number
     * @returns {object} section
     */

  }, {
    key: 'sectionByLine',
    value: function sectionByLine(line) {
      var sectionIndex = void 0;
      var sectionList = this.getSectionList();
      var sectionLength = sectionList.length;

      for (sectionIndex = 0; sectionIndex < sectionLength; sectionIndex += 1) {
        if (line <= sectionList[sectionIndex].end) {
          break;
        }
      }

      if (sectionIndex === sectionLength) {
        sectionIndex = sectionLength - 1;
      }

      return sectionList[sectionIndex];
    }
  }]);

  return SectionManager;
}();

/**
 * findElementNodeFilter
 * @this Node
 * @returns {boolean} true or not
 * @ignore
 */


function findElementNodeFilter() {
  return this.nodeType === Node.ELEMENT_NODE;
}

exports.default = SectionManager;

/***/ }),

/***/ 5:
/***/ (function(module, exports) {

if(typeof __WEBPACK_EXTERNAL_MODULE_5__ === 'undefined') {var e = new Error("Cannot find module \"undefined\""); e.code = 'MODULE_NOT_FOUND'; throw e;}
module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ })

/******/ });
});