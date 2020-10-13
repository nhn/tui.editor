// @ts-ignore
import { ToastMark } from '@toast-ui/toastmark';
import MarkdownEditor from '@/markdown/mdEditor';
import EventEmitter from '@/event/eventEmitter';

function getEditorHTML(editor: MarkdownEditor) {
  return editor.view.dom.innerHTML;
}

describe('MarkdownEditor', () => {
  let mde: MarkdownEditor, em: EventEmitter, container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    em = new EventEmitter();
    mde = new MarkdownEditor(container, new ToastMark(), em);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should emit contentChangedFromMarkdown event when editing the content', () => {
    const spy = jest.fn();

    em.listen('contentChangedFromMarkdown', spy);

    mde.setMarkdown('# myText');

    expect(spy).toHaveBeenCalled();
  });

  describe('syntax highlight', () => {
    it('atx heading', () => {
      mde.setMarkdown('# heading');

      const html = getEditorHTML(mde);

      expect(html).toMatchSnapshot();
    });

    it('seText heading', () => {
      mde.setMarkdown('heading\n---');

      const html = getEditorHTML(mde);

      expect(html).toMatchSnapshot();
    });

    it('blockQuote', () => {
      mde.setMarkdown('> block quote');

      const html = getEditorHTML(mde);

      expect(html).toMatchSnapshot();
    });

    it('bulletList', () => {
      mde.setMarkdown('* bullet list');

      const html = getEditorHTML(mde);

      expect(html).toMatchSnapshot();
    });

    it('orderedList', () => {
      mde.setMarkdown('1. ordered list');

      const html = getEditorHTML(mde);

      expect(html).toMatchSnapshot();
    });

    it('tastkList', () => {
      mde.setMarkdown('* [x] task list');

      const html = getEditorHTML(mde);

      expect(html).toMatchSnapshot();
    });

    it('table', () => {
      mde.setMarkdown('| col2 | col2 |\n| --- | --- |\n| data1 | data2 |');

      const html = getEditorHTML(mde);

      expect(html).toMatchSnapshot();
    });

    it('thematicBreak', () => {
      mde.setMarkdown('---');

      const html = getEditorHTML(mde);

      expect(html).toMatchSnapshot();
    });

    it('emph', () => {
      mde.setMarkdown('*emph*');

      const html = getEditorHTML(mde);

      expect(html).toMatchSnapshot();
    });

    it('strong', () => {
      mde.setMarkdown('**strong**');

      const html = getEditorHTML(mde);

      expect(html).toMatchSnapshot();
    });

    it('strike', () => {
      mde.setMarkdown('~~strike~~');

      const html = getEditorHTML(mde);

      expect(html).toMatchSnapshot();
    });

    it('inline code', () => {
      mde.setMarkdown('`inline code`');

      const html = getEditorHTML(mde);

      expect(html).toMatchSnapshot();
    });

    it('link', () => {
      mde.setMarkdown('[TOAST UI](https://ui.toast.com)');

      const html = getEditorHTML(mde);

      expect(html).toMatchSnapshot();
    });

    it('image', () => {
      mde.setMarkdown('![Logo](https://picsum.photos/200)');

      const html = getEditorHTML(mde);

      expect(html).toMatchSnapshot();
    });

    it('code block', () => {
      mde.setMarkdown('```js\nconsole.log("editor")\n```');

      const html = getEditorHTML(mde);

      expect(html).toMatchSnapshot();
    });
  });
});
