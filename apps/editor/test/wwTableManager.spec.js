'use strict';

var WysiwygEditor = require('../src/js/wysiwygEditor'),
    EventManager = require('../src/js/eventManager'),
    WwTableManager = require('../src/js/wwTableManager');

describe('WwTableManager', function() {
    var $container, em, wwe, mgr;

    beforeEach(function(done) {
        $container = $('<div />');

        $('body').append($container);

        em = new EventManager();

        wwe = new WysiwygEditor($container, null, em);

        wwe.init(function() {
            mgr = new WwTableManager(wwe);
            done();
        });
    });

    //we need to wait squire input event process
    afterEach(function(done) {
        setTimeout(function() {
            $('body').empty();
            done();
        });
    });

    it('_isInTable() check if passed range is in table', function() {
        var range = wwe.getEditor().getSelection().cloneRange();
        wwe.getEditor().setHTML('<table><thead><tr><th><br></th><th><br></th></tr></thead><tbody><tr><td><br></td><td><br></td></tr></tbody></table>');
        range.setStart(wwe.get$Body().find('td')[0], 0);
        range.collapse(true);

        expect(mgr._isInTable(range)).toEqual(true);
    });

    describe('_appendBrIfTdOrThNotHaveAsLastChild()', function() {
        beforeEach(function() {
            wwe.getEditor().setHTML('<table><thead><tr><th>1234</th></tr></thead><tbody><tr><td>1123</td></tr></tbody></table>');
            wwe.get$Body().find('br').remove();
        });

        it('append br if td or th does not have br as lastchild, td case', function() {
            var range = wwe.getEditor().getSelection().cloneRange();
            range.setStart(wwe.get$Body().find('td')[0].childNodes[0], 2);
            range.collapse(true);

            mgr._appendBrIfTdOrThNotHaveAsLastChild(range);

            expect(wwe.get$Body().find('td').eq(0).find('br').length).toEqual(1);
        });

        it('append br if td or th does not have br as lastchild, th case', function() {
            var range = wwe.getEditor().getSelection().cloneRange();
            range.setStart(wwe.get$Body().find('th')[0].childNodes[0], 2);
            range.collapse(true);

            mgr._appendBrIfTdOrThNotHaveAsLastChild(range);

            expect(wwe.get$Body().find('th').eq(0).find('br').length).toEqual(1);
        });
    });

    describe('Events', function() {
        it('remove last br in td or th when getValue', function() {
            wwe.setValue('<table><thead><tr><th>wef<br>wef<br></th></tr></thead><tbody><tr><td>waf<br>waef<br></td></tr></tbody></table>');
            expect(wwe.getValue().replace(/\<br \/>/g, '<br>')).toEqual('<table><thead><tr><th>wef<br>wef</th></tr></thead><tbody><tr><td>waf<br>waef</td></tr></tbody></table>');
        });

        it('empty td or th won\'t be deleted by getValue', function() {
            wwe.setValue('<table><thead><tr><th><br></th></tr></thead><tbody><tr><td><br></td></tr></tbody></table>');
            expect(wwe.getValue()).toEqual('<table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table>');
        });
    });
});
