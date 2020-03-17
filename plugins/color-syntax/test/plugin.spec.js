/**
 * @fileoverview Test color syntax plugin
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import Editor from '@toast-ui/editor';
import colorPicker from 'tui-color-picker';
import colorSyntaxPlugin from '@';

describe('colorSyntax', () => {
  let container, editor;

  beforeEach(() => {
    container = document.createElement('div');
    container.setAttribute('id', 'editSection');
    document.body.appendChild(container);
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      document.body.removeChild(container);
      done();
    });
  });

  describe('usageStatistics option', () => {
    it('when setting false, GA of color picker is disabled', () => {
      spyOn(colorPicker, 'create').and.callThrough();

      editor = new Editor({
        el: container,
        previewStyle: 'vertical',
        plugins: [colorSyntaxPlugin],
        usageStatistics: false
      });

      expect(colorPicker.create).toHaveBeenCalledWith(
        jasmine.objectContaining({
          usageStatistics: false
        })
      );
    });

    it('when setting true, GA of color picker is enabled', () => {
      spyOn(colorPicker, 'create').and.callThrough();

      editor = new Editor({
        el: container,
        previewStyle: 'vertical',
        plugins: [colorSyntaxPlugin],
        usageStatistics: true
      });

      expect(colorPicker.create).toHaveBeenCalledWith(
        jasmine.objectContaining({
          usageStatistics: true
        })
      );
    });
  });

  describe('custom syntax conversion', () => {
    let actual, expected;

    beforeEach(() => {
      editor = new Editor({
        el: container,
        previewStyle: 'vertical',
        height: '100px',
        initialEditType: 'markdown',
        plugins: [
          [
            colorSyntaxPlugin,
            {
              useCustomSyntax: true
            }
          ]
        ]
      });

      actual = null;
      expected = null;
    });

    it('convert html to color syntax', () => {
      const src = '<span class="colour" style="color:rgb(255,0,255)">test</span>';

      actual = editor.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', src);
      expected = '{color:#ff00ff}test{color}';

      expect(actual).toBe(expected);
    });

    it('convert multiple color html to color syntax', () => {
      const src =
        '<span class="colour" style="color:rgb(255,0,255)">test</span>' +
        'test2<span class="colour" style="color:rgb(255,0,255)">test3</span>';

      actual = editor.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', src);
      expected = '{color:#ff00ff}test{color}test2{color:#ff00ff}test3{color}';

      expect(actual).toBe(expected);
    });

    it('convert color syntax to html', () => {
      const src = '{color:#ff00ff}test{color}';

      actual = editor.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', src);
      expected = '<span style="color:#ff00ff">test</span>';

      expect(actual).toBe(expected);
    });

    it('convert multiple color syntax to html', () => {
      const src = '{color:#ff00ff}test{color}test2{color:#ff00ff}test3{color}';

      actual = editor.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', src);
      expected =
        '<span style="color:#ff00ff">test</span>test2<span style="color:#ff00ff">test3</span>';

      expect(actual).toBe(expected);
    });
  });

  describe('html syntax conversion', () => {
    let actual, expected;

    beforeEach(() => {
      editor = new Editor({
        el: container,
        previewStyle: 'vertical',
        height: '100px',
        initialEditType: 'markdown',
        plugins: [colorSyntaxPlugin]
      });

      actual = null;
      expected = null;
    });

    it(`don't convert color syntax to html when don't use custom syntax`, () => {
      const src = '{color:#ff00ff}test{color}';

      actual = editor.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', src);
      expected = '{color:#ff00ff}test{color}';
      expect(actual).toBe(expected);
    });

    it('convert rgb color to hex color', () => {
      const src = '<span class="colour" style="color:rgb(255, 0, 1)">test</span>';

      actual = editor.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', src);
      expected = '<span style="color:#ff0001">test</span>';
      expect(actual).toBe(expected);
    });

    it('convert hex color to hex color', () => {
      const src = '<span class="colour" style="color:#ff0001">test</span>';

      actual = editor.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', src);
      expected = '<span style="color:#ff0001">test</span>';
      expect(actual).toBe(expected);
    });
  });

  describe('commands', () => {
    beforeEach(() => {
      editor = new Editor({
        el: container,
        previewStyle: 'vertical',
        height: '100px',
        initialEditType: 'markdown',
        plugins: [
          [
            colorSyntaxPlugin,
            {
              useCustomSyntax: true
            }
          ]
        ]
      });
    });

    it('add color in markdown', () => {
      editor.setMarkdown('text');
      editor.getCodeMirror().execCommand('selectAll');
      editor.exec('color', '#f0f');

      expect(editor.getValue()).toBe('{color:#f0f}text{color}');
    });

    it(`don't add color if value isn't truthy in markdown`, () => {
      let falsyValue;

      editor.setMarkdown('text');
      editor.getCodeMirror().execCommand('selectAll');
      editor.exec('color', falsyValue);

      expect(editor.getValue()).toBe('text');
    });

    it('add color in wysiwyg', () => {
      editor.changeMode('wysiwyg');

      const sq = editor.getSquire();
      const body = editor.wwEditor.getBody();

      sq.setHTML('text');

      const selection = sq.getSelection().cloneRange();

      selection.selectNodeContents(body.querySelector('div').childNodes[0]);
      sq.setSelection(selection);

      editor.exec('color', '#f0f');

      const span = editor.wwEditor.getBody().querySelector('span');

      expect(span.className).toBe('colour');
      expect(span.style.color).toBe('rgb(255, 0, 255)');
    });

    it(`don't add color if value isn't truthy in wysiwyg`, () => {
      let falsyValue;

      editor.changeMode('wysiwyg');

      const sq = editor.getSquire();
      const body = editor.wwEditor.getBody();

      sq.setHTML('text');

      const selection = sq.getSelection().cloneRange();

      selection.selectNodeContents(body.querySelector('div').childNodes[0]);
      sq.setSelection(selection);

      editor.exec('color', falsyValue);

      const span = editor.wwEditor.getBody().querySelector('span');

      expect(span).toBeNull();
    });

    it('add color in selected table cell in wysiwyg', () => {
      editor.changeMode('wysiwyg');

      const wwe = editor.wwEditor;
      const sq = editor.getSquire();

      sq.setHTML(
        [
          '<table>',
          '<thead>',
          '<tr><th></th><th></th></tr>',
          '</thead>',
          '<tbody>',
          '<tr><td class="te-cell-selected">text 1</td><td class="te-cell-selected">text 2</td></tr>',
          '</tbody>',
          '</table>'
        ].join('')
      );

      const range = sq.getSelection();

      range.setStart(wwe.getBody().querySelector('th'), 0);
      range.collapse(true);
      sq.setSelection(range);

      editor.exec('color', '#f0f');

      const span = wwe.getBody().querySelectorAll('span');

      expect(span[0].className).toBe('colour');
      expect(span[0].style.color).toBe('rgb(255, 0, 255)');
      expect(span[1].className).toBe('colour');
      expect(span[1].style.color).toBe('rgb(255, 0, 255)');
    });
  });
});
