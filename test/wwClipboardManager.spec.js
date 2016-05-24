'use strict';

var EventManager = require('../src/js/eventManager'),
    WysiwygEditor = require('../src/js/wysiwygEditor');

describe('WwClipboardManager', function() {
    var wwe, cbm;

    beforeEach(function() {
        var $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, new EventManager());

        wwe.init();

        cbm = wwe._clipboardManager;
    });

    afterEach(function() {
        $('body').empty();
    });

    describe('_refineCursorWithPasteContents', function() {
        it('set selection to last element of contents', function(done) {
            var fragment = wwe.getEditor().getDocument().createDocumentFragment();
            var range;
            $(fragment).append('<ul><li>ddd<br></li><li>dd2<br></li</ul>');

            cbm._refineCursorWithPasteContents(fragment);
            wwe.getEditor().insertHTML(fragment);

            setTimeout(function() {
                range = wwe.getEditor().getSelection();
                expect(range.startContainer.childNodes[range.endOffset].tagName).toEqual('BR');
                done();
            }, 0);
        });
    });

    describe('_extendRange', function() {
        it('Extend start selection if whole content of startContainer are contained', function() {
            var range;

            wwe.getEditor().setHTML('<ul><li>list1</li><li>list2</li></ul>');
            range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('LI')[0].childNodes[0], 0);
            range.setEnd(wwe.get$Body().find('LI')[1].childNodes[0], 3);

            range = cbm._extendRange(range);

            expect(range.startContainer.childNodes[range.startOffset].tagName).toEqual('LI');
            expect(range.startContainer.childNodes[range.startOffset].textContent).toEqual('list1');
            expect(range.endContainer.nodeType).toEqual(Node.TEXT_NODE);
            expect(range.endContainer.nodeValue[range.endOffset]).toEqual('t');
        });

        it('Extend end selection if whole content of endContainer are contained', function() {
            var range;

            wwe.getEditor().setHTML('<ul><li>list1</li><li>list2</li></ul>');
            range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('LI')[0].childNodes[0], 3);
            range.setEnd(wwe.get$Body().find('LI')[1].childNodes[0], 5);

            range = cbm._extendRange(range);

            expect(range.startContainer.nodeType).toEqual(Node.TEXT_NODE);
            expect(range.startContainer.nodeValue[range.startOffset]).toEqual('t');
            expect(range.endContainer.childNodes[range.endOffset - 1].tagName).toEqual('LI');
            expect(range.endContainer.childNodes[range.endOffset - 1].textContent).toEqual('list2');
        });

        it('if selection area is whole content of commonAncestorContainer then select commonAncestorContainer', function() {
            var range;

            wwe.getEditor().setHTML('<ul><li>list1</li><li>list2</li></ul>');
            range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('LI')[0].childNodes[0], 0);
            range.setEnd(wwe.get$Body().find('LI')[1].childNodes[0], 5);

            range = cbm._extendRange(range);

            expect(range.startContainer.childNodes[range.startOffset].tagName).toEqual('UL');
            expect(range.endContainer.childNodes[range.endOffset - 1].tagName).toEqual('UL');
        });

        it('if selection area is whole text content of one element then extend to commonAncestorContainer', function() {
            var range;

            wwe.getEditor().setHTML('<h1>hello world<br></h1>');
            range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('h1')[0].firstChild, 0);
            range.setEnd(wwe.get$Body().find('h1')[0].firstChild, 11);

            range = cbm._extendRange(range);

            expect(range.startContainer).toBe(wwe.$editorContainerEl[0]);
            expect(range.startOffset).toEqual(0);
            expect(range.endContainer).toBe(wwe.$editorContainerEl[0]);
            expect(range.endOffset).toEqual(1);
        });

        it('if partial text selected of one text node then dont do anything', function() {
            var range;

            wwe.getEditor().setHTML('<h1>hello world<br></h1>');
            range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('h1')[0].firstChild, 5);
            range.setEnd(wwe.get$Body().find('h1')[0].firstChild, 11);

            range = cbm._extendRange(range);

            expect(range.startContainer).toBe(range.endContainer);
            expect(range.startContainer.nodeType === Node.TEXT_NODE).toBe(true);
            expect(range.endContainer.nodeType === Node.TEXT_NODE).toBe(true);
        });
    });
});
