'use strict';

var WwTextObject = require('../src/js/wwTextObject');
var WysiwygEditor = require('../src/js/wysiwygEditor');
var EventManager = require('../src/js/eventManager');

describe('WwTextObject', function() {
    var wwe, sq, to;

    beforeEach(function() {
        var $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, new EventManager());

        wwe.init();

        sq = wwe.getEditor();

        sq.setHTML('test textObject');
    });

    //we need to wait squire input event process
    afterEach(function(done) {
        setTimeout(function() {
            $('body').empty();
            done();
        });
    });

    describe('set range', function() {
        beforeEach(function() {
            to = new WwTextObject(wwe);
        });

        it('if constructor has no range argument then use current range', function() {
            var range = sq.getSelection();
            expect(to._range).toEqual(range);
        });

        it('set with range', function() {
            var range = sq.getSelection();
            to.setRange(range);
            expect(to._range).toEqual(range);
        });
    });

    describe('Get text of range', function() {
        it('get text', function() {
            var range = wwe.getRange();

            range.selectNodeContents(wwe.get$Body().find('div')[0].firstChild);
            range.setStart(range.startContainer, range.startOffset + 1);

            to = new WwTextObject(wwe, range);

            expect(to.getTextContent()).toEqual('est textObject');
        });

        it('get korean text', function() {
            var range = wwe.getRange();

            wwe.getEditor().setHTML('한글입니다.');

            range.selectNodeContents(wwe.get$Body().find('div')[0].firstChild);
            range.setStart(range.startContainer, range.startOffset + 1);

            to = new WwTextObject(wwe, range);

            expect(to.getTextContent()).toEqual('글입니다.');
        });
    });

    describe('Update range', function() {
        beforeEach(function() {
            var range = wwe.getRange();

            range.setStart(wwe.get$Body().find('div')[0].firstChild, 1);
            range.setEnd(wwe.get$Body().find('div')[0].firstChild, 3);

            to = new WwTextObject(wwe, range);
        });
        it('set end before range', function() {
            var rangeChangeTo;

            rangeChangeTo = wwe.getRange();

            rangeChangeTo.setStart(to._range.startContainer, 6);
            rangeChangeTo.collapse(true);

            to.setEndBeforeRange(rangeChangeTo);

            expect(to.getTextContent()).toEqual('est t');
        });
    });

    describe('Range expand', function() {
        beforeEach(function() {
            var range = wwe.getRange();

            range.setStart(wwe.get$Body().find('div')[0].firstChild, 1);
            range.setEnd(wwe.get$Body().find('div')[0].firstChild, 3);

            to = new WwTextObject(wwe, range);
        });

        it('Expand start offset', function() {
            to.expandStartOffset();
            expect(to.getTextContent()).toEqual('tes');
        });
        it('Expand end offset', function() {
            to.expandEndOffset();
            expect(to.getTextContent()).toEqual('est');
        });
    });

    describe('Replace range with text', function() {
        beforeEach(function() {
            var range = wwe.getRange();

            range.setStart(wwe.get$Body().find('div')[0].firstChild, 1);
            range.setEnd(wwe.get$Body().find('div')[0].firstChild, 3);

            to = new WwTextObject(wwe, range);
        });
        it('replace text', function() {
            to.replaceContent('12');
            expect(wwe.get$Body().find('div').text()).toEqual('t12t textObject');
        });
    });

    describe('Remove text content within range', function() {
        beforeEach(function() {
            var range = wwe.getRange();

            range.setStart(wwe.get$Body().find('div')[0].firstChild, 1);
            range.setEnd(wwe.get$Body().find('div')[0].firstChild, 3);

            to = new WwTextObject(wwe, range);
        });
        it('remove text', function() {
            to.deleteContent();
            expect(wwe.get$Body().find('div').text()).toEqual('tt textObject');
        });
    });

    describe('peek text content with given offset number', function() {
        beforeEach(function() {
            var range = wwe.getRange();

            range.setStart(wwe.get$Body().find('div')[0].firstChild, 7);
            range.setEnd(wwe.get$Body().find('div')[0].firstChild, 10);

            to = new WwTextObject(wwe, range);
        });

        it('peekStartBeforeOffset() returns text content from start with given offset to start offset', function() {
            expect(to.peekStartBeforeOffset(3)).toEqual(' te');
        });
    });
});
