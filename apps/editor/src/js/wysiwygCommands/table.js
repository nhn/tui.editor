/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

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
     * @param {number} row row count
     * @param {number} col column count
     */
    exec: function(wwe, col, row) {
        var sq = wwe.getEditor(),
            table;

        table = '<table>';
        table += makeHeader(col);
        table += makeBody(col, row - 1);
        table += '</table>';

        sq.insertHTML(table);

        sq.focus();
    }
});

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
 * @param {number} row row count
 * @param {number} col column count
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
