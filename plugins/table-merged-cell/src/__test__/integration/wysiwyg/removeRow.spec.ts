import { oneLineTrim } from 'common-tags';
import Editor from '@toast-ui/editor';
import { assertWYSIWYGHTML, createEditor } from './helper/utils';

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

describe('removeRow command', () => {
  it('should remove row included row-spanning cell(normal single cell)', () => {
    editor.setSelection(119, 119); // select [2, 2] cell(cell2-3 text)
    editor.exec('removeRow');

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
            <td colspan="2" rowspan="4"><p>mergedCell1-3</p></td>
          </tr>
          <tr>
            <td><p>mergedCell2-1</p></td>
            <td><p>mergedCell2-2</p></td>
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

  it('should remove row(normal single cell)', () => {
    editor.setSelection(132, 132); // select [3, 2] cell(cell3-1 text)
    editor.exec('removeRow');

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
            <td colspan="2" rowspan="4"><p>mergedCell1-3</p></td>
          </tr>
          <tr>
            <td><p>mergedCell2-1</p></td>
            <td><p>mergedCell2-2</p></td>
            <td><p>cell2-3</p></td>
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

  it('should remove row(selected row-spanning cell)', () => {
    editor.setSelection(100, 100); // select [2, 1] cell(mergedCell2-2 text)
    editor.exec('removeRow');

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
            <td colspan="2" rowspan="3"><p>mergedCell1-3</p></td>
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
