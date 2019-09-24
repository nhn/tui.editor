/**
 * @fileoverview test wysiwyg heading manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';
import WwHeadingManager from '@/wwHeadingManager';

describe('WwHeadingManager', () => {
  let $container, em, wwe;

  beforeEach(() => {
    $container = $('<div />');

    $('body').append($container);

    em = new EventManager();

    wwe = new WysiwygEditor($container, em);

    wwe.init();

    wwe._headingMgr = new WwHeadingManager(wwe);
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      $('body').empty();
      done();
    });
  });

  it('wrap inner contents of h1 with div when wysiwygSetValueAfter event fire', () => {
    wwe.getEditor().setHTML('<h1>text1</h1>');
    em.emit('wysiwygSetValueAfter');
    expect(wwe.get$Body().find('h1').length).toEqual(1);
    expect(wwe.get$Body().find('h1 div').length).toEqual(1);
    expect(wwe.get$Body().find('h1 div')[0].textContent).toEqual('text1');
  });
});
