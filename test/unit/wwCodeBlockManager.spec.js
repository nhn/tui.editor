/**
 * @fileoverview test wysiwyg code block manager
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';

import WysiwygEditor from '../../src/js/wysiwygEditor';
import EventManager from '../../src/js/eventManager';
import WwCodeBlockManager from '../../src/js/wwCodeBlockManager';

describe('WwCodeBlockManager', () => {
  let $container, em, wwe, mgr;

  beforeEach(() => {
    $container = $('<div />');

    $('body').append($container);

    em = new EventManager();

    wwe = new WysiwygEditor($container, em);

    wwe.init();

    mgr = new WwCodeBlockManager(wwe);
    wwe.focus();
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      $container.remove();
      done();
    });
  });

  describe('isInCodeBlock', () => {
    it('check if passed range is in codeblock', () => {
      const range = wwe.getEditor().getSelection().cloneRange();

      wwe.getEditor().setHTML('<pre><div>test</div></pre>');

      range.setStart(wwe.get$Body().find('div')[0], 0);
      range.collapse(true);

      expect(mgr.isInCodeBlock(range)).toBe(true);
    });
  });

  describe('key handlers', () => {
    describe('BACKSPACE', () => {
      it('_onBackspaceKeyEvnetHandler() remove codeblock if codeblock has one code line when offset is 0', () => {
        const range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('<pre>test</pre>');

        range.setStart(wwe.get$Body().find('pre')[0].childNodes[0], 0);
        range.collapse(true);

        wwe.getEditor().setSelection(range);

        em.emit('wysiwygKeyEvent', {
          keyMap: 'BACK_SPACE',
          data: {
            preventDefault: () => {}
          }
        });

        expect(wwe.get$Body().find('div').length).toEqual(2);
        expect(wwe.get$Body().find('div').eq(0).text()).toEqual('test');
        expect(wwe.get$Body().find('pre').length).toEqual(0);
      });

      it('_onBackspaceKeyEvnetHandler() remove codeblock and make one empty line if there is no content', () => {
        const range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('<pre>\n</pre>');

        range.setStart(wwe.get$Body().find('pre')[0], 0);
        range.collapse(true);

        wwe.getEditor().setSelection(range);

        em.emit('wysiwygKeyEvent', {
          keyMap: 'BACK_SPACE',
          data: {
            preventDefault: () => {}
          }
        });

        expect(wwe.get$Body().find('div').length).toEqual(2);
        expect(wwe.get$Body().find('pre').length).toEqual(0);
      });

      it('_onBackspaceKeyEventHandler() merge same codeblocks if backspace key is pressed in empty line between same codeblock', () => {
        const range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue([
          '<pre>test1</pre>',
          '<div><br></div>',
          '<pre>test2</pre>'
        ].join(''));

        range.setStart(wwe.get$Body().find('div')[0], 0);
        range.collapse(true);

        wwe.getEditor().setSelection(range);

        em.emit('wysiwygKeyEvent', {
          keyMap: 'BACK_SPACE',
          data: {
            preventDefault: () => {}
          }
        });

        expect(wwe.get$Body().find('div').length).toEqual(1);
        expect(wwe.get$Body().find('pre').length).toEqual(1);
        expect(wwe.get$Body().find('pre').text()).toEqual('test1\ntest2');
      });

      it('_onBackspaceKeyEventHandler() do not merge codeblocks that has different data-language attribute if backspace key is pressed in empty line between different codeblock', () => {
        const range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue([
          '<pre data-language="uml">test1</pre>',
          '<div><br></div>',
          '<pre data-language="chart">test2</pre>'
        ].join(''));

        range.setStart(wwe.get$Body().find('div')[0], 0);
        range.collapse(true);

        wwe.getEditor().setSelection(range);

        em.emit('wysiwygKeyEvent', {
          keyMap: 'BACK_SPACE',
          data: {
            preventDefault: () => {}
          }
        });

        expect(wwe.get$Body().find('div').length).toEqual(2);
        expect(wwe.get$Body().find('pre').length).toEqual(2);
      });
    });
  });

  describe('_copyCodeblockTypeFromRangeCodeblock', () => {
    it('copy codeblock\'s type to range codeblock', () => {
      const codeblock = $('<pre><code>test</code><br></pre>');

      wwe.setValue('<pre><code class="lang-javascript" data-language="javascript">'
                         + 'mycode</code></pre>');

      const range = wwe.getEditor().getSelection().cloneRange();

      range.setStart(wwe.get$Body().find('pre')[0], 1);
      range.collapse(true);

      mgr._copyCodeblockTypeFromRangeCodeblock(codeblock[0], range);

      expect(codeblock.hasClass('lang-javascript')).toBe(true);
      expect(codeblock.attr('data-language')).toEqual('javascript');
      expect(codeblock.attr('data-te-codeblock')).toBeDefined();
    });
  });

  describe('prepareToPasteOnCodeblock', () => {
    it('should change block tag to "\\n" if pasteData have block tag', () => {
      const pasteData = $('<div>test1<br></div><div>test2<br></div>');

      const fragment = wwe.getEditor().getDocument().createDocumentFragment();
      $(fragment).append(pasteData);

      const resultFragment = mgr.prepareToPasteOnCodeblock(util.toArray(fragment.childNodes));
      expect($(resultFragment).text()).toEqual('test1\ntest2');
    });
  });
  describe('Event', () => {
    it('split to each code tag in code block on line feed on wysiwygSetValueAfter', () => {
      wwe.setValue('<pre><code class="lang-javascript" data-language="javascript">'
                         + 'test\ntest2\n\ntest3\n</code></pre>');

      const codeblock = wwe.get$Body().find('pre');

      expect(codeblock.length).toEqual(1);
      expect(codeblock.hasClass('lang-javascript')).toBe(true);
      expect(codeblock.attr('data-language')).toEqual('javascript');
      expect(codeblock.attr('data-te-codeblock')).toBeDefined();
    });

    it('join each line of code block to one codeblock on wysiwygProcessHTMLText', () => {
      wwe.getEditor().setHTML([
        '<pre>',
        'test1\n',
        'test2\n',
        '</pre>'
      ].join(''));

      expect(wwe.getValue()).toEqual([
        '<pre>',
        '<code>test1\ntest2\n</code>',
        '</pre>'
      ].join(''));
    });

    it('join each line of code block to one codeblock on wysiwygProcessHTMLText with code attr', () => {
      wwe.getEditor().setHTML([
        '<pre class="lang-javascript" data-language="javascript">',
        'test1\n',
        'test2\n',
        '</pre>'
      ].join(''));

      expect(wwe.getValue()).toEqual([
        '<pre>',
        '<code class="lang-javascript" data-language="javascript">test1\ntest2\n</code>',
        '</pre>'
      ].join(''));
    });

    it('join each line of multiple code block to one codeblock on wysiwygProcessHTMLText', () => {
      wwe.getEditor().setHTML([
        '<pre class="lang-javascript" data-language="javascript">',
        'test1\n',
        'test2\n',
        '</pre>',
        '<pre class="lang-javascript" data-language="javascript">',
        'test3\n',
        'test4\n',
        '</pre>'
      ].join(''));

      expect(wwe.getValue()).toEqual([
        '<pre><code class="lang-javascript" data-language="javascript">test1\ntest2\n</code></pre>',
        '<pre><code class="lang-javascript" data-language="javascript">test3\ntest4\n</code></pre>'
      ].join(''));
    });
  });
  describe('modifyCodeBlockForWysiwyg', () => {
    it('update pre tag with language attributes and add data-te-codeblock attribute', () => {
      const frag = document.createDocumentFragment();

      $(frag).append('<pre><code class="lang-javascript" data-language="javascript">'
                + 'test</code></pre>');

      mgr.modifyCodeBlockForWysiwyg(frag);

      const codeblock = $($(frag).find('pre'));

      expect(codeblock.length).toEqual(1);
      expect(codeblock.hasClass('lang-javascript')).toBe(true);
      expect(codeblock.attr('data-language')).toEqual('javascript');
      expect(codeblock.attr('data-te-codeblock')).toBeDefined();
    });

    it('update pre tag with data-backticks attributes', () => {
      const frag = document.createDocumentFragment();
      $(frag).append('<pre><code data-backticks="4">test</code></pre>');

      mgr.modifyCodeBlockForWysiwyg(frag);

      const codeblock = $($(frag).find('pre'));
      expect(codeblock.attr('data-backticks')).toEqual('4');
    });

    it('trim last linefeeds', () => {
      const frag = document.createDocumentFragment();

      $(frag).append('<pre><code class="lang-javascript" data-language="javascript">'
                + 'test\n\ntest\n\n\n</code></pre>');

      mgr.modifyCodeBlockForWysiwyg(frag);

      const codeblock = $($(frag).find('pre')).text();

      expect(codeblock.split('\n').length).toEqual(3);
    });

    it('makes normal codeblock with pre > code > textlines', () => {
      const frag = document.createDocumentFragment();

      $(frag).append('<pre><code class="lang-javascript" data-language="javascript">'
                + 'test\ntest2\n\ntest3\n</code></pre>');

      mgr.modifyCodeBlockForWysiwyg(frag);

      const codeblock = $($(frag).find('pre')).text();

      expect(codeblock.split('\n').length).toEqual(4);
    });

    it('Makes normal codeblock with pre > divs', () => {
      const frag = document.createDocumentFragment();

      $(frag).append('<pre>'
                + '<div>test</div>'
                + '<div>test2</div>'
                + '<div>test3</div>'
                + '</pre>');

      mgr.modifyCodeBlockForWysiwyg(frag);

      const codeblock = $($(frag).find('pre')).text();

      expect(codeblock.split('\n').length).toEqual(3);
    });
  });
});
