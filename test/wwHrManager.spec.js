'use strict';

var WysiwygEditor = require('../src/js/wysiwygEditor'),
    EventManager = require('../src/js/eventManager'),
    WwHrManager = require('../src/js/wwHrManager');

describe('WwHrManager', function() {
    var $container, em, wwe, mgr;

    beforeEach(function(done) {
        $container = $('<div />');

        $('body').append($container);

        em = new EventManager();

        wwe = new WysiwygEditor($container, null, em);

        wwe.init(function() {
            wwe.getEditor()._ignoreChange = true;
            mgr = new WwHrManager(wwe);
            done();
        });
    });

    afterEach(function() {
        $('body').empty();
    });

    describe('_removeHrIfNeed()', function() {
        //같은 부모의 이전 offset의 엘리먼트가 hr일때
        it('remove hr if current is on first offset and previousSibling elemet is hr', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.setValue('<hr><div>abcd<br></div>');

            range.setStart(wwe.getEditor().getDocument().body, 1);
            range.collapse(true);
            mgr._removeHrIfNeed(range, {preventDefault: function() {}});

            expect(wwe.get$Body().find('hr').length).toEqual(0);
        });

        //현재커서가 hr을 가르키는 경우
        it('remove hr current selection is hr', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.setValue('<hr><div>abcd<br></div>');

            range.setStart(wwe.getEditor().getDocument().body, 0);
            range.collapse(true);
            mgr._removeHrIfNeed(range, {preventDefault: function() {}});

            expect(wwe.get$Body().find('hr').length).toEqual(0);
        });

        //현재 같은 부모에서는 이전 엘리먼트가 더이상 없고 부모래밸의 이전 앨리먼트가 hr일경우
        it('remove hr current selections parentNode previousSibling is hr when offset 0', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.setValue('<hr><div><b>abcd</b><<br></div>');

            range.setStart(wwe.get$Body().find('b')[0], 0);
            range.collapse(true);
            mgr._removeHrIfNeed(range, {preventDefault: function() {}});

            expect(wwe.get$Body().find('hr').length).toEqual(0);
        });
    });

    it('unwrap div on hr whene wysiwygSetValueAfter event fire', function() {
        wwe.getEditor().setHTML('<hr><h1>abcd</h1>');

        em.emit('wysiwygSetValueAfter');

        expect(wwe.getEditor().getHTML().replace(/<br \/>|<br>/g, '')).toEqual('<hr><h1>abcd</h1>');
    });
});
