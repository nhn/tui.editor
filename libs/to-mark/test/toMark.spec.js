'use strict';

var toMark = require('../src/toMark');

describe('toMark', function() {
    it('markdown text\'s EOL FOL newline characters should be removed', function() {
        expect(toMark('<h1>Hello World!</h1>')).toEqual('# Hello World!');
    });

    it('html string should be trimed', function() {
        expect(toMark('     <h1>Hello World!</h1>    \n\t')).toEqual('# Hello World!');
    });

    xit('nbsp;', function() {
        expect(toMark('<h1>Hello &nbsp;World!</h1>')).toEqual('# Hello  World!');
    });
});


