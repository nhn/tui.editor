import { oneLineTrim } from 'common-tags';

import WysiwygEditor from '@/wysiwyg/wwEditor';
import EventEmitter from '@/event/eventEmitter';
import CommandManager from '@/commands/commandManager';
import CellSelection from '@/wysiwyg/plugins/tableSelection/cellSelection';

describe('wysiwyg table commands', () => {
  let container: HTMLElement, wwe: WysiwygEditor, em: EventEmitter, cmd: CommandManager;

  function setCellSelection(from: number, to: number) {
    const { state, dispatch } = wwe.view;
    const { doc, tr } = state;

    const startCellPos = doc.resolve(from);
    const endCellPos = doc.resolve(to);
    const selection = new CellSelection(startCellPos, endCellPos);

    dispatch!(tr.setSelection(selection));
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
            <tr><th>foo</th><th>bar</th></tr>
          </thead>
          <tbody>
            <tr><td>baz</td><td>qux</td></tr>
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
      wwe.setSelection(4, 4);

      cmd.exec('wysiwyg', 'removeTable');

      expect(wwe.getHTML()).toBe('<p><br></p>');
    });

    it('should remove table when cursor is in table body', () => {
      wwe.setSelection(11, 11);

      cmd.exec('wysiwyg', 'removeTable');

      expect(wwe.getHTML()).toBe('<p><br></p>');
    });

    it('should remove table when selected cells', () => {
      setCellSelection(4, 11);

      cmd.exec('wysiwyg', 'removeTable');

      expect(wwe.getHTML()).toBe('<p><br></p>');
    });
  });

  describe('addRow command', () => {
    beforeEach(() => {
      cmd.exec('wysiwyg', 'addTable', { columns: 2, rows: 1, data: ['foo', 'bar', 'baz', 'qux'] });
    });

    it('should add row to table body when cursor is in table head', () => {
      wwe.setSelection(5, 5); // select 'foo' cell

      cmd.exec('wysiwyg', 'addRow');

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
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should add row when cursor is in table body', () => {
      wwe.setSelection(19, 19); // select 'baz' cell

      cmd.exec('wysiwyg', 'addRow');

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
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should add row when cells of same row are selected in table hedaer', () => {
      setCellSelection(3, 8); // select from 'foo' to 'bar' cell

      cmd.exec('wysiwyg', 'addRow');

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
              <td><br></td>
              <td><br></td>
            </tr>
            <tr>
              <td>baz</td>
              <td>qux</td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should add row when cells of same row are selected in table body', () => {
      setCellSelection(17, 22); // select from 'baz' to 'qux' cell

      cmd.exec('wysiwyg', 'addRow');

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
              <td class="te-cell-selected">qux</td>
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

    it('should add rows by selected row count when cells of multiple rows are selected from table head to table body', () => {
      setCellSelection(8, 22); // select from 'bar' to 'qux' cell

      cmd.exec('wysiwyg', 'addRow');

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
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should add rows by selected row count when cells of multiple rows are selected from table body to table heaer', () => {
      setCellSelection(22, 8); // select from 'qux' to 'bar' cell

      cmd.exec('wysiwyg', 'addRow');

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
              <td class="te-cell-selected"><br></td>
              <td class="te-cell-selected"><br></td>
            </tr>
            <tr>
              <td class="te-cell-selected"><br></td>
              <td class="te-cell-selected"><br></td>
            </tr>
            <tr>
              <td class="te-cell-selected">baz</td>
              <td class="te-cell-selected">qux</td>
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

    it('should not remove row when cursor is in table head', () => {
      wwe.setSelection(5, 5); // select 'foo' cell

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

    it('should remove row when cursor is in table body', () => {
      wwe.setSelection(19, 19); // select 'baz' cell

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

    it('should not remove row when cells of same row are selected in table head', () => {
      setCellSelection(3, 8); // select from 'foo' to 'bar' cell

      cmd.exec('wysiwyg', 'removeRow');

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
            <tr>
              <td>corge</td>
              <td><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);

      setCellSelection(3, 8); // select from 'bar' to 'foo' cell
    });

    it('should remove row when cells of same row are selected in table body from left to right selection', () => {
      setCellSelection(29, 35); // select from 'quux' to 'quuz' cell

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
            <tr>
              <td>corge</td>
              <td><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should remove row when cells of same row are selected in table body  from right to left selection', () => {
      setCellSelection(50, 43); // select from last to 'corge' cell

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
            <tr>
              <td>quux</td>
              <td>quuz</td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should remove rows by selected row count when cells of multiple rows are selected in table body', () => {
      setCellSelection(29, 43); // select from 'quux' to 'corge' cell

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

    it('should not remove row when there is one row in table body', () => {
      wwe.setSelection(22, 22);

      cmd.exec('wysiwyg', 'removeRow');
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
              <td>corge</td>
              <td><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should remove rows except last row when all cells are selected in table body', () => {
      setCellSelection(8, 43); // select from 'bar' to 'corge' cell

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
              <td class="te-cell-selected">corge</td>
              <td><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should not remove rows when cells are selected from table body to table hedaer', () => {
      setCellSelection(43, 8); // select from 'corge' to 'bar' cell

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
              <td class="te-cell-selected">baz</td>
              <td class="te-cell-selected">qux</td>
            </tr>
            <tr>
              <td class="te-cell-selected">quux</td>
              <td class="te-cell-selected">quuz</td>
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

  describe('addColumn command', () => {
    beforeEach(() => {
      cmd.exec('wysiwyg', 'addTable', {
        columns: 2,
        rows: 2,
        data: ['foo', 'bar', 'baz', 'qux', 'quux', '']
      });
    });

    it('should add column after cell with cursor in table head', () => {
      wwe.setSelection(5, 5); // select 'foo' cell

      cmd.exec('wysiwyg', 'addColumn');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th>foo</th>
              <th><br></th>
              <th>bar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>baz</td>
              <td><br></td>
              <td>qux</td>
            </tr>
            <tr>
              <td>quux</td>
              <td><br></td>
              <td><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should add column after cell with cursor in table body', () => {
      wwe.setSelection(23, 23); // select 'bar' cell

      cmd.exec('wysiwyg', 'addColumn');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th>foo</th>
              <th>bar</th>
              <th><br></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>baz</td>
              <td>qux</td>
              <td><br></td>
            </tr>
            <tr>
              <td>quux</td>
              <td><br></td>
              <td><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should add columns when cells of same row are selected in table head from left to right selection', () => {
      setCellSelection(3, 8); // select from 'foo' to 'bar' cell

      cmd.exec('wysiwyg', 'addColumn');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th class="te-cell-selected">foo</th>
              <th class="te-cell-selected">bar</th>
              <th><br></th>
              <th><br></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>baz</td>
              <td>qux</td>
              <td><br></td>
              <td><br></td>
            </tr>
            <tr>
              <td>quux</td>
              <td><br></td>
              <td><br></td>
              <td><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should add columns when cells of same row are selected in table head from right to left selection', () => {
      setCellSelection(8, 3); // select from 'bar' to 'foo' cell

      cmd.exec('wysiwyg', 'addColumn');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th class="te-cell-selected">foo</th>
              <th class="te-cell-selected"><br></th>
              <th class="te-cell-selected"><br></th>
              <th class="te-cell-selected">bar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>baz</td>
              <td><br></td>
              <td><br></td>
              <td>qux</td>
            </tr>
            <tr>
              <td>quux</td>
              <td><br></td>
              <td><br></td>
              <td><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should add columns by selected column count when cells of same row are selected in table body from left to right selection', () => {
      setCellSelection(17, 22); // select from 'baz' to 'qux' cell

      cmd.exec('wysiwyg', 'addColumn');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th>foo</th>
              <th>bar</th>
              <th><br></th>
              <th><br></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="te-cell-selected">baz</td>
              <td class="te-cell-selected">qux</td>
              <td><br></td>
              <td><br></td>
            </tr>
            <tr>
              <td>quux</td>
              <td><br></td>
              <td><br></td>
              <td><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should add columns by selected column count when cells of same row are selected in table body  from right to left selection', () => {
      setCellSelection(22, 17); // select from 'qux' to 'baz' cell

      cmd.exec('wysiwyg', 'addColumn');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th>foo</th>
              <th><br></th>
              <th><br></th>
              <th>bar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="te-cell-selected">baz</td>
              <td class="te-cell-selected"><br></td>
              <td class="te-cell-selected"><br></td>
              <td class="te-cell-selected">qux</td>
            </tr>
            <tr>
              <td>quux</td>
              <td><br></td>
              <td><br></td>
              <td><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should add columns by all column count when cells of multiple rows are selected', () => {
      setCellSelection(8, 22); // select from 'bar' to 'qux' cell

      cmd.exec('wysiwyg', 'addColumn');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th>foo</th>
              <th class="te-cell-selected">bar</th>
              <th class="te-cell-selected"><br></th>
              <th class="te-cell-selected"><br></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="te-cell-selected">baz</td>
              <td class="te-cell-selected">qux</td>
              <td><br></td>
              <td><br></td>
            </tr>
            <tr>
              <td>quux</td>
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

  describe('removeColumn command', () => {
    beforeEach(() => {
      cmd.exec('wysiwyg', 'addTable', {
        columns: 3,
        rows: 2,
        data: ['foo', 'bar', 'baz', 'qux', 'quux', 'quuz', 'corge', 'grault', '']
      });
    });

    it('should remove column when cursor is in table hedaer', () => {
      wwe.setSelection(10, 10); // select 'bar' cell

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

    it('should remove column when cursor is in table body', () => {
      wwe.setSelection(25, 25); // select 'qux' cell

      cmd.exec('wysiwyg', 'removeColumn');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th>bar</th>
              <th>baz</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>quux</td>
              <td>quuz</td>
            </tr>
            <tr>
              <td>grault</td>
              <td><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should remove columns when cells are selected in table head', () => {
      setCellSelection(8, 13); // select from 'bar' to 'baz' cell

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

    it('should not remove columns when all cells are selected in table head', () => {
      setCellSelection(13, 3); // select from 'baz' to 'foo' cell

      cmd.exec('wysiwyg', 'removeColumn');

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
              <td>qux</td>
              <td>quux</td>
              <td>quuz</td>
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

    it('should remove columns when cells are selected in table body', () => {
      setCellSelection(48, 41); // select from 'grault' to 'corge' cell

      cmd.exec('wysiwyg', 'removeColumn');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th>baz</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>quuz</td>
            </tr>
            <tr>
              <td><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should not remove columns when all cells are selected in table', () => {
      setCellSelection(13, 48); // select from 'baz' to 'grault' cell

      cmd.exec('wysiwyg', 'removeColumn');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th>foo</th>
              <th>bar</th>
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
              <td class="te-cell-selected">corge</td>
              <td class="te-cell-selected">grault</td>
              <td><br></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);

      setCellSelection(48, 13); // select from 'grault' to 'baz' cell
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
      wwe.setSelection(20, 20); // select 'baz' cell

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
      wwe.setSelection(36, 36); // select last cell

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
      wwe.setSelection(4, 4); // select 'foo' cell

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

    it('should add align attribute to selected cells', () => {
      setCellSelection(17, 22); // select from 'baz' to 'qux' cell

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

      setCellSelection(8, 3); // select from 'bar' to 'foo' cell

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
