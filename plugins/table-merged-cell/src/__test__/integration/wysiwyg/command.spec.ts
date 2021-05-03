import { oneLineTrim } from 'common-tags';
import Editor from '@toast-ui/editor';
import mergedTableCellPlugin from '@/index';

describe('table command with merged table plugin', () => {
  let container: HTMLElement, editor: Editor;

  function assertWYSIWYGHTML(html: string) {
    const wwEditorEl = editor.getEditorElements().wwEditor;

    expect(wwEditorEl.innerHTML).toContain(html);
  }

  beforeEach(() => {
    const content = [
      '| @cols=2:mergedHead1 | @cols=3:mergedHead2 |',
      '| --- | --- | --- | --- | --- |',
      '| @cols=2:mergedCell1-1 | cell1-2 | @cols=2:@rows=5:mergedCell1-3 |',
      '| @rows=2:mergedCell2-1 | @rows=2:mergedCell2-2 | cell2-3 |',
      '| cell3-1 |',
      '| cell4-1 | cell4 | cell4-3 |',
      '| cell5-1 | cell5-2 | cell5-3 |',
      '',
    ].join('\n');

    container = document.createElement('div');
    document.body.appendChild(container);

    editor = new Editor({
      el: container,
      initialEditType: 'wysiwyg',
      initialValue: content,
      previewStyle: 'vertical',
      plugins: [mergedTableCellPlugin],
    });
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

      assertWYSIWYGHTML(expected);
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

      assertWYSIWYGHTML(expected);
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

      assertWYSIWYGHTML(expected);
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

      assertWYSIWYGHTML(expected);
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

      assertWYSIWYGHTML(expected);
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

      assertWYSIWYGHTML(expected);
    });
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
              <td rowspan="1"><p>mergedCell2-1</p></td>
              <td rowspan="1"><p>mergedCell2-2</p></td>
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

      assertWYSIWYGHTML(expected);
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
              <td rowspan="1"><p>mergedCell2-1</p></td>
              <td rowspan="1"><p>mergedCell2-2</p></td>
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

      assertWYSIWYGHTML(expected);
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

      assertWYSIWYGHTML(expected);
    });
  });

  describe('addColumnToLeft command', () => {
    it('should add column to left and extend col-spanning cell', () => {
      editor.setSelection(102, 102); // select [2, 1] cell(mergedCell2-2 text)
      editor.exec('addColumnToLeft');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th colspan="3"><p>mergedHead1</p></th>
              <th colspan="3"><p>mergedHead2</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="3"><p>mergedCell1-1</p></td>
              <td><p>cell1-2</p></td>
              <td colspan="2" rowspan="5"><p>mergedCell1-3</p></td>
            </tr>
            <tr>
              <td rowspan="2"><p>mergedCell2-1</p></td>
              <td><p><br></p></td>
              <td rowspan="2"><p>mergedCell2-2</p></td>
              <td><p>cell2-3</p></td>
            </tr>
            <tr>
              <td><p><br></p></td>
              <td><p>cell3-1</p></td>
            </tr>
            <tr>
              <td><p>cell4-1</p></td>
              <td><p><br></p></td>
              <td><p>cell4</p></td>
              <td><p>cell4-3</p></td>
            </tr>
            <tr>
              <td><p>cell5-1</p></td>
              <td><p><br></p></td>
              <td><p>cell5-2</p></td>
              <td><p>cell5-3</p></td>
            </tr>
          </tbody>
        </table>
      `;

      assertWYSIWYGHTML(expected);
    });

    it('should add column to left', () => {
      editor.setSelection(85, 85); // select [2, 0] cell(mergedCell2-1 text)
      editor.exec('addColumnToLeft');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th><p><br></p></th>
              <th colspan="2"><p>mergedHead1</p></th>
              <th colspan="3"><p>mergedHead2</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><p><br></p></td>
              <td colspan="2"><p>mergedCell1-1</p></td>
              <td><p>cell1-2</p></td>
              <td colspan="2" rowspan="5"><p>mergedCell1-3</p></td>
            </tr>
            <tr>
              <td><p><br></p></td>
              <td rowspan="2"><p>mergedCell2-1</p></td>
              <td rowspan="2"><p>mergedCell2-2</p></td>
              <td><p>cell2-3</p></td>
            </tr>
            <tr>
              <td><p><br></p></td>
              <td><p>cell3-1</p></td>
            </tr>
            <tr>
              <td><p><br></p></td>
              <td><p>cell4-1</p></td>
              <td><p>cell4</p></td>
              <td><p>cell4-3</p></td>
            </tr>
            <tr>
              <td><p><br></p></td>
              <td><p>cell5-1</p></td>
              <td><p>cell5-2</p></td>
              <td><p>cell5-3</p></td>
            </tr>
          </tbody>
        </table>
      `;

      assertWYSIWYGHTML(expected);
    });

    it('should add column to left as many as the col-spanning count', () => {
      editor.setSelection(38, 38); // select [1, 0] cell(mergedCell1-1 text)
      editor.exec('addColumnToLeft');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th><p><br></p></th>
              <th><p><br></p></th>
              <th colspan="2"><p>mergedHead1</p></th>
              <th colspan="3"><p>mergedHead2</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><p><br></p></td>
              <td><p><br></p></td>
              <td colspan="2"><p>mergedCell1-1</p></td>
              <td><p>cell1-2</p></td>
              <td colspan="2" rowspan="5"><p>mergedCell1-3</p></td>
            </tr>
            <tr>
              <td><p><br></p></td>
              <td><p><br></p></td>
              <td rowspan="2"><p>mergedCell2-1</p></td>
              <td rowspan="2"><p>mergedCell2-2</p></td>
              <td><p>cell2-3</p></td>
            </tr>
            <tr>
              <td><p><br></p></td>
              <td><p><br></p></td>
              <td><p>cell3-1</p></td>
            </tr>
            <tr>
              <td><p><br></p></td>
              <td><p><br></p></td>
              <td><p>cell4-1</p></td>
              <td><p>cell4</p></td>
              <td><p>cell4-3</p></td>
            </tr>
            <tr>
              <td><p><br></p></td>
              <td><p><br></p></td>
              <td><p>cell5-1</p></td>
              <td><p>cell5-2</p></td>
              <td><p>cell5-3</p></td>
            </tr>
          </tbody>
        </table>
      `;

      assertWYSIWYGHTML(expected);
    });
  });

  describe('addColumnToRight command', () => {
    it('should add column to right and extend col-spanning cell', () => {
      editor.setSelection(85, 85); // select [2, 0] cell(mergedCell2-1 text)
      editor.exec('addColumnToRight');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th colspan="3"><p>mergedHead1</p></th>
              <th colspan="3"><p>mergedHead2</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="3"><p>mergedCell1-1</p></td>
              <td><p>cell1-2</p></td>
              <td colspan="2" rowspan="5"><p>mergedCell1-3</p></td>
            </tr>
            <tr>
              <td rowspan="2"><p>mergedCell2-1</p></td>
              <td><p><br></p></td>
              <td rowspan="2"><p>mergedCell2-2</p></td>
              <td><p>cell2-3</p></td>
            </tr>
            <tr>
              <td><p><br></p></td>
              <td><p>cell3-1</p></td>
            </tr>
            <tr>
              <td><p>cell4-1</p></td>
              <td><p><br></p></td>
              <td><p>cell4</p></td>
              <td><p>cell4-3</p></td>
            </tr>
            <tr>
              <td><p>cell5-1</p></td>
              <td><p><br></p></td>
              <td><p>cell5-2</p></td>
              <td><p>cell5-3</p></td>
            </tr>
          </tbody>
        </table>
      `;

      assertWYSIWYGHTML(expected);
    });

    it('should add column to right', () => {
      editor.setSelection(102, 102); // select [2, 1] cell(mergedCell2-2 text)
      editor.exec('addColumnToRight');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th colspan="2"><p>mergedHead1</p></th>
              <th><p><br></p></th>
              <th colspan="3"><p>mergedHead2</p></th>
            </tr>
          </thead>
          <tbody>
          <tr>
              <td colspan="2"><p>mergedCell1-1</p></td>
              <td><p><br></p></td>
              <td><p>cell1-2</p></td>
              <td colspan="2" rowspan="5"><p>mergedCell1-3</p></td>
            </tr>
            <tr>
              <td rowspan="2"><p>mergedCell2-1</p></td>
              <td rowspan="2"><p>mergedCell2-2</p></td>
              <td><p><br></p></td>
              <td><p>cell2-3</p></td>
            </tr>
            <tr>
              <td><p><br></p></td>
              <td><p>cell3-1</p></td>
            </tr>
            <tr>
              <td><p>cell4-1</p></td>
              <td><p>cell4</p></td>
              <td><p><br></p></td>
              <td><p>cell4-3</p></td>
            </tr>
            <tr>
              <td><p>cell5-1</p></td>
              <td><p>cell5-2</p></td>
              <td><p><br></p></td>
              <td><p>cell5-3</p></td>
            </tr>
          </tbody>
        </table>
      `;

      assertWYSIWYGHTML(expected);
    });

    it('should add column to right as many as the col-spanning count', () => {
      editor.setSelection(38, 38); // select [1, 0] cell(mergedCell1-1 text)
      editor.exec('addColumnToRight');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th colspan="2"><p>mergedHead1</p></th>
              <th><p><br></p></th>
              <th><p><br></p></th>
              <th colspan="3"><p>mergedHead2</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="2"><p>mergedCell1-1</p></td>
              <td><p><br></p></td>
              <td><p><br></p></td>
              <td><p>cell1-2</p></td>
              <td colspan="2" rowspan="5"><p>mergedCell1-3</p></td>
            </tr>
            <tr>
              <td rowspan="2"><p>mergedCell2-1</p></td>
              <td rowspan="2"><p>mergedCell2-2</p></td>
              <td><p><br></p></td>
              <td><p><br></p></td>
              <td><p>cell2-3</p></td>
            </tr>
            <tr>
              <td><p><br></p></td>
              <td><p><br></p></td>
              <td><p>cell3-1</p></td>
            </tr>
            <tr>
              <td><p>cell4-1</p></td>
              <td><p>cell4</p></td>
              <td><p><br></p></td>
              <td><p><br></p></td>
              <td><p>cell4-3</p></td>
            </tr>
            <tr>
              <td><p>cell5-1</p></td>
              <td><p>cell5-2</p></td>
              <td><p><br></p></td>
              <td><p><br></p></td>
              <td><p>cell5-3</p></td>
            </tr>
          </tbody>
        </table>
      `;

      assertWYSIWYGHTML(expected);
    });
  });

  describe('removeColumn command', () => {
    it('should remove column included col-spanning cell(normal single cell)', () => {
      editor.setSelection(85, 85); // select [2, 0] cell(mergedCell2-1 text)
      editor.exec('removeColumn');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th colspan="1"><p>mergedHead1</p></th>
              <th colspan="3"><p>mergedHead2</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="1"><p>mergedCell1-1</p></td>
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

      assertWYSIWYGHTML(expected);
    });

    it('should remove column(normal single cell)', () => {
      editor.setSelection(102, 102); // select [2, 1] cell(mergedCell2-2 text)
      editor.exec('removeColumn');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th colspan="1"><p>mergedHead1</p></th>
              <th colspan="3"><p>mergedHead2</p></th>
            </tr>
          </thead>
          <tbody>
          <tr>
              <td colspan="1"><p>mergedCell1-1</p></td>
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

      assertWYSIWYGHTML(expected);
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

      assertWYSIWYGHTML(expected);
    });
  });
});
