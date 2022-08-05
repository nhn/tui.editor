import Editor from '@toast-ui/editor';
import colorPicker from 'tui-color-picker';
import { oneLineTrim } from 'common-tags';
import colorSyntaxPlugin from '@/index';
import { removeProseMirrorHackNodes } from '@/utils/dom';

function removeDataAttr(html: string) {
  return html
    .replace(/\sdata-nodeid="\d{1,}"/g, '')
    .replace(/\n/g, '')
    .trim();
}

describe('colorSyntax', () => {
  let container: HTMLElement, editor: Editor;

  function assertWwEditorHTML(html: string) {
    const wwEditorEl = editor.getEditorElements().wwEditor;

    const wwEditorHTML = removeProseMirrorHackNodes(wwEditorEl.outerHTML);

    expect(wwEditorHTML).toContain(html);
  }

  function assertMdPreviewHTML(html: string) {
    const mdPreviewEl = editor.getEditorElements().mdPreview;

    expect(removeDataAttr(mdPreviewEl.innerHTML)).toContain(html);
  }

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    editor.destroy();
    document.body.removeChild(container);
  });

  describe('usageStatistics option', () => {
    it('when setting false, GA of color picker is disabled', () => {
      jest.spyOn(colorPicker, 'create');

      editor = new Editor({
        el: container,
        previewStyle: 'vertical',
        plugins: [colorSyntaxPlugin],
        usageStatistics: false,
      });

      expect(colorPicker.create).toHaveBeenCalledWith(
        expect.objectContaining({
          usageStatistics: false,
        })
      );
    });

    it('when setting true, GA of color picker is enabled', () => {
      jest.spyOn(colorPicker, 'create');

      editor = new Editor({
        el: container,
        previewStyle: 'vertical',
        plugins: [colorSyntaxPlugin],
      });

      expect(colorPicker.create).toHaveBeenCalledWith(
        expect.objectContaining({
          usageStatistics: true,
        })
      );
    });
  });

  describe('convertor', () => {
    beforeEach(() => {
      editor = new Editor({
        el: container,
        previewStyle: 'vertical',
        height: '100px',
        initialEditType: 'markdown',
        plugins: [colorSyntaxPlugin],
      });
    });

    it('should convert markdown to wysiwyg properly', () => {
      editor.setMarkdown('text');
      editor.exec('selectAll');
      editor.exec('color', { selectedColor: '#f0f' });

      editor.changeMode('wysiwyg');

      assertWwEditorHTML('<p><span style="color: #f0f">text</span></p>');
    });

    it('should convert wysiwyg to markdown properly', () => {
      editor.setMarkdown('text');
      editor.exec('selectAll');
      editor.exec('color', { selectedColor: '#f0f' });

      editor.changeMode('wysiwyg');
      editor.changeMode('markdown');

      assertMdPreviewHTML('<span style="color: #f0f">text</span>');
    });

    it('should convert markdown to wysiwyg in table cell properly', () => {
      editor.exec('addTable', {
        columnCount: 2,
        rowCount: 2,
      });
      editor.setSelection([1, 5], [1, 5]);
      editor.insertText('foo');
      editor.setSelection([1, 5], [1, 8]);

      editor.exec('color', { selectedColor: '#f0f' });

      editor.changeMode('wysiwyg');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th><p><span style="color: #f0f">foo</span></p></th>
              <th><p><br></p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><p><br></p></td>
              <td><p><br></p></td>
            </tr>
          </tbody>
        </table>
      `;

      assertWwEditorHTML(expected);
    });

    it('should convert wysiwyg to markdown in table cell properly', () => {
      editor.changeMode('wysiwyg');

      editor.exec('addTable', {
        rowCount: 2,
        columnCount: 2,
        data: ['foo', 'bar', 'baz', 'qux'],
      });
      editor.setSelection(4, 8);
      editor.exec('color', { selectedColor: '#f0f' });

      editor.changeMode('markdown');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th><span style="color: #f0f">foo</span></th>
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

      assertMdPreviewHTML(expected);
    });
  });

  describe('commands', () => {
    beforeEach(() => {
      editor = new Editor({
        el: container,
        previewStyle: 'vertical',
        height: '100px',
        initialEditType: 'markdown',
        plugins: [colorSyntaxPlugin],
      });
    });

    it('add color in markdown', () => {
      editor.setMarkdown('text');
      editor.exec('selectAll');
      editor.exec('color', { selectedColor: '#f0f' });

      assertMdPreviewHTML('<span style="color: #f0f">text</span>');
    });

    it(`don't add color if value isn't truthy in markdown`, () => {
      editor.setMarkdown('text');
      editor.exec('selectAll');
      editor.exec('color');

      assertMdPreviewHTML('<p class="toastui-editor-md-preview-highlight">text</p>');
    });

    it('add color in wysiwyg', () => {
      editor.setMarkdown('text');
      editor.changeMode('wysiwyg');

      editor.exec('selectAll');
      editor.exec('color', { selectedColor: '#f0f' });

      assertWwEditorHTML('<p><span style="color: #f0f">text</span></p>');
    });

    it(`don't add color if value isn't truthy in wysiwyg`, () => {
      editor.setMarkdown('text');
      editor.changeMode('wysiwyg');

      editor.exec('selectAll');
      editor.exec('color');

      assertWwEditorHTML('<p>text</p>');
    });

    it('add color in selected table cell in wysiwyg', () => {
      editor.changeMode('wysiwyg');

      editor.exec('addTable', {
        rowCount: 2,
        columnCount: 2,
        data: ['foo', 'bar', 'baz', 'qux'],
      });
      editor.setSelection(4, 8);

      editor.exec('color', { selectedColor: '#f0f' });

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th><p><span style="color: #f0f">foo</span></p></th>
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

      assertWwEditorHTML(expected);
    });
  });

  describe('multi instances', () => {
    let container2: HTMLElement, editor2: Editor;

    beforeEach(() => {
      container2 = document.createElement('div');
      document.body.appendChild(container2);
    });

    afterEach(() => {
      editor2.destroy();
      document.body.removeChild(container2);
    });

    it('should focus to correct editor when using color syntax plugin', () => {
      editor = new Editor({
        el: container,
        previewStyle: 'vertical',
        height: '100px',
        initialEditType: 'markdown',
        plugins: [colorSyntaxPlugin],
      });

      editor2 = new Editor({
        el: container2,
        previewStyle: 'vertical',
        height: '100px',
        initialEditType: 'markdown',
        plugins: [colorSyntaxPlugin],
      });

      editor2.exec('selectAll');
      editor2.exec('color', { selectedColor: '#f0f' });

      expect(container2).toContainElement(document.activeElement as HTMLElement);
    });
  });
});
