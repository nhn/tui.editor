import WysiwygEditor from '../src/js/wysiwygEditor';
import MarkdownEditor from '../src/js/MarkdownEditor';
import EventManager from '../src/js/eventManager';

describe('WysiwygEditor', () => {
    let $container, $container2, em, wwe, mde;

    beforeEach(() => {
        const $body = $('body');
        $container = $('<div />');
        $container2 = $('<div />');

        $body.append($container);
        $body.append($container2);

        em = new EventManager();

        wwe = new WysiwygEditor($container, em);
        mde = new MarkdownEditor($container2, em);

        wwe.init();
        mde.init();

        wwe.editor.focus();
    });

    // we need to wait squire input event process
    afterEach(done => {
        setTimeout(() => {
            $('body').empty();
            done();
        });
    });

    describe('manager handling', () => {
        it('add and get manager independent of editor type', () => {
            const manager = jasmine.createSpy('manager');
            wwe.componentManager.addManager('myManager', manager);

            expect(manager).toHaveBeenCalledWith(wwe);
            expect(wwe.componentManager.getManager('myManager')).toBeDefined();
            expect(mde.componentManager.getManager('myManager')).toBeUndefined();
        });

        it('add manager only passing manager constructor', () => {
            const manager = () => ({name: 'myManager'});

            mde.componentManager.addManager(manager);

            expect(mde.componentManager.getManager('myManager')).toBeDefined();
            expect(wwe.componentManager.getManager('myManager')).toBeUndefined();
        });
    });
});
