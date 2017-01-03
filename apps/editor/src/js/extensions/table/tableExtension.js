/**
 * @fileoverview Implements tableExtension.
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

import extManager from '../../extManager';
import createMergedTable from './mergedTableCreator';
import prepareTableUnmerge from './tableUnmergePreparer';
import toMarkRenderer from './toMarkRendererCreator';

extManager.defineExtension('tableExtension', editor => {
    const eventManager = editor.eventManager;

    editor.toMarkOptions = editor.toMarkOptions || {};
    editor.toMarkOptions.renderer = toMarkRenderer;

    eventManager.listen('convertorAfterMarkdownToHtmlConverted', html => _changeHtml(html, createMergedTable));
    eventManager.listen('convertorBeforeHtmlToMarkdownConverted', html => _changeHtml(html, prepareTableUnmerge));
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

