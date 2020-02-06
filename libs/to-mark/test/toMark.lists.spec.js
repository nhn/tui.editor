'use strict';

var toMark = require('../src/toMark');

describe('toMark', function() {
    describe('Lists', function() {
        it('Unordered List can be converted', function() {
            var htmlStr = [
                '<ul>',
                '<li>TEST</li>',
                '</ul>'
            ].join('');

            expect(toMark(htmlStr)).toEqual('* TEST');
        });

        it('Ordered List can be converted', function() {
            var htmlStr = [
                '<ol>',
                '<li>TEST</li>',
                '</ol>'
            ].join('');

            expect(toMark(htmlStr)).toEqual('1. TEST');
        });

        it('Nested List can be converted', function() {
            var htmlStr = [
                '<ol>',
                '<li>DEPTH1',
                '<ul>',
                '<li>DEPTH2-1</li>',
                '<li>DEPTH2-2</li>',
                '</ul>',
                '</li>',
                '</ol>'
            ].join('');

            expect(toMark(htmlStr)).toEqual('1. DEPTH1\n    * DEPTH2-1\n    * DEPTH2-2');
        });

        it('Multiple Nesting', function() {
            var htmlStr = [
                '<ol>',
                '<li>DEPTH1',
                '<ul>',
                '<li>DEPTH2',
                '<ul>',
                '<li>DEPTH3',
                '<ul>',
                '<li>DEPTH4</li>',
                '</ul>',
                '</li>',
                '</ul>',
                '</li>',
                '</ul>',
                '</li>',
                '</ol>'
            ].join('');

            expect(toMark(htmlStr)).toEqual('1. DEPTH1\n    * DEPTH2\n        * DEPTH3\n            * DEPTH4');
        });

        it('list can contain heading', function() {
            var htmlStr = [
                '<ul>',
                '<li>',
                '<h1>nested heading</h1>',
                '</li>',
                '</ul>'
            ].join('');

            expect(toMark(htmlStr)).toEqual('* # nested heading');
        });

        it('empty list have blank text', function() {
            var htmlStr = [
                '<ul>',
                '<li></li>',
                '<li>2</li>',
                '</ul>'
            ].join('');

            expect(toMark(htmlStr)).toEqual('* \n* 2');
        });

        it('list have p', function() {
            var htmlStr = [
                '<p>p</p>',
                '<ul>',
                '<li><p>1</p></li>',
                '<li><p>2</p></li>',
                '<li>3</li>',
                '</ul>',
                '<p>p2</p>'
            ].join('');

            expect(toMark(htmlStr)).toEqual('p\n\n* 1\n\n* 2\n* 3\n\np2');
        });
    });
});
