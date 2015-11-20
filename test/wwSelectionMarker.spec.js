'use strict';

var WwSelectionMarker = require('../src/js/WwSelectionMarker'),
    WysiwygEditor = require('../src/js/wysiwygEditor'),
    EventManager = require('../src/js/eventManager');

describe('WwSelectionMarker', function() {
    var $container, em, wwe, wwsm, range;

    beforeEach(function(done) {
        $container = $('<div />');

        $('body').append($container);

        em = new EventManager();

        wwe = new WysiwygEditor($container, null, em);

        wwe.init(function() {
            wwe.setValue('<h1>hello world</h1>');
            range = wwe.getEditor().getSelection().cloneRange();
            done();
        });

        wwsm = new WwSelectionMarker(wwe.getEditor());
    });

    afterEach(function() {
        $('body').empty();
    });

    describe('add current selection marker', function() {
        it('mark non callapsed range', function() {
            range.selectNodeContents(wwe.get$Body().find('h1')[0].childNodes[0]);

            wwsm.addMarker(range);

            expect(range.startContainer.childNodes[range.startOffset].nodeValue).toEqual('hello world');
            expect(range.startContainer.childNodes[range.startOffset].previousSibling.tagName).toEqual('INPUT');
        });

        it('mark callapsed range', function() {
            range.setStart(wwe.get$Body().find('h1')[0].childNodes[0], 1);
            range.collapse(true);

            wwsm.addMarker(range);

            expect(range.startContainer.childNodes[range.startOffset].nodeValue).toEqual('ello world');
            expect(range.startContainer.childNodes[range.startOffset].previousSibling.tagName).toEqual('INPUT');
        });
    });

    describe('restore saved selection marker', function() {
        it('restore saved marker', function() {
            range.setStart(wwe.get$Body().find('h1')[0].childNodes[0], 1);
            range.collapse(true);

            wwsm.addMarker(range);

            range.selectNodeContents(wwe.get$Body().find('h1')[0].childNodes[0]);
            wwe.getEditor().setSelection(range);

            wwsm.restore();

            range = wwe.getEditor().getSelection().cloneRange();

            expect(range.startContainer.childNodes[range.startOffset].nodeValue).toEqual('ello world');
        });
    });
});
