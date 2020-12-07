import { oneLineTrim } from 'common-tags';

import WysiwygEditor from '@/wysiwyg/wwEditor';
import EventEmitter from '@/event/eventEmitter';
import CommandManager from '@/commands/commandManager';
import CellSelection from '@/wysiwyg/plugins/tableSelection/cellSelection';

import { getTableCellsInfo } from '@/wysiwyg/helper/table';

describe('wysiwyg table commands', () => {
  let container: HTMLElement, wwe: WysiwygEditor, em: EventEmitter, cmd: CommandManager;

  function selectCells(from: number, to: number) {
    const { state, dispatch } = wwe.view;
    const { doc, tr } = state;

    const startCellPos = doc.resolve(from);
    const endCellPos = doc.resolve(to);
    const selection = new CellSelection(startCellPos, endCellPos);

    dispatch!(tr.setSelection(selection));
  }

  function setCellSelection(
    [startRowIndex, startColumnIndex]: number[],
    [endRowIndex, endColumnIndex]: number[],
    cellSelection = true
  ) {
    const doc = wwe.getModel();
    const cellsInfo = getTableCellsInfo(doc.resolve(1));

    const startCellOffset = cellsInfo[startRowIndex][startColumnIndex].offset;
    const endCellOffset = cellsInfo[endRowIndex][endColumnIndex].offset;

    if (startCellOffset === endCellOffset && !cellSelection) {
      const from = startCellOffset + 1;

      wwe.setSelection(from, from);
    } else {
      selectCells(startCellOffset, endCellOffset);
    }
  }

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    em = new EventEmitter();
    wwe = new WysiwygEditor(container, em);
    cmd = new CommandManager(em, {}, wwe.commands);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('addTable command', () => {
    it('should create one by one table', () => {
      cmd.exec('wysiwyg', 'addTable');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th><br></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should create table with column and row count', () => {
      cmd.exec('wysiwyg', 'addTable', { columns: 2, rows: 3 });

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th><br></th>
              <th><br></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><br></td>
              <td><br></td>
            </tr>
            <tr>
              <td><br></td>
              <td><br></td>
            </tr>
            <tr>
              <td><br></td>
              <td><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should create table with data', () => {
      cmd.exec('wysiwyg', 'addTable', { columns: 2, rows: 1, data: ['foo', 'bar', 'baz', 'qux'] });

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th>foo</th>
              <th>bar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>baz</td>
              <td>qux</td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });
  });

  describe('removeTable command', () => {
    beforeEach(() => {
      cmd.exec('wysiwyg', 'addTable');
    });

    it('should remove table when cursor is in table hedaer', () => {
      setCellSelection([0, 0], [0, 0], false);

      cmd.exec('wysiwyg', 'removeTable');

      expect(wwe.getHTML()).toBe('<p><br></p>');
    });

    it('should remove table when cursor is in table body', () => {
      setCellSelection([1, 0], [1, 0], false);

      cmd.exec('wysiwyg', 'removeTable');

      expect(wwe.getHTML()).toBe('<p><br></p>');
    });

    it('should remove table when selected cells', () => {
      setCellSelection([0, 0], [1, 0]);

      cmd.exec('wysiwyg', 'removeTable');

      expect(wwe.getHTML()).toBe('<p><br></p>');
    });
  });

  describe('addRowToDown command', () => {
    beforeEach(() => {
      cmd.exec('wysiwyg', 'addTable', {
        columns: 2,
        rows: 2,
        data: ['foo', 'bar', 'baz', 'qux', 'quux', 'quuz']
      });
    });

    it('should add a row to next row of current cursor cell', () => {
      setCellSelection([1, 1], [1, 1], false); // select 'baz' cell

      cmd.exec('wysiwyg', 'addRowToDown');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th>foo</th>
              <th>bar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>baz</td>
              <td>qux</td>
            </tr>
            <tr>
              <td><br></td>
              <td><br></td>
            </tr>
            <tr>
              <td>quux</td>
              <td>quuz</td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should add rows as selected row count after selection', () => {
      setCellSelection([0, 0], [1, 1]); // select from 'foo' to 'qux' cells

      cmd.exec('wysiwyg', 'addRowToDown');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th class="te-cell-selected">foo</th>
              <th class="te-cell-selected">bar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="te-cell-selected">baz</td>
              <td class="te-cell-selected">qux</td>
            </tr>
            <tr>
              <td><br></td>
              <td><br></td>
            </tr>
            <tr>
              <td><br></td>
              <td><br></td>
            </tr>
            <tr>
              <td>quux</td>
              <td>quuz</td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should not add a row when selection is only at table head', () => {
      setCellSelection([0, 0], [0, 1]); // select from 'foo' to 'bar' cells

      cmd.exec('wysiwyg', 'addRowToDown');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th class="te-cell-selected">foo</th>
              <th class="te-cell-selected">bar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>baz</td>
              <td>qux</td>
            </tr>
            <tr>
              <td>quux</td>
              <td>quuz</td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });
  });

  describe('addRowToUp command', () => {
    beforeEach(() => {
      cmd.exec('wysiwyg', 'addTable', {
        columns: 2,
        rows: 2,
        data: ['foo', 'bar', 'baz', 'qux', 'quux', 'quuz']
      });
    });

    it('should add a row to previous row of current cursor cell', () => {
      setCellSelection([1, 1], [1, 1], false); // select 'baz' cell

      cmd.exec('wysiwyg', 'addRowToUp');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th>foo</th>
              <th>bar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><br></td>
              <td><br></td>
            </tr>
            <tr>
              <td>baz</td>
              <td>qux</td>
            </tr>
            <tr>
              <td>quux</td>
              <td>quuz</td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should add rows as selected row count before selection', () => {
      setCellSelection([1, 1], [2, 1]); // select from 'qux' to 'quuz' cells

      cmd.exec('wysiwyg', 'addRowToUp');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th>foo</th>
              <th>bar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><br></td>
              <td><br></td>
            </tr>
            <tr>
              <td><br></td>
              <td><br></td>
            </tr>
            <tr>
              <td>baz</td>
              <td class="te-cell-selected">qux</td>
            </tr>
            <tr>
              <td>quux</td>
              <td class="te-cell-selected">quuz</td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should not add a row when selection include table head', () => {
      setCellSelection([0, 0], [1, 0]); // select from 'foo' to 'baz' cells

      cmd.exec('wysiwyg', 'addRowToUp');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th class="te-cell-selected">foo</th>
              <th>bar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="te-cell-selected">baz</td>
              <td>qux</td>
            </tr>
            <tr>
              <td>quux</td>
              <td>quuz</td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });
  });

  describe('removeRow command', () => {
    beforeEach(() => {
      cmd.exec('wysiwyg', 'addTable', {
        columns: 2,
        rows: 3,
        data: ['foo', 'bar', 'baz', 'qux', 'quux', 'quuz', 'corge', '']
      });
    });

    it('should remove a row where current cursor cell is located', () => {
      setCellSelection([1, 1], [1, 1], false); // select from 'qux' cell

      cmd.exec('wysiwyg', 'removeRow');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th>foo</th>
              <th>bar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>quux</td>
              <td>quuz</td>
            </tr>
            <tr>
              <td>corge</td>
              <td><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should remove columns as selected column count in selection', () => {
      setCellSelection([3, 1], [2, 1]); // select from last to 'quuz' cells

      cmd.exec('wysiwyg', 'removeRow');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th>foo</th>
              <th>bar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>baz</td>
              <td>qux</td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should not remove rows when selection include table head', () => {
      setCellSelection([0, 1], [2, 1]); // select from 'bar' to 'qux' cells

      cmd.exec('wysiwyg', 'removeRow');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th>foo</th>
              <th class="te-cell-selected">bar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>baz</td>
              <td class="te-cell-selected">qux</td>
            </tr>
            <tr>
              <td>quux</td>
              <td class="te-cell-selected">quuz</td>
            </tr>
            <tr>
              <td>corge</td>
              <td><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should not remove rows when all rows of table body are selected', () => {
      setCellSelection([1, 0], [3, 0]); // select from 'baz' to 'corge' cells

      cmd.exec('wysiwyg', 'removeRow');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th>foo</th>
              <th>bar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="te-cell-selected">baz</td>
              <td>qux</td>
            </tr>
            <tr>
              <td class="te-cell-selected">quux</td>
              <td>quuz</td>
            </tr>
            <tr>
              <td class="te-cell-selected">corge</td>
              <td><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });
  });

  describe('addColumnToRight command', () => {
    beforeEach(() => {
      cmd.exec('wysiwyg', 'addTable', {
        columns: 3,
        rows: 2,
        data: ['foo', 'bar', 'baz', 'qux', 'quux', 'quuz', 'corge', 'grault', '']
      });
    });

    it('should add a column to next column of current cursor cell', () => {
      setCellSelection([1, 1], [1, 1], false); // select 'quux' cell

      cmd.exec('wysiwyg', 'addColumnToRight');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th>foo</th>
              <th>bar</th>
              <th><br></th>
              <th>baz</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>qux</td>
              <td>quux</td>
              <td><br></td>
              <td>quuz</td>
            </tr>
            <tr>
              <td>corge</td>
              <td>grault</td>
              <td><br></td>
              <td><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should add columns as selected column count to right of selection', () => {
      setCellSelection([0, 0], [1, 1]); // select from 'foo' to 'quux' cells

      cmd.exec('wysiwyg', 'addColumnToRight');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th class="te-cell-selected">foo</th>
              <th class="te-cell-selected">bar</th>
              <th><br></th>
              <th><br></th>
              <th>baz</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="te-cell-selected">qux</td>
              <td class="te-cell-selected">quux</td>
              <td><br></td>
              <td><br></td>
              <td>quuz</td>
            </tr>
            <tr>
              <td>corge</td>
              <td>grault</td>
              <td><br></td>
              <td><br></td>
              <td><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });
  });

  describe('addColumnToLeft command', () => {
    beforeEach(() => {
      cmd.exec('wysiwyg', 'addTable', {
        columns: 3,
        rows: 2,
        data: ['foo', 'bar', 'baz', 'qux', 'quux', 'quuz', 'corge', 'grault', '']
      });
    });

    it('should add a column to previous column of current cursor cell', () => {
      setCellSelection([1, 1], [1, 1], false); // select 'quux' cell

      cmd.exec('wysiwyg', 'addColumnToLeft');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th>foo</th>
              <th><br></th>
              <th>bar</th>
              <th>baz</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>qux</td>
              <td><br></td>
              <td>quux</td>
              <td>quuz</td>
            </tr>
            <tr>
              <td>corge</td>
              <td><br></td>
              <td>grault</td>
              <td><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should add columns as selected column count to right of selection', () => {
      setCellSelection([0, 1], [2, 2]); // select from 'bar' to last cells

      cmd.exec('wysiwyg', 'addColumnToLeft');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th>foo</th>
              <th><br></th>
              <th><br></th>
              <th class="te-cell-selected">bar</th>
              <th class="te-cell-selected">baz</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>qux</td>
              <td><br></td>
              <td><br></td>
              <td class="te-cell-selected">quux</td>
              <td class="te-cell-selected">quuz</td>
            </tr>
            <tr>
              <td>corge</td>
              <td><br></td>
              <td><br></td>
              <td class="te-cell-selected">grault</td>
              <td class="te-cell-selected"><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });
  });

  describe('removeColumn command', () => {
    beforeEach(() => {
      cmd.exec('wysiwyg', 'addTable', {
        columns: 3,
        rows: 2,
        data: ['foo', 'bar', 'baz', 'qux', 'quux', 'quuz', 'corge', 'grault', '']
      });
    });

    it('should remove a column where current cursor cell is located', () => {
      setCellSelection([1, 1], [1, 1], false); // select 'quux' cell

      cmd.exec('wysiwyg', 'removeColumn');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th>foo</th>
              <th>baz</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>qux</td>
              <td>quuz</td>
            </tr>
            <tr>
              <td>corge</td>
              <td><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should remove columns as selected column count in selection', () => {
      setCellSelection([0, 1], [2, 2]); // select from 'bar' to last cells

      cmd.exec('wysiwyg', 'removeColumn');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th>foo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>qux</td>
            </tr>
            <tr>
              <td>corge</td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should not remove columns when all columns are selected', () => {
      setCellSelection([0, 0], [1, 2]); // select from 'foo' to 'quuz' cells

      cmd.exec('wysiwyg', 'removeRow');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th class="te-cell-selected">foo</th>
              <th class="te-cell-selected">bar</th>
              <th class="te-cell-selected">baz</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="te-cell-selected">qux</td>
              <td class="te-cell-selected">quux</td>
              <td class="te-cell-selected">quuz</td>
            </tr>
            <tr>
              <td>corge</td>
              <td>grault</td>
              <td><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });
  });

  describe('alignColumn command', () => {
    beforeEach(() => {
      cmd.exec('wysiwyg', 'addTable', {
        columns: 2,
        rows: 2,
        data: ['foo', 'bar', 'baz', 'qux', 'quux', '']
      });
    });

    it('should add center align attribute to columns by no option', () => {
      setCellSelection([1, 0], [1, 0], false); // select 'baz' cell

      cmd.exec('wysiwyg', 'alignColumn');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th align="center">foo</th>
              <th>bar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td align="center">baz</td>
              <td>qux</td>
            </tr>
            <tr>
              <td align="center">quux</td>
              <td><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should change align attribute to columns by option', () => {
      setCellSelection([2, 1], [2, 1], false); // select last cell

      cmd.exec('wysiwyg', 'alignColumn', { align: 'left' });

      let expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th>foo</th>
              <th align="left">bar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>baz</td>
              <td align="left">qux</td>
            </tr>
            <tr>
              <td>quux</td>
              <td align="left"><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);

      cmd.exec('wysiwyg', 'alignColumn', { align: 'right' });

      expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th>foo</th>
              <th align="right">bar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>baz</td>
              <td align="right">qux</td>
            </tr>
            <tr>
              <td>quux</td>
              <td align="right"><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should add align attribute to columns with cursor in table hedaer', () => {
      setCellSelection([0, 0], [0, 0], false); // select 'foo' cell

      cmd.exec('wysiwyg', 'alignColumn', { align: 'left' });

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th align="left">foo</th>
              <th>bar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td align="left">baz</td>
              <td>qux</td>
            </tr>
            <tr>
              <td align="left">quux</td>
              <td><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should add align attribute to selected columns in selection', () => {
      setCellSelection([1, 0], [1, 1]); // select from 'baz' to 'qux' cell

      cmd.exec('wysiwyg', 'alignColumn', { align: 'left' });

      let expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th align="left">foo</th>
              <th align="left">bar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td align="left" class="te-cell-selected">baz</td>
              <td align="left" class="te-cell-selected">qux</td>
            </tr>
            <tr>
              <td align="left">quux</td>
              <td align="left"><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);

      setCellSelection([0, 1], [0, 0]); // select from 'bar' to 'foo' cell

      cmd.exec('wysiwyg', 'alignColumn', { align: 'right' });

      expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th align="right" class="te-cell-selected">foo</th>
              <th align="right" class="te-cell-selected">bar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td align="right">baz</td>
              <td align="right">qux</td>
            </tr>
            <tr>
              <td align="right">quux</td>
              <td align="right"><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });
  });
});
