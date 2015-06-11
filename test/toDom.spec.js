'use strict';

var toDom = require('../src/toDom');

describe('toDom', function() {
    describe('HTML Text', function() {
        it('trim html strings', function() {
            var dom = toDom('   <h1>Hello World!</h1>   ');
            expect(dom.innerHTML).toEqual('<h1>Hello World!</h1>');
        });

        it('remove text nodes spaces more than 1', function() {
            var dom = toDom('<h1>Hello            World!</h1>');
            expect(dom.innerHTML).toEqual('<h1>Hello World!</h1>');
        });

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

    describe('Dom', function() {
        beforeEach(function() {
            document.body.innerHTML = '';
            document.body.innerHTML = '<div id="rootToRender"><h1>Hello World!</h1></div>';
        });

        it('check dom node', function() {
            var dom = toDom(document.getElementById('rootToRender'));
            var node = dom.childNodes[0];
            var nodeText = node.innerText || node.textContent;

            expect(node.tagName).toEqual('H1');
            expect(nodeText).toEqual('Hello World!');
            expect(dom.__htmlRootByToMark).toBe(true);
        });
    });
});
