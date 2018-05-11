/**
 * @fileoverview test markdown paragraph
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import Paragraph from '../../../src/js/markdownCommands/paragraph';
import MarkdownEditor from '../../../src/js/markdownEditor';
import EventManager from '../../../src/js/eventManager';

describe('Paragraph', () => {
  let cm, doc, mde;

  beforeEach(() => {
    const $container = $('<div />');

    $('body').append($container);

    mde = new MarkdownEditor($container, new EventManager());

    cm = mde.getEditor();
  });

  afterEach(() => {
    $('body').empty();
  });

  describe('', () => {
    it('heading to paragraph', () => {
      const sourceText = ['# mytext1'];

      cm.setValue(sourceText.join('\n'));
      doc = cm.getDoc();
      doc.setCursor(0, 0);

      Paragraph.exec(mde);

      expect(doc.getLine(0)).toBe('mytext1');
    });

    it('heading to paragraph, when use selection', () => {
      const sourceText = ['# mytext1', '## mytext2', '### mytext3'];

      cm.setValue(sourceText.join('\n'));
      doc = cm.getDoc();
      doc.setSelection({
        line: 0,
        ch: 0
      }, {
        line: 2,
        ch: 10
      });

      Paragraph.exec(mde);

      expect(doc.getLine(0)).toBe('mytext1');
      expect(doc.getLine(1)).toBe('mytext2');
      expect(doc.getLine(2)).toBe('mytext3');
    });

    it('heading to paragraph, when use li', () => {
      const sourceText = ['# mytext1', '* mylistitem1', '- mylistitem2', '### mytext3'];

      cm.setValue(sourceText.join('\n'));
      doc = cm.getDoc();
      doc.setSelection({
        line: 0,
        ch: 0
      }, {
        line: 3,
        ch: 10
      });

      Paragraph.exec(mde);

      expect(doc.getLine(0)).toBe('mytext1');
      expect(doc.getLine(1)).toBe('mylistitem1');
      expect(doc.getLine(2)).toBe('mylistitem2');
      expect(doc.getLine(3)).toBe('mytext3');
    });

    it('heading to paragraph, when use li', () => {
      const sourceText = ['# mytext1', '  * mylistitem1', '    - mylistitem2', '### mytext3'];

      cm.setValue(sourceText.join('\n'));
      doc = cm.getDoc();
      doc.setSelection({
        line: 0,
        ch: 0
      }, {
        line: 3,
        ch: 10
      });

      Paragraph.exec(mde);

      expect(doc.getLine(0)).toBe('mytext1');
      expect(doc.getLine(1)).toBe('mylistitem1');
      expect(doc.getLine(2)).toBe('mylistitem2');
      expect(doc.getLine(3)).toBe('mytext3');
    });
    it('heading to paragraph, when use li', () => {
      const sourceText = ['* [ ] mytext1', '- [ ] mytext2', '1. [ ] mytext3', '        - [ ] mytext4'];

      cm.setValue(sourceText.join('\n'));
      doc = cm.getDoc();
      doc.setSelection({
        line: 0,
        ch: 0
      }, {
        line: 3,
        ch: 10
      });

      Paragraph.exec(mde);

      expect(doc.getLine(0)).toBe('mytext1');
      expect(doc.getLine(1)).toBe('mytext2');
      expect(doc.getLine(2)).toBe('mytext3');
      expect(doc.getLine(3)).toBe('mytext4');
    });
  });
});
