/**
 * @fileoverview test markdown block quote
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { ToastMark } from '@toast-ui/toastmark';
import Blockquote from '@/markdownCommands/blockquote';
import MarkdownEditor from '@/markdownEditor';
import EventManager from '@/eventManager';

describe('Blockquote', () => {
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

  describe('adding > in first column', () => {
    it('to a line with text on it', () => {
      doc.setCursor(2, 3);

      Blockquote.exec(mde);

      expect(cm.getValue()).toEqual(['mytext1', '', '> mytext2', 'mytext3'].join('\n'));
    });

    it('to a blank line', () => {
      doc.setCursor(1, 3);

      Blockquote.exec(mde);

      expect(cm.getValue()).toEqual(['mytext1', '> ', 'mytext2', 'mytext3'].join('\n'));
    });
  });

  describe('quote in selected area', () => {
    it('should work', () => {
      doc.setSelection(
        {
          line: 0,
          ch: 3
        },
        {
          line: 2,
          ch: 2
        }
      );

      Blockquote.exec(mde);

      expect(cm.getValue()).toEqual(['> mytext1', '> ', '> mytext2', 'mytext3'].join('\n'));
    });
  });

  describe('removing quote in one line', () => {
    it('quote should remove from already existing quote.', () => {
      const sourceText = ['mytext1', '', '>mytext2', 'mytext3'];

      cm.setValue(sourceText.join('\n'));

      doc.setCursor(2, 3);
      Blockquote.exec(mde);

      expect(cm.getValue()).toEqual(['mytext1', '', 'mytext2', 'mytext3'].join('\n'));
    });
  });

  describe('removing quote in selected area', () => {
    it('quote should remove from already existing quote.', () => {
      const sourceText = ['>mytext1', '>', '>mytext2', 'mytext3'];

      cm.setValue(sourceText.join('\n'));

      doc.setSelection(
        {
          line: 0,
          ch: 3
        },
        {
          line: 2,
          ch: 2
        }
      );
      Blockquote.exec(mde);

      expect(cm.getValue()).toEqual(['mytext1', '', 'mytext2', 'mytext3'].join('\n'));
    });
  });

  describe('removing quote with space', () => {
    it('quote and one space should remove from already existing quote.', () => {
      const quoteWithSpace = '> ';
      const fourSpace = '    ';
      const sourceText = [
        `${quoteWithSpace}mytext1`,
        quoteWithSpace,
        `${quoteWithSpace}${fourSpace}mytext2`,
        'mytext3'
      ];

      cm.setValue(sourceText.join('\n'));

      doc.setSelection(
        {
          line: 0,
          ch: 3
        },
        {
          line: 2,
          ch: 2
        }
      );
      Blockquote.exec(mde);

      expect(cm.getValue()).toEqual(['mytext1', '', `${fourSpace}mytext2`, 'mytext3'].join('\n'));
    });
  });
});
