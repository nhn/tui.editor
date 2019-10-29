/*!
 * tui-editor
 * @version 1.0.1
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com> (https://nhnent.github.io/tui.editor/)
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jquery"), (function webpackLoadOptionalExternalModule() { try { return require("tui-editor"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return require("tui-editor/dist/tui-editor-Viewer"); } catch(e) {} }()), require("tui-color-picker"));
	else if(typeof define === 'function' && define.amd)
		define(["jquery", "tui-editor", "tui-editor/dist/tui-editor-Viewer", "tui-color-picker"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("jquery"), (function webpackLoadOptionalExternalModule() { try { return require("tui-editor"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return require("tui-editor/dist/tui-editor-Viewer"); } catch(e) {} }()), require("tui-color-picker")) : factory(root["$"], (root["tui"] && root["tui"]["Editor"]), (root["tui"] && root["tui"]["Editor"]), (root["tui"] && root["tui"]["colorPicker"]));
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_45__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 44);
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

/***/ 4:
/***/ (function(module, exports) {

if(typeof __WEBPACK_EXTERNAL_MODULE_4__ === 'undefined') {var e = new Error("Cannot find module \"undefined\""); e.code = 'MODULE_NOT_FOUND'; throw e;}
module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),

/***/ 44:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiColorPicker = __webpack_require__(45);

var _tuiColorPicker2 = _interopRequireDefault(_tuiColorPicker);

var _editorProxy = __webpack_require__(1);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var colorSyntaxRx = /\{color:(.+?)}(.*?)\{color}/g; /**
                                                    * @fileoverview Implements Color syntax Extension
                                                    * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                    */

var colorHtmlRx = /<span (?:class="colour" )?style="color:(.+?)"(?: class="colour")?>(.*?)/g;
var colorHtmlCompleteRx = /<span (?:class="colour" )?style="color:(.+?)"(?: class="colour")?>(.*?)<\/span>/g;
var decimalColorRx = /rgb\((\d+)[, ]+(\d+)[, ]+(\d+)\)/g;

var RESET_COLOR = '#181818';

/**
 * color syntax extension
 * @param {editor} editor - editor
 * @ignore
 */
function colorSyntaxExtension(editor) {
  var _editor$options$color = editor.options.colorSyntax,
      colorSyntax = _editor$options$color === undefined ? {} : _editor$options$color;
  var preset = colorSyntax.preset,
      _colorSyntax$useCusto = colorSyntax.useCustomSyntax,
      useCustomSyntax = _colorSyntax$useCusto === undefined ? false : _colorSyntax$useCusto;


  editor.eventManager.listen('convertorAfterMarkdownToHtmlConverted', function (html) {
    var replacement = void 0;

    if (!useCustomSyntax) {
      replacement = html;
    } else {
      replacement = html.replace(colorSyntaxRx, function (matched, p1, p2) {
        return makeHTMLColorSyntaxAndTextRange(p2, p1).result;
      });
    }

    return replacement;
  });

  editor.eventManager.listen('convertorAfterHtmlToMarkdownConverted', function (markdown) {
    var findRx = useCustomSyntax ? colorHtmlCompleteRx : colorHtmlRx;

    return markdown.replace(findRx, function (founded, color, text) {
      var replacement = void 0;

      if (color.match(decimalColorRx)) {
        color = changeDecColorsToHex(color);
      }

      if (!useCustomSyntax) {
        replacement = founded.replace(/ ?class="colour" ?/g, ' ').replace(decimalColorRx, color);
      } else {
        replacement = makeCustomColorSyntaxAndTextRange(text, color).result;
      }

      return replacement;
    });
  });

  if (!editor.isViewer() && editor.getUI().name === 'default') {
    editor.addCommand('markdown', {
      name: 'color',
      exec: function exec(mde, color) {
        var cm = mde.getEditor();
        var rangeFrom = cm.getCursor('from');
        var rangeTo = cm.getCursor('to');
        var replacedText = void 0;
        var replacedFrom = void 0;

        if (!color) {
          return;
        }

        if (!useCustomSyntax) {
          var _makeHTMLColorSyntaxA = makeHTMLColorSyntaxAndTextRange(cm.getSelection(), color);

          replacedText = _makeHTMLColorSyntaxA.result;
          replacedFrom = _makeHTMLColorSyntaxA.from;

          cm.replaceSelection(replacedText);
        } else {
          var _makeCustomColorSynta = makeCustomColorSyntaxAndTextRange(cm.getSelection(), color);

          replacedText = _makeCustomColorSynta.result;
          replacedFrom = _makeCustomColorSynta.from;

          cm.replaceSelection(replacedText);
        }

        cm.setSelection({
          line: rangeFrom.line,
          ch: rangeFrom.ch + replacedFrom
        }, {
          line: rangeTo.line,
          ch: rangeFrom.line === rangeTo.line ? rangeTo.ch + replacedFrom : rangeTo.ch
        });

        mde.focus();
      }
    });

    editor.addCommand('wysiwyg', {
      name: 'color',
      exec: function exec(wwe, color) {
        var sq = wwe.getEditor();

        if (!color) {
          return;
        }

        if (!sq.hasFormat('PRE')) {
          if (color === RESET_COLOR) {
            sq.changeFormat(null, {
              class: 'colour',
              tag: 'span'
            });
          } else {
            sq.setTextColour(color);
          }
        }

        wwe.focus();
      }
    });

    initUI(editor, preset);
  }
}

/**
 * Initialize UI
 * @param {object} editor Editor instance
 * @param {Array.<string>} preset Preset for color palette
 * @ignore
 */
function initUI(editor, preset) {
  var className = 'tui-color';
  var i18n = editor.i18n;

  editor.eventManager.addEventType('colorButtonClicked');

  editor.getUI().toolbar.addButton({
    className: className,
    event: 'colorButtonClicked',
    tooltip: i18n.get('Text color')
  }, 4);
  var $button = editor.getUI().toolbar.$el.find('button.' + className);

  var $colorPickerContainer = (0, _jquery2.default)('<div />');

  var $buttonBar = (0, _jquery2.default)('<button type="button" class="te-apply-button">입력</button>');

  var cpOptions = {
    container: $colorPickerContainer[0]
  };

  if (preset) {
    cpOptions.preset = preset;
  }

  var colorPicker = _tuiColorPicker2.default.create(cpOptions);

  var selectedColor = colorPicker.getColor();

  $colorPickerContainer.append($buttonBar);

  var popup = editor.getUI().createPopup({
    header: false,
    title: false,
    content: $colorPickerContainer,
    className: 'tui-popup-color',
    $target: editor.getUI().$el,
    css: {
      'width': 'auto',
      'position': 'absolute'
    }
  });

  editor.eventManager.listen('focus', function () {
    popup.hide();
  });

  editor.eventManager.listen('colorButtonClicked', function () {
    editor.eventManager.emit('closeAllPopup');
    if (popup.isShow()) {
      popup.hide();
    } else {
      var position = $button.position();
      popup.$el.css({
        top: position.top + $button.outerHeight(true),
        left: position.left
      });
      popup.show();
      colorPicker.slider.toggle(true);
    }
  });

  editor.eventManager.listen('closeAllPopup', function () {
    popup.hide();
  });

  editor.eventManager.listen('removeEditor', function () {
    colorPicker.off('selectColor');
  });

  colorPicker.on('selectColor', function (e) {
    selectedColor = e.color;

    if (e.origin === 'palette') {
      editor.exec('color', selectedColor);
      popup.hide();
    }
  });

  popup.$el.find('.te-apply-button').on('click', function () {
    editor.exec('color', selectedColor);
  });
}

/**
 * make custom color syntax
 * @param {string} text - Text content
 * @param {string} color - Color value
 * @returns {object} - wrapped text and range(from, to)
 * @ignore
 */
function makeCustomColorSyntaxAndTextRange(text, color) {
  return wrapTextAndGetRange('{color:' + color + '}', text, '{color}');
}

/**
 * Make HTML color syntax by given text content and color value
 * @param {string} text Text - content
 * @param {string} color Color - value
 * @returns {object} - wrapped text and range(from, to)
 * @ignore
 */
function makeHTMLColorSyntaxAndTextRange(text, color) {
  return wrapTextAndGetRange('<span style="color:' + color + '">', text, '</span>');
}

/**
 * wrap text with pre & post and return with text range
 * @param {string} pre - text pre
 * @param {string} text - text
 * @param {string} post - text post
 * @returns {object} - wrapped text and range(from, to)
 * @ignore
 */
function wrapTextAndGetRange(pre, text, post) {
  return {
    result: '' + pre + text + post,
    from: pre.length,
    to: pre.length + text.length
  };
}

/**
 * Change decimal color values to hexadecimal color value
 * @param {string} color Color value string
 * @returns {string}
 * @ignore
 */
function changeDecColorsToHex(color) {
  return color.replace(decimalColorRx, function (colorValue, r, g, b) {
    var hr = changeDecColorToHex(r);
    var hg = changeDecColorToHex(g);
    var hb = changeDecColorToHex(b);

    return '#' + hr + hg + hb;
  });
}

/**
 * change individual dec color value to hex color
 * @param {string} color - individual color value
 * @returns {string} - zero padded color string
 * @ignore
 */
function changeDecColorToHex(color) {
  var hexColor = parseInt(color, 10);
  hexColor = hexColor.toString(16);
  hexColor = doubleZeroPad(hexColor);

  return hexColor;
}

/**
 * leading 2 zeros number string
 * @param {string} numberStr - number string
 * @returns {string}
 * @ignore
 */
function doubleZeroPad(numberStr) {
  var padded = '00' + numberStr;

  return padded.substr(padded.length - 2);
}

_editorProxy2.default.defineExtension('colorSyntax', colorSyntaxExtension);

exports.default = colorSyntaxExtension;

/***/ }),

/***/ 45:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_45__;

/***/ }),

/***/ 5:
/***/ (function(module, exports) {

if(typeof __WEBPACK_EXTERNAL_MODULE_5__ === 'undefined') {var e = new Error("Cannot find module \"undefined\""); e.code = 'MODULE_NOT_FOUND'; throw e;}
module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ })

/******/ });
});