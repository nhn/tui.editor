'use strict';

var basicRenderer = require('../src/renderer.basic'),
    toDom = require('../src/toDom'),
    DomRunner = require('../src/domRunner');

describe('basicRenderer', function() {
    //test case use only
    function getMarkdownText(htmlStr, subContent, nextCount) {
        var runner = new DomRunner(toDom(htmlStr));

        nextCount = nextCount || 1;

        while (nextCount) {
            runner.next();
            nextCount -= 1;
        }

        return basicRenderer.convert(runner.getNode(), subContent);
    }

    describe('inline', function() {
        it('em', function() {
            expect(getMarkdownText('<em></em>', 'emphasis')).toEqual('*emphasis*');
        });

        it('link', function() {
            expect(getMarkdownText('<a href="http://www.nhnent.com"></a>', 'NHNENT')).toEqual('[NHNENT](http://www.nhnent.com/)');
        });

        it('image', function() {
            expect(getMarkdownText('<img src="http://www.nhnent.com" alt="NHNENT" />')).toEqual('![NHNENT](http://www.nhnent.com/)');
        });
    });

    describe('Headings', function() {
        it('heading with empty text', function() {
            expect(getMarkdownText('<h1></h1>', '')).toEqual('\n# ');
        });

        it('heading with text', function() {
            expect(getMarkdownText('<h1></h1>', 'heading')).toEqual('\n# heading');
        });

        it('H1 ~ H6', function() {
            expect(getMarkdownText('<h1></h1>', '1')).toEqual('\n# 1');
            expect(getMarkdownText('<h2></h2>', '2')).toEqual('\n## 2');
            expect(getMarkdownText('<h3></h3>', '3')).toEqual('\n### 3');
            expect(getMarkdownText('<h4></h4>', '4')).toEqual('\n#### 4');
            expect(getMarkdownText('<h5></h5>', '5')).toEqual('\n##### 5');
            expect(getMarkdownText('<h6></h6>', '6')).toEqual('\n###### 6');
        });
    });

    describe('Lists', function() {
        it('ul li', function() {
            expect(getMarkdownText('<ul><li></li></ul>', '1', 2)).toEqual('\n* 1');
        });

        it('ol li', function() {
            expect(getMarkdownText('<ol><li>1</li></ol>', '1', 2)).toEqual('\n1. 1');
        });

        xit('ol multiple li', function() {
            expect(getMarkdownText('<ol><li>1</li><li>2</li></ol>')).toEqual('1. 1\n2. 2\n');
        });

        fit('nested list', function() {
            var htmlStr = [
                '<ul>',
                    '<li>',
                        'list item',
                    '</li>',
                    '<li>',
                        '<ul>',
                            '<li>',
                                'nested item',
                            '</li>',
                        '</ul>',
                    '</li>',
                '</ul>'
            ].join('');

            expect(getMarkdownText(htmlStr)).toEqual('* list item\n    * nested item\n');
        });
    });
});
