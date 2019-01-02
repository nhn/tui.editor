/**
 * @fileoverview test markdown block quote
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import Blockquote from '../../../src/js/markdownCommands/blockquote';
import MarkdownEditor from '../../../src/js/markdownEditor';
import EventManager from '../../../src/js/eventManager';

describe('Blockquote', () => {
  let cm, doc, mde;

  beforeEach(() => {
    const $container = $('<div />');

    $('body').append($container);

    mde = new MarkdownEditor($container, new EventManager());

    cm = mde.getEditor();

    const sourceText = ['mytext1', '', 'mytext2', 'mytext3'];

    cm.setValue(sourceText.join('\n'));
    doc = cm.getDoc();
  });

  afterEach(() => {
    $('body').empty();
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
      doc.setSelection({
        line: 0,
        ch: 3
      }, {
        line: 2,
        ch: 2
      });

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

      doc.setSelection({
        line: 0,
        ch: 3
      }, {
        line: 2,
        ch: 2
      });
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

      doc.setSelection({
        line: 0,
        ch: 3
      }, {
        line: 2,
        ch: 2
      });
      Blockquote.exec(mde);

      expect(cm.getValue()).toEqual(['mytext1', '', `${fourSpace}mytext2`, 'mytext3'].join('\n'));
    });
  });
});
