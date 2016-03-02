'use strict';

var excelTableParser = require('../src/js/excelTableParser');

describe('excelTableParser', function() {
    var content;

    describe('parse excel paste data to object', function() {
        it('2 x 2', function() {
            content = 'a\tb\nc\td';

            expect(excelTableParser(content)).toEqual({
                col: 2,
                row: 2,
                data: ['a', 'b', 'c', 'd']
            });
        });

        it('2 x 3', function() {
            content = 'a\tb\nc\td\ne\tf';

            expect(excelTableParser(content)).toEqual({
                col: 2,
                row: 3,
                data: ['a', 'b', 'c', 'd', 'e', 'f']
            });
        });

        it('3 x 2 has empty cell in middle of first row', function() {
            content = 'a\t\tc\nd\te\tf';

            expect(excelTableParser(content)).toEqual({
                col: 3,
                row: 2,
                data: ['a', '', 'c', 'd', 'e', 'f']
            });
        });

        it('3 x 2 has empty cell last', function() {
            content = 'a\tb\tc\nd\te\t';

            expect(excelTableParser(content)).toEqual({
                col: 3,
                row: 2,
                data: ['a', 'b', 'c', 'd', 'e', '']
            });
        });
    });
    describe('refine line feed difference of os', function() {
        it('CR-LF', function() {
            content = 'a\tb\tc\r\nd\te\t';

            expect(excelTableParser(content)).toEqual({
                col: 3,
                row: 2,
                data: ['a', 'b', 'c', 'd', 'e', '']
            });
        });
        it('CR', function() {
            content = 'a\tb\tc\rd\te\t';

            expect(excelTableParser(content)).toEqual({
                col: 3,
                row: 2,
                data: ['a', 'b', 'c', 'd', 'e', '']
            });
        });
    });
});
