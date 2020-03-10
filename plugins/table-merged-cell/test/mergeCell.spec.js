/**
 * @fileoverview Test merge cell
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import { _mergeCells } from '@/mergeCell';
import tableDataHandler from '@/tableDataHandler';

describe('mergeCell', () => {
  describe('_mergeCells', () => {
    const tableHtml = [
      '<table>',
      '<thead>',
      '<tr><th colspan="2">title1</th><th>title3</th></tr>',
      '</thead>',
      '<tbody>',
      '<tr><td>content1-1</td><td>content1-2</td><td>content1-3</td></tr>',
      '<tr><td>content2-1</td><td>content2-2</td><td>content2-3</td></tr>',
      '<tbody>',
      '</table>'
    ].join('');
    let tableData;

    beforeEach(function() {
      const $table = $(tableHtml);

      tableData = tableDataHandler.createTableData($table.get(0));
    });

    it('merge selected cells', () => {
      const tableRange = {
        start: {
          rowIndex: 1,
          colIndex: 0
        },
        end: {
          rowIndex: 2,
          colIndex: 1
        }
      };

      expect(tableData[1][0].colspan).toBe(1);
      expect(tableData[1][0].rowspan).toBe(1);
      expect(tableData[1][0].content).toBe('content1-1');
      expect(tableData[1][1].content).toBe('content1-2');
      expect(tableData[2][0].content).toBe('content2-1');
      expect(tableData[2][1].content).toBe('content2-2');
      _mergeCells(tableData, tableRange);

      expect(tableData[1][0].colspan).toBe(2);
      expect(tableData[1][0].rowspan).toBe(2);
      expect(tableData[1][0].content).toBe('content1-1');
      expect(tableData[1][1].colMergeWith).toBe(0);
      expect(tableData[1][1].content).toBeUndefined();
      expect(tableData[2][0].rowMergeWith).toBe(1);
      expect(tableData[2][0].content).toBeUndefined();
      expect(tableData[2][1].colMergeWith).toBe(0);
      expect(tableData[2][1].rowMergeWith).toBe(1);
      expect(tableData[2][1].content).toBeUndefined();
    });

    it('merge selected cells, when has previously merged cells', () => {
      const tableRange = {
        start: {
          rowIndex: 0,
          colIndex: 0
        },
        end: {
          rowIndex: 0,
          colIndex: 2
        }
      };

      expect(tableData[0][0].colspan).toBe(2);
      expect(tableData[0][1].colMergeWith).toBe(0);
      expect(tableData[0][2].content).toBe('title3');

      _mergeCells(tableData, tableRange);

      expect(tableData[0][0].colspan).toBe(3);
      expect(tableData[0][0].content).toBe('title1');
      expect(tableData[0][2].content).toBeUndefined();
      expect(tableData[0][2].colMergeWith).toBe(0);
    });
  });
});
