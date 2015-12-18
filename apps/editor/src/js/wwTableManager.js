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

WwTableManager.prototype._init = function() {
    this._initKeyHandler();
    this._initEvent();
};

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

WwTableManager.prototype._isInTable = function(range) {
    var target;

    if (range.collapsed) {
        target = range.startContainer;
    } else {
        target = range.commonAncestorContainer;
    }

    return !!$(target).closest('table').length;
};

WwTableManager.prototype._isBeforeTable = function(range) {
    return domUtils.getNodeName(domUtils.getChildNodeAt(range.startContainer, range.startOffset)) === 'TABLE';
};

WwTableManager.prototype._isAfterTable = function(range) {
    var prevElem = domUtils.getPrevOffsetNodeUntil(range.startContainer, range.startOffset);
    return domUtils.getNodeName(prevElem) === 'TABLE' && domUtils.getNodeName(range.commonAncestorContainer) === 'BODY';
};

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

WwTableManager.prototype._unwrapBlockInTable = function() {
    this.wwe.get$Body().find('td div, th div').each(function(index, node) {
        $(node).children().unwrap();
    });
};

WwTableManager.prototype._removeTableOnBackspace = function(range) {
    var table = domUtils.getPrevOffsetNodeUntil(range.startContainer, range.startOffset);

    this.wwe.getEditor()._recordUndoState();

    this.wwe.insertSelectionMarker(range);
    $(table).remove();
    this.wwe.restoreSelectionMarker();
};

module.exports = WwTableManager;
