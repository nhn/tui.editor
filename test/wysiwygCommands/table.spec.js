'use strict';

var Table= require('../../src/js/wysiwygCommands/table'),
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

    afterEach(function() {
        $('body').empty();
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
});
