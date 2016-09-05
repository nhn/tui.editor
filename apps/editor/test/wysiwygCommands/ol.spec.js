import OL from '../../src/js/wysiwygCommands/ol';
import WwTaskManager from '../../src/js/wwTaskManager';
import WysiwygEditor from '../../src/js/wysiwygEditor';
import EventManager from '../../src/js/eventManager';

describe('OL', () => {
    let wwe, sq;

    beforeEach(() => {
        const $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, new EventManager());

        wwe.init();

        sq = wwe.getEditor();
        wwe.addManager('task', WwTaskManager);
        sq.focus();
    });

    //we need to wait squire input event process
    afterEach(done => {
        setTimeout(() => {
            $('body').empty();
            done();
        });
    });

    it('add OL', () => {
        OL.exec(wwe);

        expect(wwe.get$Body().find('ol').length).toEqual(1);
        expect(wwe.get$Body().find('li').length).toEqual(1);
    });

    it('if have task in range then remove task and change to ul', () => {
        const range = sq.getSelection().cloneRange();

        sq.setHTML('<ul><li data-te-task class="task-list-item"><div>test</div></li></ul>');

        range.setStart(wwe.get$Body().find('li')[0], 1);
        range.collapse(true);

        sq.setSelection(range);

        OL.exec(wwe);

        expect(wwe.get$Body().find('ul li.task-list-item[data-te-task]').length).toEqual(0);
        expect(wwe.get$Body().find('ol').length).toEqual(1);
        expect(wwe.get$Body().find('li').length).toEqual(1);
        expect(wwe.get$Body().find('li').text()).toEqual('test');
    });
});
