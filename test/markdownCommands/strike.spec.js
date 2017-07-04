import Strike from '../../src/js/markdownCommands/strike';
import MarkdownEditor from '../../src/js/markdownEditor';
import EventManager from '../../src/js/eventManager';

describe('Strike', () => {
    let cm, doc, mde;

    beforeEach(() => {
        const $container = $('<div />');

        $('body').append($container);

        mde = new MarkdownEditor($container, new EventManager());

        cm = mde.getEditor();

        const sourceText = ['mytext1', '', 'mytext2', 'mytext3'];

        cm.setValue(sourceText.join('\n'));
        doc = cm.getDoc();
    });

    afterEach(() => {
        $('body').empty();
    });

    describe('특정라인의 문자 위치에서 커맨드실행시 해당위치에 스트라이크문법이 추가된다.', () => {
        it('텍스트 중간에서 실행시 ~~~~가 삽입된다 ', () => {
            doc.setCursor(2, 3);

            Strike.exec(mde);

            expect(cm.getValue()).toEqual(['mytext1', '', 'myt~~~~ext2', 'mytext3'].join('\n'));
        });

        it('빈 라인시작에 ~~~~가 추가되었다', () => {
            doc.setCursor(1, 0);

            Strike.exec(mde);

            expect(cm.getValue()).toEqual(['mytext1', '~~~~', 'mytext2', 'mytext3'].join('\n'));
        });
    });

    describe('셀렉션을 지정한상태에서 커맨드를 사용하면 ', () => {
        it('선택된영역의 텍스트가 스트라이크처리된다', () => {
            doc.setSelection({
                line: 0,
                ch: 0
            }, {
                line: 0,
                ch: 7
            });

            Strike.exec(mde);

            expect(cm.getValue()).toEqual(['~~mytext1~~', '', 'mytext2', 'mytext3'].join('\n'));
        });
        it('선택된영역의 스트라이크가 해제된다', () => {
            doc.setSelection({
                line: 0,
                ch: 0
            }, {
                line: 0,
                ch: 7
            });

            Strike.exec(mde);

            expect(cm.getValue()).toEqual(['~~mytext1~~', '', 'mytext2', 'mytext3'].join('\n'));
            doc.setSelection({
                line: 0,
                ch: 0
            }, {
                line: 0,
                ch: 11
            });

            Strike.exec(mde);

            expect(cm.getValue()).toEqual(['mytext1', '', 'mytext2', 'mytext3'].join('\n'));
        });
    });
});
