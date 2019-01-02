/**
 * @fileoverview test merged table remove col
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';

import RemoveCol, {_removeColumns} from '../../../../src/js/extensions/table/mergedTableRemoveCol';
import tableDataHandler from '../../../../src/js/extensions/table/tableDataHandler';
import WwMergedTableSelectionManager from '../../../../src/js/extensions/table/wwMergedTableSelectionManager';
import WwMergedTableManager from '../../../../src/js/extensions/table/wwMergedTableManager';
import WysiwygEditor from '../../../../src/js/wysiwygEditor';
import EventManager from '../../../../src/js/eventManager';

describe('mergedTableRemoveCol', () => {
  describe('_removeColumns()', () => {
    const tableHtml = `
            <table>
                <thead>
                    <tr><th>title1</th><th>title2</th><th>title3</th></tr>
                </thead>
                <tbody>
                    <tr><td colspan="3">content1-1</td></tr>
                    <tr><td>content2-1</td><td>content2-2</td><td>content2-3</td></tr>
                <tbody>
            </table>`;
    const $table = $(tableHtml);
    let tableData;

    beforeEach(() => {
      tableData = tableDataHandler.createTableData($table);
    });

    it('Remove columns, when target cell data has start merge cell(has colspan).', () => {
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
      _removeColumns(tableData, tableRange);

      expect(tableData[0].length).toBe(2);
      expect(tableData[1][0]).toEqual({
        nodeName: 'TD',
        rowspan: 1,
        colspan: 2,
        content: 'content1-1',
        elementIndex: {
          rowIndex: 1,
          colIndex: 0
        }
      });
      expect(tableData[2][0]).toEqual({
        nodeName: 'TD',
        rowspan: 1,
        colspan: 1,
        content: 'content2-2',
        elementIndex: {
          rowIndex: 2,
          colIndex: 1
        }
      });
    });

    it('Remove columns, when target cell data has merged cell.', () => {
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
      _removeColumns(tableData, tableRange);

      expect(tableData[0].length).toBe(2);
      expect(tableData[1][0].colspan).toBe(2);
      expect(tableData[1][1]).toEqual({
        nodeName: 'TD',
        colMergeWith: 0
      });
      expect(tableData[2][1]).toEqual({
        nodeName: 'TD',
        rowspan: 1,
        colspan: 1,
        content: 'content2-3',
        elementIndex: {
          rowIndex: 2,
          colIndex: 2
        }
      });
    });

    it('Remove columns, when target cell data has last merged cell.', () => {
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
      _removeColumns(tableData, tableRange);

      expect(tableData[0].length).toBe(2);
      expect(tableData[1][0].colspan).toBe(2);
      expect(tableData[1][1]).toEqual({
        nodeName: 'TD',
        colMergeWith: 0
      });
      expect(tableData[2][1]).toEqual({
        nodeName: 'TD',
        rowspan: 1,
        colspan: 1,
        content: 'content2-2',
        elementIndex: {
          rowIndex: 2,
          colIndex: 1
        }
      });
    });

    it('Remove columns, when has table selection.', () => {
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
      _removeColumns(tableData, tableRange);

      expect(tableData[0].length).toBe(1);
      expect(tableData[1][0].colspan).toBe(1);
      expect(tableData[2][0]).toEqual({
        nodeName: 'TD',
        rowspan: 1,
        colspan: 1,
        content: 'content2-3',
        elementIndex: {
          rowIndex: 2,
          colIndex: 2
        }
      });
    });
  });

  describe('RemoveCol command with browser selection', () => {
    let wwe, container;

    beforeEach(() => {
      container = document.createElement('div');

      document.body.appendChild(container);

      wwe = new WysiwygEditor($(container), new EventManager());

      wwe.init();
      wwe.componentManager.addManager('tableSelection', WwMergedTableSelectionManager);
      wwe.componentManager.addManager('table', WwMergedTableManager);

      wwe.getEditor().focus();
      if (util.browser.firefox) {
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

    it('should remove all cells if there are multiple tds in range', () => {
      const sq = wwe.getEditor();
      const range = sq.getSelection().cloneRange();

      sq.setHTML(
        `<table>
                    <thead>
                        <tr><th>1</th><th>2</th><th>3</th></tr>
                    </thead>
                    <tbody>
                        <tr><td class="te-cell-selected">4</td><td class="te-cell-selected">5</td><td>6</td></tr>
                        <tr><td>7</td><td>8</td><td>9</td></tr>
                    </tbody>
                </table>`
      );

      range.setStartAfter(wwe.get$Body().find('tbody td')[0].firstChild);
      range.setEndAfter(wwe.get$Body().find('tbody td')[1].firstChild);
      sq.setSelection(range);

      RemoveCol.exec(wwe);

      expect(wwe.get$Body().find('thead th').length).toBe(1);
      expect(wwe.get$Body().find('tbody td').length).toBe(2);
    });
  });
});
