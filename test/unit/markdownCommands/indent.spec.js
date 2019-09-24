/**
 * @fileoverview test markdown hr
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import Indent from '@/markdownCommands/indent';
import MarkdownEditor from '@/markdownEditor';
import EventManager from '@/eventManager';

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
