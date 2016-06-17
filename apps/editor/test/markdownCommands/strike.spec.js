'use strict';

var Strike = require('../../src/js/markdownCommands/strike'),
    MarkdownEditor = require('../../src/js/markdownEditor'),
    EventManager = require('../../src/js/eventManager');

describe('Strike', function() {
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

    describe('특정라인의 문자 위치에서 커맨드실행시 해당위치에 스트라이크문법이 추가된다.', function() {
        it('텍스트 중간에서 실행시 ~~~~가 삽입된다 ', function() {
            doc.setCursor(2, 3);

            Strike.exec(mde);

            expect(cm.getValue()).toEqual(['mytext1', '', 'myt~~~~ext2', 'mytext3'].join('\n'));
        });

        it('빈 라인시작에 ~~~~가 추가되었다', function() {
            doc.setCursor(1, 0);

            Strike.exec(mde);

            expect(cm.getValue()).toEqual(['mytext1', '~~~~', 'mytext2', 'mytext3'].join('\n'));
        });
    });

    describe('셀렉션을 지정한상태에서 커맨드를 사용하면 ', function() {
        it('선택된영역의 텍스트가 스트라이크처리된다', function() {
            doc.setSelection({line: 0, ch: 0}, {line: 0, ch: 7});

            Strike.exec(mde);

            expect(cm.getValue()).toEqual(['~~mytext1~~', '', 'mytext2', 'mytext3'].join('\n'));
        });
        it('선택된영역의 스트라이크가 해제된다', function() {
            doc.setSelection({line: 0, ch: 0}, {line: 0, ch: 7});

            Strike.exec(mde);

            expect(cm.getValue()).toEqual(['~~mytext1~~', '', 'mytext2', 'mytext3'].join('\n'));
            doc.setSelection({line: 0, ch: 0}, {line: 0, ch: 11});

            Strike.exec(mde);

            expect(cm.getValue()).toEqual(['mytext1', '', 'mytext2', 'mytext3'].join('\n'));
        });
    });
});
