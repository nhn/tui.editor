/**
 * @fileoverview test wysiwyg hr command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import HR from '@/wysiwygCommands/hr';
import WwTaskManager from '@/wwTaskManager';
import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';

describe('HR', () => {
  let wwe, sq;

  beforeEach(() => {
    const $container = $('<div />');

    $('body').append($container);

    wwe = new WysiwygEditor($container, new EventManager());

    wwe.init();

    sq = wwe.getEditor();
    wwe.componentManager.addManager('task', WwTaskManager);
    sq.focus();
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      $('body').empty();
      done();
    });
  });

  it('add HR and if there is no next block then append default block', () => {
    const range = sq.getSelection().cloneRange();

    range.setStart(wwe.get$Body().find('div')[0], 0);
    range.collapse(true);
    sq.setSelection(range);

    HR.exec(wwe);

    expect(wwe.get$Body().find('hr').length).toEqual(1);
    expect(wwe.get$Body().find('div').length).toEqual(3);
  });

  it('add HR and if there is next block then dont make default block', () => {
    const range = sq.getSelection().cloneRange();

    sq.setHTML('<div>test</div><div><br></div>');

    range.setStart(wwe.get$Body().find('div')[0], 0);
    range.collapse(true);

    sq.setSelection(range);

    HR.exec(wwe);

    expect(wwe.getEditor().getHTML().replace(/<br \/>|<br>/g, '')).toEqual('<div>test</div><div contenteditable="false"><hr contenteditable="false"></div><div></div>');
  });

  it('append hr then cursor to next block', () => {
    const range = sq.getSelection().cloneRange();

    sq.setHTML('<div>test</div><div><br></div>');

    range.setStart(wwe.get$Body().find('div')[0], 0);
    range.collapse(true);

    sq.setSelection(range);

    HR.exec(wwe);

    expect(sq.getSelection().startContainer).toBe(wwe.get$Body().find('div')[2]);
  });
});
