/**
 * @fileoverview test merged table creator
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import {
  _extractPropertiesForMerge,
  _parseTableCell,
  _createTableObjectFrom$Table,
  _divideTrs,
  _mergeByColspan,
  _getRemovalTdCountsByRowspan,
  _mergeByRowspan
} from '@/extensions/table/mergedTableCreator';
import createMergedTable from '@/extensions/table/mergedTableCreator';

describe('mergedTableCreator', () => {
  describe('_extractPropertiesForMerge()', () => {
    it('Extract properties for merge, when type is "@cols" and value is "@cols=3:@rows=3:value"', () => {
      const value = '@cols=3:@rows=3:value';
      const type = '@cols';
      const oppossitType = '@rows';
      const actual = _extractPropertiesForMerge(value, type, oppossitType);

      expect(actual.length).toBe(2);
      expect(actual[0]).toBe(3);
      expect(actual[1]).toBe('@rows=3:value');
    });

    it('Extract properties for merge, when type is "@cols" and value is "@rows=3:@cols=3:value"', () => {
      const value = '@rows=3:@cols=3:value';
      const type = '@cols';
      const oppossitType = '@rows';
      const actual = _extractPropertiesForMerge(value, type, oppossitType);

      expect(actual.length).toBe(2);
      expect(actual[0]).toBe(3);
      expect(actual[1]).toBe('@rows=3:value');
    });

    it('Extract properties for merge, when type is "@rows" and value is "@cols=3:@rows=3:value"', () => {
      const value = '@cols=3:@rows=3:value';
      const type = '@rows';
      const oppossitType = '@cols';
      const actual = _extractPropertiesForMerge(value, type, oppossitType);

      expect(actual.length).toBe(2);
      expect(actual[0]).toBe(3);
      expect(actual[1]).toBe('@cols=3:value');
    });

    it('Extract properties for merge, when type is "@cols" and value is "@rows=3:@cols=3:value"', () => {
      const value = '@rows=3:@cols=3:value';
      const type = '@rows';
      const oppossitType = '@cols';
      const actual = _extractPropertiesForMerge(value, type, oppossitType);

      expect(actual.length).toBe(2);
      expect(actual[0]).toBe(3);
      expect(actual[1]).toBe('@cols=3:value');
    });

    it('Extract properties for merge, when type is "@cols" and value not has "@cols"', () => {
      const value = '@rows:value';
      const type = '@cols';
      const oppossitType = '@rows';
      const actual = _extractPropertiesForMerge(value, type, oppossitType);

      expect(actual.length).toBe(2);
      expect(actual[0]).toBe(1);
      expect(actual[1]).toBe('@rows:value');
    });

    it('Extract properties for merge, when type is "@rows" and value not has "@rows"', () => {
      const value = '@rows:value';
      const type = '@cols';
      const oppossitType = '@rows';
      const actual = _extractPropertiesForMerge(value, type, oppossitType);

      expect(actual.length).toBe(2);
      expect(actual[0]).toBe(1);
      expect(actual[1]).toBe('@rows:value');
    });
  });

  describe('_parseTableCell()', () => {
    it('Parse table cell value(innerHTML).', () => {
      const td = {
        nodeName: 'TD',
        innerHTML: '@rows=3:@cols=2:abcde',
        align: 'center'
      };
      const actual = _parseTableCell(td);

      expect(actual.nodeName).toBe('TD');
      expect(actual.colspan).toBe(2);
      expect(actual.rowspan).toBe(3);
      expect(actual.content).toBe('abcde');
      expect(actual.align).toBe('center');
    });

    it('Parse table cell content, when has only value.', () => {
      const th = {
        nodeName: 'TH',
        innerHTML: 'abcde'
      };
      const actual = _parseTableCell(th);

      expect(actual.nodeName).toBe('TH');
      expect(actual.colspan).toBe(1);
      expect(actual.rowspan).toBe(1);
      expect(actual.content).toBe('abcde');
    });
  });

  describe('_createTableObjectFrom$Table()', () => {
    it('Create json from jQuery table.', () => {
      const tableHtml = [
        '<table>',
        '<thead>',
        '<tr><th align="center">@cols=2:title1</th><th></th></tr>',
        '</thead>',
        '<tbody>',
        '<tr><td>content1-1</td><td>@rows=2:content1-2</td></tr>',
        '<tr><td>content2-1</td><td></td></tr>',
        '<tbody>',
        '</table>'
      ].join('');
      const $table = $(tableHtml);
      const actual = _createTableObjectFrom$Table($table);

      expect(actual.length).toBe(3);
      expect(actual[0].length).toBe(2);
      expect(actual[0][0]).toEqual({
        nodeName: 'TH',
        colspan: 2,
        rowspan: 1,
        content: 'title1',
        align: 'center'
      });
      expect(actual[0][1]).toEqual({
        nodeName: 'TH',
        colspan: 1,
        rowspan: 1,
        content: '',
        align: ''
      });
      expect(actual[1].length).toBe(2);
      expect(actual[1][0]).toEqual({
        nodeName: 'TD',
        colspan: 1,
        rowspan: 1,
        content: 'content1-1',
        align: ''
      });
      expect(actual[1][1]).toEqual({
        nodeName: 'TD',
        colspan: 1,
        rowspan: 2,
        content: 'content1-2',
        align: ''
      });
      expect(actual[2].length).toBe(2);
      expect(actual[2][0]).toEqual({
        nodeName: 'TD',
        colspan: 1,
        rowspan: 1,
        content: 'content2-1',
        align: ''
      });
      expect(actual[2][1]).toEqual({
        nodeName: 'TD',
        colspan: 1,
        rowspan: 1,
        content: '',
        align: ''
      });
    });
  });

  describe('_divideTrs()', () => {
    it('Divide tr list to thead and tbody.', () => {
      const table = [
        [
          {
            nodeName: 'TH'
          }, {
            nodeName: 'TH'
          }
        ], [
          {
            nodeName: 'TD'
          }, {
            nodeName: 'TD'
          }
        ]
      ];
      const actual = _divideTrs(table);

      expect(actual[0]).toEqual([
        [
          {
            nodeName: 'TH'
          }, {
            nodeName: 'TH'
          }
        ]
      ]);

      expect(actual[1]).toEqual([
        [
          {
            nodeName: 'TD'
          }, {
            nodeName: 'TD'
          }
        ]
      ]);
    });
  });

  describe('_mergeByColspan()', () => {
    it('Merge by colspan.', () => {
      const trs = [
        [
          {
            nodeName: 'TD',
            colspan: 2
          }, {
            nodeName: 'TD',
            colspan: 1
          }
        ]
      ];

      _mergeByColspan(trs);

      expect(trs[0].length).toBe(1);
      expect(trs[0][0]).toEqual({
        colspan: 2,
        nodeName: 'TD'
      });
    });
  });

  describe('_getRemovalTdCountsByRowspan()', () => {
    it('Get removal td counts by rowspan.', () => {
      const trs = [
        [
          {
            nodeName: 'TD',
            rowspan: 2,
            colspan: 1
          }, {
            nodeName: 'TD',
            rowspan: 3,
            colspan: 1
          }, {
            nodeName: 'TD',
            rowspan: 1
          }
        ], [
          {
            nodeName: 'TD',
            rowspan: 2,
            colspan: 1
          }, {
            nodeName: 'TD',
            rowspan: 1,
            colspan: 1
          }, {
            nodeName: 'TD',
            rowspan: 1,
            colspan: 1
          }
        ], [
          {
            nodeName: 'TD',
            rowspan: 1,
            colspan: 1
          }, {
            nodeName: 'TD',
            rowspan: 1,
            colspan: 1
          }, {
            nodeName: 'TD',
            rowspan: 1,
            colspan: 1
          }
        ]
      ];
      const actual = _getRemovalTdCountsByRowspan(trs);

      expect(actual.length).toBe(3);
      expect(actual[0]).toBe(0);
      expect(actual[1]).toBe(2);
      expect(actual[2]).toBe(2);
    });

    it('Get removal td counts by rowspan, when td has both rowspan and colspan.', () => {
      const trs = [
        [
          {
            nodeName: 'TD',
            rowspan: 2,
            colspan: 2
          }, {
            nodeName: 'TD',
            rowspan: 1,
            colspan: 1
          }
        ], [
          {
            nodeName: 'TD',
            rowspan: 1,
            colspan: 1
          }, {
            nodeName: 'TD',
            rowspan: 1,
            colspan: 1
          }, {
            nodeName: 'TD',
            rowspan: 1,
            colspan: 1
          }
        ], [
          {
            nodeName: 'TD',
            rowspan: 1,
            colspan: 1
          }, {
            nodeName: 'TD',
            rowspan: 1,
            colspan: 1
          }, {
            nodeName: 'TD',
            rowspan: 1,
            colspan: 1
          }
        ]
      ];
      const actual = _getRemovalTdCountsByRowspan(trs);

      expect(actual.length).toBe(3);
      expect(actual[0]).toBe(0);
      expect(actual[1]).toBe(2);
      expect(actual[2]).toBe(0);
    });
  });

  describe('_mergeByRowspan()', () => {
    it('Merge by rowspan.', () => {
      const trs = [
        [
          {
            nodeName: 'TD',
            rowspan: 2,
            colspan: 1
          }, {
            nodeName: 'TD',
            rowspan: 3,
            colspan: 1
          }, {
            nodeName: 'TD',
            rowspan: 1,
            colspan: 1

          }
        ], [
          {
            nodeName: 'TD',
            rowspan: 2,
            colspan: 1

          }, {
            nodeName: 'TD',
            rowspan: 1,
            colspan: 1

          }, {
            nodeName: 'TD',
            rowspan: 1,
            colspan: 1

          }
        ], [
          {
            nodeName: 'TD',
            rowspan: 1,
            colspan: 1

          }, {
            nodeName: 'TD',
            rowspan: 1,
            colspan: 1

          }, {
            nodeName: 'TD',
            rowspan: 1,
            colspan: 1
          }
        ]
      ];

      _mergeByRowspan(trs);

      expect(trs.length).toBe(3);
      expect(trs[0].length).toBe(3);
      expect(trs[0][0]).toEqual({
        nodeName: 'TD',
        rowspan: 2,
        colspan: 1
      });
      expect(trs[0][1]).toEqual({
        nodeName: 'TD',
        rowspan: 3,
        colspan: 1
      });
      expect(trs[0][2]).toEqual({
        nodeName: 'TD',
        rowspan: 1,
        colspan: 1
      });
      expect(trs[1].length).toBe(1);
      expect(trs[1][0]).toEqual({
        nodeName: 'TD',
        rowspan: 2,
        colspan: 1
      });
      expect(trs[2].length).toBe(1);
      expect(trs[2][0]).toEqual({
        nodeName: 'TD',
        rowspan: 1,
        colspan: 1
      });
    });
  });

  describe('createMergedTable()', () => {
    it('Create merged table by @cols, @rows value in td innerHTML.', () => {
      const tableHtml = [
        '<table>',
        '<thead>',
        '<tr><th align="center">@cols=2:title1</th><th></th></tr>',
        '</thead>',
        '<tbody>',
        '<tr><td>content1-1</td><td>@rows=2:content1-2</td><td>content1-3</td></tr>',
        '<tr><td>content2-1</td><td>content2-3</td><td></td></tr>',
        '<tbody>',
        '</table>'
      ].join('');
      const tableElement = $(tableHtml)[0];
      const $actual = $(createMergedTable(tableElement));
      const $trs = $actual.find('tr');

      expect($trs.eq(0).find('th').eq(0).attr('colspan')).toBe('2');
      expect($trs.eq(1).find('td').length).toBe(3);
      expect($trs.eq(1).find('td').eq(1).attr('rowspan')).toBe('2');
      expect($trs.eq(2).find('td').length).toBe(2);
    });
  });
});
