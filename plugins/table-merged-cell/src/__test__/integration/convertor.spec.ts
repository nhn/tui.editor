import { oneLineTrim } from 'common-tags';
import Editor from '@toast-ui/editor';
import mergedTableCellPlugin from '@/index';

describe('convertor with merged table plugin', () => {
  let container: HTMLElement, editor: Editor;

  function assertMdEditorText(markdownText: string) {
    expect(editor.getMarkdown()).toBe(markdownText);
  }

  function assertWYSIWYGHTML(html: string) {
    const wwEditorEl = editor.getEditorElements().wwEditor;

    expect(wwEditorEl.innerHTML).toContain(html);
  }

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    editor = new Editor({
      el: container,
      previewStyle: 'vertical',
      plugins: [mergedTableCellPlugin],
    });
  });

  afterEach(() => {
    editor.destroy();
    document.body.removeChild(container);
  });

  it('should convert to wysiwyg properly', () => {
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
            <td><p>cell2-3</p></td></tr><tr><td><p>cell3-1</p></td>
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

    editor.setMarkdown(content);
    editor.changeMode('wysiwyg');

    assertWYSIWYGHTML(expected);
  });

  it('should convert to markdown properly', () => {
    const content = [
      '| @cols=2:mergedHead1 | @cols=3:mergedHead2 |',
      '| ----------- | ----------- | ----------- | ----------- | ----------- |',
      '| @cols=2:mergedCell1-1 | cell1-2 | @cols=2:@rows=5:mergedCell1-3 |',
      '| @rows=2:mergedCell2-1 | @rows=2:mergedCell2-2 | cell2-3 |',
      '| cell3-1 |',
      '| cell4-1 | cell4 | cell4-3 |',
      '| cell5-1 | cell5-2 | cell5-3 |',
      '',
    ].join('\n');

    editor.setMarkdown(content);
    editor.changeMode('wysiwyg');
    editor.changeMode('markdown');

    assertMdEditorText(content);
  });
});
