'use strict';

var toMark = require('../src/toMark');
var toDom = require('../src/toDom');

describe('toMark', function() {
    it('convert heading tag to markdown', function() {
        var mdText = toMark('<h1>Hello World!</h1>');
        expect(mdText).toEqual('# Hello World!');
    });

    it('convert heading2 tag to markdown', function() {
        var mdText = toMark('<h2>Hello World!</h2>');
        expect(mdText).toEqual('## Hello World!');
    });
});

describe('toDom', function() {
    describe('convert block tag to dom', function() {
        it('node is correct', function() {
            var dom = toDom('<h1>Hello World!</h1>');
            expect(dom.childNodes[0].tagName).toEqual('H1');
            expect(dom.childNodes[0].innerText).toEqual('Hello World!');
        });
    });

    describe('convert inline tag string to dom', function() {
        it('node is correct', function() {
            var dom = toDom('<img src="https://www.google.co.kr/images/nav_logo195.png" alt="altText" />');
            expect(dom.childNodes.length).toEqual(1);
            expect(dom.childNodes[0].tagName).toEqual('IMG');
            expect(dom.childNodes[0].attributes[0].name).toEqual('src');
            expect(dom.childNodes[0].attributes[0].nodeValue).toEqual('https://www.google.co.kr/images/nav_logo195.png');
            expect(dom.childNodes[0].attributes[1].name).toEqual('alt');
            expect(dom.childNodes[0].attributes[1].nodeValue).toEqual('altText');
        });
    });
});


