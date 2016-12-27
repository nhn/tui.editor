/**
 * @fileoverview Implements tableExtension.
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

import extManager from '../../extManager';
import createMergedTable from './mergedTableCreator';

extManager.defineExtension('tableExtension', editor => {
    const eventManager = editor.eventManager;

    eventManager.listen('convertorAfterMarkdownToHtmlConverted', html => {
        const $tempDiv = $(`<div>${ html }</div>`);
        const $tables = $tempDiv.find('table');

        if ($tables.length) { 
            $tables.get().forEach(tableElement => {
                const mergedTableElement = createMergedTable(tableElement);

                $(tableElement).replaceWith(mergedTableElement);
            });
            html = $tempDiv.html();
        }

        return html;
    });
});

