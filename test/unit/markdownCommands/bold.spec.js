/**
 * @fileoverview test markdown bold
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import Bold from '../../../src/js/markdownCommands/bold';
import MarkdownEditor from '../../../src/js/markdownEditor';
import EventManager from '../../../src/js/eventManager';

describe('Bold', () => {
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

  describe('add bold syntax', () => {
    it('**** in the middle of text', () => {
      doc.setCursor(2, 3);

      Bold.exec(mde);

      expect(cm.getValue()).toEqual(['mytext1', '', 'myt****ext2', 'mytext3'].join('\n'));
    });

    it('**** in blank line', () => {
      doc.setCursor(1, 3);

      Bold.exec(mde);

      expect(cm.getValue()).toEqual(['mytext1', '****', 'mytext2', 'mytext3'].join('\n'));
    });

    it('around selected area', () => {
      doc.setSelection({
        line: 0,
        ch: 0
      }, {
        line: 0,
        ch: 7
      });

      Bold.exec(mde);

      expect(cm.getValue()).toEqual(['**mytext1**', '', 'mytext2', 'mytext3'].join('\n'));
    });

    it('should remove bold syntax in the middle of the given range', () => {
      cm.setValue('my**text**1');

      doc.setSelection({
        line: 0,
        ch: 0
      }, {
        line: 0,
        ch: 11
      });

      Bold.exec(mde);

      expect(cm.getValue()).toEqual('**mytext1**');
    });
  });
});
