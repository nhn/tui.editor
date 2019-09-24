/**
 * @fileoverview test convertor
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import Convertor from '@/convertor';
import EventManager from '@/eventManager';
import toMarkRenderer from '@/toMarkRenderer';

describe('Convertor', () => {
  let convertor, em;

  beforeEach(() => {
    em = new EventManager();
    convertor = new Convertor(em);
    convertor.initHtmlSanitizer();
  });

  describe('markdown to html', () => {
    it('converting markdown to html', () => {
      expect(convertor.toHTML('# HELLO WORLD')).toEqual('<h1>HELLO WORLD</h1>\n');
      expect(convertor.toHTMLWithCodeHightlight('# HELLO WORLD')).toEqual('<h1>HELLO WORLD</h1>\n');
    });

    it('sanitize script tags', () => {
      expect(convertor.toHTML('<script>alert("test");</script>')).toEqual('');
      expect(convertor.toHTMLWithCodeHightlight('<script>alert("test");</script>')).toEqual('');
    });

    it('escape vertical bar', () => {
      expect(convertor.toHTML('| 1 | 2 |\n| -- | -- |\n| 4\\|5 | 6 |\n').match(/\/td/g).length).toEqual(2);
      expect(convertor.toHTMLWithCodeHightlight('| 1 | 2 |\n| -- | -- |\n| 3 | 4\\|4 |\n').match(/\/td/g).length)
        .toEqual(2);
    });

    it('<br> is added between lines', () => {
      const expected = [
        '1',
        '\n',
        '<br>',
        '<br>',
        '2',
        '\n',
        '<br>',
        '<br>',
        '<br>',
        '3'
      ].join('\n');
      const result = [
        '<p>1</p>',
        '<p><br><br>2</p>',
        '<p><br><br><br>3</p>\n'
      ].join('\n');

      expect(convertor.toHTMLWithCodeHightlight(expected)).toBe(result);
    });

    it('Avoid hidden last cell in table', () => {
      expect(convertor.toHTML('| a |  |  |\n| ----------- | --- | --- |\n|  | b |  |\n|  |  |  |\ntext').match(/\/td/g).length).toEqual(6);
    });
    it('Avoid hidden last cell in table', () => {
      expect(convertor.toHTML('first\n\n<br>first\n\n```\nsecond\n\n\nsecond\n```\n\n')).toBe('<p>first</p>\n<p><br data-tomark-pass="">first</p>\n<pre><code>second\n\n\nsecond\n</code></pre>\n');
    });

    it('do not add line breaks in table before and after image syntax', () => {
      expect(convertor._markdownToHtmlWithCodeHighlight('\n| ![nhn](http://www.nhn.com/) |  |  |\n| ----------- | --- | --- |\n|  | b |  |\n|  |  |  |\ntext').match(/\/td/g).length).toEqual(6);
    });

    it('do not add line breaks in list before and after image syntax', () => {
      expect(convertor._markdownToHtmlWithCodeHighlight('\n* asd![nhn](http://www.nhn.com/)\n- asd![nhn](http://www.nhn.com/)\n1. asd![nhn](http://www.nhn.com/)\n* [ ] asd![nhn](http://www.nhn.com/)\n').match(/\/p/g)).toBe(null);
    });

    it('should store number of backticks in code to data-backticks attribute', () => {
      expect(convertor.toHTML('`code span`').trim()).toEqual('<p><code data-backticks="1">code span</code></p>');
      expect(convertor.toHTML('```code span```').trim()).toEqual('<p><code data-backticks="3">code span</code></p>');
      expect(convertor.toHTMLWithCodeHightlight('`code span`').trim()).toEqual('<p><code data-backticks="1">code span</code></p>');
      expect(convertor.toHTMLWithCodeHightlight('```code span```').trim()).toEqual('<p><code data-backticks="3">code span</code></p>');
    });

    it('should store number of backticks in codeblock to data-backtics attribute', () => {
      expect(convertor.toHTML('```\ncode block\n```').replace(/\n/g, '').trim()).toEqual('<pre><code>code block</code></pre>');
      expect(convertor.toHTML('````\ncode block\n````').replace(/\n/g, '').trim()).toEqual('<pre><code data-backticks="4">code block</code></pre>');
    });

    it('should convert blockquote even if there is a line above it (ref #989)', () => {
      expect(convertor.toHTML('text above\n> quote').replace(/\n/g, '')).toEqual('<p>text above</p><blockquote><p>quote</p></blockquote>');
    });

    it('should insert data-tomark-pass in html tag', () => {
      const tag = '<table></table>';

      const expectedHTML = '<table data-tomark-pass=""></table>';

      expect(convertor.toHTML(tag).replace(/\n/g, '')).toEqual(expectedHTML);
    });

    it('should insert data-tomark-pass in html tag with markdown syntax', () => {
      const tag = [
        '| | |',
        '| --- | --- |',
        '| aa | <ul><li>test</li></ul> |'
      ].join('\n');

      const expectedHTML = [
        '<table><thead><tr><th></th><th></th></tr></thead>',
        '<tbody><tr><td>aa</td>',
        '<td><ul data-tomark-pass=""><li data-tomark-pass="">test</li></ul></td>',
        '</tr></tbody></table>'
      ].join('');

      expect(convertor.toHTML(tag).replace(/\n/g, '')).toEqual(expectedHTML);
    });

    it('should insert data-tomark-pass in html tag even if attrubute has slash', () => {
      const imgTag = '<img src="https://user-images.githubusercontent.com/1215767/34336735-e7c9c4b0-e99c-11e7-853b-2449b51f0bab.png">';
      const expectedHTML = '<p><img src="https://user-images.githubusercontent.com/1215767/34336735-e7c9c4b0-e99c-11e7-853b-2449b51f0bab.png" data-tomark-pass=""></p>';

      expect(convertor.toHTML(imgTag).replace(/\n/g, '')).toEqual(expectedHTML);
    });

    it('should not insert data-tomark-pass in codeblock that has tag', () => {
      const codeBlockMd = '```\n<p>hello</p>\n```';
      const expectedHTML = `<pre><code>&lt;p&gt;hello&lt;/p&gt;</code></pre>`;

      expect(convertor.toHTML(codeBlockMd).replace(/\n/g, '')).toEqual(expectedHTML);
    });

    it('should not insert data-tomark-pass in codeblock that has tag with attribute', () => {
      const codeBlockMd = '```\n<p class="test">hello</p>\n```';
      const expectedHTML = `<pre><code>&lt;p class="test"&gt;hello&lt;/p&gt;</code></pre>`;

      expect(convertor.toHTML(codeBlockMd).replace(/\n/g, '')).toEqual(expectedHTML);
    });

    it('should not insert data-tomark-pass in codeblock that has tag of empty element.', () => {
      const codeBlockMd = '```\n<br/><br /><input type="text" />\n```';
      const expectedHTML = `<pre><code>&lt;br/&gt;&lt;br /&gt;&lt;input type="text" /&gt;</code></pre>`;

      expect(convertor.toHTML(codeBlockMd).replace(/\n/g, '')).toEqual(expectedHTML);
    });
  });

  describe('html to markdown', () => {
    function toMark(html) {
      return convertor.toMarkdown(html, {
        gfm: true,
        renderer: toMarkRenderer
      });
    }

    it('converting markdown to html', () => {
      expect(toMark('<h1 id="hello-world">HELLO WORLD</h1>')).toEqual('# HELLO WORLD');
    });

    it('should reserve br on multi line breaks', () => {
      expect(toMark('HELLO WORLD<br><br><br>!')).toEqual('HELLO WORLD\n\n<br>\n!');
    });

    it('should not reserve br on normal line breaks', () => {
      expect(toMark('HELLO WORLD<br><br>!')).toEqual('HELLO WORLD\n\n!');
    });

    it('should not reserve br in codeblock', () => {
      expect(toMark('<pre><code>HELLO WORLD\n\n\n\n\n!</code></pre>')).toEqual('```\nHELLO WORLD\n\n\n\n\n!\n```');
    });

    it('should reserve br to inline in table', () => {
      const html = '<table>' +
                '<thead><th>1</th><th>2</th><th>3</th></thead>' +
                '<tbody><td>HELLO WORLD<br><br><br><br><br>!</td><td>4</td><td>5</td></tbody>' +
                '</table>';
      const markdown = '| 1 | 2 | 3 |\n| --- | --- | --- |\n| HELLO WORLD<br><br><br><br><br>! | 4 | 5 |';
      expect(toMark(html)).toEqual(markdown);
    });

    it('should escape html in html text', () => {
      // valid tags
      expect(toMark('im &lt;span&gt; text')).toEqual('im \\<span> text');
      expect(toMark('im &lt;span attr="value"&gt; text')).toEqual('im \\<span attr="value"> text');
      expect(toMark('im &lt;!-- comment --&gt; text')).toEqual('im \\<!-- comment --> text');

      // common mark auto link
      expect(toMark('im &lt;http://google.com&gt; text')).toEqual('im \\<http://google.com> text');

      // invalid tags
      expect(toMark('im &lt;\\span&gt; text')).toEqual('im <\\span> text');
      expect(toMark('im &lt;/span attr="value"&gt; text')).toEqual('im </span attr="value"> text');
    });

    it('should print number of backticks for code according to data-backticks attribute', () => {
      expect(toMark('<code data-backticks="1">code span</code>').trim()).toEqual('`code span`');
      expect(toMark('<code data-backticks="3">code span</code>').trim()).toEqual('```code span```');
    });

    it('should print number of backticks for code block according to data-backticks attribute', () => {
      expect(toMark('<pre><code>code block</code></pre>').trim()).toEqual('```\ncode block\n```');
      expect(toMark('<pre><code data-backticks="4">code block</code></pre>').trim()).toEqual('````\ncode block\n````');
    });

    it('should treat $ special characters', () => {
      expect(toMark('<span>,;:$&+=</span>').trim()).toEqual('<span>,;:$&+=</span>');
    });

    it('should convert BRs to newline', () => {
      expect(toMark('text<br><br>text')).toBe('text\n\ntext');
      expect(toMark('<b>text</b><br><br>text')).toBe('**text**\n\ntext');
      expect(toMark('<i>text</i><br><br>text')).toBe('*text*\n\ntext');
      expect(toMark('<s>text</s><br><br>text')).toBe('~~text~~\n\ntext');
      expect(toMark('<code>text</code><br><br>text')).toBe('`text`\n\ntext');
      expect(toMark('<a href="some_url">text</a><br><br>text')).toBe('[text](some_url)\n\ntext');
      expect(toMark('<span>text</span><br><br>text'))
        .toBe('<span>text</span>\n\ntext');
    });

    describe('should prevent <br> from being removed if there is only one empty line before or after the block element.', () => {
      it('header with inline elements', () => {
        const html = [
          'foo',
          '<br>', // Generated when a line break occurs after an inline element.
          '<br>',
          '<h1>bar</h1>',
          '<br>',
          'baz'
        ].join('');

        const markdown = [
          'foo',
          '<br>',
          '# bar',
          '<br>',
          'baz'
        ].join('\n');

        expect(toMark(html)).toBe(markdown);
      });

      it('codeblock with inline elements', () => {
        const html = [
          'foo',
          '<br>', // Generated when a line break occurs after an inline element.
          '<br>',
          '<pre><code>bar</code></pre>',
          '<br>',
          'baz'
        ].join('');
        const markdown = [
          'foo',
          '<br>',
          '```',
          'bar',
          '```',
          '<br>',
          'baz'
        ].join('\n');

        expect(toMark(html)).toBe(markdown);
      });

      it('table with inline elements', () => {
        const html = [
          'foo',
          '<br>', // Generated when a line break occurs after an inline element.
          '<br>',
          '<table><thead><tr><th>bar</th></tr></thead><tbody><tr><td>baz</td></tr></tbody></table>',
          '<br>',
          'qux'
        ].join('');
        const markdown = [
          'foo',
          '<br>',
          '| bar |',
          '| --- |',
          '| baz |',
          '<br>',
          'qux'
        ].join('\n');

        expect(toMark(html)).toBe(markdown);
      });

      it('list with inline elements', () => {
        let html = [
          'foo',
          '<br>', // Generated when a line break occurs after an inline element.
          '<br>',
          '<ul><li>bar</li><li>baz</li></ul>',
          '<br>',
          'qux'
        ].join('');
        let markdown = [
          'foo',
          '<br>',
          '* bar',
          '* baz',
          // If <br> immediately follows the list, the next element is indented.
          // So empty line(below '') must be maintained.
          '',
          '<br>',
          'qux'
        ].join('\n');

        expect(toMark(html)).toBe(markdown);

        html = [
          'foo',
          '<br>', // Generated when a line break occurs after an inline element.
          '<br>',
          '<ol><li>bar</li><li>baz</li></ol>',
          '<br>',
          'qux'
        ].join('');
        markdown = [
          'foo',
          '<br>',
          '1. bar',
          '2. baz',
          // If <br> immediately follows the list, the next element is indented.
          // So empty line(below '') must be maintained.
          '',
          '<br>',
          'qux'
        ].join('\n');

        expect(toMark(html)).toBe(markdown);
      });

      it('blockquote with inline elements', () => {
        const html = [
          'foo',
          '<br>', // Generated when a line break occurs after an inline element.
          '<br>',
          '<blockquote>bar</blockquote>',
          '<br>',
          'baz'
        ].join('');
        const markdown = [
          'foo',
          '<br>',
          '> bar',
          // If <br> immediately follows the blockquote, the next element is indented.
          // So empty line(below '') must be maintained.
          '',
          '<br>',
          'baz'
        ].join('\n');

        expect(toMark(html)).toBe(markdown);
      });

      it('between block elements.', () => {
        const html = [
          '<h1>foo</h1>',
          '<br>',
          '<pre><code>bar</code></pre>',
          '<br>',
          '<table><thead><tr><th>bar</th></tr></thead><tbody><tr><td>baz</td></tr></tbody></table>',
          '<br>',
          '<ol><li>bar</li><li>baz</li></ol>',
          '<br>',
          '<blockquote>bar</blockquote>'
        ].join('');
        const markdown = [
          '# foo',
          '<br>',
          '```',
          'bar',
          '```',
          '<br>',
          '| bar |',
          '| --- |',
          '| baz |',
          '<br>',
          '1. bar',
          '2. baz',
          '',
          '<br>',
          '> bar'
        ].join('\n');

        expect(toMark(html)).toBe(markdown);
      });
    });

    describe('should not convert <strong>,<b> to **', () => {
      it('if preceded by normal text and first child is an element', () => {
        // b
        expect(toMark('a<b><code>c</code>b</b>')).toEqual('a<b>`c`b</b>');
        expect(toMark('a<b><del>c</del>b</b>')).toEqual('a<b>~~c~~b</b>');
        expect(toMark('a<b><span>c</span>b</b>')).toEqual('a<b><span>c</span>b</b>');

        // strong
        expect(toMark('a<strong><code>c</code>b</strong>')).toEqual('a<strong>`c`b</strong>');
        expect(toMark('a<strong><del>c</del>b</strong>')).toEqual('a<strong>~~c~~b</strong>');
        expect(toMark('a<strong><span>c</span>b</strong>')).toEqual('a<strong><span>c</span>b</strong>');

        // should convert if an opening is not preceded by normal text
        expect(toMark('<b><code>c</code>b</b>')).toEqual('**`c`b**');
        expect(toMark('<strong><code>c</code>b</strong>')).toEqual('**`c`b**');
      });

      it('if followed by normal text and last child is an element', () => {
        // b
        expect(toMark('<b>b<code>c</code></b>a')).toEqual('<b>b`c`</b>a');
        expect(toMark('<b>b<del>c</del></b>a')).toEqual('<b>b~~c~~</b>a');
        expect(toMark('<b>b<span>c</span></b>a')).toEqual('<b>b<span>c</span></b>a');

        // strong
        expect(toMark('<strong>b<code>c</code></strong>a')).toEqual('<strong>b`c`</strong>a');
        expect(toMark('<strong>b<del>c</del></strong>a')).toEqual('<strong>b~~c~~</strong>a');
        expect(toMark('<strong>b<span>c</span></strong>a')).toEqual('<strong>b<span>c</span></strong>a');

        // should convert if a closing tag is not followed by normal text
        expect(toMark('<b>b<code>c</code></b>')).toEqual('**b`c`**');
        expect(toMark('<strong>b<code>c</code></strong>')).toEqual('**b`c`**');
      });
    });

    describe('should not convert <em>,<i> to *', () => {
      it('if preceded by normal text and first child is an element', () => {
        // i
        expect(toMark('a<i><code>c</code>b</i>')).toEqual('a<i>`c`b</i>');
        expect(toMark('a<i><del>c</del>b</i>')).toEqual('a<i>~~c~~b</i>');
        expect(toMark('a<i><span>c</span>b</i>')).toEqual('a<i><span>c</span>b</i>');

        // em
        expect(toMark('a<em><code>c</code>b</em>')).toEqual('a<em>`c`b</em>');
        expect(toMark('a<em><del>c</del>b</em>')).toEqual('a<em>~~c~~b</em>');
        expect(toMark('a<em><span>c</span>b</em>')).toEqual('a<em><span>c</span>b</em>');

        // should convert if an opening tag is not preceded by normal text
        expect(toMark('<i><code>c</code>b</i>')).toEqual('*`c`b*');
        expect(toMark('<em><code>c</code>b</em>')).toEqual('*`c`b*');
      });

      it('if followed by normal text and last child is an element', () => {
        // i
        expect(toMark('<i>b<code>c</code></i>a')).toEqual('<i>b`c`</i>a');
        expect(toMark('<i>b<del>c</del></i>a')).toEqual('<i>b~~c~~</i>a');
        expect(toMark('<i>b<span>c</span></i>a')).toEqual('<i>b<span>c</span></i>a');

        // em
        expect(toMark('<em>b<code>c</code></em>a')).toEqual('<em>b`c`</em>a');
        expect(toMark('<em>b<del>c</del></em>a')).toEqual('<em>b~~c~~</em>a');
        expect(toMark('<em>b<span>c</span></em>a')).toEqual('<em>b<span>c</span></em>a');

        // should convert if a closing tag is not followed by normal text
        expect(toMark('<i>b<code>c</code></i>')).toEqual('*b`c`*');
        expect(toMark('<em>b<code>c</code></em>')).toEqual('*b`c`*');
      });
    });
  });

  describe('event', () => {
    it('convertorAfterMarkdownToHtmlConverted event fired after html convert', () => {
      let param;

      em.listen('convertorAfterMarkdownToHtmlConverted', data => {
        param = data;
      });

      convertor.toHTML('# HELLO WORLD');

      expect(param).toEqual('<h1>HELLO WORLD</h1>\n');
    });

    it('convertorAfterHtmlToMarkdownConverted event fired after markdown convert', () => {
      let param;

      em.listen('convertorAfterHtmlToMarkdownConverted', data => {
        param = data;
      });

      convertor.toMarkdown('<h1 id="hello-world">HELLO WORLD</h1>');

      expect(param).toEqual('# HELLO WORLD');
    });
  });

  describe('should not convert to', () => {
    it('code in list', () => {
      const markdown = [
        '*    codeblock',
        '',
        '1.    codeblock',
        '',
        'paragraph',
        '',
        '    code',
        '    block'
      ].join('\n');
      const expectedMarkdown = [
        '* codeblock',
        '',
        '1. codeblock',
        '',
        'paragraph',
        '',
        '```',
        'code',
        'block',
        '```'
      ].join('\n');
      const expectedHTML = [
        '<ul>',
        '<li>codeblock</li>',
        '</ul>',
        '<ol>',
        '<li>codeblock</li>',
        '</ol>',
        '<p>paragraph</p>',
        '<pre><code>code',
        'block</code></pre>',
        ''
      ].join('\n');

      const result = convertor.toHTML(markdown);

      expect(result).toEqual(expectedHTML);
      expect(convertor.toMarkdown(result)).toEqual(expectedMarkdown);
    });

    it('blockquote in list', () => {
      const markdown = [
        '* > blockquote',
        '',
        '1. > blockquote',
        '',
        'paragraph',
        '',
        '> blockquote'
      ].join('\n');
      const html = [
        '<ul>',
        '<li>&gt; blockquote</li>',
        '</ul>',
        '<ol>',
        '<li>&gt; blockquote</li>',
        '</ol>',
        '<p>paragraph</p>',
        '<blockquote>',
        '<p>blockquote</p>',
        '</blockquote>',
        ''
      ].join('\n');
      const resultMarkdown = [
        '* \\> blockquote',
        '',
        '1. \\> blockquote',
        '',
        'paragraph',
        '',
        '> blockquote'
      ].join('\n');

      const result = convertor.toHTML(markdown);

      expect(result).toEqual(html);
      expect(convertor.toMarkdown(convertor.toHTML(markdown))).toEqual(resultMarkdown);
    });

    it('< & > in codeblock', () => {
      const markdown = [
        '```',
        '<span>',
        '```'
      ].join('\n');
      const html = [
        '<pre><code>&lt;span&gt;',
        '</code></pre>',
        ''
      ].join('\n');
      const resultMarkdown = [
        '```',
        '<span>',
        '',
        '```'
      ].join('\n');

      expect(convertor.toHTML(markdown)).toEqual(html);
      expect(convertor.toMarkdown(html)).toEqual(resultMarkdown);
    });

    it('raw table element in markdown', () => {
      const markdown = [
        '<table><tbody>',
        '<tr><td>123</td></tr>',
        '<tr><td>123</td></tr>',
        '</tbody></table>'
      ].join('');

      const html = [
        '<table data-tomark-pass=""><tbody data-tomark-pass="">',
        '<tr data-tomark-pass=""><td data-tomark-pass="">123</td></tr>',
        '<tr data-tomark-pass=""><td data-tomark-pass="">123</td></tr>',
        '</tbody></table>'
      ].join('');

      expect(convertor.toHTML(markdown)).toEqual(html);
      expect(convertor.toMarkdown(html)).toEqual(markdown);
    });

    it('raw ul element in markdown', () => {
      const markdown = '<ul><li>123</li><li>123</li></ul>';
      const html = '<ul data-tomark-pass=""><li data-tomark-pass="">123</li><li data-tomark-pass="">123</li></ul>';

      expect(convertor.toHTML(markdown)).toEqual(html);
      expect(convertor.toMarkdown(html)).toEqual(markdown);
    });
  });

  describe('should not insert data-tomark-pass', () => {
    it('when <> include korean', () => {
      const markdown = '<AS 안내>';
      const html = '<p>&lt;AS 안내&gt;</p>';

      expect(convertor.toHTML(markdown).replace('\n', '')).toEqual(html);
    });

    it('when < start with backslash', () => {
      const markdown = '\\<AS>';
      const html = '<p>&lt;AS&gt;</p>';

      expect(convertor.toHTML(markdown).replace('\n', '')).toEqual(html);
    });
  });
});
