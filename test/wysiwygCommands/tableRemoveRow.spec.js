'use strict';

var RemoveRow = require('../../src/js/wysiwygCommands/tableRemoveRow'),
    WysiwygEditor = require('../../src/js/wysiwygEditor'),
    EventManager = require('../../src/js/eventManager');

describe('Table - RemoveRow', function() {
    var wwe;

    beforeEach(function() {
        var $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, new EventManager());

        wwe.init();
    });

    //we need to wait squire input event process
    afterEach(function(done) {
        setTimeout(function() {
            $('body').empty();
            done();
        });
    });

    it('remove row that have selected cell', function() {
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
        sq._updatePathOnEvent(); //squire need update path for hasFormatWithRx

        RemoveRow.exec(wwe);

        expect(wwe.get$Body().find('tbody tr').length).toEqual(1);
        expect(wwe.get$Body().find('tbody td').length).toEqual(2);
    });

    it('dont remove row if there have only one row', function() {
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

        range.setStartAfter(wwe.get$Body().find('tbody td')[0].firstChild);
        range.collapse(true);

        sq.setSelection(range);
        sq._updatePathOnEvent(); //squire need update path for hasFormatWithRx

        RemoveRow.exec(wwe);

        expect(wwe.get$Body().find('tbody tr').length).toEqual(1);
        expect(wwe.get$Body().find('tbody td').length).toEqual(2);
    });

    it('focus to next row\'s first td', function() {
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
        sq._updatePathOnEvent(); //squire need update path for hasFormatWithRx

        RemoveRow.exec(wwe);

        expect(sq.getSelection().startContainer.textContent).toBe(wwe.get$Body().find('tbody td')[0].textContent);
    });

    it('focus to prev row\'s first td if it doesn\'t have next row', function() {
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

        range.setStartAfter(wwe.get$Body().find('tbody td')[2].firstChild);
        range.collapse(true);

        sq.setSelection(range);
        sq._updatePathOnEvent(); //squire need update path for hasFormatWithRx

        RemoveRow.exec(wwe);

        expect(sq.getSelection().startContainer.textContent).toEqual(wwe.get$Body().find('tbody td')[0].textContent);
    });
});
