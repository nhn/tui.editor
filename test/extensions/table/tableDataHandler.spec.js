import {_createBaseDataFrom$Table, _createMappingData} from '../../../src/js/extensions/table/tableDataHandler';
import tableDataHandler from '../../../src/js/extensions/table/tableDataHandler';

describe('tableDataHandler', () => {
    describe('_createBaseDataFrom$Table()', () => {
        it('Create base table data from jQuery table Element.', () => {
            const tableHtml = [
                '<table>',
                '<thead>',
                '<tr><th colspan="2">title</th></tr>',
                '</thead>',
                '<tbody>',
                '<tr><td>content1-1</td><td rowspan="2">content1-2</td></tr>',
                '<tr><td>content2-1</td></tr>',
                '<tbody>',
                '</table>'
            ].join('');
            const $table = $(tableHtml);
            const actual = _createBaseDataFrom$Table($table);

            expect(actual[0][0]).toEqual({
                nodeName: 'TH',
                colspan: 2,
                rowspan: 1,
                content: 'title'
            });
            expect(actual[0][1]).toEqual({
                nodeName: 'TH',
                colMerged: true,
                colMergeStart: 0
            });
            expect(actual[1][0]).toEqual({
                nodeName: 'TD',
                colspan: 1,
                rowspan: 1,
                content: 'content1-1'
            });
            expect(actual[1][1]).toEqual({
                nodeName: 'TD',
                colspan: 1,
                rowspan: 2,
                content: 'content1-2'
            });
            expect(actual[2][0]).toEqual({
                nodeName: 'TD',
                colspan: 1,
                rowspan: 1,
                content: 'content2-1'
            });
            expect(actual[2][1]).toEqual({
                nodeName: 'TD',
                rowMerged: true,
                rowMergeStart: 1
            });
        });
    });

    describe('_createMappingData()', () => {
        it('Create mapping data from base data.', () => {
            const base = [
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
                        rowspan: 2,
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
                ]
            ];
            const actual = _createMappingData(base);

            expect(actual[0].length).toBe(1);
            expect(actual[0][0]).toEqual({
                rowIndex: 0,
                cellIndex: 0
            });
            expect(actual[1].length).toBe(2);
            expect(actual[1][0]).toEqual({
                rowIndex: 1,
                cellIndex: 0
            });
            expect(actual[1][1]).toEqual({
                rowIndex: 1,
                cellIndex: 1
            });
            expect(actual[2][0]).toEqual({
                rowIndex: 2,
                cellIndex: 0
            });
        });
    });

    describe('createDataFrom$Table()', () => {
        it('Create table data from jQuery table Element.', () => {
            const tableHtml = [
                '<table>',
                '<thead>',
                '<tr><th colspan="2">title</th></tr>',
                '</thead>',
                '<tbody>',
                '<tr><td>content1-1</td><td rowspan="2">content1-2</td></tr>',
                '<tr><td>content2-1</td></tr>',
                '<tbody>',
                '</table>'
            ].join('');
            const $table = $(tableHtml);
            const actual = tableDataHandler.createDataFrom$Table($table);
            const base = actual.base;
            const mapping = actual.mapping;

            expect(base[0][0]).toEqual({
                nodeName: 'TH',
                colspan: 2,
                rowspan: 1,
                content: 'title'
            });
            expect(base[0][1]).toEqual({
                nodeName: 'TH',
                colMerged: true,
                colMergeStart: 0
            });
            expect(base[1][0]).toEqual({
                nodeName: 'TD',
                colspan: 1,
                rowspan: 1,
                content: 'content1-1'
            });
            expect(base[1][1]).toEqual({
                nodeName: 'TD',
                colspan: 1,
                rowspan: 2,
                content: 'content1-2'
            });
            expect(base[2][0]).toEqual({
                nodeName: 'TD',
                colspan: 1,
                rowspan: 1,
                content: 'content2-1'
            });
            expect(base[2][1]).toEqual({
                nodeName: 'TD',
                rowMerged: true,
                rowMergeStart: 1
            });

            expect(mapping[0].length).toBe(1);
            expect(mapping[0][0]).toEqual({
                rowIndex: 0,
                cellIndex: 0
            });
            expect(mapping[1].length).toBe(2);
            expect(mapping[1][0]).toEqual({
                rowIndex: 1,
                cellIndex: 0
            });
            expect(mapping[1][1]).toEqual({
                rowIndex: 1,
                cellIndex: 1
            });
            expect(mapping[2][0]).toEqual({
                rowIndex: 2,
                cellIndex: 0
            });
        });
    });

    describe('findRowMergedLastIndex()', () => {
        const base = [
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
                    rowspan: 2,
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
            ]
        ];

        it('Find last index of row merged cells, when target cell is not merged cell.', () => {
            const indexes = {
                rowIndex: 1,
                cellIndex: 0
            }
            const actual = tableDataHandler.findRowMergedLastIndex(base, indexes);

            expect(actual).toBe(1);
        });

        it('Find last index of row merged cells, when target cell is meged cell.', () => {
            const indexes = {
                rowIndex: 1,
                cellIndex: 1
            }
            const actual = tableDataHandler.findRowMergedLastIndex(base, indexes);

            expect(actual).toBe(2);
        });
    });

    describe('findColMergedLastIndex()', () => {
        const base = [
            [
                {
                    colspan: 1,
                    rowspan: 1,
                    content: 'title1'
                }, {
                    colspan: 1,
                    rowspan: 1,
                    content: 'title2'
                }
            ], [
                {
                    colspan: 2,
                    rowspan: 1,
                    content: 'content1-1'
                }, {
                    corMerged: true,
                    colMergeStart: 0
                }
            ], [
                {
                    colspan: 1,
                    rowspan: 1,
                    content: 'content2-1'
                }, {
                    colspan: 1,
                    rowspan: 1,
                    content: 'content2-2'
                }
            ]
        ];

        it('Find last cell index of col merged cells, when target cell is not merged cell.', () => {
            const indexes = {
                rowIndex: 2,
                cellIndex: 0
            }
            const actual = tableDataHandler.findColMergedLastIndex(base, indexes);

            expect(actual).toBe(0);
        });

        it('Find last cell index of col merged cells, when target cell is meged cell.', () => {
            const indexes = {
                rowIndex: 1,
                cellIndex: 0
            }
            const actual = tableDataHandler.findColMergedLastIndex(base, indexes);

            expect(actual).toBe(1);
        });
    });
});
