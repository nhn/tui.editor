import {_removeRow} from '../../../src/js/extensions/table/mergedTableRemoveRow';
import tableDataHandler from '../../../src/js/extensions/table/tableDataHandler';

describe('mergedTableRemoveRow', () => {
    describe('_removeRow()', () => {
        const tableHtml = [
            '<table>',
            '<thead>',
            '<tr><th>title1</th><th>title2</th></tr>',
            '</thead>',
            '<tbody>',
            '<tr><td rowspan="3">content1-1</td><td>content1-2</td></tr>',
            '<tr><td>content2-2</td></tr>',
            '<tr><td>content3-2</td></tr>',
            '<tbody>',
            '</table>'
        ].join('');
        const $table = $(tableHtml);
        let data;

        beforeEach(() => {
            data = tableDataHandler.createDataFrom$Table($table);
        });

        it('Remove row, when target row has start merge cell(has rowspan).', () => {
            const mpIndexes = {
                rowIndex: 1,
                cellIndex: 1
            };
            const actual = _removeRow(data, mpIndexes);

            expect(data.base.length).toBe(3);
            expect(data.base[1][0]).toEqual({
                nodeName: 'TD',
                rowspan: 2,
                colspan: 1,
                content: 'content1-1'
            });
            expect(data.base[1][1]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: 'content2-2'
            });
        });

        it('Remove row, when target row has merged cell.', () => {
            const mpIndexes = {
                rowIndex: 2,
                cellIndex: 0
            };
            const actual = _removeRow(data, mpIndexes);

            expect(data.base.length).toBe(3);
            expect(data.base[1][0].rowspan).toBe(2);
            expect(data.base[2][0]).toEqual({
                nodeName: 'TD',
                rowMerged: true,
                rowMergeStart: 1
            });
            expect(data.base[2][1]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: 'content3-2'
            });
        });

        it('Remove row, when target row has last merged cell.', () => {
            const mpIndexes = {
                rowIndex: 3,
                cellIndex: 0
            };
            const actual = _removeRow(data, mpIndexes);

            expect(data.base.length).toBe(3);
            expect(data.base[1][0].rowspan).toBe(2);
            expect(data.base[2][0]).toEqual({
                nodeName: 'TD',
                rowMerged: true,
                rowMergeStart: 1
            });
            expect(data.base[2][1]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: 'content2-2'
            });
        });

        it('If removed after remain only header, rows will not remove.', () => {
            const mpIndexes = {
                rowIndex: 1,
                cellIndex: 0
            };
            const actual = _removeRow(data, mpIndexes);

            expect(data.base.length).toBe(4);
            expect(data.base[1][0].rowspan).toBe(3);
        });
    });
});
