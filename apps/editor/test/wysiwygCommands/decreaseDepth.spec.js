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
        sq.focus();

        wwe.get$Body().html([
            '<ul>',
            '<li data-te-task class="task-list-item"><div>abcdef</div>',
            '<ul>',
            '<li data-te-task class="task-list-item checked"><div>abcde</div></li>',
            '</ul></li>',
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

    it('should be able to decrease depth second to first.', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        range.setStart(wwe.get$Body().find('div')[1].firstChild, 0);
        range.collapse(true);

        sq.setSelection(range);

        DecreaseDepth.exec(wwe);

        expect(sq.get$Body().find('ul li').length).toEqual(3);
        expect(sq.get$Body().find('ul li ul').length).toEqual(0);
        expect(sq.get$Body().find('ul li ul li').length).toEqual(0);
        expect(sq.get$Body().find('ul li').hasClass('task-list-item')).toBe(true);
        expect(sq.get$Body().find('ul li').hasClass('checked')).toBe(true);
    });
    it('should break out list element and delete input.', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        range.setStart(wwe.get$Body().find('div')[2].firstChild, 0);
        range.collapse(true);

        sq.setSelection(range);

        DecreaseDepth.exec(wwe);

        expect(sq.get$Body().find('ul li').length).toEqual(2);
        expect(sq.get$Body().find('ul li ul').length).toEqual(1);
        expect(sq.get$Body().find('ul li ul li').length).toEqual(1);
        expect(sq.get$Body().find('ul li').hasClass('task-list-item')).toBe(true);
    });
    describe('should guarantee to remove non task`s class attribute', function() {
        it('when super depth is task and child depth is not', function() {
            var range = wwe.getEditor().getSelection().cloneRange();
            var $Body;

            wwe.get$Body().html([
                '<ul>',
                '<li data-te-task class="task-list-item"><div>abcdef</div>',
                '<ul>',
                '<li><div>abcde</div></li>',
                '</ul></li>',
                '<li data-te-task class="task-list-item"><div> </div></li>',
                '</ul>'
            ].join(''));

            range.setStart(wwe.get$Body().find('div')[1].firstChild, 0);
            range.collapse(true);

            sq.setSelection(range);

            DecreaseDepth.exec(wwe);

            $Body = sq.get$Body();

            expect($Body.find('ul li').length).toEqual(3);
            expect($Body.find('ul li ul').length).toEqual(0);
            expect($Body.find('ul li').eq(0).hasClass('task-list-item')).toBe(true);
            expect($Body.find('ul li').eq(1).hasClass('task-list-item')).toBe(true);
            expect($Body.find('ul li').eq(2).hasClass('task-list-item')).toBe(true);
        });
    });
    describe('should decrease depth when cursor', function() {
        it('at startOffset 0.', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('div')[1].firstChild, 0);
            range.collapse(true);

            sq.setSelection(range);

            DecreaseDepth.exec(wwe);

            expect(sq.get$Body().find('ul li').length).toEqual(3);
            expect(sq.get$Body().find('ul li ul').length).toEqual(0);
            expect(sq.get$Body().find('ul li ul li').length).toEqual(0);
            expect(sq.get$Body().find('ul li').hasClass('task-list-item')).toBe(true);
        });
        it('should decrease depth when cursor at any offset.', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('div')[1].firstChild, 2);
            range.collapse(true);

            sq.setSelection(range);

            DecreaseDepth.exec(wwe);

            expect(sq.get$Body().find('ul li').length).toEqual(3);
            expect(sq.get$Body().find('ul li ul').length).toEqual(0);
            expect(sq.get$Body().find('ul li ul li').length).toEqual(0);
            expect(sq.get$Body().find('ul li').hasClass('task-list-item')).toBe(true);
        });
    });
});
