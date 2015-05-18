var HR = require('../../src/js/markdownCommands/hr');

var CodeMirror = window.CodeMirror;

describe('HR', function() {
    'use strict';

    var cm;

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
    });

    describe('현재라인 바로 밑에 HR 라인을 추가한다', function() {
        it('현재라인 밑에 ***가 추가되었다', function() {
            cm.setCursor(2, 3);

            HR.responder(cm);

            expect(cm.getValue()).toEqual(['mytext1', '', 'mytext2', '***', 'mytext3'].join('\n'));
        });
    });

    describe('셀렉션이 있는경우 셀렉션의 내용을 라인으로 대체한다', function() {
        it('셀렉션 영역이 ***로 대체되었다', function() {
            cm.setSelection({line: 0, ch: 1}, {line: 2, ch: 2});

            HR.responder(cm);

            expect(cm.getValue()).toEqual(['m***text2', 'mytext3'].join('\n'));
        });
    });
});
