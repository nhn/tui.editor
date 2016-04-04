/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var tableID = 0,
    TABLE_CLASS_PREFIX = 'te-content-table-';

/**
 * Table
 * Add table to selected wysiwyg editor content
 * @exports Table
 * @augments Command
 * @augments WysiwygCommand
 */
var Table = CommandManager.command('wysiwyg', /** @lends Table */{
    name: 'Table',
    /**
     * Command Handler
     * @param {WysiwygEditor} wwe WYsiwygEditor instance
     * @param {number} col column count
     * @param {number} row row count
     * @param {Array} data initial table data
     */
    exec: function(wwe, col, row, data) {
        var sq = wwe.getEditor(),
            table;

        if (!sq.getSelection().collapsed || sq.hasFormat('TABLE') || sq.hasFormat('PRE')) {
            sq.focus();

            return;
        }

        table = '<table class="' + TABLE_CLASS_PREFIX + tableID + '">';
        table += makeHeader(col);
        table += makeBody(col, row - 1, data);
        table += '</table>';

        sq.insertHTML(table);

        sq.focus();

        if (!data) {
            focusToFirstTh(sq, wwe.get$Body().find('.' + TABLE_CLASS_PREFIX + tableID));
        }

        tableID += 1;
    }
});

function focusToFirstTh(sq, $table) {
    var range;

    range = sq.getSelection();
    range.selectNodeContents($table.find('th')[0]);
    range.collapse(true);
    sq.setSelection(range);
}

/**
 * makeHeader
 * make table header html string
 * @param {number} col column count
 * @returns {string} html string
 */
function makeHeader(col) {
    var header = '<thead><tr>';

    while (col) {
        header += '<th></th>';
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
    var body = '<tbody>',
        index = 0,
        irow, icol;

    for (irow = 0; irow < row; irow += 1) {
        body += '<tr>';

        for (icol = 0; icol < col; icol += 1) {
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

module.exports = Table;
