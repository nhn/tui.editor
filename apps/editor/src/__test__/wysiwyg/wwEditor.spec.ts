import { oneLineTrim } from 'common-tags';

import { DOMParser } from 'prosemirror-model';

import WysiwygEditor from '@/wysiwyg/wwEditor';
import EventEmitter from '@/event/eventEmitter';
import { WwToDOMAdaptor } from '@/wysiwyg/adaptor/wwToDOMAdaptor';

describe('WysiwygEditor', () => {
  let container: HTMLElement, wwe: WysiwygEditor, em: EventEmitter;

  function setContent(content: string) {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = content;

    const nodes = DOMParser.fromSchema(wwe.schema).parse(wrapper);

    wwe.setModel(nodes);
  }

  beforeEach(() => {
    const adaptor = new WwToDOMAdaptor({}, {});

    container = document.createElement('div');
    document.body.appendChild(container);

    em = new EventEmitter();
    wwe = new WysiwygEditor(container, em, adaptor);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('API', () => {
    it('destroy() initialize instance object', () => {
      wwe.destroy();

      expect(wwe).toEqual({});
    });

    it(`focus() enable editor's dom selection state`, () => {
      wwe.focus();

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

      expect(wwe.getHTML()).toBe(
        '<p><span class="placeholder ProseMirror-widget">placeholder text</span><br></p>'
      );
    });

    it('scrollTo() move scroll position', () => {
      const content = oneLineTrim`
        <p>foo</p>
        <p><br></p>
        <p><br></p>
        <p><br></p>
        <p><br></p>
        <p><br></p>
        <p><br></p>
        <p><br></p>
      `;

      setContent(content);

      wwe.setHeight(50);
      wwe.scrollTo(30);

      expect(wwe.el.scrollTop).toBe(30);
    });

    it('getRange() return selection range as array', () => {
      const content = oneLineTrim`
        <p>foo</p>
        <p>bar</p>
        <p>baz</p>
      `;

      setContent(content);

      wwe.setSelection(13, 2);

      expect(wwe.getRange()).toEqual([2, 13]);
    });

    it('replaceSelection() change text of selection range', () => {
      const content = oneLineTrim`
        <p>foo</p>
        <p>bar</p>
      `;

      setContent(content);

      wwe.setSelection(3, 7);
      wwe.replaceSelection('new foo\nnew bar');

      const result = oneLineTrim`
        <p>fonew foo</p>
        <p>new barar</p>
      `;

      expect(wwe.getHTML()).toBe(result);
    });
  });
});
