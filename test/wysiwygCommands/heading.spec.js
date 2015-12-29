'use strict';

var Heading = require('../../src/js/wysiwygCommands/heading'),
    WysiwygEditor = require('../../src/js/wysiwygEditor'),
    EventManager = require('../../src/js/eventManager');

describe('Heading', function() {
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

    it('add heading to current selection or cursor', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('text');

        range.selectNodeContents(wwe.getEditor().getDocument().body.childNodes[0]);
        range.collapse(true);

        wwe.getEditor().setSelection(range);

        Heading.exec(wwe, 1);

        expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('<h1>text</h1>');
    });


    it('set heading tag 1~6 rotation', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('text');

        range.selectNodeContents(wwe.getEditor().getDocument().body.childNodes[0]);
        range.collapse(true);
        wwe.getEditor().setSelection(range);

        Heading.exec(wwe, 1);
        expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('<h1>text</h1>');

        Heading.exec(wwe, 2);
        expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('<h2>text</h2>');

        Heading.exec(wwe, 3);
        expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('<h3>text</h3>');

        Heading.exec(wwe, 4);
        expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('<h4>text</h4>');

        Heading.exec(wwe, 5);
        expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('<h5>text</h5>');

        Heading.exec(wwe, 6);
        expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('<h6>text</h6>');

    });
});
