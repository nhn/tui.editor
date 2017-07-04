import UL from '../../src/js/markdownCommands/ul';
import MarkdownEditor from '../../src/js/markdownEditor';
import EventManager from '../../src/js/eventManager';
import mdListManager from '../../src/js/mdListManager';

describe('UL', () => {
    let cm, doc, mde;

    beforeEach(() => {
        const $container = $('<div />');

        $('body').append($container);

        mde = new MarkdownEditor($container, new EventManager());

        mde.componentManager.addManager(mdListManager);

        cm = mde.getEditor();

        const sourceText = ['mytext1', '', 'mytext2', 'mytext3', '1. mytext4', '# myheading'];

        cm.setValue(sourceText.join('\n'));
        doc = cm.getDoc();
    });

    afterEach(() => {
        $('body').empty();
    });

    describe('커서위치에 UL마크다운 문법을 추가한다', () => {
        it('텍스트가 있는 라인에서 추가된다', () => {
            doc.setCursor(0, 0);

            UL.exec(mde);

            expect(doc.getLine(0)).toEqual('* mytext1');
        });

        it('should add blank line before list starts if previous line is not ul', () => {
            doc.setCursor(3, 0);

            UL.exec(mde);

            expect(doc.getLine(4)).toEqual('* mytext3');
        });

        it('빈라인에서 추가된다', () => {
            doc.setCursor(1, 0);

            UL.exec(mde);

            expect(doc.getLine(2)).toEqual('* ');
        });

        it('영역선택후 추가된다', () => {
            doc.setSelection({
                line: 0,
                ch: 0
            }, {
                line: 2,
                ch: 7
            });

            UL.exec(mde);

            expect(doc.getLine(0)).toEqual('* mytext1');
            expect(doc.getLine(1)).toEqual('* ');
            expect(doc.getLine(2)).toEqual('* mytext2');
            expect(doc.getLine(3)).toEqual('');
            expect(doc.getLine(4)).toEqual('mytext3');
        });
        it('replace ul markdown text if line have ol', () => {
            doc.setCursor(4, 4);

            UL.exec(mde);

            expect(doc.getLine(4)).toEqual('');
            expect(doc.getLine(5)).toEqual('* mytext4');
        });
        it('Add ul markdown text to line start', () => {
            doc.setCursor(0, 4);

            UL.exec(mde);

            expect(doc.getLine(0)).toEqual('* mytext1');
        });

        it('Don\'t add already have ul markdown text in line start', () => {
            doc.setCursor(0, 4);

            UL.exec(mde);
            UL.exec(mde);

            expect(doc.getLine(0)).toEqual('* mytext1');
        });
        it('Don\'t add ul markdown text in heading', () => {
            doc.setCursor(5, 1);

            UL.exec(mde);

            expect(doc.getLine(5)).toEqual('# myheading');
        });
        it('add ul markdown text except heading', () => {
            const sourceText = ['mytext1', 'mytext2', 'mytext3', 'mytext4', '# myheading'];

            cm.setValue(sourceText.join('\n'));
            doc.setSelection({
                line: 0,
                ch: 0
            }, {
                line: 4,
                ch: 7
            });

            UL.exec(mde);

            expect(doc.getLine(0)).toEqual('* mytext1');
            expect(doc.getLine(1)).toEqual('* mytext2');
            expect(doc.getLine(2)).toEqual('* mytext3');
            expect(doc.getLine(3)).toEqual('* mytext4');
            expect(doc.getLine(4)).toEqual('# myheading');
        });
        it('add ul markdown text except blockquote', () => {
            const sourceText = ['mytext1', 'mytext2', 'mytext3', 'mytext4', '> myheading'];

            cm.setValue(sourceText.join('\n'));
            doc.setSelection({
                line: 0,
                ch: 0
            }, {
                line: 4,
                ch: 7
            });

            UL.exec(mde);

            expect(doc.getLine(0)).toEqual('* mytext1');
            expect(doc.getLine(1)).toEqual('* mytext2');
            expect(doc.getLine(2)).toEqual('* mytext3');
            expect(doc.getLine(3)).toEqual('* mytext4');
            expect(doc.getLine(4)).toEqual('> myheading');
        });
        it('add ul markdown text except blockquote', () => {
            const sourceText = ['mytext1', 'mytext2', 'mytext3', 'mytext4', '```', 'var a = 10;', '```'];

            cm.setValue(sourceText.join('\n'));
            doc.setSelection({
                line: 0,
                ch: 0
            }, {
                line: 4,
                ch: 7
            });

            UL.exec(mde);

            expect(doc.getLine(0)).toEqual('* mytext1');
            expect(doc.getLine(1)).toEqual('* mytext2');
            expect(doc.getLine(2)).toEqual('* mytext3');
            expect(doc.getLine(3)).toEqual('* mytext4');
            expect(doc.getLine(4)).toEqual('```');
        });
        it('add ul markdown text except table', () => {
            const sourceText = ['mytext1', 'mytext2', 'mytext3', 'mytext4', '| hi | hello |', '| --- | --- |', '| bye | bye |'];

            cm.setValue(sourceText.join('\n'));
            doc.setSelection({
                line: 0,
                ch: 0
            }, {
                line: 4,
                ch: 7
            });

            UL.exec(mde);

            expect(doc.getLine(0)).toEqual('* mytext1');
            expect(doc.getLine(1)).toEqual('* mytext2');
            expect(doc.getLine(2)).toEqual('* mytext3');
            expect(doc.getLine(3)).toEqual('* mytext4');
            expect(doc.getLine(4)).toEqual('| hi | hello |');
        });
        it('do not add blank at start & end of ul when already blank line exists', () => {
            const sourceText = ['', 'mytext2', '', 'mytext4', '# myheading'];

            cm.setValue(sourceText.join('\n'));
            doc.setCursor(1, 1);
            UL.exec(mde);

            expect(doc.getLine(0)).toEqual('');
            expect(doc.getLine(1)).toEqual('* mytext2');
            expect(doc.getLine(2)).toEqual('');
            expect(doc.getLine(3)).toEqual('mytext4');
            expect(doc.getLine(4)).toEqual('# myheading');
        });
        it('add blank at start & end of ul when blank line not exists', () => {
            const sourceText = ['mytext1', 'mytext2', 'mytext3', 'mytext4', '# myheading'];

            cm.setValue(sourceText.join('\n'));
            doc.setCursor(1, 1);
            UL.exec(mde);

            expect(doc.getLine(0)).toEqual('mytext1');
            expect(doc.getLine(1)).toEqual('');
            expect(doc.getLine(2)).toEqual('* mytext2');
            expect(doc.getLine(3)).toEqual('');
            expect(doc.getLine(4)).toEqual('mytext3');
            expect(doc.getLine(5)).toEqual('mytext4');
            expect(doc.getLine(6)).toEqual('# myheading');
        });
        it('add blank at start & end of ul when blank line not exists with selection', () => {
            const sourceText = ['mytext1', 'mytext2', 'mytext3', 'mytext4', '# myheading'];

            cm.setValue(sourceText.join('\n'));
            doc.setSelection({
                line: 1,
                ch: 0
            }, {
                line: 2,
                ch: 4
            });
            UL.exec(mde);

            expect(doc.getLine(0)).toEqual('mytext1');
            expect(doc.getLine(1)).toEqual('');
            expect(doc.getLine(2)).toEqual('* mytext2');
            expect(doc.getLine(3)).toEqual('* mytext3');
            expect(doc.getLine(4)).toEqual('');
            expect(doc.getLine(5)).toEqual('mytext4');
            expect(doc.getLine(6)).toEqual('# myheading');
        });
        it('do not add blank at start & end of ul when already blank line exists with selection', () => {
            const sourceText = ['mytext1', '', '1. mytext2', '1. mytext3', '', 'mytext4', '# myheading'];

            cm.setValue(sourceText.join('\n'));
            doc.setSelection({
                line: 2,
                ch: 0
            }, {
                line: 3,
                ch: 4
            });
            UL.exec(mde);

            expect(doc.getLine(0)).toEqual('mytext1');
            expect(doc.getLine(1)).toEqual('');
            expect(doc.getLine(2)).toEqual('* mytext2');
            expect(doc.getLine(3)).toEqual('* mytext3');
            expect(doc.getLine(4)).toEqual('');
            expect(doc.getLine(5)).toEqual('mytext4');
            expect(doc.getLine(6)).toEqual('# myheading');
        });
    });
});
