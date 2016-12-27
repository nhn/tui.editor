/**
 * @fileoverview Implements tableUnmergePreparer.
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

/**
 * Copy attribute for merge to value.
 * @param {HTMLElement} cell - td or th
 */
export function _copyMergeAttrToValue(cell) {
    const $cell = $(cell);
    const colspan = $cell.attr('colspan') || '';
    const rowspan = $cell.attr('rowspan') || '';
    let value = $cell.html();

    if (colspan) {
        value = `@cols=${colspan}:${value}`;
    }

    if (rowspan) {
        value = `@rows=${rowspan}:${value}`;
    }

    if (value) {
        $cell.html(value);
    }
}

/**
 * Prepare table unmerge.
 * @param {HTMLElement} tableElement - table element
 * @returns {HTMLElement}
 */
export default function prepareTableUnmerge(tableElement) {
    $(tableElement).find('td, th').get().forEach(_copyMergeAttrToValue);

    return tableElement;
}
