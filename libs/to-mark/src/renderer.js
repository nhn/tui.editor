/**
 * @fileoverview Implements Renderer
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
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
    FIND_CHAR_TO_ESCAPE_RX = /[~>()*{}\[\]_`+-.!#|]/g,
    // find characters to be escaped in links or images
    FIND_CHAR_TO_ESCAPE_IN_LINK_RX = /[\[\]\(\)<>]/g;

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
 * Returns HTML string of an element using given subContent
 * @param {Node} node Element
 * @param {string} subContent string content of node
 * @returns {string}
 */
function getRawHtmlString(node, subContent) {
    var tempNode = node.cloneNode(false);
    tempNode.innerHTML = subContent;

    return tempNode.outerHTML;
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
        result = getRawHtmlString(node, subContent);
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
    return text.replace(FIND_CHAR_TO_ESCAPE_RX, function(matched) {
        return '\\' + matched;
    });
};

/**
 * Escape given text for link
 * @param {string} text - text be processed
 * @returns {string} - processed text
 */
Renderer.prototype.escapeTextForLink = function(text) {
    return text.replace(FIND_CHAR_TO_ESCAPE_IN_LINK_RX, function(matched) {
        return '\\' + matched;
    });
};

/**
 * Backslash escape to text for html
 * Apply backslash escape to text
 * @param {string} text text be processed
 * @returns {string} processed text
 */
Renderer.prototype.escapeTextHtml = function(text) {
    return text.replace(Renderer.markdownTextToEscapeHtmlRx, function(matched) {
        return '\\' + matched;
    });
};

/**
 * Backslash is using for escape ASCII punctuation character.
 * https://spec.commonmark.org/0.29/#backslash-escapes
 * If user input backslash as text, backslash is kept by inserting backslash.
 * For example, if input text is "\$", this text is changed "\\$"
 * @param {string} text text be processed
 * @returns {string} processed text
 */
Renderer.prototype.escapeTextBackSlash = function(text) {
    return text.replace(Renderer.markdownTextToEscapeBackSlashRx, function(matched) {
        return '\\' + matched;
    });
};

/**
 * Escapes in markdown paired characters
 * @param {string} text Text to escape
 * @returns {string} escaped text
 */
Renderer.prototype.escapePairedCharacters = function(text) {
    return text.replace(Renderer.markdownTextToEscapePairedCharsRx, function(matched) {
        return '\\' + matched;
    });
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

    verticalBar: /\u007C/,

    codeblockGfm: /^(`{3,})/,
    codeblockTildes: /^(~{3,})/
};

Renderer.markdownTextToEscapeHtmlRx = /<([a-zA-Z_][a-zA-Z0-9\-\._]*)(\s|[^\\/>])*\/?>|<(\/)([a-zA-Z_][a-zA-Z0-9\-\._]*)\s*\/?>|<!--[^-]+-->|<([a-zA-Z_][a-zA-Z0-9\-\.:/]*)>/g;

Renderer.markdownTextToEscapeBackSlashRx = /\\[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\\]/g;

Renderer.markdownTextToEscapePairedCharsRx = /[*_~`]/g;

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

Renderer.prototype._isNeedEscapeBackSlash = function(text) {
    return Renderer.markdownTextToEscapeBackSlashRx.test(text);
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
