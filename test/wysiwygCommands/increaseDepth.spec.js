'use strict';

var IncreaseDepth = require('../../src/js/wysiwygCommands/increaseDepth'),
    WysiwygEditor = require('../../src/js/wysiwygEditor'),
    WwTaskManager = require('../../src/js/wwTaskManager'),
    EventManager = require('../../src/js/eventManager');

describe('IncreaseDepth', function() {
    var wwe, sq;

    beforeEach(function() {
        var $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, new EventManager());

        wwe.init();

        sq = wwe.getEditor();
        wwe.addManager(WwTaskManager);

        wwe.get$Body().html([
            '<ul>',
            '<li data-te-task class="task-list-item"><div>abcdef</div></li>',
            '<li data-te-task class="task-list-item"><div>abcde</div></li>',
            '<li data-te-task class="task-list-item"><div> </div></li>',
            '</ul>'
        ].join(''));
    });

    //we need to wait squire input event process
    afterEach(function(done) {
        setTimeout(function() {
            $('body').empty();
            done();
        });
    });

    it('success when it not first li.', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        range.setStart(wwe.get$Body().find('div')[1].firstChild, 0);
        range.collapse(true);

        sq.setSelection(range);

        IncreaseDepth.exec(wwe);

        expect(sq.get$Body().find('ul li ul').length).toEqual(1);
        expect(sq.get$Body().find('ul li ul li').length).toEqual(1);
        expect(sq.get$Body().find('ul li ul li').hasClass('task-list-item')).toBe(true);
    });
    it('fail when it does not have previous li.', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        range.setStart(wwe.get$Body().find('div')[0].firstChild, 0);
        range.collapse(true);

        sq.setSelection(range);

        IncreaseDepth.exec(wwe);

        expect(sq.get$Body().find('ul li ul').length).toEqual(0);
        expect(sq.get$Body().find('ul li ul li').length).toEqual(0);
        expect(sq.get$Body().find('ul li ul li').hasClass('task-list-item')).toBe(false);
    });
    describe('should increase depth when cursor', function() {
        it('at startOffset 0.', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('div')[1].firstChild, 0);
            range.collapse(true);

            sq.setSelection(range);

            IncreaseDepth.exec(wwe);

            expect(sq.get$Body().find('ul li ul').length).toEqual(1);
            expect(sq.get$Body().find('ul li ul li').length).toEqual(1);
            expect(sq.get$Body().find('ul li ul li').hasClass('task-list-item')).toBe(true);
        });
        it('at startOffset 1.', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('div')[1].firstChild, 1);
            range.collapse(true);

            sq.setSelection(range);

            IncreaseDepth.exec(wwe);

            expect(sq.get$Body().find('ul li ul').length).toEqual(1);
            expect(sq.get$Body().find('ul li ul li').length).toEqual(1);
            expect(sq.get$Body().find('ul li ul li').hasClass('task-list-item')).toBe(true);
        });
    });
});
