/**
 * @fileoverview test markdown strike
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import Strike from '../../../src/js/markdownCommands/strike';
import MarkdownEditor from '../../../src/js/markdownEditor';
import EventManager from '../../../src/js/eventManager';

describe('Strike', () => {
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

  describe('add strike', () => {
    it('in a middle of text', () => {
      doc.setCursor(2, 3);

      Strike.exec(mde);

      expect(cm.getValue()).toEqual(['mytext1', '', 'myt~~~~ext2', 'mytext3'].join('\n'));
    });

    it('to a blank line', () => {
      doc.setCursor(1, 0);

      Strike.exec(mde);

      expect(cm.getValue()).toEqual(['mytext1', '~~~~', 'mytext2', 'mytext3'].join('\n'));
    });

    it('around selected area', () => {
      doc.setSelection({
        line: 0,
        ch: 0
      }, {
        line: 0,
        ch: 7
      });

      Strike.exec(mde);

      expect(cm.getValue()).toEqual(['~~mytext1~~', '', 'mytext2', 'mytext3'].join('\n'));
    });
  });

  describe('remove strike', () => {
    it('selected area', () => {
      doc.setSelection({
        line: 0,
        ch: 0
      }, {
        line: 0,
        ch: 7
      });

      Strike.exec(mde);

      expect(cm.getValue()).toEqual(['~~mytext1~~', '', 'mytext2', 'mytext3'].join('\n'));
      doc.setSelection({
        line: 0,
        ch: 0
      }, {
        line: 0,
        ch: 11
      });

      Strike.exec(mde);

      expect(cm.getValue()).toEqual(['mytext1', '', 'mytext2', 'mytext3'].join('\n'));
    });
  });
});
