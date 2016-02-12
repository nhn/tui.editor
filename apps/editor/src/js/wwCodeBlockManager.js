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
    var self = this;

    this.wwe.addKeyEventHandler('ENTER', function(ev, range) {
        return self._onEnter(ev, range);
    });

    this.wwe.addKeyEventHandler('BACK_SPACE', this._unforamtCodeIfToplineZeroOffset.bind(this));
    this.wwe.addKeyEventHandler('BACK_SPACE', this._unformatCodeIfCodeBlockHasOneCodeTag.bind(this));
    this.wwe.addKeyEventHandler('BACK_SPACE', this._removeLastCharInCodeTagIfCodeTagHasOneChar.bind(this));
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
    html = html.replace(/\<\pre( .*?)?\>(.*?)\<\/pre\>/g, function(match, codeAttr, code) {
        code = code.replace(/\<\/code\>\<br \/>/g, '\n');
        code = code.replace(/\<code ?(.*?)\>/g, '');
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

            $(pre).append('<div><code>' + sanitizeHtmlCode(line) + '</code></div>');
        });
    });
};

WwCodeBlockManager.prototype._onEnter = function(ev, range) {
    if (!this._isInCodeBlock(range)) {
        return true;
    }
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
};

WwCodeBlockManager.prototype._unformatCodeIfCodeBlockHasOneCodeTag = function(ev, range) {
    var pre, code;

    if (!this._isInCodeBlock(range)) {
        return true;
    }

    pre = domUtils.getParentUntil(range.startContainer);
    code = domUtils.getParentUntil(range.startContainer, 'PRE');

    //코드블럭이 code하나밖에 없을때
    if (range.startOffset === 0 && $(pre).find('code').length <= 1) {
        $(code).find('code').children().unwrap('code');
        return false;
    }
};

WwCodeBlockManager.prototype._removeLastCharInCodeTagIfCodeTagHasOneChar = function(ev, range) {
    var currentNodeName;

    if (!this._isInCodeBlock(range)) {
        return true;
    }

    currentNodeName = domUtils.getNodeName(range.startContainer);

    //텍스트 노드인경우 code블럭이 삭제되는것을 방지(squire가 삭제하면 다시만든다)
    if (currentNodeName === 'TEXT'
        && domUtils.getOffsetLength(range.startContainer) === 1
        && range.startOffset <= 2
    ) {
        ev.preventDefault();
        range.startContainer.textContent = '\u200B';
        return false;
    }
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
