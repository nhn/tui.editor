/**
 * @fileoverview test markdown hr
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { ToastMark } from '@toast-ui/toastmark';
import HR from '@/markdownCommands/hr';
import MarkdownEditor from '@/markdownEditor';
import EventManager from '@/eventManager';

describe('HR', () => {
  let cm, mde, container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    mde = new MarkdownEditor(container, new EventManager(), new ToastMark());

    cm = mde.getEditor();

    const sourceText = ['mytext1', '', 'mytext2', 'mytext3'];

    cm.setValue(sourceText.join('\n'));
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('add HR line', () => {
    it('below the current line', () => {
      cm.setCursor(2, 3);

      HR.exec(mde);

      expect(cm.getValue()).toEqual(
        ['mytext1', '', 'mytext2', '\n* * *\n', '', 'mytext3'].join('\n')
      );
    });

    it('to a blank line', () => {
      cm.setCursor(1, 0);

      HR.exec(mde);

      expect(cm.getValue()).toEqual(['mytext1', '\n* * *\n', 'mytext2', 'mytext3'].join('\n'));
    });
  });

  describe('replace to hr', () => {
    it('from selected content', () => {
      cm.setSelection(
        {
          line: 0,
          ch: 1
        },
        {
          line: 2,
          ch: 2
        }
      );

      HR.exec(mde);

      expect(cm.getValue()).toEqual(['m\n\n* * *\n\ntext2', 'mytext3'].join('\n'));
    });
  });
});
