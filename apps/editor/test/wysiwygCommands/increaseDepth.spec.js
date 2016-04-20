'use strict';

var IncreaseDepth = require('../../src/js/wysiwygCommands/increaseDepth'),
    WysiwygEditor = require('../../src/js/wysiwygEditor'),
    EventManager = require('../../src/js/eventManager');

describe('IncreaseDepth', function() {
    var wwe, sq;

    beforeEach(function() {
        var $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, null, new EventManager());

        wwe.init();

        sq = wwe.getEditor();
    });

    //we need to wait squire input event process
    afterEach(function(done) {
        setTimeout(function() {
            $('body').empty();
            done();
        });
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

        expect(sq.get$Body().find('ul li ul').length).toEqual(1);
        expect(sq.get$Body().find('ul li ul li').length).toEqual(1);
        expect(sq.get$Body().find('ul li ul li input').length).toEqual(1);
        expect(sq.get$Body().find('ul li ul li').hasClass('task-list-item')).toBe(true);
    });
});
