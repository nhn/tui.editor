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
        window.getSelection().removeAllRanges();
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

    it('get marker info of current selection', function() {
        var marker;

        vmh.selectOffsetRange(0, 3);

        marker = vmh.getMarkerInfoOfCurrentSelection();

        expect(marker.start).toEqual(0);
        expect(marker.end).toEqual(3);
        expect(marker.top).toBeDefined();
        expect(marker.left).toBeDefined();
        expect(marker.height).toBeDefined();
        expect(marker.text).toEqual('TEX');
    });

    it('get marker of current selection that has start or end container pointed to non textNode', function() {
        var range, marker;

        preview.refresh('# TEXT1\n- - -\n## TEXT2');

        range = document.createRange();
        range.selectNode(preview.$el.find('hr')[0]);
        range.setStart(preview.$el.find('h1')[0].firstChild, 2);

        window.getSelection().addRange(range);

        marker = vmh.getMarkerInfoOfCurrentSelection();

        expect(marker.start).toEqual(2);
        expect(marker.end).toEqual(5);
        expect(marker.text).toEqual('XT1');
    });

    it('get marker when end range pointed to textNode but end container is not text node', function() {
        var range, marker;

        preview.$el.html('<ul><li><input type="checkbox" /> text1</li></ul>');

        range = document.createRange();
        range.setStart(preview.$el.find('li')[0], 1);
        range.setEnd(preview.$el.find('li')[0], 1);

        window.getSelection().addRange(range);

        marker = vmh.getMarkerInfoOfCurrentSelection();

        expect(marker.start).toEqual(0);
        expect(marker.end).toEqual(0);
        expect(marker.text).toEqual('');
    });

    it('getMarkerInfoOfCurrentSelection() return null if contents not contains range', function() {
        var range;

        $('body').append('<div id="outsider">TEXT</div>');

        range = document.createRange();
        range.selectNodeContents($('#outsider')[0]);

        window.getSelection().addRange(range);

        expect(vmh.getMarkerInfoOfCurrentSelection()).toBeNull();
    });

    it('No preblem with no text content', function() {
        var marker;

        preview.refresh('');

        marker = vmh.updateMarkerWithExtraInfo({
            start: 1,
            end: 2,
            id: 'myId'
        });

        expect(marker.start).toEqual(1);
        expect(marker.end).toEqual(2);
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
