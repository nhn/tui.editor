'use strict';

var toDom = require('../src/toDom');

describe('toDom', function() {
    describe('preProcess html text', function() {
        it('trim html strings', function() {
            var html = toDom.preProcess('   <h1>Hello World!</h1>   ');
            expect(html).toEqual('<h1>Hello World!</h1>');
        });

        it('remove spaces more than 1 between tags', function() {
            var html = toDom.preProcess('<h1>Hello World!</h1>    <h2>Hello World!</h2>');
            expect(html).toEqual('<h1>Hello World!</h1> <h2>Hello World!</h2>');
        });

        it('remove remove returns between tags', function() {
            var html = toDom.preProcess('<h1>hello</h1>\n<h2>world</h2>');
            expect(html).toEqual('<h1>hello</h1><h2>world</h2>');
        });

        it('dont remove remove returns in text node', function() {
            var html = toDom.preProcess('<pre><code>hel\nlo</code></pre>');
            expect(html).toEqual('<pre><code>hel\nlo</code></pre>');
        });

        it('text node can keep one space', function() {
            expect(toDom.preProcess('<p> text </p>')).toEqual('<p> text </p>');
            expect(toDom.preProcess('<code> text </code>')).toEqual('<code> text </code>');
            expect(toDom.preProcess('<pre><code> text </code></pre>')).toEqual('<pre><code> text </code></pre>');
        });
    });

    describe('HTML Text', function() {
        it('convert block tag to dom', function() {
            var dom = toDom('<h1>Hello World!</h1>');
            var node = dom.childNodes[0];
            var nodeText = node.innerText || node.textContent;

            expect(node.tagName).toEqual('H1');
            expect(nodeText).toEqual('Hello World!');
        });

        it('convert inline tag string to dom', function() {
            var dom = toDom('<a href="https://www.google.co.kr/" />');
            var node = dom.childNodes[0];

            expect(node.tagName).toEqual('A');
            expect(node.href).toEqual('https://www.google.co.kr/');
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
