/**
 * @fileoverview Test table data handler
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import tableDataHandler, { createTableData, createCellIndexData } from '@/tableDataHandler';

describe('tableDataHandler', () => {
  describe('createTableData()', () => {
    it('create table data from jQuery table Element', () => {
      const tableHtml = [
        '<table>',
        '<thead>',
        '<tr><th colspan="2">title</th></tr>',
        '</thead>',
        '<tbody>',
        '<tr><td>content1-1</td><td rowspan="2">content1-2</td></tr>',
        '<tr><td>content2-1</td></tr>',
        '<tbody>',
        '</table>'
      ].join('');
      const $table = $(tableHtml);
      const actual = createTableData($table.get(0));

      expect(actual[0][0]).toEqual({
        nodeName: 'TH',
        colspan: 2,
        rowspan: 1,
        content: 'title',
        elementIndex: {
          rowIndex: 0,
          colIndex: 0
        }
      });
      expect(actual[0][1]).toEqual({
        nodeName: 'TH',
        colMergeWith: 0
      });
      expect(actual[1][0]).toEqual({
        nodeName: 'TD',
        colspan: 1,
        rowspan: 1,
        content: 'content1-1',
        elementIndex: {
          rowIndex: 1,
          colIndex: 0
        }
      });
      expect(actual[1][1]).toEqual({
        nodeName: 'TD',
        colspan: 1,
        rowspan: 2,
        content: 'content1-2',
        elementIndex: {
          rowIndex: 1,
          colIndex: 1
        }
      });
      expect(actual[2][0]).toEqual({
        nodeName: 'TD',
        colspan: 1,
        rowspan: 1,
        content: 'content2-1',
        elementIndex: {
          rowIndex: 2,
          colIndex: 0
        }
      });
      expect(actual[2][1]).toEqual({
        nodeName: 'TD',
        rowMergeWith: 1
      });
    });
  });

  describe('createCellIndexData()', () => {
    it('create cell index data from table data', () => {
      const tableData = [
        [
          {
            colspan: 2,
            rowspan: 1,
            content: 'title'
          },
          {
            colMergeWith: 0
          }
        ],
        [
          {
            colspan: 1,
            rowspan: 1,
            content: 'content1-1'
          },
          {
            colspan: 1,
            rowspan: 2,
            content: 'content1-2'
          }
        ],
        [
          {
            colspan: 1,
            rowspan: 1,
            content: 'content2-1'
          },
          {
            rowMergeWith: 1
          }
        ]
      ];
      const actual = createCellIndexData(tableData);

      expect(actual[0].length).toBe(1);
      expect(actual[0][0]).toEqual({
        rowIndex: 0,
        colIndex: 0
      });
      expect(actual[1].length).toBe(2);
      expect(actual[1][0]).toEqual({
        rowIndex: 1,
        colIndex: 0
      });
      expect(actual[1][1]).toEqual({
        rowIndex: 1,
        colIndex: 1
      });
      expect(actual[2][0]).toEqual({
        rowIndex: 2,
        colIndex: 0
      });
    });
  });

  describe('findRowMergedLastIndex()', () => {
    const tableData = [
      [
        {
          colspan: 2,
          rowspan: 1,
          content: 'title'
        },
        {
          colMergeWith: 0
        }
      ],
      [
        {
          colspan: 1,
          rowspan: 1,
          content: 'content1-1'
        },
        {
          colspan: 1,
          rowspan: 2,
          content: 'content1-2'
        }
      ],
      [
        {
          colspan: 1,
          rowspan: 1,
          content: 'content2-1'
        },
        {
          rowMergeWith: 1
        }
      ]
    ];

    it('find last index of row merged cells, when target cell is not merged cell', () => {
      const rowIndex = 1;
      const colIndex = 0;
      const actual = tableDataHandler.findRowMergedLastIndex(tableData, rowIndex, colIndex);

      expect(actual).toBe(1);
    });

    it('find last index of row merged cells, when target cell is meged cell', () => {
      const rowIndex = 1;
      const colIndex = 1;
      const actual = tableDataHandler.findRowMergedLastIndex(tableData, rowIndex, colIndex);

      expect(actual).toBe(2);
    });
  });

  describe('findColMergedLastIndex()', () => {
    const tableData = [
      [
        {
          colspan: 1,
          rowspan: 1,
          content: 'title1'
        },
        {
          colspan: 1,
          rowspan: 1,
          content: 'title2'
        }
      ],
      [
        {
          colspan: 2,
          rowspan: 1,
          content: 'content1-1'
        },
        {
          colMergeWith: 0
        }
      ],
      [
        {
          colspan: 1,
          rowspan: 1,
          content: 'content2-1'
        },
        {
          colspan: 1,
          rowspan: 1,
          content: 'content2-2'
        }
      ]
    ];

    it('find last cell index of col merged cells, when target cell is not merged cell', () => {
      const rowIndex = 2;
      const colIndex = 0;
      const actual = tableDataHandler.findColMergedLastIndex(tableData, rowIndex, colIndex);

      expect(actual).toBe(0);
    });

    it('find last cell index of col merged cells, when target cell is meged cell', () => {
      const rowIndex = 1;
      const colIndex = 0;
      const actual = tableDataHandler.findColMergedLastIndex(tableData, rowIndex, colIndex);

      expect(actual).toBe(1);
    });
  });
});
