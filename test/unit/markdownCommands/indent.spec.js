/**
 * @fileoverview test markdown hr
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import Indent from '../../../src/js/markdownCommands/indent';
import MarkdownEditor from '../../../src/js/markdownEditor';
import EventManager from '../../../src/js/eventManager';

describe('Indent', () => {
  let cm, mde, $container;

  beforeEach(() => {
    $container = $('<div />');

    $('body').append($container);

    mde = new MarkdownEditor($container, new EventManager());

    cm = mde.getEditor();

    const sourceText = ['* list1', '* list2', '* list3'];

    cm.setValue(sourceText.join('\n'));
  });

  afterEach(() => {
    $container.remove();
  });

  describe('Indent', () => {
    it('should indent current line', () => {
      cm.setCursor(1, 3);

      Indent.exec(mde);

      expect(cm.getValue()).toEqual(['* list1', '    * list2', '* list3'].join('\n'));
    });
  });
});
