'use strict';

var DomRunner = require('../src/domRunner'),
    toDom = require('../src/toDom');

describe('domRunner', function() {
    var domRunner;

    describe('get nodes text', function() {
        beforeEach(function() {
            var htmlStr = [
                '<h1>Hello World!</h1>'
            ].join('');

            domRunner = new DomRunner(toDom(htmlStr));
        });

        it('get elements text', function() {
            var text;

            domRunner.next();
            text = domRunner.getNodeText();

            expect(text).toEqual('Hello World!');
        });

        it('get text nodes text', function() {
            var text;

            domRunner.next();
            domRunner.next();
            text = domRunner.getNodeText();

            expect(text).toEqual('Hello World!');
        });
    });

    describe('iterate Nodes 1depth', function() {
        beforeEach(function() {
            var htmlStr = [
                '<h1>Hello World!</h1>',
                '<p>paragraph </p>'
            ].join('');

            domRunner = new DomRunner(toDom(htmlStr));
        });

        it('first node is h1', function() {
            var node = domRunner.next();

            expect(node.tagName).toEqual('H1');
            expect(domRunner.getNodeText()).toEqual('Hello World!');
        });

        it('second node is text node', function() {
            var node;

            domRunner.next();
            node = domRunner.next();

            expect(node.nodeType).toEqual(DomRunner.NODE_TYPE.TEXT_NODE);
            expect(domRunner.getNodeText()).toEqual('Hello World!');
        });

        it('third node is tag p', function() {
            var node;

            domRunner.next();
            domRunner.next();
            node = domRunner.next();

            expect(node.tagName).toEqual('P');
        });

        it('fourth node is text node', function() {
            var node;

            domRunner.next();
            domRunner.next();
            domRunner.next();
            node = domRunner.next();

            expect(node.nodeType).toEqual(DomRunner.NODE_TYPE.TEXT_NODE);
            expect(node.nodeValue).toEqual('paragraph ');
        });
    });

    describe('iterate Nodes 2Depth with inline', function() {
        beforeEach(function() {
            var htmlStr = [
                '<p>make me <strong>bold</strong></p>'
            ].join('');

            domRunner = new DomRunner(toDom(htmlStr));
        });

        it('first node is p', function() {
            var node = domRunner.next();

            expect(node.tagName).toEqual('P');
            expect(domRunner.getNodeText()).toEqual('make me bold');
        });

        it('second node is text', function() {
            var node;

            domRunner.next();
            node = domRunner.next();

            expect(node.nodeType).toEqual(DomRunner.NODE_TYPE.TEXT_NODE);
            expect(node.nodeValue).toEqual('make me ');
        });

        it('third node is strong', function() {
            var node;

            domRunner.next();
            domRunner.next();
            node = domRunner.next();

            expect(node.tagName).toEqual('STRONG');
        });

        it('fourth node is text node', function() {
            var node;

            domRunner.next();
            domRunner.next();
            domRunner.next();
            node = domRunner.next();

            expect(node.nodeType).toEqual(DomRunner.NODE_TYPE.TEXT_NODE);
            expect(node.nodeValue).toEqual('bold');
        });
    });

    describe('iterate Nodes of list', function() {
        beforeEach(function() {
            var htmlStr = [
                '<ul>',
                    '<li>myli <strong>bold</strong></li>',
                    '<li><img src="https://www.google.co.kr/images/nav_logo195.png" /> after image</li>',
                '</ul>'
            ].join('');

            domRunner = new DomRunner(toDom(htmlStr));
        });

        it('first node is ul', function() {
            var node;

            node = domRunner.next();
            expect(node.tagName).toEqual('UL');
        });

        it('second node is li', function() {
            var node;

            domRunner.next();
            node = domRunner.next();

            expect(node.tagName).toEqual('LI');
        });

        it('thid node is text node', function() {
            var node;

            domRunner.next();
            domRunner.next();
            node = domRunner.next();

            expect(node.nodeType).toEqual(DomRunner.NODE_TYPE.TEXT_NODE);
            expect(node.nodeValue).toEqual('myli ');
        });

        it('fourth node is strong', function() {
            var node;

            domRunner.next();
            domRunner.next();
            domRunner.next();
            node = domRunner.next();

            expect(node.tagName).toEqual('STRONG');
        });

        it('fifth node is text node', function() {
            var node;

            domRunner.next();
            domRunner.next();
            domRunner.next();
            domRunner.next();
            node = domRunner.next();

            expect(node.nodeType).toEqual(DomRunner.NODE_TYPE.TEXT_NODE);
            expect(node.nodeValue).toEqual('bold');
        });

        it('sixth node is LI', function() {
            var node;

            domRunner.next();
            domRunner.next();
            domRunner.next();
            domRunner.next();
            domRunner.next();
            node = domRunner.next();

            expect(node.tagName).toEqual('LI');
        });

        it('seventh node is IMG', function() {
            var node;

            domRunner.next();
            domRunner.next();
            domRunner.next();
            domRunner.next();
            domRunner.next();
            domRunner.next();
            node = domRunner.next();

            expect(node.tagName).toEqual('IMG');
            expect(node.src).toEqual('https://www.google.co.kr/images/nav_logo195.png');
        });

        it('eighth node is text', function() {
            var node;

            domRunner.next();
            domRunner.next();
            domRunner.next();
            domRunner.next();
            domRunner.next();
            domRunner.next();
            domRunner.next();
            node = domRunner.next();

            expect(node.nodeType).toEqual(DomRunner.NODE_TYPE.TEXT_NODE);
            expect(node.nodeValue).toEqual(' after image');
        });

        it('nineth node is null', function() {
            var node;

            domRunner.next();
            domRunner.next();
            domRunner.next();
            domRunner.next();
            domRunner.next();
            domRunner.next();
            domRunner.next();
            domRunner.next();
            node = domRunner.next();

            expect(node).toBe(null);
        });
    });

    describe('iterate Nodes of table', function() {
        beforeEach(function() {
            var htmlStr = [
                '<table>',
                    '<colgroup>',
                        '<col align="left">',
                        '<col align="right">',
                    '</colgroup>',
                    '<thead>',
                        '<tr>',
                            '<th>thtext1</th>',
                            '<th>thtext2</th>',
                        '</tr>',
                    '</thead>',
                    '<tbody>',
                        '<tr>',
                            '<td>tdtext1</td>',
                            '<td>tdtext2</td>',
                        '</tr>',
                    '</tbody>',
                '</table>'
            ].join('');

            domRunner = new DomRunner(toDom(htmlStr));
        });

        it('check table tags', function() {
            var node;

            node = domRunner.next();
            expect(node.tagName).toEqual('TABLE');

            node = domRunner.next();
            expect(node.tagName).toEqual('COLGROUP');

            node = domRunner.next();
            expect(node.tagName).toEqual('COL');
            expect(node.align).toEqual('left');

            node = domRunner.next();
            expect(node.tagName).toEqual('COL');
            expect(node.align).toEqual('right');

            node = domRunner.next();
            expect(node.tagName).toEqual('THEAD');

            node = domRunner.next();
            expect(node.tagName).toEqual('TR');

            node = domRunner.next();
            expect(node.tagName).toEqual('TH');
        });
    });

    describe('iterate stop when next node is root node', function() {
        beforeEach(function() {
            var htmlStr = [
                '<div>',
                    '<p>myli <strong>bold</strong></p>',
                '</div>',
                '<pre>next</pre>'
            ].join('');

            var dom = toDom(htmlStr);

            domRunner = new DomRunner(toDom(dom.firstChild));
        });

        it('no more next over root', function() {
            domRunner.next();
            domRunner.next();
            domRunner.next();
            domRunner.next();
            domRunner.next(); //root

            expect(domRunner.getNode()).toBeNull();
        });
    });

    describe('get current node', function() {
        beforeEach(function() {
            domRunner = new DomRunner(toDom('<div>currentText</div>'));
        });

        it('check table tags', function() {
            expect(domRunner.next()).toBe(domRunner.getNode());
        });
    });

    describe('if next node is nothing left, returns null', function() {
        beforeEach(function() {
            domRunner = new DomRunner(toDom('<div>currentText</div>'));
        });

        it('domRunner returns null', function() {
            domRunner.next();
            domRunner.next();
            expect(domRunner.next()).toBeNull();
        });
    });

    describe('normalize text nodes', function() {
        beforeEach(function() {
            var dom = toDom('test -');
            dom.appendChild(document.createTextNode('text'));
            domRunner = new DomRunner(dom);
        });

        it('domRunner returns normalized node', function() {
            expect(domRunner.next().nodeValue).toBe('test -text');
        });
    });
});
