/**
 * @fileoverview test table range handler
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import tableRangeHandler from '../../../../src/js/extensions/table/tableRangeHandler';
import tableDataHandler from '../../../../src/js/extensions/table/tableDataHandler';

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
    const $table = $(tableHtml);
    const $trs = $table.find('tr');
    const tableData = tableDataHandler.createTableData($table);

    it('Find table range for selection, when has row merge.', () => {
      const $tds = $trs.eq(1).find('td');
      const $start = $tds.eq(0);
      const $end = $tds.eq(1);
      const actual = tableRangeHandler.findSelectionRange(tableData, $start, $end);

      expect(actual.start.rowIndex).toBe(1);
      expect(actual.start.colIndex).toBe(0);
      expect(actual.end.rowIndex).toBe(2);
      expect(actual.end.colIndex).toBe(1);
    });

    it('Find table range for selection, when has column merge.', () => {
      const $ths = $trs.eq(0).find('th');
      const $start = $ths.eq(0);
      const $end = $ths.eq(1);
      const actual = tableRangeHandler.findSelectionRange(tableData, $start, $end);

      expect(actual.start.rowIndex).toBe(0);
      expect(actual.start.colIndex).toBe(0);
      expect(actual.end.rowIndex).toBe(0);
      expect(actual.end.colIndex).toBe(2);
    });

    it('Find table range for selection, when has boath row merge and column merge.', () => {
      const $start = $trs.eq(1).find('td').eq(1);
      const $end = $trs.eq(3).find('td').eq(0);
      const actual = tableRangeHandler.findSelectionRange(tableData, $start, $end);

      expect(actual.start.rowIndex).toBe(1);
      expect(actual.start.colIndex).toBe(0);
      expect(actual.end.rowIndex).toBe(3);
      expect(actual.end.colIndex).toBe(1);
    });

    it('Find table range for selection, when cells chained expanded cells by merge properties like colspan, rowspan.', () => {
      const $start = $trs.eq(1).find('td').eq(1);
      const $end = $trs.eq(2).find('td').eq(1);
      const actual = tableRangeHandler.findSelectionRange(tableData, $start, $end);

      expect(actual.start.rowIndex).toBe(1);
      expect(actual.start.colIndex).toBe(0);
      expect(actual.end.rowIndex).toBe(3);
      expect(actual.end.colIndex).toBe(2);
    });

    it('Find table range for selection, when revered $start and $end.', () => {
      const $start = $trs.eq(2).find('td').eq(1);
      const $end = $trs.eq(1).find('td').eq(1);
      const actual = tableRangeHandler.findSelectionRange(tableData, $start, $end);

      expect(actual.start.rowIndex).toBe(1);
      expect(actual.start.colIndex).toBe(0);
      expect(actual.end.rowIndex).toBe(3);
      expect(actual.end.colIndex).toBe(2);
    });
  });
});
