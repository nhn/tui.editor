/**
 * @fileoverview test wysiwyg outdent command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import Outdent from '@/wysiwygCommands/outdent';
import WwTaskManager from '@/wwTaskManager';
import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';

describe('Outdent', () => {
  let wwe, sq, container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    wwe = new WysiwygEditor($(container), new EventManager());
    wwe.init();

    sq = wwe.getEditor();
    wwe.componentManager.addManager(WwTaskManager);
    sq.focus();

    wwe.get$Body().html(`
            <ul>
                <li data-te-task class="task-list-item">abcdef</li>
                <ul>
                    <li data-te-task class="task-list-item checked">abcde</li>
                </ul>
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

  it('should be able to outdent second to first.', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    range.setStart(wwe.get$Body().find('li')[1].firstChild, 0);
    range.collapse(true);

    sq.setSelection(range);

    Outdent.exec(wwe);

    expect(sq.get$Body().find('ul > li').length).toEqual(3);
    expect(sq.get$Body().find('ul > ul > li').length).toEqual(0);
    expect(sq.get$Body().find('ul > li').hasClass('task-list-item')).toBe(true);
    expect(sq.get$Body().find('ul > li').hasClass('checked')).toBe(true);
  });
  it('should break out list element and delete input.', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    range.setStart(wwe.get$Body().find('li')[2].firstChild, 0);
    range.collapse(true);

    sq.setSelection(range);

    Outdent.exec(wwe);

    expect(sq.get$Body().find('ul li').length).toEqual(2);
    expect(sq.get$Body().find('ul ul li').length).toEqual(1);
    expect(sq.get$Body().find('ul li').hasClass('task-list-item')).toBe(true);
  });
  it('should preserve original class(task / non-task)', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    wwe.get$Body().html(`
            <ul>
                <li data-te-task class="task-list-item">abcdef</li>
                <ul>
                    <li>abcde</li>
                </ul>
                <li data-te-task class="task-list-item"> </li>
            </ul>
        `);

    range.setStart(wwe.get$Body().find('ul ul li')[0].firstChild, 0);
    range.collapse(true);

    sq.setSelection(range);

    Outdent.exec(wwe);

    const $Body = sq.get$Body();

    expect($Body.find('ul li').length).toEqual(3);
    expect($Body.find('ul ul li').length).toEqual(0);
    expect($Body.find('ul li').eq(0).hasClass('task-list-item')).toBe(true);
    expect($Body.find('ul li').eq(1).hasClass('task-list-item')).toBe(false);
    expect($Body.find('ul li').eq(2).hasClass('task-list-item')).toBe(true);
  });

  it('should not outdent if next element is UL/OL (arbitrary list)', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    wwe.get$Body().html(`
            <ul>
                <li>abcdef</li>
                <ul>
                    <li id="target">abcde</li>
                    <ul>
                        <li>abcde</li>
                    </ul>
                </ul>
            </ul>
        `);

    range.setStart(wwe.get$Body().find('#target')[0].firstChild, 0);
    range.collapse(true);

    sq.setSelection(range);

    Outdent.exec(wwe);

    const $Body = sq.get$Body();

    expect($Body.find('> ul > li').length).toEqual(1);
    expect($Body.find('> ul > ul > li').length).toEqual(1);
    expect($Body.find('> ul > ul > ul > li').length).toEqual(1);
  });

  describe('should outdent when cursor', () => {
    it('at startOffset 0.', () => {
      const range = wwe.getEditor().getSelection().cloneRange();

      range.setStart(wwe.get$Body().find('li')[1].firstChild, 0);
      range.collapse(true);

      sq.setSelection(range);

      Outdent.exec(wwe);

      expect(sq.get$Body().find('ul > li').length).toEqual(3);
      expect(sq.get$Body().find('ul ul li').length).toEqual(0);
      expect(sq.get$Body().find('ul > li').hasClass('task-list-item')).toBe(true);
    });
    it('at any offset.', () => {
      const range = wwe.getEditor().getSelection().cloneRange();

      range.setStart(wwe.get$Body().find('li')[1].firstChild, 2);
      range.collapse(true);

      sq.setSelection(range);

      Outdent.exec(wwe);

      expect(sq.get$Body().find('ul > li').length).toEqual(3);
      expect(sq.get$Body().find('ul ul li').length).toEqual(0);
      expect(sq.get$Body().find('ul > li').hasClass('task-list-item')).toBe(true);
    });
  });
});
