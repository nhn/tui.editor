'use strict';

var WysiwygEditor = require('../src/js/wysiwygEditor'),
    EventManager = require('../src/js/eventManager');

describe('WysiwygEditor', function() {
    var $container, em, cm;

    cm = {
        addCommand: function() {}
    };

    beforeEach(function() {
        $('body').empty();
        $container = $('<div />');
        $('body').append($container);
        em = new EventManager();
    });

    //squire has problem in karma runner
    xit('when something changed in editor Emit contentChanged.wysiwygEditor', function() {
        var wwe = new WysiwygEditor($container, null, em, cm),
            handler = jasmine.createSpy('handler');

        em.listen('contentChanged.wysiwygEditor', handler);

        wwe.editor = window.editor;
        wwe.init(300);
        wwe.editor.bold();

        expect(handler).toHaveBeenCalled();
    });
});
