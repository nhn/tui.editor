/**
* @fileoverview Implements mergedTableCreator.
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
import $ from 'jquery';
import util from 'tui-code-snippet';

import tableRenderer from './tableRenderer';

/**
 * Extract properties for merge.
 * @param {string} value - value
 * @param {string} type - merge type like colspan, rowspan
 * @param {string} oppossitType - oppossit merge type
 *                                if merge type is colspan, opossit merge type is rowspan
 * @returns {Array.<number|string>} - returns merge count and value
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
 *   content: string,
 *   align: string
 * }}
 * @private
 */
export function _parseTableCell(cell) {
  const {nodeName} = cell;
  const align = cell.align || '';
  let content = cell.innerHTML.trim();
  let colspan = null;
  let rowspan = null;

  [colspan, content] = _extractPropertiesForMerge(content, '@cols', '@rows');
  [rowspan, content] = _extractPropertiesForMerge(content, '@rows', '@cols');

  return {
    nodeName,
    colspan,
    rowspan,
    content,
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
 * @private
 */
function _findIndex(arr, onFind) {
  let foundIndex = -1;

  util.forEach(arr, (item, index) => {
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
 * @returns {Array.<Array.<Array.<object>>>} - returns thead and tbody
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

  return $(tableRenderer.createTableHtml(table))[0];
}

