/**
 * @fileoverview Implements tableMerge extends.
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

/**
 * Extract properties for merge.
 * @param {string} value - value
 * @param {string} type - merge type
 * @param {string} oppossitType - oppossit merge type
 * @returns {[number, string]}
 * @private
 */
export function _extractPropertiesForMerge(value, type, oppossitType) {
    const regex = new RegExp(`^((?:${ oppossitType }=[0-9]+:)?)${ type }=([0-9]+):(.*)`);
    const regexResult = regex.exec(value);
    let result;

    if (regexResult) {
        result = [parseInt(regexResult[2], 10), regexResult[1] + regexResult[3]];
    } else {
        result = [1, value];
    }

    return result; 
}

/**
 * Parse td element. 
 * @param {HTMLElement} td - td element
 * @returns {{
 *   nodeName: string
 *   cospan: number,
 *   rowspan: number,
 *   value: string,
 *   align: string
 * }}
 * @private
 */
export function _parseTd(td) {
    const nodeName = td.nodeName;
    const align = td.align || '';
    let value = td.innerHTML.trim();
    let colspan, rowspan;

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
 * Generate table object from jQuery table.
 * @param {jQuery} $table
 * @returns {Array.<Array.<object>>}
 * @private
 */
export function _generateTableObjectFrom$Table($table) {
    return $table.find('tr').get().map(tr => {
        return $(tr).find('td, th').get().map(_parseTd);
    });
}

/**
 * Divide tr list to thead and tbody.
 * @param {Array.<Array.<object>>} trs - tr list
 * @returns {[Array.<Array.<object>>, Array.<Array.<object>>]}
 * @private
 */
export function _divideTrs(trs) {
    const bodyStartIndex = trs.findIndex(tr => (tr[0].nodeName === 'TD'));

    return [trs.slice(0, bodyStartIndex), trs.slice(bodyStartIndex)];
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
        const startTrIndex = trIndex + 1;

        rowspanTds.forEach((td) => {
            const removeCount = 1 * td.colspan;

            trIndexes.slice(startTrIndex, startTrIndex + (td.rowspan - 1)).forEach(removeIndex => {
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
 * Generate html for thead or tbody.
 * @param {Array.<Array.<object>>} trs - tr list
 * @param {string} nodeName - node name like TD, TH
 * @param {string} middleNodeName - middle node name like THEAD, TBODY
 * @returns {string}
 * @private
 */
function _generateMiddleHtml(trs, nodeName, middleNodeName) {
    let html = '';

    if (trs.length) {
        html = trs.map(tr => {
            const tdHtml = tr.map(td => {
                let attrs = td.colspan > 1 ? ` colspan="${ td.colspan }"` : '';
                attrs += td.rowspan > 1 ? ` rowspan="${ td.rowspan }"` : '';
                attrs += td.align ? ` align="${ td.align }"` : '';

                return `<${ nodeName }${ attrs }>${ td.value }</${ nodeName }>`;
            }).join('');

            return `<tr>${ tdHtml }</tr>`;
        }).join('');
        html = `<${ middleNodeName }>${ html }</${ middleNodeName }>`;
    }

    return html;
}

/**
 * Generate table html.
 * @param {Array.<Array.<object>>} thead - trs in thead
 * @param {Array.<Array.<object>>} tbody - trs in tbody
 * @returns {string}
 * @private
 */
function _generateTableHtml(thead, tbody) {
    const theadHtml = _generateMiddleHtml(thead, 'TH', 'THEAD');
    const tbodyHtml = _generateMiddleHtml(tbody, 'TD', 'TBODY');

    return `<table>${ theadHtml + tbodyHtml }</table>`;
}

/**
 * Merge table by colspan and rowspan.
 * @param {HTMLElement} tableElement
 * @returns {HTMLElement} 
 */
export default function mergeTable(tableElement) {
    let table = _generateTableObjectFrom$Table($(tableElement));
    let [thead, tbody] = _divideTrs(table);

    _mergeByColspan(thead);
    _mergeByColspan(tbody);
    _mergeByRowspan(tbody);

    return $(_generateTableHtml(thead, tbody))[0];
}

