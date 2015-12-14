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
var Table = CommandManager.command('wysiwyg',/** @lends Table */{
    name: 'Table',
    /**
     * Command Handler
     * @param {WysiwygEditor} wwe WYsiwygEditor instance
     * @param {number} col column count
     * @param {number} row row count
     */
    exec: function(wwe, col, row) {
        var sq = wwe.getEditor(),
            table;

        table = '<table class="' + TABLE_CLASS_PREFIX + tableID + '">';
        table += makeHeader(col);
        table += makeBody(col, row - 1);
        table += '</table>';

        sq.insertHTML(table);

        sq.focus();

        focusToFirstTh(sq, wwe.get$Body().find('.' + TABLE_CLASS_PREFIX + tableID));

        tableID += 1;
    }
});

function focusToFirstTh(sq, $table) {
    var range;

    range = sq.getSelection();
    range.selectNodeContents($table.find('th').eq(0)[0]);
    sq.setSelection(range);
}

/**
 * makeHeader
 * make table header html string
 * @param {number} col column count
 * @return {string} html string
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
 * @return {string} html string
 */
function makeBody(col, row) {
    var body = '<tbody>',
        irow, icol;

    for (irow = 0; irow < row; irow += 1) {
        body += '<tr>';

        for (icol = 0; icol < col; icol += 1) {
            body += '<td></td>';
        }

        body += '</tr>';
    }

    body += '</tbody>';

    return body;
}

module.exports = Table;
