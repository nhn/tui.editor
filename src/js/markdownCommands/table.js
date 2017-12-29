/**
 * @fileoverview Implements Table markdown command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

import CommandManager from '../commandManager';

/**
 * Table
 * Add table markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Table
 * @ignore
 */
const Table = CommandManager.command('markdown', /** @lends Table */{
  name: 'Table',
  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   * @param {number} col column count
   * @param {number} row row count
   * @param {Array} data initial table data
   */
  exec(mde, col, row, data) {
    const cm = mde.getEditor();
    const doc = cm.getDoc();
    let table = '\n';

    if (cm.getCursor().ch > 0) {
      table += '\n';
    }

    table += makeHeader(col, data);
    table += makeBody(col, row - 1, data);

    doc.replaceSelection(table);

    if (!data) {
      cm.setCursor(cm.getCursor().line - row, 2);
    }

    mde.focus();
  }
});

/**
 * makeHeader
 * make table header markdown string
 * @param {number} col Column count
 * @param {array} data Cell's text content
 * @returns {string} markdown string
 */
function makeHeader(col, data) {
  let header = '|';
  let border = '|';
  let index = 0;

  while (col) {
    if (data) {
      header += ` ${data[index]} |`;
      index += 1;
    } else {
      header += '  |';
    }

    border += ' --- |';

    col -= 1;
  }

  return `${header}\n${border}\n`;
}

/**
 * makeBody
 * make table body markdown string
 * @param {number} col column count
 * @param {number} row row count
 * @param {Array} data initial table data
 * @returns {string} html string
 */
function makeBody(col, row, data) {
  let body = '';
  let index = col;

  for (let irow = 0; irow < row; irow += 1) {
    body += '|';

    for (let icol = 0; icol < col; icol += 1) {
      if (data) {
        body += ` ${data[index]} |`;
        index += 1;
      } else {
        body += '  |';
      }
    }

    body += '\n';
  }

  body = body.replace(/\n$/g, '');

  return body;
}
export default Table;
