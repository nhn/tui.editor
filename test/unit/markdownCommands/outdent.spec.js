/**
 * @fileoverview test markdown Outdent
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import Outdent from '../../../src/js/markdownCommands/outdent';
import MarkdownEditor from '../../../src/js/markdownEditor';
import EventManager from '../../../src/js/eventManager';

describe('Outdent', () => {
  let cm, mde, $container;

  beforeEach(() => {
    $container = $('<div />');

    $('body').append($container);

    mde = new MarkdownEditor($container, new EventManager());

    cm = mde.getEditor();

    const sourceText = ['    * list1', '    * list2', '    * list3'];

    cm.setValue(sourceText.join('\n'));
  });

  afterEach(() => {
    $container.remove();
  });

  describe('Outdent', () => {
    it('should indent current line', () => {
      cm.setCursor(1, 3);

      Outdent.exec(mde);

      expect(cm.getValue()).toEqual(['    * list1', '* list2', '    * list3'].join('\n'));
    });
  });
});
