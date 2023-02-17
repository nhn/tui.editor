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
 * @fileoverview I18N for Swedish
 * @author Magnus Aspling <magnus@yug.se>
 */

_editorCore__WEBPACK_IMPORTED_MODULE_0___default().setLanguage(['sv', 'sv-SE'], {
    Markdown: 'Markdown',
    WYSIWYG: 'WYSIWYG',
    Write: 'Skriv',
    Preview: 'Förhandsgranska',
    Headings: 'Överskrifter',
    Paragraph: 'Paragraf',
    Bold: 'Fet',
    Italic: 'Kursiv',
    Strike: 'Genomstruken',
    Code: 'Kodrad',
    Line: 'Linje',
    Blockquote: 'Citatblock',
    'Unordered list': 'Punktlista',
    'Ordered list': 'Numrerad lista',
    Task: 'Att göra',
    Indent: 'Öka indrag',
    Outdent: 'Minska indrag',
    'Insert link': 'Infoga länk',
    'Insert CodeBlock': 'Infoga kodblock',
    'Insert table': 'Infoga tabell',
    'Insert image': 'Infoga bild',
    Heading: 'Överskrift',
    'Image URL': 'Bildadress',
    'Select image file': 'Välj en bildfil',
    'Choose a file': 'Välj en fil',
    'No file': 'Ingen fil',
    Description: 'Beskrivning',
    OK: 'OK',
    More: 'Mer',
    Cancel: 'Avbryt',
    File: 'Fil',
    URL: 'Adress',
    'Link text': 'Länktext',
    'Add row to up': 'Lägg till rad till upp',
    'Add row to down': 'Lägg till rad till ner',
    'Add column to left': 'Lägg till kolumn till vänster',
    'Add column to right': 'Lägg till kolumn till höger',
    'Remove row': 'Radera rad',
    'Remove column': 'Radera kolumn',
    'Align column to left': 'Vänsterjustera',
    'Align column to center': 'Centrera',
    'Align column to right': 'Högerjustera',
    'Remove table': 'Radera tabell',
    'Would you like to paste as table?': 'Vill du klistra in som en tabell?',
    'Text color': 'Textfärg',
    'Auto scroll enabled': 'Automatisk scroll aktiverad',
    'Auto scroll disabled': 'Automatisk scroll inaktiverad',
    'Choose language': 'Välj språk',
});

}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});