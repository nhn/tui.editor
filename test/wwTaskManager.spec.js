'use strict';

var WysiwygEditor = require('../src/js/wysiwygEditor'),
    EventManager = require('../src/js/eventManager'),
    WwTaskManager = require('../src/js/wwTaskManager');

describe('WwTaskManager', function() {
    var $container, em, wwe, mgr;

    beforeEach(function() {
        $container = $('<div />');

        $('body').append($container);

        em = new EventManager();

        wwe = new WysiwygEditor($container, em);

        wwe.init();

        mgr = new WwTaskManager(wwe);
    });

    //we need to wait squire input event process
    afterEach(function(done) {
        setTimeout(function() {
            $('body').empty();
            done();
        });
    });

    describe('_unformatTaskIfNeedOnBackspace()', function() {
        it('remove input if current selection is right of input with one space', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.getEditor()
                .setHTML('<ul><li class="task-list-item"><div><input type="checkbox" />&nbsp;text</div></li></ul>');

            range.setStart(wwe.getEditor().getDocument().getElementsByTagName('INPUT')[0].nextSibling, 1);
            range.collapse(true);
            mgr._unformatTaskIfNeedOnBackspace(range);

            expect(wwe.get$Body().find('input').length).toEqual(0);
            expect(wwe.get$Body().find('.task-list-item').length).toEqual(0);
        });

        it('remove empty task', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.getEditor().setHTML('<ul><li class="task-list-item"><input type="checkbox" />&nbsp</li></ul>');

            range.setStart(wwe.get$Body().find('li')[0], 2);
            range.collapse(true);
            mgr._unformatTaskIfNeedOnBackspace(range);

            expect(wwe.get$Body().find('input').length).toEqual(0);
            expect(wwe.get$Body().find('.task-list-item').length).toEqual(0);
        });

        it('remove input if current selection is right of input with one space wrapped inline tag', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.get$Body().html('<ul><li class="task-list-item"><input type="checkbox"><b>&nbsp;text</b></li></ul>');

            range.setStart(wwe.getEditor().getDocument().getElementsByTagName('B')[0].firstChild, 1);
            range.collapse(true);
            mgr._unformatTaskIfNeedOnBackspace(range);

            expect(wwe.get$Body().find('input').length).toEqual(0);
            expect(wwe.get$Body().find('.task-list-item').length).toEqual(0);
        });

        it('remove input if current selection has placed at start of task item', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.get$Body().html('<ul><li class="task-list-item"><input type="checkbox" />&nbsp;text</li></ul>');

            range.selectNode(wwe.getEditor().getDocument().getElementsByTagName('INPUT')[0]);
            range.collapse(true);
            mgr._unformatTaskIfNeedOnBackspace(range);

            expect(wwe.get$Body().find('input').length).toEqual(0);
            expect(wwe.get$Body().find('.task-list-item').length).toEqual(0);
        });

        it('dont remove input if current selection has placed at end of task item', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.get$Body().html('<ul><li class="task-list-item"><input type="checkbox" />&nbsp;text</li></ul>');

            range.setStart(wwe.getEditor().getDocument().getElementsByTagName('LI')[0], 2);
            range.collapse(true);
            mgr._unformatTaskIfNeedOnBackspace(range);

            expect(wwe.get$Body().find('input').length).toEqual(1);
            expect(wwe.get$Body().find('.task-list-item').length).toEqual(1);
        });

        it('dont remove necessary input', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.setValue('<ul><li class="task-list-item"><input type="checkbox"> text<b>a</b></li></ul>');

            range.selectNodeContents(wwe.getEditor().getDocument().getElementsByTagName('B')[0]);
            range.collapse(true);
            mgr._unformatTaskIfNeedOnBackspace(range);

            expect(wwe.get$Body().find('input').length).toEqual(1);
            expect(wwe.get$Body().find('.task-list-item').length).toEqual(1);
        });
    });

    describe('_unformatTaskIfNeedOnEnter()', function() {
        it('remove input if current selection is right of input with one space', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.setValue('<ul><li class="task-list-item"><div><input type="checkbox" />&nbsp;</div></li></ul>');

            range.selectNode(wwe.get$Body().find('input')[0]);
            range.collapse(true);
            mgr._unformatTaskIfNeedOnEnter(range);

            expect(wwe.get$Body().find('input').length).toEqual(0);
            expect(wwe.get$Body().find('task-list-item').length).toEqual(0);
            expect(wwe.getEditor().getSelection().startContainer.tagName).toEqual('DIV');
        });
        it('dont remove input if current task has sub task', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.setValue(['<ul><li class="task-list-item"><div><input type="checkbox" />&nbsp;</div>',
                '<ul><li class="task-list-item"><div><input type="checkbox" />&nbsp;sub</div></li></ul></li></ul>'].join(''));

            range.setStartAfter(wwe.get$Body().find('input')[0]);
            range.collapse(true);

            mgr._unformatTaskIfNeedOnEnter(range);

            expect(wwe.get$Body().find('input').length).toEqual(2);
            expect(wwe.get$Body().find('.task-list-item').length).toEqual(2);
        });
    });

    describe('_removeTaskInputInWrongPlace', function() {
        it('remove inputbox in wrong parent', function() {
            wwe.get$Body().html('<ul><li><input type="checkbox" /></li></ul>');

            mgr._removeTaskInputInWrongPlace();

            expect(wwe.getValue()).toEqual('<ul><li></li></ul>');
        });

        it('remove inputbox in wrong place', function() {
            wwe.get$Body().html('<ul><li class="task-list-item"><input type="checkbox"> text<input type="checkbox"></li></ul>');

            mgr._removeTaskInputInWrongPlace();

            expect(wwe.getValue()).toEqual('<ul><li class="task-list-item"><input type="checkbox">text</li></ul>');
        });
    });

    describe('_unformatIncompleteTask', function() {
        it('if wysiwyg contents has incomplete task then make it list', function() {
            //squire의 setHTML을 이용하면 IE10에서 중간 빈 텍스트노드가 생긴다.
            wwe.get$Body().html('<ul><li class="task-list-item">task1</li><li class="task-list-item"><input type="checkbox">&nbsp;task2</li></ul>');

            mgr._unformatIncompleteTask();

            expect(wwe.get$Body().find('.task-list-item').length).toEqual(1);
        });
    });

    describe('_addCheckedAttrToCheckedInput', function() {
        it('checked checkbox should have checked attribute', function() {
            wwe.getEditor().setHTML('<input type="checkbox" id="task" />');
            wwe.getEditor().getDocument().getElementById('task').checked = true;

            mgr._addCheckedAttrToCheckedInput();

            //use toLowerCase and indexOf because IE attribute order,name issue
            expect(wwe.getEditor().getDocument().getElementById('task').outerHTML.toLowerCase().indexOf('checked="checked"')).not.toEqual(-1);
        });

        it('unchecked checkbox should not have checked attribute', function() {
            wwe.getEditor().setHTML('<input type="checkbox" id="task" checked="checked" />');
            wwe.getEditor().getDocument().getElementById('task').checked = false;

            mgr._addCheckedAttrToCheckedInput();

            expect(wwe.getEditor().getDocument().getElementById('task').outerHTML.toLowerCase().indexOf('checked="checked"')).toEqual(-1);
        });
    });

    describe('_ensureSpaceNextToTaskInput', function() {
        it('add space next to task input', function() {
            wwe.get$Body().html('<ul><li class="task-list-item"><input type="checkbox">text</li></ul>');

            mgr._ensureSpaceNextToTaskInput();

            expect(wwe.getEditor().getHTML()).toEqual('<ul><li class="task-list-item"><input type="checkbox"> text</li></ul>');
        });

        it('add space next to task input with inline tag', function() {
            wwe.get$Body().html('<ul><li class="task-list-item"><input type="checkbox"><span>text</span></li></ul>');

            mgr._ensureSpaceNextToTaskInput();

            expect(wwe.getEditor().getHTML()).toEqual('<ul><li class="task-list-item"><input type="checkbox"> <span>text</span></li></ul>');
            expect(wwe.get$Body().find('li')[0].childNodes[1].textContent).toEqual(' ');
        });
    });

    describe('Events', function() {
        it('remove unused inputbox when wysiwygRangeChangeAfter event fire', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.get$Body().html('<div><input type="checkbox" />test<br></div>');

            range.selectNode(wwe.getEditor().getDocument().getElementsByTagName('div')[0].firstChild);
            range.collapse(true);
            wwe.getEditor().setSelection(range);

            em.emit('wysiwygRangeChangeAfter');

            expect(wwe.getValue().replace(/<br \/>/g, '')).toBe('test');
        });

        it('put space and ZWS into input tag next when wysiwygSetValueAfter fire', function() {
            wwe.getEditor().setHTML('<ul><li class="task-list-item"><input type="checkbox">TASK</li></ul>');

            em.emit('wysiwygSetValueAfter');

            expect(wwe.get$Body().find('li')[0].textContent).toEqual(' TASK');
        });

        it('remove task-list class of element, it may block to merge normal list and task list when wysiwygSetValueAfter fire', function() {
            wwe.getEditor().setHTML('<ul><li class="task-list-item"><input type="checkbox">TASK</li></ul>');

            em.emit('wysiwygSetValueAfter');

            expect(wwe.get$Body().find('ul').eq(0).hasClass('task-list')).toEqual(false);
        });

        it('add one space to task-list-item input\'s next for safari cursor issue', function() {
            wwe.getEditor().setHTML('<ul><li class="task-list-item"><input type="checkbox">TASK<li></li></ul>');

            em.emit('wysiwygSetValueAfter');

            expect(wwe.get$Body().find('.task-list-item').eq(0).text()).toEqual(' TASK');
        });

        it('remove space next to input when getValue()', function() {
            wwe.getEditor().setHTML('<ul><li class="task-list-item"><input type="checkbox">TASK</li></ul>');
            em.emit('wysiwygGetValueBefore');
            expect(wwe.getValue()).toEqual('<ul><li class="task-list-item"><input type="checkbox">TASK</li></ul>');
        });
    });

    describe('formatTask()', function() {
        it('Format task to passed node', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.getEditor().setHTML('<ul><li><div><br></div></li></ul>');

            range.setStart(wwe.get$Body().find('div')[0], 0);
            range.collapse(true);

            mgr.formatTask(range.startContainer);

            expect(wwe.get$Body().find('input').length).toEqual(1);
            expect(wwe.get$Body().find('.task-list-item').length).toEqual(1);
        });
        it('Format task to passed node that doesnt have any div', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.getEditor().setHTML('<ul><li><br></li></ul>');

            range.setStart(wwe.get$Body().find('li')[0], 0);
            range.collapse(true);

            mgr.formatTask(range.startContainer);

            expect(wwe.get$Body().find('li input').length).toEqual(1);
            expect(wwe.get$Body().find('.task-list-item').length).toEqual(1);
        });
    });

    describe('unformatTask()', function() {
        it('unformat task to passed node', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.getEditor()
                .setHTML('<ul><li class="task-list-item"><div><input type="checkbox" />&nbsp;test</div></li></ul>');

            range.setStart(wwe.get$Body().find('li')[0], 0);
            range.collapse(true);

            mgr.unformatTask(range.startContainer);

            expect(wwe.get$Body().find('input').length).toEqual(0);
            expect(wwe.get$Body().find('.task-list-item').length).toEqual(0);
            expect(wwe.get$Body().find('div').text()).toEqual('test');
        });
	it('dont unformat to sub tasks', function() {
	    var range = wwe.getEditor().getSelection().cloneRange();

            wwe.getEditor()
                .setHTML(['<ul><li class="task-list-item"><div><input type="checkbox" />&nbsp;test1</div>',
			  '<ul><li class="task-list-item"><div><input type="checkbox" />&nbsp;test2</div></li></ul></li></ul>'].join(''));

            range.setStart(wwe.get$Body().find('li')[0], 0);
            range.collapse(true);

            mgr.unformatTask(range.startContainer);

            expect(wwe.get$Body().find('input').length).toEqual(1);
            expect(wwe.get$Body().find('.task-list-item').length).toEqual(1);
            expect(wwe.get$Body().find('div').eq(0).text()).toEqual('test1');
	});
    });
});
