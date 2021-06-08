import { oneLineTrim } from 'common-tags';

import WysiwygEditor from '@/wysiwyg/wwEditor';
import EventEmitter from '@/event/eventEmitter';
import CommandManager from '@/commands/commandManager';
import CellSelection from '@/wysiwyg/plugins/selection/cellSelection';

import { WwToDOMAdaptor } from '@/wysiwyg/adaptor/wwToDOMAdaptor';
import { TableOffsetMap } from '@/wysiwyg/helper/tableOffsetMap';
import { cls } from '@/utils/dom';

const CELL_SELECTION_CLS = cls('cell-selected');

describe('wysiwyg table commands', () => {
  let wwe: WysiwygEditor, em: EventEmitter, cmd: CommandManager;

  function selectCells(from: number, to: number) {
    const { state, dispatch } = wwe.view;
    const { doc, tr } = state;

    const startCellPos = doc.resolve(from);
    const endCellPos = doc.resolve(to);
    const selection = new CellSelection(startCellPos, endCellPos);

    dispatch!(tr.setSelection(selection));
  }

  function setCellSelection(
    [startRowIdx, startColIdx]: number[],
    [endRowIdx, endColIdx]: number[],
    cellSelection = true
  ) {
    const doc = wwe.getModel();
    const map = TableOffsetMap.create(doc.resolve(1))!;

    const startCellOffset = map.getCellInfo(startRowIdx, startColIdx).offset;
    const endCellOffset = map.getCellInfo(endRowIdx, endColIdx).offset;

    if (startCellOffset === endCellOffset && !cellSelection) {
      const from = startCellOffset + 1;

      wwe.setSelection(from, from);
    } else {
      selectCells(startCellOffset, endCellOffset);
    }
  }

  beforeEach(() => {
    const toDOMAdaptor = new WwToDOMAdaptor({}, {});

    em = new EventEmitter();
    wwe = new WysiwygEditor(em, { toDOMAdaptor });
    cmd = new CommandManager(em, {}, wwe.commands, () => 'wysiwyg');
  });

  afterEach(() => {
    wwe.destroy();
  });

  describe('addTable command', () => {
    it('should create one by one table', () => {
      cmd.exec('addTable');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th><p><br></p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><p><br></p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should create table with column and row count', () => {
      cmd.exec('addTable', { rowCount: 4, columnCount: 2 });

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th><p><br></p></th>
              <th><p><br></p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><p><br></p></td>
              <td><p><br></p></td>
            </tr>
            <tr>
              <td><p><br></p></td>
              <td><p><br></p></td>
            </tr>
            <tr>
              <td><p><br></p></td>
              <td><p><br></p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should create table with data', () => {
      cmd.exec('addTable', {
        rowCount: 2,
        columnCount: 2,
        data: ['foo', 'bar', 'baz', 'qux'],
      });

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th><p>foo</p></th>
              <th><p>bar</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><p>baz</p></td>
              <td><p>qux</p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });
  });

  describe('removeTable command', () => {
    beforeEach(() => {
      cmd.exec('addTable');
    });

    it('should remove table when cursor is in table hedaer', () => {
      setCellSelection([0, 0], [0, 0], false);

      cmd.exec('removeTable');

      expect(wwe.getHTML()).toBe('<p><br></p>');
    });

    it('should remove table when cursor is in table body', () => {
      setCellSelection([1, 0], [1, 0], false);

      cmd.exec('removeTable');

      expect(wwe.getHTML()).toBe('<p><br></p>');
    });

    it('should remove table when selected cells', () => {
      setCellSelection([0, 0], [1, 0]);

      cmd.exec('removeTable');

      expect(wwe.getHTML()).toBe('<p><br></p>');
    });
  });

  describe('addRowToDown command', () => {
    beforeEach(() => {
      cmd.exec('addTable', {
        rowCount: 3,
        columnCount: 2,
        data: ['foo', 'bar', 'baz', 'qux', 'quux', 'quuz'],
      });
    });

    it('should add a row to next row of current cursor cell', () => {
      setCellSelection([1, 1], [1, 1], false); // select 'baz' cell

      cmd.exec('addRowToDown');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th><p>foo</p></th>
              <th><p>bar</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><p>baz</p></td>
              <td><p>qux</p></td>
            </tr>
            <tr>
              <td><p><br></p></td>
              <td><p><br></p></td>
            </tr>
            <tr>
              <td><p>quux</p></td>
              <td><p>quuz</p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should add rows as selected row count after selection', () => {
      setCellSelection([0, 0], [1, 1]); // select from 'foo' to 'qux' cells

      cmd.exec('addRowToDown');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th class="${CELL_SELECTION_CLS}"><p>foo</p></th>
              <th class="${CELL_SELECTION_CLS}"><p>bar</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="${CELL_SELECTION_CLS}"><p>baz</p></td>
              <td class="${CELL_SELECTION_CLS}"><p>qux</p></td>
            </tr>
            <tr>
              <td><p><br></p></td>
              <td><p><br></p></td>
            </tr>
            <tr>
              <td><p><br></p></td>
              <td><p><br></p></td>
            </tr>
            <tr>
              <td><p>quux</p></td>
              <td><p>quuz</p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should not add a row when selection is only at table head', () => {
      setCellSelection([0, 0], [0, 1]); // select from 'foo' to 'bar' cells

      cmd.exec('addRowToDown');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th class="${CELL_SELECTION_CLS}"><p>foo</p></th>
              <th class="${CELL_SELECTION_CLS}"><p>bar</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><p>baz</p></td>
              <td><p>qux</p></td>
            </tr>
            <tr>
              <td><p>quux</p></td>
              <td><p>quuz</p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });
  });

  describe('addRowToUp command', () => {
    beforeEach(() => {
      cmd.exec('addTable', {
        rowCount: 3,
        columnCount: 2,
        data: ['foo', 'bar', 'baz', 'qux', 'quux', 'quuz'],
      });
    });

    it('should add a row to previous row of current cursor cell', () => {
      setCellSelection([1, 1], [1, 1], false); // select 'baz' cell

      cmd.exec('addRowToUp');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th><p>foo</p></th>
              <th><p>bar</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><p><br></p></td>
              <td><p><br></p></td>
            </tr>
            <tr>
              <td><p>baz</p></td>
              <td><p>qux</p></td>
            </tr>
            <tr>
              <td><p>quux</p></td>
              <td><p>quuz</p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should add rows as selected row count before selection', () => {
      setCellSelection([1, 1], [2, 1]); // select from 'qux' to 'quuz' cells

      cmd.exec('addRowToUp');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th><p>foo</p></th>
              <th><p>bar</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><p><br></p></td>
              <td><p><br></p></td>
            </tr>
            <tr>
              <td><p><br></p></td>
              <td><p><br></p></td>
            </tr>
            <tr>
              <td><p>baz</p></td>
              <td class="${CELL_SELECTION_CLS}"><p>qux</p></td>
            </tr>
            <tr>
              <td><p>quux</p></td>
              <td class="${CELL_SELECTION_CLS}"><p>quuz</p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should not add a row when selection include table head', () => {
      setCellSelection([0, 0], [1, 0]); // select from 'foo' to 'baz' cells

      cmd.exec('addRowToUp');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th class="${CELL_SELECTION_CLS}"><p>foo</p></th>
              <th><p>bar</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="${CELL_SELECTION_CLS}"><p>baz</p></td>
              <td><p>qux</p></td>
            </tr>
            <tr>
              <td><p>quux</p></td>
              <td><p>quuz</p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });
  });

  describe('removeRow command', () => {
    beforeEach(() => {
      cmd.exec('addTable', {
        rowCount: 4,
        columnCount: 2,
        data: ['foo', 'bar', 'baz', 'qux', 'quux', 'quuz', 'corge', ''],
      });
    });

    it('should remove a row where current cursor cell is located', () => {
      setCellSelection([1, 1], [1, 1], false); // select from 'qux' cell

      cmd.exec('removeRow');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th><p>foo</p></th>
              <th><p>bar</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><p>quux</p></td>
              <td><p>quuz</p></td>
            </tr>
            <tr>
              <td><p>corge</p></td>
              <td><p><br></p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should remove columns as selected column count in selection', () => {
      setCellSelection([3, 1], [2, 1]); // select from last to 'quuz' cells

      cmd.exec('removeRow');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th><p>foo</p></th>
              <th><p>bar</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><p>baz</p></td>
              <td><p>qux</p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should not remove rows when selection include table head', () => {
      setCellSelection([0, 1], [2, 1]); // select from 'bar' to 'qux' cells

      cmd.exec('removeRow');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th><p>foo</p></th>
              <th class="${CELL_SELECTION_CLS}"><p>bar</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><p>baz</p></td>
              <td class="${CELL_SELECTION_CLS}"><p>qux</p></td>
            </tr>
            <tr>
              <td><p>quux</p></td>
              <td class="${CELL_SELECTION_CLS}"><p>quuz</p></td>
            </tr>
            <tr>
              <td><p>corge</p></td>
              <td><p><br></p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should not remove rows when all rows of table body are selected', () => {
      setCellSelection([1, 0], [3, 0]); // select from 'baz' to 'corge' cells

      cmd.exec('removeRow');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th><p>foo</p></th>
              <th><p>bar</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="${CELL_SELECTION_CLS}"><p>baz</p></td>
              <td><p>qux</p></td>
            </tr>
            <tr>
              <td class="${CELL_SELECTION_CLS}"><p>quux</p></td>
              <td><p>quuz</p></td>
            </tr>
            <tr>
              <td class="${CELL_SELECTION_CLS}"><p>corge</p></td>
              <td><p><br></p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });
  });

  describe('addColumnToRight command', () => {
    beforeEach(() => {
      cmd.exec('addTable', {
        rowCount: 3,
        columnCount: 3,
        data: ['foo', 'bar', 'baz', 'qux', 'quux', 'quuz', 'corge', 'grault', ''],
      });
    });

    it('should add a column to next column of current cursor cell', () => {
      setCellSelection([1, 1], [1, 1], false); // select 'quux' cell

      cmd.exec('addColumnToRight');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th><p>foo</p></th>
              <th><p>bar</p></th>
              <th><p><br></p></th>
              <th><p>baz</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><p>qux</p></td>
              <td><p>quux</p></td>
              <td><p><br></p></td>
              <td><p>quuz</p></td>
            </tr>
            <tr>
              <td><p>corge</p></td>
              <td><p>grault</p></td>
              <td><p><br></p></td>
              <td><p><br></p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should add columns as selected column count to right of selection', () => {
      setCellSelection([0, 0], [1, 1]); // select from 'foo' to 'quux' cells

      cmd.exec('addColumnToRight');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th class="${CELL_SELECTION_CLS}"><p>foo</p></th>
              <th class="${CELL_SELECTION_CLS}"><p>bar</p></th>
              <th><p><br></p></th>
              <th><p><br></p></th>
              <th><p>baz</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="${CELL_SELECTION_CLS}"><p>qux</p></td>
              <td class="${CELL_SELECTION_CLS}"><p>quux</p></td>
              <td><p><br></p></td>
              <td><p><br></p></td>
              <td><p>quuz</p></td>
            </tr>
            <tr>
              <td><p>corge</p></td>
              <td><p>grault</p></td>
              <td><p><br></p></td>
              <td><p><br></p></td>
              <td><p><br></p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });
  });

  describe('addColumnToLeft command', () => {
    beforeEach(() => {
      cmd.exec('addTable', {
        rowCount: 3,
        columnCount: 3,
        data: ['foo', 'bar', 'baz', 'qux', 'quux', 'quuz', 'corge', 'grault', ''],
      });
    });

    it('should add a column to previous column of current cursor cell', () => {
      setCellSelection([1, 1], [1, 1], false); // select 'quux' cell

      cmd.exec('addColumnToLeft');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th><p>foo</p></th>
              <th><p><br></p></th>
              <th><p>bar</p></th>
              <th><p>baz</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><p>qux</p></td>
              <td><p><br></p></td>
              <td><p>quux</p></td>
              <td><p>quuz</p></td>
            </tr>
            <tr>
              <td><p>corge</p></td>
              <td><p><br></p></td>
              <td><p>grault</p></td>
              <td><p><br></p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should add columns as selected column count to right of selection', () => {
      setCellSelection([0, 1], [2, 2]); // select from 'bar' to last cells

      cmd.exec('addColumnToLeft');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th><p>foo</p></th>
              <th><p><br></p></th>
              <th><p><br></p></th>
              <th class="${CELL_SELECTION_CLS}"><p>bar</p></th>
              <th class="${CELL_SELECTION_CLS}"><p>baz</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><p>qux</p></td>
              <td><p><br></p></td>
              <td><p><br></p></td>
              <td class="${CELL_SELECTION_CLS}"><p>quux</p></td>
              <td class="${CELL_SELECTION_CLS}"><p>quuz</p></td>
            </tr>
            <tr>
              <td><p>corge</p></td>
              <td><p><br></p></td>
              <td><p><br></p></td>
              <td class="${CELL_SELECTION_CLS}"><p>grault</p></td>
              <td class="${CELL_SELECTION_CLS}"><p><br></p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });
  });

  describe('removeColumn command', () => {
    beforeEach(() => {
      cmd.exec('addTable', {
        rowCount: 3,
        columnCount: 3,
        data: ['foo', 'bar', 'baz', 'qux', 'quux', 'quuz', 'corge', 'grault', ''],
      });
    });

    it('should remove a column where current cursor cell is located', () => {
      setCellSelection([1, 1], [1, 1], false); // select 'quux' cell

      cmd.exec('removeColumn');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th><p>foo</p></th>
              <th><p>baz</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><p>qux</p></td>
              <td><p>quuz</p></td>
            </tr>
            <tr>
              <td><p>corge</p></td>
              <td><p><br></p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should remove columns as selected column count in selection', () => {
      setCellSelection([0, 1], [2, 2]); // select from 'bar' to last cells

      cmd.exec('removeColumn');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th><p>foo</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><p>qux</p></td>
            </tr>
            <tr>
              <td><p>corge</p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should not remove columns when all columns are selected', () => {
      setCellSelection([0, 0], [1, 2]); // select from 'foo' to 'quuz' cells

      cmd.exec('removeRow');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th class="${CELL_SELECTION_CLS}"><p>foo</p></th>
              <th class="${CELL_SELECTION_CLS}"><p>bar</p></th>
              <th class="${CELL_SELECTION_CLS}"><p>baz</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="${CELL_SELECTION_CLS}"><p>qux</p></td>
              <td class="${CELL_SELECTION_CLS}"><p>quux</p></td>
              <td class="${CELL_SELECTION_CLS}"><p>quuz</p></td>
            </tr>
            <tr>
              <td><p>corge</p></td>
              <td><p>grault</p></td>
              <td><p><br></p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });
  });

  describe('alignColumn command', () => {
    beforeEach(() => {
      cmd.exec('addTable', {
        rowCount: 3,
        columnCount: 2,
        data: ['foo', 'bar', 'baz', 'qux', 'quux', ''],
      });
    });

    it('should add center align attribute to columns by no option', () => {
      setCellSelection([1, 0], [1, 0], false); // select 'baz' cell

      cmd.exec('alignColumn');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th align="center"><p>foo</p></th>
              <th><p>bar</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td align="center"><p>baz</p></td>
              <td><p>qux</p></td>
            </tr>
            <tr>
              <td align="center"><p>quux</p></td>
              <td><p><br></p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should change align attribute to columns by option', () => {
      setCellSelection([2, 1], [2, 1], false); // select last cell

      cmd.exec('alignColumn', { align: 'left' });

      let expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th><p>foo</p></th>
              <th align="left"><p>bar</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><p>baz</p></td>
              <td align="left"><p>qux</p></td>
            </tr>
            <tr>
              <td><p>quux</p></td>
              <td align="left"><p><br></p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);

      cmd.exec('alignColumn', { align: 'right' });

      expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th><p>foo</p></th>
              <th align="right"><p>bar</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><p>baz</p></td>
              <td align="right"><p>qux</p></td>
            </tr>
            <tr>
              <td><p>quux</p></td>
              <td align="right"><p><br></p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should add align attribute to columns with cursor in table hedaer', () => {
      setCellSelection([0, 0], [0, 0], false); // select 'foo' cell

      cmd.exec('alignColumn', { align: 'left' });

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th align="left"><p>foo</p></th>
              <th><p>bar</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td align="left"><p>baz</p></td>
              <td><p>qux</p></td>
            </tr>
            <tr>
              <td align="left"><p>quux</p></td>
              <td><p><br></p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should add align attribute to selected columns in selection', () => {
      setCellSelection([1, 0], [1, 1]); // select from 'baz' to 'qux' cell

      cmd.exec('alignColumn', { align: 'left' });

      let expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th align="left"><p>foo</p></th>
              <th align="left"><p>bar</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td align="left" class="${CELL_SELECTION_CLS}"><p>baz</p></td>
              <td align="left" class="${CELL_SELECTION_CLS}"><p>qux</p></td>
            </tr>
            <tr>
              <td align="left"><p>quux</p></td>
              <td align="left"><p><br></p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);

      setCellSelection([0, 1], [0, 0]); // select from 'bar' to 'foo' cell

      cmd.exec('alignColumn', { align: 'right' });

      expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th align="right" class="${CELL_SELECTION_CLS}"><p>foo</p></th>
              <th align="right" class="${CELL_SELECTION_CLS}"><p>bar</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td align="right"><p>baz</p></td>
              <td align="right"><p>qux</p></td>
            </tr>
            <tr>
              <td align="right"><p>quux</p></td>
              <td align="right"><p><br></p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });
  });
});
