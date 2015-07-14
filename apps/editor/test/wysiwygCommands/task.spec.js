'use strict';

var Task = require('../../src/js/wysiwygCommands/task'),
    WysiwygEditor = require('../../src/js/wysiwygEditor'),
    EventManager = require('../../src/js/eventManager');

describe('Task', function() {
    var wwe, sq;

    beforeEach(function(done) {
        var $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, null, new EventManager());

        wwe.init(300, function() {
            sq = wwe.getEditor();
            done();
        });
    });

    afterEach(function() {
        $('body').empty();
    });

    it('add Task', function() {
        Task.exec(wwe);

        expect(sq.getHTML().replace(/<br>/g, '')).toEqual('<ul><li><input type="checkbox"></li></ul><div></div>');
    });

    it('if already in list just add input box', function() {
        sq.setHTML('<ul><li></li></ul>');
        Task.exec(wwe);

        expect(sq.getHTML().replace(/<br>/g, '')).toEqual('<ul><li><input type="checkbox"></li></ul><div></div>');
    });
});
