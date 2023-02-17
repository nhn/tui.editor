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
 * @fileoverview I18N for Croatian
 * @author Hrvoje A. <hrvoj3e@gmail.com>
 */

_editorCore__WEBPACK_IMPORTED_MODULE_0___default().setLanguage(['hr', 'hr-HR'], {
    Markdown: 'Markdown',
    WYSIWYG: 'WYSIWYG',
    Write: 'Piši',
    Preview: 'Pregled',
    Headings: 'Naslovi',
    Paragraph: 'Paragraf',
    Bold: 'podebljano',
    Italic: 'kurziv',
    Strike: 'prcrtano',
    Code: 'Uklopljeni kôd',
    Line: 'Linija',
    Blockquote: 'Blok citat',
    'Unordered list': 'Neporedana lista',
    'Ordered list': 'Poredana lista',
    Task: 'Task',
    Indent: 'Povećaj uvlaku',
    Outdent: 'Smanji uvlaku',
    'Insert link': 'Umetni link',
    'Insert CodeBlock': 'Umetni blok kôda',
    'Insert table': 'Umetni tablicu',
    'Insert image': 'Umetni sliku',
    Heading: 'Naslov',
    'Image URL': 'URL slike',
    'Select image file': 'Odaberi slikovnu datoteku',
    'Choose a file': 'Odaberite datoteka',
    'No file': 'Nema datoteka',
    Description: 'Opis',
    OK: 'OK',
    More: 'Više',
    Cancel: 'Odustani',
    File: 'Datoteka',
    URL: 'URL',
    'Link text': 'Tekst linka',
    'Add row to up': 'Dodaj redak prema gore',
    'Add row to down': 'Dodaj redak prema dolje',
    'Add column to left': 'Dodaj stupac s lijeve strane',
    'Add column to right': 'Dodajte stupac s desne strane',
    'Remove row': 'Ukloni redak',
    'Remove column': 'Remove stupac',
    'Align column to left': 'Poravnaj lijevo',
    'Align column to center': 'Poravnaj centrirano',
    'Align column to right': 'Poravnaj desno',
    'Remove table': 'Ukloni tablicu',
    'Would you like to paste as table?': 'Zalite li zalijepiti kao tablicu?',
    'Text color': 'Boja teksta',
    'Auto scroll enabled': 'Omogući auto klizanje',
    'Auto scroll disabled': 'Onemogući auto klizanje',
    'Choose language': 'Odabir jezika',
});

}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});