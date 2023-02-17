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
 * @fileoverview I18N for Arabic
 * @author Amira Salah <amira.salah@itworx.com>
 */

_editorCore__WEBPACK_IMPORTED_MODULE_0___default().setLanguage('ar', {
    Markdown: 'لغة ترميز',
    WYSIWYG: 'ما تراه هو ما تحصل عليه',
    Write: 'يكتب',
    Preview: 'عرض مسبق',
    Headings: 'العناوين',
    Paragraph: 'فقرة',
    Bold: 'خط عريض',
    Italic: 'خط مائل',
    Strike: 'إضراب',
    Code: 'رمز',
    Line: 'خط',
    Blockquote: 'فقرة مقتبسة',
    'Unordered list': 'قائمة غير مرتبة',
    'Ordered list': 'قائمة مرتبة',
    Task: 'مهمة',
    Indent: 'المسافة البادئة',
    Outdent: 'المسافة الخارجة',
    'Insert link': 'أدخل الرابط',
    'Insert CodeBlock': 'أدخل الكود',
    'Insert table': 'أدخل جدول',
    'Insert image': 'أدخل صورة',
    Heading: 'عنوان',
    'Image URL': 'رابط الصورة',
    'Select image file': 'حدد ملف الصورة',
    'Choose a file': 'اختيار الملف',
    'No file': 'لا ملف',
    Description: 'وصف',
    OK: 'موافقة',
    More: 'أكثر',
    Cancel: 'إلغاء',
    File: 'ملف',
    URL: 'رابط',
    'Link text': 'نص الرابط',
    'Add row to up': 'أضف صفًا لأعلى',
    'Add row to down': 'أضف صفًا إلى أسفل',
    'Add column to left': 'أضف العمود على اليسار',
    'Add column to right': 'أضف عمودًا إلى اليمين',
    'Remove row': 'حذف سطر',
    'Remove column': 'حذف عمود',
    'Align column to left': 'محاذاة اليسار',
    'Align column to center': 'محاذاة الوسط',
    'Align column to right': 'محاذاة اليمين',
    'Remove table': 'حذف الجدول',
    'Would you like to paste as table?': 'هل تريد اللصق كجدول',
    'Text color': 'لون النص',
    'Auto scroll enabled': 'التحريك التلقائي ممكّن',
    'Auto scroll disabled': 'التحريك التلقائي معطّل',
    'Choose language': 'اختر اللغة',
});

}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});