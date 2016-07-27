'use strict';

var TuiEditor = require('../../../src/js/editor');

describe('Mark', function() {
    var editor;

    beforeEach(function() {
        $('body').html('<div id="editSection"></div>');

        editor = new TuiEditor({
            el: $('#editSection'),
            previewStyle: 'tab',
            height: 300,
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
            $('body').empty();
            done();
        });
    });

    describe('add, delete, get marker', function() {
        var sq;

        beforeEach(function() {
            sq = editor.getSquire();

            editor.setValue('# start\n---\n## this is me');
        });

        it('add marker with current selection in wysiwyg', function() {
            var marker, range;

            range = sq.getSelection().cloneRange();
            range.setStart(sq.get$Body().find('h2')[0].firstChild, 1);
            range.setEnd(sq.get$Body().find('h2')[0].firstChild, 4);

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
            var marker;

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
            var marker;

            editor.setValue('');

            marker = editor.addMarker(2, 4, 'myId');

            expect(marker.start).toEqual(2);
            expect(marker.end).toEqual(4);
            expect(marker.text).toEqual('');
        });

        it('get marker', function() {
            var marker;

            editor.addMarker(6, 9, 'myId');
            marker = editor.getMarker('myId');

            expect(marker).toBeDefined();
            expect(marker.id).toEqual('myId');
        });

        it('remove marker', function() {
            var marker;

            marker = editor.addMarker(6, 9, 'myId');

            editor.removeMarker('myId');

            marker = editor.getMarker('myId');

            expect(marker).not.toBeDefined();
        });
    });

    describe('update marker by editing', function() {
        var sq;

        beforeEach(function(done) {
            sq = editor.getSquire();

            editor.setValue('# start\n---\n## this is me');

            //for prevent ignore change event
            //첫번째 체인지 이벤트는 무시되기때문에 프레임을 지연
            setTimeout(function() {
                done();
            });
        });

        it('update marker range when user have edited content', function(done) {
            var range, marker;

            range = sq.getSelection().cloneRange();
            range.setStart(sq.get$Body().find('h2')[0].firstChild, 1);
            range.setEnd(sq.get$Body().find('h2')[0].firstChild, 4);
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
            var range, marker;

            range = sq.getSelection().cloneRange();
            range.setStart(sq.get$Body().find('h2')[0].firstChild, 1);
            range.setEnd(sq.get$Body().find('h2')[0].firstChild, 4);
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
            var range, marker;

            range = sq.getSelection().cloneRange();
            range.setStart(sq.get$Body().find('h2')[0].firstChild, 1);
            range.setEnd(sq.get$Body().find('h2')[0].firstChild, 4);
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
            var range, marker;

            range = sq.getSelection().cloneRange();
            range.setStart(sq.get$Body().find('h2')[0].firstChild, 1);
            range.setEnd(sq.get$Body().find('h2')[0].firstChild, 4);
            sq.setSelection(range);

            marker = editor.addMarker('myId');

            range.setStart(sq.get$Body().find('h2')[0].firstChild, 2);
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
            var marker = editor.addMarker(6, 9, 'myId');

            editor.setValue('');

            editor.getSquire()._ignoreChange = false;
            editor.wwEditor._silentChange = false;

            if (tui.util.browser.msie && tui.util.browser.version === 10) {
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
            var markers;

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
            var markers;

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
            var markersData;

            editor.setValue('# start\n---\n## this is me');
            editor.addMarker(0, 2, 'test');

            markersData = editor.exportMarkers();

            expect(markersData.length).toEqual(1);
            expect(markersData[0].start).toEqual(2);
            expect(markersData[0].end).toEqual(4);
        });

        it('export and restore', function() {
            var markersData, markers;

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
            var marker;
            editor.setValue('# start\n---\n## this is me');
            marker = editor.addMarker(2, 7, 'myId1');
            editor.changeMode('markdown');

            expect(marker.start).toEqual(4);
            expect(marker.end).toEqual(17);
            expect(marker.text).toEqual('art  - - -  ## th');
        });

        it('markdown to wysiwyg', function() {
            var marker;

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
