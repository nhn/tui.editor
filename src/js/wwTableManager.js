/**
 * @fileoverview Implements wysiwyg table manager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var domUtils = require('./domUtils');

/**
 * WwTableManager
 * @exports WwTableManager
 * @augments
 * @constructor
 * @class
 * @param {WysiwygEditor} wwe WysiwygEditor instance
 */
function WwTableManager(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    this._init();
}

/**
 * _init
 * Init
 */
WwTableManager.prototype._init = function() {
    this._initKeyHandler();
    this._initEvent();
};

/**
 * _initEvent
 * Initialize eventmanager event
 */
WwTableManager.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('wysiwygRangeChangeAfter', function() {
        self._unwrapBlockInTable();
    });

    this.eventManager.listen('wysiwygSetValueAfter', function() {
        self._unwrapBlockInTable();
    });

    this.eventManager.listen('wysiwygProcessHTMLText', function(html) {
        //remove last br in td or th
        return html.replace(/\<br \/\>(\<\/td\>|\<\/th\>)/g, '$1');
    });
};

/**
 * _initKeyHandler
 * Initialize key event handler
 */
WwTableManager.prototype._initKeyHandler = function() {
    var self = this;

    this.wwe.addKeyEventHandler(function(event, range) {
        var isHandled;

        //enter
        if (event.keyCode === 13) {
            if (self._isAfterTable(range)) {
                event.preventDefault();
                range.setStart(range.startContainer, range.startOffset - 1);
                self.wwe.breakToNewDefaultBlock(range);
                isHandled = true;
            } else if (self._isBeforeTable(range)) {
                event.preventDefault();
                self.wwe.breakToNewDefaultBlock(range, 'before');
                isHandled = true;
            } else if (self._isInTable(range)) {
                self._appendBrIfTdOrThNotHaveAsLastChild(range);
                isHandled = true;
            }
        //backspace
        } else if (event.keyCode === 8) {
            if (range.collapsed) {
                if (self._isInTable(range)) {
                    self._tableHandlerOnBackspace(range, event);
                    isHandled = true;
                } else if (self._isAfterTable(range)) {
                    event.preventDefault();
                    self._removeTableOnBackspace(range);
                    isHandled = true;
                }
            }
        }

        return isHandled;
    });
};

/**
 * _isInTable
 * Check whether passed range is in table or not
 * @param {Range} range range
 * @returns {boolean} result
 */
WwTableManager.prototype._isInTable = function(range) {
    var target;

    if (range.collapsed) {
        target = range.startContainer;
    } else {
        target = range.commonAncestorContainer;
    }

    return !!$(target).closest('table').length;
};

/**
 * _isBeforeTable
 * Check whether passed range is right before table or not
 * @param {Range} range range
 * @returns {boolean} result
 */
WwTableManager.prototype._isBeforeTable = function(range) {
    return domUtils.getNodeName(domUtils.getChildNodeAt(range.startContainer, range.startOffset)) === 'TABLE';
};

/**
 * _isAfterTable
 * Check whether passed range is right after table or not
 * @param {Range} range range
 * @returns {boolean} result
 */
WwTableManager.prototype._isAfterTable = function(range) {
    var prevElem = domUtils.getPrevOffsetNodeUntil(range.startContainer, range.startOffset);
    return domUtils.getNodeName(prevElem) === 'TABLE' && domUtils.getNodeName(range.commonAncestorContainer) === 'BODY';
};

/**
 * _tableHandlerOnBackspace
 * Backspace handler in table
 * @param {Range} range range
 * @param {Event} event event
 */
WwTableManager.prototype._tableHandlerOnBackspace = function(range, event) {
    var prevNode = domUtils.getPrevOffsetNodeUntil(range.startContainer, range.startOffset, 'TR'),
        prevNodeName = domUtils.getNodeName(prevNode);

    if (!prevNode || prevNodeName === 'TD' || prevNodeName === 'TH') {
        event.preventDefault();
    } else if (prevNodeName === 'BR' && prevNode.parentNode.childNodes.length !== 1) {
        event.preventDefault();
        $(prevNode).remove();
    }
};

/**
 * _appendBrIfTdOrThNotHaveAsLastChild
 * Append br if td or th doesn't have br as last child
 * @param {Range} range range
 */
WwTableManager.prototype._appendBrIfTdOrThNotHaveAsLastChild = function(range) {
    var paths, tdOrTh, startContainerNodeName;

    startContainerNodeName = domUtils.getNodeName(range.startContainer);

    if (startContainerNodeName === 'TD' || startContainerNodeName === 'TH') {
        tdOrTh = range.startContainer;
    } else {
        paths = $(range.startContainer).parentsUntil('tr');
        tdOrTh = paths[paths.length - 1];
    }

    if (domUtils.getNodeName(tdOrTh.lastChild) !== 'BR' && domUtils.getNodeName(tdOrTh.lastChild) !== 'DIV') {
        $(tdOrTh).append('<br>');
    }
};

/**
 * _unwrapBlockInTable
 * Unwrap default block tag in table
 * 스콰이어의 기본 액션으로 인해 비정상적인 동작을 하게되어 setValue이후 테이블 안에 디폴트 블럭은 제거한다.
 */
WwTableManager.prototype._unwrapBlockInTable = function() {
    this.wwe.get$Body().find('td div, th div').each(function(index, node) {
        $(node).children().unwrap();
    });
};

/**
 * _removeTableOnBackspace
 * Remove table on backspace
 * @param {Range} range range
 */
WwTableManager.prototype._removeTableOnBackspace = function(range) {
    var table = domUtils.getPrevOffsetNodeUntil(range.startContainer, range.startOffset);

    this.wwe.getEditor()._recordUndoState();

    this.wwe.insertSelectionMarker(range);
    $(table).remove();
    this.wwe.restoreSelectionMarker();
};

module.exports = WwTableManager;
