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
 * @fileoverview I18N for Russian
 * @author Stepan Samko <stpnsamko@gmail.com>
 * @author Veaceslav Grimalschi <grimalschi@yandex.ru>
 */

_editorCore__WEBPACK_IMPORTED_MODULE_0___default().setLanguage(['ru', 'ru-RU'], {
    Markdown: 'Markdown',
    WYSIWYG: 'WYSIWYG',
    Write: 'Редактор',
    Preview: 'Просмотр',
    Headings: 'Заголовки',
    Paragraph: 'Абзац',
    Bold: 'Жирный',
    Italic: 'Курсив',
    Strike: 'Зачеркнутый',
    Code: 'Код',
    Line: 'Линия',
    Blockquote: 'Цитата',
    'Unordered list': 'Неупорядоченный список',
    'Ordered list': 'Упорядоченный список',
    Task: 'Галочка',
    Indent: 'Увеличить отступ',
    Outdent: 'Уменьшить отступ',
    'Insert link': 'Вставить ссылку',
    'Insert CodeBlock': 'Вставить блок кода',
    'Insert table': 'Вставить таблицу',
    'Insert image': 'Вставить изображение',
    Heading: 'Заголовок',
    'Image URL': 'URL изображения',
    'Select image file': 'Выбрать файл изображения',
    'Choose a file': 'Выбрать',
    'No file': 'Нет файла',
    Description: 'Описание',
    OK: 'Хорошо',
    More: 'Еще',
    Cancel: 'Отмена',
    File: 'Файл',
    URL: 'URL',
    'Link text': 'Текст ссылки',
    'Add row to up': 'Добавить строку вверх',
    'Add row to down': 'Добавить строку вниз',
    'Add column to left': 'Добавить столбец слева',
    'Add column to right': 'Добавить столбец справа',
    'Remove row': 'Удалить ряд',
    'Remove column': 'Удалить столбец',
    'Align column to left': 'Выровнять по левому краю',
    'Align column to center': 'Выровнять по центру',
    'Align column to right': 'Выровнять по правому краю',
    'Remove table': 'Удалить таблицу',
    'Would you like to paste as table?': 'Вы хотите вставить в виде таблицы?',
    'Text color': 'Цвет текста',
    'Auto scroll enabled': 'Автопрокрутка включена',
    'Auto scroll disabled': 'Автопрокрутка отключена',
    'Choose language': 'Выбрать язык',
});

}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});