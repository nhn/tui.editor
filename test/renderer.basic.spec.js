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

    describe('TEXT_NODE', function() {
        it('Text node should trimed except &nbsp;', function() {
            //&nbspl turns \u00a0 in dom node
            expect(getMarkdownText('&nbsp;im text')).toEqual('\u00a0im text');
            expect(getMarkdownText(' &nbsp;im text ')).toEqual('\u00a0im text');
            expect(getMarkdownText('&nbsp;im &nbsp;text&nbsp;')).toEqual('\u00a0im \u00a0text\u00a0');
        });

        it('텍스트노드와 나란히 있는 태그안의 공백은 텍스트노드의 공백한개로 대체된다', function() {
            expect(getMarkdownText('<h1>hello <em>world</em></h1>', null, 2)).toEqual('hello ');
            expect(getMarkdownText('<h1>hello<em> world</em></h1>', null, 2)).toEqual('hello ');
            expect(getMarkdownText('<h1>hello&nbsp;<em> world</em></h1>', null, 2)).toEqual('hello\u00a0 ');
            expect(getMarkdownText('<h1><em>hello</em> world</em></h1>', null, 4)).toEqual(' world');
            expect(getMarkdownText('<h1><em>hello </em>world</em></h1>', null, 4)).toEqual(' world');
        });

        it('returns pure nodeValue of text node in code tag', function() {
            expect(getMarkdownText('<pre><code> my*code* </code></pre>', null, 3)).toEqual(' my*code* ');
        });
    });

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

        it('strong', function() {
            expect(getMarkdownText('<strong></strong>', 'imstrong')).toEqual('**imstrong**');
        });

        it('code', function() {
            expect(getMarkdownText('<code></code>', 'imcode')).toEqual('`imcode`');
        });
        it('br', function() {
            expect(getMarkdownText('<br />')).toEqual('  \n');
        });
    });

    describe('Headings', function() {
        it('heading with empty text', function() {
            expect(getMarkdownText('<h1></h1>', '')).toEqual('\n# \n');
        });

        it('heading with text', function() {
            expect(getMarkdownText('<h1></h1>', 'heading')).toEqual('\n# heading\n');
        });

        it('H1 ~ H6', function() {
            expect(getMarkdownText('<h1></h1>', '1')).toEqual('\n# 1\n');
            expect(getMarkdownText('<h2></h2>', '2')).toEqual('\n## 2\n');
            expect(getMarkdownText('<h3></h3>', '3')).toEqual('\n### 3\n');
            expect(getMarkdownText('<h4></h4>', '4')).toEqual('\n#### 4\n');
            expect(getMarkdownText('<h5></h5>', '5')).toEqual('\n##### 5\n');
            expect(getMarkdownText('<h6></h6>', '6')).toEqual('\n###### 6\n');
        });
    });

    describe('Lists', function() {
        it('ul, ol', function() {
            expect(getMarkdownText('<ol><li></li></ol>', '* 1\n')).toEqual('\n* 1\n\n');
            expect(getMarkdownText('<ul><li></li></ul>', '1. 1\n')).toEqual('\n1. 1\n\n');
        });
        it('ul li', function() {
            expect(getMarkdownText('<ul><li></li></ul>', '1', 2)).toEqual('* 1\n');
        });

        it('ol li', function() {
            expect(getMarkdownText('<ol><li>1</li></ol>', '1', 2)).toEqual('1. 1\n');
        });

        it('ol multiple li', function() {
            expect(getMarkdownText('<ol><li></li><li></li></ol>', '2', 3)).toEqual('2. 2\n');
            expect(getMarkdownText('<ol><li></li><li></li><li></li></ol>', '3', 4)).toEqual('3. 3\n');
        });

        it('nested list', function() {
            var htmlStr = [
                '<ul>',
                    '<li></li>',
                    '<li>',
                        '<ul>',
                            '<li>',
                            '</li>',
                        '</ul>',
                    '</li>',
                '</ul>'
            ].join('');

            expect(getMarkdownText(htmlStr, '* item\n* item\n', 4)).toEqual('\n    * item\n    * item');
        });
    });

    describe('HR', function() {
        it('add hr line', function() {
            expect(getMarkdownText('<hr />')).toEqual('\n- - -\n');
        });
    });

    describe('blockquote', function() {
        it('add oneline blockquote', function() {
            expect(getMarkdownText('<blockquote></blockquote>', 'imblock\n')).toEqual('\n> imblock\n');
        });

        it('add \n if there are no \n in text end', function() {
            expect(getMarkdownText('<blockquote></blockquote>', 'imblock')).toEqual('\n> imblock\n');
        });

        it('add multiline blockqutoe', function() {
            expect(getMarkdownText('<blockquote></blockquote>', '\nimblock1\nimblock2\n')).toEqual('\n> imblock1\n> imblock2\n');
        });

        it('add multiline content with some space to blockqutoe', function() {
            expect(getMarkdownText('<blockquote></blockquote>', 'imblock1\n  imblock2\n')).toEqual('\n> imblock1\n>   imblock2\n');
        });

        it('nested blockqutoe', function() {
            expect(getMarkdownText('<blockquote></blockquote>', getMarkdownText('<blockquote></blockquote>', '\nimblock1\nimblock2\n'))).toEqual('\n> > imblock1\n> > imblock2\n');
        });
    });

    describe('pre-code', function() {
        it('code with some spaces', function() {
            expect(getMarkdownText('<pre><code></code></pre>', 'function(){\n    var in=0;\n}', 2))
                .toEqual('\n    function(){\n        var in=0;\n    }\n');
        });
    });

    describe('P', function() {
        it('wrap newlines', function() {
            expect(getMarkdownText('<p></p>', 'paragraph')).toEqual('\nparagraph\n');
        });

        it('pass content when sone conditions', function() {
            expect(getMarkdownText('<blockquote><p></p></blockquote>', 'paragraph', 2)).toEqual('paragraph');
        });
    });
});
