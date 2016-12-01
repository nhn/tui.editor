import parser from '../../../src/js/extensions/grid/parser';

describe('parser', () => {
    describe('_pickDataString()', () => {
        it('Pick data string for single line.', () => {
            const codeText = `@startdata
                |a|b|c|
                @enddata`;
            const actual = parser._pickDataString(codeText);
            const expected = '|a|b|c|';

            expect(actual).toBe(expected);
        });

        it('Pick data string for multi lines.', () => {
            const codeText = `@startdata
                |a|b|c|
                |d|e|f|
                @enddata`;
            const actual = parser._pickDataString(codeText);
            const expected = `|a|b|c|\n|d|e|f|`;

            expect(actual).toBe(expected);
        });

        it('Pick data string, when has option', () => {
            const codeText = `@startoption
                    autoNumbering: true
                @endoption
                @startdata
                    |a|b|c|
                @enddata`;
            const actual = parser._pickDataString(codeText);
            const expected = '|a|b|c|';

            expect(actual).toBe(expected);
        });
    });

    describe('_splitToLines()', () => {
        it('Split line string to lines.', () => {
            const linesString = `|a|b|c|
                |d|e|f|`;
            const actual = parser._splitToLines(linesString);
            const expected = [
                '|a|b|c|',
                '|d|e|f|'
            ];

            expect(actual).toEqual(expected);
        });

        it('If lines string is empty, returns empty array.', () => {
            const linesString = '';
            const actual = parser._splitToLines(linesString);

            expect(actual).toEqual([]);
        });
    });

    describe('_isSeparatorLine()', () => {
        it('If line is separator type, returns true.', () => {
            const lineString = '|---|:---:|---|';
            const actual = parser._isSeparatorLine(lineString);

            expect(actual).toBe(true);
        });

        it('If line is not separator type, returns false.', () => {
            const lineString = '|a|b|c|';
            const actual = parser._isSeparatorLine(lineString);

            expect(actual).toBe(false);
        });

        it('If line is undefined, returns false', () => {
            const actual = parser._isSeparatorLine();

            expect(actual).toBe(false);
        });
    });

    describe('_splitToCells()', () => {
        it('Split data or option string to cells.', () => {
            const lineString = '|a|b|c|';
            const actual = parser._splitToCells(lineString);

            expect(actual).toEqual(['a', 'b', 'c']);
        });
    });

    describe('_getAlign()', () => {
        it('If cell string is center type, returns "center"', () => {
            const cellString = ':---:';
            const actual = parser._getAlign(cellString);

            expect(actual).toBe('center');
        });

        it('If cell string is right type, returns "right"', () => {
            const cellString = '---:';
            const actual = parser._getAlign(cellString);

            expect(actual).toBe('right');
        });

        it('If cell string is neither center nor right type, returns "left"', () => {
            const cellString = '---';
            const actual = parser._getAlign(cellString);

            expect(actual).toBe('left');
        });
    });

    describe('_parseSeparatorLine()', () => {
        it('Parse separator line.', () => {
            const lineString = '|---|:---|:---:|---:|';
            const actual = parser._parseSeparatorLine(lineString);

            expect(actual).toEqual(['left', 'left', 'center', 'right']);
        });
    });

    describe('_parseHeader()', () => {
        it('Parse header.', () => {
            const lines = [
                '|a|b|c|',
                '|---|:---:|---:|'
            ];
            const actual = parser._parseHeader(lines);

            expect(actual).toEqual([
                {
                    align: 'left',
                    title: 'a'
                }, {
                    align: 'center',
                    title: 'b'
                }, {
                    align: 'right',
                    title: 'c'
                }
            ]);
        });
    });

    describe('_parseBodyLine()', () => {
        it('Parse data body line.', () => {
            const lineString = '|a|b|c|';
            const actual = parser._parseBodyLine(lineString);

            expect(actual).toEqual([{
                data: 'a'
            }, {
                data: 'b'
            }, {
                data: 'c'
            }]);
        });
    });

    describe('_parseDataString()', () => {
        it('Parse data string, when has header.', () => {
            const dataString = `|a|b|c|
                |---|:---:|---:|
                |d|e|f|`;
            const actual = parser._parseDataString(dataString);

            expect(actual.header).toEqual([
                {
                    align: 'left',
                    title: 'a'
                }, {
                    align: 'center',
                    title: 'b'
                }, {
                    align: 'right',
                    title: 'c'
                }
            ]);
            expect(actual.body).toEqual([[{
                data: 'd'
            }, {
                data: 'e'
            }, {
                data: 'f'
            }]]);
        });

        it('Parse data string, when has not header.', () => {
            const dataString = `|a|b|c|
                |d|e|f|`;
            const actual = parser._parseDataString(dataString);

            expect(actual.header).toEqual([null, null, null]);
            expect(actual.body).toEqual([
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
            ]);
        });

        it('Parse data string, when has only header.', () => {
            const dataString = `|a|b|c|
                |---|:---:|---:|`;
            const actual = parser._parseDataString(dataString);

            expect(actual.header).toEqual([
                {
                    align: 'left',
                    title: 'a'
                }, {
                    align: 'center',
                    title: 'b'
                }, {
                    align: 'right',
                    title: 'c'
                }
            ]);
            expect(actual.body).toEqual([]);
        });
    });

    describe('_pickOptionString()', () => {
        it('Pick option string for single line.', () => {
            const codeText = `@startoption
                autoNumbering: true
                @endoption`;
            const actual = parser._pickOptionString(codeText);
            const expected = 'autoNumbering: true';

            expect(actual).toBe(expected);
        });

        it('Pick option string for multi lines.', () => {
            const codeText = `@startoption
                autoNumbering: true
                rowHeight: 30
                @endoption`;
            const actual = parser._pickOptionString(codeText);
            const expected = `autoNumbering: true\nrowHeight: 30`;

            expect(actual).toBe(expected);
        });
    });

    describe('_parseOptionString()', () => {
        it('Parse option string.', () => {
            const optionString = `autoNumbering: true\nrowHeight: 30`;
            const actual = parser._parseOptionString(optionString);

            expect(actual.autoNumbering).toBe(true);
            expect(actual.rowHeight).toBe(30);
        });
    });
});
