/**
 * @fileoverview Implements tableExtension.
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

import extManager from '../../extManager';
import createMergedTable from './mergedTableCreator';
import prepareTableUnmerge from './tableUnmergePreparer';
import toMarkRenderer from './toMarkRenderer';
import wwAddRow from './mergedTableAddRow';
import wwAddCol from './mergedTableAddCol';
import wwRemoveRow from './mergedTableRemoveRow';
import wwRemoveCol from './mergedTableRemoveCol';
import wwAlignCol from './mergedTableAlignCol';

extManager.defineExtension('tableExtension', editor => {
    const eventManager = editor.eventManager;

    editor.toMarkOptions = editor.toMarkOptions || {};
    editor.toMarkOptions.renderer = toMarkRenderer;

    eventManager.listen('convertorAfterMarkdownToHtmlConverted', html => _changeHtml(html, createMergedTable));
    eventManager.listen('convertorBeforeHtmlToMarkdownConverted', html => _changeHtml(html, prepareTableUnmerge));
    eventManager.listen('addCommandBefore', _snatchWysiwygCommand);
});

/**
 * Change html by onChangeTable function.
 * @param {string} html - original html
 * @param {function} onChangeTable - function for changing html
 * @returns {string}
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
