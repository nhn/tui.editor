'use strict';

var MarkdownEditor = require('../src/js/markdownEditor'),
    EventManager = require('../src/js/eventManager');

describe('MarkdownEditor', function() {
    var mde, em;

    beforeEach(function() {
        var $container;

        $('body').empty();

        $container = $('<div />');

        $('body').append($container);

        em = new EventManager();
        mde = new MarkdownEditor($container, em);
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

        it('when something change emit contentChanged.MarkdownEditor event', function(done) {
            em.listen('contentChanged.markdownEditor', function(editor) {
                expect(editor).toEqual(mde);
                done();
            });

            mde.getEditor().replaceSelection('myText');
        });

        it('when something change emit change.MarkdownEditor event', function(done) {
            var textContent;

            em.listen('change.markdownEditor', function(ev) {
                textContent = ev.textContent;

                expect(textContent).toEqual('my');
                done();
            });

            mde.getEditor().replaceSelection('my');
        });

        it('when something change emit change event', function(done) {
            var textContent, source;

            em.listen('change', function(ev) {
                source = ev.source;
                textContent = ev.textContent;

                expect(textContent).toEqual('m');
                expect(source).toEqual('markdown');

                done();
            });

            mde.getEditor().replaceSelection('m');
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
