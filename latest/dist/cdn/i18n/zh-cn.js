/*!
 * TOAST UI Editor : i18n
 * @version 3.2.2
 * @author NHN Cloud FE Development Lab <dl_javascript@nhn.com>
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@toast-ui/editor"));
	else if(typeof define === 'function' && define.amd)
		define(["@toast-ui/editor"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("@toast-ui/editor")) : factory(root["toastui"]["Editor"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, function(__WEBPACK_EXTERNAL_MODULE__213__) {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 213:
/***/ (function(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE__213__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _editorCore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(213);
/* harmony import */ var _editorCore__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_editorCore__WEBPACK_IMPORTED_MODULE_0__);
/**
 * @fileoverview I18N for Chinese
 * @author NHN Cloud FE Development Lab <dl_javascript@nhn.com>
 */

_editorCore__WEBPACK_IMPORTED_MODULE_0___default().setLanguage('zh-CN', {
    Markdown: 'Markdown',
    WYSIWYG: '所见即所得',
    Write: '编辑',
    Preview: '预览',
    Headings: '标题',
    Paragraph: '文本',
    Bold: '加粗',
    Italic: '斜体字',
    Strike: '删除线',
    Code: '内嵌代码',
    Line: '水平线',
    Blockquote: '引用块',
    'Unordered list': '无序列表',
    'Ordered list': '有序列表',
    Task: '任务',
    Indent: '缩进',
    Outdent: '减少缩进',
    'Insert link': '插入链接',
    'Insert CodeBlock': '插入代码块',
    'Insert table': '插入表格',
    'Insert image': '插入图片',
    Heading: '标题',
    'Image URL': '图片网址',
    'Select image file': '选择图片文件',
    'Choose a file': '选择一个文件',
    'No file': '没有文件',
    Description: '说明',
    OK: '确认',
    More: '更多',
    Cancel: '取消',
    File: '文件',
    URL: 'URL',
    'Link text': '链接文本',
    'Add row to up': '向上添加行',
    'Add row to down': '在下方添加行',
    'Add column to left': '在左侧添加列',
    'Add column to right': '在右侧添加列',
    'Remove row': '删除行',
    'Remove column': '删除列',
    'Align column to left': '左对齐',
    'Align column to center': '居中对齐',
    'Align column to right': '右对齐',
    'Remove table': '删除表格',
    'Would you like to paste as table?': '需要粘贴为表格吗?',
    'Text color': '文字颜色',
    'Auto scroll enabled': '自动滚动已启用',
    'Auto scroll disabled': '自动滚动已禁用',
    'Choose language': '选择语言',
});

}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});