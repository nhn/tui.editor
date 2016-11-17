import Task from '../../src/js/wysiwygCommands/task';
import WwListManager from '../../src/js/wwListManager';
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
        wwe.componentManager.addManager(WwTaskManager);
        wwe.componentManager.addManager(WwListManager);
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

    it('if already in empty task, unformat task', () => {
        const range = sq.getSelection().cloneRange();

        sq.setHTML('<div>text</div>');

        range.setStart(wwe.get$Body().find('div')[0], 1);
        range.collapse(true);
        sq.setSelection(range);

        Task.exec(wwe);

        expect(wwe.get$Body().find('ul li.task-list-item[data-te-task]').length).toEqual(1);

        Task.exec(wwe);

        expect(wwe.get$Body().find('ul li.task-list-item[data-te-task]').length).toEqual(0);
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

    it('add Task with selection', () => {
        const $body = sq.get$Body();
        const $div1 = $('<div>hello</div>');
        const $div2 = $('<div>world</div>');
        const $div3 = $('<div>i`m</div>');
        const $div4 = $('<div>fine</div>');

        $body.append($div1);
        $body.append($div2);
        $body.append($div3);
        $body.append($div4);

        const range = sq.getSelection();
        range.setStart($div1[0], 0);
        range.setEnd($div4[0], 1);
        sq.setSelection(range);

        Task.exec(wwe);

        expect(wwe.get$Body().find('ul').length).toEqual(1);
        expect(wwe.get$Body().find('li.task-list-item').length).toEqual(4);
        expect(wwe.get$Body().find('li').length).toEqual(4);
    });

    it('add Task with selection ul within', () => {
        const $body = sq.get$Body();
        const $div1 = $('<div>hello</div>');
        const $div2 = $('<div>world</div>');
        const $div3 = $('<div>i`m</div>');
        const $ol = $('<ul><li><div>fine</div></li></ul>');

        $body.append($ol);
        $body.append($div1);
        $body.append($div2);
        $body.append($div3);

        const range = sq.getSelection();

        range.setStart($ol[0].firstChild.firstChild.firstChild, 0);
        range.setEnd($div3[0], 1);
        sq.setSelection(range);

        Task.exec(wwe);

        expect(wwe.get$Body().find('ul').length).toEqual(1);
        expect(wwe.get$Body().find('li').length).toEqual(4);
        expect(wwe.get$Body().find('li.task-list-item').length).toEqual(4);
    });

    it('change UL to Task', () => {
        const $body = sq.get$Body();
        const $ul = $('<ul><li><div>fine</div></li></ul>');

        $body.append($ul);

        const range = sq.getSelection();

        range.setStart($ul[0].firstChild.firstChild.firstChild, 1);
        range.collapse(true);
        sq.setSelection(range);

        Task.exec(wwe);

        expect(wwe.get$Body().find('ul').length).toEqual(1);
        expect(wwe.get$Body().find('li.task-list-item').length).toEqual(1);
        expect(wwe.get$Body().find('li').length).toEqual(1);
    });

    it('change OL to Task', () => {
        const $body = sq.get$Body();
        const $ol = $('<ol><li><div>fine</div></li></ol>');

        $body.append($ol);

        const range = sq.getSelection();

        range.setStart($ol[0].firstChild.firstChild.firstChild, 1);
        range.collapse(true);
        sq.setSelection(range);

        Task.exec(wwe);

        expect(wwe.get$Body().find('ol').length).toEqual(1);
        expect(wwe.get$Body().find('li.task-list-item').length).toEqual(1);
        expect(wwe.get$Body().find('li').length).toEqual(1);
    });

    it('change UL to Task with selection', () => {
        const $body = sq.get$Body();
        const $ul = $('<ul><li><div>fine</div></li><li><div>thank you</div></li></ul>');

        $body.append($ul);

        const range = sq.getSelection();

        range.setStart($ul[0].firstChild.firstChild.firstChild, 1);
        range.setEnd($ul[0].firstChild.nextSibling.firstChild, 1);
        sq.setSelection(range);

        Task.exec(wwe);

        expect(wwe.get$Body().find('ul').length).toEqual(1);
        expect(wwe.get$Body().find('li').length).toEqual(2);
        expect(wwe.get$Body().find('li.task-list-item').length).toEqual(2);
    });

    it('change OL to Task with selection', () => {
        const $body = sq.get$Body();
        const $ol = $('<ol><li><div>fine</div></li><li><div>thank you</div></li></ol>');

        $body.append($ol);

        const range = sq.getSelection();

        range.setStart($ol[0].firstChild.firstChild.firstChild, 1);
        range.setEnd($ol[0].firstChild.nextSibling.firstChild, 1);
        sq.setSelection(range);

        Task.exec(wwe);

        expect(wwe.get$Body().find('ol').length).toEqual(1);
        expect(wwe.get$Body().find('li.task-list-item').length).toEqual(2);
        expect(wwe.get$Body().find('li').length).toEqual(2);
    });

    it('stop changing format to Task when meet PRE, TABLE element', () => {
        const $body = sq.get$Body();
        const $div1 = $('<div>fine</div>');
        const $div2 = $('<div>thank you</div>');
        const $pre = $('<pre>haha</pre>');
        const $div3 = $('<div>me too</div>');

        $body.append($div1);
        $body.append($div2);
        $body.append($pre);
        $body.append($div3);

        const range = sq.getSelection();

        range.setStart($div1[0], 0);
        range.setEnd($div3[0], 1);
        sq.setSelection(range);

        Task.exec(wwe);

        expect(wwe.get$Body().find('ul').length).toEqual(1);
        expect(wwe.get$Body().children('pre').length).toEqual(1);
        expect(wwe.get$Body().find('li.task-list-item').length).toEqual(2);
        expect(wwe.get$Body().find('li').length).toEqual(2);
    });
});
