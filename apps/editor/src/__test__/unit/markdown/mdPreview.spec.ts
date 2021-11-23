import { MdPos, ToastMark } from '@toast-ui/toastmark';
import MarkdownPreview, { CLASS_HIGHLIGHT } from '@/markdown/mdPreview';
import MarkdownEditor from '@/markdown/mdEditor';
import EventEmitter from '@/event/eventEmitter';
import * as sanitizer from '@/sanitizer/htmlSanitizer';
import { createHTMLrenderer, removeDataAttr } from './util';

function getHTML(preview: MarkdownPreview) {
  return removeDataAttr(preview.getHTML());
}

jest.useFakeTimers();

describe('Preview', () => {
  let eventEmitter: EventEmitter, preview: MarkdownPreview;

  beforeEach(() => {
    jest.spyOn(sanitizer, 'sanitizeHTML');

    const options = {
      linkAttributes: null,
      customHTMLRenderer: {},
      isViewer: false,
      highlight: true,
      sanitizer: sanitizer.sanitizeHTML,
    };

    eventEmitter = new EventEmitter();

    preview = new MarkdownPreview(eventEmitter, options);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    preview.destroy();
  });

  it('listen to updatePreview and update the preview', () => {
    const doc = new ToastMark();
    const editResult = doc.editMarkdown([1, 7], [1, 7], 'changed');

    eventEmitter.emit('updatePreview', editResult);

    expect(getHTML(preview)).toBe('<p>changed</p>');
  });

  it('should call sanitizeHTML', () => {
    const doc = new ToastMark();
    const editResult = doc.editMarkdown(
      [1, 1],
      [1, 1],
      `<TABLE BACKGROUND="javascript:alert('XSS')">`
    );

    eventEmitter.emit('updatePreview', editResult);

    expect(sanitizer.sanitizeHTML).toHaveBeenCalledTimes(1);
  });
});

describe('preview highlight', () => {
  let eventEmitter: EventEmitter,
    preview: MarkdownPreview,
    editor: MarkdownEditor,
    editorEl: HTMLElement;

  function init(highlight: boolean) {
    const options = {
      linkAttributes: null,
      customHTMLRenderer: {},
      isViewer: false,
      highlight,
      sanitizer: sanitizer.sanitizeHTML,
    };

    eventEmitter = new EventEmitter();
    editor = new MarkdownEditor(eventEmitter, { toastMark: new ToastMark() });
    preview = new MarkdownPreview(eventEmitter, options);
    editorEl = editor.getElement();

    document.body.appendChild(editorEl);
    document.body.appendChild(preview.getElement()!);
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

  afterEach(() => {
    jest.clearAllTimers();
    document.body.removeChild(editorEl);
    editor.destroy();
    preview.destroy();
  });

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

    // run setTimeout function when focusing the editor
    jest.runAllTimers();

    expect(getHighlightedCount()).toBe(1);

    blur();

    expect(getHighlightedCount()).toBe(0);
  });
});

describe('Preview with html renderer', () => {
  let eventEmitter: EventEmitter, preview: MarkdownPreview;

  function createPreviewWithHTMLRenderer() {
    const options = {
      linkAttributes: null,
      customHTMLRenderer: createHTMLrenderer(),
      isViewer: false,
      highlight: true,
      sanitizer: sanitizer.sanitizeHTML,
    };

    sanitizer.registerTagWhitelistIfPossible('iframe');
    eventEmitter = new EventEmitter();
    preview = new MarkdownPreview(eventEmitter, options);
  }

  beforeEach(() => {
    createPreviewWithHTMLRenderer();
  });

  it('should render iframe node to preview ignoring sanitizer tag', () => {
    const doc = new ToastMark();
    const editResult = doc.editMarkdown(
      [1, 1],
      [1, 1],
      '<iframe width="420" height="315" src="https://www.youtube.com/embed/XyenY12fzAk"></iframe>'
    );

    eventEmitter.emit('updatePreview', editResult);

    expect(getHTML(preview)).toBe(
      '<iframe src="https://www.youtube.com/embed/XyenY12fzAk" height="315" width="420"></iframe>'
    );
  });

  it('should render html inline node', () => {
    const doc = new ToastMark();
    const editResult = doc.editMarkdown([1, 1], [1, 1], '<big class="my-big">content</big>');

    eventEmitter.emit('updatePreview', editResult);

    expect(getHTML(preview)).toBe('<p><big class="my-big">content</big></p>');
  });
});
