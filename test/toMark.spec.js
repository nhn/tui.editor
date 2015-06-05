'use strict';

var toMark = require('../src/toMark');

describe('toMark', function() {
    it('markdown text\'s EOL FOL newline characters should be removed', function() {
        expect(toMark('<h1>Hello World!</h1>')).toEqual('# Hello World!');
    });

    it('html string should be trimed and remove all newline, tab characters', function() {
        expect(toMark('     <h1>Hello\n World!\n\t</h1>    \n\t')).toEqual('# Hello World!');
    });

    it('', function() {
        expect(toMark('<blockquote><p>imbq<br /></p></blockquote>'))
            .toEqual('> imbq');
    });

    xit('nbsp;', function() {
        expect(toMark('<h1>Hello &nbsp;World!</h1>')).toEqual('# Hello  World!');
    });
});


