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
 * @fileoverview I18N for Japanese
 * @author NHN Cloud FE Development Lab <dl_javascript@nhn.com>
 */

_editorCore__WEBPACK_IMPORTED_MODULE_0___default().setLanguage(['ja', 'ja-JP'], {
    Markdown: 'マークダウン',
    WYSIWYG: 'WYSIWYG',
    Write: '編集する',
    Preview: 'プレビュー',
    Headings: '見出し',
    Paragraph: '本文',
    Bold: '太字',
    Italic: 'イタリック',
    Strike: 'ストライク',
    Code: 'インラインコード',
    Line: 'ライン',
    Blockquote: '引用',
    'Unordered list': '番号なしリスト',
    'Ordered list': '順序付きリスト',
    Task: 'タスク',
    Indent: 'インデント',
    Outdent: 'アウトデント',
    'Insert link': 'リンク挿入',
    'Insert CodeBlock': 'コードブロック挿入',
    'Insert table': 'テーブル挿入',
    'Insert image': '画像挿入',
    Heading: '見出し',
    'Image URL': 'イメージURL',
    'Select image file': '画像ファイル選択',
    'Choose a file': 'ファイルの選択',
    'No file': 'ファイルがない',
    Description: 'ディスクリプション ',
    OK: 'はい',
    More: 'もっと',
    Cancel: 'キャンセル',
    File: 'ファイル',
    URL: 'URL',
    'Link text': 'リンクテキスト',
    'Add row to up': '行を上に追加',
    'Add row to down': '下に行を追加',
    'Add column to left': '左側に列を追加',
    'Add column to right': '右側に列を追加',
    'Remove row': '行削除',
    'Remove column': '列削除',
    'Align column to left': '左揃え',
    'Align column to center': '中央揃え',
    'Align column to right': '右揃え',
    'Remove table': 'テーブル削除',
    'Would you like to paste as table?': 'テーブルを貼り付けますか?',
    'Text color': '文字色相',
    'Auto scroll enabled': '自動スクロールが有効',
    'Auto scroll disabled': '自動スクロールを無効に',
    'Choose language': '言語選択',
});

}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});