'use strict';

var AddCol = require('../../src/js/wysiwygCommands/tableAddCol'),
    WysiwygEditor = require('../../src/js/wysiwygEditor'),
    EventManager = require('../../src/js/eventManager');

describe('Table - AddCol', function() {
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

    it('add col to current td cell right', function() {
        var sq = wwe.getEditor(),
            range = sq.getSelection().cloneRange();

        sq.setHTML([
            '<table>',
                '<thead>',
                    '<tr><th>1</th><th>2</th></tr>',
                '</thead>',
                '<tbody>',
                    '<tr><td>3</td><td>4</td></tr>',
                '</tbody>',
            '</table>'
        ].join('\n'));

        range.setStartBefore(wwe.get$Body().find('tbody td')[1].firstChild);
        range.collapse(true);

        sq.setSelection(range);
        sq._updatePathOnEvent(); //squire need update path for hasFormatWithRx

        AddCol.exec(wwe);

        expect(wwe.get$Body().find('thead th').length).toEqual(3);
        expect(wwe.get$Body().find('tbody td').length).toEqual(3);
        expect(sq.getSelection().startContainer).toBe(wwe.get$Body().find('tbody td')[2]);
    });

    it('add col to current th cell right', function() {
        var sq = wwe.getEditor(),
            range = sq.getSelection().cloneRange();

        sq.setHTML([
            '<table>',
                '<thead>',
                    '<tr><th>1</th><th>2</th></tr>',
                '</thead>',
                '<tbody>',
                    '<tr><td>3</td><td>4</td></tr>',
                '</tbody>',
            '</table>'
        ].join('\n'));

        range.setStartBefore(wwe.get$Body().find('thead th')[0].firstChild);
        range.collapse(true);

        sq.setSelection(range);
        sq._updatePathOnEvent(); //squire need update path for hasFormatWithRx

        AddCol.exec(wwe);

        expect(wwe.get$Body().find('thead th').length).toEqual(3);
        expect(wwe.get$Body().find('tbody td').length).toEqual(3);
        expect(sq.getSelection().startContainer).toBe(wwe.get$Body().find('thead th')[1]);
    });
});
