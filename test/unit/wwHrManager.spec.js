/**
 * @fileoverview test wysiwyg hr manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import WysiwygEditor from '../../src/js/wysiwygEditor';
import EventManager from '../../src/js/eventManager';
import WwHrManager from '../../src/js/wwHrManager';

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
    wwe.getEditor().setHTML('<div>test</div><hr><div>test</div>');

    em.emit('wysiwygSetValueAfter');

    expect(wwe.getEditor().getHTML().replace(/<br \/>|<br>/g, '')).toEqual('<div>test</div><div contenteditable="false"><hr contenteditable="false"></div><div>test</div>');
  });

  it('should insert empty line before hr if hr is first child of root', () => {
    wwe.getEditor().setHTML('<hr><div>test</div>');

    em.emit('wysiwygSetValueAfter');

    expect(wwe.getEditor().getHTML().replace(/<br \/>|<br>/g, '')).toEqual('<div></div><div contenteditable="false"><hr contenteditable="false"></div><div>test</div>');
  });

  it('should insert empty line after hr if hr is last child of root', () => {
    wwe.getEditor().setHTML('<div>test</div><hr>');

    em.emit('wysiwygSetValueAfter');

    expect(wwe.getEditor().getHTML().replace(/<br \/>|<br>/g, '')).toEqual('<div>test</div><div contenteditable="false"><hr contenteditable="false"></div><div></div>');
  });
});
