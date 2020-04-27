/**
 * @fileoverview test convertor
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import Convertor from '@/convertor';
import EventManager from '@/eventManager';
import toMarkRenderer from '@/toMarkRenderer';
import htmlSanitizer from '@/htmlSanitizer';

describe('Convertor', () => {
  let convertor, em;

  beforeEach(() => {
    em = new EventManager();
    convertor = new Convertor(em);
    convertor.initHtmlSanitizer(htmlSanitizer);
  });

  describe('markdown to html', () => {
    it('converting markdown to html', () => {
      expect(convertor.toHTML('# HELLO WORLD')).toBe('<h1>HELLO WORLD</h1>\n');
      expect(convertor.toHTMLWithCodeHighlight('# HELLO WORLD')).toBe('<h1>HELLO WORLD</h1>\n');
    });

    it('sanitize script tags', () => {
      expect(convertor.toHTML('<script>alert("test");</script>')).toBe('\n');
      expect(convertor.toHTMLWithCodeHighlight('<script>alert("test");</script>')).toBe('\n');
    });

    it('escape vertical bar', () => {
      expect(
        convertor.toHTML('| 1 | 2 |\n| -- | -- |\n| 4\\|5 | 6 |\n').match(/\/td/g).length
      ).toBe(2);
      expect(
        convertor.toHTMLWithCodeHighlight('| 1 | 2 |\n| -- | -- |\n| 3 | 4\\|4 |\n').match(/\/td/g)
          .length
      ).toBe(2);
    });

    it('softbreaks should be converted to <br> tags', () => {
      const markdown = ['1', '2', '3'].join('\n');
      const result = ['<p>1<br>', '2<br>', '3</p>', ''].join('\n');

      expect(convertor.toHTMLWithCodeHighlight(markdown)).toBe(result);
    });

    it('softbreaks preceded by <br> should not be converted to <br> tags', () => {
      const markdown = ['1', '<br/>', '2', '<br />', '3', '<br>', '4'].join('\n');
      const result = ['<p>1<br>', '<br>', '2<br>', '<br>', '3<br>', '<br>', '4</p>', ''].join('\n');

      expect(convertor.toHTMLWithCodeHighlight(markdown)).toBe(result);
    });

    it('Avoid hidden last cell in table', () => {
      expect(convertor.toHTML('first\n\n<br>first\n\n```\nsecond\n\n\nsecond\n```\n\n')).toBe(
        '<p>first</p>\n<p><br data-tomark-pass="">first</p>\n<pre><code>second\n\n\nsecond\n</code></pre>\n'
      );
    });

    xit('do not add line breaks in list before and after image syntax', () => {
      expect(
        convertor
          ._markdownToHtmlWithCodeHighlight(
            '\n* asd![nhn](http://www.nhn.com/)\n- asd![nhn](http://www.nhn.com/)\n1. asd![nhn](http://www.nhn.com/)\n* [ ] asd![nhn](http://www.nhn.com/)\n'
          )
          .match(/\/p/g)
      ).toBe(null);
    });

    it('should store number of backticks in code to data-backticks attribute', () => {
      expect(convertor.toHTML('`code span`').trim()).toBe(
        '<p><code data-backticks="1">code span</code></p>'
      );
      expect(convertor.toHTML('```code span```').trim()).toBe(
        '<p><code data-backticks="3">code span</code></p>'
      );
      expect(convertor.toHTMLWithCodeHighlight('`code span`').trim()).toBe(
        '<p><code data-backticks="1">code span</code></p>'
      );
      expect(convertor.toHTMLWithCodeHighlight('```code span```').trim()).toBe(
        '<p><code data-backticks="3">code span</code></p>'
      );
    });

    it('should store number of backticks in codeblock to data-backtics attribute', () => {
      expect(
        convertor
          .toHTML('```\ncode block\n```')
          .replace(/\n/g, '')
          .trim()
      ).toBe('<pre><code>code block</code></pre>');
      expect(
        convertor
          .toHTML('````\ncode block\n````')
          .replace(/\n/g, '')
          .trim()
      ).toBe('<pre><code data-backticks="4">code block</code></pre>');
    });

    it('should convert blockquote even if there is a line above it (ref #989)', () => {
      expect(convertor.toHTML('text above\n> quote').replace(/\n/g, '')).toBe(
        '<p>text above</p><blockquote><p>quote</p></blockquote>'
      );
    });

    it('should insert data-tomark-pass in html tag', () => {
      const tag = '<table></table>';

      const expectedHTML = '<table data-tomark-pass=""></table>';

      expect(convertor.toHTML(tag).replace(/\n/g, '')).toBe(expectedHTML);
    });

    it('should insert data-tomark-pass in html tag with markdown syntax', () => {
      const tag = [
        '| header | <ul><li>test</li></ul> |',
        '| --- | --- |',
        '| body | <ol><li>test</li><ol><li>test</li></ol></ol> |'
      ].join('\n');

      const expectedHTML = [
        '<table><thead><tr>',
        '<th>header</th>',
        '<th><ul data-tomark-pass=""><li data-tomark-pass="">test</li></ul></th>',
        '</tr></thead>',
        '<tbody><tr>',
        '<td>body</td>',
        '<td><ol data-tomark-pass=""><li data-tomark-pass="">test</li><ol data-tomark-pass=""><li data-tomark-pass="">test</li></ol></ol></td>',
        '</tr></tbody></table>'
      ].join('');

      expect(convertor.toHTML(tag).replace(/\n/g, '')).toBe(expectedHTML);
    });

    it('should insert data-tomark-pass in html tag even if attrubute has slash', () => {
      const imgTag =
        '<img src="https://user-images.githubusercontent.com/1215767/34336735-e7c9c4b0-e99c-11e7-853b-2449b51f0bab.png">';
      const expectedHTML =
        '<img src="https://user-images.githubusercontent.com/1215767/34336735-e7c9c4b0-e99c-11e7-853b-2449b51f0bab.png" data-tomark-pass="">';

      expect(convertor.toHTML(imgTag).replace(/\n/g, '')).toBe(expectedHTML);
    });

    it('should not insert data-tomark-pass in codeblock that has tag', () => {
      const codeBlockMd = '```\n<p>hello</p>\n```';
      const expectedHTML = `<pre><code>&lt;p&gt;hello&lt;/p&gt;</code></pre>`;

      expect(convertor.toHTML(codeBlockMd).replace(/\n/g, '')).toBe(expectedHTML);
    });

    it('should not insert data-tomark-pass in codeblock that has tag with attribute', () => {
      const codeBlockMd = '```\n<p class="test">hello</p>\n```';
      const expectedHTML = `<pre><code>&lt;p class="test"&gt;hello&lt;/p&gt;</code></pre>`;

      expect(convertor.toHTML(codeBlockMd).replace(/\n/g, '')).toBe(expectedHTML);
    });

    it('should not insert data-tomark-pass in codeblock that has tag of empty element.', () => {
      const codeBlockMd = '```\n<br/><br /><input type="text" />\n```';
      const expectedHTML = `<pre><code>&lt;br/&gt;&lt;br /&gt;&lt;input type="text" /&gt;</code></pre>`;

      expect(convertor.toHTML(codeBlockMd).replace(/\n/g, '')).toBe(expectedHTML);
    });

    it('task list item should have data-te-task attr and task-list-item class', () => {
      const taskItemMd = ['- [ ] Task1', '- [x] Task2'].join('\n');
      const expectedHTML = [
        '<ul>',
        '<li class="task-list-item" data-te-task="">Task1</li>',
        '<li class="task-list-item checked" data-te-task="">Task2</li>',
        '</ul>',
        ''
      ].join('\n');

      expect(convertor.toHTML(taskItemMd)).toBe(expectedHTML);
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
      expect(toMark('<h1 id="hello-world">HELLO WORLD</h1>')).toBe('# HELLO WORLD');
    });

    it('should reserve br on multi line breaks', () => {
      expect(toMark('HELLO WORLD<br><br><br>!')).toBe('HELLO WORLD\n\n<br>\n!');
    });

    it('should not reserve br on normal line breaks', () => {
      expect(toMark('HELLO WORLD<br><br>!')).toBe('HELLO WORLD\n\n!');
    });

    it('should not reserve br in codeblock', () => {
      expect(toMark('<pre><code>HELLO WORLD\n\n\n\n\n!</code></pre>')).toBe(
        '```\nHELLO WORLD\n\n\n\n\n!\n```'
      );
    });

    it('should reserve br to inline in table', () => {
      const html =
        '<table>' +
        '<thead><th>1</th><th>2</th><th>3</th></thead>' +
        '<tbody><td>HELLO WORLD<br><br><br><br><br>!</td><td>4</td><td>5</td></tbody>' +
        '</table>';
      const markdown =
        '| 1 | 2 | 3 |\n| --- | --- | --- |\n| HELLO WORLD<br><br><br><br><br>! | 4 | 5 |';

      expect(toMark(html)).toBe(markdown);
    });

    it('should escape html in html text', () => {
      // valid tags
      expect(toMark('im &lt;span&gt; text')).toBe('im \\<span> text');
      expect(toMark('im &lt;span attr="value"&gt; text')).toBe('im \\<span attr="value"> text');
      expect(toMark('im &lt;!-- comment --&gt; text')).toBe('im \\<!-- comment --> text');

      // common mark auto link
      expect(toMark('im &lt;http://google.com&gt; text')).toBe('im \\<http://google.com> text');

      // invalid tags
      expect(toMark('im &lt;\\span&gt; text')).toBe('im <\\span> text');
      expect(toMark('im &lt;/span attr="value"&gt; text')).toBe('im </span attr="value"> text');
    });

    it('should print number of backticks for code according to data-backticks attribute', () => {
      expect(toMark('<code data-backticks="1">code span</code>').trim()).toBe('`code span`');
      expect(toMark('<code data-backticks="3">code span</code>').trim()).toBe('```code span```');
    });

    it('should print number of backticks for code block according to data-backticks attribute', () => {
      expect(toMark('<pre><code>code block</code></pre>').trim()).toBe('```\ncode block\n```');
      expect(toMark('<pre><code data-backticks="4">code block</code></pre>').trim()).toBe(
        '````\ncode block\n````'
      );
    });

    it('should treat $ special characters', () => {
      expect(toMark('<span>,;:$&+=</span>').trim()).toBe('<span>,;:$&+=</span>');
    });

    it('should convert BRs to newline', () => {
      expect(toMark('text<br><br>text')).toBe('text\n\ntext');
      expect(toMark('<b>text</b><br><br>text')).toBe('**text**\n\ntext');
      expect(toMark('<i>text</i><br><br>text')).toBe('*text*\n\ntext');
      expect(toMark('<s>text</s><br><br>text')).toBe('~~text~~\n\ntext');
      expect(toMark('<code>text</code><br><br>text')).toBe('`text`\n\ntext');
      expect(toMark('<a href="some_url">text</a><br><br>text')).toBe('[text](some_url)\n\ntext');
      expect(toMark('<span>text</span><br><br>text')).toBe('<span>text</span>\n\ntext');
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

        const markdown = ['foo', '<br>', '# bar', '<br>', 'baz'].join('\n');

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
        const markdown = ['foo', '<br>', '```', 'bar', '```', '<br>', 'baz'].join('\n');

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
        const markdown = ['foo', '<br>', '| bar |', '| --- |', '| baz |', '<br>', 'qux'].join('\n');

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

      it('between list elements of the same type.', () => {
        const html = [
          '<ul><li>foo<ul><li>bar<ul><li>baz</li></ul></li></ul></li></ul>',
          '<br>',
          '<ul><li>foo</li><li>bar</li></ul>',
          '<br>',
          '<ul><li class="task-list-item">foo</li><li class="task-list-item">bar</li></ul>'
        ].join('');
        const markdown = [
          '* foo',
          '    * bar',
          '        * baz',
          '',
          '<br>',
          '* foo',
          '* bar',
          '',
          '<br>',
          '* [ ] foo',
          '* [ ] bar'
        ].join('\n');

        expect(toMark(html)).toBe(markdown);
      });

      it('between list elements of different types.', () => {
        const html = [
          '<ul><li>foo<ul><li>bar<ul><li>baz</li></ul></li></ul></li></ul>',
          '<br>',
          '<ol><li>foo</li><li>bar</li></ol>',
          '<br>',
          '<ul><li class="task-list-item">foo</li><li class="task-list-item">bar</li></ul>'
        ].join('');
        const markdown = [
          '* foo',
          '    * bar',
          '        * baz',
          '',
          '<br>',
          '1. foo',
          '2. bar',
          '',
          '<br>',
          '* [ ] foo',
          '* [ ] bar'
        ].join('\n');

        expect(toMark(html)).toBe(markdown);
      });

      it('brs in front of table and cell has brs', () => {
        const html = [
          '<br>',
          '<br>',
          '<table><thead><tr><th>foo<br>bar</th></tr></thead><tbody><tr><td>baz<br>qux</td></tr></tbody></table>'
        ].join('');
        const markdown = ['<br>', '<br>', '| foo<br>bar |', '| ------ |', '| baz<br>qux |'].join(
          '\n'
        );

        expect(toMark(html)).toBe(markdown);
      });

      it('prevent a tag in link from changing markdown syntax', () => {
        const link = '![foo](<a href="http://link.to">http://link.to</a>)';

        expect(convertor.toMarkdown(link)).toBe(link);
      });
    });

    describe('should not convert <b>, <strong> to **', () => {
      it('if preceded by normal text and first child is an element', () => {
        // b
        expect(toMark('a<b><code>c</code>b</b>')).toBe('a<b>`c`b</b>');
        expect(toMark('a<b><del>c</del>b</b>')).toBe('a<b>~~c~~b</b>');
        expect(toMark('a<b><span>c</span>b</b>')).toBe('a<b><span>c</span>b</b>');

        // strong
        expect(toMark('a<strong><code>c</code>b</strong>')).toBe('a<strong>`c`b</strong>');
        expect(toMark('a<strong><del>c</del>b</strong>')).toBe('a<strong>~~c~~b</strong>');
        expect(toMark('a<strong><span>c</span>b</strong>')).toBe(
          'a<strong><span>c</span>b</strong>'
        );

        // should convert if an opening is not preceded by normal text
        expect(toMark('<b><code>c</code>b</b>')).toBe('**`c`b**');
        expect(toMark('<strong><code>c</code>b</strong>')).toBe('**`c`b**');
      });

      it('if followed by normal text and last child is an element', () => {
        // b
        expect(toMark('<b>b<code>c</code></b>a')).toBe('<b>b`c`</b>a');
        expect(toMark('<b>b<del>c</del></b>a')).toBe('<b>b~~c~~</b>a');
        expect(toMark('<b>b<span>c</span></b>a')).toBe('<b>b<span>c</span></b>a');

        // strong
        expect(toMark('<strong>b<code>c</code></strong>a')).toBe('<strong>b`c`</strong>a');
        expect(toMark('<strong>b<del>c</del></strong>a')).toBe('<strong>b~~c~~</strong>a');
        expect(toMark('<strong>b<span>c</span></strong>a')).toBe(
          '<strong>b<span>c</span></strong>a'
        );

        // should convert if a closing tag is not followed by normal text
        expect(toMark('<b>b<code>c</code></b>')).toBe('**b`c`**');
        expect(toMark('<strong>b<code>c</code></strong>')).toBe('**b`c`**');
      });
    });

    describe('should not convert <i>, <em> to *', () => {
      it('if preceded by normal text and first child is an element', () => {
        // i
        expect(toMark('a<i><code>c</code>b</i>')).toBe('a<i>`c`b</i>');
        expect(toMark('a<i><del>c</del>b</i>')).toBe('a<i>~~c~~b</i>');
        expect(toMark('a<i><span>c</span>b</i>')).toBe('a<i><span>c</span>b</i>');

        // em
        expect(toMark('a<em><code>c</code>b</em>')).toBe('a<em>`c`b</em>');
        expect(toMark('a<em><del>c</del>b</em>')).toBe('a<em>~~c~~b</em>');
        expect(toMark('a<em><span>c</span>b</em>')).toBe('a<em><span>c</span>b</em>');

        // should convert if an opening tag is not preceded by normal text
        expect(toMark('<i><code>c</code>b</i>')).toBe('*`c`b*');
        expect(toMark('<em><code>c</code>b</em>')).toBe('*`c`b*');
      });

      it('if followed by normal text and last child is an element', () => {
        // i
        expect(toMark('<i>b<code>c</code></i>a')).toBe('<i>b`c`</i>a');
        expect(toMark('<i>b<del>c</del></i>a')).toBe('<i>b~~c~~</i>a');
        expect(toMark('<i>b<span>c</span></i>a')).toBe('<i>b<span>c</span></i>a');

        // em
        expect(toMark('<em>b<code>c</code></em>a')).toBe('<em>b`c`</em>a');
        expect(toMark('<em>b<del>c</del></em>a')).toBe('<em>b~~c~~</em>a');
        expect(toMark('<em>b<span>c</span></em>a')).toBe('<em>b<span>c</span></em>a');

        // should convert if a closing tag is not followed by normal text
        expect(toMark('<i>b<code>c</code></i>')).toBe('*b`c`*');
        expect(toMark('<em>b<code>c</code></em>')).toBe('*b`c`*');
      });
    });

    describe('should not convert <s>, <del> to ~~', () => {
      it('if preceded by normal text and first child is an element', () => {
        // s
        expect(toMark('a<s><code>c</code>b</s>')).toBe('a<s>`c`b</s>');
        expect(toMark('a<s><b>c</b>b</s>')).toBe('a<s>**c**b</s>');
        expect(toMark('a<s><span>c</span>b</s>')).toBe('a<s><span>c</span>b</s>');

        // del
        expect(toMark('a<del><code>c</code>b</del>')).toBe('a<del>`c`b</del>');
        expect(toMark('a<del><strong>c</strong>b</del>')).toBe('a<del>**c**b</del>');
        expect(toMark('a<del><span>c</span>b</del>')).toBe('a<del><span>c</span>b</del>');

        // should convert if an opening tag is not preceded by normal text
        expect(toMark('<s><code>c</code>b</s>')).toBe('~~`c`b~~');
        expect(toMark('<del><code>c</code>b</del>')).toBe('~~`c`b~~');
      });

      it('if followed by normal text and last child is an element', () => {
        // s
        expect(toMark('<s>b<code>c</code></s>a')).toBe('<s>b`c`</s>a');
        expect(toMark('<s>b<b>c</b></s>a')).toBe('<s>b**c**</s>a');
        expect(toMark('<s>b<span>c</span></s>a')).toBe('<s>b<span>c</span></s>a');

        // del
        expect(toMark('<del>b<code>c</code></del>a')).toBe('<del>b`c`</del>a');
        expect(toMark('<del>b<strong>c</strong></del>a')).toBe('<del>b**c**</del>a');
        expect(toMark('<del>b<span>c</span></del>a')).toBe('<del>b<span>c</span></del>a');

        // should convert if a closing tag is not followed by normal text
        expect(toMark('<s>b<code>c</code></s>')).toBe('~~b`c`~~');
        expect(toMark('<del>b<code>c</code></del>')).toBe('~~b`c`~~');
      });
    });

    describe('should move spaces out of the tag when there are spaces between the text and the tag', () => {
      it('if there are spaces between the opening tag and the text', () => {
        // bold
        expect(toMark('foo<b>&nbsp; &nbsp;bar</b>baz')).toBe('foo\u00a0 \u00a0**bar**baz');
        expect(toMark('foo<strong>&nbsp; &nbsp;bar</strong>baz')).toBe(
          'foo\u00a0 \u00a0**bar**baz'
        );

        // italic
        expect(toMark('foo<i>&nbsp; &nbsp;bar</i>baz')).toBe('foo\u00a0 \u00a0*bar*baz');
        expect(toMark('foo<em>&nbsp; &nbsp;bar</em>baz')).toBe('foo\u00a0 \u00a0*bar*baz');

        // strike
        expect(toMark('foo<s>&nbsp; &nbsp;bar</s>baz')).toBe('foo\u00a0 \u00a0~~bar~~baz');
        expect(toMark('foo<del>&nbsp; &nbsp;bar</del>baz')).toBe('foo\u00a0 \u00a0~~bar~~baz');
      });

      it('if there are spaces between the text and the closing tag', () => {
        // bold
        expect(toMark('foo<b>bar&nbsp; &nbsp;</b>baz')).toBe('foo**bar**\u00a0 \u00a0baz');
        expect(toMark('foo<strong>bar&nbsp; &nbsp;</strong>baz')).toBe(
          'foo**bar**\u00a0 \u00a0baz'
        );

        // italic
        expect(toMark('foo<i>bar&nbsp; &nbsp;</i>baz')).toBe('foo*bar*\u00a0 \u00a0baz');
        expect(toMark('foo<em>bar&nbsp; &nbsp;</em>baz')).toBe('foo*bar*\u00a0 \u00a0baz');

        // strike
        expect(toMark('foo<s>bar&nbsp; &nbsp;</s>baz')).toBe('foo~~bar~~\u00a0 \u00a0baz');
        expect(toMark('foo<del>bar&nbsp; &nbsp;</del>baz')).toBe('foo~~bar~~\u00a0 \u00a0baz');
      });

      it('if text has newlines', () => {
        expect(toMark('foo<b>bar\nbaz&nbsp;</b>qux')).toBe('foo**bar\nbaz**\u00a0qux');
        expect(toMark('foo<i>&nbsp;bar\nbaz&nbsp;</i>qux')).toBe('foo\u00a0*bar\nbaz*\u00a0qux');
        expect(toMark('foo<s>&nbsp;bar&nbsp;\nbaz&nbsp;qux&nbsp;</s>quxx')).toBe(
          'foo\u00a0~~bar\u00a0\nbaz\u00a0qux~~\u00a0quxx'
        );
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

      expect(param).toBe('<h1>HELLO WORLD</h1>\n');
    });

    it('convertorAfterHtmlToMarkdownConverted event fired after markdown convert', () => {
      let param;

      em.listen('convertorAfterHtmlToMarkdownConverted', data => {
        param = data;
      });

      convertor.toMarkdown('<h1 id="hello-world">HELLO WORLD</h1>');

      expect(param).toBe('# HELLO WORLD');
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
        '',
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
        'block',
        '</code></pre>',
        ''
      ].join('\n');

      const result = convertor.toHTML(markdown);

      expect(result).toBe(expectedHTML);
      expect(convertor.toMarkdown(result)).toBe(expectedMarkdown);
    });

    it('< & > in codeblock', () => {
      const markdown = ['```', '<span>', '```'].join('\n');
      const html = ['<pre><code>&lt;span&gt;', '</code></pre>', ''].join('\n');
      const resultMarkdown = ['```', '<span>', '', '```'].join('\n');

      expect(convertor.toHTML(markdown)).toBe(html);
      expect(convertor.toMarkdown(html)).toBe(resultMarkdown);
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
        '</tbody></table>\n'
      ].join('');

      expect(convertor.toHTML(markdown)).toBe(html);
      expect(convertor.toMarkdown(html)).toBe(markdown);
    });

    it('raw ul element in markdown', () => {
      const markdown = '<ul><li>123</li><li>123</li></ul>';
      const html =
        '<ul data-tomark-pass=""><li data-tomark-pass="">123</li><li data-tomark-pass="">123</li></ul>\n';

      expect(convertor.toHTML(markdown)).toBe(html);
      expect(convertor.toMarkdown(html)).toBe(markdown);
    });
  });

  describe('should not insert data-tomark-pass', () => {
    it('when <> include korean', () => {
      const markdown = '<AS 안내>';
      const html = '<p>&lt;AS 안내&gt;</p>';

      expect(convertor.toHTML(markdown).replace('\n', '')).toBe(html);
    });

    it('when < start with backslash', () => {
      const markdown = '\\<AS>';
      const html = '<p>&lt;AS&gt;</p>';

      expect(convertor.toHTML(markdown).replace('\n', '')).toBe(html);
    });
  });
});
