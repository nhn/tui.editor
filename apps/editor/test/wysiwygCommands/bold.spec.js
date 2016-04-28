'use strict';

var Bold = require('../../src/js/wysiwygCommands/bold'),
    WysiwygEditor = require('../../src/js/wysiwygEditor'),
    EventManager = require('../../src/js/eventManager');

describe('Bold', function() {
    var wwe;

    beforeEach(function() {
        var $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, new EventManager());

        wwe.init();
    });

    //we need to wait squire input event process
    afterEach(function(done) {
        setTimeout(function() {
            $('body').empty();
            done();
        });
    });

    it('add bold to current selection', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('line1<br />line2');

        range.selectNodeContents(wwe.get$Body().children()[0]);
        wwe.getEditor().setSelection(range);

        Bold.exec(wwe);

        expect(wwe.getValue()).toEqual('<b>line1</b><br />line2<br />');
    });

    it('dont add bold in Achor tag', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('<a href="#">line1</a>');

        range.selectNodeContents(wwe.get$Body().find('a')[0]);
        wwe.getEditor().setSelection(range);

        Bold.exec(wwe);

        expect(wwe.getValue()).toEqual('<a href="#">line1</a><br />');
    });

    it('if there have bold already remove format', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('line1<br />line2');

        range.selectNodeContents(wwe.get$Body().children()[0]);
        wwe.getEditor().setSelection(range);

        Bold.exec(wwe);
        Bold.exec(wwe);

        expect(wwe.getValue()).toEqual('line1<br />line2<br />');
    });

    it('if there have bold already remove format in colappsed selection', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('<b>line</b>');

        range.setStart(wwe.get$Body().find('b')[0].firstChild, 4);
        range.collapse(true);
        wwe.getEditor().setSelection(range);

        Bold.exec(wwe);
        wwe.getEditor().insertPlainText('a');

        expect(wwe.getValue()).toEqual('<b>line</b>a<br />');
    });

    it('if there have italic remove and add bold', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('<i>line</i>');

        range.selectNodeContents(wwe.get$Body().children()[0]);
        wwe.getEditor().setSelection(range);

        Bold.exec(wwe);

        expect(wwe.getValue()).toEqual('<b>line</b><br />');
    });

    it('if there have code remove and add bold', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('<code>line</code>');

        range.selectNodeContents(wwe.get$Body().children()[0]);
        wwe.getEditor().setSelection(range);

        Bold.exec(wwe);

        expect(wwe.getValue()).toEqual('<b>line</b><br />');
    });
});
