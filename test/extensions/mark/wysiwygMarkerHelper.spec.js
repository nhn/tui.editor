'use strict';

var WysiwygMarkerHelper = require('../../../src/js/extensions/mark/wysiwygMarkerHelper'),
    SquireExt = require('../../../src/js/squireExt');

describe('WysiwygMarkerHelper', function() {
    var sqe, wmh;

    beforeEach(function() {
        var $container = $('<div />');

        $('body').append($container);

        sqe = new SquireExt($container[0], {
            blockTag: 'DIV'
        });

        wmh = new WysiwygMarkerHelper(sqe);

        sqe.setHTML('<h1>TEXT1&#8203</h1><h2>TEXT2</h2>');
    });

    afterEach(function() {
        $('body').empty();
        sqe = null;
    });

    it('get current text content and ignore ZWB', function() {
        expect(wmh.getTextContent()).toEqual('TEXT1TEXT2');
    });

    it('update marker with additional info', function() {
        var marker = wmh.updateMarkerWithExtraInfo({
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
        var marker = wmh.updateMarkerWithExtraInfo({
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
        var marker, range;

        range = sqe.getSelection().cloneRange();

        range.setStart(sqe.get$Body().find('h1')[0].firstChild, 2);
        range.setEnd(sqe.get$Body().find('h2')[0].firstChild, 2);

        sqe.setSelection(range);

        marker = wmh.getMarkerInfoOfCurrentSelection();

        expect(marker.start).toEqual(2);
        expect(marker.end).toEqual(7);
        expect(marker.top).toBeDefined();
        expect(marker.left).toBeDefined();
        expect(marker.height).toBeDefined();
        expect(marker.text).toEqual('XT1TE');
    });

    it('get marker of current selection that has start or end container pointed to non textNode', function() {
        var range, marker;

        range = sqe.getSelection().cloneRange();
        range.setStart(sqe.get$Body().find('h1')[0], 1);
        range.setEnd(sqe.get$Body().find('h2')[0], 1);

        sqe.setSelection(range);

        marker = wmh.getMarkerInfoOfCurrentSelection();

        expect(marker.start).toEqual(6);
        expect(marker.end).toEqual(11);
        expect(marker.text).toEqual('TEXT2');
    });

    it('get marker when end range pointed to textNode but end container is not text node', function() {
        var range, marker;

        sqe.setHTML('<ul><li><input type="checkbox" /> text1</li></ul');

        range = sqe.getSelection().cloneRange();
        range.setStart(sqe.get$Body().find('li')[0], 1);
        range.setEnd(sqe.get$Body().find('li')[0], 1);

        sqe.setSelection(range);

        marker = wmh.getMarkerInfoOfCurrentSelection();

        expect(marker.start).toEqual(0);
        expect(marker.end).toEqual(0);
        expect(marker.text).toEqual('');
    });

    it('get marker if some range of current selection have only ZWB text node', function() {
        var range, marker;

        sqe.setHTML('<div>text1</div><div>&#8203</div>');

        range = sqe.getSelection().cloneRange();
        range.setStart(sqe.get$Body().find('div')[1].firstChild, 1);
        range.setEnd(sqe.get$Body().find('div')[1].firstChild, 1);

        sqe.setSelection(range);

        marker = wmh.getMarkerInfoOfCurrentSelection();

        expect(marker.start).toEqual(5);
        expect(marker.end).toEqual(5);
        expect(marker.text).toEqual('');
    });

    it('get zero top and left when there is no content', function() {
        var marker;

        sqe.setHTML('');

        marker = wmh.updateMarkerWithExtraInfo({
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

        wmh.selectOffsetRange(0, 3);

        range = sqe.getSelection();

        expect(range.cloneContents().textContent).toEqual('TEX');
    });

    it('clear select', function() {
        var range;

        wmh.selectOffsetRange(0, 3);

        wmh.clearSelect();

        range = sqe.getSelection();

        expect(range.cloneContents().textContent).not.toEqual('TEX');
    });
});
