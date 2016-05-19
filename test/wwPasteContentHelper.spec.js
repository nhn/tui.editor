'use strict';

var EventManager = require('../src/js/eventManager');
var WysiwygEditor = require('../src/js/wysiwygEditor');
var WwPasteContentHelper = require('../src/js/wwPasteContentHelper');
var WwCodeBlockManager = require('../src/js/wwCodeBlockManager');

describe('WwPasteContentHelper', function() {
    var wwe, pch;

    beforeEach(function() {
        var $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, new EventManager());

        wwe.init();

        wwe.addManager(WwCodeBlockManager);

        pch = new WwPasteContentHelper(wwe);
    });

    afterEach(function() {
        $('body').empty();
    });

    describe('get html string of range content', function() {
        it('list be pasted into list with remain list type of selection and first text', function() {
            var range, pasteData;

            wwe.getEditor().setHTML('<ul><li><div>list1</div></li><li>list2</li></ul>');

            range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('li')[0].childNodes[0], 0);
            range.setEnd(wwe.get$Body().find('li')[1].childNodes[0], 3);

            pasteData = {
                fragment: range.cloneContents(),
                rangeInfo: {
                    commonAncestorName: range.commonAncestorContainer
                }
            };

            range = wwe.getEditor().getSelection().cloneRange();

            wwe.getEditor().setHTML('<ol><li>list3</li></ol>');
            range.setStart(wwe.get$Body().find('li')[0].childNodes[0], 1);
            range.setEnd(wwe.get$Body().find('li')[0].childNodes[0], 1);
            range.collapse(true);

            wwe.getEditor().setSelection(range);

            pch.preparePaste(pasteData);

            expect(pasteData.fragment.childNodes[0].nodeType).toEqual(Node.TEXT_NODE);
            expect(pasteData.fragment.childNodes[0].textContent).toEqual('list1');
            expect(pasteData.fragment.childNodes[1].tagName).toEqual('OL');
        });
        it('if start is partial text node then make it text node', function() {
            var range, pasteData;

            wwe.getEditor().setHTML('<div>abcde</div><div>fghi</div>');
            range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('div')[0].childNodes[0], 3);
            range.setEnd(wwe.get$Body().find('div')[1].childNodes[0], 3);

            pasteData = {
                fragment: range.cloneContents(),
                rangeInfo: {
                    commonAncestorName: range.commonAncestorContainer
                }
            };

            pch.preparePaste(pasteData);

            expect(pasteData.fragment.firstChild.nodeType).toEqual(Node.TEXT_NODE);
            expect(pasteData.fragment.firstChild.textContent).toEqual('de');
        });
    });
});
