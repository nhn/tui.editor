import task from '../../src/js/markdownCommands/task';
import MarkdownEditor from '../../src/js/markdownEditor';
import EventManager from '../../src/js/eventManager';

describe('task', () => {
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

    describe('add task', () => {
        it('added task', () => {
            doc.setCursor(0, 0);

            task.exec(mde);

            expect(doc.getLine(0)).toEqual('* [ ] mytext1');
        });
    });
});
