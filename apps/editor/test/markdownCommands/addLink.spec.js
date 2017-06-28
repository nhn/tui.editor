import AddLink from '../../src/js/markdownCommands/addLink';
import MarkdownEditor from '../../src/js/markdownEditor';
import EventManager from '../../src/js/eventManager';

describe('AddLink', () => {
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

    describe('인자로 들어온 데이터를 이용해 링크구문을 추가한다', () => {
        let data;

        beforeEach(() => {
            data = {
                linkText: 'mylink',
                url: 'http://www.nhnent.com'
            };
        });

        it('빈라인에서 링크가 추가된다', () => {
            doc.setCursor(1, 0);

            AddLink.exec(mde, data);

            expect(doc.getLine(1)).toEqual(`[${data.linkText}](${data.url})`);
        });

        it('영역선택후 링크가 추가된다', () => {
            doc.setSelection({
                line: 0,
                ch: 0
            }, {
                line: 2,
                ch: 7
            });

            AddLink.exec(mde, data);

            expect(doc.getLine(0)).toEqual(`[${data.linkText}](${data.url})`);
            expect(doc.getLine(1)).toEqual('mytext3');
        });
    });
});
