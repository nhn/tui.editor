/**
 * @fileoverview test color syntax extension
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import util from 'tui-code-snippet';
import TuiEditor from '../../../src/js/editor';
import colorSyntaxExtension from '../../../src/js/extensions/colorSyntax';

TuiEditor.defineExtension('colorSyntax', colorSyntaxExtension);

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

  describe('custom syntax conversion', () => {
    let actual, expected;

    beforeEach(() => {
      ned = new TuiEditor({
        el: container,
        previewStyle: 'vertical',
        height: '100px',
        initialEditType: 'markdown',
        exts: ['colorSyntax'],
        colorSyntax: {
          useCustomSyntax: true
        }
      });

      actual = null;
      expected = null;
    });

    it('convert html to color syntax', () => {
      const src = '<span class="colour" style="color:rgb(255,0,255)">test</span>';
      actual = ned.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', src);
      expected = '{color:#ff00ff}test{color}';

      expect(actual).toEqual(expected);
    });

    it('convert multiple color html to color syntax', () => {
      const src = '<span class="colour" style="color:rgb(255,0,255)">test</span>' +
                'test2<span class="colour" style="color:rgb(255,0,255)">test3</span>';
      actual = ned.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', src);
      expected = '{color:#ff00ff}test{color}test2{color:#ff00ff}test3{color}';

      expect(actual).toEqual(expected);
    });

    it('convert color syntax to html', () => {
      const src = '{color:#ff00ff}test{color}';
      actual = ned.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', src);
      expected = '<span style="color:#ff00ff">test</span>';

      expect(actual).toEqual(expected);
    });

    it('convert multiple color syntax to html', () => {
      const src = '{color:#ff00ff}test{color}test2{color:#ff00ff}test3{color}';
      actual = ned.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', src);
      expected = '<span style="color:#ff00ff">test</span>test2<span style="color:#ff00ff">test3</span>';

      expect(actual).toEqual(expected);
    });
  });

  describe('html syntax conversion', () => {
    let actual, expected;

    beforeEach(() => {
      ned = new TuiEditor({
        el: container,
        previewStyle: 'vertical',
        height: '100px',
        initialEditType: 'markdown',
        exts: ['colorSyntax']
      });

      actual = null;
      expected = null;
    });

    it('do not convert color syntax to html when dont use custom syntax', () => {
      const src = '{color:#ff00ff}test{color}';

      actual = ned.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', src);
      expected = '{color:#ff00ff}test{color}';
      expect(actual).toEqual(expected);
    });

    it('convert rgb color to hex color', () => {
      const src = '<span class="colour" style="color:rgb(255, 0, 1)">test</span>';

      actual = ned.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', src);
      expected = '<span style="color:#ff0001">test</span>';
      expect(actual).toEqual(expected);
    });

    it('convert hex color to hex color', () => {
      const src = '<span class="colour" style="color:#ff0001">test</span>';

      actual = ned.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', src);
      expected = '<span style="color:#ff0001">test</span>';
      expect(actual).toEqual(expected);
    });
  });

  describe('commands', () => {
    beforeEach(() => {
      ned = new TuiEditor({
        el: container,
        previewStyle: 'vertical',
        height: '100px',
        initialEditType: 'markdown',
        exts: ['colorSyntax'],
        colorSyntax: {
          useCustomSyntax: true
        }
      });
    });
    it('add color in markdown', () => {
      ned.setValue('text');
      ned.getCodeMirror().execCommand('selectAll');
      ned.exec('color', '#f0f');

      expect(ned.getValue()).toEqual('{color:#f0f}text{color}');
    });

    it('Don\'t add color if value isn\'t truthy in markdown', () => {
      let falsyValue;

      ned.setValue('text');
      ned.getCodeMirror().execCommand('selectAll');
      ned.exec('color', falsyValue);

      expect(ned.getValue()).toEqual('text');
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
      expect($span.css('color')).toEqual('rgb(255, 0, 255)');
    });

    it('Don\'t add color if value isn\'t truthy in wysiwyg', () => {
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
  });

  describe('initializer', () => {
    xit('should not call imagePing if usageStatistics editor option is false', done => {
      spyOn(util, 'imagePing');

      ned = new TuiEditor({
        el: container,
        exts: ['colorSyntax'],
        usageStatistics: false
      });

      setTimeout(() => {
        expect(util.imagePing).not.toHaveBeenCalled();
        done();
      }, 10);
    });

    xit('should call imagePing if usageStatistics editor option is true', done => {
      spyOn(util, 'imagePing');

      ned = new TuiEditor({
        el: container,
        exts: ['colorSyntax'],
        usageStatistics: true
      });

      setTimeout(() => {
        expect(util.imagePing).toHaveBeenCalled();
        expect(util.imagePing.calls.count()).toBe(2);
        done();
      }, 10);
    });
  });
});
