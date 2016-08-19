/**
 * @fileoverview Implements wysiwyg p manager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


var domUtils = require('./domUtils');

var util = tui.util;

var tagEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};

var FIND_ZWS_RX = /\u200B/g;
var CODEBLOCK_ATTR_NAME = 'data-te-codeblock';

/**
 * WwCodeBlockManager
 * @exports WwCodeBlockManager
 * @class WwCodeBlockManager
 * @constructor
 * @param {WysiwygEditor} wwe wysiwygEditor instance
 */
function WwCodeBlockManager(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    this._init();
}

/**
 * Name property
 * @api
 * @memberOf WwCodeBlockManager
 * @type {string}
 */
WwCodeBlockManager.prototype.name = 'codeblock';

/**
 * _init
 * Initialize
 * @memberOf WwCodeBlockManager
 * @private
 */
WwCodeBlockManager.prototype._init = function() {
    this._initKeyHandler();
    this._initEvent();
};

/**
 * _initKeyHandler
 * Initialize key event handler
 * @memberOf WwCodeBlockManager
 * @private
 */
WwCodeBlockManager.prototype._initKeyHandler = function() {
    this.wwe.addKeyEventHandler('BACK_SPACE', this._removeCodeblockIfNeed.bind(this));
};

/**
 * _initEvent
 * Initialize eventmanager event
 * @memberOf WwCodeBlockManager
 * @private
 */
WwCodeBlockManager.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('wysiwygSetValueAfter', function() {
        self._splitCodeblockToEachLine();
    });

    this.eventManager.listen('wysiwygProcessHTMLText', function(html) {
        return self._mergeCodeblockEachlinesFromHTMLText(html);
    });
};

/**
 * Convert copied nodes to code block if need
 * @api
 * @memberOf WwCodeBlockManager
 * @param {Array.<Node>} nodes Node array
 * @returns {DocumentFragment}
 */
WwCodeBlockManager.prototype.prepareToPasteOnCodeblock = function(nodes) {
    var range = this.wwe.getEditor().getSelection().cloneRange();
    var frag = this.wwe.getEditor().getDocument().createDocumentFragment();

    if (nodes.length === 1 && this._isCodeBlock(nodes[0])) {
        frag.appendChild(this._copyCodeblockTypeFromRangeCodeblock(nodes.shift(), range));
    } else {
        frag.appendChild(this._copyCodeblockTypeFromRangeCodeblock(this.convertToCodeblock(nodes), range));
    }

    return frag;
};

/**
 * Wrap nodes into code block
 * @api
 * @memberOf WwCodeBlockManager
 * @param {Array.<Node>} nodes Node array
 * @returns {HTMLElement} Code block element
 */
WwCodeBlockManager.prototype.convertToCodeblock = function(nodes) {
    var $codeblock = $('<pre />');
    var self = this;
    var node = nodes.shift();

    while (node) {
        $codeblock.append(self._makeCodeBlockLineHtml(node.textContent));
        node = nodes.shift();
    }

    $codeblock.attr(CODEBLOCK_ATTR_NAME, '');

    return $codeblock[0];
};

/**
 * Copy content with code block style from code block selection
 * @memberOf WwCodeBlockManager
 * @param {HTMLElement} element Copied element
 * @param {Range} range Range object
 * @returns {HTMLElement}
 * @private
 */
WwCodeBlockManager.prototype._copyCodeblockTypeFromRangeCodeblock = function(element, range) {
    var blockNode, attrs;

    blockNode = domUtils.getParentUntil(range.commonAncestorContainer, this.wwe.get$Body()[0]);

    if (domUtils.getNodeName(blockNode) === 'PRE') {
        attrs = $(blockNode).prop('attributes');

        util.forEach(attrs, function(attr) {
            $(element).attr(attr.name, attr.value);
        });
    }

    return element;
};

