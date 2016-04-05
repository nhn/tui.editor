'use strict';

var ViewOnlyMarkerHelper = require('../../../src/js/extensions/mark/viewOnlyMarkerHelper'),
    Convertor = require('../../../src/js/convertor'),
    EventManager = require('../../../src/js/eventManager'),
    Preview = require('../../../src/js/preview');

describe('ViewOnlyMarkerHelper', function() {
    var preview, vmh;

    beforeEach(function() {
        var el = $('<div></div>'),
            em;

        $('body').append(el);

        em = new EventManager();

        preview = new Preview(el, em, new Convertor(em));
        vmh = new ViewOnlyMarkerHelper(preview);
        preview.refresh('# TEXT1\n## TEXT2');
    });

    afterEach(function() {
        $('body').empty();
    });

    it('get current text content and ignore ZWB', function() {
        expect(vmh.getTextContent()).toEqual('TEXT1TEXT2');
    });

    it('update marker with additional info', function() {
        var marker = vmh.updateMarkerWithExtraInfo({
            start: 2,
            end: 7
        });

        expect(marker.start).toEqual(2);
        expect(marker.end).toEqual(7);
        expect(marker.top).toBeDefined();
        expect(marker.left).toBeDefined();
        expect(marker.height).toBeDefined();
        expect(marker.text).toEqual('XT1TE');
    });

    it('update collapsed marker with additional info', function() {
        var marker = vmh.updateMarkerWithExtraInfo({
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

    it('get zero top and left when there is no content', function() {
        var marker;

        preview.refresh('');

        marker = vmh.updateMarkerWithExtraInfo({
            start: 1,
            end: 2,
            id: 'myId'
        });

        expect(marker.start).toEqual(1);
        expect(marker.end).toEqual(2);
        expect(marker.top).toEqual(0);
        expect(marker.left).toEqual(0);
        expect(marker.height).toEqual(0);
    });

    it('select range by given offset', function() {
        var range;

        vmh.selectOffsetRange(0, 3);

        range = window.getSelection().getRangeAt(0);

        expect(range.cloneContents().textContent).toEqual('TEX');
    });

    it('clear select', function() {
        vmh.selectOffsetRange(0, 3);

        vmh.clearSelect();

        expect(window.getSelection().rangeCount).toEqual(0);
    });
});
