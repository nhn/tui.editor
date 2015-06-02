'use strict';

var basicRenderer = require('../src/renderer.basic'),
    toDom = require('../src/toDom'),
    DomRunner = require('../src/domRunner');

describe('basicRenderer', function() {
    function getMarkdownText(htmlStr) {
        var runner = new DomRunner(toDom(htmlStr));
        runner.next();

        return basicRenderer.convert(runner);
    }

    describe('inline', function() {
        it('em', function() {
            expect(getMarkdownText('<em>emphasis</em>')).toEqual('*emphasis*');
        });

        it('link', function() {
            expect(getMarkdownText('<a href="http://www.nhnent.com">NHNENT</a>')).toEqual('[NHNENT](http://www.nhnent.com/)');
        });

        it('image', function() {
            expect(getMarkdownText('<img src="http://www.nhnent.com" alt="NHNENT" />')).toEqual('![NHNENT](http://www.nhnent.com/)');
        });
    });

    describe('Headings', function() {
        it('heading with empty text', function() {
            expect(getMarkdownText('<h1></h1>')).toEqual('# ');
        });

        it('heading with text', function() {
            expect(getMarkdownText('<h1>heading</h1>')).toEqual('# heading');
        });

        it('heading with inline element', function() {
            var htmlStr = [
                '<h1>',
                    '<em>heading</em>',
                '</h1>'
            ].join('');

            expect(getMarkdownText(htmlStr)).toEqual('# *heading*');
        });

        it('H1 ~ H6', function() {
            expect(getMarkdownText('<h1>1</h1>')).toEqual('# 1');
            expect(getMarkdownText('<h2>2</h2>')).toEqual('## 2');
            expect(getMarkdownText('<h3>3</h3>')).toEqual('### 3');
            expect(getMarkdownText('<h4>4</h4>')).toEqual('#### 4');
            expect(getMarkdownText('<h5>5</h5>')).toEqual('##### 5');
            expect(getMarkdownText('<h6>6</h6>')).toEqual('###### 6');
        });
    });
});
