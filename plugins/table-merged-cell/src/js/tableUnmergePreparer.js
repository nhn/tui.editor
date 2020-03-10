/**
 * @fileoverview Implements tableUnmergePreparer.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import toArray from 'tui-code-snippet/collection/toArray';

/**
 * Prepend merge syntax to content.
 * @param {HTMLElement} cell - td or th
 * @private
 */
export function _prependMergeSyntaxToContent(cell) {
  const colspan = cell.getAttribute('colspan') || '';
  const rowspan = cell.getAttribute('rowspan') || '';
  let content = cell.innerHTML;

  if (colspan) {
    content = `@cols=${colspan}:${content}`;
  }

  if (rowspan) {
    content = `@rows=${rowspan}:${content}`;
  }

  if (content) {
    cell.innerHTML = content;
  }
}

/**
 * Prepare table unmerge.
 * @param {HTMLElement} tableElement - table element
 * @returns {HTMLElement}
 */
export default function prepareTableUnmerge(tableElement) {
  const cells = tableElement.querySelectorAll('td, th');

  toArray(cells).forEach(_prependMergeSyntaxToContent);

  return tableElement;
}
