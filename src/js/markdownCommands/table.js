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
var Table = CommandManager.command('markdown', /** @lends Table */{
    name: 'Table',
    /**
     * Command handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     * @param {number} col column count
     * @param {number} row row count
     * @param {Array} data initial table data
     */
    exec: function(mde, col, row, data) {
        var cm = mde.getEditor(),
            doc = cm.getDoc(),
            table = '\n';

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

/*
 * makeHeader
 * make table header markdown string
 * @param {number} col column count
 * @returns {string} markdown string
 */
function makeHeader(col, data) {
    var header = '|',
        border = '|',
        index = 0;

    while (col) {
        if (data) {
            header += ' ' + data[index] + ' |';
            index += 1;
        } else {
            header += '  |';
        }

        border += ' --- |';

        col -= 1;
    }
    return header + '\n' + border + '\n';
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
    var body = '',
        index = col,
        irow, icol;

    for (irow = 0; irow < row; irow += 1) {
        body += '|';

        for (icol = 0; icol < col; icol += 1) {
            if (data) {
                body += ' ' + data[index] + ' |';
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
module.exports = Table;
