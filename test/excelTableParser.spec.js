'use strict';

var excelTableParser = require('../src/js/excelTableParser');

var rowSplitter = tui.util.browser.firefox ? '\n' : '\r';

describe('excelTableParser', function() {
    var content;

    describe('parse excel paste data to object', function() {
        it('2 x 2', function() {
            content = 'a\tb' + rowSplitter + 'c\td';

            expect(excelTableParser(content)).toEqual({
                col: 2,
                row: 2,
                data: ['a', 'b', 'c', 'd']
            });
        });

        it('2 x 3', function() {
            content = 'a\tb' + rowSplitter + 'c\td' + rowSplitter + 'e\tf';

            expect(excelTableParser(content)).toEqual({
                col: 2,
                row: 3,
                data: ['a', 'b', 'c', 'd', 'e', 'f']
            });
        });

        it('3 x 2 has empty cell in middle of first row', function() {
            content = 'a\t\tc' + rowSplitter + 'd\te\tf';

            expect(excelTableParser(content)).toEqual({
                col: 3,
                row: 2,
                data: ['a', '', 'c', 'd', 'e', 'f']
            });
        });

        it('3 x 2 has empty cell last', function() {
            content = 'a\tb\tc' + rowSplitter + 'd\te\t';

            expect(excelTableParser(content)).toEqual({
                col: 3,
                row: 2,
                data: ['a', 'b', 'c', 'd', 'e', '']
            });
        });
    });
});
