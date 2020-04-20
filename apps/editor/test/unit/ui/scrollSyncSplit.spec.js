/**
 * @fileoverview test ui scroll sync split
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import ScrollSyncSplit from '@/ui/scrollSyncSplit';
import EventManager from '@/eventManager';

describe('ScrollSyncSplit', () => {
  let scrollSyncSplit, leftElement, rightElement, container;

  beforeEach(done => {
    jasmine.getStyleFixtures().fixturesPath = '/base';
    loadStyleFixtures('src/css/editor.css');

    container = document.createElement('div');
    container.style.position = 'relative';
    document.body.appendChild(container);

    leftElement = document.createElement('div');
    rightElement = document.createElement('div');
    container.style.width = '100px';
    container.style.height = '100px';

    scrollSyncSplit = new ScrollSyncSplit(container, leftElement, rightElement, {
      eventManager: new EventManager()
    });

    // IE scrollTop fix
    setTimeout(done, 100);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('sync() adjust style top for elements which height is equal or shorter than wrapper', done => {
    leftElement.style.height = '100px';
    rightElement.style.height = '200px';

    scrollSyncSplit.scrollTop(50);

    setTimeout(() => {
      // adjust top to keep the element on screen
      expect(leftElement.style.top).toBe('50px');
      done();
    }, 500);
  });

  xit('sync() adjust style top for right side element if both elements are greater than wrapper', done => {
    leftElement.style.height = '200px';
    rightElement.style.height = '400px';

    scrollSyncSplit.scrollTop(50);

    setTimeout(() => {
      expect(rightElement.style.top).toBe('-100px');
      expect(leftElement.style.top).toBe('0px');
      done();
    }, 500);
  });

  it('setLeft, setRight trigger sync', () => {
    spyOn(scrollSyncSplit, 'sync');

    scrollSyncSplit._setLeft(leftElement);

    expect(scrollSyncSplit.sync).toHaveBeenCalled();

    scrollSyncSplit._setRight(rightElement);

    expect(scrollSyncSplit.sync.calls.count()).toEqual(2);
  });

  xit('toggleSplitView() toggle split / single view', () => {
    scrollSyncSplit.toggleSplitView();
    expect(scrollSyncSplit.isSplitView()).toEqual(false);
    expect(window.getComputedStyle(leftElement).width).toEqual('100px');
    expect(window.getComputedStyle(rightElement).display).toEqual('none');

    scrollSyncSplit.toggleSplitView();
    expect(scrollSyncSplit.isSplitView()).toEqual(true);
    expect(window.getComputedStyle(leftElement).width).toEqual('50px');
    expect(window.getComputedStyle(rightElement).width).toEqual('50px');
    expect(window.getComputedStyle(rightElement).display).toEqual('block');
  });
});
