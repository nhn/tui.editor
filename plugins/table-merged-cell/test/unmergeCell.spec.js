/**
 * @fileoverview Test unmerge cell
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';
import { msie } from 'tui-code-snippet/browser/browser';

import { _hasMergedCell, _unmergeCells } from '@/unmergeCell';
import tableDataHandler from '@/tableDataHandler';

describe('unmergeCell', () => {
  const BASIC_CELL_CONTENT = msie ? '' : '<br>';
  const tableHtml = [
    '<table>',
    '<thead>',
    '<tr><th colspan="2">title1</th><th>title3</th></tr>',
    '</thead>',
    '<tbody>',
    '<tr><td colspan="2" rowspan="2">content1-1</td><td>content1-3</td></tr>',
    '<tr><td>content2-3</td></tr>',
    '<tbody>',
    '</table>'
  ].join('');
  let tableData;

  beforeEach(function() {
    const $table = $(tableHtml);

    tableData = tableDataHandler.createTableData($table.get(0));
  });

  describe('_hasMergedCell', () => {
    it('whether has merged cell, when has merged cell', () => {
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
      const actual = _hasMergedCell(tableData, tableRange);

      expect(actual).toBe(true);
    });

    it('whether has merged cell, when has not merged cell', () => {
      const tableRange = {
        start: {
          rowIndex: 2,
          colIndex: 2
        },
        end: {
          rowIndex: 2,
          colIndex: 2
        }
      };
      const actual = _hasMergedCell(tableData, tableRange);

      expect(actual).toBe(false);
    });
  });

  describe('_unmergeCells', () => {
    it('unmerge selected merged cells', () => {
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

      _unmergeCells(tableData, tableRange);

      expect(tableData[1][0].colspan).toBe(1);
      expect(tableData[1][0].rowspan).toBe(1);
      expect(tableData[1][0].content).toBe('content1-1');
      expect(tableData[1][1].colMergeWith).toBeUndefined();
      expect(tableData[1][1].content).toBe(BASIC_CELL_CONTENT);
      expect(tableData[2][0].rowMergeWith).toBeUndefined();
      expect(tableData[2][0].content).toBe(BASIC_CELL_CONTENT);
      expect(tableData[2][1].colMergeWith).toBeUndefined();
      expect(tableData[2][1].rowMergeWith).toBeUndefined();
      expect(tableData[2][1].content).toBe(BASIC_CELL_CONTENT);
    });
  });
});
