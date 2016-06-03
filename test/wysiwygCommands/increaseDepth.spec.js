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
            '<li class="task-list-item"><div><input type="checkbox"> abcdef</div></li>',
            '<li class="task-list-item"><div><input type="checkbox"> abcde</div></li>',
            '<li class="task-list-item"><div><input type="checkbox"> </div></li>',
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

        range.setStartAfter(wwe.get$Body().find('input')[1]);
        range.collapse(true);

        sq.setSelection(range);

        IncreaseDepth.exec(wwe);

        expect(sq.get$Body().find('ul li ul').length).toEqual(1);
        expect(sq.get$Body().find('ul li ul li').length).toEqual(1);
        expect(sq.get$Body().find('ul li ul li input').length).toEqual(1);
        expect(sq.get$Body().find('ul li ul li').hasClass('task-list-item')).toBe(true);
    });
    it('fail when it does not have previous li.', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        range.setStartAfter(wwe.get$Body().find('input')[0]);
        range.collapse(true);

        sq.setSelection(range);

        IncreaseDepth.exec(wwe);

        expect(sq.get$Body().find('ul li ul').length).toEqual(0);
        expect(sq.get$Body().find('ul li ul li').length).toEqual(0);
        expect(sq.get$Body().find('ul li ul li input').length).toEqual(0);
        expect(sq.get$Body().find('ul li ul li').hasClass('task-list-item')).toBe(false);
    });
    describe('should increase depth when cursor', function() {
        it('at startOffset 0.', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('input')[1].nextSibling, 0);
            range.collapse(true);

            sq.setSelection(range);

            IncreaseDepth.exec(wwe);

            expect(sq.get$Body().find('ul li ul').length).toEqual(1);
            expect(sq.get$Body().find('ul li ul li').length).toEqual(1);
            expect(sq.get$Body().find('ul li ul li input').length).toEqual(1);
            expect(sq.get$Body().find('ul li ul li').hasClass('task-list-item')).toBe(true);
        });
        it('at startOffset 1.', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('input')[1].nextSibling, 1);
            range.collapse(true);

            sq.setSelection(range);

            IncreaseDepth.exec(wwe);

            expect(sq.get$Body().find('ul li ul').length).toEqual(1);
            expect(sq.get$Body().find('ul li ul li').length).toEqual(1);
            expect(sq.get$Body().find('ul li ul li input').length).toEqual(1);
            expect(sq.get$Body().find('ul li ul li').hasClass('task-list-item')).toBe(true);
        });
        it('before input element.', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            range.setStartBefore(wwe.get$Body().find('input')[1]);
            range.collapse(true);

            sq.setSelection(range);

            IncreaseDepth.exec(wwe);

            expect(sq.get$Body().find('ul li ul').length).toEqual(1);
            expect(sq.get$Body().find('ul li ul li').length).toEqual(1);
            expect(sq.get$Body().find('ul li ul li input').length).toEqual(1);
            expect(sq.get$Body().find('ul li ul li').hasClass('task-list-item')).toBe(true);
        });
    });
    describe('should not increase', function() {
        it('at startOffset 2 or more.', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('input')[1].nextSibling, 2);
            range.collapse(true);

            sq.setSelection(range);

            IncreaseDepth.exec(wwe);
            range.setStart(wwe.get$Body().find('input')[1].nextSibling, 3);
            range.collapse(true);

            sq.setSelection(range);

            IncreaseDepth.exec(wwe);
            range.setStart(wwe.get$Body().find('input')[1].nextSibling, 4);
            range.collapse(true);

            sq.setSelection(range);

            IncreaseDepth.exec(wwe);

            expect(sq.get$Body().find('ul li').length).toEqual(3);
            expect(sq.get$Body().find('ul li ul').length).toEqual(0);
            expect(sq.get$Body().find('ul li ul li').length).toEqual(0);
            expect(sq.get$Body().find('ul li ul li input').length).toEqual(0);
        });
    });
});
