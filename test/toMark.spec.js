'use strict';

var toMark = require('../src/toMark');

describe('toMark', function() {
    it('markdown text\'s EOL FOL newline characters should be removed', function() {
        expect(toMark('<h1>Hello World</h1>')).toEqual('# Hello World');
    });

    it('Empty spaces more than 1 are removed even if flanked space in tags', function() {
        expect(toMark('<h2>Hello <em> World</em></h2>')).toEqual('## Hello *World*');
        expect(toMark('<h2>Hello  <em>World</em></h2>')).toEqual('## Hello *World*');
        expect(toMark('<h2>Hello  <em>World </em></h2>')).toEqual('## Hello *World*');
        expect(toMark('<h2><em>Hello</em> <em>World</em></h2>')).toEqual('## *Hello* *World*');
        expect(toMark('<h2><em>Hello</em> World</em></h2>')).toEqual('## *Hello* World');
        expect(toMark('<h2><em>Hello </em> World</em></h2>')).toEqual('## *Hello* World');
        expect(toMark('<h2><em>Hello </em>World</em></h2>')).toEqual('## *Hello* World');
        expect(toMark('<h2><em>Hello</em>  &nbsp;&nbsp;World</h2>')).toEqual('## *Hello* \u00a0\u00a0World');
        expect(toMark('<h2><em>Hello&nbsp;</em>  &nbsp;&nbsp;World</h2>')).toEqual('## *Hello\u00a0* \u00a0\u00a0World');
    });

    it('p and inlines', function() {
        expect(toMark('<p>this is link <a href="http://nhnent.com">link</a></p>')).toEqual('this is link [link](http://nhnent.com/)');
        expect(toMark('<p><em>this</em> is link <a href="http://nhnent.com">link</a></p>')).toEqual('*this* is link [link](http://nhnent.com/)');
        expect(toMark('<p><em>this</em> is &nbsp;<strong>strong</strong></p>')).toEqual('*this* is \u00a0**strong**');
    });
});
