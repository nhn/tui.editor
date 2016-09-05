import OL from '../../src/js/markdownCommands/ol';
import MarkdownEditor from '../../src/js/markdownEditor';
import EventManager from '../../src/js/eventManager';

describe('OL', () => {
    let cm, doc, mde;

    beforeEach(() => {
        const $container = $('<div />');

        $('body').append($container);

        mde = new MarkdownEditor($container, new EventManager());

        mde.init();

        cm = mde.getEditor();

        const sourceText = ['mytext1', '', 'mytext2', 'mytext3', '* mytext4'];

        cm.setValue(sourceText.join('\n'));
        doc = cm.getDoc();
    });

    afterEach(() => {
        $('body').empty();
    });

    describe('커서위치에 UL마크다운 문법을 추가한다', () => {
        it('텍스트가 있는 라인에서 추가된다', () => {
            doc.setCursor(0, 0);

            OL.exec(mde);

            expect(doc.getLine(0)).toEqual('1. mytext1');
        });
        it('Add ol markdown text to line start', () => {
            doc.setCursor(0, 4);

            OL.exec(mde);

            expect(doc.getLine(0)).toEqual('1. mytext1');
        });
        it('replace  ol markdown text if line have ul', () => {
            doc.setCursor(4, 4);

            OL.exec(mde);

            expect(doc.getLine(4)).toEqual('1. mytext4');
        });
        it('Don\'t add already have ol markdown text in line start', () => {
            doc.setCursor(0, 4);

            OL.exec(mde);
            OL.exec(mde);

            expect(doc.getLine(0)).toEqual('1. mytext1');
        });
        it('빈라인에서 추가된다', () => {
            doc.setCursor(1, 0);

            OL.exec(mde);

            expect(doc.getLine(1)).toEqual('1. ');
        });

        it('영역선택후 추가된다', () => {
            doc.setSelection({line: 0, ch: 0}, {line: 2, ch: 7});

            OL.exec(mde);

            expect(doc.getLine(0)).toEqual('1. mytext1');
        });
    });
});
