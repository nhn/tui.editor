'use strict';

var MarkerManager = require('../../../src/js/extensions/mark/markerManager'),
    MarkerList = require('../../../src/js/extensions/mark/markerList');

describe('MarkerManager', function() {
    var mm, ml;

    beforeEach(function() {
        ml = new MarkerList();
        mm = new MarkerManager(ml);
    });

    describe('update markers with content', function() {
        beforeEach(function() {
            mm.resetContent('abc[def]g');
            ml.addMarker(3, 8, 'myId');
        });
        it('update marker range when user have edited content', function() {
            var updatedMarkers;

            updatedMarkers = mm.getUpdatedMarkersByContent('aTEXTADDEDbc[def]g');

            expect(updatedMarkers[0].id).toEqual('myId');
            expect(updatedMarkers[0].start).toEqual(12);
            expect(updatedMarkers[0].end).toEqual(17);
        });
        it('update marker when content is removed marker start range area', function() {
            var updatedMarkers;

            updatedMarkers = mm.getUpdatedMarkersByContent('abef]g');

            expect(updatedMarkers[0].id).toEqual('myId');
            expect(updatedMarkers[0].start).toEqual(2);
            expect(updatedMarkers[0].end).toEqual(5);
        });
        it('update marker when content is removed marker start range area', function() {
            var updatedMarkers;

            updatedMarkers = mm.getUpdatedMarkersByContent('abef]g');

            expect(updatedMarkers[0].id).toEqual('myId');
            expect(updatedMarkers[0].start).toEqual(2);
            expect(updatedMarkers[0].end).toEqual(5);
        });
        it('update marker when content is removed marker end range area', function() {
            var updatedMarkers;

            updatedMarkers = mm.getUpdatedMarkersByContent('abc[de');

            expect(updatedMarkers[0].id).toEqual('myId');
            expect(updatedMarkers[0].start).toEqual(3);
            expect(updatedMarkers[0].end).toEqual(6);
        });

        it('update marker when content inserted inside marker range', function() {
            var updatedMarkers;

            updatedMarkers = mm.getUpdatedMarkersByContent('abc[dhief]g');

            expect(updatedMarkers[0].id).toEqual('myId');
            expect(updatedMarkers[0].start).toEqual(3);
            expect(updatedMarkers[0].end).toEqual(10);
        });

        it('update marker when content removed inside marker range', function() {
            var updatedMarkers;

            updatedMarkers = mm.getUpdatedMarkersByContent('abc[df]g');

            expect(updatedMarkers[0].id).toEqual('myId');
            expect(updatedMarkers[0].start).toEqual(3);
            expect(updatedMarkers[0].end).toEqual(7);
        });

        it('update markers with duplicated ranges', function() {
            var updatedMarkers;

            ml.addMarker(5, 8, 'myId2');

            updatedMarkers = mm.getUpdatedMarkersByContent('abc[df]g');

            expect(updatedMarkers[0].id).toEqual('myId');
            expect(updatedMarkers[0].start).toEqual(3);
            expect(updatedMarkers[0].end).toEqual(7);

            expect(updatedMarkers[1].id).toEqual('myId2');
            expect(updatedMarkers[1].start).toEqual(5);
            expect(updatedMarkers[1].end).toEqual(7);
        });

        it('update markers with multiple changes', function() {
            var updatedMarkers;

            updatedMarkers = mm.getUpdatedMarkersByContent('# ab[*d*f]g 123');

            expect(updatedMarkers[0].id).toEqual('myId');
            expect(updatedMarkers[0].start).toEqual(4);
            expect(updatedMarkers[0].end).toEqual(10);
        });
    });
});
