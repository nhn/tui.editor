'use strict';

var task = require('../../src/js/markdownCommands/task'),
    MarkdownEditor = require('../../src/js/markdownEditor'),
    EventManager = require('../../src/js/eventManager');

describe('task', function() {
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

    describe('add task', function() {
        it('added task', function() {
            doc.setCursor(0, 0);

            task.exec(mde);

            expect(doc.getLine(0)).toEqual('* [ ] mytext1');
        });
    });
});
