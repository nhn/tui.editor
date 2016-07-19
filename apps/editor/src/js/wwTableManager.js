/**
 * @fileoverview Implements wysiwyg table manager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var domUtils = require('./domUtils');

/**
 * WwTableManager
 * @exports WwTableManager
 * @constructor
 * @class WwTableManager
 * @param {WysiwygEditor} wwe WysiwygEditor instance
 */
function WwTableManager(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    this._lastCellNode = null;
    this._init();
}

/**
 * Name property
 * @api
 * @memberOf WwTableManager
 * @type {string}
 */
WwTableManager.prototype.name = 'table';

/**
 * _init
 * Initialize
 * @memberOf WwTableManager
 * @private
 */
WwTableManager.prototype._init = function() {
    this._initKeyHandler();
    this._initEvent();
};

/**
 * _initEvent
 * Initialize event
 * @memberOf WwTableManager
 * @private
 */
WwTableManager.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('wysiwygRangeChangeAfter', function() {
        self._unwrapBlockInTable();
        self.wwe.defer(self._completeTableIfNeed.bind(self));
    });

    this.eventManager.listen('wysiwygSetValueAfter', function() {
        self._unwrapBlockInTable();
    });

    this.eventManager.listen('wysiwygProcessHTMLText', function(html) {
        //remove last br in td or th
        return html.replace(/<br \/>(<\/td>|<\/th>)/g, '$1');
    });

    this.wwe.getEditor().addEventListener('paste', function(ev) {
        var range = self.wwe.getEditor().getSelection();
        var isNotPastingIntoTextNode = !domUtils.isTextNode(range.commonAncestorContainer);

        if (self.isInTable(range) && !range.collapsed && isNotPastingIntoTextNode) {
            ev.preventDefault();
        }
    });
};

/**
 * _initKeyHandler
 * Initialize key event handler
 * @memberOf WwTableManager
 * @private
 */
WwTableManager.prototype._initKeyHandler = function() {
    var self = this;

    this.wwe.addKeyEventHandler(function(ev, range) {
        if (self.isInTable(range)) {
            self._recordUndoStateIfNeed(range);
        } else if (self._lastCellNode) {
            self._recordUndoStateAndResetCellNode(range);
        }
    });

    this.wwe.addKeyEventHandler('ENTER', function(ev, range) {
        var isNeedNext;

        if (self._isAfterTable(range)) {
            ev.preventDefault();
            range.setStart(range.startContainer, range.startOffset - 1);
            self.wwe.breakToNewDefaultBlock(range);
            isNeedNext = false;
        } else if (self._isBeforeTable(range)) {
            ev.preventDefault();
            self.wwe.breakToNewDefaultBlock(range, 'before');
            isNeedNext = false;
        } else if (self.isInTable(range)) {
            self._appendBrIfTdOrThNotHaveAsLastChild(range);
            isNeedNext = false;
        }

        return isNeedNext;
    });

    this.wwe.addKeyEventHandler('BACK_SPACE', function(ev, range) {
        var isNeedNext;

        if (range.collapsed) {
            if (self.isInTable(range)) {
                self._tableHandlerOnBackspace(range, ev);
                isNeedNext = false;
            } else if (self._isAfterTable(range)) {
                ev.preventDefault();
                self._removeTableOnBackspace(range);
                isNeedNext = false;
            }
        } else if (self.isInTable(range)) {
            if (range.commonAncestorContainer.nodeType !== 3) {
                ev.preventDefault();
                self._removeTableContents(range);
                isNeedNext = false;
            }
        }

        return isNeedNext;
    });
};

/**
 * isInTable
 * Check whether passed range is in table or not
 * @param {Range} range range
 * @returns {boolean} result
 * @memberOf WwTableManager
 * @api
 */
WwTableManager.prototype.isInTable = function(range) {
    var target, result;

    if (range.collapsed) {
        target = range.startContainer;
        result = !!$(target).closest('table').length;
    } else {
        target = range.commonAncestorContainer;
        result = !!$(target).closest('table').length || !!$(range.cloneContents()).find('table').length;
    }

    return result;
};

/**
 * _isBeforeTable
 * Check whether passed range is right before table or not
 * @param {Range} range range
 * @returns {boolean} result
 * @memberOf WwTableManager
 * @private
 */
WwTableManager.prototype._isBeforeTable = function(range) {
    return domUtils.getNodeName(domUtils.getChildNodeByOffset(range.startContainer, range.startOffset)) === 'TABLE';
};

/**
 * _isAfterTable
 * Check whether passed range is right after table or not
 * @param {Range} range range
 * @returns {boolean} result
 * @memberOf WwTableManager
 * @private
 */
WwTableManager.prototype._isAfterTable = function(range) {
    var prevElem = domUtils.getPrevOffsetNodeUntil(range.startContainer, range.startOffset);

    return domUtils.getNodeName(prevElem) === 'TABLE'
	&& range.commonAncestorContainer === this.wwe.get$Body()[0];
};

