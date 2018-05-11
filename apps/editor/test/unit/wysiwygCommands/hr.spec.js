/**
 * @fileoverview test wysiwyg hr command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import HR from '../../../src/js/wysiwygCommands/hr';
import WwTaskManager from '../../../src/js/wwTaskManager';
import WysiwygEditor from '../../../src/js/wysiwygEditor';
import EventManager from '../../../src/js/eventManager';

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
    expect(wwe.get$Body().find('div').length).toEqual(2);
  });

  it('add HR and if there is next block then dont make default block', () => {
    const range = sq.getSelection().cloneRange();

    sq.setHTML('<div>test</div><div><br/></div>');

    range.setStart(wwe.get$Body().find('div')[0], 0);
    range.collapse(true);

    sq.setSelection(range);

    HR.exec(wwe);

    expect(wwe.get$Body().find('hr').length).toEqual(1);
    expect(wwe.get$Body().find('div').length).toEqual(2);
  });

  it('append hr then cursor to next block', () => {
    const range = sq.getSelection().cloneRange();

    sq.setHTML('<div>test</div><div><br/></div>');

    range.setStart(wwe.get$Body().find('div')[0], 0);
    range.collapse(true);

    sq.setSelection(range);

    HR.exec(wwe);

    expect(wwe.get$Body().find('div').length).toEqual(2);
    expect(sq.getSelection().startContainer).toBe(wwe.get$Body().find('div')[1]);
  });
});
