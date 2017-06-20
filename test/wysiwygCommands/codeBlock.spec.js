import CodeBlock from '../../src/js/wysiwygCommands/codeBlock';
import CodeBlockManager from '../../src/js/wwCodeBlockManager';
import WysiwygEditor from '../../src/js/wysiwygEditor';
import EventManager from '../../src/js/eventManager';

describe('CodeBlock', () => {
    let wwe, sq, $body;

    beforeEach(() => {
        const $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, new EventManager());

        wwe.init();
        wwe.componentManager.addManager('codeblock', CodeBlockManager);

        sq = wwe.getEditor();
        $body = wwe.get$Body();
        sq.focus();
    });

    //we need to wait squire input event process
    afterEach(done => {
        setTimeout(() => {
            $('body').empty();
            done();
        });
    });

    it('add CodeBlock', () => {
        CodeBlock.exec(wwe);

        expect($body.find('pre').length).toEqual(1);
        expect($body.find('pre div').length).toEqual(1);
        expect($body.find('pre').attr('data-te-codeblock')).toBeDefined();
    });
    it('add CodeBlock with language', () => {
        CodeBlock.exec(wwe, 'javascript');

        expect($body.find('pre').hasClass('te-content-codeblock-1')).toBe(true);
        expect($body.find('pre').attr('data-language')).toEqual('javascript');
    });
    it('add CodeBlock with selection', () => {
        wwe.setValue('<div>hello, my name is code</div>');

        const range = wwe.getEditor().getSelection();
        range.setStart(wwe.get$Body().children().eq(0)[0].firstChild, 0);
        range.setEnd(wwe.get$Body().children().eq(0)[0].firstChild, 5);

        sq.setSelection(range);

        CodeBlock.exec(wwe);

        expect($body.find('pre').length).toEqual(1);
        expect($body.find('pre div').length).toEqual(1);
        expect($body.find('div').eq(0).text()).toEqual('hello');
        expect($body.find('div').eq(1).text()).toEqual(', my name is code');
    });
});
