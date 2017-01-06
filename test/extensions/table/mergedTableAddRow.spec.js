import {_createNewRow, _addRow} from '../../../src/js/extensions/table/mergedTableAddRow';
import tableDataHandler from '../../../src/js/extensions/table/tableDataHandler';

describe('mergedTableAddRow', () => {
    describe('_createNewRow()',  () => {
        let tableData;

        beforeEach(function() {
            tableData = [
                [
                    {
                        colspan: 2,
                        rowspan: 1,
                        content: 'title'
                    }, {
                        colMergeWith: 0
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
                        rowMergeWith: 1
                    }
                ], [
                    {
                        colspan: 1,
                        rowspan: 1,
                        content: 'content3-1'
                    }, {
                        rowMergeWith: 1
                    }
                ]
            ];
        });

        it('Create new row, when target row has merged cell.', () => {
            const rowIndex = 2;
            const actual = _createNewRow(tableData, rowIndex);

            expect(actual.length).toBe(2);
            expect(actual[0]).toEqual({
                nodeName: 'TD',
                colspan: 1,
                rowspan: 1,
                content: ''
            });
            expect(actual[1]).toEqual({
                rowMergeWith: 1
            });
        });

        it('Create new row, when target row has start merge cell(has rowspan).', () => {
            const rowIndex = 1;
            const actual = _createNewRow(tableData, rowIndex);

            expect(actual.length).toBe(2);
            expect(actual[0]).toEqual({
                nodeName: 'TD',
                colspan: 1,
                rowspan: 1,
                content: ''
            });
            expect(actual[1]).toEqual({
                nodeName: 'TD',
                rowMergeWith: 1
            });
        });

        it('Create new row, when target row has last merged cell.', () => {
            const rowIndex = 3;
            const actual = _createNewRow(tableData, rowIndex);

            expect(actual.length).toBe(2);
            expect(actual[0]).toEqual({
                nodeName: 'TD',
                colspan: 1,
                rowspan: 1,
                content: ''
            });
            expect(actual[1]).toEqual({
                nodeName: 'TD',
                colspan: 1,
                rowspan: 1,
                content: ''
            });
        });

        it('Create new row, when target row has not merged cell.', () => {
            const rowIndex = 0;
            const actual = _createNewRow(tableData, rowIndex);

            expect(actual.length).toBe(2);
            expect(actual[0]).toEqual({
                nodeName: 'TD',
                colspan: 1,
                rowspan: 1,
                content: ''
            });
            expect(actual[1]).toEqual({
                nodeName: 'TD',
                colspan: 1,
                rowspan: 1,
                content: ''
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
        let tableData;

        beforeEach(() => {
            tableData = tableDataHandler.createTableData($table);
        });

        it('Add row, when target row has start merge cell(has rowspan).', () => {
            const actual = _addRow(tableData, 1, 1);

            expect(tableData.length).toBe(5);
            expect(tableData[1][0].rowspan).toBe(4);
            expect(tableData[2][0]).toEqual({
                nodeName: 'TD',
                rowMergeWith: 1
            });
            expect(tableData[2][1]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: ''
            });
        });

        it('Add row, when target row has merged cell.', () => {
            const actual = _addRow(tableData, 2, 1);

            expect(tableData.length).toBe(5);
            expect(tableData[1][0].rowspan).toBe(4);
            expect(tableData[3][0]).toEqual({
                nodeName: 'TD',
                rowMergeWith: 1
            });
            expect(tableData[3][1]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: ''
            });
        });

        it('Add row, when target row has last merged cell.', () => {
            const actual = _addRow(tableData, 3, 1);

            expect(tableData.length).toBe(5);
            expect(tableData[1][0].rowspan).toBe(3);
            expect(tableData[4][0]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: ''
            });
            expect(tableData[4][1]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: ''
            });
        });
    });
});
