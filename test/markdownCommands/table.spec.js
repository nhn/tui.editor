'use strict';

var Table = require('../../src/js/markdownCommands/table'),
    MarkdownEditor = require('../../src/js/markdownEditor'),
    EventManager = require('../../src/js/eventManager');

describe('Table', function() {
    var cm,
        doc,
        mde;

    beforeEach(function() {
        var $container = $('<div />');

        $('body').append($container);

        mde = new MarkdownEditor($container, new EventManager());

        mde.init();

        cm = mde.getEditor();

        doc = cm.getDoc();
    });

    afterEach(function() {
        $('body').empty();
    });

    describe('Table', function() {
        it('Add table 2x2', function() {
            Table.exec(mde, 2, 2);

            expect(doc.getValue()).toEqual([
                '\n|    |    |',
                '| -- | -- |',
                '|    |    |\n'
            ].join('\n'));
        });

        it('Add table 4x3', function() {
            Table.exec(mde, 4, 3);

            expect(doc.getValue()).toEqual([
                '\n|    |    |    |    |',
                '| -- | -- | -- | -- |',
                '|    |    |    |    |',
                '|    |    |    |    |\n'
            ].join('\n'));
        });

        it('move cursor to first header after insert table', function() {
            Table.exec(mde, 2, 2);

            expect(doc.getValue()).toEqual([
                '\n|    |    |',
                '| -- | -- |',
                '|    |    |\n'
            ].join('\n'));

            expect(cm.getCursor().line).toEqual(1);
            expect(cm.getCursor().ch).toEqual(2);
        });
    });
});
