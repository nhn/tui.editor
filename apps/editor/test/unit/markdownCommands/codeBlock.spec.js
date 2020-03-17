/**
 * @fileoverview test markdown code block
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { ToastMark } from '@toast-ui/toastmark';
import CodeBlock from '@/markdownCommands/codeBlock';
import MarkdownEditor from '@/markdownEditor';
import EventManager from '@/eventManager';

describe('CodeBlock', () => {
  let cm, doc, mde, container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    mde = new MarkdownEditor(container, new EventManager(), new ToastMark());

    cm = mde.getEditor();

    const sourceText = ['mytext1', 'mytext2', 'mytext3'].join('\n');

    cm.setValue(sourceText);
    doc = cm.getDoc();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('Insert a code block into a cursor location', () => {
    doc.setCursor(0, 2);

    CodeBlock.exec(mde);
    expect(cm.getValue()).toEqual(
      ['my', '```', '', '```', 'text1', 'mytext2', 'mytext3'].join('\n')
    );
    expect(doc.getCursor().line).toEqual(2);
  });

  it('Insert a code block with a selected text', () => {
    doc.setSelection(
      {
        line: 1,
        ch: 2
      },
      {
        line: 1,
        ch: 4
      }
    );

    CodeBlock.exec(mde);

    expect(cm.getValue()).toEqual(
      ['mytext1', 'my', '```', 'te', '```', 'xt2', 'mytext3'].join('\n')
    );
    expect(doc.getCursor().line).toEqual(3);
  });
});
