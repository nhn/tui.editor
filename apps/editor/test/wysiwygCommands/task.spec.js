'use strict';

var Task = require('../../src/js/wysiwygCommands/task');

var Squire = window.Squire;

describe('Task', function() {
    var editor;

    beforeEach(function(done) {
        var $iframe = $('<iframe />');

        editor = null;

        $iframe.load(function() {
            var doc = $iframe[0].contentDocument;

            if (editor) {
                return;
            }

            editor = new Squire(doc, {
                blockTag: 'DIV'
            });

            done();
        });

        $('body').append($iframe);
    });

    afterEach(function() {
        $('body').empty();
    });

    it('add Task', function() {
        Task.responder(editor);

        expect(editor.getHTML().replace(/<br>/g,'')).toEqual('<ul><li><input type="checkbox"></li></ul><div></div>');
    });

    it('if already in list just add input box', function() {
        editor.setHTML('<ul><li></li></ul>');
        Task.responder(editor);

        expect(editor.getHTML().replace(/<br>/g,'')).toEqual('<ul><li><input type="checkbox"></li></ul><div></div>');
    });
});
