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
 * @fileoverview I18N for Traditional Chinese
 * @author Tzu-Ray Su <raysu3329@gmail.com>
 */

_editorCore__WEBPACK_IMPORTED_MODULE_0___default().setLanguage('zh-TW', {
    Markdown: 'Markdown',
    WYSIWYG: '所見即所得',
    Write: '編輯',
    Preview: '預覽',
    Headings: '標題',
    Paragraph: '內文',
    Bold: '粗體',
    Italic: '斜體',
    Strike: '刪除線',
    Code: '內嵌程式碼',
    Line: '分隔線',
    Blockquote: '引言',
    'Unordered list': '項目符號清單',
    'Ordered list': '編號清單',
    Task: '核取方塊清單',
    Indent: '增加縮排',
    Outdent: '減少縮排',
    'Insert link': '插入超連結',
    'Insert CodeBlock': '插入程式碼區塊',
    'Insert table': '插入表格',
    'Insert image': '插入圖片',
    Heading: '標題',
    'Image URL': '圖片網址',
    'Select image file': '選擇圖片檔案',
    'Choose a file': '選擇一個文件',
    'No file': '沒有文件',
    Description: '描述',
    OK: '確認',
    More: '更多',
    Cancel: '取消',
    File: '檔案',
    URL: 'URL',
    'Link text': '超連結文字',
    'Add row to up': '向上添加行',
    'Add row to down': '在下方添加行',
    'Add column to left': '在左側添加列',
    'Add column to right': '在右側添加列',
    'Remove row': '刪除行',
    'Remove column': '刪除列',
    'Align column to left': '靠左對齊',
    'Align column to center': '置中',
    'Align column to right': '靠右對齊',
    'Remove table': '刪除表格',
    'Would you like to paste as table?': '您要以表格貼上嗎？',
    'Text color': '文字顏色',
    'Auto scroll enabled': '已啟用自動滾動',
    'Auto scroll disabled': '已停用自動滾動',
    'Choose language': '選擇語言',
});

}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});