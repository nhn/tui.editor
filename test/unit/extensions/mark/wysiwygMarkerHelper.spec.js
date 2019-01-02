/**
 * @fileoverview test wysiwyg marker helper
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import WysiwygMarkerHelper from '../../../../src/js/extensions/mark/wysiwygMarkerHelper';
import SquireExt from '../../../../src/js/squireExt';

describe('WysiwygMarkerHelper', function() {
  let sqe, wmh, container;

  beforeEach(function() {
    container = document.createElement('div');
    document.body.appendChild(container);

    sqe = new SquireExt(container, {
      blockTag: 'DIV'
    });

    wmh = new WysiwygMarkerHelper(sqe);

    sqe.setHTML('<h1>TEXT1&#8203<b>bold</b></h1><h2>TEXT2<i>italic</i></h2>');
  });

  afterEach(function() {
    document.body.removeChild(container);
    sqe = null;
  });

  it('get current text content and ignore ZWB', function() {
    expect(wmh.getTextContent()).toEqual('TEXT1boldTEXT2italic');
  });

  it('update marker with additional info', function() {
    const marker = wmh.updateMarkerWithExtraInfo({
      start: 2,
      end: 7
    });

    expect(marker.start).toEqual(2);
    expect(marker.end).toEqual(7);
    expect(marker.top).toBeDefined();
    expect(marker.left).toBeDefined();
    expect(marker.height).toBeDefined();
    expect(marker.text).toEqual('XT1bo');
  });

  it('update collapsed marker with additional info', function() {
    const marker = wmh.updateMarkerWithExtraInfo({
      start: 2,
      end: 2
    });

    expect(marker.start).toEqual(2);
    expect(marker.end).toEqual(2);
    expect(marker.top).toBeDefined();
    expect(marker.left).toBeDefined();
    expect(marker.height).toBeDefined();
    expect(marker.text).toEqual('');
  });

  it('get marker info of current selection', function() {
    const range = sqe.getSelection().cloneRange();

    range.setStart(sqe.get$Body().find('h1')[0].firstChild, 2);
    range.setEnd(sqe.get$Body().find('h2')[0].firstChild, 2);

    sqe.setSelection(range);

    const marker = wmh.getMarkerInfoOfCurrentSelection();

    expect(marker.start).toEqual(2);
    expect(marker.end).toEqual(11);
    expect(marker.top).toBeDefined();
    expect(marker.left).toBeDefined();
    expect(marker.height).toBeDefined();
    expect(marker.text).toEqual('XT1boldTE');
  });

  it('get marker of current selection that has start or end container pointed to non textNode', function() {
    const range = sqe.getSelection().cloneRange();
    range.setStart(sqe.get$Body().find('h1')[0], 1);
    range.setEnd(sqe.get$Body().find('h2')[0], 1);

    sqe.setSelection(range);

    const marker = wmh.getMarkerInfoOfCurrentSelection();

    expect(marker.start).toEqual(6);
    expect(marker.end).toEqual(15);
    expect(marker.text).toEqual('boldTEXT2');
  });

  it('get marker when end range pointed to textNode but end container is not text node', function() {
    sqe.setHTML('<ul><li><input type="checkbox" /> text1</li></ul>');

    const range = sqe.getSelection().cloneRange();
    range.setStart(sqe.get$Body().find('li')[0], 1);
    range.setEnd(sqe.get$Body().find('li')[0], 1);

    sqe.setSelection(range);

    const marker = wmh.getMarkerInfoOfCurrentSelection();

    expect(marker.start).toEqual(0);
    expect(marker.end).toEqual(0);
    expect(marker.text).toEqual('');
  });

  it('get marker if some range of current selection have only ZWB text node', function() {
    sqe.setHTML('<div>text1</div><div>&#8203</div>');

    const range = sqe.getSelection().cloneRange();
    range.setStart(sqe.get$Body().find('div')[1].firstChild, 1);
    range.setEnd(sqe.get$Body().find('div')[1].firstChild, 1);

    sqe.setSelection(range);

    const marker = wmh.getMarkerInfoOfCurrentSelection();

    expect(marker.start).toEqual(5);
    expect(marker.end).toEqual(5);
    expect(marker.text).toEqual('');
  });

  it('No preblem with no text content', function() {
    sqe.setHTML('');

    const marker = wmh.updateMarkerWithExtraInfo({
      start: 1,
      end: 2,
      id: 'myId'
    });

    expect(marker.start).toEqual(1);
    expect(marker.end).toEqual(2);
  });

  it('select range by given offset', function() {
    wmh.selectOffsetRange(0, 3);

    const range = sqe.getSelection();

    expect(range.cloneContents().textContent).toEqual('TEX');
  });

  it('clear select', function() {
    wmh.selectOffsetRange(0, 3);

    wmh.clearSelect();

    const range = sqe.getSelection();

    expect(range.cloneContents().textContent).not.toEqual('TEX');
  });
});
