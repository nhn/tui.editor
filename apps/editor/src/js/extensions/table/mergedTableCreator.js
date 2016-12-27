/**
 * @fileoverview Implements mergedTableCreator.
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

/**
 * Extract properties for merge.
 * @param {string} value - value
 * @param {string} type - merge type like colspan, rowspan
 * @param {string} oppossitType - oppossit merge type
 *                                if merge type is colspan, opossit merge type is rowspan
 * @returns {[number, string]} - returns merge count and value
 * @private
 */
export function _extractPropertiesForMerge(value, type, oppossitType) {
    const regex = new RegExp(`^((?:${oppossitType}=[0-9]+:)?)${type}=([0-9]+):(.*)`);
    const regexResult = regex.exec(value);
    let mergeCount = 1;

    if (regexResult) {
        mergeCount = parseInt(regexResult[2], 10);
        value = regexResult[1] + regexResult[3];
    }

    return [mergeCount, value];
}

/**
 * Parse table cell element like td, th.
 * @param {HTMLElement} cell - table cell element like td, th
 * @returns {{
 *   nodeName: string,
 *   colspan: number,
 *   rowspan: number,
 *   value: string,
 *   align: string
 * }}
 * @private
 */
export function _parseTableCell(cell) {
    const nodeName = cell.nodeName;
    const align = cell.align || '';
    let value = cell.innerHTML.trim();
    let colspan = null;
    let rowspan = null;

    [colspan, value] = _extractPropertiesForMerge(value, '@cols', '@rows');
    [rowspan, value] = _extractPropertiesForMerge(value, '@rows', '@cols');

    return {
        nodeName,
        colspan,
        rowspan,
        value,
        align
    };
}

/**
 * Create table object from jQuery table.
 * @param {jQuery} $table - jQuery table
 * @returns {Array.<Array.<object>>}
 * @private
 */
export function _createTableObjectFrom$Table($table) {
    return $table.find('tr').get().map(tr => $(tr).find('td, th').get().map(_parseTableCell));
}

/**
 * Find index by onFind function.
 * @param {Array} arr - target array
 * @param {function} onFind - find function
 * @returns {number} 
 */
function _findIndex(arr, onFind) {
    let foundIndex = -1;

    tui.util.forEach(arr, (item, index) => {
        let nextFind = true;
        if (onFind(item, index)) {
            foundIndex = index;
            nextFind = false;
        }

        return nextFind;
    });

    return foundIndex;
}

/**
 * Separate the trs according to the type of parent, such as thead and tbody.
 * @param {Array.<Array.<object>>} trs - tr list
 * @returns {[Array.<Array.<object>>, Array.<Array.<object>>]} - returns thead and tbody
 * @private
 */
export function _divideTrs(trs) {
    const tbodyStartIndex = _findIndex(trs, tr => (tr[0].nodeName === 'TD'));

    return [trs.slice(0, tbodyStartIndex), trs.slice(tbodyStartIndex)];
}

/**
 * Merge by colspan.
 * @param {Array.<Array.<object>>} trs - tr list
 * @private
 */
export function _mergeByColspan(trs) {
    trs.forEach(tr => {
        const tdCount = tr.length;
        let removalCount = 0;

        tr.forEach(td => {
            removalCount += (td.colspan - 1);
        });

        tr.splice(tdCount - removalCount);
    });
}

/**
 * Get removal td counts by rowspan.
 * @param {Array.<Array.<object>>} trs - tr list
 * @returns {number}
 * @private
 */
export function _getRemovalTdCountsByRowspan(trs) {
    const trIndexes = trs.map((tr, index) => index);
    const removalCounts = trIndexes.map(() => 0);

    trs.forEach((tr, trIndex) => {
        const rowspanTds = tr.filter(td => (td.rowspan > 1));
        const startTrIndexForRemoval = trIndex + 1;

        rowspanTds.forEach(td => {
            const removeCount = td.colspan;
            const endTrIndexForRemoval = startTrIndexForRemoval + (td.rowspan - 1);

            trIndexes.slice(startTrIndexForRemoval, endTrIndexForRemoval).forEach(removeIndex => {
                removalCounts[removeIndex] += removeCount;
            });
        });
    });

    return removalCounts;
}

/**
 * Merge by rowspan.
 * @param {Array.<Array.<object>>} trs - tr list
 * @private
 */
export function _mergeByRowspan(trs) {
    const removalCounts = _getRemovalTdCountsByRowspan(trs);

    trs.forEach((tr, trIndex) => {
        tr.splice(tr.length - removalCounts[trIndex]);
    });
}

/**
 * Create html for thead or tbody.
 * @param {Array.<Array.<object>>} trs - tr list
 * @param {string} nodeName - node name like TD, TH
 * @param {string} wrapperNodeName - wrapper node name like THEAD, TBODY
 * @returns {string}
 * @private
 */
function _createTheadOrTbodyHtml(trs, nodeName, wrapperNodeName) {
    let html = '';

    if (trs.length) {
        html = trs.map(tr => {
            const tdHtml = tr.map(td => {
                let attrs = td.colspan > 1 ? ` colspan="${td.colspan}"` : '';
                attrs += td.rowspan > 1 ? ` rowspan="${td.rowspan}"` : '';
                attrs += td.align ? ` align="${td.align}"` : '';

                return `<${nodeName}${attrs}>${td.value}</${nodeName}>`;
            }).join('');

            return `<tr>${tdHtml}</tr>`;
        }).join('');
        html = `<${wrapperNodeName}>${html}</${wrapperNodeName}>`;
    }

    return html;
}

/**
 * Create table html.
 * @param {Array.<Array.<object>>} thead - trs in thead
 * @param {Array.<Array.<object>>} tbody - trs in tbody
 * @returns {string}
 * @private
 */
function _createTableHtml(thead, tbody) {
    const theadHtml = _createTheadOrTbodyHtml(thead, 'TH', 'THEAD');
    const tbodyHtml = _createTheadOrTbodyHtml(tbody, 'TD', 'TBODY');

    return `<table>${theadHtml + tbodyHtml}</table>`;
}

/**
 * Create merged table by @cols, @rows value in td innerHTML.
 * @param {HTMLElement} tableElement - unmerged table
 * @returns {HTMLElement}
 */
export default function createMergedTable(tableElement) {
    const table = _createTableObjectFrom$Table($(tableElement));
    const [thead, tbody] = _divideTrs(table);

    _mergeByColspan(thead);
    _mergeByColspan(tbody);
    _mergeByRowspan(tbody);

    return $(_createTableHtml(thead, tbody))[0];
}

