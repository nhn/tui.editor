var Blockquote = require('../../src/js/markdownCommands/blockquote');

var CodeMirror = window.CodeMirror;

describe('Blockquote', function() {
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
            theme: 'default',
            dragDrop: false
        });

        sourceText = ['mytext1', '', 'mytext2', 'mytext3'];

        cm.setValue(sourceText.join('\n'));
        doc = cm.getDoc();
    });

    describe('특정라인에서 커맨드실행시 해당라인의 첫번째 컬럼에 >가 추가된다', function() {
        it('텍스트가 있는 라인시작에 >가 추가되었다', function() {
            doc.setCursor(2, 3);

            Blockquote.responder(cm);

            expect(cm.getValue()).toEqual(['mytext1', '', '>mytext2', 'mytext3'].join('\n'));
        });

        it('빈 라인시작에 >가 추가되었다', function() {
            doc.setCursor(1, 3);

            Blockquote.responder(cm);

            expect(cm.getValue()).toEqual(['mytext1', '>', 'mytext2', 'mytext3'].join('\n'));
        });
    });

    describe('셀렉션을 지정한상태에서 커맨드를 사용하면 해당 텍스트들에 인용마크다운이 추가된다.', function() {
        it('인용구가 정상적으로 추가되었다', function() {
            doc.setSelection({line: 0, ch: 3}, {line: 2, ch: 2});

            Blockquote.responder(cm);

            expect(cm.getValue()).toEqual(['>mytext1', '>', '>mytext2', 'mytext3'].join('\n'));
        });
    });
});
