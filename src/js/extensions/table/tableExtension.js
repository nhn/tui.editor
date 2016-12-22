
/**
 * @fileoverview Implements tableExtension extends.
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

import extManager from '../../extManager';
import mergeTable from './tableMerge';

extManager.defineExtension('tableExtension', editor => {
    const eventManager = editor.eventManager;

    eventManager.listen('convertorAfterMarkdownToHtmlConverted', html => {
        const $tempDiv = $(`<div>${ html }</div>`);
        const $tables = $tempDiv.find('table');

        if ($tables.length) { 
            $tables.get().forEach(tableElement => {
                const mergedTableElement = mergeTable(tableElement);

                $(tableElement).replaceWith(mergedTableElement);
            });
            html = $tempDiv.html();
        }

        return html;
    });
});

