/**
* @fileoverview Implements tableUnmergePreparer.
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
import $ from 'jquery';

/**
 * Prepend merge syntax to content.
 * @param {HTMLElement} cell - td or th
 * @private
 */
export function _prependMergeSyntaxToContent(cell) {
  const $cell = $(cell);
  const colspan = $cell.attr('colspan') || '';
  const rowspan = $cell.attr('rowspan') || '';
  let content = $cell.html();

  if (colspan) {
    content = `@cols=${colspan}:${content}`;
  }

  if (rowspan) {
    content = `@rows=${rowspan}:${content}`;
  }

  if (content) {
    $cell.html(content);
  }
}

/**
 * Prepare table unmerge.
 * @param {HTMLElement} tableElement - table element
 * @returns {HTMLElement}
 */
export default function prepareTableUnmerge(tableElement) {
  $(tableElement).find('td, th').get().forEach(_prependMergeSyntaxToContent);

  return tableElement;
}
