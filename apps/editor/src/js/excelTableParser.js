/**
 * @fileoverview Implements excelTableParser
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var rowSplitter = tui.util.browser.firefox ? '\n' : '\r';

/**
 * excelTableParser
 * Parse excel paste data
 * @exports excelTableParser
 * @param {string} content excel table content
 * @returns {object} result
 */
function excelTableParser(content) {
    var rows = content.split(rowSplitter),
        data = [],
        rowLength = 0,
        colLength = 0;

    rowLength = rows.length;

    rows.forEach(function(row) {
        var cols = row.split('\t');

        if (!colLength) {
            colLength = cols.length;
        }

        data = data.concat(cols);
    });

    return {
        col: colLength,
        row: rowLength,
        data: data
    };
}

module.exports = excelTableParser;
