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
 * @fileoverview I18N for Norwegian
 * @author Anton Reytarovskiy <reitarovskii.toh@gmail.com>
 */

_editorCore__WEBPACK_IMPORTED_MODULE_0___default().setLanguage(['nb', 'nb-NO'], {
    Markdown: 'Funksjonaliteter',
    WYSIWYG: 'WYSIWYG',
    Write: 'Skriv',
    Preview: 'Forhåndsvisning',
    Headings: 'Overskrift',
    Paragraph: 'Paragraf',
    Bold: 'Fet skrift',
    Italic: 'Italic',
    Strike: 'Strike',
    Code: 'Kode',
    Line: 'Linje',
    Blockquote: 'Blokksitat',
    'Unordered list': 'Usortert liste',
    'Ordered list': 'Sortert liste',
    Task: 'Task',
    Indent: 'Indent',
    Outdent: 'Outdent',
    'Insert link': 'Sett inn lenke',
    'Insert CodeBlock': 'Sett inn CodeStreng',
    'Insert table': 'Sett inn diagram',
    'Insert image': 'Sett inn bilde',
    Heading: 'Overskrift',
    'Image URL': 'BildeURL',
    'Select image file': 'Velg bildefil',
    'Choose a file': 'Velg en fil',
    'No file': 'Ingen fil',
    Description: 'Beskrivelse',
    OK: 'OK',
    More: 'Mer',
    Cancel: 'Angre',
    File: 'Fil',
    URL: 'URL',
    'Link text': 'Lenketekst',
    'Add row to up': 'Legg rad til opp',
    'Add row to down': 'Legg rad til ned',
    'Add column to left': 'Legg til kolonne til venstre',
    'Add column to right': 'Legg til kolonne til høyre',
    'Remove row': 'Fjern rad',
    'Remove column': 'Fjern kolonne',
    'Align column to left': 'Venstreorienter',
    'Align column to center': 'Senterorienter',
    'Align column to right': 'Høyreorienter',
    'Remove table': 'Fjern diagram',
    'Would you like to paste as table?': 'Ønsker du å lime inn som et diagram?',
    'Text color': 'Tekstfarge',
    'Auto scroll enabled': 'Auto-scroll aktivert',
    'Auto scroll disabled': 'Auto-scroll deaktivert',
    'Choose language': 'Velg språl',
});

}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});