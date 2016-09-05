import HR from '../../src/js/markdownCommands/hr';
import MarkdownEditor from '../../src/js/markdownEditor';
import EventManager from '../../src/js/eventManager';

describe('HR', () => {
    let cm, mde;

    beforeEach(() => {
        const $container = $('<div />');

        $('body').append($container);

        mde = new MarkdownEditor($container, new EventManager());

        mde.init();

        cm = mde.getEditor();

        const sourceText = ['mytext1', '', 'mytext2', 'mytext3'];

        cm.setValue(sourceText.join('\n'));
    });

    afterEach(() => {
        $('body').empty();
    });

    describe('현재라인 바로 밑에 HR 라인을 추가한다', () => {
        it('현재라인 밑에 ***가 추가되었다', () => {
            cm.setCursor(2, 3);

            HR.exec(mde);

            expect(cm.getValue()).toEqual(['mytext1', '', 'mytext2', '\n* * *\n', '', 'mytext3'].join('\n'));
        });

        it('add hr empty line', () => {
            cm.setCursor(1, 0);

            HR.exec(mde);

            expect(cm.getValue()).toEqual(['mytext1', '\n* * *\n', 'mytext2', 'mytext3'].join('\n'));
        });
    });

    describe('셀렉션이 있는경우 셀렉션의 내용을 라인으로 대체한다', () => {
        it('셀렉션 영역이 ***로 대체되었다', () => {
            cm.setSelection({line: 0, ch: 1}, {line: 2, ch: 2});

            HR.exec(mde);

            expect(cm.getValue()).toEqual(['m\n\n* * *\n\ntext2', 'mytext3'].join('\n'));
        });
    });
});
