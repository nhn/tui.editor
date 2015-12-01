/**
 * @fileoverview Implements Table markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * Table
 * Add table markdown syntax to markdown editor
 * @exports Table
 * @augments Command
 */
var Table = CommandManager.command('markdown',/** @lends Table */{
    name: 'Table',
    /**
     * Command handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     * @param {number} row row count
     * @param {number} col column count
     */
    exec: function(mde, row, col) {
        var cm = mde.getEditor(),
            doc = cm.getDoc(),
            table = '\n';

        if (cm.getCursor().ch > 0) {
            table += '\n';
        }

        table += makeHeader(col);
        table += makeBody(row, col);

        doc.replaceSelection(table);

        cm.setCursor(cm.getCursor().line - (row + 2), 2); //2 means header row count
    }
});

/*
 * makeHeader
 * make table header markdown string
 * @param {number} col column count
 * @return {string} markdown string
 */
function makeHeader(col) {
    var header = '|',
        border = '|';

    while (col) {
        header += '    |';
        border +=' -- |';

        col -= 1;
    }

    return header + '\n' + border + '\n';
}

/**
 * makeBody
 * make table body markdown string
 * @param {number} row row count
 * @param {number} col column count
 * @return {string} html string
 */
function makeBody(row, col) {
    var body = '',
        irow, icol;

    for (irow = 0; irow < row; irow += 1) {
        body += '|';

        for (icol = 0; icol < col; icol += 1) {
            body += '    |';
        }

        body += '\n';
    }

    return body;
}
module.exports = Table;
