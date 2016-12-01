import convertor from '../../../src/js/extensions/grid/convertor';

describe('convertor', () => {
    describe('_createColumnModelList()', () => {
        it('Create column model, when edit mode.', () => {
            const header = [
                {
                    title: 'a'
                }, {
                    title: 'b'
                }, {
                    title: 'c'
                }
            ];
            const actual = convertor._createColumnModelList(header, true);
            const expected = [
                {
                    title: 'a',
                    editOption: {
                        type: 'text'
                    },
                    columnName: 'grid-column-0'
                }, {
                    title: 'b',
                    editOption: {
                        type: 'text'
                    },
                    columnName: 'grid-column-1'
                }, {
                    title: 'c',
                    editOption: {
                        type: 'text'
                    },
                    columnName: 'grid-column-2'
                }
            ];

            expect(actual).toEqual(expected);
        });

        it('Create column model, when view mode.', () => {
            const header = [
                {
                    title: 'a'
                }, {
                    title: 'b'
                }, {
                    title: 'c'
                }
            ];
            const actual = convertor._createColumnModelList(header);
            const expected = [
                {
                    title: 'a',
                    editOption: {
                        type: 'normal'
                    },
                    columnName: 'grid-column-0'
                }, {
                    title: 'b',
                    editOption: {
                        type: 'normal'
                    },
                    columnName: 'grid-column-1'
                }, {
                    title: 'c',
                    editOption: {
                        type: 'normal'
                    },
                    columnName: 'grid-column-2'
                }
            ];

            expect(actual).toEqual(expected);
        });

        it('Create column model, when has not header title', () => {
            const header = [null, null, null];
            const actual = convertor._createColumnModelList(header, true);
            const expected = [
                {
                    editOption: {
                        type: 'text'
                    },
                    columnName: 'grid-column-0'
                }, {
                    editOption: {
                        type: 'text'
                    },
                    columnName: 'grid-column-1'
                }, {
                    editOption: {
                        type: 'text'
                    },
                    columnName: 'grid-column-2'
                }
            ];

            expect(actual).toEqual(expected);
        });
    });

    describe('_createRowList()', () => {
        it('Create grid data.', () => {
            const body = [
                [{
                    data: 'a'
                }, {
                    data: 'b'
                }, {
                    data: 'c'
                }], [{
                    data: 'd'
                }, {
                    data: 'e'
                }, {
                    data: 'f'
                }]
            ];
            const actual = convertor._createRowList(body);
            const expected = [
                {
                    'grid-column-0': 'a',
                    'grid-column-1': 'b',
                    'grid-column-2': 'c'
                }, {
                    'grid-column-0': 'd',
                    'grid-column-1': 'e',
                    'grid-column-2': 'f'
                }
            ];

            expect(actual).toEqual(expected);
        });
    });

    describe('convertToGridData()', () => {
        it('Convert to grid data from codeText, when edit mode.', () => {
            const codeText = `@startdata
            |a|b|c|
            |---|:---:|---:|
            |d|e|f|
            @enddata`;
            const actual = convertor.convertToGridData(codeText, true);

            expect(actual.columnModelList).toEqual([
                {
                    title: 'a',
                    align: 'left',
                    editOption: {
                        type: 'text'
                    },
                    columnName: 'grid-column-0'
                }, {
                    title: 'b',
                    align: 'center',
                    editOption: {
                        type: 'text'
                    },
                    columnName: 'grid-column-1'
                }, {
                    title: 'c',
                    align: 'right',
                    editOption: {
                        type: 'text'
                    },
                    columnName: 'grid-column-2'
                }
            ]);

            expect(actual.rowList).toEqual([
                {
                    'grid-column-0': 'd',
                    'grid-column-1': 'e',
                    'grid-column-2': 'f'
                }
            ]);
        });

        it('Convert to grid data from codeText, when view mode.', () => {
            const codeText = `@startdata
                |a|b|c|
                |---|:---:|---:|
                |d|e|f|
                @enddata`;
            const actual = convertor.convertToGridData(codeText);

            expect(actual.columnModelList).toEqual([
                {
                    title: 'a',
                    align: 'left',
                    editOption: {
                        type: 'normal'
                    },
                    columnName: 'grid-column-0'
                }, {
                    title: 'b',
                    align: 'center',
                    editOption: {
                        type: 'normal'
                    },
                    columnName: 'grid-column-1'
                }, {
                    title: 'c',
                    align: 'right',
                    editOption: {
                        type: 'normal'
                    },
                    columnName: 'grid-column-2'
                }
            ]);
            expect(actual.rowList).toEqual([
                {
                    'grid-column-0': 'd',
                    'grid-column-1': 'e',
                    'grid-column-2': 'f'
                }
            ]);
        });
    });
});
