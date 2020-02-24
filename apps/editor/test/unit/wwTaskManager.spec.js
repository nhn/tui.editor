/**
 * @fileoverview test wysiwyg task manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';
import WwTaskManager from '@/wwTaskManager';

describe('WwTaskManager', () => {
  let container, em, wwe, mgr;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    em = new EventManager();

    wwe = new WysiwygEditor(container, em);

    wwe.init();

    mgr = new WwTaskManager(wwe);
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      document.body.removeChild(container);
      done();
    });
  });

  describe('Events', () => {
    it(
      'remove task-list class of element, it may block to merge normal list and task list' +
        ' when wysiwygSetValueAfter fire',
      () => {
        wwe
          .getEditor()
          .setHTML('<ul><li class="task-list-item"><input type="checkbox">TASK</li></ul>');

        em.emit('wysiwygSetValueAfter');

        expect(
          $(wwe.getBody())
            .find('ul')
            .eq(0)
            .hasClass('task-list')
        ).toEqual(false);
      }
    );
  });

  describe('formatTask()', () => {
    it('Format task to passed node', () => {
      const range = wwe
        .getEditor()
        .getSelection()
        .cloneRange();

      wwe.getEditor().setHTML('<ul><li><div><br></div></li></ul>');

      range.setStart(wwe.getBody().querySelectorAll('div')[0], 0);
      range.collapse(true);

      mgr.formatTask(range.startContainer);

      expect(wwe.getBody().querySelectorAll('.task-list-item').length).toEqual(1);
      expect(
        $(wwe.getBody())
          .find('li')
          .attr('data-te-task')
      ).toBeDefined();
    });
    it('Format task to passed node that doesnt have any div', () => {
      const range = wwe
        .getEditor()
        .getSelection()
        .cloneRange();

      wwe.getEditor().setHTML('<ul><li><br></li></ul>');

      range.setStart(wwe.getBody().querySelectorAll('li')[0], 0);
      range.collapse(true);

      mgr.formatTask(range.startContainer);

      expect(wwe.getBody().querySelectorAll('.task-list-item').length).toEqual(1);
      expect(
        $(wwe.getBody())
          .find('li')
          .attr('data-te-task')
      ).toBeDefined();
    });
  });

  describe('unformatTask()', () => {
    it('unformat task to passed node', () => {
      const range = wwe
        .getEditor()
        .getSelection()
        .cloneRange();

      wwe
        .getEditor()
        .setHTML('<ul><li data-te-task class="task-list-item"><div>test</div></li></ul>');

      range.setStart(wwe.getBody().querySelectorAll('li')[0], 0);
      range.collapse(true);

      mgr.unformatTask(range.startContainer);

      expect(wwe.getBody().querySelectorAll('.task-list-item').length).toEqual(0);
      expect(
        $(wwe.getBody())
          .find('div')
          .text()
      ).toEqual('test');
      expect(
        $(wwe.getBody())
          .find('li')
          .attr('data-te-task')
      ).not.toBeDefined();
    });
    it('dont unformat to sub tasks', () => {
      const range = wwe
        .getEditor()
        .getSelection()
        .cloneRange();

      wwe
        .getEditor()
        .setHTML(
          [
            '<ul><li data-te-task class="task-list-item"><div>test1</div>',
            '<ul><li data-te-task class="task-list-item"><div>test2</div></li></ul></li></ul>'
          ].join('')
        );

      range.setStart(wwe.getBody().querySelectorAll('li')[0], 0);
      range.collapse(true);

      mgr.unformatTask(range.startContainer);

      expect(wwe.getBody().querySelectorAll('.task-list-item').length).toEqual(1);
      expect(
        $(wwe.getBody())
          .find('div')
          .eq(0)
          .text()
      ).toEqual('test1');
      expect(
        $(wwe.getBody())
          .find('li')
          .attr('data-te-task')
      ).not.toBeDefined();
    });
  });
});
