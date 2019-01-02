/**
 * @fileoverview test wysiwyg task manager
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import WysiwygEditor from '../../src/js/wysiwygEditor';
import EventManager from '../../src/js/eventManager';
import WwTaskManager from '../../src/js/wwTaskManager';

describe('WwTaskManager', () => {
  let $container, em, wwe, mgr;

  beforeEach(() => {
    $container = $('<div />');

    $('body').append($container);

    em = new EventManager();

    wwe = new WysiwygEditor($container, em);

    wwe.init();

    mgr = new WwTaskManager(wwe);
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      $('body').empty();
      done();
    });
  });

  describe('Events', () => {
    it('remove task-list class of element, it may block to merge normal list and task list' +
            ' when wysiwygSetValueAfter fire', () => {
      wwe.getEditor().setHTML('<ul><li class="task-list-item"><input type="checkbox">TASK</li></ul>');

      em.emit('wysiwygSetValueAfter');

      expect(wwe.get$Body().find('ul').eq(0).hasClass('task-list')).toEqual(false);
    });
  });

  describe('formatTask()', () => {
    it('Format task to passed node', () => {
      const range = wwe.getEditor().getSelection().cloneRange();

      wwe.getEditor().setHTML('<ul><li><div><br></div></li></ul>');

      range.setStart(wwe.get$Body().find('div')[0], 0);
      range.collapse(true);

      mgr.formatTask(range.startContainer);

      expect(wwe.get$Body().find('.task-list-item').length).toEqual(1);
      expect(wwe.get$Body().find('li').attr('data-te-task')).toBeDefined();
    });
    it('Format task to passed node that doesnt have any div', () => {
      const range = wwe.getEditor().getSelection().cloneRange();

      wwe.getEditor().setHTML('<ul><li><br></li></ul>');

      range.setStart(wwe.get$Body().find('li')[0], 0);
      range.collapse(true);

      mgr.formatTask(range.startContainer);

      expect(wwe.get$Body().find('.task-list-item').length).toEqual(1);
      expect(wwe.get$Body().find('li').attr('data-te-task')).toBeDefined();
    });
  });

  describe('unformatTask()', () => {
    it('unformat task to passed node', () => {
      const range = wwe.getEditor().getSelection().cloneRange();

      wwe.getEditor()
        .setHTML('<ul><li data-te-task class="task-list-item"><div>test</div></li></ul>');

      range.setStart(wwe.get$Body().find('li')[0], 0);
      range.collapse(true);

      mgr.unformatTask(range.startContainer);

      expect(wwe.get$Body().find('.task-list-item').length).toEqual(0);
      expect(wwe.get$Body().find('div').text()).toEqual('test');
      expect(wwe.get$Body().find('li').attr('data-te-task')).not.toBeDefined();
    });
    it('dont unformat to sub tasks', () => {
      const range = wwe.getEditor().getSelection().cloneRange();

      wwe.getEditor()
        .setHTML(['<ul><li data-te-task class="task-list-item"><div>test1</div>',
          '<ul><li data-te-task class="task-list-item"><div>test2</div></li></ul></li></ul>'].join(''));

      range.setStart(wwe.get$Body().find('li')[0], 0);
      range.collapse(true);

      mgr.unformatTask(range.startContainer);

      expect(wwe.get$Body().find('.task-list-item').length).toEqual(1);
      expect(wwe.get$Body().find('div').eq(0).text()).toEqual('test1');
      expect(wwe.get$Body().find('li').attr('data-te-task')).not.toBeDefined();
    });
  });
});
