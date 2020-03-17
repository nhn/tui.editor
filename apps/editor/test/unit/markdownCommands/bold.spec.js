/**
 * @fileoverview test markdown bold
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { ToastMark } from '@toast-ui/toastmark';
import Bold from '@/markdownCommands/bold';
import MarkdownEditor from '@/markdownEditor';
import EventManager from '@/eventManager';

describe('Bold', () => {
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

  describe('add bold syntax', () => {
    it('**** in the middle of text', () => {
      doc.setCursor(2, 3);

      Bold.exec(mde);

      expect(cm.getValue()).toEqual(['mytext1', '', 'myt****ext2', 'mytext3'].join('\n'));
    });

    it('**** in blank line', () => {
      doc.setCursor(1, 3);

      Bold.exec(mde);

      expect(cm.getValue()).toEqual(['mytext1', '****', 'mytext2', 'mytext3'].join('\n'));
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

      Bold.exec(mde);

      expect(cm.getValue()).toEqual(['**mytext1**', '', 'mytext2', 'mytext3'].join('\n'));
    });

    it('in select text that is collapsed strike', () => {
      cm.setValue('~~text~~');

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

      Bold.exec(mde);

      expect(cm.getValue()).toEqual('~~**text**~~');
    });
  });

  describe('remove bold syntax', () => {
    it('should remove bold syntax in the middle of the given range', () => {
      cm.setValue('my**text**1');

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

      Bold.exec(mde);

      expect(cm.getValue()).toEqual('**mytext1**');
    });

    it('selected only text that is collapsed bold', () => {
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

      Bold.exec(mde);

      expect(cm.getValue()).toEqual('test');
    });

    it('selected all text that is collapsed bold', () => {
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

      Bold.exec(mde);

      expect(cm.getValue()).toEqual('test');
    });

    it('selected collapsed bold', () => {
      cm.setValue('****');
      doc.setSelection(
        {
          line: 0,
          ch: 0
        },
        {
          line: 0,
          ch: 4
        }
      );

      Bold.exec(mde);
      expect(cm.getValue()).toEqual('');
    });

    it('in the empty string collapsed bold', () => {
      cm.setValue('****');
      doc.setCursor(0, 2);

      Bold.exec(mde);
      expect(cm.getValue()).toEqual('');
    });

    it('selected string including italic', () => {
      cm.setValue('**TEST*italic*TEST**');
      doc.setSelection(
        {
          line: 0,
          ch: 0
        },
        {
          line: 0,
          ch: 20
        }
      );

      Bold.exec(mde);
      expect(cm.getValue()).toEqual('TEST*italic*TEST');
    });

    it('selected string collaped italic and bold', () => {
      cm.setValue('***TEST***');
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

      Bold.exec(mde);
      expect(cm.getValue()).toEqual('*TEST*');
    });
  });
});
