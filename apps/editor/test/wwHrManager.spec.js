'use strict';

var WysiwygEditor = require('../src/js/wysiwygEditor'),
    EventManager = require('../src/js/eventManager'),
    WwHrManager = require('../src/js/wwHrManager'),
    Hr = require('../src/js/wysiwygCommands/hr');

describe('WwHrManager', function() {
    var $container, em, wwe, mgr;

    beforeEach(function() {
        $container = $('<div />');

        $('body').append($container);

        em = new EventManager();

        wwe = new WysiwygEditor($container, em);

        wwe.init();

        mgr = new WwHrManager(wwe);
        wwe.getEditor().focus();
    });

    //we need to wait squire input event process
    afterEach(function(done) {
        setTimeout(function() {
            $('body').empty();
            done();
        });
    });

    describe('_removeHrOnEnter', function() {
        //현재커서가 hr을 가르키는 경우
        it('remove hr current selection is hr', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.setValue('<div>abcd<br></div>');

            range.setStart(wwe.get$Body()[0], 0);
            range.collapse(true);

            wwe.getEditor().setSelection(range);
            Hr.exec(wwe);

            range.setStart(wwe.get$Body()[0], 0);
            range.collapse(true);

            wwe.getEditor().setSelection(range);

            mgr._removeHrOnEnter(range, {preventDefault: function() {}});

            expect(wwe.get$Body().find('hr').length).toEqual(0);
        });

        //크롬에서 커서 이동시 밑에서 위로 이동했을때 hr위에서 정상적으로 range가 잡히지 않는다
        //그런 상황에서 적용되는 케이스
        it('remove hr if current is on first offset and previousSibling elemet is hr', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.setValue('<hr><div>abcd<br></div>');

            range.setStart(wwe.get$Body()[0], 1);
            range.collapse(true);
            mgr._removeHrOnEnter(range, {preventDefault: function() {}});

            expect(wwe.get$Body().find('hr').length).toEqual(0);
        });

        //hr이후의 엘리먼트가 없을때
        it('remove hr then set cursor to new block when nextSibling is not exists', function() {
            var range = wwe.getEditor().getSelection().cloneRange(),
                newRange;

            wwe.setValue('<div><b>abcd</b><<br></div><hr>');

            range.setStartAfter(wwe.get$Body().children().eq(1)[0]);
            range.collapse(true);
            mgr._removeHrOnEnter(range, {preventDefault: function() {}});

            newRange = wwe.getEditor().getSelection();

            expect(wwe.get$Body().find('hr').length).toEqual(0);
            expect(newRange.startContainer.tagName).toEqual('DIV');
            expect(newRange.startOffset).toEqual(0);
        });

        it('remove hr then set cursor to new block if next sibling is exist', function() {
            var range = wwe.getEditor().getSelection().cloneRange(),
                newRange;

            wwe.setValue('<div><b>abcd</b><<br></div>');

            range.setStart(wwe.get$Body()[0], 0);
            range.collapse(true);

            wwe.getEditor().setSelection(range);
            Hr.exec(wwe);

            range.setStart(wwe.get$Body()[0], 0);
            range.collapse(true);

            wwe.getEditor().setSelection(range);

            mgr._removeHrOnEnter(range, {preventDefault: function() {}});

            newRange = wwe.getEditor().getSelection();

            expect(wwe.get$Body().find('hr').length).toEqual(0);
            expect(newRange.startContainer.tagName).toEqual('DIV');
            expect(newRange.startOffset).toEqual(0);
        });
    });

    describe('_onTypedInHr', function() {
        it('if text content is typed in hr then break new block', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.setValue('<div>abcd<br></div>');

            range.setStart(wwe.get$Body()[0], 0);
            range.collapse(true);

            wwe.getEditor().setSelection(range);
            Hr.exec(wwe);

            range.setStart(wwe.get$Body()[0], 0);
            range.collapse(true);

            wwe.getEditor().setSelection(range);

            mgr._removeHrOnBackspace(range, {preventDefault: function() {}});

            expect(wwe.get$Body().find('hr').length).toEqual(0);
        });
    });


    describe('_removeHrOnBackspace()', function() {
        //현재커서가 hr을 가르키는 경우
        it('remove hr current selection is hr', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.setValue('<div>abcd<br></div>');

            range.setStart(wwe.get$Body()[0], 0);
            range.collapse(true);

            wwe.getEditor().setSelection(range);
            Hr.exec(wwe);

            range.selectNode(wwe.get$Body().find('hr')[0]);
            range.collapse(true);

            mgr._removeHrOnBackspace(range, {preventDefault: function() {}});

            expect(wwe.get$Body().find('hr').length).toEqual(0);
        });

        //현재 같은 부모에서는 이전 엘리먼트가 더이상 없고 부모래밸의 이전 앨리먼트가 hr일경우
        it('remove hr current selection\'s parentNode previousSibling is hr when offset 0', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.setValue('<hr><div><b>abcd</b><<br></div>');

            range.setStart(wwe.get$Body().find('b')[0], 0);
            range.collapse(true);

            mgr._removeHrOnBackspace(range, {preventDefault: function() {}});

            expect(wwe.get$Body().find('hr').length).toEqual(0);
        });

        //크롬에서 커서 이동시 밑에서 위로 이동했을때 hr위에서 정상적으로 range가 잡히지 않는다
        //그런 상황에서 적용되는 케이스
        it('remove hr if current is on first offset and previousSibling elemet is hr', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.setValue('<hr><div>abcd<br></div>');

            range.setStart(wwe.get$Body()[0], 1);
            range.collapse(true);
            mgr._removeHrOnBackspace(range, {preventDefault: function() {}});

            expect(wwe.get$Body().find('hr').length).toEqual(0);
        });
    });

    it('unwrap div on hr whene wysiwygSetValueAfter event fire', function() {
        wwe.getEditor().setHTML('<hr><h1>abcd</h1>');

        em.emit('wysiwygSetValueAfter');

        expect(wwe.getEditor().getHTML().replace(/<br \/>|<br>/g, '')).toEqual('<hr><h1>abcd</h1>');
    });

    describe('_wrapDefaultBlockToOrphanTexts()', function() {
        it('wrap selection defulat block to all orphan texts', function() {
            wwe.get$Body().html('abcdef<div>ghijk<br></div>');

            mgr._wrapDefaultBlockToOrphanTexts();

            expect(wwe.getEditor().getHTML().replace(/<br \/>|<br>/g, '')).toEqual('<div>abcdef</div><div>ghijk</div>');
        });
    });
});
