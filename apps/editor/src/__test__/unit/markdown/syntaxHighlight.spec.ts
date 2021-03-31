import { ToastMark } from '@toast-ui/toastmark';
import MarkdownEditor from '@/markdown/mdEditor';
import EventEmitter from '@/event/eventEmitter';
import { source } from 'common-tags';

function getEditorHTML(editor: MarkdownEditor) {
  return editor.view.dom.innerHTML;
}

let mde: MarkdownEditor, em: EventEmitter;

beforeEach(() => {
  em = new EventEmitter();
  mde = new MarkdownEditor(em, { toastMark: new ToastMark() });
});

afterEach(() => {
  mde.destroy();
});

describe('markdown editor syntax highlight', () => {
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

  describe('blockQuote', () => {
    it('basic', () => {
      mde.setMarkdown('> block quote');

      const html = getEditorHTML(mde);

      expect(html).toMatchSnapshot();
    });

    it('with list', () => {
      mde.setMarkdown('> * [ ] block quote');

      const html = getEditorHTML(mde);

      expect(html).toMatchSnapshot();
    });
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

  describe('table', () => {
    it('basic', () => {
      const input = source`
          | col2 | col2
          | --- | ---
          | data1 | data2 |
        `;

      mde.setMarkdown(input);

      const html = getEditorHTML(mde);

      expect(html).toMatchSnapshot();
    });

    it('with mark', () => {
      const input = source`
          | col2 | col2
          | --- | ---
          | data1 | **data2** |
        `;

      mde.setMarkdown(input);

      const html = getEditorHTML(mde);

      expect(html).toMatchSnapshot();
    });
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

  it('code block within list', () => {
    mde.setMarkdown('* list\n  ```js\n  console.log("editor")\n  ```');

    const html = getEditorHTML(mde);

    expect(html).toMatchSnapshot();
  });

  it('custom block', () => {
    mde.setMarkdown('$$custom\nmy custom element\n$$');

    const html = getEditorHTML(mde);

    expect(html).toMatchSnapshot();
  });
});
