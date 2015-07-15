'use strict';

var MarkdownEditor = require('../src/js/markdownEditor'),
    EventManager = require('../src/js/eventManager');

describe('MarkdownEditor', function() {
    var mde, em;

    beforeEach(function() {
        var $container = $('<div />');

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

        it('when something change emit contentChanged.MarkdownEditor event', function() {
            em.listen('contentChanged.markdownEditor', function(data) {
                expect(data).toEqual('myText');
            });

            mde.getEditor().replaceSelection('myText');
        });

        it('when something change emit change.MarkdownEditor event', function() {
            var textContent, caretOffset;

            em.listen('change.markdownEditor', function(ev) {
                textContent = ev.textContent;
                caretOffset = ev.caretOffset;
            });

            mde.getEditor().replaceSelection('m');
            mde.getEditor().replaceSelection('y');
            expect(textContent).toEqual('my');
            expect(caretOffset).toEqual(1);
        });

        it('when something change emit change event', function() {
            var textContent, caretOffset, source;

            em.listen('change', function(ev) {
                source = ev.source;
                textContent = ev.textContent;
                caretOffset = ev.caretOffset;
            });

            mde.getEditor().replaceSelection('m');
            mde.getEditor().replaceSelection('y');
            expect(textContent).toEqual('my');
            expect(caretOffset).toEqual(1);
            expect(source).toEqual('markdown');
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
    });
});