/**
 * _tableHandlerOnBackspace
 * Backspace handler in table
 * @param {Range} range range
 * @param {Event} event event
 * @memberOf WwTableManager
 * @private
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
 * @memberOf WwTableManager
 * @private
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
 * For Squire default action making abnormal behavior, remove default blocks in Table after setValue() called
 * @memberOf WwTableManager
 * @private
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
 * @memberOf WwTableManager
 * @private
 */
WwTableManager.prototype._removeTableOnBackspace = function(range) {
    var table = domUtils.getPrevOffsetNodeUntil(range.startContainer, range.startOffset);

    this.wwe.getEditor().saveUndoState(range);

    this.wwe.insertSelectionMarker(range);
    $(table).remove();
    this.wwe.restoreSelectionMarker();
};

/**
 * _recordUndoStateIfNeed
 * record undo state if need
 * @param {Range} range range
 * @memberOf WwTableManager
 * @private
 */
WwTableManager.prototype._recordUndoStateIfNeed = function(range) {
    var currentCellNode = domUtils.getParentUntil(range.startContainer, 'TR');

    if (range.collapsed && this._lastCellNode !== currentCellNode) {
        this.wwe.getEditor().saveUndoState(range);
        this._lastCellNode = currentCellNode;
    }
};

/**
 * _recordUndoStateAndResetCellNode
 * record undo state and reset last cell node
 * @param {Range} range range
 * @memberOf WwTableManager
 * @private
 */
WwTableManager.prototype._recordUndoStateAndResetCellNode = function(range) {
    this.wwe.getEditor().saveUndoState(range);
    this._lastCellNode = null;
};

/**
 * Paste table data into table element
 * @param {DocumentFragment} fragment Fragment of table element within
 * @memberOf WwTableManager
 * @api
 */
WwTableManager.prototype.pasteDataIntoTable = function(fragment) {
    var range = this.wwe.getEditor().getSelection();
    var tableData = this._getTableDataFromTable(fragment);
    var startContainer = range.startContainer;
    var parentNode = startContainer.parentNode;
    var isTextInTableCell = parentNode.tagName === 'TD' || parentNode.tagName === 'TH';
    var isTableCell = startContainer.tagName === 'TD' || startContainer.tagName === 'TH';
    var isTextNode = startContainer.nodeType === 3;
    var anchorElement, td, tr;

    if (isTextNode && isTextInTableCell) {
        anchorElement = parentNode;
    } else if (isTableCell) {
        anchorElement = startContainer;
    } else {
        anchorElement = $(startContainer).find('th,td')[0];
    }

    td = anchorElement;

    while (tableData.length) {
        tr = tableData.shift();

        while (td && tr.length) {
            td.textContent = tr.shift();

            td = domUtils.nextTableCell(td);
        }

        td = domUtils.nextLineTableCell(anchorElement);
        anchorElement = td;
    }
};

/**
 * Get array data from table element
 * @param {DocumentFragment} fragment table element
 * @returns {Array}
 * @private
 */
WwTableManager.prototype._getTableDataFromTable = function(fragment) {
    var $fragment = $(fragment);
    var tableData = [];
    var trs = $fragment.find('tr');

    trs.each(function(i, tr) {
        var trData = [];
        var tds = $(tr).children();

        tds.each(function(index, cell) {
            trData.push(cell.textContent);
        });

        tableData.push(trData);
    });

    return tableData;
};
/**
 * Remove selected table contents
 * @param {Range} range Range object
 * @private
 */
WwTableManager.prototype._removeTableContents = function(range) {
    var anchorCell = range.startContainer;
    var cellLength = $(range.cloneContents()).find('th,td').length;
    var index = 0;
    var cell, nextCell, nextLineFirstCell;
    if (domUtils.isTextNode(anchorCell)) {
        anchorCell = anchorCell.parentNode;
    }
    cell = anchorCell;

    this.wwe.getEditor().saveUndoState();
    for (;index < cellLength; index += 1) {
        cell.innerHTML = '<br>';

        nextCell = domUtils.nextTableCell(cell);
        nextLineFirstCell = domUtils.nextLineTableCell(cell, true);

        if (nextCell) {
            cell = nextCell;
        } else if (nextLineFirstCell) {
            cell = nextLineFirstCell;
        } else {
            cell = null;
        }
    }
};

/**
 * Wrap dangling table cells with new TR
 * @param {DocumentFragment} fragment Pasting data
 * @returns {HTMLElement|null}
 */
WwTableManager.prototype.wrapDanglingTableCellsIntoTrIfNeed = function(fragment) {
    var danglingTableCells = $(fragment).children('td,th');
    var $wrapperTr, tr;

    if (danglingTableCells.length) {
        $wrapperTr = $('<tr></tr>');

        danglingTableCells.each(function(i, cell) {
            $wrapperTr.append(cell);
        });

        tr = $wrapperTr[0];
    }

    return tr;
};

