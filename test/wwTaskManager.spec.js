'use strict';

var WysiwygEditor = require('../src/js/wysiwygEditor'),
    EventManager = require('../src/js/eventManager'),
    WwTaskManager = require('../src/js/WwTaskManager');

fdescribe('WwTaskManager', function() {
    var $container, em, wwe, manager;

    beforeEach(function(done) {
        $container = $('<div />');

        $('body').append($container);

        em = new EventManager();

        wwe = new WysiwygEditor($container, null, em);

        wwe.init(function() {
            wwe.getEditor()._ignoreChange = true;
            manager = new WwTaskManager(wwe);
            done();
        });
    });

    afterEach(function() {
        $('body').empty();
    });

    describe('', function() {
        it('', function() {
            console.log(manager);
            expect(true).toEqual(true);
        });
    });
});
