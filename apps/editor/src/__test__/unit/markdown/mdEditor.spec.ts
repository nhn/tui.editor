import { ToastMark } from '@toast-ui/toastmark';
import MarkdownEditor from '@/markdown/mdEditor';
import EventEmitter from '@/event/eventEmitter';
import { getTextContent } from './util';

function getSelectedText() {
  return document.getSelection()!.toString();
}

function getEditorHTML(editor: MarkdownEditor) {
  return editor.view.dom.innerHTML;
}

jest.useFakeTimers();

describe('MarkdownEditor', () => {
  let mde: MarkdownEditor, em: EventEmitter, el: HTMLElement;

  beforeEach(() => {
    em = new EventEmitter();
    mde = new MarkdownEditor(em, { toastMark: new ToastMark() });
    el = mde.el;
    document.body.appendChild(el);
  });

  afterEach(() => {
    jest.clearAllTimers();

    mde.destroy();
    document.body.removeChild(el);
  });

  it('should emit updatePreview event when editing the content', () => {
    const spy = jest.fn();

    em.listen('updatePreview', spy);

    mde.setMarkdown('# myText');

    expect(spy).toHaveBeenCalled();
  });

  it('setMarkdown API', () => {
    mde.setMarkdown('# myText');

    expect(getTextContent(mde)).toBe('# myText');
  });

  it('getMarkdown API', () => {
    mde.setMarkdown('# myText');

    const markdown = mde.getMarkdown();

    expect(markdown).toBe('# myText');
  });

  it('setSelection API', () => {
    mde.setMarkdown('# myText');
    mde.setSelection([1, 1], [1, 2]);

    // run setTimeout function when focusing the editor
    jest.runAllTimers();

    expect(getSelectedText()).toBe('#');
  });

  it('getSelection API', () => {
    mde.setMarkdown('# myText');
    mde.setSelection([1, 1], [1, 2]);

    const selection = mde.getSelection();

    expect(selection).toEqual([
      [1, 1],
      [1, 2],
    ]);
  });

  it('setPlaceholder API', () => {
    mde.setPlaceholder('Write something');

    expect(getEditorHTML(mde)).toContain(
      '<span class="placeholder ProseMirror-widget">Write something</span>'
    );
  });

  it('replaceSelection API', () => {
    mde.setMarkdown('# myText');

    mde.setSelection([1, 1], [1, 2]);
    mde.replaceSelection('# newText\n#newLine');

    expect(getTextContent(mde)).toBe('# newText\n#newLine myText');
  });

  it('focus API', () => {
    mde.focus();

    // run setTimeout function when focusing the editor
    jest.runAllTimers();

    expect(document.activeElement).toEqual(mde.view.dom);
  });

  it('blur API', () => {
    mde.focus();
    mde.blur();

    expect(document.activeElement).not.toEqual(mde.view.dom);
  });

  it('setHeight API', () => {
    mde.setHeight(100);

    const { height } = mde.el.style;

    expect(height).toBe('100px');
  });

  it('setMinHeight API', () => {
    mde.setMinHeight(100);

    const { minHeight } = mde.el.style;

    expect(minHeight).toBe('100px');
  });

  it('addWidget API', () => {
    const ul = document.createElement('ul');

    ul.innerHTML = `
      <li>Ryu</li>
      <li>Lee</li>
    `;

    mde.addWidget(ul, 'top');

    expect(document.body).toContainElement(ul);

    mde.blur();

    expect(document.body).not.toContainElement(ul);
  });
});
