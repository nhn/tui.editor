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
            expect(getMarkdownText('&nbsp;im     &nbsp;text&nbsp;')).toEqual('\u00a0im \u00a0text\u00a0');
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

        it('empty html string returns empty string', function() {
            expect(getMarkdownText('  \n')).toEqual('');
            expect(getMarkdownText('')).toEqual('');
        });

        it('should escape text', function() {
            expect(getMarkdownText('1. text')).toEqual('1\\. text');
            expect(getMarkdownText('&lt;text&gt;')).toEqual('\\<text>');
            // this should result '1\\. \\<text>'
            // we'll have to deal with #18 to handle this
            // until then, we tolerate over escaping the > char
            expect(getMarkdownText('1. &lt;text&gt;')).toEqual('1\\. \\<text\\>');
        });

        it('should escape all markdown paired characters.', function() {
            expect(getMarkdownText('foo*bar')).toBe('foo\\*bar');
            expect(getMarkdownText('foo*bar*baz')).toBe('foo\\*bar\\*baz');
            expect(getMarkdownText('foo**bar**baz')).toBe('foo\\*\\*bar\\*\\*baz');

            expect(getMarkdownText('foo_bar')).toBe('foo\\_bar');
            expect(getMarkdownText('foo_bar_baz')).toBe('foo\\_bar\\_baz');
            expect(getMarkdownText('foo__bar__baz')).toBe('foo\\_\\_bar\\_\\_baz');

            expect(getMarkdownText('foo~bar')).toBe('foo\\~bar');
            expect(getMarkdownText('foo~~bar~~baz')).toBe('foo\\~\\~bar\\~\\~baz');

            expect(getMarkdownText('foo`bar')).toBe('foo\\`bar');
            expect(getMarkdownText('foo`bar`')).toBe('foo\\`bar\\`');
        });
    });

    describe('inline', function() {
        it('em, i', function() {
            expect(getMarkdownText('<em></em>', 'emphasis')).toEqual('*emphasis*');
            expect(getMarkdownText('<i></i>', 'emphasis')).toEqual('*emphasis*');
        });

        it('empty em, i returns empty string', function() {
            expect(getMarkdownText('<em></em>', '')).toEqual('');
            expect(getMarkdownText('<em></em>', '\n')).toEqual('');
            expect(getMarkdownText('<i></i>', '')).toEqual('');
            expect(getMarkdownText('<i></i>', '\n')).toEqual('');
        });

        it('link', function() {
            expect(getMarkdownText('<a href="http://www.nhnent.com"></a>', 'NHNENT')).toEqual('[NHNENT](http://www.nhnent.com)');
            expect(getMarkdownText('<a href="#head"></a>', 'NHNENT')).toEqual('[NHNENT](#head)');
            expect(getMarkdownText('<a href="#head" title="myTitle"></a>', 'NHNENT')).toEqual('[NHNENT](#head "myTitle")');
        });

        it('link that has no text node return empty string', function() {
            expect(getMarkdownText('<a href="http://www.nhnent.com"></a>', '')).toEqual('');
        });

        it('link that has no href return text node', function() {
            expect(getMarkdownText('<a></a>', 'myText')).toEqual('myText');
        });

        it('link which has characters for markdown link syntax', function() {
            expect(getMarkdownText('<a href="#head"></a>', 'char []()<> to escape')).toEqual('[char \\[\\]\\(\\)\\<\\> to escape](#head)');
        });

        it('image', function() {
            expect(getMarkdownText('<img src="http://www.nhnent.com" alt="NHNENT" />')).toEqual('![NHNENT](http://www.nhnent.com)');
        });

        it('image return relative path', function() {
            expect(getMarkdownText('<img src="/nhnent" alt="NHNENT" />')).toEqual('![NHNENT](/nhnent)');
        });

        it('image without src returns empty string', function() {
            expect(getMarkdownText('<img alt="NHNENT" />')).toEqual('');
        });

        it('image which has characters for markdown image syntax', function() {
            expect(getMarkdownText('<img src="#head" alt="char []()<> to escape"></a>')).toEqual('![char \\[\\]\\(\\)\\<\\> to escape](#head)');
        });

        it('strong, b', function() {
            expect(getMarkdownText('<strong></strong>', 'imstrong')).toEqual('**imstrong**');
            expect(getMarkdownText('<b></b>', 'imstrong')).toEqual('**imstrong**');
        });

        it('empty strong, b returns empty string', function() {
            expect(getMarkdownText('<strong></strong>', '')).toEqual('');
            expect(getMarkdownText('<strong></strong>', '\n')).toEqual('');
            expect(getMarkdownText('<b></b>', '')).toEqual('');
            expect(getMarkdownText('<b></b>', '\n')).toEqual('');
        });

        it('code', function() {
            expect(getMarkdownText('<code></code>', 'imcode')).toEqual('`imcode`');
        });

        it('empty code returns empty string', function() {
            expect(getMarkdownText('<code></code>', '')).toEqual('');
            expect(getMarkdownText('<code></code>', ' \n')).toEqual('');
        });

        it('code with data-backtick', function() {
            expect(getMarkdownText('<code data-backticks="2"></code>', 'imcode')).toEqual('``imcode``');
            expect(getMarkdownText('<code data-backticks="3"></code>', 'imcode')).toEqual('```imcode```');
            expect(getMarkdownText('<code data-backticks="4"></code>', 'imcode')).toEqual('````imcode````');
        });

        it('br', function() {
            expect(getMarkdownText('<br />')).toEqual('  \n');
        });
    });

    describe('Headings', function() {
        it('heading with empty text', function() {
            expect(getMarkdownText('<h1></h1>', '')).toEqual('\n\n# \n\n');
        });

        it('heading with text', function() {
            expect(getMarkdownText('<h1></h1>', 'heading')).toEqual('\n\n# heading\n\n');
        });

        it('H1 ~ H6', function() {
            expect(getMarkdownText('<h1></h1>', '1')).toEqual('\n\n# 1\n\n');
            expect(getMarkdownText('<h2></h2>', '2')).toEqual('\n\n## 2\n\n');
            expect(getMarkdownText('<h3></h3>', '3')).toEqual('\n\n### 3\n\n');
            expect(getMarkdownText('<h4></h4>', '4')).toEqual('\n\n#### 4\n\n');
            expect(getMarkdownText('<h5></h5>', '5')).toEqual('\n\n##### 5\n\n');
            expect(getMarkdownText('<h6></h6>', '6')).toEqual('\n\n###### 6\n\n');
        });
    });

    describe('Lists', function() {
        it('ul, ol', function() {
            expect(getMarkdownText('<ol><li></li></ol>', '* 1\n')).toEqual('\n\n* 1\n\n\n');
            expect(getMarkdownText('<ul><li></li></ul>', '1. 1\n')).toEqual('\n\n1. 1\n\n\n');
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

        it('ol has start attribute', function() {
            expect(getMarkdownText('<ol start="5"><li></li><li></li></ol>', 'test1', 2)).toEqual('5. test1\n');
            expect(getMarkdownText('<ol start="5"><li></li><li></li></ol>', 'test2', 3)).toEqual('6. test2\n');
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

        it('if li has empty text then add blank', function() {
            expect(getMarkdownText('<ul><li></li></ul>', '', 2)).toEqual('* \n');
            expect(getMarkdownText('<ol><li></li></ol>', '', 2)).toEqual('1. \n');
        });

        it('return between li text content from nest list', function() {
            expect(getMarkdownText('<li><ul></ul></li>', '* text  \ntext\n* text', 2)).toEqual('\n    * text  \n    text\n    * text');
        });

        it('return end of li from nest list', function() {
            expect(getMarkdownText('<li><ul></ul></li>', '* text  \n\n* text', 2)).toEqual('\n    * text\n    * text');
        });

        it('convert multiple brs to one br', function() {
            expect(getMarkdownText('<ul><li></li></ul>', 'abdef  \n  \n  \nghi', 2)).toEqual('* abdef  \nghi\n');
            expect(getMarkdownText('<ol><li></li></ol>', 'abdef  \n  \n  \nghi', 2)).toEqual('1. abdef  \nghi\n');
        });

        it('p in li', function() {
            expect(getMarkdownText('<ul><li><p></p></li></ul>', 'abdef', 2)).toEqual('\n* abdef\n');
        });
    });

    describe('HR', function() {
        it('add hr line', function() {
            expect(getMarkdownText('<hr />')).toEqual('\n\n- - -\n\n');
        });
    });

    describe('blockquote', function() {
        it('add oneline blockquote', function() {
            expect(getMarkdownText('<blockquote></blockquote>', 'imblock\n')).toEqual('\n\n> imblock\n\n');
        });

        it('add \\n if there are no \\n in text end', function() {
            expect(getMarkdownText('<blockquote></blockquote>', 'imblock')).toEqual('\n\n> imblock\n\n');
        });

        it('add multiline blockqutoe', function() {
            expect(getMarkdownText('<blockquote></blockquote>', '\nimblock1\nimblock2\n')).toEqual('\n\n> imblock1\n> imblock2\n\n');
        });

        it('convert multiple brs to one br', function() {
            expect(getMarkdownText('<blockquote></blockquote>', '\nimblock1  \n  \n  \n \nimblock2\n')).toEqual('\n\n> imblock1\n> \n> imblock2\n\n');
        });

        it('add multiline content with some space to blockqutoe', function() {
            expect(getMarkdownText('<blockquote></blockquote>', 'imblock1\n  imblock2\n')).toEqual('\n\n> imblock1\n>   imblock2\n\n');
        });

        it('nested blockqutoe', function() {
            expect(getMarkdownText('<blockquote></blockquote>', getMarkdownText('<blockquote></blockquote>', '\nimblock1\nimblock2\n'))).toEqual('\n\n> > imblock1\n> > imblock2\n\n');
        });
    });

    describe('pre-code', function() {
        it('code with some spaces', function() {
            expect(getMarkdownText('<pre><code></code></pre>', 'function(){\n    var in=0;\n}', 2))
                .toEqual('\n\n    function(){\n        var in=0;\n    }\n\n');
        });
    });

    describe('P', function() {
        it('wrap newlines', function() {
            expect(getMarkdownText('<p></p>', 'paragraph')).toEqual('\n\nparagraph\n\n');
        });

        it('empty p returns empty string', function() {
            expect(getMarkdownText('<p></p>', '')).toEqual('');
        });

        it('convert multiple brs to one br', function() {
            expect(getMarkdownText('<p></p>', 'a  \n  \n  \nb')).toEqual('\n\na  \nb\n\n');
        });

        it('pass content in blockquote', function() {
            expect(getMarkdownText('<blockquote><p></p></blockquote>', 'paragraph', 2)).toEqual('paragraph');
        });
    });
});
