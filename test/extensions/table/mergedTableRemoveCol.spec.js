import {_removeCol} from '../../../src/js/extensions/table/mergedTableRemoveCol';
import tableDataHandler from '../../../src/js/extensions/table/tableDataHandler';

describe('mergedTableRemoveCol', () => {
    describe('_removeCol()', () => {
        const tableHtml = [
            '<table>',
            '<thead>',
            '<tr><th>title1</th><th>title2</th><th>title3</th></tr>',
            '</thead>',
            '<tbody>',
            '<tr><td colspan="3">content1-1</td></tr>',
            '<tr><td>content2-1</td><td>content2-2</td><td>content2-3</td></tr>',
            '<tbody>',
            '</table>'
        ].join('');
        const $table = $(tableHtml);
        let data;

        beforeEach(() => {
            data = tableDataHandler.createDataFrom$Table($table);
        });

        it('Remove col, when target col has start merge cell(has colspan).', () => {
            const mpIndexes = {
                rowIndex: 2,
                cellIndex: 0
            };
            const actual = _removeCol(data, mpIndexes);

            expect(data.base[0].length).toBe(2);
            expect(data.base[1][0]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 2,
                content: 'content1-1'
            });
            expect(data.base[2][0]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: 'content2-2'
            });
        });

        it('Remove col, when target col has merged cell.', () => {
            const mpIndexes = {
                rowIndex: 2,
                cellIndex: 1
            };
            const actual = _removeCol(data, mpIndexes);

            expect(data.base[0].length).toBe(2);
            expect(data.base[1][0].colspan).toBe(2);
            expect(data.base[1][1]).toEqual({
                nodeName: 'TD',
                colMerged: true,
                colMergeStart: 0
            });
            expect(data.base[2][1]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: 'content2-3'
            });
        });

        it('Remove col, when target col has last merged cell.', () => {
            const mpIndexes = {
                rowIndex: 2,
                cellIndex: 2
            };
            const actual = _removeCol(data, mpIndexes);

            expect(data.base[0].length).toBe(2);
            expect(data.base[1][0].colspan).toBe(2);
            expect(data.base[1][1]).toEqual({
                nodeName: 'TD',
                colMerged: true,
                colMergeStart: 0
            });
            expect(data.base[2][1]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: 'content2-2'
            });
        });

        it('If removed all col, cols will not remove.', () => {
            const mpIndexes = {
                rowIndex: 1,
                cellIndex: 0
            };
            const actual = _removeCol(data, mpIndexes);

            expect(data.base[0].length).toBe(3);
            expect(data.base[1][0].colspan).toBe(3);
        });
    });
});
