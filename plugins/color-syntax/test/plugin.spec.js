/**
 * @fileoverview Test color syntax plugin
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import Editor from 'tui-editor/src/js/editor';
import colorPicker from 'tui-color-picker';
import colorSyntaxPlugin from '@';

describe('colorSyntax', () => {
  let container, ned;

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

      ned = new Editor({
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

      ned = new Editor({
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
      ned = new Editor({
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

      actual = ned.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', src);
      expected = '{color:#ff00ff}test{color}';

      expect(actual).toBe(expected);
    });

    it('convert multiple color html to color syntax', () => {
      const src =
        '<span class="colour" style="color:rgb(255,0,255)">test</span>' +
        'test2<span class="colour" style="color:rgb(255,0,255)">test3</span>';

      actual = ned.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', src);
      expected = '{color:#ff00ff}test{color}test2{color:#ff00ff}test3{color}';

      expect(actual).toBe(expected);
    });

    it('convert color syntax to html', () => {
      const src = '{color:#ff00ff}test{color}';

      actual = ned.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', src);
      expected = '<span style="color:#ff00ff">test</span>';

      expect(actual).toBe(expected);
    });

    it('convert multiple color syntax to html', () => {
      const src = '{color:#ff00ff}test{color}test2{color:#ff00ff}test3{color}';

      actual = ned.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', src);
      expected =
        '<span style="color:#ff00ff">test</span>test2<span style="color:#ff00ff">test3</span>';

      expect(actual).toBe(expected);
    });
  });

  describe('html syntax conversion', () => {
    let actual, expected;

    beforeEach(() => {
      ned = new Editor({
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

      actual = ned.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', src);
      expected = '{color:#ff00ff}test{color}';
      expect(actual).toBe(expected);
    });

    it('convert rgb color to hex color', () => {
      const src = '<span class="colour" style="color:rgb(255, 0, 1)">test</span>';

      actual = ned.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', src);
      expected = '<span style="color:#ff0001">test</span>';
      expect(actual).toBe(expected);
    });

    it('convert hex color to hex color', () => {
      const src = '<span class="colour" style="color:#ff0001">test</span>';

      actual = ned.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', src);
      expected = '<span style="color:#ff0001">test</span>';
      expect(actual).toBe(expected);
    });
  });

  describe('commands', () => {
    beforeEach(() => {
      ned = new Editor({
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
      ned.setValue('text');
      ned.getCodeMirror().execCommand('selectAll');
      ned.exec('color', '#f0f');

      expect(ned.getValue()).toBe('{color:#f0f}text{color}');
    });

    it(`don't add color if value isn't truthy in markdown`, () => {
      let falsyValue;

      ned.setValue('text');
      ned.getCodeMirror().execCommand('selectAll');
      ned.exec('color', falsyValue);

      expect(ned.getValue()).toBe('text');
    });

    it('add color in wysiwyg', () => {
      ned.changeMode('wysiwyg');

      const sq = ned.getSquire();
      const $body = ned.wwEditor.get$Body();

      sq.setHTML('text');

      const selection = sq.getSelection().cloneRange();

      selection.selectNodeContents($body.find('div')[0].childNodes[0]);
      sq.setSelection(selection);

      ned.exec('color', '#f0f');

      const $span = ned.wwEditor.get$Body().find('span');

      expect($span.hasClass('colour')).toBe(true);
      expect($span.css('color')).toBe('rgb(255, 0, 255)');
    });

    it(`don't add color if value isn't truthy in wysiwyg`, () => {
      let falsyValue;

      ned.changeMode('wysiwyg');

      const sq = ned.getSquire();
      const $body = ned.wwEditor.get$Body();

      sq.setHTML('text');

      const selection = sq.getSelection().cloneRange();

      selection.selectNodeContents($body.find('div')[0].childNodes[0]);
      sq.setSelection(selection);

      ned.exec('color', falsyValue);

      const $span = ned.wwEditor.get$Body().find('span');

      expect($span.hasClass('colour')).toBe(false);
    });

    it('add color in selected table cell in wysiwyg', () => {
      ned.changeMode('wysiwyg');

      const wwe = ned.wwEditor;
      const sq = ned.getSquire();

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

      range.setStart(wwe.get$Body().find('th')[0], 0);
      range.collapse(true);
      sq.setSelection(range);

      ned.exec('color', '#f0f');

      const $span = wwe.get$Body().find('span');

      expect($span.eq(0).hasClass('colour')).toBe(true);
      expect($span.eq(0).css('color')).toBe('rgb(255, 0, 255)');
      expect($span.eq(1).hasClass('colour')).toBe(true);
      expect($span.eq(1).css('color')).toBe('rgb(255, 0, 255)');
    });
  });
});
