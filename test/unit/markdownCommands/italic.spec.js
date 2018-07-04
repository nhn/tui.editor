/**
 * @fileoverview test markdown italic
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import Italic from '../../../src/js/markdownCommands/italic';
import MarkdownEditor from '../../../src/js/markdownEditor';
import EventManager from '../../../src/js/eventManager';

describe('Italic', () => {
  let cm, doc, mde, $container;

  beforeEach(() => {
    $container = $('<div />');

    $('body').append($container);

    mde = new MarkdownEditor($container, new EventManager());

    cm = mde.getEditor();

    const sourceText = ['mytext1', '', 'mytext2', 'mytext3'];

    cm.setValue(sourceText.join('\n'));
    doc = cm.getDoc();
  });

  afterEach(() => {
    $container.remove();
  });

  describe('add italic', () => {
    it('in a midle of text', () => {
      doc.setCursor(2, 3);

      Italic.exec(mde);

      expect(cm.getValue()).toEqual(['mytext1', '', 'myt__ext2', 'mytext3'].join('\n'));
    });

    it('in a blank line', () => {
      doc.setCursor(1, 3);

      Italic.exec(mde);

      expect(cm.getValue()).toEqual(['mytext1', '__', 'mytext2', 'mytext3'].join('\n'));
    });

    it('around selected text', () => {
      doc.setSelection({
        line: 0,
        ch: 0
      }, {
        line: 0,
        ch: 7
      });

      Italic.exec(mde);

      expect(cm.getValue()).toEqual(['_mytext1_', '', 'mytext2', 'mytext3'].join('\n'));
    });

    it('should remove italic syntax in the middle of the given range', () => {
      cm.setValue('my _text_ 1');

      doc.setSelection({
        line: 0,
        ch: 0
      }, {
        line: 0,
        ch: 11
      });

      Italic.exec(mde);

      expect(cm.getValue()).toEqual('_my text 1_');
    });
  });
});
