'use strict';

var toMark = require('../src/toMark');

describe('toMark', function() {
    it('convert heading tag to markdown', function() {
        var mdText = toMark('<h1>Hello World!</h1>');
        expect(mdText).toEqual('# Hello World!');
    });

    it('convert heading2 tag to markdown', function() {
        var mdText = toMark('<h2>Hello <em>World!</em></h2>');
        expect(mdText).toEqual('## Hello *World!*');
    });

    it('convert heading2 tag to markdown', function() {
        var mdText = toMark('<h2>Hello <em>World!</em></h2>');
        expect(mdText).toEqual('## Hello *World!*');
    });

    it('convert heading1, heading2 tag to markdown', function() {
        var mdText = toMark('<h1>Hello World!</h1><h2>Hello World!</h2>');
        expect(mdText).toEqual('# Hello World!\n## Hello World!');
    });
});


