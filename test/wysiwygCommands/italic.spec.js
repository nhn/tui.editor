'use strict';

var Italic = require('../../src/js/wysiwygCommands/italic'),
    WysiwygEditor = require('../../src/js/wysiwygEditor'),
    EventManager = require('../../src/js/eventManager');

describe('Italic', function() {
    var wwe;

    beforeEach(function() {
        var $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, null, new EventManager());

        wwe.init();
    });

    //we need to wait squire input event process
    afterEach(function(done) {
        setTimeout(function() {
            $('body').empty();
            done();
        });
    });

    it('add italic to current selection', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('line1<br />line2');

        range.selectNodeContents(wwe.get$Body().children()[0]);
        wwe.getEditor().setSelection(range);

        Italic.exec(wwe);

        expect(wwe.getValue()).toEqual('<i>line1</i><br />line2<br />');
    });

    it('dont add italic in Achor tag', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('<a href="#">line1</a>');

        range.selectNodeContents(wwe.get$Body().find('a')[0]);
        wwe.getEditor().setSelection(range);

        Italic.exec(wwe);

        expect(wwe.getValue()).toEqual('<a href="#">line1</a><br />');
    });

    it('if there have italic already remove format', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('line1<br />line2');

        range.selectNodeContents(wwe.get$Body().children()[0]);
        wwe.getEditor().setSelection(range);

        Italic.exec(wwe);
        Italic.exec(wwe);

        expect(wwe.getValue()).toEqual('line1<br />line2<br />');
    });

    it('if there have italic already remove format in colappsed selection', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('<i>line</i>');

        range.setStart(wwe.get$Body().find('i')[0].firstChild, 4);
        range.collapse(true);
        wwe.getEditor().setSelection(range);

        Italic.exec(wwe);
        wwe.getEditor().insertPlainText('a');

        expect(wwe.getValue()).toEqual('<i>line</i>a<br />');
    });

    it('if there have bold remove and add italic', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('<b>line</b>');

        range.selectNodeContents(wwe.get$Body().children()[0]);
        wwe.getEditor().setSelection(range);

        Italic.exec(wwe);

        expect(wwe.getValue()).toEqual('<i>line</i><br />');
    });

    it('if there have code remove and add italic', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('<code>line</code>');

        range.selectNodeContents(wwe.get$Body().children()[0]);
        wwe.getEditor().setSelection(range);

        Italic.exec(wwe);

        expect(wwe.getValue()).toEqual('<i>line</i><br />');
    });
});
