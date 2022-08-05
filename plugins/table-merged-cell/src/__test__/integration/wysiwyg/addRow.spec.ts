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

describe('addRowToUp command', () => {
  it('should add row to up and not extend row-spanning cell', () => {
    editor.setSelection(119, 119); // select [2, 2] cell(cell2-3 text)
    editor.exec('addRowToUp');

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
            <td colspan="2" rowspan="6"><p>mergedCell1-3</p></td>
          </tr>
          <tr>
            <td><p><br></p></td>
            <td><p><br></p></td>
            <td><p><br></p></td>
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

  it('should add row to up and extend row-spanning cell', () => {
    editor.setSelection(132, 132); // select [3, 2] cell(cell3-1 text)
    editor.exec('addRowToUp');

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
            <td colspan="2" rowspan="6"><p>mergedCell1-3</p></td>
          </tr>
          <tr>
            <td rowspan="3"><p>mergedCell2-1</p></td>
            <td rowspan="3"><p>mergedCell2-2</p></td>
            <td><p>cell2-3</p></td>
          </tr>
          <tr>
            <td><p><br></p></td>
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

  it('should add row to up as many as the row-spanning count', () => {
    editor.setSelection(100, 100); // select [2, 1] cell(mergedCell2-2 text)
    editor.exec('addRowToUp');

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
            <td colspan="2" rowspan="7"><p>mergedCell1-3</p></td>
          </tr>
          <tr>
            <td><p><br></p></td>
            <td><p><br></p></td>
            <td><p><br></p></td>
          </tr>
          <tr>
            <td><p><br></p></td>
            <td><p><br></p></td>
            <td><p><br></p></td>
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

describe('addRowToDown command', () => {
  it('should add row to down and extend row-spanning cell', () => {
    editor.setSelection(132, 132); // select [3, 2] cell(cell3-1 text)
    editor.exec('addRowToDown');

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
            <td colspan="2" rowspan="6"><p>mergedCell1-3</p></td>
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
            <td><p><br></p></td>
            <td><p><br></p></td>
            <td><p><br></p></td>
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

  it('should add row to down and not extend row-spanning cell', () => {
    editor.setSelection(119, 119); // select [2, 2] cell(cell2-3 text)
    editor.exec('addRowToDown');

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
            <td colspan="2" rowspan="6"><p>mergedCell1-3</p></td>
          </tr>
          <tr>
            <td rowspan="3"><p>mergedCell2-1</p></td>
            <td rowspan="3"><p>mergedCell2-2</p></td>
            <td><p>cell2-3</p></td>
          </tr>
          <tr>
            <td><p><br></p></td>
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

  it('should add row to down as many as the row-spanning count', () => {
    editor.setSelection(100, 100); // select [2, 1] cell(mergedCell2-2 text)
    editor.exec('addRowToDown');

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
            <td colspan="2" rowspan="7"><p>mergedCell1-3</p></td>
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
            <td><p><br></p></td>
            <td><p><br></p></td>
            <td><p><br></p></td>
          </tr>
          <tr>
            <td><p><br></p></td>
            <td><p><br></p></td>
            <td><p><br></p></td>
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
