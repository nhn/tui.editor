/**
 * @fileoverview test markdown text object
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { ToastMark } from '@toast-ui/toastmark';
import MdTextObject from '@/mdTextObject';
import MarkdownEditor from '@/markdownEditor';
import EventManager from '@/eventManager';

describe('MdTextObject', () => {
  let cm, doc, mde, to, container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    mde = new MarkdownEditor(container, new EventManager(), new ToastMark());

    cm = mde.getEditor();

    cm.setValue('test textObject');
    doc = cm.getDoc();
  });

  describe('set range', () => {
    beforeEach(() => {
      to = new MdTextObject(mde);
    });

    it('if constructor has no range argument then use current range', () => {
      const range = mde.getRange();

      expect(range.start).toEqual(to._start);
      expect(range.end).toEqual(to._end);
    });

    it('set start and set end', () => {
      const cursor = {
        line: 1,
        ch: 1
      };

      to._setStart(cursor);
      to._setEnd(cursor);

      expect(to._start).toEqual(cursor);
      expect(to._end).toEqual(cursor);
    });

    it('set with range', () => {
      const range = mde.getRange();

      expect(to._start).toEqual(range.start);
      expect(to._end).toEqual(range.end);
    });
  });

  describe('Get text of range', () => {
    beforeEach(() => {
      to = new MdTextObject(mde, {
        start: {
          line: 0,
          ch: 1
        },
        end: {
          line: 0,
          ch: 3
        }
      });
    });
    it('get text', () => {
      expect(to.getTextContent()).toEqual('es');
    });
  });

  describe('Update range', () => {
    beforeEach(() => {
      to = new MdTextObject(mde, {
        start: {
          line: 0,
          ch: 1
        },
        end: {
          line: 0,
          ch: 3
        }
      });
    });
    it('set end before range', () => {
      const expected = {
        line: 0,
        ch: 6
      };

      to.setEndBeforeRange({ start: expected });

      expect(to._end).toEqual(expected);
      expect(to.getTextContent()).toEqual('est t');
    });
  });

  describe('Range expand', () => {
    beforeEach(() => {
      to = new MdTextObject(mde, {
        start: {
          line: 0,
          ch: 1
        },
        end: {
          line: 0,
          ch: 3
        }
      });
    });

    it('Expand start offset', () => {
      to.expandStartOffset();
      expect(to.getTextContent()).toEqual('tes');
    });
    it('Expand end offset', () => {
      to.expandEndOffset();
      expect(to.getTextContent()).toEqual('est');
    });
  });
  describe('Replace range with text', () => {
    beforeEach(() => {
      to = new MdTextObject(mde, {
        start: {
          line: 0,
          ch: 1
        },
        end: {
          line: 0,
          ch: 3
        }
      });
    });

    it('replace text', () => {
      to.replaceContent('12');
      expect(doc.getValue()).toEqual('t12t textObject');
    });
  });

  describe('Delete text content within range', () => {
    beforeEach(() => {
      to = new MdTextObject(mde, {
        start: {
          line: 0,
          ch: 1
        },
        end: {
          line: 0,
          ch: 3
        }
      });
    });

    it('delete text', () => {
      to.deleteContent();
      expect(doc.getValue()).toEqual('tt textObject');
    });
  });

  describe('peek text content with given offset number', () => {
    beforeEach(() => {
      to = new MdTextObject(mde, {
        start: {
          line: 0,
          ch: 7
        },
        end: {
          line: 0,
          ch: 10
        }
      });
    });

    it('peekStartBeforeOffset() returns text content from start with given offset to start offset', () => {
      expect(to.peekStartBeforeOffset(3)).toEqual(' te');
    });
  });
});
