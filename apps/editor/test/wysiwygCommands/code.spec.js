'use strict';

var Code = require('../../src/js/wysiwygCommands/code'),
    WysiwygEditor = require('../../src/js/wysiwygEditor'),
    EventManager = require('../../src/js/eventManager');

describe('Code', function() {
    var wwe;

    beforeEach(function() {
        var $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, new EventManager());

        wwe.init();
    });

    afterEach(function() {
        $('body').empty();
    });

    it('add code', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('line');

        range.selectNodeContents(wwe.get$Body().children()[0]);
        wwe.getEditor().setSelection(range);

        Code.exec(wwe);

        expect(wwe.getValue()).toEqual('<code>line</code><br />');
    });

    it('if there have bold remove and add code', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('<b>line</b>');

        range.selectNodeContents(wwe.get$Body().children()[0]);
        wwe.getEditor().setSelection(range);

        Code.exec(wwe);

        expect(wwe.getValue()).toEqual('<code>line</code><br />');
    });

    it('if there have italic remove and add code', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('<i>line</i>');

        range.selectNodeContents(wwe.get$Body().children()[0]);
        wwe.getEditor().setSelection(range);

        Code.exec(wwe);

        expect(wwe.getValue()).toEqual('<code>line</code><br />');
    });

    it('if there have code already stop code tag', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('<code>line&#8203;</code>');

        range.setStart(wwe.get$Body().find('code')[0].firstChild, 4);
        range.collapse(true);

        wwe.getEditor().setSelection(range);

        Code.exec(wwe);

        expect(wwe.getEditor().getSelection().startContainer.parentNode.tagName).toEqual('DIV');
    });
});
