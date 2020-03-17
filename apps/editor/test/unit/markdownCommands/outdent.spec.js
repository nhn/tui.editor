/**
 * @fileoverview test markdown Outdent
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { ToastMark } from '@toast-ui/toastmark';
import Outdent from '@/markdownCommands/outdent';
import MarkdownEditor from '@/markdownEditor';
import EventManager from '@/eventManager';

describe('Outdent', () => {
  let cm, mde, container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    mde = new MarkdownEditor(container, new EventManager(), new ToastMark());

    cm = mde.getEditor();

    const sourceText = ['    * list1', '    * list2', '    * list3'];

    cm.setValue(sourceText.join('\n'));
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('Outdent', () => {
    it('should indent current line', () => {
      cm.setCursor(1, 3);

      Outdent.exec(mde);

      expect(cm.getValue()).toEqual(['    * list1', '* list2', '    * list3'].join('\n'));
    });
  });
});
