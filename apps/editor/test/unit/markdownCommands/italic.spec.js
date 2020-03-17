/**
 * @fileoverview test markdown italic
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { ToastMark } from '@toast-ui/toastmark';
import Italic from '@/markdownCommands/italic';
import MarkdownEditor from '@/markdownEditor';
import EventManager from '@/eventManager';

describe('Italic', () => {
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

  describe('add italic', () => {
    it('in a midle of text', () => {
      doc.setCursor(2, 3);

      Italic.exec(mde);

      expect(cm.getValue()).toEqual(['mytext1', '', 'myt**ext2', 'mytext3'].join('\n'));
    });

    it('in a blank line', () => {
      doc.setCursor(1, 3);

      Italic.exec(mde);

      expect(cm.getValue()).toEqual(['mytext1', '**', 'mytext2', 'mytext3'].join('\n'));
    });

    it('around selected text', () => {
      doc.setSelection(
        {
          line: 0,
          ch: 0
        },
        {
          line: 0,
          ch: 7
        }
      );

      Italic.exec(mde);

      expect(cm.getValue()).toEqual(['*mytext1*', '', 'mytext2', 'mytext3'].join('\n'));
    });

    it('in empty and collapsed bold', () => {
      cm.setValue('****');
      doc.setCursor(0, 2);

      Italic.exec(mde);

      expect(cm.getValue()).toEqual('******');
    });

    it('selected only text collapsed bold', () => {
      cm.setValue('**test**');
      doc.setSelection(
        {
          line: 0,
          ch: 2
        },
        {
          line: 0,
          ch: 6
        }
      );

      Italic.exec(mde);

      expect(cm.getValue()).toEqual('***test***');
    });

    it('selected all text collapsed bold', () => {
      cm.setValue('**test**');
      doc.setSelection(
        {
          line: 0,
          ch: 0
        },
        {
          line: 0,
          ch: 8
        }
      );

      Italic.exec(mde);

      expect(cm.getValue()).toEqual('***test***');
    });

    it('selected text have bold text and collaped strike', () => {
      cm.setValue('~~**test**~~');
      doc.setSelection(
        {
          line: 0,
          ch: 0
        },
        {
          line: 0,
          ch: 12
        }
      );

      Italic.exec(mde);

      expect(cm.getValue()).toEqual('*~~**test**~~*');
    });
  });

  describe('remove italic', () => {
    it('should remove italic syntax in the middle of the given range', () => {
      cm.setValue('my _text_ 1');

      doc.setSelection(
        {
          line: 0,
          ch: 0
        },
        {
          line: 0,
          ch: 11
        }
      );

      Italic.exec(mde);

      expect(cm.getValue()).toEqual('*my text 1*');
    });

    it('in the empty string collapsed italic', () => {
      cm.setValue('**');
      doc.setCursor(0, 1);

      Italic.exec(mde);
      expect(cm.getValue()).toEqual('');
    });

    it('in the empty string collapsed italic and blod', () => {
      cm.setValue('******');
      doc.setCursor(0, 3);

      Italic.exec(mde);
      expect(cm.getValue()).toEqual('****');
    });

    it('selected only text that is collapsed italic', () => {
      cm.setValue('*test*');
      doc.setSelection(
        {
          line: 0,
          ch: 1
        },
        {
          line: 0,
          ch: 5
        }
      );

      Italic.exec(mde);

      expect(cm.getValue()).toEqual('test');
    });

    it('selected all text that is collapsed italic', () => {
      cm.setValue('*test*');
      doc.setSelection(
        {
          line: 0,
          ch: 0
        },
        {
          line: 0,
          ch: 6
        }
      );

      Italic.exec(mde);

      expect(cm.getValue()).toEqual('test');
    });

    it('selected only text collapsed italic and bold', () => {
      cm.setValue('***test***');
      doc.setSelection(
        {
          line: 0,
          ch: 3
        },
        {
          line: 0,
          ch: 7
        }
      );

      Italic.exec(mde);
      expect(cm.getValue()).toEqual('**test**');
    });

    it('selected all text collapsed italic and bold', () => {
      cm.setValue('***test***');
      doc.setSelection(
        {
          line: 0,
          ch: 0
        },
        {
          line: 0,
          ch: 10
        }
      );

      Italic.exec(mde);
      expect(cm.getValue()).toEqual('**test**');
    });
  });
});
