/**
 * @fileoverview test markdown marker helper
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import CodeMirror from 'codemirror';

import MarkdownMarkerHelper from '../../../../src/js/extensions/mark/markdownMarkerHelper';

describe('MarkdownMarkerHelper', function() {
  let cm, mmh, cmTextarea;

  beforeEach(function() {
    cmTextarea = document.createElement('textarea');
    document.body.appendChild(cmTextarea);

    cm = CodeMirror.fromTextArea(cmTextarea, {
      lineWrapping: true,
      theme: 'default'
    });

    mmh = new MarkdownMarkerHelper(cm);

    cm.setValue('# TEXT1\n## TEXT2');
  });

  afterEach(function() {
    cm.toTextArea();
    cm = null;
    document.body.removeChild(cmTextarea);
  });

  it('get current text content', function() {
    expect(mmh.getTextContent()).toEqual('# TEXT1## TEXT2');
  });

  it('update marker with additional info', function() {
    let marker = mmh.updateMarkerWithExtraInfo({
      start: 2,
      end: 8
    });

    expect(marker.start).toEqual(2);
    expect(marker.end).toEqual(8);
    expect(marker.top).toBeDefined();
    expect(marker.left).toBeDefined();
    expect(marker.height).toBeDefined();
    expect(marker.text).toEqual('TEXT1 #');
  });

  it('update collapsed marker with additional info', function() {
    let marker = mmh.updateMarkerWithExtraInfo({
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
    let marker;

    cm.setSelection({
      line: 0,
      ch: 2
    }, {
      line: 1,
      ch: 1
    });

    marker = mmh.getMarkerInfoOfCurrentSelection();

    expect(marker.start).toEqual(2);
    expect(marker.end).toEqual(8);
    expect(marker.top).toBeDefined();
    expect(marker.left).toBeDefined();
    expect(marker.height).toBeDefined();
    expect(marker.text).toEqual('TEXT1 #');
  });

  it('if current selection range have empty line then ignore emplty line', function() {
    let marker;

    cm.setValue('# TEXT1\n\n## TEXT2');

    cm.setSelection({
      line: 0,
      ch: 2
    }, {
      line: 1,
      ch: 0
    });

    marker = mmh.getMarkerInfoOfCurrentSelection();

    expect(marker.start).toEqual(2);
    expect(marker.end).toEqual(7);
    expect(marker.top).toBeDefined();
    expect(marker.left).toBeDefined();
    expect(marker.height).toBeDefined();
    expect(marker.text).toEqual('TEXT1');
  });

  it('if current selection is backward then make it forward', function() {
    let marker;

    cm.setValue('# TEXT1\n\n## TEXT2');

    cm.setSelection({
      line: 1,
      ch: 0
    }, {
      line: 0,
      ch: 2
    });

    marker = mmh.getMarkerInfoOfCurrentSelection();

    expect(marker.start).toEqual(2);
    expect(marker.end).toEqual(7);
    expect(marker.top).toBeDefined();
    expect(marker.left).toBeDefined();
    expect(marker.height).toBeDefined();
    expect(marker.text).toEqual('TEXT1');
  });

  it('get zero top and left when there is no text content', function() {
    let marker;

    cm.setValue('');

    marker = mmh.updateMarkerWithExtraInfo({
      start: 2,
      end: 8
    });

    expect(marker.start).toEqual(2);
    expect(marker.end).toEqual(8);
    expect(parseInt(marker.top, 10)).toEqual(0);
    expect(parseInt(marker.left, 10)).toEqual(0);
    expect(parseInt(marker.height, 10)).toEqual(0);
    expect(marker.text).toEqual('');
  });

  it('select range by given offset', function() {
    mmh.selectOffsetRange(0, 3);

    expect(cm.getSelection()).toEqual('# T');
  });

  it('clear select', function() {
    mmh.selectOffsetRange(0, 3);

    mmh.clearSelect();

    expect(cm.getSelection()).toEqual('');
  });
});
