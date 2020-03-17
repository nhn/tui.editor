/**
 * @fileoverview test markdown heading
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { ToastMark } from '@toast-ui/toastmark';
import Heading from '@/markdownCommands/heading';
import MarkdownEditor from '@/markdownEditor';
import EventManager from '@/eventManager';

describe('Paragraph', () => {
  let cm, doc, mde, container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    mde = new MarkdownEditor(container, new EventManager(), new ToastMark());

    cm = mde.getEditor();

    const sourceText = ['mytext1', '', 'mytext2', 'mytext3'];

    cm.setValue(sourceText.join('\n'));
    doc = cm.getDoc();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('add # in first column', () => {
    it('to a line with text on it', () => {
      doc.setCursor(2, 3);

      Heading.exec(mde, 1);

      expect(cm.getValue()).toEqual(['mytext1', '', '# mytext2', 'mytext3'].join('\n'));
    });

    it('to a blank line', () => {
      doc.setCursor(1, 3);

      Heading.exec(mde, 1);

      expect(cm.getValue()).toEqual(['mytext1', '# ', 'mytext2', 'mytext3'].join('\n'));
    });

    it('in selected lines', () => {
      doc.setSelection(
        {
          line: 0,
          ch: 3
        },
        {
          line: 2,
          ch: 2
        }
      );

      Heading.exec(mde, 1);

      expect(cm.getValue()).toEqual(['# mytext1', '# ', '# mytext2', 'mytext3'].join('\n'));
    });
  });

  describe('Toggle', () => {
    it('if already have heading toggle to next heading', () => {
      doc.setCursor(2, 3);

      Heading.exec(mde, 2);

      expect(cm.getValue()).toEqual(['mytext1', '', '## mytext2', 'mytext3'].join('\n'));
    });
  });
});
