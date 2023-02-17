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
 * @fileoverview I18N for German
 * @author Jann-Niklas Kiepert <jannkiepert@vivaldi.net>
 */

_editorCore__WEBPACK_IMPORTED_MODULE_0___default().setLanguage(['de', 'de-DE'], {
    Markdown: 'Markdown',
    WYSIWYG: 'WYSIWYG',
    Write: 'Verfassen',
    Preview: 'Vorschau',
    Headings: 'Überschriften',
    Paragraph: 'Text',
    Bold: 'Fett',
    Italic: 'Kursiv',
    Strike: 'Durchgestrichen',
    Code: 'Code',
    Line: 'Trennlinie',
    Blockquote: 'Blocktext',
    'Unordered list': 'Aufzählung',
    'Ordered list': 'Nummerierte Aufzählung',
    Task: 'Aufgabe',
    Indent: 'Einrücken',
    Outdent: 'Ausrücken',
    'Insert link': 'Link einfügen',
    'Insert CodeBlock': 'Codeblock einfügen',
    'Insert table': 'Tabelle einfügen',
    'Insert image': 'Grafik einfügen',
    Heading: 'Titel',
    'Image URL': 'Bild URL',
    'Select image file': 'Grafik auswählen',
    'Choose a file': 'Wähle eine Datei',
    'No file': 'Keine Datei',
    Description: 'Beschreibung',
    OK: 'OK',
    More: 'Mehr',
    Cancel: 'Abbrechen',
    File: 'Datei',
    URL: 'URL',
    'Link text': 'Anzuzeigender Text',
    'Add row to up': 'Zeile nach oben hinzufügen',
    'Add row to down': 'Zeile nach unten hinzufügen',
    'Add column to left': 'Spalte links hinzufügen',
    'Add column to right': 'Spalte rechts hinzufügen',
    'Remove row': 'Zeile entfernen',
    'Remove column': 'Spalte entfernen',
    'Align column to left': 'Links ausrichten',
    'Align column to center': 'Zentrieren',
    'Align column to right': 'Rechts ausrichten',
    'Remove table': 'Tabelle entfernen',
    'Would you like to paste as table?': 'Möchten Sie eine Tabelle einfügen?',
    'Text color': 'Textfarbe',
    'Auto scroll enabled': 'Autoscrollen aktiviert',
    'Auto scroll disabled': 'Autoscrollen deaktiviert',
    'Choose language': 'Sprache auswählen',
});

}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});