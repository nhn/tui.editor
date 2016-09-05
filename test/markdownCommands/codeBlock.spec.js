import CodeBlock from '../../src/js/markdownCommands/codeBlock';
import MarkdownEditor from '../../src/js/markdownEditor';
import EventManager from '../../src/js/eventManager';

describe('CodeBlock', () => {
    let cm, doc, mde;

    beforeEach(() => {
        const $container = $('<div />');

        $('body').append($container);

        mde = new MarkdownEditor($container, new EventManager());

        mde.init();

        cm = mde.getEditor();

        const sourceText = ['mytext1', '', 'mytext2', 'mytext3'];

        cm.setValue(sourceText.join('\n'));
        doc = cm.getDoc();
    });

    afterEach(() => {
        $('body').empty();
    });

    it('Add code block in empty line', () => {
        doc.setCursor(1, 0);

        CodeBlock.exec(mde);

        expect(cm.getValue()).toEqual(['mytext1', '', '``` ', '', '```', '', 'mytext2', 'mytext3'].join('\n'));
        expect(cm.getCursor().line).toEqual(3);
    });

    it('Add code block in line that has text', () => {
        doc.setCursor(0, 7);

        CodeBlock.exec(mde);

        expect(cm.getValue()).toEqual(['mytext1', '', '``` ', '', '```', '', '', 'mytext2', 'mytext3'].join('\n'));
        expect(doc.getCursor().line).toEqual(3);
    });
});
