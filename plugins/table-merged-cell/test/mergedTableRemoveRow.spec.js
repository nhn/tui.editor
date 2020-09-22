/**
 * @fileoverview Test merged table remove row
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';
import { firefox } from 'tui-code-snippet/browser/browser';

import Editor from '@toast-ui/editor';

import tableMergedCellPlugin from '@';
import tableDataHandler from '@/tableDataHandler';
import { getWwRemoveRowCommand, _removeRow } from '@/mergedTableRemoveRow';

/* eslint-disable max-nested-callbacks */
describe('mergedTableRemoveRow', () => {
  describe('_removeRow()', () => {
    const tableHtml = `
      <table>
        <thead>
          <tr><th>title1</th><th>title2</th></tr>
        </thead>
        <tbody>
          <tr><td rowspan="3">content1-1</td><td>content1-2</td></tr>
          <tr><td>content2-2</td></tr>
          <tr><td>content3-2</td></tr>
        <tbody>
      </table>
    `;
    const $table = $(tableHtml);
    let tableData;

    beforeEach(() => {
      tableData = tableDataHandler.createTableData($table.get(0));
    });

    it('remove row, when target row has start merge cell(has rowspan)', () => {
      const tableRange = {
        start: {
          rowIndex: 1,
          colIndex: 1
        },
        end: {
          rowIndex: 1,
          colIndex: 1
        }
      };

      _removeRow(tableData, tableRange);

      expect(tableData.length).toBe(3);
      expect(tableData[1][0]).toEqual({
        nodeName: 'TD',
        rowspan: 2,
        colspan: 1,
        content: 'content1-1',
        elementIndex: {
          rowIndex: 1,
          colIndex: 0
        }
      });
      expect(tableData[1][1]).toEqual({
        nodeName: 'TD',
        rowspan: 1,
        colspan: 1,
        content: 'content2-2',
        elementIndex: {
          rowIndex: 2,
          colIndex: 0
        }
      });
    });

    it('remove row, when target row has merged cell', () => {
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

      _removeRow(tableData, tableRange);

      expect(tableData.length).toBe(3);
      expect(tableData[1][0].rowspan).toBe(2);
      expect(tableData[2][0]).toEqual({
        nodeName: 'TD',
        rowMergeWith: 1
      });
      expect(tableData[2][1]).toEqual({
        nodeName: 'TD',
        rowspan: 1,
        colspan: 1,
        content: 'content3-2',
        elementIndex: {
          rowIndex: 3,
          colIndex: 0
        }
      });
    });

    it('remove row, when target row has last merged cell', () => {
      const tableRange = {
        start: {
          rowIndex: 3,
          colIndex: 1
        },
        end: {
          rowIndex: 3,
          colIndex: 1
        }
      };

      _removeRow(tableData, tableRange);

      expect(tableData.length).toBe(3);
      expect(tableData[1][0].rowspan).toBe(2);
      expect(tableData[2][0]).toEqual({
        nodeName: 'TD',
        rowMergeWith: 1
      });
      expect(tableData[2][1]).toEqual({
        nodeName: 'TD',
        rowspan: 1,
        colspan: 1,
        content: 'content2-2',
        elementIndex: {
          rowIndex: 2,
          colIndex: 0
        }
      });
    });

    it('remove row, when has table selection', () => {
      const tableRange = {
        start: {
          rowIndex: 2,
          colIndex: 1
        },
        end: {
          rowIndex: 3,
          colIndex: 1
        }
      };

      _removeRow(tableData, tableRange);

      expect(tableData.length).toBe(2);
      expect(tableData[1][0].rowspan).toBe(1);
      expect(tableData[1][1]).toEqual({
        nodeName: 'TD',
        rowspan: 1,
        colspan: 1,
        content: 'content1-2',
        elementIndex: {
          rowIndex: 1,
          colIndex: 1
        }
      });
    });

    it('should remove the table if no table body but header', () => {
      const tableRange = {
        start: {
          rowIndex: 1,
          colIndex: 0
        },
        end: {
          rowIndex: 1,
          colIndex: 0
        }
      };

      _removeRow(tableData, tableRange);

      expect(tableData.length).toBe(0);
    });

    it('should not remove THs', () => {
      const tableRange = {
        start: {
          rowIndex: 0,
          colIndex: 0
        },
        end: {
          rowIndex: 0,
          colIndex: 0
        }
      };

      _removeRow(tableData, tableRange);

      expect(tableData.length).toBe(4);
    });

    it('should remove only TDs even if THs are in selection', () => {
      const tableRange = {
        start: {
          rowIndex: 0,
          colIndex: 1
        },
        end: {
          rowIndex: 1,
          colIndex: 1
        }
      };

      _removeRow(tableData, tableRange);

      expect(tableData.length).toBe(3);
    });
  });

  describe('RemoveRow command with browser selection', () => {
    let editor, wwe, container;

    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);

      editor = new Editor({
        el: container,
        height: '300px',
        initialEditType: 'wysiwyg',
        plugins: [tableMergedCellPlugin]
      });

      wwe = editor.getCurrentModeEditor();
      wwe.getEditor().focus();

      if (firefox) {
        wwe.getEditor().fireEvent('focus'); // focus() does not work on firefox here. wired.
      }
    });

    // we need to wait squire input event process
    afterEach(done => {
      setTimeout(() => {
        container.parentNode.removeChild(container);
        done();
      });
    });

    it('remove only one row at start range even if there are multiple tds in selection range', () => {
      const sq = wwe.getEditor();
      const range = sq.getSelection().cloneRange();

      sq.setHTML(`
        <table>
          <thead>
            <tr><th>1</th><th>2</th></tr>
          </thead>
          <tbody>
            <tr><td>3</td><td>4</td></tr>
            <tr><td>5</td><td>6</td></tr>
          </tbody>
        </table>
      `);

      range.setStartAfter(wwe.getBody().querySelectorAll('tbody td')[0].firstChild);
      range.setEndAfter(wwe.getBody().querySelectorAll('tbody td')[3].firstChild);
      sq.setSelection(range);
      sq._updatePathOnEvent(); // squire need update path for hasFormatWithRx

      const commandManger = getWwRemoveRowCommand(editor);

      commandManger.exec(wwe);

      expect(wwe.getBody().querySelectorAll('tbody tr').length).toEqual(1);
      expect(wwe.getBody().querySelectorAll('tbody td').length).toEqual(2);
    });
  });
});
