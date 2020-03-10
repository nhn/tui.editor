/**
 * @fileoverview Test merged table add column
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';
import { msie } from 'tui-code-snippet/browser/browser';

import { _createNewColumns, _addColumns } from '@/mergedTableAddCol';
import tableDataHandler from '@/tableDataHandler';

describe('mergedTableAddCol', () => {
  const BASIC_CELL_CONTENT = msie ? '' : '<br>';

  describe('_createNewColumns()', () => {
    let tableData;

    beforeEach(function() {
      tableData = [
        [
          {
            nodeName: 'TH',
            colspan: 1,
            rowspan: 1,
            content: 'title1'
          },
          {
            nodeName: 'TH',
            colspan: 1,
            rowspan: 1,
            content: 'title2'
          },
          {
            nodeName: 'TH',
            colspan: 1,
            rowspan: 1,
            content: 'title3'
          }
        ],
        [
          {
            nodeName: 'TD',
            colspan: 3,
            rowspan: 1,
            content: 'content1-1'
          },
          {
            nodeName: 'TD',
            colMergeWith: 0
          },
          {
            nodeName: 'TD',
            colMergeWith: 0
          }
        ],
        [
          {
            nodeName: 'TD',
            colspan: 1,
            rowspan: 1,
            content: 'content2-1'
          },
          {
            nodeName: 'TD',
            colspan: 1,
            rowspan: 1,
            content: 'content2-2'
          },
          {
            nodeName: 'TD',
            colspan: 1,
            rowspan: 1,
            content: 'content2-3'
          }
        ]
      ];
    });

    it('create new columns, when target col has merged cell', () => {
      const startColIndex = 1;
      const endColIndex = 1;
      const actual = _createNewColumns(tableData, startColIndex, endColIndex);

      expect(tableData[1][0].colspan).toBe(4);
      expect(actual.length).toBe(3);
      expect(actual[0].length).toBe(1);
      expect(actual[0][0]).toEqual({
        nodeName: 'TH',
        colspan: 1,
        rowspan: 1,
        content: BASIC_CELL_CONTENT,
        elementIndex: {
          rowIndex: 0,
          colIndex: 2
        }
      });
      expect(actual[1].length).toBe(1);
      expect(actual[1][0]).toEqual({
        nodeName: 'TD',
        colMergeWith: 0
      });
      expect(actual[2].length).toBe(1);
      expect(actual[2][0]).toEqual({
        nodeName: 'TD',
        colspan: 1,
        rowspan: 1,
        content: BASIC_CELL_CONTENT,
        elementIndex: {
          rowIndex: 2,
          colIndex: 2
        }
      });
    });

    it('create new columns, when target col has start merge cell(has colspan)', () => {
      const startColIndex = 0;
      const endColIndex = 0;
      const actual = _createNewColumns(tableData, startColIndex, endColIndex);

      expect(tableData[1][0].colspan).toBe(4);
      expect(actual.length).toBe(3);
      expect(actual[0].length).toBe(1);
      expect(actual[0][0]).toEqual({
        nodeName: 'TH',
        colspan: 1,
        rowspan: 1,
        content: BASIC_CELL_CONTENT,
        elementIndex: {
          rowIndex: 0,
          colIndex: 1
        }
      });
      expect(actual[1].length).toBe(1);
      expect(actual[1][0]).toEqual({
        nodeName: 'TD',
        colMergeWith: 0
      });
      expect(actual[2].length).toBe(1);
      expect(actual[2][0]).toEqual({
        nodeName: 'TD',
        colspan: 1,
        rowspan: 1,
        content: BASIC_CELL_CONTENT,
        elementIndex: {
          rowIndex: 2,
          colIndex: 1
        }
      });
    });

    it('create new columns, when target row has last merged cell', () => {
      const startColIndex = 2;
      const endColIndex = 2;
      const actual = _createNewColumns(tableData, startColIndex, endColIndex);

      expect(actual.length).toBe(3);
      expect(actual[0].length).toBe(1);
      expect(actual[0][0]).toEqual({
        nodeName: 'TH',
        colspan: 1,
        rowspan: 1,
        content: BASIC_CELL_CONTENT,
        elementIndex: {
          rowIndex: 0,
          colIndex: 3
        }
      });
      expect(actual[1].length).toBe(1);
      expect(actual[1][0]).toEqual({
        nodeName: 'TD',
        colspan: 1,
        rowspan: 1,
        content: BASIC_CELL_CONTENT,
        elementIndex: {
          rowIndex: 1,
          colIndex: 3
        }
      });
      expect(actual[2].length).toBe(1);
      expect(actual[2][0]).toEqual({
        nodeName: 'TD',
        colspan: 1,
        rowspan: 1,
        content: BASIC_CELL_CONTENT,
        elementIndex: {
          rowIndex: 2,
          colIndex: 3
        }
      });
    });

    it('create new columns, when has table selection', () => {
      const startColIndex = 1;
      const endColIndex = 2;
      const actual = _createNewColumns(tableData, startColIndex, endColIndex);

      expect(actual.length).toBe(3);
      expect(actual[0].length).toBe(2);
      expect(actual[0][0]).toEqual({
        nodeName: 'TH',
        colspan: 1,
        rowspan: 1,
        content: BASIC_CELL_CONTENT,
        elementIndex: {
          rowIndex: 0,
          colIndex: 3
        }
      });
      expect(actual[0][1]).toEqual({
        nodeName: 'TH',
        colspan: 1,
        rowspan: 1,
        content: BASIC_CELL_CONTENT,
        elementIndex: {
          rowIndex: 0,
          colIndex: 3
        }
      });
      expect(actual[1].length).toBe(2);
      expect(actual[1][0]).toEqual({
        nodeName: 'TD',
        colspan: 1,
        rowspan: 1,
        content: BASIC_CELL_CONTENT,
        elementIndex: {
          rowIndex: 1,
          colIndex: 3
        }
      });
      expect(actual[1][1]).toEqual({
        nodeName: 'TD',
        colspan: 1,
        rowspan: 1,
        content: BASIC_CELL_CONTENT,
        elementIndex: {
          rowIndex: 1,
          colIndex: 3
        }
      });
      expect(actual[2].length).toBe(2);
      expect(actual[2][0]).toEqual({
        nodeName: 'TD',
        colspan: 1,
        rowspan: 1,
        content: BASIC_CELL_CONTENT,
        elementIndex: {
          rowIndex: 2,
          colIndex: 3
        }
      });
      expect(actual[2][1]).toEqual({
        nodeName: 'TD',
        colspan: 1,
        rowspan: 1,
        content: BASIC_CELL_CONTENT,
        elementIndex: {
          rowIndex: 2,
          colIndex: 3
        }
      });
    });
  });

  describe('_addColumns()', () => {
    const tableHtml = [
      '<table>',
      '<thead>',
      '<tr><th>title1</th><th>title2</th><th>title3</th></tr>',
      '</thead>',
      '<tbody>',
      '<tr><td colspan="3">content1-1</td><td>content1-2</td></tr>',
      '<tr><td>content2-1</td><td>content2-2</td><td>content2-3</td></tr>',
      '<tbody>',
      '</table>'
    ].join('');
    const $table = $(tableHtml);
    let tableData;

    beforeEach(() => {
      tableData = tableDataHandler.createTableData($table.get(0));
    });

    it('add columns, when target col has start merge cell(has colspan)', () => {
      const tableRange = {
        start: {
          rowIndex: 2,
          colIndex: 1
        },
        end: {
          rowIndex: 2,
          colIndex: 1
        }
      };

      _addColumns(tableData, tableRange);

      expect(tableData[0].length).toBe(4);
      expect(tableData[1][0].colspan).toBe(4);
      expect(tableData[1][2]).toEqual({
        nodeName: 'TD',
        colMergeWith: 0
      });
      expect(tableData[2][2]).toEqual({
        nodeName: 'TD',
        rowspan: 1,
        colspan: 1,
        content: BASIC_CELL_CONTENT,
        elementIndex: {
          rowIndex: 2,
          colIndex: 2
        }
      });
    });

    it('add columns, when target col has merged cell', () => {
      const tableRange = {
        start: {
          rowIndex: 2,
          colIndex: 0
        },
        end: {
          rowIndex: 2,
          colIndex: 0
        }
      };

      _addColumns(tableData, tableRange);

      expect(tableData[0].length).toBe(4);
      expect(tableData[1][0].colspan).toBe(4);
      expect(tableData[1][1]).toEqual({
        nodeName: 'TD',
        colMergeWith: 0
      });
      expect(tableData[2][1]).toEqual({
        nodeName: 'TD',
        rowspan: 1,
        colspan: 1,
        content: BASIC_CELL_CONTENT,
        elementIndex: {
          rowIndex: 2,
          colIndex: 1
        }
      });
    });

    it('add columns, when target col has last merged cell', () => {
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

      _addColumns(tableData, tableRange);

      expect(tableData[0].length).toBe(4);
      expect(tableData[1][0].colspan).toBe(3);
      expect(tableData[1][3]).toEqual({
        nodeName: 'TD',
        rowspan: 1,
        colspan: 1,
        content: BASIC_CELL_CONTENT,
        elementIndex: {
          rowIndex: 1,
          colIndex: 3
        }
      });
      expect(tableData[2][3]).toEqual({
        nodeName: 'TD',
        rowspan: 1,
        colspan: 1,
        content: BASIC_CELL_CONTENT,
        elementIndex: {
          rowIndex: 2,
          colIndex: 3
        }
      });
    });

    it('add columns, when has table selction', () => {
      const tableRange = {
        start: {
          rowIndex: 2,
          colIndex: 0
        },
        end: {
          rowIndex: 2,
          colIndex: 1
        }
      };

      _addColumns(tableData, tableRange);

      expect(tableData[0].length).toBe(5);
      expect(tableData[1][0].colspan).toBe(5);
      expect(tableData[1][2]).toEqual({
        nodeName: 'TD',
        colMergeWith: 0
      });
      expect(tableData[1][3]).toEqual({
        nodeName: 'TD',
        colMergeWith: 0
      });
      expect(tableData[2][2]).toEqual({
        nodeName: 'TD',
        rowspan: 1,
        colspan: 1,
        content: BASIC_CELL_CONTENT,
        elementIndex: {
          rowIndex: 2,
          colIndex: 2
        }
      });
      expect(tableData[2][3]).toEqual({
        nodeName: 'TD',
        rowspan: 1,
        colspan: 1,
        content: BASIC_CELL_CONTENT,
        elementIndex: {
          rowIndex: 2,
          colIndex: 2
        }
      });
    });
  });
});
