import { oneLineTrim } from 'common-tags';
import Editor from '@toast-ui/editor';
import { assertWYSIWYGHTML, createEditor } from './helper/utils';
import type { EditorView } from 'prosemirror-view';
import CellSelection from './helper/cellSelection';

let container: HTMLElement, editor: Editor;

beforeEach(() => {
  const editorInfo = createEditor();

  container = editorInfo.container;
  editor = editorInfo.editor;
});

afterEach(() => {
  editor.destroy();
  document.body.removeChild(container);
});

function setCellSelection(startPos: number, endPos: number) {
  // @ts-ignore
  const wwView: EditorView = editor.wwEditor.view;
  const { tr } = wwView.state;

  wwView.dispatch!(
    tr.setSelection(new CellSelection(tr.doc.resolve(startPos), tr.doc.resolve(endPos)))
  );
}

describe('mergeCells command', () => {
  it('should merge cells included spanning cell', () => {
    setCellSelection(37, 131); // select [1, 0] cell(mergedCell1-1 text) to [3, 2](cell3-1 text)
    editor.exec('mergeCells');

    const expected = oneLineTrim`
      <table>
        <thead>
          <tr>
            <th colspan="2"><p>mergedHead1</p></th>
            <th colspan="3"><p>mergedHead2</p></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="3" rowspan="3">
              <p>mergedCell1-1</p>
              <p>cell1-2</p>
              <p>mergedCell2-1</p>
              <p>mergedCell2-2</p>
              <p>cell2-3</p>
              <p>cell3-1</p>
            </td>
            <td colspan="2" rowspan="5">
              <p>mergedCell1-3</p>
            </td>
          </tr>
          <tr></tr>
          <tr></tr>
          <tr>
            <td><p>cell4-1</p></td>
            <td><p>cell4</p></td>
            <td><p>cell4-3</p></td>
          </tr>
          <tr>
            <td><p>cell5-1</p></td>
            <td><p>cell5-2</p></td>
            <td><p>cell5-3</p></td>
          </tr>
        </tbody>
      </table>
    `;

    assertWYSIWYGHTML(editor, expected);
  });

  it('should merge cells(normal cells)', () => {
    setCellSelection(54, 131); // select [1, 2] cell(cell1-2 text) to [3, 2](cell3-1 text)
    editor.exec('mergeCells');

    const expected = oneLineTrim`
      <table>
        <thead>
          <tr>
            <th colspan="2"><p>mergedHead1</p></th>
            <th colspan="3"><p>mergedHead2</p></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="2"><p>mergedCell1-1</p></td>
            <td colspan="1" rowspan="3">
              <p>cell1-2</p>
              <p>cell2-3</p>
              <p>cell3-1</p>
            </td>
            <td colspan="2" rowspan="5"><p>mergedCell1-3</p></td>
          </tr>
          <tr>
            <td rowspan="2"><p>mergedCell2-1</p></td>
            <td rowspan="2"><p>mergedCell2-2</p></td>
          </tr>
          <tr></tr>
          <tr>
            <td><p>cell4-1</p></td>
            <td><p>cell4</p></td>
            <td><p>cell4-3</p></td>
          </tr>
          <tr>
            <td><p>cell5-1</p></td>
            <td><p>cell5-2</p></td>
            <td><p>cell5-3</p></td>
          </tr>
        </tbody>
      </table>
    `;

    assertWYSIWYGHTML(editor, expected);
  });

  it('should not merge cells in case of selecting all cells', () => {
    setCellSelection(37, 65); // select all body cells
    editor.exec('mergeCells');

    const expected = oneLineTrim`
      <table>
        <thead>
          <tr>
            <th colspan="2"><p>mergedHead1</p></th>
            <th colspan="3"><p>mergedHead2</p></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="2"><p>mergedCell1-1</p></td>
            <td><p>cell1-2</p></td>
            <td colspan="2" rowspan="5"><p>mergedCell1-3</p></td>
          </tr>
          <tr>
            <td rowspan="2"><p>mergedCell2-1</p></td>
            <td rowspan="2"><p>mergedCell2-2</p></td>
            <td><p>cell2-3</p></td>
          </tr>
          <tr>
            <td><p>cell3-1</p></td>
          </tr>
          <tr>
            <td><p>cell4-1</p></td>
            <td><p>cell4</p></td>
            <td><p>cell4-3</p></td>
          </tr>
          <tr>
            <td><p>cell5-1</p></td>
            <td><p>cell5-2</p></td>
            <td><p>cell5-3</p></td>
          </tr>
        </tbody>
      </table>
    `;

    assertWYSIWYGHTML(editor, expected);
  });

  it('should not merge cells in case of selecting head cells', () => {
    setCellSelection(1, 37); // select [0, 0](mergedHead1 text)  cellto [1, 0](mergedCell1-1 text)
    editor.exec('mergeCells');

    const expected = oneLineTrim`
      <table>
        <thead>
          <tr>
            <th colspan="2"><p>mergedHead1</p></th>
            <th colspan="3"><p>mergedHead2</p></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="2"><p>mergedCell1-1</p></td>
            <td><p>cell1-2</p></td>
            <td colspan="2" rowspan="5"><p>mergedCell1-3</p></td>
          </tr>
          <tr>
            <td rowspan="2"><p>mergedCell2-1</p></td>
            <td rowspan="2"><p>mergedCell2-2</p></td>
            <td><p>cell2-3</p></td>
          </tr>
          <tr>
            <td><p>cell3-1</p></td>
          </tr>
          <tr>
            <td><p>cell4-1</p></td>
            <td><p>cell4</p></td>
            <td><p>cell4-3</p></td>
          </tr>
          <tr>
            <td><p>cell5-1</p></td>
            <td><p>cell5-2</p></td>
            <td><p>cell5-3</p></td>
          </tr>
        </tbody>
      </table>
    `;

    assertWYSIWYGHTML(editor, expected);
  });
});
