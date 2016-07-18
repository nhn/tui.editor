/**
 * @fileoverview Implements wysiwyg p manager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var domUtils = require('./domUtils');

var util = tui.util;

var tagEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};

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
    this.wwe.addKeyEventHandler('ENTER', this._recoverIncompleteLineInPreTag.bind(this));
    this.wwe.addKeyEventHandler('BACK_SPACE', this._unforamtCodeIfToplineZeroOffset.bind(this));
    this.wwe.addKeyEventHandler('BACK_SPACE', this._unformatCodeIfCodeBlockHasOneCodeTag.bind(this));
    this.wwe.addKeyEventHandler('BACK_SPACE', this._removeLastCharInCodeTagIfCodeTagHasOneChar.bind(this));
    this.wwe.addKeyEventHandler('BACK_SPACE', this._removeCodeIfCodeIsEmpty.bind(this));
    this.wwe.addKeyEventHandler('BACK_SPACE', this._recoverIncompleteLineInPreTag.bind(this));
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
        code = code.replace(/<\/code><br \/>/g, '\n');
        code = code.replace(/<code ?(.*?)>/g, '');
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
        lineContent = '\u200B';
    }

    return '<div><code>' + sanitizeHtmlCode(lineContent) + '</code></div>';
};

/**
 * Insert ZWB code block if in empty code
 * @memberOf WwCodeBlockManager
 * @param {Event} ev Event object
 * @param {Range} range Range object
 * @returns {boolean}
 * @private
 */
WwCodeBlockManager.prototype._inserNewCodeIfInEmptyCode = function(ev, range) {
    if (this.isInCodeBlock(range) && domUtils.getTextLength(range.startContainer) === 0) {
        ev.preventDefault();
        this.wwe.getEditor().saveUndoState(range);
        $('<div><code>&#8203</code><br></div>').insertBefore(domUtils.getParentUntil(range.startContainer, 'PRE'));

        return false;
    }

    return true;
};

/**
 * Unformat code at top line and offset equals 0
 * @memberOf WwCodeBlockManager
 * @param {Event} ev Event object
 * @param {Range} range Range object
 * @returns {boolean}
 * @private
 */
WwCodeBlockManager.prototype._unforamtCodeIfToplineZeroOffset = function(ev, range) {
    var currentNodeName, code;

    if (!this.isInCodeBlock(range)) {
        return true;
    }

    currentNodeName = domUtils.getNodeName(range.startContainer);
    code = domUtils.getParentUntil(range.startContainer, 'PRE');

    //최상단의 라인의 0오프셋 일때
    if (currentNodeName === 'TEXT'
        && range.startOffset === 0
        && !code.previousSibling
    ) {
        $(code).text(range.startContainer.textContent);

        range.setStart(code.childNodes[0], 0);
        this.wwe.getEditor().setSelection(range);

        return false;
    }

    return true;
};

/**
 * Unformat code when one CODE tag in PRE tag
 * @memberOf WwCodeBlockManager
 * @param {Event} ev Event object
 * @param {Range} range Range object
 * @returns {boolean}
 * @private
 */
WwCodeBlockManager.prototype._unformatCodeIfCodeBlockHasOneCodeTag = function(ev, range) {
    var pre, div;

    if (!this.isInCodeBlock(range)) {
        return true;
    }

    pre = domUtils.getParentUntil(range.startContainer);
    div = domUtils.getParentUntil(range.startContainer, 'PRE');

    //코드블럭이 code하나밖에 없을때
    if (range.startOffset === 0 && $(pre).find('code').length <= 1) {
        $(div).find('code').children().unwrap('code');

        return false;
    }

    return true;
};

/**
 * Remove last character in CODE tag when CODE has one character
 * @memberOf WwCodeBlockManager
 * @param {Event} ev Event object
 * @param {Range} range Range object
 * @returns {boolean}
 * @private
 */
WwCodeBlockManager.prototype._removeLastCharInCodeTagIfCodeTagHasOneChar = function(ev, range) {
    var currentNodeName;

    if (!this.isInCodeBlock(range)) {
        return true;
    }

    currentNodeName = domUtils.getNodeName(range.startContainer);

    //텍스트 노드인경우 마지막 케릭터와 code블럭이 함께 삭제되는것을 방지(squire가 삭제하면 다시만든다)
    if (currentNodeName === 'TEXT'
        && domUtils.getOffsetLength(range.startContainer) === 1
        && range.startOffset <= 2
    ) {
        ev.preventDefault();
        range.startContainer.textContent = '\u200B';

        return false;
    }

    return true;
};

/**
 * Recover incomplete line in PRE tag
 * @memberOf WwCodeBlockManager
 * @param {Event} ev Event object
 * @param {Range} range Range object
 * @returns {boolean}
 * @private
 */
WwCodeBlockManager.prototype._recoverIncompleteLineInPreTag = function(ev, range) {
    var pre;

    if (this.wwe.getEditor().hasFormat('PRE')) {
        pre = domUtils.getParentUntil(range.startContainer, this.wwe.get$Body()[0]);

        this.wwe.defer(function(wwe) {
            var modified;

            $(pre).find('div').each(function(index, div) {
                if (!$(div).find('code').length) {
                    $(div).html('<code>' + ($(div).text() || '&#8203') + '</code><br>');
                    modified = true;
                }
            });

            if (modified) {
                wwe.readySilentChange();
            }
        });
    }

    return true;
};

/**
 * Remove blank CODE tag
 * @memberOf WwCodeBlockManager
 * @param {Event} ev Event object
 * @param {Range} range Range object
 * @returns {boolean}
 * @private
 */
WwCodeBlockManager.prototype._removeCodeIfCodeIsEmpty = function(ev, range) {
    var currentNodeName, div;

    if (this.isInCodeBlock(range)) {
        currentNodeName = domUtils.getNodeName(range.startContainer);
        div = domUtils.getParentUntil(range.startContainer, 'PRE');

        if (currentNodeName === 'TEXT'
            && domUtils.getOffsetLength(range.startContainer) === 0
            && range.startOffset <= 1
        ) {
            $(div).html('<br>');

            range.setStart(div, 0);
            range.collapse(true);

            this.wwe.getEditor().setSelection(range);

            return false;
        }
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
    return !!$(element).closest('pre').length
        && (!!$(element).closest('code').length || !!$(element).find('code').length);
};

function sanitizeHtmlCode(code) {
    return code.replace(/[<>&]/g, function(tag) {
        return tagEntities[tag] || tag;
    });
}

module.exports = WwCodeBlockManager;
