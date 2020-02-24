/**
 * @fileoverview test wysiwyg P manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';
import WwPManager from '@/wwPManager';

describe('WwPManager', () => {
  let container, em, wwe;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    em = new EventManager();

    wwe = new WysiwygEditor(container, em);

    wwe.init();

    wwe._pMgr = new WwPManager(wwe);
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      document.body.removeChild(container);
      done();
    });
  });

  it('make p tag to div default block when wysiwygSetValueAfter event fire', () => {
    wwe.getEditor().setHTML('<p>text1</p>');
    em.emit('wysiwygSetValueAfter');
    expect(wwe.getBody().querySelectorAll('div').length).toEqual(1);
    expect(wwe.getBody().querySelectorAll('p').length).toEqual(0);
    expect(wwe.getBody().querySelectorAll('div')[0].textContent).toEqual('text1');
  });
  it('split muiltiple lines inside p when wysiwygSetValueBefore event fire', () => {
    const html = em.emitReduce(
      'wysiwygSetValueBefore',
      '<p>text<br><br><a href="#">link</a><br></p>'
    );

    expect(html).toEqual('<div>text</div><div><br></div><div><a href="#">link</a></div>');
  });
});
