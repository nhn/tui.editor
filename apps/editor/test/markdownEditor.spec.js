'use strict';

var MarkdownEditor = require('../src/js/markdownEditor'),
    EventManager = require('../src/js/eventManager');

describe('MarkdownEditor', function() {
    var mde, em;

    beforeEach(function() {
        var $container;

        $container = $('<div />');

        $('body').append($container);

        em = new EventManager();
        mde = new MarkdownEditor($container, em);
    });

    afterEach(function() {
        $('body').empty();
    });

    describe('Initialize', function() {
       it('make codemirror context', function() {
           mde.init();
           expect($('.CodeMirror').length).toEqual(1);
       });
    });

    describe('Events', function() {
        beforeEach(function() {
            mde.init();
        });

        it('when something change emit contentChangedFromMarkdown event', function(done) {
            em.listen('contentChangedFromMarkdown', function(editor) {
                expect(editor).toEqual(mde);
                done();
            });

            mde.getEditor().replaceSelection('myText');
        });

        it('when something change emit changeFromMarkdown event', function(done) {
            em.listen('changeFromMarkdown', function(ev) {
                expect(ev.textContent).toEqual('my');
                done();
            });

            mde.getEditor().replaceSelection('my');
        });

        it('when something change emit change event', function(done) {
            em.listen('change', function(ev) {
                expect(ev.textContent).toEqual('comment');
                expect(ev.caretOffset).toEqual(7);
                expect(ev.source).toEqual('markdown');

                done();
            });

            mde.getEditor().replaceSelection('comment');
        });

        it('when editor gain focus, emit focus event', function() {
            em.listen('focus', function(ev) {
                expect(ev.source).toEqual('markdown');
            });

            mde.getEditor().focus();
        });

        it('when editor lost focus, emit blur event', function() {
            em.listen('blur', function(ev) {
                expect(ev.source).toEqual('markdown');
            });

            mde.getEditor().getWrapperElement().blur();
        });
    });

    describe('replaceSelection', function() {
        beforeEach(function() {
            mde.init();
        });

        it('replace selection content with passed content', function() {
            var selection = {
                from: {line: 0, ch: 0},
                to: {line: 0, ch: 0}
            };

            mde.replaceSelection('test', selection);

            expect(mde.getValue()).toEqual('test');
        });

        it('if replace selection without selection, use current selection', function() {
            mde.replaceSelection('test');
            expect(mde.getValue()).toEqual('test');
        });

        it('replace with current cursor\'s containers offset', function() {
            mde.replaceSelection('t');
            mde.replaceSelection('e');
            mde.replaceSelection('s');
            mde.replaceSelection('t');

            mde.replaceRelativeOffset('123', -2, 1);
            expect(mde.getValue()).toEqual('te123t');
        });
    });
});
