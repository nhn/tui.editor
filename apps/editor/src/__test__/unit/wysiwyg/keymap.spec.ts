import { oneLineTrim } from 'common-tags';

import { DOMParser } from 'prosemirror-model';
import {
  chainCommands,
  deleteSelection,
  joinBackward,
  selectNodeBackward,
} from 'prosemirror-commands';

import WysiwygEditor from '@/wysiwyg/wwEditor';
import EventEmitter from '@/event/eventEmitter';
import { WwToDOMAdaptor } from '@/wysiwyg/adaptor/wwToDOMAdaptor';
import CellSelection from '@/wysiwyg/plugins/selection/cellSelection';
import { cls } from '@/utils/dom';

const CELL_SELECTION_CLS = cls('cell-selected');
const CODE_BLOCK_CLS = cls('ww-code-block');

describe('keymap', () => {
  let wwe: WysiwygEditor, em: EventEmitter;
  let html;

  function setContent(content: string) {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = content;

    const nodes = DOMParser.fromSchema(wwe.schema).parse(wrapper);

    wwe.setModel(nodes);
  }

  function forceKeymapFn(type: string, methodName: string, args: any[] = []) {
    const { specs, view } = wwe;
    // @ts-ignore
    const [keymapFn] = specs.specs.filter((spec) => spec.name === type);

    // @ts-ignore
    keymapFn[methodName](...args)(view.state, view.dispatch);
  }

  function selectCells(from: number, to: number) {
    const { state, dispatch } = wwe.view;
    const { doc, tr } = state;

    const startCellPos = doc.resolve(from);
    const endCellPos = doc.resolve(to);
    const selection = new CellSelection(startCellPos, endCellPos);

    dispatch!(tr.setSelection(selection));
  }

  beforeEach(() => {
    const toDOMAdaptor = new WwToDOMAdaptor({}, {});

    em = new EventEmitter();
    wwe = new WysiwygEditor(em, { toDOMAdaptor });
  });

  afterEach(() => {
    wwe.destroy();
  });

  describe('table', () => {
    beforeEach(() => {
      html = oneLineTrim`
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

      setContent(html);
    });

    describe('moveToCell keymap with right (tab key)', () => {
      it('should move to start of right cell', () => {
        wwe.setSelection(7, 7); // in 'foo' cell

        forceKeymapFn('table', 'moveToCell', ['right']);

        expect(wwe.getSelection()).toEqual([12, 12]);
      });

      it('should move to first cell of next line', () => {
        wwe.setSelection(13, 13); // in 'bar' cell

        forceKeymapFn('table', 'moveToCell', ['right']);

        expect(wwe.getSelection()).toEqual([23, 23]);
      });
    });

    describe('moveToCell keymap with left (shift + tab key)', () => {
      it('should move to end of left cell', () => {
        wwe.setSelection(13, 13); // in 'bar' cell

        forceKeymapFn('table', 'moveToCell', ['left']);

        expect(wwe.getSelection()).toEqual([8, 8]);
      });

      it('should move to last cell of previous line', () => {
        wwe.setSelection(24, 24); // in 'baz' cell

        forceKeymapFn('table', 'moveToCell', ['left']);

        expect(wwe.getSelection()).toEqual([15, 15]);
      });
    });

    describe('moveInCell keymap with up', () => {
      it('should move to end of up cell', () => {
        wwe.setSelection(26, 26); // in 'baz' cell

        forceKeymapFn('table', 'moveInCell', ['up']);

        expect(wwe.getSelection()).toEqual([8, 8]);
      });

      it('should add paragraph when there is no content before table and cursor is in first row', () => {
        wwe.setSelection(13, 13); // in 'bar' cell

        forceKeymapFn('table', 'moveInCell', ['up']);

        const expected = oneLineTrim`
          <p><br></p>
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

      it('should move to before table content when cursor is in first row', () => {
        html = oneLineTrim`
          <p>before</p>
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

        setContent(html);

        wwe.setSelection(15, 15); // in 'foo' cell
        forceKeymapFn('table', 'moveInCell', ['up']);

        expect(wwe.getSelection()).toEqual([7, 7]); // 'before' paragraph
      });
    });

    describe('moveInCell keymap with down', () => {
      it('should move to start of down cell', () => {
        wwe.setSelection(7, 7); // in 'foo' cell

        forceKeymapFn('table', 'moveInCell', ['down']);

        expect(wwe.getSelection()).toEqual([23, 23]);
      });

      it('should add paragraph when there is no content after table and cursor is in last row', () => {
        wwe.setSelection(26, 26); // in 'baz' cell

        forceKeymapFn('table', 'moveInCell', ['down']);

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
          <p><br></p>
        `;

        expect(wwe.getHTML()).toBe(expected);
      });

      it('should move to after table content when cursor is in last row', () => {
        html = oneLineTrim`
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
          <p>after</p>
        `;

        setContent(html);

        wwe.setSelection(32, 32); // in 'qux' cell
        forceKeymapFn('table', 'moveInCell', ['down']);

        expect(wwe.getSelection()).toEqual([39, 39]); // 'after' paragraph
      });
    });

    describe('moveInCell keymap with left and right', () => {
      let expected: string;

      beforeEach(() => {
        expected = oneLineTrim`
          <table class="ProseMirror-selectednode" draggable="true">
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
      });

      it('should select table when cursor is in start of first cell', () => {
        wwe.setSelection(5, 5); // in 'foo' cell

        forceKeymapFn('table', 'moveInCell', ['left']);

        expect(wwe.getHTML()).toBe(expected);
      });

      it('should select table when cursor is in end of last cell', () => {
        wwe.setSelection(33, 33); // in 'qux' cell

        forceKeymapFn('table', 'moveInCell', ['right']);

        expect(wwe.getHTML()).toBe(expected);
      });
    });

    it('deleteCells keymap should delete cells in selection', () => {
      selectCells(3, 28);

      forceKeymapFn('table', 'deleteCells');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th class="${CELL_SELECTION_CLS}"><p><br></p></th>
              <th class="${CELL_SELECTION_CLS}"><p><br></p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="${CELL_SELECTION_CLS}"><p><br></p></td>
              <td class="${CELL_SELECTION_CLS}"><p><br></p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    describe('exitTable keymap', () => {
      it('should exit the table node and add paragraph', () => {
        wwe.setSelection(5, 5); // in 'foo' cell

        forceKeymapFn('table', 'exitTable');

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
          <p><br></p>
        `;

        expect(wwe.getHTML()).toBe(expected);
        expect(wwe.getSelection()).toEqual([39, 39]); // in added paragraph
      });
    });
  });

  describe('table with list and multiple lines', () => {
    beforeEach(() => {
      html = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th>
                <p>foo</p>
                <p>bar</p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <ul>
                  <li><p>baz</p></li>
                  <li><p>qux</p></li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>
                <ul>
                  <li>
                    <p>quux</p>
                    <ul>
                      <li><p>quuz</p></li>
                    </ul>
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>
                <p>corge</p>
              </td>
            </tr>
          </tbody>
        </table>
      `;

      setContent(html);
    });

    describe('moveInCell keymap with up', () => {
      it('should move from first paragraph to end list item of up cell', () => {
        wwe.setSelection(65, 65); // in 'corge' cell

        forceKeymapFn('table', 'moveInCell', ['up']);

        expect(wwe.getSelection()).toEqual([55, 55]); // in 'quux'
      });

      it('should move from first list item to end list item of up cell', () => {
        wwe.setSelection(44, 44); // in 'quux' cell

        forceKeymapFn('table', 'moveInCell', ['up']);

        expect(wwe.getSelection()).toEqual([33, 33]); // in 'qux'
      });
    });

    describe('moveInCell keymap with down', () => {
      it('should move from last paragraph to start list item of down cell', () => {
        wwe.setSelection(10, 10); // in 'bar'

        forceKeymapFn('table', 'moveInCell', ['down']);

        expect(wwe.getSelection()).toEqual([23, 23]); // in 'baz'
      });

      it('should move from last list item to start list item of down cell', () => {
        wwe.setSelection(30, 30); // in 'qux'

        forceKeymapFn('table', 'moveInCell', ['down']);

        expect(wwe.getSelection()).toEqual([43, 43]); // in 'quux'
      });
    });
  });

  describe('code block', () => {
    beforeEach(() => {
      html = oneLineTrim`
        <div data-language="text" class="${CODE_BLOCK_CLS}">
          <pre>
            <code>foo\nbar\nbaz</code>
          </pre>
        </div>
      `;

      setContent(html);
    });

    describe('moveCursor keymap with up', () => {
      it('should add paragraph when there is no content before code block and cursor is in first line', () => {
        wwe.setSelection(4, 4); // in 'foo' text

        forceKeymapFn('codeBlock', 'moveCursor', ['up']);

        const expected = oneLineTrim`
          <p><br></p>
          <div data-language="text" class="${CODE_BLOCK_CLS}">
            <pre>
              <code>foo\nbar\nbaz</code>
            </pre>
          </div>
        `;

        expect(wwe.getHTML()).toBe(expected);
      });
    });

    describe('moveCursor keymap with down', () => {
      it('should add paragraph when there is no content after code block and cursor is in last line', () => {
        wwe.setSelection(10, 10); // in 'baz' text

        forceKeymapFn('codeBlock', 'moveCursor', ['down']);

        const expected = oneLineTrim`
          <div data-language="text" class="${CODE_BLOCK_CLS}">
            <pre>
              <code>foo\nbar\nbaz</code>
            </pre>
          </div>
          <p><br></p>
        `;

        expect(wwe.getHTML()).toBe(expected);
      });
    });
  });

  describe('list item', () => {
    function forceBackspaceKeymap() {
      const { view } = wwe;
      const { state, dispatch } = view;

      chainCommands(deleteSelection, joinBackward, selectNodeBackward)(state, dispatch, view);
    }

    it('should remove list item and lift up to previous list item by backspace keymap ', () => {
      html = oneLineTrim`
        <ul>
          <li>item1</li>
          <li></li>
        </ul>
      `;

      setContent(html);
      wwe.setSelection(9, 10); // in second list item

      forceBackspaceKeymap();
      forceKeymapFn('listItem', 'liftToPrevListItem');

      const expected = oneLineTrim`
        <ul>
          <li><p>item1</p></li>
        </ul>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should remove list item and lift up to parent list item by backspace keymap ', () => {
      html = oneLineTrim`
        <ul>
          <li>item1</li>
          <li>
            item2
            <ul>
              <li></li>
            </ul>
          </li>
        </ul>
      `;

      setContent(html);
      wwe.setSelection(19, 20); // in nested last child list item

      forceBackspaceKeymap();
      forceKeymapFn('listItem', 'liftToPrevListItem');

      const expected = oneLineTrim`
        <ul>
          <li><p>item1</p></li>
          <li><p>item2</p></li>
        </ul>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });
  });
});
