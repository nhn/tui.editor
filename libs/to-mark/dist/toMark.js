(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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
 * @param {DOMElement} node A root node that it has nodes to iterate(not iterate itself and its any siblings)
 */
function DomRunner(node) {
    this._root = node;
    this._current = node;
}


/**
 * next
 * Iterate next node
 * @return {DOMElement} next node
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
 * @return {DOMElement} current node
 */
DomRunner.prototype.getNode = function() {
    return this._current;
};

/**
 * getNodeText
 * Get current node's text content
 * @return {string} text
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
 * @param {DOMElement} node next node
 * @param {DOMElement} current next node
 * @return {boolean} result
 */
DomRunner.prototype._isNeedNextSearch = function(node, current) {
    return !node && current !== this._root && current.parentNode !== this._root;
};

/**
 * _getNextNode
 * Return available next node
 * @private
 * @param {DOMElement} current current node
 * @return {DOMElement} next node
 */
DomRunner.prototype._getNextNode = function(current) {
    return current.firstChild || current.nextSibling;
};

DomRunner.NODE_TYPE = NODE;

module.exports = DomRunner;


},{}],2:[function(require,module,exports){
/**
 * @fileoverview Implements entry point
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var toMark = require('./toMark');

if (typeof define === 'function' && define.amd) {
    define(function() {
        return toMark;
    });
} else if (typeof exports !== 'undefined') {
    module.exports = toMark;
}

if (typeof window !== 'undefined') {
    window.toMark = toMark;
}

},{"./toMark":7}],3:[function(require,module,exports){
/**
 * @fileoverview Implements basicRenderer
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var Renderer = require('./renderer');

var FIND_LAST_RETURN_RX = /\n$/g,
    FIND_BR_AND_RETURN_RX = /[ \xA0]+\n\n/g,
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

        if (this._isNeedEscape(managedText)) {
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
            res = '*' + subContent + '*';
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
        var res = subContent,
            url = node.href;

        if (!this.isEmptyText(subContent) && url) {
            res = '[' + subContent + '](' + url + ')';
        }

        return res;
    },
    'IMG': function(node) {
        var res = '',
            src = node.src,
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
        var res = '';

        if (!this.isEmptyText(subContent)) {
            res = '`' + subContent + '`';
        }

        return res;
    },

    //Paragraphs
    'P': function(node, subContent) {
        var res = '';

        if (!this.isEmptyText(subContent)) {
            res = '\n' + subContent + '\n\n';
        }

        return res;
    },
    'BLOCKQUOTE P': function(node, subContent) {
        return subContent;
    },
    'LI P': function(node, subContent) {
        var res = '';

        if (!this.isEmptyText(subContent)) {
            res = subContent + '\n  \n';
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

        return '\n' + res + '\n\n';
    },
    'LI H1, LI H2, LI H3, LI H4, LI H5, LI H6': function(node) {
        return '<' + node.tagName.toLowerCase() + '>' + node.innerHTML + '</' + node.tagName.toLowerCase() + '>';
    },

    //List
    'UL, OL': function(node, subContent) {
        return '\n' + subContent + '\n';
    },
    'LI OL, LI UL': function(node, subContent) {
        var res, processedSubContent;

        //because parent LI converter add \n too
        processedSubContent = subContent.replace(FIND_LAST_RETURN_RX, '');
        //and br remove end of li
        processedSubContent = processedSubContent.replace(FIND_BR_AND_RETURN_RX, '\n');

        res = processedSubContent.replace(START_OF_LINES_RX, '    ');

        return '\n' + res;
    },
    'UL LI': function(node, subContent) {
        var res = '';

        res += '* ' + (subContent || ' ') + '\n';

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

        res += liCounter + '. ' + (subContent || ' ') + '\n';

        return res;
    },

    //HR
    'HR': function() {
        return '\n- - -\n\n';
    },

    //Blockquote
    'BLOCKQUOTE': function(node, subContent) {
        var res, trimmedText;

        trimmedText = this.trim(subContent);
        res = trimmedText.replace(START_OF_LINES_RX, '> ');

        return '\n' + res + '\n\n';
    },

    //Code Block
    'PRE CODE': function(node, subContent) {
        var res, lastNremoved;

        lastNremoved = subContent.replace(FIND_LAST_RETURN_RX, '');
        res = lastNremoved.replace(START_OF_LINES_RX, '    ');

        return '\n' + res + '\n\n';
    }
});

module.exports = basicRenderer;

},{"./renderer":5}],4:[function(require,module,exports){
/**
 * @fileoverview Implements gfmRenderer
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var Renderer = require('./renderer'),
    basicRenderer = require('./renderer.basic');

/**
 * gfmRenderer
 * github flavored Markdown Renderer
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
            language = node.getAttribute('data-language');
        }

        return '\n```' + language + '\n' + subContent + '\n```\n';
    },
    'LI INPUT': function(node) {
        var condition;

        if (node.type !== 'checkbox') {
            return;
        }

        condition = node.checked ? 'x' : ' ';

        return '[' + condition + '] ';
    },

    //Table
    'TR TD, TR TH': function(node, subContent) {
        return ' ' + subContent + ' |';
    },
    'TR': function(node, subContent) {
        return '|' + subContent + '\n';
    },
    'THEAD': function(node, sbContent) {
        var i, ths, thsLength,
            result = '';

        ths = findChildTag(findChildTag(node, 'TR')[0], 'TH');
        thsLength = ths.length;

        for (i = 0; i < thsLength; i += 1) {
            result += ' ' + makeTableHeadAlignText(ths[i]) + ' |';
        }

        return sbContent + '|' + result + '\n';
    }
});

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

function repeatString(pattern, count) {
    var result = pattern;

    while (count > 1) {
        result += pattern;
        count -= 1;
    }

    return result;
}
module.exports = gfmRenderer;

},{"./renderer":5,"./renderer.basic":3}],5:[function(require,module,exports){
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
    FIND_CHAR_TO_ESCAPE_RX = /[\(\)\*\{\}\[\]\_\`\+\-\.\!#]/g;

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
 * @param {object} rules rules to add
 * @class
 */
function Renderer(rules) {
    this.rules = {};

    if (rules) {
        this.addRules(rules);
    }
}

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

function isInlineNode(node) {
    var tag = node.tagName;
    return tag === 'S' || tag === 'B' || tag === 'I' || tag === 'EM' || tag === 'STRONG' || tag === 'A' || tag === 'IMG' || tag === 'CODE';
}

/**
 * getSpaceControlled
 * Remove flanked space of dom node
 * @param {string} content text content
 * @param {DOMElement} node current node
 * @return {string} result
 */
Renderer.prototype.getSpaceControlled = function(content, node) {
    var lead = '',
        trail = '',
        text;

    if (node.previousSibling && isInlineNode(node.previousSibling)) {
        text = node.previousSibling.innerHTML || node.previousSibling.nodeValue;

        if (FIND_TRAIL_SPACE_RX.test(text) || FIND_LEAD_SPACE_RX.test(node.innerHTML || node.nodeValue)) {
            lead = ' ';
        }
    }

    if (node.nextSibling && isInlineNode(node.nextSibling)) {
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
 * @param {DOMElement} node node to convert
 * @param {stirng} subContent child nodes converted text
 * @return {string} converted text
 */
Renderer.prototype.convert = function(node, subContent) {
    var result,
        converter = this._getConverter(node);

    if (converter) {
        result = converter.call(this, node, subContent);
    } else {
        result = subContent;
    }

    //console.log(JSON.stringify(result), converter.fname);

    return result || '';
};

/**
 * _getConverter
 * Get converter function for node
 * @private
 * @param {DOMElement} node node
 * @return {function} converter function
 */
Renderer.prototype._getConverter = function (node) {
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
 * @return {object} rule Object
 */
Renderer.prototype._getNextRule = function(ruleObj, ruleName) {
    return ruleObj[ruleName];
};

/**
 * _getRuleNameFromNode
 * Get proper rule tag name from node
 * @private
 * @param {DOMElement} node node
 * @return {string} rule tag name
 */
Renderer.prototype._getRuleNameFromNode = function(node) {
    return node.tagName || 'TEXT_NODE';
};

/**
 * _getPrevNode
 * Get node's available parent node
 * @private
 * @param {DOMElement} node node
 * @return {DOMElement|undefined} result
 */
Renderer.prototype._getPrevNode = function(node) {
    var parentNode = node.parentNode;

    if (parentNode && !parentNode.__htmlRootByToMark) {
        return parentNode;
    }
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
    var selectorIndex;

    selectors = selectors.split(' ');
    selectorIndex = selectors.length - 1;

    while (selectorIndex >= 0) {
        iteratee(selectors[selectorIndex]);
        selectorIndex -= 1;
    }
};

/**
 * trim
 * Trim text
 * @param {string} text text be trimed
 * @return {string} trimed text
 */
Renderer.prototype.trim = function(text) {
    return text.replace(FIND_CHAR_TO_TRIM_RX, '');
};

/**
 * isEmptyText
 * Returns whether text empty or not
 * @param {string} text text be checked
 * @return {boolean} result
 */
Renderer.prototype.isEmptyText = function(text) {
    return text.replace(FIND_SPACE_RETURN_TAB_RX, '') === '';
};

/**
 * getSpaceCollapsedText
 * Collape space more than 2
 * @param {string} text text be collapsed
 * @return {string} result
 */
Renderer.prototype.getSpaceCollapsedText = function(text) {
    return text.replace(FIND_SPACE_MORE_THAN_ONE_RX, ' ');
};

/**
 * Backslash escape to text
 * Apply backslash escape to text
 * @param {string} text text be processed
 * @return {string} processed text
 */
Renderer.prototype.escapeText = function(text) {
    text = text.replace(FIND_CHAR_TO_ESCAPE_RX, function(matched) {
        return '\\' + matched;
    });

    return text;
};

Renderer.markdownText = {
    codeblock: /(^ {4}[^\n]+\n*)+/,
    hr: /(^ *[-*_]){3,} */,
    heading: /^(#{1,6}) +[\s\S]+/,
    lheading: /^([^\n]+)\n *(=|-){2,} */,
    blockquote: /^( *>[^\n]+.*)+/,
    list: /^ *(\*+|\d+\.) [\s\S]+/,
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? */,

    link: /!?\[.*\]\(.*\)/,
    reflink: /!?\[.*\]\s*\[([^\]]*)\]/,
    strong: /__(\S[\s\S]*\h)__|\*\*(\S[\s\S]*\S)\*\*/,
    em: /_(\S[\s\S]*\S)_|\*(\S[\s\S]*\S)\*/,
    code: /(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,

    codeblockGfm: /^(`{3,})[ \.]*(\S+)/
};

Renderer.prototype._isNeedEscape = function(text) {
    var res = false,
        type,
        markdownText = Renderer.markdownText;

    for (type in markdownText) {
        if (markdownText[type].test(text)) {
            console.log(type);
            res = true;
            break;
       }
    }

    return res;
};

function cloneRules(dest, src) {
    forEachOwnProperties(src, function(value, key) {
        if (key !== 'converter') {
            if (!dest[key]) {
                dest[key] = {};
            }
            cloneRules(dest[key], value);
        } else {
            dest[key] = value;
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
 * @return {Renderer} renderer
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

},{}],6:[function(require,module,exports){
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
 * @param {DOMElement|string} html DOM Node root or HTML string
 * @return {DOMElement[]} dom element
 */
function toDom(html) {
    var wrapper;

    if (Object.prototype.toString.call(html) === '[object String]') {
        wrapper = document.createElement('div');

        //trim text
        html = html.replace(FIND_FIRST_LAST_SPACE_OR_RETURN_OR_TAB_RX, '');

        //trim between tags
        html = html.replace(FIND_RETURN_OR_TAB_BETWEEN_TAGS_RX, '><');

        //remove spaces more than 1(if need more space, must use &nbsp)
        html = html.replace(FIND_WHOLE_SPACE_MORE_THAN_ONE_BETWEEN_TAGS_RX, '> <');

        wrapper.innerHTML = html;
    } else {
        wrapper = html;
    }

    wrapper.__htmlRootByToMark = true;

    return wrapper;
}

module.exports = toDom;

},{}],7:[function(require,module,exports){
/**
 * @fileoverview Implements toMark
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var DomRunner = require('./domRunner'),
    toDom = require('./toDom'),
    basicRenderer = require('./renderer.basic'),
    gfmRenderer = require('./renderer.gfm');

var FIND_FIRST_LAST_WITH_SPACE_RETURNS_RX = /^[\n]+|[\s\n]+$/g,
    FIND_TRIPLE_RETURNS_RX = /\n\n\n/g,
    FIND_RETURNS_RX = /[ \xA0]+\n/g,
    FIND_EMPTYLINE_WITH_RETURN_RX = /\n[ \xA0]+\n\n/g,
    FIND_DUPLICATED_2_RETURNS_WITH_BR_RX = /[ \xA0]+\n\n\n/g,
    FIND_DUPLICATED_RETURN_WITH_BR_RX = /[ \xA0]+\n\n/g;
/**
 * toMark
 * @exports toMark
 * @param {string} htmlStr html string to convert
 * @param {object} options option
 * @param {boolean} options.gfm if this property is false turn off it cant parse gfm
 * @param {Renderer} options.renderer pass renderer to use
 * @return {string} converted markdown text
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

    return finalize(parse(runner, renderer), isGfm);
}

/**
 * parse
 * Parse dom to markdown
 * @param {DomRunner} runner runner
 * @param {Renderer} renderer renderer
 * @return {string} markdown text
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
 * @return {string} result
 */
function finalize(text, isGfm) {
    //collapse duplicated returns made by <br /> and block element
    text = text.replace(FIND_DUPLICATED_2_RETURNS_WITH_BR_RX, '\n\n');

    //collpase emptyline and additional return
    text = text.replace(FIND_EMPTYLINE_WITH_RETURN_RX, '\n  \n');

    //collapse return and <br>
    text = text.replace(FIND_DUPLICATED_RETURN_WITH_BR_RX, '\n');

    //collapse triple returns made by consecutive block elements
    text = text.replace(FIND_TRIPLE_RETURNS_RX, '\n\n');

    //remove first and last \n
    text = text.replace(FIND_FIRST_LAST_WITH_SPACE_RETURNS_RX, '');

    //in gfm replace '  \n' make by <br> to '\n'
    if (isGfm) {
        text = text.replace(FIND_RETURNS_RX, '\n');
    }

    return text;
}

/**
 * tracker
 * Iterate childNodes and process conversion using recursive call
 * @param {DomRunner} runner dom runner
 * @param {Renderer} renderer renderer to use
 * @return {string} processed text
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

},{"./domRunner":1,"./renderer.basic":3,"./renderer.gfm":4,"./toDom":6}]},{},[2]);
