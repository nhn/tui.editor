'use strict';

var toDom = require('../src/toDom');

describe('toDom', function() {
    describe('convert block tag to dom', function() {
        it('node is correct', function() {
            var dom = toDom('<h1>Hello World!</h1>');
            var node = dom.childNodes[0];
            var nodeText = node.innerText || node.textContent;

            expect(node.tagName).toEqual('H1');
            expect(nodeText).toEqual('Hello World!');
        });
    });

    describe('convert inline tag string to dom', function() {
        it('node is correct', function() {
            var dom = toDom('<img src="https://www.google.co.kr/images/nav_logo195.png" alt="altText" />');
            var node = dom.childNodes[0];

            expect(node.tagName).toEqual('IMG');
            expect(node.src).toEqual('https://www.google.co.kr/images/nav_logo195.png');
            expect(node.alt).toEqual('altText');
        });
    });
});

