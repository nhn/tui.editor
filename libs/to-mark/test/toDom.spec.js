'use strict';

var toDom = require('../src/toDom');

describe('toDom', function() {
    it('convert block tag to dom', function() {
        var dom = toDom('<h1>Hello World!</h1>');
        var node = dom.childNodes[0];
        var nodeText = node.innerText || node.textContent;

        expect(node.tagName).toEqual('H1');
        expect(nodeText).toEqual('Hello World!');
    });

    it('convert inline tag string to dom', function() {
        var dom = toDom('<img src="https://www.google.co.kr/images/nav_logo195.png" alt="altText" />');
        var node = dom.childNodes[0];

        expect(node.tagName).toEqual('IMG');
        expect(node.src).toEqual('https://www.google.co.kr/images/nav_logo195.png');
        expect(node.alt).toEqual('altText');
    });

    it('add __htmlRootByToMark property to root element', function() {
        var dom = toDom('<img src="https://www.google.co.kr/images/nav_logo195.png" alt="altText" />');
        expect(dom.__htmlRootByToMark).toBe(true);
    });
});

