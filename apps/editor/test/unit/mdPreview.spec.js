/**
 * @fileoverview test markdown preview
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { ToastMark } from '@toast-ui/toastmark';
import MarkdownPreview, { CLASS_HIGHLIGHT } from '@/mdPreview';
import MarkdownEditor from '@/markdownEditor';
import EventManager from '@/eventManager';
import Convertor from '@/convertor';

describe('Preview', () => {
  let eventManager, convertor, wrapper, preview;

  beforeEach(() => {
    wrapper = document.createElement('div');
    document.body.appendChild(wrapper);

    eventManager = new EventManager();
    convertor = new Convertor(eventManager);
    preview = new MarkdownPreview(wrapper, eventManager, convertor, true);

    jasmine.clock().install();
  });

  afterEach(() => {
    wrapper.parentNode.removeChild(wrapper);
    jasmine.clock().uninstall();
  });

  it('render() emits previewRenderAfter', () => {
    const listener = jasmine.createSpy('listener');

    eventManager.listen('previewRenderAfter', listener);

    preview.render();

    expect(listener).toHaveBeenCalled();
  });

  it('listen to contentChangedFromMarkdown and update', () => {
    const doc = new ToastMark();
    const editResult = doc.editMarkdown([1, 7], [1, 7], 'changed');

    eventManager.emit('contentChangedFromMarkdown', editResult);

    expect(preview.getHTML()).toEqual(
      `<p data-nodeid="${editResult[0].nodes[0].id}">changed</p>\n`
    );
  });
});

describe('listen cursorActivity event', () => {
  let setValue, setCursor, getHighlightedElementsAll, getHighlightedElement;
  let previewEl;

  beforeEach(() => {
    const editorEl = document.createElement('div');

    previewEl = document.createElement('div');

    document.body.innerHTML = '';
    document.body.appendChild(editorEl);
    document.body.appendChild(previewEl);

    const eventManager = new EventManager();
    const convertor = new Convertor(eventManager);
    const toastMark = new ToastMark();
    const preview = new MarkdownPreview(previewEl, eventManager, convertor, true);
    const editor = new MarkdownEditor(editorEl, eventManager, toastMark);
    const doc = editor.getEditor().getDoc();

    setValue = val => editor.setValue(val);
    setCursor = pos => doc.setCursor(pos);
    getHighlightedElementsAll = () => preview.el.querySelectorAll(`.${CLASS_HIGHLIGHT}`);
    getHighlightedElement = () => preview.el.querySelector(`.${CLASS_HIGHLIGHT}`);
  });

  it('heading', () => {
    setValue('# Hello World');
    setCursor({ line: 0, ch: 0 });

    expect(getHighlightedElement().tagName).toBe('H1');
  });

  it('only one highlighted element should exist at a time', () => {
    setValue('# Hello\n\nWorld');
    setCursor({ line: 0, ch: 0 });

    let elements = getHighlightedElementsAll();

    expect(elements.length).toBe(1);
    expect(elements[0].tagName).toBe('H1');

    setCursor({ line: 2, ch: 0 });

    elements = getHighlightedElementsAll();
    expect(elements.length).toBe(1);
    expect(elements[0].tagName).toBe('P');
  });

  describe('table cell', () => {
    beforeEach(() => {
      setValue('| a | b \n| - | - |\n| c | d |');
    });

    it('whitespace and delimiter should be considered as a table cell', () => {
      setCursor({ line: 0, ch: 1 });
      expect(getHighlightedElement().innerHTML).toBe('a');

      setCursor({ line: 0, ch: 4 });
      expect(getHighlightedElement().innerHTML).toBe('a');

      setCursor({ line: 0, ch: 5 });
      expect(getHighlightedElement().innerHTML).toBe('b');

      setCursor({ line: 0, ch: 7 });
      expect(getHighlightedElement().innerHTML).toBe('b');

      setCursor({ line: 2, ch: 0 });
      expect(getHighlightedElement().innerHTML).toBe('c');

      setCursor({ line: 2, ch: 4 });
      expect(getHighlightedElement().innerHTML).toBe('c');

      setCursor({ line: 2, ch: 5 });
      expect(getHighlightedElement().innerHTML).toBe('d');

      setCursor({ line: 2, ch: 7 });
      expect(getHighlightedElement().innerHTML).toBe('d');
    });

    it('delimiter row should not highlight any element', () => {
      setValue('| a | b \n| - | - |\n| c | d |');

      setCursor({ line: 1, ch: 1 });
      expect(getHighlightedElement()).toBe(null);

      setCursor({ line: 1, ch: 3 });
      expect(getHighlightedElement()).toBe(null);

      setCursor({ line: 1, ch: 5 });
      expect(getHighlightedElement()).toBe(null);
    });
  });
});
