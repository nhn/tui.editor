'use strict';

var Table = require('../../src/js/wysiwygCommands/table'),
    WysiwygEditor = require('../../src/js/wysiwygEditor'),
    EventManager = require('../../src/js/eventManager');

describe('Table', function() {
    var wwe;

    beforeEach(function(done) {
        var $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, null, new EventManager());

        wwe.init(function() {
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

    it('add Table 2x2', function() {
        Table.exec(wwe, 2, 2);

        expect(wwe.get$Body().find('thead tr th').length).toEqual(2);
        expect(wwe.get$Body().find('tbody tr').eq(0).find('td').length).toEqual(2);
    });

    it('add Table 4x3', function() {
        Table.exec(wwe, 4, 3);

        expect(wwe.get$Body().find('thead tr th').length).toEqual(4);
        expect(wwe.get$Body().find('tbody tr').eq(0).find('td').length).toEqual(4);
        expect(wwe.get$Body().find('tbody tr').eq(1).find('td').length).toEqual(4);
    });

    it('table have class', function() {
        Table.exec(wwe, 4, 3);

        expect(wwe.get$Body().find('table').attr('class')).toBeDefined();
    });

    it('first th in table have focus', function() {
        Table.exec(wwe, 4, 3);

        expect(wwe.getEditor().getSelection().startContainer).toBe(wwe.get$Body().find('th')[0]);
    });

    it('add initial data', function() {
        Table.exec(wwe, 2, 3, ['a', 'b', 'c', 'd']);

        expect(wwe.get$Body().find('tbody tr').eq(0).find('td').eq(0).text()).toEqual('a');
        expect(wwe.get$Body().find('tbody tr').eq(0).find('td').eq(1).text()).toEqual('b');
        expect(wwe.get$Body().find('tbody tr').eq(1).find('td').eq(0).text()).toEqual('c');
        expect(wwe.get$Body().find('tbody tr').eq(1).find('td').eq(1).text()).toEqual('d');
        expect(wwe.getEditor().getSelection().startContainer).not.toBe(wwe.get$Body().find('th')[0]);
    });
});
