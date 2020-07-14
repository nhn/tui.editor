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

function getEditorAndPreview(highlight) {
  const editorEl = document.createElement('div');
  const previewEl = document.createElement('div');

  document.body.innerHTML = '';
  document.body.appendChild(editorEl);
  document.body.appendChild(previewEl);

  const eventManager = new EventManager();
  const convertor = new Convertor(eventManager);
  const toastMark = new ToastMark();
  const editor = new MarkdownEditor(editorEl, eventManager, toastMark);
  const preview = new MarkdownPreview(previewEl, eventManager, convertor, { highlight });

  return { editor, preview };
}

describe('listen cursorActivity event', () => {
  let setValue, setCursor, getHighlightedCount, assertHighlighted;

  function init(highlight) {
    const { editor, preview } = getEditorAndPreview(highlight);
    const doc = editor.getEditor().getDoc();

    setValue = val => editor.setValue(val);
    setCursor = pos => doc.setCursor(pos);
    getHighlightedCount = () => preview.el.querySelectorAll(`.${CLASS_HIGHLIGHT}`).length;
    assertHighlighted = (tagName, innerHTML) => {
      const el = preview.el.querySelector(`.${CLASS_HIGHLIGHT}`);

      expect(el.tagName).toBe(tagName);
      expect(el.innerHTML).toBe(innerHTML);
    };
  }

  it('only one highlighted element should exist at a time', () => {
    init(true);
    setValue('# Hello\n\nWorld');
    setCursor({ line: 0, ch: 0 });

    expect(getHighlightedCount()).toBe(1);
    assertHighlighted('H1', 'Hello');

    setCursor({ line: 2, ch: 0 });

    expect(getHighlightedCount()).toBe(1);
    assertHighlighted('P', 'World');
  });

  it('nothing happen when highlight option is false', () => {
    init(false);
    setValue('# Hello\n\nWorld');
    setCursor({ line: 0, ch: 0 });

    expect(getHighlightedCount()).toBe(0);

    setCursor({ line: 2, ch: 0 });
    expect(getHighlightedCount()).toBe(0);
  });

  it('paragraph inside tight list item should not be removed', () => {
    init(true);
    setValue('- Item1\n- Item2');

    setCursor({ line: 0, ch: 3 });
    expect(assertHighlighted('P', 'Item1'));

    setCursor({ line: 1, ch: 3 });
    expect(assertHighlighted('P', 'Item2'));
  });

  describe('table cell', () => {
    beforeEach(() => {
      init(true);
      setValue('| a | b |\n| - | - |\n| c | d |\n\n');
    });

    it('whitespace and delimiter should be considered as a table cell', () => {
      setCursor({ line: 0, ch: 1 });
      assertHighlighted('TH', 'a');

      setCursor({ line: 0, ch: 4 });
      assertHighlighted('TH', 'a');

      setCursor({ line: 0, ch: 5 });
      assertHighlighted('TH', 'b');

      setCursor({ line: 0, ch: 7 });
      assertHighlighted('TH', 'b');

      setCursor({ line: 2, ch: 0 });
      assertHighlighted('TD', 'c');

      setCursor({ line: 2, ch: 4 });
      assertHighlighted('TD', 'c');

      setCursor({ line: 2, ch: 5 });
      assertHighlighted('TD', 'd');

      setCursor({ line: 2, ch: 7 });
      assertHighlighted('TD', 'd');
    });

    it('delimiter row should not highlight any element', () => {
      setCursor({ line: 1, ch: 1 });
      expect(getHighlightedCount()).toBe(0);

      setCursor({ line: 1, ch: 3 });
      expect(getHighlightedCount()).toBe(0);

      setCursor({ line: 1, ch: 5 });
      expect(getHighlightedCount()).toBe(0);
    });

    it('empty line next to table should not highlight any element ', () => {
      setCursor({ line: 3, ch: 0 });
      expect(getHighlightedCount()).toBe(0);
    });
  });
});

describe('listen blur event', () => {
  let setValue, blur, getHighlightedCount;

  function init(highlight) {
    const { editor, preview } = getEditorAndPreview(highlight);

    setValue = val => {
      editor.setValue(val);
      editor.focus();
    };
    blur = () => editor.blur();
    getHighlightedCount = () => preview.el.querySelectorAll(`.${CLASS_HIGHLIGHT}`).length;
  }

  it('the highlighting element disappears from the preview', () => {
    init(true);

    setValue('# Heading');
    expect(getHighlightedCount()).toBe(1);

    blur();
    setTimeout(() => {
      expect(getHighlightedCount()).toBe(0);
    }, 7); // the test is executed before the blur event occurs on IE
  });
});
