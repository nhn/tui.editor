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
        let tableData;

        beforeEach(() => {
            tableData = tableDataHandler.createTableData($table);
        });

        it('Remove row, when target row has start merge cell(has rowspan).', () => {
            const tableRange = {
                start: {
                    rowIndex: 1,
                    colIndex: 1
                },
                end: {
                    rowIndex: 1,
                    colIndex: 1
                }
            };
            const actual = _removeRow(tableData, tableRange);

            expect(tableData.length).toBe(3);
            expect(tableData[1][0]).toEqual({
                nodeName: 'TD',
                rowspan: 2,
                colspan: 1,
                content: 'content1-1',
                elementIndex: {
                    rowIndex: 1,
                    colIndex: 0
                }
            });
            expect(tableData[1][1]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: 'content2-2',
                elementIndex: {
                    rowIndex: 2,
                    colIndex: 0
                }
            });
        });

        it('Remove row, when target row has merged cell.', () => {
            const tableRange = {
                start: {
                    rowIndex: 2,
                    colIndex: 1
                },
                end: {
                    rowIndex: 2,
                    colIndex: 1
                }
            };
            const actual = _removeRow(tableData, tableRange);

            expect(tableData.length).toBe(3);
            expect(tableData[1][0].rowspan).toBe(2);
            expect(tableData[2][0]).toEqual({
                nodeName: 'TD',
                rowMergeWith: 1
            });
            expect(tableData[2][1]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: 'content3-2',
                elementIndex: {
                    rowIndex: 3,
                    colIndex: 0
                }
            });
        });

        it('Remove row, when target row has last merged cell.', () => {
            const tableRange = {
                start: {
                    rowIndex: 3,
                    colIndex: 1
                },
                end: {
                    rowIndex: 3,
                    colIndex: 1
                }
            };
            const actual = _removeRow(tableData, tableRange);

            expect(tableData.length).toBe(3);
            expect(tableData[1][0].rowspan).toBe(2);
            expect(tableData[2][0]).toEqual({
                nodeName: 'TD',
                rowMergeWith: 1
            });
            expect(tableData[2][1]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: 'content2-2',
                elementIndex: {
                    rowIndex: 2,
                    colIndex: 0
                }
            });
        });

        it('Remove row, when has table selection.', () => {
            const tableRange = {
                start: {
                    rowIndex: 2,
                    colIndex: 1
                },
                end: {
                    rowIndex: 3,
                    colIndex: 1
                }
            };
            const actual = _removeRow(tableData, tableRange);

            expect(tableData.length).toBe(2);
            expect(tableData[1][0].rowspan).toBe(1);
            expect(tableData[1][1]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: 'content1-2',
                elementIndex: {
                    rowIndex: 1,
                    colIndex: 1
                }
            });
        });

        it('If removed after remain only header, rows will not remove.', () => {
            const tableRange = {
                start: {
                    rowIndex: 1,
                    colIndex: 0
                },
                end: {
                    rowIndex: 1,
                    colIndex: 0
                }
            };
            const actual = _removeRow(tableData, tableRange);

            expect(tableData.length).toBe(4);
            expect(tableData[1][0].rowspan).toBe(3);
        });
    });
});
