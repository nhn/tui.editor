import Heading from '../../src/js/wysiwygCommands/heading';
import WysiwygEditor from '../../src/js/wysiwygEditor';
import EventManager from '../../src/js/eventManager';

describe('Heading', () => {
    let wwe;

    beforeEach(() => {
        const $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, new EventManager());

        wwe.init();
        wwe.getEditor().focus();
    });

    //we need to wait squire input event process
    afterEach(done => {
        setTimeout(() => {
            $('body').empty();
            done();
        });
    });

    it('add heading to current selection or cursor', () => {
        const range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('text');

        range.selectNodeContents(wwe.get$Body()[0].childNodes[0]);
        range.collapse(true);

        wwe.getEditor().setSelection(range);

        Heading.exec(wwe, 1);

        expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('<h1>text</h1>');
    });


    it('set heading tag 1~6 rotation', () => {
        const range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('text');

        range.selectNodeContents(wwe.get$Body()[0].childNodes[0]);
        range.collapse(true);
        wwe.getEditor().setSelection(range);

        Heading.exec(wwe, 1);
        expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('<h1>text</h1>');

        Heading.exec(wwe, 2);
        expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('<h2>text</h2>');

        Heading.exec(wwe, 3);
        expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('<h3>text</h3>');

        Heading.exec(wwe, 4);
        expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('<h4>text</h4>');

        Heading.exec(wwe, 5);
        expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('<h5>text</h5>');

        Heading.exec(wwe, 6);
        expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('<h6>text</h6>');
    });
});
