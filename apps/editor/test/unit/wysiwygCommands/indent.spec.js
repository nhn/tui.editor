/**
 * @fileoverview test wysiwyg indent command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import Indent from '@/wysiwygCommands/indent';
import WwTaskManager from '@/wwTaskManager';
import WwListManager from '@/wwListManager';
import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';

describe('Indent', () => {
  let wwe, sq, container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    wwe = new WysiwygEditor(container, new EventManager());

    wwe.init();

    sq = wwe.getEditor();
    wwe.componentManager.addManager(WwTaskManager);
    wwe.componentManager.addManager(WwListManager);
    sq.focus();

    wwe.getBody().innerHTML = [
      '<ul>',
      '<li data-te-task class="task-list-item">abcdef</li>',
      '<li data-te-task class="task-list-item">abcde</li>',
      '<li data-te-task class="task-list-item"> </li>',
      '</ul>'
    ].join('');
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      document.body.removeChild(container);
      done();
    });
  });

  it('success when it not first li.', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    range.setStart(wwe.getBody().querySelectorAll('li')[1].firstChild, 0);
    range.collapse(true);

    sq.setSelection(range);

    Indent.exec(wwe);

    expect(sq.getBody().querySelectorAll('ul ul li').length).toEqual(1);
    expect(sq.getBody().querySelector('ul ul li').className).toBe('task-list-item');
  });

  it('fail when it does not have previous li.', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    range.setStart(wwe.getBody().querySelectorAll('li')[0].firstChild, 0);
    range.collapse(true);

    sq.setSelection(range);

    Indent.exec(wwe);

    expect(sq.getBody().querySelectorAll('ul ul li').length).toEqual(0);
  });

  describe('should indent when cursor', () => {
    it('at startOffset 0.', () => {
      const range = wwe
        .getEditor()
        .getSelection()
        .cloneRange();

      range.setStart(wwe.getBody().querySelectorAll('li')[1].firstChild, 0);
      range.collapse(true);

      sq.setSelection(range);

      Indent.exec(wwe);

      expect(sq.getBody().querySelectorAll('ul ul li').length).toEqual(1);
      expect(sq.getBody().querySelector('ul ul li').className).toBe('task-list-item');
    });

    it('at startOffset 1.', () => {
      const range = wwe
        .getEditor()
        .getSelection()
        .cloneRange();

      range.setStart(wwe.getBody().querySelectorAll('li')[1].firstChild, 1);
      range.collapse(true);

      sq.setSelection(range);

      Indent.exec(wwe);

      expect(sq.getBody().querySelectorAll('ul ul li').length).toEqual(1);
      expect(sq.getBody().querySelector('ul ul li').className).toBe('task-list-item');
    });
  });

  it('should indent ordinary list', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.getBody().innerHTML = [
      '<ul>',
      '<li data-te-task class="task-list-item">abcdef</li>',
      '<li data-te-task class="task-list-item">abcde</li>',
      '<ul>',
      '<li data-te-task class="task-list-item"></li>',
      '<ul>',
      '<li data-te-task class="task-list-item">abcdef</li>',
      '</ul>',
      '</ul>',
      ' </ul>'
    ].join('');

    range.setStart(wwe.getBody().querySelectorAll('li')[1].firstChild, 1);
    range.collapse(true);

    sq.setSelection(range);

    Indent.exec(wwe);

    expect(sq.getBody().querySelectorAll('ul > li').length).toEqual(4);
    expect(sq.getBody().querySelectorAll('ul > ul > li').length).toEqual(3);
    expect(sq.getBody().querySelectorAll('ul > ul > ul > li').length).toEqual(1);
    expect(sq.getBody().querySelector('ul > ul > ul > li').className).toBe('task-list-item');
  });

  it('should merge prev/next list after outdent', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.getBody().innerHTML = [
      '<ul>',
      '<li>list 1</li>',
      '<ol>',
      '<li>list 2</li>',
      '<li>list 3</li>',
      '</ol>',
      '<li id="target">list 4</li>',
      '<ul>',
      '<li>list 5</li>',
      '<li>list 6</li>',
      '</ul>',
      '</ul>'
    ].join('');

    range.setStart(wwe.getBody().querySelectorAll('#target')[0].firstChild, 1);
    range.collapse(true);

    sq.setSelection(range);

    Indent.exec(wwe);
    expect($(sq.getBody()).find('> ul > li').length).toEqual(1);
    expect($(sq.getBody()).find('> ul > ol > li').length).toEqual(5);
    expect($(sq.getBody()).find('> ul > ul > li').length).toEqual(0);
  });
});
