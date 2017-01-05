import {_createNewRow, _addRow} from '../../../src/js/extensions/table/mergedTableAddRow';
import tableDataHandler from '../../../src/js/extensions/table/tableDataHandler';

describe('mergedTableAddRow', () => {
    describe('_createNewRow()',  () => {
        let base;

        beforeEach(function() {
            base = [
                [
                    {
                        colspan: 2,
                        rowspan: 1,
                        content: 'title'
                    }, {
                        colMerged: true,
                        colMergeStart: 0
                    }
                ], [
                    {
                        colspan: 1,
                        rowspan: 1,
                        content: 'content1-1'
                    }, {
                        colspan: 1,
                        rowspan: 3,
                        content: 'content1-2'
                    }
                ], [
                    {
                        colspan: 1,
                        rowspan: 1,
                        content: 'content2-1'
                    }, {
                        rowMerged: true,
                        rowMergeStart: 1
                    }
                ], [
                    {
                        colspan: 1,
                        rowspan: 1,
                        content: 'content3-1'
                    }, {
                        rowMerged: true,
                        rowMergeStart: 1
                    }
                ]
            ];
        });

        it('Create new row, when target row has merged cell.', () => {
            const rowIndex = 2;
            const actual = _createNewRow(base, rowIndex);

            expect(actual.length).toBe(2);
            expect(actual[0]).toEqual({
                nodeName: 'TD',
                colspan: 1,
                rowspan: 1,
                content: '<br>'
            });
            expect(actual[1]).toEqual({
                rowMerged: true,
                rowMergeStart: 1
            });
        });

        it('Create new row, when target row has start merge cell(has rowspan).', () => {
            const rowIndex = 1;
            const actual = _createNewRow(base, rowIndex);

            expect(actual.length).toBe(2);
            expect(actual[0]).toEqual({
                nodeName: 'TD',
                colspan: 1,
                rowspan: 1,
                content: '<br>'
            });
            expect(actual[1]).toEqual({
                nodeName: 'TD',
                rowMerged: true,
                rowMergeStart: 1
            });
        });

        it('Create new row, when target row has last merged cell.', () => {
            const rowIndex = 3;
            const actual = _createNewRow(base, rowIndex);

            expect(actual.length).toBe(2);
            expect(actual[0]).toEqual({
                nodeName: 'TD',
                colspan: 1,
                rowspan: 1,
                content: '<br>'
            });
            expect(actual[1]).toEqual({
                nodeName: 'TD',
                colspan: 1,
                rowspan: 1,
                content: '<br>'
            });
        });

        it('Create new row, when target row has not merged cell.', () => {
            const rowIndex = 0;
            const actual = _createNewRow(base, rowIndex);

            expect(actual.length).toBe(2);
            expect(actual[0]).toEqual({
                nodeName: 'TD',
                colspan: 1,
                rowspan: 1,
                content: '<br>'
            });
            expect(actual[1]).toEqual({
                nodeName: 'TD',
                colspan: 1,
                rowspan: 1,
                content: '<br>'
            });
        });
    });

    describe('_addRow()', () => {
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

        it('Add row, when target row has start merge cell(has rowspan).', () => {
            const mpIndexes = {
                rowIndex: 1,
                cellIndex: 1
            };
            const actual = _addRow(data, mpIndexes);

            expect(data.base.length).toBe(5);
            expect(data.base[1][0].rowspan).toBe(4);
            expect(data.base[2][0]).toEqual({
                nodeName: 'TD',
                rowMerged: true,
                rowMergeStart: 1
            });
            expect(data.base[2][1]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: '<br>'
            });
        });

        it('Add row, when target row has merged cell.', () => {
            const mpIndexes = {
                rowIndex: 2,
                cellIndex: 0
            };
            const actual = _addRow(data, mpIndexes);

            expect(data.base.length).toBe(5);
            expect(data.base[1][0].rowspan).toBe(4);
            expect(data.base[3][0]).toEqual({
                nodeName: 'TD',
                rowMerged: true,
                rowMergeStart: 1
            });
            expect(data.base[3][1]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: '<br>'
            });
        });

        it('Add row, when target row has last merged cell.', () => {
            const mpIndexes = {
                rowIndex: 3,
                cellIndex: 0
            };
            const actual = _addRow(data, mpIndexes);

            expect(data.base.length).toBe(5);
            expect(data.base[1][0].rowspan).toBe(3);
            expect(data.base[4][0]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: '<br>'
            });
            expect(data.base[4][1]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: '<br>'
            });
        });
    });
});
