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

        it('when something changed in editor Emit contentChanged.wysiwygEditor', function(done) {
            em.listen('contentChanged.wysiwygEditor', function() {
                done();
            });

            //because squire input event
            wwe.editor._ignoreChange = false;
            wwe.editor.insertHTML('<p>test</p>');
        });

        it('when something changed in editor Emit change.wysiwygEditor', function(done) {
            em.listen('change.wysiwygEditor', function(eObj) {
                expect(eObj.selection.startOffset).toEqual(1);
                expect(eObj.selection.endOffset).toEqual(1);
                done();
            });

            //because squire input event
            wwe.editor._ignoreChange = false;
            wwe.editor.insertHTML('test');
        });
    });

    describe('editor functions', function() {
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
            expect(wwe.getValue()).toEqual('<ul><li>list<br></li></ul>');
        });
    });
});
