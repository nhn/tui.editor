'use strict';

var WysiwygEditor = require('../src/js/wysiwygEditor'),
    EventManager = require('../src/js/eventManager');

describe('WysiwygEditor', function() {
    var $container, em;

    beforeEach(function() {
        $('body').empty();
        $container = $('<div />');

        $('body').append($container);

        em = new EventManager();
    });

    afterEach(function() {
        $('body').empty();
    });

    xdescribe('Initialize', function() {
        var wwe;

        beforeEach(function() {
            wwe = new WysiwygEditor($container, null, em);
        });

        it('init() invoke callback', function (done) {
            wwe.init(300, function() {
                done();
            });
        });
    });

    describe('Event', function() {
        var wwe;

        beforeEach(function(done) {
            wwe = new WysiwygEditor($container, null, em);
            wwe.init(300, function() {
                done();
            });
        });

        fit('when something changed in editor Emit contentChanged.wysiwygEditor', function(done) {
            em.listen('contentChanged.wysiwygEditor', function() {
                done();
            });

            //because squire input event
            wwe.editor._ignoreChange = false;
            wwe.editor.insertHTML('<p>test</p>');
        });
    });
});
