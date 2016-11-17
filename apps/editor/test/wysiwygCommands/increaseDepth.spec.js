import IncreaseDepth from '../../src/js/wysiwygCommands/increaseDepth';
import WwTaskManager from '../../src/js/wwTaskManager';
import WysiwygEditor from '../../src/js/wysiwygEditor';
import EventManager from '../../src/js/eventManager';

describe('IncreaseDepth', () => {
    let wwe, sq;

    beforeEach(() => {
        const $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, new EventManager());

        wwe.init();

        sq = wwe.getEditor();
        wwe.componentManager.addManager(WwTaskManager);
        sq.focus();

        wwe.get$Body().html([
            '<ul>',
            '<li data-te-task class="task-list-item"><div>abcdef</div></li>',
            '<li data-te-task class="task-list-item"><div>abcde</div></li>',
            '<li data-te-task class="task-list-item"><div> </div></li>',
            '</ul>'
        ].join(''));
    });

    //we need to wait squire input event process
    afterEach(done => {
        setTimeout(() => {
            $('body').empty();
            done();
        });
    });

    it('success when it not first li.', () => {
        const range = wwe.getEditor().getSelection().cloneRange();

        range.setStart(wwe.get$Body().find('div')[1].firstChild, 0);
        range.collapse(true);

        sq.setSelection(range);

        IncreaseDepth.exec(wwe);

        expect(sq.get$Body().find('ul li ul').length).toEqual(1);
        expect(sq.get$Body().find('ul li ul li').length).toEqual(1);
        expect(sq.get$Body().find('ul li ul li').hasClass('task-list-item')).toBe(true);
    });
    it('fail when it does not have previous li.', () => {
        const range = wwe.getEditor().getSelection().cloneRange();

        range.setStart(wwe.get$Body().find('div')[0].firstChild, 0);
        range.collapse(true);

        sq.setSelection(range);

        IncreaseDepth.exec(wwe);

        expect(sq.get$Body().find('ul li ul').length).toEqual(0);
        expect(sq.get$Body().find('ul li ul li').length).toEqual(0);
        expect(sq.get$Body().find('ul li ul li').hasClass('task-list-item')).toBe(false);
    });
    describe('should increase depth when cursor', () => {
        it('at startOffset 0.', () => {
            const range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('div')[1].firstChild, 0);
            range.collapse(true);

            sq.setSelection(range);

            IncreaseDepth.exec(wwe);

            expect(sq.get$Body().find('ul li ul').length).toEqual(1);
            expect(sq.get$Body().find('ul li ul li').length).toEqual(1);
            expect(sq.get$Body().find('ul li ul li').hasClass('task-list-item')).toBe(true);
        });
        it('at startOffset 1.', () => {
            const range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('div')[1].firstChild, 1);
            range.collapse(true);

            sq.setSelection(range);

            IncreaseDepth.exec(wwe);

            expect(sq.get$Body().find('ul li ul').length).toEqual(1);
            expect(sq.get$Body().find('ul li ul li').length).toEqual(1);
            expect(sq.get$Body().find('ul li ul li').hasClass('task-list-item')).toBe(true);
        });
    });
    it('should increase ordinary list', () => {
        const range = wwe.getEditor().getSelection().cloneRange();

        wwe.get$Body().html([
            '<ul>',
            '<li data-te-task class="task-list-item"><div>abcdef</div></li>',
            '<li data-te-task class="task-list-item"><div>abcde</div>',
            '<ul>',
            '<li data-te-task class="task-list-item">',
            '<ul>',
            '<li data-te-task class="task-list-item"><div>abcdef</div></li>',
            '</ul>',
            '</ul>',
            '</li>',
            '</li>',
            '</ul>'
        ].join(''));

        range.setStart(wwe.get$Body().find('div')[1].firstChild, 1);
        range.collapse(true);

        sq.setSelection(range);

        IncreaseDepth.exec(wwe);

        expect(sq.get$Body().find('ul').length).toEqual(3);
        expect(sq.get$Body().find('ul > li > ul > li > ul > li').length).toEqual(1);
        expect(sq.get$Body().find('ul > li > ul > li > ul > li').hasClass('task-list-item')).toBe(true);
    });
});
