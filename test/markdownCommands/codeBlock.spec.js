'use strict';

var CodeBlock = require('../../src/js/markdownCommands/codeBlock'),
    MarkdownEditor = require('../../src/js/markdownEditor'),
    EventManager = require('../../src/js/eventManager');

describe('CodeBlock', function() {
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

    it('Add code block in empty line', function() {
        doc.setCursor(1, 0);

        CodeBlock.exec(mde);

        expect(cm.getValue()).toEqual(['mytext1', '', '``` ', '', '```', '', 'mytext2', 'mytext3'].join('\n'));
        expect(cm.getCursor().line).toEqual(3);
    });

    it('Add code block in line that has text', function() {
        doc.setCursor(0, 7);

        CodeBlock.exec(mde);

        expect(cm.getValue()).toEqual(['mytext1', '', '``` ', '', '```', '', '', 'mytext2', 'mytext3'].join('\n'));
        expect(doc.getCursor().line).toEqual(3);
    });
});
