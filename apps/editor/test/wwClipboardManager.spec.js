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

    describe('_getContentFromRange', function() {
        it('if select textnodes of one node partly, return text', function() {
            var range;

            wwe.getEditor().setHTML('<h1>HELLO</h1>');
            range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('h1')[0].childNodes[0], 0);
            range.setEnd(wwe.get$Body().find('h1')[0].childNodes[0], 3);

            expect(cbm._getContentFromRange(range)).toEqual('HEL');
        });

        it('if select all textnodes of one node, return text wrapped with paths', function() {
            var range;

            wwe.getEditor().setHTML('<h1>HELLO</h1>');
            range = wwe.getEditor().getSelection().cloneRange();

            range.selectNodeContents(wwe.get$Body().find('h1')[0].childNodes[0]);

            expect(cbm._getContentFromRange(range)).toEqual('<h1>HELLO</h1>');
        });

        it('if selected LIs of list, wrap with parent tag', function() {
            var range;

            wwe.getEditor().setHTML('<ul><li>list1</li><li>list2</li></ul>');
            range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('li')[0].childNodes[0], 0);
            range.setEnd(wwe.get$Body().find('li')[1].childNodes[0], 3);

            expect(cbm._getContentFromRange(range).replace(/<br>/g, '')).toEqual('<ul><li>list1</li><li>lis</li></ul>');
        });

        it('if start is partial text node then make it text node', function() {
            var range;

            wwe.getEditor().setHTML('<div>abcde</div><div>fghi</div>');
            range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('div')[0].childNodes[0], 3);
            range.setEnd(wwe.get$Body().find('div')[1].childNodes[0], 3);

            expect(cbm._getContentFromRange(range)).toEqual('de<div>fgh</div>');
        });
     });


    describe('_processFragment', function() {
        it('return new fragment that have parsed html', function() {
            var textHTML, result;

            textHTML = '<ul><li>hello</li></ul>';

            cbm._latestTextareaContent = textHTML;

            result = cbm._processFragment({
                textContent: textHTML
            });

            expect(result.childNodes[0].nodeType).toEqual(Node.ELEMENT_NODE);
            expect(result.childNodes[0].outerHTML).toEqual(textHTML);
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

     });
});
