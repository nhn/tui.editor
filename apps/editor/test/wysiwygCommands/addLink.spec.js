import AddLink from '../../src/js/wysiwygCommands/addLink';
import WysiwygEditor from '../../src/js/wysiwygEditor';
import EventManager from '../../src/js/eventManager';

describe('AddLink', () => {
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

    it('add link to current selection', () => {
        const range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('line');

        range.selectNodeContents(wwe.get$Body().find('div')[0].firstChild);
        wwe.getEditor().setSelection(range);

        AddLink.exec(wwe, {url: '#url', text: 'inputText'});

        expect(wwe.get$Body().find('a').length).toEqual(1);
        expect(wwe.get$Body().find('a').attr('href')).toEqual('#url');
        expect(wwe.get$Body().find('a').text()).toEqual('line');
    });

    it('add link with no selection text', () => {
        AddLink.exec(wwe, {url: '#url', linkText: 'inputText'});

        expect(wwe.get$Body().find('a').length).toEqual(1);
        expect(wwe.get$Body().find('a').attr('href')).toEqual('#url');
        expect(wwe.get$Body().find('a').text()).toEqual('inputText');
    });
});
