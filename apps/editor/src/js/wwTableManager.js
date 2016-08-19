/**
 * @fileoverview Implements wysiwyg table manager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Lab/NHN Ent.
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Lab/NHN Ent.
 */


var domUtils = require('./domUtils');
var isIE10 = tui.util.browser.msie && tui.util.browser.version === 10;
var TABLE_COMPLETION_DELAY = 10;
var SET_SELECTION_DELAY = 50;
var TABLE_CLASS_PREFIX = 'te-content-table-';

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
    this.tableID = 0;
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
        self.wwe.defer(function() {
            self._completeTableIfNeed();
        }, TABLE_COMPLETION_DELAY);
        self.wwe.getManager('tableSelection').removeClassAttrbuteFromAllCellsIfNeed();
        self._insertDefaultBlockBetweenTable();
    });

    this.eventManager.listen('wysiwygSetValueAfter', function() {
        self._unwrapBlockInTable();
        self._insertDefaultBlockBetweenTable();
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
        self.wwe.defer(function() {
            self._completeTableIfNeed();
        }, TABLE_COMPLETION_DELAY);
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
    var selectionManager = this.wwe.getManager('tableSelection');

    this.wwe.addKeyEventHandler(function(ev, range, keymap) {
        var isRangeInTable = self.isInTable(range);

        if (isRangeInTable && !self._isSingleModifierKey(keymap)) {
            self._recordUndoStateIfNeed(range);
            self._removeContentsAndChangeSelectionIfNeed(range, keymap, ev);
        } else if (!isRangeInTable && self._lastCellNode) {
            self._recordUndoStateAndResetCellNode(range);
        }

        if (!self._isModifierKeyPushed(ev)) {
            self.wwe.getEditor().modifyDocument(function() {
                selectionManager.removeClassAttrbuteFromAllCellsIfNeed();
            });
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

    this.wwe.addKeyEventHandler('BACK_SPACE', function(ev, range, keymap) {
        return self._handleBackspaceAndDeleteKeyEvent(ev, range, keymap);
    });
    this.wwe.addKeyEventHandler('DELETE', function(ev, range, keymap) {
        return self._handleBackspaceAndDeleteKeyEvent(ev, range, keymap);
    });
    this.wwe.addKeyEventHandler('TAB', function() {
        return self._moveCursorTo('next', 'cell');
    });

    this.wwe.addKeyEventHandler('SHIFT+TAB', function(ev) {
        return self._moveCursorTo('previous', 'cell', ev);
    });

    this._bindKeyEventForTableCopyAndCut();
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
 * Handle backspace and delete key event
 * @param {object} ev Event object
 * @param {Range} range Range Object
 * @param {string} keymap keymap
 * @returns {boolean|null}
 * @private
 */
WwTableManager.prototype._handleBackspaceAndDeleteKeyEvent = function(ev, range, keymap) {
    var isBackspace = keymap === 'BACK_SPACE';
    var isTextOrElementDelete = range.commonAncestorContainer.nodeType !== 3
        && range.commonAncestorContainer !== this.wwe.get$Body()[0];
    var isNeedNext;

    if (range.collapsed) {
        if (this.isInTable(range)) {
            if (isBackspace) {
                this._tableHandlerOnBackspace(range, ev);
            } else {
                this._tableHandlerOnDelete(range, ev);
            }

            this._removeContentsAndChangeSelectionIfNeed(range, keymap, ev);
            isNeedNext = false;
        } else if ((isBackspace && this._isBeforeTable(range))
            || (!isBackspace && this._isAfterTable(range))
        ) {
            ev.preventDefault();
            this._removeTableOnBackspace(range);
            isNeedNext = false;
        }
    } else if (this.isInTable(range)) {
        if (isTextOrElementDelete) {
            ev.preventDefault();
            this._removeContentsAndChangeSelectionIfNeed(range, keymap, ev);
            isNeedNext = false;
        }
    }

    return isNeedNext;
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
 * Return whether delete non text or not
 * @param {Range} range Range object
 * @returns {boolean}
 */
WwTableManager.prototype.isNonTextDeleting = function(range) {
    var currentElement = range.startContainer;
    var nextNode = currentElement.nextSibling;
    var nextNodeName = domUtils.getNodeName(nextNode);
    var currentNodeName = domUtils.getNodeName(currentElement);

    var isCellDeleting = currentNodeName === nextNodeName && currentNodeName !== 'TEXT';
    var isEndOfText = (!nextNode || (nextNodeName === 'BR' && nextNode.parentNode.lastChild === nextNode))
        && (domUtils.isTextNode(currentElement) && range.startOffset === currentElement.nodeValue.length);
    var isLastCellOfRow = !isEndOfText
        && $(currentElement).parents('tr').children().last()[0] === currentElement
        && (currentNodeName === 'TD' || currentNodeName === 'TH');

    return isCellDeleting || isEndOfText || isLastCellOfRow;
};
/**
 * _tableHandlerOnDelete
 * Delete handler in table
 * @param {Range} range range
 * @param {Event} event event
 * @memberOf WwTableManager
 * @private
 */
WwTableManager.prototype._tableHandlerOnDelete = function(range, event) {
    var needPreventDefault = this.isNonTextDeleting(range);

    if (needPreventDefault) {
        event.preventDefault();
        range.startContainer.normalize();
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

    if (domUtils.getNodeName(tdOrTh.lastChild) !== 'BR'
        && domUtils.getNodeName(tdOrTh.lastChild) !== 'DIV'
    ) {
        $(tdOrTh).append($('<br />')[0]);
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
    this.wwe.get$Body().find('td div,th div,tr>br').each(function(index, node) {
        if (node.nodeName === 'BR') {
            $(node).remove();
        } else {
            $(node).children().unwrap();
        }
    });
};

/**
 * Insert default block between table element
 * @private
 */
WwTableManager.prototype._insertDefaultBlockBetweenTable = function() {
    this.wwe.get$Body().find('table').each(function(index, node) {
        if (node.nextElementSibling
            && node.nextElementSibling.nodeName === 'TABLE'
        ) {
            $('<div><br /></div>').insertAfter(node);
        }
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
    var table = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset);

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
    this.resetLastCellNode();
};

/**
 * Paste table data into table element
 * @param {DocumentFragment} fragment Fragment of table element within
 * @private
 */
WwTableManager.prototype._pasteDataIntoTable = function(fragment) {
    var range = this.wwe.getEditor().getSelection();
    var tableData = this._getTableDataFromTable(fragment);
    var startContainer = range.startContainer;
    var parentNode = startContainer.parentNode;
    var isTextInTableCell = (parentNode.tagName === 'TD' || parentNode.tagName === 'TH');
    var isTableCell = (startContainer.tagName === 'TD' || startContainer.tagName === 'TH');
    var isTextNode = startContainer.nodeType === 3;
    var brString = isIE10 ? '' : '<br />';
    var anchorElement, td, tr, tdContent;

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
            tdContent = tr.shift();

            if (tdContent.length) {
                td.textContent = tdContent;
            } else {
                td.innerHTML = brString;
            }

            td = domUtils.getTableCellByDirection(td, 'next');
        }

        td = domUtils.getSiblingRowCellByDirection(anchorElement, 'next', false);
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

        if (trData.length) {
            tableData.push(trData);
        }
    });

    return tableData;
};

/**
 * Remove selected table contents
 * @param {jQuery} selectedCells Selected cells wrapped by jQuery
 * @private
 */
WwTableManager.prototype._removeTableContents = function(selectedCells) {
    this.wwe.getEditor().saveUndoState();

    selectedCells.each(function(i, cell) {
        var brHTMLString = isIE10 ? '' : '<br />';
        $(cell).html(brHTMLString);
    });
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
    var $wrapperTable = $('<table></table>');
    var table;

    if (!danglingTbody.length && danglingThead.length) {
        $wrapperTable.append(danglingThead[0]);
        $wrapperTable.append('<tbody><tr></tr></tbody>');
        table = $wrapperTable[0];
    } else if (danglingTbody.length && !danglingThead.length) {
        $wrapperTable.append('<thead><tr></tr></thead>');
        $wrapperTable.append(danglingTbody[0]);
        table = $wrapperTable[0];
    } else if (danglingTbody.length && danglingThead.length) {
        $wrapperTable.append(danglingThead[0]);
        $wrapperTable.append(danglingTbody[0]);
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
    if (this._isTableOrSubTableElement(node.nodeName)) {
        this._expandTableIfNeed(pasteData.fragment);
        this._pasteDataIntoTable(pasteData.fragment);
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
 * @private
 */
WwTableManager.prototype._isTableOrSubTableElement = function(pastingNodeName) {
    return (pastingNodeName === 'TABLE' || pastingNodeName === 'TBODY'
        || pastingNodeName === 'THEAD' || pastingNodeName === 'TR' || pastingNodeName === 'TD');
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
    var brHTMLString = '<br />';
    var cellString = '<' + tagName + '>' + brHTMLString + '</' + tagName + '>';
    for (i = 0; i < amount; i += 1) {
        tdString = tdString + cellString;
    }

    return tdString;
}

/**
 * Stuff table cells into incomplete rows
 * @param {jQuery} $trs jQuery wrapped TRs
 * @param {number} maximumCellLength maximum cell length of table
 * @private
 */
WwTableManager.prototype._stuffTableCellsIntoIncompleteRow = function($trs, maximumCellLength) {
    $trs.each(function(rowIndex, row) {
        var $row = $(row);
        var tableCells = $row.find('th,td');
        var cellLength = tableCells.length;
        var parentNodeName = domUtils.getNodeName($row.parent()[0]);
        var cellTagName = parentNodeName === 'THEAD' ? 'th' : 'td';

        for (; cellLength < maximumCellLength; cellLength += 1) {
            $row.append($(tableCellGenerator(1, cellTagName))[0]);
        }
    });
};

/**
 * Prepare to table cell stuffing
 * @param {jQuery} $trs jQuery wrapped TRs
 * @returns {{maximumCellLength: *, needTableCellStuffingAid: boolean}}
 * @private
 */
WwTableManager.prototype._prepareToTableCellStuffing = function($trs) {
    var maximumCellLength = $trs.eq(0).find('th,td').length;
    var needTableCellStuffingAid = false;

    $trs.each(function(i, row) {
        var cellCount = $(row).find('th,td').length;

        if (maximumCellLength !== cellCount) {
            needTableCellStuffingAid = true;

            if (maximumCellLength < cellCount) {
                maximumCellLength = cellCount;
            }
        }
    });

    return {
        maximumCellLength: maximumCellLength,
        needTableCellStuffingAid: needTableCellStuffingAid
    };
};

/**
 * Add TBODY or THEAD if need
 * @param {jQuery} table Table element
 * @private
 */
WwTableManager.prototype._addTbodyOrTheadIfNeed = function(table) {
    var isTheadNotExists = !table.find('thead').length;
    var isTbodyNotExists = !table.find('tbody').length;
    var absentNode;

    if (isTheadNotExists) {
        absentNode = $('<thead><tr></tr></thead>')[0];
        table.prepend(absentNode);
    } else if (isTbodyNotExists) {
        absentNode = $('<tbody><tr></tr></tbody>')[0];
        table.append(absentNode);
    }
};

/**
 * Append table cells
 * @param {HTMLElement} node Table element
 * @private
 */
WwTableManager.prototype._tableCellAppendAidForTableElement = function(node) {
    var table = $(node);
    var needTableCellStuffingAid, tableAidInformation, trs, maximumCellLength;

    this._addTbodyOrTheadIfNeed(table);
    this._addTrIntoContainerIfNeed(table);

    trs = table.find('tr');
    tableAidInformation = this._prepareToTableCellStuffing(trs);
    maximumCellLength = tableAidInformation.maximumCellLength;
    needTableCellStuffingAid = tableAidInformation.needTableCellStuffingAid;

    if (needTableCellStuffingAid) {
        this._stuffTableCellsIntoIncompleteRow(trs, maximumCellLength);
    }
};

/**
 * Generate THEAD and append TDs with same amount of given TBODY
 * @param {HTMLElement} node TR element
 * @returns {{thead: HTMLElement, tbody: HTMLElement}}
 * @private
 */
WwTableManager.prototype._generateTheadAndTbodyFromTbody = function(node) {
    var tr = $('<tr></tr>');
    var thead = $('<thead></thead>');

    tr.append(tableCellGenerator($(node).find('tr').eq(0).find('td').length, 'th'));
    thead.append(tr);

    return {
        thead: thead[0],
        tbody: node
    };
};

/**
 * Generate TBODY and append TDs with same amount of given THEAD
 * @param {HTMLElement} node TR element
 * @returns {{thead: HTMLElement, tbody: HTMLElement}}
 * @private
 */
WwTableManager.prototype._generateTheadAndTbodyFromThead = function(node) {
    var tr = $('<tr></tr>');
    var tbody = $('<tbody></tbody>');

    tr.append(tableCellGenerator($(node).find('th').length, 'td'));
    tbody.append(tr);

    return {
        thead: node,
        tbody: tbody[0]
    };
};

/**
 * Generate THEAD and TBODY and append given TR within
 * @param {HTMLElement} node TR element
 * @returns {{thead: HTMLElement, tbody: HTMLElement}}
 * @private
 */
WwTableManager.prototype._generateTheadAndTbodyFromTr = function(node) {
    var $node = $(node);
    var thead = $('<thead></thead>');
    var tbody = $('<tbody></tbody>');
    var theadRow, tbodyRow;

    if ($node.children()[0].tagName === 'TH') {
        theadRow = node;
        tbodyRow = $('<tr>' + tableCellGenerator($node.find('th').length, 'td') + '</tr>')[0];
    } else {
        theadRow = $('<tr>' + tableCellGenerator($node.find('td').length, 'th') + '</tr>')[0];
        tbodyRow = node;
    }

    thead.append(theadRow);
    tbody.append(tbodyRow);

    return {
        thead: thead[0],
        tbody: tbody[0]
    };
};

/**
 * Complete passed table
 * @param {HTMLElement} node Table inner element
 * @private
 */
WwTableManager.prototype._completeIncompleteTable = function(node) {
    var nodeName = node.tagName;
    var table, completedTableContents;

    if (nodeName === 'TABLE') {
        table = node;
    } else {
        table = $('<table></table>');
        table.insertAfter(node);

        if (nodeName === 'TBODY') {
            completedTableContents = this._generateTheadAndTbodyFromTbody(node);
        } else if (nodeName === 'THEAD') {
            completedTableContents = this._generateTheadAndTbodyFromThead(node);
        } else if (nodeName === 'TR') {
            completedTableContents = this._generateTheadAndTbodyFromTr(node);
        }
        table.append(completedTableContents.thead);
        table.append(completedTableContents.tbody);
    }
    this._tableCellAppendAidForTableElement(table);
};

/**
 * Whole editor body searching incomplete table completion
 * @private
 */
WwTableManager.prototype._completeTableIfNeed = function() {
    var $body = this.wwe.getEditor().get$Body();
    var self = this;

    $body.children().each(function(index, node) {
        var $node = $(node);

        if (!self._isTableOrSubTableElement(node.nodeName)) {
            return;
        } else if (node.nodeName === 'TABLE'
            && $node.find('thead').length === 0
            && $node.find('tbody').length === 0
        ) {
            $node.remove();
        }

        self._completeIncompleteTable(node);
    });
};

/**
 * Reset _lastCellNode to null
 * @memberOf WwTableManager
 */
WwTableManager.prototype.resetLastCellNode = function() {
    this._lastCellNode = null;
};
/**
 * Set _lastCellNode to given node
 * @param {HTMLElement} node Table cell
 * @memberOf WwTableManager
 */
WwTableManager.prototype.setLastCellNode = function(node) {
    this._lastCellNode = node;
};

/**
 * Return whether only modifier key pressed or not
 * @param {string} keymap Pressed keymap string
 * @returns {boolean}
 * @private
 */
WwTableManager.prototype._isSingleModifierKey = function(keymap) {
    return ((keymap === 'META') && (keymap === 'SHIFT') && (keymap === 'ALT') && (keymap === 'CONTROL'));
};

/**
 * Return whether modifier keys pressed or not
 * @param {object} ev keyboard event object
 * @returns {boolean}
 * @private
 */
WwTableManager.prototype._isModifierKeyPushed = function(ev) {
    return (ev.metaKey || ev.ctrlKey || ev.altKey || ev.shiftKey);
};

/**
 * Add one row into empty TBODY
 * @param {jQuery} $table Currently processing table
 * @private
 */
WwTableManager.prototype._addTrIntoContainerIfNeed = function($table) {
    var $trContainers = $table.children();

    $trContainers.each(function(i, container) {
        var hasNoRows = $(container).find('tr').length === 0;

        if (hasNoRows) {
            $(container).append($('<tr></tr>')[0]);
        }
    });
};

WwTableManager.prototype._expandTableIfNeed = function(fragment) {
    var range = this.wwe.getEditor().getSelection().cloneRange();
    var $table = $(range.startContainer).parents('table');
    var difference = this._getColumnAndRowDifference(fragment, range);

    if (difference.column < 0) {
        this._appendCellForAllRow($table, difference.column);
    }

    if (difference.row < 0) {
        this._appendRow($table, difference.row);
    }
};

WwTableManager.prototype._getColumnAndRowDifference = function(fragment, range) {
    var tableData = this._getTableDataFromTable(fragment);
    var rowLength = tableData.length;
    var columnLength = tableData[0].length;
    var $currentCell = $(range.startContainer).closest('th,td');
    var $currentRow = $currentCell.parent();
    var currentColumnIndex = domUtils.getNodeOffsetOfParent($currentCell[0]);
    var currentRowIndex = domUtils.getNodeOffsetOfParent($currentCell[0].parentNode);
    var $table = $currentRow.parents('table');
    var tableColumnLength = $table.find('tr').eq(0).children().length;
    var tableRowLength = $table.find('tr').length;
    var isInTbody = $currentRow.parents('tbody').length;

    if (isInTbody) {
        currentRowIndex += 1;
    }

    return {
        row: tableRowLength - (currentRowIndex + rowLength),
        column: tableColumnLength - (currentColumnIndex + columnLength)
    };
};

WwTableManager.prototype._appendCellForAllRow = function($table, columnDifference) {
    var brString = isIE10 ? '' : '<br />';

    $table.find('tr').each(function(i, row) {
        var index = columnDifference;
        var tagName;

        for (; index < 0; index += 1) {
            if (i === 0) {
                tagName = 'th';
            } else {
                tagName = 'td';
            }
            $(row).append($('<' + tagName + '>' + brString + '</' + tagName + '>')[0]);
        }
    });
};

WwTableManager.prototype._appendRow = function($table, rowDifference) {
    var newRow = $table.find('tr').last().clone();
    var brHTMLSting = isIE10 ? '' : '<br />';

    newRow.find('td').html(brHTMLSting);

    for (; rowDifference < 0; rowDifference += 1) {
        $table.find('tbody').append(newRow.clone()[0]);
    }
};

/**
 * Get sibling textNode by given direction
 * @param {HTMLElement} currentTextNode Current text node
 * @param {boolean} isNext Boolean value whether direction equals 'next'
 * @returns {boolean|null}
 * @private
 */
WwTableManager.prototype._getSiblingTextNodeByDirection = function(currentTextNode, isNext) {
    var isPreviousLineExist = currentTextNode.previousSibling
        && currentTextNode.previousSibling.nodeName === 'BR'
        && currentTextNode.previousSibling.previousSibling
        && currentTextNode.previousSibling.previousSibling.nodeType === 3;
    var isNextLineExist = currentTextNode.nextSibling
        && currentTextNode.nextSibling.nodeName === 'BR'
        && currentTextNode.nextSibling.nextSibling
        && currentTextNode.nextSibling.nextSibling.nodeType === 3;
    var target;

    if (isNext && isNextLineExist) {
        target = currentTextNode.nextSibling.nextSibling;
    } else if (!isNext && isPreviousLineExist) {
        target = currentTextNode.previousSibling.previousSibling;
    }

    return target;
};

/**
 * Change selection to sibling cell
 * @param {HTMLElement} currentCell current TD or TH
 * @param {Range} range Range object
 * @param {string} direction 'next' or 'previous'
 * @param {string} scale 'row' or 'cell'
 */
WwTableManager.prototype._changeSelectionToTargetCell = function(currentCell, range, direction, scale) {
    var startContainer = range.startContainer;
    var isNext = direction === 'next';
    var isRow = scale === 'row';
    var target, textOffset;

    if (isRow) {
        if (domUtils.isTextNode(startContainer)) {
            target = this._getSiblingTextNodeByDirection(startContainer, isNext);
            if (target) {
                textOffset = target.length < range.startOffset ? target.length : range.startOffset;

                range.setStart(target, textOffset);
                range.collapse(true);

                return;
            }
        }

        target = domUtils.getSiblingRowCellByDirection(currentCell, direction, false);
    } else {
        target = domUtils.getTableCellByDirection(currentCell, direction);
        if (!target) {
            target = domUtils.getSiblingRowCellByDirection(currentCell, direction, true);
        }
    }

    if (target) {
        range.setStart(target, 0);
        range.collapse(true);
    } else {
        target = $(currentCell).parents('table')[0];
        if (isNext) {
            range.setStart(target.nextElementSibling, 0);
        } else if (target.previousElementSibling && target.previousElementSibling.nodeName !== 'TABLE') {
            range.setStart(target.previousElementSibling, 1);
        } else {
            range.setStartBefore(target);
        }

        range.collapse(true);
    }
};

/**
 * Create selection by selected cells and collapse that selection to end
 * @private
 */
WwTableManager.prototype._createRangeBySelectedCells = function() {
    var sq = this.wwe.getEditor();
    var range = sq.getSelection().cloneRange();
    var selectedCells = this.wwe.getManager('tableSelection').getSelectedCells();

    if (selectedCells.length && this.isInTable(range)) {
        range.setStart(selectedCells.first()[0], 0);
        range.setEnd(selectedCells.last()[0], 1);
        sq.setSelection(range);
    }
};

/**
 * Create selection by selected cells and collapse that selection to end
 * @private
 */
WwTableManager.prototype._collapseRangeToEndContainer = function() {
    var sq = this.wwe.getEditor();
    var range = sq.getSelection().cloneRange();
    var selectedCells = this.wwe.getManager('tableSelection').getSelectedCells();

    if (selectedCells.length && this.isInTable(range)) {
        this.wwe.defer(function() {
            range.collapse(false);
            sq.setSelection(range);
        }, SET_SELECTION_DELAY);
    }
};

/**
 * Move cursor to given direction by interval formatter
 * @param {string} direction 'next' or 'previous'
 * @param {string} interval 'row' or 'cell'
 * @param {object} [ev] Event object
 * @returns {boolean | null}
 * @private
 */
WwTableManager.prototype._moveCursorTo = function(direction, interval, ev) {
    var sq = this.wwe.getEditor();
    var range = sq.getSelection().cloneRange();
    var currentCell = $(range.startContainer).closest('td,th')[0];
    var isNeedNext;

    if (range.collapsed) {
        if (this.isInTable(range) && currentCell) {
            if (direction === 'previous' || interval === 'row' && !tui.util.isUndefined(ev)) {
                ev.preventDefault();
            }

            this._changeSelectionToTargetCell(currentCell, range, direction, interval);
            sq.setSelection(range);

            isNeedNext = false;
        }
    }

    return isNeedNext;
};

/**
 * Bind pre process for table copy and cut key event
 * @private
 */
WwTableManager.prototype._bindKeyEventForTableCopyAndCut = function() {
    var self = this;
    var isMac = /Mac OS X/.test(navigator.userAgent);
    var commandKey = isMac ? 'metaKey' : 'ctrlKey';

    this.wwe.getEditor().addEventListener('keydown', function(event) {
        if (event[commandKey]) {
            self._createRangeBySelectedCells();
        }
    });

    this.wwe.getEditor().addEventListener('keyup', function() {
        self._collapseRangeToEndContainer();
    });
};

/**
 * Remove contents and change selection if need
 * @param {Range} range Range object
 * @param {string} keymap keymap
 * @param {object} ev Event object
 * @private
 */
WwTableManager.prototype._removeContentsAndChangeSelectionIfNeed = function(range, keymap, ev) {
    var isTextInput = keymap.length <= 1;
    var isDeleteOperation = (keymap === 'BACK_SPACE' || keymap === 'DELETE');
    var selectedCells = this.wwe.getManager('tableSelection').getSelectedCells();
    var firstSelectedCell = selectedCells.first()[0];

    if ((isTextInput || isDeleteOperation) && !this._isModifierKeyPushed(ev) && selectedCells.length) {
        if (isDeleteOperation) {
            this._recordUndoStateIfNeed(range);
        }
        this._removeTableContents(selectedCells);

        this._lastCellNode = firstSelectedCell;

        range.setStart(firstSelectedCell, 0);
        range.collapse(true);
        this.wwe.getEditor().setSelection(range);
    }
};

/**
 * Return new table ID class name string
 * @returns {string}
 * @memberOf WwTableManager
 * @api
 */
WwTableManager.prototype.getTableIDClassName = function() {
    var tableClassName = TABLE_CLASS_PREFIX + this.tableID;
    this.tableID += 1;

    return tableClassName;
};

module.exports = WwTableManager;
