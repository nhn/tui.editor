var OL = require('../../src/js/markdownCommands/ol');

var CodeMirror = window.CodeMirror;

describe('OL', function() {
    'use strict';

    var cm,
        doc;

    beforeEach(function() {
        var textArea = $('<textarea />'),
            sourceText;

        $('body').append(textArea);

        cm = CodeMirror.fromTextArea(textArea[0], {
            lineWrapping: true,
            mode: 'gfm',
            theme: 'defaOLt',
            dragDrop: false
        });

        sourceText = ['mytext1', '', 'mytext2', 'mytext3'];

        cm.setValue(sourceText.join('\n'));
        doc = cm.getDoc();
    });

    describe('커서위치에 UL마크다운 문법을 추가한다', function() {
        it('텍스트가 있는 라인에서 추가된다', function() {
            doc.setCursor(0, 0);

            OL.exec(cm);

            expect(doc.getLine(0)).toEqual('1. mytext1');
        });
        it('빈라인에서 추가된다', function() {
            doc.setCursor(1, 0);

            OL.exec(cm);

            expect(doc.getLine(1)).toEqual('1. ');
        });

        it('영역선택후 추가된다', function() {
            doc.setSelection({line: 0, ch: 0}, {line: 2, ch: 7});

            OL.exec(cm);

            expect(doc.getLine(0)).toEqual('1. ');
            expect(doc.getLine(1)).toEqual('mytext3');
        });
    });
});
