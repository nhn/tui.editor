'use strict';

var IncreaseTask = require('../../src/js/wysiwygCommands/IncreaseTask'),
    WysiwygEditor = require('../../src/js/wysiwygEditor'),
    EventManager = require('../../src/js/eventManager');

describe('IncreaseTask', function() {
    var wwe, sq;

    beforeEach(function(done) {
        var $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, null, new EventManager());

        wwe.init(function() {
            sq = wwe.getEditor();
            done();
        });
    });

    afterEach(function() {
        $('body').empty();
    });

    it('Increase Task Depth', function() {
        var range = wwe.getEditor().getSelection().cloneRange();
        wwe.get$Body().html('<ul><li class="task-list-item"><div><input type="checkbox"> abcde</div></li><li class="task-list-item"><div><input type="checkbox"> </div></li></ul><div></div>');

        range.setStartAfter(wwe.get$Body().find('input')[1]);
        range.collapse(true);

        sq.setSelection(range);

        IncreaseTask.exec(wwe);

        expect(sq.getHTML().replace(/<br>/g, '')).toEqual('<ul><li class="task-list-item"><div><input type="checkbox"> abcde</div><ul><li class="task-list-item"><div><input type="checkbox"> </div></li></ul></li></ul><div></div>');
    });
});
