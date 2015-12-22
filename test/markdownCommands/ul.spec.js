'use strict';

var UL = require('../../src/js/markdownCommands/ul'),
    MarkdownEditor = require('../../src/js/markdownEditor'),
    EventManager = require('../../src/js/eventManager');

describe('UL', function() {
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

        sourceText = ['mytext1', '', 'mytext2', 'mytext3', '1. mytext4'];

        cm.setValue(sourceText.join('\n'));
        doc = cm.getDoc();
    });

    afterEach(function() {
        $('body').empty();
    });

    describe('커서위치에 UL마크다운 문법을 추가한다', function() {
        it('텍스트가 있는 라인에서 추가된다', function() {
            doc.setCursor(0, 0);

            UL.exec(mde);

            expect(doc.getLine(0)).toEqual('* mytext1');
        });
        it('빈라인에서 추가된다', function() {
            doc.setCursor(1, 0);

            UL.exec(mde);

            expect(doc.getLine(1)).toEqual('* ');
        });

        it('영역선택후 추가된다', function() {
            doc.setSelection({line: 0, ch: 0}, {line: 2, ch: 7});

            UL.exec(mde);

            expect(doc.getLine(0)).toEqual('* mytext1');
        });
        it('replace  ul markdown text if line have ol', function() {
            doc.setCursor(4, 4);

            UL.exec(mde);

            expect(doc.getLine(4)).toEqual('* mytext4');
        });
        it('Add ol markdown text to line start', function() {
            doc.setCursor(0, 4);

            UL.exec(mde);

            expect(doc.getLine(0)).toEqual('* mytext1');
        });

        it('Don\'t add already have ol markdown text in line start', function() {
            doc.setCursor(0, 4);

            UL.exec(mde);
            UL.exec(mde);

            expect(doc.getLine(0)).toEqual('* mytext1');
        });
    });
});
