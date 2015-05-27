'use strict';

var toDom = require('../src/toDom');

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
            expect(dom.childNodes[0].src).toEqual('https://www.google.co.kr/images/nav_logo195.png');
            expect(dom.childNodes[0].attributes[1].name).toEqual('alt');
            expect(dom.childNodes[0].alt).toEqual('altText');
        });
    });
});

