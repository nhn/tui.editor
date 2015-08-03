'use strict';

var WysiwygEditor = require('../src/js/wysiwygEditor'),
    EventManager = require('../src/js/eventManager');

describe('WysiwygEditor', function() {
    var $container, em;

    beforeEach(function() {
        $container = $('<div />');

        $('body').append($container);

        em = new EventManager();
    });

    afterEach(function() {
        $('body').empty();
    });

    describe('Initialize', function() {
        var wwe;

        beforeEach(function() {
            wwe = new WysiwygEditor($container, null, em);
        });

        it('init() invoke callback', function (done) {
            wwe.init(300, function() {
                expect($('iframe').length).toEqual(1);
                expect($('iframe').contents().find('html').hasClass('neonEditor-content')).toBe(true);
                done();
            });
        });
    });

    describe('Event', function() {
        var wwe;

        beforeEach(function(done) {
            wwe = new WysiwygEditor($container, null, em);
            wwe.init(300, function() {
                done();
            });
        });

        it('when something changed in editor Emit contentChanged.wysiwygEditor event', function(done) {
            em.listen('contentChanged.wysiwygEditor', function(data) {
                expect(data.replace(/<br>/g, '')).toEqual('<p>test</p>');
                done();
            });

            //because squire input event
            wwe.editor._ignoreChange = false;
            wwe.editor.insertHTML('<p>test</p>');
        });

        it('when something changed in editor Emit change.wysiwygEditor event', function(done) {
            //squire event fire asynchronous
            em.listen('change.wysiwygEditor', function(ev) {
                expect(ev.textContent).toEqual('t');

                expect(ev.caretOffset).toEqual(1);
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
                expect(ev.caretOffset).toEqual(1);
                done();
            });

            //because squire input event
            wwe.editor._ignoreChange = false;
            wwe.editor.insertHTML('t');
        });
    });

    describe('getValue', function() {
        var wwe;

        beforeEach(function(done) {
            wwe = new WysiwygEditor($container, null, em);
            wwe.init(300, function() {
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
    });

    describe('editing functions', function() {
        var wwe;

        beforeEach(function(done) {
            wwe = new WysiwygEditor($container, null, em);
            wwe.init(300, function() {
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
            expect(wwe.getValue().replace(/<br>/g, '')).toEqual('test');
        });

        it('if replace selection without selection, use current selection', function() {
            wwe.replaceSelection('test');
            expect(wwe.getValue().replace(/<br>/, '')).toEqual('test');
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

            expect(wwe.getValue().replace(/<br>/, '')).toEqual('te123t');
        });

        describe('find element and offset by passing element and offset', function() {
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
