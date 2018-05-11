/**
 * @fileoverview test wysiwyg table manager
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';

import '../../../../src/js/extensions/table/langs';
import WysiwygEditor from '../../../../src/js/wysiwygEditor';
import EventManager from '../../../../src/js/eventManager';
import WwMergedTableManager from '../../../../src/js/extensions/table/wwMergedTableManager';
import WwTableMergedSelectionManager from '../../../../src/js/extensions/table/wwMergedTableSelectionManager';
import tableDataHandler from '../../../../src/js/extensions/table/tableDataHandler';

describe('WwMergedTableManager', () => {
  let container, em, wwe, mgr;
  const basicTableHtml = [
    '<table>',
    '<thead>',
    '<tr><th>title1</th><th>title2</th><th>title3</th><th>title4</th></tr>',
    '</thead>',
    '<tbody>',
    '<tr><td>a</td><td>b</td><td>c</td><td>d</td></tr>',
    '<tr><td>e</td><td>f</td><td>g</td><td>h</td/></tr>',
    '<tr><td>i</td><td>j</td><td>k</td><td>l</td></tr>',
    '<tr><td>m</td><td>n</td><td>o</td><td>p</td></tr>',
    '</tbody>',
    '</table>'
  ].join('');

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    em = new EventManager();

    wwe = new WysiwygEditor($(container), em);

    wwe.init();

    mgr = new WwMergedTableManager(wwe);
    wwe.componentManager.addManager('tableSelection', WwTableMergedSelectionManager);
    wwe.focus();
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      if (container.parentNode) {
        document.body.removeChild(container);
      }
      done();
    });
  });

  describe('_pasteToSelectedArea', () => {
    let $table;

    beforeEach(() => {
      document.body.removeChild(container);
      container = document.createElement('div');
      $table = $(basicTableHtml);

      $(container).append($table);
      spyOn(mgr, '_bookmarkLastTd');
    });

    it('Paste to selected area, when exactly fit table selection by clipboard table data.', () => {
      const $clipboardTable = $([
        '<table>',
        '<tr><td>1</td><td>2</td></tr>',
        '<tr><td>3</td><td>4</td></tr>',
        '</table>'
      ].join(''));

      const clipboardTableData = tableDataHandler.createTableData($clipboardTable);
      const tableData = tableDataHandler.createTableData($table);
      const $selectedCells = $table.find('tbody td');

      mgr._pasteToSelectedArea($table, clipboardTableData, tableData, $selectedCells);

      const $trs = $(container).find('tbody tr');

      expect($trs.eq(0).html()).toBe('<td>1</td><td>2</td><td>1</td><td>2</td>');
      expect($trs.eq(1).html()).toBe('<td>3</td><td>4</td><td>3</td><td>4</td>');
      expect($trs.eq(2).html()).toBe('<td>1</td><td>2</td><td>1</td><td>2</td>');
      expect($trs.eq(3).html()).toBe('<td>3</td><td>4</td><td>3</td><td>4</td>');
      expect(mgr._bookmarkLastTd).toHaveBeenCalledWith({
        rowIndex: 4,
        colIndex: 3
      });
    });

    it('Paste to selected area, when selection is lager than clipboard table data', () => {
      const $clipboardTable = $([
        '<table>',
        '<tr><td>1</td><td>2</td></tr>',
        '<tr><td>3</td><td>4</td></tr>',
        '</table>'
      ].join(''));

      const clipboardTableData = tableDataHandler.createTableData($clipboardTable);
      const tableData = tableDataHandler.createTableData($table);
      const $selectedCells = $table.find('tbody').find('tr:nth-child(1), tr:nth-child(2), tr:nth-child(3)')
        .find('td:nth-child(1), td:nth-child(2), td:nth-child(3)');

      mgr._pasteToSelectedArea($table, clipboardTableData, tableData, $selectedCells);

      const $trs = $(container).first().find('tr');

      expect($trs.eq(1).html()).toBe('<td>1</td><td>2</td><td>c</td><td>d</td>');
      expect($trs.eq(2).html()).toBe('<td>3</td><td>4</td><td>g</td><td>h</td>');
      expect($trs.eq(3).html()).toBe('<td>i</td><td>j</td><td>k</td><td>l</td>');
      expect(mgr._bookmarkLastTd).toHaveBeenCalledWith({
        rowIndex: 2,
        colIndex: 1
      });
    });

    it('If selection is lager than clipboard table data and merged boundary of paste target, will not paste.', () => {
      const $clipboardTable = $([
        '<table>',
        '<tr><td>1</td><td>2</td></tr>',
        '<tr><td>3</td><td>4</td></tr>',
        '</table>'
      ].join(''));

      spyOn(window, 'alert');
      spyOn(wwe, 'focus');

      $table.find('tbody').find('tr:nth-child(2)').find('td:nth-child(2)').attr('colspan', 2);
      $table.find('tbody').find('tr:nth-child(2)').find('td:nth-child(3)').remove();

      const clipboardTableData = tableDataHandler.createTableData($clipboardTable);
      const tableData = tableDataHandler.createTableData($table);
      const $selectedCells = $table.find('tbody').find('tr:nth-child(1), tr:nth-child(2), tr:nth-child(3)')
        .find('td:nth-child(1), td:nth-child(2), td:nth-child(3)');

      mgr._pasteToSelectedArea($table, clipboardTableData, tableData, $selectedCells);

      expect(window.alert).toHaveBeenCalled();
      expect(wwe.focus).toHaveBeenCalled();
      expect(mgr._bookmarkLastTd).not.toHaveBeenCalled();
    });

    it('Paste to selected area, when selection is smaller than clipboard tata.', () => {
      const $clipboardTable = $([
        '<table>',
        '<tr><td>1</td><td>2</td></tr>',
        '<tr><td>3</td><td>4</td></tr>',
        '</table>'
      ].join(''));

      const clipboardTableData = tableDataHandler.createTableData($clipboardTable);
      const tableData = tableDataHandler.createTableData($table);
      const $selectedCells = $table.find('tbody').find('tr:nth-child(1), tr:nth-child(2)')
        .find('td:nth-child(2)');

      mgr._pasteToSelectedArea($table, clipboardTableData, tableData, $selectedCells);

      const $trs = $(container).first().find('tr');

      expect($trs.eq(1).html()).toBe('<td>a</td><td>1</td><td>c</td><td>d</td>');
      expect($trs.eq(2).html()).toBe('<td>e</td><td>3</td><td>g</td><td>h</td>');
      expect($trs.eq(3).html()).toBe('<td>i</td><td>j</td><td>k</td><td>l</td>');
      expect(mgr._bookmarkLastTd).toHaveBeenCalledWith({
        rowIndex: 2,
        colIndex: 1
      });
    });

    it('If selection is smaller than clipboard table data and merged boundary of data for paste in clipboard, will not paste.', () => {
      const $clipboardTable = $([
        '<table>',
        '<tr><td>1</td><td>2</td></tr>',
        '<tr><td colspan="2">3</td></tr>',
        '</table>'
      ].join(''));

      spyOn(window, 'alert');
      spyOn(wwe, 'focus');

      const clipboardTableData = tableDataHandler.createTableData($clipboardTable);
      const tableData = tableDataHandler.createTableData($table);
      const $selectedCells = $table.find('tbody').find('tr:nth-child(1), tr:nth-child(2)')
        .find('td:nth-child(2)');

      mgr._pasteToSelectedArea($table, clipboardTableData, tableData, $selectedCells);

      expect(window.alert).toHaveBeenCalled();
      expect(wwe.focus).toHaveBeenCalled();
      expect(mgr._bookmarkLastTd).not.toHaveBeenCalled();
    });
  });

  describe('_pasteAllClipboardTableData', () => {
    let $table;

    beforeEach(() => {
      document.body.removeChild(container);
      container = document.createElement('div');
      $table = $(basicTableHtml);

      $(container).append($table);
      spyOn(mgr, '_bookmarkLastTd');
    });

    it('Paste all clipboard table data.', () => {
      const $clipboardTable = $([
        '<table>',
        '<tr><td>1</td><td>2</td></tr>',
        '<tr><td>3</td><td>4</td></tr>',
        '</table>'
      ].join(''));

      const clipboardTableData = tableDataHandler.createTableData($clipboardTable);
      const tableData = tableDataHandler.createTableData($table);
      const startCellIndex = {
        rowIndex: 4,
        colIndex: 3
      };

      expect($table.find('tbody tr').length).toBe(4);
      expect($table.find('thead th').length).toBe(4);

      mgr._pasteAllClipboardTableData($table, clipboardTableData, tableData, startCellIndex);

      const $trs = $(container).first().find('tr');
      const cellContent = util.browser.msie ? '' : '<br>';

      expect($trs.length).toBe(6);
      expect($trs.eq(0).children().length).toBe(5);
      expect($trs.eq(4).html()).toBe('<td>m</td><td>n</td><td>o</td><td>1</td><td>2</td>');
      expect($trs.eq(5).html())
        .toBe(`<td>${cellContent}</td><td>${cellContent}</td><td>${cellContent}</td><td>3</td><td>4</td>`);
      expect(mgr._bookmarkLastTd).toHaveBeenCalledWith({
        rowIndex: 5,
        colIndex: 4
      });
    });

    it('If merged boundary of paste target, will not paste.', () => {
      const $clipboardTable = $([
        '<table>',
        '<tr><td>1</td><td>2</td></tr>',
        '<tr><td>3</td><td>4</td></tr>',
        '</table>'
      ].join(''));

      spyOn(window, 'alert');

      $table.find('tbody').find('tr:nth-child(2)').find('td:nth-child(2)').attr('colspan', 2);
      $table.find('tbody').find('tr:nth-child(2)').find('td:nth-child(3)').remove();

      const clipboardTableData = tableDataHandler.createTableData($clipboardTable);
      const tableData = tableDataHandler.createTableData($table);
      const startCellIndex = {
        rowIndex: 1,
        colIndex: 0
      };

      mgr._pasteAllClipboardTableData($table, clipboardTableData, tableData, startCellIndex);

      expect(window.alert).toHaveBeenCalled();
      expect(mgr._bookmarkLastTd).not.toHaveBeenCalled();
    });
  });
});
