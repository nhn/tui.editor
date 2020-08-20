/**
 * @fileoverview test MoveNextCursorOrIndent command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { source } from 'common-tags';

import { ToastMark } from '@toast-ui/toastmark';
import moveNextCursorOrIndent from '@/markdownCommands/moveNextCursorOrIndent';
import MarkdownEditor from '@/markdownEditor';
import EventManager from '@/eventManager';

describe('MoveNextCursorOrIndent command', () => {
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

    it('to next cell', () => {
      cm.setCursor({ line: 0, ch: 1 });
      moveNextCursorOrIndent.exec(mde);
      expect(cm.getCursor()).toEqual({ line: 0, ch: 13 });

      cm.setCursor({ line: 1, ch: 3 });
      moveNextCursorOrIndent.exec(mde);
      expect(cm.getCursor()).toEqual({ line: 1, ch: 11 });

      cm.setCursor({ line: 2, ch: 6 });
      moveNextCursorOrIndent.exec(mde);
      expect(cm.getCursor()).toEqual({ line: 2, ch: 13 });
    });

    it('from last cell to first cell of next row', () => {
      cm.setCursor({ line: 0, ch: 8 });
      moveNextCursorOrIndent.exec(mde);
      expect(cm.getCursor()).toEqual({ line: 1, ch: 5 });

      cm.setCursor({ line: 1, ch: 9 });
      moveNextCursorOrIndent.exec(mde);
      expect(cm.getCursor()).toEqual({ line: 2, ch: 6 });
    });

    it('from last cell of last row to end of table', () => {
      cm.setCursor({ line: 2, ch: 8 });
      moveNextCursorOrIndent.exec(mde);
      expect(cm.getCursor()).toEqual({ line: 2, ch: 15 });
    });
  });
});
