/**
 * @fileoverview test AddLine command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { source } from 'common-tags';

import { ToastMark } from '@toast-ui/toastmark';
import addLine from '@/markdownCommands/addLine';
import MarkdownEditor from '@/markdownEditor';
import EventManager from '@/eventManager';

describe('AddLine command', () => {
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

  describe('in table', () => {
    beforeEach(() => {
      const sourceText = source`
        | head | head |
        | --- | --- |
        | body | body |
      `;

      cm.setValue(sourceText);
    });

    it('add newline when cursor is in cell of thead', () => {
      cm.setCursor({ line: 0, ch: 3 });

      addLine.exec(mde);

      const expected = source`
        | h
        ead | head |
        | --- | --- |
        | body | body |
      `;

      expect(cm.getValue()).toBe(expected);
    });

    it('add new row when cursor is in cell of delimiter row', () => {
      cm.setCursor({ line: 1, ch: 3 });

      addLine.exec(mde);

      const expected = source`
        | head | head |
        | --- | --- |
        |  |  |
        | body | body |
      `;

      expect(cm.getValue()).toBe(expected);
    });

    it('add new row when cursor is in cell of last row', () => {
      cm.setCursor({ line: 2, ch: 13 });

      addLine.exec(mde);

      const expected = source`
        | head | head |
        | --- | --- |
        | body | body |
        |  |  |
      `;

      expect(cm.getValue()).toBe(expected);
    });

    it('remove last row when all cells of last row are empty', () => {
      cm.setCursor({ line: 2, ch: 13 });

      addLine.exec(mde);
      addLine.exec(mde);

      const expected = source`
        | head | head |
        | --- | --- |
        | body | body |
      `;

      expect(cm.getValue()).toBe(`${expected}\n`);
    });
  });
});