/**
 * Merge code block lines
 * @memberOf WwCodeBlockManager
 * @param {string} html HTML string
 * @returns {string}
 * @private
 */
WwCodeBlockManager.prototype._mergeCodeblockEachlinesFromHTMLText = function(html) {
    html = html.replace(/<pre( .*?)?>(.*?)<\/pre>/g, function(match, codeAttr, code) {
        code = code.replace(/<br \/>/g, '\n');
        code = code.replace(/<div ?(.*?)>/g, '');
        code = code.replace(/\n$/, '');

        return '<pre><code' + (codeAttr || '') + '>' + code + '</code></pre>';
    });

    return html;
};

/**
 * Split code block to lines
 * @memberOf WwCodeBlockManager
 * @private
 */
WwCodeBlockManager.prototype._splitCodeblockToEachLine = function() {
    var self = this;

    this.wwe.get$Body().find('pre').each(function(index, pre) {
        var codelines = pre.textContent.replace(/\n+$/, '').split('\n'),
            lang = $(pre).find('code').attr('data-language');

        if (lang) {
            $(pre).attr('data-language', lang);
            $(pre).addClass('lang-' + lang);
        }

        $(pre).empty();

        util.forEach(codelines, function(line) {
            $(pre).append(self._makeCodeBlockLineHtml(line));
        });

        $(pre).attr(CODEBLOCK_ATTR_NAME, '');
    });
};

/**
 * Make code HTML text
 * @memberOf WwCodeBlockManager
 * @param {string} lineContent Content text
 * @returns {string}
 * @private
 */
WwCodeBlockManager.prototype._makeCodeBlockLineHtml = function(lineContent) {
    if (!lineContent) {
        lineContent = '<br>';
    } else {
        lineContent = sanitizeHtmlCode(lineContent);
    }

    return '<div>' + lineContent + '</div>';
};

/**
 * Remove codeblock if need
 * @memberOf WwCodeBlockManager
 * @param {Event} ev Event object
 * @param {Range} range Range object
 * @returns {boolean}
 * @private
 */
WwCodeBlockManager.prototype._removeCodeblockIfNeed = function(ev, range) {
    var pre, $div, codeContent;
    var self = this;

    if (!this.isInCodeBlock(range)) {
        return true;
    }

    pre = $(range.startContainer).closest('pre');
    $div = $(pre).find('div').eq(0);
    codeContent = $div.text().replace(FIND_ZWS_RX, '');

    //코드블럭이 code한줄 밖에 없을때
    if ((range.startOffset === 0 || codeContent.length === 0)
        && $(pre).find('div').length <= 1
    ) {
        this.wwe.getEditor().modifyBlocks(function() {
            var newFrag = self.wwe.getEditor().getDocument().createDocumentFragment();
            var content;

            if (codeContent.length === 0) {
                content = '<br>';
            } else {
                content = $div.html().replace(FIND_ZWS_RX, '');
            }

            $(newFrag).append($('<div>' + content + '</div>'));

            return newFrag;
        });

        return false;
    }

    return true;
};

/**
 * Return boolean value of whether current range is in the code block
 * @memberOf WwCodeBlockManager
 * @param {Range} range Range object
 * @returns {boolean}
 */
WwCodeBlockManager.prototype.isInCodeBlock = function(range) {
    var target;

    if (range.collapsed) {
        target = range.startContainer;
    } else {
        target = range.commonAncestorContainer;
    }

    return this._isCodeBlock(target);
};

/**
 * Verify given element is code block
 * @memberOf WwCodeBlockManager
 * @param {HTMLElement} element Element
 * @returns {boolean}
 * @private
 */
WwCodeBlockManager.prototype._isCodeBlock = function(element) {
    return !!$(element).closest('pre').length;
};

function sanitizeHtmlCode(code) {
    return code.replace(/[<>&]/g, function(tag) {
        return tagEntities[tag] || tag;
    });
}

module.exports = WwCodeBlockManager;
