'use strict';
var AddLink = require('../../src/js/markdownCommands/addLink'),
    MarkdownEditor = require('../../src/js/markdownEditor'),
    EventManager = require('../../src/js/eventManager');

describe('AddLink', function() {
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

            AddLink.exec(mde, data);

            expect(doc.getLine(1)).toEqual('[' + data.linkText + '](' + data.url + ')');
        });

        it('영역선택후 링크가 추가된다', function() {
            doc.setSelection({line: 0, ch: 0}, {line: 2, ch: 7});

            AddLink.exec(mde, data);

            expect(doc.getLine(0)).toEqual('[' + data.linkText + '](' + data.url + ')');
            expect(doc.getLine(1)).toEqual('mytext3');
        });
    });
});
