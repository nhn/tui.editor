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

        xit('if current selection has no textnode and collapsed then find previousSibling', function() {
            var range = wwe.getRange();
            range.selectNode(wwe.get$Body().find('br')[0]);
            range.collapse(true);

            to.setRange(range);

            expect(to._range.startContainer).toBe(wwe.get$Body().find('br')[0].previousSibling);
            expect(to._range.startOffset).toEqual(15);
        });
    });

    describe('Get text of range', function() {
        beforeEach(function() {
            var range = wwe.getRange();
            range.selectNodeContents(wwe.get$Body().find('div')[0].firstChild);
            range.setStart(range.startContainer, range.startOffset + 1);

            to = new WwTextObject(wwe, range);
        });
        it('get text', function() {
            expect(to.getTextContent()).toEqual('est textObject');
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
});
