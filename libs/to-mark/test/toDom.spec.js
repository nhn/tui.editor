'use strict';

var toDom = require('../src/toDom');

describe('toDom', function() {
    describe('HTML Text', function() {
        it('trim html strings', function() {
            var dom = toDom('   <h1>Hello World!</h1>   ');
            //toUpperCase for CrossBrowsing Issue
            expect(dom.innerHTML.toUpperCase()).toEqual('<h1>Hello World!</h1>'.toUpperCase());
        });

        it('remove spaces more than 1 between tags', function() {
            var dom = toDom('<h1>Hello World!</h1>    <h2>Hello World!</h2>');
            expect(dom.innerHTML.toUpperCase()).toEqual('<h1>Hello World!</h1> <h2>Hello World!</h2>'.toUpperCase());
        });

        it('remove remove returns between tags', function() {
            var dom = toDom('<h1>hello</h1>\n<h2>world</h2>');
            expect(dom.innerHTML.toUpperCase()).toEqual('<h1>hello</h1><h2>world</h2>'.toUpperCase());
        });

        it('dont remove remove returns in text node', function() {
            var dom = toDom('<pre><code>hel\nlo</code></pre>');
            expect(dom.firstChild.firstChild.firstChild.nodeValue).toEqual('hel\nlo');
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

        //this test has cross browser issue in IE7/IE8
        xit('text node', function() {
            expect(toDom('<p> text </p>').innerHTML).toEqual('<p> text </p>');
            expect(toDom('<code> text </code>').innerHTML).toEqual('<code> text </code>');
            expect(toDom('<pre><code> text </code></pre>').innerHTML).toEqual('<pre><code> text </code></pre>');
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
