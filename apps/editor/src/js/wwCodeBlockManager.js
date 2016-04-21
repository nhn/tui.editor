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
 * @augments
 * @constructor
 * @class
 * @param {WysiwygEditor} wwe wysiwygEditor instance
 */
function WwCodeBlockManager(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    this._init();
}

WwCodeBlockManager.prototype.name = 'codeblock';

/**
 * _init
 * Init
 */
WwCodeBlockManager.prototype._init = function() {
    this._initKeyHandler();
    this._initEvent();
};

/**
 * _initKeyHandler
 * Initialize key event handler
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

WwCodeBlockManager.prototype._mergeCodeblockEachlinesFromHTMLText = function(html) {
    html = html.replace(/<pre( .*?)?>(.*?)<\/pre>/g, function(match, codeAttr, code) {
        code = code.replace(/<\/code><br \/>/g, '\n');
        code = code.replace(/<code ?(.*?)>/g, '');
        code = code.replace(/\n$/, '');

        return '<pre><code' + (codeAttr || '') + '>' + code + '</code></pre>';
    });

    return html;
};

WwCodeBlockManager.prototype._splitCodeblockToEachLine = function() {
    this.wwe.get$Body().find('pre').each(function(index, pre) {
        var codelines = pre.textContent.replace(/\n+$/, '').split('\n'),
            lang = $(pre).find('code').attr('data-language');

        if (lang) {
            $(pre).attr('data-language', lang);
            $(pre).addClass('lang-' + lang);
        }

        $(pre).empty();

        util.forEach(codelines, function(line) {
            if (!line) {
                line = '\u200B';
            }

            $(pre).append('<div><code>' + sanitizeHtmlCode(line) + '</code><br></div>');
        });
    });
};

WwCodeBlockManager.prototype._inserNewCodeIfInEmptyCode = function(ev, range) {
    if (this._isInCodeBlock(range) && domUtils.getTextLength(range.startContainer) === 0) {
        ev.preventDefault();
        this.wwe.getEditor().recordUndoState(range);
        $('<div><code>&#8203</code><br></div>').insertBefore(domUtils.getParentUntil(range.startContainer, 'PRE'));

        return false;
    }

    return true;
};

WwCodeBlockManager.prototype._unforamtCodeIfToplineZeroOffset = function(ev, range) {
    var currentNodeName, code;

    if (!this._isInCodeBlock(range)) {
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

WwCodeBlockManager.prototype._unformatCodeIfCodeBlockHasOneCodeTag = function(ev, range) {
    var pre, div;

    if (!this._isInCodeBlock(range)) {
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

WwCodeBlockManager.prototype._removeLastCharInCodeTagIfCodeTagHasOneChar = function(ev, range) {
    var currentNodeName;

    if (!this._isInCodeBlock(range)) {
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

WwCodeBlockManager.prototype._recoverIncompleteLineInPreTag = function(ev, range) {
    var pre,
        self = this;

    if (this.wwe.getEditor().hasFormat('PRE')) {
        this.wwe.getEditor().recordUndoState();

        pre = domUtils.getParentUntil(range.startContainer, this.wwe.$editorContainerEl[0]);

        setTimeout(function() {
            var modified;

            $(pre).find('div').each(function(index, div) {
                if (!$(div).find('code').length) {
                    $(div).html('<code>' + ($(div).text() || '&#8203') + '</code><br>');
                    modified = true;
                }
            });

            if (modified) {
                self.wwe.readySilentChange();
            }
        }, 0);
    }

    return true;
};

WwCodeBlockManager.prototype._removeCodeIfCodeIsEmpty = function(ev, range) {
    var currentNodeName, div;

    if (this._isInCodeBlock(range)) {
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

WwCodeBlockManager.prototype._isInCodeBlock = function(range) {
    var target;

    if (range.collapsed) {
        target = range.startContainer;
    } else {
        target = range.commonAncestorContainer;
    }

    return !!$(target).closest('pre').length
        && (!!$(target).closest('code').length || !!$(target).find('code').length);
};

function sanitizeHtmlCode(code) {
    return code.replace(/[<>&]/g, function(tag) {
        return tagEntities[tag] || tag;
    });
}

module.exports = WwCodeBlockManager;
