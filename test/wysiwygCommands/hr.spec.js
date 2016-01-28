'use strict';

var HR = require('../../src/js/wysiwygCommands/hr'),
    WysiwygEditor = require('../../src/js/wysiwygEditor'),
    WwTaskManager = require('../../src/js/wwTaskManager'),
    EventManager = require('../../src/js/eventManager');

describe('HR', function() {
    var wwe, sq;

    beforeEach(function(done) {
        var $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, null, new EventManager());

        wwe.init(function() {
            sq = wwe.getEditor();
            wwe.addManager('task', WwTaskManager);
            done();
        });
    });

    afterEach(function() {
        $('body').empty();
    });

    it('add HR and if there is no next block then append default block', function() {
        HR.exec(wwe);

        expect(wwe.get$Body().find('hr').length).toEqual(1);
        expect(wwe.get$Body().find('div').length).toEqual(2);
    });

    it('add HR and if there is next block then dont make default block', function() {
        var range = sq.getSelection().cloneRange();

        sq.setHTML('<div>test</div><div><br/></div>');

        range.setStart(wwe.get$Body().find('div')[0], 0);
        range.collapse(true);

        sq.setSelection(range);

        HR.exec(wwe);

        expect(wwe.get$Body().find('hr').length).toEqual(1);
        expect(wwe.get$Body().find('div').length).toEqual(2);
    });

    it('append hr then cursor to next block', function() {
        var range = sq.getSelection().cloneRange();

        sq.setHTML('<div>test</div><div><br/></div>');

        range.setStart(wwe.get$Body().find('div')[0], 0);
        range.collapse(true);

        sq.setSelection(range);

        HR.exec(wwe);

        expect(wwe.get$Body().find('div').length).toEqual(2);
        expect(sq.getSelection().startContainer).toBe(wwe.get$Body().find('div')[1]);
    });
});
