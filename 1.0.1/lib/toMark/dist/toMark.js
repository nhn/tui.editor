(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["toMark"] = factory();
	else
		root["toMark"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements entry point
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var toMark = __webpack_require__(1);
	var Renderer = __webpack_require__(5);
	var basicRenderer = __webpack_require__(4);
	var gfmRenderer = __webpack_require__(6);

	toMark.Renderer = Renderer;
	toMark.basicRenderer = basicRenderer;
	toMark.gfmRenderer = gfmRenderer;

	module.exports = toMark;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements toMark
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var DomRunner = __webpack_require__(2),
	    toDom = __webpack_require__(3),
	    basicRenderer = __webpack_require__(4),
	    gfmRenderer = __webpack_require__(6);

	var FIND_UNUSED_BRS_RX = /[ \xA0]+(\n\n)/g,
	    FIND_FIRST_LAST_WITH_SPACE_RETURNS_RX = /^[\n]+|[\s\n]+$/g,
	    FIND_MULTIPLE_BRS_RX = /([ \xA0]+\n){2,}/g,
	    FIND_RETURNS_RX = /([ \xA0]){2,}\n/g,
	    FIND_RETURNS_AND_SPACE_RX = /[ \xA0\n]+/g;

	/**
	 * toMark
	 * @exports toMark
	 * @param {string} htmlStr html string to convert
	 * @param {object} options option
	 * @param {boolean} options.gfm if this property is false turn off it cant parse gfm
	 * @param {Renderer} options.renderer pass renderer to use
	 * @returns {string} converted markdown text
	 * @example
	 * toMark('<h1>hello world</h1>'); // "# hello world"
	 * toMark('<del>strike</del>'); // "~~strike~~"
	 * toMark('<del>strike</del>', {gfm: false}); // "strike"
	 */
	function toMark(htmlStr, options) {
	    var runner,
	        isGfm = true,
	        renderer;

	    if (!htmlStr) {
	        return '';
	    }

	    renderer = gfmRenderer;

	    if (options) {
	        isGfm = options.gfm;

	        if (isGfm === false) {
	            renderer = basicRenderer;
	        }

	        renderer = options.renderer || renderer;
	    }

	    runner = new DomRunner(toDom(htmlStr));

	    return finalize(parse(runner, renderer), isGfm, renderer.lineFeedReplacement);
	}

	/**
	 * parse
	 * Parse dom to markdown
	 * @param {DomRunner} runner runner
	 * @param {Renderer} renderer renderer
	 * @returns {string} markdown text
	 */
	function parse(runner, renderer) {
	    var markdownContent = '';

	    while (runner.next()) {
	        markdownContent += tracker(runner, renderer);
	    }

	    return markdownContent;
	}

	/**
	 * finalize
	 * Remove first and last return character
	 * @param {string} text text to finalize
	 * @param {boolean} isGfm isGfm flag
	 * @param {string} lineFeedReplacement Line feed replacement text
	 * @returns {string} result
	 */
	function finalize(text, isGfm, lineFeedReplacement) {
	    //collapse return and <br>
	    //BR뒤에 바로 \n이 이어지면 BR은 불필요하다
	    text = text.replace(FIND_UNUSED_BRS_RX, '\n');
	    //console.log(2, JSON.stringify(text));

	    //collapse multiple br
	    //두개 이상의 BR개행은 한개로
	    text = text.replace(FIND_MULTIPLE_BRS_RX, '\n\n');
	    //console.log(3, JSON.stringify(text));

	    text = text.replace(FIND_RETURNS_AND_SPACE_RX, function(matched) {
	        var returnCount = (matched.match(/\n/g) || []).length;

	        if (returnCount >= 3) {
	            return '\n\n';
	        } else if (matched >= 1) {
	            return '\n';
	        }

	        return matched;
	    });
	    //console.log(3, JSON.stringify(text));

	    //remove first and last \n
	    //시작과 마지막 개행제거
	    text = text.replace(FIND_FIRST_LAST_WITH_SPACE_RETURNS_RX, '');
	    //console.log(JSON.stringify(text));

	    text = text.replace(new RegExp(lineFeedReplacement, 'g'), '\n');
	    //in gfm replace '  \n' make by <br> to '\n'
	    //gfm모드인경우 임의 개행에 스페이스를 제거
	    if (isGfm) {
	        text = text.replace(FIND_RETURNS_RX, '\n');
	    }
	    //console.log(7, JSON.stringify(text));

	    return text;
	}


	/**
	 * tracker
	 * Iterate childNodes and process conversion using recursive call
	 * @param {DomRunner} runner dom runner
	 * @param {Renderer} renderer renderer to use
	 * @returns {string} processed text
	 */
	function tracker(runner, renderer) {
	    var i,
	        t,
	        subContent = '',
	        content;

	    var node = runner.getNode();

	    for (i = 0, t = node.childNodes.length; i < t; i += 1) {
	        runner.next();
	        subContent += tracker(runner, renderer);
	    }

	    content = renderer.convert(node, subContent);

	    return content;
	}

	module.exports = toMark;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	/**
	 * @fileoverview Implements DomRunner
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	/**
	 * Node Type Value
	 */
	var NODE = {
	    ELEMENT_NODE: 1,
	    ATTRIBUTE_NODE: 2,
	    TEXT_NODE: 3
	};

	/**
	 * DomRunner
	 * @exports DomRunner
	 * @constructor
	 * @class
	 * @param {HTMLElement} node A root node that it has nodes to iterate(not iterate itself and its any siblings)
	 */
	function DomRunner(node) {
	    this._normalizeTextChildren(node);

	    this._root = node;
	    this._current = node;
	}


	/**
	 * next
	 * Iterate next node
	 * @returns {HTMLElement} next node
	 */
	DomRunner.prototype.next = function() {
	    var current = this._current,
	        node;

	    if (this._current) {
	        node = this._getNextNode(current);

	        while (this._isNeedNextSearch(node, current)) {
	            current = current.parentNode;
	            node = current.nextSibling;
	        }

	        this._current = node;
	    }

	    return this._current;
	};

	/**
	 * getNode
	 * Return current node
	 * @returns {HTMLElement} current node
	 */
	DomRunner.prototype.getNode = function() {
	    this._normalizeTextChildren(this._current);

	    return this._current;
	};

	DomRunner.prototype._normalizeTextChildren = function(node) {
	    var childNode, nextNode;
	    if (!node || node.childNodes.length < 2) {
	        return;
	    }

	    childNode = node.firstChild;
	    while (childNode.nextSibling) {
	        nextNode = childNode.nextSibling;
	        if (childNode.nodeType === NODE.TEXT_NODE && nextNode.nodeType === NODE.TEXT_NODE) {
	            childNode.nodeValue += nextNode.nodeValue;
	            node.removeChild(nextNode);
	        } else {
	            childNode = nextNode;
	        }
	    }
	};

	/**
	 * getNodeText
	 * Get current node's text content
	 * @returns {string} text
	 */
	DomRunner.prototype.getNodeText = function() {
	    var node = this.getNode(),
	        text;

	    if (node.nodeType === NODE.TEXT_NODE) {
	        text = node.nodeValue;
	    } else {
	        text = node.textContent || node.innerText;
	    }

	    return text;
	};

	/**
	 * _isNeedNextSearch
	 * Check if there is next node to iterate
	 * @private
	 * @param {HTMLElement} node next node
	 * @param {HTMLElement} current next node
	 * @returns {boolean} result
	 */
	DomRunner.prototype._isNeedNextSearch = function(node, current) {
	    return !node && current !== this._root && current.parentNode !== this._root;
	};

	/**
	 * _getNextNode
	 * Return available next node
	 * @private
	 * @param {HTMLElement} current current node
	 * @returns {node} next node
	 */
	DomRunner.prototype._getNextNode = function(current) {
	    return current.firstChild || current.nextSibling;
	};

	DomRunner.NODE_TYPE = NODE;

	module.exports = DomRunner;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	/**
	 * @fileoverview Implements toDom
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var FIND_FIRST_LAST_SPACE_OR_RETURN_OR_TAB_RX = /^[\s\r\n\t]+|[\s\r\n\t]+$/g,
	    FIND_RETURN_OR_TAB_BETWEEN_TAGS_RX = />[\r\n\t]+</g,
	    FIND_WHOLE_SPACE_MORE_THAN_ONE_BETWEEN_TAGS_RX = />[ ]+</g;

	/**
	 * toDom
	 * @exports toDom
	 * @param {HTMLElement|string} html DOM Node root or HTML string
	 * @returns {HTMLElement[]} dom element
	 */
	function toDom(html) {
	    var wrapper;

	    if (Object.prototype.toString.call(html) === '[object String]') {
	        wrapper = document.createElement('div');
	        wrapper.innerHTML = preProcess(html);
	    } else {
	        wrapper = html;
	    }

	    wrapper.__htmlRootByToMark = true;

	    return wrapper;
	}

	/**
	 * Pre process for html string
	 * @param {string} html Source HTML string
	 * @returns {string}
	 */
	function preProcess(html) {
	    //trim text
	    html = html.replace(FIND_FIRST_LAST_SPACE_OR_RETURN_OR_TAB_RX, '');

	    //trim between tags
	    html = html.replace(FIND_RETURN_OR_TAB_BETWEEN_TAGS_RX, '><');

	    //remove spaces more than 1(if need more space, must use &nbsp)
	    html = html.replace(FIND_WHOLE_SPACE_MORE_THAN_ONE_BETWEEN_TAGS_RX, '> <');

	    return html;
	}

	toDom.preProcess = preProcess;

	module.exports = toDom;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements basicRenderer
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var Renderer = __webpack_require__(5);

	var FIND_LAST_RETURN_RX = /\n$/g,
	    FIND_BR_AND_RETURN_RX = /[ \xA0]+\n\n/g,
	    FIND_MULTIPLE_EMPTYLINE_BETWEEN_TEXT_RX = /([ \xA0]+\n){2,}/g,
	    FIND_LINK_HREF = /href\=\"(.*?)\"/,
	    START_OF_LINES_RX = /^/gm;

	/**
	 * basicRenderer
	 * Basic Markdown Renderer
	 * @exports basicRenderer
	 * @augments Renderer
	 */
	var basicRenderer = Renderer.factory({
	    //inlines
	    'TEXT_NODE': function(node) {
	        var managedText;

	        managedText = this.trim(this.getSpaceCollapsedText(node.nodeValue));

	        if (this._isNeedEscapeHtml(managedText)) {
	            managedText = this.escapeTextHtml(managedText);
	        } else if (this._isNeedEscape(managedText)) {
	            managedText = this.escapeText(managedText);
	        }

	        return this.getSpaceControlled(managedText, node);
	    },
	    'CODE TEXT_NODE': function(node) {
	        return node.nodeValue;
	    },
	    'EM, I': function(node, subContent) {
	        var res = '';

	        if (!this.isEmptyText(subContent)) {
	            res = '_' + subContent + '_';
	        }

	        return res;
	    },
	    'STRONG, B': function(node, subContent) {
	        var res = '';

	        if (!this.isEmptyText(subContent)) {
	            res = '**' + subContent + '**';
	        }

	        return res;
	    },
	    'A': function(node, subContent) {
	        var res = subContent;
	        var title = '';
	        var foundedHref, url;


	        //상황에따라 href속성은 상황에 따라 값을 예측하기 힘듬
	        //그래서 html에 적용된 그대로를 사용
	        foundedHref = FIND_LINK_HREF.exec(node.outerHTML);

	        if (foundedHref) {
	            url = foundedHref[1].replace(/&amp;/g, '&');
	        }

	        if (node.title) {
	            title = ' "' + node.title + '"';
	        }

	        if (!this.isEmptyText(subContent) && url) {
	            res = '[' + subContent + '](' + url + title + ')';
	        }

	        return res;
	    },
	    'IMG': function(node) {
	        var res = '',
	            src = node.getAttribute('src'),
	            alt = node.alt;

	        if (src) {
	            res = '![' + alt + '](' + src + ')';
	        }

	        return res;
	    },
	    'BR': function() {
	        return '  \n';
	    },
	    'CODE': function(node, subContent) {
	        var backticks, numBackticks;
	        var res = '';

	        if (!this.isEmptyText(subContent)) {
	            numBackticks = parseInt(node.getAttribute('data-backticks'), 10);
	            backticks = isNaN(numBackticks) ? '`' : Array(numBackticks + 1).join('`');

	            res = backticks + subContent + backticks;
	        }

	        return res;
	    },

	    //Paragraphs
	    'P': function(node, subContent) {
	        var res = '';

	        //convert multiple brs to one br
	        subContent = subContent.replace(FIND_MULTIPLE_EMPTYLINE_BETWEEN_TEXT_RX, '  \n');

	        if (!this.isEmptyText(subContent)) {
	            res = '\n\n' + subContent + '\n\n';
	        }

	        return res;
	    },
	    'BLOCKQUOTE P': function(node, subContent) {
	        return subContent;
	    },
	    'LI P': function(node, subContent) {
	        var res = '';

	        if (!this.isEmptyText(subContent)) {
	            res = subContent;
	        }

	        return res;
	    },

	    //Headings
	    'H1, H2, H3, H4, H5, H6': function(node, subContent) {
	        var res = '',
	            headingNumber = parseInt(node.tagName.charAt(1), 10);

	        while (headingNumber) {
	            res += '#';
	            headingNumber -= 1;
	        }

	        res += ' ';
	        res += subContent;

	        return '\n\n' + res + '\n\n';
	    },
	    'LI H1, LI H2, LI H3, LI H4, LI H5, LI H6': function(node) {
	        return '<' + node.tagName.toLowerCase() + '>' + node.innerHTML + '</' + node.tagName.toLowerCase() + '>';
	    },

	    //List
	    'UL, OL': function(node, subContent) {
	        return '\n\n' + subContent + '\n\n';
	    },
	    'LI OL, LI UL': function(node, subContent) {
	        var res, processedSubContent;

	        //remove last br of li
	        processedSubContent = subContent.replace(FIND_BR_AND_RETURN_RX, '\n');

	        //parent LI converter add \n too, so we remove last return
	        processedSubContent = processedSubContent.replace(FIND_LAST_RETURN_RX, '');

	        res = processedSubContent.replace(START_OF_LINES_RX, '    ');

	        return '\n' + res;
	    },
	    'UL LI': function(node, subContent) {
	        var res = '';

	        //convert multiple brs to one br
	        subContent = subContent.replace(FIND_MULTIPLE_EMPTYLINE_BETWEEN_TEXT_RX, '  \n');

	        if (node.firstChild && node.firstChild.tagName === 'P') {
	            res += '\n';
	        }

	        res += '* ' + subContent + '\n';

	        return res;
	    },
	    'OL LI': function(node, subContent) {
	        var res = '',
	            liCounter = 1;

	        while (node.previousSibling) {
	            node = node.previousSibling;

	            if (node.nodeType === 1 && node.tagName === 'LI') {
	                liCounter += 1;
	            }
	        }

	        //convert multiple brs to one br
	        subContent = subContent.replace(FIND_MULTIPLE_EMPTYLINE_BETWEEN_TEXT_RX, '  \n');

	        if (node.firstChild && node.firstChild.tagName === 'P') {
	            res += '\n';
	        }

	        res += liCounter + '. ' + subContent + '\n';

	        return res;
	    },

	    //HR
	    'HR': function() {
	        return '\n\n- - -\n\n';
	    },

	    //Blockquote
	    'BLOCKQUOTE': function(node, subContent) {
	        var res, trimmedText;

	        //convert multiple brs to one emptyline
	        subContent = subContent.replace(FIND_MULTIPLE_EMPTYLINE_BETWEEN_TEXT_RX, '\n\n');

	        trimmedText = this.trim(subContent);
	        res = trimmedText.replace(START_OF_LINES_RX, '> ');

	        return '\n\n' + res + '\n\n';
	    },

	    //Code Block
	    'PRE CODE': function(node, subContent) {
	        var res, lastNremoved;

	        lastNremoved = subContent.replace(FIND_LAST_RETURN_RX, '');
	        res = lastNremoved.replace(START_OF_LINES_RX, '    ');

	        return '\n\n' + res + '\n\n';
	    }
	});

	module.exports = basicRenderer;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	/**
	 * @fileoverview Implements Renderer
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */
	'use strict';

	var FIND_LEAD_SPACE_RX = /^\u0020/,
	    FIND_TRAIL_SPACE_RX = /.+\u0020$/,
	    FIND_SPACE_RETURN_TAB_RX = /[\n\s\t]+/g,
	    //find first and last characters for trim
	    FIND_CHAR_TO_TRIM_RX = /^[\u0020\r\n\t]+|[\u0020\r\n\t]+$/g,
	    //find space more than one
	    FIND_SPACE_MORE_THAN_ONE_RX = /[\u0020]+/g,
	    //find characters that need escape
	    FIND_CHAR_TO_ESCAPE_RX = /[~>()*{}\[\]_`+-.!#|]/g;

	var TEXT_NODE = 3;

	/**
	 * forEachOwnProperties
	 * Iterate properties of object
	 * from https://github.com/nhnent/fe.code-snippet/blob/master/src/collection.js
	 * @param {object} obj object to iterate
	 * @param {function} iteratee callback function
	 * @param {*} [context] context of callback
	 */
	function forEachOwnProperties(obj, iteratee, context) {
	    var key;

	    context = context || null;

	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) {
	            if (iteratee.call(context, obj[key], key, obj) === false) {
	                break;
	            }
	        }
	    }
	}

	/**
	 * Renderer
	 * @exports Renderer
	 * @constructor
	 * @param {object} [rules] rules to add
	 * @class
	 */
	function Renderer(rules) {
	    this.rules = {};

	    if (rules) {
	        this.addRules(rules);
	    }
	}

	/**
	 * Line feed replacement text
	 * @type string
	 */
	Renderer.prototype.lineFeedReplacement = '\u200B\u200B';

	/**
	 * addRule
	 * Add rule
	 * @param {string} selectorString rule selector
	 * @param {function} converter converter function
	 */
	Renderer.prototype.addRule = function(selectorString, converter) {
	    var selectors = selectorString.split(', '),
	        selector = selectors.pop();

	    converter.fname = selectorString;

	    while (selector) {
	        this._setConverterWithSelector(selector, converter);
	        selector = selectors.pop();
	    }
	};

	/**
	 * addRules
	 * Add rules using object
	 * @param {object} rules key(rule selector), value(converter function)
	 */
	Renderer.prototype.addRules = function(rules) {
	    forEachOwnProperties(rules, function(converter, selectorString) {
	        this.addRule(selectorString, converter);
	    }, this);
	};

	/**
	 * Whether if inline node or not
	 * @param {Node} node Element
	 * @returns {boolean}
	 */
	function isInlineNode(node) {
	    var tag = node.tagName;

	    return tag === 'S' || tag === 'B' || tag === 'I' || tag === 'EM'
	        || tag === 'STRONG' || tag === 'A' || tag === 'IMG' || tag === 'CODE';
	}

	/**
	 * getSpaceControlled
	 * Remove flanked space of dom node
	 * @param {string} content text content
	 * @param {HTMLElement} node current node
	 * @returns {string} result
	 */
	Renderer.prototype.getSpaceControlled = function(content, node) {
	    var lead = '',
	        trail = '',
	        text;

	    if (node.previousSibling && (node.previousSibling.nodeType === TEXT_NODE || isInlineNode(node.previousSibling))) {
	        text = node.previousSibling.innerHTML || node.previousSibling.nodeValue;

	        if (FIND_TRAIL_SPACE_RX.test(text) || FIND_LEAD_SPACE_RX.test(node.innerHTML || node.nodeValue)) {
	            lead = ' ';
	        }
	    }

	    if (node.nextSibling && (node.nextSibling.nodeType === TEXT_NODE || isInlineNode(node.nextSibling))) {
	        text = node.nextSibling.innerHTML || node.nextSibling.nodeValue;
	        if (FIND_LEAD_SPACE_RX.test(text) || FIND_TRAIL_SPACE_RX.test(node.innerHTML || node.nodeValue)) {
	            trail = ' ';
	        }
	    }

	    return lead + content + trail;
	};

	/**
	 * convert
	 * Convert dom node to markdown using dom node and subContent
	 * @param {HTMLElement} node node to convert
	 * @param {string} subContent child nodes converted text
	 * @returns {string} converted text
	 */
	Renderer.prototype.convert = function(node, subContent) {
	    var result,
	        converter = this._getConverter(node);

	    if (node && node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('data-tomark-pass')) {
	        node.removeAttribute('data-tomark-pass');
	        result = node.outerHTML;
	    } else if (converter) {
	        result = converter.call(this, node, subContent);
	    } else if (node) {
	        result = this.getSpaceControlled(this._getInlineHtml(node, subContent), node);
	    }

	    return result || '';
	};

	Renderer.prototype._getInlineHtml = function(node, subContent) {
	    var html = node.outerHTML,
	        tagName = node.tagName,
	        escapedSubContent = subContent.replace(/\$/g, '$$$$');
	    // escape $: replace all $ char to $$ before we throw this string to replace

	    return html.replace(new RegExp('(<' + tagName + ' ?.*?>).*(</' + tagName + '>)', 'i'), '$1' + escapedSubContent + '$2');
	};

	/**
	 * _getConverter
	 * Get converter function for node
	 * @private
	 * @param {HTMLElement} node node
	 * @returns {function} converter function
	 */
	Renderer.prototype._getConverter = function(node) {
	    var rulePointer = this.rules,
	        converter;

	    while (node && rulePointer) {
	        rulePointer = this._getNextRule(rulePointer, this._getRuleNameFromNode(node));
	        node = this._getPrevNode(node);

	        if (rulePointer && rulePointer.converter) {
	            converter = rulePointer.converter;
	        }
	    }

	    return converter;
	};

	/**
	 * _getNextRule
	 * Get next rule object
	 * @private
	 * @param {object} ruleObj rule object
	 * @param {string} ruleName rule tag name to find
	 * @returns {object} rule Object
	 */
	Renderer.prototype._getNextRule = function(ruleObj, ruleName) {
	    return ruleObj[ruleName];
	};

	/**
	 * _getRuleNameFromNode
	 * Get proper rule tag name from node
	 * @private
	 * @param {HTMLElement} node node
	 * @returns {string} rule tag name
	 */
	Renderer.prototype._getRuleNameFromNode = function(node) {
	    return node.tagName || 'TEXT_NODE';
	};

	/**
	 * _getPrevNode
	 * Get node's available parent node
	 * @private
	 * @param {HTMLElement} node node
	 * @returns {HTMLElement | undefined} result
	 */
	Renderer.prototype._getPrevNode = function(node) {
	    var parentNode = node.parentNode;
	    var previousNode;

	    if (parentNode && !parentNode.__htmlRootByToMark) {
	        previousNode = parentNode;
	    }

	    return previousNode;
	};

	/**
	 * _setConverterWithSelector
	 * Set converter for selector
	 * @private
	 * @param {string} selectors rule selector
	 * @param {function} converter converter function
	 */
	Renderer.prototype._setConverterWithSelector = function(selectors, converter) {
	    var rulePointer = this.rules;

	    this._eachSelector(selectors, function(ruleElem) {
	        if (!rulePointer[ruleElem]) {
	            rulePointer[ruleElem] = {};
	        }

	        rulePointer = rulePointer[ruleElem];
	    });

	    rulePointer.converter = converter;
	};

	/**
	 * _eachSelector
	 * Iterate each selectors
	 * @private
	 * @param {string} selectors rule selectors
	 * @param {function} iteratee callback
	 */
	Renderer.prototype._eachSelector = function(selectors, iteratee) {
	    var selectorArray, selectorIndex;

	    selectorArray = selectors.split(' ');
	    selectorIndex = selectorArray.length - 1;

	    while (selectorIndex >= 0) {
	        iteratee(selectorArray[selectorIndex]);
	        selectorIndex -= 1;
	    }
	};

	/**
	 * trim
	 * Trim text
	 * @param {string} text text be trimed
	 * @returns {string} trimed text
	 */
	Renderer.prototype.trim = function(text) {
	    return text.replace(FIND_CHAR_TO_TRIM_RX, '');
	};

	/**
	 * isEmptyText
	 * Returns whether text empty or not
	 * @param {string} text text be checked
	 * @returns {boolean} result
	 */
	Renderer.prototype.isEmptyText = function(text) {
	    return text.replace(FIND_SPACE_RETURN_TAB_RX, '') === '';
	};

	/**
	 * getSpaceCollapsedText
	 * Collape space more than 2
	 * @param {string} text text be collapsed
	 * @returns {string} result
	 */
	Renderer.prototype.getSpaceCollapsedText = function(text) {
	    return text.replace(FIND_SPACE_MORE_THAN_ONE_RX, ' ');
	};

	/**
	 * Backslash escape to text
	 * Apply backslash escape to text
	 * @param {string} text text be processed
	 * @returns {string} processed text
	 */
	Renderer.prototype.escapeText = function(text) {
	    text = text.replace(FIND_CHAR_TO_ESCAPE_RX, function(matched) {
	        return '\\' + matched;
	    });

	    return text;
	};

	/**
	 * Backslash escape to text for html
	 * Apply backslash escape to text
	 * @param {string} text text be processed
	 * @returns {string} processed text
	 */
	Renderer.prototype.escapeTextHtml = function(text) {
	    text = text.replace(Renderer.markdownTextToEscapeHtmlRx, function(matched) {
	        return '\\' + matched;
	    });

	    return text;
	};

	Renderer.markdownTextToEscapeRx = {
	    codeblock: /(^ {4}[^\n]+\n*)+/,
	    hr: /^ *((\* *){3,}|(- *){3,} *|(_ *){3,}) */,
	    heading: /^(#{1,6}) +[\s\S]+/,
	    lheading: /^([^\n]+)\n *(=|-){2,} */,
	    blockquote: /^( *>[^\n]+.*)+/,
	    list: /^ *(\*+|-+|\d+\.) [\s\S]+/,
	    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? */,

	    link: /!?\[.*\]\(.*\)/,
	    reflink: /!?\[.*\]\s*\[([^\]]*)\]/,
	    strong: /__(\S[\s\S]*\h)__|\*\*(\S[\s\S]*\S)\*\*/,
	    em: /_(\S[\s\S]*\S)_|\*(\S[\s\S]*\S)\*/,
	    strikeThrough: /~~(\S[\s\S]*\S)~~/,
	    code: /(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,

	    verticalBar: /\u007C/,

	    codeblockGfm: /^(`{3,})/,
	    codeblockTildes: /^(~{3,})/
	};

	Renderer.markdownTextToEscapeHtmlRx = /<([a-zA-Z_][a-zA-Z0-9\-\._]*)(\s|[^\\/>])*\/?>|<(\/)([a-zA-Z_][a-zA-Z0-9\-\._]*)\s*\/?>|<!--[^-]+-->|<([a-zA-Z_][a-zA-Z0-9\-\.:/]*)>/g;

	Renderer.prototype._isNeedEscape = function(text) {
	    var res = false;
	    var markdownTextToEscapeRx = Renderer.markdownTextToEscapeRx;
	    var type;

	    for (type in markdownTextToEscapeRx) {
	        if (markdownTextToEscapeRx.hasOwnProperty(type) && markdownTextToEscapeRx[type].test(text)) {
	            res = true;
	            break;
	        }
	    }

	    return res;
	};

	Renderer.prototype._isNeedEscapeHtml = function(text) {
	    return Renderer.markdownTextToEscapeHtmlRx.test(text);
	};

	/**
	 * Clone rules
	 * @param {object} destination object for apply rules
	 * @param {object} source source object for clone rules
	 */
	function cloneRules(destination, source) {
	    forEachOwnProperties(source, function(value, key) {
	        if (key !== 'converter') {
	            if (!destination[key]) {
	                destination[key] = {};
	            }
	            cloneRules(destination[key], value);
	        } else {
	            destination[key] = value;
	        }
	    });
	}

	Renderer.prototype.mix = function(renderer) {
	    cloneRules(this.rules, renderer.rules);
	};

	/**
	 * Renderer factory
	 * Return new renderer
	 * @param {Renderer} srcRenderer renderer to extend
	 * @param {object} rules rule object, key(rule selector), value(converter function)
	 * @returns {Renderer} renderer
	 */
	Renderer.factory = function(srcRenderer, rules) {
	    var renderer = new Renderer();

	    if (!rules) {
	        rules = srcRenderer;
	    } else {
	        renderer.mix(srcRenderer);
	    }

	    renderer.addRules(rules);

	    return renderer;
	};

	module.exports = Renderer;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements Github flavored markdown renderer
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var Renderer = __webpack_require__(5),
	    basicRenderer = __webpack_require__(4);

	/**
	 * gfmRenderer
	 * github flavored Markdown Renderer
	 *
	 * we didnt render gfm br here because we need distingush returns that made by block with br
	 * so we render gfm br later in toMark.js finalize function
	 * @exports gfmRenderer
	 * @augments Renderer
	 */
	var gfmRenderer = Renderer.factory(basicRenderer, {
	    'DEL, S': function(node, subContent) {
	        return '~~' + subContent + '~~';
	    },
	    'PRE CODE': function(node, subContent) {
	        var language = '';

	        if (node.getAttribute('data-language')) {
	            language = ' ' + node.getAttribute('data-language');
	        }

	        subContent = subContent.replace(/(\r\n)|(\r)|(\n)/g, this.lineFeedReplacement);

	        return '\n\n```' + language + '\n' + subContent + '\n```\n\n';
	    },
	    'PRE': function(node, subContent) {
	        return subContent;
	    },
	    'UL LI': function(node, subContent) {
	        return basicRenderer.convert(node, makeTaskIfNeed(node, subContent));
	    },
	    'OL LI': function(node, subContent) {
	        return basicRenderer.convert(node, makeTaskIfNeed(node, subContent));
	    },

	    //Table
	    'TABLE': function(node, subContent) {
	        return '\n\n' + subContent + '\n\n';
	    },
	    'TBODY, TFOOT': function(node, subContent) {
	        return subContent;
	    },
	    'TR TD, TR TH': function(node, subContent) {
	        return ' ' + subContent + ' |';
	    },
	    'TD BR, TH BR': function() {
	        return '<br>';
	    },
	    'TR': function(node, subContent) {
	        return '|' + subContent + '\n';
	    },
	    'THEAD': function(node, subContent) {
	        var i, ths, thsLength,
	            result = '';

	        ths = findChildTag(findChildTag(node, 'TR')[0], 'TH');
	        thsLength = ths.length;

	        for (i = 0; i < thsLength; i += 1) {
	            result += ' ' + makeTableHeadAlignText(ths[i]) + ' |';
	        }

	        return subContent ? (subContent + '|' + result + '\n') : '';
	    }
	});
	/**
	 * Make task Markdown string if need
	 * @param {HTMLElement} node Passed HTML Element
	 * @param {string} subContent node's content
	 * @returns {string}
	 */
	function makeTaskIfNeed(node, subContent) {
	    var condition;

	    if (node.className.indexOf('task-list-item') !== -1) {
	        condition = node.className.indexOf('checked') !== -1 ? 'x' : ' ';
	        subContent = '[' + condition + '] ' + subContent;
	    }

	    return subContent;
	}
	/**
	 * Make table head align text
	 * @param {HTMLElement} th Table head cell element
	 * @returns {string}
	 */
	function makeTableHeadAlignText(th) {
	    var align, leftAlignValue, rightAlignValue, textLength;

	    align = th.align;
	    textLength = th.textContent ? th.textContent.length : th.innerText.length;
	    leftAlignValue = '';
	    rightAlignValue = '';

	    if (align) {
	        if (align === 'left') {
	            leftAlignValue = ':';
	            textLength -= 1;
	        } else if (align === 'right') {
	            rightAlignValue = ':';
	            textLength -= 1;
	        } else if (align === 'center') {
	            rightAlignValue = ':';
	            leftAlignValue = ':';
	            textLength -= 2;
	        }
	    }

	    return leftAlignValue + repeatString('-', textLength) + rightAlignValue;
	}
	/**
	 * Find child element of given tag name
	 * @param {HTMLElement} node starting element
	 * @param {string} tagName Tag name for search
	 * @returns {Array.<HTMLElement>}
	 */
	function findChildTag(node, tagName) {
	    var i,
	        childNodes = node.childNodes,
	        childLength = childNodes.length,
	        result = [];

	    for (i = 0; i < childLength; i += 1) {
	        if (childNodes[i].tagName && childNodes[i].tagName === tagName) {
	            result.push(childNodes[i]);
	        }
	    }

	    return result;
	}
	/**
	 * Repeat given string
	 * @param {string} pattern String for repeat
	 * @param {number} count Amount of repeat
	 * @returns {string}
	 */
	function repeatString(pattern, count) {
	    var result = pattern;

	    count = Math.max(count, 3);

	    while (count > 1) {
	        result += pattern;
	        count -= 1;
	    }

	    return result;
	}
	module.exports = gfmRenderer;


/***/ })
/******/ ])
});
;