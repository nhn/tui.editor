'use strict';

var WysiwygEditor = require('../src/js/wysiwygEditor'),
    EventManager = require('../src/js/eventManager');

describe('WysiwygEditor', function() {
    var $container, em, wwe;

    beforeEach(function() {
        $container = $('<div />');

        $('body').append($container);

        em = new EventManager();

        wwe = new WysiwygEditor($container, em);

        wwe.init();
    });

    //we need to wait squire input event process
    afterEach(function(done) {
        setTimeout(function() {
            $('body').empty();
            done();
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
            em.emit('wysiwygKeyEvent', {
                keyMap: 'HOME',
                data: {keyCode:0}
            });
            expect(handler).toHaveBeenCalled();
        });

        it('add key event with particular keymap and run', function() {
            var handler = jasmine.createSpy('keyEventHandler');
            wwe.addKeyEventHandler('HOME', handler);
            em.emit('wysiwygKeyEvent', {
                keyMap: 'HOME',
                data: {keyCode:0}
            });
            expect(handler).toHaveBeenCalled();
        });

        it('run particular keymap and default', function() {
            var handler = jasmine.createSpy('keyEventHandler');
            wwe.addKeyEventHandler('HOME', handler);
            wwe.addKeyEventHandler(handler);
            em.emit('wysiwygKeyEvent', {
                keyMap: 'HOME',
                data: {keyCode:0}
            });
            expect(handler.calls.count()).toEqual(2);
        });

        it('if handler returns false stop invoke next handler', function() {
            var handler = jasmine.createSpy('keyEventHandler');
            wwe.addKeyEventHandler('HOME', function() {
                return false;
            });
            wwe.addKeyEventHandler('HOME', handler);
            em.emit('wysiwygKeyEvent', {
                keyMap: 'HOME',
                data: {keyCode:0}
            });
            expect(handler).not.toHaveBeenCalled();
        });

        it('if defalut handler returns false dont invoke keymap handler', function() {
            var handler = jasmine.createSpy('keyEventHandler');
            wwe.addKeyEventHandler(function() {
                return false;
            });

            wwe.addKeyEventHandler('HOME', handler);

            em.emit('wysiwygKeyEvent', {
                keyMap: 'HOME',
                data: {keyCode:0}
            });
            expect(handler).not.toHaveBeenCalled();
        });
    });

    describe('Event', function() {
        beforeEach(function(done) {
            //스콰이어가 셋팅된 프레임에 입력된 데이터들에 대한 이벤트는 발생하지 않아 프레임지연
            setTimeout(function() {
                done();
            }, 0);
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
                }, 1000);
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

        it('fire stateChange event when state changed', function(done) {
            em.listen('stateChange', function(data) {
                //첫번째 insertPlaintText로 인한 이벤트는 무시
                if (data.bold) {
                    expect(data.bold).toBe(true);
                    done();
                }
            });

            wwe.editor.insertPlainText('test');
            wwe.editor.bold();
        });
    });

    describe('getValue, setValue', function() {
        it('remove all unnecessary brs', function() {
            var html = '<h1>1</h1><h1>2</h1>';
            wwe.setValue(html);
            expect(wwe.getValue()).toEqual('<h1>1</h1><h1>2</h1><br />');
        });

        it('dont remove necessary brs', function() {
            var html = '<h1>1</h1><div><br></div><h1>2</h1>';
            wwe.setValue(html);
            expect(wwe.getValue()).toEqual('<h1>1</h1><br /><h1>2</h1><br />');
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
            expect(wwe.getValue()).toEqual(html + '<br />');
        });

        it('prevent text, image merge', function() {
            /* eslint-disable */
            var html = '<p>test<br><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAXklEQVQIHWM8OeXvfwaW/wx/fjMwsHMwMjD9BLH+MDIwMTIy/PnJwMDMI87aIMiswCDMx89w98UNBpZX/48zbLx7h0H/TTjDo18nGZjYWVkZOLm5GU587mb4wvCcAQACuB2BMklKxwAAAABJRU5ErkJggg==" alt="image"></p>';
            /* eslint-enable */
            wwe.setValue(html);
            expect(wwe.get$Body().find('div').length).toEqual(3);
            expect(wwe.get$Body().find('div').eq(0).text()).toEqual('test');
            expect(wwe.get$Body().find('div').eq(1).find('img').length).toEqual(1);
        });

        it('wrap list inner to div after setValue', function() {
            var html = '<ul><li>test</li></ul>';
            wwe.setValue(html);

            expect(wwe.get$Body().find('li div').length).toEqual(1);
            expect(wwe.get$Body().find('li div').text()).toEqual('test');
        });

        it('record undo state after all setValue process not setHTML', function(done) {
            var html = '<ul><li>test</li></ul>';

            em.listen('wysiwygSetValueAfter', function() {
                wwe.get$Body().html('<h2>test<br></h2>');
            });

            wwe.setValue(html);

            setTimeout(function() {
                wwe.getEditor().insertHTML('<h1>test</h1>');
                setTimeout(function() {
                    wwe.getEditor().undo();
                    expect(wwe.get$Body().find('h1').length).toEqual(0);
                    expect(wwe.get$Body().find('h2').length).toEqual(1);
                    done();
                }, 0);
            }, 0);
        });

        it('move cursor to end after setValue() cuz we need new range after whole conntent changed', function() {
            var range;
            wwe.setValue('<ul><li>test</li></ul><div>test2<br></div>');
            range = wwe.getEditor().getSelection();

            expect(range.startContainer).toBe(wwe.get$Body().find('div')[1]);
            expect(range.startOffset).toEqual(1);
        });
    });

    it('get$Body() get current wysiwyg iframe body that wrapped jquery', function() {
        expect(wwe.get$Body().length).toEqual(1);
        expect(wwe.get$Body().prop('tagName')).toEqual('DIV');
        expect(wwe.get$Body().hasClass('tui-editor-contents')).toBe(true);
    });

    it('hasFormatWithRx() check hasFormat with RegExp', function() {
        wwe.setValue('<h1>hasHeading</h1>');
        expect(wwe.hasFormatWithRx(/h[\d]/i)[0]).toEqual('H1');
    });

    describe('_wrapDefaultBlockTo', function() {
        it('wrap selection defulat block', function(done) {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.get$Body().html('abcdef');

            range.setStart(wwe.get$Body()[0].firstChild, 4);
            range.collapse(true);
            wwe._wrapDefaultBlockTo(range);

            expect(wwe.getEditor().getHTML().replace(/<br \/>|<br>/g, '')).toEqual('<div>abcdef</div>');
            done();
        });
    });

    describe('breakToNewDefaultBlock()', function() {
        it('make new defulatBlock then move selection to it', function() {
            var range;

            wwe.get$Body().html('<div>aef<br></div>');

            range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body()[0], 0);
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

            range.selectNode(wwe.get$Body().find('div')[0].firstChild);
            range.collapse(true);
            wwe.getEditor().setSelection(range);
            wwe.unwrapBlockTag('H1');

            expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('test');
        });

        it('unwrap tag of current selection with condition callback', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.get$Body().html('<h1><div>test<br></div></h1>');

            range.selectNode(wwe.get$Body().find('div')[0].firstChild);
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

            wwe.replaceContentText(wwe.get$Body().find('li')[0], 'list1', 'list2');

            expect(wwe.getValue().replace(/<br \/>/g, ''))
                .toBe('<ul><li class="custom-class">list2</li><li>list2</li></ul>');
        });
    });

    describe('focus()', function() {
        it('focus to ww editor', function() {
            wwe.getEditor().focus = jasmine.createSpy('focus');
            wwe.focus();
            expect(wwe.getEditor().focus).toHaveBeenCalled();
        });
    });

    describe('manager handling', function() {
        it('add and get manager', function() {
            var manager = jasmine.createSpy('manager');
            wwe.addManager('myManager', manager);

            expect(manager).toHaveBeenCalledWith(wwe);
            expect(wwe.getManager('myManager')).toBeDefined();
        });

        it('add manager with manager default', function() {
            var manager = function() {
                return {name: 'myManager'};
            };

            wwe.addManager(manager);

            expect(wwe.getManager('myManager')).toBeDefined();
        });
    });

    describe('move cursor to start, end', function() {
        beforeEach(function() {
            wwe.setHeight(30);
        });
        it('move cursor to end and scroll to end', function() {
            wwe.setValue('a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>');
            wwe.moveCursorToEnd();
            expect(wwe.getEditor().scrollTop()).not.toEqual(0);
        });
        it('move cursor to start and scroll to top', function() {
            wwe.setValue('a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>');
            wwe.moveCursorToEnd();
            wwe.moveCursorToStart();
            expect(wwe.getEditor().scrollTop()).toEqual(0);
        });
    });
});
