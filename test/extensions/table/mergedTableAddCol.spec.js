import {_createNewCol, _addCol} from '../../../src/js/extensions/table/mergedTableAddCol';
import tableDataHandler from '../../../src/js/extensions/table/tableDataHandler';

describe('mergedTableAddCol', () => {
    describe('_createNewCol()',  () => {
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
                        colMerged: true,
                        colMergeStart: 0
                    }, {
                        nodeName: 'TD',
                        colMerged: true,
                        colMergeStart: 0
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

        it('Create new col, when target col has merged cell.', () => {
            const cellIndex = 1;
            const actual = _createNewCol(base, cellIndex);

            expect(base[1][0].colspan).toBe(4);
            expect(actual.length).toBe(3);
            expect(actual[0]).toEqual({
                nodeName: 'TH',
                colspan: 1,
                rowspan: 1,
                content: '<br>'
            });
            expect(actual[1]).toEqual({
                nodeName: 'TD',
                colMerged: true,
                colMergeStart: 0
            });
            expect(actual[2]).toEqual({
                nodeName: 'TD',
                colspan: 1,
                rowspan: 1,
                content: '<br>'
            });
        });

        it('Create new col, when target col has start merge cell(has colspan).', () => {
            const cellIndex = 0;
            const actual = _createNewCol(base, cellIndex);

            expect(base[1][0].colspan).toBe(4);
            expect(actual.length).toBe(3);
            expect(actual[0]).toEqual({
                nodeName: 'TH',
                colspan: 1,
                rowspan: 1,
                content: '<br>'
            });
            expect(actual[1]).toEqual({
                nodeName: 'TD',
                colMerged: true,
                colMergeStart: 0
            });
            expect(actual[2]).toEqual({
                nodeName: 'TD',
                colspan: 1,
                rowspan: 1,
                content: '<br>'
            });
        });

        it('Create new row, when target row has last merged cell.', () => {
            const cellIndex = 2;
            const actual = _createNewCol(base, cellIndex);

            expect(actual.length).toBe(3);
            expect(actual[0]).toEqual({
                nodeName: 'TH',
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
            expect(actual[2]).toEqual({
                nodeName: 'TD',
                colspan: 1,
                rowspan: 1,
                content: '<br>'
            });
        });
    });

    describe('_addCol()', () => {
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
        let data;

        beforeEach(() => {
            data = tableDataHandler.createDataFrom$Table($table);
        });

        it('Add col, when target col has start merge cell(has colspan).', () => {
            const mpIndexes = {
                rowIndex: 2,
                cellIndex: 1
            };
            const actual = _addCol(data, mpIndexes);

            expect(data.base[0].length).toBe(4);
            expect(data.base[1][0].colspan).toBe(4);
            expect(data.base[1][2]).toEqual({
                nodeName: 'TD',
                colMerged: true,
                colMergeStart: 0
            });
            expect(data.base[2][2]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: '<br>'
            });
        });

        it('Add col, when target col has merged cell.', () => {
            const mpIndexes = {
                rowIndex: 2,
                cellIndex: 0
            };
            const actual = _addCol(data, mpIndexes);

            expect(data.base[0].length).toBe(4);
            expect(data.base[1][0].colspan).toBe(4);
            expect(data.base[1][1]).toEqual({
                nodeName: 'TD',
                colMerged: true,
                colMergeStart: 0
            });
            expect(data.base[2][1]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: '<br>'
            });
        });

        it('Add col, when target col has last merged cell.', () => {
            const mpIndexes = {
                rowIndex: 2,
                cellIndex: 2
            };
            const actual = _addCol(data, mpIndexes);

            expect(data.base[0].length).toBe(4);
            expect(data.base[1][0].colspan).toBe(3);
            expect(data.base[1][3]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: '<br>'
            });
            expect(data.base[2][3]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: '<br>'
            });
        });
    });
});
