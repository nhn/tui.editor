'use strict';

var UL = require('../../src/js/wysiwygCommands/ul'),
    WysiwygEditor = require('../../src/js/wysiwygEditor'),
    WwTaskManager = require('../../src/js/wwTaskManager'),
    EventManager = require('../../src/js/eventManager');

describe('UL', function() {
    var wwe, sq;

    beforeEach(function() {
        var $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, new EventManager());

        wwe.init();

        sq = wwe.getEditor();
        wwe.addManager('task', WwTaskManager);
    });

    //we need to wait squire input event process
    afterEach(function(done) {
        setTimeout(function() {
            $('body').empty();
            done();
        });
    });

    it('add UL', function() {
        UL.exec(wwe);

        expect(wwe.get$Body().find('ul').length).toEqual(1);
        expect(wwe.get$Body().find('li').length).toEqual(1);
    });

    it('if have task in range then remove task and change to ul', function() {
        var range = sq.getSelection().cloneRange();

        sq.setHTML('<ul><li data-te-task class="task-list-item"><div>test</div></li></ul>');

        range.setStart(wwe.get$Body().find('li')[0], 1);
        range.collapse(true);

        sq.setSelection(range);

        UL.exec(wwe);

        expect(wwe.get$Body().find('ul li.task-list-item[data-te-task]').length).toEqual(0);
        expect(wwe.get$Body().find('li').length).toEqual(1);
        expect(wwe.get$Body().find('li').text()).toEqual('test');
    });
});
