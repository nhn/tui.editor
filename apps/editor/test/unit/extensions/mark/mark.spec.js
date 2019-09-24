/**
 * @fileoverview test marker
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import util from 'tui-code-snippet';

import TuiEditor from '@/editor';
import '@/extensions/mark/mark';

describe('Mark', function() {
  let editor, container;

  beforeEach(function() {
    container = document.createElement('div');
    document.body.appendChild(container);

    editor = new TuiEditor({
      el: container,
      previewStyle: 'tab',
      height: '300px',
      initialEditType: 'wysiwyg',
      exts: ['mark'],
      querySplitter: {
        queryRx: /@[^@\s]*/
      }
    });
    editor.focus();
  });

  afterEach(function(done) {
    setTimeout(function() {
      container.parentNode.removeChild(container);
      done();
    });
  });

  describe('add, delete, get marker', function() {
    let sq;

    beforeEach(function() {
      sq = editor.getSquire();

      editor.setValue('# start\n---\n## this is me');
    });

    it('add marker with current selection in wysiwyg', function() {
      let marker, range;

      range = sq.getSelection().cloneRange();
      range.setStart(sq.get$Body().find('h2 div')[0].firstChild, 1);
      range.setEnd(sq.get$Body().find('h2 div')[0].firstChild, 4);

      sq.setSelection(range);

      marker = editor.addMarker('myId');

      expect(marker).toBeDefined();
      expect(marker.start).toEqual(6);
      expect(marker.end).toEqual(9);
      expect(marker.text).toEqual('his');
      expect(marker.id).toEqual('myId');
      expect(marker.top).toBeDefined();
      expect(marker.left).toBeDefined();
    });

    it('add marker with offset', function() {
      let marker;

      marker = editor.addMarker(6, 9, 'myId');

      expect(marker).toBeDefined();
      expect(marker.start).toEqual(6);
      expect(marker.end).toEqual(9);
      expect(marker.text).toEqual('his');
      expect(marker.id).toEqual('myId');
      expect(marker.top).toBeDefined();
      expect(marker.left).toBeDefined();
    });

    it('add marker if there has no text content', function() {
      let marker;

      editor.setValue('');

      marker = editor.addMarker(2, 4, 'myId');

      expect(marker.start).toEqual(2);
      expect(marker.end).toEqual(4);
      expect(marker.text).toEqual('');
    });

    it('get marker', function() {
      let marker;

      editor.addMarker(6, 9, 'myId');
      marker = editor.getMarker('myId');

      expect(marker).toBeDefined();
      expect(marker.id).toEqual('myId');
    });

    it('remove marker', function() {
      let marker;

      marker = editor.addMarker(6, 9, 'myId');

      editor.removeMarker('myId');

      marker = editor.getMarker('myId');

      expect(marker).not.toBeDefined();
    });
  });

  describe('update marker by editing', function() {
    let sq;

    beforeEach(function(done) {
      sq = editor.getSquire();

      editor.setValue('# start\n---\n## this is me');

      // first event will be ignored? test on next tick
      setTimeout(done, 0);
    });

    it('update marker range when user have edited content', function(done) {
      let range, marker;

      range = sq.getSelection().cloneRange();
      range.setStart(sq.get$Body().find('h2 div')[0].firstChild, 1);
      range.setEnd(sq.get$Body().find('h2 div')[0].firstChild, 4);
      sq.setSelection(range);

      marker = editor.addMarker('myId');

      range.collapse(true);
      sq.setSelection(range);

      editor.getCurrentModeEditor().replaceSelection('TEXTADDED');

      editor.getSquire()._ignoreChange = false;
      editor.wwEditor._silentChange = false;

      editor.on('markerUpdated', function() {
        expect(marker.start).toEqual(15);
        expect(marker.end).toEqual(18);
        done();
      });
    });

    it('update marker when content is removed marker start range area', function(done) {
      let range, marker;

      range = sq.getSelection().cloneRange();
      range.setStart(sq.get$Body().find('h2 div')[0].firstChild, 1);
      range.setEnd(sq.get$Body().find('h2 div')[0].firstChild, 4);
      sq.setSelection(range);

      marker = editor.addMarker('myId');

      range.collapse(true);
      sq.setSelection(range);

      editor.getCurrentModeEditor().replaceRelativeOffset('', -1, 2);

      editor.getSquire()._ignoreChange = false;
      editor.wwEditor._silentChange = false;

      editor.on('markerUpdated', function() {
        expect(marker.start).toEqual(5);
        expect(marker.end).toEqual(7);
        done();
      });
    });

    it('update marker when content is removed marker end range area', function(done) {
      let range, marker;

      range = sq.getSelection().cloneRange();
      range.setStart(sq.get$Body().find('h2 div')[0].firstChild, 1);
      range.setEnd(sq.get$Body().find('h2 div')[0].firstChild, 4);
      sq.setSelection(range);

      marker = editor.addMarker('myId');

      range.setStart(range.endContainer, 4);
      range.collapse(true);
      sq.setSelection(range);

      editor.getCurrentModeEditor().replaceRelativeOffset('', -1, 2);

      editor.getSquire()._ignoreChange = false;
      editor.wwEditor._silentChange = false;

      editor.on('markerUpdated', function() {
        expect(marker.start).toEqual(6);
        expect(marker.end).toEqual(8);
        done();
      });
    });

    it('update marker when content inserted inside marker range', function(done) {
      let range, marker;

      range = sq.getSelection().cloneRange();
      range.setStart(sq.get$Body().find('h2 div')[0].firstChild, 1);
      range.setEnd(sq.get$Body().find('h2 div')[0].firstChild, 4);
      sq.setSelection(range);

      marker = editor.addMarker('myId');

      range.setStart(sq.get$Body().find('h2 div')[0].firstChild, 2);
      range.collapse(true);
      sq.setSelection(range);

      editor.getCurrentModeEditor().replaceSelection('TEXTADDED');

      editor.getSquire()._ignoreChange = false;
      editor.wwEditor._silentChange = false;

      editor.on('markerUpdated', function() {
        expect(marker.start).toEqual(6);
        expect(marker.end).toEqual(18);
        done();
      });
    });

    it('udpate marker when content has been removed completely', function(done) {
      let marker = editor.addMarker(6, 9, 'myId');

      editor.setValue('');

      editor.getSquire()._ignoreChange = false;
      editor.wwEditor._silentChange = false;

      if (util.browser.msie && util.browser.version === 10) {
        editor.eventManager.emit('change');
      }

      editor.on('markerUpdated', function() {
        expect(marker.top).toBeDefined();
        expect(marker.left).toBeDefined();
        done();
      });
    });
  });

  describe('persistence of marker data', function() {
    it('restore markers', function() {
      let markers;

      markers = editor.setValueWithMarkers('# start\n---\n## this is me', [
        {
          id: 'myId',
          start: 14,
          end: 17
        }
      ]);

      expect(markers[0].start).toEqual(6);
      expect(markers[0].end).toEqual(9);
      expect(markers[0].text).toEqual('his');
      expect(markers[0].id).toEqual('myId');
      expect(markers[0].top).toBeDefined();
      expect(markers[0].left).toBeDefined();
    });

    it('remove current markers when restore markers', function() {
      let markers;

      editor.setValue('# start\n---\n## this is me');

      editor.addMarker(1, 5, 'test');

      markers = editor.setValueWithMarkers('# start\n---\n## this is me', [
        {
          id: 'myId',
          start: 14,
          end: 17
        }
      ]);

      expect(markers.length).toEqual(1);
      expect(markers[0].id).toEqual('myId');
    });

    it('get current markers data', function() {
      let markersData;

      editor.setValue('# start\n---\n## this is me');
      editor.addMarker(0, 2, 'test');

      markersData = editor.exportMarkers();

      expect(markersData.length).toEqual(1);
      expect(markersData[0].start).toEqual(2);
      expect(markersData[0].end).toEqual(4);
    });

    it('export and restore', function() {
      let markersData, markers;

      editor.setValue('# start\n---\n## this is me');
      editor.addMarker(0, 2, 'test');

      markersData = editor.exportMarkers();

      markers = editor.setValueWithMarkers(editor.getValue(), markersData);

      expect(markers.length).toEqual(1);
      expect(markers[0].start).toEqual(0);
      expect(markers[0].end).toEqual(2);
      expect(markers[0].text).toEqual('st');
    });
  });

  describe('conversion marker between markdown and wysiwyg', function() {
    it('wysiwyg to markdown', function() {
      let marker;
      editor.setValue('# start\n---\n## this is me');
      marker = editor.addMarker(2, 7, 'myId1');
      editor.changeMode('markdown');

      expect(marker.start).toEqual(4);
      expect(marker.end).toEqual(17);
      expect(marker.text).toEqual('art  - - -  ## th');
    });

    it('markdown to wysiwyg', function() {
      let marker;

      editor.changeMode('markdown');
      editor.setValue('# start\n---\n## this is me');
      marker = editor.addMarker(4, 15, 'myId1');
      editor.changeMode('wysiwyg');

      expect(marker.start).toEqual(2);
      expect(marker.end).toEqual(7);
      expect(marker.text).toEqual('artth');
    });
  });
});
