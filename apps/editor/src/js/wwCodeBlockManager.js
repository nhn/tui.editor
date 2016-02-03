/**
 * @fileoverview Implements wysiwyg p manager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

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

    this.wwe.addKeyEventHandler('BACK_SPACE', function(ev, range) {
    });
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
    html = html.replace(/\<\pre\>(.*?)\<\/pre\>/g, function(match, code) {
        var codeAttr = code.match(/\<code ?(.*?)\>/)[1];

        code = code.replace(/\<\/code\>\<br \/>/g, '\n');
        code = code.replace(/\<code ?(.*?)\>/g, '');
        code = code.replace(/\n$/, '');

        return '<pre><code ' + codeAttr + '>' + code + '</code></pre>';
    });

    return html;
};

WwCodeBlockManager.prototype._splitCodeblockToEachLine = function() {
    this.wwe.get$Body().find('pre').each(function(index, pre) {
        var codelines = pre.textContent.split('\n');

        $(pre).empty();

        util.forEach(codelines, function(line) {
            if (line) {
                $(pre).append('<div><code>' + sanitizeHtmlCode(line) + '</code></div>');
            }
        });
    });
};

WwCodeBlockManager.prototype._onEnter = function(ev, range) {
    var self = this;

    if (this._isInCodeBlock(range)) {
    }
};

WwCodeBlockManager.prototype._isInCodeBlock = function(range) {
    var target;

    if (range.collapsed) {
        target = range.startContainer;
    } else {
        target = range.commonAncestorContainer;
    }

    return !!$(target).closest('pre').length && !!$(target).closest('pre').length;
};

function sanitizeHtmlCode(code) {
    return code.replace(/[<>&]/g, function(tag) {
        return tagEntities[tag] || tag;
    });
}

module.exports = WwCodeBlockManager;
