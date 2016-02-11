'use strict';

var Code = require('../../src/js/markdownCommands/code'),
    MarkdownEditor = require('../../src/js/markdownEditor'),
    EventManager = require('../../src/js/eventManager');

describe('Code', function() {
    var cm,
        doc,
        mde;

    beforeEach(function() {
        var $container = $('<div />'),
            sourceText;

        $('body').append($container);

        mde = new MarkdownEditor($container, new EventManager());

        mde.init();

        cm = mde.getEditor();

        sourceText = ['mytext1', '', 'mytext2', 'mytext3'];

        cm.setValue(sourceText.join('\n'));
        doc = cm.getDoc();
    });

    afterEach(function() {
        $('body').empty();
    });

    it('Add code', function() {
        doc.setCursor(1, 0);

        Code.exec(mde);

        expect(cm.getValue()).toEqual(['mytext1', '``', 'mytext2', 'mytext3'].join('\n'));
        expect(cm.getCursor().ch).toEqual(1);
    });

    it('Add code for selection', function() {
        doc.setSelection({line: 0, ch: 0}, {line: 0, ch: 7});

        Code.exec(mde);

        expect(cm.getValue()).toEqual(['`mytext1`', '', 'mytext2', 'mytext3'].join('\n'));
        expect(cm.getCursor().ch).toEqual(9);
    });
});
