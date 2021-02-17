import { oneLineTrim } from 'common-tags';

import { DOMParser } from 'prosemirror-model';

import WysiwygEditor from '@/wysiwyg/wwEditor';
import EventEmitter from '@/event/eventEmitter';
import { WwToDOMAdaptor } from '@/wysiwyg/adaptor/wwToDOMAdaptor';
import CellSelection from '@/wysiwyg/plugins/tableSelection/cellSelection';

describe('keymap', () => {
  let wwe: WysiwygEditor, em: EventEmitter;

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

  beforeEach(() => {
    const adaptor = new WwToDOMAdaptor({}, {});

    em = new EventEmitter();
    wwe = new WysiwygEditor(em, adaptor);
  });

  afterEach(() => {
    wwe.destroy();
  });

  describe('table', () => {
    let html;

    function selectCells(from: number, to: number) {
      const { state, dispatch } = wwe.view;
      const { doc, tr } = state;

      const startCellPos = doc.resolve(from);
      const endCellPos = doc.resolve(to);
      const selection = new CellSelection(startCellPos, endCellPos);

      dispatch!(tr.setSelection(selection));
    }

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

    describe('moveToCell keymap with right (tap key)', () => {
      it('should move to end of right cell', () => {
        wwe.setSelection(7, 7); // in 'foo' cell

        forceKeymapFn('table', 'moveToCell', ['right']);

        expect(wwe.getRange()).toEqual([15, 15]);
      });

      it('should move to first cell of next line', () => {
        wwe.setSelection(13, 13); // in 'bar' cell

        forceKeymapFn('table', 'moveToCell', ['right']);

        expect(wwe.getRange()).toEqual([26, 26]);
      });
    });

    describe('moveToCell keymap with left (shift + tab key)', () => {
      it('should move to end of left cell', () => {
        wwe.setSelection(13, 13); // in 'bar' cell

        forceKeymapFn('table', 'moveToCell', ['left']);

        expect(wwe.getRange()).toEqual([8, 8]);
      });

      it('should move to last cell of previous line', () => {
        wwe.setSelection(24, 24); // in 'baz' cell

        forceKeymapFn('table', 'moveToCell', ['left']);

        expect(wwe.getRange()).toEqual([15, 15]);
      });
    });

    describe('moveInCell keymap with up', () => {
      it('should move to end of up cell', () => {
        wwe.setSelection(26, 26); // in 'baz' cell

        forceKeymapFn('table', 'moveInCell', ['up']);

        expect(wwe.getRange()).toEqual([8, 8]);
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

        expect(wwe.getRange()).toEqual([7, 7]); // 'before' paragraph
      });
    });

    describe('moveInCell keymap with down', () => {
      it('should move to start of down cell', () => {
        wwe.setSelection(7, 7); // in 'foo' cell

        forceKeymapFn('table', 'moveInCell', ['down']);

        expect(wwe.getRange()).toEqual([23, 23]);
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

        expect(wwe.getRange()).toEqual([39, 39]); // 'after' paragraph
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
              <th class="te-cell-selected"><p><br></p></th>
              <th class="te-cell-selected"><p><br></p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="te-cell-selected"><p><br></p></td>
              <td class="te-cell-selected"><p><br></p></td>
            </tr>
          </tbody>
        </table>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });
  });
});
