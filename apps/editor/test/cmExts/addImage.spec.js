var AddImage = require('../../src/js/cmExts/AddImage');

var CodeMirror = window.CodeMirror;

describe('AddImage', function() {
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

    describe('인자로 들어온 데이터를 이용해 이미지구문을 추가한다', function() {
        var data;

        beforeEach(function() {
            data = {
                imageUrl: 'http://static.nhnent.com/static/site/wgnb/siteTheme_ent/logoImage/logo_ne_theme_01.png?ver=20150121',
                altText: 'NHN Entertainment'
            };
        });

        it('빈라인에서 링크가 추가된다', function() {
            doc.setCursor(1, 0);

            AddImage.responder(cm, data);

            expect(doc.getLine(1)).toEqual('![' + data.imageUrl + '](' + data.altText + ')');
        });

        it('영역선택후 링크가 추가된다', function() {
            doc.setSelection({line: 0, ch: 0}, {line: 2, ch: 7});

            AddImage.responder(cm, data);

            expect(doc.getLine(0)).toEqual('![' + data.imageUrl + '](' + data.altText + ')');
            expect(doc.getLine(1)).toEqual('mytext3');
        });
    });
});
