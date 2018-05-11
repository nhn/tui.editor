/**
 * @fileoverview test wysiwyg indent command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import Indent from '../../../src/js/wysiwygCommands/indent';
import WwTaskManager from '../../../src/js/wwTaskManager';
import WwListManager from '../../../src/js/wwListManager';
import WysiwygEditor from '../../../src/js/wysiwygEditor';
import EventManager from '../../../src/js/eventManager';

describe('Indent', () => {
  let wwe, sq, container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    wwe = new WysiwygEditor($(container), new EventManager());

    wwe.init();

    sq = wwe.getEditor();
    wwe.componentManager.addManager(WwTaskManager);
    wwe.componentManager.addManager(WwListManager);
    sq.focus();

    wwe.get$Body().html(`
            <ul>
                <li data-te-task class="task-list-item">abcdef</li>
                <li data-te-task class="task-list-item">abcde</li>
                <li data-te-task class="task-list-item"> </li>
            </ul>
        `);
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      document.body.removeChild(container);
      done();
    });
  });

  it('success when it not first li.', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    range.setStart(wwe.get$Body().find('li')[1].firstChild, 0);
    range.collapse(true);

    sq.setSelection(range);

    Indent.exec(wwe);

    expect(sq.get$Body().find('ul ul li').length).toEqual(1);
    expect(sq.get$Body().find('ul ul li').hasClass('task-list-item')).toBe(true);
  });
  it('fail when it does not have previous li.', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    range.setStart(wwe.get$Body().find('li')[0].firstChild, 0);
    range.collapse(true);

    sq.setSelection(range);

    Indent.exec(wwe);

    expect(sq.get$Body().find('ul ul li').length).toEqual(0);
  });
  describe('should indent when cursor', () => {
    it('at startOffset 0.', () => {
      const range = wwe.getEditor().getSelection().cloneRange();

      range.setStart(wwe.get$Body().find('li')[1].firstChild, 0);
      range.collapse(true);

      sq.setSelection(range);

      Indent.exec(wwe);

      expect(sq.get$Body().find('ul ul li').length).toEqual(1);
      expect(sq.get$Body().find('ul ul li').hasClass('task-list-item')).toBe(true);
    });
    it('at startOffset 1.', () => {
      const range = wwe.getEditor().getSelection().cloneRange();

      range.setStart(wwe.get$Body().find('li')[1].firstChild, 1);
      range.collapse(true);

      sq.setSelection(range);

      Indent.exec(wwe);

      expect(sq.get$Body().find('ul ul li').length).toEqual(1);
      expect(sq.get$Body().find('ul ul li').hasClass('task-list-item')).toBe(true);
    });
  });
  it('should indent ordinary list', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    wwe.get$Body().html(`
            <ul>
                <li data-te-task class="task-list-item">abcdef</li>
                <li data-te-task class="task-list-item">abcde</li>
                <ul>
                    <li data-te-task class="task-list-item"></li>
                    <ul>
                        <li data-te-task class="task-list-item">abcdef</li>
                    </ul>
                </ul>
            </ul>
        `);

    range.setStart(wwe.get$Body().find('li')[1].firstChild, 1);
    range.collapse(true);

    sq.setSelection(range);

    Indent.exec(wwe);

    expect(sq.get$Body().find('ul > li').length).toEqual(4);
    expect(sq.get$Body().find('ul > ul > li').length).toEqual(3);
    expect(sq.get$Body().find('ul > ul > ul > li').length).toEqual(1);
    expect(sq.get$Body().find('ul > ul > ul > li').hasClass('task-list-item')).toBe(true);
  });

  it('should merge prev/next list after outdent', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    wwe.get$Body().html(`
            <ul>
                <li>list 1</li>
                <ol>
                    <li>list 2</li>
                    <li>list 3</li>
                </ol>
                <li id="target">list 4</li>
                <ul>
                    <li>list 5</li>
                    <li>list 6</li>
                </ul>
            </ul>
        `);

    range.setStart(wwe.get$Body().find('#target')[0].firstChild, 1);
    range.collapse(true);

    sq.setSelection(range);

    Indent.exec(wwe);

    expect(sq.get$Body().find('> ul > li').length).toEqual(1);
    expect(sq.get$Body().find('> ul > ol > li').length).toEqual(5);
    expect(sq.get$Body().find('> ul > ul > li').length).toEqual(0);
  });
});
