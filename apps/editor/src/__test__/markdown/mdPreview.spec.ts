// @ts-ignore
import { ToastMark } from '@toast-ui/toastmark';
import { MdPos } from '@t/markdown';
import MarkdownPreview, { CLASS_HIGHLIGHT } from '@/markdown/mdPreview';
import MarkdownEditor from '@/markdown/mdEditor';
import EventEmitter from '@/event/eventEmitter';

describe('Preview', () => {
  let eventEmitter: EventEmitter, wrapper: HTMLElement, preview: MarkdownPreview;

  beforeEach(() => {
    const options = {
      linkAttribute: null,
      customHTMLRenderer: {},
      isViewer: false,
      highlight: true
    };

    wrapper = document.createElement('div');
    document.body.appendChild(wrapper);

    eventEmitter = new EventEmitter();

    preview = new MarkdownPreview(wrapper, eventEmitter, options);
  });

  afterEach(() => {
    wrapper.parentNode!.removeChild(wrapper);
  });

  it('render() emits previewRenderAfter', () => {
    const spy = jest.fn();

    eventEmitter.listen('previewRenderAfter', spy);
    preview.render('');

    expect(spy).toHaveBeenCalled();
  });

  it('listen to contentChangedFromMarkdown and update the preview', () => {
    const doc = new ToastMark();
    const editResult = doc.editMarkdown([1, 7], [1, 7], 'changed');

    eventEmitter.emit('contentChangedFromMarkdown', editResult);

    expect(preview.getHTML()).toBe(`<p data-nodeid="${editResult[0].nodes[0].id}">changed</p>\n`);
  });
});

describe('preview highlight', () => {
  let eventEmitter: EventEmitter, preview: MarkdownPreview, editor: MarkdownEditor;

  function init(highlight: boolean) {
    const options = {
      linkAttribute: null,
      customHTMLRenderer: {},
      isViewer: false,
      highlight
    };

    const editorEl = document.createElement('div');
    const previewEl = document.createElement('div');

    document.body.innerHTML = '';
    document.body.appendChild(editorEl);
    document.body.appendChild(previewEl);

    eventEmitter = new EventEmitter();
    editor = new MarkdownEditor(editorEl, new ToastMark(), eventEmitter);
    preview = new MarkdownPreview(previewEl, eventEmitter, options);
  }

  function setMarkdown(markdown: string) {
    editor.setMarkdown(markdown);
  }

  function setCursor(caret: MdPos) {
    editor.setSelection(caret, caret);
  }

  function blur() {
    editor.blur();
  }

  function getHighlightedCount() {
    return preview.el!.querySelectorAll(`.${CLASS_HIGHLIGHT}`).length;
  }

  function assertHighlighted(tagName: string, html: string) {
    const el = preview.el!.querySelector(`.${CLASS_HIGHLIGHT}`)!;

    expect(el.tagName).toBe(tagName);
    expect(el.innerHTML).toBe(html);
  }

  it('highlighted element should be one', () => {
    init(true);
    setMarkdown('# Hello\n\nWorld');
    setCursor([1, 1]);

    expect(getHighlightedCount()).toBe(1);
    assertHighlighted('H1', 'Hello');

    setCursor([3, 1]);

    expect(getHighlightedCount()).toBe(1);
    assertHighlighted('P', 'World');
  });

  it('highlighted element is not displayed when highlight option is false', () => {
    init(false);
    setMarkdown('# Hello\n\nWorld');
    setCursor([1, 1]);

    expect(getHighlightedCount()).toBe(0);

    setCursor([3, 1]);

    expect(getHighlightedCount()).toBe(0);
  });

  it('paragraph inside tight list item should not be removed', () => {
    init(true);
    setMarkdown('- Item1\n- Item2');
    setCursor([1, 4]);

    expect(assertHighlighted('P', 'Item1'));

    setCursor([2, 4]);

    expect(assertHighlighted('P', 'Item2'));
  });

  describe('table cell', () => {
    beforeEach(() => {
      init(true);
      setMarkdown('| a | b |\n| - | - |\n| c | d |\n\n');
    });

    it('whitespace and delimiter should be considered as a table cell', () => {
      setCursor([1, 2]);
      assertHighlighted('TH', 'a');

      setCursor([1, 5]);
      assertHighlighted('TH', 'a');

      setCursor([1, 6]);
      assertHighlighted('TH', 'b');

      setCursor([1, 8]);
      assertHighlighted('TH', 'b');

      setCursor([3, 1]);
      assertHighlighted('TD', 'c');

      setCursor([3, 5]);
      assertHighlighted('TD', 'c');

      setCursor([3, 6]);
      assertHighlighted('TD', 'd');

      setCursor([3, 8]);
      assertHighlighted('TD', 'd');
    });

    it('delimiter row should not highlight any element', () => {
      setCursor([2, 2]);
      expect(getHighlightedCount()).toBe(0);

      setCursor([2, 4]);
      expect(getHighlightedCount()).toBe(0);

      setCursor([2, 6]);
      expect(getHighlightedCount()).toBe(0);
    });

    it('empty line next to table should not highlight any element ', () => {
      setCursor([4, 1]);

      expect(getHighlightedCount()).toBe(0);
    });
  });

  it('the highlighted element disappears when blur event is triggered', () => {
    init(true);

    setMarkdown('# Heading');
    setCursor([1, 1]);

    expect(getHighlightedCount()).toBe(1);

    blur();

    expect(getHighlightedCount()).toBe(0);
  });
});
