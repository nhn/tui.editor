'use strict';

var toMark = require('../src/toMark');

describe('toMark', function() {
    describe('Headings', function() {
        it('convert heading tag to markdown', function() {
            expect(toMark('<h1>Hello World!</h1>')).toEqual('# Hello World!\n');
        });

        it('convert heading2 tag to markdown', function() {
            expect(toMark('<h2>Hello <em>World!</em></h2>')).toEqual('## Hello *World!*\n');
        });

        it('convert heading2 tag to markdown', function() {
            expect(toMark('<h2>Hello <em>World!</em></h2>')).toEqual('## Hello *World!*\n');
        });

        it('convert heading1, heading2 tag to markdown', function() {
            expect(toMark('<h1>Hello World!</h1><h2>Hello World!</h2>')).toEqual('# Hello World!\n## Hello World!\n');
        });
    });

    describe('Lists', function() {
        it('Unordered List can be converted', function() {
            var htmlStr = [
                '<ul>',
                   '<li>TEST</li>',
                '</ul>'
            ].join('');

            expect(toMark(htmlStr)).toEqual('* TEST\n');
        });
    });
});


