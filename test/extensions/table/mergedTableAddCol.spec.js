import {_createNewColumns, _addColumns} from '../../../src/js/extensions/table/mergedTableAddCol';
import tableDataHandler from '../../../src/js/extensions/table/tableDataHandler';

describe('mergedTableAddCol', () => {
    describe('_createNewColumns()',  () => {
        let base;

        beforeEach(function() {
            base = [
                [
                    {
                        nodeName: 'TH',
                        colspan: 1,
                        rowspan: 1,
                        content: 'title1'
                    }, {
                        nodeName: 'TH',
                        colspan: 1,
                        rowspan: 1,
                        content: 'title2'
                    }, {
                        nodeName: 'TH',
                        colspan: 1,
                        rowspan: 1,
                        content: 'title3'
                    }
                ], [
                    {
                        nodeName: 'TD',
                        colspan: 3,
                        rowspan: 1,
                        content: 'content1-1'
                    }, {
                        nodeName: 'TD',
                        colMergeWith: 0
                    }, {
                        nodeName: 'TD',
                        colMergeWith: 0
                    }
                ], [
                    {
                        nodeName: 'TD',
                        colspan: 1,
                        rowspan: 1,
                        content: 'content2-1'
                    }, {
                        nodeName: 'TD',
                        colspan: 1,
                        rowspan: 1,
                        content: 'content2-2'
                    }, {
                        nodeName: 'TD',
                        colspan: 1,
                        rowspan: 1,
                        content: 'content2-3'
                    }
                ]
            ];
        });

        it('Create new columns, when target col has merged cell.', () => {
            const cellIndex = 1;
            const actual = _createNewColumns(base, cellIndex);

            expect(base[1][0].colspan).toBe(4);
            expect(actual.length).toBe(3);
            expect(actual[0]).toEqual({
                nodeName: 'TH',
                colspan: 1,
                rowspan: 1,
                content: ''
            });
            expect(actual[1]).toEqual({
                nodeName: 'TD',
                colMergeWith: 0
            });
            expect(actual[2]).toEqual({
                nodeName: 'TD',
                colspan: 1,
                rowspan: 1,
                content: ''
            });
        });

        it('Create new columns, when target col has start merge cell(has colspan).', () => {
            const cellIndex = 0;
            const actual = _createNewColumns(base, cellIndex);

            expect(base[1][0].colspan).toBe(4);
            expect(actual.length).toBe(3);
            expect(actual[0]).toEqual({
                nodeName: 'TH',
                colspan: 1,
                rowspan: 1,
                content: ''
            });
            expect(actual[1]).toEqual({
                nodeName: 'TD',
                colMergeWith: 0
            });
            expect(actual[2]).toEqual({
                nodeName: 'TD',
                colspan: 1,
                rowspan: 1,
                content: ''
            });
        });

        it('Create new columns, when target row has last merged cell.', () => {
            const cellIndex = 2;
            const actual = _createNewColumns(base, cellIndex);

            expect(actual.length).toBe(3);
            expect(actual[0]).toEqual({
                nodeName: 'TH',
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
            expect(actual[2]).toEqual({
                nodeName: 'TD',
                colspan: 1,
                rowspan: 1,
                content: ''
            });
        });
    });

    describe('_addColumns()', () => {
        const tableHtml = [
            '<table>',
            '<thead>',
            '<tr><th>title1</th><th>title2</th><th>title3</th></tr>',
            '</thead>',
            '<tbody>',
            '<tr><td colspan="3">content1-1</td><td>content1-2</td></tr>',
            '<tr><td>content2-1</td><td>content2-2</td><td>content2-3</td></tr>',
            '<tbody>',
            '</table>'
        ].join('');
        const $table = $(tableHtml);
        let tableData;

        beforeEach(() => {
            tableData = tableDataHandler.createTableData($table);
        });

        it('Add columns, when target col has start merge cell(has colspan).', () => {
            const actual = _addColumns(tableData, 2, 1);

            expect(tableData[0].length).toBe(4);
            expect(tableData[1][0].colspan).toBe(4);
            expect(tableData[1][2]).toEqual({
                nodeName: 'TD',
                colMergeWith: 0
            });
            expect(tableData[2][2]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: ''
            });
        });

        it('Add columns, when target col has merged cell.', () => {
            const actual = _addColumns(tableData, 2, 0);

            expect(tableData[0].length).toBe(4);
            expect(tableData[1][0].colspan).toBe(4);
            expect(tableData[1][1]).toEqual({
                nodeName: 'TD',
                colMergeWith: 0
            });
            expect(tableData[2][1]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: ''
            });
        });

        it('Add columns, when target col has last merged cell.', () => {
            const actual = _addColumns(tableData, 2, 2);

            expect(tableData[0].length).toBe(4);
            expect(tableData[1][0].colspan).toBe(3);
            expect(tableData[1][3]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: ''
            });
            expect(tableData[2][3]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: ''
            });
        });
    });
});
