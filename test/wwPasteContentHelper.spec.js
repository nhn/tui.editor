'use strict';

var EventManager = require('../src/js/eventManager');
var WysiwygEditor = require('../src/js/wysiwygEditor');
var WwPasteContentHelper = require('../src/js/wwPasteContentHelper');
var WwCodeBlockManager = require('../src/js/wwCodeBlockManager');
var WwTableManager = require('../src/js/wwTableManager');

describe('WwPasteContentHelper', function() {
    var wwe, pch, contentFrag, pasteData;

    beforeEach(function() {
        var $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, new EventManager());

        wwe.init();

        wwe.getEditor().focus();

        wwe.addManager(WwCodeBlockManager);
        wwe.addManager(WwTableManager);

        pch = new WwPasteContentHelper(wwe);

        contentFrag = wwe.getEditor().getDocument().createDocumentFragment();
    });

    afterEach(function() {
        $('body').empty();
    });

    describe('paste data first aid', function() {
        var blockTags = 'div, section, article, aside, nav, menus, p';

        it('_removeStyles should remove styles of node', function() {
            var $node = $('<div style="border: 1px solid #f00">TEST</div>');
            pch._removeStyles($node);

            expect($node.attr('style')).not.toBeDefined();
        });

        it('_removeStyles should not remove color style of span', function() {
            var $node = $('<span style="color:#f00;border: 1px solid #f00">TEST</span>');
            pch._removeStyles($node);

            expect($node.attr('style')).toBeDefined();
            expect($node.css('border')).toBeFalsy();
            expect($node.css('color')).toBeTruthy();
        });

        it('_removeStyles should unwrap span without color style', function() {
            var $node = $('<div><span>TEST</span></div>');

            pch._removeStyles($node.find('span'));

            expect($node.find('span').length).toEqual(0);
        });

        it('_removeUnnecessaryBlocks should unwrap unnecessary blocks', function() {
            var $node = $('<div><div><span>TEST</span></div></div>');

            pch._removeUnnecessaryBlocks($node[0], blockTags);

            expect($node.find('div').length).toEqual(1);
        });

        it('_removeUnnecessaryBlocks should not unwrap block in LI', function() {
            var $node = $('<ul><li><div>TEST</div></li></ul>');

            pch._removeUnnecessaryBlocks($node[0], blockTags);

            expect($node.find('li').length).toEqual(1);
            expect($node.find('div').length).toEqual(1);
        });

        it('_removeUnnecessaryBlocks should not unwrap block in Task', function() {
            var $node = $('<ul><li class="task-list-item"><div>TEST</div></li></ul>');

            pch._removeUnnecessaryBlocks($node[0], blockTags);

            expect($node.find('li').length).toEqual(1);
            expect($node.find('div').length).toEqual(1);
        });

        it('_removeUnnecessaryBlocks should unwrap block in Task', function() {
            var $node = $('<ul><li><section>TEST</section></li></ul>');

            pch._removeUnnecessaryBlocks($node[0], blockTags);

            expect($node.find('li').length).toEqual(1);
            expect($node.find('section').length).toEqual(0);
        });
        it('_removeUnnecessaryBlocks should not unwrap div in blockquote', function() {
            var $node = $('<blockquote><div>hello<br></div><div>-simon<br></div></li></blockquote>');
            var divs;

            pch._removeUnnecessaryBlocks($node[0], blockTags);

            divs = $node.find('div');

            expect(divs.length).toEqual(2);
            expect(divs.eq(0).text()).toEqual('hello');
            expect(divs.eq(1).text()).toEqual('-simon');
        });
        it('_removeUnnecessaryBlocks should unwrap p', function() {
            var fragment = document.createDocumentFragment();
            var $node = $('<p><span>hello</span><span>-simon</span></p>');
            var spans;

            fragment.appendChild($node[0]);

            pch._removeUnnecessaryBlocks(fragment, blockTags);

            spans = $(fragment).find('span');
            expect(spans.length).toEqual(2);
            expect($node.find('p').length).toEqual(0);
            expect(spans.eq(0).text()).toEqual('hello');
            expect(spans.eq(1).text()).toEqual('-simon');
        });
        it('_removeUnnecessaryBlocks should not unwrap div without block element child', function() {
            var fragment = document.createDocumentFragment();
            var $node = $('<div>asdasd<br /></div><div><nav>asd</nav></div>');

            fragment.appendChild($node[0]);

            pch._removeUnnecessaryBlocks(fragment, blockTags);

            expect($(fragment).children().length).toEqual(1);
            expect($(fragment).find('div').length).toEqual(1);
            expect($(fragment).find('div').text()).toEqual('asdasd');
        });
        it('_unwrapNestedBlocks should unwrap nested blockTags', function() {
            var fragment = document.createDocumentFragment();
            var $node = $('<article></article>');
            var $fragment = $(fragment);

            $node.append('<div>hello<br /></div>');
            $node.append('<nav>simon</nav>');

            $fragment.append($node[0]);

            pch._unwrapNestedBlocks(fragment, blockTags);

            expect($fragment.find('article').length).toEqual(0);
            expect($fragment.find('div').length).toEqual(1);
            expect($fragment.find('div').text()).toEqual('hello');
            expect($fragment.find('nav').length).toEqual(1);
            expect($fragment.find('nav').text()).toEqual('simon');
        });
        it('_preElementAid should make pre tag content that has element to useful', function() {
            var $node = $('<pre><div><span>TEST</span></div></pre>');

            contentFrag.appendChild($node[0]);

            pch._preElementAid(contentFrag);

            expect($node.find('code').length).toEqual(1);
            expect($node.find('span').length).toEqual(0);
            expect($node.find('div > code').length).toEqual(1);
            expect($node.find('code').eq(0).text()).toEqual('TEST');
        });
        it('_preElementAid should make pre tag content that has only text to useful', function() {
            var $node = $('<pre>TEST\nTEST2</pre>');

            contentFrag.appendChild($node[0]);

            pch._preElementAid(contentFrag);

            expect($node.find('code').length).toEqual(2);
            expect($node.find('div > code').length).toEqual(2);
            expect($node.find('code').eq(0).text()).toEqual('TEST');
            expect($node.find('code').eq(1).text()).toEqual('TEST2');
        });
        it('_wrapTextNodeWithDiv should wrap textNodes with div element', function() {
            var $documentFragment;
            var fragment = document.createDocumentFragment();

            fragment.appendChild(document.createTextNode('ip lorem sit amet'));
            fragment.appendChild(document.createElement('br'));
            fragment.appendChild(document.createTextNode('and so on'));
            fragment.appendChild(document.createElement('br'));

            pch._wrapTextNodeWithDiv(fragment);

            $documentFragment = $(fragment);
            expect($documentFragment.find('div').length).toEqual(2);
            expect($documentFragment.find('br').length).toEqual(4);
            expect($documentFragment.find('div')[0].innerHTML).toEqual('ip lorem sit amet<br>');
            expect($documentFragment.find('div')[1].innerHTML).toEqual('and so on<br>');
        });
        it('_wrapTextNodeWithDiv should not wrap element nodes', function() {
            var $node = $('<p>ip lorem sit amet</p><br><span>and so on</span>');

            contentFrag.appendChild($node[0]);
            contentFrag.appendChild($node[1]);
            contentFrag.appendChild($node[2]);

            pch._wrapTextNodeWithDiv(contentFrag);

            expect($(contentFrag).find('div').length).toEqual(0);
            expect($(contentFrag).find('p').length).toEqual(1);
            expect($(contentFrag).find('span').length).toEqual(1);
            expect($(contentFrag).find('br').length).toEqual(1);
            expect($(contentFrag).find('p').text()).toEqual('ip lorem sit amet');
            expect($(contentFrag).find('span').text()).toEqual('and so on');
        });
        it('_unwrapIfNonBlockElementHasBr should unwrap span element with br', function() {
            var $node = $('<span>ip lorem sit amet<br /></span><span>and so on</span>');

            contentFrag.appendChild($node[0]);
            contentFrag.appendChild($node[1]);

            pch._unwrapIfNonBlockElementHasBr(contentFrag);

            expect($(contentFrag).find('span').length).toEqual(1);
            expect($(contentFrag).find('br').length).toEqual(1);
            expect($(contentFrag).text()).toEqual('ip lorem sit ametand so on');
            expect($(contentFrag).find('span').eq(0).text()).toEqual('and so on');
        });
        it('_unwrapIfNonBlockElementHasBr should unwrap b, i, em, s element with br', function() {
            var $node = $('<b>ip lorem sit amet<br /></b><i>and so on<br /></i><s>la vita dolce<br /></s><em>carpe diem<br /></em>');

            contentFrag.appendChild($node[0]);
            contentFrag.appendChild($node[1]);
            contentFrag.appendChild($node[2]);
            contentFrag.appendChild($node[3]);

            pch._unwrapIfNonBlockElementHasBr(contentFrag);

            expect($(contentFrag).find('i').length).toEqual(0);
            expect($(contentFrag).find('b').length).toEqual(0);
            expect($(contentFrag).find('s').length).toEqual(0);
            expect($(contentFrag).find('em').length).toEqual(0);
            expect($(contentFrag).find('br').length).toEqual(4);
            expect($(contentFrag).text()).toEqual('ip lorem sit ametand so onla vita dolcecarpe diem');
        });
        it('_tableElementAid should wrap TRs with TBODY', function() {
            var fragment = document.createDocumentFragment();

            fragment.appendChild($('<tr><td>1</td><td>2</td></tr>')[0]);

            pch._tableElementAid(fragment);

            expect($(fragment).find('tbody').length).toEqual(1);
            expect($(fragment).find('tbody').text()).toEqual('12');
        });
        it('_tableElementAid should wrap TDs with TR', function() {
            var fragment = document.createDocumentFragment();

            fragment.appendChild($('<td>1</td>')[0]);
            fragment.appendChild($('<td>2</td>')[0]);
            fragment.appendChild($('<td>3</td>')[0]);
            fragment.appendChild($('<td>4</td>')[0]);

            pch._tableElementAid(fragment);

            expect($(fragment).find('thead').length).toEqual(1);
            expect($(fragment).find('tbody').length).toEqual(1);
            expect($(fragment).find('tr').length).toEqual(2);
            expect($(fragment).find('tr').text()).toEqual('1234');
        });
        it('_tableElementAid should wrap THEAD and TBODY with TABLE', function() {
            var fragment = document.createDocumentFragment();

            fragment.appendChild($('<thead><tr><th>1</th><th>2</th></tr></thead>')[0]);
            fragment.appendChild($('<tbody><tr><td>a</td><td>b</td></tr></tbody>')[0]);

            pch._tableElementAid(fragment);

            expect($(fragment).find('table').length).toEqual(1);
            expect($(fragment).find('thead').length).toEqual(1);
            expect($(fragment).find('tbody').length).toEqual(1);
            expect($(fragment).find('thead').text()).toEqual('12');
            expect($(fragment).find('tbody').text()).toEqual('ab');
        });
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

            beforeEach(function() {
                wwe.getEditor().focus();
            });

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
