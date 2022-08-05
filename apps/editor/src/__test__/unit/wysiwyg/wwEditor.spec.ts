import { oneLineTrim } from 'common-tags';

import { DOMParser } from 'prosemirror-model';

import WysiwygEditor from '@/wysiwyg/wwEditor';
import EventEmitter from '@/event/eventEmitter';
import { WwToDOMAdaptor } from '@/wysiwyg/adaptor/wwToDOMAdaptor';
import { createHTMLSchemaMap } from '@/wysiwyg/nodes/html';
import { sanitizeHTML } from '@/sanitizer/htmlSanitizer';
import { createHTMLrenderer } from '../markdown/util';

jest.useFakeTimers();

describe('WysiwygEditor', () => {
  let wwe: WysiwygEditor, em: EventEmitter, el: HTMLElement;

  function assertToContainHTML(html: string) {
    expect(wwe.view.dom.innerHTML).toContain(html);
  }

  function setContent(content: string) {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = content;

    const nodes = DOMParser.fromSchema(wwe.schema).parse(wrapper);

    wwe.setModel(nodes);
  }

  beforeEach(() => {
    const htmlRenderer = createHTMLrenderer();
    const toDOMAdaptor = new WwToDOMAdaptor({}, htmlRenderer);
    const htmlSchemaMap = createHTMLSchemaMap(htmlRenderer, sanitizeHTML, toDOMAdaptor);

    em = new EventEmitter();
    wwe = new WysiwygEditor(em, { toDOMAdaptor, htmlSchemaMap });
    el = wwe.el;
    document.body.appendChild(el);
  });

  afterEach(() => {
    jest.clearAllTimers();
    if (Object.keys(wwe).length) {
      wwe.destroy();
    }
    document.body.removeChild(el);
  });

  describe('API', () => {
    it('destroy() initialize instance object', () => {
      wwe.destroy();

      expect(wwe).toEqual({});
    });

    it(`focus() enable editor's dom selection state`, () => {
      wwe.focus();

      // run setTimeout function when focusing the editor
      jest.runAllTimers();

      expect(document.activeElement).toEqual(wwe.view.dom);
    });

    it(`blur() disable editor's dom selection state`, () => {
      wwe.focus();
      wwe.blur();

      expect(document.activeElement).not.toEqual(wwe.view.dom);
    });

    it('setHeight() change height of editor', () => {
      wwe.setHeight(50);

      expect(wwe.el.style.height).toBe('50px');
    });

    it('setMinHeight() change minimum height of editor', () => {
      wwe.setMinHeight(50);

      expect(wwe.el.style.minHeight).toBe('50px');
    });

    it('setPlaceholder() attach placeholder element', () => {
      wwe.setPlaceholder('placeholder text');

      assertToContainHTML(oneLineTrim`

          <span class="placeholder ProseMirror-widget">placeholder text</span>
      `);
    });

    it('scrollTo() move scroll position', () => {
      setContent(oneLineTrim`
        <p>foo</p>
        <p><br></p>
        <p><br></p>
        <p><br></p>
        <p><br></p>
        <p><br></p>
        <p><br></p>
        <p><br></p>
      `);

      wwe.setHeight(50);
      wwe.setScrollTop(30);

      expect(wwe.getScrollTop()).toBe(30);
    });

    it('getSelection() return selection range as array', () => {
      setContent(oneLineTrim`
        <p>foo</p>
        <p>bar</p>
        <p>baz</p>
      `);

      wwe.setSelection(13, 2);

      expect(wwe.getSelection()).toEqual([2, 13]);
    });

    it('replaceSelection() change text of selection range', () => {
      setContent(oneLineTrim`
        <p>foo</p>
        <p>bar</p>
      `);

      wwe.setSelection(3, 7);
      wwe.replaceSelection('new foo\nnew bar');

      assertToContainHTML(oneLineTrim`
        <p>fonew foo</p>
        <p>new barar</p>
      `);
    });

    it('addWidget API', () => {
      const ul = document.createElement('ul');

      ul.innerHTML = `
        <li>Ryu</li>
        <li>Lee</li>
      `;

      wwe.addWidget(ul, 'top');

      expect(document.body).toContainElement(ul);

      wwe.blur();

      expect(document.body).not.toContainElement(ul);
    });
  });

  it(`should emit 'changeToolbarState' event when changing cursor`, () => {
    setContent(oneLineTrim`
      <p>foo</p>
      <p>bar</p>
    `);

    const spy = jest.fn();

    em.listen('changeToolbarState', spy);

    wwe.setSelection(3, 3);

    expect(spy).toHaveBeenCalled();
  });

  it('should display html block element properly', () => {
    setContent(
      '<iframe width="420" height="315" src="https://www.youtube.com/embed/XyenY12fzAk"></iframe>'
    );

    assertToContainHTML(
      '<iframe src="https://www.youtube.com/embed/XyenY12fzAk" height="315" width="420" class="html-block ProseMirror-selectednode" draggable="true"></iframe>'
    );
  });

  it('should display html inline element properly', () => {
    setContent('<big class="my-inline">text</big>');

    assertToContainHTML('<p><big class="my-inline">text</big></p>');
  });

  it('should sanitize html element', () => {
    setContent('<iframe width="420" height="315" src="javascript: alert(1);"></iframe>');

    assertToContainHTML(
      '<iframe height="315" width="420" class="html-block ProseMirror-selectednode" draggable="true"></iframe>'
    );
  });
});
