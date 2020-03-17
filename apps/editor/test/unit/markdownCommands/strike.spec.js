/**
 * @fileoverview test markdown strike
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { ToastMark } from '@toast-ui/toastmark';
import Strike from '@/markdownCommands/strike';
import MarkdownEditor from '@/markdownEditor';
import EventManager from '@/eventManager';

describe('Strike', () => {
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

  describe('add strike', () => {
    it('in a middle of text', () => {
      doc.setCursor(2, 3);

      Strike.exec(mde);

      expect(cm.getValue()).toEqual(['mytext1', '', 'myt~~~~ext2', 'mytext3'].join('\n'));
    });

    it('to a blank line', () => {
      doc.setCursor(1, 0);

      Strike.exec(mde);

      expect(cm.getValue()).toEqual(['mytext1', '~~~~', 'mytext2', 'mytext3'].join('\n'));
    });

    it('around selected area', () => {
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

      Strike.exec(mde);

      expect(cm.getValue()).toEqual(['~~mytext1~~', '', 'mytext2', 'mytext3'].join('\n'));
    });

    it('should remove strike syntax in the middle of the given range', () => {
      cm.setValue('my~~text~~1');

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

      Strike.exec(mde);

      expect(cm.getValue()).toEqual('~~mytext1~~');
    });

    it('in select text that is collapsed bold', () => {
      cm.setValue('**text**');

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

      Strike.exec(mde);

      expect(cm.getValue()).toEqual('**~~text~~**');
    });
  });

  describe('remove strike', () => {
    it('selected area', () => {
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

      Strike.exec(mde);

      expect(cm.getValue()).toEqual(['~~mytext1~~', '', 'mytext2', 'mytext3'].join('\n'));
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

      Strike.exec(mde);

      expect(cm.getValue()).toEqual(['mytext1', '', 'mytext2', 'mytext3'].join('\n'));
    });

    it('selected only text that is collapsed strike', () => {
      cm.setValue('~~test~~');
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

      Strike.exec(mde);

      expect(cm.getValue()).toEqual('test');
    });

    it('in the empty string collapsed strike', () => {
      cm.setValue('~~~~');
      doc.setCursor(0, 2);

      Strike.exec(mde);
      expect(cm.getValue()).toEqual('');
    });
  });
});
