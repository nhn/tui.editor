'use strict';

var Italic = require('../../src/js/wysiwygCommands/italic'),
    WysiwygEditor = require('../../src/js/wysiwygEditor'),
    EventManager = require('../../src/js/eventManager');

describe('Italic', function() {
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

    it('add italic to current selection', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('line1<br />line2');

        range.selectNodeContents(wwe.get$Body().children()[0])
        wwe.getEditor().setSelection(range);

        Italic.exec(wwe);

        expect(wwe.getValue()).toEqual('<i>line1</i><br />line2<br />');
    });

    it('if there have italic already remove format', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('line1<br />line2');

        range.selectNodeContents(wwe.get$Body().children()[0])
        wwe.getEditor().setSelection(range);

        Italic.exec(wwe);
        Italic.exec(wwe);

        expect(wwe.getValue()).toEqual('line1<br />line2<br />');
    });
});