/**
 * Wrap TRs with new TBODY
 * @param {DocumentFragment} fragment Pasting data
 * @returns {HTMLElement|null}
 */
WwTableManager.prototype.wrapTrsIntoTbodyIfNeed = function(fragment) {
    var danglingTrs = $(fragment).children('tr');
    var ths = danglingTrs.find('th');
    var $wrapperTableBody, tbody;

    if (ths.length) {
        ths.each(function(i, node) {
            var $node = $(node);
            var td = $('<td></td>');

            td.html($node.html());
            td.insertBefore(node);

            $node.detach();
        });
    }

    if (danglingTrs.length) {
        $wrapperTableBody = $('<tbody></tbody>');

        danglingTrs.each(function(i, tr) {
            $wrapperTableBody.append(tr);
        });

        tbody = $wrapperTableBody[0];
    }

    return tbody;
};

/**
 * Wrap THEAD followed by TBODY both into Table
 * @param {DocumentFragment} fragment Pasting data
 * @returns {HTMLElement|null}
 */
WwTableManager.prototype.wrapTheadAndTbodyIntoTableIfNeed = function(fragment) {
    var danglingThead = $(fragment).children('thead');
    var danglingTbody = $(fragment).children('tbody');
    var $wrapperTable, table;

    if (danglingTbody.length && danglingThead.length) {
        $wrapperTable = $('<table></table>');
        $wrapperTable.append(danglingThead);
        $wrapperTable.append(danglingTbody);
        table = $wrapperTable[0];
    }

    return table;
};
/**
 * Prepare to paste data on table
 * @param {object} pasteData Pasting data
 * @param {HTMLElement} node Current pasting element
 * @returns {DocumentFragment}
 * @memberOf WwTableManager
 * @api
 */
WwTableManager.prototype.prepareToPasteOnTable = function(pasteData, node) {
    var newFragment = document.createDocumentFragment();
    if (this.isTablePaste(node.nodeName)) {
        this.pasteDataIntoTable(pasteData.fragment);
        pasteData.fragment = newFragment;
    } else {
        newFragment.textContent = newFragment.textContent + pasteData.fragment.textContent;
    }

    return newFragment;
};

/**
 * Whether pasting element is table element
 * @param {string} pastingNodeName Pasting node name
 * @returns {boolean}
 * @memberOf WwTableManager
 * @api
 */
WwTableManager.prototype.isTablePaste = function(pastingNodeName) {
    return pastingNodeName === 'TABLE' || pastingNodeName === 'TBODY'
        || pastingNodeName === 'THEAD' || pastingNodeName === 'TR' || pastingNodeName === 'TD';
};

/**
 * Generate table cell HTML text
 * @param {number} amount Amount of cells
 * @param {string} tagName Tag name of cell 'td' or 'th'
 * @private
 * @returns {string}
 */
function tableCellGenerator(amount, tagName) {
    var i;
    var tdString = '';
    for (i = 0; i < amount; i += 1) {
        tdString = tdString + '<' + tagName + '> <br /> </' + tagName + '>';
    }

    return tdString;
}
/**
 * Complete passed table
 * @param {HTMLElement} node Table inner element
 * @private
 */
WwTableManager.prototype._compleIncompleteTable = function(node) {
    var table = $('<table></table>');
    var thead = $('<thead></thead>');
    var tbody = $('<tbody></tbody>');
    var tr = $('<tr></tr>');
    var $node = $(node);
    var nodeName = node.tagName;
    var theadContents, tbodyContents;

    table.insertAfter(node);

    if (nodeName === 'TBODY') {
        tr.append(tableCellGenerator($node.find('tr').eq(0).find('td').length, 'th'));
        thead.append(tr);

        tbody = node;
    } else if (nodeName === 'THEAD') {
        thead = node;

        tr.append(tableCellGenerator($node.find('th').length, 'td'));
        tbody.append(tr);
    } else if (nodeName === 'TR') {
        if ($node.children()[0].tagName === 'TH') {
            theadContents = node;
            tbodyContents = tableCellGenerator($node.find('th').length, 'td');
        } else {
            theadContents = tableCellGenerator($node.find('td').length, 'th');
            tbodyContents = node;
        }
        thead.append(theadContents);
        tbody.append(tbodyContents);
    }
    table.append(thead);
    table.append(tbody);
};

/**
 * Whole editor body searching incomplete table completion
 * @private
 */
WwTableManager.prototype._completeTableIfNeed = function() {
    var $body = this.wwe.getEditor().get$Body();
    var self = this;

    $body.children().each(function(index, node) {
        if (!self.isTablePaste(node.nodeName) || node.nodeName === 'TABLE') {
            return;
        }
        self._compleIncompleteTable(node);
    });
};
module.exports = WwTableManager;
