/**
 * @fileoverview Test table range handler
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import tableRangeHandler from '@/tableRangeHandler';
import tableDataHandler from '@/tableDataHandler';

describe('tableRangeHandler', () => {
  describe('findSelectionRange()', () => {
    const tableHtml = [
      '<table>',
      '<thead>',
      '<tr><th>header1</th><th colspan="2">header2</th></tr>',
      '</thead>',
      '<tbody>',
      '<tr><td>row1cell1</td><td rowspan="2">row1cell2</td><td>row1cell3</td></tr>',
      '<tr><td>row2cell1</td><td rowspan="2">row2cell3</td></tr>',
      '<tr><td colspan="2">row3cell1</td></tr>',
      '</tbody>',
      '</table>'
    ].join('');
    const tempDiv = document.createElement('div');

    tempDiv.innerHTML = tableHtml;

    const table = tempDiv.firstChild;
    const trs = table.querySelectorAll('tr');
    const tableData = tableDataHandler.createTableData(table);

    it('find table range for selection, when has row merge', () => {
      const tds = trs[1].querySelectorAll('td');
      const start = tds[0];
      const end = tds[1];
      const actual = tableRangeHandler.findSelectionRange(tableData, start, end);

      expect(actual.start.rowIndex).toBe(1);
      expect(actual.start.colIndex).toBe(0);
      expect(actual.end.rowIndex).toBe(2);
      expect(actual.end.colIndex).toBe(1);
    });

    it('find table range for selection, when has column merge', () => {
      const ths = trs[0].querySelectorAll('th');
      const start = ths[0];
      const end = ths[1];
      const actual = tableRangeHandler.findSelectionRange(tableData, start, end);

      expect(actual.start.rowIndex).toBe(0);
      expect(actual.start.colIndex).toBe(0);
      expect(actual.end.rowIndex).toBe(0);
      expect(actual.end.colIndex).toBe(2);
    });

    it('find table range for selection, when has boath row merge and column merge', () => {
      const start = trs[1].querySelectorAll('td')[1];
      const end = trs[3].querySelectorAll('td')[0];
      const actual = tableRangeHandler.findSelectionRange(tableData, start, end);

      expect(actual.start.rowIndex).toBe(1);
      expect(actual.start.colIndex).toBe(0);
      expect(actual.end.rowIndex).toBe(3);
      expect(actual.end.colIndex).toBe(1);
    });

    it('find table range for selection, when cells chained expanded cells by merge properties like colspan, rowspan', () => {
      const start = trs[1].querySelectorAll('td')[1];
      const end = trs[2].querySelectorAll('td')[1];
      const actual = tableRangeHandler.findSelectionRange(tableData, start, end);

      expect(actual.start.rowIndex).toBe(1);
      expect(actual.start.colIndex).toBe(0);
      expect(actual.end.rowIndex).toBe(3);
      expect(actual.end.colIndex).toBe(2);
    });

    it('find table range for selection, when revered start and end', () => {
      const start = trs[2].querySelectorAll('td')[1];
      const end = trs[1].querySelectorAll('td')[1];
      const actual = tableRangeHandler.findSelectionRange(tableData, start, end);

      expect(actual.start.rowIndex).toBe(1);
      expect(actual.start.colIndex).toBe(0);
      expect(actual.end.rowIndex).toBe(3);
      expect(actual.end.colIndex).toBe(2);
    });
  });
});
