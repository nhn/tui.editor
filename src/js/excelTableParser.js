/**
 * @fileoverview Implements excelTableParser
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

/**
 * excelTableParser
 * Parse excel paste data
 * @param {string} content excel table content
 * @returns {object} result
 * @ignore
 */
function excelTableParser(content) {
  const rows = getRows(content);
  const rowLength = rows.length;
  let data = [];
  let colLength = 0;

  rows.forEach(row => {
    const cols = row.split('\t');

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
    data
  };
}
/**
 * Get row data from raw text with Regexp
 * @param {string} content Raw copied text data
 * @returns {Array}
 * @ignore
 */
function getRows(content) {
  content = content.replace(/"([^"]+)"/g, (match, cell) => cell.replace(/(\r\n)|(\r)/g, '<br/>'));

  // remove last LF or CR
  content = content.replace(/(\r\n$)|(\r$)|(\n$)/, '');
  // CR or CR-LF to LF
  content = content.replace(/(\r\n)|(\r)/g, '\n');

  return content.split('\n');
}

export default excelTableParser;
