/**
 * @fileoverview test MovePrevCursorOrOutdent command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { source } from 'common-tags';

import { ToastMark } from '@toast-ui/toastmark';
import movePrevCursorOrOutdent from '@/markdownCommands/movePrevCursorOrOutdent';
import MarkdownEditor from '@/markdownEditor';
import EventManager from '@/eventManager';

describe('MovePrevCursorOrOutdent command', () => {
  let cm, mde, container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    mde = new MarkdownEditor(container, new EventManager(), new ToastMark());
    cm = mde.getEditor();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('move cursor in table', () => {
    beforeEach(() => {
      const sourceText = source`
        | head | head |
        | --- | --- |
        | body | body |
      `;

      cm.setValue(sourceText);
    });

    it('to previous cell', () => {
      cm.setCursor({ line: 0, ch: 9 });
      movePrevCursorOrOutdent.exec(mde);
      expect(cm.getCursor()).toEqual({ line: 0, ch: 6 });

      cm.setCursor({ line: 1, ch: 8 });
      movePrevCursorOrOutdent.exec(mde);
      expect(cm.getCursor()).toEqual({ line: 1, ch: 5 });

      cm.setCursor({ line: 2, ch: 13 });
      movePrevCursorOrOutdent.exec(mde);
      expect(cm.getCursor()).toEqual({ line: 2, ch: 6 });
    });

    it('from first cell to last cell of previous row', () => {
      cm.setCursor({ line: 1, ch: 3 });
      movePrevCursorOrOutdent.exec(mde);
      expect(cm.getCursor()).toEqual({ line: 0, ch: 13 });

      cm.setCursor({ line: 2, ch: 1 });
      movePrevCursorOrOutdent.exec(mde);
      expect(cm.getCursor()).toEqual({ line: 1, ch: 11 });
    });

    it('from first cell of row in thead to first of table', () => {
      cm.setCursor({ line: 0, ch: 3 });
      movePrevCursorOrOutdent.exec(mde);
      expect(cm.getCursor()).toEqual({ line: 0, ch: 0 });
    });
  });
});
