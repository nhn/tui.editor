import Blockquote from '../../src/js/markdownCommands/blockquote';
import MarkdownEditor from '../../src/js/markdownEditor';
import EventManager from '../../src/js/eventManager';

describe('Blockquote', () => {
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

    describe('특정라인에서 커맨드실행시 해당라인의 첫번째 컬럼에 >가 추가된다', () => {
        it('텍스트가 있는 라인시작에 >가 추가되었다', () => {
            doc.setCursor(2, 3);

            Blockquote.exec(mde);

            expect(cm.getValue()).toEqual(['mytext1', '', '>mytext2', 'mytext3'].join('\n'));
        });

        it('빈 라인시작에 >가 추가되었다', () => {
            doc.setCursor(1, 3);

            Blockquote.exec(mde);

            expect(cm.getValue()).toEqual(['mytext1', '>', 'mytext2', 'mytext3'].join('\n'));
        });
    });

    describe('셀렉션을 지정한상태에서 커맨드를 사용하면 해당 텍스트들에 인용마크다운이 추가된다.', () => {
        it('인용구가 정상적으로 추가되었다', () => {
            doc.setSelection({
                line: 0,
                ch: 3
            }, {
                line: 2,
                ch: 2
            });

            Blockquote.exec(mde);

            expect(cm.getValue()).toEqual(['>mytext1', '>', '>mytext2', 'mytext3'].join('\n'));
        });
    });
});
