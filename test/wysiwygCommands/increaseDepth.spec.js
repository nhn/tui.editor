'use strict';

var IncreaseDepth = require('../../src/js/wysiwygCommands/increaseDepth'),
    WysiwygEditor = require('../../src/js/wysiwygEditor'),
    EventManager = require('../../src/js/eventManager');

describe('IncreaseDepth', function() {
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

    it('Increase Depth', function() {
        var range = wwe.getEditor().getSelection().cloneRange();
        wwe.get$Body().html([
            '<ul>',
                '<li class="task-list-item"><div><input type="checkbox"> abcde</div></li>',
                '<li class="task-list-item"><div><input type="checkbox"> </div></li>',
            '</ul>'
        ].join(''));

        range.setStartAfter(wwe.get$Body().find('input')[1]);
        range.collapse(true);

        sq.setSelection(range);

        IncreaseDepth.exec(wwe);

        expect(sq.getHTML().replace(/<br>/g, '')).toEqual([
            '<ul>',
                '<li class="task-list-item">',
                    '<div><input type="checkbox"> abcde</div>',
                    '<ul>',
                        '<li class="task-list-item"><div><input type="checkbox"> </div></li>',
                    '</ul>',
                '</li>',
            '</ul>'
        ].join(''));
    });
});
