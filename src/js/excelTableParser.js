/**
 * @fileoverview Implements excelTableParser
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

/**
 * excelTableParser
 * Parse excel paste data
 * @exports excelTableParser
 * @param {string} content excel table content
 * @returns {object} result
 */
function excelTableParser(content) {
    var rows = getRows(content),
        data = [],
        rowLength = 0,
        colLength = 0;

    rowLength = rows.length;

    rows.forEach(function(row) {
        var cols = row.split('\t');

        if (!cols) {
            return;
        } else if (!colLength) {
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

function getRows(content) {
    //remove last LF or CR
    content = content.replace(/(\r\n$)|(\r$)|(\n$)/, '');
    //CR or CR-LF to LF
    content = content.replace(/(\r\n)|(\r)/g, '\n');

    return content.split('\n');
}

module.exports = excelTableParser;
