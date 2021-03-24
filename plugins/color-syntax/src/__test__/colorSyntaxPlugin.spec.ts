/**
 * @fileoverview Test color syntax plugin
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import Editor from '@toast-ui/editor';
import colorPicker from 'tui-color-picker';
import colorSyntaxPlugin from '../index';
import { oneLineTrim } from 'common-tags';

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

    expect(wwEditorEl).toContainHTML(html);
  }

  function assertMdPreviewHTML(html: string) {
    const mdPreviewEl = editor.getEditorElements().mdPreview;

    expect(removeDataAttr(mdPreviewEl.innerHTML)).toContain(html);
  }

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  // we need to wait squire input event process
  afterEach(() => {
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
      editor.exec('markdown', 'selectAll');
      editor.exec('markdown', 'color', { selectedColor: '#f0f' });

      editor.changeMode('wysiwyg');

      assertWwEditorHTML('<p><span style="color: #f0f">text</span><br></p>');
    });

    it('should convert wysiwyg to markdown properly', () => {
      editor.setMarkdown('text');
      editor.exec('markdown', 'selectAll');
      editor.exec('markdown', 'color', { selectedColor: '#f0f' });

      editor.changeMode('wysiwyg');
      editor.changeMode('markdown');

      assertMdPreviewHTML('<span style="color: #f0f">text</span>');
    });

    it('should convert markdown to wysiwyg in table cell properly', () => {
      editor.exec('markdown', 'addTable', {
        columnCount: 2,
        rowCount: 2,
      });
      editor.setSelection([1, 5], [1, 5]);
      editor.insertText('foo');
      editor.setSelection([1, 5], [1, 8]);

      editor.exec('markdown', 'color', { selectedColor: '#f0f' });

      editor.changeMode('wysiwyg');

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th><p><span style="color: #f0f">foo</span><br></p></th>
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

      editor.exec('wysiwyg', 'addTable', {
        rowCount: 2,
        columnCount: 2,
        data: ['foo', 'bar', 'baz', 'qux'],
      });
      editor.setSelection(4, 8);
      editor.exec('wysiwyg', 'color', { selectedColor: '#f0f' });

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
      editor.exec('markdown', 'selectAll');
      editor.exec('markdown', 'color', { selectedColor: '#f0f' });

      assertMdPreviewHTML('<span style="color: #f0f">text</span>');
    });

    it(`don't add color if value isn't truthy in markdown`, () => {
      editor.setMarkdown('text');
      editor.exec('markdown', 'selectAll');
      editor.exec('markdown', 'color');

      assertMdPreviewHTML('<p class="tui-editor-md-preview-highlight">text</p>');
    });

    it('add color in wysiwyg', () => {
      editor.setMarkdown('text');
      editor.changeMode('wysiwyg');

      editor.exec('wysiwyg', 'selectAll');
      editor.exec('wysiwyg', 'color', { selectedColor: '#f0f' });

      assertWwEditorHTML('<p><span style="color: #f0f">text</span><br></p>');
    });

    it(`don't add color if value isn't truthy in wysiwyg`, () => {
      editor.setMarkdown('text');
      editor.changeMode('wysiwyg');

      editor.exec('wysiwyg', 'selectAll');
      editor.exec('wysiwyg', 'color');

      assertWwEditorHTML('<p>text</p>');
    });

    it('add color in selected table cell in wysiwyg', () => {
      editor.changeMode('wysiwyg');

      editor.exec('wysiwyg', 'addTable', {
        rowCount: 2,
        columnCount: 2,
        data: ['foo', 'bar', 'baz', 'qux'],
      });
      editor.setSelection(4, 8);

      editor.exec('wysiwyg', 'color', { selectedColor: '#f0f' });

      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th><p><span style="color: #f0f">foo</span><br></p></th>
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
});
