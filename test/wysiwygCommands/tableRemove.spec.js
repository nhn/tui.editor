'use strict';

var RemoveTable = require('../../src/js/wysiwygCommands/tableRemove'),
    WysiwygEditor = require('../../src/js/wysiwygEditor'),
    EventManager = require('../../src/js/eventManager');

describe('Table - Remove', function() {
    var wwe;

    beforeEach(function() {
        var $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, null, new EventManager());

        wwe.init();
    });

    //we need to wait squire input event process
    afterEach(function(done) {
        setTimeout(function() {
            $('body').empty();
            done();
        });
    });

    it('remove table that have selected', function() {
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

        RemoveTable.exec(wwe);

        expect(wwe.get$Body().find('table').length).toEqual(0);
    });
});
