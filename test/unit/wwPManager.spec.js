/**
 * @fileoverview test wysiwyg P manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';
import WwPManager from '@/wwPManager';

describe('WwPManager', () => {
  let $container, em, wwe;

  beforeEach(() => {
    $container = $('<div />');

    $('body').append($container);

    em = new EventManager();

    wwe = new WysiwygEditor($container, em);

    wwe.init();

    wwe._pMgr = new WwPManager(wwe);
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      $('body').empty();
      done();
    });
  });

  it('make p tag to div default block when wysiwygSetValueAfter event fire', () => {
    wwe.getEditor().setHTML('<p>text1</p>');
    em.emit('wysiwygSetValueAfter');
    expect(wwe.get$Body().find('div').length).toEqual(1);
    expect(wwe.get$Body().find('p').length).toEqual(0);
    expect(wwe.get$Body().find('div')[0].textContent).toEqual('text1');
  });
  it('split muiltiple lines inside p when wysiwygSetValueBefore event fire', () => {
    const html = em.emitReduce('wysiwygSetValueBefore', '<p>text<br><br><a href="#">link</a><br></p>');
    expect(html).toEqual('<div>text</div><div><br></div><div><a href="#">link</a></div>');
  });
});
