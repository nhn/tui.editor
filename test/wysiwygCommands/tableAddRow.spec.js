import AddRow from '../../src/js/wysiwygCommands/tableAddRow';
import WysiwygEditor from '../../src/js/wysiwygEditor';
import EventManager from '../../src/js/eventManager';

describe('Table - AddRow', () => {
    let wwe;

    beforeEach(() => {
        const $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, new EventManager());

        wwe.init();
        wwe.getEditor().focus();
    });

    //we need to wait squire input event process
    afterEach(done => {
        setTimeout(() => {
            $('body').empty();
            done();
        });
    });

    it('add row to current td cell below', () => {
        const sq = wwe.getEditor(),
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

        AddRow.exec(wwe);

        expect(wwe.get$Body().find('tbody tr').length).toEqual(2);
        expect(wwe.get$Body().find('tbody td').length).toEqual(4);
    });

    it('add row to tbody`s first index', () => {
        const sq = wwe.getEditor(),
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

        range.setStartAfter(wwe.get$Body().find('thead th')[0].firstChild);
        range.collapse(true);

        sq.setSelection(range);
        sq._updatePathOnEvent(); //squire need update path for hasFormatWithRx

        AddRow.exec(wwe);

        expect(wwe.get$Body().find('tbody tr').length).toEqual(2);
        expect(wwe.get$Body().find('tbody tr').eq(0).text()).toEqual('');
        expect(wwe.get$Body().find('tbody tr').eq(1).text()).toEqual('34');
        expect(wwe.get$Body().find('tbody td').length).toEqual(4);
    });

    it('focus to new row\'s first td', () => {
        const sq = wwe.getEditor(),
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

        AddRow.exec(wwe);

        expect(sq.getSelection().startContainer).toBe(wwe.get$Body().find('tbody td')[2]);
    });
});
