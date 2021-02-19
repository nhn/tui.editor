// @ts-ignore
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

describe('MarkdownEditor', () => {
  let mde: MarkdownEditor, em: EventEmitter, el: HTMLElement;

  beforeEach(() => {
    em = new EventEmitter();
    mde = new MarkdownEditor(new ToastMark(), em);
    el = mde.el;
    document.body.appendChild(el);
  });

  afterEach(() => {
    mde.destroy();
    document.body.removeChild(el);
  });

  it('should emit contentChangedFromMarkdown event when editing the content', () => {
    const spy = jest.fn();

    em.listen('contentChangedFromMarkdown', spy);

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

    expect(getSelectedText()).toBe('#');
  });

  it('getRange API', () => {
    mde.setMarkdown('# myText');
    mde.setSelection([1, 1], [1, 2]);

    const selection = mde.getRange();

    expect(selection).toEqual([
      [1, 1],
      [1, 2],
    ]);
  });

  it('setPlaceholder API', () => {
    mde.setPlaceholder('Write something');

    expect(getEditorHTML(mde)).toBe(
      '<div><span class="placeholder ProseMirror-widget">Write something</span><br></div>'
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
  });
});
