'use strict';

var WysiwygEditor = require('../src/js/wysiwygEditor'),
    EventManager = require('../src/js/eventManager');

describe('WysiwygEditor', function() {
    var $container, em;

    beforeEach(function() {
        $('body').empty();

        $container = $('<div />');

        $('body').append($container);

        em = new EventManager();
    });

    describe('Initialize', function() {
        var wwe;

        beforeEach(function() {
            wwe = new WysiwygEditor($container, null, em);
        });

        it('init() invoke callback', function(done) {
            wwe.init(function() {
                expect($('iframe').length).toEqual(1);
                expect($('iframe').contents().find('body').hasClass('neonEditor-content')).toBe(true);
                done();
            });
        });
    });

    describe('_isIframeReady()', function() {
        var wwe;

        beforeEach(function(done) {
            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                done();
            });
        });

        it('isPrepared() check iframe has prepared or need re init with squire', function() {
            expect(wwe._isIframeReady()).toBe(true);
        });

        it('when editor detached from dom for any reason isPrepared return false', function() {
            $container.detach();
            expect(wwe._isIframeReady()).toBe(false);
        });
    });

    describe('reset()', function() {
        var wwe;

        beforeEach(function(done) {
            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                done();
            });
        });

        it('set content blank', function() {
            wwe.setValue('<h1>HELLO WORLD</h1>');
            wwe.reset();
            expect(wwe.getValue()).toEqual('<br />');
        });

        it('Init Squire again if need', function() {
            wwe.setValue('<h1>HELLO WORLD</h1>');
            $container.detach();
            $container.appendTo('body');
            expect(wwe._isIframeReady()).toBe(false);

            wwe.reset();
            expect(wwe._isIframeReady()).toBe(true);
        });
    });

    describe('Event', function() {
        var wwe;

        beforeEach(function(done) {
            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                done();
            });
        });

        it('when something changed in editor Emit contentChanged.wysiwygEditor event', function(done) {
            em.listen('contentChanged.wysiwygEditor', function(editor) {
                expect(editor).toBe(wwe);
                done();
            });

            //because squire input event
            wwe.editor._ignoreChange = false;
            wwe.editor.insertHTML('<p>test</p>');
        });

        it('when something changed in editor Emit change.wysiwygEditor event', function(done) {
            //events of squire are asynchronous
            em.listen('change.wysiwygEditor', function(ev) {
                expect(ev.textContent).toEqual('t');
                //cuz, we cant simulate caret change
                //expect(ev.caretOffset).toEqual(1);
                done();
            });

            //because squire input event
            wwe.editor._ignoreChange = false;
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

            //because squire input event
            wwe.editor._ignoreChange = false;
            wwe.editor.insertHTML('t');
        });
    });

    describe('getValue, setValue', function() {
        var wwe;

        beforeEach(function(done) {
            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                done();
            });
        });

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

        it('setValue make single line p tag have div block tag', function() {
            wwe.setValue('<p>text1</p>');
            expect(wwe.get$Body().find('div').length).toEqual(1);
            expect(wwe.get$Body().find('div')[0].textContent).toEqual('text1');
        });

        it('put space and ZWS into input tag next', function() {
            wwe.setValue('<ul><li class="task-list-item"><input type="checkbox">TASK<li></li></ul>');
            expect(wwe.get$Body().find('li')[0].textContent).toEqual(' TASK');
        });

        it('remove task-list class of element, it may block merge normal list and task list', function() {
            wwe.setValue('<ul><li class="task-list-item"><input type="checkbox">TASK<li></li></ul>');
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

    it('get current wysiwyg iframe body that wrapped jquery', function(done) {
        var wwe;

        wwe = new WysiwygEditor($container, null, em);
        wwe.init(function() {
            expect(wwe.get$Body().length).toEqual(1);
            expect(wwe.get$Body().prop('tagName')).toEqual('BODY');
            done();
        });
    });

    it('hasFormat with RegExp', function(done) {
        var wwe;

        wwe = new WysiwygEditor($container, null, em);

        wwe.init(function() {
            wwe.setValue('<h1>hasHeading</h1>');
            expect(wwe.hasFormatWithRx(/h[\d]/i)[0]).toEqual('H1');
            done();
        });
    });

    describe('_unformatTaskIfNeedOnBackspace()', function() {
        it('remove input if current selection is right of input with one space', function(done) {
            var wwe;

            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                var range = wwe.getEditor().getSelection().cloneRange();

                wwe.getEditor().setHTML('<ul><li><input type="checkbox" />&nbsp;text</li></ul>');

                range.setStart(wwe.getEditor().getDocument().getElementsByTagName('INPUT')[0].nextSibling, 1);
                range.collapse(true);
                wwe._unformatTaskIfNeedOnBackspace(range);

                expect(wwe.getValue()).toEqual('<ul><li>text</li></ul>');
                done();
            });
        });

        it('remove input if current selection is right of input with one space wrapped inline tag', function(done) {
            var wwe;

            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                var range = wwe.getEditor().getSelection().cloneRange();

                wwe.get$Body().html('<ul><li class="task-list-item"><input type="checkbox"><b>&nbsp;text</b></li></ul>');

                range.setStart(wwe.getEditor().getDocument().getElementsByTagName('B')[0].firstChild, 1);
                range.collapse(true);
                wwe._unformatTaskIfNeedOnBackspace(range);

                //replace하는것은 ie때문
                expect(wwe.getValue().replace(' class=""', '')).toEqual('<ul><li><b>text</b></li></ul>');
                done();
            });
        });

        it('remove input if current selection has placed at start of task item', function(done) {
            var wwe;

            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                var range = wwe.getEditor().getSelection().cloneRange();

                wwe.get$Body().html('<ul><li class="task-list-item"><input type="checkbox" />&nbsp;text</li></ul>');

                range.selectNode(wwe.getEditor().getDocument().getElementsByTagName('INPUT')[0]);
                range.collapse(true);
                wwe._unformatTaskIfNeedOnBackspace(range);

                expect(wwe.getValue().replace(' class=""', '')).toEqual('<ul><li>&nbsp;text</li></ul>');
                done();
            });
        });

        it('dont remove necessary input', function(done) {
            var wwe;

            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                var range = wwe.getEditor().getSelection().cloneRange();

                wwe.setValue('<ul><li class="task-list-item"><input type="checkbox"> text<b>a</b></li></ul>');

                range.selectNodeContents(wwe.getEditor().getDocument().getElementsByTagName('B')[0]);
                range.collapse(true);
                wwe._unformatTaskIfNeedOnBackspace(range);

                expect(wwe.getValue()).toEqual('<ul><li class="task-list-item"><input type="checkbox">text<b>a</b></li></ul>');
                done();
            });
        });
    });

    describe('_unformatTaskIfNeedOnEnter()', function() {
        it('remove input if current selection is right of input with one space', function(done) {
            var wwe;

            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                var range = wwe.getEditor().getSelection().cloneRange();

                wwe.setValue('<ul><li class="task-list-item"><input type="checkbox" />&nbsp;</li></ul>');

                range.selectNode(wwe.getEditor().getDocument().getElementsByTagName('INPUT')[0]);
                range.collapse(true);
                wwe._unformatTaskIfNeedOnEnter(range);

                expect(wwe.getValue().replace(' class=""', '')).toEqual('<ul><li></li></ul>');
                done();
            });
        });
    });

    describe('_removeHrIfNeed()', function() {
        //같은 부모의 이전 offset의 엘리먼트가 hr일때
        it('remove hr if current is on first offset and previousSibling elemet is hr', function(done) {
            var wwe;

            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                var range = wwe.getEditor().getSelection().cloneRange();

                wwe.setValue('<hr><div>abcd<br></div>');

                range.setStart(wwe.getEditor().getDocument().body, 1);
                range.collapse(true);
                wwe._removeHrIfNeed(range, {preventDefault: function() {}});

                expect(wwe.get$Body().find('hr').length).toEqual(0);
                done();
            });
        });

        //현재커서가 hr을 가르키는 경우
        it('remove hr current selection is hr', function(done) {
            var wwe;

            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                var range = wwe.getEditor().getSelection().cloneRange();

                wwe.setValue('<hr><div>abcd<br></div>');

                range.setStart(wwe.getEditor().getDocument().body, 0);
                range.collapse(true);
                wwe._removeHrIfNeed(range, {preventDefault: function() {}});

                expect(wwe.get$Body().find('hr').length).toEqual(0);
                done();
            });
        });

        //현재 같은 부모에서는 이전 엘리먼트가 더이상 없고 부모래밸의 이전 앨리먼트가 hr일경우
        it('remove hr current selections parentNode previousSibling is hr when offset 0', function(done) {
            var wwe;

            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                var range = wwe.getEditor().getSelection().cloneRange();

                wwe.setValue('<hr><div><b>abcd</b><<br></div>');

                range.setStart(wwe.get$Body().find('b')[0], 0);
                range.collapse(true);
                wwe._removeHrIfNeed(range, {preventDefault: function() {}});

                expect(wwe.get$Body().find('hr').length).toEqual(0);
                done();
            });
        });
    });

    describe('_wrapDefaultBlockTo', function() {
        it('wrap selection defulat block', function(done) {
            var wwe;

            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                var range = wwe.getEditor().getSelection().cloneRange();

                $(wwe.getEditor().getDocument().body).html('abcdef');

                range.setStart(wwe.getEditor().getDocument().body.firstChild, 4);
                range.collapse(true);
                wwe._wrapDefaultBlockTo(range);

                expect(wwe.getEditor().getHTML().replace(/<br \/>|<br>/g, '')).toEqual('<div>abcdef</div>');
                done();
            });
        });
    });

    describe('_wrapDefaultBlockToOrphanTexts', function() {
        it('wrap selection defulat block to all orphan texts', function(done) {
            var wwe;

            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                var range = wwe.getEditor().getSelection().cloneRange();

                $(wwe.getEditor().getDocument().body).html('abcdef<div>ghijk<br></div>');

                range.setStart(wwe.getEditor().getDocument().body.firstChild, 4);
                range.collapse(true);
                wwe._wrapDefaultBlockToOrphanTexts();

                expect(wwe.getEditor().getHTML().replace(/<br \/>|<br>/g, '')).toEqual('<div>abcdef</div><div>ghijk</div>');
                done();
            });
        });
    });

    describe('_removeTaskInputInWrongPlace', function() {
        it('remove inputbox in wrong parent', function(done) {
            var wwe;

            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                var range = wwe.getEditor().getSelection().cloneRange();

                wwe.setValue('<ul><li><input type="checkbox" /></li></ul>');

                wwe._removeTaskInputInWrongPlace();

                expect(wwe.getValue()).toEqual('<ul><li></li></ul>');
                done();
            });
        });

        it('remove inputbox in wrong place', function(done) {
            var wwe;

            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                var range = wwe.getEditor().getSelection().cloneRange();

                wwe.setValue('<ul><li class="task-list-item"><input type="checkbox"> text<input type="checkbox"></li></ul>');

                wwe._removeTaskInputInWrongPlace();

                expect(wwe.getValue()).toEqual('<ul><li class="task-list-item"><input type="checkbox">text</li></ul>');
                done();
            });
        });
    });

    describe('breakToNewDefaultBlock()', function() {
        it('make new defulatBlock then move selection to it', function(done) {
            var wwe;

            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                var range;

                wwe.setValue('<div>aef<br></div>');

                range = wwe.getEditor().getSelection().cloneRange();

                range.setStart(wwe.getEditor().getDocument().body, 0);
                range.collapse(true);
                wwe.breakToNewDefaultBlock(range);

                expect(wwe.getEditor().getHTML()).toEqual('<div>aef<br></div><div><br></div>');
                expect(wwe.getEditor().getSelection().startContainer.textContent).toEqual('');
                expect(wwe.getEditor().getSelection().startContainer.tagName).toEqual('DIV');
                done();
            });
        });

        it('make new defulatBlock to body child then move selection to it', function(done) {
            var wwe;

            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                var range;

                wwe.setValue('<h1><div>aef<br></div></h1>');

                range = wwe.getEditor().getSelection().cloneRange();

                //select text node
                range.setStart(wwe.get$Body().find('div')[0], 0);
                range.collapse(true);
                wwe.breakToNewDefaultBlock(range);

                expect(wwe.getEditor().getHTML()).toEqual('<h1><div>aef<br></div></h1><div><br></div>');
                expect(wwe.getEditor().getSelection().startContainer.textContent).toEqual('');
                expect(wwe.getEditor().getSelection().startContainer.tagName).toEqual('DIV');
                done();
            });
        });
    });

    describe('getTextOffsetToBlock()', function() {
        it('return offset of el that count form root block parent #1', function(done) {
            var wwe;

            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                var offset;
                wwe.setValue('<ul><li class="task-list-item"><div><input type="checkbox"><b>text</b></div></li></ul>');
                offset = wwe.getTextOffsetToBlock(wwe.getEditor().getDocument().getElementsByTagName('b')[0]);
                expect(offset).toEqual(0);
                done();
            });
        });

        it('return offset of el that count form root block parent #2', function(done) {
            var wwe;

            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                var offset;
                wwe.setValue('<ul><li class="task-list-item"><div>abc<input type="checkbox"><b>text</b></div></li></ul>');
                offset = wwe.getTextOffsetToBlock(wwe.getEditor().getDocument().getElementsByTagName('b')[0]);
                expect(offset).toEqual(4);
                done();
            });
        });
    });

    describe('unwrapBlockTag()', function() {
        it('unwrap tag of current selection with tag name', function(done) {
            var wwe;

            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                var range = wwe.getEditor().getSelection().cloneRange();

                wwe.setValue('<h1><div>test<br></div></h1>');

                range.selectNode(wwe.getEditor().getDocument().getElementsByTagName('div')[0].firstChild);
                range.collapse(true);
                wwe.getEditor().setSelection(range);
                wwe.unwrapBlockTag('H1');

                expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('test');
                done();
            });
        });

        it('unwrap tag of current selection with condition callback', function(done) {
            var wwe;

            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                var range = wwe.getEditor().getSelection().cloneRange();

                wwe.setValue('<h1><div>test<br></div></h1>');

                range.selectNode(wwe.getEditor().getDocument().getElementsByTagName('div')[0].firstChild);
                range.collapse(true);
                wwe.getEditor().setSelection(range);

                wwe.unwrapBlockTag(function(tagName) {
                    return tagName === 'H1';
                });

                expect(wwe.getValue().replace(/<br \/>/g, '')).toBe('test');
                done();
            });
        });

        it('remove unused inputbox when change from task to another', function(done) {
            var wwe;

            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                var range = wwe.getEditor().getSelection().cloneRange();

                wwe.setValue('<h1><div><input type="checkbox" />test<br></div></h1>');

                range.selectNode(wwe.getEditor().getDocument().getElementsByTagName('div')[0].firstChild);
                range.collapse(true);
                wwe.getEditor().setSelection(range);

                wwe.unwrapBlockTag();

                expect(wwe.getValue().replace(/<br \/>/g, '')).toBe('test');
                done();
            });
        });
    });

    describe('changeBlockFormat', function() {
        it('change block format', function(done) {
            var wwe;

            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                var range = wwe.getEditor().getSelection().cloneRange();

                wwe.setValue('<h1><div>test<br></div></h1>');

                range.selectNode(wwe.getEditor().getDocument().getElementsByTagName('div')[0].firstChild);
                range.collapse(true);
                wwe.getEditor().setSelection(range);

                wwe.changeBlockFormat('H1', 'P');

                expect(wwe.getValue().replace(/<br \/>/g, '')).toBe('<p>test</p>');
                done();
            });
        });

        it('unwrap block format', function(done) {
            var wwe;

            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                var range = wwe.getEditor().getSelection().cloneRange();

                wwe.setValue('<h1><div>test<br></div></h1>');

                range.selectNode(wwe.getEditor().getDocument().getElementsByTagName('div')[0].firstChild);
                range.collapse(true);
                wwe.getEditor().setSelection(range);

                wwe.changeBlockFormat('H1');

                expect(wwe.getValue().replace(/<br \/>/g, '')).toBe('test');
                done();
            });
        });

        it('unwrap block format list', function(done) {
            var wwe;

            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                var range = wwe.getEditor().getSelection().cloneRange();

                wwe.setValue('<ul><li><div>test<br></div></li></ul>');

                range.selectNode(wwe.getEditor().getDocument().getElementsByTagName('div')[0].firstChild);
                range.collapse(true);
                wwe.getEditor().setSelection(range);

                wwe.changeBlockFormat('UL', 'OL');

                expect(wwe.getValue().replace(/<br \/>/g, '')).toBe('<ol><li>test</li></ol>');
                done();
            });
        });

        it('if not mached any condition, wrap targetTagName node to first div node', function(done) {
            var wwe;

            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                var range = wwe.getEditor().getSelection().cloneRange();

                wwe.setValue('<div>test<br></div>');

                range.selectNode(wwe.getEditor().getDocument().getElementsByTagName('div')[0].firstChild);
                range.collapse(true);
                wwe.getEditor().setSelection(range);

                wwe.changeBlockFormat('UL', 'P');

                expect(wwe.getValue().replace(/<br \/>/g, '')).toBe('<p>test</p>');
                done();
            });
        });
    });

    describe('changeBlockFormatTo', function() {
        it('change any block for to passed tagName', function(done) {
            var wwe;

            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                var range = wwe.getEditor().getSelection().cloneRange();

                wwe.setValue('<h1><div>test<br></div></h1>');

                range.selectNode(wwe.getEditor().getDocument().getElementsByTagName('div')[0].firstChild);
                range.collapse(true);
                wwe.getEditor().setSelection(range);

                wwe.changeBlockFormatTo('P');

                expect(wwe.getValue().replace(/<br \/>/g, '')).toBe('<p>test</p>');
                done();
            });
        });

        it('remove unused inputbox when change from task to another', function(done) {
            var wwe;

            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                var range = wwe.getEditor().getSelection().cloneRange();

                wwe.setValue('<ul><li><div><input type="checkbox" />test<br></div></li></ul>');

                range.selectNode(wwe.getEditor().getDocument().getElementsByTagName('div')[0].firstChild);
                range.collapse(true);
                wwe.getEditor().setSelection(range);

                wwe.changeBlockFormatTo('H1');

                expect(wwe.getValue().replace(/<br \/>/g, '')).toBe('<h1>test</h1>');
                done();
            });
        });
    });

    describe('replace node\'s content text', function() {
        it('replace text without affect tags', function(done) {
            var wwe;

            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                var range = wwe.getEditor().getSelection().cloneRange();

                wwe.setValue('<ul><li class="custom-class">list1</li><li>list2</li></ul>');

                wwe.replaceContentText(wwe.getEditor().getDocument().body, 'list1', 'list2');

                expect(wwe.getValue().replace(/<br \/>/g, '')).toBe('<ul><li class="custom-class">list2</li><li>list2</li></ul>');
                done();
            });
        });
    });

    describe('editing functions', function() {
        var wwe;

        beforeEach(function(done) {
            wwe = new WysiwygEditor($container, null, em);
            wwe.init(function() {
                done();
            });
        });

        it('focus to ww editor', function() {
            $('body').focus();
            expect(document.activeElement).not.toBe(wwe.$iframe[0]);
            wwe.focus();
            expect(document.activeElement).toBe(wwe.$iframe[0]);
        });

        it('when get html data, remove contenteditable block tag which is div', function() {
            wwe.setValue('<ul><li>list</li></ul>');

            //in ie, squire dont make br so we clean up necessary
            expect(wwe.getValue().replace(/<br>/g, '')).toEqual('<ul><li>list</li></ul>');
        });

        it('replace selection content with passed content', function() {
            var selection;

            selection = wwe.getEditor().getSelection();
            wwe.replaceSelection('test', selection);
            expect(wwe.getValue()).toEqual('test<br />');
        });

        it('if replace selection without selection, use current selection', function() {
            wwe.replaceSelection('test');
            expect(wwe.getValue()).toEqual('test<br />');
        });

        it('replace with current cursor\'s containers offset', function() {
            var selection;

            wwe.getEditor().setHTML('test');

            //selection for user cursor mocking
            selection = wwe.getEditor().getSelection();
            selection.setStart(selection.startContainer, 4);
            selection.collapse(true);
            wwe.getEditor().setSelection(selection);

            wwe.replaceRelativeOffset('123', -2, 1);

            expect(wwe.getValue()).toEqual('te123t<br />');
        });

        describe('getSelectionInfoByOffset() find element and offset by passing element and offset', function() {
            var firstBlock;

            beforeEach(function() {
                wwe.getEditor().insertPlainText('text1');
                wwe.getEditor().insertPlainText('text2');

                firstBlock = wwe.getEditor().getDocument().body.childNodes[0];
            });

            it('offset is lower than passed element\'s length', function() {
                expect(wwe.getSelectionInfoByOffset(firstBlock.childNodes[0], 3)).toEqual({
                    element: firstBlock.childNodes[0],
                    offset: 3
                });
            });

            it('offset is higher than passed element\'s length', function() {
                expect(wwe.getSelectionInfoByOffset(firstBlock.childNodes[0], 7)).toEqual({
                    element: firstBlock.childNodes[1],
                    offset: 2
                });
            });

            it('offset is higher than exist content length', function() {
                expect(wwe.getSelectionInfoByOffset(firstBlock.childNodes[0], 11)).toEqual({
                    element: firstBlock.childNodes[1],
                    offset: 5
                });
            });
        });
    });
});
