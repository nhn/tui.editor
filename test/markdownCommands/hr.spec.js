'use strict';

var HR = require('../../src/js/markdownCommands/hr'),
    MarkdownEditor = require('../../src/js/markdownEditor'),
    EventManager = require('../../src/js/eventManager');

describe('HR', function() {
    var cm, doc, mde;

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

    describe('현재라인 바로 밑에 HR 라인을 추가한다', function() {
        it('현재라인 밑에 ***가 추가되었다', function() {
            cm.setCursor(2, 3);

            HR.exec(mde);

            expect(cm.getValue()).toEqual(['mytext1', '', 'mytext2', '\n* * *\n', '', 'mytext3'].join('\n'));
        });

        it('add hr empty line', function() {
            cm.setCursor(1, 0);

            HR.exec(mde);

            expect(cm.getValue()).toEqual(['mytext1', '\n* * *\n', 'mytext2', 'mytext3'].join('\n'));
        });
    });

    describe('셀렉션이 있는경우 셀렉션의 내용을 라인으로 대체한다', function() {
        it('셀렉션 영역이 ***로 대체되었다', function() {
            cm.setSelection({line: 0, ch: 1}, {line: 2, ch: 2});

            HR.exec(mde);

            expect(cm.getValue()).toEqual(['m\n\n* * *\n\ntext2', 'mytext3'].join('\n'));
        });
    });
});
