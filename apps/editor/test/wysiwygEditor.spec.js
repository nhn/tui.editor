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
            //IE,FF 에서는 아이프레임의 load이벤트가 돔조작 이후 프레임에서 발생한다.
            //크롬은 바로 한프레임에서 돔조작 하자마자 발생함
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

    describe('Event', function() {
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
        it('checked checkbox should have checked attribute', function() {
            wwe.getEditor().setHTML('<input type="checkbox" id="task" />');
            wwe.getEditor().getDocument().getElementById('task').checked = true;

            //use toLowerCase and indexOf because IE attribute order,name issue
            expect(wwe.getValue().toLowerCase().indexOf('checked="checked"')).not.toEqual(-1);
        });

        it('unchecked checkbox should not have checked attribute', function() {
            wwe.getEditor().setHTML('<input type="checkbox" id="task" checked="checked" />');
            wwe.getEditor().getDocument().getElementById('task').checked = false;

            expect(wwe.getValue().toLowerCase().indexOf('checked="checked"')).toEqual(-1);
        });

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

        it('remove space next to input when getValue()', function() {
            wwe.setValue('<ul><li class="task-list-item"><input type="checkbox">TASK</li></ul>');
            expect(wwe.getValue()).toEqual('<ul><li class="task-list-item"><input type="checkbox">TASK</li></ul>');
        });

        it('setValue make single line p tag have div block tag', function() {
            wwe.setValue('<p>text1</p>');
            expect(wwe.get$Body().find('div').length).toEqual(1);
            expect(wwe.get$Body().find('div')[0].textContent).toEqual('text1');
        });

        it('put space and ZWS into input tag next', function() {
            wwe.setValue('<ul><li class="task-list-item"><input type="checkbox">TASK</li></ul>');
            expect(wwe.get$Body().find('li')[0].textContent).toEqual(' TASK');
        });

        it('remove task-list class of element, it may block merge normal list and task list', function() {
            wwe.setValue('<ul><li class="task-list-item"><input type="checkbox">TASK</li></ul>');
            expect(wwe.get$Body().find('ul').eq(0).hasClass('task-list')).toEqual(false);
        });

        it('add one space to task-list-item input\'s next for safari cursor issue', function() {
            wwe.setValue('<ul><li class="task-list-item"><input type="checkbox">TASK<li></li></ul>');
            expect(wwe.get$Body().find('.task-list-item').eq(0).text()).toEqual(' TASK');
        });

        it('setValue unwrap div on hr', function() {
            wwe.setValue('<hr><h1>abcd</h1>');
            expect(wwe.getEditor().getHTML().replace(/<br \/>|<br>/g, '')).toEqual('<hr><h1>abcd</h1>');
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

            expect(wwe._isInTable()).toEqual(true);
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

    describe('Task', function() {
        describe('_unformatTaskIfNeedOnBackspace()', function() {
            it('remove input if current selection is right of input with one space', function() {
                var range = wwe.getEditor().getSelection().cloneRange();

                wwe.getEditor().setHTML('<ul><li><input type="checkbox" />&nbsp;text</li></ul>');

                range.setStart(wwe.getEditor().getDocument().getElementsByTagName('INPUT')[0].nextSibling, 1);
                range.collapse(true);
                wwe._unformatTaskIfNeedOnBackspace(range);

                expect(wwe.getValue()).toEqual('<ul><li>text</li></ul>');
            });

            it('remove input if current selection is right of input with one space wrapped inline tag', function() {
                var range = wwe.getEditor().getSelection().cloneRange();

                wwe.get$Body().html('<ul><li class="task-list-item"><input type="checkbox"><b>&nbsp;text</b></li></ul>');

                range.setStart(wwe.getEditor().getDocument().getElementsByTagName('B')[0].firstChild, 1);
                range.collapse(true);
                wwe._unformatTaskIfNeedOnBackspace(range);

                //replace하는것은 ie때문
                expect(wwe.getValue().replace(' class=""', '')).toEqual('<ul><li><b>text</b></li></ul>');
            });

            it('remove input if current selection has placed at start of task item', function() {
                var range = wwe.getEditor().getSelection().cloneRange();

                wwe.get$Body().html('<ul><li class="task-list-item"><input type="checkbox" />&nbsp;text</li></ul>');

                range.selectNode(wwe.getEditor().getDocument().getElementsByTagName('INPUT')[0]);
                range.collapse(true);
                wwe._unformatTaskIfNeedOnBackspace(range);

                expect(wwe.getValue().replace(' class=""', '')).toEqual('<ul><li>&nbsp;text</li></ul>');
            });

            it('dont remove necessary input', function() {
                var range = wwe.getEditor().getSelection().cloneRange();

                wwe.setValue('<ul><li class="task-list-item"><input type="checkbox"> text<b>a</b></li></ul>');

                range.selectNodeContents(wwe.getEditor().getDocument().getElementsByTagName('B')[0]);
                range.collapse(true);
                wwe._unformatTaskIfNeedOnBackspace(range);

                expect(wwe.getValue()).toEqual('<ul><li class="task-list-item"><input type="checkbox">text<b>a</b></li></ul>');
            });
        });

        describe('_unformatTaskIfNeedOnEnter()', function() {
            it('remove input if current selection is right of input with one space', function() {
                var range = wwe.getEditor().getSelection().cloneRange();

                wwe.setValue('<ul><li class="task-list-item"><input type="checkbox" />&nbsp;</li></ul>');

                range.selectNode(wwe.getEditor().getDocument().getElementsByTagName('INPUT')[0]);
                range.collapse(true);
                wwe._unformatTaskIfNeedOnEnter(range);

                expect(wwe.getValue().replace(' class=""', '')).toEqual('<ul><li></li></ul>');
            });
        });
        describe('_removeTaskInputInWrongPlace', function() {
            it('remove inputbox in wrong parent', function() {
                wwe.get$Body().html('<ul><li><input type="checkbox" /></li></ul>');

                wwe._removeTaskInputInWrongPlace();

                expect(wwe.getValue()).toEqual('<ul><li></li></ul>');
            });

            it('remove inputbox in wrong place', function() {
                wwe.get$Body().html('<ul><li class="task-list-item"><input type="checkbox"> text<input type="checkbox"></li></ul>');

                wwe._removeTaskInputInWrongPlace();

                expect(wwe.getValue()).toEqual('<ul><li class="task-list-item"><input type="checkbox">text</li></ul>');
            });
        });

        describe('_unformatIncompleteTask', function() {
            it('if wysiwyg contents has incomplete task then make it list', function() {
                wwe.getEditor().setHTML('<ul><li class="task-list-item">task1</li><li class="task-list-item"><input type="checkbox">&nbsp;task2</li></ul>');

                wwe._unformatIncompleteTask();

                expect(wwe.getEditor().getHTML().replace(/<br>/g, '')).toEqual('<ul><li class="">task1</li><li class="task-list-item"><input type="checkbox">&nbsp;task2</li></ul>');
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

        it('remove unused inputbox when change from task to another', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.get$Body().html('<h1><div><input type="checkbox" />test<br></div></h1>');

            range.selectNode(wwe.getEditor().getDocument().getElementsByTagName('div')[0].firstChild);
            range.collapse(true);
            wwe.getEditor().setSelection(range);

            wwe.unwrapBlockTag();

            expect(wwe.getValue().replace(/<br \/>/g, '')).toBe('test');
        });
    });

    describe('changeBlockFormatTo', function() {
        it('after changeBlockFormatTo remove inputs in wrong place', function() {
            var range = wwe.getEditor().getSelection().cloneRange();


            wwe.get$Body().html('<ul><li class="task-list-item"><input type="checkbox" /> test</li></ul>');

            range.selectNode(wwe.getEditor().getDocument().getElementsByTagName('li')[0].firstChild);
            range.collapse(true);
            wwe.getEditor().setSelection(range);

            wwe.changeBlockFormatTo('P');

            expect(wwe.get$Body().find('h1').length).toEqual(0);
            expect(wwe.get$Body().find('p').length).toEqual(1);
            expect(wwe.get$Body().find('input').length).toEqual(0);
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
