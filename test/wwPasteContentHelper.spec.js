'use strict';

var EventManager = require('../src/js/eventManager');
var WysiwygEditor = require('../src/js/wysiwygEditor');
var WwPasteContentHelper = require('../src/js/wwPasteContentHelper');
var WwCodeBlockManager = require('../src/js/wwCodeBlockManager');

describe('WwPasteContentHelper', function() {
    var wwe, pch, contentFrag, pasteData;

    beforeEach(function() {
        var $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, new EventManager());

        wwe.init();

        wwe.addManager(WwCodeBlockManager);

        pch = new WwPasteContentHelper(wwe);

        contentFrag = wwe.getEditor().getDocument().createDocumentFragment();
    });

    afterEach(function() {
        $('body').empty();
    });

    describe('get html string of range content', function() {
        it('unrwap first child for paste as inline', function() {
            $(contentFrag).append($('<div>text<b>text2</b><br></div>'));

            pasteData = {
                fragment: contentFrag
            };

            pch.preparePaste(pasteData);

            expect(pasteData.fragment.childNodes.length).toEqual(2);
            expect(pasteData.fragment.childNodes[0].nodeType).toEqual(Node.TEXT_NODE);
            expect(pasteData.fragment.childNodes[1].tagName).toEqual('B');
        });

        describe('List', function() {
            var range;

            it('if content have orphan list and has format li then make depth based on current selection', function() {
                $(contentFrag).append($('<li><div>text<br></div></li><li><div>text2<br></div></li>'));

                pasteData = {
                    fragment: contentFrag,
                    rangeInfo: {
                        commonAncestorName: 'OL'
                    }
                };

                wwe.getEditor().setHTML('<ul><li><div>list1</div></li><li>list2</li></ul>');

                range = wwe.getEditor().getSelection().cloneRange();

                range.setStart(wwe.get$Body().find('div')[0].childNodes[0], 1);
                range.collapse(true);

                wwe.getEditor().setSelection(range);

                pch.preparePaste(pasteData);

                expect(pasteData.fragment.childNodes.length).toEqual(1);
                expect(pasteData.fragment.childNodes[0].tagName).toEqual('UL');
                expect(pasteData.fragment.childNodes[0].childNodes.length).toEqual(2);
            });

            it('if content have complete list and has format li then make depth based on current selection', function() {
                $(contentFrag).append($('<ul><li><div>text<br></div></li><li><div>text2<br></div></li></ul>'));

                pasteData = {
                    fragment: contentFrag,
                    rangeInfo: {
                        commonAncestorName: 'OL'
                    }
                };

                wwe.getEditor().setHTML('<ul><li><div>text0<br/></div><ul><li><div>list1</div></li><li>list2</li></ul></li></ul>');

                range = wwe.getEditor().getSelection().cloneRange();

                range.setStart(wwe.get$Body().find('ul li ul li div')[0].childNodes[0], 1);
                range.collapse(true);

                wwe.getEditor().setSelection(range);

                pch.preparePaste(pasteData);

                expect(pasteData.fragment.childNodes.length).toEqual(1);
                expect(pasteData.fragment.childNodes[0].tagName).toEqual('UL');
                expect($(pasteData.fragment.childNodes[0]).find('li > ul > li > ul > li').length).toEqual(2);
            });

            it('if content have orphan list and hasnt format li then wrap list parent based on rangeInfo', function() {
                $(contentFrag).append($('<li><div>text<br></div></li><li><div>text2<br></div></li>'));

                pasteData = {
                    fragment: contentFrag,
                    rangeInfo: {
                        commonAncestorName: 'OL'
                    }
                };

                wwe.getEditor().setHTML('<div><br></div>');

                range = wwe.getEditor().getSelection().cloneRange();

                range.setStart(wwe.get$Body().find('div')[0], 1);
                range.collapse(true);

                wwe.getEditor().setSelection(range);

                pch.preparePaste(pasteData);

                expect(pasteData.fragment.childNodes.length).toEqual(1);
                expect(pasteData.fragment.childNodes[0].tagName).toEqual('OL');
                expect(pasteData.fragment.childNodes[0].childNodes.length).toEqual(2);
            });


            it('if content have complete list and hasnt format li then do nothing', function() {
                $(contentFrag).append($('<ul><li><div>text<br></div></li><li><div>text2<br></div></li></ul>'));

                pasteData = {
                    fragment: contentFrag,
                    rangeInfo: {
                        commonAncestorName: 'OL'
                    }
                };

                wwe.getEditor().setHTML('<div><br></div>');

                range = wwe.getEditor().getSelection().cloneRange();

                range.setStart(wwe.get$Body().find('div')[0], 1);
                range.collapse(true);

                wwe.getEditor().setSelection(range);

                pch.preparePaste(pasteData);

                expect(pasteData.fragment.childNodes.length).toEqual(1);
                expect(pasteData.fragment.childNodes[0].tagName).toEqual('UL');
                expect(pasteData.fragment.childNodes[0].childNodes.length).toEqual(2);
            });

            //리스트의 끝부분의 뎊스가 루츠쪽으로 들어간경우
            it('paste data have backward depth list then limit list depth level', function() {
                $(contentFrag).append($('<ul><li><div>text<br></div></li><li><div>text2<br></div></li></ul><li><div>myText<br></div></li>'));

                pasteData = {
                    fragment: contentFrag,
                    rangeInfo: {
                        commonAncestorName: 'OL'
                    }
                };

                wwe.getEditor().setHTML('<ul><li><div>list1</div></li><li>list2</li></ul>');

                range = wwe.getEditor().getSelection().cloneRange();

                range.setStart(wwe.get$Body().find('div')[0].childNodes[0], 1);
                range.collapse(true);

                wwe.getEditor().setSelection(range);

                pch.preparePaste(pasteData);

                expect(pasteData.fragment.childNodes.length).toEqual(1);
                expect(pasteData.fragment.childNodes[0].tagName).toEqual('UL');
                expect($(pasteData.fragment.childNodes[0]).find('li > ul > li').length).toEqual(2);
            });
        });
    });
});
