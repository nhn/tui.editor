/**
 * @fileoverview test editor integration
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import Editor from '../../../src/js/editor';

describe('Editor', () => {
  let container;

  beforeEach(() => {
    jasmine.getStyleFixtures().fixturesPath = '/base';
    loadStyleFixtures(
      'node_modules/codemirror/lib/codemirror.css',
      'src/css/tui-editor.css'
    );
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
    const editor = new Editor({ // eslint-disable-line
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
    const editor = new Editor({ // eslint-disable-line
      el: container,
      height: '150px',
      initialValue: 'a\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\n',
      initialEditType: 'markdown',
      previewStyle: 'vertical',
      exts: ['scrollSync']
    });

    setTimeout(done, 1000);
  });
});
