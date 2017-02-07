/**
 * @fileoverview Implements tableExtension.
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

import extManager from '../../extManager';
import createMergedTable from './mergedTableCreator';
import prepareTableUnmerge from './tableUnmergePreparer';
import toMarkRenderer from './toMarkRenderer';
import WwMergedTableManager from './wwMergedTableManager';
import WwMergedTableSelectionManager from './wwMergedTableSelectionManager';
import wwAddRow from './mergedTableAddRow';
import wwAddCol from './mergedTableAddCol';
import wwRemoveRow from './mergedTableRemoveRow';
import wwRemoveCol from './mergedTableRemoveCol';
import wwAlignCol from './mergedTableAlignCol';
import wwMergeCell from './mergeCell';
import wwUnergeCell from './unmergeCell';
import mergedTableUI from './mergedTableUI';

import dataHandler from './tableDataHandler';
import tableRangeHandler from './tableRangeHandler';
import tableRenderer from './tableRenderer';

require('./langs');

extManager.defineExtension('tableExtension', editor => {
    const eventManager = editor.eventManager;
    const wwComponentManager = editor.wwEditor.componentManager;
    const popupTableUtils = editor._ui.popupTableUtils;

    editor.toMarkOptions = editor.toMarkOptions || {};
    editor.toMarkOptions.renderer = toMarkRenderer;

    _addCommands(editor);
    _changeWysiwygManagers(wwComponentManager);
    _bindEvents(eventManager, wwComponentManager);

    if (editor._ui.popupTableUtils) {
        mergedTableUI.updateContextMenu(popupTableUtils, eventManager, wwComponentManager.getManager('tableSelection'));
    }
});

/**
 * Add commands.
 * @param {object} editor - editor instance
 * @private
 */
function _addCommands(editor) {
    editor.addCommand(wwMergeCell);
    editor.addCommand(wwUnergeCell);
}

/**
 * Change wysiwyg component managers.
 * @param {object} wwComponentManager - componentMananger instance
 * @private
 */
function _changeWysiwygManagers(wwComponentManager) {
    wwComponentManager.removeManager('table');
    wwComponentManager.removeManager('tableSelection');

    wwComponentManager.addManager(WwMergedTableManager);
    wwComponentManager.addManager(WwMergedTableSelectionManager);
}

/**
 * Change html by onChangeTable function.
 * @param {string} html - original html
 * @param {function} onChangeTable - function for changing html
 * @returns {string}
 * @private
 */
function _changeHtml(html, onChangeTable) {
    const $tempDiv = $(`<div>${html}</div>`);
    const $tables = $tempDiv.find('table');

    if ($tables.length) {
        $tables.get().forEach(tableElement => {
            const changedTableElement = onChangeTable(tableElement);

            $(tableElement).replaceWith(changedTableElement);
        });

        html = $tempDiv.html();
    }

    return html;
}

/**
 * Snatch wysiwyg command.
 * @param {{command: object}} commandWrapper - wysiwyg command wrapper
 * @private
 */
function _snatchWysiwygCommand(commandWrapper) {
    const command = commandWrapper.command;

    if (!command.isWWType()) {
        return;
    }

    switch (command.getName()) {
        case 'AddRow':
            commandWrapper.command = wwAddRow;
            break;
        case 'AddCol':
            commandWrapper.command = wwAddCol;
            break;
        case 'RemoveRow':
            commandWrapper.command = wwRemoveRow;
            break;
        case 'RemoveCol':
            commandWrapper.command = wwRemoveCol;
            break;
        case 'AlignCol':
            commandWrapper.command = wwAlignCol;
            break;
        default:
    }
}

/**
 * Update table html of clipboard data, if has selected cells.
 * @param {jQuery} $clipboardContainer - jQuery element
 * @param {object} wwComponentManager - wysiwyg component manager
 */
function _updateTableHtmlOfClipboardIfNeed($clipboardContainer, wwComponentManager) {
    const $selectedCells = wwComponentManager.getManager('tableSelection').getSelectedCells();

    if (!$selectedCells.length) {
        return;
    }

    const tableData = dataHandler.createTableData($($selectedCells[0]).closest('TABLE'));
    const {start: startRange, end: endRange} = tableRangeHandler.getTableSelectionRange(tableData, $selectedCells);

    let copyTableData = tableData.slice(startRange.rowIndex, endRange.rowIndex + 1);
    copyTableData = copyTableData.map(rowData => rowData.slice(startRange.colIndex, endRange.colIndex + 1));

    const cellIndexData = dataHandler.createCellIndexData(copyTableData);
    const renderData = dataHandler.createRenderData(copyTableData, cellIndexData);

    $clipboardContainer.html(tableRenderer.createTableHtml(renderData));
}

/**
 * Remove selected cells, when cut event and has selected cells.
 * @param {object} wwComponentManager - wysiwyg component manager
 */
function _removeSelectedCellsIfNeed(wwComponentManager) {
    const $selectedCells = wwComponentManager.getManager('tableSelection').getSelectedCells();

    if ($selectedCells.length) {
        $selectedCells.get().forEach(cell => ($(cell).html('')));
    }
}

/**
 * Bind events.
 * @param {object} eventManager - eventManager instance
 * @param {object} wwComponentManager - wysiwg component manager instance
 * @private
 */
function _bindEvents(eventManager, wwComponentManager) {
    eventManager.listen('convertorAfterMarkdownToHtmlConverted', html => _changeHtml(html, createMergedTable));
    eventManager.listen('convertorBeforeHtmlToMarkdownConverted', html => _changeHtml(html, prepareTableUnmerge));
    eventManager.listen('addCommandBefore', _snatchWysiwygCommand);
    eventManager.listen('copyBefore', ({$clipboardContainer}) =>
                        _updateTableHtmlOfClipboardIfNeed($clipboardContainer, wwComponentManager));
    eventManager.listen('cut', () => _removeSelectedCellsIfNeed(wwComponentManager));
}

