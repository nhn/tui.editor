'use strict';

var Bold = require('../../src/js/wysiwygCommands/bold'),
    WysiwygEditor = require('../../src/js/wysiwygEditor'),
    EventManager = require('../../src/js/eventManager');

describe('Bold', function() {
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

    it('add bold to current selection', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('line1<br />line2');

        range.selectNodeContents(wwe.get$Body().children()[0])
        wwe.getEditor().setSelection(range);

        Bold.exec(wwe);

        expect(wwe.getValue()).toEqual('<b>line1</b><br />line2<br />');
    });

    it('if there have bold already remove format', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('line1<br />line2');

        range.selectNodeContents(wwe.get$Body().children()[0])
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
});
