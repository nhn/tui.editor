import Task from '../../src/js/wysiwygCommands/task';
import WwTaskManager from '../../src/js/wwTaskManager';
import WysiwygEditor from '../../src/js/wysiwygEditor';
import EventManager from '../../src/js/eventManager';

describe('Task', () => {
    let wwe, sq;

    beforeEach(() => {
        const $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, new EventManager());

        wwe.init();

        sq = wwe.getEditor();
        wwe.addManager(WwTaskManager);
        wwe.getEditor().focus();
    });

    //we need to wait squire input event process
    afterEach(done => {
        setTimeout(() => {
            $('body').empty();
            done();
        });
    });

    it('add Task', () => {
        const range = sq.getSelection().cloneRange();
        range.setStart(wwe.get$Body().find('div')[0], 0);
        range.collapse(true);
        sq.setSelection(range);

        Task.exec(wwe);

        expect(wwe.get$Body().find('ul li.task-list-item[data-te-task]').length).toEqual(1);
    });

    it('if already in empty task, dont do anything', () => {
        const range = sq.getSelection().cloneRange();

        sq.setHTML('<div>text</div>');

        range.setStart(wwe.get$Body().find('div')[0], 1);
        range.collapse(true);
        sq.setSelection(range);

        Task.exec(wwe);

        expect(wwe.get$Body().find('ul li.task-list-item[data-te-task]').length).toEqual(1);

        Task.exec(wwe);

        expect(wwe.get$Body().find('ul li.task-list-item[data-te-task]').length).toEqual(1);
    });

    it('add input too if there is nested task list', () => {
        const range = sq.getSelection().cloneRange();

        sq.setHTML('<ul><li><div><br></div><ul><li data-te-task class="task-list-item"></li></ul>');

        range.setStart(wwe.get$Body().find('ul div')[0], 0);
        range.collapse(true);

        sq.setSelection(range);

        Task.exec(wwe);

        expect(wwe.get$Body().find('ul li.task-list-item[data-te-task]').length).toEqual(2);
    });
});
