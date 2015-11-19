/**
 * @fileoverview Implements wysiwyg editor clipboard manager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = tui.util;

/**
 * WwClipboardManager
 * @exports WwClipboardManager
 * @constructor
 * @class
 * @param {WysiwygEditor} wwe WysiwygEditor instance
 */
function WwClipboardManager(wwe) {
    this.wwe = wwe;

    if (util.browser.msie) {
        this.$hiddenArea = $('<div style="position:absolute;top:0;left:-9999px;height:1px;width:1px;overflow:hidden;" />');
        this.wwe.$editorContainerEl.append(this.$hiddenArea);
    }
}

/**
 * init
 * initialize
 */
WwClipboardManager.prototype.init = function() {
    this._initSquireEvent();
};

/**
 * _initSquireEvent
 * initialize squire events
 */
WwClipboardManager.prototype._initSquireEvent = function() {
    var self = this;

    if (util.browser.msie) {
        this.wwe.getEditor().addEventListener('keydown', function(event) {
            var range;

            //Ctrl + C
            if (event.ctrlKey && event.keyCode === 67) {
                range = self.wwe.getEditor().getSelection().cloneRange();
                self.copyWithTextarea(range);
            }
        });

        this.wwe.getEditor().addEventListener('willPaste', function(pasteData) {
            pasteData.fragment = self._processFragment(pasteData.fragment);
        });
    } else {
        this.wwe.getEditor().addEventListener('copy', function(clipboardEvent) {
            var range;
            clipboardEvent.preventDefault();
            range = self.wwe.getEditor().getSelection().cloneRange();
            self.makeClipboardData(range, clipboardEvent);
        });
    }
};

/**
 * _processFragment
 * process fragment if it was from textarea
 * @param {DocumentFragment} fragment frament to process
 * @return {DocumentFragment} new fragment
 */
WwClipboardManager.prototype._processFragment = function(fragment) {
    var parsedChilds, processedFragment, i, t;

    if (this._latestTextareaContent === fragment.textContent) {
        parsedChilds = $.parseHTML(fragment.textContent);

        processedFragment = document.createDocumentFragment();

        for (i = 0, t = parsedChilds.length; i < t; i+=1) {
            processedFragment.appendChild(parsedChilds[i]);
        }
    }

    return  processedFragment || fragment;
};


/**
 * _getContentFromRange
 * get processed contents of range
 * @param {Range} range range of selection
 * @return {string} processed contents
 */
WwClipboardManager.prototype._getContentFromRange = function(range) {
    var resultContent,
        self = this,
        cloneContents = range.cloneContents();

    if (this._isOneTextNodeFullySelected(range)) {
        this._eachCurrentPath(function(pathStep) {
            resultContent = self._makeNodeAndAppend(pathStep, resultContent || cloneContents);
        });
    } else if (this._isOrphanListItem(range)) {
        resultContent = this._makeNodeAndAppend(range.commonAncestorContainer.tagName, cloneContents);
    }

    //wrap all result content with div to get HTML data
    resultContent = this._makeNodeAndAppend('div', resultContent || cloneContents);

    return resultContent.html();
};

/**
 * _makeNodeAndAppend
 * make node and append childs
 * @param {string} tagName tagName to make
 * @param {Node} content nodes to append
 * @return {Node} node
 */
WwClipboardManager.prototype._makeNodeAndAppend = function(tagName, content) {
    var node = $('<' + tagName + '/>');
    node.append(content);

    return node;
};

/**
 * _eachCurrentPath
 * iterate path depths
 * @param {function} iteratee callback
 */
WwClipboardManager.prototype._eachCurrentPath = function(iteratee) {
   var paths =  this.wwe.getEditor().getPath().split('>'),
       i;

   for (i = paths.length - 1; i > -1 && !paths[i].match(/^body/i); i-=1) {
       iteratee(paths[i]);
   }
};

/**
 * _isOneTextNodeFullySelected
 * check if one text node fully selected with range
 * @param {Range} range range of selection
 * @return {boolean} result
 */
WwClipboardManager.prototype._isOneTextNodeFullySelected = function(range) {
    return (range.commonAncestorContainer.nodeType === Node.TEXT_NODE
        && range.startContainer === range.endContainer
        && range.startContainer === range.commonAncestorContainer
        && range.startOffset === 0
        && range.endOffset === range.commonAncestorContainer.nodeValue.length);
};

/**
 * _isOrphanListItem
 * check if range have orphan list
 * @param {Range} range range of selection
 * @return {boolean} result
 */
WwClipboardManager.prototype._isOrphanListItem = function(range) {
    return (range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
        && (range.commonAncestorContainer.tagName === 'UL' || range.commonAncestorContainer.tagName === 'OL'));
};

/**
 * copyWithTextarea
 * copy clipboard using textarea for IEs
 * @param {Range} range range of selection
 */
WwClipboardManager.prototype.copyWithTextarea = function(range) {
    var self = this,
        textarea = $('<textarea />');

    this.$hiddenArea.append(textarea);

    this._latestTextareaContent = this._getContentFromRange(range);
    textarea.val(this._latestTextareaContent);

    textarea.select();

    setTimeout(function() {
        //카피가 끝나면 텍스트 에리어 제거
        textarea.remove();
        //여기서 셀렉션도 복구
        //파폭에선 focus를 다시이동 해줘야함
        self.wwe.getEditor().focus();
        self.wwe.getEditor().setSelection(range);
    }, 0);
};

/**
 * makeClipboardData
 * make clipboard data with range
 * @param {Range} range range of selection
 * @param {ClipboardEvent} clipboardEvent current clipboardEvent
 */
WwClipboardManager.prototype.makeClipboardData = function(range, clipboardEvent) {
    clipboardEvent.clipboardData.setData('text/plain', this._getContentFromRange(range));
};

module.exports = WwClipboardManager;
