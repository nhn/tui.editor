/**
 * @fileoverview test editor integration
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import Editor from '@/editor';

describe('Editor', () => {
  let container;

  beforeEach(() => {
    jasmine.getStyleFixtures().fixturesPath = '/base';
    loadStyleFixtures('node_modules/codemirror/lib/codemirror.css', 'src/css/editor.css');
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      container.parentNode.removeChild(container);
      done();
    });
  });

  it('should not scroll body scroller on initializing', () => {
    document.body.style.paddingTop = `${window.innerHeight}px`;
    // eslint-disable-next-line no-unused-vars
    const editor = new Editor({
      el: container,
      height: '300px',
      initialEditType: 'markdown'
    });

    expect(document.body.scrollTop).toBe(0);
    document.body.style.paddingTop = '0px';
  });

  it('should not throw exception on initializing with long content in case of markdown type vertical scrollSync enabled', done => {
    // the exception will be thrown from async, we can't no.toThrow() here
    // just wait and see if uncaught exception has been thrown or not
    // eslint-disable-next-line no-unused-vars
    const editor = new Editor({
      el: container,
      height: '150px',
      initialValue:
        'a\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\n',
      initialEditType: 'markdown',
      previewStyle: 'vertical',
      exts: ['scrollSync']
    });

    setTimeout(done, 1000);
  });
});
