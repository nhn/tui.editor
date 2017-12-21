/**
 * @fileoverview Implements table WysiwygCommand
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import CommandManager from '../commandManager';

/**
 * Table
 * Add table to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/Table
 * @ignore
 */
const Table = CommandManager.command('wysiwyg', /** @lends Table */{
  name: 'Table',
  /**
   * Command Handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   * @param {number} col column count
   * @param {number} row row count
   * @param {Array} data initial table data
   */
  exec(wwe, col, row, data) {
    const sq = wwe.getEditor();
    const tableIDClassName = wwe.componentManager.getManager('table').getTableIDClassName();
    let tableHTMLString;

    if (!sq.getSelection().collapsed || sq.hasFormat('TABLE') || sq.hasFormat('PRE')) {
      wwe.focus();

      return;
    }

    tableHTMLString = `<table class="${tableIDClassName}">`;
    tableHTMLString += makeHeader(col, data);
    tableHTMLString += makeBody(col, row - 1, data);
    tableHTMLString += '</table>';

    sq.insertHTML(tableHTMLString);

    wwe.focus();

    if (!data) {
      focusToFirstTh(sq, wwe.get$Body().find(`.${tableIDClassName}`));
    }
  }
});

/**
 * Focus to first th
 * @param {Squire} sq Squire instance
 * @param {jQuery} $table jQuery wrapped table element
 */
function focusToFirstTh(sq, $table) {
  const range = sq.getSelection();

  range.selectNodeContents($table.find('th')[0]);
  range.collapse(true);
  sq.setSelection(range);
}

/**
 * makeHeader
 * make table header html string
 * @param {number} col column count
 * @param {string} data cell data
 * @returns {string} html string
 */
function makeHeader(col, data) {
  let header = '<thead><tr>';
  let index = 0;

  while (col) {
    header += '<th>';

    if (data) {
      header += data[index];
      index += 1;
    }

    header += '</th>';
    col -= 1;
  }

  header += '</tr></thead>';

  return header;
}

/**
 * makeBody
 * make table body html string
 * @param {number} col column count
 * @param {number} row row count
 * @param {string} data cell data
 * @returns {string} html string
 */
function makeBody(col, row, data) {
  let body = '<tbody>';
  let index = col;

  for (let irow = 0; irow < row; irow += 1) {
    body += '<tr>';

    for (let icol = 0; icol < col; icol += 1) {
      body += '<td>';

      if (data) {
        body += data[index];
        index += 1;
      }

      body += '</td>';
    }

    body += '</tr>';
  }

  body += '</tbody>';

  return body;
}

export default Table;
