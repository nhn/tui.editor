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

describe('removeColumn command', () => {
  it('should remove column included col-spanning cell(normal single cell)', () => {
    editor.setSelection(85, 85); // select [2, 0] cell(mergedCell2-1 text)
    editor.exec('removeColumn');

    const expected = oneLineTrim`
      <table>
        <thead>
          <tr>
            <th><p>mergedHead1</p></th>
            <th colspan="3"><p>mergedHead2</p></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><p>mergedCell1-1</p></td>
            <td><p>cell1-2</p></td>
            <td colspan="2" rowspan="5"><p>mergedCell1-3</p></td>
          </tr>
          <tr>
            <td rowspan="2"><p>mergedCell2-2</p></td>
            <td><p>cell2-3</p></td>
          </tr>
          <tr>
            <td><p>cell3-1</p></td>
          </tr>
          <tr>
            <td><p>cell4</p></td>
            <td><p>cell4-3</p></td>
          </tr>
          <tr>
            <td><p>cell5-2</p></td>
            <td><p>cell5-3</p></td>
          </tr>
        </tbody>
      </table>
    `;

    assertWYSIWYGHTML(editor, expected);
  });

  it('should remove column(normal single cell)', () => {
    editor.setSelection(102, 102); // select [2, 1] cell(mergedCell2-2 text)
    editor.exec('removeColumn');

    const expected = oneLineTrim`
      <table>
        <thead>
          <tr>
            <th><p>mergedHead1</p></th>
            <th colspan="3"><p>mergedHead2</p></th>
          </tr>
        </thead>
        <tbody>
        <tr>
            <td><p>mergedCell1-1</p></td>
            <td><p>cell1-2</p></td>
            <td colspan="2" rowspan="5"><p>mergedCell1-3</p></td>
          </tr>
          <tr>
            <td rowspan="2"><p>mergedCell2-1</p></td>
            <td><p>cell2-3</p></td>
          </tr>
          <tr>
            <td><p>cell3-1</p></td>
          </tr>
          <tr>
            <td><p>cell4-1</p></td>
            <td><p>cell4-3</p></td>
          </tr>
          <tr>
            <td><p>cell5-1</p></td>
            <td><p>cell5-3</p></td>
          </tr>
        </tbody>
      </table>
    `;

    assertWYSIWYGHTML(editor, expected);
  });

  it('should remove column(selected col-spanning cell)', () => {
    editor.setSelection(38, 38); // select [1, 0] cell(mergedCell1-1 text)
    editor.exec('removeColumn');

    const expected = oneLineTrim`
      <table>
        <thead>
          <tr>
            <th colspan="3"><p>mergedHead2</p></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><p>cell1-2</p></td>
            <td colspan="2" rowspan="5"><p>mergedCell1-3</p></td>
          </tr>
          <tr>
            <td><p>cell2-3</p></td>
          </tr>
          <tr>
            <td><p>cell3-1</p></td>
          </tr>
          <tr>
            <td><p>cell4-3</p></td>
          </tr>
          <tr>
            <td><p>cell5-3</p></td>
          </tr>
        </tbody>
      </table>
    `;

    assertWYSIWYGHTML(editor, expected);
  });
});
