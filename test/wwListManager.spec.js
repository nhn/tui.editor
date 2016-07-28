'use strict';

var WysiwygEditor = require('../src/js/wysiwygEditor'),
    EventManager = require('../src/js/eventManager'),
    WwListManager = require('../src/js/wwListManager');

describe('WwListManager', function() {
    var $container, em, wwe, mgr;

    beforeEach(function() {
        $container = $('<div />');

        $('body').append($container);

        em = new EventManager();

        wwe = new WysiwygEditor($container, em);

        wwe.init();

        mgr = new WwListManager(wwe);
    });

    //we need to wait squire input event process
    afterEach(function(done) {
        setTimeout(function() {
            $('body').empty();
            done();
        });
    });

    describe('Event', function() {
        it('wysiwygSetValueAfter: wrap list inner to div after setValue', function() {
            var html = '<ul><li>test</li></ul>';
            wwe.setValue(html);

            expect(wwe.get$Body().find('li div').length).toEqual(1);
            expect(wwe.get$Body().find('li div').text()).toEqual('test');
        });
    });

    describe('_findAndRemoveEmptyList()', function() {
        it('remove ul that without li element within.', function() {
            wwe.setValue(['<ul>this will deleted</ul>',
                '<ol>and this too</ol>'].join(''));

            expect(wwe.get$Body().find('ul').length).toEqual(1);
            expect(wwe.get$Body().find('ol').length).toEqual(1);

            mgr._findAndRemoveEmptyList();

            expect(wwe.get$Body().find('ul').length).toEqual(0);
            expect(wwe.get$Body().find('ol').length).toEqual(0);
        });
        it('do not remove when ul have li element within.', function() {
            wwe.setValue([
                '<ul>',
                    '<li><div>survived!</div></li>',
                '</ul>',
                '<ol>',
                    '<li><div>me too!</div></li>',
                '</ol>'].join(''));

            expect(wwe.get$Body().find('ul').length).toEqual(1);
            expect(wwe.get$Body().find('ol').length).toEqual(1);

            mgr._findAndRemoveEmptyList();

            expect(wwe.get$Body().find('ul').length).toEqual(1);
            expect(wwe.get$Body().find('ul li').text()).toEqual('survived!');
            expect(wwe.get$Body().find('ol li').text()).toEqual('me too!');
        });
    });

    describe('_removeBranchListAll', function() {
        beforeEach(function() {
            wwe.getEditor().setHTML([
                '<ul>',
                    '<li>',
                        '<div>t1<br></div>',
                        '<ul>',
                            '<li>',
                                '<ul>',
                                    '<li>',
                                        '<div>t2<br></div>',
                                        '<ul>',
                                            '<li><div>t3<br></div></li>',
                                            '<li><div>t4<br></div></li>',
                                        '</ul>',
                                    '</li>',
                                '</ul>',
                            '</li>',
                            '<li><div>t5</div></li>',
                        '</ul>',
                    '</li>',
                '</ul>'].join(''));
        });
        it('Remove all branch list', function() {
            mgr._removeBranchListAll();

            expect(wwe.get$Body().find('ul').length).toEqual(3);
            expect(wwe.get$Body().find('ul li ul').eq(0).children('li').length).toEqual(2);
            expect(wwe.get$Body().find('ul li ul').eq(0).children('li').eq(0).children('div').text()).toEqual('t2');
            expect(wwe.get$Body().find('ul li ul').eq(0).children('li').eq(1).text()).toEqual('t5');
        });
    });

    describe('Control list blank line', function() {
        it('ul - br - ul', function() {
            var html = [
                '<ul>',
                    '<li><div>1</div></li>',
                '</ul>',
                '<br />',
                '<ul>',
                    '<li><div>2</div></li>',
                '</ul>'
            ].join('');

            var result = mgr._prepareInsertBlankToBetweenSameList(html);

            expect(result.indexOf(':BLANK_LINE:')).not.toBe(-1);
            expect(result.indexOf('<br />')).toBe(-1);
        });

        it('ul - br - br - ul', function() {
            var html = [
                '<ul>',
                    '<li><div>1</div></li>',
                '</ul>',
                '<br />',
                '<br />',
                '<ul>',
                    '<li><div>2</div></li>',
                '</ul>'
            ].join('');

            var result = mgr._prepareInsertBlankToBetweenSameList(html);

            expect(result.indexOf(':BLANK_LINE:')).not.toBe(-1);
            expect(result.indexOf('<br />')).toBe(-1);
        });

        it('ul - ul', function() {
            var html = [
                '<ul>',
                    '<li><div>1</div></li>',
                '</ul>',
                '<ul>',
                    '<li><div>2</div></li>',
                '</ul>'
            ].join('');

            var result = mgr._prepareInsertBlankToBetweenSameList(html);

            expect(result.indexOf(':BLANK_LINE:')).not.toBe(-1);
            expect(result.indexOf('<br />')).toBe(-1);
        });
    });
});
