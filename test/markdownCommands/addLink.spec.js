var AddLink = require('../../src/js/markdownCommands/addLink');

var CodeMirror = window.CodeMirror;

describe('AddLink', function() {
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

    describe('인자로 들어온 데이터를 이용해 링크구문을 추가한다', function() {
        var data;

        beforeEach(function() {
            data = {
                linkText: 'mylink',
                url: 'http://www.nhnent.com'
            };
        });

        it('빈라인에서 링크가 추가된다', function() {
            doc.setCursor(1, 0);

            AddLink.responder(cm, data);

            expect(doc.getLine(1)).toEqual('[' + data.linkText + '](' + data.url + ')');
        });

        it('영역선택후 링크가 추가된다', function() {
            doc.setSelection({line: 0, ch: 0}, {line: 2, ch: 7});

            AddLink.responder(cm, data);

            expect(doc.getLine(0)).toEqual('[' + data.linkText + '](' + data.url + ')');
            expect(doc.getLine(1)).toEqual('mytext3');
        });
    });
});
