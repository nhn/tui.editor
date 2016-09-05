import AddCol from '../../src/js/wysiwygCommands/tableAddCol';
import WysiwygEditor from '../../src/js/wysiwygEditor';
import EventManager from '../../src/js/eventManager';

describe('Table - AddCol', () => {
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

    it('add col to current td cell right', () => {
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

        range.setStartBefore(wwe.get$Body().find('tbody td')[1].firstChild);
        range.collapse(true);

        sq.setSelection(range);
        sq._updatePathOnEvent(); //squire need update path for hasFormatWithRx

        AddCol.exec(wwe);

        expect(wwe.get$Body().find('thead th').length).toEqual(3);
        expect(wwe.get$Body().find('tbody td').length).toEqual(3);
        expect(sq.getSelection().startContainer).toBe(wwe.get$Body().find('tbody td')[2]);
    });

    it('add col to current th cell right', () => {
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
