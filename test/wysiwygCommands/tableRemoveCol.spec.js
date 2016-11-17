import RemoveCol from '../../src/js/wysiwygCommands/tableRemoveCol';
import WwTableManager from '../../src/js/wwTableManager';
import WysiwygEditor from '../../src/js/wysiwygEditor';
import EventManager from '../../src/js/eventManager';

describe('Table - RemoveCol', () => {
    let wwe;

    beforeEach(() => {
        const $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, new EventManager());

        wwe.init();
        wwe.componentManager.addManager('table', WwTableManager);

        wwe.getEditor().focus();
    });

    //we need to wait squire input event process
    afterEach(done => {
        setTimeout(() => {
            $('body').empty();
            done();
        });
    });

    it('remove col that have selected cell', () => {
        const sq = wwe.getEditor(),
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

        range.setStartBefore(wwe.get$Body().find('tbody td')[0].firstChild);
        range.collapse(true);

        sq.setSelection(range);

        RemoveCol.exec(wwe);

        expect(wwe.get$Body().find('thead th').length).toEqual(1);
        expect(wwe.get$Body().find('tbody td').length).toEqual(2);
    });

    it('dont remove col if there have only one col', () => {
        const sq = wwe.getEditor(),
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

        range.setStartBefore(wwe.get$Body().find('tbody td')[0].firstChild);
        range.collapse(true);

        sq.setSelection(range);

        RemoveCol.exec(wwe);

        expect(wwe.get$Body().find('thead th').length).toEqual(1);
        expect(wwe.get$Body().find('tbody td').length).toEqual(2);
    });
});
