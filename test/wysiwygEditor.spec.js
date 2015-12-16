'use strict';

var WysiwygEditor = require('../src/js/wysiwygEditor'),
    EventManager = require('../src/js/eventManager');

describe('WysiwygEditor', function() {
    var $container, em, wwe;

    beforeEach(function(done) {
        $container = $('<div />');

        $('body').append($container);

        em = new EventManager();

        wwe = new WysiwygEditor($container, null, em);

        wwe.init(function() {
            wwe.getEditor()._ignoreChange = true;
            done();
        });
    });

    afterEach(function() {
        $('body').empty();
    });

    describe('Initialize', function() {
        it('init() invoke callback', function() {
            expect($('iframe').length).toEqual(1);
            expect($('iframe').contents().find('body').hasClass('tui-editor-contents')).toBe(true);
        });
    });

    describe('Init Squire again if need', function() {
        it('Init Squire again if need', function(done) {
            wwe.setValue('<h1>HELLO WORLD</h1>');
            $container.detach();
            expect(wwe._isIframeReady()).toBe(false);
            $container.appendTo('body');

            //아이프레임의 load이벤트 이후를 테스트해야하기때문에 프레임지연
            //IE,FF 에서는 아이프레임의 load이벤트가 돔조작 이후 다음 프레임에서 발생한다.
            //크롬은 한프레임에서 돔조작 하자마자 발생함
            setTimeout(function() {
                expect(wwe._isIframeReady()).toBe(true);
                done();
            }, 100);
        });
    });

    describe('_isIframeReady()', function() {
        it('isPrepared() check iframe has prepared or need re init with squire', function() {
            expect(wwe._isIframeReady()).toBe(true);
        });

        it('when editor detached from dom for any reason isPrepared return false', function() {
            $container.detach();
            expect(wwe._isIframeReady()).toBe(false);
        });
    });

    describe('reset()', function() {
        it('set content blank', function() {
            wwe.setValue('<h1>HELLO WORLD</h1>');
            wwe.reset();
            expect(wwe.getValue()).toEqual('<br />');
        });
    });

    describe('managing key event handlers', function() {
        it('add key event handler and run', function() {
            var handler = jasmine.createSpy('keyEventHandler');
            wwe.addKeyEventHandler(handler);
            wwe._runKeyEventHandlers({keyCode: 0});

            expect(handler).toHaveBeenCalled();
        });
    });

    describe('Event', function() {
        beforeEach(function() {
            wwe.getEditor()._ignoreChange = false;
        });

        it('when something changed in editor Emit contentChangedFromWysiwyg event', function(done) {
            em.listen('contentChangedFromWysiwyg', function(editor) {
                expect(editor).toBe(wwe);
                done();
            });

            wwe.editor.insertHTML('<p>test</p>');
        });

        it('when something changed in editor Emit change.wysiwygEditor event', function(done) {
            //events of squire are asynchronous
            em.listen('changeFromWysiwyg', function(ev) {
                expect(ev.textContent).toEqual('t');
                //cuz, we cant simulate caret change
                //expect(ev.caretOffset).toEqual(1);
                done();
            });

            wwe.editor.insertPlainText('t');
        });

        it('when something changed in editor Emit change event', function(done) {
            //squire event fire asynchronous
            em.listen('change', function(ev) {
                expect(ev.textContent).toEqual('t');
                expect(ev.source).toEqual('wysiwyg');
                //expect(ev.caretOffset).toEqual(1);
                done();
            });

            wwe.editor.insertHTML('t');
        });

        it('fire change event when getValue after', function(done) {
            em.listen('change', function(ev) {
                expect(ev.source).toEqual('wysiwyg');
                done();
            });

            wwe.getEditor().setHTML('TEST');

            //이벤트가 한프레임 뒤에 발생해 각 단계별로 한프레임씩 지연실행
            setTimeout(function() {
                wwe.getValue();

                setTimeout(function() {
                    wwe.getEditor().insertHTML('TEST2');
                }, 0);
            }, 0);
        });

        it('when editor gain focus, emit focus event', function() {
            em.listen('focus', function(ev) {
                expect(ev.source).toEqual('wysiwyg');
            });

            wwe.editor.focus();
        });

        it('when editor lost focus, emit blur event', function() {
            em.listen('blur', function(ev) {
                expect(ev.source).toEqual('wysiwyg');
            });

            wwe.editor.blur();
        });

        it('fire stateChange event when state changed', function() {
            em.listen('stateChange', function(data) {
                expect(data.bold).toBe(true);
            });

            wwe.editor.insertPlainText('test');
            wwe.editor.bold();
        });
    });

    describe('getValue, setValue', function() {
        it('remove all unnecessary brs', function() {
            var html = '<h1>1</h1><h1>2</h1>';
            wwe.setValue(html);
            expect(wwe.getValue()).toEqual('<h1>1</h1><h1>2</h1>');
        });

        it('dont remove necessary brs', function() {
            var html = '<h1>1</h1><div><br></div><h1>2</h1>';
            wwe.setValue(html);
            expect(wwe.getValue()).toEqual('<h1>1</h1><br /><h1>2</h1>');
        });

        it('remove contentEditable block tag(div)', function() {
            var html = 'abcde<br />efg';
            wwe.setValue(html);
            expect(wwe.getValue()).toEqual('abcde<br />efg<br />');
        });

        it('empty line replace to br', function() {
            var html = '<div><br /></div>test';
            wwe.setValue(html);
            expect(wwe.getValue()).toEqual('<br />test<br />');
        });

        it('empty line li dont replace to br', function() {
            var html = '<ul><li></li></ul>';
            wwe.setValue(html);
            expect(wwe.getValue()).toEqual(html);
        });

        it('setValue make single line p tag have div block tag', function() {
            wwe.setValue('<p>text1</p>');
            expect(wwe.get$Body().find('div').length).toEqual(1);
            expect(wwe.get$Body().find('div')[0].textContent).toEqual('text1');
        });

        it('setValue unwrap div on hr', function() {
            wwe.setValue('<hr><h1>abcd</h1>');
            expect(wwe.getEditor().getHTML().replace(/<br \/>|<br>/g, '')).toEqual('<hr><h1>abcd</h1>');
        });

        it('remove last br in td or th when getValue', function() {
            wwe.setValue('<table><thead><tr><th>wef<br>wef<br></th></tr></thead><tbody><tr><td>waf<br>waef<br></td></tr></tbody></table>');
            expect(wwe.getValue()).toEqual('<table><thead><tr><th>wef<br>wef</th></tr></thead><tbody><tr><td>waf<br>waef</td></tr></tbody></table>');
        });

        it('empty td or th won\'t be deleted by getValue', function() {
            wwe.setValue('<table><thead><tr><th><br></th></tr></thead><tbody><tr><td><br></td></tr></tbody></table>');
            expect(wwe.getValue()).toEqual('<table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table>');
        });
    });

    it('get$Body() get current wysiwyg iframe body that wrapped jquery', function() {
        expect(wwe.get$Body().length).toEqual(1);
        expect(wwe.get$Body().prop('tagName')).toEqual('BODY');
    });

    it('hasFormatWithRx() check hasFormat with RegExp', function() {
        wwe.setValue('<h1>hasHeading</h1>');
        expect(wwe.hasFormatWithRx(/h[\d]/i)[0]).toEqual('H1');
    });

    describe('Table', function() {
        it('_isInTable() check if passed range is in table', function() {
            var range = wwe.getEditor().getSelection().cloneRange();
            wwe.getEditor().setHTML('<table><thead><tr><th><br></th><th><br></th></tr></thead><tbody><tr><td><br></td><td><br></td></tr></tbody></table>');
            range.setStart(wwe.get$Body().find('td')[0], 0);
            range.collapse(true);

            expect(wwe._isInTable(range)).toEqual(true);
        });

        describe('_appendBrIfTdOrThNotHaveAsLastChild()', function() {
            beforeEach(function() {
                wwe.getEditor().setHTML('<table><thead><tr><th>1234</th></tr></thead><tbody><tr><td>1123</td></tr></tbody></table>');
                wwe.get$Body().find('br').remove();
            });

            it('append br if td or th does not have br as lastchild, td case', function() {
                var range = wwe.getEditor().getSelection().cloneRange();
                range.setStart(wwe.get$Body().find('td')[0].childNodes[0], 2);
                range.collapse(true);

                wwe._appendBrIfTdOrThNotHaveAsLastChild(range);

                expect(wwe.get$Body().find('td').eq(0).find('br').length).toEqual(1);
            });

            it('append br if td or th does not have br as lastchild, th case', function() {
                var range = wwe.getEditor().getSelection().cloneRange();
                range.setStart(wwe.get$Body().find('th')[0].childNodes[0], 2);
                range.collapse(true);

                wwe._appendBrIfTdOrThNotHaveAsLastChild(range);

                expect(wwe.get$Body().find('th').eq(0).find('br').length).toEqual(1);
            });
        });
    });

    describe('_removeHrIfNeed()', function() {
        //같은 부모의 이전 offset의 엘리먼트가 hr일때
        it('remove hr if current is on first offset and previousSibling elemet is hr', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.setValue('<hr><div>abcd<br></div>');

            range.setStart(wwe.getEditor().getDocument().body, 1);
            range.collapse(true);
            wwe._removeHrIfNeed(range, {preventDefault: function() {}});

            expect(wwe.get$Body().find('hr').length).toEqual(0);
        });

        //현재커서가 hr을 가르키는 경우
        it('remove hr current selection is hr', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.setValue('<hr><div>abcd<br></div>');

            range.setStart(wwe.getEditor().getDocument().body, 0);
            range.collapse(true);
            wwe._removeHrIfNeed(range, {preventDefault: function() {}});

            expect(wwe.get$Body().find('hr').length).toEqual(0);
        });

        //현재 같은 부모에서는 이전 엘리먼트가 더이상 없고 부모래밸의 이전 앨리먼트가 hr일경우
        it('remove hr current selections parentNode previousSibling is hr when offset 0', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.setValue('<hr><div><b>abcd</b><<br></div>');

            range.setStart(wwe.get$Body().find('b')[0], 0);
            range.collapse(true);
            wwe._removeHrIfNeed(range, {preventDefault: function() {}});

            expect(wwe.get$Body().find('hr').length).toEqual(0);
        });
    });

    describe('_wrapDefaultBlockTo', function() {
        it('wrap selection defulat block', function(done) {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.get$Body().html('abcdef');

            range.setStart(wwe.getEditor().getDocument().body.firstChild, 4);
            range.collapse(true);
            wwe._wrapDefaultBlockTo(range);

            expect(wwe.getEditor().getHTML().replace(/<br \/>|<br>/g, '')).toEqual('<div>abcdef</div>');
            done();
        });
    });

    describe('_wrapDefaultBlockToOrphanTexts', function() {
        it('wrap selection defulat block to all orphan texts', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.get$Body().html('abcdef<div>ghijk<br></div>');

            range.setStart(wwe.getEditor().getDocument().body.firstChild, 4);
            range.collapse(true);
            wwe._wrapDefaultBlockToOrphanTexts();

            expect(wwe.getEditor().getHTML().replace(/<br \/>|<br>/g, '')).toEqual('<div>abcdef</div><div>ghijk</div>');
        });
    });


    describe('breakToNewDefaultBlock()', function() {
        it('make new defulatBlock then move selection to it', function() {
            var range;

            wwe.get$Body().html('<div>aef<br></div>');

            range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.getEditor().getDocument().body, 0);
            range.collapse(true);
            wwe.breakToNewDefaultBlock(range);

            expect(wwe.getEditor().getHTML()).toEqual('<div>aef<br></div><div><br></div>');
            expect(wwe.getEditor().getSelection().startContainer.textContent).toEqual('');
            expect(wwe.getEditor().getSelection().startContainer.tagName).toEqual('DIV');
        });

        it('make new defulatBlock to body child then move selection to it', function() {
            var range;

            wwe.get$Body().html('<h1><div>aef<br></div></h1>');

            range = wwe.getEditor().getSelection().cloneRange();

            //select text node
            range.setStart(wwe.get$Body().find('div')[0], 0);
            range.collapse(true);
            wwe.breakToNewDefaultBlock(range);

            expect(wwe.getEditor().getHTML()).toEqual('<h1><div>aef<br></div></h1><div><br></div>');
            expect(wwe.getEditor().getSelection().startContainer.textContent).toEqual('');
            expect(wwe.getEditor().getSelection().startContainer.tagName).toEqual('DIV');
        });
    });

    describe('unwrapBlockTag()', function() {
        it('unwrap tag of current selection with tag name', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.get$Body().html('<h1><div>test<br></div></h1>');

            range.selectNode(wwe.getEditor().getDocument().getElementsByTagName('div')[0].firstChild);
            range.collapse(true);
            wwe.getEditor().setSelection(range);
            wwe.unwrapBlockTag('H1');

            expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('test');
        });

        it('unwrap tag of current selection with condition callback', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.get$Body().html('<h1><div>test<br></div></h1>');

            range.selectNode(wwe.getEditor().getDocument().getElementsByTagName('div')[0].firstChild);
            range.collapse(true);
            wwe.getEditor().setSelection(range);

            wwe.unwrapBlockTag(function(tagName) {
                return tagName === 'H1';
            });

            expect(wwe.getValue().replace(/<br \/>/g, '')).toBe('test');
        });
    });

    describe('replace node\'s content text', function() {
        it('replace text without affect tags', function() {
            wwe.get$Body().html('<ul><li class="custom-class">list1</li><li>list2</li></ul>');

            wwe.replaceContentText(wwe.getEditor().getDocument().body, 'list1', 'list2');

            expect(wwe.getValue().replace(/<br \/>/g, '')).toBe('<ul><li class="custom-class">list2</li><li>list2</li></ul>');
        });
    });

    describe('focus()', function() {
        it('focus to ww editor', function() {
            $('body').focus();
            expect(document.activeElement).not.toBe(wwe.$iframe[0]);
            wwe.focus();
            expect(document.activeElement).toBe(wwe.$iframe[0]);
        });
    });
});
