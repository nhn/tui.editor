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

    //we need to wait squire input event process
    afterEach(function(done) {
        setTimeout(function() {
            $('body').empty();
            done();
        });
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

        it('prevent text, image merge', function() {
            var html = '<p>test<br><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAXklEQVQIHWM8OeXvfwaW/wx/fjMwsHMwMjD9BLH+MDIwMTIy/PnJwMDMI87aIMiswCDMx89w98UNBpZX/48zbLx7h0H/TTjDo18nGZjYWVkZOLm5GU587mb4wvCcAQACuB2BMklKxwAAAABJRU5ErkJggg==" alt="image"></p>';
            wwe.setValue(html);
            expect(wwe.get$Body().find('div').length).toEqual(2);
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
                wwe.getEditor().undo();
                expect(wwe.get$Body().find('h1').length).toEqual(0);
                expect(wwe.get$Body().find('h2').length).toEqual(1);
                done();
            });
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

            wwe.replaceContentText(wwe.get$Body().find('li')[0], 'list1', 'list2');

            expect(wwe.getValue().replace(/<br \/>/g, '')).toBe('<ul><li class="custom-class">list2</li><li>list2</li></ul>');
        });
    });

    describe('focus()', function() {
        it('focus to ww editor', function() {
            wwe.getEditor().focus = jasmine.createSpy('focus');
            wwe.focus();
            expect(wwe.getEditor().focus).toHaveBeenCalled();
        });
    });
});
