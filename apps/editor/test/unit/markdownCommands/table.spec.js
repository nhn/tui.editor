/**
 * @fileoverview test markdown table
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { ToastMark } from '@toast-ui/toastmark';
import Table from '@/markdownCommands/table';
import MarkdownEditor from '@/markdownEditor';
import EventManager from '@/eventManager';

describe('Table', () => {
  let cm, doc, mde, container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    mde = new MarkdownEditor(container, new EventManager(), new ToastMark());

    cm = mde.getEditor();

    doc = cm.getDoc();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('Table', () => {
    it('Add table 2x2', () => {
      Table.exec(mde, 2, 2);

      expect(doc.getValue()).toEqual(['\n|  |  |', '| --- | --- |', '|  |  |'].join('\n'));
    });

    it('Add table 4x3', () => {
      Table.exec(mde, 4, 3);

      expect(doc.getValue()).toEqual(
        ['\n|  |  |  |  |', '| --- | --- | --- | --- |', '|  |  |  |  |', '|  |  |  |  |'].join(
          '\n'
        )
      );
    });

    it('move cursor to first header after insert table', () => {
      Table.exec(mde, 2, 2);

      expect(doc.getValue()).toEqual(['\n|  |  |', '| --- | --- |', '|  |  |'].join('\n'));

      expect(cm.getCursor().line).toEqual(1);
      expect(cm.getCursor().ch).toEqual(2);
    });

    it('add initial data', () => {
      Table.exec(mde, 2, 3, ['a', 'b', 'c', 'd', 'e', 'f']);

      expect(doc.getValue()).toEqual(
        ['\n| a | b |', '| --- | --- |', '| c | d |', '| e | f |'].join('\n')
      );
    });
  });
});
