'use strict';

var RemoveCol = require('../../src/js/wysiwygCommands/tableRemoveCol'),
    WysiwygEditor = require('../../src/js/wysiwygEditor'),
    EventManager = require('../../src/js/eventManager');

describe('Table - RemoveCol', function() {
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

    it('remove col that have selected cell', function() {
        var sq = wwe.getEditor(),
            range = sq.getSelection().cloneRange();

        sq.setHTML([
            '<table>',
                '<thead>',
                    '<tr><th>1</th><th>2</th></tr>',
                '</thead>',
                '<tbody>',
                    '<tr><td>3</td><td>4</td></tr>',
                    '<tr><td>5</td><td>6</td></tr>',
                '</tbody>',
            '</table>'
        ].join('\n'));

        range.setStartAfter(wwe.get$Body().find('tbody td')[0].firstChild);
        range.collapse(true);

        sq.setSelection(range);

        RemoveCol.exec(wwe);

        expect(wwe.get$Body().find('thead th').length).toEqual(1);
        expect(wwe.get$Body().find('tbody td').length).toEqual(2);
    });

    it('dont remove col if there have only one col', function() {
        var sq = wwe.getEditor(),
            range = sq.getSelection().cloneRange();

        sq.setHTML([
            '<table>',
                '<thead>',
                    '<tr><th>1</th></tr>',
                '</thead>',
                '<tbody>',
                    '<tr><td>3</td></tr>',
                    '<tr><td>5</td></tr>',
                '</tbody>',
            '</table>'
        ].join('\n'));

        range.setStartAfter(wwe.get$Body().find('tbody td')[0].firstChild);
        range.collapse(true);

        sq.setSelection(range);

        RemoveCol.exec(wwe);

        expect(wwe.get$Body().find('thead th').length).toEqual(1);
        expect(wwe.get$Body().find('tbody td').length).toEqual(2);
    });
});
