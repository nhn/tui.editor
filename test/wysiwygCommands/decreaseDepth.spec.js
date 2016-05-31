'use strict';

var DecreaseDepth = require('../../src/js/wysiwygCommands/decreaseDepth'),
    WysiwygEditor = require('../../src/js/wysiwygEditor'),
    WwTaskManager = require('../../src/js/wwTaskManager'),
    EventManager = require('../../src/js/eventManager');

describe('DecreaseDepth', function() {
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
            '<li class="task-list-item"><div><input type="checkbox"> abcdef</div>',
            '<ul>',
            '<li class="task-list-item"><div><input type="checkbox"> abcde</div></li>',
            '</ul></li>',
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

    it('should be able to decrease depth second to first.', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        range.setStartAfter(wwe.get$Body().find('input')[1]);
        range.collapse(true);

        sq.setSelection(range);

        DecreaseDepth.exec(wwe);

        expect(sq.get$Body().find('ul li').length).toEqual(3);
        expect(sq.get$Body().find('ul li ul').length).toEqual(0);
        expect(sq.get$Body().find('ul li ul li').length).toEqual(0);
        expect(sq.get$Body().find('ul li input').length).toEqual(3);
        expect(sq.get$Body().find('ul li').hasClass('task-list-item')).toBe(true);
    });
    it('should break out list element and delete input.', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        range.setStartAfter(wwe.get$Body().find('input')[2]);
        range.collapse(true);

        sq.setSelection(range);

        DecreaseDepth.exec(wwe);

        expect(sq.get$Body().find('ul li').length).toEqual(2);
        expect(sq.get$Body().find('ul li ul').length).toEqual(1);
        expect(sq.get$Body().find('ul li ul li').length).toEqual(1);
        expect(sq.get$Body().find('ul li input').length).toEqual(2);
        expect(sq.get$Body().find('ul li').hasClass('task-list-item')).toBe(true);
    });
    describe('should decrease depth when cursor', function() {
        it('at startOffset 0.', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('input')[1].nextSibling, 0);
            range.collapse(true);

            sq.setSelection(range);

            DecreaseDepth.exec(wwe);

            expect(sq.get$Body().find('ul li').length).toEqual(3);
            expect(sq.get$Body().find('ul li ul').length).toEqual(0);
            expect(sq.get$Body().find('ul li ul li').length).toEqual(0);
            expect(sq.get$Body().find('ul li input').length).toEqual(3);
            expect(sq.get$Body().find('ul li').hasClass('task-list-item')).toBe(true);
        });
        it('should decrease depth when cursor at startOffset 1.', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('input')[1].nextSibling, 1);
            range.collapse(true);

            sq.setSelection(range);

            DecreaseDepth.exec(wwe);

            expect(sq.get$Body().find('ul li').length).toEqual(3);
            expect(sq.get$Body().find('ul li ul').length).toEqual(0);
            expect(sq.get$Body().find('ul li ul li').length).toEqual(0);
            expect(sq.get$Body().find('ul li input').length).toEqual(3);
            expect(sq.get$Body().find('ul li').hasClass('task-list-item')).toBe(true);
        });
        it('should decrease depth when cursor before input element.', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            range.setStartBefore(wwe.get$Body().find('input')[1]);
            range.collapse(true);

            sq.setSelection(range);

            DecreaseDepth.exec(wwe);

            expect(sq.get$Body().find('ul li').length).toEqual(3);
            expect(sq.get$Body().find('ul li ul').length).toEqual(0);
            expect(sq.get$Body().find('ul li ul li').length).toEqual(0);
            expect(sq.get$Body().find('ul li input').length).toEqual(3);
            expect(sq.get$Body().find('ul li').hasClass('task-list-item')).toBe(true);
        });
    });
    describe('should not decrease depth when', function() {
        it('cursor at 2 or more.', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('input')[1].nextSibling, 2);
            range.collapse(true);

            sq.setSelection(range);

            DecreaseDepth.exec(wwe);
            range.setStart(wwe.get$Body().find('input')[1].nextSibling, 3);
            range.collapse(true);

            sq.setSelection(range);

            DecreaseDepth.exec(wwe);
            range.setStart(wwe.get$Body().find('input')[1].nextSibling, 4);
            range.collapse(true);

            sq.setSelection(range);

            DecreaseDepth.exec(wwe);

            expect(sq.get$Body().find('ul li').length).toEqual(3);
            expect(sq.get$Body().find('ul li ul').length).toEqual(1);
            expect(sq.get$Body().find('ul li ul li').length).toEqual(1);
            expect(sq.get$Body().find('ul li input').length).toEqual(3);
            expect(sq.get$Body().find('ul li').hasClass('task-list-item')).toBe(true);
        });
    });
});
