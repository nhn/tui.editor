/**
 * @fileoverview test wysiwyg hr manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import WysiwygEditor from '../../src/js/wysiwygEditor';
import EventManager from '../../src/js/eventManager';
import WwHrManager from '../../src/js/wwHrManager';
import Hr from '../../src/js/wysiwygCommands/hr';

describe('WwHrManager', () => {
  let $container, em, wwe, mgr;

  beforeEach(() => {
    $container = $('<div />');

    $('body').append($container);

    em = new EventManager();

    wwe = new WysiwygEditor($container, em);

    wwe.init();

    mgr = new WwHrManager(wwe);
    wwe.getEditor().focus();
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      $('body').empty();
      done();
    });
  });

  it('hr has contenteditable="false" whene wysiwygSetValueAfter event fire', () => {
    wwe.getEditor().setHTML('<hr><h1>abcd</h1>');

    em.emit('wysiwygSetValueAfter');

    expect(wwe.getEditor().getHTML().replace(/<br \/>|<br>/g, '')).toEqual('<hr contenteditable="false"><h1>abcd</h1>');
  });
});
